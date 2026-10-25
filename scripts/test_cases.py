"""Print ready-to-type test cases for the app from the seeder's complaint files.

    python scripts/test_cases.py                 # reads out/complaints.csv and out/complaint_payments.csv
    python scripts/test_cases.py --dir out --n 20 --write out/test_cases.md

Each case is a complaint the seeder planted in the fake bank database. File it in the app as shown and the orchestrator
finds the payment by its UTR, then follows the money. Only the biggest payment goes in the form; the rest of the trail is
found from the victim account.
"""
import argparse
import csv
from collections import defaultdict
from datetime import datetime
from pathlib import Path

LABEL = {"kyc_update": "Fake bank / KYC call", "digital_arrest": "Digital arrest", "investment_task": "Investment / trading",
         "job_part_time": "Fake job", "upi_collect": "Other", "sextortion": "Other"}
SHOWCASE = "C-3021"
MIN_FIRST = 5000  # smaller first payments split into dust and give a one-line trail
WANT = {"job_part_time": 5, "investment_task": 5, "kyc_update": 5, "digital_arrest": 3, "upi_collect": 1, "sextortion": 1}


def read(path):
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def spread(items, k):
    """k items from a list, evenly spaced from first to last."""
    if k <= 0 or not items:
        return []
    if k >= len(items):
        return items
    return [items[round(i * (len(items) - 1) / (k - 1 if k > 1 else 1))] for i in range(k)] if k > 1 else [items[len(items) // 2]]


def choose(complaints, payments, n):
    by_id = {c["id"]: c for c in complaints}
    # only bank payments are traced (crypto-destination complaints give no trail yet)
    # the form takes one payment: use the biggest, which gives the deepest trail (a small first payment often just sits in the account)
    first = {cid: max(p, key=lambda x: float(x["amount"])) for cid, p in payments.items() if cid in by_id}
    first = {cid: p for cid, p in first.items() if p["destination_type"] == "bank" and float(p["amount"]) >= MIN_FIRST}
    picked = [SHOWCASE] if SHOWCASE in first else []
    for kind, count in WANT.items():
        pool = sorted([cid for cid, c in by_id.items() if c["scam_type"] == kind and cid in first and cid not in picked
                       ], key=lambda cid: float(by_id[cid]["total_lost"]))
        picked += spread(pool, count)
    rest = [cid for cid in sorted(first) if cid not in picked]
    picked += rest[: max(0, n - len(picked))]
    return picked[:n], by_id, first


def inr(x):
    s, neg = f"{abs(float(x)):.0f}", ""
    if len(s) > 3:
        head, tail = s[:-3], s[-3:]
        parts = []
        while len(head) > 2:
            parts.insert(0, head[-2:])
            head = head[:-2]
        s = ",".join(([head] if head else []) + parts + [tail])
    return f"₹{neg}{s}"


def render(cids, by_id, first, payments, n_main):
    out = ["# Test cases", "",
           "File each one as the **consumer** (My complaints → ＋ File a complaint), or as the officer. Leave Type of scam as shown.",
           "The trace starts by itself; the trail appears in about a minute. Re-run a case with the command at the bottom.", ""]
    for i, cid in enumerate(cids, 1):
        if i == n_main + 1:
            out += ["# Spare cases", "",
                    "If a trail shows only one hop, the money is still sitting in the first account (the oldest money leaves first). "
                    "That is a valid result, not an error; use a spare for a longer trail.", ""]
        c, p = by_id[cid], first[cid]
        when = datetime.fromisoformat(p["paid_at"])
        ref = p["utr"] or p["paid_to_upi_id"]
        n = len(payments[cid])
        label = f"Test {i}" if i <= n_main else f"Spare {i - n_main}"
        out += [f"## {label} · {cid} · {LABEL.get(c['scam_type'], 'Other')} · {inr(c['total_lost'])} lost in {n} payment{'s' if n != 1 else ''}",
                f"- Name: {c['name']}", f"- City: {c['city']}", f"- Account the money left from: `{c['victim_account_id']}`",
                f"- Type of scam: {LABEL.get(c['scam_type'], 'Other')}", f"- Amount lost: `{float(p['amount']):.0f}`",
                f"- When: date `{when:%Y-%m-%d}`, time `{when:%H:%M}`",
                "- Where did the money go: bank", f"- UTR or UPI ID: `{ref}`", ""]
    out += ["## Re-run a case", "",
            "```", "python -m pipeline.orchestrator --complaint C-9001     # the id the app gave your complaint", "```",
            "Needs APP_DATABASE_URL and BANK_DATABASE_URL set. It re-reads the bank database and rewrites the trail (safe to repeat).", ""]
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--dir", default="out", help="folder with complaints.csv and complaint_payments.csv")
    ap.add_argument("--n", type=int, default=20)
    ap.add_argument("--spares", type=int, default=5, help="extra cases listed after the main ones")
    ap.add_argument("--write", help="also save the cases to this file")
    a = ap.parse_args()
    complaints = read(Path(a.dir) / "complaints.csv")
    payments = defaultdict(list)
    for row in read(Path(a.dir) / "complaint_payments.csv"):
        payments[row["complaint_id"]].append(row)
    cids, by_id, first = choose(complaints, payments, a.n + a.spares)
    text = render(cids, by_id, first, payments, a.n)
    print(text)
    if a.write:
        Path(a.write).write_text(text)
        print(f"saved to {a.write}")


if __name__ == "__main__":
    main()
