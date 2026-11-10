---
schema_version: 2
feature_slug: du-lieu-mau
verdict: REJECT
failed_evals: ["E9"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 032ab793777aa7bf879d074b8d7faf04f97abd89
human_signoff:
---

# Evidence Report: du-lieu-mau

Round 1. Lệnh `make check` (E9) đỏ ở bước lint nên verdict là REJECT. Các eval E1-E8 xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | FAIL |

## Evidence

- eval: E1
  run_id: minted-du-lieu-mau-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-1 trong tests/sample-data.test.ts).

- eval: E2
  run_id: minted-du-lieu-mau-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-2).

- eval: E3
  run_id: minted-du-lieu-mau-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-3).

- eval: E4
  run_id: minted-du-lieu-mau-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-4).

- eval: E5
  run_id: minted-du-lieu-mau-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-5).

- eval: E6
  run_id: minted-du-lieu-mau-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-6).

- eval: E7
  run_id: minted-du-lieu-mau-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-7).

- eval: E8
  run_id: minted-du-lieu-mau-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:12:53Z
  output: |
    make test chạy một lần, toàn bộ bài kiểm đạt (gồm ca AC-8).

- eval: E9
  run_id: minted-du-lieu-mau-E9-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-10T23:12:53Z
  output: |
    2037:1    error    'log' is not defined      no-undef
    2054:1    error    'phase' is not defined    no-undef
    2088:3    error    'log' is not defined      no-undef
    2167:3    error    'log' is not defined      no-undef
    ✖ 200 problems (189 errors, 11 warnings)
    make: *** [lint] Error 1
    Bước lint trong make check dừng, nên các bước sau của make check không được chứng minh trong lần chạy này.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-du-lieu-mau-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-10T23:12:53Z

- cmd: make e2e
  run_id: minted-du-lieu-mau-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-10T23:12:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline): E1, E2, E3, E4, E5, E6, E7, E8 (lệnh make test). Cần viết lại để khẳng định hành vi mới, hoặc xác nhận đây là regression-guard có chủ ý.

Lệnh `make check` (E9) fail ở bước lint (no-undef cho `args`, `log`, `phase`), baseline green. Không có eval nào bị chặn hay cannotRun.

## Variance

none — mọi eval chạy một lần, kết quả đồng nhất.

## Iterations

Round 1: E9 failed — make check dừng ở bước lint (200 vấn đề, 189 lỗi no-undef). Returned to implementation.
