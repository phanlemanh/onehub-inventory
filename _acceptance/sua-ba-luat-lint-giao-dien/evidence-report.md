---
schema_version: 2
feature_slug: sua-ba-luat-lint-giao-dien
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: baa68437c7c767bf50e317833ea7b436e34761e3
human_signoff:
---

# Evidence Report: sua-ba-luat-lint-giao-dien

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-ba-luat-lint-giao-dien-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    E1 đối chứng đúng: on-scale steps p-3 gap-2

- eval: E2
  run_id: minted-sua-ba-luat-lint-giao-dien-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    E2 đối chứng đúng: x + " p-4"

- eval: E3
  run_id: minted-sua-ba-luat-lint-giao-dien-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    E3 đối chứng đúng: the same exception with -- and a reason

- eval: E4
  run_id: minted-sua-ba-luat-lint-giao-dien-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    E4 chặn: autofix still runs on screen files

- eval: E5
  run_id: minted-sua-ba-luat-lint-giao-dien-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/held.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    E5 giữ: lint-exceptions bởi onehub-ui/require-disable-reason

- eval: E6
  run_id: minted-sua-ba-luat-lint-giao-dien-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-26T06:34:53Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E7
  run_id: minted-sua-ba-luat-lint-giao-dien-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-26T06:34:53Z
  output: |
    (build hoàn tất, không có dòng cuối)

- eval: E8
  run_id: minted-sua-ba-luat-lint-giao-dien-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/two-way.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    đúng: E10 bản phá (thư mục quyết định trống) — có «E10 THIẾU: không trang quyết định nào trỏ d-20261126T061152Z-5»

- eval: E9
  run_id: minted-sua-ba-luat-lint-giao-dien-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-26T06:34:53Z
  output: |
    (không có dòng báo lỗi mã màu thô)

- eval: E10
  run_id: minted-sua-ba-luat-lint-giao-dien-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/sua-ba-luat-lint-giao-dien/rang/wiki.mjs
  verified_at: 2026-11-26T06:34:53Z
  output: |
    E10 có: 0049-moi-ngoai-le-lint-co-ly-do.md trỏ d-20261126T061152Z-5

### Lệnh suite (hồi quy)

- cmd: DATABASE_URL= make e2e
  run_id: minted-sua-ba-luat-lint-giao-dien-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-26T06:34:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline), cần xác nhận là regression-guard có chủ ý:

- E6 (`make check`): xanh trên cả hai phía.
- E9 (`design-floor-s4.mjs --root .`): xanh trên cả hai phía.

Baseline khong do:

- node _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs E1: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs E2: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs E3: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs E4: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/probe.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/sua-ba-luat-lint-giao-dien/rang/held.mjs: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/held.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/sua-ba-luat-lint-giao-dien/rang/two-way.mjs: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/sua-ba-luat-lint-giao-dien/rang/wiki.mjs: bo qua baseline: tep _acceptance/sua-ba-luat-lint-giao-dien/rang/wiki.mjs co o cay dang kiem nhung chua co o merge-base 50314af6ba8296faeba590223b4fec66acc5a5f4 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval đạt, không eval nào hỏng. Verdict PASS.
