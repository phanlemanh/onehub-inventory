---
schema_version: 2
feature_slug: bring-out-claude-design
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2b874c0878fe5b32c0215c8ea55967e0c66a06e2
human_signoff:
---

# Evidence Report: bring-out-claude-design

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

## Evidence

- eval: E1
  run_id: r2-l1-1-20261127051042
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-27T05:10:42Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E2
  run_id: minted-bring-out-claude-design-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/exports.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    exports: the five exports are what the ledgers write at f1f0bbbc4e26; the gate holds them (design-assembly: 26 decisions held by 41 checks, each seen failing on a changed copy) (at 2b874c0878fe)

- eval: E3
  run_id: minted-bring-out-claude-design-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/two-way.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    two-way: every case held

- eval: E4
  run_id: minted-bring-out-claude-design-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/bundle.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    bundle: the bundle gives 40 colours in both themes, the typefaces, 7 radius steps, the spacing unit and 298 components, as their sources do (at 2b874c0878fe)

- eval: E5
  run_id: minted-bring-out-claude-design-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/two-way.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    two-way: every case held

- eval: E6
  run_id: minted-bring-out-claude-design-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/leave.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    leave: send-claude-design gives leave for the four bundle files to claude-design, confirmed by Manh Phan on 2026-11-26; the send step agrees; the last push is at f1f0bbbc4e26, as the bundle (at 2b874c0878fe)

- eval: E7
  run_id: minted-bring-out-claude-design-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/two-way.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    two-way: every case held

- eval: E8
  run_id: minted-bring-out-claude-design-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/default.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    default: default-claude-design waits on the owner with no answer written, and the ledger has no row for it (at 2b874c0878fe)

- eval: E9
  run_id: minted-bring-out-claude-design-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/two-way.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    two-way: every case held

- eval: E10
  run_id: minted-bring-out-claude-design-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/clean.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    clean: the five exports carry no email address, phone number, key or path on this machine (at 2b874c0878fe)

- eval: E11
  run_id: minted-bring-out-claude-design-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/two-way.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    two-way: every case held

- eval: E12
  run_id: minted-bring-out-claude-design-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/change-list.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    changes: the branch changes the exports, the push record, the two ledgers by adding lines, the waiting question, wiki log lines and this record, nothing else (from fe9afc7f4137 to 2b874c0878fe)

- eval: E13
  run_id: minted-bring-out-claude-design-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/bring-out-claude-design/rang/two-way.mjs
  verified_at: 2026-11-27T05:10:42Z
  output: |
    two-way: every case held

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bring-out-claude-design-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-27T05:10:42Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-bring-out-claude-design-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-27T05:10:42Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature):

- E1 (`make check`): xanh cả hai phía. Đây là cổng hồi quy chung của kho, không phải phép đo riêng của feature. Chiều đỏ của cổng giữ bản xuất do E3 gánh.

Baseline khong do:

- node _acceptance/bring-out-claude-design/rang/exports.mjs: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/exports.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/two-way.mjs --only exports: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/bundle.mjs: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/bundle.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/two-way.mjs --only bundle: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/leave.mjs: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/leave.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/two-way.mjs --only leave: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/default.mjs: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/default.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/two-way.mjs --only default: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/clean.mjs: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/clean.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/two-way.mjs --only clean: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/change-list.mjs: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/change-list.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/bring-out-claude-design/rang/two-way.mjs --only change-list: bo qua baseline: tep _acceptance/bring-out-claude-design/rang/two-way.mjs co o cay dang kiem nhung chua co o merge-base fe9afc7f4137f1250c840aa195deb863eac62b83 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bị chặn ở bước e2e, có hai phát hiện trong hợp đồng (phép đo so danh sách tệp gửi, kiểu chữ và khoảng cách đọc từ nguồn). Returned to implementation.
Round 2: E1 đến E13 đều xanh, hai lệnh suite (build, e2e) xanh; không eval nào khai judgment nên không có panel chấm, không có mục chờ người.
