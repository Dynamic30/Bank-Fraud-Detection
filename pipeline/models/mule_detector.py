"""Mule detector: scores accounts in the app DB from behaviour only, using the rules in mule_radar.json.

Reads `accounts`, `transfers`, `account_cases` and human-made `mule_accounts` rows. Never reads accounts.label,
accounts.source, model-made mule_accounts rows or the mule_truth file (see global.forbidden_inputs in the JSON).
Writes `account_scores` and, at or above the call score, `mule_accounts` (source 'model', status 'suspected').

    python -m pipeline.models.mule_detector                  # score every bank account
    python -m pipeline.models.mule_detector --account SBI:123 --dry-run
"""
import argparse
import json
import statistics
from collections import Counter, defaultdict, deque
from datetime import UTC, datetime, timedelta
from operator import attrgetter
from pathlib import Path
from typing import NamedTuple

RULES_PATH = Path(__file__).with_name("mule_radar.json")
ACTOR = "system:mule_detector"
IST = timedelta(hours=5, minutes=30)
MIN, H, D = timedelta(minutes=1), timedelta(hours=1), timedelta(days=1)
SYNC_SLACK = D
CONFIDENCE = {"high": 0.9, "medium": 0.6, "low": 0.3}
LOW_INCOME_OCC = {"student", "unemployed", "homemaker", "daily_wage", "labourer", "retired"}
CHUNK = 1000


class Tr(NamedTuple):
    id: int
    ts: datetime
    amt: float
    frm: str
    to: str | None
    rail: str | None
    device: str | None
    asset: str
    status: str


class Case(NamedTuple):
    complaint_id: str
    first_hop: int
    received: float
    reported_at: datetime | None


class World:
    """Lookups shared by every account in a run."""

    def __init__(self, devices=None, confirmed=(), cleared=None, cases=None, peers=None):
        self.devices = devices or {}      # device_id -> {account_id}
        self.confirmed = set(confirmed)   # human-confirmed mules (complaint / bank_report)
        self.cleared = cleared or {}      # account_id -> when an analyst cleared it
        self.cases = cases or {}          # account_id -> [Case]
        self.peers = peers or {}          # account_id -> {wallet_kind, p2p_wallet}


def load_rules(path=RULES_PATH):
    cfg = json.loads(Path(path).read_text())
    cfg["by_id"] = {r["id"]: r for r in cfg["rules"]}
    return cfg


def fifo(credits, debits):
    """Debits allocated to earlier credits oldest-first -> [(credit, debit, amount, lag_minutes)]."""
    queue, out = deque([c, c.amt] for c in credits), []
    for d in debits:
        left = d.amt
        while left > 1e-9 and queue and queue[0][0].ts <= d.ts:
            c, rem = queue[0]
            take = min(rem, left)
            out.append((c, d, take, (d.ts - c.ts) / MIN))
            left -= take
            if rem - take <= 1e-9:
                queue.popleft()
            else:
                queue[0][1] = rem - take
    return out


def money(x):
    return f"{x:,.0f}"


def ids(ts, n=10):
    return sorted({t.id for t in ts})[:n]


