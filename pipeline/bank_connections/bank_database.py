import os
from datetime import UTC, datetime, timedelta
from decimal import Decimal

import psycopg

IST = timedelta(hours=5, minutes=30)
BAND = {"LT_25K": 15000, "25K_50K": 37500, "50K_1L": 75000, "GT_1L": 150000}
RAIL = {"U": "UPI", "I": "IMPS", "N": "NEFT", "R": "RTGS", "A": "ATM"}
IFSC, HANDLE = {}, {}
PHONES = {}  # raw phones, in memory and only while phone_of runs: accounts keeps just phone_masked


def connect():
    return psycopg.connect(os.environ.get("BANK_DATABASE_URL_HOST") or os.environ["BANK_DATABASE_URL"])


def app_connect():
    return psycopg.connect(os.environ["APP_DATABASE_URL"])


def load_banks(app):
    for id, ifsc, handle in app.execute("select id, ifsc_prefix, upi_handle from banks"):
        IFSC[ifsc], HANDLE[handle] = id, id


def bank_of(ifsc=None, vpa=None):
    return IFSC[ifsc[:4]] if ifsc else HANDLE[vpa.split("@")[1]]


def one(conn, table, cols, key):
    row = conn.execute(f"select {sel(cols)} from {table} where {q(cols[0])} = %s", (key,)).fetchone()
    if not row:
        raise LookupError(f"{table}: no account {key}")
    return row


def q(col):
    return f'"{col}"'


def sel(cols):
    return ", ".join(q(c) for c in cols)


def mask(s):
    return "••" + s[-4:] if s else None


def profile(bank, no, name, dob, occ, income, city, opened, device, vpa, phone, until):
    if f"{bank}:{no}" in PHONES:
        PHONES[f"{bank}:{no}"] = phone
    return dict(account_id=f"{bank}:{no}", kind="bank", bank_id=bank, holder_name=name, dob=dob,
                occupation=occ.lower().replace(" ", "_") if occ else None, declared_income=income, city=city,
                opened_on=opened, device_id=device, upi_id=vpa, account_no_masked=mask(no), phone_masked=mask(phone),
                source=bank, fetched_at=datetime.now(UTC).replace(tzinfo=None),
                txns_synced_until=until or datetime.now(UTC).replace(tzinfo=None))


def ref(accts, bank, no, vpa=None):
    id = f"{bank}:{no}"
    accts.setdefault(id, dict(account_id=id, kind="bank", bank_id=bank, upi_id=vpa, account_no_masked=mask(no), source=bank))
    return id


def transfer(bank, txn_id, utr, frm, to, amount, ts, rail, ok, device):
    return dict(source="bank", source_ref=utr or f"{bank}:{txn_id}", from_id=frm, to_id=to, amount=amount, asset="INR",
                ts=ts, rail=rail, status="done" if ok else "failed", utr=utr, device_id=device)


def utc(ts):
    return ts.astimezone(UTC).replace(tzinfo=None)


def flat(conn, bank, no, until, acc, a, txn, t, ok):
    p = one(conn, acc, a, no)
    accts = {f"{bank}:{no}": profile(bank, no, p[1], p[2], p[3], p[4] * 12, p[5], p[6], p[9], p[7], p[8], until)}
    sql = f"select {sel(t)} from {txn} where ({q(t[2])} = %s or {q(t[4])} = %s)" + (f" and {q(t[7])} <= %s" if until else "")
    out = []
    for id, utr, f, fi, to, ti, amt, ts, mode, status, dev in conn.execute(sql, (no, no) + ((until + IST,) if until else ())):
        frm = ref(accts, bank_of(ifsc=fi), f)
        dst = ref(accts, bank_of(ifsc=ti), to) if to else None
        out.append(transfer(bank, id, utr, frm, dst, amt, ts - IST, mode, status == ok, dev))
    return list(accts.values()), out


