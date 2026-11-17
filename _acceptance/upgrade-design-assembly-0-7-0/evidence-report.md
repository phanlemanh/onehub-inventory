---
schema_version: 2
feature_slug: upgrade-design-assembly-0-7-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5c1c11fb98b174dd287d97bb8111ef6f5db5ec6e
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-7-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-8 | test | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-3 | script | PASS |
| E16 | AC-4 | script | PASS |
| E17 | AC-5 | script | PASS |
| E18 | AC-6 | script | PASS |
| E19 | AC-7 | script | PASS |
| E20 | AC-8 | script | PASS |
| E21 | AC-9 | script | PASS |
| E22 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: r2-l1-1-20261117044815
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-17T04:48:15Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E2
  run_id: r2-l2-1-20261117044815
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_shallow_check
  verified_at: 2026-11-17T04:48:15Z
  output: |
    shallow: make check green on a depth-1 clone of 5c1c11fb with origin; 2460 tests passed; it drew 4 derived files absent before, none tracked

- eval: E14
  run_id: minted-upgrade-design-assembly-0-7-0-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_change_list
  verified_at: 2026-11-17T04:48:15Z
  output: |
    changes: the upgrade commit changes exactly its 81 files, each in one of 13 groups; the branch changes 120 files, all of them the upgrade's or this record's

- eval: E3
  run_id: minted-upgrade-design-assembly-0-7-0-E3-r1
  exit_code: 0
  verifier: config:executors.script.da070_shallow_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-upgrade-design-assembly-0-7-0-E4-r1
  exit_code: 0
  verifier: config:executors.script.da070_tool_tree
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-upgrade-design-assembly-0-7-0-E5-r1
  exit_code: 0
  verifier: config:executors.script.da070_release_ledger
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-upgrade-design-assembly-0-7-0-E6-r1
  exit_code: 0
  verifier: config:executors.script.da070_out_of_git
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-upgrade-design-assembly-0-7-0-E7-r1
  exit_code: 0
  verifier: config:executors.script.da070_fragments_equal
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-upgrade-design-assembly-0-7-0-E8-r1
  exit_code: 0
  verifier: config:executors.script.da070_two_branch_merge
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: r1-l9-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_affected_merges
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-upgrade-design-assembly-0-7-0-E10-r1
  exit_code: 0
  verifier: config:executors.script.da070_proof_gate_fragments
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-upgrade-design-assembly-0-7-0-E11-r1
  exit_code: 0
  verifier: config:executors.script.da070_law_day
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-upgrade-design-assembly-0-7-0-E12-r1
  exit_code: 0
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: r1-l13-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_audit_diff
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E16
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E18
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E19
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E20
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E21
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E22
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-7-0-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-17T04:48:15Z

- cmd: make e2e
  run_id: minted-upgrade-design-assembly-0-7-0-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-17T04:48:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline):
- E1 (make check): xanh trên cả code cũ lẫn mới, là regression-guard có chủ ý cho AC-1; phần phân biệt do E3 và E20 gánh.

Baseline không đo:
- node _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy nhiều lần đều đồng nhất (mọi eval có runs: 1, xác định).

## Iterations

Round 1: bị từ chối vì bộ lint của chính hồ sơ này; kế hoạch được định dạng lại. Quay lại triển khai.
Round 2: E1, E2, E14 chạy lại và xanh; E3 đến E13 và E15 đến E22 mang từ round 1 (delta không chạm paths của eval); không có judgment item nào cần người. Verdict PASS.
