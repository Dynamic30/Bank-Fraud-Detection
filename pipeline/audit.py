"""Audit-log writer for pipeline jobs. Same hash chain as backend/app/auditlog.py (keep the two in step)."""
import hashlib
from datetime import UTC, datetime

GENESIS = "0" * 64
LOCK_KEY = 7_770_001


def entry_hash(prev_hash, seq, ts, kind, actor, text):
    stamp = ts.strftime("%Y-%m-%dT%H:%M:%S.%f")
    return hashlib.sha256(f"{prev_hash}|{seq}|{stamp}|{kind}|{actor}|{text}".encode()).hexdigest()


def write_audit(conn, actor, kind, text, complaint_id=None):
    """Append one entry. Works with tuple rows (the default psycopg row factory)."""
    conn.execute("SELECT pg_advisory_xact_lock(%s)", (LOCK_KEY,))
    tail = conn.execute("SELECT hash FROM audit_log ORDER BY seq DESC LIMIT 1").fetchone()
    prev = tail[0] if tail else GENESIS
    seq = conn.execute("SELECT nextval(pg_get_serial_sequence('audit_log', 'seq'))").fetchone()[0]
    ts = datetime.now(UTC).replace(tzinfo=None)
    conn.execute("INSERT INTO audit_log (seq, ts, actor, kind, complaint_id, text, prev_hash, hash) "
                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                 (seq, ts, actor, kind, complaint_id, text, prev, entry_hash(prev, seq, ts, kind, actor, text)))
    return seq
