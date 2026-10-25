import hashlib

from .db import utcnow

GENESIS = "0" * 64
LOCK_KEY = 7_770_001


def entry_hash(prev_hash: str, seq: int, ts, kind: str, actor: str, text: str) -> str:
    stamp = ts.strftime("%Y-%m-%dT%H:%M:%S.%f")
    return hashlib.sha256(f"{prev_hash}|{seq}|{stamp}|{kind}|{actor}|{text}".encode()).hexdigest()


def write_audit(conn, actor: str, kind: str, text: str, complaint_id: str | None = None) -> dict:
    conn.execute("SELECT pg_advisory_xact_lock(%s)", (LOCK_KEY,))
    tail = conn.execute("SELECT hash FROM audit_log ORDER BY seq DESC LIMIT 1").fetchone()
    prev = tail["hash"] if tail else GENESIS
    seq = conn.execute("SELECT nextval(pg_get_serial_sequence('audit_log', 'seq')) AS s").fetchone()["s"]
    ts = utcnow()
    return conn.execute(
        """INSERT INTO audit_log (seq, ts, actor, kind, complaint_id, text, prev_hash, hash)
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
        (seq, ts, actor, kind, complaint_id, text, prev, entry_hash(prev, seq, ts, kind, actor, text))).fetchone()


def verify_chain(conn) -> dict:
    prev = GENESIS
    count = 0
    for row in conn.execute("SELECT * FROM audit_log ORDER BY seq"):
        count += 1
        if row["prev_hash"] != prev:
            return {"ok": False, "entries": count, "broken_at": row["seq"], "reason": "broken link"}
        if row["hash"] != entry_hash(prev, row["seq"], row["ts"], row["kind"], row["actor"], row["text"]):
            return {"ok": False, "entries": count, "broken_at": row["seq"], "reason": "entry was altered"}
        prev = row["hash"]
    return {"ok": True, "entries": count, "broken_at": None, "reason": None}
