---
schema_version: 2
feature_slug: dat-khoa-cau-hoi-hien
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 35e48c09521b4cefcf25e5b18c1e73f744952d73
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
  run_id: minted-dat-khoa-cau-hoi-hien-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    kiem: 5/5 ca đạt (/Users/manhphan/dev/onehub-inventory-cham-134/.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795874124215-95553)

- eval: E2
  run_id: minted-dat-khoa-cau-hoi-hien-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    kiem: 5/5 ca đạt (/Users/manhphan/dev/onehub-inventory-cham-134/.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795874124215-95553)

- eval: E3
  run_id: minted-dat-khoa-cau-hoi-hien-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    kiem: 5/5 ca đạt (/Users/manhphan/dev/onehub-inventory-cham-134/.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795874124215-95553)

- eval: E4b
  run_id: minted-dat-khoa-cau-hoi-hien-E4b-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    kiem: 5/5 ca đạt (/Users/manhphan/dev/onehub-inventory-cham-134/.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795874124215-95553)

- eval: E1t
  run_id: minted-dat-khoa-cau-hoi-hien-E1t-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    tu-kiem: 15/15 ca đúng (/Users/manhphan/dev/onehub-inventory-cham-134/.acceptance-runs/dat-khoa-cau-hoi-hien/kiem-1795874124354-95699)

- eval: E4
  run_id: bai-kiem-1795874124038-95336
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    bai-kiem: 2/2 ca đúng (/Users/manhphan/dev/onehub-inventory-cham-134/.acceptance-runs/dat-khoa-cau-hoi-hien/bai-kiem-1795874124038-95336)

- eval: E5
  run_id: minted-dat-khoa-cau-hoi-hien-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    pham-vi ok: 31 tệp so với 81bc090c; ngoài hồ sơ, một dòng nhật ký và hai trang máy vẽ chỉ dat-khoa.mjs và bài kiểm mới; mọi dòng đổi của dat-khoa.mjs nằm trong hàm hỏi (dòng 85–113)

- eval: E5t
  run_id: minted-dat-khoa-cau-hoi-hien-E5t-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    tu-kiem: 5/5 ca đúng

- eval: E6
  run_id: minted-dat-khoa-cau-hoi-hien-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh
  verified_at: 2026-11-28T13:55:13Z
  output: |
    bai-deploy: tools/deploy xanh, có ca dat-khoa-ask

- eval: E6b
  run_id: minted-dat-khoa-cau-hoi-hien-E6b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T13:55:13Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E6c
  run_id: minted-dat-khoa-cau-hoi-hien-E6c-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-28T13:55:13Z
  output: |
    npm run build xanh (không có dòng tóm tắt riêng)

- eval: E6d
  run_id: minted-dat-khoa-cau-hoi-hien-E6d-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-28T13:55:13Z
  output: |
    gac-hydration: 0 canh bao

- eval: E7
  run_id: minted-dat-khoa-cau-hoi-hien-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    ci ok: đầu nhánh 35e48c09521b4cefcf25e5b18c1e73f744952d73 quick, e2e, e2e-db xanh (gate: completed/failure)

- eval: E7t
  run_id: minted-dat-khoa-cau-hoi-hien-E7t-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs
  verified_at: 2026-11-28T13:55:13Z
  output: |
    tu-kiem: 5/5 ca đúng

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt) hoặc không đo được baseline (xem dưới); không eval nào xanh-cả-hai-phía được liệt kê.

Baseline khong do
- node _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/bai-kiem.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/bai-deploy.sh co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- node _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs --tu-kiem: bo qua baseline: tep _acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base 81bc090ced2419afe21cc45fe43c98b45bb088e1 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, deterministic).

## Iterations

Round 3: mọi eval (E1–E7t) đạt trên bản 35e48c09521b4cefcf25e5b18c1e73f744952d73; không có judgment item nào chờ người. Lịch sử round 1 và 2 không nằm trong dữ liệu của lượt này.
