"""ledger: Kotak, IDFC, Federal, Bandhan. Customers + accounts + double-entry ledger with tz-aware times.
A payment between two accounts of the same bank gets a debit and a credit entry sharing the transaction
reference; a payment to or from another bank gets ONE entry. A failed payment only has the debit entry."""
from __future__ import annotations

from ..banks import Bank
from ..world import DONE
from .base import FamilyWriter, occupation, q, money, utc_aware

# customers: id, name, dob, profession, annual income, city, mobile
# accounts:  no, customer id, opened, state, upi id, device
# ledger:    ref, utr, account, direction, amount, time, channel, counterparty, counterparty ifsc, status, device
SPEC = {
    "KOTAK": dict(cust="kotak_customers", c=("customer_id", "full_name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
                  acc="kotak_accounts", a=("account_no", "customer_id", "opened_on", "account_state", "upi_id", "linked_device"), active="OPEN",
                  led="kotak_ledger", l=("txn_ref", "utr", "account_no", "direction", "amount", "posted_at", "channel", "counterparty_account", "counterparty_ifsc", "entry_status", "linked_device"),
                  dr="D", cr="C", ok="POSTED", fail="FAILED"),
    "IDFC": dict(cust="idfc_customers", c=("cust_id", "cust_name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
                 acc="idfc_accounts", a=("acct_no", "cust_id", "opened_on", "acct_status", "upi_id", "linked_device"), active="ACTIVE",
                 led="idfc_ledger", l=("trn_ref", "utr", "acct_no", "dr_cr", "amount", "booked_at", "rail", "other_acct", "other_ifsc", "entry_status", "linked_device"),
                 dr="DR", cr="CR", ok="POSTED", fail="FAILED"),
    "FEDERAL": dict(cust="federal_customers", c=("customer_no", "name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
                    acc="federal_accounts", a=("ac_no", "customer_no", "opened_on", "ac_state", "upi_id", "linked_device"), active="OPEN",
                    led="federal_ledger", l=("reference", "utr", "ac_no", "flow", "amount", "value_ts", "medium", "counter_ac", "counter_ifsc", "posting_state", "linked_device"),
                    dr="OUT", cr="IN", ok="POSTED", fail="FAILED"),
    "BANDHAN": dict(cust="bandhan_customers", c=("client_no", "client_name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
                    acc="bandhan_accounts", a=("account_id", "client_no", "opened_on", "status", "upi_id", "linked_device"), active="ACTIVE",
                    led="bandhan_ledger", l=("tran_ref", "utr", "account_id", "side", "amount", "entry_time", "channel_code", "peer_account", "peer_ifsc", "result", "linked_device"),
                    dr="DEBIT", cr="CREDIT", ok="POSTED", fail="REJECTED"),
}


class Ledger(FamilyWriter):
    family = "ledger"

    def tables(self, bank: Bank):
        s = SPEC[bank.code]
        accts = self.ctx.accts_by_bank[bank.code]
        yield s["cust"], s["c"], self._customers(accts)
        yield s["acc"], s["a"], self._accounts(accts, s)
        yield s["led"], s["l"], self._ledger(bank, s)

    def _customers(self, accts):
        c = self.ctx
        for a in accts:
            p = c.w.person(a)
            yield (c.customer_id(a), c.holder(a), p.dob, occupation(p.occ, "upper"), f"{p.income * 12:.2f}", p.city, p.phone)

    def _accounts(self, accts, s: dict):
        c = self.ctx
        for a in accts:
            yield (a.no, c.customer_id(a), a.opened, s["active"], a.vpa, a.device)

    def _ledger(self, bank: Bank, s: dict):
        c = self.ctx
        st, accts = c.store, c.accts
        for seq, i in enumerate(c.by_bank[bank.code], 1):
            f, t = st.f[i], st.t[i]
            af = accts[f]
            at = accts[t] if t >= 0 else None
            ref = c.txn_id(bank, seq, st.ts[i])
            ts, amt = utc_aware(st.ts[i]), money(st.amt[i])
            done = st.st[i] == DONE
            status = s["ok"] if done else s["fail"]
            rail, utr, dev = st.rail[i], st.utr[i], st.dev[i]
            if af.bank == bank.code:                                    # debit side
                yield (ref, utr, af.no, s["dr"], amt, ts, rail, at.no if at else None, at.ifsc if at else None, status, dev)
            if at is not None and at.bank == bank.code and done:       # credit side
                yield (ref, utr, at.no, s["cr"], amt, ts, rail, af.no, af.ifsc, status, dev)

    def readback(self, bank: Bank) -> str:
        s = SPEC[bank.code]
        l = s["l"]
        return (f"SELECT {q(l[1])}, round({q(l[4])}*100)::bigint, extract(epoch FROM {q(l[5])})::bigint, ({q(l[9])}='{s['ok']}') "
                f"FROM {s['led']} WHERE {q(l[1])} IS NOT NULL")

    def account_tables(self, bank: Bank):
        s = SPEC[bank.code]
        return [(s["acc"], s["a"][0], s["led"], (s["l"][2], s["l"][2]))]
