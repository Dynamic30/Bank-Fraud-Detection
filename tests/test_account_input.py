import pytest

from .util import CONSUMER1, OFFICER, SBI

BASE = {"name": "Anil Verma", "scam_type": "Fake job", "total_lost": 5000, "fraud_time": "2026-10-24T12:00:00",
        "payments": [{"amount": 5000, "utr": "123456789012"}]}


def file(client, account, headers=CONSUMER1):
    return client.post("/api/complaints", json={**BASE, "victim_account_id": account}, headers=headers)


@pytest.mark.parametrize("typed", ["ICICI:876296367481", "icici:876296367481", "icici 876296367481", "ICICI-876296367481",
                                   " icici / 876296367481 ", "ICICI Bank 876296367481", "ICICI : 876296367481", "ICICI876296367481", "ICIC:876296367481"])
def test_the_ways_people_type_an_account_all_become_one(client, typed):
    r = file(client, typed)
    assert r.status_code == 201, typed
    stored = client.get(f"/api/complaints/{r.json()['id']}", headers=OFFICER).json()["victim_account_id"]
    assert stored == "ICICI:876296367481"


@pytest.mark.parametrize("typed,why", [("ICICI:8752", "too short"), ("876296367481", "like ICICI:"), ("XYZ:876296367481", "Unknown bank"),
                                       ("ICICI", "like ICICI:"), ("ICICI:87 62", "like ICICI:")])
def test_a_bad_account_is_refused_with_a_reason_not_dropped(client, typed, why):
    r = file(client, typed)
    assert r.status_code == 422 and why in r.json()["detail"], r.text


def test_the_account_is_still_optional(client):
    assert file(client, None).status_code == 201
    assert file(client, "").status_code == 201


def test_a_bank_still_files_only_for_its_own_customers(client):
    assert file(client, "sbi 1111110011", SBI).status_code == 201
    assert file(client, "hdfc 2222220022", SBI).status_code == 403
