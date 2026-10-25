-include .env
export

PYTHON   ?= python
ACCOUNTS ?= 20000
SEED     ?= 42
NOW      ?= 2026-10-24T12:00:00Z
DSN      ?= $(BANK_DATABASE_URL_HOST)

.PHONY: bank-db bank-db-reset seed seed-small

bank-db:
	docker compose -f docker-compose.bank.yaml up -d

# drops the dummy_sources volume and reloads backend/dummy_sources.sql
bank-db-reset:
	docker compose -f docker-compose.bank.yaml down -v
	docker compose -f docker-compose.bank.yaml up -d

seed:
	$(PYTHON) -m pipeline.seed.seed_sources --dsn "$(DSN)" --accounts $(ACCOUNTS) --seed $(SEED) --now $(NOW) --truth out/mule_truth.csv --reset

seed-small:
	$(MAKE) seed ACCOUNTS=3000
