from tests.util import CONSUMER1, HDFC, OFFICER, SBI_VIEWER


def test_stats_are_whole_platform_totals(client, sql):
    sql("INSERT INTO holds (account_id, bank_id, origin, basis, status, reason, amount) "
        "VALUES ('HDFC:2222220022','HDFC','officer','officer_decision','active','t', 1000)")
    r = client.get("/api/stats", headers=OFFICER)
    assert r.status_code == 200
    body = r.json()
    assert set(body) == {"complaints", "total_lost", "mules_detected", "mules_confirmed", "holds_open", "secured", "calls_made",
                         "calls_answered", "repeat_accounts", "secured_pct"}
    assert body["holds_open"] == 1 and body["secured"] == 1000.0
    assert body["complaints"] == sql("SELECT count(*) AS n FROM complaints").fetchone()["n"]
    assert body["total_lost"] == float(sql("SELECT COALESCE(sum(total_lost),0) AS s FROM complaints").fetchone()["s"])
    assert body["secured_pct"] == round(min(100, 1000 / body["total_lost"] * 100), 1)
    assert 0 <= body["mules_confirmed"] <= body["mules_detected"] and body["calls_answered"] <= body["calls_made"]


def test_banks_can_read_it_but_victims_and_strangers_cannot(client):
    assert client.get("/api/stats", headers=HDFC).status_code == 200
    assert client.get("/api/stats", headers=SBI_VIEWER).status_code == 200
    assert client.get("/api/stats", headers=CONSUMER1).status_code == 403
    assert client.get("/api/stats").status_code in (401, 403)


def test_calls_are_counted(client, sql):
    sql("INSERT INTO prevention_calls (account_id, outcome) VALUES ('HDFC:2222220022','noanswer'),('HDFC:2222220022','denied')")
    body = client.get("/api/stats", headers=OFFICER).json()
    assert body["calls_made"] == 2 and body["calls_answered"] == 1
