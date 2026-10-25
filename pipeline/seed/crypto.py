"""TRON / USDT side of the world: exchanges, wallets, P2P sellers and the rupee -> USDT seam.

A rupee payment to a P2P seller's bank account is followed, 2 to 45 minutes later, by that seller releasing
USDT (rupees / rate). Nothing in the data links the two legs; the tracer has to infer it."""
from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import datetime

from .config import DAY, P2P_RATE, P2P_RATE_JITTER, UTC
from .world import Clock, World

B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
EXCHANGES = [
    ("EX01", "BitNova", "compliance@bitnova.example", "Seychelles", True),
    ("EX02", "CoinVault", "legal@coinvault.example", "Singapore", True),
    ("EX03", "KryptoBay", "aml@kryptobay.example", "Cayman Islands", False),
    ("EX04", "ZapEx", "compliance@zapex.example", "Estonia", True),
    ("EX05", "Orbitex", "support@orbitex.example", "UAE", False),
    ("EX06", "TronBazaar", "aml@tronbazaar.example", "India", True),
]
PLATFORMS = ["P2PHub", "CoinBazaar", "CryptoMandi"]
MICRO = 1_000_000
EX_COLS = ("exchange_id", "name", "compliance_email", "jurisdiction", "responds_to_india")
WALLET_COLS = ("address", "chain", "kind", "exchange_id", "label", "label_source", "first_seen")
TRANSFER_COLS = ("tx_hash", "chain", "asset", "from_address", "to_address", "amount", "block_time")
SELLER_COLS = ("seller_wallet", "platform", "bank_code", "bank_account_no", "upi_vpa")
CRYPTO_SCHEMA = {"crypto_exchanges": EX_COLS, "crypto_wallets": WALLET_COLS, "crypto_transfers": TRANSFER_COLS,
                 "crypto_p2p_sellers": SELLER_COLS}


@dataclass
class Wallet:
    address: str
    kind: str                       # private | p2p_seller | exchange_deposit | exchange_hot | bridge | mixer
    exchange_id: str | None = None
    label: str | None = None
    label_source: str | None = None
    segment: str = "crypto_user"    # truth file segment
    mule: bool = False
    mule_type: str = ""
    ring: str = ""
    first: int = 0                  # first / last transfer time involving the wallet
    last: int = 0
    scam_first: int = 0
    scam_last: int = 0


@dataclass
class Seller:
    acct: int                       # index into world.accts
    address: str
    platform: str


