# Deploy, smoke check and rollback on Vercel (row moi-truong-thu-va-ban-that; runbook docs/van-hanh/).
# Used by .github/workflows/deploy.yml. ENV=staging|production; variables are read from the environment, never printed.
.PHONY: deploy smoke rollback
ENV ?= staging
DEPLOY_TOOLS := $(dir $(lastword $(MAKEFILE_LIST)))../tools/deploy

deploy: ## Deploy to ENV (staging|production): config, migrations, build, check, then the domain
	node $(DEPLOY_TOOLS)/len-ban.mjs $(ENV)

smoke: ## Read-only check of ENV's public address (APP_URL)
	node $(DEPLOY_TOOLS)/kiem-nhanh.mjs $(ENV)

rollback: ## Point ENV's domain back at the previous deployment, then check it
	node $(DEPLOY_TOOLS)/lui-ban.mjs $(ENV)

.PHONY: cach-ly-dich sao-luu khoi-phuc-thu
cach-ly-dich: ## Read-only isolation suite on a target (MIGRATE_DATABASE_URL, LOGIN_DATABASE_URL; PSQL_DICH optional)
	bash db/scripts/cach-ly-dich.sh

sao-luu: ## Back up MIGRATE_DATABASE_URL to TEP, outside the repo, with TEP.dem row counts
	bash db/scripts/sao-luu.sh $(TEP)

khoi-phuc-thu: ## Restore drill of TEP into a scratch database; prints the line for docs/van-hanh/nhat-ky-khoi-phuc.md
	bash db/scripts/khoi-phuc-thu.sh $(TEP)
