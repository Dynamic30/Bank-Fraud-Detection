from .util import CONSUMER1, CONSUMER2, CONSUMER3, HDFC, OFFICER, SBI, SBI_ACCT, SBI_VIEWER

COMPLAINT = {"name": "New Victim", "scam_type": "upi_fraud", "fraud_time": "2026-10-01T10:00:00Z",
             "payments": [{"amount": 1000, "utr": "X1", "paid_to_account_id": "HDFC:2222220022"}]}


def test_consumer_files_and_only_owner_sees_it(client):
    r = client.post("/api/complaints", json=COMPLAINT, headers=CONSUMER3)
    assert r.status_code == 201
    c = r.json()
    assert c["id"] == "C-9001" and c["total_lost"] == 1000
    assert (c["filed_via"], c["filed_by"], c["owner_user_id"]) == ("self", "u-consumer-3", "u-consumer-3")
    assert c["payments"][0]["paid_to_account_id"] == "HDFC ••0022"
    assert [x["id"] for x in client.get("/api/complaints", headers=CONSUMER3).json()] == ["C-9001"]
    assert client.get("/api/complaints/C-9001", headers=CONSUMER2).status_code == 404
    assert client.post("/api/complaints", json=COMPLAINT, headers=CONSUMER3).json()["id"] == "C-9002"


def test_bank_files_for_own_customer_only(client):
    ok = client.post("/api/complaints", json={**COMPLAINT, "victim_account_id": "SBI:1111110011"}, headers=SBI)
    assert ok.status_code == 201 and ok.json()["filed_via"] == "bank"
    assert client.post("/api/complaints", json={**COMPLAINT, "victim_account_id": "HDFC:2222220022"}, headers=SBI).status_code == 403
    assert client.post("/api/complaints", json=COMPLAINT, headers=OFFICER).json()["filed_via"] == "officer"


def test_complaint_validation(client):
    crypto = {"amount": 10, "destination_type": "crypto"}
    assert client.post("/api/complaints", json={**COMPLAINT, "payments": [crypto]}, headers=OFFICER).status_code == 422
    assert client.post("/api/complaints", json={**COMPLAINT, "payments": []}, headers=OFFICER).status_code == 422
    assert client.post("/api/complaints", json={**COMPLAINT, "owner_user_id": "u-sbi-admin"}, headers=OFFICER).status_code == 422


def test_action_flow(client):
    draft = {"complaint_id": "C-3001", "kind": "freeze", "target": "Exchange A", "draft_text": "Please freeze TRON wallet"}
    assert client.post("/api/actions", json=draft, headers=CONSUMER1).status_code == 403
    assert client.post("/api/actions", json=draft, headers=SBI_VIEWER).status_code == 403
    assert client.post("/api/actions", json={**draft, "complaint_id": "C-3002"}, headers=SBI).status_code == 404

    action = client.post("/api/actions", json=draft, headers=OFFICER).json()
    assert (action["status"], action["basis"], action["created_by"]) == ("draft", "officer_decision", "u-officer-1")
    aid = action["id"]
    assert client.post(f"/api/actions/{aid}/send", headers=OFFICER).status_code == 409
    assert client.post(f"/api/actions/{aid}/approve", headers=SBI).status_code == 403

    approved = client.post(f"/api/actions/{aid}/approve", headers=OFFICER).json()
    assert (approved["status"], approved["final_text"]) == ("approved", "Please freeze TRON wallet")
    assert client.post(f"/api/actions/{aid}/approve", headers=OFFICER).status_code == 409
    assert client.post(f"/api/actions/{aid}/send", headers=OFFICER).json()["status"] == "sent"

    bank_draft = client.post("/api/actions", json=draft, headers=SBI).json()
    assert bank_draft["basis"] == "bank"
    assert len(client.get("/api/actions", headers=SBI).json()) == 2
    assert client.get("/api/actions", headers=HDFC).json() != []
    assert client.get("/api/actions?complaint_id=C-3002", headers=OFFICER).json() == []


def test_calls(client):
    body = {"account_id": SBI_ACCT, "outcome": "unsure", "reply_label": "asked for time"}
    assert client.post("/api/calls", json=body, headers=OFFICER).status_code == 201
    assert client.post("/api/calls", json=body, headers=SBI).status_code == 201
    assert client.post("/api/calls", json={**body, "account_id": "HDFC:2222220022"}, headers=SBI).status_code == 403
    assert client.post("/api/calls", json=body, headers=SBI_VIEWER).status_code == 403
    assert client.post("/api/calls", json=body, headers=CONSUMER1).status_code == 403
    assert client.post("/api/calls", json={**body, "outcome": "maybe"}, headers=OFFICER).status_code == 422
    client.post("/api/calls", json={**body, "account_id": "HDFC:2222220022"}, headers=OFFICER)
    assert {c["account_id"] for c in client.get("/api/calls", headers=SBI).json()} == {SBI_ACCT}
    assert len(client.get("/api/calls", headers=OFFICER).json()) == 3


def test_settings(client):
    assert client.patch("/api/settings/hold_threshold", json={"value": 75}, headers=SBI).status_code == 403
    assert client.patch("/api/settings/nope", json={"value": 1}, headers=OFFICER).status_code == 404
    assert client.patch("/api/settings/hold_threshold", json={"value": -1}, headers=OFFICER).status_code == 422
    assert client.patch("/api/settings/hold_threshold", json={"value": "high"}, headers=OFFICER).status_code == 422
    assert client.patch("/api/settings/demo_clock", json={"value": "garbage"}, headers=OFFICER).status_code == 422

    r = client.patch("/api/settings/hold_threshold", json={"value": 75}, headers=OFFICER)
    assert r.status_code == 200 and r.json()["value"] == 75 and r.json()["updated_by"] == "u-officer-1"
    assert client.patch("/api/settings/demo_clock", json={"value": "2026-10-25T12:00:00Z"}, headers=OFFICER).status_code == 200
    assert client.patch("/api/settings/demo_clock", json={"value": None}, headers=OFFICER).status_code == 200
    values = {s["key"]: s["value"] for s in client.get("/api/settings", headers=SBI).json()}
    assert values["hold_threshold"] == 75 and values["hold_min_amount_inr"] == 1000
    assert client.get("/api/audit?kind=SETTING", headers=OFFICER).json()
