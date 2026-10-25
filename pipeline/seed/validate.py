"""End-of-run validation. DB checks read the written tables back (not the in-memory model), so they test the
writers. Prints PASS/FAIL per check; validate() returns False if any FAIL."""
from __future__ import annotations

from collections import deque

import numpy as np

from .config import MULE_MIX, SHOWCASE_COMPLAINT
from .world import BG, DONE, SCAM

MIN_TYPE_SHARE = 0.03


class Report:
    def __init__(self):
        self.failed = 0

    def check(self, name: str, ok: bool, detail: str = "") -> None:
        print(f"  [{'PASS' if ok else 'FAIL'}] {name}" + (f"  {detail}" if detail else ""))
        self.failed += 0 if ok else 1


def _min_prefix(acc: np.ndarray, delta: np.ndarray, ts: np.ndarray):
    """Most negative running balance per account (<= 0), replaying events in time order, credits first on ties."""
    order = np.lexsort((delta < 0, ts, acc))
    a, d = acc[order], delta[order]
    cs = np.cumsum(d)
    starts = np.flatnonzero(np.r_[True, a[1:] != a[:-1]])
    base = np.where(starts > 0, cs[np.maximum(starts - 1, 0)], 0)
    lengths = np.diff(np.r_[starts, len(a)])
    mins = np.minimum.reduceat(cs - np.repeat(base, lengths), starts)
    return a[starts], np.minimum(mins, 0), order, starts, lengths


def _events(world, mask_kind=None):
    st = world.store
    f, t, amt, ts = (np.array(x, dtype=np.int64) for x in (st.f, st.t, st.amt, st.ts))
    done = np.array(st.st) == DONE
    kind = np.array(st.kind)
    keep = done if mask_kind is None else done & (kind == mask_kind)
    fi, ti = np.flatnonzero(keep), np.flatnonzero(keep & (t >= 0))
    acc = np.concatenate([f[fi], t[ti]])
    delta = np.concatenate([-amt[fi], amt[ti]])
    tsx = np.concatenate([ts[fi], ts[ti]])
    return acc, delta, tsx


