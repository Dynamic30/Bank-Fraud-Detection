import asyncio
import inspect
import time
from contextlib import suppress

import pytest

from backend.app import db, jobs, main
from pipeline import hold_proposals, orchestrator

from .util import CONSUMER1, CONSUMER3, HDFC, HDFC_ACCT, OFFICER, SBI, SBI_ACCT, SBI_ADMIN, SBI_VIEWER

BANK_URL = "postgresql://bank.invalid/dummy_sources"
ICICI_ACCT = "ICICI:3333330033"
COMPLAINT = {"name": "New Victim", "scam_type": "upi_fraud", "fraud_time": "2026-10-01T10:00:00Z",
             "payments": [{"amount": 1000, "utr": "X1", "paid_to_account_id": HDFC_ACCT}]}
REASONS = {HDFC_ACCT: "Received Rs 50,000 from SBI:1111110011, passed on to ICICI:3333330033",
           ICICI_ACCT: "Cash-out after HDFC:2222220022",
           SBI_ACCT: "Same device as HDFC:2222220022"}


def wait_for(condition, seconds=2):
    end = time.monotonic() + seconds
    while not condition() and time.monotonic() < end:
        time.sleep(0.01)


def test_pipeline_entry_points_match_how_the_backend_calls_them():
    inspect.signature(orchestrator.run).bind("C-1")
    inspect.signature(orchestrator.run_due).bind()
    inspect.signature(hold_proposals.proposals).bind(None, "C-1")


def test_filing_traces_in_background_only_when_bank_db_is_configured(client, sql, monkeypatch):
    traced = []

    def run(complaint_id):
        row = sql("SELECT id FROM complaints WHERE id = %s", (complaint_id,)).fetchone()
        traced.append(row and row["id"])

    monkeypatch.setattr(orchestrator, "run", run)

    monkeypatch.delenv("BANK_DATABASE_URL", raising=False)
    assert client.post("/api/complaints", json=COMPLAINT, headers=CONSUMER3).status_code == 201
    assert traced == []

    monkeypatch.setenv("BANK_DATABASE_URL", BANK_URL)
    r = client.post("/api/complaints", json=COMPLAINT, headers=CONSUMER3)
    assert r.status_code == 201
    wait_for(lambda: traced)
    assert traced == [r.json()["id"]]


def test_failed_trace_is_logged_and_never_reaches_the_client(client, monkeypatch, caplog):
    def run(complaint_id):
        raise RuntimeError("bank source down")

    monkeypatch.setattr(orchestrator, "run", run)
    monkeypatch.setenv("BANK_DATABASE_URL", BANK_URL)
    r = client.post("/api/complaints", json=COMPLAINT, headers=OFFICER)
    cid = r.json()["id"]
    assert r.status_code == 201
    wait_for(lambda: "bank source down" in caplog.text)
    assert f"trace of {cid} failed" in caplog.text and "bank source down" in caplog.text
    assert client.get(f"/api/complaints/{cid}", headers=OFFICER).status_code == 200


@pytest.fixture
def proposals(monkeypatch):
    asked = []

    def fake(conn, complaint_id):
        assert conn.execute("SELECT 1").fetchone() == (1,)
        asked.append(complaint_id)
        return [{"account_id": acct, "bank_id": acct.partition(":")[0], "complaint_id": complaint_id, "amount": 48000,
                 "score": 82, "reason": reason, "basis": "ai_draft", "duration_hours": 24}
                for acct, reason in REASONS.items()]

    monkeypatch.setattr(hold_proposals, "proposals", fake)
    return asked


def get_proposals(client, headers, cid="C-3001"):
    return client.get(f"/api/complaints/{cid}/hold-proposals", headers=headers)


def test_officer_sees_every_banks_proposals_unmasked(client, proposals):
    rows = get_proposals(client, OFFICER).json()
    assert [(p["account_id"], p["reason"]) for p in rows] == list(REASONS.items())
    assert (rows[0]["amount"], rows[0]["score"], rows[0]["basis"], rows[0]["duration_hours"]) == (48000, 82, "ai_draft", 24)
    assert proposals == ["C-3001"]


