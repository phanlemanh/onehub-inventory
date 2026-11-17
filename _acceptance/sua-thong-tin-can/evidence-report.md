---
schema_version: 2
feature_slug: sua-thong-tin-can
verdict: REJECT
failed_evals: ["E2-ui"]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2e4292f1541b36ea29c1b8f37d8e16da4327f4a1
human_signoff:
---

# Evidence Report: sua-thong-tin-can

Round 1. Lệnh fail không gắn eval nào: `make check` (thoát khác 0, bước test của repo đỏ) và `ui-check:E2-ui` (gắn E2-ui, xem bảng).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | FAIL |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6-ui | AC-6 | ui-check | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | test | PASS |
| E13 | AC-11 | test | PASS |
| E13b | AC-11 | test | PASS |
| E13-ui | AC-11 | ui-check | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-thong-tin-can-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest (listings, write-failure, use-change, sua-thong-tin-can, sua-thong-tin-may-chu, mot-luat-ghi, bang-hang-khong-du-quyen, hop-long-nen-mo): lệnh xanh.

- eval: E1b
  run_id: minted-sua-thong-tin-can-E1b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E2
  run_id: minted-sua-thong-tin-can-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-17T05:08:47Z
  output: |
    playwright tests/e2e/sua-thong-tin-can.spec.ts: xanh.
    gac-hydration: 0 canh bao

- eval: E2b
  run_id: minted-sua-thong-tin-can-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e_db
  verified_at: 2026-11-17T05:08:47Z
  output: |
    playwright DB case (lane h, port 5567): xanh.
    gac-hydration: 0 canh bao

- eval: E2-ui
  run_id: minted-sua-thong-tin-can-E2-ui-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-17T05:08:47Z
  screenshot: evidence/E2-ho-so-1440.png
  observed: |
    E2-ho-so-1440.png: grid of 60 rows on the left, record drawer on the right for 0905 · S1.01. Section «LẦN CHÀO ĐANG MỞ» has «Sửa» (pencil icon, small secondary button) at the right of its header. Rows: Pháp lý Sổ hồng, Nội thất Đầy đủ nội thất, Tài chính Không vay, Hiện trạng Để trống. No «n/5» count and no «Báo sai thông tin» button visible in this frame (drawer scrolled).
    E2-hop-1440.png: centred dialog «Sửa thông tin căn 0905» with four fields in this order: Pháp lý (text, Sổ hồng), Nội thất (select, Đầy đủ nội thất), Tài chính (text, Không vay), Hiện trạng (select, Để trống); buttons «Thôi» and primary «Lưu»; backdrop blurred.
    E2-da-luu-1440.png: dialog closed; the section now shows Hợp đồng mua bán A [MAU], Một phần nội thất, Hỗ trợ vay 70% A [MAU], Chủ đang ở. A toast «Đã đổi thông tin căn 0905.» with «Hoàn tác» is shown and covers part of the «Các lần chào» rows. The count is not visible.
    E2-ho-so-360.png: full-width record at 360. Header 0905, 5,71 tỷ, «Mức đủ thông tin 5/5» bar, section «CĂN» with «Báo sai thông tin» at its right in the same small secondary style, then «LẦN CHÀO ĐANG MỞ» with «Sửa» at the right in the same style and place. Pháp lý Sổ hồng, Nội thất Đầy đủ nội thất, Tài chính Không vay (the floating N button overlaps the label of the Nội thất row).
    E2-hop-360.png: dialog nearly full width with the same four fields in the same order, «Lưu» primary stacked above «Thôi», no clipping.
    E2-da-luu-360.png: dialog closed; Pháp lý Hợp đồng mua bán B [MAU], Hiện trạng Chủ đang ở visible (Nội thất and Tài chính rows hidden behind the toast and N button; values read from DOM: Một phần nội thất, Hỗ trợ vay 70% B [MAU]). «Mức đủ thông tin» still 5/5; «Xác nhận hôm nay» replaced «16 ngày trước». Conclusion: position, four fields and value changes are correct at both sizes; the count does not change (5/5 to 5/5), which contradicts Expected, so this eval FAILS. Likely cause: the chosen first row is already complete, so no count change is possible; a row with a missing field, or clearing a field, would be needed to show it (the repo e2e case uses unit 1101 for that).
  network_observed: clean
  output: |
    Driver: Playwright library, server port 3487 (worktree, sample mode). Four of five assertions pass: «Sửa» placed in the section header at both sizes, exactly four fields, four rows changed after «Lưu» at both sizes. The count «n/5» read 5/5 before and 5/5 after at both sizes (record already complete), against Expected that it changes. Frames saved: E2-ho-so-1440.png, E2-hop-1440.png, E2-da-luu-1440.png, E2-ho-so-360.png, E2-hop-360.png, E2-da-luu-360.png. Raw network in evidence/E2-ui-network.txt.

