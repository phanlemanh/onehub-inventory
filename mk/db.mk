# Disposable Postgres for one work lane. Never holds real data.
DB_LANE ?= main
DB_PORT ?= 5560
DB_NAME := onehub-inventory-db-$(DB_LANE)
.PHONY: db-up db-down db-login ci-db

db-up: ## Start this lane's Postgres (DB_LANE, DB_PORT)
	docker run -d --rm --name $(DB_NAME) -e POSTGRES_PASSWORD=local-only -p 127.0.0.1:$(DB_PORT):5432 postgres:16
	until docker exec $(DB_NAME) pg_isready -U postgres -q; do sleep 1; done
	@echo "owner (migrations, fixtures): postgres://postgres:local-only@127.0.0.1:$(DB_PORT)/postgres"
	@echo "DATABASE_URL=postgres://quy_hang_login:local-only@127.0.0.1:$(DB_PORT)/<database>  (after migrations: make db-login)"

db-login: ## Let the app's login role quy_hang_login sign in on this lane's container (password local-only; row 7c)
	docker exec $(DB_NAME) psql -U postgres -v ON_ERROR_STOP=1 -qc "alter role quy_hang_login password 'local-only'"

db-down: ## Stop and remove this lane's Postgres
	docker rm -f $(DB_NAME)

ci-db: ## Everything CI runs on a database, in one command (row 1s): DB_PORT (default 5432), BUOC, CI_DB_CONTAINER
	bash db/scripts/ci-db.sh $(BUOC)
