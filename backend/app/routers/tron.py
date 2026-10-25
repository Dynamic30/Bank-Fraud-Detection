import re
from datetime import timezone

from fastapi import APIRouter, Depends, HTTPException

from ..db import get_conn

router = APIRouter(tags=["tron"])

ADDRESS = re.compile(r"^T[1-9A-HJ-NP-Za-km-z]{33}$")


@router.get("/tron")
def tron(address: str, conn=Depends(get_conn)):
    if not ADDRESS.match(address):
        raise HTTPException(422, "invalid TRON address")
    wallet = f"TRON:{address}"
    rows = conn.execute(
        """SELECT source_ref, ts, from_id, to_id, amount FROM transfers
           WHERE rail = 'CHAIN' AND (from_id = %(w)s OR to_id = %(w)s) ORDER BY ts DESC LIMIT 20""",
        {"w": wallet}).fetchall()
    return {"rows": [{"hash": r["source_ref"], "time": int(r["ts"].replace(tzinfo=timezone.utc).timestamp() * 1000),
                      "from": r["from_id"].removeprefix("TRON:"), "to": r["to_id"].removeprefix("TRON:"),
                      "amount": float(r["amount"])} for r in rows]}
