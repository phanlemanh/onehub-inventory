---
schema_version: 2
feature_slug: upgrade-design-assembly-tool
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6de2274c4c4fe096e3fc933af4eb679297d1fe96
human_signoff:
---

# Evidence Report: upgrade-design-assembly-tool

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E9 | AC-5 | script | PASS |
| E6 | AC-2 | script | PASS |
| E7 | AC-3 | script | PASS |
| E8 | AC-4 | script | PASS |
| E10 | AC-2 | script | PASS |
| E11 | AC-6 | script | PASS |
| E12 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-upgrade-design-assembly-tool-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-16T01:02:27Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E2
  run_id: minted-upgrade-design-assembly-tool-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tool_is_release
  verified_at: 2026-11-16T01:02:27Z
  output: |
    tool: tools/design-assembly is the plugin's version 0.1.0, 27 files, tree 4f5d87992942; the stamp says the same

- eval: E3
  run_id: minted-upgrade-design-assembly-tool-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.register_gains_parts
  verified_at: 2026-11-16T01:02:27Z
  output: |
    register: 3 parts added (Filters: FiltersAdvanced; FiltersRow: FilterChip FiltersBuilder), nothing else changed in 291 components

- eval: E4
  run_id: minted-upgrade-design-assembly-tool-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.upgrade_changes
  verified_at: 2026-11-16T01:02:27Z
  output: |
    upgrade commit: changed exactly 8 files, the six tool files, the register and the stamp

- eval: E5
  run_id: minted-upgrade-design-assembly-tool-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.component_register
  verified_at: 2026-11-16T01:02:27Z
  output: |
    (đuôi đầu ra của lệnh rỗng; lệnh kết thúc với mã 0)

- eval: E9
  run_id: minted-upgrade-design-assembly-tool-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.proof_gate_real
  verified_at: 2026-11-16T01:02:27Z
  output: |
    proof-gate: mọi màn đang mở đã chứng minh đúng lối

- eval: E6
  run_id: minted-upgrade-design-assembly-tool-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.upgrade_measures_two_way
  verified_at: 2026-11-16T01:02:27Z
  output: |
    ℹ duration_ms 3688.356417

- eval: E7
  run_id: minted-upgrade-design-assembly-tool-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.upgrade_measures_two_way
  verified_at: 2026-11-16T01:02:27Z
  output: |
    ℹ duration_ms 3688.356417

- eval: E8
  run_id: minted-upgrade-design-assembly-tool-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.upgrade_measures_two_way
  verified_at: 2026-11-16T01:02:27Z
  output: |
    ℹ duration_ms 3688.356417

- eval: E10
  run_id: minted-upgrade-design-assembly-tool-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_ledger_matches
  verified_at: 2026-11-16T01:02:27Z
  output: |
    release ledger: version 0.1.0 at 34a7938 names tool tree 4f5d87992942, the one pinned here

- eval: E11
  run_id: minted-upgrade-design-assembly-tool-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.branch_changes_only_upgrade
  verified_at: 2026-11-16T01:02:27Z
  output: |
    branch: 35 files changed, all of them the upgrade's or this record's

- eval: E12
  run_id: minted-upgrade-design-assembly-tool-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.upgrade_measures_two_way
  verified_at: 2026-11-16T01:02:27Z
  output: |
    ℹ duration_ms 3688.356417

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-upgrade-design-assembly-tool-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-16T01:02:27Z

- cmd: make e2e
  run_id: minted-upgrade-design-assembly-tool-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-16T01:02:27Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):
- E1 (make check)
- E5 (npx vitest run tests/design-registry.test.ts --coverage.enabled=false --reporter=verbose)
- E9 (python3 tools/proof_gate/check.py --root .)

Baseline khong do:
- node _acceptance/upgrade-design-assembly-tool/rang/tool-tree.mjs --root .: bo qua baseline: tep _acceptance/upgrade-design-assembly-tool/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-tool/rang/register-gains-parts.mjs --root .: bo qua baseline: tep _acceptance/upgrade-design-assembly-tool/rang/register-gains-parts.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-tool/rang/upgrade-changes.mjs --root .: bo qua baseline: tep _acceptance/upgrade-design-assembly-tool/rang/upgrade-changes.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/upgrade-design-assembly-tool/rang/measures-two-way.mjs: bo qua baseline: tep _acceptance/upgrade-design-assembly-tool/rang/measures-two-way.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-tool/rang/release-ledger.mjs --plugin-repo "${DESIGN_ASSEMBLY_REPO:-$HOME/dev/design-assembly}": bo qua baseline: tep _acceptance/upgrade-design-assembly-tool/rang/release-ledger.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/upgrade-design-assembly-tool/rang/branch-changes.mjs --root .: bo qua baseline: tep _acceptance/upgrade-design-assembly-tool/rang/branch-changes.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval đạt (E1-E12), hai lệnh suite đạt; không có eval hỏng, không có mục chờ người chấm.