def test_bank_user_sees_only_own_banks_proposals_with_other_banks_masked(client, proposals):
    hdfc = get_proposals(client, HDFC).json()
    assert [(p["account_id"], p["reason"]) for p in hdfc] == [
        (HDFC_ACCT, "Received Rs 50,000 from SBI ••0011, passed on to ICICI ••0033")]
    sbi = get_proposals(client, SBI).json()
    assert [(p["account_id"], p["reason"]) for p in sbi] == [(SBI_ACCT, "Same device as HDFC ••0022")]
    assert get_proposals(client, SBI_ADMIN).json() == sbi


def test_hold_proposals_need_hold_access(client, proposals):
    assert get_proposals(client, CONSUMER1).status_code == 403
    assert get_proposals(client, SBI_VIEWER).status_code == 403
    assert client.get("/api/complaints/C-3001/hold-proposals").status_code == 401
    assert proposals == []


def test_hold_proposals_follow_complaint_visibility(client, proposals):
    assert get_proposals(client, OFFICER, "C-0000").status_code == 404
    assert get_proposals(client, SBI, "C-3002").status_code == 404
    assert proposals == []
    assert get_proposals(client, OFFICER, "C-3002").status_code == 200


def test_real_hold_proposals_work_through_the_api(client):
    officer = get_proposals(client, OFFICER).json()
    assert [(p["account_id"], p["complaint_id"], p["basis"]) for p in officer] == [(HDFC_ACCT, "C-3001", "ai_draft")]
    assert "SBI:1111110011" in officer[0]["reason"]
    hdfc = get_proposals(client, HDFC).json()
    assert [p["account_id"] for p in hdfc] == [HDFC_ACCT] and "SBI ••0011" in hdfc[0]["reason"]
    assert get_proposals(client, SBI).json() == []


def test_hold_placed_from_a_proposal_keeps_the_ai_draft_basis(client):
    body = {"account_id": HDFC_ACCT, "reason": REASONS[HDFC_ACCT], "complaint_id": "C-3001", "amount": 48000,
            "score_at_time": 82, "basis": "ai_draft"}
    requested = client.post("/api/holds", json=body, headers=OFFICER).json()
    assert (requested["status"], requested["origin"], requested["basis"]) == ("requested", "officer", "ai_draft")
    placed = client.post("/api/holds", json={**body, "account_id": SBI_ACCT}, headers=SBI).json()
    assert (placed["status"], placed["origin"], placed["basis"]) == ("active", "bank", "ai_draft")
    assert client.post("/api/holds", json={**body, "account_id": ICICI_ACCT, "basis": "bank"}, headers=OFFICER).status_code == 422


async def wait_until(condition, timeout=5.0):
    deadline = time.monotonic() + timeout
    while not condition() and time.monotonic() < deadline:
        await asyncio.sleep(0.01)
    return condition()


def test_retrace_loop_keeps_going_after_an_error(monkeypatch, caplog):
    runs = []

    def run_due():
        runs.append(1)
        if len(runs) == 1:
            raise RuntimeError("bank source down")
        return 0

    monkeypatch.setattr(orchestrator, "run_due", run_due)
    monkeypatch.setattr(jobs, "RETRACE_SECONDS", 0.01)

    async def scenario():
        task = asyncio.create_task(jobs.retrace_loop())
        assert await wait_until(lambda: len(runs) >= 3)
        task.cancel()
        with suppress(asyncio.CancelledError):
            await task

    asyncio.run(scenario())
    assert "periodic re-trace failed" in caplog.text and "bank source down" in caplog.text


@pytest.mark.parametrize("bank_url", [None, BANK_URL])
def test_lifespan_runs_the_retrace_loop_only_with_a_bank_db_and_stops_it(monkeypatch, bank_url):
    runs = []
    monkeypatch.setattr(orchestrator, "run_due", lambda: runs.append(1) or 0)
    monkeypatch.setattr(jobs, "RETRACE_SECONDS", 0.01)
    monkeypatch.setattr(db, "init_pool", lambda: None)
    monkeypatch.setattr(db, "close_pool", lambda: None)
    if bank_url:
        monkeypatch.setenv("BANK_DATABASE_URL", bank_url)
    else:
        monkeypatch.delenv("BANK_DATABASE_URL", raising=False)

    async def scenario():
        async with main.lifespan(main.app):
            if bank_url:
                assert await wait_until(lambda: runs)
            else:
                await asyncio.sleep(0.2)
        stopped_at = len(runs)
        await asyncio.sleep(0.1)
        assert len(runs) == stopped_at
        assert asyncio.all_tasks() == {asyncio.current_task()}

    asyncio.run(scenario())
    assert bool(runs) is bool(bank_url)
