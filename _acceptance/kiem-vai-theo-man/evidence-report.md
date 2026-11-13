---
schema_version: 2
feature_slug: kiem-vai-theo-man
verdict: REJECT
failed_evals: ["E11"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6e4f1c2b8dd2880a2403ec70d39fdb19f3d1039a
human_signoff:
---

# Evidence Report: kiem-vai-theo-man

Round 1. Lệnh `make check` (E11) đỏ: bộ test có 43 tệp lỗi, 127 ca lỗi. Một ca lỗi tiêu biểu nằm ở bản sao cây do lệnh phá thử dựng (`dist/pha-thu-vai-man/...`, tệp `tools/reui_catalog/doc-chac.test.mjs`) và có dòng ERR_MODULE_NOT_FOUND. Các eval còn lại xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-7 | test | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-1 | script | FAIL |
| E12 | AC-9 | test | PASS |
| E13 | AC-10 | test | PASS |
| E14 | AC-11 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-kiem-vai-theo-man-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  output: |
    npx vitest run tests/vai-man-so-man.test.ts (reporter verbose) xanh, thoát 0

- eval: E2
  run_id: minted-kiem-vai-theo-man-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cùng lượt vitest với E1, xanh

- eval: E3
  run_id: minted-kiem-vai-theo-man-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cùng lượt vitest với E1, xanh

- eval: E9
  run_id: minted-kiem-vai-theo-man-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cùng lượt vitest với E1, xanh

- eval: E4
  run_id: minted-kiem-vai-theo-man-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E5
  run_id: minted-kiem-vai-theo-man-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E6
  run_id: minted-kiem-vai-theo-man-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E7
  run_id: minted-kiem-vai-theo-man-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E8
  run_id: minted-kiem-vai-theo-man-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E14
  run_id: minted-kiem-vai-theo-man-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E10
  run_id: minted-kiem-vai-theo-man-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_pha_thu
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cay goc: xanh (TeamLead, ListAgent, BuyerAgent, CompanyAdmin @1440)

- eval: E15
  run_id: minted-kiem-vai-theo-man-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_pha_thu
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cay goc: xanh (TeamLead, ListAgent, BuyerAgent, CompanyAdmin @1440)

- eval: E11
  run_id: minted-kiem-vai-theo-man-E11-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T15:32:51Z
  output: |
    Test Files  43 failed | 150 passed (193)
    Tests  127 failed | 2752 passed | 44 skipped (2923)
    ca tiêu biểu: dist/pha-thu-vai-man/ban-sao-ayYujR/tools/reui_catalog/doc-chac.test.mjs:577 (build.mjs --refresh thoát khác 0)
    nguyên nhân gần: ERR_MODULE_NOT_FOUND trong bản sao cây của lệnh phá thử
    make: *** [test] Error 1

- eval: E12
  run_id: minted-kiem-vai-theo-man-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-13T15:32:51Z
  output: |
    vitest: vai-man-nut-sinh, vai-man-dau-nut, bo-nut-vai-man, permitted-action xanh

- eval: E13
  run_id: minted-kiem-vai-theo-man-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cùng lượt vitest với E12, xanh

- eval: E16
  run_id: minted-kiem-vai-theo-man-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-13T15:32:51Z
  output: |
    cùng lượt vitest với E12, xanh

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-kiem-vai-theo-man-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T15:32:51Z

- cmd: make e2e
  run_id: minted-kiem-vai-theo-man-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-13T15:32:51Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào được liệt kê là không-phân-biệt. E11 xanh trên mã cũ và đỏ trên mã đang kiểm (baseline green), nên phân biệt được.

Lệnh fail không gắn eval: không có (lệnh `make check` đã gắn E11).

Baseline khong do
- npx vitest run tests/vai-man-so-man.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/vai-man-so-man.test.ts co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} bash -c 'J=$(mktemp -t vai-man).json; PLAYWRIGHT_JSON_OUTPUT_NAME=$J npx playwright test -c playwright.db.config.ts tests/e2e-db/vai.setup.ts tests/e2e-db/vai-man.spec.ts --reporter=list,json && node tests/e2e-db/vai-man-doi-chieu.mjs $J': bo qua baseline: tep tests/e2e-db/vai.setup.ts co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} node tests/e2e-db/pha-thu-vai-man.mjs: bo qua baseline: tep tests/e2e-db/pha-thu-vai-man.mjs co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/vai-man-nut-sinh.test.ts tests/vai-man-dau-nut.test.tsx tests/bo-nut-vai-man.test.ts src/modules/identity/permitted-action.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/vai-man-nut-sinh.test.ts co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, không có phương sai.

## Iterations

Round 1: E11 failed — `make check` đỏ ở bước make test (43 tệp test lỗi; ca tiêu biểu nằm trong bản sao cây do lệnh phá thử dựng, có dòng ERR_MODULE_NOT_FOUND). Returned to implementation.
