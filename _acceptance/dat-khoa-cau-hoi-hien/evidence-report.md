---
schema_version: 2
feature_slug: dat-khoa-cau-hoi-hien
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9b8c433ff0dc77cd88e86c11fde893e413c5693d
human_signoff:
---

# Evidence Report: dat-khoa-cau-hoi-hien

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E1t | AC-1 | script | PASS |
| E4 | AC-4 | script | PASS |
| E4b | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E5t | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | script | PASS |
| E6c | AC-6 | script | PASS |
| E6d | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E7t | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dat-khoa-cau-hoi-hien-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795868545898-66638)

- eval: E2
  run_id: minted-dat-khoa-cau-hoi-hien-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795868545898-66638)

- eval: E3
  run_id: minted-dat-khoa-cau-hoi-hien-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795868545898-66638)

- eval: E4b
  run_id: minted-dat-khoa-cau-hoi-hien-E4b-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    kiem: 5/5 ca đạt (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795868545898-66638)

- eval: E1t
  run_id: minted-dat-khoa-cau-hoi-hien-E1t-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    tu-kiem: 13/13 ca đúng (.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795868546733-66833)

- eval: E4
  run_id: minted-dat-khoa-cau-hoi-hien-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    bai-kiem: 2/2 ca đúng (.acceptance-runs/dat-khoa-cau-hoi-hien/bai-kiem-1795868546318-66649)

- eval: E5
  run_id: minted-dat-khoa-cau-hoi-hien-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    pham-vi ok: 28 tệp so với b9fcdd11; ngoài hồ sơ, một dòng nhật ký và hai trang máy vẽ chỉ dat-khoa.mjs và bài kiểm mới; mọi dòng đổi của dat-khoa.mjs nằm trong hàm hỏi (dòng 85–113)

- eval: E5t
  run_id: minted-dat-khoa-cau-hoi-hien-E5t-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    tu-kiem: 5/5 ca đúng

- eval: E6
  run_id: minted-dat-khoa-cau-hoi-hien-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh
  verified_at: 2026-11-28T12:22:06Z
  output: |
    bai-deploy: tools/deploy xanh, có ca dat-khoa-ask

- eval: E6b
  run_id: minted-dat-khoa-cau-hoi-hien-E6b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-28T12:22:06Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6c
  run_id: minted-dat-khoa-cau-hoi-hien-E6c-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-28T12:22:06Z
  output: |
    (npm run build hoàn tất, không có dòng cuối đáng chép)

- eval: E6d
  run_id: minted-dat-khoa-cau-hoi-hien-E6d-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-28T12:22:06Z
  output: |
    make e2e hoàn tất xanh

- eval: E7
  run_id: minted-dat-khoa-cau-hoi-hien-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    ci ok: đầu nhánh 9b8c433ff0dc77cd88e86c11fde893e413c5693d quick, e2e, e2e-db xanh (gate: completed/failure)

- eval: E7t
  run_id: minted-dat-khoa-cau-hoi-hien-E7t-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs
  verified_at: 2026-11-28T12:22:06Z
  output: |
    tu-kiem: 5/5 ca đúng

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): E6b (`make check`) — regression-guard có chủ ý, không đo hành vi mới.

Baseline khong do
- node _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base b9fcdd1110611b250a8a7a3e112b1acd25030f19 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, xác định, không có phương sai.

## Iterations

Round 2: mọi eval xanh trên bản 9b8c433ff0dc77cd88e86c11fde893e413c5693d, verdict PASS. Lịch sử round 1 nằm ở bản báo cáo cũ.
