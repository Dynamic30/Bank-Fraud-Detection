import os
import uuid
from pathlib import Path

import psycopg
import pytest
from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
ADMIN_URL = os.environ.get("TEST_PG_ADMIN_URL", "postgresql://peecha:test@localhost:55432/postgres")
SQL_FILES = [ROOT / "backend" / "database_structure.sql", ROOT / "backend" / "banks_seed.sql",
             ROOT / "backend" / "app_users_seed.sql", Path(__file__).parent / "fixtures.sql"]


@pytest.fixture(scope="session")
def db_url():
    name = f"peecha_test_{uuid.uuid4().hex[:8]}"
    try:
        with psycopg.connect(ADMIN_URL, autocommit=True, connect_timeout=3) as admin:
            admin.execute(f"CREATE DATABASE {name}")
    except psycopg.OperationalError:
        pytest.skip("no Postgres reachable at TEST_PG_ADMIN_URL")
    url = ADMIN_URL.rsplit("/", 1)[0] + "/" + name
    with psycopg.connect(url, autocommit=True) as conn:
        for path in SQL_FILES:
            conn.execute(path.read_text())
    yield url
    with psycopg.connect(ADMIN_URL, autocommit=True) as admin:
        admin.execute(f"DROP DATABASE {name} WITH (FORCE)")


@pytest.fixture(scope="session")
def client(db_url):
    patch = pytest.MonkeyPatch()
    patch.setenv("APP_DATABASE_URL", db_url)
    patch.setenv("ANTHROPIC_API_KEY", "")
    from backend.app.main import app
    with TestClient(app) as c:
        yield c
    patch.undo()


@pytest.fixture
def sql(db_url):
    with psycopg.connect(db_url, autocommit=True, row_factory=psycopg.rows.dict_row) as conn:
        yield conn.execute


@pytest.fixture(autouse=True)
def clean(db_url):
    yield
    with psycopg.connect(db_url, autocommit=True) as conn:
        conn.execute("TRUNCATE holds, actions, prevention_calls, audit_log RESTART IDENTITY")
        conn.execute("DELETE FROM complaint_payments WHERE complaint_id LIKE 'C-9%'")
        conn.execute("DELETE FROM complaints WHERE id LIKE 'C-9%'")
        conn.execute("""UPDATE settings SET updated_by = NULL,
                        value = CASE key WHEN 'hold_threshold' THEN '70'::jsonb WHEN 'demo_clock' THEN 'null'::jsonb ELSE value END""")
