---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f5e5b1b5683db29f3baf66c5774297e991cecd05
human_signoff:
---

# Evidence Report: nhap-excel

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | script | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | test | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-7 | script | PASS |
| E11 | AC-7 | test | PASS (carried từ round 8) |
| E12 | AC-8 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-12 | script | PASS |
| E17 | AC-12 | script | PASS |
| E18 | AC-12 | ui-check | PASS |
| E19 | AC-11 | ui-check | PASS (carried từ round 6) |
| E20 | AC-6 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-13 | script | PASS |
| E23 | AC-11 | script | PASS (carried từ round 1) |
| E24 | AC-12 | script | PASS (carried từ round 4) |

## Evidence

- eval: E1
  run_id: minted-nhap-excel-E1-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T06:10:25Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (một lệnh chung cho E1, E3, E5, E7), một lần chạy, đạt.

- eval: E2
  run_id: minted-nhap-excel-E2-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T06:10:25Z
  output: |
    playwright tests/e2e-db/nhap-excel.spec.ts (một lệnh chung cho E2, E15, E16, E20, E21), một lần chạy, đạt.
    gac-hydration: 0 canh bao

- eval: E3
  run_id: minted-nhap-excel-E3-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T06:10:25Z
  output: |
    tests/nhap-excel-ghep-cot.test.ts nằm trong lần chạy vitest chung với E1, đạt.

- eval: E4
  run_id: minted-nhap-excel-E4-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (một lệnh chung cho E4, E6, E8, E9, E12, E13, E14, E22), đạt.

- eval: E5
  run_id: minted-nhap-excel-E5-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T06:10:25Z
  output: |
    tests/nhap-excel-gia-tri.test.ts nằm trong lần chạy vitest chung với E1, đạt.

- eval: E6
  run_id: minted-nhap-excel-E6-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    khối 'can' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E7
  run_id: minted-nhap-excel-E7-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T06:10:25Z
  output: |
    tests/nhap-excel-khong-mat-o.test.ts nằm trong lần chạy vitest chung với E1, đạt.

- eval: E8
  run_id: minted-nhap-excel-E8-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    khối 'khong duong thang' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E9
  run_id: minted-nhap-excel-E9-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    khối 'ap' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E10
  run_id: minted-nhap-excel-E10-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-28T06:10:25Z
  output: |
    cach-ly: 41 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E11
  run_id: minted-nhap-excel-E11-r8
  exit_code: 0
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  carried_from_round: 8
  # carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-nhap-excel-E12-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    khối 'hoc' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E13
  run_id: minted-nhap-excel-E13-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    khối 'lan hai' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E14
  run_id: minted-nhap-excel-E14-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    khối 'hoan tac' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E15
  run_id: minted-nhap-excel-E15-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T06:10:25Z
  output: |
    ca 'bang hang trong' của tests/e2e-db/nhap-excel.spec.ts nằm trong lần chạy playwright chung, đạt.

- eval: E16
  run_id: minted-nhap-excel-E16-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T06:10:25Z
  output: |
    ca 'trang thai' (28 ô) của tests/e2e-db/nhap-excel.spec.ts nằm trong lần chạy playwright chung, đạt.

- eval: E17
  run_id: minted-nhap-excel-E17-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T06:10:25Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E18
  run_id: minted-nhap-excel-E18-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T06:10:25Z
  screenshot: evidence/ui/nhap-tep-ghep-cot-1440.png
  observed: |
    1440 (all 9 frames opened, plus 1024 for ghep-cot, xem-truoc-ban, xong, dau-chu-mo):
    - nhap-tep-tai: the five-step bar with step 1 active, a file drop zone, and a disabled 'Tiếp' button.
    - nhap-tep-da-chon: ban.xlsx · 4 dòng, 'Lần nạp tệp gần đây: gon.xlsx 3 dòng', and 'Tiếp' enabled.
    - nhap-tep-ghep-cot: the step bar at step 2. Each row shows a column, a mapping and a mark: Mã căn is Giữ nguyên; Block, DT, PN and TT are Máy sửa; Giá KBP and Giá are Chặn ('Hai cột cùng đi vào một chỗ'); View has an empty mapping with a 'Cần người' mark ('Tên cột lạ — chọn nơi đi vào'); 'SĐT chủ' has a 'Chặn' mark ('Số và tên chủ bán hay chủ cho thuê chưa nhập ở đây — bỏ cột'). The button reads 'Tiếp (7)'. At 1024 the same rows fit but the checkbox labels are cut off at the right edge, and the content scrolls sideways.
    - nhap-tep-gia-tri-va-ma: step 3, two value groups («còn» in TT, 3 ô; «cọc» in TT, 1 ô) with empty inputs, and 'Giữ nguyên mã, thành căn chờ khớp: SA5-12.08, R2.11-1503 · 2 ô'.
    - nhap-tep-xem-truoc-ban: step 4, four counts 14/0/9/13, a table with 'Bỏ dòng' per row and yellow and red coloured cells, 'Còn 13 chỗ chặn' and a faded apply button 'Áp 0 dòng · 9 ô giữ chữ gốc' (disabled).
    - nhap-tep-xem-truoc (gon.xlsx): counts 14/0/1/0, 3 rows with one yellow cell SA5-12.08, and 'Áp 3 dòng' enabled.
    - nhap-tep-xong: all 5 steps filled, 'Đã thêm 3 dòng', 'Vừa học cho lần sau' with 'Căn chờ khớp: SA5-12.08' (at 1024 it also lists 'Mẫu nhập: gon.xlsx' and two private labels 'Mã căn' and 'Ngày check'), and a 'Hoàn tác lần nạp tệp' button.
    - nhap-tep-dau-chu-mo: the preview with the list agent picker open, one option '[Tên] Nạp tệp ListAgent', and the 'Áp 3 dòng' button faded until an agent is chosen. At 1024 the same layout with a sideways-scrolling table.
    All of this matches the Expected text. The 1440 and 1024 Xong frames differ in the learned items (a state difference, not a contradiction).
  network_observed: n-a (driver)

