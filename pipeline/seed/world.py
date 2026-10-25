"""Neutral, bank-agnostic facts. Writers later encode these into each bank's own layout."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date

from .config import DAY, FUTURE_DAYS, HISTORY_DAYS, IST

DONE, FAILED = 0, 1
BG, SCAM = 0, 1


@dataclass(slots=True)
class Person:
    pid: int
    name: str
    female: bool
    dob: date
    city: str
    occ: str            # canonical occupation token
    income: float       # declared monthly income, INR (0 for none)
    phone: str
    device: str
    email: str = ""


@dataclass(slots=True)
class Acct:
    idx: int
    bank: str
    no: str             # account number, or wallet id for payments banks
    ifsc: str
    vpa: str
    pid: int
    opened: date
    segment: str        # label written to the truth file
    base: str           # background behaviour profile
    device: str
    wallet: bool = False
    kyc: str = "FULL"
    limit: float | None = None
    linked: str | None = None      # own linked bank account number (wallets)
    dormant_gap: int = 0           # days of silence before the window (0 = not dormant)
    reactivates: bool = False
    mule_type: str = ""
    ring: str = ""
    difficulty: str = ""
    bname: str = ""                # business / shop name used as holder name
    bkind: str = ""                # biller kind
    p2p_wallet: str | None = None  # TRON address if this is a P2P seller's bank account
    first_scam: int = 0            # epoch of first / last scam-related transfer
    last_scam: int = 0
    home_atm: str = ""

    @property
    def ref(self) -> str:
        return f"{self.bank}:{self.no}"


class Store:
    """Transfers as parallel lists (compact; ~500k rows). Amounts are integer paise, times epoch seconds."""

    __slots__ = ("f", "t", "amt", "ts", "rail", "st", "dev", "kind", "utr", "prov")

    def __init__(self):
        self.f: list[int] = []
        self.t: list[int] = []          # -1 for ATM
        self.amt: list[int] = []
        self.ts: list[int] = []
        self.rail: list[str] = []
        self.st: list[int] = []
        self.dev: list[str | None] = []
        self.kind: list[int] = []
        self.utr: list[str | None] = []
        self.prov: dict[int, list] = {}   # transfer index -> [(complaint_id|None, paise)]

    def __len__(self) -> int:
        return len(self.f)

    def add(self, f: int, t: int, amt: int, ts: int, rail: str, dev: str | None,
            kind: int = BG, st: int = DONE, prov: list | None = None) -> int:
        i = len(self.f)
        self.f.append(f)
        self.t.append(t)
        self.amt.append(int(amt))
        self.ts.append(int(ts))
        self.rail.append(rail)
        self.st.append(st)
        self.dev.append(dev)
        self.kind.append(kind)
        self.utr.append(None)
        if prov is not None:
            self.prov[i] = prov
        return i


@dataclass
class Clock:
    now: int                 # epoch seconds, the demo "present"
    t0: int                  # IST midnight of the first history day
    end: int                 # last second generated (now + FUTURE_DAYS)
    ndays: int

    @classmethod
    def at(cls, now: int) -> "Clock":
        first = now - HISTORY_DAYS * DAY
        off = IST.utcoffset(None).total_seconds()
        t0 = int((first + off) // DAY * DAY - off)
        end = now + FUTURE_DAYS * DAY
        return cls(now=now, t0=t0, end=end, ndays=int((end - t0) // DAY) + 1)

    def day_of(self, ts: int) -> int:
        return int((ts - self.t0) // DAY)


@dataclass
class World:
    clock: Clock
    persons: list[Person] = field(default_factory=list)
    accts: list[Acct] = field(default_factory=list)
    store: Store = field(default_factory=Store)
    by_seg: dict[str, list[int]] = field(default_factory=dict)
    by_ref: dict[str, int] = field(default_factory=dict)
    showcase: dict[str, int] = field(default_factory=dict)
    idstate: dict = field(default_factory=dict)      # used account numbers / VPAs per bank

    def person(self, a: Acct) -> Person:
        return self.persons[a.pid]

    def city_of(self, a: Acct) -> str:
        return self.persons[a.pid].city
