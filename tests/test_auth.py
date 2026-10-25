from .util import CONSUMER1, OFFICER, h


def test_health_is_open(client):
    assert client.get("/health").json() == {"ok": True, "version": "0.1", "db": "up"}


def test_login(client):
    r = client.post("/api/login", json={"email": "Meera.Baruah@cybercell.example"})
    assert r.status_code == 200
    assert r.json() == {"user_id": "u-officer-1", "role": "officer", "bank_id": None,
                        "access_level": "admin", "name": "Insp. Meera Baruah"}
    sbi = client.post("/api/login", json={"email": "rahul.nair@sbi.example"}).json()
    assert (sbi["role"], sbi["bank_id"], sbi["access_level"]) == ("bank_analyst", "SBI", "hold")


def test_login_rejects_unknown_and_suspended(client):
    assert client.post("/api/login", json={"email": "nobody@x.example"}).status_code == 401
    assert client.post("/api/login", json={"email": "suspended@mail.example"}).status_code == 403


def test_api_needs_a_known_active_user(client):
    assert client.get("/api/complaints").status_code == 401
    assert client.get("/api/complaints", headers=h("nope")).status_code == 401
    assert client.get("/api/complaints", headers=h("u-suspended")).status_code == 403
    assert client.get("/api/complaints", headers=OFFICER).status_code == 200


def test_banks_open_to_every_role(client):
    r = client.get("/api/banks", headers=CONSUMER1)
    assert r.status_code == 200 and "SBI" in [b["id"] for b in r.json()]


def test_every_bank_has_a_working_analyst_and_admin(client, sql):
    banks = [r["id"] for r in sql("SELECT id FROM banks").fetchall()]
    assert len(banks) == 22
    for bank in banks:
        users = sql("SELECT email, role FROM app_users WHERE bank_id = %s AND status = 'active'", (bank,)).fetchall()
        assert {u["role"] for u in users} >= {"bank_analyst", "bank_admin"}, bank
        for u in users:
            r = client.post("/api/login", json={"email": u["email"]})
            assert r.status_code == 200 and r.json()["bank_id"] == bank
