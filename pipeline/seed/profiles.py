"""Population: people first, then accounts. Everything here is generic: segment and mule type
only decide the *distribution* a value is drawn from, never a recognisable pattern."""
from __future__ import annotations

import math
import random
import re
from datetime import date, datetime, timedelta

import numpy as np

from .banks import Bank
from .config import (ACCT_LEN, CITIES, DOUBLE_OWNER_SHARE, MULE_MIX, SEGMENT_SHARE, SELLERS_AT_20K,
                     BILLER_PER_ACCOUNTS, UTC, WALLET_PREFIX, HISTORY_DAYS)
from .world import Acct, Clock, Person, World

# showcase ring: (role, bank, mule type). Five banks across all five layout families.
SHOWCASE_MULES = [
    ("A1", "SBI", "unwitting"), ("A2", "SBI", "complicit_new"), ("B1", "AXIS", "rented"),
    ("C1", "KOTAK", "complicit_new"), ("C2", "AU", "complicit_new"),
    ("D1", "PAYTM", "crypto_cashout"), ("E1", "SBI", "atm_cashout"),
]
SHOWCASE_VICTIM_BANK = "ICICI"

_FIRST_M = ["Rahul", "Amit", "Rohit", "Vikas", "Sanjay", "Arjun", "Imran", "Karan", "Deepak", "Sahil", "Nikhil", "Manoj",
            "Ravi", "Ankit", "Sourav", "Bikash", "Pranjal", "Abhishek", "Faizan", "Gaurav", "Harsh", "Kunal", "Nitin",
            "Pankaj", "Suresh", "Tarun", "Vivek", "Ramesh", "Anil", "Mohan"]
_FIRST_F = ["Pooja", "Meena", "Anjali", "Priya", "Neha", "Sneha", "Ritu", "Kavita", "Sunita", "Rekha", "Dipika", "Farah",
            "Gargi", "Ishita", "Jyoti", "Komal", "Lipika", "Nandini", "Pallavi", "Rashmi", "Shabnam", "Tanvi", "Urmila"]
_LAST = ["Sharma", "Verma", "Das", "Saikia", "Bora", "Kalita", "Nath", "Gogoi", "Baruah", "Hussain", "Ali", "Singh", "Kumar",
         "Yadav", "Gupta", "Mishra", "Patel", "Reddy", "Iyer", "Menon", "Dutta", "Sen", "Roy", "Chakraborty", "Khan", "Joshi",
         "Mehta", "Pandey", "Nair", "Rao"]
_SHOP_PRE = ["Shree", "Maa Kamakhya", "New", "Royal", "Sai", "Brahmaputra", "City", "Lakshmi", "Ganesh", "Star", "Jai Hind",
             "Northeast", "Durga", "Krishna", "Balaji", "Annapurna", "Om", "Gupta", "Verma", "Patel"]
_SHOP_KIND = ["Kirana Store", "Medical Hall", "Mobile Point", "Tea Stall", "Sweets", "Hardware", "Garments", "Electronics",
              "Pharmacy", "Bakery", "Stationers", "Auto Parts", "Dhaba", "Salon", "Book Depot", "General Store",
              "Fruits & Veg", "Cafe", "Provision Store"]
_BIZ_KIND = ["Traders", "Enterprises", "Logistics", "Industries", "Agencies", "Distributors", "Exports", "Constructions",
             "Textiles", "Foods"]
_BILLERS = {
    "electricity": ["State Power Distribution Co", "Urban Electricity Board", "Metro Power Supply Ltd"],
    "telecom": ["Bharat Telecom Services", "Nexa Mobile Recharge", "FiberLink Broadband"],
    "lender": ["Capital Home Finance Ltd", "Apex Consumer Finance", "Unity Auto Loans", "Prime Micro Finance"],
    "insurance": ["Lifeline Insurance Co", "SafeGuard General Insurance"],
    "ecommerce": ["ShopSphere Marketplace", "QuickKart Settlements"],
    "platform": ["RideNow Partner Payouts", "DeliverEasy Partner Payouts"],
    "govt": ["Pension Disbursement Office", "Municipal Tax Collection"],
}
_BILLER_KIND_W = {"electricity": 25, "telecom": 15, "lender": 25, "insurance": 8, "ecommerce": 14, "platform": 7, "govt": 6}
_EMAIL_DOMAINS = ["gmail.com", "gmail.com", "gmail.com", "yahoo.in", "outlook.com", "rediffmail.com", "hotmail.com"]


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