def paise(conn, bank, no, until, acc, a, txn, t, per_sec=1):
    p = one(conn, acc, a, no)
    dob = datetime.strptime(p[2], "%d-%m-%Y").date()
    accts = {f"{bank}:{no}": profile(bank, no, p[1], dob, p[3], BAND[p[4]] * 12, p[5], p[6], p[9], p[7], p[8], until)}
    sql = f"select {sel(t)} from {txn} where ({q(t[2])} = %s or {q(t[4])} = %s)" + (f" and {q(t[7])} <= %s" if until else "")
    out = []
    for id, rrn, src, sb, dst, db, amt, epoch, kind, ok, dev in conn.execute(
            sql, (no, no) + ((int(until.replace(tzinfo=UTC).timestamp() * per_sec),) if until else ())):
        frm = ref(accts, bank_of(ifsc=sb), src)
        to = ref(accts, bank_of(ifsc=db), dst) if dst else None
        ts = datetime.fromtimestamp(epoch / per_sec, UTC).replace(tzinfo=None)
        out.append(transfer(bank, id, rrn, frm, to, Decimal(amt) / 100, ts, RAIL[kind], ok, dev))
    return list(accts.values()), out


def ledger(conn, bank, no, until, cust, c, acc, a, led, l, debit):
    ac = one(conn, acc, a, no)
    cu = one(conn, cust, c, ac[1])
    accts = {f"{bank}:{no}": profile(bank, no, cu[1], cu[2], cu[3], cu[4], cu[5], ac[2], ac[4], ac[3], cu[6], until)}
    sql = f"select {sel(l)} from {led} where {q(l[2])} = %s" + (f" and {q(l[5])} <= %s" if until else "")
    out = []
    for id, utr, acct, d, amt, ts, channel, cp, cp_ifsc, status, dev in conn.execute(
            sql, (no,) + ((until.replace(tzinfo=UTC),) if until else ())):
        other = ref(accts, bank_of(ifsc=cp_ifsc), cp) if cp else None
        me = f"{bank}:{acct}"
        frm, to = (me, other) if d == debit else (other, me)
        out.append(transfer(bank, id, utr, frm, to, amt, utc(ts), channel, status == "POSTED", dev))
    return list(accts.values()), out


def split(conn, bank, no, until, acc, a, txn, t):
    p = one(conn, acc, a, no)
    accts = {f"{bank}:{no}": profile(bank, no, p[1], p[2], p[3], p[4], p[5], p[6], p[9], p[7], p[8], until)}
    sql = (f"select {sel(t)} from {txn} where ({q(t[2])} = %s or {q(t[4])} = %s)"
           + (f" and ({q(t[7])} + {q(t[8])}) <= %s" if until else ""))
    out = []
    for id, utr, sender, svpa, receiver, rvpa, amt, d, tm, mode, status, dev in conn.execute(
            sql, (no, no) + ((until + IST,) if until else ())):
        frm = ref(accts, bank_of(vpa=svpa), sender, svpa)
        to = ref(accts, bank_of(vpa=rvpa), receiver, rvpa) if receiver else None
        out.append(transfer(bank, id, utr, frm, to, amt, datetime.combine(d, tm) - IST, mode, status == "S", dev))
    return list(accts.values()), out


def payments(conn, bank, no, until, prefix):
    p = one(conn, f"{prefix}_wallets", ("wallet_id", "holder_name", "dob", "occupation", "city", "opened_on", "vpa", "mobile"), no)
    accts = {f"{bank}:{no}": profile(bank, no, p[1], p[2], p[3], None, p[4], p[5], None, p[6], p[7], until)}
    cols = ("payment_id", "utr", "payer_id", "payee_id", "amount", "created_at", "state", "meta")
    sql = (f"select {sel(cols)} from {prefix}_payments where (payer_id = %s or payee_id = %s)"
           + (" and created_at <= %s" if until else ""))
    out = []
    for id, utr, payer, payee, amt, ts, state, meta in conn.execute(sql, (no, no) + ((until.replace(tzinfo=UTC),) if until else ())):
        cp = meta.get("cp")

        def side(x):
            if x is None:
                return None
            if x == no or not cp:
                return ref(accts, bank, x)
            return ref(accts, bank_of(ifsc=cp["ifsc"]), x, cp["vpa"])

        out.append(transfer(bank, id, utr, side(payer), side(payee), amt, utc(ts), meta["rail"], state == "OK", meta["device"]))
    return list(accts.values()), out


def sbi(no, until=None):
    with connect() as conn:
        return flat(
            conn, "SBI", no, until,
            "sbi_accounts", ("account_number", "holder_name", "dob", "occupation", "monthly_income", "city", "opened_on", "vpa", "mobile", "device_id"),
            "sbi_transactions", ("txn_id", "utr", "from_account", "from_ifsc", "to_account", "to_ifsc", "amount", "txn_time", "mode", "result", "device_id"), "SUCCESS",
        )


