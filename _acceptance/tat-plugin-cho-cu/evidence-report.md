---
schema_version: 2
feature_slug: tat-plugin-cho-cu
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: baba1178632662f5b6e792004cd47bf6389b72ae
human_signoff: Phan Le Manh 2026-11-19
---

# Evidence Report: tat-plugin-cho-cu

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tat-plugin-cho-cu-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tpc_settings
  verified_at: 2026-11-18T15:05:41Z
  output: |
    settings: enabledPlugins = merge-base + 6 false keys (acceptance-gate, feature-loop, diagram-design, dieu-phoi, road-map, tri-thuc @acceptance-gate-kit); every other key as at merge-base

- eval: E2
  run_id: minted-tat-plugin-cho-cu-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tpc_doi_chung
  verified_at: 2026-11-18T15:05:41Z
  output: |
    doi-chung: at merge-base 47d52b06 the session measure is red as pinned (phien: two versions of acceptance-gate…), cat-luot present

- eval: E3
  run_id: bb5d4caw2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tpc_phien
  verified_at: 2026-11-18T15:05:41Z
  output: |
    phien: 6 kit plugins, one version each, all @delivery-loop 3.0.0; cat-luot absent; scope-slice and feature-loop:feature-loop present

- eval: E4
  run_id: minted-tat-plugin-cho-cu-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tpc_quet_ten_cu
  verified_at: 2026-11-18T15:05:41Z
  output: |
    quet-ten-cu: nk30 sweep at HEAD finds 6 lines, all false keys in .claude/settings.json for the six old-marketplace plugins

- eval: E5
  run_id: minted-tat-plugin-cho-cu-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.nk30_settings
  verified_at: 2026-11-18T15:05:41Z
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.0.0 = KIT_TAG of ci.yml; 6 plugins on, equal to the kit marketplace; no @acceptance-gate-kit key; superpowers, permissions and hooks as on origin/main

- eval: E6
  run_id: r1-l6-1-20261118150541
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-18T15:05:41Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: r1-l7-1-20261118150541
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.tpc_two_way
  verified_at: 2026-11-18T15:05:41Z
  output: |
    ℹ duration_ms 8824.868958

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-tat-plugin-cho-cu-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-18T15:05:41Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-tat-plugin-cho-cu-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-18T15:05:41Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; là regression-guard có chủ ý):

- E5: node _acceptance/nang-kit-3-0/rang/settings.mjs — thước của hồ sơ nang-kit-3-0, giữ làm regression-guard
- E6: make check — bộ kiểm của kho, giữ làm regression-guard

Baseline khong do

- node _acceptance/tat-plugin-cho-cu/rang/settings.mjs: bo qua baseline: tep _acceptance/tat-plugin-cho-cu/rang/settings.mjs co o cay dang kiem nhung chua co o merge-base 47d52b06c6dfcfc61bc0225666023c66cf3b514e — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/tat-plugin-cho-cu/rang/phien.mjs --doi-chung: bo qua baseline: tep _acceptance/tat-plugin-cho-cu/rang/phien.mjs co o cay dang kiem nhung chua co o merge-base 47d52b06c6dfcfc61bc0225666023c66cf3b514e — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/tat-plugin-cho-cu/rang/phien.mjs: bo qua baseline: tep _acceptance/tat-plugin-cho-cu/rang/phien.mjs co o cay dang kiem nhung chua co o merge-base 47d52b06c6dfcfc61bc0225666023c66cf3b514e — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/tat-plugin-cho-cu/rang/quet-ten-cu.mjs: bo qua baseline: tep _acceptance/tat-plugin-cho-cu/rang/quet-ten-cu.mjs co o cay dang kiem nhung chua co o merge-base 47d52b06c6dfcfc61bc0225666023c66cf3b514e — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/tat-plugin-cho-cu/rang/two-way.mjs: bo qua baseline: tep _acceptance/tat-plugin-cho-cu/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 47d52b06c6dfcfc61bc0225666023c66cf3b514e — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E7 all passed, the two suite commands passed. No return to implementation.
