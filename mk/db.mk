# Disposable Postgres for one work lane. Never holds real data.
DB_LANE ?= main
DB_PORT ?= 5560
DB_NAME := onehub-inventory-db-$(DB_LANE)
.PHONY: db-up db-down

db-up: ## Start this lane's Postgres (DB_LANE, DB_PORT)
	docker run -d --rm --name $(DB_NAME) -e POSTGRES_PASSWORD=local-only -p 127.0.0.1:$(DB_PORT):5432 postgres:16
	until docker exec $(DB_NAME) pg_isready -U postgres -q; do sleep 1; done
	@echo "DATABASE_URL=postgres://postgres:local-only@127.0.0.1:$(DB_PORT)/postgres"

db-down: ## Stop and remove this lane's Postgres
	docker rm -f $(DB_NAME)