def pnb(no, until=None):
    with connect() as conn:
        return flat(
            conn, "PNB", no, until,
            "pnb_accounts", ("acct_no", "account_holder", "dob", "occupation", "avg_monthly_income", "city", "open_date", "vpa", "registered_mobile", "device_id"),
            "pnb_transactions", ("txn_ref", "utr_no", "debit_account", "debit_ifsc", "credit_account", "credit_ifsc", "txn_amount", "txn_datetime", "channel", "txn_status", "device_id"), "COMPLETED",
        )


def bob(no, until=None):
    with connect() as conn:
        return flat(
            conn, "BOB", no, until,
            "bob_accounts", ("account_no", "customer_name", "dob", "occupation", "monthly_income", "city", "opened_on", "vpa", "mobile", "device_id"),
            "bob_transactions", ("transaction_id", "utr", "remitter_account", "remitter_ifsc", "beneficiary_account", "beneficiary_ifsc", "amount", "executed_at", "payment_mode", "outcome", "device_id"), "SUCCESS",
        )


def canara(no, until=None):
    with connect() as conn:
        return flat(
            conn, "CANARA", no, until,
            "canara_accounts", ("acno", "cust_name", "dob", "occupation", "declared_monthly_income", "city", "account_open_date", "vpa", "mobile", "device_id"),
            "canara_transactions", ("tran_id", "bank_ref_no", "from_acno", "from_ifsc_code", "to_acno", "to_ifsc_code", "tran_amt", "tran_ts", "tran_mode", "tran_result", "device_id"), "OK",
        )


def ubi(no, until=None):
    with connect() as conn:
        return flat(
            conn, "UBI", no, until,
            "ubi_accounts", ("ac_number", "ac_holder_name", "dob", "occupation", "monthly_income", "city", "opening_date", "vpa", "mobile", "device_id"),
            "ubi_transactions", ("txn_no", "utr_ref", "payer_account", "payer_ifsc", "payee_account", "payee_ifsc", "txn_value", "txn_timestamp", "txn_type", "txn_result", "device_id"), "SUCCESS",
        )


def indian(no, until=None):
    with connect() as conn:
        return flat(
            conn, "INDIAN", no, until,
            "indian_accounts", ("acct_id", "holder", "dob", "occupation", "monthly_income", "city", "opened_on", "vpa", "mobile", "device_id"),
            "indian_transactions", ("reference_id", "utr_number", "from_acct", "from_branch_ifsc", "to_acct", "to_branch_ifsc", "amt", "posted_time", "mode", "state", "device_id"), "DONE",
        )


def icici(no, until=None):
    with connect() as conn:
        return paise(
            conn, "ICICI", no, until,
            "icici_accounts", ("acc_id", "full_name", "birth_date", "occupation_text", "income_band", "city_name", "open_dt", "upi_handle", "phone", "device_hash"),
            "icici_transactions", ("txn_no", "rrn", "src_acc", "src_bank_code", "dst_acc", "dst_bank_code", "amt_paise", "created_epoch", "type_code", "ok", "device_hash"),
        )


def axis(no, until=None):
    with connect() as conn:
        return paise(
            conn, "AXIS", no, until,
            "axis_accounts", ("account_ref", "name_on_account", "dob_text", "occupation_text", "income_band", "city_name", "open_dt", "upi_handle", "phone", "device_hash"),
            "axis_transactions", ("id", "rrn_no", "payer_acc", "payer_bank", "payee_acc", "payee_bank", "amount_paise", "created_ms", "txn_kind", "is_success", "device_hash"), 1000,
        )


def indusind(no, until=None):
    with connect() as conn:
        return paise(
            conn, "INDUSIND", no, until,
            "indusind_accounts", ("acct", "customer", "birth", "occupation_text", "income_band", "town", "opened_on", "upi_handle", "phone", "device_hash"),
            "indusind_transactions", ("txn_key", "utr_rrn", "from_acct", "from_bank", "to_acct", "to_bank", "amt_minor", "epoch_sec", "kind", "success", "device_hash"),
        )


