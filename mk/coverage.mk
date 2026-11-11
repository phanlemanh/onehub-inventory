# Role × screen coverage (roadmap row 1d, decision 0017): pages, roles and the contracts' Vai × Màn block.
CHECK_TARGETS += coverage-matrix
COVERAGE_ROOT ?= .
.PHONY: coverage-matrix coverage-report

coverage-matrix: ## Check the screen register, the role list and the Vai × Màn block of contracts
	$(PYTHON) tools/coverage_matrix/check.py --root $(COVERAGE_ROOT)

coverage-report: ## Print how many rounds filled the Vai × Màn block (decision 0017 numbers)
	$(PYTHON) tools/coverage_matrix/check.py --root $(COVERAGE_ROOT) --report
