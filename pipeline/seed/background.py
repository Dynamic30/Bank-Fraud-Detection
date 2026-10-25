"""Ordinary traffic: every segment has its own transaction process. Mule rings and victims are layered on
top of this in scenarios.py, so the dataset's normal part never contains a recognisable scam pattern."""
from __future__ import annotations

import math
import random
from bisect import bisect
from datetime import date, datetime

import numpy as np

from .banks import Bank
from .config import DAY, HOUR_WEIGHTS, IST, P2P_RATE
from .crypto import Crypto, MICRO
from .util import atm_id, paise, pick_rail
from .world import BG, World

INDIV_SEGS = ("salaried", "other_retail", "retired", "homemaker", "gig", "daily_wage", "student")

# Poisson means over the ~131-day window; tuned so the average account has ~20 outgoing transfers.
LAM = {"salaried": 7.0, "student": 9.0, "merchant": 3.0, "gig": 8.0, "business": 4.0, "retired": 5.0,
       "homemaker": 6.0, "daily_wage": 5.0, "trader": 5.0, "busy": 6.0, "retail": 8.0, "seller": 5.0, "minimal": 3.0}


class Pools:
    def __init__(self, world: World, rng: random.Random):
        self.indiv = [i for s in INDIV_SEGS for i in world.by_seg.get(s, [])]
        self.landlords = [i for s in ("retired", "homemaker", "other_retail") for i in world.by_seg.get(s, [])]
        self.business = list(world.by_seg.get("business", []))
        self.sellers = list(world.by_seg.get("p2p_seller", []))
        self.billers: dict[str, list[int]] = {}
        for i in world.by_seg.get("biller", []):
            self.billers.setdefault(world.accts[i].bkind, []).append(i)
        self.merchants_all = self._zipf(list(world.by_seg.get("merchant", [])), rng, 0.7)
        by_city: dict[str, list[int]] = {}
        for i in world.by_seg.get("merchant", []):
            by_city.setdefault(world.city_of(world.accts[i]), []).append(i)
        self.merchants_city = {c: self._zipf(v, rng, 0.7) for c, v in by_city.items()}
        self.employers = self._zipf(list(self.business), rng, 0.9)

    @staticmethod
    def _zipf(idxs: list[int], rng: random.Random, s: float) -> tuple[list[int], list[float]]:
        idxs = list(idxs)
        rng.shuffle(idxs)
        cum, tot = [], 0.0
        for r in range(len(idxs)):
            tot += 1.0 / (r + 1) ** s
            cum.append(tot)
        return idxs, cum


def _pick(pool: tuple[list[int], list[float]], rng: random.Random) -> int:
    idxs, cum = pool
    return idxs[min(bisect(cum, rng.random() * cum[-1]), len(idxs) - 1)]


