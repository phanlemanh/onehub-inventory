---
schema_version: 2
feature_slug: dat-khoa-cau-hoi-hien
verdict: REJECT
failed_evals: ["E6b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0550b3b110925257360630186474a0028ce305ec
human_signoff:
---

# Evidence Report: dat-khoa-cau-hoi-hien

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E1t | AC-1 | script | PASS |
| E4 | AC-4 | script | PASS |
| E4b | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E5t | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | script | REJECT |
| E6c | AC-6 | script | PASS |
| E6d | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E7t | AC-7 | script | PASS |

Một eval đỏ: E6b (`make check`). Bài kiểm `tests/khong-khoa-bi-mat.test.ts` (quét bí mật trong tệp đã theo dõi) bắt dòng 38 của `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs` khớp mẫu «Postgres URL with a password other than local-only». Mười ba eval còn lại xanh. Không có lệnh fail nào không gắn eval.

## Evidence

- eval: E1
  run_id: minted-dat-khoa-cau-hoi-hien-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795863701528-25403)

- eval: E2
  run_id: minted-dat-khoa-cau-hoi-hien-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795863701528-25403)

- eval: E3
  run_id: minted-dat-khoa-cau-hoi-hien-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795863701528-25403)

- eval: E1t
  run_id: minted-dat-khoa-cau-hoi-hien-E1t-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    tu-kiem: 12/12 ca đúng (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795863700483-24661)

- eval: E4
  run_id: minted-dat-khoa-cau-hoi-hien-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    bai-kiem: 2/2 ca đúng (.acceptance-runs/dat-khoa-cau-hoi-hien/bai-kiem-1795863700967-24850)

- eval: E4b
  run_id: minted-dat-khoa-cau-hoi-hien-E4b-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795863701528-25403)

- eval: E5
  run_id: minted-dat-khoa-cau-hoi-hien-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    pham-vi ok: 25 tệp so với b9fcdd11; ngoài hồ sơ chỉ dat-khoa.mjs, bài kiểm mới và một dòng nhật ký; mọi dòng đổi của dat-khoa.mjs nằm trong hàm hỏi (dòng 83–113)

- eval: E5t
  run_id: minted-dat-khoa-cau-hoi-hien-E5t-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    tu-kiem: 4/4 ca đúng

- eval: E6
  run_id: minted-dat-khoa-cau-hoi-hien-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh
  verified_at: 2026-11-28T10:57:31Z
  output: |
    bai-deploy: tools/deploy xanh, có ca dat-khoa-ask

- eval: E6b
  run_id: minted-dat-khoa-cau-hoi-hien-E6b-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T10:57:31Z
  output: |
    tests/khong-khoa-bi-mat.test.ts (17 tests | 1 failed)
    no tracked file matches a secret pattern: FAILED
    secrets in tracked files:
    _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs:38 — Postgres URL with a password other than local-only
    Test Files  1 failed | 162 passed (163)
    Tests  1 failed | 2743 passed | 2 skipped (2746)
    make: *** [test] Error 1

- eval: E6c
  run_id: minted-dat-khoa-cau-hoi-hien-E6c-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-28T10:57:31Z
  output: |
    npm run build xanh (không có dòng tóm tắt)

- eval: E6d
  run_id: minted-dat-khoa-cau-hoi-hien-E6d-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-28T10:57:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E7
  run_id: minted-dat-khoa-cau-hoi-hien-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    ci ok: đầu nhánh 5d2d1e32ebe3a17832f598b2504f703b44cc3fa9 quick, e2e, e2e-db xanh (gate: completed/failure)

- eval: E7t
  run_id: minted-dat-khoa-cau-hoi-hien-E7t-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs
  verified_at: 2026-11-28T10:57:31Z
  output: |
    tu-kiem: 4/4 ca đúng

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

### Baseline khong do

- node _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E6b failed — `make check` đỏ vì bài kiểm quét bí mật bắt dòng 38 của `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs` (chuỗi Postgres có mật khẩu thử, khớp mẫu bí mật). Returned to implementation.
