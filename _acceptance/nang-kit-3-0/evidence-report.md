---
schema_version: 2
feature_slug: nang-kit-3-0
verdict: REJECT
failed_evals: ["E11"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: bd3a25c9f8578c7cf7895af7055da71008d3598e
human_signoff:
---

# Evidence Report: nang-kit-3-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS (carried from round 1) |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-10 | script | FAIL |

E11 fails: 13 of 14 node:test cases pass, and the `after` hook asserts "temp worktrees left behind" because one detached worktree under the temp folder (`nk30-wt-2WgEOi/tree`, HEAD 4df00b78) was not removed. The contract expects `pass 13` and `fail 0`; the run printed `pass 13` and `fail 1`.

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-0-E1-r4
  baseline: n-a
  verifier: config:executors.script.nk30_ci_kit
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    ci-kit: gate fetches phanlemanh/delivery-loop v3.0.0 at c16d25db; CLAUDE_PLUGIN_ROOT=<kit>/plugins/acceptance-gate has scripts/pre-merge-check.sh and scripts/product-map.mjs; the gate job differs from origin/main in 3 lines

- eval: E2
  run_id: minted-nang-kit-3-0-E2-r4
  baseline: n-a
  verifier: config:executors.script.nk30_gate_branch
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    gate-branch: kit v3.0.0 ran its rules on HEAD against origin/main; 1 VIOLATION lines, all naming nang-kit-3-0

- eval: E3
  run_id: minted-nang-kit-3-0-E3-r4
  baseline: n-a
  verifier: config:executors.script.nk30_gate_control
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    gate-control: on 8925e8ff --recheck-all, kit v2.38.1 and v3.0.0 both 0 VIOLATION, 57 OK each, same records (merge-base is 8925e8ff)

- eval: E4
  run_id: minted-nang-kit-3-0-E4-r4
  baseline: n-a
  verifier: config:executors.script.nk30_product_map
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    executor-scripts: 4 executor commands under the kit root (script.product_map, design.floor, design.khuon, design.ui_check), 4 scripts, all present in kit v3.0.0 plugins/acceptance-gate

- eval: E5
  run_id: minted-nang-kit-3-0-E5-r1
  carried_from_round: 1
  exit_code: 0
  verifier: config:executors.test.nk30_kit_root
  verified_at: 2026-11-18T08:00:21Z
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-nang-kit-3-0-E6-r4
  baseline: n-a
  verifier: config:executors.script.nk30_kit_root_cli
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    kit-root cli: old-only -> empty; new-only -> new; both -> new; project beats user

- eval: E7
  run_id: minted-nang-kit-3-0-E7-r4
  baseline: n-a
  verifier: config:executors.script.nk30_settings
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.0.0 = KIT_TAG of ci.yml; 6 plugins on, equal to the kit marketplace; no @acceptance-gate-kit key; superpowers, permissions and hooks as on origin/main

- eval: E8
  run_id: minted-nang-kit-3-0-E8-r4
  baseline: n-a
  verifier: config:executors.script.nk30_doc_commands
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    doc-commands: 4 command mentions (3 distinct) and 1 kit path in 3 files, all found in kit v3.0.0

- eval: E9
  run_id: minted-nang-kit-3-0-E9-r4
  baseline: n-a
  verifier: config:executors.script.nk30_leftover
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    leftover: 0 lines at HEAD; 14 lines in 5 files at 8925e8ff

- eval: E10
  run_id: minted-nang-kit-3-0-E10-r4
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 0
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-nang-kit-3-0-E11-r4
  baseline: n-a
  verifier: config:executors.script.nk30_two_way
  verified_at: 2026-11-18T09:43:31Z
  exit_code: 1
  output: |
    tests 14, pass 13, fail 1
    failing: _acceptance/nang-kit-3-0/rang/two-way.mjs:56 (after hook)
    AssertionError: temp worktrees left behind
    actual: one detached worktree nk30-wt-2WgEOi/tree at 4df00b78, expected: none

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-0-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-18T09:43:31Z

- cmd: make e2e
  run_id: minted-nang-kit-3-0-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-18T09:43:31Z

## Known limits

## Ngoài hợp đồng

## Analyst

Non-discriminating evals (pass on both HEAD and baseline, so they prove the harness rather than the feature):
- E10 (make check): green on baseline too; treated as an intended regression guard.

Baseline khong do:
- node _acceptance/nang-kit-3-0/rang/ci-kit.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/ci-kit.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/gate-branch.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/gate-branch.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/gate-control.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/gate-control.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/product-map.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/product-map.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/kit-root-cli.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/kit-root-cli.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/settings.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/settings.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/doc-commands.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/doc-commands.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-0/rang/leftover.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/leftover.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/nang-kit-3-0/rang/two-way.mjs: bo qua baseline: tep _acceptance/nang-kit-3-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 8925e8fffc776534c5388ced3fea36ac2a1345f6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — make e2e failed, already red at baseline and accepted by the owner at Gate 1.
Round 3: REJECT — four in-contract findings on the AC-2 lifecycle measure; scope cut on AC-2 at the round cap, reopened for a second Gate 1 (approved).
Round 4: E11 failed — the two-way measure leaves a detached temp worktree behind and its own cleanup assertion trips; E1 to E10 and both suite commands are green. Returned to implementation.
