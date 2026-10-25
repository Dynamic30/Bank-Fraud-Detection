"""Hold proposals are computed from a complaint's FIFO trail. Each test builds its world in one transaction and rolls it back."""
import itertools

import psycopg
import pytest
from psycopg.types.json import Jsonb

from pipeline.hold_proposals import proposals

VICTIM = "SBI:9100000001"
M1, M2, M3, M4, M5, M6 = "HDFC:9100000002", "ICICI:9100000003", "SBI:9100000004", "PNB:9100000005", "HDFC:9100000006", "HDFC:9100000007"
WALLET = "TRON:T9100000000000000000000000000000001"
VICTIM_UPI = "victim9100@sbi"
REASONS = [{"rule_id": "R01", "reason_text": "Passes money on within minutes"}, {"rule_id": "R14", "reason_text": "In 2 victims' trails"},
           {"rule_id": "R05", "reason_text": "Sudden burst of credits"}]
SCORES = {VICTIM: 95, M1: 85, M2: 72, M3: 69.99, M4: 95, M5: 90, M6: 88, WALLET: 99}
# (from, to, amount): the money each account still holds is what came in minus what went on
TRAIL = [(VICTIM, M1, 50000), (VICTIM, M4, 800), (VICTIM, M5, 20000), (VICTIM, M6, 15000),
         (M1, M2, 30000), (M1, WALLET, 10000), (M2, M3, 4500), (M2, "CASH", 20000)]
_transfer_ids = itertools.count(9_100_000)  # fixtures.sql owns the low ids


def add_account(conn, account_id, score=None, reasons=None):
    wallet = account_id.startswith("TRON:")
    conn.execute("INSERT INTO accounts (account_id, kind, bank_id, wallet_kind, upi_id) VALUES (%s, %s, %s, %s, %s)",
                 (account_id, "wallet" if wallet else "bank", None if wallet else account_id.split(":")[0],
                  "private" if wallet else None, VICTIM_UPI if account_id == VICTIM else None))
    if score is not None:
        conn.execute("INSERT INTO account_scores (account_id, score, reasons) VALUES (%s, %s, %s)", (account_id, score, Jsonb(reasons or [])))


def add_complaint(conn, complaint_id, victim=VICTIM, victim_upi=None):
    conn.execute("INSERT INTO complaints (id, name, victim_account_id, victim_upi_id, scam_type, total_lost, fraud_time, reported_at) "
                 "VALUES (%s, 'Victim', %s, %s, 'investment', 50000, '2026-10-20 09:00', '2026-10-20 12:00')", (complaint_id, victim, victim_upi))


def add_move(conn, complaint_id, frm, to, amount, method="fifo", status="done"):
    cash = to == "CASH"
    transfer_id = next(_transfer_ids)
    conn.execute("INSERT INTO transfers (transfer_id, source, source_ref, from_id, to_id, amount, ts, rail) "
                 "VALUES (%s, 'bank', %s, %s, %s, %s, '2026-10-20 10:00', %s)",
                 (transfer_id, f"T{transfer_id}", frm, None if cash else to, amount, "ATM" if cash else "IMPS"))
    conn.execute("INSERT INTO victim_mapping (complaint_id, transfer_id, method, hop, leg, from_ref, to_ref, traced_amount, status) "
                 "VALUES (%s, %s, %s, 1, 'bank', %s, %s, %s, %s)", (complaint_id, transfer_id, method, frm, to, amount, status))


def add_hold(conn, account_id, status):
    conn.execute("INSERT INTO holds (account_id, bank_id, origin, basis, status, reason) VALUES (%s, %s, 'officer', 'officer_decision', %s, 'test')",
                 (account_id, account_id.split(":")[0], status))


def ids(rows):
    return [r["account_id"] for r in rows]


