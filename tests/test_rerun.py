import pytest

from backend.app import jobs
from backend.app.routers import accounts as accounts_router

from .util import CONSUMER1, CONSUMER2, OFFICER, SBI, h

PNB = h("u-pnb-analyst")  # a bank that is nowhere on C-3001's trail

NEW = {"name": "Anil Verma", "scam_type": "Fake job", "total_lost": 5000, "fraud_time": "2026-10-24T10:00:00",
       "payments": [{"amount": 5000, "utr": "UTRX1"}]}


@pytest.fixture
def tracing_on(monkeypatch):
    """Tracing switched on, with the background trace replaced so nothing touches a bank database."""
    started = []
    monkeypatch.setenv("BANK_DATABASE_URL", "postgresql://unused/unused")
    monkeypatch.setattr(jobs, "start_trace", lambda cid: started.append(cid) or True)
    jobs.RESULTS.clear()
    jobs.RUNNING.clear()
    yield started
    jobs.RESULTS.clear()
    jobs.RUNNING.clear()


def file_new(client):
    r = client.post("/api/complaints", json=NEW, headers=CONSUMER1)  # with tracing on, filing starts a trace by itself
    assert r.status_code == 201
    return r.json()["id"]


def state(client, cid, headers=CONSUMER1):
    r = client.get(f"/api/complaints/{cid}/trace", headers=headers)
    assert r.status_code == 200
    return r.json()


def test_done_when_a_trail_exists(client):
    s = state(client, "C-3001")
    assert (s["state"], s["rows"]) == ("done", 3)


def test_not_configured_without_the_bank_database(client):
    s = state(client, file_new(client))
    assert s["state"] == "not_configured" and s["can_rerun"] is False


def test_waiting_then_not_started_then_no_data_then_failed(client, sql, tracing_on):
    cid = file_new(client)
    assert state(client, cid)["state"] == "waiting"

    sql("UPDATE complaints SET reported_at = now() - interval '10 minutes' WHERE id = %s", (cid,))
    s = state(client, cid)
    assert (s["state"], s["can_rerun"]) == ("not_started", True)

    sql("UPDATE complaints SET last_traced_at = now() WHERE id = %s", (cid,))
    s = state(client, cid)
    assert s["state"] == "no_data" and "could not find this payment" in s["message"]

    jobs.RESULTS[cid] = {"at": jobs.now(), "error": "OperationalError: connection refused at db.internal", "failures": []}
    assert state(client, cid)["message"] == "The trace failed. Please re-run it."  # victims never see internals
    staff = state(client, cid, OFFICER)
    assert staff["state"] == "failed" and "connection refused" in staff["message"]


def test_failure_detail_for_staff_comes_from_the_trace(client, sql, tracing_on):
    cid = file_new(client)
    sql("UPDATE complaints SET last_traced_at = now() WHERE id = %s", (cid,))
    jobs.RESULTS[cid] = {"at": jobs.now(), "error": None, "failures": ["victim ICICI:1 not found in accounts"]}
    assert state(client, cid, OFFICER)["message"] == "victim ICICI:1 not found in accounts"


def test_running_blocks_a_second_run(client, tracing_on):
    cid = file_new(client)
    jobs.RUNNING.add(cid)
    assert state(client, cid)["state"] == "running"
    started = len(tracing_on)
    assert client.post(f"/api/complaints/{cid}/retrace", headers=CONSUMER1).status_code == 409
    assert len(tracing_on) == started


def test_victim_can_rerun_their_own_complaint(client, sql, tracing_on):
    cid = file_new(client)
    tracing_on.clear()
    r = client.post(f"/api/complaints/{cid}/retrace", headers=CONSUMER1)
    assert r.status_code == 202 and r.json() == {"state": "running"}
    assert tracing_on == [cid]
    audit = sql("SELECT text FROM audit_log WHERE kind = 'TRACE' AND complaint_id = %s", (cid,)).fetchall()
    assert any("re-run requested by Anil Verma" in a["text"] for a in audit)


def test_only_people_who_can_see_the_complaint_can_rerun_it(client, tracing_on):
    assert client.post("/api/complaints/C-3001/retrace", headers=CONSUMER2).status_code == 404  # someone else's
    assert client.post("/api/complaints/C-3001/retrace", headers=PNB).status_code == 404        # a bank not involved
    assert client.post("/api/complaints/C-3001/retrace", headers=SBI).status_code == 202        # the victim's bank
    assert client.post("/api/complaints/C-3002/retrace", headers=OFFICER).status_code == 202
    assert client.post("/api/complaints/C-3001/retrace").status_code == 401
    assert tracing_on == ["C-3001", "C-3002"]


def test_rerun_needs_tracing_switched_on(client):
    assert client.post("/api/complaints/C-3001/retrace", headers=OFFICER).status_code == 503


