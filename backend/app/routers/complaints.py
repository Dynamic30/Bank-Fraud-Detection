from datetime import datetime
from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, model_validator

from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import Page, get_conn, page, utcnow
from ..masking import mask, require_access, scope, visible_complaint

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
    return {**mask(user, "complaint", row), "payments": mask(user, "payment", payments)}