- eval: E3
  run_id: minted-sua-thong-tin-can-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E4
  run_id: minted-sua-thong-tin-can-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E4b
  run_id: minted-sua-thong-tin-can-E4b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E5
  run_id: minted-sua-thong-tin-can-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E6
  run_id: minted-sua-thong-tin-can-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E6b
  run_id: minted-sua-thong-tin-can-E6b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E6-ui
  run_id: minted-sua-thong-tin-can-E6-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-17T05:08:47Z
  screenshot: evidence/E6-ui-step1.png
  observed: |
    Text: the Ghi chú cell of row 1 is open as a text input with a blue focus outline, holding "Chủ cần bán nhanh". Number: the Chỗ xe cell of row 1 is an empty input with the same blue outline. Date: the Bàn giao cell is an input with the same outline and the placeholder dd/mm/yyyy. Single select: the Hướng view cell opens a framed blue-outline list with Hồ, Phố, Chưa có. Boolean: the Ban công cell opens the same style of list with Có, Không, Chưa có. All five run on the real company (title [MAU rieng-...]) in the same table, the same blue outline and the same cell size. This matches "Năm bộ sửa đúng kiểu, cùng khung".
  network_observed: n-a (driver)
  output: |
    Playwright DB case o-rieng-that (project 1440, lane H DB 5567): 1 passed; gac-hydration 0 warnings. Five frames saved and each opened: E6-text-1440.png, E6-number-1440.png, E6-date-1440.png, E6-single_select-1440.png, E6-boolean-1440.png.

- eval: E7
  run_id: minted-sua-thong-tin-can-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E7b
  run_id: minted-sua-thong-tin-can-E7b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E8
  run_id: minted-sua-thong-tin-can-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E9
  run_id: minted-sua-thong-tin-can-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-17T05:08:47Z
  output: |
    playwright tests/e2e/sua-thong-tin-can.spec.ts: xanh.
    gac-hydration: 0 canh bao

- eval: E9b
  run_id: minted-sua-thong-tin-can-E9b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E10
  run_id: minted-sua-thong-tin-can-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-17T05:08:47Z
  output: |
    design-floor-khuon --kiem: 20 tệp giao diện ngoài bản đồ

- eval: E11
  run_id: minted-sua-thong-tin-can-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-17T05:08:47Z
  output: |
    design-floor-s4: không mã màu thô trên tệp giao diện vòng chạm.

- eval: E12
  run_id: minted-sua-thong-tin-can-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E13
  run_id: minted-sua-thong-tin-can-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  output: |
    vitest cùng lệnh với E1: xanh.

- eval: E13b
  run_id: minted-sua-thong-tin-can-E13b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-17T05:08:47Z
  output: |
    playwright tests/e2e/sua-thong-tin-can.spec.ts: xanh.
    gac-hydration: 0 canh bao

