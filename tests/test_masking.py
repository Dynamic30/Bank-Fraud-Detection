from .util import CONSUMER1, HDFC, HDFC_ACCT, OFFICER, SBI, SBI_ACCT


def trail(client, headers, cid="C-3001"):
    return client.get(f"/api/complaints/{cid}/trail", headers=headers).json()


def test_officer_sees_everything(client):
    rows = trail(client, OFFICER)
    assert [(r["from_ref"], r["to_ref"]) for r in rows] == [
        ("SBI:1111110011", HDFC_ACCT), (HDFC_ACCT, "ICICI:3333330033"), ("ICICI:3333330033", "CASH")]
    assert len(client.get("/api/complaints", headers=OFFICER).json()) == 2
    assert len(client.get("/api/accounts", headers=OFFICER).json()) == 6


def test_bank_analyst_sees_own_bank_only(client):
    rows = trail(client, SBI)
    assert [(r["from_ref"], r["to_ref"]) for r in rows] == [
        ("SBI:1111110011", "HDFC ••0022"), ("HDFC ••0022", "ICICI ••0033"), ("ICICI ••0033", "CASH")]
    assert [c["id"] for c in client.get("/api/complaints", headers=SBI).json()] == ["C-3001"]
    assert client.get("/api/complaints/C-3002", headers=SBI).status_code == 404
    assert client.get("/api/complaints/C-3002/trail", headers=SBI).status_code == 404
    assert {a["bank_id"] for a in client.get("/api/accounts", headers=SBI).json()} == {"SBI"}
    assert client.get(f"/api/accounts/{HDFC_ACCT}", headers=SBI).status_code == 404
    assert [m["account_id"] for m in client.get("/api/mules", headers=SBI).json()] == [SBI_ACCT]
    assert len(client.get("/api/mules", headers=OFFICER).json()) == 2


def test_payments_masked_for_other_bank(client):
    pay = client.get("/api/complaints/C-3001/payments", headers=SBI).json()[0]
    assert pay["paid_to_account_id"] == "HDFC ••0022"
    assert pay["paid_to_upi_id"] == "mu••••@hdfc"
    assert client.get("/api/complaints/C-3001/payments", headers=HDFC).json()[0]["paid_to_account_id"] == HDFC_ACCT


def test_consumer_sees_only_own_complaints_all_masked(client):
    assert [c["id"] for c in client.get("/api/complaints", headers=CONSUMER1).json()] == ["C-3001"]
    assert client.get("/api/complaints/C-3002", headers=CONSUMER1).status_code == 404
    assert client.get("/api/complaints/C-3001", headers=CONSUMER1).json()["victim_account_id"] == "SBI ••0011"
    refs = [r[k] for r in trail(client, CONSUMER1) for k in ("from_ref", "to_ref")]
    assert all("••" in x or x == "CASH" for x in refs)

    accounts = client.get("/api/accounts", headers=CONSUMER1).json()
    assert len(accounts) == 3
    assert all(a["masked"] and "score" not in a and "holder_name" not in a for a in accounts)


def test_consumer_blocked_from_staff_resources(client):
    for path in ("/api/mules", "/api/holds", "/api/actions", "/api/calls", "/api/audit", "/api/settings",
                 f"/api/accounts/{HDFC_ACCT}"):
        assert client.get(path, headers=CONSUMER1).status_code == 403, path


def test_account_detail_has_score_and_repeat_count(client):
    r = client.get(f"/api/accounts/{HDFC_ACCT}", headers=OFFICER).json()
    assert r["score"] == 82
    assert r["repeat_offender_count"] == 2
    assert r["reasons"][0]["rule_id"] == "R14"
    own = client.get(f"/api/accounts/{HDFC_ACCT}", headers=HDFC).json()
    assert own["masked"] is False and own["score"] == 82
    assert "SBI ••0011" in own["reasons"][0]["reason_text"]
