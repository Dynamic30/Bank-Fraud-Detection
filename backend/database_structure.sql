-- Peecha app database (PostgreSQL). All timestamps are UTC.
--
-- Layers
--   Reference      banks, app_users
--   Plain facts    accounts, transfers          (filled by bank / crypto connectors)
--   Cases          complaints, complaint_payments
--   Mapping        victim_mapping, account_scores, mule_accounts
--   Actions        holds, actions, prevention_calls
--   System         audit_log, settings


-- ---------------------------------------------------------
-- Reference
-- ---------------------------------------------------------

-- Banks Peecha can connect to; `connector` names the adapter for that bank.
CREATE TABLE IF NOT EXISTS banks (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    ifsc_prefix  TEXT UNIQUE,
    upi_handle   TEXT UNIQUE,
    connector    TEXT NOT NULL
);

-- Officers, bank staff and consumers.
CREATE TABLE IF NOT EXISTS app_users (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    role          TEXT NOT NULL CHECK (role IN ('officer','bank_analyst','bank_admin','consumer')),
    bank_id       TEXT REFERENCES banks(id),
    access_level  TEXT NOT NULL DEFAULT 'view' CHECK (access_level IN ('view','hold','admin')),
    status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
    created_at    TIMESTAMP NOT NULL DEFAULT now(),
    CHECK (role NOT IN ('bank_analyst','bank_admin') OR bank_id IS NOT NULL)
);


-- ---------------------------------------------------------
-- Plain facts: no mule, victim or scam meaning lives here
-- ---------------------------------------------------------

-- Every bank account or wallet Peecha has seen.
-- fetched_at IS NULL means a stub: seen as a counterparty, profile not pulled yet.
CREATE TABLE IF NOT EXISTS accounts (
    account_id         TEXT PRIMARY KEY,
    kind               TEXT NOT NULL CHECK (kind IN ('bank','wallet')),
    bank_id            TEXT REFERENCES banks(id),
    wallet_kind        TEXT CHECK (wallet_kind IN
                       ('private','p2p_seller','exchange_deposit','exchange_hot','bridge','mixer')),
    exchange_name      TEXT,

    holder_name        TEXT,
    dob                DATE,
    occupation         TEXT,
    declared_income    NUMERIC(12,2),
    city               TEXT,
    opened_on          DATE,
    device_id          TEXT,
    upi_id             TEXT,
    account_no_masked  TEXT,
    phone_masked       TEXT,
    p2p_wallet         TEXT,
    label              TEXT,

    source             TEXT,
    fetched_at         TIMESTAMP,
    txns_synced_until  TIMESTAMP,

    CHECK ((kind = 'bank'   AND bank_id IS NOT NULL AND wallet_kind IS NULL)
        OR (kind = 'wallet' AND bank_id IS NULL))
);
CREATE INDEX IF NOT EXISTS idx_accounts_bank   ON accounts(bank_id);
CREATE INDEX IF NOT EXISTS idx_accounts_device ON accounts(device_id);
CREATE INDEX IF NOT EXISTS idx_accounts_upi    ON accounts(upi_id);
CREATE INDEX IF NOT EXISTS idx_accounts_stub   ON accounts(account_id) WHERE fetched_at IS NULL;

-- Every movement of money pulled from a bank or chain. Never tied to a victim.
-- to_id is NULL for an ATM cash withdrawal.
CREATE TABLE IF NOT EXISTS transfers (
    transfer_id  BIGSERIAL PRIMARY KEY,
    source       TEXT NOT NULL,
    source_ref   TEXT NOT NULL,
    from_id      TEXT NOT NULL REFERENCES accounts(account_id),
    to_id        TEXT REFERENCES accounts(account_id),
    amount       NUMERIC(18,6) NOT NULL CHECK (amount > 0),
    asset        TEXT NOT NULL DEFAULT 'INR',
    ts           TIMESTAMP NOT NULL,
    rail         TEXT CHECK (rail IN ('UPI','IMPS','NEFT','RTGS','ATM','CHAIN')),
    status       TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('done','failed')),
    utr          TEXT,
    device_id    TEXT,
    ingested_at  TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (source, source_ref),
    CHECK ((COALESCE(rail,'') = 'ATM') = (to_id IS NULL))
);
CREATE INDEX IF NOT EXISTS idx_transfers_from ON transfers(from_id, ts);
CREATE INDEX IF NOT EXISTS idx_transfers_to   ON transfers(to_id, ts);
CREATE INDEX IF NOT EXISTS idx_transfers_utr  ON transfers(utr);


-- ---------------------------------------------------------
-- Cases
-- ---------------------------------------------------------

