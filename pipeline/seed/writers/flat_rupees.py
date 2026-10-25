"""flat_rupees: SBI, PNB, BoB, Canara, Union, Indian. One account table, one transaction table, rupees,
IFSC on both sides, naive IST TIMESTAMP."""
from __future__ import annotations

from ..banks import Bank
from ..world import DONE
from .base import FamilyWriter, ist_naive, money, occupation, q

# accounts: no, cust, name, dob, occ, monthly income, city, opened, status, vpa, mobile, device
# txns:     id, utr, from, from_ifsc, to, to_ifsc, amount, time, mode, status, device
SPEC = {
    "SBI": dict(acc="sbi_accounts", a=("account_number", "cif", "holder_name", "dob", "occupation", "monthly_income", "city", "opened_on", "acct_status", "vpa", "mobile", "device_id"),
                txn="sbi_transactions", t=("txn_id", "utr", "from_account", "from_ifsc", "to_account", "to_ifsc", "amount", "txn_time", "mode", "result", "device_id"),
                active="ACTIVE", dormant="ACTIVE", ok="SUCCESS", fail="FAILED"),
    "PNB": dict(acc="pnb_accounts", a=("acct_no", "customer_id", "account_holder", "dob", "occupation", "avg_monthly_income", "city", "open_date", "acct_state", "vpa", "registered_mobile", "device_id"),
                txn="pnb_transactions", t=("txn_ref", "utr_no", "debit_account", "debit_ifsc", "credit_account", "credit_ifsc", "txn_amount", "txn_datetime", "channel", "txn_status", "device_id"),
                active="OPERATIVE", dormant="DORMANT", ok="COMPLETED", fail="FAILED"),
    "BOB": dict(acc="bob_accounts", a=("account_no", "cust_ref", "customer_name", "dob", "occupation", "monthly_income", "city", "opened_on", "account_status", "vpa", "mobile", "device_id"),
                txn="bob_transactions", t=("transaction_id", "utr", "remitter_account", "remitter_ifsc", "beneficiary_account", "beneficiary_ifsc", "amount", "executed_at", "payment_mode", "outcome", "device_id"),
                active="ACTIVE", dormant="INOPERATIVE", ok="SUCCESS", fail="FAILURE"),
    "CANARA": dict(acc="canara_accounts", a=("acno", "cust_id", "cust_name", "dob", "occupation", "declared_monthly_income", "city", "account_open_date", "state", "vpa", "mobile", "device_id"),
                   txn="canara_transactions", t=("tran_id", "bank_ref_no", "from_acno", "from_ifsc_code", "to_acno", "to_ifsc_code", "tran_amt", "tran_ts", "tran_mode", "tran_result", "device_id"),
                   active="LIVE", dormant="DORMANT", ok="OK", fail="FAIL"),
    "UBI": dict(acc="ubi_accounts", a=("ac_number", "cif_id", "ac_holder_name", "dob", "occupation", "monthly_income", "city", "opening_date", "ac_status", "vpa", "mobile", "device_id"),
                txn="ubi_transactions", t=("txn_no", "utr_ref", "payer_account", "payer_ifsc", "payee_account", "payee_ifsc", "txn_value", "txn_timestamp", "txn_type", "txn_result", "device_id"),
                active="ACTIVE", dormant="ACTIVE", ok="SUCCESS", fail="FAILED"),
    "INDIAN": dict(acc="indian_accounts", a=("acct_id", "customer_no", "holder", "dob", "occupation", "monthly_income", "city", "opened_on", "acct_status", "vpa", "mobile", "device_id"),
                   txn="indian_transactions", t=("reference_id", "utr_number", "from_acct", "from_branch_ifsc", "to_acct", "to_branch_ifsc", "amt", "posted_time", "mode", "state", "device_id"),
                   active="ACTIVE", dormant="ACTIVE", ok="DONE", fail="FAILED"),
}


class FlatRupees(FamilyWriter):
    family = "flat_rupees"

    def tables(self, bank: Bank):
        s = SPEC[bank.code]
        yield s["acc"], s["a"], self._accounts(bank, s)
        yield s["txn"], s["t"], self._txns(bank, s)

    def _accounts(self, bank: Bank, s: dict):
        c = self.ctx
        for a in c.accts_by_bank[bank.code]:
            p = c.w.person(a)
            yield (a.no, c.customer_id(a), c.holder(a), p.dob, occupation(p.occ, "snake"), f"{p.income:.2f}", p.city,
                   a.opened, s["dormant"] if c.dormant(a) else s["active"], a.vpa, p.phone, a.device)

    def _txns(self, bank: Bank, s: dict):
        c = self.ctx
        st, accts = c.store, c.accts
        for seq, i in enumerate(c.by_bank[bank.code], 1):
            af = accts[st.f[i]]
            at = accts[st.t[i]] if st.t[i] >= 0 else None
            yield (c.txn_id(bank, seq, st.ts[i]), st.utr[i], af.no, af.ifsc, at.no if at else None, at.ifsc if at else None,
                   money(st.amt[i]), ist_naive(st.ts[i]), st.rail[i], s["ok"] if st.st[i] == DONE else s["fail"], st.dev[i])

    def readback(self, bank: Bank) -> str:
        s = SPEC[bank.code]
        t = s["t"]
        return (f"SELECT {q(t[1])}, round({q(t[6])}*100)::bigint, "
                f"extract(epoch FROM ({q(t[7])} AT TIME ZONE 'Asia/Kolkata'))::bigint, ({q(t[9])}='{s['ok']}') "
                f"FROM {s['txn']} WHERE {q(t[1])} IS NOT NULL")

    def account_tables(self, bank: Bank):
        s = SPEC[bank.code]
        return [(s["acc"], s["a"][0], s["txn"], (s["t"][2], s["t"][4]))]
