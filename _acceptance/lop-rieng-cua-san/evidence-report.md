---
schema_version: 2
feature_slug: lop-rieng-cua-san
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: af0c23278156d4fd420f9f16c033ed9968f4535e
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: lop-rieng-cua-san

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-8 | test | PASS |
| E11 | AC-8 | ui-check | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | ui-check | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-10 | script | PASS |
| E16 | AC-10 | test | PASS |
| E17 | AC-8 | script | PASS |
| E18 | AC-9 | script | PASS |
| E19 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-lop-rieng-cua-san-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:50:16Z
  output: |
    DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx vitest run -c vitest.db.config.ts tests/db/lop-rieng.db.test.ts --reporter=verbose
    lệnh chạy xong, không có ca đỏ

- eval: E2
  run_id: minted-lop-rieng-cua-san-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:50:16Z
  output: |
    cùng lệnh vitest tests/db/lop-rieng.db.test.ts (khối fields), lệnh chạy xong, không có ca đỏ

- eval: E4
  run_id: minted-lop-rieng-cua-san-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:50:16Z
  output: |
    cùng lệnh vitest tests/db/lop-rieng.db.test.ts (khối value aliases), lệnh chạy xong, không có ca đỏ

- eval: E5
  run_id: minted-lop-rieng-cua-san-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:50:16Z
  output: |
    cùng lệnh vitest tests/db/lop-rieng.db.test.ts (khối pending units), lệnh chạy xong, không có ca đỏ

- eval: E6
  run_id: minted-lop-rieng-cua-san-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:50:16Z
  output: |
    cùng lệnh vitest tests/db/lop-rieng.db.test.ts (khối import templates), lệnh chạy xong, không có ca đỏ

- eval: E8
  run_id: minted-lop-rieng-cua-san-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:50:16Z
  output: |
    cùng lệnh vitest tests/db/lop-rieng.db.test.ts (khối permissions), lệnh chạy xong, không có ca đỏ

- eval: E7
  run_id: minted-lop-rieng-cua-san-E7-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_r
  verified_at: 2026-11-14T01:50:16Z
  output: |
    cach-ly: 36 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E9
  run_id: minted-lop-rieng-cua-san-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-14T01:50:16Z
  output: |
    3 passed (1.6m)

- eval: E12
  run_id: minted-lop-rieng-cua-san-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-14T01:50:16Z
  output: |
    3 passed (1.6m)

- eval: E19
  run_id: minted-lop-rieng-cua-san-E19-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-14T01:50:16Z
  output: |
    3 passed (1.6m)

- eval: E15
  run_id: minted-lop-rieng-cua-san-E15-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T01:50:16Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E13
  run_id: minted-lop-rieng-cua-san-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T01:50:16Z
  screenshot: evidence/E13-step1.png
  observed: |
    360 light: header "Trường riêng" and a "Thêm trường riêng" button. The grid shows # / Tên trường / Kiểu with rows Hướng view (Chọn một) and Ghi chú (Chữ), and a "···" at the end of each row. The grid scrolls horizontally inside its own area. The five parts are not in the main view; they sit in the drawer. 414 light is the same, with the Lựa chọn column partly visible and cut by the grid edge, not overlapping. 360-ngan and 414-ngan (light, and 360-ngan dark): the drawer "Tuỳ chỉnh của sàn" lists the five parts with Trường riêng highlighted, and the page behind is dimmed. 1024: a second column lists the five parts. The grid has Tên trường, Kiểu and Lựa chọn, with a "···" per row and the scrollbar inside the grid only. The first header's sort or pin icon is clipped. 1440: the same layout fully widened, with no clipping. menu-1440: the "···" menu shows Sửa and Ngừng dùng. them-truong-1440: a dialog with the fields Tên trường and Kiểu and the buttons Thôi and Thêm. mau-1440 (Mẫu nhập, empty): the title "Chưa có dữ liệu ở đây" and the lines "Chưa có mẫu nào. Mẫu sinh ra sau lần nhập bảng hàng đầu tiên." chi-doc-1440: the same grid with no add button and no "···" cell. The dark frames I opened (360, 1024, mau-1440, 360-ngan) match the light ones, with readable contrast. No overlapping text in any opened frame.
  network_observed: n-a (driver)

