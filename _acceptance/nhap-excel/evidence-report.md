---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6bfdb1828c75a2a695fb3ceee7ad4870976c9c0f
human_signoff:
---

# Evidence Report: nhap-excel

Round 3. Nội dung này thay trọn báo cáo round cũ; lịch sử round nằm ở mục Iterations.

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
| E11 | AC-7 | test | PASS |
| E12 | AC-8 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-12 | script | PASS |
| E17 | AC-12 | script | PASS |
| E18 | AC-12 | ui-check | PASS |
| E19 | AC-11 | ui-check | PASS (carry-forward từ round 2) |
| E20 | AC-6 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-13 | script | PASS |
| E23 | AC-11 | script | PASS (carry-forward từ round 1) |
| E24 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nhap-excel-E1-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:56:56Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel: toàn bộ ca xanh, lệnh kết thúc thành công.

- eval: E3
  run_id: minted-nhap-excel-E3-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:56:56Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel: toàn bộ ca xanh, lệnh kết thúc thành công.

- eval: E5
  run_id: minted-nhap-excel-E5-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:56:56Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel: toàn bộ ca xanh, lệnh kết thúc thành công.

- eval: E7
  run_id: minted-nhap-excel-E7-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:56:56Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel: toàn bộ ca xanh, lệnh kết thúc thành công.

- eval: E11
  run_id: minted-nhap-excel-E11-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:56:56Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel: toàn bộ ca xanh, lệnh kết thúc thành công.

- eval: E2
  run_id: minted-nhap-excel-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:56:56Z
  output: |
    playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts xanh trên dãy D.
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-nhap-excel-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:56:56Z
  output: |
    playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts xanh trên dãy D.
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-nhap-excel-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:56:56Z
  output: |
    playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts xanh trên dãy D.
    gac-hydration: 0 canh bao

- eval: E20
  run_id: minted-nhap-excel-E20-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:56:56Z
  output: |
    playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts xanh trên dãy D.
    gac-hydration: 0 canh bao

- eval: E21
  run_id: minted-nhap-excel-E21-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:56:56Z
  output: |
    playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts xanh trên dãy D.
    gac-hydration: 0 canh bao

- eval: E4
  run_id: minted-nhap-excel-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E6
  run_id: minted-nhap-excel-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E8
  run_id: minted-nhap-excel-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E9
  run_id: minted-nhap-excel-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E12
  run_id: minted-nhap-excel-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E13
  run_id: minted-nhap-excel-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E14
  run_id: minted-nhap-excel-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E22
  run_id: minted-nhap-excel-E22-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:56:56Z
  output: |
    vitest.db.config.ts tests/db/nhap-excel.db.test.ts: toàn bộ ca xanh trên dãy D.

- eval: E10
  run_id: minted-nhap-excel-E10-r3
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T16:56:56Z
  output: |
    cach-ly: 40 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E17
  run_id: minted-nhap-excel-E17-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-27T16:56:56Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E24
  run_id: minted-nhap-excel-E24-r3
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T16:56:56Z
  output: |
    9 tệp giao diện ngoài bản đồ

