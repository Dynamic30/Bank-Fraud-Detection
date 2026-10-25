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

    ('u-consumer-1', 'Anil Verma',    'anil.verma@mail.example',    'consumer', NULL, 'view'),
    ('u-consumer-2', 'Priya Sharma',  'priya.sharma@mail.example',  'consumer', NULL, 'view'),
    ('u-consumer-3', 'Imran Qureshi', 'imran.qureshi@mail.example', 'consumer', NULL, 'view')
ON CONFLICT (id) DO NOTHING;