### Eval mang từ round trước (carry-forward)

- eval: E3
  run_id: minted-lop-rieng-cua-san-E3-r1
  exit_code: 0
  verifier: config:executors.test.lop_rieng_unit
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-lop-rieng-cua-san-E10-r1
  exit_code: 0
  verifier: config:executors.test.lop_rieng_unit
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-lop-rieng-cua-san-E11-r1
  exit_code: 0
  verifier: config:capture.ui
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  screenshot: evidence/E11-step1.png
  observed: |
    Ở 1440 sáng, tiêu đề cột Block nằm đúng chỗ Toà (giá trị S1.01, S1.02); kéo đến cuối lưới thì Hướng view và Ghi chú theo sau Xác nhận lúc, giá trị Hồ, Phố, Công viên và "Chủ cần bán nhanh" đọc được, không cắt.
    Nền tối chữ sáng rõ, huy hiệu trạng thái đọc được; ở 1024, 414 và 360 cột ghim giữ chỗ, phần còn lại cuộn ngang, không vỡ. Nhận xét nhỏ: vài vạch mảnh cạnh cột ghim ở nền tối, không ảnh hưởng đọc.
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-lop-rieng-cua-san-E14-r1
  exit_code: 0
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-lop-rieng-cua-san-E16-r1
  exit_code: 0
  verifier: config:executors.test.lop_rieng_unit
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-lop-rieng-cua-san-E17-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E18
  run_id: minted-lop-rieng-cua-san-E18-r1
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-14T01:19:59Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lop-rieng-cua-san-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T01:50:16Z

- cmd: make e2e
  run_id: minted-lop-rieng-cua-san-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-14T01:50:16Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline): E15 (make check) — regression-guard có chủ ý, không khẳng định hành vi mới.

Baseline không đo:
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx vitest run -c vitest.db.config.ts tests/db/lop-rieng.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/lop-rieng.db.test.ts co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/lop-rieng.spec.ts: bo qua baseline: tep tests/e2e-db/lop-rieng.spec.ts co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E13 (kiểm giao diện màn Tuỳ chỉnh của sàn) không đạt — trả về cho bước sửa, commit 26ff867 (cách ly năm bảng, khoá đơn vị khớp, câu từ chối, ảnh điện thoại).
Round 2: E1, E2, E4, E5, E6, E7, E8, E9, E12, E13, E15, E19 chạy lại và đạt; E3, E10, E11, E14, E16, E17, E18 mang từ round 1; lệnh build và e2e xanh. Verdict PASS.

### Re-pin lần 1 — 2026-11-14, do ghim lại bằng làn eval
run_id: repin-20261114T150439Z-52008
sha: af0c23278156d4fd420f9f16c033ed9968f4535e · suites: 3 lệnh exit 0 · evals: 17/17 eval máy đạt kỳ vọng · ngoài làn máy: E11, E13 · diff chạm vật đo ngoài làn máy: E11, E13 — chưa chứng lại, đi vòng S4 delta
Chấm lại bằng mắt E11, E13 trên ảnh dựng lại từ af0c232 (2026-11-14, dãy R, theo G-1411-48; ảnh trong `evidence/`): đạt.
- E11: «Block» đứng ở chỗ Toà; «Hướng view», «Ghi chú» sau «Xác nhận lúc» (inventory-1440-cuoi.png); giá trị mẫu đọc được; ở 360 cột không vỡ; nền tối đủ tương phản.
- E13: cột thứ hai (ngăn trượt ở 360) liệt kê năm phần; vùng Lưới có «…» cuối dòng, menu mở «Sửa», «Ngừng dùng»; phần trống nói lý do, chỉ đường nhập và có «Tải lại»; vai chỉ đọc không có nút ghi; không chữ đè, không cuộn ngang ngoài vùng Lưới. Khác bản đã ký đúng hai chỗ dáng đã báo chủ kho: tiêu đề lớn «Tuỳ chỉnh của sàn», nút «Tải lại» ở trạng thái trống.
