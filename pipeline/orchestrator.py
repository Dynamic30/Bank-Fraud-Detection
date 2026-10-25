"""Orchestrator: for one complaint, pull the victim and the accused, then trace, pull what the trace reached and trace again.

Once the trail stops growing it scores the trail accounts, places prevention calls and computes hold proposals.

    python -m pipeline.orchestrator --complaint C-123
    python -m pipeline.orchestrator --due
"""
import argparse
import logging
from datetime import UTC, datetime, timedelta

from pipeline import tracer
from pipeline.audit import write_audit
from pipeline.bank_connections.bank_database import app_connect, connect, pull
from pipeline.hold_proposals import proposals
from pipeline.models import mule_detector
from pipeline.prevention_call import call_accounts

ACTOR = "system:orchestrator"
LOCK_KEY = 7_770_003
log = logging.getLogger(__name__)


def pull_all(account_ids, failures):
    transfers = 0
    for account_id in account_ids:
        try:
            transfers += pull(account_id)
        except Exception as e:
            failures.append(f"{account_id}: {e}")
    return transfers


def link_sellers(conn, failures):
    """Note on each P2P seller's bank account the TRON wallet it releases USDT from (the platform registry in the bank source)."""
    try:
        with connect() as bank:
            sellers = bank.execute("SELECT bank_code || ':' || bank_account_no, seller_wallet FROM crypto_p2p_sellers").fetchall()
    except Exception as e:
        failures.append(f"p2p registry: {e}")
        return
    conn.cursor().executemany("UPDATE accounts SET p2p_wallet = %s WHERE account_id = %s AND p2p_wallet IS DISTINCT FROM %s",
                              [(wallet, account_id, wallet) for account_id, wallet in sellers])


def trace_pass(conn, complaint_id, failures):
    link_sellers(conn, failures)
    traced = tracer.trace(conn, complaint_id)
    conn.commit()
    return traced


def victim_account(conn, complaint):
    if complaint["victim_account_id"]:
        return complaint["victim_account_id"]
    row = conn.execute("SELECT account_id FROM accounts WHERE upi_id = %s AND kind = 'bank'", (complaint["victim_upi_id"],)).fetchone()
    if not row:
        raise LookupError(f"victim {complaint['victim_upi_id']} not found in accounts")
    return row[0]


def accused_account(conn, complaint, victim, payment):
    """Link a reported payment to the real transfer (by UTR, else the victim's debit of the same amount within a day) -> accused account."""
    row = None
    if payment["utr"]:
        row = conn.execute("SELECT transfer_id, to_id FROM transfers WHERE utr = %s AND to_id IS NOT NULL AND status = 'done'",
                           (payment["utr"],)).fetchone()
    if not row and victim:
        at = payment["paid_at"] or complaint["fraud_time"]
        row = conn.execute(
            "SELECT transfer_id, to_id FROM transfers WHERE from_id = %s AND to_id IS NOT NULL AND status = 'done' AND amount = %s "
            "AND ts BETWEEN %s AND %s AND transfer_id NOT IN (SELECT matched_transfer_id FROM complaint_payments "
            "WHERE matched_transfer_id IS NOT NULL AND id <> %s) ORDER BY abs(extract(epoch FROM ts - %s)) LIMIT 1",
            (victim, payment["amount"], at - timedelta(days=1), at + timedelta(days=1), payment["id"], at)).fetchone()
    if row:
        conn.execute("UPDATE complaint_payments SET matched = TRUE, matched_transfer_id = %s WHERE id = %s", (row[0], payment["id"]))
        return row[1]
    if payment["paid_to_account_id"]:
        return payment["paid_to_account_id"]
    if payment["paid_to_upi_id"]:
        row = conn.execute("SELECT account_id FROM accounts WHERE upi_id = %s AND kind = 'bank'", (payment["paid_to_upi_id"],)).fetchone()
        return row[0] if row else None


def trail_nodes(conn, complaint_id):
    """Every account and wallet on the complaint's trail so far -> [(account_id, kind, fetched)]."""
    return conn.execute(
        "SELECT DISTINCT a.account_id, a.kind, a.fetched_at IS NOT NULL FROM victim_mapping vm "
        "JOIN accounts a ON a.account_id IN (vm.from_ref, vm.to_ref) WHERE vm.complaint_id = %s AND vm.method = %s ORDER BY 1",
        (complaint_id, tracer.METHOD)).fetchall()


