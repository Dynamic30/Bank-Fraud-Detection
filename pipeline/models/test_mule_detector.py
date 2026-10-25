"""Unit tests for the mule detector. No database: accounts and transfers are built in memory."""
from datetime import date, datetime, timedelta

import pytest

from pipeline.models.mule_detector import Case, Tr, World, fifo, load_rules, score_account

T = datetime(2026, 10, 24, 12, 0)
CFG = load_rules()
_ids = iter(range(1, 10**6))


def acct(id="SBI:1", **kw):
    row = dict(account_id=id, kind="bank", bank_id="SBI", wallet_kind=None, dob=date(2000, 1, 1), occupation="salaried",
               declared_income=600000, opening_balance=0, opened_on=date(2024, 1, 1), device_id=None, upi_id=None,
               p2p_wallet=None, fetched_at=T - timedelta(hours=1), txns_synced_until=T)
    return {**row, **kw}


def tr(frm, to, amt, ago, rail="UPI", device=None, status="done", asset="INR"):
    return Tr(next(_ids), T - ago, float(amt), frm, to, rail, device, asset, status)


def score(row, trs, world=None):
    return score_account(row, trs, world or World(), T, CFG)


def rules_of(res):
    return {h["rule_id"]: h for h in res["reasons"]}


def mule_trs(me="SBI:1", n=6, amt=9000):
    """Several strangers pay in, everything leaves within minutes."""
    trs = []
    for i in range(n):
        at = timedelta(hours=10 - i)
        trs += [tr(f"HDFC:{i}", me, amt, at), tr(me, f"ICICI:{i}", amt, at - timedelta(minutes=5), rail="IMPS")]
    return trs


def test_fifo_allocates_oldest_first():
    a, b = tr("X", "Y", 100, timedelta(hours=3)), tr("Z", "Y", 100, timedelta(hours=2))
    out = tr("Y", "W", 150, timedelta(hours=1))
    al = fifo([a, b], [out])
    assert [(x[0].id, x[2]) for x in al] == [(a.id, 100), (b.id, 50)]
    assert al[0][3] == 120


def test_pass_through_fires_high():
    res = score(acct(), mule_trs())
    hit = rules_of(res)["R01"]
    assert hit["severity"] == "high" and hit["points"] == 30
    assert "within 15 min" in hit["reason_text"]


def test_normal_account_scores_zero():
    trs = [tr("EMP:1", "SBI:1", 50000, timedelta(days=d), rail="NEFT") for d in (5, 35, 65)]
    trs += [tr("SBI:1", "SHOP:1", 2000, timedelta(days=d)) for d in (2, 9, 16)]
    res = score(acct(), trs)
    assert res["status"] == "scored" and res["score"] == 0


def test_insufficient_data():
    assert score(acct(), mule_trs(n=1))["status"] == "insufficient_data"        # 2 transfers
    assert score(acct(txns_synced_until=T - timedelta(days=5)), mule_trs())["status"] == "insufficient_data"


def test_call_gate_needs_two_families():
    # pass-through alone (FLOW only) can never reach the call tier
    res = score(acct(), mule_trs(n=2, amt=9000))
    assert res["score"] < 40
    # add profile family: income way below turnover, and a repeat-victim trail
    row = acct(declared_income=60000)
    world = World(cases={"SBI:1": [Case("C1", 1, 9000, T), Case("C2", 2, 9000, T)]})
    res = score(row, mule_trs(), world)
    assert res["score"] >= 40 and res["tier"] in ("watch_call", "hold_candidate")


def test_hold_floor_three_complaints():
    world = World(cases={"SBI:1": [Case(f"C{i}", 1 + i, 2000, T) for i in range(3)]})
    res = score(acct(), [tr("A:1", "SBI:1", 600, timedelta(days=i + 1)) for i in range(4)], world)
    assert res["score"] == 70 and res["tier"] == "hold_candidate"


def test_stub_is_capped_and_low_confidence():
    world = World(cases={"S:1": [Case("C1", 1, 5000, T)]})
    res = score(acct("S:1", fetched_at=None, txns_synced_until=None), mule_trs("S:1"), world)
    assert res["stub"] and res["score"] <= 69 and res["confidence"] == "low"
    assert "R06" not in rules_of(res) and "R10" not in rules_of(res)


