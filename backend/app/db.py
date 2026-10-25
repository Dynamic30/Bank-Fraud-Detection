import os
from datetime import datetime, timezone
from typing import Iterator, NamedTuple

from fastapi import HTTPException, Query
from psycopg import Connection
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool, PoolTimeout

_pool: ConnectionPool | None = None


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
