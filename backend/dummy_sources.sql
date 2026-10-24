-- Dummy external sources for Peecha (PostgreSQL). Not the app database.
-- One table set per source. Banks are grouped into five layout families; inside a family each
-- bank still has its own table and column names, so every connector has real translating to do.
-- Connectors are expected to be one class per family plus a column-name config per bank.
--
-- A payment between two banks is recorded by both banks under the same UTR.
-- Connectors must collapse such pairs into one transfer.
--
-- Bank codes:
--   SBI       State Bank of India            family A   rupees, full IFSC
--   PNB       Punjab National Bank           family A   rupees; operative / dormant statuses
--   BOB       Bank of Baroda                 family A   rupees; remitter / beneficiary naming
--   CANARA    Canara Bank                    family A   rupees; short column names
--   UBI       Union Bank of India            family A   rupees; payer / payee naming
--   INDIAN    Indian Bank                    family A   rupees; blocked status
--   ICICI     ICICI Bank                     family B   paise, epoch seconds, text dates, income bands
--   AXIS      Axis Bank                      family B   paise, epoch MILLISECONDS
--   INDUSIND  IndusInd Bank                  family B   minor units, epoch seconds
--   YES       Yes Bank                       family B   paise, epoch seconds
--   RBL       RBL Bank                       family B   paise, epoch seconds
--   KOTAK     Kotak Mahindra Bank            family C   double-entry ledger, tz-aware times
--   IDFC      IDFC FIRST Bank                family C   ledger; DR / CR
--   FEDERAL   Federal Bank                   family C   ledger; IN / OUT
--   BANDHAN   Bandhan Bank                   family C   ledger; DEBIT / CREDIT
--   HDFC      HDFC Bank                      family D   date and time separate, UPI handles
--   AU        AU Small Finance Bank          family D   date and time separate
--   EQUITAS   Equitas Small Finance Bank     family D   date and time separate
--   SIB       South Indian Bank              family D   date and time separate
--   PAYTM     Paytm Payments Bank            family E   wallets, JSON metadata
--   IPPB      India Post Payments Bank       family E   wallets, JSON metadata
--   AIRTEL    Airtel Payments Bank           family E   wallets, JSON metadata
--   CRYPTO    wallets, transfers, exchanges, P2P seller registry


-- =========================================================
-- Family A: flat table, amounts in rupees
-- =========================================================