-- One row per complaint; indexed by the victim's account.
CREATE TABLE IF NOT EXISTS complaints (
    id                    TEXT PRIMARY KEY,
    ack_no                TEXT,
    channel               TEXT NOT NULL DEFAULT 'ncrp_portal'
                          CHECK (channel IN ('helpline_1930','ncrp_portal','bank','walk_in','feed')),

    name                  TEXT NOT NULL,
    email_1               TEXT,
    email_2               TEXT,
    phone_1               TEXT,
    phone_2               TEXT,
    city                  TEXT,
    victim_account_id     TEXT,
    victim_upi_id         TEXT,

    scam_type             TEXT NOT NULL,
    incident_description  TEXT,
    total_lost            NUMERIC(14,2) NOT NULL,
    fraud_time            TIMESTAMP NOT NULL,
    reported_at           TIMESTAMP NOT NULL,

    scammer_phone         TEXT,
    scammer_upi_id        TEXT,
    scammer_account_no    TEXT,

    filed_by              TEXT REFERENCES app_users(id),
    owner_user_id         TEXT REFERENCES app_users(id),
    filed_via             TEXT NOT NULL DEFAULT 'self'
                          CHECK (filed_via IN ('self','bank','officer','feed')),

    status                TEXT NOT NULL DEFAULT 'open'
                          CHECK (status IN ('open','tracing','actioned','closed')),
    last_traced_at        TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status, reported_at);
