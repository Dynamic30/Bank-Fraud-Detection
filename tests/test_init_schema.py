import uuid

import psycopg
import pytest
from psycopg.rows import dict_row

from backend.app import db

from .conftest import ADMIN_URL


@pytest.fixture
def empty_db():
    name = f"peecha_init_{uuid.uuid4().hex[:8]}"
    try:
        with psycopg.connect(ADMIN_URL, autocommit=True, connect_timeout=3) as admin:
            admin.execute(f"CREATE DATABASE {name}")
    except psycopg.OperationalError:
        pytest.skip("no Postgres reachable at TEST_PG_ADMIN_URL")
    with psycopg.connect(ADMIN_URL.rsplit("/", 1)[0] + "/" + name, row_factory=dict_row) as conn:
        yield conn
    with psycopg.connect(ADMIN_URL, autocommit=True) as admin:
        admin.execute(f"DROP DATABASE {name} WITH (FORCE)")


def test_empty_database_gets_schema_banks_and_users(empty_db):
    assert db.init_schema(empty_db) is True
    assert empty_db.execute("SELECT count(*) AS n FROM banks").fetchone()["n"] == 22
    assert empty_db.execute("SELECT count(*) AS n FROM app_users WHERE role = 'officer'").fetchone()["n"] == 1


def test_existing_database_is_left_alone(empty_db):
    assert db.init_schema(empty_db) is True
    empty_db.execute("DELETE FROM app_users WHERE id = 'u-officer-1'")
    empty_db.commit()
    assert db.init_schema(empty_db) is False
    assert empty_db.execute("SELECT count(*) AS n FROM app_users WHERE role = 'officer'").fetchone()["n"] == 0
