CHECK_TARGETS += design-assembly

.PHONY: design-assembly design-rate design-tokens design-components design-columns
design-assembly: ## Check every design decision this tool holds, and show each check failing on a changed copy
	@node tools/design-assembly/check.mjs

design-rate: ## Print the determinism rate: decisions held by a check that can fail
	@node tools/design-assembly/check.mjs --rate

design-tokens: ## Write the design tokens file again from the stylesheet, after a value changed
	@node tools/design-assembly/tokens.mjs --write

design-components: ## Write the component manifest again from the source, after a component changed
	@node tools/design-assembly/components.mjs --write

design-columns: ## Write the column types file again, after the table or a field's type changed
	@node tools/design-assembly/columns.mjs --write