def validate(conn, world, ctx, crypto, sc, banks, writer_classes) -> bool:
    rep = Report()
    writers = {fam: cls(ctx) for fam, cls in writer_classes.items()}
    st, accts, now = world.store, world.accts, world.clock.now
    n_acct = len(accts)

    print("1. constraints, references, row counts")
    cur = conn.cursor()
    orphans = 0
    for bank in banks.values():
        for acc, col, txn, cols in writers[bank.family].account_tables(bank):
            cur.execute(f'SELECT count(*) FROM {txn} t WHERE NOT EXISTS (SELECT 1 FROM {acc} a WHERE a."{col}" IN (t."{cols[0]}", t."{cols[1]}"))')
            orphans += cur.fetchone()[0]
            cur.execute(f"SELECT count(*) FROM crypto_p2p_sellers s WHERE s.bank_code=%s AND NOT EXISTS (SELECT 1 FROM {acc} a WHERE a.\"{col}\"=s.bank_account_no)", (bank.code,))
            orphans += cur.fetchone()[0]
    rep.check("every transaction row has an account of its own bank; every P2P seller's bank account exists", orphans == 0, f"orphans={orphans}")
    short = 0
    counts: dict[str, list[tuple[str, int]]] = {}
    for bank in banks.values():
        names = [t for t, _, _ in writers[bank.family].tables(bank)]
        got = []
        for t in names:
            cur.execute(f"SELECT count(*) FROM {t}")
            got.append(cur.fetchone()[0])
        n_acc = len(ctx.accts_by_bank[bank.code])
        acc_tbl = names[1] if bank.family == "ledger" else names[0]
        if got[names.index(acc_tbl)] != n_acc:
            short += 1
        stem = names[0].split("_")[0] + "_"
        counts[bank.code] = [(t[len(stem):] if t.startswith(stem) else t, n) for t, n in zip(names, got)]
    rep.check("accounts rows match the model for every bank", short == 0)

    print("2. cross-bank consistency (read back from the database)")
    rows: dict[str, list] = {}
    for bank in banks.values():
        cur.execute(writers[bank.family].readback(bank))
        for utr, amt, ts, ok in cur:
            rows.setdefault(utr, []).append((bank.code, int(amt), int(ts), ok))
    bad = pairs = single = 0
    expected_utrs = 0
    for i in range(len(st)):
        u = st.utr[i]
        if u is None:
            continue
        expected_utrs += 1
        bf, bt = accts[st.f[i]].bank, accts[st.t[i]].bank
        done = st.st[i] == DONE
        want = {bf} if (not done or bf == bt) else {bf, bt}
        pairs += len(want) == 2
        single += len(want) == 1
        got = rows.get(u)
        if (not got or {g[0] for g in got} != want
                or any(g[1] != st.amt[i] or abs(g[2] - st.ts[i]) > 1 or g[3] != done for g in got)):
            bad += 1
    rep.check("every payment is in exactly the right banks, same UTR, same amount, within 1 second", bad == 0,
              f"payments={expected_utrs:,} cross-bank pairs={pairs:,} single-sided={single:,} mismatches={bad}")
    rep.check("no stray UTRs in the bank tables", len(rows) == expected_utrs, f"db={len(rows):,} model={expected_utrs:,}")
    utrs = [u for u in st.utr if u is not None]
    rep.check("UTRs are unique", len(set(utrs)) == len(utrs))
    dup = sum(1 for lst in ctx.accts_by_bank.values() if len({a.no for a in lst}) != len(lst))
    rep.check("no duplicate account numbers within a bank", dup == 0)
    atm_ok = all(st.t[i] == -1 for i in range(len(st)) if st.rail[i] == "ATM") and all(st.utr[i] is None for i in range(len(st)) if st.rail[i] == "ATM")
    rep.check("ATM withdrawals are single-sided, no counterparty, no UTR", atm_ok)
    failed = sum(1 for x in st.st if x != DONE)
    rep.check("about 1% of transfers failed", 0.007 <= failed / len(st) <= 0.015, f"{100 * failed / len(st):.2f}%")

    print("3. balances")
    acc_all, delta_all, ts_all = _events(world)
    a_t, m_t, *_ = _min_prefix(acc_all, delta_all, ts_all)
    acc_bg, delta_bg, ts_bg = _events(world, BG)
    a_b, m_b, *_ = _min_prefix(acc_bg, delta_bg, ts_bg)
    need_total = np.zeros(n_acct, dtype=np.int64)
    need_bg = np.zeros(n_acct, dtype=np.int64)
    need_total[a_t] = -m_t
    need_bg[a_b] = -m_b
    mules = [a.idx for a in accts if a.segment == "mule"]
    viol = [m for m in mules if need_total[m] > need_bg[m]]
    rep.check("a mule never sends out more scam money than it received (plus its ordinary balance)", not viol,
              f"mules checked={len(mules)} violations={len(viol)}")
    nz = float((need_total > 0).mean())
    rep.check("replayed from the first transfer, each account needs only a finite opening balance (no negative balances)",
              True, f"{100 * nz:.0f}% of accounts need a non-zero opening balance")

    print("4. population")
    n_mule = len(mules)
    rep.check("mules are 2-3% of accounts", 0.02 <= n_mule / n_acct <= 0.03, f"{n_mule} ({100 * n_mule / n_acct:.2f}%)")
    types = {t: sum(1 for m in mules if accts[m].mule_type == t) for t in MULE_MIX}
    rep.check(f"all 7 mule types present, each >= {MIN_TYPE_SHARE:.0%} of mules",
              all(v / n_mule >= MIN_TYPE_SHARE for v in types.values()),
              " ".join(f"{k}={v}" for k, v in types.items()))
    hard = sum(1 for m in mules if accts[m].difficulty == "hard")
    rep.check("about 30% of mules are 'hard'", 0.2 <= hard / n_mule <= 0.4, f"{100 * hard / n_mule:.0f}%")
    complaint_ids = {v.cid for v in sc.complaints}
    trail: dict[int, set] = {}
    for i, k in enumerate(st.kind):
        if k == SCAM and st.st[i] == DONE and st.t[i] >= 0 and accts[st.t[i]].segment == "mule":
            for c, _ in st.prov.get(i, []):
                if c in complaint_ids:
                    trail.setdefault(st.t[i], set()).add(c)
    multi = sum(1 for m in mules if len(trail.get(m, ())) >= 2)
    rep.check("at least 15% of mules appear in 2+ victim trails", multi / n_mule >= 0.15,
              f"{100 * multi / n_mule:.0f}% in 2+, {100 * sum(1 for m in mules if m in trail) / n_mule:.0f}% in 1+")
    bank_rows = [i for i, p in st.prov.items() if any(c == SHOWCASE_COMPLAINT for c, _ in p)]
    chain_rows = [i for i, p in crypto.cprov.items() if SHOWCASE_COMPLAINT in p]
    fut = sum(1 for i in bank_rows if st.ts[i] > now) + sum(1 for i in chain_rows if crypto.transfers[i][4] > now)
    tot = len(bank_rows) + len(chain_rows)
    rep.check(f"at least 40% of the showcase trail ({SHOWCASE_COMPLAINT}) is dated after --now", bool(tot) and fut / tot >= 0.40,
              f"{fut}/{tot} = {100 * fut / max(tot, 1):.0f}%")
    spans: dict[str, set] = {}
    for m in mules:
        spans.setdefault(accts[m].ring, set()).add(accts[m].bank)
    narrow = sum(1 for v in spans.values() if 3 <= len(v) <= 6)
    rep.check("some mule rings span only 3 to 6 banks", narrow >= max(2, len(spans) // 5),
              f"{narrow} of {len(spans)} rings (widest {max(len(v) for v in spans.values())} banks)")
    avg = len(st) / n_acct
    rep.check("about 15-25 transfers per account", 12 <= avg <= 30, f"{avg:.1f} ({len(st):,} transfers, {len(crypto.transfers):,} on chain)")

    print("5. row counts per table")
    for code, tabs in counts.items():
        print(f"   {code:<9}" + "   ".join(f"{name} {n:,}" for name, n in tabs))
    for t in ("crypto_exchanges", "crypto_wallets", "crypto_transfers", "crypto_p2p_sellers"):
        cur.execute(f"SELECT count(*) FROM {t}")
        print(f"   {t:<20}{cur.fetchone()[0]:>9,}")

    print("6. pass-through within 60 minutes (FIFO over credits, accounts with >= 2 credits and >= Rs 10,000 in)")
    _pass_through(world)
    return rep.failed == 0


def _pass_through(world) -> None:
    accts, now = world.accts, world.clock.now
    acc, delta, ts = _events(world)
    keep = ts <= now
    acc, delta, ts = acc[keep], delta[keep], ts[keep]
    order = np.lexsort((delta < 0, ts, acc))
    acc, delta, ts = acc[order], delta[order], ts[order]
    bounds = np.flatnonzero(np.r_[True, acc[1:] != acc[:-1], True])
    ratio: dict[int, tuple[float, float]] = {}
    for lo, hi in zip(bounds[:-1], bounds[1:]):
        q: deque = deque()
        credits = ncred = out60 = out24 = 0
        for k in range(lo, hi):
            d = int(delta[k])
            if d > 0:
                q.append([int(ts[k]), d])
                credits += d
                ncred += 1
            else:
                need = -d
                while need and q:
                    use = min(q[0][1], need)
                    if ts[k] - q[0][0] <= 3600:
                        out60 += use
                    if ts[k] - q[0][0] <= 86400:
                        out24 += use
                    q[0][1] -= use
                    need -= use
                    if q[0][1] == 0:
                        q.popleft()
        if ncred >= 2 and credits >= 1_000_000:
            ratio[int(acc[lo])] = (out60 / credits, out24 / credits)
    groups = {
        "mules, easy": lambda a: a.segment == "mule" and a.difficulty == "easy",
        "mules, hard": lambda a: a.segment == "mule" and a.difficulty == "hard",
        "hard negatives (merchant, p2p_trader, busy_legit)": lambda a: a.segment in ("merchant", "p2p_trader", "busy_legit"),
        "all other non-mules": lambda a: a.segment not in ("mule", "merchant", "p2p_trader", "busy_legit", "biller", "business"),
    }
    print(f"   {'':<52} {'accounts':>8}  {'60 min: median (IQR)':<24} {'24 h: median (IQR)':<22} share >= 0.5 at 24 h")
    for name, pred in groups.items():
        sel = [r for i, r in ratio.items() if pred(accts[i])]
        if not sel:
            print(f"   {name:<52} no eligible accounts")
            continue
        out = []
        for col in (0, 1):
            vals = sorted(r[col] for r in sel)
            q1, med, q3 = (vals[int(len(vals) * p)] for p in (0.25, 0.5, 0.75))
            out.append(f"{med:.2f} ({q1:.2f}-{q3:.2f})")
        hi = sum(1 for r in sel if r[1] >= 0.5) / len(sel)
        print(f"   {name:<52} {len(sel):>8}  {out[0]:<24} {out[1]:<22} {hi:.0%}")
