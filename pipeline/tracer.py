"""Tracer: follows one complaint's money through the local tables (FIFO) and writes victim_mapping.

Reads accounts, transfers, complaint_payments and settings only, never a bank database. The victim's matched payments seed
the first tainted lots; every later transfer carries the tainted share of the sender's oldest lots.
"""
from collections import defaultdict, deque
from datetime import UTC, datetime, timedelta
from decimal import ROUND_DOWN, Decimal
from typing import NamedTuple

from pipeline.bank_connections.bank_database import demo_clock
from pipeline.models.mule_detector import dict_rows, setting

METHOD = "fifo"
STOPS = {"exchange_deposit", "exchange_hot", "bridge", "mixer"}
CENT, MICRO, TOLERANCE = Decimal("0.01"), Decimal("0.000001"), Decimal("0.1")
COLUMNS = ("hop", "leg", "from_ref", "to_ref", "from_bank", "to_bank", "traced_amount", "asset", "asset_amount")


class Tr(NamedTuple):
    id: int
    ts: datetime
    amount: Decimal
    frm: str
    to: str | None
    asset: str


def wallet_ref(address):
    return f"TRON:{address}" if address and not address.startswith("TRON:") else address


def take(lots, amount):
    """Remove `amount` from the oldest lots [left, tainted, hop] -> (tainted part, lowest hop among the tainted lots)."""
    tainted, hop = Decimal(0), 0
    while amount > 0 and lots:
        lot = lots[0]
        used = min(lot[0], amount)
        share = lot[1] if used == lot[0] else lot[1] * used / lot[0]
        if share > 0:
            tainted += share
            hop = min(hop, lot[2]) if hop else lot[2]
        lot[0] -= used
        lot[1] -= share
        amount -= used
        if lot[0] <= 0:
            lots.popleft()
    return tainted, hop


def release_of(t, seller, chain, claimed, rate, window):
    """The unclaimed USDT release out of the seller's wallet that best pays for rupee transfer `t`.

    It follows `t` within `window` and is worth `t` at `rate` give or take 10%; the closest in value wins.
    """
    fits = [c for c in chain.get(seller, ()) if c.id not in claimed and (t.ts, t.id) < (c.ts, c.id) and c.ts <= t.ts + window
            and abs(c.amount * rate - t.amount) <= t.amount * TOLERANCE]
    return min(fits, key=lambda c: abs(c.amount * rate - t.amount), default=None)


def sweep(transfers, accounts, seeds, min_amount, max_hops, rate, window):
    """Pure FIFO sweep -> victim_mapping rows (dicts of COLUMNS plus transfer_id), oldest transfer first.

    transfers: done transfers [Tr]; accounts: {account_id: row with bank_id, wallet_kind, opening_balance, p2p_wallet};
    seeds: {transfer_id: amount the victim reported}. A rupee payment into an account with p2p_wallet is paid on in USDT:
    the seller's release that matches it in value (at `rate`) and in time (within `window` after it) is traced instead of
    the account's own outflows.
    """
    order = sorted(transfers, key=lambda t: (t.ts, t.id))
    chain = defaultdict(list)
    for t in order:
        if t.asset != "INR":
            chain[t.frm].append(t)
    forced = {tid: (amount, 0) for tid, amount in seeds.items()}    # preset taint (seeds, matched USDT releases): id -> (tainted, hop before)
    lots, rows = {}, []

    def info(ref, key):
        return accounts.get(ref, {}).get(key)

    def book(ref):
        if ref not in lots:
            opening = Decimal(info(ref, "opening_balance") or 0)
            lots[ref] = deque([[opening, Decimal(0), 0]] if opening > 0 else [])
        return lots[ref]

    for t in order:
        tainted, hop = take(book(t.frm), t.amount)
        if t.id in forced:
            tainted, hop = forced[t.id]
        crypto = t.asset != "INR"
        taint = min(tainted, t.amount).quantize(MICRO if crypto else CENT, ROUND_DOWN)
        traced = (taint * rate if crypto else taint).quantize(CENT, ROUND_DOWN)
        hop += 1
        recorded = taint > 0 and traced >= max(min_amount, CENT) and hop <= max_hops
        if recorded:
            rows.append(dict(transfer_id=t.id, hop=hop, leg="crypto" if crypto else "bank", from_ref=t.frm, to_ref=t.to or "CASH",
                             from_bank=info(t.frm, "bank_id"), to_bank=info(t.to, "bank_id"), traced_amount=traced,
                             asset=t.asset if crypto else None, asset_amount=taint if crypto else None))
        if t.to is None:
            continue
        seller = wallet_ref(info(t.to, "p2p_wallet"))
        stops = bool(seller) or info(t.to, "wallet_kind") in STOPS
        book(t.to).append([t.amount, taint if recorded and not stops else Decimal(0), hop])
        release = release_of(t, seller, chain, forced, rate, window) if recorded and seller else None
        if release:
            forced[release.id] = (release.amount * taint / t.amount, hop)
    return rows


