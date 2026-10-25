from fastapi import APIRouter, Depends

from ..auditlog import verify_chain
from ..auth import User, current_user
from ..db import Page, get_conn, page
from ..masking import mask, require_access, scope

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("")
def list_audit(complaint_id: str | None = None, kind: str | None = None, pg: Page = Depends(page),
               user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "audit")
    pred, params = scope(user, "audit")
    rows = conn.execute(
        f"""SELECT au.* FROM audit_log au
            WHERE {pred} AND (%(cid)s::text IS NULL OR au.complaint_id = %(cid)s)
              AND (%(kind)s::text IS NULL OR au.kind = %(kind)s)
            ORDER BY au.seq DESC LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "cid": complaint_id, "kind": kind, "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "audit", rows)


@router.get("/verify")
def verify(user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "audit")
    return verify_chain(conn)
