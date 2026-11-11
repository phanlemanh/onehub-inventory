---
schema_version: 2
feature_slug: bo-bai-kiem-tu-so-man
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 27a021395d0b8b2370d01aec6150b7a37d94c41d
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: bo-bai-kiem-tu-so-man

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bo-bai-kiem-tu-so-man-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T09:02:00Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    (covers E1, E2, E10 in one run)
    __EXIT=0

- eval: E2
  run_id: minted-bo-bai-kiem-tu-so-man-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T09:02:00Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E3
  run_id: minted-bo-bai-kiem-tu-so-man-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make e2e (covers E3, E4, E6, E7, E8, E9 in one run)
    512 passed (3.9m)
    __EXIT=0

- eval: E4
  run_id: minted-bo-bai-kiem-tu-so-man-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make e2e
    512 passed (3.9m)
    __EXIT=0

- eval: E5
  run_id: minted-bo-bai-kiem-tu-so-man-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make test
    __EXIT=0

- eval: E6
  run_id: minted-bo-bai-kiem-tu-so-man-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make e2e
    512 passed (3.9m)
    __EXIT=0

- eval: E7
  run_id: minted-bo-bai-kiem-tu-so-man-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make e2e
    512 passed (3.9m)
    __EXIT=0

- eval: E8
  run_id: minted-bo-bai-kiem-tu-so-man-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make e2e
    512 passed (3.9m)
    __EXIT=0

- eval: E9
  run_id: minted-bo-bai-kiem-tu-so-man-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T09:02:00Z
  output: |
    make e2e
    512 passed (3.9m)
    __EXIT=0

- eval: E10
  run_id: minted-bo-bai-kiem-tu-so-man-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T09:02:00Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-11T09:02:00Z

- cmd: npm run build
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-11T09:02:00Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Baseline khong do: round nay không đo lại (evals.yaml không đổi từ lần đo baseline cuối ở round 2); field baseline của mọi eval ghi n-a.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, carried): E5 (make test). Cần viết lại để khẳng định hành vi mới, hoặc xác nhận là lớp bảo vệ hồi quy có chủ ý.

## Variance

none — every multi-run eval is uniform (mọi eval chạy 1 lần, deterministic)

## Iterations

Round 1: lịch sử không được truyền xuống round này; xem run-log.jsonl.
Round 2: lịch sử không được truyền xuống round này; xem run-log.jsonl. Baseline đo ở round này.
Round 3: mọi eval E1-E10 xanh, lệnh suite make check và npm run build xanh. Verdict PASS.
