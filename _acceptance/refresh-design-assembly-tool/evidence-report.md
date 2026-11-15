---
schema_version: 2
feature_slug: refresh-design-assembly-tool
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a72be66c842f03a9a13b0b67ae18e06e0f4b0364
human_signoff:
---

# Evidence Report: refresh-design-assembly-tool

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-2 | script | PASS |
| E8 | AC-3 | script | PASS |
| E9 | AC-4 | script | PASS |
| E10 | AC-1 | script | PASS |

## Evidence

- eval: E1
  run_id: r1-l1-1-20261115050524
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T05:05:24Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E2
  run_id: minted-refresh-design-assembly-tool-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.register_names_once
  verified_at: 2026-11-15T05:05:24Z
  output: |
    names once: 289 entries for 289 names; the old tool gave 298 entries for the same names

- eval: E3
  run_id: minted-refresh-design-assembly-tool-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tool_matches_plugin
  verified_at: 2026-11-15T05:05:24Z
  output: |
    tool: tools/design-assembly is the plugin's at feea58d, 27 files, tree 357987f790b1

- eval: E4
  run_id: minted-refresh-design-assembly-tool-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.only_register_changed
  verified_at: 2026-11-15T05:05:24Z
  output: |
    design ledgers: this branch changed design/component-registry.json; no screen-actions check declared

- eval: E5
  run_id: minted-refresh-design-assembly-tool-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.component_register
  verified_at: 2026-11-15T05:05:24Z
  output: |
    tests/design-registry.test.ts: all tests passed, 0 failed

- eval: E6
  run_id: minted-refresh-design-assembly-tool-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.proof_gate_real
  verified_at: 2026-11-15T05:05:24Z
  output: |
    proof-gate: mọi màn đang mở đã chứng minh đúng lối

- eval: E7
  run_id: minted-refresh-design-assembly-tool-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.refresh_measures_two_way
  verified_at: 2026-11-15T05:05:24Z
  output: |
    node --test measures-two-way.mjs: four tests passed, 0 failed

- eval: E8
  run_id: minted-refresh-design-assembly-tool-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.refresh_measures_two_way
  verified_at: 2026-11-15T05:05:24Z
  output: |
    node --test measures-two-way.mjs: four tests passed, 0 failed

- eval: E9
  run_id: minted-refresh-design-assembly-tool-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.refresh_measures_two_way
  verified_at: 2026-11-15T05:05:24Z
  output: |
    node --test measures-two-way.mjs: four tests passed, 0 failed

- eval: E10
  run_id: r1-l8-1-20261115050524
  exit_code: 0
  baseline: green
  verifier: config:executors.script.register_matches_source
  verified_at: 2026-11-15T05:05:24Z
  output: |
    new component: green as committed, red with ChangedProbe added

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-refresh-design-assembly-tool-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-15T05:05:24Z

- cmd: make e2e
  run_id: minted-refresh-design-assembly-tool-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-15T05:05:24Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline; chứng minh harness chứ không phải feature, cần xác nhận là regression-guard có chủ ý hoặc viết lại để assert hành vi mới):

- E1 (make check)
- E5 (npx vitest run tests/design-registry.test.ts --coverage.enabled=false --reporter=verbose)
- E6 (python3 tools/proof_gate/check.py --root .)
- E10 (node tools/design-assembly/components.mjs && node _acceptance/adopt-design-assembly/rang/new-component.mjs --root .)

Baseline khong do:

- node _acceptance/refresh-design-assembly-tool/rang/register-names-once.mjs --root .: bo qua baseline: tep _acceptance/refresh-design-assembly-tool/rang/register-names-once.mjs co o cay dang kiem nhung chua co o merge-base 0861fdcb6906a3d86d6c88df830c9ac40447d263 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/refresh-design-assembly-tool/rang/tool-tree.mjs --root .: bo qua baseline: tep _acceptance/refresh-design-assembly-tool/rang/tool-tree.mjs co o cay dang kiem nhung chua co o merge-base 0861fdcb6906a3d86d6c88df830c9ac40447d263 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/refresh-design-assembly-tool/rang/only-register-changed.mjs --root .: bo qua baseline: tep _acceptance/refresh-design-assembly-tool/rang/only-register-changed.mjs co o cay dang kiem nhung chua co o merge-base 0861fdcb6906a3d86d6c88df830c9ac40447d263 — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/refresh-design-assembly-tool/rang/measures-two-way.mjs: bo qua baseline: tep _acceptance/refresh-design-assembly-tool/rang/measures-two-way.mjs co o cay dang kiem nhung chua co o merge-base 0861fdcb6906a3d86d6c88df830c9ac40447d263 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần (deterministic), không có eval nhiều lượt.

## Iterations

Round 1: mười eval đều đạt, hai lệnh suite xanh; không có mục judgment nào chờ người.
