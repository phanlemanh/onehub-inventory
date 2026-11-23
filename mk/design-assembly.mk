CHECK_TARGETS += design-assembly

.PHONY: design-assembly design-derived design-affected design-screen-facts design-rate design-tokens design-components design-columns
design-assembly: ## Check every design decision this tool holds, and show each check failing on a changed copy
	@node tools/design-assembly/check.mjs

design-derived: ## Write again every derived file this repository keeps out of git, before anything reads one
	@if [ -f tools/design-assembly/derived.mjs ]; then node tools/design-assembly/derived.mjs --quiet; fi

# A clean checkout has no derived file, and the tests may read one. A gate that keeps the shared
# lists of derived targets and files runs every derived target before its checks; this step joins
# those lists. A gate laid before them has no such step, and there the tests wait for this one.
ifeq ($(origin DERIVED_TARGETS),undefined)
ifneq ($(filter test,$(CHECK_TARGETS)),)
test: design-derived
endif
endif
DERIVED_TARGETS += design-derived
DERIVED_FILES += $(shell [ -f tools/design-assembly/derived.mjs ] && node tools/design-assembly/derived.mjs --list)

design-affected: ## Say which screens a change reaches, and at which widths; FILES=a,b to name the files
	@node tools/design-assembly/affected.mjs $(if $(FILES),--files $(FILES))

design-screen-facts: ## Print each screen with the states it must have and the roles of its actions; SCREENS=a,b to name them
	@node tools/design-assembly/screen-facts.mjs $(if $(SCREENS),--screens $(SCREENS))

design-rate: ## Print the determinism rate: decisions held by a check that can fail
	@node tools/design-assembly/check.mjs --rate

design-tokens: ## Write the design tokens file again from the stylesheet, after a value changed
	@node tools/design-assembly/tokens.mjs --write

design-components: ## Write the component manifest again from the source, after a component changed
	@node tools/design-assembly/components.mjs --write

design-columns: ## Write the column types file again, after the table or a field's type changed
	@node tools/design-assembly/columns.mjs --write
