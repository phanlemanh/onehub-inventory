---
schema_version: 2
feature_slug: design-assembly-adopt-checks
verdict: REJECT
failed_evals: [E4, E6]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b31b78dd8ab8936f1593177a52e78d6b132562d6
human_signoff:
---

# Evidence Report: design-assembly-adopt-checks

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-2 | script | FAIL |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | FAIL |
| E7 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-design-assembly-adopt-checks-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-23T01:59:35Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: minted-design-assembly-adopt-checks-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  output: |
    pointers: 10 rows point at their check

- eval: E3
  run_id: minted-design-assembly-adopt-checks-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  output: |
    unit tests of tests/format.test.ts and tests/grid.test.tsx passed, no output line beyond the runner summary

- eval: E4
  run_id: minted-design-assembly-adopt-checks-E4-r1
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  output: |
    tests 17, pass 16, fail 1
    failing: shape: green on the repository (hai-chieu.mjs:96)
    shape: file changed outside the matrix: docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md
    expected 0 from the shape run on the repository, got 1

- eval: E5
  run_id: minted-design-assembly-adopt-checks-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T01:59:35Z
  output: |
    gac-hydration: 0 canh bao

- eval: E6
  run_id: minted-design-assembly-adopt-checks-E6-r1
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  output: |
    shape: file changed outside the matrix: docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md

- eval: E7
  run_id: minted-design-assembly-adopt-checks-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  output: |
    rules: Controls says 24px as design/theme.json holds; Type says headings in var(--font-sans) as design/theme.json holds; one known wrong line

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-design-assembly-adopt-checks-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-23T01:59:35Z

Lệnh fail không gắn eval: không có. Hai lệnh fail đều gắn eval: lệnh two-way gắn E4, lệnh shape gắn E6.

## Known limits

## Ngoài hợp đồng

## Analyst

Non-discriminating (xanh cả trên HEAD lẫn baseline):
- make check (E1)

Baseline không đo:
- bash _acceptance/design-assembly-adopt-checks/rang/chay.sh pointers: bo qua baseline: tep _acceptance/design-assembly-adopt-checks/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/design-assembly-adopt-checks/rang/chay.sh unit: bo qua baseline: tep _acceptance/design-assembly-adopt-checks/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/design-assembly-adopt-checks/rang/chay.sh two-way: bo qua baseline: tep _acceptance/design-assembly-adopt-checks/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/design-assembly-adopt-checks/rang/chay.sh shape: bo qua baseline: tep _acceptance/design-assembly-adopt-checks/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/design-assembly-adopt-checks/rang/chay.sh rules: bo qua baseline: tep _acceptance/design-assembly-adopt-checks/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần và đều xác định, không có eval nhiều lần chạy.

## Iterations

Round 1: E4, E6 failed — kế hoạch docs/superpowers/plans/2026-11-23-design-assembly-adopt-checks.md (thêm ở b31b78dd) nằm ngoài danh sách tệp được phép của phép đo shape, nên shape đỏ trên kho và E4 mất một bài (16/17). Returned to implementation.
