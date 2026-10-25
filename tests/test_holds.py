from datetime import datetime, timedelta

from .util import HDFC, OFFICER, SBI, SBI_ACCT, SBI_ADMIN, SBI_VIEWER

BODY = {"account_id": SBI_ACCT, "reason": "mule suspected", "amount": 5000}


def place(client, headers, **extra):
    return client.post("/api/holds", json={**BODY, **extra}, headers=headers)


def test_bank_places_24h_active_hold(client):
    r = place(client, SBI)
    assert r.status_code == 201
    hold = r.json()
    assert (hold["status"], hold["origin"], hold["basis"]) == ("active", "bank", "bank")
    assert datetime.fromisoformat(hold["expires_at"]) - datetime.fromisoformat(hold["placed_at"]) == timedelta(hours=24)


def test_one_open_hold_per_account_and_failed_insert_leaves_no_audit(client, sql):
    assert place(client, SBI).status_code == 201
    audit_before = sql("SELECT count(*) AS n FROM audit_log").fetchone()["n"]
    assert place(client, OFFICER).status_code == 409
    assert place(client, SBI).status_code == 409
    assert sql("SELECT count(*) AS n FROM audit_log").fetchone()["n"] == audit_before
    assert sql("SELECT count(*) AS n FROM holds").fetchone()["n"] == 1


def test_permissions(client):
    assert place(client, SBI_VIEWER).status_code == 403
    assert place(client, SBI, account_id="HDFC:2222220022").status_code == 403
    assert place(client, SBI, account_id="TRON:TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA").status_code == 422
    assert place(client, SBI, account_id="SBI:0000000000").status_code == 404
    assert place(client, SBI, amount=500).status_code == 422
    assert client.post("/api/holds", json=BODY, headers={"X-User-Id": "u-consumer-1"}).status_code == 403


def test_officer_request_then_bank_execute_then_officer_confirm(client):
    hold = place(client, OFFICER, complaint_id="C-3001").json()
    assert (hold["status"], hold["origin"], hold["basis"], hold["expires_at"]) == ("requested", "officer", "officer_decision", None)
    hid = hold["id"]
    assert client.post(f"/api/holds/{hid}/execute", headers=HDFC).status_code == 403
    assert client.post(f"/api/holds/{hid}/execute", headers=OFFICER).status_code == 403
    assert client.post(f"/api/holds/{hid}/confirm", headers=OFFICER).status_code == 409

    executed = client.post(f"/api/holds/{hid}/execute", headers=SBI).json()
    assert executed["status"] == "active" and executed["expires_at"] and executed["executed_by"] == "u-sbi-analyst"
    assert client.post(f"/api/holds/{hid}/confirm", headers=SBI).status_code == 403

    confirmed = client.post(f"/api/holds/{hid}/confirm", json={"note": "FIR attached"}, headers=OFFICER).json()
    assert confirmed["status"] == "confirmed" and confirmed["expires_at"] is None
    assert confirmed["decided_by"] == "u-officer-1"


def test_reject_and_release_free_the_account(client):
    hid = place(client, SBI).json()["id"]
    assert client.post(f"/api/holds/{hid}/reject", headers=SBI).status_code == 403
    assert client.post(f"/api/holds/{hid}/reject", headers=OFFICER).json()["status"] == "rejected"
    assert client.post(f"/api/holds/{hid}/release", headers=SBI).status_code == 409

    hid = place(client, OFFICER).json()["id"]
    assert client.post(f"/api/holds/{hid}/release", headers=OFFICER).status_code == 403
    assert client.post(f"/api/holds/{hid}/release", headers=SBI_ADMIN).json()["status"] == "released"
    assert place(client, SBI).status_code == 201


def test_active_hold_expires_lazily(client, sql):
    hid = place(client, SBI).json()["id"]
    sql("UPDATE holds SET expires_at = now() - interval '1 hour' WHERE id = %s", (hid,))
    listed = client.get("/api/holds", headers=OFFICER).json()
    assert [(h["id"], h["status"]) for h in listed] == [(hid, "expired")]
    assert client.post(f"/api/holds/{hid}/confirm", headers=OFFICER).status_code == 409
    assert sql("SELECT count(*) AS n FROM audit_log WHERE actor = 'system'").fetchone()["n"] == 1
    assert place(client, SBI).status_code == 201


def test_hold_visibility(client):
    place(client, SBI)
    assert len(client.get("/api/holds", headers=SBI).json()) == 1
    assert client.get("/api/holds", headers=HDFC).json() == []