class NameGen:
    def __init__(self, seed: int, rng: random.Random):
        self.rng = rng
        try:
            from faker import Faker
            self.fake = Faker("en_IN")
            self.fake.seed_instance(seed)
            self.fake.first_name_male(), self.fake.first_name_female(), self.fake.last_name()
        except Exception:                      # faker missing or locale lacks these providers
            self.fake = None

    def name(self, female: bool) -> str:
        if self.fake is not None:
            first = self.fake.first_name_female() if female else self.fake.first_name_male()
            return f"{first} {self.fake.last_name()}"
        return f"{self.rng.choice(_FIRST_F if female else _FIRST_M)} {self.rng.choice(_LAST)}"


def _lognorm(nprng, median: float, sigma: float, lo: float, hi: float) -> float:
    return float(min(hi, max(lo, nprng.lognormal(math.log(median), sigma))))


def draw_profile(base: str, rng: random.Random, nprng) -> tuple[int, str, float, bool]:
    """-> (age, occupation token, monthly declared income INR, female)."""
    u = rng.random
    if base == "salaried":
        return rng.randint(23, 58), "salaried" if u() < .9 else "professional", round(_lognorm(nprng, 38000, .55, 12000, 400000), -2), u() < .30
    if base == "student":
        return rng.randint(18, 24), "student", (0.0 if u() < .6 else float(rng.randrange(3000, 12001, 500))), u() < .45
    if base == "merchant":
        return rng.randint(26, 62), "shopkeeper", round(_lognorm(nprng, 35000, .5, 10000, 150000), -2), u() < .15
    if base == "gig":
        return rng.randint(20, 42), rng.choice(["freelancer", "driver"]), round(_lognorm(nprng, 22000, .35, 10000, 45000), -2), u() < .12
    if base == "business":
        return rng.randint(30, 65), "business", round(_lognorm(nprng, 250000, .6, 80000, 1500000), -3), u() < .12
    if base == "retired":
        return rng.randint(60, 82), "retired", round(_lognorm(nprng, 25000, .5, 8000, 90000), -2), u() < .35
    if base == "homemaker":
        return rng.randint(26, 58), "homemaker", 0.0, u() < .95
    if base == "daily_wage":
        return rng.randint(20, 58), rng.choice(["daily_wage", "labourer"]), round(_lognorm(nprng, 11000, .3, 6000, 20000), -2), u() < .25
    if base == "trader":
        return rng.randint(22, 45), rng.choices(["salaried", "freelancer", "self_employed"], [4, 3, 3])[0], round(_lognorm(nprng, 55000, .5, 20000, 250000), -2), u() < .15
    if base == "busy":
        return rng.randint(32, 62), "self_employed", round(_lognorm(nprng, 60000, .5, 20000, 300000), -2), u() < .30
    if base == "seller":
        return rng.randint(24, 45), rng.choice(["self_employed", "freelancer"]), round(_lognorm(nprng, 70000, .4, 30000, 250000), -2), u() < .1
    # retail and anything else
    occ = rng.choices(["salaried", "self_employed", "farmer", "driver", "professional", "shopkeeper", "unemployed"],
                      [35, 20, 8, 8, 6, 6, 7])[0]
    return rng.randint(21, 65), occ, round(_lognorm(nprng, 28000, .6, 6000, 250000), -2), u() < .35


def draw_mule_profile(mtype: str, rng: random.Random, nprng) -> tuple[int, str, float, bool, str]:
    """-> age, occupation, monthly income, female, background base."""
    u = rng.random
    if mtype == "complicit_new":
        occ = rng.choice(["daily_wage", "labourer", "student", "unemployed"])
        age = rng.randint(18, 24) if occ == "student" else rng.randint(19, 38)
        return age, occ, float(rng.randrange(0, 16001, 500)) if occ != "student" else 0.0, u() < .2, "minimal"
    if mtype == "rented":
        occ = rng.choice(["labourer", "daily_wage", "driver", "farmer", "unemployed", "retired"])
        return rng.randint(28, 66), occ, float(rng.randrange(6000, 22001, 500)), u() < .25, "minimal"
    if mtype == "unwitting":
        k = rng.choices(["student", "homemaker", "gig"], [4, 3, 3])[0]
        age, occ, inc, fem = draw_profile(k, rng, nprng)
        return age, occ, inc, fem, k
    if mtype == "ato":
        age, occ, inc, fem = draw_profile("salaried", rng, nprng)
        return max(age, 30), occ, inc, fem, "salaried"
    if mtype == "gateway":
        return rng.randint(22, 42), rng.choice(["freelancer", "self_employed", "unemployed"]), float(rng.randrange(8000, 30001, 500)), u() < .15, "minimal"
    if mtype == "crypto_cashout":
        return rng.randint(20, 35), rng.choice(["freelancer", "unemployed", "student"]), float(rng.randrange(8000, 26001, 500)), u() < .15, "minimal"
    # atm_cashout
    occ = rng.choice(["labourer", "driver", "daily_wage", "student"])
    return (rng.randint(18, 24) if occ == "student" else rng.randint(19, 45)), occ, float(rng.randrange(6000, 18001, 500)), u() < .15, "minimal"