class Background:
    def __init__(self, world: World, crypto: Crypto, banks: dict[str, Bank], rng: random.Random, nprng):
        self.w, self.crypto, self.rng, self.nprng = world, crypto, rng, nprng
        self.clock = world.clock
        self.store = world.store
        self.ifscs = [b.ifsc for b in banks.values() if not b.is_wallet]
        hp = np.array(HOUR_WEIGHTS, float)
        self.hp = hp / hp.sum()
        self.open_ts = np.array([int(datetime(a.opened.year, a.opened.month, a.opened.day, tzinfo=IST).timestamp())
                                 for a in world.accts], dtype=np.int64)
        self.date0 = datetime.fromtimestamp(self.clock.t0 + 3600, IST).date()
        self.pools = Pools(world, rng)
        self._favs: dict[int, list[int]] = {}
        self._contacts: dict[int, list[int]] = {}
        self._employer: dict[int, int] = {}
        self._atms: dict[int, list[str]] = {}
        self.employer_dom: dict[int, int] = {}

    # ---------------------------------------------------------------- primitives
    def add(self, f: int, t: int, rupees: float, ts: int, rail: str, dev: str | None = None) -> int:
        if f == t or rupees < 1 or ts > self.clock.end:
            return -1
        if ts < self.open_ts[f] + 3600 or (t >= 0 and ts < self.open_ts[t] + 3600):
            return -1
        if dev is None:
            dev = self.w.accts[f].device
        return self.store.add(f, t, paise(rupees), ts, rail, dev, BG)

    def start_day(self, a) -> int:
        return max(0, self.clock.day_of(int(self.open_ts[a.idx])) + 1)

    def times(self, n: int, d_lo: int, d_hi: int | None = None) -> np.ndarray:
        d_hi = d_hi if d_hi is not None else self.clock.ndays
        if n <= 0 or d_lo >= d_hi:
            return np.empty(0, dtype=np.int64)
        days = self.nprng.integers(d_lo, d_hi, n)
        hours = self.nprng.choice(24, n, p=self.hp)
        secs = self.nprng.integers(0, 3600, n)
        ts = self.clock.t0 + days.astype(np.int64) * DAY + hours * 3600 + secs
        return ts[ts <= self.clock.end]

    def ts_on(self, day: int, h_lo: int = 9, h_hi: int = 18) -> int:
        return self.clock.t0 + day * DAY + self.rng.randint(h_lo, h_hi - 1) * 3600 + self.rng.randint(0, 3599)

    def dom_days(self, dom: int) -> list[int]:
        out, y, m = [], self.date0.year, self.date0.month
        for _ in range(8):
            for dd in (dom, min(dom, 28)):
                try:
                    d = date(y, m, dd)
                    break
                except ValueError:
                    continue
            di = (d - self.date0).days
            if 0 <= di < self.clock.ndays:
                out.append(di)
            m += 1
            if m == 13:
                y, m = y + 1, 1
        return out

    def atms(self, a) -> list[str]:
        if a.idx not in self._atms:
            self._atms[a.idx] = [atm_id(self.rng, self.ifscs) for _ in range(3)]
        return self._atms[a.idx]

    # ---------------------------------------------------------------- counterparties
    def merchant(self, a) -> int:
        favs = self._favs.get(a.idx)
        city = self.w.city_of(a)
        pool = self.pools.merchants_city.get(city) or self.pools.merchants_all
        if favs is None:
            favs = [_pick(pool, self.rng) for _ in range(self.rng.randint(3, 5))]
            self._favs[a.idx] = favs
        return self.rng.choice(favs) if self.rng.random() < 0.55 else _pick(pool, self.rng)

    def contact(self, a) -> int:
        cs = self._contacts.get(a.idx)
        if cs is None:
            cs = [self.rng.choice(self.pools.indiv) for _ in range(self.rng.randint(2, 4))]
            self._contacts[a.idx] = cs
        return self.rng.choice(cs) if self.rng.random() < 0.7 else self.rng.choice(self.pools.indiv)

    def biller(self, kind: str) -> int:
        return self.rng.choice(self.pools.billers.get(kind) or [self.rng.choice(self.pools.indiv)])

    def employer(self, a) -> int:
        if a.idx not in self._employer:
            e = _pick(self.pools.employers, self.rng)
            self._employer[a.idx] = e
            self.employer_dom.setdefault(e, self.rng.choice([1, 3, 5, 7, 28, 30]))
        return self._employer[a.idx]

    # ---------------------------------------------------------------- building blocks
    def salary(self, a) -> None:
        e = self.employer(a)
        p = self.w.person(a)
        base = max(p.income, 9000.0)
        for d in self.dom_days(self.employer_dom[e]):
            amt = round(base * (1 + self.rng.uniform(-0.01, 0.01)), 0)
            d = min(max(d + self.rng.randint(-2, 2), 0), self.clock.ndays - 1)
            self.add(e, a.idx, amt, self.ts_on(d, 9, 12), self.rng.choice(["NEFT", "IMPS"]), self.w.accts[e].device)

    def monthly(self, a, dest: int, lo: float, hi: float, dom: int, step: float = 100.0, hours=(9, 20)) -> None:
        for d in self.dom_days(dom):
            amt = round(self.rng.uniform(lo, hi) / step) * step
            self.add(a.idx, dest, amt, self.ts_on(d, *hours), pick_rail(self.rng, amt, 0.6, 0.25, 0.15), a.device)

    def bills(self, a, scale: float = 1.0) -> None:
        if self.rng.random() < 0.85:
            dest = self.biller("electricity")
            for d in self.dom_days(self.rng.randint(4, 24)):
                self.add(a.idx, dest, round(self.rng.uniform(350, 3200) * scale), self.ts_on(d, 8, 22), "UPI", a.device)
        if self.rng.random() < 0.9:
            dest = self.biller("telecom")
            d = self.rng.randint(0, 28)
            while d < self.clock.ndays:
                self.add(a.idx, dest, self.rng.choice([199, 239, 299, 399, 599, 719, 999]), self.ts_on(d, 8, 22), "UPI", a.device)
                d += self.rng.choice([28, 28, 56, 84])
        if self.rng.random() < 0.2:
            dest = self.biller("insurance")
            for d in self.dom_days(self.rng.randint(5, 25))[::3]:
                self.add(a.idx, dest, round(self.rng.uniform(3000, 22000), -2), self.ts_on(d, 9, 20), "UPI", a.device)

    def spends(self, a, lam: float, median: float = 250.0, merchant_share: float = 0.70) -> None:
        n = int(self.nprng.poisson(lam))
        if n == 0:
            return
        p = self.w.person(a)
        scale = min(2.2, max(0.5, math.sqrt(max(p.income, 8000.0) / 30000.0)))
        ts = self.times(n, self.start_day(a))
        amt = np.clip(self.nprng.lognormal(math.log(median * scale), 0.9, len(ts)), 10, 60000)
        for k in range(len(ts)):
            r = self.rng.random()
            if r < merchant_share:
                dest = self.merchant(a)
            elif r < merchant_share + 0.08:
                dest = self.biller(self.rng.choice(["ecommerce", "ecommerce", "telecom", "insurance"]))
            else:
                dest = self.contact(a)
            v = float(amt[k]) if self.rng.random() < 0.25 else float(round(amt[k]))
            self.add(a.idx, dest, round(v, 2), int(ts[k]), "UPI" if self.rng.random() < 0.93 else "IMPS", a.device)

    def atm(self, a, lam: float) -> None:
        for t in self.times(int(self.nprng.poisson(lam)), self.start_day(a)):
            self.add(a.idx, -1, self.rng.choice([1000, 2000, 3000, 5000, 5000, 10000, 10000, 15000, 20000]), int(t),
                     "ATM", self.rng.choice(self.atms(a)))

    def irregular_in(self, a, lo: float, hi: float, n: int, payers: list[int] | None = None) -> None:
        for t in self.times(n, self.start_day(a)):
            src = self.rng.choice(payers) if payers else self.rng.choice(self.pools.indiv)
            amt = round(self.rng.uniform(lo, hi) / 100) * 100
            self.add(src, a.idx, amt, int(t), "UPI", self.w.accts[src].device)

    def weekly_in(self, a, payer: int, lo: float, hi: float, every: int = 7) -> None:
        d = self.rng.randint(0, every - 1) + self.start_day(a)
        while d < self.clock.ndays:
            amt = round(self.rng.uniform(lo, hi) / 10) * 10
            self.add(payer, a.idx, amt, self.ts_on(d, 8, 20), "UPI" if amt <= 100000 else "IMPS", self.w.accts[payer].device)
            d += every + self.rng.randint(-1, 1)

    # ---------------------------------------------------------------- segment processes
    def _b_salaried(self, a, extras: bool = True) -> None:
        p = self.w.person(a)
        self.salary(a)
        if self.rng.random() < 0.30:
            self.monthly(a, self.rng.choice(self.pools.landlords),
                         p.income * 0.2, p.income * 0.32, self.rng.randint(1, 8), 500)
        if self.rng.random() < 0.35:
            self.monthly(a, self.biller("lender"), p.income * 0.08, p.income * 0.2, self.rng.randint(3, 20))
        self.bills(a)
        self.spends(a, LAM["salaried"])
        self.atm(a, 1.2)

    def _b_student(self, a) -> None:
        parent = self.rng.choice(self.pools.indiv)
        for d in self.dom_days(self.rng.randint(1, 10)):
            self.add(parent, a.idx, round(self.rng.uniform(2500, 9000) / 500) * 500, self.ts_on(d, 9, 20), "UPI", self.w.accts[parent].device)
        self.spends(a, LAM["student"], median=120)
        d = self.rng.randint(0, 28)
        dest = self.biller("telecom")
        while d < self.clock.ndays:
            self.add(a.idx, dest, self.rng.choice([199, 239, 299]), self.ts_on(d, 9, 23), "UPI", a.device)
            d += 28
        self.atm(a, 0.5)

    def _b_merchant(self, a) -> None:
        self.bills(a, 1.6)
        self.spends(a, LAM["merchant"], median=300, merchant_share=0.3)
        if self.pools.business:
            sup = [_pick(self.pools.employers, self.rng) for _ in range(self.rng.randint(1, 3))]
            d = self.start_day(a) + self.rng.randint(0, 14)
            while d < self.clock.ndays:
                amt = round(self.rng.uniform(8000, 70000), -2)
                s = self.rng.choice(sup)
                self.add(a.idx, s, amt, self.ts_on(d, 9, 18), pick_rail(self.rng, amt, 0.55, 0.3, 0.15), a.device)
                d += self.rng.randint(10, 18)
        self.monthly(a, self.rng.choice(self.pools.landlords),
                     5000, 25000, self.rng.randint(1, 7), 500)

    def _b_gig(self, a) -> None:
        platform = self.biller("platform")
        p = self.w.person(a)
        self.weekly_in(a, platform, p.income / 5.5 * 0.8, p.income / 5.5 * 1.2)
        self.bills(a)
        self.spends(a, LAM["gig"], median=180)
        self.atm(a, 2.0)

    def _b_business(self, a) -> None:
        partners = [_pick(self.pools.employers, self.rng) for _ in range(self.rng.randint(3, 7))]
        for t in self.times(int(self.nprng.poisson(LAM["business"] + 2)), self.start_day(a)):
            amt = float(round(min(2_500_000, max(20_000, self.nprng.lognormal(math.log(120_000), 0.9))), -2))
            self.add(a.idx, self.rng.choice(partners), amt, int(t), pick_rail(self.rng, amt, 0.2, 0.3, 0.5), a.device)
        tax = self.biller("govt")
        self.monthly(a, tax, 8000, 90000, self.rng.randint(18, 22), 100)
        self.bills(a, 2.5)
        self.spends(a, 1.5, median=600)

    def _b_retired(self, a) -> None:
        p = self.w.person(a)
        pension = self.biller("govt")
        for d in self.dom_days(1):
            self.add(pension, a.idx, round(max(p.income, 8000), -2), self.ts_on(d, 9, 12), "NEFT", self.w.accts[pension].device)
        self.bills(a, 0.8)
        self.spends(a, LAM["retired"], median=200)
        self.atm(a, 1.5)

    def _b_homemaker(self, a) -> None:
        spouse = self.rng.choice(self.pools.indiv)
        for d in self.dom_days(self.rng.randint(1, 8)):
            self.add(spouse, a.idx, round(self.rng.uniform(5000, 20000) / 500) * 500, self.ts_on(d, 9, 20), "UPI", self.w.accts[spouse].device)
        self.bills(a, 0.7)
        self.spends(a, LAM["homemaker"], median=220)
        self.atm(a, 0.8)

    def _b_daily_wage(self, a) -> None:
        contractor = self.rng.choice(self.pools.business or self.pools.indiv)
        self.weekly_in(a, contractor, 1800, 4500)
        self.bills(a, 0.6)
        self.spends(a, LAM["daily_wage"], median=100)
        self.atm(a, 3.0)

    def _b_retail(self, a) -> None:
        p = self.w.person(a)
        if p.occ in ("salaried", "professional"):
            self.salary(a)
        else:
            self.irregular_in(a, 2500, 25000, self.rng.randint(3, 6))
        if self.rng.random() < 0.2:
            self.monthly(a, self.biller("lender"), max(p.income, 8000) * 0.08, max(p.income, 8000) * 0.18, self.rng.randint(3, 20))
        self.bills(a, 0.9)
        self.spends(a, LAM["retail"])
        self.atm(a, 1.5)

    def _b_minimal(self, a) -> None:
        self.spends(a, LAM["minimal"], median=90)
        if self.rng.random() < 0.5:
            self.bills(a, 0.3)

    def _b_seller(self, a) -> None:
        self.bills(a, 1.0)
        self.spends(a, LAM["seller"], median=300)

    def _b_biller(self, a) -> None:
        pass

    def _b_busy(self, a) -> None:
        kind = a.bkind
        if kind == "chit":
            members = self.rng.sample(self.pools.indiv, min(len(self.pools.indiv), self.rng.randint(20, 38)))
            contrib = self.rng.choice([500, 1000, 2000, 2500, 5000])
            dom = self.rng.randint(5, 10)
            quick = self.rng.random() < 0.5                 # some funds pay the winner within hours
            for d in self.dom_days(dom):
                for m in members:
                    self.add(m, a.idx, contrib, self.ts_on(d + self.rng.randint(0, 3), 8, 21), "UPI", self.w.accts[m].device)
                winner = self.rng.choice(members)
                amt = round(contrib * len(members) * 0.92, -2)
                pay_ts = self.ts_on(d + 3, 20, 24) if quick else self.ts_on(d + self.rng.randint(4, 6), 10, 17)
                self.add(a.idx, winner, amt, pay_ts, pick_rail(self.rng, amt, 0.1, 0.5, 0.4), a.device)
        elif kind == "ngo":
            donations: list[tuple[int, float]] = []
            for burst in range(3):
                centre = self.rng.randint(5, self.clock.ndays - 5)
                for _ in range(self.rng.randint(15, 40)):
                    d = max(0, min(self.clock.ndays - 1, centre + int(self.rng.gauss(0, 2))))
                    src = self.rng.choice(self.pools.indiv)
                    amt = float(round(min(25000, self.nprng.lognormal(math.log(500), 1.0)), -1)) or 100.0
                    ts = self.ts_on(d, 8, 22)
                    if self.add(src, a.idx, amt, ts, "UPI", self.w.accts[src].device) >= 0:
                        donations.append((ts, amt))
            vendors = [_pick(self.pools.merchants_all, self.rng) for _ in range(3)] or [self.rng.choice(self.pools.indiv)]
            week = 7 * DAY
            t = self.clock.t0 + 7 * DAY
            while t < self.clock.end:
                got = sum(x for ts, x in donations if t - week <= ts < t)
                if got >= 2500:
                    amt = round(got * 0.7, -2)
                    self.add(a.idx, self.rng.choice(vendors), amt, t + self.rng.randint(10, 17) * 3600, pick_rail(self.rng, amt, 0.5, 0.4, 0.1), a.device)
                t += week
        else:                                                   # shared family account
            members = self.rng.sample(self.pools.indiv, self.rng.randint(3, 5))
            for m in members:
                for d in self.dom_days(self.rng.randint(1, 6)):
                    self.add(m, a.idx, round(self.rng.uniform(5000, 30000) / 500) * 500, self.ts_on(d, 9, 20), "UPI", self.w.accts[m].device)
            self.monthly(a, self.rng.choice(self.pools.landlords), 8000, 25000, self.rng.randint(1, 7), 500)
            self.bills(a, 1.4)
            self.spends(a, 12, median=300)

    def _b_trader(self, a) -> None:
        p = self.w.person(a)
        if p.occ == "salaried":
            self.salary(a)
        else:
            self.irregular_in(a, 5000, 60000, self.rng.randint(4, 8))
        self.bills(a)
        self.spends(a, LAM["trader"], median=300)
        wallet = self.crypto.owner_wallet(a.idx, "p2p_trader")
        for t in self.times(self.rng.randint(8, 22), self.start_day(a) + 1, self.clock.ndays - 1):
            self._trade(a, wallet, int(t), buy=self.rng.random() < 0.7, big=True)

    def _trade(self, a, wallet: str, ts: int, buy: bool, big: bool = False) -> None:
        seller = self.crypto.pick_seller()
        if big:
            inr = round(math.exp(self.rng.uniform(math.log(5000), math.log(300000))), -3)
        else:
            inr = round(math.exp(self.rng.uniform(math.log(2000), math.log(40000))), -2)
        rail = pick_rail(self.rng, inr, 0.8, 0.2, 0.0)
        if buy:
            i = self.add(a.idx, seller.acct, inr, ts, rail, a.device)
            if i < 0:
                return
            ri, rts, micro = self.crypto.p2p_release(seller, wallet, paise(inr), ts)
            if self.rng.random() < 0.5:                         # sell it on an exchange later
                eid = self.rng.choice(["EX01", "EX02", "EX04", "EX06"])
                dep = self.crypto.deposit_wallet(eid)
                t2 = rts + self.rng.randint(6 * 3600, 5 * DAY)
                if t2 <= self.clock.end:
                    self.crypto.add(wallet, dep, round(micro * 0.999), t2)
                    self.crypto.add(dep, self.crypto.hot[eid], round(micro * 0.999), t2 + self.rng.randint(300, 3600))
        else:
            micro = round(inr / P2P_RATE * MICRO)
            self.crypto.add(wallet, seller.address, micro, ts)
            pay = round(micro / MICRO * self.crypto.rate(), -1)
            self.add(seller.acct, a.idx, pay, ts + self.rng.randint(120, 1800), pick_rail(self.rng, pay, 0.8, 0.2, 0.0),
                     self.w.accts[seller.acct].device)

    # ---------------------------------------------------------------- dormant accounts
    def _old_history(self, a) -> None:
        end = self.clock.t0 - a.dormant_gap * DAY
        n = self.rng.randint(5, 14)
        for _ in range(n):
            ts = end - self.rng.randint(0, 70) * DAY - self.rng.randint(0, 80000)
            if self.rng.random() < 0.5:
                dest = self.merchant(a)
            elif self.rng.random() < 0.5:
                dest = self.biller(self.rng.choice(["telecom", "electricity"]))
            else:
                dest = self.contact(a)
            if self.open_ts[dest] + 3600 < ts:
                self.add(a.idx, dest, self.rng.choice([150, 299, 450, 800, 1200, 2500, 5000]), ts, "UPI", a.device)

    def _reactivate(self, a) -> None:
        d0 = self.rng.randint(25, 110)
        for t in self.times(self.rng.randint(3, 8), d0, d0 + 20):
            self.add(a.idx, self.merchant(a), self.rng.choice([120, 250, 400, 900, 1500, 3000]), int(t), "UPI", a.device)

    # ---------------------------------------------------------------- driver
    def run(self) -> None:
        for a in self.w.accts:
            if a.dormant_gap:
                self._old_history(a)
                if a.reactivates and not a.mule_type:
                    self._reactivate(a)
                continue
            getattr(self, "_b_" + a.base)(a)
        self._ordinary_crypto_users()
        self._sweepers()
        self._seller_floats()

    def _ordinary_crypto_users(self) -> None:
        pool = [i for s in ("salaried", "other_retail", "gig") for i in self.w.by_seg.get(s, [])]
        k = int(len(self.w.accts) * 0.015)
        for i in self.rng.sample(pool, min(k, len(pool))):
            a = self.w.accts[i]
            wallet = self.crypto.owner_wallet(i, "crypto_user")
            for t in self.times(self.rng.randint(1, 3), self.start_day(a) + 1, self.clock.ndays - 1):
                self._trade(a, wallet, int(t), buy=self.rng.random() < 0.8)

    def _sweepers(self) -> None:
        """Merchants, sellers and billers sweep what they received to one or two destinations, a day or more later."""
        st = self.store
        sweep = [a for a in self.w.accts if a.segment in ("merchant", "p2p_seller", "biller") and not a.dormant_gap]
        if not sweep:
            return
        row = {a.idx: k for k, a in enumerate(sweep)}
        credits = np.zeros((len(sweep), self.clock.ndays + 1), dtype=np.int64)
        t_arr, ts_arr, amt_arr, st_arr = (np.array(x) for x in (st.t, st.ts, st.amt, st.st))
        lut = np.full(len(self.w.accts), -1, dtype=np.int64)
        for i, k in row.items():
            lut[i] = k
        m = (t_arr >= 0) & (st_arr == 0)
        rows = lut[t_arr[m]]
        sel = rows >= 0
        days = ((ts_arr[m][sel] - self.clock.t0) // DAY).clip(0, self.clock.ndays)
        np.add.at(credits, (rows[sel], days), amt_arr[m][sel])
        pair = {}
        for a in self.w.accts:
            pair.setdefault(a.pid, []).append(a.idx)
        for a in sweep:
            cr = credits[row[a.idx]]
            if a.segment == "merchant":
                period = (4, 6)
            elif a.segment == "biller":
                period = (2, 4)
            else:
                period = (4, 8)
            own = [x for x in pair.get(a.pid, []) if x != a.idx]
            main = own[0] if own else (_pick(self.pools.employers, self.rng) if self.pools.business else self.rng.choice(self.pools.indiv))
            alt = _pick(self.pools.employers, self.rng) if self.pools.business else main
            fast = a.segment == "merchant" and self.rng.random() < 0.15     # sweeps the same evening
            d, last = self.start_day(a) + self.rng.randint(1, period[1]), -1
            while d < self.clock.ndays:
                avail = int(cr[last + 1:d + 1 if fast else d].sum())
                if avail >= 200_000:
                    amt = math.floor(avail * self.rng.uniform(0.82, 0.97) / 10000) * 100
                    dest = main if self.rng.random() < 0.85 else alt
                    ts = self.ts_on(d, 21, 24) if fast else self.ts_on(d, 9, 13)
                    self.add(a.idx, dest, amt, ts, pick_rail(self.rng, amt, 0.55, 0.3, 0.15), a.device)
                    last = d if fast else d - 1
                d += 1 if fast else self.rng.randint(*period)

    def _seller_floats(self) -> None:
        end = self.clock.end
        for s in self.crypto.sellers:
            t = self.clock.t0 + self.rng.randint(1, 6) * DAY
            while t < end:
                eid = self.rng.choice(["EX01", "EX02", "EX04", "EX06"])
                amt = round(math.exp(self.rng.uniform(math.log(4000), math.log(60000))) * MICRO)
                self.crypto.add(self.crypto.hot[eid], s.address, amt, t)
                if self.rng.random() < 0.5:
                    dep = self.crypto.deposit_wallet(eid)
                    amt2 = round(amt * self.rng.uniform(0.3, 0.9))
                    self.crypto.add(s.address, dep, amt2, t + self.rng.randint(3600, 3 * DAY))
                    self.crypto.add(dep, self.crypto.hot[eid], amt2, t + self.rng.randint(4 * 3600, 4 * DAY))
                t += self.rng.randint(3, 8) * DAY
