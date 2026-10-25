"""split_datetime: HDFC, AU, Equitas, South Indian. Date and time in separate columns (IST), UPI handles on both
sides and no IFSC, so a counterparty's bank can only be resolved from its VPA handle."""
from __future__ import annotations

from ..banks import Bank
from ..world import DONE
from .base import FamilyWriter, ist_naive, money, occupation, q

# accounts: no, name, dob, occupation, annual income, city, opened, status, vpa, phone, device
# txns:     id, utr, sender, sender vpa, receiver, receiver vpa, amount, date, time, mode, status, device
SPEC = {
    "HDFC": dict(acc="hdfc_accounts", a=("acct_no", "customer_name", "dob", "occupation", "annual_income", "city", "opened", "status", "vpa", "phone", "device_id"), active="Active", dormant="Active",
                 txn="hdfc_transactions", t=("ref_no", "utr", "sender_acct", "sender_vpa", "receiver_acct", "receiver_vpa", "amount", "txn_date", "txn_time", "mode", "status", "device_id")),
    "AU": dict(acc="au_accounts", a=("account_number", "holder_name", "dob", "profession", "yearly_income", "city", "open_date", "acct_status", "vpa", "mobile_no", "device_id"), active="Active", dormant="Active",
               txn="au_transactions", t=("txn_ref", "utr", "from_account", "from_vpa", "to_account", "to_vpa", "amount", "date", "time", "channel", "outcome", "device_id")),
    "EQUITAS": dict(acc="equitas_accounts", a=("acc_no", "cust_name", "dob", "occupation", "income_pa", "city", "opened_date", "acc_status", "vpa", "phone", "device_id"), active="ACTIVE", dormant="ACTIVE",
                    txn="equitas_transactions", t=("txn_id", "utr_code", "payer_acc", "payer_vpa", "payee_acc", "payee_vpa", "txn_amt", "txn_dt", "txn_tm", "txn_mode", "txn_flag", "device_id")),
    "SIB": dict(acc="sib_accounts", a=("acno", "holder_name", "dob", "job", "annual_income_inr", "home_city", "since", "state", "vpa", "contact", "device_id"), active="Live", dormant="Live",
                txn="sib_transactions", t=("tx_ref", "utr", "debit_acno", "debit_vpa", "credit_acno", "credit_vpa", "inr", "tx_date", "tx_time", "via", "tx_state", "device_id")),
}


class SplitDatetime(FamilyWriter):
    family = "split_datetime"

    def tables(self, bank: Bank):
        s = SPEC[bank.code]
        yield s["acc"], s["a"], self._accounts(bank, s)
        yield s["txn"], s["t"], self._txns(bank)

    def _accounts(self, bank: Bank, s: dict):
        c = self.ctx
        for a in c.accts_by_bank[bank.code]:
            p = c.w.person(a)
            yield (a.no, c.holder(a), p.dob, occupation(p.occ, "title"), f"{p.income * 12:.2f}", p.city, a.opened,
                   s["dormant"] if c.dormant(a) else s["active"], a.vpa, p.phone, a.device)

    def _txns(self, bank: Bank):
        c = self.ctx
        st, accts = c.store, c.accts
        for seq, i in enumerate(c.by_bank[bank.code], 1):
            af = accts[st.f[i]]
            at = accts[st.t[i]] if st.t[i] >= 0 else None
            local = ist_naive(st.ts[i])
            yield (c.txn_id(bank, seq, st.ts[i]), st.utr[i], af.no, af.vpa, at.no if at else None, at.vpa if at else None,
                   money(st.amt[i]), local.date(), local.time(), st.rail[i], "S" if st.st[i] == DONE else "F", st.dev[i])

    def readback(self, bank: Bank) -> str:
        t = SPEC[bank.code]["t"]
        return (f"SELECT {q(t[1])}, round({q(t[6])}*100)::bigint, "
                f"extract(epoch FROM (({q(t[7])} + {q(t[8])}) AT TIME ZONE 'Asia/Kolkata'))::bigint, ({q(t[10])}='S') "
                f"FROM {SPEC[bank.code]['txn']} WHERE {q(t[1])} IS NOT NULL")

    def account_tables(self, bank: Bank):
        s = SPEC[bank.code]
        return [(s["acc"], s["a"][0], s["txn"], (s["t"][2], s["t"][4]))]
