import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator, NamedTuple

from fastapi import HTTPException, Query
from psycopg import Connection, connect
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool, PoolTimeout

_pool: ConnectionPool | None = None
log = logging.getLogger(__name__)

SCHEMA_FILES = ("database_structure.sql", "banks_seed.sql", "app_users_seed.sql")
SCHEMA_LOCK = 7_770_004


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def init_pool() -> None:
    global _pool
    dsn = os.environ.get("APP_DATABASE_URL")
    if not dsn:
        return
    _pool = ConnectionPool(dsn, min_size=1, max_size=10, timeout=5, open=False,
                           kwargs={"row_factory": dict_row, "options": "-c timezone=UTC"})
    _pool.open()


def init_schema(conn) -> bool:
    """Load the schema and reference rows into an empty database (first start, e.g. on Render); return whether it did.

    Does nothing when the tables already exist, so a database set up by docker-compose or by hand is left alone.
    """
    def missing() -> bool:
        return conn.execute("SELECT to_regclass('public.app_users') IS NULL AS m").fetchone()["m"]

    if not missing():
        return False
    conn.execute("SELECT pg_advisory_xact_lock(%s)", (SCHEMA_LOCK,))  # two instances starting together
    if not missing():
        conn.rollback()
        return False
    base = Path(__file__).resolve().parents[1]
    for name in SCHEMA_FILES:
        conn.execute((base / name).read_text())
    conn.commit()
    return True


def ensure_schema() -> None:
    if _pool is None or os.environ.get("AUTO_INIT_DB") == "0":
        return
    try:
        with _pool.connection() as conn:
            if init_schema(conn):
                log.warning("database was empty: loaded %s", ", ".join(SCHEMA_FILES))
    except Exception:
        log.exception("could not check or load the database schema")


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
        _pool = None


def db_up() -> bool:
    if _pool is None:
        return False
    try:
        with _pool.connection(timeout=2) as conn:
            conn.execute("SELECT 1")
        return True
    except Exception:
        return False


def pipeline_conn() -> Connection:
    # default tuple rows: pipeline code reads rows by position, the pool above returns dicts
    return connect(os.environ["APP_DATABASE_URL"], options="-c timezone=UTC")


def get_conn() -> Iterator[Connection]:
    if _pool is None:
        raise HTTPException(503, "database not configured")
    try:
        with _pool.connection() as conn:
            yield conn
    except PoolTimeout as exc:
        raise HTTPException(503, "database unavailable") from exc


class Page(NamedTuple):
    limit: int
    offset: int


def page(limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0)) -> Page:
    return Page(limit, offset)
