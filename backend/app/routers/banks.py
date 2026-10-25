from fastapi import APIRouter, Depends

from ..auth import User, current_user
from ..db import get_conn
from ..masking import require_access

router = APIRouter(prefix="/banks", tags=["banks"])


@router.get("")
def list_banks(user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "banks")
    return conn.execute("SELECT id, name, ifsc_prefix, upi_handle, connector FROM banks ORDER BY id").fetchall()
