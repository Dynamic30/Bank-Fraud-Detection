# Seeder (fake data only)

This folder is **just a way to generate fake data for the app**. It is not part of the product, and nothing in it is
real: every bank, person, account, payment and wallet is made up.

It fills the `dummy_sources` database (the mock bank and crypto systems in `backend/dummy_sources.sql`) so the
connectors, tracer and mule detector have something realistic to work on. It never touches the app database.

## Run

```
make bank-db      # start the dummy_sources Postgres (docker-compose.bank.yaml, port 5433)
make seed         # 20,000 accounts, seed 42, "now" = 2026-10-24 12:00 UTC (about 45 s)
make seed-small   # 3,000 accounts
```

Without `make`: `pip install -r requirements.txt`, then
`python -m pipeline.seed.seed_sources --dsn $BANK_DATABASE_URL_HOST --accounts 20000 --seed 42 --now 2026-10-24T12:00:00Z --truth out/mule_truth.csv --reset`.
Without `--reset` it refuses to touch non-empty tables. Same `--seed` and `--now` give the same data.

## Output

* the `dummy_sources` tables, filled;
* `out/mule_truth.csv`: who is a mule, ring and type. Only the evaluation script should read it;
* `out/complaints.csv`, `out/complaint_payments.csv`: complaints in the app tables' column order, for a separate loader
  (showcase case `C-3021`; the run prints its victim account and UTRs);
* a PASS/FAIL validation report (non-zero exit on FAIL).

## Encoding notes for connector authors

* A payment between two banks is written by both under the **same UTR** and second. ATM withdrawals and failed
  payments are written by the remitter's bank only. The initiating device (or ATM id) is on every copy.
* `flat_rupees` and `split_datetime` times are **IST**; epoch columns are UTC (`created_ms` is milliseconds).
* Payments banks keep an outside counterparty's account number, IFSC and VPA in `meta.cp`.
