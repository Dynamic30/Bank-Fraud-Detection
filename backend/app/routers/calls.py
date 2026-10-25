from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import Page, get_conn, page, utcnow
from ..masking import mask, require_access, scope

router = APIRouter(prefix="/calls", tags=["calls"])


class CallIn(BaseModel):
    account_id: str
    outcome: Literal["admitted", "denied", "unsure", "noanswer"]
    reply_label: str | None = None


@router.get("")
def list_calls(account_id: str | None = None, pg: Page = Depends(page),
               user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "calls")
    pred, params = scope(user, "call")
    rows = conn.execute(
        f"""SELECT pc.* FROM prevention_calls pc
            WHERE {pred} AND (%(acct)s::text IS NULL OR pc.account_id = %(acct)s)
            ORDER BY pc.called_at DESC, pc.id DESC LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "acct": account_id, "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "call", rows)


@router.post("", status_code=201)
def log_call(body: CallIn, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "calls")
    if not user.can_write:
        raise HTTPException(403, "view-only access cannot log calls")
    acct = conn.execute("SELECT account_id, bank_id FROM accounts WHERE account_id = %s", (body.account_id,)).fetchone()
    if acct is None:
        raise HTTPException(404, "account not found")
    if user.is_bank and acct["bank_id"] != user.bank_id:
        raise HTTPException(403, "a bank can only log calls for its own accounts")
    row = conn.execute(
        """INSERT INTO prevention_calls (account_id, outcome, reply_label, called_at, called_by)
           VALUES (%s, %s, %s, %s, %s) RETURNING *""",
        (body.account_id, body.outcome, body.reply_label, utcnow(), user.id)).fetchone()
    write_audit(conn, user.id, "CALL", f"Prevention call to {body.account_id}: {body.outcome} (logged by {user.name})")
    conn.commit()
    return mask(user, "call", row)
