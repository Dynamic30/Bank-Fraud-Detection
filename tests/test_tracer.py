"""Tests for the tracer. The FIFO sweep runs on in-memory data; one round trip through Postgres is rolled back and skipped without it."""
import random
from collections import Counter
from datetime import datetime, timedelta
from decimal import Decimal

import psycopg
import pytest

from pipeline.tracer import Tr, pull_next, sweep, trace

T0 = datetime(2026, 10, 1, 10, 0)
RATE, WINDOW = Decimal(90), timedelta(minutes=60)
SELLER = "TRON:Tseller"
_ids = iter(range(1, 10**6))


@pytest.fixture(autouse=True)
def clean():
    yield


def tr(frm, to, amount, minutes=0, asset="INR"):
    return Tr(next(_ids), T0 + timedelta(minutes=minutes), Decimal(amount), frm, to, asset)


def rows_of(transfers, seed, accounts=None, reported=None, min_amount=500, max_hops=12):
    """Rows for a victim whose payment `seed` (a transfer) was reported; `reported` defaults to its whole amount."""
    seeds = {seed.id: Decimal(reported if reported is not None else seed.amount)}
    return sweep(transfers, accounts or {}, seeds, Decimal(min_amount), max_hops, RATE, WINDOW)


def path(rows):
    return [(r["from_ref"], r["to_ref"], r["hop"], r["traced_amount"]) for r in rows]


def test_simple_chain_numbers_hops_by_receiver_layer():
    pay, b, c = tr("V", "A", 100000), tr("A", "B", 100000, 10), tr("B", "C", 60000, 20)
    noise = tr("X", "Y", 5000, 5)
    rows = rows_of([noise, c, b, pay], pay, {"A": dict(bank_id="SBI"), "B": dict(bank_id="HDFC")})
    assert path(rows) == [("V", "A", 1, 100000), ("A", "B", 2, 100000), ("B", "C", 3, 60000)]
    assert [r["leg"] for r in rows] == ["bank"] * 3 and rows[1]["to_bank"] == "HDFC" and rows[2]["to_bank"] is None
    assert rows[0]["asset"] is None and rows[0]["asset_amount"] is None
    assert [r["transfer_id"] for r in rows] == [pay.id, b.id, c.id]


def test_seed_is_capped_by_the_reported_amount_and_by_the_transfer():
    pay = tr("V", "A", 100000)
    assert rows_of([pay], pay, reported=40000)[0]["traced_amount"] == 40000
    assert rows_of([pay], pay, reported=250000)[0]["traced_amount"] == 100000


def test_fifo_spends_the_older_untainted_balance_first():
    opening = {"A": dict(opening_balance=50000)}
    pay, first, second = tr("V", "A", 100000, 0), tr("A", "B", 50000, 10), tr("A", "C", 50000, 20)
    rows = rows_of([pay, first, second], pay, opening)
    assert path(rows) == [("V", "A", 1, 100000), ("A", "C", 2, 50000)]

    older = tr("X", "A", 30000, -60)
    rows = rows_of([older, pay, first, second], pay)
    assert path(rows) == [("V", "A", 1, 100000), ("A", "B", 2, 20000), ("A", "C", 2, 50000)]


def test_split_outflow_and_partly_tainted_lot():
    pay = tr("V", "A", 100000)
    rows = rows_of([pay, tr("A", "B", 30000, 10), tr("A", "C", 70000, 20)], pay)
    assert path(rows)[1:] == [("A", "B", 2, 30000), ("A", "C", 2, 70000)]

    rows = rows_of([pay, tr("A", "B", 50000, 10), tr("A", "C", 50000, 20)], pay, reported=40000)
    assert path(rows) == [("V", "A", 1, 40000), ("A", "B", 2, 20000), ("A", "C", 2, 20000)]


def test_tainted_money_out_of_an_account_never_exceeds_what_came_in():
    rng = random.Random(7)
    names = [f"A{i}" for i in range(10)]
    pay = tr("V", "A0", 250000)
    moves = []
    for minutes in range(1, 400):
        frm, to = rng.sample(names, 2)
        moves.append(tr(frm, to if rng.random() > 0.05 else None, Decimal(rng.randint(60000, 9000000)) / 100, minutes))
    rows = rows_of([pay] + moves, pay, min_amount=0)
    inflow, outflow = Counter(), Counter()
    for r in rows:
        inflow[r["to_ref"]] += r["traced_amount"]
        outflow[r["from_ref"]] += r["traced_amount"]
    assert len(rows) > 50 and max(r["hop"] for r in rows) > 4
    assert all(outflow[a] <= inflow[a] for a in names)
    assert outflow["V"] == 250000


