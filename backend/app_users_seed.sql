-- Demo users for the Peecha app database. Auth is a stub (login by email, no passwords).
-- Runs after banks_seed.sql because bank users reference banks(id).
-- Fake people and .example addresses only.

INSERT INTO app_users (id, name, email, role, bank_id, access_level) VALUES
    ('u-officer-1',  'Insp. Meera Baruah',  'meera.baruah@cybercell.example',  'officer',      NULL,    'admin'),

    ('u-sbi-analyst',   'Rahul Nair',      'rahul.nair@sbi.example',       'bank_analyst', 'SBI',   'hold'),
    ('u-sbi-admin',     'Kavita Menon',    'kavita.menon@sbi.example',     'bank_admin',   'SBI',   'admin'),
    ('u-hdfc-analyst',  'Sanjay Kulkarni', 'sanjay.kulkarni@hdfc.example', 'bank_analyst', 'HDFC',  'hold'),
    ('u-hdfc-admin',    'Pooja Iyer',      'pooja.iyer@hdfc.example',      'bank_admin',   'HDFC',  'admin'),
    ('u-icici-analyst', 'Amit Deshpande',  'amit.deshpande@icici.example', 'bank_analyst', 'ICICI', 'hold'),
    ('u-icici-admin',   'Neha Kapoor',     'neha.kapoor@icici.example',    'bank_admin',   'ICICI', 'admin'),
    ('u-axis-analyst',  'Vikas Rao',       'vikas.rao@axis.example',       'bank_analyst', 'AXIS',  'hold'),
    ('u-axis-admin',    'Anjali Bhatt',    'anjali.bhatt@axis.example',    'bank_admin',   'AXIS',  'admin'),
    ('u-kotak-analyst', 'Rohit Malhotra',  'rohit.malhotra@kotak.example', 'bank_analyst', 'KOTAK', 'hold'),
    ('u-kotak-admin',   'Sunita Joshi',    'sunita.joshi@kotak.example',   'bank_admin',   'KOTAK', 'admin'),

    -- the other 17 banks: one analyst and one admin each, so every bank can sign in
    ('u-pnb-analyst', 'Punjab National Bank Analyst', 'analyst@pnb.example', 'bank_analyst', 'PNB', 'hold'),
    ('u-pnb-admin',   'Punjab National Bank Admin',   'admin@pnb.example',   'bank_admin',   'PNB', 'admin'),
    ('u-bob-analyst', 'Bank of Baroda Analyst', 'analyst@bob.example', 'bank_analyst', 'BOB', 'hold'),
    ('u-bob-admin',   'Bank of Baroda Admin',   'admin@bob.example',   'bank_admin',   'BOB', 'admin'),
    ('u-canara-analyst', 'Canara Bank Analyst', 'analyst@canara.example', 'bank_analyst', 'CANARA', 'hold'),
    ('u-canara-admin',   'Canara Bank Admin',   'admin@canara.example',   'bank_admin',   'CANARA', 'admin'),
    ('u-ubi-analyst', 'Union Bank of India Analyst', 'analyst@ubi.example', 'bank_analyst', 'UBI', 'hold'),
    ('u-ubi-admin',   'Union Bank of India Admin',   'admin@ubi.example',   'bank_admin',   'UBI', 'admin'),
    ('u-indian-analyst', 'Indian Bank Analyst', 'analyst@indian.example', 'bank_analyst', 'INDIAN', 'hold'),
    ('u-indian-admin',   'Indian Bank Admin',   'admin@indian.example',   'bank_admin',   'INDIAN', 'admin'),
    ('u-indusind-analyst', 'IndusInd Bank Analyst', 'analyst@indusind.example', 'bank_analyst', 'INDUSIND', 'hold'),
    ('u-indusind-admin',   'IndusInd Bank Admin',   'admin@indusind.example',   'bank_admin',   'INDUSIND', 'admin'),
    ('u-yes-analyst', 'Yes Bank Analyst', 'analyst@yes.example', 'bank_analyst', 'YES', 'hold'),
    ('u-yes-admin',   'Yes Bank Admin',   'admin@yes.example',   'bank_admin',   'YES', 'admin'),
    ('u-rbl-analyst', 'RBL Bank Analyst', 'analyst@rbl.example', 'bank_analyst', 'RBL', 'hold'),
    ('u-rbl-admin',   'RBL Bank Admin',   'admin@rbl.example',   'bank_admin',   'RBL', 'admin'),
    ('u-idfc-analyst', 'IDFC FIRST Bank Analyst', 'analyst@idfc.example', 'bank_analyst', 'IDFC', 'hold'),
    ('u-idfc-admin',   'IDFC FIRST Bank Admin',   'admin@idfc.example',   'bank_admin',   'IDFC', 'admin'),
    ('u-federal-analyst', 'Federal Bank Analyst', 'analyst@federal.example', 'bank_analyst', 'FEDERAL', 'hold'),
    ('u-federal-admin',   'Federal Bank Admin',   'admin@federal.example',   'bank_admin',   'FEDERAL', 'admin'),
    ('u-bandhan-analyst', 'Bandhan Bank Analyst', 'analyst@bandhan.example', 'bank_analyst', 'BANDHAN', 'hold'),
    ('u-bandhan-admin',   'Bandhan Bank Admin',   'admin@bandhan.example',   'bank_admin',   'BANDHAN', 'admin'),
    ('u-au-analyst', 'AU Small Finance Bank Analyst', 'analyst@au.example', 'bank_analyst', 'AU', 'hold'),
    ('u-au-admin',   'AU Small Finance Bank Admin',   'admin@au.example',   'bank_admin',   'AU', 'admin'),
    ('u-equitas-analyst', 'Equitas Small Finance Bank Analyst', 'analyst@equitas.example', 'bank_analyst', 'EQUITAS', 'hold'),
    ('u-equitas-admin',   'Equitas Small Finance Bank Admin',   'admin@equitas.example',   'bank_admin',   'EQUITAS', 'admin'),
    ('u-sib-analyst', 'South Indian Bank Analyst', 'analyst@sib.example', 'bank_analyst', 'SIB', 'hold'),
    ('u-sib-admin',   'South Indian Bank Admin',   'admin@sib.example',   'bank_admin',   'SIB', 'admin'),
    ('u-paytm-analyst', 'Paytm Payments Bank Analyst', 'analyst@paytm.example', 'bank_analyst', 'PAYTM', 'hold'),
    ('u-paytm-admin',   'Paytm Payments Bank Admin',   'admin@paytm.example',   'bank_admin',   'PAYTM', 'admin'),
    ('u-ippb-analyst', 'India Post Payments Bank Analyst', 'analyst@ippb.example', 'bank_analyst', 'IPPB', 'hold'),
    ('u-ippb-admin',   'India Post Payments Bank Admin',   'admin@ippb.example',   'bank_admin',   'IPPB', 'admin'),
    ('u-airtel-analyst', 'Airtel Payments Bank Analyst', 'analyst@airtel.example', 'bank_analyst', 'AIRTEL', 'hold'),
    ('u-airtel-admin',   'Airtel Payments Bank Admin',   'admin@airtel.example',   'bank_admin',   'AIRTEL', 'admin'),

    ('u-consumer-1', 'Anil Verma',    'anil.verma@mail.example',    'consumer', NULL, 'view'),
    ('u-consumer-2', 'Priya Sharma',  'priya.sharma@mail.example',  'consumer', NULL, 'view'),
    ('u-consumer-3', 'Imran Qureshi', 'imran.qureshi@mail.example', 'consumer', NULL, 'view')
ON CONFLICT (id) DO NOTHING;
