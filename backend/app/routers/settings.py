from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from psycopg.types.json import Jsonb
from pydantic import BaseModel

from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import get_conn, utcnow
from ..masking import require_access

router = APIRouter(prefix="/settings", tags=["settings"])


class SettingIn(BaseModel):
    value: Any


def is_valid(key: str, value: Any) -> bool:
    if key == "demo_clock":
        try:
            return value is None or bool(datetime.fromisoformat(str(value).replace("Z", "+00:00")))
        except ValueError:
            return False
    return isinstance(value, (int, float)) and not isinstance(value, bool) and value >= 0


@router.get("")
def list_settings(user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "settings")
    return conn.execute("SELECT key, value, updated_by, updated_at FROM settings ORDER BY key").fetchall()


@router.patch("/{key}")
def update_setting(key: str, body: SettingIn, user: User = Depends(current_user), conn=Depends(get_conn)):
    if not user.is_officer:
        raise HTTPException(403, "only an officer can change settings")
    old = conn.execute("SELECT value FROM settings WHERE key = %s FOR UPDATE", (key,)).fetchone()
    if old is None:
        raise HTTPException(404, "unknown setting")
    if not is_valid(key, body.value):
        raise HTTPException(422, "demo_clock must be null or an ISO timestamp; every other setting a number, 0 or more")
    row = conn.execute("""UPDATE settings SET value = %s, updated_by = %s, updated_at = %s WHERE key = %s
                          RETURNING key, value, updated_by, updated_at""",
                       (Jsonb(body.value), user.id, utcnow(), key)).fetchone()
    write_audit(conn, user.id, "SETTING", f"{key}: {old['value']!r} -> {body.value!r} by {user.name}")
    conn.commit()
    return row
