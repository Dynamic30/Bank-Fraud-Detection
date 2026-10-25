"""Scam scenarios: mule rings, victims and the engine that moves victim money through the rings.

plan()    runs BEFORE background traffic: decides rings, windows and per-mule attributes (account age,
          shared devices, difficulty) so ordinary history is generated consistently with them.
execute() runs AFTER: creates victim payments and pushes the money hop by hop, recording for every scam
          transfer which complaint's money it carries (used only for validation and the truth file)."""
from __future__ import annotations

import heapq
import math
import random
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timedelta

import numpy as np

from .banks import Bank
from .config import DAY, HARD_SHARE, HOUR_WEIGHTS, IST, MASS_SCAMS, SCAM_TYPES, SHOWCASE_COMPLAINT, TARGETED_SCAMS
from .crypto import Crypto
from .util import atm_id, pick_rail
from .profiles import assign_ids
from .world import FAILED, SCAM, World

NONEXIT = ("gateway", "complicit_new", "rented", "unwitting", "ato")
EXITS = ("atm_cashout", "crypto_cashout")
L1_PREF = {
    "mass": {"gateway": 8, "complicit_new": 2},
    "targeted": {"unwitting": 35, "rented": 20, "ato": 15, "complicit_new": 20, "gateway": 10},
    "crypto": {"unwitting": 30, "rented": 25, "ato": 10, "complicit_new": 25, "gateway": 10},
}
L2_PREF = {"complicit_new": 45, "rented": 20, "gateway": 15, "unwitting": 15, "ato": 5}
L3_PREF = {"complicit_new": 45, "rented": 25, "gateway": 10, "unwitting": 10, "ato": 10}
EXIT_PREF = {"mass": {"atm_cashout": 55, "crypto_cashout": 45}, "targeted": {"atm_cashout": 60, "crypto_cashout": 40},
             "crypto": {"crypto_cashout": 80, "atm_cashout": 20}}
VICTIM_WEIGHT = {"mass": 3, "targeted": 1, "crypto": 1}

# showcase schedule, seconds relative to `now`
SC_PAY = [(-9 * 3600 - 10 * 60, 190_000, "A1", "IMPS"), (-8 * 3600 - 40 * 60, 160_000, "A1", "IMPS"),
          (-8 * 3600 - 5 * 60, 130_000, "B1", "NEFT")]
SC_FLUSH = {"A1": -7 * 3600 - 40 * 60, "B1": -6 * 3600 - 30 * 60, "C1": -4 * 3600, "C2": -3 * 3600,
            "A2": -150 * 60, "D1": -2 * 3600, "E1": 15 * 3600 + 30 * 60}


@dataclass
class Pay:
    ts: int
    amt: int                  # paise
    target: int
    rail: str = "UPI"
    tidx: int = -1
    hash: str | None = None   # crypto release hash when the victim paid a P2P seller
    wallet: str | None = None  # scammer's wallet that received the USDT


@dataclass
class Victim:
    acct: int
    scam: str
    pays: list[Pay]
    ring: str = ""
    seller_dest: bool = False
    cid: str | None = None
    reported_at: int = 0
    channel: str = ""
    kind: str = "targeted"


@dataclass
class Ring:
    id: str
    kind: str
    layers: list[list[int]]
    nexts: dict[int, list[tuple[int, float]]]
    start: int
    end: int
    live: bool = False
    showcase: bool = False
    discovered: bool = True      # False = nobody has reported this ring yet
    victims: list[Victim] = field(default_factory=list)
    wallets: list[str] = field(default_factory=list)
    flush_at: dict[int, int] = field(default_factory=dict)
    plan: list | None = None
    slow: float = 1.0

    @property
    def members(self) -> list[int]:
        return [m for layer in self.layers for m in layer]


