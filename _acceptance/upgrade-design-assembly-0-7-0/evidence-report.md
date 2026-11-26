---
schema_version: 2
feature_slug: upgrade-design-assembly-0-7-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 82b35652fef54c55e3b462023c2092dc453c95cc
human_signoff: Phan Le Manh 2026-11-17
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
| E12 | AC-8 | test | PASS (carried from round 1) |
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
| E23 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: r3-l1-1-20261117074619
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-17T07:46:19Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E2
  run_id: minted-upgrade-design-assembly-0-7-0-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_shallow_check
  verified_at: 2026-11-17T07:46:19Z
  output: |
    shallow: make check green on a depth-1 clone of 82b35652 with origin; 2460 tests passed; it drew 4 derived files absent before, none tracked

- eval: E3
  run_id: minted-upgrade-design-assembly-0-7-0-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_shallow_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 263131.887

- eval: E4
  run_id: minted-upgrade-design-assembly-0-7-0-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_tool_tree
  verified_at: 2026-11-17T07:46:19Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.7.0, 34 files, tree f3d66a61fdcf; the stamp says the same; mk/design-assembly.mk is the template's

- eval: E5
  run_id: minted-upgrade-design-assembly-0-7-0-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_release_ledger
  verified_at: 2026-11-17T07:46:19Z
  output: |
    release ledger: version 0.7.0 at 93daea4 names tool tree f3d66a61fdcf, the one pinned here; its templates have that tree and the gate step

- eval: E6
  run_id: minted-upgrade-design-assembly-0-7-0-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_out_of_git
  verified_at: 2026-11-17T07:46:19Z
  output: |
    out of git: 4 derived files untracked and ignored, old names gone, 9 screen and 23 block files tracked, no reader names an old path

- eval: E7
  run_id: minted-upgrade-design-assembly-0-7-0-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_fragments_equal
  verified_at: 2026-11-17T07:46:19Z
  output: |
    fragments: 9 screens entries and 23 intake entries hold exactly the data of the old ledgers at 69253032

- eval: E8
  run_id: minted-upgrade-design-assembly-0-7-0-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_branch_merge
  verified_at: 2026-11-17T07:46:19Z
  output: |
    merge: two branches each adding a screen and a block merge clean at 82b35652; on the one-file ledgers at 69253032 they conflict in design/screens.yaml and design/so-khoi.yaml

- eval: E9
  run_id: b11aallwr
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_affected_merges
  verified_at: 2026-11-17T07:46:19Z
  output: |
    affected: 30 merges: 26 all screens, 0 some screens, 4 no screen; with a declared screen missing: 0

- eval: E10
  run_id: minted-upgrade-design-assembly-0-7-0-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_proof_gate_fragments
  verified_at: 2026-11-17T07:46:19Z
  output: |
    proof gate: with design/intake.yaml and design/screens.yaml absent, the gate passes and decision 0023 reads 23 blocks from design/intake

- eval: E11
  run_id: minted-upgrade-design-assembly-0-7-0-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_law_day
  verified_at: 2026-11-17T07:46:19Z
  output: |
    law day: 2026-11-12, from the commit 1edac3b0 adding design/so-khoi.yaml, the oldest path of the block ledger

- eval: E12
  run_id: minted-upgrade-design-assembly-0-7-0-E12-r1
  exit_code: 0
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-17T04:30:10Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-upgrade-design-assembly-0-7-0-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_audit_diff
  verified_at: 2026-11-17T07:46:19Z
  output: |
    audit: at 69253032 and at HEAD the plugin's audit differs in one line: «contract: 7 of 7 ledger file(s) have the one shape every reader relies on» → «contract: 8 of 8 ledger file(s) have the one shape every reader relies on»

- eval: E14
  run_id: minted-upgrade-design-assembly-0-7-0-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_change_list
  verified_at: 2026-11-17T07:46:19Z
  output: |
    changes: the upgrade commit changes exactly its 81 files, each in one of 13 groups; the branch changes 125 files, all of them the upgrade's or this record's

- eval: E15
  run_id: minted-upgrade-design-assembly-0-7-0-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E16
  run_id: minted-upgrade-design-assembly-0-7-0-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E17
  run_id: minted-upgrade-design-assembly-0-7-0-E17-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E18
  run_id: minted-upgrade-design-assembly-0-7-0-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E19
  run_id: minted-upgrade-design-assembly-0-7-0-E19-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E20
  run_id: minted-upgrade-design-assembly-0-7-0-E20-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E21
  run_id: minted-upgrade-design-assembly-0-7-0-E21-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E22
  run_id: minted-upgrade-design-assembly-0-7-0-E22-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T07:46:19Z
  output: |
    ℹ duration_ms 92011.087458

- eval: E23
  run_id: r3-l15-1-20261117074619
  exit_code: 0
  baseline: red
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-17T07:46:19Z
  output: |
    gac-hydration: 0 canh bao

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-7-0-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-17T07:46:19Z

- cmd: make e2e
  run_id: minted-upgrade-design-assembly-0-7-0-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-17T07:46:19Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

### Baseline khong do

- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-two-way.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/tool-tree.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/release-ledger.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/release-ledger.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/out-of-git.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/out-of-git.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/upgrade-design-assembly-0-7-0/rang/fragments-equal.py: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/fragments-equal.py co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/two-branch-merge.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/two-branch-merge.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/affected-merges.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/affected-merges.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/proof-gate-fragments.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/proof-gate-fragments.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/upgrade-design-assembly-0-7-0/rang/law-day.py: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/law-day.py co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/audit-diff.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/audit-diff.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/upgrade-design-assembly-0-7-0/rang/measures-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/measures-two-way.mjs co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1 (make check) did not pass — returned to implementation.
Round 2: all evals passed at 5c1c11fb; E9 and E12 carried from round 1.
Round 3: re-verified at 82b35652 after the signed-in screens suite fix (E23 added) and the merge of origin/main; E12 carried from round 1 (delta does not touch its paths); all evals passed.
