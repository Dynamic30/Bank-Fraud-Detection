import os
import re
from datetime import timezone

import psycopg
from fastapi import APIRouter, HTTPException
from psycopg.rows import dict_row

router = APIRouter(tags=["tron"])

ADDRESS = re.compile(r"^T[1-9A-HJ-NP-Za-km-z]{33}$")


@router.get("/tron")
def tron(address: str):
    if not ADDRESS.match(address):
        raise HTTPException(422, "invalid TRON address")
    try:
        with psycopg.connect(os.environ["BANK_DATABASE_URL"], connect_timeout=2, row_factory=dict_row) as conn:
            rows = conn.execute(
                """SELECT tx_hash, block_time, from_address, to_address, amount FROM crypto_transfers
                   WHERE from_address = %(a)s OR to_address = %(a)s ORDER BY block_time DESC LIMIT 20""",
                {"a": address}).fetchall()
    except (KeyError, psycopg.Error):
        return {"rows": []}
    return {"rows": [{"hash": r["tx_hash"], "time": int(r["block_time"].replace(tzinfo=timezone.utc).timestamp() * 1000),
                      "from": r["from_address"], "to": r["to_address"], "amount": float(r["amount"])} for r in rows]}
