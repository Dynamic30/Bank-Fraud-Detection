"""payments_bank: Paytm, India Post, Airtel. Wallets and a payments table with JSON metadata.

payer_id / payee_id hold this bank's wallet id when that side is one of its wallets. For an outside party they
hold that party's account number (or wallet id at another payments bank) and meta.cp carries the full details:
  {"account_no", "ifsc", "vpa"}. payee_id is NULL for ATM cash. meta also has the initiating device and the rail."""
from __future__ import annotations

import json

from ..banks import Bank
from ..world import DONE
from .base import FamilyWriter, money, occupation, utc_aware

WALLET_COLS = ("wallet_id", "holder_name", "dob", "occupation", "city", "kyc_level", "monthly_limit", "opened_on",
               "wallet_status", "vpa", "mobile", "linked_bank_account")
PAY_COLS = ("payment_id", "utr", "payer_id", "payee_id", "amount", "created_at", "payment_type", "state", "meta")
PREFIX = {"PAYTM": "paytm", "IPPB": "ippb", "AIRTEL": "airtel"}


class PaymentsBank(FamilyWriter):
    family = "payments_bank"

    def tables(self, bank: Bank):
        p = PREFIX[bank.code]
        yield f"{p}_wallets", WALLET_COLS, self._wallets(bank)
        yield f"{p}_payments", PAY_COLS, self._payments(bank)

    def _wallets(self, bank: Bank):
        c = self.ctx
        for a in c.accts_by_bank[bank.code]:
            p = c.w.person(a)
            yield (a.no, c.holder(a), p.dob, occupation(p.occ, "title"), p.city, a.kyc, f"{a.limit:.2f}", a.opened,
                   "ACTIVE", a.vpa, p.phone, a.linked)

    def _payments(self, bank: Bank):
        c = self.ctx
        st, accts, rng = c.store, c.accts, c.rng
        for seq, i in enumerate(c.by_bank[bank.code], 1):
            af = accts[st.f[i]]
            at = accts[st.t[i]] if st.t[i] >= 0 else None
            f_own = af.bank == bank.code
            t_own = at is not None and at.bank == bank.code
            meta = {"device": st.dev[i], "rail": st.rail[i], "channel": rng.choice(["app", "app", "app", "qr", "web"])}
            if at is not None and not (f_own and t_own):
                other = at if f_own else af
                meta["cp"] = {"account_no": other.no, "ifsc": other.ifsc, "vpa": other.vpa}
            ptype = self._type(af, at, f_own, t_own, st.rail[i])
            if ptype == "MERCHANT" and at is not None:
                meta["merchant"] = at.bname or c.w.person(at).name
            yield (c.txn_id(bank, seq, st.ts[i]), st.utr[i], af.no, at.no if at else None, money(st.amt[i]),
                   utc_aware(st.ts[i]), ptype, "OK" if st.st[i] == DONE else "FAIL", json.dumps(meta))

    @staticmethod
    def _type(af, at, f_own: bool, t_own: bool, rail: str) -> str:
        if rail == "ATM" or at is None:
            return "ATM"
        if at.segment == "merchant":
            return "MERCHANT"
        if f_own and af.linked and at.no == af.linked:
            return "WITHDRAWAL"
        if t_own and at.linked and af.no == at.linked:
            return "TOPUP"
        return "P2P"

    def readback(self, bank: Bank) -> str:
        t = f"{PREFIX[bank.code]}_payments"
        return (f"SELECT utr, round(amount*100)::bigint, extract(epoch FROM created_at)::bigint, (state='OK') "
                f"FROM {t} WHERE utr IS NOT NULL")

    def account_tables(self, bank: Bank):
        p = PREFIX[bank.code]
        return [(f"{p}_wallets", "wallet_id", f"{p}_payments", ("payer_id", "payee_id"))]
