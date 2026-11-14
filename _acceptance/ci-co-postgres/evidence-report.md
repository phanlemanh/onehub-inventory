---
schema_version: 2
feature_slug: ci-co-postgres
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dd333930b60b6b2f20d19006a13e3d8cfa7b4de8
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: ci-co-postgres

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | script | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: r2-l1-1-20261113145028
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T14:50:28Z
  output: |
    ci-thu: xanh 14.6 phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do

- eval: E2
  run_id: r2-l1-1-20261113145028
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T14:50:28Z
  output: |
    ci-thu: xanh 14.6 phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do

- eval: E3
  run_id: minted-ci-co-postgres-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T14:50:28Z
  output: |
    vitest run: tests/ci-db.test.ts, tests/dem-giao-nhan.test.ts, tests/don-dung-tam.test.ts, tests/ci-ban-sao-nong.test.ts, tests/ci-yml-patch.test.ts — all passed

- eval: E4
  run_id: minted-ci-co-postgres-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T14:50:28Z
  output: |
    vitest run: same five test files — all passed

- eval: E5
  run_id: r2-l1-1-20261113145028
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T14:50:28Z
  output: |
    ci-thu: xanh 14.6 phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do

- eval: E6
  run_id: r2-l1-1-20261113145028
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T14:50:28Z
  output: |
    ci-thu: xanh 14.6 phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do

- eval: E7
  run_id: minted-ci-co-postgres-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T14:50:28Z
  output: |
    vitest run: same five test files — all passed

- eval: E8
  run_id: minted-ci-co-postgres-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T14:50:28Z
  output: |
    vitest run: same five test files — all passed

- eval: E8b
  run_id: r2-l1-1-20261113145028
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_thu
  verified_at: 2026-11-13T14:50:28Z
  output: |
    ci-thu: xanh 14.6 phút · check xanh · pha bo-phien do · pha vai-chu do · pha may-chu-chu do

- eval: E9
  run_id: minted-ci-co-postgres-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_kiem
  verified_at: 2026-11-13T14:50:28Z
  output: |
    vitest run: same five test files — all passed

- eval: E10
  run_id: 43440859796
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ci_db_that
  verified_at: 2026-11-13T14:50:28Z
  output: |
    run 43440859796 · e2e-db 18.6 phut · tong CI 26.5 (main 29.8)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-ci-co-postgres-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-13T14:50:28Z

- cmd: npm run build
  run_id: minted-ci-co-postgres-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T14:50:28Z

- cmd: make e2e
  run_id: minted-ci-co-postgres-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-13T14:50:28Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — không eval nào đo được baseline (cả ba lệnh eval đều là tệp mới so với merge-base), nên không có eval nào được chứng minh là không phân biệt.

Baseline khong do
- bash db/scripts/ci-thu.sh: bo qua baseline: tep db/scripts/ci-thu.sh co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/ci-db.test.ts tests/dem-giao-nhan.test.ts tests/don-dung-tam.test.ts tests/ci-ban-sao-nong.test.ts tests/ci-yml-patch.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/ci-db.test.ts co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi
- node db/scripts/ci-that.mjs --cho 60: bo qua baseline: tep db/scripts/ci-that.mjs co o cay dang kiem nhung chua co o merge-base ab97dffab8a4d8dfe3a5b8951b13f2a9287cb902 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: findings về phép quét lịch sử git được xử lý trong commit 46bc6ed (history scan as a class, ci-thu break env, ci-that by commit). Returned to implementation.
Round 2: toàn bộ eval và lệnh suite xanh; ba finding ngoài hợp đồng ghi ở review-findings.md để người quyết.

### Re-pin lần 1 — 2026-11-14, do gộp nhánh chính (9b, hàng 4) trước khi gộp PR #48
run_id: repin-20261114T004254Z-20401
sha: b1b49efd50840fb552d9b8ed5a44373b5b3b236a · suites: 3 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-11-14, do VP1: phép đếm nhận --tep-bai, bài đơn vị chạy theo danh sách tệp của bản mẫu (sửa sau chữ ký)
run_id: repin-20261114T071608Z-61278
sha: dd333930b60b6b2f20d19006a13e3d8cfa7b4de8 · suites: 3 lệnh exit 0 · evals: 11/11 eval máy đạt kỳ vọng
