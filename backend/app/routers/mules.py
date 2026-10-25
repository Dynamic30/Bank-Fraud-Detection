from typing import Literal

from fastapi import APIRouter, Depends

from ..auth import User, current_user
from ..db import Page, get_conn, page
from ..masking import mask, require_access, scope

router = APIRouter(prefix="/mules", tags=["mules"])


@router.get("")
def list_mules(status: Literal["suspected", "confirmed", "cleared"] | None = None,
               pg: Page = Depends(page), user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "mules")
    pred, params = scope(user, "mule")
    rows = conn.execute(
        f"""SELECT m.* FROM mule_accounts m
            WHERE {pred} AND (%(status)s::text IS NULL OR m.status = %(status)s)
            ORDER BY m.first_flagged_at DESC, m.account_id LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "status": status, "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "mule", rows)