def pull_next(rows, accounts, max_hops):
    """Trail nodes whose own transfers are not local yet: stubs that took tainted money, and the wallets of P2P sellers it reached."""
    nodes = set()
    for r in rows:
        if r["hop"] >= max_hops or r["to_ref"] == "CASH":
            continue
        to = accounts.get(r["to_ref"], {})
        if to.get("fetched_at") is None and to.get("wallet_kind") not in STOPS:
            nodes.add(r["to_ref"])
        seller = wallet_ref(to.get("p2p_wallet"))
        if seller and accounts.get(seller, {}).get("fetched_at") is None:
            nodes.add(seller)
    return sorted(nodes)


def save(conn, complaint_id, rows):
    sets = ", ".join(f"{c} = excluded.{c}" for c in COLUMNS)
    old = ", ".join(f"victim_mapping.{c}" for c in COLUMNS)
    new = ", ".join(f"excluded.{c}" for c in COLUMNS)
    now = datetime.now(UTC).replace(tzinfo=None)
    conn.cursor().executemany(
        f"INSERT INTO victim_mapping (complaint_id, method, transfer_id, status, traced_at, {', '.join(COLUMNS)}) "
        f"VALUES (%(complaint_id)s, %(method)s, %(transfer_id)s, 'done', %(traced_at)s, {', '.join(f'%({c})s' for c in COLUMNS)}) "
        f"ON CONFLICT (complaint_id, method, transfer_id) DO UPDATE SET {sets}, traced_at = excluded.traced_at "
        f"WHERE ({old}) IS DISTINCT FROM ({new})",
        [dict(r, complaint_id=complaint_id, method=METHOD, traced_at=now) for r in rows])
    conn.execute("DELETE FROM victim_mapping WHERE complaint_id = %s AND method = %s AND NOT transfer_id = ANY(%s)",
                 (complaint_id, METHOD, [r["transfer_id"] for r in rows]))


def trace(conn, complaint_id):
    """Rebuild the complaint's FIFO trail from the local tables; the caller commits.

    -> dict(rows, hops, accounts, pull): `pull` lists the trail nodes (account ids, 'TRON:<address>' for wallets) to pull next.
    """
    clock = demo_clock(conn)
    cur = conn.execute("SELECT transfer_id, ts, amount, from_id, to_id, asset FROM transfers WHERE status = 'done' "
                       "AND asset IN ('INR', 'USDT')" + (" AND ts <= %s" if clock else ""), (clock,) if clock else ())
    transfers = [Tr(*r) for r in cur]
    accounts = {r["account_id"]: r for r in dict_rows(conn.execute(
        "SELECT account_id, bank_id, wallet_kind, opening_balance, p2p_wallet, fetched_at FROM accounts"))}
    seeds = dict(conn.execute("SELECT matched_transfer_id, SUM(amount) FROM complaint_payments "
                              "WHERE complaint_id = %s AND matched AND matched_transfer_id IS NOT NULL GROUP BY 1", (complaint_id,)))
    max_hops = int(setting(conn, "max_hops", 12))
    rows = sweep(transfers, accounts, seeds, Decimal(str(setting(conn, "min_trace_amount", 0))), max_hops,
                 Decimal(str(setting(conn, "p2p_rate", 90))), timedelta(minutes=float(setting(conn, "golden_minutes", 60))))
    save(conn, complaint_id, rows)
    return dict(rows=len(rows), hops=max((r["hop"] for r in rows), default=0),
                accounts=len({r["to_ref"] for r in rows} - {"CASH"}), pull=pull_next(rows, accounts, max_hops))
