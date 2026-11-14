---
schema_version: 2
feature_slug: bang-hang-theo-dia-ly
verdict: REJECT
failed_evals: ["E14"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 26336fa6bfaefac285a5f8d777a19eba779b61d2
human_signoff:
---

# Evidence Report: bang-hang-theo-dia-ly

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-3 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | test | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-10 | test | PASS |
| E14 | AC-10 | ui-check | FAIL |
| E15 | AC-2 | script | PASS |

Lệnh fail không gắn eval nào khác ngoài E14: ui-check:E14 (eval E14).

## Evidence

- eval: E1
  run_id: minted-bang-hang-theo-dia-ly-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    exit 0

- eval: E2
  run_id: minted-bang-hang-theo-dia-ly-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E1 (một lần chạy phủ E1, E2, E3, E5, E6)
    exit 0

- eval: E3
  run_id: minted-bang-hang-theo-dia-ly-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E1
    exit 0

- eval: E4
  run_id: minted-bang-hang-theo-dia-ly-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:19:00Z
  output: |
    DB_LANE=k DB_PORT=5564 npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    11 passed (41.6s)

- eval: E5
  run_id: minted-bang-hang-theo-dia-ly-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E1
    exit 0

- eval: E6
  run_id: minted-bang-hang-theo-dia-ly-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E1
    exit 0

- eval: E7
  run_id: minted-bang-hang-theo-dia-ly-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E4
    11 passed (41.6s)

- eval: E8
  run_id: minted-bang-hang-theo-dia-ly-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E4
    11 passed (41.6s)

- eval: E9
  run_id: minted-bang-hang-theo-dia-ly-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E4
    11 passed (41.6s)

- eval: E10
  run_id: minted-bang-hang-theo-dia-ly-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T17:19:00Z
  output: |
    make test
    exit 0

- eval: E11
  run_id: minted-bang-hang-theo-dia-ly-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E4
    11 passed (41.6s)

- eval: E12
  run_id: minted-bang-hang-theo-dia-ly-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:19:00Z
  output: |
    cùng lệnh với E4
    11 passed (41.6s)

- eval: E13
  run_id: minted-bang-hang-theo-dia-ly-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T17:19:00Z
  output: |
    make test
    exit 0

- eval: E14
  run_id: minted-bang-hang-theo-dia-ly-E14-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T17:19:00Z
  screenshot: evidence/E14-phan-khu-1440-sang.png
  observed: |
    1440 sáng: cột thứ hai có «Bảng hàng / Tất cả hàng», «Theo trạng thái» sáu mục, rồi mỗi dự án một nhóm (Vinhomes Ocean Park 1 gồm Tất cả, The Sapphire 1, S1.01, S1.02, S1.03, S1.05; Park 2 có [MAU] Toà E1; Park 3 có [MAU] Toà C1), không số đếm, chỉ «The Sapphire 1» sáng, chân bảng «36 / 60 dòng».
    Nhưng ô lọc Toà hiện «S1.01, S1.02, S» và ô Dự án hiện «Vinhomes Ocean P» (bị cắt), trái với expected «hiện trọn tên». Ở 360 sau [MAU] Toà E1 chân bảng «12 / 60 dòng» nhưng ô Toà «[MAU] Toà E» và ô Dự án cũng bị cắt. Màn /sent và /tuy-chinh-san không có cây, giống hệt ảnh trước; trang tuỳ chỉnh báo «Vùng này chưa tải được» vì yêu cầu company-layer của ứng dụng lỗi.
  network_observed: app-fail

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-14T17:19:00Z

- cmd: npm run build
  run_id: minted-bang-hang-theo-dia-ly-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T17:19:00Z

- cmd: make e2e
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-14T17:19:00Z

- eval: E15
  run_id: minted-bang-hang-theo-dia-ly-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T17:19:00Z
  output: |
    node "$R/scripts/design-floor-khuon.mjs" --kiem --root .
    14 tệp giao diện ngoài bản đồ

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline; chứng minh harness chứ chưa chứng minh tính năng, nên viết lại để assert hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý):
- make test (E10, E13)
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-khuon.mjs" --kiem --root . (E15)

Baseline khong do
- npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/listings/ui/geo-tree.test.ts co o cay dang kiem nhung chua co o merge-base 93a72ddedab0e31399631b3d632d9592f9c256b4 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts: bo qua baseline: tep tests/e2e-db/dia-ly.spec.ts co o cay dang kiem nhung chua co o merge-base 93a72ddedab0e31399631b3d632d9592f9c256b4 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E14 failed — ô lọc Dự án và Toà hiện tên bị cắt (không hiện trọn tên như expected), và yêu cầu company-layer của ứng dụng lỗi trên màn /tuy-chinh-san (lệch lược đồ DB lane K, đã có từ trước thay đổi này). Returned to implementation.