def _largest_remainder(total: int, weights: dict[str, float]) -> dict[str, int]:
    s = sum(weights.values())
    raw = {k: total * w / s for k, w in weights.items()}
    out = {k: int(v) for k, v in raw.items()}
    for k in sorted(raw, key=lambda k: raw[k] - out[k], reverse=True)[: total - sum(out.values())]:
        out[k] += 1
    return out


def segment_counts(n: int) -> dict[str, int]:
    c = {k: round(v * n) for k, v in SEGMENT_SHARE.items()}
    c["mule"] = max(c["mule"], 14)
    c["p2p_seller"] = max(6, round(SELLERS_AT_20K * n / 20000))
    c["biller"] = max(14, round(n / BILLER_PER_ACCOUNTS))
    c["other_retail"] = n - sum(c.values())
    if c["other_retail"] < 0:
        raise SystemExit("--accounts too small for the segment plan")
    return c


_SEG_BASE = {
    "salaried": "salaried", "student": "student", "merchant": "merchant", "gig": "gig", "business": "business",
    "retired": "retired", "homemaker": "homemaker", "daily_wage": "daily_wage", "p2p_trader": "trader",
    "busy_legit": "busy", "dormant": "retail", "other_retail": "retail", "p2p_seller": "seller", "biller": "biller",
}
BIG_BANKS = ["SBI", "HDFC", "ICICI", "AXIS", "PNB", "KOTAK", "BOB", "CANARA", "UBI"]
_PAIRABLE = ("salaried", "student", "other_retail", "retired", "homemaker", "gig", "daily_wage")


def _shop_name(rng: random.Random) -> str:
    return f"{rng.choice(_SHOP_PRE)} {rng.choice(_SHOP_KIND)}"


def _biz_name(rng: random.Random) -> str:
    return f"{rng.choice(_SHOP_PRE)} {rng.choice(_BIZ_KIND)}"


def _draw_opened(rng: random.Random, nprng, now: date, age: int, dormant_gap: int = 0, old: bool = False) -> date:
    max_days = 12 * 365
    if dormant_gap:
        days = dormant_gap + HISTORY_DAYS + 120 + int(rng.random() * 1800)
    elif old:
        days = rng.randint(500, 3600)
    else:
        days = 10 + int(nprng.beta(1.0, 1.8) * (max_days - 10))
    days = min(days, max_days + 1500)
    days = min(days, max(10, (age - 18) * 365 - 30))        # open no earlier than the 18th birthday
    if dormant_gap:
        days = max(days, dormant_gap + HISTORY_DAYS + 90)
    return now - timedelta(days=max(10, days))


