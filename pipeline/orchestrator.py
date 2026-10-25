"""Orchestrator: for one complaint, pull the money graph from the banks into the app DB, then score it.

    python -m pipeline.orchestrator --complaint C-123
    python -m pipeline.orchestrator --due
"""
import argparse
from datetime import UTC, datetime, timedelta

from pipeline.audit import write_audit
from pipeline.bank_connections.bank_database import app_connect, pull
from pipeline.models import mule_detector

ACTOR = "system:orchestrator"


def pull_all(account_ids, failures):
    transfers = 0
    for account_id in account_ids:
        try:
            transfers += pull(account_id)
        except Exception as e:
            failures.append(f"{account_id}: {e}")
    return transfers


def victim_account(conn, complaint):
    if complaint["victim_account_id"]:
        return complaint["victim_account_id"]
    row = conn.execute("SELECT account_id FROM accounts WHERE upi_id = %s AND kind = 'bank'", (complaint["victim_upi_id"],)).fetchone()
    if not row:
        raise LookupError(f"victim {complaint['victim_upi_id']} not found in accounts")
    return row[0]


def accused_account(conn, payment):
    if payment["utr"]:
        row = conn.execute("SELECT transfer_id, to_id FROM transfers WHERE utr = %s AND to_id IS NOT NULL AND status = 'done'",
                           (payment["utr"],)).fetchone()
        if row:
            conn.execute("UPDATE complaint_payments SET matched = TRUE, matched_transfer_id = %s WHERE id = %s", (row[0], payment["id"]))
            return row[1]
    if payment["paid_to_account_id"]:
        return payment["paid_to_account_id"]
    if payment["paid_to_upi_id"]:
        row = conn.execute("SELECT account_id FROM accounts WHERE upi_id = %s AND kind = 'bank'", (payment["paid_to_upi_id"],)).fetchone()
        return row[0] if row else None


def next_hop(conn, layer, graph, fraud_time, min_amount):
    rows = conn.execute(
        "SELECT DISTINCT t.to_id FROM transfers t JOIN accounts a ON a.account_id = t.to_id "
        "WHERE t.from_id = ANY(%s) AND t.status = 'done' AND t.amount >= %s AND t.ts >= %s AND a.kind = 'bank'",
        (list(layer), min_amount, fraud_time)).fetchall()
    return {r[0] for r in rows} - graph


def run(complaint_id):
    with app_connect() as conn:
        conn.execute("SELECT pg_advisory_lock(hashtext(%s))", (complaint_id,))
        cur = conn.execute("SELECT * FROM complaints WHERE id = %s", (complaint_id,))
        complaint = dict(zip([c.name for c in cur.description], cur.fetchone()))
        cur = conn.execute("SELECT * FROM complaint_payments WHERE complaint_id = %s AND destination_type = 'bank' ORDER BY id", (complaint_id,))
        payments = [dict(zip([c.name for c in cur.description], r)) for r in cur.fetchall()]
        conn.execute("UPDATE complaints SET status = 'tracing' WHERE id = %s AND status = 'open'", (complaint_id,))
        conn.commit()

        failures = []
        try:
            graph = {victim_account(conn, complaint)}
        except LookupError as e:
            graph = set()
            failures.append(str(e))
        transfers = pull_all(graph, failures)
        accused = {a for a in (accused_account(conn, p) for p in payments) if a}
        transfers += pull_all(accused - graph, failures)
        graph |= accused
        conn.commit()

        min_amount = mule_detector.setting(conn, "min_trace_amount", 0)
        max_hops = mule_detector.setting(conn, "max_hops", 12)
        layer, hops = graph, 0
        while hops < max_hops:
            layer = next_hop(conn, layer, graph, complaint["fraud_time"], min_amount)
            if not layer:
                break
            transfers += pull_all(layer, failures)
            graph |= layer
            hops += 1

        # next piece: tracer (victim_mapping) is called here with conn, complaint_id

        _, scores = mule_detector.run(conn, account_ids=list(graph))
        conn.execute("UPDATE complaints SET last_traced_at = %s WHERE id = %s", (datetime.now(UTC).replace(tzinfo=None), complaint_id))
        summary = dict(complaint=complaint_id, accounts=len(graph), transfers=transfers, hops=hops, failures=failures,
                       flagged=scores["flagged"])
        write_audit(conn, ACTOR, "TRACE", f"Traced {len(graph)} accounts over {hops} hops, {transfers} transfers read, "
                    f"{len(failures)} failures, {scores['flagged']} flagged", complaint_id)
        conn.commit()
    return summary


def due(conn):
    minutes = mule_detector.setting(conn, "retrace_minutes", 25)
    cutoff = datetime.now(UTC).replace(tzinfo=None) - timedelta(minutes=minutes)
    rows = conn.execute("SELECT id FROM complaints WHERE status = 'tracing' AND (last_traced_at IS NULL OR last_traced_at < %s) ORDER BY id",
                        (cutoff,)).fetchall()
    return [r[0] for r in rows]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--complaint", help="trace this complaint id")
    ap.add_argument("--due", action="store_true", help="trace every tracing complaint that is due for a re-trace")
    args = ap.parse_args(argv)
    if args.complaint:
        ids = [args.complaint]
    elif args.due:
        with app_connect() as conn:
            ids = due(conn)
    else:
        ap.error("give --complaint ID or --due")
    for complaint_id in ids:
        print(run(complaint_id))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
