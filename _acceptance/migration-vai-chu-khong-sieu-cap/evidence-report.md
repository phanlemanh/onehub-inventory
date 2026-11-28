---
schema_version: 2
feature_slug: migration-vai-chu-khong-sieu-cap
verdict: REJECT
failed_evals: ["E7","E7t"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d28d5ee950c534e3a5498de18ee7ba2a6d279618
human_signoff:
---

# Evidence Report: migration-vai-chu-khong-sieu-cap

Round 2. Nội dung thay toàn bộ round cũ; lịch sử ở mục Iterations. Hai lệnh đỏ đều gắn eval (E7, E7t), không có lệnh đỏ lẻ ngoài eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (mang từ round 1) |
| E2 | AC-2 | script | PASS (mang từ round 1) |
| E3 | AC-3 | script | PASS (mang từ round 1) |
| E4 | AC-4 | script | PASS (mang từ round 1) |
| E5 | AC-5 | script | PASS (mang từ round 1) |
| E1t | AC-3 | script | PASS (mang từ round 1) |
| E6 | AC-6 | script | PASS |
| E6t | AC-6 | script | PASS |
| E7 | AC-7 | script | FAIL |
| E7t | AC-7 | script | FAIL |
| E8 | AC-8 | script | PASS (mang từ round 1) |
| E8b | AC-8 | test | PASS (mang từ round 1) |
| E8c | AC-8 | script | PASS |
| E8d | AC-8 | script | PASS |
| E8e | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-migration-vai-chu-khong-sieu-cap-E1-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-migration-vai-chu-khong-sieu-cap-E2-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-migration-vai-chu-khong-sieu-cap-E3-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-migration-vai-chu-khong-sieu-cap-E4-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-migration-vai-chu-khong-sieu-cap-E5-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E1t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E1t-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-migration-vai-chu-khong-sieu-cap-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs
  verified_at: 2026-11-28T03:26:38Z
  output: |
    pham-vi ok: 30 tệp so với c55415fe, migration chỉ thêm (2 tệp), ngoài hồ sơ chỉ đúng tệp của thiết kế

- eval: E6t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E6t-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs
  verified_at: 2026-11-28T03:26:38Z
  output: |
    tu-kiem: 4/4 ca đúng

- eval: E7
  run_id: minted-migration-vai-chu-khong-sieu-cap-E7-r2
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs
  verified_at: 2026-11-28T03:26:38Z
  output: |
    ci: nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»
    ci: nhật ký e2e-db chạy thật không nhắc tệp chu-khong-sieu-cap.db.test.ts

- eval: E7t
  run_id: minted-migration-vai-chu-khong-sieu-cap-E7t-r2
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs
  verified_at: 2026-11-28T03:26:38Z
  output: |
    DO vat-lanh — nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»
    ok pha-e2e-db-bi-huy — e2e-db trên đầu nhánh d28d5ee9 không xanh (cancelled)
    ok pha-dung-lai-ma-khac — lượt e2e-db được dùng lại ở deadbeef có mã khác đầu nhánh
    ok pha-thieu-6-6 — nhật ký e2e-db chạy thật thiếu «ci-db: 6/6 bước đạt»
    ok pha-chua-xong — lượt CI trên đầu nhánh d28d5ee9 chưa xong (in_progress)
    tu-kiem: 4/5 ca đúng

- eval: E8
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8b
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8b-r1
  exit_code: 0
  verifier: _acceptance/migration-vai-chu-khong-sieu-cap/rang/bai-kiem.sh
  verified_at: 2026-11-28T03:07:31Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8c
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8c-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-28T03:26:38Z
  output: |
    make check passed: upgrade lint typecheck test ignology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E8d
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8d-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.build
  verified_at: 2026-11-28T03:26:38Z
  output: |
    npm run build xanh

- eval: E8e
  run_id: minted-migration-vai-chu-khong-sieu-cap-E8e-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-28T03:26:38Z
  output: |
    gac-hydration: 0 canh bao

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả đầu nhánh lẫn bản gốc): E8c (make check) — là lệnh bảo vệ hồi quy có chủ ý, không chứng minh riêng cho tính năng.

Baseline không đo:
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs --tu-kiem: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/pham-vi.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --cho 60: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs --tu-kiem --cho 60: bo qua baseline: tep _acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs co o cay dang kiem nhung chua co o merge-base c55415fe3cd8cba215c31b56d5794600fd41093b — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, kết quả đồng nhất.

## Iterations

Round 1: các eval E1–E5, E1t, E8, E8b đã chạy và xanh; kết quả được mang sang round 2.
Round 2: E7, E7t đỏ — bộ đọc CI (ci.mjs) không nhận dòng «dùng lại» thật của CI (CI in địa chỉ lượt chạy, mẫu chỉ khớp số), nên khi e2e-db ở đầu nhánh dùng lại lượt cũ thì phép kiểm không lần theo được và báo thiếu «ci-db: 6/6 bước đạt». Trả về bước triển khai.
