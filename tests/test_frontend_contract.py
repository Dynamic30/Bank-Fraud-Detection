from .util import OFFICER

ADDRESS = "TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"


def test_ask_without_key_gives_canned_answer(client):
    r = client.post("/api/ask", json={"question": "what next?", "context": {"case": "C-3001"}}, headers=OFFICER)
    assert r.status_code == 200 and "ANTHROPIC_API_KEY" in r.json()["answer"]


def test_ask_draft_returns_draft_unchanged(client):
    draft = "Dear Sir, kindly freeze account SBI:1111110011."
    r = client.post("/api/ask", json={"task": "draft", "question": draft}, headers=OFFICER)
    assert r.json() == {"answer": draft}


def test_ask_rejects_huge_context(client):
    r = client.post("/api/ask", json={"question": "q", "context": {"blob": "x" * 60001}}, headers=OFFICER)
    assert r.status_code == 413


def test_ask_needs_a_user(client):
    assert client.post("/api/ask", json={"question": "q"}).status_code == 401


def test_tron_validates_address(client):
    assert client.get("/api/tron?address=abc", headers=OFFICER).status_code == 422


def test_tron_empty_without_chain_transfers(client):
    assert client.get(f"/api/tron?address={ADDRESS}", headers=OFFICER).json() == {"rows": []}


def test_tron_rows_from_transfers(client, sql):
    other = "TBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
    sql("INSERT INTO accounts (account_id, kind, wallet_kind) VALUES (%s, 'wallet', 'private')", (f"TRON:{other}",))
    try:
        sql("""INSERT INTO transfers (transfer_id, source, source_ref, from_id, to_id, amount, asset, ts, rail) VALUES
               (101, 'chain', 'h1', %s, %s, 120.5, 'USDT', '2026-07-01 10:00:00', 'CHAIN'),
               (102, 'chain', 'h2', %s, %s, 80, 'USDT', '2026-07-02 10:00:00', 'CHAIN')""",
            (f"TRON:{ADDRESS}", f"TRON:{other}", f"TRON:{other}", f"TRON:{ADDRESS}"))
        rows = client.get(f"/api/tron?address={ADDRESS}", headers=OFFICER).json()["rows"]
        assert [r["hash"] for r in rows] == ["h2", "h1"]
        assert rows[1] == {"hash": "h1", "time": 1782900000000, "from": ADDRESS, "to": other, "amount": 120.5}
    finally:
        sql("DELETE FROM transfers WHERE source = 'chain'")
        sql("DELETE FROM accounts WHERE account_id = %s", (f"TRON:{other}",))