CREATE INDEX IF NOT EXISTS idx_complaints_owner  ON complaints(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_victim ON complaints(victim_account_id);

-- What the victim reported paying, as filed. Seeds the trace; matched_transfer_id
-- points to the real transfer once it is found.
CREATE TABLE IF NOT EXISTS complaint_payments (
    id                    SERIAL PRIMARY KEY,
    complaint_id          TEXT NOT NULL REFERENCES complaints(id),
    amount                NUMERIC(14,2) NOT NULL,
    paid_at               TIMESTAMP,
    destination_type      TEXT NOT NULL DEFAULT 'bank' CHECK (destination_type IN ('bank','crypto')),

    utr                   TEXT,
    paid_to_upi_id        TEXT,
    paid_to_account_no    TEXT,
    paid_to_account_id    TEXT,

    crypto_chain          TEXT,
    crypto_asset          TEXT,
    wallet_address        TEXT,
    exchange_name         TEXT,
    crypto_tx_hash        TEXT,

    matched               BOOLEAN NOT NULL DEFAULT FALSE,
    matched_transfer_id   BIGINT REFERENCES transfers(transfer_id),

    CHECK (destination_type = 'bank' OR wallet_address IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_cp_complaint ON complaint_payments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_cp_utr       ON complaint_payments(utr);


-- ---------------------------------------------------------
-- Mapping: what the plain facts mean for each case
-- ---------------------------------------------------------

-- The money trail. One row per (complaint, method, transfer); the same transfer
-- can appear under several complaints with different traced amounts.
-- from_ref / to_ref are trail nodes; to_ref is 'CASH' for an ATM withdrawal.
CREATE TABLE IF NOT EXISTS victim_mapping (
    id             BIGSERIAL PRIMARY KEY,
    complaint_id   TEXT NOT NULL REFERENCES complaints(id),
    transfer_id    BIGINT NOT NULL REFERENCES transfers(transfer_id),
    method         TEXT NOT NULL DEFAULT 'fifo' CHECK (method IN ('fifo','lifo','prorata')),
    hop            INT NOT NULL,
    leg            TEXT NOT NULL CHECK (leg IN ('bank','crypto')),
    from_ref       TEXT NOT NULL,
    to_ref         TEXT NOT NULL,
    from_bank      TEXT REFERENCES banks(id),
    to_bank        TEXT REFERENCES banks(id),
    traced_amount  NUMERIC(14,2) NOT NULL,
    asset          TEXT,
    asset_amount   NUMERIC(18,6),
    status         TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('done','blocked')),
    traced_at      TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (complaint_id, method, transfer_id)
);
CREATE INDEX IF NOT EXISTS idx_vmap_complaint ON victim_mapping(complaint_id, hop);
CREATE INDEX IF NOT EXISTS idx_vmap_transfer  ON victim_mapping(transfer_id);
CREATE INDEX IF NOT EXISTS idx_vmap_to_ref    ON victim_mapping(to_ref);
CREATE INDEX IF NOT EXISTS idx_vmap_from_bank ON victim_mapping(from_bank);
CREATE INDEX IF NOT EXISTS idx_vmap_to_bank   ON victim_mapping(to_bank);

-- Latest mule-risk score per account, with the reasons and the model that produced it.
CREATE TABLE IF NOT EXISTS account_scores (
    account_id     TEXT PRIMARY KEY REFERENCES accounts(account_id),
    score          NUMERIC(5,2) NOT NULL,
    reasons        JSONB NOT NULL DEFAULT '[]',
    model_version  TEXT NOT NULL DEFAULT 'v1',
    computed_at    TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_scores_score ON account_scores(score DESC);

-- Curated list of known and suspected mule accounts. No foreign key to accounts,
-- because a known-mule list can arrive before the account has been pulled.
CREATE TABLE IF NOT EXISTS mule_accounts (
    account_id        TEXT PRIMARY KEY,
    bank_id           TEXT NOT NULL REFERENCES banks(id),
    upi_id            TEXT,
    is_student        BOOLEAN,
    age_at_flag       INT,
    source            TEXT NOT NULL CHECK (source IN ('complaint','model','bank_report')),
    status            TEXT NOT NULL DEFAULT 'suspected'
                      CHECK (status IN ('suspected','confirmed','cleared')),
    confidence        NUMERIC(4,3),
    first_flagged_at  TIMESTAMP NOT NULL DEFAULT now(),
    last_seen_at      TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mule_bank ON mule_accounts(bank_id, status);

-- Cases each account appeared in; an account with many rows is a repeat offender.
CREATE OR REPLACE VIEW account_cases AS
SELECT to_ref               AS account_id,
       complaint_id,
       MIN(hop)             AS first_hop,
       SUM(traced_amount)   AS received
FROM victim_mapping
WHERE status = 'done' AND method = 'fifo' AND to_ref <> 'CASH'
GROUP BY to_ref, complaint_id;


-- ---------------------------------------------------------
-- Actions
-- ---------------------------------------------------------

-- Debit holds on accounts. Temporary holds expire; an officer confirms or rejects them.
-- At most one open hold per account.
CREATE TABLE IF NOT EXISTS holds (
    id             BIGSERIAL PRIMARY KEY,
    account_id     TEXT NOT NULL,
    bank_id        TEXT NOT NULL REFERENCES banks(id),
    complaint_id   TEXT REFERENCES complaints(id),
    origin         TEXT NOT NULL CHECK (origin IN ('bank','officer')),
    basis          TEXT NOT NULL CHECK (basis IN ('consumer_complaint','officer_decision','ai_draft','bank')),
    status         TEXT NOT NULL DEFAULT 'requested'
                   CHECK (status IN ('requested','active','confirmed','expired','rejected','released')),
    reason         TEXT NOT NULL,
    score_at_time  NUMERIC(5,2),
    amount         NUMERIC(14,2),
    placed_by      TEXT REFERENCES app_users(id),
    placed_at      TIMESTAMP NOT NULL DEFAULT now(),
    expires_at     TIMESTAMP,
    decided_by     TEXT REFERENCES app_users(id),
    decided_at     TIMESTAMP,
    executed_by    TEXT REFERENCES app_users(id),
    executed_at    TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_holds_open
    ON holds(account_id) WHERE status IN ('requested','active','confirmed');
CREATE INDEX IF NOT EXISTS idx_holds_bank    ON holds(bank_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_holds_account ON holds(account_id);

-- Letters to outside parties: exchange freeze, P2P seller request, issuer request, STR.
CREATE TABLE IF NOT EXISTS actions (
    id            BIGSERIAL PRIMARY KEY,
    complaint_id  TEXT NOT NULL REFERENCES complaints(id),
    kind          TEXT NOT NULL CHECK (kind IN ('freeze','p2p','issuer','str')),
    target        TEXT NOT NULL,
    targets       JSONB NOT NULL DEFAULT '[]',
    basis         TEXT NOT NULL CHECK (basis IN ('consumer_complaint','officer_decision','ai_draft','bank')),
    draft_text    TEXT,
    final_text    TEXT,
    status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','approved','sent','executed','rejected')),
    created_by    TEXT REFERENCES app_users(id),
    created_at    TIMESTAMP NOT NULL DEFAULT now(),
    approved_by   TEXT REFERENCES app_users(id),
    approved_at   TIMESTAMP,
    sent_at       TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_actions_complaint ON actions(complaint_id);

-- Warning calls made to likely mule accounts.
CREATE TABLE IF NOT EXISTS prevention_calls (
    id           BIGSERIAL PRIMARY KEY,
    account_id   TEXT NOT NULL,
    outcome      TEXT NOT NULL CHECK (outcome IN ('admitted','denied','unsure','noanswer')),
    reply_label  TEXT,
    called_at    TIMESTAMP NOT NULL DEFAULT now(),
    called_by    TEXT REFERENCES app_users(id)
);
CREATE INDEX IF NOT EXISTS idx_calls_account ON prevention_calls(account_id);


-- ---------------------------------------------------------
-- System
-- ---------------------------------------------------------

-- Tamper-evident log: each row's hash covers the previous row's hash.
CREATE TABLE IF NOT EXISTS audit_log (
    seq           BIGSERIAL PRIMARY KEY,
    ts            TIMESTAMP NOT NULL DEFAULT now(),
    actor         TEXT NOT NULL,
    kind          TEXT NOT NULL,
    complaint_id  TEXT,
    text          TEXT NOT NULL,
    prev_hash     TEXT NOT NULL,
    hash          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_complaint ON audit_log(complaint_id, seq);

-- Thresholds and other settings an officer can change.
CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       JSONB NOT NULL,
    updated_by  TEXT REFERENCES app_users(id),
    updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO settings(key, value) VALUES
    ('hold_threshold',   '70'),
    ('call_from_score',  '40'),
    ('retrace_minutes',  '25'),
    ('p2p_rate',         '90'),
    ('golden_minutes',   '60'),
    ('min_trace_amount', '500'),
    ('max_hops',         '12'),
    ('demo_clock',       'null')
ON CONFLICT (key) DO NOTHING;