def test_atm_cash_out_is_recorded_and_ends_the_trail():
    pay, atm = tr("V", "A", 80000), tr("A", None, 20000, 10)
    rows = rows_of([pay, atm, tr("A", "B", 60000, 20)], pay, {"A": dict(bank_id="SBI")})
    cash = rows[1]
    assert (cash["to_ref"], cash["to_bank"], cash["from_bank"], cash["traced_amount"], cash["hop"]) == ("CASH", None, "SBI", 20000, 2)
    assert [r["to_ref"] for r in rows] == ["A", "CASH", "B"]


@pytest.mark.parametrize("kind", ["exchange_deposit", "exchange_hot", "bridge", "mixer"])
def test_exchange_bridge_and_mixer_end_the_trail(kind):
    pay, in_, out = tr("V", "A", 90000), tr("A", "TRON:X", 90000, 10), tr("TRON:X", "TRON:Y", 90000, 20)
    rows = rows_of([pay, in_, out], pay, {"TRON:X": dict(wallet_kind=kind)})
    assert [r["to_ref"] for r in rows] == ["A", "TRON:X"]
    private = rows_of([pay, in_, out], pay, {"TRON:X": dict(wallet_kind="private")})
    assert [r["to_ref"] for r in private] == ["A", "TRON:X", "TRON:Y"]


def test_below_minimum_is_not_recorded_or_carried():
    pay, small, rest = tr("V", "A", 1000), tr("A", "B", 400, 10), tr("A", "C", 600, 20)
    rows = rows_of([pay, small, rest], pay, reported=1000, min_amount=500)
    assert path(rows) == [("V", "A", 1, 1000), ("A", "C", 2, 600)]
    assert rows_of([pay], pay, reported=499) == []
    onward = tr("B", "D", 400, 30)
    assert rows_of([pay, small, onward], pay, min_amount=0)[-1]["to_ref"] == "D"
    assert rows_of([pay, small, onward], pay, min_amount=500)[-1]["to_ref"] == "A"


def test_max_hops_stops_the_trail():
    pay = tr("V", "A", 50000)
    chain = [tr("A", "B", 50000, 10), tr("B", "C", 50000, 20), tr("C", "D", 50000, 30)]
    assert [r["hop"] for r in rows_of([pay] + chain, pay, max_hops=2)] == [1, 2]
    assert [r["hop"] for r in rows_of([pay] + chain, pay, max_hops=12)] == [1, 2, 3, 4]


def test_p2p_payment_continues_as_the_sellers_matching_usdt_release():
    accounts = {"SBI:seller": dict(bank_id="SBI", p2p_wallet="Tseller"), "TRON:Tbuyer": dict(wallet_kind="private"),
                "TRON:Tdeposit": dict(wallet_kind="exchange_deposit")}
    pay = tr("V", "SBI:seller", 90000)
    too_big, too_late, right, other = (tr(SELLER, "TRON:Tother", 1500, 20, "USDT"), tr(SELLER, "TRON:Tother", 1000, 90, "USDT"),
                                       tr(SELLER, "TRON:Tbuyer", 1004, 30, "USDT"), tr(SELLER, "TRON:Tother", 980, 40, "USDT"))
    onward = [tr("TRON:Tbuyer", "TRON:Tmid", 1004, 50, "USDT"), tr("TRON:Tmid", "TRON:Tdeposit", 1004, 60, "USDT"),
              tr("SBI:seller", "SBI:cashout", 90000, 15)]
    rows = rows_of([pay, too_big, too_late, right, other] + onward, pay, accounts)
    assert [(r["leg"], r["from_ref"], r["to_ref"], r["hop"]) for r in rows] == [
        ("bank", "V", "SBI:seller", 1), ("crypto", SELLER, "TRON:Tbuyer", 2), ("crypto", "TRON:Tbuyer", "TRON:Tmid", 3),
        ("crypto", "TRON:Tmid", "TRON:Tdeposit", 4)]
    seam = rows[1]
    assert (seam["transfer_id"], seam["asset"], seam["asset_amount"], seam["traced_amount"]) == (right.id, "USDT", 1004, 90360)
    assert all(r["transfer_id"] != onward[2].id for r in rows)


def test_p2p_release_pays_for_one_payment_only_and_carries_the_tainted_share():
    accounts = {"SBI:seller": dict(p2p_wallet="TRON:Tseller")}
    pay, other = tr("V", "SBI:seller", 90000, 0), tr("W", "SBI:seller", 90000, 1)
    release = tr(SELLER, "TRON:Tbuyer", 1000, 20, "USDT")
    only_one = rows_of([pay, other, release], pay, accounts)
    assert [r["transfer_id"] for r in only_one] == [pay.id, release.id]

    rows = rows_of([pay, release], pay, accounts, reported=45000)
    assert (rows[0]["traced_amount"], rows[1]["asset_amount"], rows[1]["traced_amount"]) == (45000, 500, 45000)


