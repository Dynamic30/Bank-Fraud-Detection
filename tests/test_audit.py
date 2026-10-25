from .util import OFFICER, SBI, SBI_ACCT


def test_chain_verifies_and_starts_at_genesis(client, sql):
    client.post("/api/holds", json={"account_id": SBI_ACCT, "reason": "check chain"}, headers=SBI)
    client.post("/api/calls", json={"account_id": SBI_ACCT, "outcome": "denied"}, headers=OFFICER)
    assert client.get("/api/audit/verify", headers=OFFICER).json() == {"ok": True, "entries": 2, "broken_at": None, "reason": None}
    assert sql("SELECT prev_hash FROM audit_log ORDER BY seq LIMIT 1").fetchone()["prev_hash"] == "0" * 64
    first, second = sql("SELECT hash, prev_hash FROM audit_log ORDER BY seq").fetchall()
    assert second["prev_hash"] == first["hash"]


def test_empty_chain_is_valid(client):
    assert client.get("/api/audit/verify", headers=OFFICER).json()["ok"] is True


def test_tampering_is_detected(client, sql):
    client.post("/api/holds", json={"account_id": SBI_ACCT, "reason": "one"}, headers=SBI)
    client.post("/api/calls", json={"account_id": SBI_ACCT, "outcome": "denied"}, headers=SBI)
    sql("UPDATE audit_log SET text = 'edited' WHERE seq = 1")
    result = client.get("/api/audit/verify", headers=OFFICER).json()
    assert (result["ok"], result["broken_at"]) == (False, 1)


def test_removed_entry_is_detected(client, sql):
    for outcome in ("denied", "unsure", "admitted"):
        client.post("/api/calls", json={"account_id": SBI_ACCT, "outcome": outcome}, headers=OFFICER)
    sql("DELETE FROM audit_log WHERE seq = 2")
    assert client.get("/api/audit/verify", headers=OFFICER).json()["broken_at"] == 3


def test_bank_user_sees_scoped_masked_audit(client):
    client.post("/api/holds", json={"account_id": "HDFC:2222220022", "reason": "ring", "complaint_id": "C-3001"},
                headers=OFFICER)
    client.post("/api/holds", json={"account_id": "ICICI:5555550055", "reason": "other", "complaint_id": "C-3002"},
                headers=OFFICER)
    lines = client.get("/api/audit", headers=SBI).json()
    assert len(lines) == 1
    assert "HDFC ••0022" in lines[0]["text"] and "HDFC:2222220022" not in lines[0]["text"]
    assert len(client.get("/api/audit", headers=OFFICER).json()) == 2