- eval: E18
  run_id: minted-nhap-excel-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T16:56:56Z
  screenshot: evidence/ui/nhap-tep-tai-1440.png
  observed: |
    1440 frames. tai: five-step bar (Chọn tệp, Ghép cột, Giá trị và mã, Xem trước, Xong), step 1 active, drop zone, Tiếp faded. da-chon: ban.xlsx · 4 dòng, recent import gon.xlsx listed, Tiếp active. ghep-cot: nine rows; Giá KBP and Giá both map to Giá chào and carry a red 'Chặn' mark with 'Hai cột cùng đi vào một chỗ'; 'View' has an empty picker and an orange 'Cần người' mark with 'Tên cột lạ — chọn nơi đi vào'; 'SĐT chủ' has a red 'Chặn' mark with the reason; other rows show 'Giữ nguyên' or 'Máy sửa'; Tiếp (7).
    gia-tri-va-ma: value groups «còn» ở cột TT · 3 ô and «cọc» · 1 ô with empty pickers, plus the note 'Giữ nguyên mã, chờ khớp danh mục: SA5-12.08, R2.11-1503 · 2 ô'. xem-truoc-ban: four marks Giữ nguyên 14, Máy sửa 0, Cần người 9, Chặn 13; red and amber cells in the table; buttons 'Quay lại', 'Còn 13 chỗ chặn' and a faded 'Áp 0 dòng · 9 ô giữ chữ gốc'. xem-truoc (gon.xlsx): marks 14/0/1/0, Áp 3 dòng active.
    xong: 'Đã thêm 3 dòng', 'Vừa học cho lần sau' with 'Căn chờ khớp: SA5-12.08', and 'Hoàn tác lần nhập'. dau-chu-mo: team-lead preview with the agent picker open showing '[Tên] Nạp tệp ListAgent', Áp faded. 1024 frames are the same in structure: tai, ghep-cot (right edge clipped), xem-truoc-ban (same counts, Áp faded), xong (adds 'Mẫu nhập: gon.xlsx' and the learned labels 'Mã căn' and 'Ngày check').
  network_observed: n-a (driver)

- eval: E19
  run_id: minted-nhap-excel-E19-r2
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T16:20:40Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    Frame 1 (inventory-trong-1440.png): the Bảng hàng screen for the company "[Sàn thử nạp tệp]". Breadcrumb is "Bảng hàng > Tất cả hàng". An outlined "Nạp tệp" button sits at the top right of the header. The table card shows "0 dòng", and the empty message reads "Chưa có dữ liệu ở đây / Sàn chưa có căn nào đang chào trên Bảng hàng. / Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." with "Nạp tệp" as an underlined link. The left rail has an import icon. Matches Expected.
    Frame 2 (inventory-sau-nhap-1440.png): the same company, "3 dòng". Row 1 has code ZZ-99.01 (the code the catalog lacks), with tower "Toà của tệp", no project ("—"), status "Đang bán" and price 2,1 tỷ. That is the pending-match listing with its source code in the code column. Rows 2 and 3 have codes 0905 and 0906, tower S1.01, project "Vinhomes Ocean Pa...", status "Đang bán", prices 4,65 tỷ and 3,9 tỷ. The "Nạp tệp" button is still at the top right, and the left rail now lists the project and tower tree. Matches Expected.
    Frame 3 (inventory-dau-khach-1440.png): the same three rows and the same table. There is no "Nạp tệp" button in the header, no import icon in the left rail, and the rail ends at the sliders icon. The Đầu khách role has no import entry. Matches Expected.
  network_observed: n-a (driver)

- eval: E23
  run_id: minted-nhap-excel-E23-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-27T16:56:56Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nhap-excel-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-27T16:56:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline; chứng minh harness, không chứng minh tính năng — xác nhận là lưới hồi quy có chủ ý hoặc viết lại để khẳng định hành vi mới):
- E17 (make check)
- E24 (bước chấm khuôn nhóm luong-nhieu-buoc)

Baseline khong do
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts: bo qua baseline: tep tests/e2e-db/nhap-excel.spec.ts co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/nhap-excel.db.test.ts co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi

Ghi chú khung E18: ở 1024, dòng «Gọi cột này là…» của bước Ghép cột bị cắt mép phải trong thẻ. Đây là ghi chú bố cục nhỏ, không mâu thuẫn với Expected.

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, xác định).

## Iterations

Round 1: E23 chạy và đạt; các eval khác của round này đã được thay bằng round sau.
Round 2: kết quả REJECT với ba lỗi trong hợp đồng của S4 vòng 2, đã sửa ở bc97b401 và 6bfdb182; E19 đạt và được mang sang round 3.
Round 3: mọi eval chạy lại đều đạt; E19 và E23 mang sang vì delta không chạm đường dẫn của chúng. Verdict PASS.
