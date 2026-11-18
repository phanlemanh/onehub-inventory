# Derived files kept out of git (design-assembly decisions 0049 to 0051): the component manifest, the one-file copy of
# the ledger of screens, the intake ledger's copy, and the role × screen × button table. Each is written again before
# anything of this repository reads it. The table is drawn from the copy of the ledger of screens, so it comes after
# design-derived.
.PHONY: design-role-table

design-role-table: design-derived ## Write the role × screen × button table again (design/role-screen-buttons.md)
	@$(PYTHON) tools/coverage_matrix/buttons.py >/dev/null

test e2e ci-db: design-role-table
