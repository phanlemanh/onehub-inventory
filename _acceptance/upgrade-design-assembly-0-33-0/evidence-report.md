---
schema_version: 2
feature_slug: upgrade-design-assembly-0-33-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ed510290e5fb5e0dfce7b2b12d0ea7b5366aec2f
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-33-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-5 | script | PASS |
| E10 | AC-6 | script | PASS |
| E11 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: r1-l1-1-20261122142131
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-22T14:21:31Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: r1-l2-1-20261122142131
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/gate-lines.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    gate: the gate holds 19 decisions by 27 checks; determinism rate 47/67, 19 held and 28 claimed (at ed510290e5fb)

- eval: E3
  run_id: r1-l3-1-20261122142131
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    held: gate-lines without one check of color-contrast (red)

- eval: E4
  run_id: minted-upgrade-design-assembly-0-33-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/tool-tree.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.36.1, 44 files, tree f53b64535e01; the stamp says the same; mk/design-assembly.mk is the template's; the installed plugin 0.36.1 names that tree in its release ledger and its templates hold it

- eval: E5
  run_id: minted-upgrade-design-assembly-0-33-0-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    held: tool-tree without the plugin folder (red)

- eval: E6
  run_id: minted-upgrade-design-assembly-0-33-0-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/decision-states.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    states: on this ledger the tool at HEAD and the 0.7.1 tool give each of the 67 decisions the same state; both say 47/67 (at ed510290e5fb)

- eval: E7
  run_id: minted-upgrade-design-assembly-0-33-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    held: decision-states with raw-table unchecked on the 0.7.1 side (red)

- eval: E8
  run_id: r1-l8-1-20261122142131
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-alone.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    alone: make design-assembly green on a fresh depth-1 clone of ed510290e5fb with origin main at dda3487e; decision-sheet and owner-calls each said main was fetched from origin; the clone left main at dda3487e

- eval: E9
  run_id: r1-l9-1-20261122142131
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-two-way.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    held: shallow-alone: red when origin main is older (red)

- eval: E10
  run_id: minted-upgrade-design-assembly-0-33-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    changes: the upgrade commit changes its 28 files; the 0.36.1 rerun changes its 10 files; the branch changes nothing beyond the upgrades and this record (at ed510290e5fb)

- eval: E11
  run_id: minted-upgrade-design-assembly-0-33-0-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:21:31Z
  output: |
    held: change-list once merged (green)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-33-0-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-22T14:21:31Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-upgrade-design-assembly-0-33-0-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-22T14:21:31Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả bản hiện tại lẫn baseline): E1 (make check). Đây là lệnh kiểm tổng, xác nhận là regression-guard có chủ ý; chiều đỏ của các dòng cổng nằm ở E3, E5, E7, E9, E11.

Baseline không đo:
- node _acceptance/upgrade-design-assembly-0-33-0/rang/gate-lines.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/gate-lines.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs --only gate-lines: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/tool-tree.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs --only tool-tree: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/decision-states.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/decision-states.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs --only decision-states: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-alone.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-alone.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-two-way.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs --only change-list: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base dda3487eb9be97f5f220e7e8d8c715ece895f1e6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: tất cả 11 eval đạt, hai lệnh suite xanh. Không có mục cần người chấm.
