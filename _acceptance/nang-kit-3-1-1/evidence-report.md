---
schema_version: 2
feature_slug: nang-kit-3-1-1
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 80fc4e2b13c01493397b07ce3c528211b31fe7c3
human_signoff: Phan Le Manh 2026-11-24
---

# Evidence Report: nang-kit-3-1-1

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nang-kit-3-1-1-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/settings.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    settings: marketplace delivery-loop (phanlemanh/delivery-loop) at ref v3.1.1; the only line changed from origin/main; 6 plugins on, equal to the kit v3.1.1 marketplace

- eval: E2
  run_id: minted-nang-kit-3-1-1-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/tag.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    tag: v3.1.1 on phanlemanh/delivery-loop peels to 1193bc22; 6 plugin versions as in the matrix (5 at 3.1.1)

- eval: E3
  run_id: minted-nang-kit-3-1-1-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/ci-line.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    ci-line: ci.yml differs from origin/main only in KIT_TAG of the gate job, v3.1.0 -> v3.1.1; ci-kit-tag.patch applied to the base gives HEAD

- eval: E4
  run_id: minted-nang-kit-3-1-1-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/kiem-ban-cai.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    kiem-ban-cai: kiem-ban-cai.mjs of v3.1.1 --ref v3.1.1 exit 0: TỔNG KẾT: ĐẠT 8/8 — v3.1.1 (1193bc22) cài đúng tag

- eval: E5
  run_id: minted-nang-kit-3-1-1-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/kit-diff.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    kit-diff: 4 kit executors (script.product_map, design.floor, design.khuon, design.ui_check) run files under acceptance-gate/scripts or lib, all present and unchanged in v3.1.1

- eval: E6
  run_id: minted-nang-kit-3-1-1-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/gate-control.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    gate-control: on HEAD against origin/main both kits print the same 78 verdict lines

- eval: E7
  run_id: r1-l7-1-20261124130153
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/gate-branch.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    gate-branch: kit v3.1.1 (KIT_TAG of ci.yml) ran 4 rules on HEAD against origin/main; 1 VIOLATION lines, all naming nang-kit-3-1-1

- eval: E8
  run_id: minted-nang-kit-3-1-1-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-24T13:01:53Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E9
  run_id: minted-nang-kit-3-1-1-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/nang-kit-3-1-1/rang/two-way.mjs
  verified_at: 2026-11-24T13:01:53Z
  output: |
    ℹ duration_ms 195540.105834

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nang-kit-3-1-1-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-24T13:01:53Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nang-kit-3-1-1-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-24T13:01:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- E8 (make check): green trên cả hai phía. Đây là bộ kiểm có sẵn của kho, dùng làm regression-guard.

Baseline khong do:

- node _acceptance/nang-kit-3-1-1/rang/settings.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/settings.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1-1/rang/tag.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/tag.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1-1/rang/ci-line.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/ci-line.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1-1/rang/kiem-ban-cai.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/kiem-ban-cai.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1-1/rang/kit-diff.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/kit-diff.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1-1/rang/gate-control.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/gate-control.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/nang-kit-3-1-1/rang/gate-branch.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/gate-branch.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi
- node --test _acceptance/nang-kit-3-1-1/rang/two-way.mjs: bo qua baseline: tep _acceptance/nang-kit-3-1-1/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base d47869acd2a52c7f97eef0af75d23b66220301dc — eval moi, chay tren code cu khong phan biet gi

## Judge

Không có judgment item nào trong hợp đồng này (không eval nào thuộc executor judgment); không có panel đề xuất.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1-E9 và hai lệnh suite đều xanh; không có eval thất bại. Verdict PASS.