- eval: E13-ui
  run_id: minted-sua-thong-tin-can-E13-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-17T05:08:47Z
  screenshot: evidence/E13-luoi-1440.png
  observed: |
    E13-luoi-1440.png: the "Bảng hàng" grid with 60 rows. Căn and Toà are pinned (Toà shows a pin-off icon). Then come Dự án, Trạng thái, Giá chào, Về tay, Diện tích, Phòng ngủ, and Nội thất starting to appear at the right edge. Lock icons show on rows 9 and 12.
    E13-bon-cot-1440.png: scrolled right, the headers Nội thất (filter "Chọn"), Pháp lý, Tài chính, Hiện trạng (filter "Chọn") and Xác nhận lúc are all visible after the pinned Căn and Toà. Rows 0606 and 1201 show lock icons in the four new columns. Row 1101 reads "Một phần nội thất / Hợp đồng mua bán / — / Chủ đang ở".
    E13-o-noi-that-1440.png: row 1101 in the Nội thất cell is selected with a blue border, and a picker with four options (Đầy đủ nội thất highlighted, Một phần nội thất, Không nội thất, Chưa có) sits flush on the cell, the same width as the column. The footer shows "1 ô đã chọn · Ctrl+C để chép".
    E13-luoi-1024.png: the grid at 1024 is cut off after Giá chào, with no overlap or horizontal page scroll.
    E13-bon-cot-1024.png: Nội thất, Pháp lý and Tài chính (cut at the edge) are visible beside the pinned Căn and Toà. Lock icons show on rows 9 and 12 in the same columns. The earlier frame at the far-right scroll had hidden three of the four columns behind the pinned area, so it was redone with Nội thất at the pinned edge.
    Result against Expected: the four columns are in the right place at both sizes, the locks are right, and the picker uses the same frame as the cell. Caveat: at 1024 the four cannot all fit in view together, so they are reached by scrolling.
  network_observed: no-app-traffic
  output: |
    Picker frame: the popover sits flush on the cell, same left edge and width as the Nội thất column, blue focus border, 4 options. Frames saved: E13-luoi-1440.png, E13-luoi-1024.png, E13-bon-cot-1440.png, E13-bon-cot-1024.png, E13-o-noi-that-1440.png.

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-sua-thong-tin-can-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-17T05:08:47Z
  output: |
    Test Files  4 failed | 150 passed (154)
    Tests  5 failed | 2493 passed | 2 skipped (2500)
    Lỗi nằm ở tools/proof_gate/proof-gate-0023.test.ts:1193 và tools/proof_gate/proof-gate.test.ts:809, cùng sua-trang (ảnh chụp ngoài cửa chung ở tests/e2e-db/sua-thong-tin-can.spec.ts:192).

- cmd: npm run build
  run_id: minted-sua-thong-tin-can-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-17T05:08:47Z

- cmd: make e2e
  run_id: minted-sua-thong-tin-can-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-17T05:08:47Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E10 (lệnh design-floor-khuon --kiem)
- E11 (lệnh design-floor-s4)

Baseline không đo:
- npx vitest run src/modules/listings src/lib/write-failure.test.ts src/components/candidate/use-change.test.tsx tests/sua-thong-tin-can.test.tsx tests/sua-thong-tin-may-chu.test.ts tests/mot-luat-ghi.test.ts tests/bang-hang-khong-du-quyen.test.tsx tests/bang-hang-khong-du-quyen-doi-chung.test.tsx tests/hop-long-nen-mo.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/lib/write-failure.test.ts co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- npx playwright test tests/e2e/sua-thong-tin-can.spec.ts: bo qua baseline: tep tests/e2e/sua-thong-tin-can.spec.ts co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-h} DB_PORT=${DB_PORT:-5567} npx playwright test -c playwright.db.config.ts tests/e2e-db/sua-thong-tin-can.spec.ts: bo qua baseline: tep tests/e2e-db/sua-thong-tin-can.spec.ts co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E2-ui failed — số «n/5» không đổi (5/5 trước và sau, căn 0905 đã đủ thông tin); thêm `make check` đỏ ngoài eval (bước test của repo, gồm sua-trang bắt ảnh chụp ngoài cửa chung). Returned to implementation.
