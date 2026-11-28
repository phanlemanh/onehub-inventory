---
schema_version: 2
feature_slug: migration-vai-chu-khong-sieu-cap
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d0e8629afd039a239bde948ad32b1161f765fd3f
human_signoff: Manh Phan 2026-11-28
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
| E7 | AC-7 | script | PASS |
| E7t | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | test | PASS |
| E8c | AC-8 | script | PASS |
| E8d | AC-8 | script | PASS |
| E8e | AC-8 | script | PASS |

## Evidence

- eval: E6
  run_id: minted-migration-vai-chu-khong-sieu-cap-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs
  verified_at: 2026-11-28T05:04:45Z
  output: |
    pham-vi ok: 30 tệp so với 2df6f190, migration chỉ thêm (2 tệp), ngoài hồ sơ chỉ đúng tệp của thiết kế

- eval: E6t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E6t-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs
  verified_at: 2026-11-28T05:04:45Z
  output: |
    tu-kiem: 4/4 ca đúng

- eval: E7
  run_id: 46109403515
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs
  verified_at: 2026-11-28T05:04:45Z
  output: |
    ci ok: đầu nhánh d0e8629a run 46109403515 quick, check, e2e, e2e-db xanh · e2e-db dùng lại run 46105792872 ở 76665d28 trên postgres:16, 6/6 bước, có bài chu-khong-sieu-cap

- eval: E7t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E7t-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs
  verified_at: 2026-11-28T05:04:45Z
  output: |
    tu-kiem: 15/15 ca đúng

- eval: E8c
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8c-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T05:04:45Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E8d
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8d-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-28T05:04:45Z
  output: |
    (lệnh build không in dòng tóm tắt)

- eval: E8e
  run_id: bj2vktl35
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-28T05:04:45Z
  output: |
    gac-hydration: 0 canh bao

- eval: E1
  run_id: minted-migration-vai-chu-khong-sieu-cap-E1-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-migration-vai-chu-khong-sieu-cap-E2-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-migration-vai-chu-khong-sieu-cap-E3-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-migration-vai-chu-khong-sieu-cap-E4-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-migration-vai-chu-khong-sieu-cap-E5-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E1t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E1t-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8b
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8b-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/bai-kiem.sh
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Ghi chú: E6, E6t, E7, E7t, E8c có baseline n-a (xem mục dưới); E8d và E8e red trên baseline.

### Baseline khong do

- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base 2df6f1903f4dca319f1163f3966ea556f55aff89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs --tu-kiem: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base 2df6f1903f4dca319f1163f3966ea556f55aff89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --cho 60: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base 2df6f1903f4dca319f1163f3966ea556f55aff89 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --tu-kiem --cho 60: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base 2df6f1903f4dca319f1163f3966ea556f55aff89 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1–E5, E1t, E8, E8b chạy và đạt; các eval này được giữ nguyên ở round 3 vì delta không chạm paths của chúng.
Round 2: không có dữ liệu trong payload round này.
Round 3: E6, E6t, E7, E7t, E8c, E8d, E8e chạy lại trên d0e8629a và đạt; verdict PASS.
