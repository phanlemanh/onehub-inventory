CHECK_TARGETS += design-assembly

.PHONY: design-assembly design-derived design-affected design-rate design-tokens design-components design-columns
design-assembly: ## Check every design decision this tool holds, and show each check failing on a changed copy
	@node tools/design-assembly/check.mjs

design-derived: ## Write again every derived file this repository keeps out of git, before anything reads one
	@if [ -f tools/design-assembly/derived.mjs ]; then node tools/design-assembly/derived.mjs --quiet; fi

# The tests of a gate that runs them may read a derived file, which a clean checkout does not have.
ifneq ($(filter test,$(CHECK_TARGETS)),)
test: design-derived
endif

design-affected: ## Say which screens a change reaches, and at which widths; FILES=a,b to name the files
	@node tools/design-assembly/affected.mjs $(if $(FILES),--files $(FILES))

design-rate: ## Print the determinism rate: decisions held by a check that can fail
	@node tools/design-assembly/check.mjs --rate

design-tokens: ## Write the design tokens file again from the stylesheet, after a value changed
	@node tools/design-assembly/tokens.mjs --write

design-components: ## Write the component manifest again from the source, after a component changed
	@node tools/design-assembly/components.mjs --write

design-columns: ## Write the column types file again, after the table or a field's type changed
	@node tools/design-assembly/columns.mjs --write
