---
schema_version: 2
feature_slug: nang-kit-3-0
verdict: REJECT
failed_evals: ["E2"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 523d15656bd5987960f203b3d603d6977e69f30a
human_signoff:
---

# Evidence Report: nang-kit-3-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carried từ round 1) |
| E2 | AC-2 | script | FAIL |
| E3 | AC-3 | script | PASS (carried từ round 1) |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS (carried từ round 1) |
| E6 | AC-5 | script | PASS (carried từ round 1) |
| E7 | AC-6 | script | PASS (carried từ round 1) |
| E8 | AC-7 | script | PASS (carried từ round 1) |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS (carried từ round 1) |

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-0-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_ci_kit
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: r2-l1-1-20261118084802
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.nk30_gate_branch
  verified_at: 2026-11-18T08:48:02Z
  output: |
    gate-branch: VIOLATION outside the lifecycle reasons of nang-kit-3-0: VIOLATION [nang-kit-3-0]: the record's own verdict is REJECT (must be PASS to merge)
    Lệnh: node _acceptance/nang-kit-3-0/rang/gate-branch.mjs

- eval: E3
  run_id: minted-nang-kit-3-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_control
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-nang-kit-3-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_product_map
  verified_at: 2026-11-18T08:48:02Z
  output: |
    executor-scripts: 4 executor commands under the kit root (script.product_map, design.floor, design.khuon, design.ui_check), 4 scripts, all present in kit v3.0.0 plugins/acceptance-gate

- eval: E5
  run_id: minted-nang-kit-3-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nk30_kit_root
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-nang-kit-3-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_kit_root_cli
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-nang-kit-3-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_settings
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-nang-kit-3-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_doc_commands
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-nang-kit-3-0-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_leftover
  verified_at: 2026-11-18T08:48:02Z
  output: |
    leftover: 0 lines at HEAD; 14 lines in 5 files at 8925e8ff

- eval: E10
  run_id: r2-l4-1-20261118084802
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-18T08:48:02Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-nang-kit-3-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_two_way
  verified_at: 2026-11-18T08:00:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-0-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-18T08:48:02Z

- cmd: make e2e
  run_id: bzavkrle4
  exit_code: 0
  verified_at: 2026-11-18T08:48:02Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E5 (npx vitest run tests/kit-root.test.ts --coverage.enabled=false --reporter=verbose)
- E10 (make check)

Lệnh fail không gắn eval: không có. Lệnh fail duy nhất là `node _acceptance/nang-kit-3-0/rang/gate-branch.mjs`, gắn với E2.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — 11/11 eval xanh, nhưng make e2e đỏ trên máy này như ở baseline. Returned to implementation.
Round 2: E2 failed — gate-branch chạy luật kit v3.0.0 trên chính hồ sơ này và báo một dòng VIOLATION nằm ngoài các lý do vòng đời của nang-kit-3-0, vì hồ sơ vẫn đang ở verdict REJECT. make e2e và npm run build xanh trong round này. Returned to implementation.
