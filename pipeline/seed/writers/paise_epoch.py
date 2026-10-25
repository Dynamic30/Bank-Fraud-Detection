"""paise_epoch: ICICI, Axis, IndusInd, Yes, RBL. Amounts in paise, epoch time (Axis in milliseconds), one-letter
mode codes, boolean success, DOB as DD-MM-YYYY text, income as a band, bank codes are 4-letter IFSC prefixes."""
from __future__ import annotations

from ..banks import Bank
from ..world import DONE
from .base import RAIL_LETTER, FamilyWriter, dob_ddmmyyyy, income_band, occupation, q

# accounts: no, cust, name, dob text, occupation, band, city, opened, state code (1 active, 2 dormant, 3 frozen), vpa, phone, device
# txns:     id, rrn, src, src_bank, dst, dst_bank, amount, epoch, kind, ok, device
SPEC = {
    "ICICI": dict(acc="icici_accounts", a=("acc_id", "customer_ref", "full_name", "birth_date", "occupation_text", "income_band", "city_name", "open_dt", "state_code", "upi_handle", "phone", "device_hash"),
                  txn="icici_transactions", t=("txn_no", "rrn", "src_acc", "src_bank_code", "dst_acc", "dst_bank_code", "amt_paise", "created_epoch", "type_code", "ok", "device_hash"), ms=False),
    "AXIS": dict(acc="axis_accounts", a=("account_ref", "cust_no", "name_on_account", "dob_text", "occupation_text", "income_band", "city_name", "open_dt", "acct_state", "upi_handle", "phone", "device_hash"),
                 txn="axis_transactions", t=("id", "rrn_no", "payer_acc", "payer_bank", "payee_acc", "payee_bank", "amount_paise", "created_ms", "txn_kind", "is_success", "device_hash"), ms=True),
    "INDUSIND": dict(acc="indusind_accounts", a=("acct", "cust_code", "customer", "birth", "occupation_text", "income_band", "town", "opened_on", "state_code", "upi_handle", "phone", "device_hash"),
                     txn="indusind_transactions", t=("txn_key", "utr_rrn", "from_acct", "from_bank", "to_acct", "to_bank", "amt_minor", "epoch_sec", "kind", "success", "device_hash"), ms=False),
    "YES": dict(acc="yes_accounts", a=("yb_account", "yb_customer", "account_name", "date_of_birth", "occupation_text", "income_band", "city_name", "created_on", "state_code", "upi_handle", "phone", "device_hash"),
                txn="yes_transactions", t=("yb_txn_id", "rrn", "debit_acc", "debit_bank", "credit_acc", "credit_bank", "paise", "txn_epoch", "mode_code", "completed", "device_hash"), ms=False),
    "RBL": dict(acc="rbl_accounts", a=("acct_number", "client_id", "client_name", "birth_date", "occupation_text", "income_band", "city_name", "open_dt", "acct_flag", "upi_handle", "phone", "device_hash"),
                txn="rbl_transactions", t=("trn_id", "rrn_ref", "origin_acc", "origin_bank", "dest_acc", "dest_bank", "value_paise", "trn_epoch", "trn_mode", "trn_ok", "device_hash"), ms=False),
}


class PaiseEpoch(FamilyWriter):
    family = "paise_epoch"

    def tables(self, bank: Bank):
        s = SPEC[bank.code]
        yield s["acc"], s["a"], self._accounts(bank)
        yield s["txn"], s["t"], self._txns(bank, s)

    def _accounts(self, bank: Bank):
        c = self.ctx
        for a in c.accts_by_bank[bank.code]:
            p = c.w.person(a)
            yield (a.no, c.customer_id(a), c.holder(a), dob_ddmmyyyy(p.dob), occupation(p.occ, "title"), income_band(p.income),
                   p.city, a.opened, 2 if c.dormant(a) else 1, a.vpa, p.phone, a.device)

    def _txns(self, bank: Bank, s: dict):
        c = self.ctx
        st, accts, banks = c.store, c.accts, c.banks
        mult = 1000 if s["ms"] else 1
        for seq, i in enumerate(c.by_bank[bank.code], 1):
            af = accts[st.f[i]]
            at = accts[st.t[i]] if st.t[i] >= 0 else None
            yield (c.txn_id(bank, seq, st.ts[i]), st.utr[i], af.no, banks[af.bank].ifsc, at.no if at else None,
                   banks[at.bank].ifsc if at else None, st.amt[i], st.ts[i] * mult, RAIL_LETTER[st.rail[i]],
                   st.st[i] == DONE, st.dev[i])

    def readback(self, bank: Bank) -> str:
        s = SPEC[bank.code]
        t = s["t"]
        epoch = f"{q(t[7])}/1000" if s["ms"] else q(t[7])
        return f"SELECT {q(t[1])}, {q(t[6])}::bigint, ({epoch})::bigint, {q(t[9])} FROM {s['txn']} WHERE {q(t[1])} IS NOT NULL"

    def account_tables(self, bank: Bank):
        s = SPEC[bank.code]
        return [(s["acc"], s["a"][0], s["txn"], (s["t"][2], s["t"][4]))]
