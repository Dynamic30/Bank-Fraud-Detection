from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException
from psycopg.types.json import Jsonb
from pydantic import BaseModel, Field

from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import Page, get_conn, page, utcnow
from ..masking import mask, require_access, scope, visible_complaint

router = APIRouter(prefix="/actions", tags=["actions"])


class ActionIn(BaseModel):
    complaint_id: str
    kind: Literal["freeze", "p2p", "issuer", "str"]
    target: str = Field(min_length=1)
    targets: list[Any] = []
    draft_text: str | None = None


class ApproveIn(BaseModel):
    final_text: str | None = None


def require_officer(user: User) -> None:
    if not user.is_officer:
        raise HTTPException(403, "only an officer can do this")


def lock_action(conn, action_id: int, expected: str) -> dict:
    row = conn.execute("SELECT * FROM actions WHERE id = %s FOR UPDATE", (action_id,)).fetchone()
    if row is None:
        raise HTTPException(404, "action not found")
    if row["status"] != expected:
        raise HTTPException(409, f"action is {row['status']}, expected {expected}")
    return row


@router.get("")
def list_actions(complaint_id: str | None = None,
                 status: Literal["draft", "approved", "sent", "executed", "rejected"] | None = None,
                 pg: Page = Depends(page), user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "actions")
    pred, params = scope(user, "action")
    rows = conn.execute(
        f"""SELECT ac.* FROM actions ac
            WHERE {pred} AND (%(cid)s::text IS NULL OR ac.complaint_id = %(cid)s)
              AND (%(status)s::text IS NULL OR ac.status = %(status)s)
            ORDER BY ac.created_at DESC, ac.id DESC LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "cid": complaint_id, "status": status, "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "action", rows)


@router.post("", status_code=201)
def draft_action(body: ActionIn, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "actions")
    if not user.can_write:
        raise HTTPException(403, "view-only access cannot draft actions")
    if visible_complaint(conn, user, body.complaint_id) is None:
        raise HTTPException(404, "complaint not found")
    basis = "officer_decision" if user.is_officer else "bank"
    row = conn.execute(
        """INSERT INTO actions (complaint_id, kind, target, targets, basis, draft_text, created_by)
           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
        (body.complaint_id, body.kind, body.target, Jsonb(body.targets), basis, body.draft_text, user.id)).fetchone()
    write_audit(conn, user.id, "ACTION", f"A-{row['id']} · {body.kind} request to {body.target} drafted by {user.name}",
                body.complaint_id)
    conn.commit()
    return mask(user, "action", row)


@router.post("/{action_id}/approve")
def approve_action(action_id: int, body: ApproveIn | None = None, user: User = Depends(current_user),
                   conn=Depends(get_conn)):
    require_officer(user)
    action = lock_action(conn, action_id, "draft")
    final = (body.final_text if body else None) or action["draft_text"]
    row = conn.execute("""UPDATE actions SET status = 'approved', final_text = %s, approved_by = %s, approved_at = %s
                          WHERE id = %s RETURNING *""", (final, user.id, utcnow(), action_id)).fetchone()
    write_audit(conn, user.id, "ACTION", f"A-{action_id} · {action['kind']} request to {action['target']} APPROVED "
                f"by {user.name}", action["complaint_id"])
    conn.commit()
    return mask(user, "action", row)


@router.post("/{action_id}/send")
def send_action(action_id: int, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_officer(user)
    action = lock_action(conn, action_id, "approved")
    row = conn.execute("UPDATE actions SET status = 'sent', sent_at = %s WHERE id = %s RETURNING *",
                       (utcnow(), action_id)).fetchone()
    write_audit(conn, user.id, "ACTION", f"A-{action_id} · {action['kind']} request to {action['target']} SENT "
                f"by {user.name}", action["complaint_id"])
    conn.commit()
    return mask(user, "action", row)
