# Peecha: flow brief for Claude Code

Read this before building. It corrects and completes your analysis. Where it says DECISION, follow it unless the user overrides.

## 1. The one loop that drives everything

Complaint -> pull -> trace -> new accounts -> pull -> trace ... until the trail ends.

1. A complaint arrives (`complaints` + `complaint_payments`).
2. **Pull**: the orchestrator calls the bank connectors for ONLY the victim's account and the first receiving account (matched by UTR, UPI id or account number). The connector writes `accounts` + `transfers`. Nothing else is pulled. Never bulk-load a bank.
3. **Trace**: the tracer reads ONLY local tables (never a bank DB). It follows the victim's money by FIFO (also LIFO / pro-rata) and writes `victim_mapping`.
4. Every newly reached account is a **stub** (`fetched_at IS NULL`). Stubs become the next pull. Go to 2.
5. Stop a branch when: ATM cash (`to_ref='CASH'`), exchange_deposit or exchange_hot (freezable), bridge or mixer (gone), no tainted money left, amount < `min_trace_amount`, or `max_hops`.
6. Re-run the whole loop every `retrace_minutes`; new money that arrived since last run extends the trail.

The orchestrator is the loop controller (pull -> trace -> score -> propose actions). It is not a separate pipeline stage. Connectors do not know about complaints. The tracer does not know about banks' table layouts.

## 2. P2P seam (rupees -> crypto)

A rupee payment to an account that has `p2p_wallet` set (or is listed in `crypto_p2p_sellers`) is matched to that seller's USDT release by amount and time (tolerance, `p2p_rate` setting, `golden_minutes`). The trace then continues on TRON (`rail='CHAIN'`, `asset='USDT'`). There is no real link between the two legs in the world, so the match is the tracer's inference; record it in `victim_mapping`, do not add a column to `transfers`.

## 3. Mule detector is separate from the tracer

- It scores accounts from behaviour only, using `pipeline/models/mule_radar.json`. It is NOT limited to accounts in one complaint, though case features come from the `account_cases` view.
- It never reads `accounts.label`, `accounts.source`, or `mule_accounts` rows with `source='model'`, and never reads any ground-truth file.
- Stub accounts are scored from transfers only, capped at 69 unless 2 or more complaints (rules in the JSON).
- Writes `account_scores` (score + `reasons` = rule ids and evidence) and `mule_accounts` (source `model`, status `suspected`).
- Ground truth for evaluation is a separate `mule_truth` file written by the seeder, outside both databases. Only the evaluation script opens it.
- Actions: score >= 40 -> prevention call (ElevenLabs, Hindi); >= 70 -> bank places a 24h temporary hold on the traced amount (>= Rs 1000) and the officer confirms or rejects, or it expires; freeze is officer-only. One open hold per account. AI hold suggestions are computed, not stored.

## 4. Answers to your inconsistencies

| Issue | DECISION |
|---|---|
| Missing `bank_dummy_db.sql` mount | Obsolete. `dummy_sources.sql` is the bank AND crypto source file, loaded into its own database (`dummy_sources`). Point `docker-compose.bank.yaml` at it. `crypto_dummy.sql` is obsolete, delete it. A seeder is still needed (customers, normal traffic, mule rings, P2P sellers, wallets, a showcase complaint, matching UTRs on both sides of cross-bank payments, and the truth file). |
| `opening_balance` missing | Add `accounts.opening_balance NUMERIC(18,6) NOT NULL DEFAULT 0` to the schema. It is the balance before the first synced transfer; connectors set it if the bank gives balances, else 0. |
| `hold_min_amount_inr` | Add to the `settings` seed: `('hold_min_amount_inr','1000')`. |
| Income units | Connectors normalise to ANNUAL INR. Monthly x 12. Bands use the band midpoint x 12 (LT_25K ~ 15,000/month, 25K_50K ~ 37,500, 50K_1L ~ 75,000, GT_1L ~ 150,000). |
| Account id uniqueness | Namespace ids: bank accounts `{BANK_CODE}:{account_no}` (e.g. `SBI:1234567890`), wallets `TRON:{address}`. Resolve a counterparty's bank from `banks.ifsc_prefix`, or `banks.upi_handle` (HDFC-style sources give only a VPA). |
| Cross-bank duplicates | Use `source_ref = UTR` with a single shared source value (e.g. `'bank'`) and `INSERT ... ON CONFLICT (source, source_ref) DO NOTHING`; the second bank's copy is ignored. ATM and any row without a UTR use `source_ref = '{BANK_CODE}:{txn_id}'`. Kotak-style ledgers: the D and C entries of one payment share `txn_ref` and become ONE transfer. Failed rows become `status='failed'`. |
| Frontend bank set differs | The frontend is a standalone demo that runs its own in-browser engine and never calls `/api`. It is not the source of truth. Build the backend against the schema; wire the frontend later (it has a backend-URL setting and calls `{backend}/health`). Do not change the 22 bank codes to match it. |
| Unused bits | `psycopg` will be used by the connectors. `eleven_labs` is for prevention calls. Fix `.gitignore` (`__pycache__`, `*.pyc`, `.env`) and delete the committed `.pyc`. |

## 5. Things you did not mention but must respect

- **Demo clock**: `settings.demo_clock`. Connectors only pull transfers with `ts <= clock` when it is set. Seeds contain future transactions, so advancing the clock reveals new hops and the re-trace extends trails.
- **Timestamps**: app DB uses plain TIMESTAMP in UTC. Convert every source at the connector (ICICI epoch is UTC, Axis epoch is milliseconds, Kotak is tz-aware, HDFC date + time is IST: convert to UTC). Hour-of-day rules use Asia/Kolkata.
- **Roles and masking**: officer sees everything; bank analyst/admin sees only their own bank, foreign accounts masked as `BANK ••1234`, `access_level` view/hold/admin; consumer sees only their own complaints, everything masked, no scores.
- **Audit**: every state change writes `audit_log`; hash = sha256(prev_hash|seq|ts|kind|actor|text), genesis hash is 64 zeros.
- **One complaint, many victims**: the same transfer can appear under several complaints in `victim_mapping` (unique on complaint, method, transfer). Repeat offenders come from `account_cases`.
- **Layer rules**: `accounts` and `transfers` hold plain facts only. No mule, victim or scam meaning goes in them. Meaning lives in `victim_mapping`, `account_scores`, `mule_accounts`.

## 6. Suggested build order

1. Schema fixes (`opening_balance`, `hold_min_amount_inr`), compose fix.
2. Seeder for `dummy_sources` + truth file (small world first: 3 banks, one showcase complaint, one mule ring, one P2P exit).
3. One connector per layout family (flat_rupees, paise_epoch, ledger, split_datetime, payments_bank) with a per-bank column map, UTR dedupe, stub creation.
4. Tracer (FIFO first) + `victim_mapping` + P2P seam.
5. Orchestrator loop.
6. Mule detector from the JSON + evaluation against the truth file.
7. API (auth, masking, holds, actions, reports), then the frontend wiring.
