"""Deterministic generator for the dummy_sources database (22 banks + crypto) and its ground truth.

    python -m pipeline.seed.seed_sources --dsn $BANK_DATABASE_URL_HOST --accounts 20000 --seed 42 \
        --now 2026-10-24T12:00:00Z --truth out/mule_truth.csv --reset

Only the dummy_sources database is touched. All data is fake."""
from __future__ import annotations

import argparse
import os
import random
import sys
import time
from datetime import datetime
from pathlib import Path

import numpy as np
import psycopg

from . import crypto as crypto_mod
from .background import Background
from .banks import load_banks
from .crypto import Crypto
from .finalize import assign_utrs, flag_failures
from .outputs import write_complaints, write_truth
from .profiles import build_population
from .scenarios import Scenarios
from .validate import validate
from .world import Clock
from .config import UTC
from .writers import WRITERS, flat_rupees, ledger, paise_epoch, payments_bank, split_datetime
from .writers.base import Ctx, q


def parse_args(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dsn", default=os.environ.get("BANK_DATABASE_URL_HOST") or os.environ.get("BANK_DATABASE_URL"),
                    help="dummy_sources database (default: $BANK_DATABASE_URL_HOST, then $BANK_DATABASE_URL)")
    ap.add_argument("--accounts", type=int, default=20000, help="number of accounts, 10k to 30k (min 2000)")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--now", default="2026-10-24T12:00:00Z", help="the demo 'present'; history is the 120 days before it")
    ap.add_argument("--truth", default="out/mule_truth.csv", help="ground-truth CSV (complaints CSVs are written beside it)")
    ap.add_argument("--reset", action="store_true", help="truncate all source tables first (otherwise refuse if non-empty)")
    ap.add_argument("--complaints", type=int, default=None, help="number of complaints (default 0.8%% of accounts)")
    a = ap.parse_args(argv)
    if not a.dsn:
        ap.error("no --dsn and neither BANK_DATABASE_URL_HOST nor BANK_DATABASE_URL is set")
    return a


def expected_schema(banks) -> dict[str, tuple]:
    exp: dict[str, tuple] = dict(crypto_mod.CRYPTO_SCHEMA)
    for code, bank in banks.items():
        if bank.family == "flat_rupees":
            s = flat_rupees.SPEC[code]
            exp[s["acc"]], exp[s["txn"]] = s["a"], s["t"]
        elif bank.family == "paise_epoch":
            s = paise_epoch.SPEC[code]
            exp[s["acc"]], exp[s["txn"]] = s["a"], s["t"]
        elif bank.family == "ledger":
            s = ledger.SPEC[code]
            exp[s["cust"]], exp[s["acc"]], exp[s["led"]] = s["c"], s["a"], s["l"]
        elif bank.family == "split_datetime":
            s = split_datetime.SPEC[code]
            exp[s["acc"]], exp[s["txn"]] = s["a"], s["t"]
        else:
            p = payments_bank.PREFIX[code]
            exp[f"{p}_wallets"], exp[f"{p}_payments"] = payments_bank.WALLET_COLS, payments_bank.PAY_COLS
    return exp


def preflight(conn, banks) -> list[str]:
    """Tables and columns must match the writers; ledger direction words must fit their columns."""
    cur = conn.cursor()
    cur.execute("SELECT table_name, column_name, character_maximum_length FROM information_schema.columns "
                "WHERE table_schema='public'")
    have: dict[str, dict[str, int | None]] = {}
    for t, c, n in cur:
        have.setdefault(t, {})[c] = n
    problems = []
    for table, cols in expected_schema(banks).items():
        if table not in have:
            problems.append(f"missing table {table}")
            continue
        for c in cols:
            if c not in have[table]:
                problems.append(f"missing column {table}.{c}")
    for code, s in ledger.SPEC.items():
        col = have.get(s["led"], {}).get(s["l"][3])
        for word in (s["dr"], s["cr"]):
            if col is not None and col < len(word):
                problems.append(f"{s['led']}.{s['l'][3]} is {col} characters wide but its CHECK allows '{word}' "
                                f"({len(word)}); widen the column in dummy_sources.sql")
    return problems


