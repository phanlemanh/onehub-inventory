---
schema_version: 2
feature_slug: cong-bat-khoi-khong-ke
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 34d6da84a38acf3288e6530a5ffbe93d03bb8add
human_signoff:
---

# Evidence Report: cong-bat-khoi-khong-ke

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-cong-bat-khoi-khong-ke-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-cong-bat-khoi-khong-ke-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-cong-bat-khoi-khong-ke-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-cong-bat-khoi-khong-ke-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-cong-bat-khoi-khong-ke-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-cong-bat-khoi-khong-ke-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-cong-bat-khoi-khong-ke-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T15:17:37Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-cong-bat-khoi-khong-ke-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-14T15:32:27Z

- cmd: npm run build
  run_id: minted-cong-bat-khoi-khong-ke-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T15:32:27Z

- cmd: make e2e
  run_id: minted-cong-bat-khoi-khong-ke-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-14T15:32:27Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

none — baseline khong do lai round nay (field baseline cua moi eval la n-a); khong co eval nao duoc danh dau khong-phan-biet.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E7 passed. Khong co eval failed.
Round 2: ba lenh suite (make check, npm run build, make e2e) chay lai va xanh; E1-E7 carry-forward tu round 1 vi delta khong cham paths cua eval. Khong co judgment item, khong co judge panel.

### Re-pin lần 1 — 2026-11-14, do gộp nhánh chính 56415b0 (sau hàng 7e)
run_id: repin-20261114T164336Z-10203
sha: 6bbc29080f6f5550a37585e0e965aceb1fedf056 · suites: 3 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng

### Re-pin lần 2 — 2026-11-14, do gộp nhánh chính 93a72dd (sau hàng 9c)
run_id: repin-20261114T165429Z-69546
sha: 34d6da84a38acf3288e6530a5ffbe93d03bb8add · suites: 3 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng
