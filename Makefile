# One-command tasks. `make check` is everything CI runs; run it before every PR.
.DEFAULT_GOAL := help
GEN_OUT := src/generated/ontology.ts
GEN_LANG := ts
PYTHON ?= python3
# Two tiers. CI runs the light one (CHECK_TARGETS) on every push and the heavy one
# (HEAVY_TARGETS, browser suites and the like) when the files it reads change.
CHECK_TARGETS := lint typecheck test ontology
HEAVY_TARGETS :=

# Extra targets from repo-setup layers (architecture, governance...) live in mk/*.mk.
# They append to CHECK_TARGETS or HEAVY_TARGETS, so `make check` grows with the setup.
# Check steps run quietly: a passing step prints only its tool's short result, a failing
# step prints the tool's full report.
-include mk/*.mk

# Every check step, those layers added in mk/*.mk too, waits for `make derived` (mk/derived.mk).
# `upgrade` runs first and `derived` waits for it, so it stays out of the list.
$(filter-out upgrade derived-untracked derived,$(CHECK_TARGETS)) $(HEAVY_TARGETS) build dev: | derived

.PHONY: help setup dev build format lint typecheck test gen ontology check check-quick check-heavy clean

help: ## Show available commands
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-10s %s\n", $$1, $$2}'

setup: ## Install dependencies from the lockfile
	npm ci

dev: ## Run locally with reload
	npm run dev

build: ## Compile to dist/
	npm run build

format: ## Auto-format all files
	npm run format

lint: ## Lint and check formatting
	@npm run --silent lint

typecheck: ## Strict type check
	@npm run --silent typecheck
	node tools/typecheck_own.mjs

test: ## Run tests
	@npm run --silent test

# The generated file is committed (one-file) or drawn and kept out of git (fragments): see mk/derived.mk.
gen: ## Regenerate types from ontology/
	@if [ "$$($(LEDGERS_PYTHON) tools/ledgers.py shape gen --gen-out $(GEN_OUT))" = fragments ]; then $(MAKE) --no-print-directory gen-derived; else python3 tools/ontology_codegen.py --lang ts --out $(GEN_OUT); fi

ontology: ## Check ontology/ + wiki/ consistency and generated code
	@python3 tools/wiki_lint.py
	@if [ "$$($(LEDGERS_PYTHON) tools/ledgers.py shape gen --gen-out $(GEN_OUT))" = one-file ]; then python3 tools/ontology_codegen.py --lang ts --out $(GEN_OUT) --check; fi

check-quick: $(CHECK_TARGETS) ## The light tier: CI runs it on every push

check-heavy: $(HEAVY_TARGETS) ## The heavy tier: CI runs it when the files it reads change
	@$(if $(strip $(HEAVY_TARGETS)),:,echo "no heavy checks")

# design-assembly 0.7.1 reads only this line for its gate check (fixed in 0.7.2, phanlemanh/design-assembly#38):
# naming it here keeps that check green. Drop the word once the tool is 0.7.2 or later.
check: check-quick check-heavy design-assembly ## Everything CI runs: both tiers
	@echo "make check passed: $(strip $(CHECK_TARGETS) $(HEAVY_TARGETS))"

clean: ## Remove build output
	rm -rf dist coverage
