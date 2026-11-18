---
schema_version: 2
feature_slug: nang-kit-3-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9bbc4180c545dcf6fcd1ec958d7787fc7ff6dc16
human_signoff:
---

# Evidence Report: nang-kit-3-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-0-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_ci_kit
  verified_at: 2026-11-18T10:05:41Z
  output: |
    ci-kit: gate fetches phanlemanh/delivery-loop v3.0.0 at c16d25db; CLAUDE_PLUGIN_ROOT=<kit>/plugins/acceptance-gate has scripts/pre-merge-check.sh and scripts/product-map.mjs; the gate job differs from origin/main in 3 lines

- eval: E2
  run_id: minted-nang-kit-3-0-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_branch
  verified_at: 2026-11-18T10:05:41Z
  output: |
    gate-branch: kit v3.0.0 ran its rules on HEAD against origin/main; 1 VIOLATION lines, all naming nang-kit-3-0

- eval: E3
  run_id: minted-nang-kit-3-0-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_gate_control
  verified_at: 2026-11-18T10:05:41Z
  output: |
    gate-control: on 8925e8ff --recheck-all, kit v2.38.1 and v3.0.0 both 0 VIOLATION, 57 OK each, same records (merge-base is 8925e8ff)

- eval: E4
  run_id: minted-nang-kit-3-0-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_product_map
  verified_at: 2026-11-18T10:05:41Z
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
  run_id: minted-nang-kit-3-0-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_kit_root_cli
  verified_at: 2026-11-18T10:05:41Z
  output: |
    kit-root cli: old-only -> empty; new-only -> new; both -> new; project beats user

- eval: E7
  run_id: minted-nang-kit-3-0-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_settings
  verified_at: 2026-11-18T10:05:41Z
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.0.0 = KIT_TAG of ci.yml; 6 plugins on, equal to the kit marketplace; no @acceptance-gate-kit key; superpowers, permissions and hooks as on origin/main

- eval: E8
  run_id: minted-nang-kit-3-0-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_doc_commands
  verified_at: 2026-11-18T10:05:41Z
  output: |
    doc-commands: 4 command mentions (3 distinct) and 1 kit path in 3 files, all found in kit v3.0.0

- eval: E9
  run_id: minted-nang-kit-3-0-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_leftover
  verified_at: 2026-11-18T10:05:41Z
  output: |
    leftover: 0 lines at HEAD; 14 lines in 5 files at 8925e8ff

- eval: E10
  run_id: minted-nang-kit-3-0-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-18T10:05:41Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-nang-kit-3-0-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nk30_two_way
  verified_at: 2026-11-18T10:05:41Z
  output: |
    ℹ duration_ms 100370.702208

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-0-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-18T10:05:41Z

- cmd: make e2e
  run_id: minted-nang-kit-3-0-SUITE-make_e2e-r5
  exit_code: 0
  verified_at: 2026-11-18T10:05:41Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 4 — baseline khong do lai round nay

Baseline khong do: moi eval round nay mang baseline n-a vi evals.yaml khong doi tu lan baseline cuoi (round 4).

Non-discriminating evals (xanh tren CA HEAD lan baseline, chung minh harness chu khong phai feature; viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- E10 (make check)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — make e2e failed, already failing at baseline and accepted by the owner at Gate 1. Returned to implementation.
Round 4: REJECT — 13/13 two-way cases passed, but the cleanup hook saw a temp worktree of a concurrent run. Hook now checks only its own temp worktrees.
Round 5: all machine evals passed, E5 carried from round 1; verdict PASS.