def build_population(n: int, banks: dict[str, Bank], clock: Clock, seed: int, rng: random.Random, nprng,
                     ) -> World:
    if n < 2000:
        raise SystemExit("--accounts must be at least 2000 (the showcase ring needs room)")
    world = World(clock=clock)
    now_date = datetime.fromtimestamp(clock.now, UTC).date()
    names = NameGen(seed, rng)
    counts = segment_counts(n)

    # --- segment plan -------------------------------------------------------------------------
    plan: list[str] = []
    for seg, k in counts.items():
        plan += [seg] * k
    rng.shuffle(plan)
    mule_types = [t for t, k in _largest_remainder(counts["mule"], MULE_MIX).items() for _ in range(k)]
    rng.shuffle(mule_types)
    victim_bases = ["salaried", "retired", "retail", "homemaker"]

    # showcase assignments: first mule of a given type gets the forced bank
    forced_bank: dict[int, str] = {}
    mule_slots = [i for i, s in enumerate(plan) if s == "mule"]
    mtype_by_idx = dict(zip(mule_slots, mule_types))
    used_mules: set[int] = set()
    for role, bank, mtype in SHOWCASE_MULES:
        i = next(i for i in mule_slots if mtype_by_idx[i] == mtype and i not in used_mules)
        used_mules.add(i)
        forced_bank[i] = bank
        world.showcase[role] = i
    vslot = next(i for i, s in enumerate(plan) if s == "victim")
    forced_bank[vslot] = SHOWCASE_VICTIM_BANK
    world.showcase["V"] = vslot

    codes = list(banks)
    w_all = np.array([banks[c].share for c in codes], float)
    w_nowallet = np.array([0.0 if banks[c].is_wallet else banks[c].share for c in codes], float)
    w_all /= w_all.sum()
    w_nowallet /= w_nowallet.sum()
    nowallet_segs = {"business", "busy_legit", "p2p_seller", "biller", "p2p_trader"}
    bank_draw = nprng.random(n)
    cw_all, cw_nw = np.cumsum(w_all), np.cumsum(w_nowallet)

    city_names = [c for c, _ in CITIES]
    city_p = np.array([w for _, w in CITIES], float)
    city_p /= city_p.sum()
    cities = nprng.choice(len(city_names), size=n, p=city_p)

    used_phone: set[str] = set()
    used_dev: set[str] = set()

    def phone() -> str:
        while True:
            p = str(rng.choice("6789")) + f"{rng.randrange(10**9):09d}"
            if p not in used_phone:
                used_phone.add(p)
                return p

    def device() -> str:
        while True:
            d = f"{rng.getrandbits(64):016x}"
            if d not in used_dev:
                used_dev.add(d)
                return d

    # --- people + accounts -------------------------------------------------------------------
    for i, seg in enumerate(plan):
        mtype = mtype_by_idx.get(i, "")
        dormant_gap = 0
        old = False
        if seg == "mule":
            age, occ, income, female, base = draw_mule_profile(mtype, rng, nprng)
            if mtype == "rented":
                dormant_gap, old = rng.randint(365, 1095), True
            elif mtype == "ato":
                old = True
        else:
            base = rng.choices(victim_bases, [5, 1.5, 2.5, 1])[0] if seg == "victim" else _SEG_BASE[seg]
            age, occ, income, female = draw_profile(base, rng, nprng)
            if seg == "dormant":
                dormant_gap = rng.randint(365, 1095)
        if dormant_gap or old:
            age = max(age, 22)
        opened = _draw_opened(rng, nprng, now_date, age, dormant_gap, old)
        if seg == "mule" and mtype == "complicit_new":
            opened = now_date - timedelta(days=100)              # rewritten by the scenario
        age = max(age, int((now_date - opened).days / 365) + 18)
        age = min(age, 85)
        dob = now_date - timedelta(days=age * 365 + rng.randint(0, 364))

        bname = ""
        bkind = ""
        if seg == "merchant":
            bname = _shop_name(rng)
        elif seg == "business":
            bname = _biz_name(rng)
        elif seg == "busy_legit":
            kind = rng.choice(["chit", "ngo", "family"])
            bname = {"chit": f"{rng.choice(_SHOP_PRE)} Chit Fund Group", "ngo": f"{rng.choice(_SHOP_PRE)} Foundation Trust", "family": ""}[kind]
            bkind = kind
        elif seg == "biller":
            bkind = rng.choices(list(_BILLER_KIND_W), list(_BILLER_KIND_W.values()))[0]
            bname = rng.choice(_BILLERS[bkind])
        female_name = female
        person = Person(pid=len(world.persons), name=names.name(female_name), female=female, dob=dob,
                        city=city_names[int(cities[i])], occ=occ, income=float(income), phone=phone(), device=device())
        person.email = f"{slug(person.name.split()[0])}.{slug(person.name.split()[-1])}{rng.randrange(10, 9999)}@{rng.choice(_EMAIL_DOMAINS)}"
        world.persons.append(person)

        if i in forced_bank:
            bank = forced_bank[i]
        elif seg == "mule":
            bank = ""                       # chosen together with the ring, see Scenarios.plan()
        elif seg == "biller":
            bank = rng.choices(BIG_BANKS, [banks[c].share for c in BIG_BANKS])[0]
        else:
            cw = cw_nw if seg in nowallet_segs else cw_all
            bank = codes[int(np.searchsorted(cw, bank_draw[i], side="right").clip(0, len(codes) - 1))]
        a = Acct(idx=i, bank=bank, no="", ifsc="", vpa="", pid=person.pid, opened=opened,
                 segment="mule" if seg == "mule" else seg, base=base, device=person.device,
                 wallet=bool(bank) and banks[bank].is_wallet, dormant_gap=dormant_gap, bname=bname, bkind=bkind,
                 mule_type=mtype)
        if a.wallet:
            a.kyc = "MIN" if occ in ("student", "daily_wage", "homemaker", "labourer") and seg != "mule" else "FULL"
            a.limit = 10000.0 if a.kyc == "MIN" else 200000.0
        if seg == "dormant":
            a.reactivates = rng.random() < 0.3
        if mtype == "rented":
            a.reactivates = True
        world.accts.append(a)

    # --- people who own two accounts at different banks -----------------------------------------
    target_pairs = round(DOUBLE_OWNER_SHARE / (1 + DOUBLE_OWNER_SHARE) * n)
    groups: dict[str, list[int]] = {s: [] for s in _PAIRABLE}
    for a in world.accts:
        if a.segment in groups:
            groups[a.segment].append(a.idx)
    total_elig = sum(len(v) for v in groups.values())
    pairs_made = 0
    for seg, idxs in groups.items():
        rng.shuffle(idxs)
        want = round(target_pairs * len(idxs) / total_elig)
        used: set[int] = set()
        for pos, ia in enumerate(idxs):
            if pairs_made >= target_pairs or len(used) >= 2 * want:
                break
            if ia in used:
                continue
            for ib in idxs[pos + 1:]:
                if ib in used or world.accts[ib].bank == world.accts[ia].bank:
                    continue
                a, b = world.accts[ia], world.accts[ib]
                b.pid, b.device = a.pid, a.device
                pa = world.persons[a.pid]
                b.opened = _draw_opened(rng, nprng, now_date, int((now_date - pa.dob).days / 365))
                if b.dormant_gap:
                    b.dormant_gap = 0
                    b.segment = a.segment
                used.update((ia, ib))
                pairs_made += 1
                break

    # --- identifiers: account number, IFSC, VPA (same procedure for every account) ---------------
    world.idstate = {"no": {c: set() for c in codes}, "vpa": {c: set() for c in codes}}
    for a in world.accts:
        if a.bank:
            assign_ids(world, banks, rng, a)
    # a wallet whose owner also holds a bank account lists it as its linked account
    by_pid: dict[int, list[Acct]] = {}
    for a in world.accts:
        by_pid.setdefault(a.pid, []).append(a)
    for accs in by_pid.values():
        if len(accs) == 2:
            w = [x for x in accs if x.wallet]
            b = [x for x in accs if not x.wallet]
            if w and b:
                w[0].linked = b[0].no

    for a in world.accts:
        world.by_seg.setdefault(a.segment, []).append(a.idx)
        if a.bank:
            world.by_ref[a.ref] = a.idx
    return world


