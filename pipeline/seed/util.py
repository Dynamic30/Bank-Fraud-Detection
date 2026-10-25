"""Small shared helpers."""
from __future__ import annotations

import random


def pick_rail(rng: random.Random, rupees: float, w_upi: float = 0.80, w_imps: float = 0.15, w_neft: float = 0.05) -> str:
    """Rail by amount: UPI <= 1 lakh, IMPS <= 5 lakh, RTGS >= 2 lakh."""
    if rupees <= 100_000:
        return rng.choices(["UPI", "IMPS", "NEFT"], [w_upi, w_imps, w_neft])[0]
    if rupees <= 200_000:
        return rng.choices(["IMPS", "NEFT"], [0.6, 0.4])[0]
    if rupees <= 500_000:
        return rng.choices(["IMPS", "NEFT", "RTGS"], [0.35, 0.35, 0.30])[0]
    return rng.choices(["NEFT", "RTGS"], [0.4, 0.6])[0]


def atm_id(rng: random.Random, ifsc_prefixes: list[str]) -> str:
    return f"ATM-{rng.choice(ifsc_prefixes)}{rng.randrange(10000, 99999)}"


def paise(rupees: float) -> int:
    return int(round(rupees * 100))
