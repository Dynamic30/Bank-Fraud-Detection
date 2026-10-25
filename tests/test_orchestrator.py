from datetime import datetime, timedelta

import psycopg
from psycopg.rows import dict_row

from pipeline.orchestrator import accused_account

AT = datetime(2026, 10, 1, 12)


def test_payment_without_utr_matches_the_victims_closest_debit(db_url):
    with psycopg.connect(db_url) as conn:
        try:
            for account in ("SBI:T1", "HDFC:T2", "HDFC:T3"):
                conn.execute("INSERT INTO accounts (account_id, kind, bank_id) VALUES (%s, 'bank', %s)", (account, account.split(":")[0]))
            for id, to, ts in ((9_100_001, "HDFC:T2", AT - timedelta(hours=5)), (9_100_002, "HDFC:T3", AT + timedelta(minutes=10))):
                conn.execute("INSERT INTO transfers (transfer_id, source, source_ref, from_id, to_id, amount, ts, rail) "
                             "VALUES (%s, 'bank', %s, 'SBI:T1', %s, 5000, %s, 'UPI')", (id, f"T-{id}", to, ts))
            conn.execute("INSERT INTO complaints (id, name, scam_type, total_lost, fraud_time, reported_at) "
                         "VALUES ('C-9901', 'Test', 'upi', 10000, %s, %s)", (AT, AT))
            for _ in range(2):
                conn.execute("INSERT INTO complaint_payments (complaint_id, amount, paid_at) VALUES ('C-9901', 5000, %s)", (AT,))
            payments = conn.cursor(row_factory=dict_row).execute("SELECT * FROM complaint_payments WHERE complaint_id = 'C-9901' ORDER BY id").fetchall()

            complaint = {"fraud_time": AT}
            assert accused_account(conn, complaint, "SBI:T1", payments[0]) == "HDFC:T3"
            assert accused_account(conn, complaint, "SBI:T1", payments[1]) == "HDFC:T2"
            assert conn.execute("SELECT count(*) FROM complaint_payments WHERE complaint_id = 'C-9901' AND matched").fetchone()[0] == 2
            assert accused_account(conn, complaint, "SBI:T1", dict(payments[0], amount=777)) is None
        finally:
            conn.rollback()
            conn.execute("DELETE FROM complaint_payments WHERE complaint_id = 'C-9901'")
            conn.execute("DELETE FROM transfers WHERE from_id = 'SBI:T1'")
            conn.execute("DELETE FROM complaints WHERE id = 'C-9901'")
            conn.execute("DELETE FROM accounts WHERE account_id IN ('SBI:T1', 'HDFC:T2', 'HDFC:T3')")
            conn.commit()
