---
schema_version: 2
feature_slug: upgrade-design-assembly-0-33-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: c3b0313e11e336523f65339966655823229bdcd4
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-33-0

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carry-forward tu round 1) |
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
  verifier: config:executors.script.check
  verified_at: 2026-11-22T14:21:31Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-upgrade-design-assembly-0-33-0-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/gate-lines.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    gate: the gate holds 19 decisions by 27 checks; determinism rate 47/67, 19 held and 28 claimed (at c3b0313e11e3)

- eval: E3
  run_id: minted-upgrade-design-assembly-0-33-0-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    held: gate-lines without one check of color-contrast (red)

- eval: E4
  run_id: minted-upgrade-design-assembly-0-33-0-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/tool-tree.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.36.1, 44 files, tree f53b64535e01; the stamp says the same; mk/design-assembly.mk is the template's; the installed plugin 0.36.1 names that tree in its release ledger and its templates h...

- eval: E5
  run_id: minted-upgrade-design-assembly-0-33-0-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    held: tool-tree without the plugin folder (red)

- eval: E6
  run_id: minted-upgrade-design-assembly-0-33-0-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/decision-states.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    states: on this ledger the tool at HEAD and the 0.7.1 tool give each of the 67 decisions the same state; both say 47/67 (at c3b0313e11e3)

- eval: E7
  run_id: blja2fx5a
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    held: decision-states with raw-table unchecked on the 0.7.1 side (red)

- eval: E8
  run_id: r2-l7-1-20261122144015
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-alone.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    alone: make design-assembly green on a fresh depth-1 clone of c3b0313e11e3 with origin main at dda3487e; decision-sheet and owner-calls each said main was fetched from origin; the clone left main at dda3487e

- eval: E9
  run_id: minted-upgrade-design-assembly-0-33-0-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/shallow-two-way.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    held: shallow-alone: red when origin main is older (red)

- eval: E10
  run_id: minted-upgrade-design-assembly-0-33-0-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/change-list.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    changes: the upgrade commit changes its 28 files; the 0.36.1 rerun changes its 10 files; the branch changes nothing beyond the upgrades and this record (at c3b0313e11e3)

- eval: E11
  run_id: minted-upgrade-design-assembly-0-33-0-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-33-0/rang/two-way.mjs
  verified_at: 2026-11-22T14:40:15Z
  output: |
    held: change-list once merged (green)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-upgrade-design-assembly-0-33-0-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-22T14:40:15Z

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-33-0-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-22T14:40:15Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-upgrade-design-assembly-0-33-0-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-22T14:40:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

### Baseline khong do

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

Round 1: moi eval xanh; ba phat hien trong hop dong (cach doc so dem o hai trang ve, ca do chi doi chu so) da sua o commit c3b0313e.
Round 2: E2-E11 chay lai tren c3b0313e, tat ca xanh; E1 carry-forward tu round 1 vi delta khong cham paths cua eval; ba lenh suite xanh.
