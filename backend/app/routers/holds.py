from datetime import timedelta
from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from psycopg.errors import UniqueViolation
from pydantic import BaseModel, Field

from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import Page, get_conn, page, utcnow
from ..masking import mask, require_access, scope, visible_complaint

router = APIRouter(prefix="/holds", tags=["holds"])

HOLD_HOURS = 24


class HoldIn(BaseModel):
    account_id: str
    reason: str = Field(min_length=3)
    complaint_id: str | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    score_at_time: Decimal | None = None
    basis: Literal["ai_draft"] | None = None


class DecisionIn(BaseModel):
    note: str | None = None


def expire_holds(conn) -> None:
    rows = conn.execute(
        """UPDATE holds SET status = 'expired'
           WHERE status = 'active' AND expires_at <= %s RETURNING id, account_id, complaint_id""",
        (utcnow(),)).fetchall()
    for r in rows:
        write_audit(conn, "system", "HOLD", f"H-{r['id']} · hold on {r['account_id']} EXPIRED, lifted after "
                    f"{HOLD_HOURS}h without officer confirmation", r["complaint_id"])
    if rows:
        conn.commit()


def require_bank_writer(user: User, bank_id: str) -> None:
    if not (user.is_bank and user.can_write and user.bank_id == bank_id):
        raise HTTPException(403, "needs a bank user with hold or admin access at the account's bank")


def require_executor(user: User, bank_id: str) -> None:
    """The bank places and releases holds; the cyber-cell officer may do it on the bank's behalf."""
    if not user.is_officer:
        require_bank_writer(user, bank_id)


def load_hold(conn, hold_id: int) -> dict:
    row = conn.execute("SELECT * FROM holds WHERE id = %s FOR UPDATE", (hold_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "hold not found")
    return row


def move(conn, user: User, hold: dict, to_status: str, from_states: tuple, verb: str, sets: str = "",
         note: str | None = None, **params) -> dict:
    if hold["status"] not in from_states:
        raise HTTPException(409, f"hold is {hold['status']}, expected {' or '.join(from_states)}")
    extra = f", {sets}" if sets else ""
    row = conn.execute(f"UPDATE holds SET status = %(to)s{extra} WHERE id = %(id)s RETURNING *",
                       {"to": to_status, "id": hold["id"], "uid": user.id, "now": utcnow(), **params}).fetchone()
    write_audit(conn, user.id, "HOLD", f"H-{hold['id']} · {verb} on {hold['account_id']} by {user.name}"
                + (f" · {note}" if note else ""), hold["complaint_id"])
    conn.commit()
    return row


@router.get("")
def list_holds(status: Literal["requested", "active", "confirmed", "expired", "rejected", "released"] | None = None,
               pg: Page = Depends(page), user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "holds")
    expire_holds(conn)
    pred, params = scope(user, "hold")
    rows = conn.execute(
        f"""SELECT h.* FROM holds h
            WHERE {pred} AND (%(status)s::text IS NULL OR h.status = %(status)s)
            ORDER BY h.placed_at DESC, h.id DESC LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "status": status, "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "hold", rows)


@router.post("", status_code=201)
def place_hold(body: HoldIn, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "holds")
    if not user.can_write:
        raise HTTPException(403, "view-only access cannot place holds")
    expire_holds(conn)

    acct = conn.execute("SELECT kind, bank_id FROM accounts WHERE account_id = %s", (body.account_id,)).fetchone()
    if acct is None:
        raise HTTPException(404, "account not found")
    if acct["kind"] != "bank":
        raise HTTPException(422, "holds apply to bank accounts only")
    if user.is_bank:
        require_bank_writer(user, acct["bank_id"])
    if body.complaint_id and visible_complaint(conn, user, body.complaint_id) is None:
        raise HTTPException(404, "complaint not found")
    minimum = conn.execute("SELECT value FROM settings WHERE key = 'hold_min_amount_inr'").fetchone()["value"]
    if body.amount is not None and body.amount < Decimal(str(minimum)):
        raise HTTPException(422, f"hold amount must be at least Rs {minimum}")

    now = utcnow()
    if user.is_officer:
        origin, basis, status, expires, executed_by, executed_at = "officer", "officer_decision", "requested", None, None, None
    else:
        origin, basis, status = "bank", "bank", "active"
        expires, executed_by, executed_at = now + timedelta(hours=HOLD_HOURS), user.id, now
    try:
        row = conn.execute(
            """INSERT INTO holds (account_id, bank_id, complaint_id, origin, basis, status, reason, score_at_time,
                                  amount, placed_by, placed_at, expires_at, executed_by, executed_at)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
            (body.account_id, acct["bank_id"], body.complaint_id, origin, body.basis or basis, status, body.reason,
             body.score_at_time, body.amount, user.id, now, expires, executed_by, executed_at)).fetchone()
    except UniqueViolation:
        conn.rollback()
        raise HTTPException(409, "this account already has an open hold") from None

    verb = "requested for" if status == "requested" else f"placed ({HOLD_HOURS}h) on"
    write_audit(conn, user.id, "HOLD", f"H-{row['id']} · hold {verb} {body.account_id} by {user.name} · {body.reason}",
                body.complaint_id)
    conn.commit()
    return mask(user, "hold", row)


@router.post("/{hold_id}/confirm")
def confirm_hold(hold_id: int, body: DecisionIn | None = None, user: User = Depends(current_user),
                 conn=Depends(get_conn)):
    if not user.is_officer:
        raise HTTPException(403, "only an officer can confirm a hold")
    expire_holds(conn)
    row = move(conn, user, load_hold(conn, hold_id), "confirmed", ("active",), "CONFIRMED",
               "decided_by = %(uid)s, decided_at = %(now)s, expires_at = NULL", body.note if body else None)
    return mask(user, "hold", row)


@router.post("/{hold_id}/reject")
def reject_hold(hold_id: int, body: DecisionIn | None = None, user: User = Depends(current_user),
                conn=Depends(get_conn)):
    if not user.is_officer:
        raise HTTPException(403, "only an officer can reject a hold")
    expire_holds(conn)
    row = move(conn, user, load_hold(conn, hold_id), "rejected", ("requested", "active"), "REJECTED",
               "decided_by = %(uid)s, decided_at = %(now)s", body.note if body else None)
    return mask(user, "hold", row)


@router.post("/{hold_id}/release")
def release_hold(hold_id: int, user: User = Depends(current_user), conn=Depends(get_conn)):
    expire_holds(conn)
    hold = load_hold(conn, hold_id)
    require_executor(user, hold["bank_id"])
    return mask(user, "hold", move(conn, user, hold, "released", ("requested", "active", "confirmed"), "RELEASED"))


@router.post("/{hold_id}/execute")
def execute_hold(hold_id: int, user: User = Depends(current_user), conn=Depends(get_conn)):
    expire_holds(conn)
    hold = load_hold(conn, hold_id)
    require_executor(user, hold["bank_id"])
    row = move(conn, user, hold, "active", ("requested",), "EXECUTED",
               "executed_by = %(uid)s, executed_at = %(now)s, expires_at = %(exp)s",
               exp=utcnow() + timedelta(hours=HOLD_HOURS))
    return mask(user, "hold", row)