def test_rerun_gives_the_same_rows():
    pay = tr("V", "A", 100000)
    moves = [pay, tr("A", "B", 70000, 10), tr("A", None, 30000, 12), tr("B", "C", 70000, 20)]
    assert rows_of(moves, pay) == rows_of(list(reversed(moves)), pay)


def test_pull_next_lists_stubs_and_unfetched_seller_wallets():
    accounts = {"A": dict(fetched_at=T0), "B": dict(fetched_at=None), "SBI:seller": dict(fetched_at=T0, p2p_wallet="Tseller"),
                "TRON:Tdeposit": dict(fetched_at=None, wallet_kind="exchange_deposit"), "TRON:Tbuyer": dict(fetched_at=None)}
    rows = [dict(hop=1, to_ref="A"), dict(hop=2, to_ref="B"), dict(hop=2, to_ref="SBI:seller"), dict(hop=3, to_ref="CASH"),
            dict(hop=3, to_ref="TRON:Tdeposit"), dict(hop=3, to_ref="TRON:Tbuyer")]
    assert pull_next(rows, accounts, 12) == ["B", "TRON:Tbuyer", SELLER]
    assert pull_next(rows, accounts, 3) == ["B", SELLER]
    accounts["TRON:Tseller"] = dict(fetched_at=T0)
    assert pull_next(rows, accounts, 12) == ["B", "TRON:Tbuyer"]


def test_trace_writes_the_trail_and_a_rerun_changes_nothing(db_url):
    with psycopg.connect(db_url) as conn:
        conn.execute("INSERT INTO accounts (account_id, kind, bank_id, fetched_at) VALUES "
                     "('SBI:T1', 'bank', 'SBI', now()), ('HDFC:T2', 'bank', 'HDFC', now()), "
                     "('ICICI:T3', 'bank', 'ICICI', NULL)")
        conn.execute("INSERT INTO transfers (transfer_id, source, source_ref, from_id, to_id, amount, ts, rail) VALUES "
                     "(9001, 'bank', 't1', 'SBI:T1', 'HDFC:T2', 50000, '2026-07-01 10:00', 'UPI'), "
                     "(9002, 'bank', 't2', 'HDFC:T2', 'ICICI:T3', 48000, '2026-07-01 10:20', 'IMPS'), "
                     "(9003, 'bank', 't3', 'ICICI:T3', NULL, 45000, '2026-07-01 11:00', 'ATM')")
        conn.execute("INSERT INTO complaints (id, name, victim_account_id, scam_type, total_lost, fraud_time, reported_at) VALUES "
                     "('C-9101', 'V', 'SBI:T1', 'upi', 50000, '2026-07-01 09:00', '2026-07-01 12:00')")
        conn.execute("INSERT INTO complaint_payments (complaint_id, amount, matched, matched_transfer_id) "
                     "VALUES ('C-9101', 50000, true, 9001)")
        other = conn.execute("SELECT count(*) FROM victim_mapping WHERE complaint_id <> 'C-9101'").fetchone()
        stored = ("SELECT transfer_id, hop, from_ref, to_ref, traced_amount, status, traced_at "
                  "FROM victim_mapping WHERE complaint_id = 'C-9101' ORDER BY hop")

        first = trace(conn, "C-9101")
        rows = conn.execute(stored).fetchall()
        assert (first["rows"], first["hops"], first["accounts"], first["pull"]) == (3, 3, 2, ["ICICI:T3"])
        assert [(r[0], r[1], r[2], r[3], r[4], r[5]) for r in rows] == [
            (9001, 1, "SBI:T1", "HDFC:T2", 50000, "done"), (9002, 2, "HDFC:T2", "ICICI:T3", 48000, "done"),
            (9003, 3, "ICICI:T3", "CASH", 45000, "done")]

        trace(conn, "C-9101")
        assert conn.execute(stored).fetchall() == rows

        conn.execute("UPDATE transfers SET status = 'failed' WHERE transfer_id = 9003")
        assert trace(conn, "C-9101")["rows"] == 2
        assert [r[0] for r in conn.execute(stored)] == [9001, 9002]

        conn.execute("UPDATE settings SET value = to_jsonb('2026-07-01T10:10:00Z'::text) WHERE key = 'demo_clock'")
        assert trace(conn, "C-9101")["rows"] == 1
        assert conn.execute("SELECT count(*) FROM victim_mapping WHERE complaint_id <> 'C-9101'").fetchone() == other
        conn.rollback()