def assign_ids(world: World, banks: dict[str, Bank], rng: random.Random, a: Acct, bank_code: str | None = None) -> None:
    """Account number, IFSC and VPA. Also used for mules, whose bank is only chosen once their ring exists."""
    if bank_code:
        a.bank = bank_code
        a.wallet = banks[bank_code].is_wallet
        if a.wallet:
            a.kyc, a.limit = "FULL", 200000.0
    bank = banks[a.bank]
    used_no, used_vpa = world.idstate["no"][a.bank], world.idstate["vpa"][a.bank]
    if a.wallet:
        while True:
            no = f"{WALLET_PREFIX[a.bank]}{rng.randrange(10**11, 10**12)}"
            if no not in used_no:
                break
    else:
        L = ACCT_LEN[a.bank]
        while True:
            no = str(rng.randrange(10 ** (L - 1), 10 ** L))
            if no not in used_no:
                break
    used_no.add(no)
    a.no = no
    a.ifsc = f"{bank.ifsc}0{rng.randrange(0, 10**6):06d}"
    a.vpa = _make_vpa(a, world.persons[a.pid], bank.handle, used_vpa, rng)
    world.by_ref[a.ref] = a.idx


def _make_vpa(a: Acct, person: Person, handle: str, used: set[str], rng: random.Random) -> str:
    if a.segment in ("merchant", "business", "biller", "busy_legit") and a.bname:
        stem = slug(a.bname)[:14]
        opts = [lambda: f"{stem}{rng.randrange(1, 99)}", lambda: f"{stem}.{rng.randrange(100, 999)}",
                lambda: f"paytm.{stem}{rng.randrange(10, 99)}"]
    else:
        first, last = slug(person.name.split()[0]), slug(person.name.split()[-1])
        opts = [lambda: f"{first}{rng.randrange(10, 99)}", lambda: f"{first}.{last}",
                lambda: f"{first}{last[:1]}{rng.randrange(100, 999)}", lambda: f"{last}{first[:1]}{rng.randrange(10, 99)}",
                lambda: person.phone]
    weights = [1] * len(opts)
    if len(opts) == 5:
        weights = [4, 3, 3, 2, 3]
    for attempt in range(200):
        v = rng.choices(opts, weights)[0]()
        if attempt > 50:
            v = f"{v}{rng.randrange(100, 9999)}"
        vpa = f"{v}@{handle}"
        if vpa not in used:
            used.add(vpa)
            return vpa
    raise RuntimeError("could not make a unique VPA")
