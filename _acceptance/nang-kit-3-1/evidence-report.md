---
schema_version: 2
feature_slug: nang-kit-3-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 153243b126f03468c38d9a534c8fe6fa854c2307
human_signoff: Manh Phan 2026-11-23
---

# Evidence Report: nang-kit-3-1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-1-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/settings.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.1.0; the only line changed from origin/main; 6 plugins on, equal to the kit v3.1.0 marketplace; KIT_TAG of ci.yml is v3.0.0

- eval: E2
  run_id: minted-nang-kit-3-1-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/tag.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    tag: v3.1.0 on phanlemanh/delivery-loop peels to 0a93a5b9; 6 plugin versions as in the matrix (5 at 3.1.0)

- eval: E3
  run_id: minted-nang-kit-3-1-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/tro-ly.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    tro-ly: kit v3.1.0 scripts/tro-ly-quyet-dinh.cjs --dem exit 0 on this repo; 73 records counted (= records with a contract), mặc-ký tắt, 7 kind lines

- eval: E4
  run_id: minted-nang-kit-3-1-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/product-map.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    executor-scripts: 4 executor commands under the kit root (script.product_map, design.floor, design.khuon, design.ui_check), 4 scripts, all present in kit v3.1.0 plugins/acceptance-gate

- eval: E5
  run_id: minted-nang-kit-3-1-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/doc-commands.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    doc-commands: 4 command mentions (3 distinct) and 1 kit path in 3 files, all found in kit v3.1.0

- eval: E6
  run_id: r2-l6-1-20261122135856
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/gate-control.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    gate-control: on HEAD against origin/main both kits print the same 73 verdict lines

- eval: E7
  run_id: r2-l7-1-20261122135856
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/gate-branch.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    gate-branch: kit v3.0.0 (KIT_TAG of ci.yml) ran its rules on HEAD against origin/main; 1 VIOLATION lines, all naming nang-kit-3-1

- eval: E8
  run_id: minted-nang-kit-3-1-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-22T13:58:56Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E9
  run_id: r2-l9-1-20261122135856
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/two-way.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    ℹ duration_ms 171027.095875

- eval: E10
  run_id: minted-nang-kit-3-1-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1/rang/dot.mjs
  verified_at: 2026-11-22T13:58:56Z
  output: |
    dot: 39 hook files of dispatch, 2 changed in v3.1.0 (hinh-dang.mjs,nguon-hang.mjs), reading batch dieu-phoi-nen alike in both; no s4 lock held (0 lock folders)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-1-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-22T13:58:56Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nang-kit-3-1-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-22T13:58:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do

- node _acceptance/nang-kit-3-1/rang/settings.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/settings.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/tag.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/tag.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/tro-ly.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/tro-ly.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/product-map.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/product-map.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/doc-commands.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/doc-commands.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/gate-control.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/gate-control.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/gate-branch.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/gate-branch.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node --test _acceptance/nang-kit-3-1/rang/two-way.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1/rang/dot.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1/rang/dot.mjs co o cay dang kiem nhung chua co o merge-base 1410a0f069db6c00bb13d012659077e07133cf15 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: PASS with one in-contract finding on AC-9 (plan-group Maps compared by reference) — fixed in commit 153243b1, which also pinned E9 at 19 cases and added a fourth red case to E10.
Round 2: all ten evals and both suite commands passed on HEAD 153243b1; verdict PASS, no judgment item pending.
