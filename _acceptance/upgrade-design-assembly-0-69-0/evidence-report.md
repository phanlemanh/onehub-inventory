---
schema_version: 2
feature_slug: upgrade-design-assembly-0-69-0
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9e830bfa94fe69c9c3a49882540a5196ed5452e5
human_signoff:
---

# Evidence Report: upgrade-design-assembly-0-69-0

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
| E12 | AC-7 | script | PASS |
| E13 | AC-7 | script | PASS |
| E14 | AC-8 | script | PASS |
| E15 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-upgrade-design-assembly-0-69-0-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-26T03:32:01Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: r1-l2-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/gate-lines.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    gate: the gate holds 22 decisions by 33 checks; determinism rate 57/69, 22 held and 35 claimed (at 9e830bfa94fe)

- eval: E3
  run_id: minted-upgrade-design-assembly-0-69-0-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: gate-lines without one check of color-contrast (red)

- eval: E4
  run_id: minted-upgrade-design-assembly-0-69-0-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/tool-tree.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.69.0, 51 files, tree 0f6ddbdf348d; the stamp says the same; mk/design-assembly.mk is the template's; the installed plugin 0.69.0 names that tree in its release ledger and its templates h

- eval: E5
  run_id: r1-l5-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: tool-tree without the plugin folder (red)

- eval: E6
  run_id: r1-l6-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/decision-states.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    states: the tool at HEAD and the 0.36.1 tool, each on its own ledger, give each of the 69 decisions the same state; both say 57/69 (at 9e830bfa94fe)

- eval: E7
  run_id: minted-upgrade-design-assembly-0-69-0-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: decision-states with raw-table unchecked on the 0.36.1 side (red)

- eval: E8
  run_id: minted-upgrade-design-assembly-0-69-0-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/shallow-alone.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    alone: make design-assembly green on a fresh depth-1 clone of 9e830bfa94fe with origin main at 1ea13196; choose-first alone fetched main and read its base; decision-sheet and owner-calls each said main was fetched from origin; the clone lef

- eval: E9
  run_id: minted-upgrade-design-assembly-0-69-0-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/shallow-two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: shallow-alone: red when origin main is older (red)

- eval: E10
  run_id: minted-upgrade-design-assembly-0-69-0-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/change-list.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    changes: the upgrade commit changes its 31 files; the log commit changes its 1 file; the branch changes nothing beyond the upgrade and this record (at 9e830bfa94fe)

- eval: E11
  run_id: r1-l11-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: change-list once merged (green)

- eval: E12
  run_id: r1-l12-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/lint-scope.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    lint: tools/design-assembly/contract.mjs has no react-hooks/rules-of-hooks error; src/lib/format/hook-probe.ts and tools/hook-probe.mjs, which call a use-named function from a plain function, each have one (at 9e830bfa94fe)

- eval: E13
  run_id: minted-upgrade-design-assembly-0-69-0-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: lint-scope with the override on all of tools/ (red)

- eval: E14
  run_id: r1-l14-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/choose-first.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    choose-first: on a clone of 9e830bfa94fe with main at 1ea13196, the gate is green, adding src/components/candidate/probe-badge.tsx with no intake row turns it red (src/components/candidate/probe-badge.tsx holds ProbeBadge, a component this

- eval: E15
  run_id: r1-l15-1-20261126033201
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs
  verified_at: 2026-11-26T03:32:01Z
  output: |
    held: choose-first with the intake row naming another file (red)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-0-69-0-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-26T03:32:01Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-upgrade-design-assembly-0-69-0-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-26T03:32:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không phải feature):
- E1 (make check): xanh trên baseline. Cần xác nhận là regression-guard có chủ ý; phần phân biệt của AC-1 nằm ở dòng cổng, do E3 đo chiều đỏ.

Baseline khong do:
- node _acceptance/upgrade-design-assembly-0-69-0/rang/gate-lines.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/gate-lines.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs --only gate-lines: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/tool-tree.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs --only tool-tree: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/decision-states.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/decision-states.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs --only decision-states: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/shallow-alone.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/shallow-alone.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/shallow-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/shallow-two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/change-list.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs --only change-list: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/lint-scope.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/lint-scope.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs --only lint-scope: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/choose-first.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/choose-first.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs --only choose-first: bo qua baseline: tep _acceptance/upgrade-design-assembly-0-69-0/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1ea13196de8472efc81df66e896db9640fec4a91 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: all 15 evals passed; no judgment item, no variance. Verdict PASS.
