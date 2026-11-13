---
schema_version: 2
feature_slug: ho-so-du-thong-tin
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8030e36da81e02e06246f1c074cea992a45cfbea
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: ho-so-du-thong-tin

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carried từ round 2) |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | script | PASS (carried từ round 2) |
| E8 | AC-8 | script | PASS (carried từ round 2) |
| E9 | AC-9 | script | PASS (carried từ round 2) |
| E10 | AC-10 | ui-check | PASS (carried từ round 2) |
| E11 | AC-8 | script | PASS (carried từ round 2) |
| E12 | AC-10 | script | PASS (carried từ round 2) |

## Evidence

- eval: E2
  run_id: minted-ho-so-du-thong-tin-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:22:08Z
  output: |
    make test hoàn tất, tất cả tệp test xanh (lệnh chung với E3, E4, E5, E6).

- eval: E3
  run_id: minted-ho-so-du-thong-tin-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:22:08Z
  output: |
    make test hoàn tất, tất cả tệp test xanh (lệnh chung với E2, E4, E5, E6).

- eval: E4
  run_id: minted-ho-so-du-thong-tin-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:22:08Z
  output: |
    make test hoàn tất, tất cả tệp test xanh (lệnh chung với E2, E3, E5, E6).

- eval: E5
  run_id: minted-ho-so-du-thong-tin-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:22:08Z
  output: |
    make test hoàn tất, tất cả tệp test xanh (lệnh chung với E2, E3, E4, E6).

- eval: E6
  run_id: minted-ho-so-du-thong-tin-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:22:08Z
  output: |
    make test hoàn tất, tất cả tệp test xanh (lệnh chung với E2, E3, E4, E5).

- eval: E1
  run_id: b984ked9y
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E7
  run_id: minted-ho-so-du-thong-tin-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E8
  run_id: minted-ho-so-du-thong-tin-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E9
  run_id: minted-ho-so-du-thong-tin-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E10
  run_id: minted-ho-so-du-thong-tin-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: ui-check
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E11
  run_id: minted-ho-so-du-thong-tin-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E12
  run_id: minted-ho-so-du-thong-tin-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T11:57:48Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-ho-so-du-thong-tin-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-13T14:22:08Z

- cmd: npm run build
  run_id: minted-ho-so-du-thong-tin-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-13T14:22:08Z

- cmd: make e2e
  run_id: minted-ho-so-du-thong-tin-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-13T14:22:08Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline ở round 2): E1 (make check), E11 (khuôn thiết kế), E12 (sàn thiết kế). Cần viết lại để khẳng định hành vi mới hoặc xác nhận là lớp chắn hồi quy có chủ ý. Round này baseline không đo lại, trường baseline ghi n-a.

Lệnh suite không gắn eval: không có.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: eval về thứ tự lần chào, giá so với dữ liệu mẫu, giá và ngày trên một dòng, đầu hồ sơ cuộn về tầm nhìn đỏ. Returned to implementation (commit 472bab8).
Round 2: E2, E3, E4, E5, E6 failed — `make test` không hoàn tất: 14 tệp test lỗi, 35 test lỗi, 3 lỗi chưa xử lý; vitest không khởi động được worker cho tests/ho-so-du-thong-tin.test.tsx và tests/label.test.ts (hết thời gian chờ). Nguyên nhân là hạ tầng (máy ngủ). E1, E7, E8, E9, E10, E11, E12 và npm run build xanh. Returned to implementation.
Round 3: make test, make check, npm run build và make e2e (988 test) đều xanh; E2 đến E6 chạy lại xanh, các eval còn lại mang từ round 2 vì delta không chạm paths của chúng. Verdict PASS.