def test_stub_cap_lifted_with_two_complaints():
    import copy
    cfg = copy.deepcopy(CFG)
    cfg["combination"]["stub_accounts"]["score_cap"] = 50          # low cap so the lift is visible
    row = acct("S:1", fetched_at=None, txns_synced_until=None)
    one = score_account(row, mule_trs("S:1"), World(cases={"S:1": [Case("C1", 1, 5000, T)]}), T, cfg)
    two = score_account(row, mule_trs("S:1"), World(cases={"S:1": [Case("C1", 1, 5000, T), Case("C2", 1, 5000, T)]}), T, cfg)
    assert one["score"] == 50 and two["score"] > 50


def test_shared_device_and_confirmed_mule():
    world = World(devices={"dev1": {f"X:{i}" for i in range(10)} | {"SBI:1"}}, confirmed={"X:3"})
    res = rules_of(score(acct(device_id="dev1"), mule_trs(), world))
    assert res["R10"]["severity"] == "high" and res["R11"]["points"] == 15
    assert res["R10"]["evidence"]["device_id"] == "dev1"


def test_atm_ids_are_not_devices():
    trs = mule_trs() + [tr("SBI:1", None, 4000, timedelta(minutes=30), rail="ATM", device="ATM-77")]
    assert "ATM-77" not in score_account(acct(), trs, World(), T, CFG).get("reasons", [""])[0].get("reason_text", "")


def test_atm_cash_out_after_credit():
    trs = [tr("A:1", "SBI:1", 20000, timedelta(hours=2)), tr("A:2", "SBI:1", 3000, timedelta(hours=5)),
           tr("A:3", "SBI:1", 3000, timedelta(hours=6)), tr("SBI:1", None, 15000, timedelta(hours=1, minutes=30), rail="ATM")]
    assert "R18" in rules_of(score(acct(), trs))


def test_mixer_touch():
    world = World(peers={"TRON:m": {"wallet_kind": "mixer"}})
    trs = mule_trs() + [tr("SBI:1", "TRON:m", 50, timedelta(days=2), rail="CHAIN", asset="USDT")]
    assert rules_of(score(acct(), trs, world))["R17"]["severity"] == "high"


def test_merchant_pattern_suppresses_and_subtracts():
    trs = []
    for d in range(1, 30):
        for k in range(3):
            trs.append(tr(f"CUST:{k}", "SBI:1", 400 + k, timedelta(days=d, hours=k)))
        trs.append(tr("SBI:1", "SBI:SETTLE", 1000, timedelta(days=d - 1, hours=-1) if d > 1 else timedelta(hours=1),
                      rail="NEFT"))
    res = rules_of(score(acct(opened_on=date(2024, 1, 1)), trs))
    assert "N1" in res and res["N1"]["points"] == -15 and "R02" not in res


def test_single_rule_capped_and_clamped():
    res = score(acct(declared_income=1000), mule_trs(n=12), World(cases={"SBI:1": [Case(f"C{i}", 1, 9e4, T) for i in range(5)]}))
    assert 0 <= res["score"] <= 100
    assert all(h["points"] <= 30 for h in res["reasons"])


def test_cleared_cool_off_until_new_complaint():
    world = World(cleared={"SBI:1": T - timedelta(days=10)})
    assert "N5" in rules_of(score(acct(), mule_trs(), world))
    world = World(cleared={"SBI:1": T - timedelta(days=10)},
                  cases={"SBI:1": [Case("C9", 1, 4000, T - timedelta(days=1))]})
    assert "N5" not in rules_of(score(acct(), mule_trs(), world))


def test_future_transfers_are_ignored():
    future = [tr("A:1", "SBI:1", 90000, -timedelta(hours=3)), tr("SBI:1", "B:1", 90000, -timedelta(hours=2))]
    base = score(acct(), mule_trs())
    assert score(acct(), mule_trs() + future)["score"] == base["score"]


@pytest.mark.parametrize("rid", [r["id"] for r in CFG["rules"]])
def test_every_rule_has_an_implementation_and_reason_fields(rid):
    from pipeline.models.mule_detector import NEG_RULES, Acct
    assert hasattr(Acct, NEG_RULES.get(rid, rid.lower()))
