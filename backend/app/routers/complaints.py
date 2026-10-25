import re
from datetime import datetime
from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, model_validator

from pipeline import hold_proposals, orchestrator

from .. import jobs
from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import Page, get_conn, page, pipeline_conn, utcnow
from ..masking import mask, mask_text, require_access, scope, visible_complaint

router = APIRouter(prefix="/complaints", tags=["complaints"])

# app-filed ids start above the seeder's C-3001 range
APP_ID_FLOOR = 9000


class PaymentIn(BaseModel):
    amount: Decimal = Field(gt=0)
    paid_at: datetime | None = None
    destination_type: Literal["bank", "crypto"] = "bank"
    utr: str | None = None
    paid_to_upi_id: str | None = None
    paid_to_account_no: str | None = None
    paid_to_account_id: str | None = None
    crypto_chain: str | None = None
    crypto_asset: str | None = None
    wallet_address: str | None = None
    exchange_name: str | None = None
    crypto_tx_hash: str | None = None

    @model_validator(mode="after")
    def _crypto_needs_wallet(self):
        if self.destination_type == "crypto" and not self.wallet_address:
            raise ValueError("wallet_address is required for a crypto payment")
        return self


class ComplaintIn(BaseModel):
    name: str = Field(min_length=1)
    email_1: str | None = None
    email_2: str | None = None
    phone_1: str | None = None
    phone_2: str | None = None
    city: str | None = None
    victim_account_id: str | None = None
    victim_upi_id: str | None = None
    scam_type: str = Field(min_length=1)
    incident_description: str | None = None
    total_lost: Decimal | None = Field(default=None, gt=0)
    fraud_time: datetime
    reported_at: datetime | None = None
    channel: Literal["helpline_1930", "ncrp_portal", "bank", "walk_in", "feed"] = "ncrp_portal"
    scammer_phone: str | None = None
    scammer_upi_id: str | None = None
    scammer_account_no: str | None = None
    owner_user_id: str | None = None
    payments: list[PaymentIn] = []


ACCOUNT = re.compile(r"^([A-Z]{2,10})[\s:\-_/.]*((?=[A-Z0-9]*\d)[A-Z0-9]{1,24})$")
MIN_ACCOUNT_DIGITS = 8


def clean_account(conn, raw: str | None) -> str | None:
    """'icici 876296367481', 'ICICI-876296367481' and 'ICICI:876296367481' are all ICICI:876296367481; anything else is refused."""
    text = (raw or "").strip().upper().replace(" BANK ", " ")
    if not text:
        return None
    found = ACCOUNT.match(text)
    if not found:
        raise HTTPException(422, "The account must be the bank and the full number, like ICICI:876296367481")
    bank, number = found.groups()
    known = conn.execute("SELECT id FROM banks WHERE id = %s OR ifsc_prefix = %s", (bank, bank)).fetchone()
    if known is None:
        raise HTTPException(422, f"Unknown bank '{bank}'. Use the bank code, like ICICI:876296367481")
    bank = known["id"]
    if len(number) < MIN_ACCOUNT_DIGITS:
        raise HTTPException(422, f"'{number}' is too short to be a full account number ({len(number)} characters)")
    return f"{bank}:{number}"


_FILED_VIA = {"officer": "officer", "bank_analyst": "bank", "bank_admin": "bank", "consumer": "self"}