class Crypto:
    def __init__(self, world: World, clock: Clock, rng: random.Random):
        self.world, self.clock, self.rng = world, clock, rng
        self.wallets: dict[str, Wallet] = {}
        self.transfers: list[tuple] = []          # (tx_hash, from, to, micro, ts)
        self.cprov: dict[int, list] = {}          # transfer index -> [complaint ids]
        self.sellers: list[Seller] = []
        self._hash: set[str] = set()
        self.hot: dict[str, str] = {}
        self.bridges: list[str] = []
        self.mixers: list[str] = []
        self.deposits: dict[str, list[str]] = {e[0]: [] for e in EXCHANGES}
        self._owner_wallet: dict[int, str] = {}    # account idx -> private wallet
        self._seller_w: list[float] = []
        self._build_infrastructure()

    # -- wallets ----------------------------------------------------------------------------
    def new_wallet(self, kind: str, exchange_id: str | None = None, label: str | None = None,
                   label_source: str | None = None, segment: str = "crypto_user") -> str:
        while True:
            addr = "T" + "".join(self.rng.choices(B58, k=33))
            if addr not in self.wallets:
                break
        self.wallets[addr] = Wallet(addr, kind, exchange_id, label, label_source, segment)
        return addr

    def _build_infrastructure(self) -> None:
        for eid, name, *_ in EXCHANGES:
            self.hot[eid] = self.new_wallet("exchange_hot", eid, f"{name} hot wallet", "chain_analytics", "infrastructure")
        for i in range(3):
            self.bridges.append(self.new_wallet("bridge", None, "Cross-chain bridge", "chain_analytics", "infrastructure"))
            self.mixers.append(self.new_wallet("mixer", None, "Mixing service", "chain_analytics", "infrastructure"))

    def deposit_wallet(self, exchange_id: str) -> str:
        pool = self.deposits[exchange_id]
        if pool and self.rng.random() < 0.15:          # a deposit address is sometimes reused
            return self.rng.choice(pool)
        addr = self.new_wallet("exchange_deposit", exchange_id, None, None, "infrastructure")
        pool.append(addr)
        return addr

    def owner_wallet(self, acct: int, segment: str = "crypto_user") -> str:
        if acct not in self._owner_wallet:
            self._owner_wallet[acct] = self.new_wallet("private", segment=segment)
        return self._owner_wallet[acct]

    def register_sellers(self, seller_accts: list[int]) -> None:
        for i in seller_accts:
            a = self.world.accts[i]
            addr = self.new_wallet("p2p_seller", None, "P2P merchant", "platform_registry", "p2p_seller")
            a.p2p_wallet = addr
            self.sellers.append(Seller(i, addr, self.rng.choice(PLATFORMS)))
        w = [1.0 / (k + 1) ** 0.7 for k in range(len(self.sellers))]
        self.rng.shuffle(w)
        self._seller_w = w

    def pick_seller(self) -> Seller:
        return self.rng.choices(self.sellers, self._seller_w)[0]

    # -- transfers --------------------------------------------------------------------------
    def add(self, frm: str, to: str, micro: int, ts: int, prov: list | None = None) -> int:
        while True:
            h = f"{self.rng.getrandbits(256):064x}"
            if h not in self._hash:
                self._hash.add(h)
                break
        i = len(self.transfers)
        self.transfers.append((h, frm, to, int(micro), int(ts)))
        if prov:
            self.cprov[i] = prov
        for addr in (frm, to):
            w = self.wallets[addr]
            w.first = ts if not w.first else min(w.first, ts)
            w.last = max(w.last, ts)
        return i

    def rate(self) -> float:
        return P2P_RATE * (1 + self.rng.uniform(-P2P_RATE_JITTER, P2P_RATE_JITTER))

    def p2p_release(self, seller: Seller, to_addr: str, inr_paise: int, pay_ts: int,
                    prov: list | None = None, delay: tuple[int, int] = (120, 2700)) -> tuple[int, int, int]:
        """Seller releases USDT to `to_addr` after receiving `inr_paise`. Returns (index, ts, micro)."""
        micro = round(inr_paise / 100 / self.rate() * MICRO)
        ts = pay_ts + self.rng.randint(*delay)
        return self.add(seller.address, to_addr, micro, ts, prov), ts, micro

    # -- laundering tails -------------------------------------------------------------------
    def random_plan(self) -> list[tuple[float, int, str, str | None]]:
        """[(fraction, private hops, terminal, exchange_id)]"""
        k = self.rng.choices([1, 2, 3], [4, 4, 2])[0]
        cuts = sorted(self.rng.random() for _ in range(k - 1))
        fr = [b - a for a, b in zip([0.0] + cuts, cuts + [1.0])]
        plan = []
        for f in fr:
            term = self.rng.choices(["deposit", "bridge", "mixer"], [70, 16, 14])[0]
            plan.append((f, self.rng.randint(1, 3), term, self.rng.choice(EXCHANGES)[0] if term == "deposit" else None))
        return plan

    def tail(self, start: str, micro: int, ts: int, plan: list, prov: list | None = None, slow: float = 1.0) -> int:
        """Run `plan` from wallet `start`; returns the last timestamp used."""
        last = ts
        for frac, hops, term, eid in plan:
            amt, t, cur = round(micro * frac), ts, start
            if amt <= 0:
                continue
            for _ in range(hops):
                nxt = self.new_wallet("private", segment="crypto_user")
                t += int(self.rng.randint(180, 5400) * slow)
                self.add(cur, nxt, amt, t, prov)
                self._mark_ring(nxt, start)
                cur = nxt
            t += int(self.rng.randint(180, 5400) * slow)
            if term == "deposit":
                dep = self.deposit_wallet(eid)
                self.add(cur, dep, amt, t, prov)
                t += int(self.rng.randint(120, 1800) * slow)
                self.add(dep, self.hot[eid], amt, t, prov)
            else:
                dest = self.rng.choice(self.bridges if term == "bridge" else self.mixers)
                self.add(cur, dest, amt, t, prov)
            last = max(last, t)
        return last

    def _mark_ring(self, addr: str, like: str) -> None:
        src = self.wallets[like]
        w = self.wallets[addr]
        w.mule, w.mule_type, w.ring = src.mule, src.mule_type, src.ring
        w.segment = src.segment

    def ring_wallet(self, ring_id: str, mule_type: str = "crypto_cashout") -> str:
        addr = self.new_wallet("private", segment="mule")
        w = self.wallets[addr]
        w.mule, w.mule_type, w.ring = True, mule_type, ring_id
        return addr

    # -- database rows ----------------------------------------------------------------------
    def tables(self):
        """Yield (table, columns, rows) in FK order."""
        yield "crypto_exchanges", EX_COLS, iter(EXCHANGES)
        yield "crypto_wallets", WALLET_COLS, self._wallet_rows()
        yield "crypto_transfers", TRANSFER_COLS, self._transfer_rows()
        yield "crypto_p2p_sellers", SELLER_COLS, self._seller_rows()

    def _wallet_rows(self):
        now = self.clock.now
        for w in self.wallets.values():
            if w.kind == "p2p_seller":
                first = now - self.rng.randint(200, 700) * DAY
            elif w.first:
                first = w.first - self.rng.randint(0, 3 * DAY)
            else:
                first = now - self.rng.randint(10, 200) * DAY
            yield (w.address, "TRON", w.kind, w.exchange_id, w.label, w.label_source,
                   datetime.fromtimestamp(first, UTC).replace(tzinfo=None))

    def _transfer_rows(self):
        for h, frm, to, micro, ts in self.transfers:
            yield (h, "TRON", "USDT", frm, to, f"{micro // MICRO}.{micro % MICRO:06d}",
                   datetime.fromtimestamp(ts, UTC).replace(tzinfo=None))

    def _seller_rows(self):
        for s in self.sellers:
            a = self.world.accts[s.acct]
            yield (s.address, s.platform, a.bank, a.no, a.vpa)
