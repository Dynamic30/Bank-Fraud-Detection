"""Bank registry: layout family and market share from config, IFSC prefix and UPI handle from banks_seed.sql."""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from .config import BANK_FAMILY_SHARE

BANKS_SEED = Path(__file__).resolve().parents[2] / "backend" / "banks_seed.sql"


@dataclass(frozen=True)
class Bank:
    code: str
    name: str
    ifsc: str          # 4-letter IFSC prefix
    handle: str        # UPI handle (VPA suffix)
    family: str
    share: float

    @property
    def is_wallet(self) -> bool:
        return self.family == "payments_bank"


_TUPLE = re.compile(r"\(\s*((?:'(?:[^']|'')*'\s*,?\s*)+)\)")
_STR = re.compile(r"'((?:[^']|'')*)'")


def load_banks(path: Path = BANKS_SEED) -> dict[str, Bank]:
    text = path.read_text()
    m = re.search(r"INSERT\s+INTO\s+banks\s*\(([^)]*)\)\s*VALUES", text, re.I)
    if not m:
        raise SystemExit(f"{path}: no INSERT INTO banks (...) VALUES found")
    cols = [c.strip() for c in m.group(1).split(",")]
    banks: dict[str, Bank] = {}
    for tm in _TUPLE.finditer(text[m.end():]):
        vals = [v.replace("''", "'") for v in _STR.findall(tm.group(1))]
        row = dict(zip(cols, vals))
        code = row["id"]
        if code not in BANK_FAMILY_SHARE:
            raise SystemExit(f"{path}: unknown bank code {code}")
        family, share = BANK_FAMILY_SHARE[code]
        banks[code] = Bank(code, row["name"], row["ifsc_prefix"], row["upi_handle"], family, share)
    missing = set(BANK_FAMILY_SHARE) - set(banks)
    if missing:
        raise SystemExit(f"{path}: missing banks {sorted(missing)}")
    if len({b.ifsc for b in banks.values()}) != len(banks) or len({b.handle for b in banks.values()}) != len(banks):
        raise SystemExit(f"{path}: ifsc_prefix and upi_handle must be unique per bank")
    return banks