def yes(no, until=None):
    with connect() as conn:
        return paise(
            conn, "YES", no, until,
            "yes_accounts", ("yb_account", "account_name", "date_of_birth", "occupation_text", "income_band", "city_name", "created_on", "upi_handle", "phone", "device_hash"),
            "yes_transactions", ("yb_txn_id", "rrn", "debit_acc", "debit_bank", "credit_acc", "credit_bank", "paise", "txn_epoch", "mode_code", "completed", "device_hash"),
        )


def rbl(no, until=None):
    with connect() as conn:
        return paise(
            conn, "RBL", no, until,
            "rbl_accounts", ("acct_number", "client_name", "birth_date", "occupation_text", "income_band", "city_name", "open_dt", "upi_handle", "phone", "device_hash"),
            "rbl_transactions", ("trn_id", "rrn_ref", "origin_acc", "origin_bank", "dest_acc", "dest_bank", "value_paise", "trn_epoch", "trn_mode", "trn_ok", "device_hash"),
        )


def kotak(no, until=None):
    with connect() as conn:
        return ledger(
            conn, "KOTAK", no, until,
            "kotak_customers", ("customer_id", "full_name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
            "kotak_accounts", ("account_no", "customer_id", "opened_on", "upi_id", "linked_device"),
            "kotak_ledger", ("txn_ref", "utr", "account_no", "direction", "amount", "posted_at", "channel", "counterparty_account", "counterparty_ifsc", "entry_status", "linked_device"), "D",
        )


def idfc(no, until=None):
    with connect() as conn:
        return ledger(
            conn, "IDFC", no, until,
            "idfc_customers", ("cust_id", "cust_name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
            "idfc_accounts", ("acct_no", "cust_id", "opened_on", "upi_id", "linked_device"),
            "idfc_ledger", ("trn_ref", "utr", "acct_no", "dr_cr", "amount", "booked_at", "rail", "other_acct", "other_ifsc", "entry_status", "linked_device"), "DR",
        )


def federal(no, until=None):
    with connect() as conn:
        return ledger(
            conn, "FEDERAL", no, until,
            "federal_customers", ("customer_no", "name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
            "federal_accounts", ("ac_no", "customer_no", "opened_on", "upi_id", "linked_device"),
            "federal_ledger", ("reference", "utr", "ac_no", "flow", "amount", "value_ts", "medium", "counter_ac", "counter_ifsc", "posting_state", "linked_device"), "OUT",
        )


def bandhan(no, until=None):
    with connect() as conn:
        return ledger(
            conn, "BANDHAN", no, until,
            "bandhan_customers", ("client_no", "client_name", "date_of_birth", "profession", "annual_income", "city", "mobile"),
            "bandhan_accounts", ("account_id", "client_no", "opened_on", "upi_id", "linked_device"),
            "bandhan_ledger", ("tran_ref", "utr", "account_id", "side", "amount", "entry_time", "channel_code", "peer_account", "peer_ifsc", "result", "linked_device"), "DEBIT",
        )


def hdfc(no, until=None):
    with connect() as conn:
        return split(
            conn, "HDFC", no, until,
            "hdfc_accounts", ("acct_no", "customer_name", "dob", "occupation", "annual_income", "city", "opened", "vpa", "phone", "device_id"),
            "hdfc_transactions", ("ref_no", "utr", "sender_acct", "sender_vpa", "receiver_acct", "receiver_vpa", "amount", "txn_date", "txn_time", "mode", "status", "device_id"),
        )


def au(no, until=None):
    with connect() as conn:
        return split(
            conn, "AU", no, until,
            "au_accounts", ("account_number", "holder_name", "dob", "profession", "yearly_income", "city", "open_date", "vpa", "mobile_no", "device_id"),
            "au_transactions", ("txn_ref", "utr", "from_account", "from_vpa", "to_account", "to_vpa", "amount", "date", "time", "channel", "outcome", "device_id"),
        )


def equitas(no, until=None):
    with connect() as conn:
        return split(
            conn, "EQUITAS", no, until,
            "equitas_accounts", ("acc_no", "cust_name", "dob", "occupation", "income_pa", "city", "opened_date", "vpa", "phone", "device_id"),
            "equitas_transactions", ("txn_id", "utr_code", "payer_acc", "payer_vpa", "payee_acc", "payee_vpa", "txn_amt", "txn_dt", "txn_tm", "txn_mode", "txn_flag", "device_id"),
        )


def sib(no, until=None):
    with connect() as conn:
        return split(
            conn, "SIB", no, until,
            "sib_accounts", ("acno", "holder_name", "dob", "job", "annual_income_inr", "home_city", "since", "vpa", "contact", "device_id"),
            "sib_transactions", ("tx_ref", "utr", "debit_acno", "debit_vpa", "credit_acno", "credit_vpa", "inr", "tx_date", "tx_time", "via", "tx_state", "device_id"),
        )


def paytm(no, until=None):
    with connect() as conn:
        return payments(conn, "PAYTM", no, until, "paytm")


def ippb(no, until=None):
    with connect() as conn:
        return payments(conn, "IPPB", no, until, "ippb")


def airtel(no, until=None):
    with connect() as conn:
        return payments(conn, "AIRTEL", no, until, "airtel")


def tron(address, until=None):
    with connect() as conn:
        sql = "select tx_hash, asset, from_address, to_address, amount, block_time from crypto_transfers where (from_address = %s or to_address = %s)"
        txs = conn.execute(sql + (" and block_time <= %s" if until else ""), (address, address) + ((until,) if until else ())).fetchall()
        known = {a: (kind, exchange) for a, kind, exchange in conn.execute(
            "select w.address, w.kind, e.name from crypto_wallets w left join crypto_exchanges e on e.exchange_id = w.exchange_id "
            "where w.address = any(%s)", ([address] + [x for t in txs for x in t[2:4]],))}
    if address not in known:
        raise LookupError(f"crypto_wallets: no account {address}")
    now = datetime.now(UTC).replace(tzinfo=None)
    accts = [dict(account_id=f"TRON:{a}", kind="wallet", wallet_kind=kind, exchange_name=exchange, source="TRON",
                  **(dict(fetched_at=now, txns_synced_until=until or now) if a == address else {}))
             for a, (kind, exchange) in known.items()]
    out = [dict(source="chain", source_ref=h, from_id=f"TRON:{f}", to_id=f"TRON:{t}", amount=amt, asset=asset, ts=ts,
                rail="CHAIN", status="done", utr=None, device_id=None) for h, asset, f, t, amt, ts in txs]
    return accts, out


BANKS = {
    "SBI": sbi,
    "PNB": pnb,
    "BOB": bob,
    "CANARA": canara,
    "UBI": ubi,
    "INDIAN": indian,
    "ICICI": icici,
    "AXIS": axis,
    "INDUSIND": indusind,
    "YES": yes,
    "RBL": rbl,
    "KOTAK": kotak,
    "IDFC": idfc,
    "FEDERAL": federal,
    "BANDHAN": bandhan,
    "HDFC": hdfc,
    "AU": au,
    "EQUITAS": equitas,
    "SIB": sib,
    "PAYTM": paytm,
    "IPPB": ippb,
    "AIRTEL": airtel,
    "TRON": tron,
}


def demo_clock(app):
    row = app.execute("select value from settings where key = 'demo_clock'").fetchone()
    if not row or not row[0]:
        return None
    d = datetime.fromisoformat(row[0].replace("Z", "+00:00"))
    return d.astimezone(UTC).replace(tzinfo=None) if d.tzinfo else d


def save(app, accounts, transfers):
    for a in accounts:
        sets = ", ".join(f"{c} = excluded.{c}" for c in a if c != "account_id")
        action = f"update set {sets}" if a.get("fetched_at") else "nothing"
        app.execute(f"insert into accounts ({', '.join(a)}) values ({', '.join(f'%({c})s' for c in a)}) "
                    f"on conflict (account_id) do {action}", a)
    if transfers:
        app.cursor().executemany(f"insert into transfers ({', '.join(transfers[0])}) values ({', '.join(f'%({c})s' for c in transfers[0])}) "
                        "on conflict (source, source_ref) do nothing", transfers)


def phone_of(account_ref):
    bank, no = account_ref.split(":", 1)
    if not IFSC:
        with app_connect() as app:
            load_banks(app)
    PHONES[account_ref] = None
    try:
        BANKS[bank](no)
        return PHONES[account_ref]
    finally:
        PHONES.pop(account_ref, None)


def pull(account_ref, until=None):
    bank, no = account_ref.split(":", 1)
    with app_connect() as app:
        if not IFSC:
            load_banks(app)
        accounts, transfers = BANKS[bank](no, until or demo_clock(app))
        save(app, accounts, transfers)
    return len(transfers)