class Acct:
    """One account's features at time T. Each rN method returns (severity, reason fields, evidence) or None."""

    def __init__(self, row, trs, world, T, min_amt):
        self.a, self.w, self.T, self.min = row, world, T, min_amt
        self.id = row["account_id"]
        self.stub = row["fetched_at"] is None
        done = [t for t in trs if t.status == "done" and t.ts <= T and t.asset == "INR"]
        self.cr = sorted((t for t in done if t.to == self.id), key=attrgetter("ts"))
        self.db = sorted((t for t in done if t.frm == self.id), key=attrgetter("ts"))
        self.fail = [t for t in trs if t.status == "failed" and t.frm == self.id and T - D < t.ts <= T]
        self.chain = [t for t in trs if t.status == "done" and t.asset != "INR" and t.frm == self.id and t.ts <= T]
        self.merchant = False
        self._eod = None
        first = min((t.ts for t in self.cr + self.db), default=T)
        self.history_days = (T - first) / D
        self.age = (T.date() - row["opened_on"]).days if row.get("opened_on") else None
        self.cases = [c for c in world.cases.get(self.id, []) if c.received >= 500]
        self.n_cases = len({c.complaint_id for c in self.cases})

    def since(self, trs, delta):
        return [t for t in trs if t.ts > self.T - delta]

    def big(self, trs):
        return [t for t in trs if t.amt >= self.min]

    def peer(self, tid):
        return self.w.peers.get(tid) or {}

    def devices(self):
        return {d for d in [self.a.get("device_id")] + [t.device for t in self.db if t.rail != "ATM"] if d}

    def senders_before(self, start, days=180):
        """Counterparties this account dealt with in the lookback before `start`."""
        lo = start - days * D
        return ({t.frm for t in self.cr if lo <= t.ts < start} | {t.to for t in self.db if t.to and lo <= t.ts < start})

    def eod(self):
        """[(end-of-day balance, day credits)] for each active day in the last 30 days."""
        if self._eod is None:
            bal, days, start = float(self.a.get("opening_balance") or 0), {}, self.T - 30 * D
            for t in sorted(self.cr + self.db, key=attrgetter("ts")):
                credit = t.to == self.id
                bal += t.amt if credit else -t.amt
                if t.ts > start:
                    day = days.setdefault(t.ts.date(), [0.0, 0.0])
                    day[0] = bal
                    day[1] += t.amt if credit else 0
            self._eod = [tuple(v) for v in days.values()]
        return self._eod

    def r01(self):
        cr = self.big(self.since(self.cr, 7 * D))
        tot = sum(t.amt for t in cr)
        if len(cr) < 2 or tot < 10000:
            return
        al = fifo(cr, self.big([t for t in self.db if t.ts >= cr[0].ts]))
        ratio = lambda m: sum(x[2] for x in al if x[3] <= m) / tot
        for sev, m, label, need in (("high", 15, "15 min", .5), ("medium", 60, "60 min", .5), ("low", 1440, "24 h", .8)):
            if ratio(m) >= need:
                dwell = statistics.median(x[3] for x in al)
                return sev, dict(pct=round(ratio(m) * 100), in_amt=money(tot), window=label, dwell=round(dwell)), \
                    dict(transfer_ids=ids([x[0] for x in al] + [x[1] for x in al]))

    def r02(self):
        if self.merchant:
            return
        cr = self.big(self.since(self.cr, 7 * D))
        senders = {t.frm for t in cr}
        if len(senders) < 8:
            return
        share = len(senders - self.senders_before(self.T - 7 * D)) / len(senders)
        if share >= .7:
            return ("high" if len(senders) >= 15 else "medium"), dict(n=len(senders)), dict(transfer_ids=ids(cr))

    def r03(self):
        recent = [t for t in self.big(self.since(self.db, D)) if t.to]
        new = {t.to for t in recent} - {t.to for t in self.db if t.to and t.ts <= self.T - D}
        if len(new) >= 5:
            return ("high" if len(new) >= 10 else "medium"), dict(n=len(new)), dict(transfer_ids=ids(recent))

    def r04(self):
        days = self.eod()
        if len(days) < 5:
            return
        k = sum(1 for bal, credits in days if bal <= max(1000, .05 * credits))
        if k / len(days) >= .7:
            return "medium", dict(k=k, n=len(days)), {}

    def r05(self):
        if self.history_days < 90:
            return
        edge = self.T - D
        c24 = sum(t.amt for t in self.cr if t.ts > edge)
        daily = [0.0] * 90
        for t in self.cr:
            k = int((edge - t.ts) / D)
            if t.ts <= edge and k < 90:
                daily[k] += t.amt
        ratio = c24 / max(statistics.median(daily), 1000)
        if c24 >= 50000 and ratio >= 10:
            return ("high" if ratio >= 30 else "medium"), dict(x=money(c24), r=round(ratio)), \
                dict(transfer_ids=ids([t for t in self.cr if t.ts > edge]))

    def r06(self):
        income = float(self.a.get("declared_income") or 0)
        c30 = sum(t.amt for t in self.since(self.cr, 30 * D))
        if income <= 0 or c30 < 50000:
            return
        ratio = c30 / (income / 12)
        if ratio >= 3:
            return ("high" if ratio >= 10 else "medium"), dict(x=money(c30), inc=money(income), r=round(ratio)), {}

    def r07(self):
        c30 = sum(t.amt for t in self.since(self.cr, 30 * D))
        if self.a.get("occupation") in LOW_INCOME_OCC and c30 >= 100000:
            return "medium", dict(occupation=self.a["occupation"].replace("_", " ").capitalize(), x=money(c30)), {}

    def r08(self):
        if self.age is None or self.age < 0:
            return
        total = sum(t.amt for t in self.cr)
        fan = len({t.frm for t in self.big(self.since(self.cr, 7 * D))})
        if self.age <= 30 and (total >= 50000 or fan >= 8):
            return "high", dict(d=self.age, x=money(total)), {}
        if self.age <= 90 and total >= 50000:
            return "medium", dict(d=self.age, x=money(total)), {}

    def r09(self):
        recent = [t for t in self.cr + self.db if t.ts > self.T - 180 * D]
        if not recent:
            return
        debits = [t.ts for t in self.db]
        for t in sorted(recent, key=attrgetter("ts")):
            before = [ts for ts in debits if ts < t.ts]
            if not before:
                continue
            gap = (t.ts - max(before)) / D
            after = sum(x.amt for x in self.cr if t.ts <= x.ts <= t.ts + 7 * D)
            if gap >= 365 and after >= 25000:
                return ("high" if gap >= 730 else "medium"), dict(d=round(gap), x=money(after)), {}
            if gap < 365:
                return

    def r10(self):
        shared = [(len(self.w.devices.get(d, ())), d) for d in self.devices()]
        n, dev = max(shared, default=(0, None))
        if n >= 3:
            return ("high" if n >= 10 else "medium"), dict(dev=dev, n=n), dict(device_id=dev)

    def r11(self):
        for d in sorted(self.devices()):
            hit = (self.w.devices.get(d, set()) - {self.id}) & self.w.confirmed
            if hit:
                return "high", dict(id=sorted(hit)[0]), dict(device_id=d)

    def r12(self):
        recent = [t for t in self.since(self.db, D) if t.rail != "ATM"]
        known = {self.a.get("device_id")} | {t.device for t in self.db if t.ts <= self.T - D}
        new = {t.device for t in recent if t.device and t.device not in known}
        if len(new) >= 2 and sum(t.amt for t in recent) >= 10000:
            return "medium", dict(n=len(new)), dict(transfer_ids=ids(recent))

    def r13(self):
        hits = [t for t in self.since(self.cr + self.db, 30 * D) if (t.frm if t.to == self.id else t.to) in self.w.confirmed]
        peers = {t.frm if t.to == self.id else t.to for t in hits}
        amount = sum(t.amt for t in hits)
        if len(hits) >= 2 and amount >= 5000:
            return "medium", dict(x=money(amount), n=len(peers)), dict(transfer_ids=ids(hits))

    def r14(self):
        if not self.n_cases:
            return
        sev = "high" if self.n_cases >= 3 else "medium" if self.n_cases == 2 else "low"
        cids = sorted({c.complaint_id for c in self.cases})
        return sev, dict(n=self.n_cases, complaint_ids=", ".join(cids)), dict(complaint_ids=cids)

    def r15(self):
        if self.cases and min(c.first_hop for c in self.cases) == 1:
            return "medium", {}, dict(complaint_ids=sorted({c.complaint_id for c in self.cases if c.first_hop == 1}))

    def r16(self):
        out = self.since(self.db, 30 * D)
        total = sum(t.amt for t in out)
        if not total:
            return
        exits = [t for t in out if t.to and (self.peer(t.to).get("wallet_kind") in ("p2p_seller", "exchange_deposit")
                                             or self.peer(t.to).get("p2p_wallet"))]
        share = sum(t.amt for t in exits) / total
        if share >= .3:
            return ("high" if share >= .5 else "medium"), dict(pct=round(share * 100)), dict(transfer_ids=ids(exits))

    def r17(self):
        for t in self.since(self.chain, 30 * D):
            kind = self.peer(t.to).get("wallet_kind")
            if kind in ("mixer", "bridge"):
                return "high", dict(kind=kind, addr=t.to), dict(transfer_ids=[t.id])

    def r18(self):
        atm = [t for t in self.db if t.to is None]
        for c in self.since(self.cr, 30 * D):
            if c.amt < 5000:
                continue
            soon = [t for t in atm if c.ts < t.ts <= c.ts + H]
            if soon and sum(t.amt for t in soon) >= .5 * c.amt:
                return "medium", dict(x=money(sum(t.amt for t in soon)), mins=round((soon[0].ts - c.ts) / MIN)), \
                    dict(transfer_ids=ids([c] + soon))

    def r19(self):
        out = self.since(self.db, D)
        rails = sorted({t.rail for t in out if t.rail})
        if len(rails) >= 3 and self.since(self.cr, D):
            return "low", dict(rails=", ".join(rails)), dict(transfer_ids=ids(out))

    def r20(self):
        credits = self.since(self.cr, 30 * D)
        for d in self.big(self.since(self.db, 30 * D)):
            small = [c for c in credits if d.ts - D < c.ts < d.ts and c.amt < 10000]
            if len(small) >= 5 and d.amt >= .8 * sum(c.amt for c in small):
                return "medium", dict(n=len(small), x=money(d.amt)), dict(transfer_ids=ids(small + [d]))

    def r21(self):
        cr = self.since(self.cr, 90 * D)
        rounds = [t for t in cr if t.amt >= 1000 and t.amt % 1000 == 0]
        if len(cr) >= 5 and len(rounds) / len(cr) >= .7:
            return "low", dict(pct=round(len(rounds) / len(cr) * 100)), dict(transfer_ids=ids(rounds))

    def r22(self):
        all_ = self.since(self.cr + self.db, 90 * D)
        low = [t for t in all_ if 900 <= t.amt <= 999]
        if len(all_) >= 5 and len(low) / len(all_) >= .5:
            return "low", {}, dict(transfer_ids=ids(low))

    def r23(self):
        all_ = self.since(self.cr + self.db, 30 * D)
        night = [t for t in all_ if (t.ts + IST).hour < 5]
        if len(all_) >= 10 and len(night) / len(all_) >= .5:
            return "low", dict(pct=round(len(night) / len(all_) * 100)), {}

    def r24(self):
        if len(self.fail) >= 5:
            return "low", dict(n=len(self.fail)), dict(transfer_ids=ids(self.fail))

    def n1(self):
        cr30, db30 = self.since(self.cr, 30 * D), self.since(self.db, 30 * D)
        if self.age is None or self.age < 180 or not cr30 or not db30:
            return
        if len({t.ts.date() for t in cr30}) < 20 or statistics.median(t.amt for t in cr30) > 2000:
            return
        cr90 = self.since(self.cr, 90 * D)
        payers = Counter(t.frm for t in cr90)
        if sum(n for n in payers.values() if n >= 2) / len(cr90) < .3:
            return
        dest = Counter()
        for t in db30:
            dest[t.to or "CASH"] += t.amt
        if max(dest.values()) / sum(dest.values()) < .6:
            return
        lags = [x[3] for x in fifo(cr30, db30)]
        if lags and statistics.median(lags) / 60 >= 12:
            return {}, {}

    def n2(self):
        by = defaultdict(list)
        for t in self.since(self.cr, 120 * D):
            by[t.frm].append(t)
        for payer, trs in by.items():
            if len({(t.ts.year, t.ts.month) for t in trs}) < 3:
                continue
            day = statistics.median(t.ts.day for t in trs)
            amts = [t.amt for t in trs]
            if all(abs(t.ts.day - day) <= 3 for t in trs) and statistics.pstdev(amts) / statistics.mean(amts) < .10:
                return dict(payer=payer), dict(transfer_ids=ids(trs))

    def n3(self):
        if self.age is None or self.age < 730:
            return
        prior = sum(t.amt for t in self.cr if self.T - 30 * D - 365 * D < t.ts <= self.T - 30 * D) / 12
        if prior > 0 and sum(t.amt for t in self.since(self.cr, 30 * D)) <= 3 * prior:
            return {}, {}

    def n4(self):
        c30 = sum(t.amt for t in self.since(self.cr, 30 * D))
        days = self.eod()
        if c30 > 0 and days:
            med = statistics.median(b for b, _ in days)
            if med >= .30 * c30:
                return dict(b=money(med)), {}

    def n5(self):
        at = self.w.cleared.get(self.id)
        if at and self.T - at <= 90 * D and not any(c.reported_at and c.reported_at > at for c in self.w.cases.get(self.id, [])):
            return dict(date=at.date().isoformat()), {}