@router.get("")
def list_complaints(status: Literal["open", "tracing", "actioned", "closed"] | None = None,
                    pg: Page = Depends(page), user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "complaints")
    pred, params = scope(user, "complaint")
    rows = conn.execute(
        f"""SELECT c.* FROM complaints c
            WHERE {pred} AND (%(status)s::text IS NULL OR c.status = %(status)s)
            ORDER BY c.reported_at DESC, c.id LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "status": status, "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "complaint", rows)


@router.get("/{complaint_id}")
def get_complaint(complaint_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "complaints")
    row = visible_complaint(conn, user, complaint_id)
    if row is None:
        raise HTTPException(404, "complaint not found")
    return mask(user, "complaint", row)


@router.get("/{complaint_id}/payments")
def complaint_payments(complaint_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "complaints")
    if visible_complaint(conn, user, complaint_id) is None:
        raise HTTPException(404, "complaint not found")
    rows = conn.execute("SELECT * FROM complaint_payments WHERE complaint_id = %s ORDER BY paid_at, id",
                        (complaint_id,)).fetchall()
    return mask(user, "payment", rows)


@router.get("/{complaint_id}/trail")
def complaint_trail(complaint_id: str, method: Literal["fifo", "lifo", "prorata"] = Query("fifo"),
                    user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "complaints")
    if visible_complaint(conn, user, complaint_id) is None:
        raise HTTPException(404, "complaint not found")
    rows = conn.execute(
        """SELECT vm.id, vm.complaint_id, vm.transfer_id, vm.method, vm.hop, vm.leg, vm.from_ref, vm.to_ref,
                  vm.from_bank, vm.to_bank, vm.traced_amount, vm.asset, vm.asset_amount, vm.status, vm.traced_at,
                  t.ts, t.rail, t.utr, t.amount AS transfer_amount
           FROM victim_mapping vm JOIN transfers t ON t.transfer_id = vm.transfer_id
           WHERE vm.complaint_id = %s AND vm.method = %s
           ORDER BY vm.hop, t.ts, vm.id""", (complaint_id, method)).fetchall()
    return mask(user, "trail", rows)


def saved_outcome(conn, complaint_id: str) -> dict | None:
    """What the audit log says about the latest trace, for when this process has not run it (restart, other instance)."""
    row = conn.execute("SELECT text FROM audit_log WHERE complaint_id = %s AND kind = 'TRACE' ORDER BY seq DESC LIMIT 1",
                       (complaint_id,)).fetchone()
    found = re.search(r" (failed|had problems): (.+)$", row["text"]) if row else None
    if not found:
        return None
    return {"error": found[2], "failures": []} if found[1] == "failed" else {"error": None, "failures": [found[2]]}


def trace_status(conn, user: User, row: dict) -> dict:
    """Where this complaint's trace stands: running, done, no_data, failed, waiting, not_started or not_configured."""
    cid = row["id"]
    rows = conn.execute("SELECT count(*) AS n FROM victim_mapping WHERE complaint_id = %s AND method = 'fifo'", (cid,)).fetchone()["n"]
    last = jobs.RESULTS.get(cid) or saved_outcome(conn, cid)
    busy = cid in jobs.RUNNING
    if not busy:  # a run started by the periodic job or another instance holds the same lock
        got = conn.execute("SELECT pg_try_advisory_lock(%s, hashtext(%s)) AS got", (orchestrator.LOCK_KEY, cid)).fetchone()["got"]
        if got:
            conn.execute("SELECT pg_advisory_unlock(%s, hashtext(%s))", (orchestrator.LOCK_KEY, cid))
        else:
            busy = True
    enabled, message = jobs.enabled(), None
    if busy:
        state = "running"
    elif not enabled:
        state = "done" if rows else "not_configured"
        message = None if rows else "Tracing is switched off on this server."
    elif last and last["error"]:
        state = "failed"
        message = "The trace failed. Please re-run it." if user.is_consumer else last["error"]
    elif rows:
        state = "done"
    elif row["last_traced_at"] or last:
        state = "no_data"
        message = (last["failures"][0] if last and last["failures"] else None) or "No matching payment or trail was found in the bank data."
        if user.is_consumer:
            message = "We could not find this payment in the bank data. Check the account and the reference number, then re-run."
    else:
        state = "waiting" if (jobs.now() - row["reported_at"]).total_seconds() < 120 else "not_started"
        message = None if state == "waiting" else "The trace never started."
    return {"state": state, "rows": rows, "message": mask_text(user, message), "last_traced_at": row["last_traced_at"],
            "can_rerun": enabled and state != "running"}


@router.get("/{complaint_id}/trace")
def complaint_trace(complaint_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "complaints")
    row = visible_complaint(conn, user, complaint_id)
    if row is None:
        raise HTTPException(404, "complaint not found")
    return trace_status(conn, user, row)


@router.post("/{complaint_id}/retrace", status_code=202)
def retrace_complaint(complaint_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    """Run the trace again for a complaint you can see: the victim, the bank involved, or the officer."""
    require_access(user, "complaints")
    row = visible_complaint(conn, user, complaint_id)
    if row is None:
        raise HTTPException(404, "complaint not found")
    if not jobs.enabled():
        raise HTTPException(503, "Tracing is switched off on this server (BANK_DATABASE_URL is not set)")
    if trace_status(conn, user, row)["state"] == "running":
        raise HTTPException(409, "A trace is already running for this complaint")
    jobs.RESULTS.pop(complaint_id, None)
    write_audit(conn, user.id, "TRACE", f"{complaint_id} trace re-run requested by {user.name}", complaint_id)
    conn.commit()
    if not jobs.start_trace(complaint_id):
        raise HTTPException(409, "A trace is already running for this complaint")
    return {"state": "running"}


@router.get("/{complaint_id}/hold-proposals")
def complaint_hold_proposals(complaint_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "holds")
    if not user.can_write:
        raise HTTPException(403, "view-only access cannot see hold proposals")
    if visible_complaint(conn, user, complaint_id) is None:
        raise HTTPException(404, "complaint not found")
    with pipeline_conn() as plain:
        found = hold_proposals.proposals(plain, complaint_id)
    return mask(user, "proposal", [p for p in found if user.is_officer or p["bank_id"] == user.bank_id])


@router.post("", status_code=201)
def file_complaint(body: ComplaintIn, user: User = Depends(current_user), conn=Depends(get_conn)):
    total = body.total_lost or sum((p.amount for p in body.payments), Decimal(0))
    if total <= 0:
        raise HTTPException(422, "total_lost or at least one payment is required")

    if user.is_consumer:
        owner = user.id
    else:
        owner = body.owner_user_id
        if owner and conn.execute("SELECT 1 FROM app_users WHERE id = %s AND role = 'consumer'",
                                  (owner,)).fetchone() is None:
            raise HTTPException(422, "owner_user_id must be a consumer user")
    body.victim_account_id = clean_account(conn, body.victim_account_id)
    if user.is_bank and body.victim_account_id and body.victim_account_id.partition(":")[0] != user.bank_id:
        raise HTTPException(403, "a bank can only file for its own customers' accounts")

    conn.execute("SELECT pg_advisory_xact_lock(hashtext('complaint_id'))")
    n = conn.execute("""SELECT GREATEST(COALESCE(MAX(substr(id, 3)::int), 0), %s) + 1 AS n
                        FROM complaints WHERE id ~ '^C-[0-9]{1,9}$'""", (APP_ID_FLOOR,)).fetchone()["n"]
    cid = f"C-{n}"
    reported_at = body.reported_at or utcnow()
    row = conn.execute(
        """INSERT INTO complaints (id, channel, name, email_1, email_2, phone_1, phone_2, city, victim_account_id,
               victim_upi_id, scam_type, incident_description, total_lost, fraud_time, reported_at, scammer_phone,
               scammer_upi_id, scammer_account_no, filed_by, owner_user_id, filed_via)
           VALUES (%(id)s, %(channel)s, %(name)s, %(email_1)s, %(email_2)s, %(phone_1)s, %(phone_2)s, %(city)s,
               %(victim_account_id)s, %(victim_upi_id)s, %(scam_type)s, %(incident_description)s, %(total)s,
               %(fraud_time)s, %(reported_at)s, %(scammer_phone)s, %(scammer_upi_id)s, %(scammer_account_no)s,
               %(filed_by)s, %(owner)s, %(via)s)
           RETURNING *""",
        {**body.model_dump(exclude={"payments", "total_lost", "owner_user_id", "reported_at"}), "id": cid,
         "total": total, "reported_at": reported_at, "filed_by": user.id, "owner": owner,
         "via": _FILED_VIA[user.role]}).fetchone()

    payments = [conn.execute(
        """INSERT INTO complaint_payments (complaint_id, amount, paid_at, destination_type, utr, paid_to_upi_id,
               paid_to_account_no, paid_to_account_id, crypto_chain, crypto_asset, wallet_address, exchange_name,
               crypto_tx_hash)
           VALUES (%(cid)s, %(amount)s, %(paid_at)s, %(destination_type)s, %(utr)s, %(paid_to_upi_id)s,
               %(paid_to_account_no)s, %(paid_to_account_id)s, %(crypto_chain)s, %(crypto_asset)s,
               %(wallet_address)s, %(exchange_name)s, %(crypto_tx_hash)s)
           RETURNING *""", {**p.model_dump(), "cid": cid}).fetchone() for p in body.payments]

    write_audit(conn, user.id, "COMPLAINT",
                f"{cid} filed ({row['filed_via']}) · {body.scam_type} · Rs {total:,.2f} reported lost", cid)
    conn.commit()
    if jobs.enabled():
        jobs.start_trace(cid)
    return {**mask(user, "complaint", row), "payments": mask(user, "payment", payments)}