- eval: E19
  run_id: minted-nhap-excel-E19-r6
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T23:38:25Z
  carried_from_round: 6
  # carry-forward tu round 6 — delta khong cham paths cua eval
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    1) inventory-trong-1440.png (Đầu chủ, company [Sàn thử nạp tệp], no listings). The "Bảng hàng" screen is open. The grid card shows "0 dòng" and the heading "Chưa có dữ liệu ở đây". Below it is "Sàn chưa có căn nào đang chào trên Bảng hàng." and "Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." where "Nạp tệp" is an underlined link. At the top right of the page header is a bordered "Nạp tệp" button. The left rail also has an import icon. This matches Expected.
    2) inventory-sau-nhap-1440.png (same company after the three-row file). The grid shows 3 dòng. Row 1 is ZZ-99.01, building "Toà của tệp", no project ("—"), status "Đang bán", price 2,1 tỷ. This is the pending-match listing, and its original code is in the "Mã căn" column. Rows 2 and 3 are 0905 and 0906, building S1.01, project Vinhomes Ocean Pa..., status "Đang bán", 4,65 tỷ and 3,9 tỷ. The "Nạp tệp" button is still at the top right. The rail now lists the project Vinhomes Ocean Park 1. This matches Expected.
    3) inventory-dau-khach-1440.png (Đầu khách, same company, same three rows). The grid content is identical to frame 2. The top right of the header has no "Nạp tệp" button. The left icon rail has one icon fewer, with no import icon. The rail's "Theo trạng thái" list has no import entry. This matches Expected: Đầu khách does not see the import entry.
  network_observed: n-a (driver)

- eval: E20
  run_id: minted-nhap-excel-E20-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T06:10:25Z
  output: |
    ca 'so tren man bang so may chu' của tests/e2e-db/nhap-excel.spec.ts nằm trong lần chạy playwright chung, đạt.

- eval: E21
  run_id: minted-nhap-excel-E21-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T06:10:25Z
  output: |
    ca 'nhan rieng tren bang hang' của tests/e2e-db/nhap-excel.spec.ts nằm trong lần chạy playwright chung, đạt.

- eval: E22
  run_id: minted-nhap-excel-E22-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T06:10:25Z
  output: |
    ca 'G-2711-4' của tests/db/nhap-excel.db.test.ts nằm trong lần chạy chung, đạt.

- eval: E23
  run_id: minted-nhap-excel-E23-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E24
  run_id: minted-nhap-excel-E24-r4
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  # carry-forward tu round 4 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r9
  exit_code: 0
  verified_at: 2026-11-28T06:10:25Z

- cmd: DATABASE_URL= make e2e
  run_id: bczfsl8bt
  exit_code: 0
  verified_at: 2026-11-28T06:10:25Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay. Field baseline cua tung eval ghi n-a.

Eval không phân biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make check (E17)
- design-floor-khuon.mjs --kiem --root . (E24)

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, không có phương sai).

## Iterations

Round 9: 24 eval đạt; E1-E10, E12-E18, E20-E22 chạy lại ở HEAD, E11, E19, E23, E24 mang sang từ round trước vì delta không chạm đường dẫn của chúng. Lệnh suite build và e2e đạt. Không có mục nào ở trong hợp đồng cần sửa.