class Scenarios:
    def __init__(self, world: World, crypto: Crypto, banks: dict[str, Bank], rng: random.Random, nprng, n_complaints: int):
        self.w, self.crypto, self.rng, self.nprng = world, crypto, rng, nprng
        self.clock = world.clock
        self.now = world.clock.now
        self.store = world.store
        self.n_complaints = n_complaints
        self.banks = banks
        self.ifscs = [b.ifsc for b in banks.values() if not b.is_wallet]
        self._burst_done: set[int] = set()
        self._hard: set[int] = set()
        self.ring_banks: dict[str, int] = {}
        self.rings: list[Ring] = []
        self.new_dev: dict[int, list[str]] = {}
        self.atm_ids: dict[int, list[str]] = {}
        self.complaints: list[Victim] = []
        self._seen: set[int] = set()
        self.demoted = 0
        self.showcase_victim: Victim | None = None

    # ------------------------------------------------------------------ helpers
    def _date(self, ts: int):
        return datetime.fromtimestamp(ts, IST).date()

    def _token(self) -> str:
        return f"{self.rng.getrandbits(64):016x}"

    def ensure_opened(self, idx: int, latest_ts: int) -> None:
        """Account must exist (and its holder be an adult) by `latest_ts`; only ever moves the date earlier."""
        a = self.w.accts[idx]
        latest = self._date(latest_ts)
        if a.opened > latest:
            a.opened = latest - timedelta(days=self.rng.randint(30, 900))
        p = self.w.person(a)
        if (a.opened - p.dob).days < 18 * 365 + 30:
            p.dob = a.opened - timedelta(days=18 * 365 + self.rng.randint(30, 1000))

    def _split(self, total: int, k: int) -> list[int]:
        if k <= 1:
            return [total]
        cuts = sorted(self.rng.random() for _ in range(k - 1))
        parts = [b - a for a, b in zip([0.0] + cuts, cuts + [1.0])]
        out = [max(1, int(total * p)) for p in parts]
        out[-1] += total - sum(out)
        return out

    # ------------------------------------------------------------------ plan (before background)
    def plan(self) -> None:
        w, rng = self.w, self.rng
        sc = {r: i for r, i in w.showcase.items() if r != "V"}
        sc_set = set(sc.values())
        pools: dict[str, list[int]] = {}
        for a in w.accts:
            if a.segment == "mule" and a.idx not in sc_set:
                pools.setdefault(a.mule_type, []).append(a.idx)
        for v in pools.values():
            rng.shuffle(v)
        self._build_showcase(sc)
        ne_total = sum(len(pools.get(t, [])) for t in NONEXIT)
        ex_total = sum(len(pools.get(t, [])) for t in EXITS)
        n_rings = max(2, min(round((ne_total + ex_total) / 14), ex_total))
        weights = [min(3.0, max(0.35, rng.lognormvariate(0, 0.6))) for _ in range(n_rings)]
        kinds = [rng.choices(["mass", "targeted", "crypto"], [25, 60, 15])[0] for _ in range(n_rings)]
        ne_min = [2 if k == "mass" else 3 for k in kinds]
        ex_alloc = self._alloc(ex_total, weights, [1] * n_rings)
        ne_alloc = self._alloc(ne_total, weights, ne_min)
        n_live = min(3, n_rings)
        live_set = set(rng.sample(range(n_rings), n_live))
        for r in range(n_rings):
            kind = kinds[r]
            n_ne, n_ex = ne_alloc[r], ex_alloc[r]
            if n_ne + n_ex > 40:
                n_ne = 40 - n_ex
            if kind == "mass" and n_ne + n_ex > 16:
                n_ne = max(2, 16 - n_ex)
            l1_n = max(2, round(n_ne * (0.35 if kind == "mass" else 0.3)))
            rest = n_ne - l1_n
            l3_n = round(rest * 0.4) if rest >= 6 else 0
            l2_n = rest - l3_n
            layers = [self._draw_n(pools, L1_PREF[kind], l1_n, NONEXIT)]
            if l2_n:
                layers.append(self._draw_n(pools, L2_PREF, l2_n, NONEXIT))
            if l3_n:
                layers.append(self._draw_n(pools, L3_PREF, l3_n, NONEXIT))
            layers.append(self._draw_n(pools, EXIT_PREF[kind], n_ex, EXITS))
            layers = [l for l in layers if l]
            live = r in live_set
            length = {"mass": rng.uniform(5, 10), "targeted": rng.uniform(3, 20), "crypto": rng.uniform(5, 25)}[kind] * DAY
            if live:
                start = int(self.now - rng.uniform(1, 5) * DAY)
                end = int(self.now + rng.uniform(5, 9) * DAY)
            else:
                start = int(self.now - rng.uniform(4 * DAY + length, 112 * DAY))
                end = int(start + length)
            ring = Ring(id=f"R{r + 1:03d}", kind=kind, layers=layers, nexts={}, start=start, end=end, live=live,
                        discovered=live or rng.random() < 0.4)
            self._edges(ring)
            self.rings.append(ring)
        # leftovers (slots capped below the pool sizes) join random rings as extra members
        for t in NONEXIT:
            for idx in pools.get(t, []):
                ring = rng.choice(self.rings)
                ring.layers[1 if len(ring.layers) > 2 else 0].append(idx)
            pools[t] = []
        for t in EXITS:
            for idx in pools.get(t, []):
                self.rings[rng.randrange(len(self.rings))].layers[-1].append(idx)
            pools[t] = []
        for ring in self.rings:                     # exits added late still need an incoming edge
            self._fix_incoming(ring)
        self._assign_banks()
        members = [m for r in self.rings for m in r.members]
        rng.shuffle(members)                                   # exactly HARD_SHARE of mules get the weaker-signal behaviour
        self._hard = set(members[:round(HARD_SHARE * len(members))])
        for ring in self.rings + [self.showcase_ring]:
            self._attrs(ring)

    def _assign_banks(self) -> None:
        """Mules get their bank with their ring: 45% of rings stay inside 3 to 6 banks, the rest spread freely."""
        rng, w, banks = self.rng, self.w, self.banks
        codes = list(banks)
        plain = [c for c in codes if not banks[c].is_wallet]
        wallets = [c for c in codes if banks[c].is_wallet]
        share = {c: banks[c].share for c in codes}
        clustered = set(rng.sample(range(len(self.rings)), max(1, round(0.45 * len(self.rings)))))
        for r, ring in enumerate(self.rings):
            members = [m for m in ring.members if not w.accts[m].bank]
            rng.shuffle(members)
            pool = codes
            if r in clustered:
                k = min(rng.randint(3, 6), len(members))
                cand, pool = list(plain), []
                for _ in range(k):
                    c = rng.choices(cand, [share[x] for x in cand])[0]
                    pool.append(c)
                    cand.remove(c)
                if rng.random() < 0.2:
                    pool[-1] = rng.choice(wallets)
            for j, m in enumerate(members):
                # in a clustered ring every chosen bank gets at least one member
                bank = pool[j] if (r in clustered and j < len(pool)) else rng.choices(pool, [share[x] for x in pool])[0]
                assign_ids(w, banks, rng, w.accts[m], bank)
            self.ring_banks[ring.id] = len({w.accts[m].bank for m in ring.members})

    def _alloc(self, total: int, weights: list[float], mins: list[int]) -> list[int]:
        n = len(weights)
        mins = list(mins)
        while sum(mins) > total:
            mins[mins.index(max(mins))] -= 1
        free = total - sum(mins)
        s = sum(weights)
        raw = [free * wt / s for wt in weights]
        out = [m + int(x) for m, x in zip(mins, raw)]
        rem = total - sum(out)
        for i in sorted(range(n), key=lambda i: raw[i] - int(raw[i]), reverse=True)[:rem]:
            out[i] += 1
        return out

    def _draw_n(self, pools: dict[str, list[int]], prefs: dict[str, float], n: int, allowed: tuple) -> list[int]:
        out = []
        for _ in range(n):
            avail = {t: wt for t, wt in prefs.items() if pools.get(t)}
            if not avail:
                avail = {t: 1.0 for t in allowed if pools.get(t)}
            if not avail:
                break
            t = self.rng.choices(list(avail), list(avail.values()))[0]
            out.append(pools[t].pop())
        return out

    def _edges(self, ring: Ring) -> None:
        rng, w = self.rng, self.w
        layers = ring.layers
        for k in range(len(layers) - 1):
            nxt = layers[k + 1]
            for m in layers[k]:
                typ = w.accts[m].mule_type
                if typ == "ato":
                    cand = [x for layer in layers[k + 1:] for x in layer]
                    pick = cand if len(cand) <= 10 else rng.sample(cand, rng.randint(6, 10))
                else:
                    pick = rng.sample(nxt, rng.randint(1, min(3, len(nxt))))
                ring.nexts[m] = [(x, rng.random() + 0.2) for x in pick]
        self._fix_incoming(ring)

    def _fix_incoming(self, ring: Ring) -> None:
        for k in range(1, len(ring.layers)):
            have = {x for m in ring.layers[k - 1] for x, _ in ring.nexts.get(m, [])}
            for x in ring.layers[k]:
                if x not in have:
                    src = self.rng.choice(ring.layers[k - 1])
                    ring.nexts.setdefault(src, []).append((x, self.rng.random() + 0.2))
        for k in range(len(ring.layers) - 1):             # every non-exit member needs somewhere to send
            for m in ring.layers[k]:
                if not ring.nexts.get(m):
                    ring.nexts[m] = [(self.rng.choice(ring.layers[k + 1]), 1.0)]

    def _attrs(self, ring: Ring) -> None:
        """Account age, difficulty and shared devices for ring members."""
        rng, w = self.rng, self.w
        for idx in ring.members:
            a = w.accts[idx]
            a.ring = ring.id
            a.difficulty = "hard" if idx in self._hard else "easy"
            if a.mule_type == "complicit_new":
                a.opened = min(self._date(ring.start - rng.randint(5, 60) * DAY), self._date(self.now - 10 * DAY))
                p = w.person(a)
                if (a.opened - p.dob).days < 18 * 365 + 30:
                    p.dob = a.opened - timedelta(days=18 * 365 + rng.randint(30, 1000))
            else:
                self.ensure_opened(idx, ring.start - 3 * DAY)
            if a.mule_type in ("rented", "ato") and a.difficulty == "easy":
                self.new_dev[idx] = [self._token(), self._token()]
        farm = [i for i in ring.members if w.accts[i].difficulty == "easy"
                and w.accts[i].mule_type in ("complicit_new", "gateway", "atm_cashout", "crypto_cashout")]
        if ring.showcase:
            farm = [self.w.showcase[r] for r in ("A2", "C1", "C2", "D1", "E1")]
        rng.shuffle(farm)
        while len(farm) >= 4:
            n = min(len(farm), rng.randint(4, 13))
            if len(farm) - n < 4:
                n = len(farm)
            tok, grp, farm = self._token(), farm[:n], farm[n:]
            for i in grp:
                w.accts[i].device = tok
                w.person(w.accts[i]).device = tok

    def _build_showcase(self, sc: dict[str, int]) -> None:
        now = self.now
        L1 = [sc["A1"], sc["B1"]]
        L2 = [sc["C1"], sc["C2"], sc["A2"]]
        EX = [sc["D1"], sc["E1"]]
        nexts = {sc["A1"]: [(sc["C1"], 1.0), (sc["C2"], 1.0)], sc["B1"]: [(sc["C1"], 1.0), (sc["A2"], 1.0)],
                 sc["C1"]: [(sc["D1"], 1.0), (sc["E1"], 1.0)], sc["C2"]: [(sc["E1"], 1.0), (sc["D1"], 1.0)],
                 sc["A2"]: [(sc["D1"], 1.0)]}
        start = now + SC_PAY[0][0] - 600
        ring = Ring(id="R000", kind="crypto", layers=[L1, L2, EX], nexts=nexts, start=start, end=now + 3 * DAY,
                    live=True, showcase=True, slow=1.0)
        ring.flush_at = {sc[r]: now + dt for r, dt in SC_FLUSH.items()}
        ring.plan = [(0.5, 2, "deposit", "EX01"), (0.35, 1, "deposit", "EX02"), (0.15, 2, "mixer", None)]
        self.showcase_ring = ring

    # ------------------------------------------------------------------ execute (after background)
    def execute(self) -> list[Victim]:
        self._seller_ready()
        self._sellers = {s.acct: s for s in self.crypto.sellers}
        self._make_victims()
        self._pick_complaints()
        for ring in self.rings + [self.showcase_ring]:
            self._run_ring(ring)
        self._scam_windows()
        return self.complaints

    def _seller_ready(self) -> None:
        for s in self.crypto.sellers:
            self.ensure_opened(s.acct, self.clock.t0 - 30 * DAY)

    def _victim_ts(self, base: int) -> int:
        day0 = int((base + 19800) // DAY * DAY - 19800)
        h = self.rng.choices(range(24), HOUR_WEIGHTS)[0]
        return max(base, day0 + h * 3600 + self.rng.randint(0, 3599))

    def _amounts(self, scam: str, wealth: float) -> list[int]:
        _, (plo, phi), (alo, ahi) = SCAM_TYPES[scam]
        n = self.rng.randint(plo, phi)
        raw = [math.exp(self.rng.uniform(math.log(alo), math.log(ahi))) for _ in range(n)]
        total = sum(raw)
        cap = min(1_500_000.0, max(6000.0, wealth * 0.9))
        if total > cap:
            raw = [x * cap / total for x in raw]
            total = cap
        if total < 5000:
            raw = [x * 5000 / total for x in raw]
        out = []
        for x in raw:
            x = max(500.0, x)
            if self.rng.random() < 0.8:
                step = 1000 if x >= 10000 else 500
                x = max(step, round(x / step) * step)
            else:
                x = round(x)
            out.append(int(x) * 100)
        return out

    def _gap(self, scam: str) -> int:
        r = self.rng
        return {"digital_arrest": lambda: r.randint(1200, 10800), "investment_task": lambda: r.randint(3 * 3600, int(2.5 * DAY)),
                "job_part_time": lambda: r.randint(3 * 3600, 2 * DAY), "kyc_update": lambda: r.randint(600, 3600),
                "sextortion": lambda: r.randint(3600, 2 * DAY), "upi_collect": lambda: r.randint(300, 3600)}[scam]()

    def _make_victims(self) -> None:
        w, rng = self.w, self.rng
        pool = [i for i in w.by_seg.get("victim", []) if i != w.showcase["V"]]
        rng.shuffle(pool)
        rings = self.rings
        wts = [VICTIM_WEIGHT[r.kind] for r in rings]
        counts = self._alloc(len(pool), wts, [max(3, len(r.layers[0]) + 1) for r in rings])
        pos = 0
        for ring, cnt in zip(rings, counts):
            scams = {"mass": MASS_SCAMS, "targeted": TARGETED_SCAMS, "crypto": ("investment_task", "job_part_time")}[ring.kind]
            l1 = list(ring.layers[0])
            rng.shuffle(l1)
            for j, acct in enumerate(pool[pos:pos + cnt]):
                ring.victims.append(self._victim(ring, acct, rng.choice(scams), l1[j] if j < len(l1) else None))
            pos += cnt
        self._showcase_victim()

    def _victim(self, ring: Ring, acct: int, scam: str, first_target: int | None = None) -> Victim:
        rng, w = self.rng, self.w
        a = w.accts[acct]
        wealth = max(w.person(a).income, 8000.0) * rng.uniform(4, 40)
        amts = self._amounts(scam, wealth)
        seller_dest = ring.kind == "crypto" and scam == "investment_task" and rng.random() < 0.5 and bool(self.crypto.sellers)
        t = self._victim_ts(int(ring.start + rng.uniform(0, max(1, ring.end - ring.start - 3 * 3600))))
        v = Victim(acct=acct, scam=scam, pays=[], ring=ring.id, seller_dest=seller_dest, kind=ring.kind)
        l1 = ring.layers[0]
        wl = [rng.random() + 0.3 for _ in l1]
        last_target = first_target if first_target is not None else -1
        for amt in amts:
            if t > ring.end and not ring.live:
                break
            if seller_dest:
                tgt = self.crypto.pick_seller().acct
            else:
                tgt = last_target if (last_target >= 0 and rng.random() < 0.7) else rng.choices(l1, wl)[0]
            last_target = tgt
            rail = pick_rail(rng, amt / 100, 0.65, 0.3, 0.05)
            v.pays.append(Pay(ts=t, amt=amt, target=tgt, rail=rail))
            t += self._gap(scam)
        if not v.pays:
            tgt = self.crypto.pick_seller().acct if seller_dest else l1[0]
            v.pays.append(Pay(ts=int(ring.start + 3600), amt=amts[0], target=tgt, rail="UPI"))
        self.ensure_opened(acct, v.pays[0].ts - 3 * DAY)
        return v

    def _showcase_victim(self) -> None:
        now, w = self.now, self.w
        vi = w.showcase["V"]
        pays = [Pay(ts=now + dt, amt=amt * 100, target=w.showcase[role], rail=rail) for dt, amt, role, rail in SC_PAY]
        v = Victim(acct=vi, scam="digital_arrest", pays=pays, ring="R000", cid=SHOWCASE_COMPLAINT, kind="targeted")
        v.reported_at = pays[-1].ts + 55 * 60
        v.channel = "helpline_1930"
        self.ensure_opened(vi, pays[0].ts - 3 * DAY)
        p = w.person(w.accts[vi])
        p.name, p.city, p.female = "Ramesh Iyer", "Pune", False
        self.showcase_ring.victims.append(v)
        self.showcase_victim = v

    def _pick_complaints(self) -> None:
        rng, now = self.rng, self.now
        cands = [v for r in self.rings if r.discovered for v in r.victims if v.pays[-1].ts <= now - 1200]
        k = max(0, min(self.n_complaints - 1, len(cands)))
        if k:
            tot = np.array([sum(p.amt for p in v.pays) / 100 for v in cands])
            p = np.where(tot >= 50_000, 0.9, np.where(tot >= 10_000, 0.55, 0.12))
            pick = self.nprng.choice(len(cands), size=k, replace=False, p=p / p.sum())
            chosen = sorted((cands[i] for i in pick), key=lambda v: v.pays[0].ts)
        else:
            chosen = []
        n = 3000
        for v in chosen:
            n += 1
            if n == int(SHOWCASE_COMPLAINT[2:]):
                n += 1
            v.cid = f"C-{n}"
            last = v.pays[-1].ts
            r = rng.random()
            delay = rng.randint(8 * 60, 3600) if r < 0.12 else rng.randint(3600, 6 * 3600) if r < 0.5 else rng.randint(6 * 3600, 4 * DAY)
            v.reported_at = min(last + delay, now - rng.randint(300, 3600))
            v.channel = rng.choices(["helpline_1930", "ncrp_portal", "bank", "walk_in"], [45, 45, 7, 3])[0]
        self.complaints = chosen + [self.showcase_victim]

    # ------------------------------------------------------------------ the engine
    def _run_ring(self, ring: Ring) -> None:
        self._ring = ring
        self._heap: list = []
        self._seq = 0
        self._buf: dict[int, deque] = {}
        self._sched: set[int] = set()
        if not ring.wallets and (ring.kind == "crypto" or any(v.seller_dest for v in ring.victims)
                                 or any(self.w.accts[m].mule_type == "crypto_cashout" for m in ring.members)):
            ring.wallets = [self.crypto.ring_wallet(ring.id) for _ in range(self.rng.randint(1, 2))]
        for v in ring.victims:
            self._victim_payments(ring, v)
        while self._heap:
            ts, _, kind, m, payload = heapq.heappop(self._heap)
            if kind == "A":
                self._arrive(ring, m, ts, payload)
            else:
                self._flush(ring, m, ts)

    def _push(self, ts: int, kind: str, m: int, payload=None) -> None:
        self._seq += 1
        heapq.heappush(self._heap, (ts, self._seq, kind, m, payload))

    def _victim_payments(self, ring: Ring, v: Victim) -> None:
        va = self.w.accts[v.acct]
        for pay in v.pays:
            prov = [(v.cid, pay.amt)]
            pay.tidx = self.store.add(v.acct, pay.target, pay.amt, pay.ts, pay.rail, va.device, SCAM, prov=prov)
            if v.seller_dest:
                seller = self._sellers[pay.target]
                wallet = self.rng.choice(ring.wallets)
                ri, rts, micro = self.crypto.p2p_release(seller, wallet, pay.amt, pay.ts, [v.cid])
                pay.hash = self.crypto.transfers[ri][0]
                pay.wallet = wallet
                plan = ring.plan or self.crypto.random_plan()
                self.crypto.tail(wallet, micro, rts + self.rng.randint(300, 3600), plan, [v.cid], ring.slow)
            else:
                self._push(pay.ts, "A", pay.target, [[v.cid, pay.amt]])

    def _arrive(self, ring: Ring, m: int, ts: int, packets: list) -> None:
        self._seen.add(m)
        self._buf.setdefault(m, deque()).extend([list(p) for p in packets])
        if m not in self._sched:
            self._sched.add(m)
            when = ring.flush_at.get(m)
            self._push(max(ts + 1, when) if when else ts + self._delay(m), "F", m)

    def _delay(self, m: int) -> int:
        a = self.w.accts[m]
        typ, hard, r, u = a.mule_type, a.difficulty == "hard", self.rng, self.rng.random()
        if typ == "gateway":
            return r.randint(3600, 4 * 3600) if hard else r.randint(900, 3600)
        if typ == "unwitting":
            return r.randint(3 * 3600, 12 * 3600) if hard else r.randint(3600, 6 * 3600)
        if typ == "ato":
            return r.randint(900, 3600) if hard else r.randint(60, 900)
        if typ == "atm_cashout":
            return r.randint(2 * 3600, 8 * 3600) if hard else r.randint(180, 25 * 60)
        if typ == "crypto_cashout":
            return r.randint(3600, 6 * 3600) if hard else r.randint(300, 40 * 60)
        if hard:
            return r.randint(60, 900) if u < 0.15 else r.randint(900, 3600) if u < 0.35 else r.randint(3600, 24 * 3600)
        return r.randint(60, 900) if u < 0.35 else r.randint(900, 3600) if u < 0.65 else r.randint(3600, 12 * 3600)

    @staticmethod
    def _take(dq: deque, amt: int) -> list:
        out = []
        while amt > 0 and dq:
            cid, have = dq[0]
            use = min(have, amt)
            out.append((cid, use))
            if use == have:
                dq.popleft()
            else:
                dq[0][1] = have - use
            amt -= use
        return out

    def _flush(self, ring: Ring, m: int, t: int) -> None:
        self._sched.discard(m)
        dq = self._buf.get(m)
        if not dq:
            return
        a = self.w.accts[m]
        total = sum(p[1] for p in dq)
        hard = a.difficulty == "hard"
        typ = a.mule_type
        if typ == "atm_cashout":
            self._atm(a, t, dq, total, hard)
            return
        if typ == "gateway":
            keep = self.rng.uniform(0.05, 0.2) if hard else self.rng.uniform(0.02, 0.08)
        elif typ == "unwitting":
            keep = self.rng.uniform(0.1, 0.3) if hard else self.rng.uniform(0.05, 0.15)
        else:
            keep = self.rng.uniform(0.03, 0.25) if hard else self.rng.uniform(0.0, 0.06)
        out = int(total * (1 - keep))
        if out < 1000:
            return
        if typ == "crypto_cashout":
            self._to_sellers(ring, a, t, dq, out)
        else:
            self._forward(ring, a, t, dq, out)

    def _dev(self, a, k: int = 0) -> str:
        devs = self.new_dev.get(a.idx)
        return devs[k % 2] if devs else a.device

    def _pieces(self, amt: int, structure: bool) -> list[int]:
        rupees = amt / 100
        if structure and rupees <= 60_000 and rupees / 950 <= 40:
            out, rem = [], amt
            while rem >= 100_000:
                x = self.rng.randint(900, 999) * 100
                out.append(x)
                rem -= x
            if rem > 0:
                out.append(rem)
            return out
        if rupees <= 100_000:
            return [amt]
        if rupees <= 500_000 and self.rng.random() < 0.5:
            return [amt]
        out, rem = [], amt
        lim = (60_000, 100_000) if rupees <= 500_000 else (150_000, 500_000)
        while rem > lim[1] * 100:
            x = self.rng.randint(lim[0], lim[1]) * 100
            out.append(x)
            rem -= x
        out.append(rem)
        return out

    def _forward(self, ring: Ring, a, t: int, dq: deque, out: int) -> None:
        rng = self.rng
        typ, hard = a.mule_type, a.difficulty == "hard"
        nxt = ring.nexts.get(a.idx) or []
        if not nxt:
            return
        k = rng.choice([1, 1, 1, 2, 2, 3]) if typ in ("gateway", "complicit_new", "rented") else rng.choice([1, 1, 2]) if typ == "unwitting" else min(len(nxt), rng.randint(6, 10))
        k = len(nxt) if ring.showcase else max(1, min(k, len(nxt)))
        pool = list(nxt)
        dests = []
        for _ in range(k):
            unseen = [x for x in pool if x[0] not in self._seen]            # reach every ring member
            d = rng.choices(unseen, [x[1] for x in unseen])[0] if (unseen and not ring.showcase) else rng.choices(pool, [x[1] for x in pool])[0]
            dests.append(d[0])
            pool.remove(d)
        shares = [out // len(dests)] * len(dests) if ring.showcase else self._split(out, len(dests))
        shares[-1] += out - sum(shares) if ring.showcase else 0
        if a.idx not in self._burst_done and rng.random() < 0.2:      # once per mule, a burst of failed attempts
            self._burst_done.add(a.idx)
            for _ in range(rng.randint(5, 8)):
                self.store.add(a.idx, dests[0], rng.randint(500, 9000) * 100, t - rng.randint(10, 400), "UPI", self._dev(a), SCAM, FAILED)
        structure = typ == "gateway" and (hard or rng.random() < 0.25)
        cur, ndev = t, 0
        for dest, share in zip(dests, shares):
            for amt in self._pieces(share, structure):
                cur += rng.randint(60, 900) if hard else rng.randint(15, 240)
                rail = pick_rail(rng, amt / 100, 0.55, 0.4, 0.05) if amt / 100 <= 100_000 else pick_rail(rng, amt / 100)
                if rng.random() < 0.55:
                    amt = amt // 100 * 100
                prov = self._take(dq, amt)
                if not prov:
                    return
                amt = sum(x for _, x in prov)
                self.store.add(a.idx, dest, amt, cur, rail, self._dev(a, ndev), SCAM, prov=prov)
                ndev += 1
                self._push(cur, "A", dest, [list(p) for p in prov])

    def _atm(self, a, t: int, dq: deque, total: int, hard: bool) -> None:
        rng = self.rng
        ids = self.atm_ids.setdefault(a.idx, [atm_id(rng, self.ifscs) for _ in range(rng.randint(2, 3))])
        cash = int(total * (rng.uniform(0.6, 0.9) if hard else rng.uniform(0.95, 1.0)))
        cur, spent_today, day_budget = t, 0, rng.choice([40_000, 50_000, 100_000])
        while cash >= 100_000:
            chunk = min(cash, rng.choice([5000, 10000, 10000, 15000, 20000, 20000, 25000]) * 100)
            if spent_today + chunk > day_budget * 100 and spent_today:
                nd = (datetime.fromtimestamp(cur, IST).replace(hour=9, minute=rng.randint(0, 40), second=0, microsecond=0)
                      + timedelta(days=1))
                cur, spent_today = int(nd.timestamp()), 0
            prov = self._take(dq, chunk)
            if not prov:
                return
            chunk = sum(x for _, x in prov)
            self.store.add(a.idx, -1, chunk, cur, "ATM", rng.choice(ids), SCAM, prov=prov)
            spent_today += chunk
            cash -= chunk
            cur += rng.randint(3 * 60, 12 * 60) if not hard else rng.randint(10 * 60, 90 * 60)

    def _to_sellers(self, ring: Ring, a, t: int, dq: deque, out: int) -> None:
        rng = self.rng
        k = 1 if (ring.showcase or out < 5_000_000) else rng.randint(1, 2)
        micro_total, last_rel, cids = 0, t, set()
        wallet = rng.choice(ring.wallets)
        cur = t
        for amt in self._split(out, k):
            seller = None
            for _ in range(8):
                s = self.crypto.pick_seller()
                if self.w.accts[s.acct].opened <= self._date(cur):
                    seller = s
                    break
            if seller is None:
                return
            for chunk in self._pieces_p2p(amt):
                prov = self._take(dq, chunk)
                if not prov:
                    break
                chunk = sum(x for _, x in prov)
                cur += rng.randint(120, 1200)
                rail = pick_rail(rng, chunk / 100, 0.7, 0.3, 0.0)
                self.store.add(a.idx, seller.acct, chunk, cur, rail, self._dev(a), SCAM, prov=prov)
                cs = [c for c, _ in prov]
                _, rts, micro = self.crypto.p2p_release(seller, wallet, chunk, cur, cs)
                micro_total += micro
                last_rel = max(last_rel, rts)
                cids.update(cs)
        if micro_total:
            plan = ring.plan or self.crypto.random_plan()
            self.crypto.tail(wallet, micro_total, last_rel + rng.randint(300, 3600), plan, list(cids), ring.slow)

    def _pieces_p2p(self, amt: int) -> list[int]:
        out, rem = [], amt
        while rem > 200_000 * 100:
            x = self.rng.randint(40_000, 200_000) * 100
            out.append(x)
            rem -= x
        out.append(rem)
        return out

    # ------------------------------------------------------------------ bookkeeping
    def _scam_windows(self) -> None:
        st = self.store
        for i, kind in enumerate(st.kind):
            if kind != SCAM or st.st[i] == FAILED:
                continue
            for acct in (st.f[i], st.t[i]):
                if acct < 0:
                    continue
                a = self.w.accts[acct]
                if a.segment != "mule":
                    continue
                ts = st.ts[i]
                a.first_scam = ts if not a.first_scam else min(a.first_scam, ts)
                a.last_scam = max(a.last_scam, ts)
        for a in self.w.accts:                  # a "mule" that never saw scam money is just an ordinary account
            if a.segment == "mule" and not a.first_scam:
                a.segment, a.mule_type, a.ring, a.difficulty = "other_retail", "", "", ""
                self.demoted += 1
