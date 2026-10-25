"""Constants and tunable parameters for the dummy_sources seeder."""
from __future__ import annotations

from datetime import timedelta, timezone

IST = timezone(timedelta(hours=5, minutes=30))
UTC = timezone.utc
DAY = 86400

HISTORY_DAYS = 120
FUTURE_DAYS = 10

RAILS = ("UPI", "IMPS", "NEFT", "RTGS", "ATM")

# bank code -> (layout family, market share %). Codes are the ones in dummy_sources.sql.
BANK_FAMILY_SHARE = {
    "SBI": ("flat_rupees", 18), "PNB": ("flat_rupees", 6), "BOB": ("flat_rupees", 5),
    "CANARA": ("flat_rupees", 5), "UBI": ("flat_rupees", 4), "INDIAN": ("flat_rupees", 2),
    "ICICI": ("paise_epoch", 10), "AXIS": ("paise_epoch", 8), "INDUSIND": ("paise_epoch", 2.5),
    "YES": ("paise_epoch", 2.5), "RBL": ("paise_epoch", 1.5),
    "KOTAK": ("ledger", 6), "IDFC": ("ledger", 2.5), "FEDERAL": ("ledger", 2),
    "BANDHAN": ("ledger", 1.5),
    "HDFC": ("split_datetime", 12), "AU": ("split_datetime", 2), "EQUITAS": ("split_datetime", 1),
    "SIB": ("split_datetime", 1),
    "PAYTM": ("payments_bank", 4), "IPPB": ("payments_bank", 2), "AIRTEL": ("payments_bank", 1),
}
FAMILIES = ("flat_rupees", "paise_epoch", "ledger", "split_datetime", "payments_bank")
WALLET_BANKS = tuple(b for b, (f, _) in BANK_FAMILY_SHARE.items() if f == "payments_bank")

# account number length per bank (9 to 16 digits); wallets use a prefix + 12 digits
ACCT_LEN = {
    "SBI": 11, "PNB": 16, "BOB": 14, "CANARA": 13, "UBI": 15, "INDIAN": 10,
    "ICICI": 12, "AXIS": 15, "INDUSIND": 12, "YES": 15, "RBL": 14,
    "KOTAK": 10, "IDFC": 10, "FEDERAL": 14, "BANDHAN": 14,
    "HDFC": 14, "AU": 12, "EQUITAS": 11, "SIB": 16,
}
WALLET_PREFIX = {"PAYTM": "PTM", "IPPB": "IPW", "AIRTEL": "AWL"}

# share of accounts per segment; the rest is "other_retail". Fixed-count segments are in profiles.py.
SEGMENT_SHARE = {
    "salaried": 0.30, "student": 0.08, "merchant": 0.10, "gig": 0.06, "business": 0.05,
    "retired": 0.03, "homemaker": 0.03, "daily_wage": 0.02,
    "p2p_trader": 0.01, "busy_legit": 0.02, "victim": 0.03, "mule": 0.025, "dormant": 0.03,
}
SELLERS_AT_20K = 60
BILLER_PER_ACCOUNTS = 500
DOUBLE_OWNER_SHARE = 0.05          # share of people who own two accounts at different banks

MULE_MIX = {
    "gateway": 0.14, "complicit_new": 0.22, "rented": 0.12, "unwitting": 0.18,
    "ato": 0.08, "crypto_cashout": 0.13, "atm_cashout": 0.13,
}
HARD_SHARE = 0.30                  # share of mules built with weaker signals

# (name, weight)
CITIES = [
    ("Mumbai", 9), ("Delhi", 9), ("Bengaluru", 7), ("Hyderabad", 6), ("Chennai", 5),
    ("Kolkata", 6), ("Pune", 5), ("Ahmedabad", 4), ("Jaipur", 4), ("Lucknow", 4),
    ("Patna", 4), ("Bhopal", 3), ("Indore", 3), ("Nagpur", 3), ("Guwahati", 4),
    ("Kochi", 3), ("Chandigarh", 2), ("Bhubaneswar", 3), ("Ranchi", 3), ("Surat", 3),
    ("Visakhapatnam", 2), ("Coimbatore", 2), ("Vadodara", 2), ("Ludhiana", 2),
]

# hour-of-day weights (IST) for ordinary activity
HOUR_WEIGHTS = [0.4, 0.2, 0.1, 0.1, 0.2, 0.6, 1.5, 3.0, 4.5, 5.5, 6.0, 6.0,
                6.0, 5.5, 5.0, 5.0, 5.0, 5.5, 6.5, 7.0, 6.5, 4.5, 2.5, 1.0]

SCAM_TYPES = {
    # key: (selection weight, (min, max) payments per victim, (min, max) per-payment amount in rupees)
    "digital_arrest": (0.18, (1, 4), (60_000, 700_000)),
    "investment_task": (0.26, (2, 4), (10_000, 400_000)),
    "kyc_update": (0.20, (1, 2), (5_000, 90_000)),
    "sextortion": (0.08, (1, 3), (5_000, 120_000)),
    "upi_collect": (0.16, (1, 2), (2_000, 40_000)),
    "job_part_time": (0.12, (2, 4), (3_000, 150_000)),
}
MASS_SCAMS = ("kyc_update", "upi_collect", "job_part_time", "sextortion")
TARGETED_SCAMS = ("digital_arrest", "investment_task", "job_part_time", "kyc_update")

SHOWCASE_COMPLAINT = "C-3021"
P2P_RATE = 90.0                    # INR per USDT
P2P_RATE_JITTER = 0.005
