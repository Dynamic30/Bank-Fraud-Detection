"""Shared context and helpers for the per-family writers.

Encoding conventions (also documented in pipeline/seed/README.md):
  * every payment is written by each bank that is a party to it, under the same UTR, at the same second;
  * ATM withdrawals and failed payments are single-sided (the remitter's bank only);
  * the initiating device (or ATM id) is recorded on every copy of a payment, so deduplicating on UTR loses nothing;
  * naive timestamps (flat_rupees, split_datetime) are IST; epoch columns are UTC; tz-aware columns carry their offset.
"""
from __future__ import annotations

import random
from datetime import date, datetime

from ..banks import Bank
from ..config import IST, UTC
from ..world import DONE, World


def q(name: str) -> str:
    return '"' + name + '"'


def money(paise: int) -> str:
    return f"{paise // 100}.{paise % 100:02d}"


def ist_naive(ts: int) -> datetime:
    return datetime.fromtimestamp(ts, IST).replace(tzinfo=None)


def utc_aware(ts: int) -> datetime:
    return datetime.fromtimestamp(ts, UTC)


def income_band(monthly: float) -> str:
    return "LT_25K" if monthly < 25_000 else "25K_50K" if monthly < 50_000 else "50K_1L" if monthly < 100_000 else "GT_1L"


def dob_ddmmyyyy(d: date) -> str:
    return d.strftime("%d-%m-%Y")


def occupation(canon: str, style: str) -> str:
    if style == "upper":
        return canon.upper()
    if style == "title":
        return canon.replace("_", " ").title()
    return canon


RAIL_LETTER = {"UPI": "U", "IMPS": "I", "NEFT": "N", "RTGS": "R", "ATM": "A"}


class Ctx:
    def __init__(self, world: World, banks: dict[str, Bank], rng: random.Random):
        self.w, self.banks, self.rng = world, banks, rng
        self.accts, self.store = world.accts, world.store
        self.by_bank: dict[str, list[int]] = {c: [] for c in banks}
        self.accts_by_bank: dict[str, list] = {c: [] for c in banks}
        for a in self.accts:
            self.accts_by_bank[a.bank].append(a)
        self._build_index()
        st = self.store
        active = set()
        for i, ts in enumerate(st.ts):
            if ts >= world.clock.t0:
                active.add(st.f[i])
                if st.t[i] >= 0:
                    active.add(st.t[i])
        self.active = active
        self.style = {c: k % 4 for k, c in enumerate(banks)}

    def _build_index(self) -> None:
        st, accts = self.store, self.accts
        order = sorted(range(len(st)), key=st.ts.__getitem__)
        for i in order:
            bf = accts[st.f[i]].bank
            self.by_bank[bf].append(i)
            if st.t[i] >= 0 and st.st[i] == DONE:
                bt = accts[st.t[i]].bank
                if bt != bf:
                    self.by_bank[bt].append(i)

    def dormant(self, a) -> bool:
        return a.dormant_gap > 0 and a.idx not in self.active

    def customer_id(self, a) -> str:
        return f"{(a.pid * 7919 + sum(map(ord, a.bank)) * 104729) % 10**10:010d}"

    def txn_id(self, bank: Bank, seq: int, ts: int) -> str:
        s = self.style[bank.code]
        d = datetime.fromtimestamp(ts, IST)
        if s == 0:
            return f"{bank.ifsc}{d:%y%m%d}{seq:07d}"
        if s == 1:
            return f"T{d:%y%m%d%H%M}{seq:07d}"
        if s == 2:
            return f"{bank.ifsc}-{seq:09d}"
        return f"{d:%y%m%d}{seq:010d}"

    def holder(self, a) -> str:
        return a.bname or self.w.person(a).name


class FamilyWriter:
    family = ""

    def __init__(self, ctx: Ctx):
        self.ctx = ctx

    def tables(self, bank: Bank):
        """Yield (table, columns, rows) in load order."""
        raise NotImplementedError

    def readback(self, bank: Bank) -> str:
        """SQL -> (utr text, amount_paise bigint, epoch_sec bigint, ok boolean) for rows that carry a UTR."""
        raise NotImplementedError

    def account_tables(self, bank: Bank) -> list[tuple[str, str, str, tuple[str, str]]]:
        """[(accounts table, account-number column, transactions table, (party column, party column))] for the orphan check."""
        raise NotImplementedError
