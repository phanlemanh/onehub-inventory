# Design system checks: generated tables, component registry, determinism ledger. The component
# registry is written by the design-assembly tool (tools/design-assembly/components.mjs).
CHECK_TARGETS += design
.PHONY: gen-design design e2e

gen: gen-design

gen-design: ## Regenerate labels, display kinds and the component registry
	$(PYTHON) tools/design_codegen.py
	node tools/design-assembly/components.mjs --write

design: ## Check generated design files and report the determinism ratio
	$(PYTHON) tools/design_codegen.py --check
	node tools/design-assembly/components.mjs
	$(PYTHON) tools/design_check.py

e2e: ## Browser tests: shell, accessibility, four screen sizes (needs Playwright browsers)
	npm run test:e2e