-- SBI: State Bank of India (rupees, full IFSC)
CREATE TABLE IF NOT EXISTS sbi_accounts (
    account_number  TEXT PRIMARY KEY,
    cif  TEXT NOT NULL,
    holder_name  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    monthly_income  NUMERIC(12,2),
    city  TEXT,
    opened_on  DATE NOT NULL,
    acct_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (acct_status IN ('ACTIVE','FROZEN','CLOSED')),
    vpa  TEXT UNIQUE,
    mobile  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS sbi_transactions (
    txn_id  TEXT PRIMARY KEY,
    utr  TEXT,
    from_account  TEXT NOT NULL,
    from_ifsc  TEXT,
    to_account  TEXT,
    to_ifsc  TEXT,
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    txn_time  TIMESTAMP NOT NULL,
    mode  TEXT NOT NULL CHECK (mode IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    result  TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (result IN ('SUCCESS','FAILED')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_sbi_txn_from ON sbi_transactions(from_account, txn_time);
CREATE INDEX IF NOT EXISTS idx_sbi_txn_to   ON sbi_transactions(to_account, txn_time);
CREATE INDEX IF NOT EXISTS idx_sbi_txn_utr  ON sbi_transactions(utr);

-- PNB: Punjab National Bank (rupees; operative / dormant statuses)
CREATE TABLE IF NOT EXISTS pnb_accounts (
    acct_no  TEXT PRIMARY KEY,
    customer_id  TEXT NOT NULL,
    account_holder  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    avg_monthly_income  NUMERIC(12,2),
    city  TEXT,
    open_date  DATE NOT NULL,
    acct_state  TEXT NOT NULL DEFAULT 'OPERATIVE' CHECK (acct_state IN ('OPERATIVE','DORMANT','FROZEN','CLOSED')),
    vpa  TEXT UNIQUE,
    registered_mobile  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS pnb_transactions (
    txn_ref  TEXT PRIMARY KEY,
    utr_no  TEXT,
    debit_account  TEXT NOT NULL,
    debit_ifsc  TEXT,
    credit_account  TEXT,
    credit_ifsc  TEXT,
    txn_amount  NUMERIC(14,2) NOT NULL CHECK (txn_amount > 0),
    txn_datetime  TIMESTAMP NOT NULL,
    channel  TEXT NOT NULL CHECK (channel IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    txn_status  TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (txn_status IN ('COMPLETED','FAILED')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_pnb_txn_from ON pnb_transactions(debit_account, txn_datetime);
CREATE INDEX IF NOT EXISTS idx_pnb_txn_to   ON pnb_transactions(credit_account, txn_datetime);
CREATE INDEX IF NOT EXISTS idx_pnb_txn_utr  ON pnb_transactions(utr_no);

-- BOB: Bank of Baroda (rupees; remitter / beneficiary naming)
CREATE TABLE IF NOT EXISTS bob_accounts (
    account_no  TEXT PRIMARY KEY,
    cust_ref  TEXT NOT NULL,
    customer_name  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    monthly_income  NUMERIC(12,2),
    city  TEXT,
    opened_on  DATE NOT NULL,
    account_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE','INOPERATIVE','FROZEN','CLOSED')),
    vpa  TEXT UNIQUE,
    mobile  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS bob_transactions (
    transaction_id  TEXT PRIMARY KEY,
    utr  TEXT,
    remitter_account  TEXT NOT NULL,
    remitter_ifsc  TEXT,
    beneficiary_account  TEXT,
    beneficiary_ifsc  TEXT,
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    executed_at  TIMESTAMP NOT NULL,
    payment_mode  TEXT NOT NULL CHECK (payment_mode IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    outcome  TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (outcome IN ('SUCCESS','FAILURE')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_bob_txn_from ON bob_transactions(remitter_account, executed_at);
CREATE INDEX IF NOT EXISTS idx_bob_txn_to   ON bob_transactions(beneficiary_account, executed_at);
CREATE INDEX IF NOT EXISTS idx_bob_txn_utr  ON bob_transactions(utr);

-- CANARA: Canara Bank (rupees; short column names)
CREATE TABLE IF NOT EXISTS canara_accounts (
    acno  TEXT PRIMARY KEY,
    cust_id  TEXT NOT NULL,
    cust_name  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    declared_monthly_income  NUMERIC(12,2),
    city  TEXT,
    account_open_date  DATE NOT NULL,
    state  TEXT NOT NULL DEFAULT 'LIVE' CHECK (state IN ('LIVE','DORMANT','FROZEN','CLOSED')),
    vpa  TEXT UNIQUE,
    mobile  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS canara_transactions (
    tran_id  TEXT PRIMARY KEY,
    bank_ref_no  TEXT,
    from_acno  TEXT NOT NULL,
    from_ifsc_code  TEXT,
    to_acno  TEXT,
    to_ifsc_code  TEXT,
    tran_amt  NUMERIC(14,2) NOT NULL CHECK (tran_amt > 0),
    tran_ts  TIMESTAMP NOT NULL,
    tran_mode  TEXT NOT NULL CHECK (tran_mode IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    tran_result  TEXT NOT NULL DEFAULT 'OK' CHECK (tran_result IN ('OK','FAIL')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_canara_txn_from ON canara_transactions(from_acno, tran_ts);
CREATE INDEX IF NOT EXISTS idx_canara_txn_to   ON canara_transactions(to_acno, tran_ts);
CREATE INDEX IF NOT EXISTS idx_canara_txn_utr  ON canara_transactions(bank_ref_no);

-- UBI: Union Bank of India (rupees; payer / payee naming)
CREATE TABLE IF NOT EXISTS ubi_accounts (
    ac_number  TEXT PRIMARY KEY,
    cif_id  TEXT NOT NULL,
    ac_holder_name  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    monthly_income  NUMERIC(12,2),
    city  TEXT,
    opening_date  DATE NOT NULL,
    ac_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (ac_status IN ('ACTIVE','FROZEN','CLOSED')),
    vpa  TEXT UNIQUE,
    mobile  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS ubi_transactions (
    txn_no  TEXT PRIMARY KEY,
    utr_ref  TEXT,
    payer_account  TEXT NOT NULL,
    payer_ifsc  TEXT,
    payee_account  TEXT,
    payee_ifsc  TEXT,
    txn_value  NUMERIC(14,2) NOT NULL CHECK (txn_value > 0),
    txn_timestamp  TIMESTAMP NOT NULL,
    txn_type  TEXT NOT NULL CHECK (txn_type IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    txn_result  TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (txn_result IN ('SUCCESS','FAILED')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_ubi_txn_from ON ubi_transactions(payer_account, txn_timestamp);
CREATE INDEX IF NOT EXISTS idx_ubi_txn_to   ON ubi_transactions(payee_account, txn_timestamp);
CREATE INDEX IF NOT EXISTS idx_ubi_txn_utr  ON ubi_transactions(utr_ref);

-- INDIAN: Indian Bank (rupees; blocked status)
CREATE TABLE IF NOT EXISTS indian_accounts (
    acct_id  TEXT PRIMARY KEY,
    customer_no  TEXT NOT NULL,
    holder  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    monthly_income  NUMERIC(12,2),
    city  TEXT,
    opened_on  DATE NOT NULL,
    acct_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (acct_status IN ('ACTIVE','BLOCKED','CLOSED')),
    vpa  TEXT UNIQUE,
    mobile  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS indian_transactions (
    reference_id  TEXT PRIMARY KEY,
    utr_number  TEXT,
    from_acct  TEXT NOT NULL,
    from_branch_ifsc  TEXT,
    to_acct  TEXT,
    to_branch_ifsc  TEXT,
    amt  NUMERIC(14,2) NOT NULL CHECK (amt > 0),
    posted_time  TIMESTAMP NOT NULL,
    mode  TEXT NOT NULL CHECK (mode IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    state  TEXT NOT NULL DEFAULT 'DONE' CHECK (state IN ('DONE','FAILED')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_indian_txn_from ON indian_transactions(from_acct, posted_time);
CREATE INDEX IF NOT EXISTS idx_indian_txn_to   ON indian_transactions(to_acct, posted_time);
CREATE INDEX IF NOT EXISTS idx_indian_txn_utr  ON indian_transactions(utr_number);


-- =========================================================
-- Family B: amounts in paise, epoch time, text dates
-- =========================================================

-- ICICI: ICICI Bank (paise, epoch seconds, text dates, income bands)
CREATE TABLE IF NOT EXISTS icici_accounts (
    acc_id  TEXT PRIMARY KEY,
    customer_ref  TEXT NOT NULL,
    full_name  TEXT NOT NULL,
    birth_date  TEXT,
    occupation_text  TEXT,
    income_band  TEXT CHECK (income_band IN ('LT_25K','25K_50K','50K_1L','GT_1L')),
    city_name  TEXT,
    open_dt  DATE NOT NULL,
    state_code  SMALLINT NOT NULL DEFAULT 1 CHECK (state_code IN (1,2,3)),
    upi_handle  TEXT UNIQUE,
    phone  TEXT,
    device_hash  TEXT
);

CREATE TABLE IF NOT EXISTS icici_transactions (
    txn_no  TEXT PRIMARY KEY,
    rrn  TEXT,
    src_acc  TEXT NOT NULL,
    src_bank_code  TEXT,
    dst_acc  TEXT,
    dst_bank_code  TEXT,
    amt_paise  BIGINT NOT NULL CHECK (amt_paise > 0),
    created_epoch  BIGINT NOT NULL,
    type_code  CHAR(1) NOT NULL CHECK (type_code IN ('U','I','N','R','A')),
    ok  BOOLEAN NOT NULL DEFAULT TRUE,
    device_hash  TEXT
);
CREATE INDEX IF NOT EXISTS idx_icici_txn_src ON icici_transactions(src_acc, created_epoch);
CREATE INDEX IF NOT EXISTS idx_icici_txn_dst ON icici_transactions(dst_acc, created_epoch);
CREATE INDEX IF NOT EXISTS idx_icici_txn_ref ON icici_transactions(rrn);

-- AXIS: Axis Bank (paise, epoch MILLISECONDS)
CREATE TABLE IF NOT EXISTS axis_accounts (
    account_ref  TEXT PRIMARY KEY,
    cust_no  TEXT NOT NULL,
    name_on_account  TEXT NOT NULL,
    dob_text  TEXT,
    occupation_text  TEXT,
    income_band  TEXT CHECK (income_band IN ('LT_25K','25K_50K','50K_1L','GT_1L')),
    city_name  TEXT,
    open_dt  DATE NOT NULL,
    acct_state  SMALLINT NOT NULL DEFAULT 1 CHECK (acct_state IN (1,2,3)),
    upi_handle  TEXT UNIQUE,
    phone  TEXT,
    device_hash  TEXT
);

CREATE TABLE IF NOT EXISTS axis_transactions (
    id  TEXT PRIMARY KEY,
    rrn_no  TEXT,
    payer_acc  TEXT NOT NULL,
    payer_bank  TEXT,
    payee_acc  TEXT,
    payee_bank  TEXT,
    amount_paise  BIGINT NOT NULL CHECK (amount_paise > 0),
    created_ms  BIGINT NOT NULL,
    txn_kind  CHAR(1) NOT NULL CHECK (txn_kind IN ('U','I','N','R','A')),
    is_success  BOOLEAN NOT NULL DEFAULT TRUE,
    device_hash  TEXT
);
CREATE INDEX IF NOT EXISTS idx_axis_txn_src ON axis_transactions(payer_acc, created_ms);
CREATE INDEX IF NOT EXISTS idx_axis_txn_dst ON axis_transactions(payee_acc, created_ms);
CREATE INDEX IF NOT EXISTS idx_axis_txn_ref ON axis_transactions(rrn_no);

-- INDUSIND: IndusInd Bank (minor units, epoch seconds)
CREATE TABLE IF NOT EXISTS indusind_accounts (
    acct  TEXT PRIMARY KEY,
    cust_code  TEXT NOT NULL,
    customer  TEXT NOT NULL,
    birth  TEXT,
    occupation_text  TEXT,
    income_band  TEXT CHECK (income_band IN ('LT_25K','25K_50K','50K_1L','GT_1L')),
    town  TEXT,
    opened_on  DATE NOT NULL,
    state_code  SMALLINT NOT NULL DEFAULT 1 CHECK (state_code IN (1,2,3)),
    upi_handle  TEXT UNIQUE,
    phone  TEXT,
    device_hash  TEXT
);

CREATE TABLE IF NOT EXISTS indusind_transactions (
    txn_key  TEXT PRIMARY KEY,
    utr_rrn  TEXT,
    from_acct  TEXT NOT NULL,
    from_bank  TEXT,
    to_acct  TEXT,
    to_bank  TEXT,
    amt_minor  BIGINT NOT NULL CHECK (amt_minor > 0),
    epoch_sec  BIGINT NOT NULL,
    kind  CHAR(1) NOT NULL CHECK (kind IN ('U','I','N','R','A')),
    success  BOOLEAN NOT NULL DEFAULT TRUE,
    device_hash  TEXT
);
CREATE INDEX IF NOT EXISTS idx_indusind_txn_src ON indusind_transactions(from_acct, epoch_sec);
CREATE INDEX IF NOT EXISTS idx_indusind_txn_dst ON indusind_transactions(to_acct, epoch_sec);
CREATE INDEX IF NOT EXISTS idx_indusind_txn_ref ON indusind_transactions(utr_rrn);

-- YES: Yes Bank (paise, epoch seconds)
CREATE TABLE IF NOT EXISTS yes_accounts (
    yb_account  TEXT PRIMARY KEY,
    yb_customer  TEXT NOT NULL,
    account_name  TEXT NOT NULL,
    date_of_birth  TEXT,
    occupation_text  TEXT,
    income_band  TEXT CHECK (income_band IN ('LT_25K','25K_50K','50K_1L','GT_1L')),
    city_name  TEXT,
    created_on  DATE NOT NULL,
    state_code  SMALLINT NOT NULL DEFAULT 1 CHECK (state_code IN (1,2,3)),
    upi_handle  TEXT UNIQUE,
    phone  TEXT,
    device_hash  TEXT
);

CREATE TABLE IF NOT EXISTS yes_transactions (
    yb_txn_id  TEXT PRIMARY KEY,
    rrn  TEXT,
    debit_acc  TEXT NOT NULL,
    debit_bank  TEXT,
    credit_acc  TEXT,
    credit_bank  TEXT,
    paise  BIGINT NOT NULL CHECK (paise > 0),
    txn_epoch  BIGINT NOT NULL,
    mode_code  CHAR(1) NOT NULL CHECK (mode_code IN ('U','I','N','R','A')),
    completed  BOOLEAN NOT NULL DEFAULT TRUE,
    device_hash  TEXT
);
CREATE INDEX IF NOT EXISTS idx_yes_txn_src ON yes_transactions(debit_acc, txn_epoch);
CREATE INDEX IF NOT EXISTS idx_yes_txn_dst ON yes_transactions(credit_acc, txn_epoch);
CREATE INDEX IF NOT EXISTS idx_yes_txn_ref ON yes_transactions(rrn);

-- RBL: RBL Bank (paise, epoch seconds)
CREATE TABLE IF NOT EXISTS rbl_accounts (
    acct_number  TEXT PRIMARY KEY,
    client_id  TEXT NOT NULL,
    client_name  TEXT NOT NULL,
    birth_date  TEXT,
    occupation_text  TEXT,
    income_band  TEXT CHECK (income_band IN ('LT_25K','25K_50K','50K_1L','GT_1L')),
    city_name  TEXT,
    open_dt  DATE NOT NULL,
    acct_flag  SMALLINT NOT NULL DEFAULT 1 CHECK (acct_flag IN (1,2,3)),
    upi_handle  TEXT UNIQUE,
    phone  TEXT,
    device_hash  TEXT
);

CREATE TABLE IF NOT EXISTS rbl_transactions (
    trn_id  TEXT PRIMARY KEY,
    rrn_ref  TEXT,
    origin_acc  TEXT NOT NULL,
    origin_bank  TEXT,
    dest_acc  TEXT,
    dest_bank  TEXT,
    value_paise  BIGINT NOT NULL CHECK (value_paise > 0),
    trn_epoch  BIGINT NOT NULL,
    trn_mode  CHAR(1) NOT NULL CHECK (trn_mode IN ('U','I','N','R','A')),
    trn_ok  BOOLEAN NOT NULL DEFAULT TRUE,
    device_hash  TEXT
);
CREATE INDEX IF NOT EXISTS idx_rbl_txn_src ON rbl_transactions(origin_acc, trn_epoch);
CREATE INDEX IF NOT EXISTS idx_rbl_txn_dst ON rbl_transactions(dest_acc, trn_epoch);
CREATE INDEX IF NOT EXISTS idx_rbl_txn_ref ON rbl_transactions(rrn_ref);


-- =========================================================
-- Family C: customers + accounts + double-entry ledger
-- =========================================================

-- KOTAK: Kotak Mahindra Bank (double-entry ledger, tz-aware times)
CREATE TABLE IF NOT EXISTS kotak_customers (
    customer_id  TEXT PRIMARY KEY,
    full_name  TEXT NOT NULL,
    date_of_birth  DATE,
    profession  TEXT,
    annual_income  NUMERIC(14,2),
    city  TEXT,
    mobile  TEXT
);

CREATE TABLE IF NOT EXISTS kotak_accounts (
    account_no  TEXT PRIMARY KEY,
    customer_id  TEXT NOT NULL REFERENCES kotak_customers(customer_id),
    opened_on  DATE NOT NULL,
    account_state  TEXT NOT NULL DEFAULT 'OPEN' CHECK (account_state IN ('OPEN','DEBIT_BLOCK','CLOSED')),
    upi_id  TEXT UNIQUE,
    linked_device  TEXT
);

CREATE TABLE IF NOT EXISTS kotak_ledger (
    entry_id  BIGSERIAL PRIMARY KEY,
    txn_ref  TEXT NOT NULL,
    utr  TEXT,
    account_no  TEXT NOT NULL REFERENCES kotak_accounts(account_no),
    direction  CHAR(1) NOT NULL CHECK (direction IN ('D','C')),
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    posted_at  TIMESTAMPTZ NOT NULL,
    channel  TEXT NOT NULL CHECK (channel IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    counterparty_account  TEXT,
    counterparty_ifsc  TEXT,
    entry_status  TEXT NOT NULL DEFAULT 'POSTED' CHECK (entry_status IN ('POSTED','FAILED')),
    linked_device  TEXT
);
CREATE INDEX IF NOT EXISTS idx_kotak_ledger_acct ON kotak_ledger(account_no, posted_at);
CREATE INDEX IF NOT EXISTS idx_kotak_ledger_utr  ON kotak_ledger(utr);

-- IDFC: IDFC FIRST Bank (ledger; DR / CR)
CREATE TABLE IF NOT EXISTS idfc_customers (
    cust_id  TEXT PRIMARY KEY,
    cust_name  TEXT NOT NULL,
    date_of_birth  DATE,
    profession  TEXT,
    annual_income  NUMERIC(14,2),
    city  TEXT,
    mobile  TEXT
);

CREATE TABLE IF NOT EXISTS idfc_accounts (
    acct_no  TEXT PRIMARY KEY,
    cust_id  TEXT NOT NULL REFERENCES idfc_customers(cust_id),
    opened_on  DATE NOT NULL,
    acct_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (acct_status IN ('ACTIVE','LIEN','CLOSED')),
    upi_id  TEXT UNIQUE,
    linked_device  TEXT
);

CREATE TABLE IF NOT EXISTS idfc_ledger (
    entry_id  BIGSERIAL PRIMARY KEY,
    trn_ref  TEXT NOT NULL,
    utr  TEXT,
    acct_no  TEXT NOT NULL REFERENCES idfc_accounts(acct_no),
    dr_cr  CHAR(2) NOT NULL CHECK (dr_cr IN ('DR','CR')),
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    booked_at  TIMESTAMPTZ NOT NULL,
    rail  TEXT NOT NULL CHECK (rail IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    other_acct  TEXT,
    other_ifsc  TEXT,
    entry_status  TEXT NOT NULL DEFAULT 'POSTED' CHECK (entry_status IN ('POSTED','FAILED')),
    linked_device  TEXT
);
CREATE INDEX IF NOT EXISTS idx_idfc_ledger_acct ON idfc_ledger(acct_no, booked_at);
CREATE INDEX IF NOT EXISTS idx_idfc_ledger_utr  ON idfc_ledger(utr);

-- FEDERAL: Federal Bank (ledger; IN / OUT)
CREATE TABLE IF NOT EXISTS federal_customers (
    customer_no  TEXT PRIMARY KEY,
    name  TEXT NOT NULL,
    date_of_birth  DATE,
    profession  TEXT,
    annual_income  NUMERIC(14,2),
    city  TEXT,
    mobile  TEXT
);

CREATE TABLE IF NOT EXISTS federal_accounts (
    ac_no  TEXT PRIMARY KEY,
    customer_no  TEXT NOT NULL REFERENCES federal_customers(customer_no),
    opened_on  DATE NOT NULL,
    ac_state  TEXT NOT NULL DEFAULT 'OPEN' CHECK (ac_state IN ('OPEN','HOLD','CLOSED')),
    upi_id  TEXT UNIQUE,
    linked_device  TEXT
);

CREATE TABLE IF NOT EXISTS federal_ledger (
    entry_id  BIGSERIAL PRIMARY KEY,
    reference  TEXT NOT NULL,
    utr  TEXT,
    ac_no  TEXT NOT NULL REFERENCES federal_accounts(ac_no),
    flow  CHAR(2) NOT NULL CHECK (flow IN ('IN','OUT')),
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    value_ts  TIMESTAMPTZ NOT NULL,
    medium  TEXT NOT NULL CHECK (medium IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    counter_ac  TEXT,
    counter_ifsc  TEXT,
    posting_state  TEXT NOT NULL DEFAULT 'POSTED' CHECK (posting_state IN ('POSTED','FAILED')),
    linked_device  TEXT
);
CREATE INDEX IF NOT EXISTS idx_federal_ledger_acct ON federal_ledger(ac_no, value_ts);
CREATE INDEX IF NOT EXISTS idx_federal_ledger_utr  ON federal_ledger(utr);

-- BANDHAN: Bandhan Bank (ledger; DEBIT / CREDIT)
CREATE TABLE IF NOT EXISTS bandhan_customers (
    client_no  TEXT PRIMARY KEY,
    client_name  TEXT NOT NULL,
    date_of_birth  DATE,
    profession  TEXT,
    annual_income  NUMERIC(14,2),
    city  TEXT,
    mobile  TEXT
);

CREATE TABLE IF NOT EXISTS bandhan_accounts (
    account_id  TEXT PRIMARY KEY,
    client_no  TEXT NOT NULL REFERENCES bandhan_customers(client_no),
    opened_on  DATE NOT NULL,
    status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED','CLOSED')),
    upi_id  TEXT UNIQUE,
    linked_device  TEXT
);

CREATE TABLE IF NOT EXISTS bandhan_ledger (
    entry_id  BIGSERIAL PRIMARY KEY,
    tran_ref  TEXT NOT NULL,
    utr  TEXT,
    account_id  TEXT NOT NULL REFERENCES bandhan_accounts(account_id),
    side  CHAR(5) NOT NULL CHECK (side IN ('DEBIT','CREDIT')),
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    entry_time  TIMESTAMPTZ NOT NULL,
    channel_code  TEXT NOT NULL CHECK (channel_code IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    peer_account  TEXT,
    peer_ifsc  TEXT,
    result  TEXT NOT NULL DEFAULT 'POSTED' CHECK (result IN ('POSTED','REJECTED')),
    linked_device  TEXT
);
CREATE INDEX IF NOT EXISTS idx_bandhan_ledger_acct ON bandhan_ledger(account_id, entry_time);
CREATE INDEX IF NOT EXISTS idx_bandhan_ledger_utr  ON bandhan_ledger(utr);


-- =========================================================
-- Family D: date and time in separate columns, UPI handles
-- =========================================================

-- HDFC: HDFC Bank (date and time separate, UPI handles)
CREATE TABLE IF NOT EXISTS hdfc_accounts (
    acct_no  TEXT PRIMARY KEY,
    customer_name  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    annual_income  NUMERIC(14,2),
    city  TEXT,
    opened  DATE NOT NULL,
    status  TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Blocked','Closed')),
    vpa  TEXT UNIQUE,
    phone  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS hdfc_transactions (
    ref_no  TEXT PRIMARY KEY,
    utr  TEXT,
    sender_acct  TEXT NOT NULL,
    sender_vpa  TEXT,
    receiver_acct  TEXT,
    receiver_vpa  TEXT,
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    txn_date  DATE NOT NULL,
    txn_time  TIME NOT NULL,
    mode  TEXT NOT NULL CHECK (mode IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    status  CHAR(1) NOT NULL DEFAULT 'S' CHECK (status IN ('S','F')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_hdfc_txn_sender   ON hdfc_transactions(sender_acct, txn_date);
CREATE INDEX IF NOT EXISTS idx_hdfc_txn_receiver ON hdfc_transactions(receiver_acct, txn_date);
CREATE INDEX IF NOT EXISTS idx_hdfc_txn_utr      ON hdfc_transactions(utr);

-- AU: AU Small Finance Bank (date and time separate)
CREATE TABLE IF NOT EXISTS au_accounts (
    account_number  TEXT PRIMARY KEY,
    holder_name  TEXT NOT NULL,
    dob  DATE,
    profession  TEXT,
    yearly_income  NUMERIC(14,2),
    city  TEXT,
    open_date  DATE NOT NULL,
    acct_status  TEXT NOT NULL DEFAULT 'Active' CHECK (acct_status IN ('Active','Blocked','Closed')),
    vpa  TEXT UNIQUE,
    mobile_no  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS au_transactions (
    txn_ref  TEXT PRIMARY KEY,
    utr  TEXT,
    from_account  TEXT NOT NULL,
    from_vpa  TEXT,
    to_account  TEXT,
    to_vpa  TEXT,
    amount  NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    date  DATE NOT NULL,
    time  TIME NOT NULL,
    channel  TEXT NOT NULL CHECK (channel IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    outcome  CHAR(1) NOT NULL DEFAULT 'S' CHECK (outcome IN ('S','F')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_au_txn_sender   ON au_transactions(from_account, date);
CREATE INDEX IF NOT EXISTS idx_au_txn_receiver ON au_transactions(to_account, date);
CREATE INDEX IF NOT EXISTS idx_au_txn_utr      ON au_transactions(utr);

-- EQUITAS: Equitas Small Finance Bank (date and time separate)
CREATE TABLE IF NOT EXISTS equitas_accounts (
    acc_no  TEXT PRIMARY KEY,
    cust_name  TEXT NOT NULL,
    dob  DATE,
    occupation  TEXT,
    income_pa  NUMERIC(14,2),
    city  TEXT,
    opened_date  DATE NOT NULL,
    acc_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (acc_status IN ('ACTIVE','BLOCKED','CLOSED')),
    vpa  TEXT UNIQUE,
    phone  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS equitas_transactions (
    txn_id  TEXT PRIMARY KEY,
    utr_code  TEXT,
    payer_acc  TEXT NOT NULL,
    payer_vpa  TEXT,
    payee_acc  TEXT,
    payee_vpa  TEXT,
    txn_amt  NUMERIC(14,2) NOT NULL CHECK (txn_amt > 0),
    txn_dt  DATE NOT NULL,
    txn_tm  TIME NOT NULL,
    txn_mode  TEXT NOT NULL CHECK (txn_mode IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    txn_flag  CHAR(1) NOT NULL DEFAULT 'S' CHECK (txn_flag IN ('S','F')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_equitas_txn_sender   ON equitas_transactions(payer_acc, txn_dt);
CREATE INDEX IF NOT EXISTS idx_equitas_txn_receiver ON equitas_transactions(payee_acc, txn_dt);
CREATE INDEX IF NOT EXISTS idx_equitas_txn_utr      ON equitas_transactions(utr_code);

-- SIB: South Indian Bank (date and time separate)
CREATE TABLE IF NOT EXISTS sib_accounts (
    acno  TEXT PRIMARY KEY,
    holder_name  TEXT NOT NULL,
    dob  DATE,
    job  TEXT,
    annual_income_inr  NUMERIC(14,2),
    home_city  TEXT,
    since  DATE NOT NULL,
    state  TEXT NOT NULL DEFAULT 'Live' CHECK (state IN ('Live','Blocked','Closed')),
    vpa  TEXT UNIQUE,
    contact  TEXT,
    device_id  TEXT
);

CREATE TABLE IF NOT EXISTS sib_transactions (
    tx_ref  TEXT PRIMARY KEY,
    utr  TEXT,
    debit_acno  TEXT NOT NULL,
    debit_vpa  TEXT,
    credit_acno  TEXT,
    credit_vpa  TEXT,
    inr  NUMERIC(14,2) NOT NULL CHECK (inr > 0),
    tx_date  DATE NOT NULL,
    tx_time  TIME NOT NULL,
    via  TEXT NOT NULL CHECK (via IN ('UPI','IMPS','NEFT','RTGS','ATM')),
    tx_state  CHAR(1) NOT NULL DEFAULT 'S' CHECK (tx_state IN ('S','F')),
    device_id  TEXT
);
CREATE INDEX IF NOT EXISTS idx_sib_txn_sender   ON sib_transactions(debit_acno, tx_date);
CREATE INDEX IF NOT EXISTS idx_sib_txn_receiver ON sib_transactions(credit_acno, tx_date);
CREATE INDEX IF NOT EXISTS idx_sib_txn_utr      ON sib_transactions(utr);


-- =========================================================
-- Family E: payments banks, wallets with JSON metadata
-- =========================================================

-- PAYTM: Paytm Payments Bank (wallets, JSON metadata)
CREATE TABLE IF NOT EXISTS paytm_wallets (
    wallet_id            TEXT PRIMARY KEY,
    holder_name          TEXT NOT NULL,
    dob                  DATE,
    occupation           TEXT,
    city                 TEXT,
    kyc_level            TEXT NOT NULL CHECK (kyc_level IN ('MIN','FULL')),
    monthly_limit        NUMERIC(12,2),
    opened_on            DATE NOT NULL,
    wallet_status        TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (wallet_status IN ('ACTIVE','SUSPENDED','CLOSED')),
    vpa                  TEXT UNIQUE,
    mobile               TEXT,
    linked_bank_account  TEXT
);

CREATE TABLE IF NOT EXISTS paytm_payments (
    payment_id    TEXT PRIMARY KEY,
    utr           TEXT,
    payer_id      TEXT NOT NULL,
    payee_id      TEXT,
    amount        NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    created_at    TIMESTAMPTZ NOT NULL,
    payment_type  TEXT NOT NULL CHECK (payment_type IN ('P2P','MERCHANT','TOPUP','WITHDRAWAL','ATM')),
    state         TEXT NOT NULL DEFAULT 'OK' CHECK (state IN ('OK','FAIL')),
    meta          JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_paytm_pay_payer ON paytm_payments(payer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_paytm_pay_payee ON paytm_payments(payee_id, created_at);
CREATE INDEX IF NOT EXISTS idx_paytm_pay_utr   ON paytm_payments(utr);

-- IPPB: India Post Payments Bank (wallets, JSON metadata)
CREATE TABLE IF NOT EXISTS ippb_wallets (
    wallet_id            TEXT PRIMARY KEY,
    holder_name          TEXT NOT NULL,
    dob                  DATE,
    occupation           TEXT,
    city                 TEXT,
    kyc_level            TEXT NOT NULL CHECK (kyc_level IN ('MIN','FULL')),
    monthly_limit        NUMERIC(12,2),
    opened_on            DATE NOT NULL,
    wallet_status        TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (wallet_status IN ('ACTIVE','SUSPENDED','CLOSED')),
    vpa                  TEXT UNIQUE,
    mobile               TEXT,
    linked_bank_account  TEXT
);

CREATE TABLE IF NOT EXISTS ippb_payments (
    payment_id    TEXT PRIMARY KEY,
    utr           TEXT,
    payer_id      TEXT NOT NULL,
    payee_id      TEXT,
    amount        NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    created_at    TIMESTAMPTZ NOT NULL,
    payment_type  TEXT NOT NULL CHECK (payment_type IN ('P2P','MERCHANT','TOPUP','WITHDRAWAL','ATM')),
    state         TEXT NOT NULL DEFAULT 'OK' CHECK (state IN ('OK','FAIL')),
    meta          JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_ippb_pay_payer ON ippb_payments(payer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ippb_pay_payee ON ippb_payments(payee_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ippb_pay_utr   ON ippb_payments(utr);

-- AIRTEL: Airtel Payments Bank (wallets, JSON metadata)
CREATE TABLE IF NOT EXISTS airtel_wallets (
    wallet_id            TEXT PRIMARY KEY,
    holder_name          TEXT NOT NULL,
    dob                  DATE,
    occupation           TEXT,
    city                 TEXT,
    kyc_level            TEXT NOT NULL CHECK (kyc_level IN ('MIN','FULL')),
    monthly_limit        NUMERIC(12,2),
    opened_on            DATE NOT NULL,
    wallet_status        TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (wallet_status IN ('ACTIVE','SUSPENDED','CLOSED')),
    vpa                  TEXT UNIQUE,
    mobile               TEXT,
    linked_bank_account  TEXT
);

CREATE TABLE IF NOT EXISTS airtel_payments (
    payment_id    TEXT PRIMARY KEY,
    utr           TEXT,
    payer_id      TEXT NOT NULL,
    payee_id      TEXT,
    amount        NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    created_at    TIMESTAMPTZ NOT NULL,
    payment_type  TEXT NOT NULL CHECK (payment_type IN ('P2P','MERCHANT','TOPUP','WITHDRAWAL','ATM')),
    state         TEXT NOT NULL DEFAULT 'OK' CHECK (state IN ('OK','FAIL')),
    meta          JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_airtel_pay_payer ON airtel_payments(payer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_airtel_pay_payee ON airtel_payments(payee_id, created_at);
CREATE INDEX IF NOT EXISTS idx_airtel_pay_utr   ON airtel_payments(utr);


-- =========================================================
-- CRYPTO
-- =========================================================

CREATE TABLE IF NOT EXISTS crypto_exchanges (
    exchange_id        TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    compliance_email   TEXT,
    jurisdiction       TEXT,
    responds_to_india  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS crypto_wallets (
    address       TEXT PRIMARY KEY,
    chain         TEXT NOT NULL DEFAULT 'TRON',
    kind          TEXT NOT NULL CHECK (kind IN
                  ('private','p2p_seller','exchange_deposit','exchange_hot','bridge','mixer')),
    exchange_id   TEXT REFERENCES crypto_exchanges(exchange_id),
    label         TEXT,
    label_source  TEXT,
    first_seen    TIMESTAMP,
    CHECK (chain <> 'TRON' OR address ~ '^T[1-9A-HJ-NP-Za-km-z]{33}$'),
    CHECK ((kind IN ('exchange_deposit','exchange_hot')) = (exchange_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS crypto_transfers (
    tx_hash       TEXT PRIMARY KEY,
    chain         TEXT NOT NULL DEFAULT 'TRON',
    asset         TEXT NOT NULL DEFAULT 'USDT',
    from_address  TEXT NOT NULL REFERENCES crypto_wallets(address),
    to_address    TEXT NOT NULL REFERENCES crypto_wallets(address),
    amount        NUMERIC(18,6) NOT NULL CHECK (amount > 0),
    block_time    TIMESTAMP NOT NULL,
    CHECK (from_address <> to_address)
);
CREATE INDEX IF NOT EXISTS idx_crypto_tx_from ON crypto_transfers(from_address, block_time);
CREATE INDEX IF NOT EXISTS idx_crypto_tx_to   ON crypto_transfers(to_address, block_time);

-- P2P platform registry: links a seller's wallet to the bank account that takes the rupees.
-- bank_code is any bank code from the list at the top of this file.
CREATE TABLE IF NOT EXISTS crypto_p2p_sellers (
    seller_wallet    TEXT PRIMARY KEY REFERENCES crypto_wallets(address),
    platform         TEXT NOT NULL,
    bank_code        TEXT NOT NULL,
    bank_account_no  TEXT NOT NULL,
    upi_vpa          TEXT
);