---
schema_version: 2
feature_slug: design-assembly-adopt-checks
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9c415b4f8c004cec4847d23e0f55a09ba6666c0a
human_signoff:
---

# Evidence Report: design-assembly-adopt-checks

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-design-assembly-adopt-checks-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-23T01:59:35Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-design-assembly-adopt-checks-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-design-assembly-adopt-checks-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-design-assembly-adopt-checks-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T06:12:12Z
  output: |
    ℹ duration_ms 664.928541

- eval: E5
  run_id: minted-design-assembly-adopt-checks-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T01:59:35Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-design-assembly-adopt-checks-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T06:12:12Z
  output: |
    shape: 8 rows gained a check, 2 rows added, no other row changed; files changed: 5

- eval: E7
  run_id: minted-design-assembly-adopt-checks-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/design-assembly-adopt-checks/rang/chay.sh
  verified_at: 2026-11-23T01:59:35Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-design-assembly-adopt-checks-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-23T06:12:12Z

- cmd: npm run build
  run_id: minted-design-assembly-adopt-checks-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-23T06:12:12Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-design-assembly-adopt-checks-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-23T06:12:12Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Eval khong-phan-biet (xanh ca tren HEAD lan baseline, chung minh harness chu khong phai feature):
- make check (E1)

Baseline khong do: round nay khong do lai (evals.yaml khong doi tu lan baseline cuoi); moi eval ghi n-a.

Khong co eval judgment nen khong co panel judge.

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic)

## Iterations

Round 1: E4, E6 failed — kế hoạch của hồ sơ nằm ngoài danh sách tệp được phép của ma trận (AC-4). Returned to implementation.
Round 2: E4, E6 chạy lại sau bản sửa, đạt; E1, E2, E3, E5, E7 carry-forward từ round 1 vì delta không chạm paths của chúng. Verdict PASS.

### Re-pin lần 1 — 2026-11-28, do VP11 lát 1 (PR #136): phép đo E4, E6, E7 sửa theo lỗi cũ đã hết trên main và khoảng commit cố định của PR #111 (G-2811-116)
run_id: repin-20261128T132730Z-54026
sha: 9c415b4f8c004cec4847d23e0f55a09ba6666c0a · suites: 3 lệnh exit 0 · evals: 7/7 eval máy đạt kỳ vọng
