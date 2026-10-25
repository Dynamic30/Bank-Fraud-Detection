from typing import Literal

import logging

from fastapi import APIRouter, Depends, HTTPException

from pipeline.bank_connections.bank_database import pull
from pipeline.models import mule_detector

from .. import jobs
from ..auditlog import write_audit
from ..auth import User, current_user
from ..db import Page, get_conn, page, pipeline_conn
from ..masking import mask, require_access, scope

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("")
def list_accounts(bank_id: str | None = None, kind: Literal["bank", "wallet"] | None = None,
                  min_score: float | None = None, pg: Page = Depends(page),
                  user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "accounts")
    pred, params = scope(user, "account")
    rows = conn.execute(
        f"""SELECT a.*, s.score
            FROM accounts a LEFT JOIN account_scores s ON s.account_id = a.account_id
            WHERE {pred}
              AND (%(f_bank)s::text IS NULL OR a.bank_id = %(f_bank)s)
              AND (%(f_kind)s::text IS NULL OR a.kind = %(f_kind)s)
              AND (%(f_min)s::numeric IS NULL OR s.score >= %(f_min)s)
            ORDER BY s.score DESC NULLS LAST, a.account_id LIMIT %(limit)s OFFSET %(offset)s""",
        {**params, "f_bank": bank_id, "f_kind": kind, "f_min": min_score,
         "limit": pg.limit, "offset": pg.offset}).fetchall()
    return mask(user, "account", rows)


@router.get("/{account_id}")
def get_account(account_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    require_access(user, "account_detail")
    pred, params = scope(user, "account")
    row = conn.execute(
        f"""SELECT a.*, s.score, s.reasons, s.model_version, s.computed_at AS score_computed_at,
                   (SELECT count(*) FROM account_cases ac WHERE ac.account_id = a.account_id) AS repeat_offender_count
            FROM accounts a LEFT JOIN account_scores s ON s.account_id = a.account_id
            WHERE a.account_id = %(id)s AND {pred}""", {**params, "id": account_id}).fetchone()
    if row is None:
        raise HTTPException(404, "account not found")
    return mask(user, "account", row)


@router.post("/{account_id}/rerun")
def rerun_account(account_id: str, user: User = Depends(current_user), conn=Depends(get_conn)):
    """Read this account again from the bank source and score it again (for an account that was never pulled or scored)."""
    require_access(user, "account_detail")
    pred, params = scope(user, "account")
    row = conn.execute(f"SELECT a.account_id, a.kind FROM accounts a WHERE a.account_id = %(id)s AND {pred}",
                       {**params, "id": account_id}).fetchone()
    if row is None:
        raise HTTPException(404, "account not found")
    if not jobs.enabled():
        raise HTTPException(503, "Tracing is switched off on this server (BANK_DATABASE_URL is not set)")
    try:
        transfers = pull(account_id)
    except LookupError as e:
        raise HTTPException(404, f"Not found in the bank data: {e}") from None
    except Exception:
        logging.getLogger(__name__).exception("re-run of %s failed", account_id)
        raise HTTPException(502, "The bank source could not be read. Try again in a moment.") from None
    if row["kind"] == "bank":
        with pipeline_conn() as plain:
            mule_detector.run(plain, account_ids=[account_id])
    score = conn.execute("SELECT score FROM account_scores WHERE account_id = %s", (account_id,)).fetchone()
    write_audit(conn, user.id, "ACCOUNT", f"{account_id} read and scored again by {user.name}")
    conn.commit()
    return {"account_id": account_id, "transfers_read": transfers, "score": float(score["score"]) if score else None}
