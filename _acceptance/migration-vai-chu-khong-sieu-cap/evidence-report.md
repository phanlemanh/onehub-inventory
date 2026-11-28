---
schema_version: 2
feature_slug: migration-vai-chu-khong-sieu-cap
verdict: REJECT
failed_evals: ["E7"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 04e322d7a90a6b1907680e8d925f719ef67816ba
human_signoff:
---

# Evidence Report: migration-vai-chu-khong-sieu-cap

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E1t | AC-3 | script | PASS |
| E6 | AC-6 | script | PASS |
| E6t | AC-6 | script | PASS |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | test | PASS |
| E8c | AC-8 | script | PASS |
| E8d | AC-8 | script | PASS |
| E8e | AC-8 | script | PASS |

Lệnh không gắn eval và đỏ: không có. Lệnh đỏ duy nhất là `node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --cho 60`, gắn với E7.

## Evidence

- eval: E1
  run_id: minted-migration-vai-chu-khong-sieu-cap-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    kiem: 7/7 ca đạt (postgres 17.12 (Debian 17.12-1.pgdg13+1))

- eval: E2
  run_id: minted-migration-vai-chu-khong-sieu-cap-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    kiem: 7/7 ca đạt (postgres 17.12 (Debian 17.12-1.pgdg13+1))

- eval: E3
  run_id: minted-migration-vai-chu-khong-sieu-cap-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    kiem: 7/7 ca đạt (postgres 17.12 (Debian 17.12-1.pgdg13+1))

- eval: E4
  run_id: minted-migration-vai-chu-khong-sieu-cap-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    kiem: 7/7 ca đạt (postgres 17.12 (Debian 17.12-1.pgdg13+1))

- eval: E5
  run_id: minted-migration-vai-chu-khong-sieu-cap-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    kiem: 7/7 ca đạt (postgres 17.12 (Debian 17.12-1.pgdg13+1))

- eval: E1t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E1t-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    tu-kiem: 5/5 ca đúng (postgres 17.12 (Debian 17.12-1.pgdg13+1))

- eval: E6
  run_id: minted-migration-vai-chu-khong-sieu-cap-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    pham-vi ok: 25 tệp so với c55415fe, migration chỉ thêm (2 tệp), ngoài hồ sơ chỉ đúng tệp của thiết kế

- eval: E6t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E6t-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    tu-kiem: 4/4 ca đúng

- eval: E7
  run_id: minted-migration-vai-chu-khong-sieu-cap-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    ci: e2e-db trên commit mã 73231e21 không xanh (cancelled)

- eval: E8
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  output: |
    kiem: 7/7 ca đạt (postgres 16.15 (Debian 16.15-1.pgdg13+2))

- eval: E8b
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/bai-kiem.sh
  verified_at: 2026-11-28T03:07:31Z
  output: |
    (lệnh không in dòng tóm tắt)

- eval: E8c
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8c-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T03:07:31Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E8d
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8d-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-28T03:07:31Z
  output: |
    (lệnh không in dòng tóm tắt)

- eval: E8e
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8e-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-28T03:07:31Z
  output: |
    gac-hydration: 0 canh bao

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

### Baseline khong do

- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs --pg 17: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs --pg 17 --tu-kiem: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs --tu-kiem: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --cho 60: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs --pg 16: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/migration-vai-chu-khong-sieu-cap/rang/bai-kiem.sh: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/bai-kiem.sh co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7 failed — lượt CI e2e-db trên commit mã 73231e21 bị hủy (cancelled), chưa có lượt xanh chạy thật. Returned to implementation.