def run(complaint_id):
    with app_connect() as conn:
        if not conn.execute("SELECT pg_try_advisory_lock(%s, hashtext(%s))", (LOCK_KEY, complaint_id)).fetchone()[0]:
            return {"skipped": True}
        cur = conn.execute("SELECT * FROM complaints WHERE id = %s", (complaint_id,))
        complaint = dict(zip([c.name for c in cur.description], cur.fetchone()))
        cur = conn.execute("SELECT * FROM complaint_payments WHERE complaint_id = %s AND destination_type = 'bank' ORDER BY id", (complaint_id,))
        payments = [dict(zip([c.name for c in cur.description], r)) for r in cur.fetchall()]
        conn.execute("UPDATE complaints SET status = 'tracing' WHERE id = %s AND status = 'open'", (complaint_id,))
        conn.commit()

        failures = []
        try:
            victim = victim_account(conn, complaint)
        except LookupError as e:
            victim = None
            failures.append(str(e))
        pulled = {victim} if victim else set()
        transfers = pull_all(pulled, failures)
        accused = {a for a in (accused_account(conn, complaint, victim, p) for p in payments) if a}
        transfers += pull_all(accused - pulled, failures)
        pulled |= accused
        # a re-run reads what arrived at the trail since the last one
        earlier = {account_id for account_id, _, fetched in trail_nodes(conn, complaint_id) if fetched} - pulled
        transfers += pull_all(sorted(earlier), failures)
        pulled |= earlier
        conn.commit()

        max_hops = int(mule_detector.setting(conn, "max_hops", 12))
        traced = trace_pass(conn, complaint_id, failures)
        traces = 1
        while traces <= max_hops:
            nodes = [n for n in traced["pull"] if n not in pulled]
            if not nodes:
                break
            transfers += pull_all(nodes, failures)
            pulled |= set(nodes)
            traced = trace_pass(conn, complaint_id, failures)
            traces += 1

        trail = [account_id for account_id, kind, _ in trail_nodes(conn, complaint_id) if kind == "bank" and account_id != victim]
        flagged = mule_detector.run(conn, account_ids=trail)[1]["flagged"] if trail else 0
        conn.commit()

        calls, holds = 0, 0
        try:
            calls = call_accounts(conn, trail, complaint_id)
        except Exception:
            log.exception("prevention calls for %s failed", complaint_id)
            conn.rollback()
        try:
            holds = len(proposals(conn, complaint_id))
        except Exception:
            log.exception("hold proposals for %s failed", complaint_id)
            conn.rollback()

        conn.execute("UPDATE complaints SET last_traced_at = %s WHERE id = %s", (datetime.now(UTC).replace(tzinfo=None), complaint_id))
        summary = dict(complaint=complaint_id, accounts=len(trail), rows=traced["rows"], transfers=transfers, hops=traced["hops"],
                       traces=traces, failures=failures, flagged=flagged, calls=calls, proposals=holds)
        write_audit(conn, ACTOR, "TRACE", f"Traced {traced['rows']} transfers over {traced['hops']} hops to {len(trail)} accounts, "
                    f"{transfers} transfers read, {len(failures)} failures, {flagged} flagged, {calls} prevention calls, "
                    f"{holds} hold proposals", complaint_id)
        conn.commit()
    return summary


def due(conn):
    minutes = mule_detector.setting(conn, "retrace_minutes", 25)
    cutoff = datetime.now(UTC).replace(tzinfo=None) - timedelta(minutes=minutes)
    rows = conn.execute("SELECT id FROM complaints WHERE status = 'tracing' AND (last_traced_at IS NULL OR last_traced_at < %s) ORDER BY id",
                        (cutoff,)).fetchall()
    return [r[0] for r in rows]


def run_due():
    """Re-trace every complaint that is due; returns how many ran."""
    with app_connect() as conn:
        ids = due(conn)
    ran = 0
    for complaint_id in ids:
        try:
            if not run(complaint_id).get("skipped"):
                ran += 1
        except Exception:
            log.exception("re-trace of %s failed", complaint_id)
    return ran


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--complaint", help="trace this complaint id")
    ap.add_argument("--due", action="store_true", help="trace every tracing complaint that is due for a re-trace")
    args = ap.parse_args(argv)
    if args.complaint:
        print(run(args.complaint))
    elif args.due:
        print(f"{run_due()} complaints traced")
    else:
        ap.error("give --complaint ID or --due")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
