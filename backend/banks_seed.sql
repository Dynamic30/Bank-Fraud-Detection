-- Banks Peecha can connect to (app database). One row per bank code used in dummy_sources.sql.
-- `connector` names the layout-family adapter; each bank still has its own column map.
-- ifsc_prefix is the 4-letter IFSC prefix; upi_handle is the part after @ in a VPA.
-- NOTE: drafted from public IFSC prefixes and common UPI handles because the original
-- banks_seed.sql was not available. Replace it if you have the original.

INSERT INTO banks (id, name, ifsc_prefix, upi_handle, connector) VALUES
    ('SBI',      'State Bank of India',            'SBIN', 'oksbi',      'flat_rupees'),
    ('PNB',      'Punjab National Bank',           'PUNB', 'pnb',        'flat_rupees'),
    ('BOB',      'Bank of Baroda',                 'BARB', 'barodampay', 'flat_rupees'),
    ('CANARA',   'Canara Bank',                    'CNRB', 'cnrb',       'flat_rupees'),
    ('UBI',      'Union Bank of India',            'UBIN', 'uboi',       'flat_rupees'),
    ('INDIAN',   'Indian Bank',                    'IDIB', 'indianbk',   'flat_rupees'),
    ('ICICI',    'ICICI Bank',                     'ICIC', 'okicici',    'paise_epoch'),
    ('AXIS',     'Axis Bank',                      'UTIB', 'okaxis',     'paise_epoch'),
    ('INDUSIND', 'IndusInd Bank',                  'INDB', 'indus',      'paise_epoch'),
    ('YES',      'Yes Bank',                       'YESB', 'yesbank',    'paise_epoch'),
    ('RBL',      'RBL Bank',                       'RATN', 'rbl',        'paise_epoch'),
    ('KOTAK',    'Kotak Mahindra Bank',            'KKBK', 'kotak',      'ledger'),
    ('IDFC',     'IDFC FIRST Bank',                'IDFB', 'idfcfirst',  'ledger'),
    ('FEDERAL',  'Federal Bank',                   'FDRL', 'fbl',        'ledger'),
    ('BANDHAN',  'Bandhan Bank',                   'BDBL', 'bandhan',    'ledger'),
    ('HDFC',     'HDFC Bank',                      'HDFC', 'okhdfcbank', 'split_datetime'),
    ('AU',       'AU Small Finance Bank',          'AUBL', 'aubank',     'split_datetime'),
    ('EQUITAS',  'Equitas Small Finance Bank',     'ESFB', 'equitas',    'split_datetime'),
    ('SIB',      'South Indian Bank',              'SIBL', 'sib',        'split_datetime'),
    ('PAYTM',    'Paytm Payments Bank',            'PYTM', 'paytm',      'payments_bank'),
    ('IPPB',     'India Post Payments Bank',       'IPOS', 'postbank',   'payments_bank'),
    ('AIRTEL',   'Airtel Payments Bank',           'AIRP', 'airtel',     'payments_bank')
ON CONFLICT (id) DO NOTHING;
