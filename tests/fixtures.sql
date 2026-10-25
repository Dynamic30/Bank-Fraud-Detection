INSERT INTO app_users (id, name, email, role, bank_id, access_level, status) VALUES
    ('u-sbi-viewer', 'Sbi Viewer', 'viewer@sbi.example', 'bank_analyst', 'SBI', 'view', 'active'),
    ('u-suspended', 'Suspended', 'suspended@mail.example', 'consumer', NULL, 'view', 'suspended');

INSERT INTO accounts (account_id, kind, bank_id, holder_name, city) VALUES
    ('SBI:1111110011', 'bank', 'SBI', 'Victim One', 'Pune'),
    ('SBI:4444440044', 'bank', 'SBI', 'Second Sbi', 'Pune'),
    ('HDFC:2222220022', 'bank', 'HDFC', 'Mule Hdfc', 'Delhi'),
    ('ICICI:3333330033', 'bank', 'ICICI', 'Mule Icici', 'Delhi'),
    ('ICICI:5555550055', 'bank', 'ICICI', 'Victim Two', 'Delhi');
INSERT INTO accounts (account_id, kind, wallet_kind) VALUES
    ('TRON:TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'wallet', 'p2p_seller');

INSERT INTO transfers (transfer_id, source, source_ref, from_id, to_id, amount, ts, rail, utr) VALUES
    (1, 'bank', 'UTR1', 'SBI:1111110011', 'HDFC:2222220022', 50000, '2026-07-01 10:00', 'UPI', 'UTR1'),
    (2, 'bank', 'UTR2', 'HDFC:2222220022', 'ICICI:3333330033', 48000, '2026-07-01 10:20', 'IMPS', 'UTR2'),
    (3, 'bank', 'SBI:att3', 'ICICI:3333330033', NULL, 45000, '2026-07-01 11:00', 'ATM', NULL),
    (4, 'bank', 'UTR4', 'ICICI:5555550055', 'HDFC:2222220022', 20000, '2026-07-02 09:00', 'UPI', 'UTR4');

INSERT INTO complaints (id, name, victim_account_id, scam_type, total_lost, fraud_time, reported_at, owner_user_id, filed_via) VALUES
    ('C-3001', 'Victim One', 'SBI:1111110011', 'job_part_time', 50000, '2026-07-01 09:00', '2026-07-01 12:00', 'u-consumer-1', 'self'),
    ('C-3002', 'Victim Two', 'ICICI:5555550055', 'investment', 20000, '2026-07-02 08:00', '2026-07-02 10:00', 'u-consumer-2', 'self');

INSERT INTO complaint_payments (complaint_id, amount, paid_at, utr, paid_to_upi_id, paid_to_account_id) VALUES
    ('C-3001', 50000, '2026-07-01 10:00', 'UTR1', 'mule@hdfc', 'HDFC:2222220022');

INSERT INTO victim_mapping (complaint_id, transfer_id, hop, leg, from_ref, to_ref, from_bank, to_bank, traced_amount) VALUES
    ('C-3001', 1, 1, 'bank', 'SBI:1111110011', 'HDFC:2222220022', 'SBI', 'HDFC', 50000),
    ('C-3001', 2, 2, 'bank', 'HDFC:2222220022', 'ICICI:3333330033', 'HDFC', 'ICICI', 48000),
    ('C-3001', 3, 3, 'bank', 'ICICI:3333330033', 'CASH', 'ICICI', NULL, 45000),
    ('C-3002', 4, 1, 'bank', 'ICICI:5555550055', 'HDFC:2222220022', 'ICICI', 'HDFC', 20000);

INSERT INTO account_scores (account_id, score, reasons) VALUES
    ('HDFC:2222220022', 82, '[{"rule_id": "R14", "reason_text": "Appears in 2 trails, one via SBI:1111110011"}]');

INSERT INTO mule_accounts (account_id, bank_id, source, status) VALUES
    ('SBI:4444440044', 'SBI', 'complaint', 'suspected'),
    ('HDFC:2222220022', 'HDFC', 'complaint', 'confirmed');