@pytest.fixture
def conn(db_url):
    c = psycopg.connect(db_url)
    try:
        for account_id, score in SCORES.items():
            add_account(c, account_id, score, REASONS if account_id == M1 else [] if account_id == M2 else REASONS[:1])
        add_complaint(c, "C-9101")
        for frm, to, amount in TRAIL:
            add_move(c, "C-9101", frm, to, amount)
        add_hold(c, M5, "active")
        add_hold(c, M6, "expired")
        yield c
    finally:
        c.rollback()
        c.close()


def test_proposes_accounts_still_holding_traced_money_highest_score_first(conn):
    rows = proposals(conn, "C-9101")
    assert [(r["account_id"], r["amount"], r["score"]) for r in rows] == [(M6, 15000, 88), (M1, 10000, 85), (M2, 5500, 72)]
    assert rows[1] == {"account_id": M1, "bank_id": "HDFC", "complaint_id": "C-9101", "amount": 10000.0, "score": 85.0,
                       "reason": "Passes money on within minutes; In 2 victims' trails", "basis": "ai_draft", "duration_hours": 24}


def test_reason_falls_back_to_the_score_when_there_are_no_reasons(conn):
    assert proposals(conn, "C-9101")[2]["reason"] == "Mule risk score 72"


def test_left_out(conn):
    left_out = set(SCORES) - set(ids(proposals(conn, "C-9101")))
    # victim and wallet, score below 70, Rs 800 left, an active hold already open
    assert left_out == {VICTIM, WALLET, M3, M4, M5}


@pytest.mark.parametrize("status, blocks", [("requested", True), ("active", True), ("confirmed", True),
                                            ("expired", False), ("rejected", False), ("released", False)])
def test_only_an_open_hold_blocks_a_proposal(conn, status, blocks):
    add_hold(conn, M1, status)
    assert (M1 in ids(proposals(conn, "C-9101"))) is not blocks


def test_other_complaints_other_methods_and_blocked_rows_do_not_count(conn):
    add_move(conn, "C-9101", VICTIM, M4, 5000, method="lifo")
    add_move(conn, "C-9101", VICTIM, M4, 5000, status="blocked")
    add_complaint(conn, "C-9102")
    add_move(conn, "C-9102", VICTIM, M4, 9000)
    assert M4 not in ids(proposals(conn, "C-9101"))
    assert [(r["account_id"], r["amount"], r["complaint_id"]) for r in proposals(conn, "C-9102")] == [(M4, 9000, "C-9102")]


@pytest.mark.parametrize("victim, victim_upi", [(VICTIM, None), (None, VICTIM_UPI), (VICTIM, VICTIM_UPI)])
def test_victim_is_never_proposed(conn, victim, victim_upi):
    add_complaint(conn, "C-9102", victim, victim_upi)
    add_move(conn, "C-9102", M1, VICTIM, 5000)
    assert proposals(conn, "C-9102") == []


def test_victim_would_be_proposed_in_someone_elses_complaint(conn):
    add_complaint(conn, "C-9102", victim=M2)
    add_move(conn, "C-9102", M1, VICTIM, 5000)
    assert ids(proposals(conn, "C-9102")) == [VICTIM]


def test_settings_move_the_thresholds(conn):
    conn.execute("UPDATE settings SET value = '80'::jsonb WHERE key = 'hold_threshold'")
    assert ids(proposals(conn, "C-9101")) == [M6, M1]
    conn.execute("UPDATE settings SET value = '10000'::jsonb WHERE key = 'hold_min_amount_inr'")
    assert ids(proposals(conn, "C-9101")) == [M6, M1]
    conn.execute("UPDATE settings SET value = '10001'::jsonb WHERE key = 'hold_min_amount_inr'")
    assert ids(proposals(conn, "C-9101")) == [M6]


def test_nothing_is_stored(conn):
    count = "SELECT (SELECT count(*) FROM holds), (SELECT count(*) FROM audit_log), (SELECT count(*) FROM actions)"
    before = conn.execute(count).fetchone()
    assert proposals(conn, "C-9101")
    assert conn.execute(count).fetchone() == before


def test_unknown_complaint_has_no_proposals(conn):
    assert proposals(conn, "C-9999") == []
