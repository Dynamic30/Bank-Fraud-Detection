from fastapi import APIRouter, Depends

from ..auth import User, current_user
from ..db import get_conn
from ..masking import require_access

router = APIRouter(prefix="/stats", tags=["stats"])

# one read, whole-platform totals only (no account or person is named); the facts bar in the app asks for it once
QUERY = """
SELECT
  (SELECT count(*) FROM complaints)                                                       AS complaints,
  (SELECT COALESCE(sum(total_lost), 0) FROM complaints)                                    AS total_lost,
  (SELECT count(*) FROM mule_accounts WHERE status <> 'cleared')                           AS mules_detected,
  (SELECT count(*) FROM mule_accounts WHERE status = 'confirmed')                          AS mules_confirmed,
  (SELECT count(*) FROM holds WHERE status IN ('active', 'confirmed'))                     AS holds_open,
  (SELECT COALESCE(sum(amount), 0) FROM holds WHERE status IN ('active', 'confirmed'))     AS secured,
  (SELECT count(*) FROM prevention_calls)                                                  AS calls_made,
  (SELECT count(*) FROM prevention_calls WHERE outcome <> 'noanswer')                      AS calls_answered,
  (SELECT count(*) FROM (SELECT 1 FROM account_cases GROUP BY account_id
                         HAVING count(DISTINCT complaint_id) >= 2) r)                      AS repeat_accounts
"""


@router.get("")
def platform_facts(user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "stats")
    row = conn.execute(QUERY).fetchone()
    lost, secured = float(row["total_lost"]), float(row["secured"])
    out = {k: (float(v) if k in ("total_lost", "secured") else int(v)) for k, v in row.items()}
    out["secured_pct"] = round(min(100.0, secured / lost * 100), 1) if lost > 0 else 0.0
    return out