# negative rules return (fields, evidence) only; the engine adds the rule's single tier
NEG_RULES = {"N1": "n1", "N2": "n2", "N3": "n3", "N4": "n4", "N5": "n5"}
FIRST = ["R14", "R15"]            # CASE, needed before N1
LAST = ["R07", "R16"]             # need FLOW / CASE points


def tier_points(rule, severity):
    for t in rule["tiers"]:
        if t.get("severity") == severity or severity is None:
            return t["points"]
    return 0


def family_points(hits, cfg):
    """Capped points per family (negative family capped at its floor)."""
    raw = defaultdict(float)
    for h in hits:
        raw[h["family"]] += h["points"]
    out = {}
    for fam, v in raw.items():
        cap = cfg["families"][fam]["cap"]
        out[fam] = max(v, cap) if cap < 0 else min(v, cap)
    return out


def eligible(acct, T, cfg):
    if len(acct.cr) + len(acct.db) < cfg["global"]["eligibility"]["min_qualifying_transfers"]:
        return False
    if acct.stub:
        return True
    synced = acct.a.get("txns_synced_until")
    return synced is not None and synced >= T - SYNC_SLACK


def score_account(row, trs, world, T, cfg, min_amt=None):
    """-> result dict for one account. `row` is an accounts row (dict), `trs` its transfers (list of Tr)."""
    min_amt = min_amt if min_amt is not None else cfg["global"]["min_trace_amount_inr"]["value"]
    acct = Acct(row, trs, world, T, min_amt)
    res = dict(account_id=acct.id, bank_id=row.get("bank_id"), stub=acct.stub)
    if not eligible(acct, T, cfg):
        return dict(res, status="insufficient_data")

    stub_cfg = cfg["combination"]["stub_accounts"]
    allowed = lambda rule: (not acct.stub) or rule["family"] in stub_cfg["run_families"] or rule["id"] in stub_cfg["also_run"]
    hits = []

    def run(rid):
        rule = cfg["by_id"][rid]
        if not allowed(rule):
            return
        pre = rule.get("preconditions", {})
        if pre.get("profile_fetched") and acct.stub:
            return
        caps = family_points(hits, cfg)
        if any(caps.get(f, 0) < v for f, v in pre.get("requires_family_points", {}).items()):
            return
        need = pre.get("requires_any_family_points")
        if need and not any(caps.get(f, 0) > 0 for f in need):
            return
        if rid in NEG_RULES:
            out = getattr(acct, NEG_RULES[rid])()
            if out is None:
                return
            sev, fields, evidence = None, out[0], out[1]
        else:
            out = getattr(acct, rid.lower())()
            if out is None:
                return
            sev, fields, evidence = out
        points = min(tier_points(rule, sev), cfg["combination"]["single_rule_max_points"]["value"])
        hits.append(dict(rule_id=rid, family=rule["family"], severity=sev or "negative", points=points,
                         reason_text=rule["reason"].format(**fields), evidence=evidence))

    for rid in FIRST:
        run(rid)
    if "N1" in cfg["by_id"] and family_points(hits, cfg).get("CASE", 0) < 22:
        run("N1")
        acct.merchant = any(h["rule_id"] == "N1" for h in hits)
    for rule in cfg["rules"]:
        if rule["id"] not in FIRST + LAST + ["N1"]:
            run(rule["id"])
    for rid in LAST:
        run(rid)

    fam = family_points(hits, cfg)
    positive = [f for f, v in fam.items() if f != "NEG" and v > 0]
    score = max(0.0, min(100.0, sum(v for f, v in fam.items())))
    notes = []

    for gate in cfg["combination"]["gates"]:
        if score >= gate["min_score"]:
            ok = len(positive) >= 2 if gate["tier"] == "call" else \
                len(positive) >= 3 or (fam.get("CASE", 0) >= 22 and fam.get("FLOW", 0) >= 10)
            if not ok:
                score = min(score, gate["else_cap"])
                notes.append(f"Score held at {gate['else_cap']}: {gate['requires']} not met")

    if acct.stub:
        if acct.n_cases < 2:
            score = min(score, stub_cfg["score_cap"])
        notes.append(stub_cfg["reason"])

    floor = cfg["combination"]["floors"][0]
    strong = {c.complaint_id for c in acct.cases if c.received >= 1000}
    if len(strong) >= 3 and not acct.merchant and score < floor["min_score"]:
        score = float(floor["min_score"])
        notes.append(f"Raised to {floor['min_score']}: in {len(strong)} separate victims' trails ({floor['id']})")

    if acct.stub or acct.history_days < 7:
        confidence = "low"
    elif len(positive) >= 3 and acct.history_days >= 30:
        confidence = "high"
    elif len(positive) >= 2:
        confidence = "medium"
    else:
        confidence = "low"

    reasons = sorted(hits, key=lambda h: -h["points"])
    reasons += [dict(rule_id="NOTE", family="META", severity="info", points=0, reason_text=n, evidence={}) for n in notes]
    tier = next((t["tier"] for t in cfg["tiers_to_actions"] if "range" in t and t["range"][0] <= score <= t["range"][1]), "normal")
    dob = row.get("dob")
    return dict(res, status="scored", score=round(score, 2), tier=tier, confidence=confidence, reasons=reasons,
                upi_id=row.get("upi_id"), is_student=row.get("occupation") == "student",
                age=(T.date() - dob).days // 365 if dob else None)


# ---------------------------------------------------------------- database

ACCOUNT_COLS = ("account_id, kind, bank_id, wallet_kind, dob, occupation, declared_income, opening_balance, opened_on, "
                "device_id, upi_id, p2p_wallet, fetched_at, txns_synced_until")


def setting(conn, key, default=None):
    row = conn.execute("SELECT value FROM settings WHERE key = %s", (key,)).fetchone()
    return default if not row or row[0] is None else row[0]


def as_of_default(conn):
    value = setting(conn, "demo_clock")
    if value:
        d = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        return d.astimezone(UTC).replace(tzinfo=None) if d.tzinfo else d
    return datetime.now(UTC).replace(tzinfo=None)


def dict_rows(cur):
    cols = [c.name for c in cur.description]
    return [dict(zip(cols, r)) for r in cur.fetchall()]


def load_global(conn):
    """Lookups that span all accounts: shared devices, confirmed and cleared mules."""
    devices = defaultdict(set)
    for dev, acc in conn.execute("SELECT device_id, account_id FROM accounts WHERE device_id IS NOT NULL UNION "
                                 "SELECT device_id, from_id FROM transfers WHERE device_id IS NOT NULL AND rail <> 'ATM'"):
        devices[dev].add(acc)
    confirmed = {r[0] for r in conn.execute("SELECT account_id FROM mule_accounts WHERE status = 'confirmed' "
                                            "AND source IN ('complaint','bank_report')")}
    # a clearing is an analyst's decision, so it is read whatever the row's source
    cleared = {r[0]: r[1] for r in conn.execute("SELECT account_id, COALESCE(last_seen_at, first_flagged_at) "
                                                "FROM mule_accounts WHERE status = 'cleared'")}
    return devices, confirmed, cleared


def load_chunk(conn, rows, T):
    keys = [r["account_id"] for r in rows]
    trs = defaultdict(list)
    peers = set()
    for r in conn.execute("SELECT transfer_id, ts, amount, from_id, to_id, rail, device_id, asset, status FROM transfers "
                          "WHERE (from_id = ANY(%s) OR to_id = ANY(%s)) AND ts <= %s", (keys, keys, T)):
        t = Tr(r[0], r[1], float(r[2]), r[3], r[4], r[5], r[6], r[7], r[8])
        for k in {t.frm, t.to} & set(keys):
            trs[k].append(t)
        peers.update(x for x in (t.frm, t.to) if x)
    cases = defaultdict(list)
    for r in conn.execute("SELECT ac.account_id, ac.complaint_id, ac.first_hop, ac.received, c.reported_at "
                          "FROM account_cases ac JOIN complaints c ON c.id = ac.complaint_id "
                          "WHERE ac.account_id = ANY(%s)", (keys,)):
        cases[r[0]].append(Case(r[1], r[2], float(r[3]), r[4]))
    peer_rows = {r[0]: dict(wallet_kind=r[1], p2p_wallet=r[2]) for r in conn.execute(
        "SELECT account_id, wallet_kind, p2p_wallet FROM accounts WHERE account_id = ANY(%s)", (sorted(peers),))}
    return trs, cases, peer_rows


def select_accounts(conn, cfg, account_ids=None):
    skip = cfg["global"]["excluded_wallet_kinds"]["value"]
    where, args = "kind = 'bank'", ()
    if account_ids:
        where, args = "account_id = ANY(%s)", (list(account_ids),)
    cur = conn.execute(f"SELECT {ACCOUNT_COLS} FROM accounts WHERE {where} ORDER BY account_id", args)
    return [r for r in dict_rows(cur) if r["wallet_kind"] not in skip and r["kind"] == "bank"]


def score_accounts(conn, account_ids=None, as_of=None, cfg=None):
    """Score bank accounts (all, or just `account_ids`) as of `as_of` (demo clock, else now)."""
    cfg = cfg or load_rules()
    T = as_of or as_of_default(conn)
    min_amt = float(setting(conn, "min_trace_amount", cfg["global"]["min_trace_amount_inr"]["value"]))
    devices, confirmed, cleared = load_global(conn)
    rows, results = select_accounts(conn, cfg, account_ids), []
    for i in range(0, len(rows), CHUNK):
        chunk = rows[i:i + CHUNK]
        trs, cases, peers = load_chunk(conn, chunk, T)
        world = World(devices, confirmed, cleared, cases, peers)
        results += [score_account(r, trs.get(r["account_id"], []), world, T, cfg, min_amt) for r in chunk]
    return results


def write_results(conn, results, cfg=None, call_from=None):
    """Upsert account_scores and the model's own mule_accounts rows. Returns a summary dict."""
    cfg = cfg or load_rules()
    call_from = call_from if call_from is not None else float(setting(conn, "call_from_score", 40))
    scored = [r for r in results if r["status"] == "scored"]
    cur = conn.cursor()
    cur.executemany(
        "INSERT INTO account_scores (account_id, score, reasons, model_version, computed_at) "
        "VALUES (%s, %s, %s::jsonb, %s, now()) ON CONFLICT (account_id) DO UPDATE SET score = excluded.score, "
        "reasons = excluded.reasons, model_version = excluded.model_version, computed_at = excluded.computed_at",
        [(r["account_id"], r["score"], json.dumps(r["reasons"]), cfg["model_version"]) for r in scored])
    flagged = [r for r in scored if r["score"] >= call_from]
    cur.executemany(
        "INSERT INTO mule_accounts (account_id, bank_id, upi_id, is_student, age_at_flag, source, status, confidence, last_seen_at) "
        "VALUES (%s, %s, %s, %s, %s, 'model', 'suspected', %s, now()) ON CONFLICT (account_id) DO UPDATE SET "
        "confidence = excluded.confidence, last_seen_at = excluded.last_seen_at "
        "WHERE mule_accounts.source = 'model' AND mule_accounts.status = 'suspected'",
        [(r["account_id"], r["bank_id"], r["upi_id"], r["is_student"], r["age"], CONFIDENCE[r["confidence"]]) for r in flagged])
    # an unreviewed model flag that no longer scores high is withdrawn; reviewed rows are never touched
    conn.execute("DELETE FROM mule_accounts WHERE source = 'model' AND status = 'suspected' AND account_id = ANY(%s)",
                 ([r["account_id"] for r in scored if r["score"] < call_from],))
    tiers = Counter(r["tier"] for r in scored)
    return dict(scored=len(scored), insufficient=len(results) - len(scored), flagged=len(flagged),
                watch_call=tiers["watch_call"], hold_candidate=tiers["hold_candidate"])


def run(conn, account_ids=None, as_of=None, dry_run=False):
    from pipeline.audit import write_audit
    cfg = load_rules()
    results = score_accounts(conn, account_ids, as_of, cfg)
    if dry_run:
        return results, None
    summary = write_results(conn, results, cfg)
    write_audit(conn, ACTOR, "mule_scan", "Scored {scored} accounts with {m}: {flagged} suspected, {hold_candidate} hold candidates, "
                "{insufficient} without enough data".format(m=cfg["model_version"], **summary))
    return results, summary


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--account", action="append", help="score only this account id (repeatable)")
    ap.add_argument("--as-of", help="ISO time, UTC (default: demo clock, else now)")
    ap.add_argument("--dry-run", action="store_true", help="print scores, write nothing")
    ap.add_argument("--top", type=int, default=15, help="how many top scores to print")
    args = ap.parse_args(argv)
    from pipeline.bank_connections.bank_database import app_connect
    as_of = datetime.fromisoformat(args.as_of.replace("Z", "+00:00")).astimezone(UTC).replace(tzinfo=None) if args.as_of else None
    with app_connect() as conn:
        results, summary = run(conn, args.account, as_of, args.dry_run)
    print(summary or f"dry run: {len(results)} accounts")
    for r in sorted((r for r in results if r["status"] == "scored"), key=lambda r: -r["score"])[:args.top]:
        print(f"{r['score']:6.2f}  {r['tier']:<14} {r['confidence']:<6} {r['account_id']}  "
              + ", ".join(f"{h['rule_id']}({h['points']:g})" for h in r["reasons"] if h["rule_id"] != "NOTE"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
