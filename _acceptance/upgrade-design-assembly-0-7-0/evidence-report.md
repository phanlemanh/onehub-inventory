---
schema_version: 2
feature_slug: upgrade-design-assembly-0-7-0
verdict: REJECT
failed_evals: ["E1","E2"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 094a4c4b96d9832b5e4ffa1553978de3d1beb1cc
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-7-0

Round 1. Kết quả: REJECT. Hai eval đỏ là E1 và E2, cả hai đều đi qua lệnh `make check` và dừng ở bước lint. Các lệnh đỏ đều đã gắn eval, không có lệnh đỏ nào ngoài eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | FAIL |
| E2 | AC-2 | script | FAIL |
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
  run_id: minted-upgrade-design-assembly-0-7-0-E1-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-17T04:30:10Z
  output: |
    lệnh: make check
    lint dừng: 205 vấn đề (190 lỗi, 15 cảnh báo), phần lớn là no-undef cho 'args', 'log', 'phase' ở các dòng 2025 đến 2170 của một tệp (đường dẫn bị cắt khỏi phần đuôi đầu ra)
    make: bước lint thất bại nên các bước sau (test, ontology, coverage-matrix) không chạy
    các dòng kỳ vọng không xuất hiện: "design-assembly: 17 decisions held by 25 checks", "component manifest ... (294 components)", "Tests  2460 passed | 2 skipped (2462)"

- eval: E2
  run_id: minted-upgrade-design-assembly-0-7-0-E2-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.da070_shallow_check
  verified_at: 2026-11-17T04:30:10Z
  output: |
    shallow: make check thất bại trên bản sao nông của 094a4c4b: 4 vấn đề lint (0 lỗi, 4 cảnh báo), bước kiểm định dạng báo docs/superpowers/plans/2026-11-17-upgrade-design-assembly-0-7-0.md sai kiểu
    shallow: make check did not say: derived files: wrote design/component-registry.json from the source
    shallow: make check did not say: derived files: wrote design/screens.yaml from design/screens
    shallow: make check did not say: design/intake.yaml from design/intake
    shallow: make check did not say: design-assembly: 17 decisions held by 25 checks, each seen failing on a changed copy
    shallow: make check did not say: component manifest: design/component-registry.json is up to date (294 components)
    shallow: make check printed no test count

- eval: E3
  run_id: minted-upgrade-design-assembly-0-7-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_shallow_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    node --test shallow-two-way.mjs: một bài đạt, thời gian khoảng 158 giây

- eval: E4
  run_id: minted-upgrade-design-assembly-0-7-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_tool_tree
  verified_at: 2026-11-17T04:30:10Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.7.0, 34 files, tree f3d66a61fdcf; the stamp says the same; mk/design-assembly.mk is the template's

- eval: E5
  run_id: minted-upgrade-design-assembly-0-7-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_release_ledger
  verified_at: 2026-11-17T04:30:10Z
  output: |
    release ledger: version 0.7.0 at 93daea4 names tool tree f3d66a61fdcf, the one pinned here; its templates have that tree and the gate step

- eval: E6
  run_id: minted-upgrade-design-assembly-0-7-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_out_of_git
  verified_at: 2026-11-17T04:30:10Z
  output: |
    out of git: 4 derived files untracked and ignored, old names gone, 9 screen and 23 block files tracked, no reader names an old path

- eval: E7
  run_id: minted-upgrade-design-assembly-0-7-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_fragments_equal
  verified_at: 2026-11-17T04:30:10Z
  output: |
    fragments: 9 screens entries and 23 intake entries hold exactly the data of the old ledgers at 69253032

- eval: E8
  run_id: minted-upgrade-design-assembly-0-7-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_branch_merge
  verified_at: 2026-11-17T04:30:10Z
  output: |
    merge: two branches each adding a screen and a block merge clean at 094a4c4b; on the one-file ledgers at 69253032 they conflict in design/screens.yaml and design/so-khoi.yaml

- eval: E9
  run_id: r1-l9-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_affected_merges
  verified_at: 2026-11-17T04:30:10Z
  output: |
    affected: 30 merges: 26 all screens, 0 some screens, 4 no screen; with a declared screen missing: 0

- eval: E10
  run_id: minted-upgrade-design-assembly-0-7-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_proof_gate_fragments
  verified_at: 2026-11-17T04:30:10Z
  output: |
    proof gate: with design/intake.yaml and design/screens.yaml absent, the gate passes and decision 0023 reads 23 blocks from design/intake

- eval: E11
  run_id: minted-upgrade-design-assembly-0-7-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_law_day
  verified_at: 2026-11-17T04:30:10Z
  output: |
    law day: 2026-11-12, from the commit 1edac3b0 adding design/so-khoi.yaml, the oldest path of the block ledger

- eval: E12
  run_id: minted-upgrade-design-assembly-0-7-0-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-17T04:30:10Z
  output: |
    npx vitest run tools/proof_gate: mọi bài đạt, không có dòng đầu ra nào khác ở phần đuôi

- eval: E13
  run_id: r1-l13-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_audit_diff
  verified_at: 2026-11-17T04:30:10Z
  output: |
    audit: at 69253032 and at HEAD the plugin's audit differs in one line: «contract: 7 of 7 ledger file(s) have the one shape every reader relies on» → «contract: 8 of 8 ledger file(s) have the one shape every reader relies on»

- eval: E14
  run_id: minted-upgrade-design-assembly-0-7-0-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_change_list
  verified_at: 2026-11-17T04:30:10Z
  output: |
    changes: the upgrade commit changes exactly its 81 files, each in one of 13 groups; the branch changes 115 files, all of them the upgrade's or this record's

- eval: E15
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    node --test measures-two-way.mjs: mười bài đạt (chung một lệnh với E16 đến E22), thời gian khoảng 53 giây

- eval: E16
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài out-of-git đạt ở cả năm ca đỏ

- eval: E17
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài fragments-equal đạt ở cả bốn ca đỏ

- eval: E18
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài two-branch-merge đạt ở cả hai ca đỏ

- eval: E19
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài affected-merges đạt ở cả hai ca đỏ

- eval: E20
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài proof-gate-fragments và law-day đạt ở các ca đỏ

- eval: E21
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài audit-diff đạt ở cả ba ca đỏ

- eval: E22
  run_id: r1-l15-1-20261117043010
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.da070_two_way
  verified_at: 2026-11-17T04:30:10Z
  output: |
    cùng lệnh measures-two-way.mjs với E15; bài change-list đạt ở các ca đỏ

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-7-0-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-17T04:30:10Z

- cmd: make e2e
  run_id: b1xq07w1s
  exit_code: 0
  verified_at: 2026-11-17T04:30:10Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E12: `npx vitest run tools/proof_gate --coverage.enabled=false --reporter=verbose`

Lệnh fail không gắn eval: không có. Hai lệnh đỏ là `make check` (E1) và `node _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs` (E2), cả hai đã gắn eval.

Baseline khong do
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-check.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/shallow-two-way.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/tool-tree.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/release-ledger.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/release-ledger.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/out-of-git.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/out-of-git.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/upgrade-design-assembly-0-7-0/rang/fragments-equal.py: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/fragments-equal.py co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/two-branch-merge.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/two-branch-merge.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/affected-merges.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/affected-merges.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/proof-gate-fragments.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/proof-gate-fragments.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- python3 _acceptance/upgrade-design-assembly-0-7-0/rang/law-day.py: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/law-day.py co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/audit-diff.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/audit-diff.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-7-0/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/upgrade-design-assembly-0-7-0/rang/measures-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-7-0/rang/measures-two-way.mjs co o cay dang kiem nhung chua co o merge-base 692530329a09e368caea58f335ed648122a9dfba — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2 failed — `make check` dừng ở bước lint (205 vấn đề, trong đó 190 lỗi no-undef 'args'/'log'/'phase' ở một tệp dài; trên bản sao nông còn báo định dạng của tài liệu kế hoạch), nên không in các dòng kỳ vọng. Returned to implementation.
