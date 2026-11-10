---
schema_version: 2
feature_slug: du-lieu-mau
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4239410fe72ac7e3af72b9b8c11ef3dbbffe9496
human_signoff:
---

# Evidence Report: du-lieu-mau

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
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-du-lieu-mau-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-1 trong tests/sample-data.test.ts

- eval: E2
  run_id: minted-du-lieu-mau-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-2

- eval: E3
  run_id: minted-du-lieu-mau-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-3

- eval: E4
  run_id: minted-du-lieu-mau-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-4

- eval: E5
  run_id: minted-du-lieu-mau-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-5

- eval: E6
  run_id: minted-du-lieu-mau-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-6

- eval: E7
  run_id: minted-du-lieu-mau-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-7

- eval: E8
  run_id: minted-du-lieu-mau-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make test: toàn bộ bài kiểm đạt, gồm ca AC-8

- eval: E9
  run_id: minted-du-lieu-mau-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-10T23:34:50Z
  output: |
    make check xanh
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-du-lieu-mau-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-10T23:34:50Z

- cmd: make e2e
  run_id: minted-du-lieu-mau-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-10T23:34:50Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (pass trên cả HEAD lẫn baseline): E1, E2, E3, E4, E5, E6, E7, E8 (lệnh make test). Cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bị REJECT ở bước S4, đã sửa và ghi lại ở commit 4239410. Returned to implementation.
Round 2: toàn bộ E1-E9 và hai lệnh suite (npm run build, make e2e) đạt; verdict PASS.