def tables_in_db(conn) -> list[str]:
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY 1")
    return [r[0] for r in cur]


def copy_rows(conn, table: str, cols, rows) -> int:
    n = 0
    with conn.cursor() as cur, cur.copy(f"COPY {table} ({', '.join(q(c) for c in cols)}) FROM STDIN") as cp:
        for r in rows:
            cp.write_row(r)
            n += 1
    return n


def main(argv=None) -> int:
    args = parse_args(argv)
    t_start = time.time()
    now = int(datetime.fromisoformat(args.now.replace("Z", "+00:00")).astimezone(UTC).timestamp())
    banks = load_banks()
    clock = Clock.at(now)
    rng = random.Random(args.seed)
    nprng = np.random.default_rng(args.seed)

    def stage(msg: str) -> None:
        print(f"[{time.time() - t_start:6.1f}s] {msg}", flush=True)

    conn = psycopg.connect(args.dsn)
    problems = preflight(conn, banks)
    if problems:
        print("schema check failed:\n  " + "\n  ".join(problems), file=sys.stderr)
        return 2
    tables = tables_in_db(conn)
    if args.reset:
        stage(f"truncating {len(tables)} tables")
        conn.cursor().execute("TRUNCATE " + ", ".join(tables) + " RESTART IDENTITY CASCADE")
        conn.commit()
    else:
        cur = conn.cursor()
        for t in tables:
            cur.execute(f"SELECT EXISTS (SELECT 1 FROM {t})")
            if cur.fetchone()[0]:
                print(f"{t} is not empty; refusing to run (use --reset to truncate)", file=sys.stderr)
                return 2

    stage(f"population: {args.accounts:,} accounts")
    world = build_population(args.accounts, banks, clock, args.seed, rng, nprng)
    crypto = Crypto(world, clock, rng)
    crypto.register_sellers(world.by_seg["p2p_seller"])
    n_complaints = args.complaints if args.complaints is not None else max(20, round(0.008 * args.accounts))
    sc = Scenarios(world, crypto, banks, rng, nprng, n_complaints)
    sc.plan()
    stage(f"{len(sc.rings) + 1} mule rings planned")
    Background(world, crypto, banks, rng, nprng).run()
    stage(f"ordinary traffic: {len(world.store):,} transfers")
    complaints = sc.execute()
    stage(f"scam flows: {sum(1 for k in world.store.kind if k):,} transfers, {len(complaints)} complaints")
    assign_utrs(world, rng)
    failed = flag_failures(world, rng)
    stage(f"{len(world.store):,} transfers in total, {failed:,} failed, {len(crypto.transfers):,} on chain")

    ctx = Ctx(world, banks, rng)
    stage("writing to the database")
    try:
        for code, bank in banks.items():
            for table, cols, rows in WRITERS[bank.family](ctx).tables(bank):
                copy_rows(conn, table, cols, rows)
        for table, cols, rows in crypto.tables():
            copy_rows(conn, table, cols, rows)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    stage("loaded")

    truth = Path(args.truth)
    n_truth = write_truth(truth, world, crypto)
    nc, npay = write_complaints(truth.parent, world, sc, crypto, rng)
    stage(f"wrote {truth} ({n_truth:,} rows), complaints.csv ({nc}), complaint_payments.csv ({npay})")

    print("\nvalidation")
    ok = validate(conn, world, ctx, crypto, sc, banks, WRITERS)

    sv = sc.showcase_victim
    va = world.accts[sv.acct]
    print(f"\nshowcase {sv.cid}: victim {va.ref} ({va.vpa}), lost Rs {sum(p.amt for p in sv.pays) // 100:,} in {len(sv.pays)} payments")
    for p in sv.pays:
        print(f"   {p.rail:<5} Rs {p.amt // 100:>9,}  UTR {world.store.utr[p.tidx]}  -> {world.accts[p.target].ref}")
    print(f"\n{'ALL CHECKS PASSED' if ok else 'VALIDATION FAILED'} in {time.time() - t_start:.0f}s")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
