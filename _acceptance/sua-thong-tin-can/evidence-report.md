---
schema_version: 2
feature_slug: sua-thong-tin-can
verdict: REJECT
failed_evals: ["E13-ui"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fa4437fcec3d5e9b33a6f8e454797d4db11aa855
human_signoff:
---

# Evidence Report: sua-thong-tin-can

Round 2. Nội dung này thay toàn bộ round cũ; lịch sử round nằm ở mục Iterations.

Lệnh fail không gắn eval: không có. Lệnh fail duy nhất là `ui-check:E13-ui` và nó gắn với eval E13-ui.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6-ui | AC-6 | ui-check | PASS |
| E7 | AC-7 | test | PASS (carry-forward round 1) |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS (carry-forward round 1) |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | test | PASS |
| E13 | AC-11 | test | PASS |
| E13b | AC-11 | test | PASS |
| E13-ui | AC-11 | ui-check | FAIL |

## Evidence

- eval: E1
  run_id: minted-sua-thong-tin-can-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung của nhóm AC-1, AC-3 đến AC-8, AC-10, AC-11 chạy xanh.

- eval: E1b
  run_id: minted-sua-thong-tin-can-E1b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E2
  run_id: minted-sua-thong-tin-can-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  output: |
    gac-hydration: 0 canh bao

- eval: E2b
  run_id: minted-sua-thong-tin-can-E2b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e_db
  output: |
    gac-hydration: 0 canh bao

- eval: E2-ui
  run_id: minted-sua-thong-tin-can-E2-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: ui-check (capture.ui, driver npx playwright)
  screenshot: evidence/E2-ho-so-1440.png
  observed: |
    E2-ho-so-1440: record panel for 1101 · S1.01 open beside the grid; «Mức đủ thông tin 4/5», «Còn thiếu: Tài chính». E2-hop-1440: modal «Sửa thông tin căn 1101» with four fields: Pháp lý (Hợp đồng mua bán), Nội thất (Một phần nội thất), Tài chính (empty), Hiện trạng (Chủ đang ở); buttons Thôi and Lưu. E2-da-luu-1440: panel scrolled to «Lần chào đang mở» (right section, with Sửa) showing Pháp lý Sổ đỏ, Nội thất Một phần nội thất, Tài chính Không vay, Hiện trạng Chủ đang ở; toast «Đã đổi thông tin căn 1101» with Hoàn tác. E2-ho-so-360: same record full width, 4/5, «Còn thiếu: Tài chính», «Xác nhận 15 ngày trước». E2-hop-360: the same four-field modal fits the narrow width, Lưu and Thôi stacked. E2-da-luu-360: 5/5 filled bar, «Đủ thông tin», «Xác nhận hôm nay», toast «Đã đổi thông tin căn 1101», Sổ đỏ partly visible under the toast. Matches Expected: right place, all four fields, values and count change at both widths.
  network_observed: n-a (driver)

- eval: E3
  run_id: minted-sua-thong-tin-can-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E4
  run_id: minted-sua-thong-tin-can-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E4b
  run_id: minted-sua-thong-tin-can-E4b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E5
  run_id: minted-sua-thong-tin-can-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E6
  run_id: minted-sua-thong-tin-can-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E6b
  run_id: minted-sua-thong-tin-can-E6b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E6-ui
  run_id: minted-sua-thong-tin-can-E6-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: ui-check (capture.ui, driver Playwright test runner)
  screenshot: evidence/E6-ui-step1.png
  observed: |
    All five frames show the same Bảng hàng grid with the same blue-bordered focus frame on one custom-column cell, in the right editor for its kind. text: Ghi chú cell is an inline text box ("Chủ cần bán nhanh"). number: Chỗ xe cell is an empty right-aligned numeric input. date: Bàn giao cell shows a dd/mm/yyyy date input. single_select: Hướng view cell opens a small list Hồ / Phố / Chưa có. boolean: Ban công cell opens a list Có / Không / Chưa có. Matches expected "five kinds edit correctly, same frame".
  network_observed: n-a (driver)

- eval: E7
  run_id: minted-sua-thong-tin-can-E7-r1
  exit_code: 0
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7b
  run_id: minted-sua-thong-tin-can-E7b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E8
  run_id: minted-sua-thong-tin-can-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E9
  run_id: minted-sua-thong-tin-can-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  output: |
    gac-hydration: 0 canh bao

- eval: E9b
  run_id: minted-sua-thong-tin-can-E9b-r1
  exit_code: 0
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-17T05:08:47Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-sua-thong-tin-can-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  output: |
    21 tệp giao diện ngoài bản đồ

- eval: E11
  run_id: minted-sua-thong-tin-can-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  output: |
    Bước chấm sàn thiết kế không báo mã màu thô.

- eval: E12
  run_id: minted-sua-thong-tin-can-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E13
  run_id: minted-sua-thong-tin-can-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  output: |
    Lệnh vitest chung chạy xanh.

- eval: E13b
  run_id: minted-sua-thong-tin-can-E13b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  output: |
    gac-hydration: 0 canh bao

- eval: E13-ui
  run_id: minted-sua-thong-tin-can-E13-ui-r2
  exit_code: 1
  baseline: n-a
  verifier: ui-check (capture.ui, driver Playwright)
  screenshot: evidence/E13-luoi-1440.png
  observed: |
    E13-luoi-1440.png: grid with # | Căn | Toà | Dự án | Trạng thái | Giá chào | Về tay | Diện tích | Phòng ngủ | the start of Nội thất, status badges visible, lock icons on rows 0606 and 1201. E13-luoi-1024.png: Căn and Toà pinned, then Dự án, Trạng thái and part of Giá chào. E13-bon-cot-1440.png: Nội thất, Pháp lý, Tài chính, Hiện trạng and Xác nhận lúc all in view to the right of the pinned Căn and Toà; row 1101 shows Một phần nội thất / Hợp đồng mua bán / — / Chủ đang ở; lock icons on 0606 and 1201. E13-bon-cot-1024.png: after scrolling right only Hiện trạng (with its Chọn filter chip) and Xác nhận lúc are visible, so Nội thất, Pháp lý and Tài chính are scrolled under the pinned columns (this contradicts "four in view"). E13-bon-cot-1024-b.png: mid-scroll, only the tail of Tài chính plus Hiện trạng and Xác nhận lúc, so the four never appear together. E13-o-noi-that-1440.png: the editor popup opens on the 1101 Nội thất cell with four options, the first highlighted, framed in blue, aligned with the column; the footer reads "1 ô đã chọn · Ctrl+C để chép".
  network_observed: no-app-traffic
  output: |
    Dùng máy chủ lane H sẵn có ở cổng 3487; URL của harness chuyển về trang đăng nhập nên không dùng. Khung lưu trong evidence/: E13-luoi-1440, E13-luoi-1024, E13-bon-cot-1440, E13-bon-cot-1024, E13-bon-cot-1024-b, E13-o-noi-that-1440, E13-ui-network.txt.
    Ở 1440: thứ tự cột đúng, bốn cột cùng trong tầm nhìn, khoá đúng ở hàng 0606 và 1201, bộ chọn ô Nội thất mở đúng chỗ, bộ lọc cùng khung chip «Chọn».
    Ở 1024, cuộn hết sang phải: chỉ thấy Hiện trạng và Xác nhận lúc. Vùng cuộn rộng 622 px, hai cột ghim Căn và Toà chiếm khoảng 255 px, còn khoảng 367 px; bốn cột cần khoảng 618 px. Cột vẫn tới được và đúng thứ tự (khung giữa cuộn), nhưng bước «cho tới khi thấy cả bốn» không thể đạt ở 1024.
    Mạng: không có fetch/xhr và không có lỗi console ở cả hai khổ.

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-sua-thong-tin-can-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-17T07:58:30Z

- cmd: npm run build
  run_id: minted-sua-thong-tin-can-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-17T07:58:30Z

- cmd: make e2e
  run_id: minted-sua-thong-tin-can-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-17T07:58:30Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code hiện tại lẫn baseline, chứng minh harness chứ không phải feature; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E10: lệnh design-floor-khuon xanh cả hai phía.
- E11: lệnh design-floor-s4 xanh cả hai phía.

Baseline không đo:
- npx vitest run src/modules/listings src/lib/write-failure.test.ts src/components/candidate/use-change.test.tsx tests/sua-thong-tin-can.test.tsx tests/sua-thong-tin-may-chu.test.ts tests/sua-thong-tin-route.test.ts tests/mot-luat-ghi.test.ts tests/bang-hang-khong-du-quyen.test.tsx tests/bang-hang-khong-du-quyen-doi-chung.test.tsx tests/hop-long-nen-mo.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/lib/write-failure.test.ts co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- npx playwright test tests/e2e/sua-thong-tin-can.spec.ts: bo qua baseline: tep tests/e2e/sua-thong-tin-can.spec.ts co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-h} DB_PORT=${DB_PORT:-5567} npx playwright test -c playwright.db.config.ts tests/e2e-db/sua-thong-tin-can.spec.ts: bo qua baseline: tep tests/e2e-db/sua-thong-tin-can.spec.ts co o cay dang kiem nhung chua co o merge-base ea774a0f55a5cda763e63f3f61051fd5a98805ba — eval moi, chay tren code cu khong phan biet gi

Judge panels: không có eval dạng judgment nên không có panel nào cần đề xuất.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7 và E9b đạt; hai eval này được mang sang round 2 vì delta không chạm paths của chúng.
Round 2: E13-ui failed — ở khổ 1024 bốn cột Nội thất, Pháp lý, Tài chính, Hiện trạng không thể cùng hiện trong vùng cuộn (còn khoảng 367 px so với cần khoảng 618 px sau hai cột ghim). Returned to implementation.