def test_a_crashed_trace_is_recorded(client, sql, monkeypatch):
    monkeypatch.setattr(jobs.orchestrator, "run", lambda cid: (_ for _ in ()).throw(RuntimeError("bank down")))
    monkeypatch.setattr(jobs, "record_failure", lambda cid, err: jobs.RESULTS.setdefault("seen", {"cid": cid, "err": err}))
    jobs.trace("C-3001")
    assert jobs.RESULTS["C-3001"]["error"] == "RuntimeError: bank down"
    assert jobs.RESULTS["seen"] == {"cid": "C-3001", "err": "RuntimeError: bank down"}
    assert "C-3001" not in jobs.RUNNING
    jobs.RESULTS.clear()


def test_account_rerun_reads_and_scores_the_account(client, sql, monkeypatch):
    monkeypatch.setenv("BANK_DATABASE_URL", "postgresql://unused/unused")
    pulled, scored = [], []
    monkeypatch.setattr(accounts_router, "pull", lambda acct: pulled.append(acct) or 12)

    class FakeDetector:
        @staticmethod
        def run(conn, account_ids=None):
            scored.append(account_ids)

    monkeypatch.setattr(accounts_router, "mule_detector", FakeDetector)
    monkeypatch.setattr(accounts_router, "pipeline_conn", lambda: __import__("contextlib").nullcontext())
    r = client.post("/api/accounts/HDFC:2222220022/rerun", headers=OFFICER)
    assert r.status_code == 200
    assert r.json() == {"account_id": "HDFC:2222220022", "transfers_read": 12, "score": 82.0}
    assert pulled == ["HDFC:2222220022"] and scored == [["HDFC:2222220022"]]
    assert sql("SELECT count(*) AS n FROM audit_log WHERE kind = 'ACCOUNT'").fetchone()["n"] == 1


def test_account_rerun_permissions_and_errors(client, monkeypatch):
    assert client.post("/api/accounts/HDFC:2222220022/rerun", headers=OFFICER).status_code == 503  # tracing off
    monkeypatch.setenv("BANK_DATABASE_URL", "postgresql://unused/unused")
    assert client.post("/api/accounts/HDFC:2222220022/rerun", headers=CONSUMER1).status_code == 403
    assert client.post("/api/accounts/NOPE:1/rerun", headers=OFFICER).status_code == 404

    def missing(acct):
        raise LookupError("no account")

    monkeypatch.setattr(accounts_router, "pull", missing)
    assert client.post("/api/accounts/HDFC:2222220022/rerun", headers=OFFICER).status_code == 404

    def broken(acct):
        raise RuntimeError("connection refused to db.internal")

    monkeypatch.setattr(accounts_router, "pull", broken)
    r = client.post("/api/accounts/HDFC:2222220022/rerun", headers=OFFICER)
    assert r.status_code == 502 and "db.internal" not in r.text


def test_failure_reason_survives_a_restart(client, sql, tracing_on):
    cid = file_new(client)
    sql("UPDATE complaints SET last_traced_at = now() WHERE id = %s", (cid,))
    jobs.record_problems(cid, ["ICICI:8752: icici_accounts: no account 8752", "second problem"])
    jobs.RESULTS.clear()  # as after a restart: only the audit log remembers
    staff = state(client, cid, OFFICER)
    assert staff["state"] == "no_data"
    assert staff["message"] == "ICICI:8752: icici_accounts: no account 8752 (+1 more)"
    assert "no account 8752" not in state(client, cid)["message"]  # the victim still gets the plain wording

    jobs.record_failure(cid, "OperationalError: bank source down")
    jobs.RESULTS.clear()
    after = state(client, cid, OFFICER)
    assert (after["state"], after["message"]) == ("failed", "OperationalError: bank source down")

    from pipeline.audit import write_audit
    from backend.app.db import pipeline_conn
    with pipeline_conn() as conn:  # a newer, clean run hides the old reason
        write_audit(conn, "system:orchestrator", "TRACE", "Traced 5 transfers over 2 hops, 0 failures", cid)
    assert state(client, cid, OFFICER)["state"] == "no_data" and "bank source down" not in state(client, cid, OFFICER)["message"]


def test_every_trace_records_its_problems(client, sql, monkeypatch):
    monkeypatch.setattr(jobs.orchestrator, "run", lambda cid: {"failures": [f"{cid}: no account 1"], "rows": 0})
    jobs.trace("C-3001")
    texts = [r["text"] for r in sql("SELECT text FROM audit_log WHERE complaint_id = 'C-3001' AND kind = 'TRACE'").fetchall()]
    assert texts == ["Trace of C-3001 had problems: C-3001: no account 1"]
    jobs.RESULTS.clear()

