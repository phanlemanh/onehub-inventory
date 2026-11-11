---
schema_version: 2
feature_slug: cach-ly-moi-san
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2ac804f6a5b90a4fc519ec63d1d681bab9ad5722
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: cach-ly-moi-san

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cach-ly-moi-san-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E2
  run_id: minted-cach-ly-moi-san-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E3
  run_id: minted-cach-ly-moi-san-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E4
  run_id: minted-cach-ly-moi-san-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E5
  run_id: minted-cach-ly-moi-san-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E6
  run_id: minted-cach-ly-moi-san-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E7
  run_id: minted-cach-ly-moi-san-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:29:44Z
  output: |
    make test hoàn tất, bài kiểm with-company.test.ts đạt

- eval: E8
  run_id: minted-cach-ly-moi-san-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:29:44Z
  output: |
    make test hoàn tất, bài kiểm one-door.test.ts đạt

- eval: E9
  run_id: minted-cach-ly-moi-san-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:29:44Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-cach-ly-moi-san-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-11T03:29:44Z

- cmd: npm run build
  run_id: minted-cach-ly-moi-san-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-11T03:29:44Z

- cmd: make e2e
  run_id: minted-cach-ly-moi-san-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-11T03:29:44Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (pass trên cả HEAD lẫn baseline), nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:
- make test: E7, E8

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chấm vòng 1, có lỗi, đã sửa (commit 1197da9). Returned to implementation.
Round 2: chấm vòng 2, dừng vì cùng lớp lỗi với vòng 1; chủ kho đổi cách tiếp cận và sửa (commit 0aa097a, 2ac804f).
Round 3: toàn bộ E1-E9 và lệnh suite đều xanh, verdict PASS.
