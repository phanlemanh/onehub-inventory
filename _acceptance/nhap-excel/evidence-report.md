---
schema_version: 2
feature_slug: nhap-excel
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f8f49b386291ab8c1b9694bb5da0e1e47ae01168
human_signoff:
---

# Evidence Report: nhap-excel

Vòng 2. Mọi eval máy đều chạy xong và qua; verdict REJECT được tính sẵn vì còn ba phát hiện trong hợp đồng (AC-7, AC-2, AC-7) trong review-findings.md. Eval E10 và E23 mang từ vòng 1.

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
| E10 | AC-7 | script | PASS (carry-forward từ vòng 1) |
| E11 | AC-7 | test | PASS |
| E12 | AC-8 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-12 | script | PASS |
| E17 | AC-12 | script | PASS |
| E18 | AC-12 | ui-check | PASS |
| E19 | AC-11 | ui-check | PASS |
| E20 | AC-6 | script | PASS |
| E21 | AC-3 | script | PASS |
| E22 | AC-13 | script | PASS |
| E23 | AC-11 | script | PASS (carry-forward từ vòng 1) |
| E24 | AC-12 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-nhap-excel-E1-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:20:40Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, không có dòng lỗi

- eval: E3
  run_id: minted-nhap-excel-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest của E1 (tests/nhap-excel-ghep-cot.test.ts nằm trong lượt chạy), kết thúc thành công

- eval: E5
  run_id: minted-nhap-excel-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest của E1 (tests/nhap-excel-gia-tri.test.ts nằm trong lượt chạy), kết thúc thành công

- eval: E7
  run_id: minted-nhap-excel-E7-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest của E1 (tests/nhap-excel-khong-mat-o.test.ts nằm trong lượt chạy), kết thúc thành công

- eval: E11
  run_id: minted-nhap-excel-E11-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest của E1 (tests/nhap-excel-ontology.test.ts nằm trong lượt chạy), kết thúc thành công

- eval: E2
  run_id: minted-nhap-excel-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:20:40Z
  output: |
    DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-nhap-excel-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh playwright của E2, kết thúc thành công
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-nhap-excel-E16-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh playwright của E2, kết thúc thành công
    gac-hydration: 0 canh bao

- eval: E20
  run_id: minted-nhap-excel-E20-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh playwright của E2, kết thúc thành công
    gac-hydration: 0 canh bao

- eval: E21
  run_id: minted-nhap-excel-E21-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh playwright của E2, kết thúc thành công
    gac-hydration: 0 canh bao

- eval: E4
  run_id: minted-nhap-excel-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    lệnh kết thúc thành công, không có dòng lỗi

- eval: E6
  run_id: minted-nhap-excel-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E8
  run_id: minted-nhap-excel-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E9
  run_id: minted-nhap-excel-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E12
  run_id: minted-nhap-excel-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E13
  run_id: minted-nhap-excel-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E14
  run_id: minted-nhap-excel-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E22
  run_id: minted-nhap-excel-E22-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T16:20:40Z
  output: |
    cùng lệnh vitest DB của E4, kết thúc thành công

- eval: E17
  run_id: minted-nhap-excel-E17-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T16:20:40Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E24
  run_id: minted-nhap-excel-E24-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T16:20:40Z
  output: |
    9 tệp giao diện ngoài bản đồ

- eval: E18
  run_id: minted-nhap-excel-E18-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T16:20:40Z
  screenshot: evidence/ui/nhap-tep-tai-1440.png
  observed: |
    1440 nhap-tep-tai: the stepper shows five steps (Chon tep, Ghep cot, Gia tri va ma, Xem truoc, Xong), step 1 is active, there is a file drop zone, and Tiep is disabled.
    1440 nhap-tep-ghep-cot (ban.xlsx, 4 rows): the Ma can, Block, DT, PN, Gia KBP, Gia and TT rows are tagged Giu nguyen or May sua, with Chan on the two Gia columns ('Hai cot cung di vao mot cho'). 'View' carries a 'Can nguoi' tag ('Ten cot la - chon noi di vao'). 'SDT chu' carries a 'Chan' tag ('So va ten chu nha chua nhap o day - bo cot'). Tiep (7) is enabled.
    1440 nhap-tep-xem-truoc-ban: the four counts are Giu nguyen 14, May sua 0, Can nguoi 9, Chan 13. The preview table has red and amber cells. 'Con 13 cho chan' is shown and 'Ap 0 dong - 9 o giu chu goc' is faded and disabled.
    1440 nhap-tep-xong (gon.xlsx): the stepper has all five steps filled. 'Da them 3 dong' with 'Vua hoc cho lan sau' and a bullet 'Can cho khop: SA5-12.08', plus a 'Hoan tac lan nhap' button.
    1024 ghep-cot: the same tags are present, but the long checkbox text is clipped at the right edge.
    1024 xem-truoc-ban: the four counts and the disabled Ap button are the same, and the table is cut off at the right.
    1024 xong: 'Da them 3 dong' with a longer learned list (Mau nhap gon.xlsx, two Nhan rieng, Can cho khop) and Hoan tac.
    1440 dau-chu-mo: the Truong nhom preview of gon.xlsx, with an open agent picker listing '[Ten] Nap tep ListAgent' above 'Ap 3 dong'.
  network_observed: n-a (driver)

- eval: E19
  run_id: minted-nhap-excel-E19-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T16:20:40Z
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    Frame 1 (inventory-trong-1440.png): the Bảng hàng screen for the company "[Sàn thử nạp tệp]". Breadcrumb is "Bảng hàng > Tất cả hàng". An outlined "Nạp tệp" button sits at the top right of the header. The table card shows "0 dòng", and the empty message reads "Chưa có dữ liệu ở đây / Sàn chưa có căn nào đang chào trên Bảng hàng. / Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." with "Nạp tệp" as an underlined link. The left rail has an import icon. Matches Expected.
    Frame 2 (inventory-sau-nhap-1440.png): the same company, "3 dòng". Row 1 has code ZZ-99.01 (the code the catalog lacks), with tower "Toà của tệp", no project ("—"), status "Đang bán" and price 2,1 tỷ. That is the pending-match listing with its source code in the code column. Rows 2 and 3 have codes 0905 and 0906, tower S1.01, project "Vinhomes Ocean Pa...", status "Đang bán", prices 4,65 tỷ and 3,9 tỷ. The "Nạp tệp" button is still at the top right, and the left rail now lists the project and tower tree. Matches Expected.
    Frame 3 (inventory-dau-khach-1440.png): the same three rows and the same table. There is no "Nạp tệp" button in the header, no import icon in the left rail, and the rail ends at the sliders icon. The Đầu khách role has no import entry. Matches Expected.
  network_observed: n-a (driver)

- eval: E10
  run_id: minted-nhap-excel-E10-r1
  exit_code: 0
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T11:09:53Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E23
  run_id: minted-nhap-excel-E23-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-27T16:20:40Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nhap-excel-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-27T16:20:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả bản chấm lẫn baseline, chứng tỏ harness chứ không phải tính năng; nên viết lại để khẳng định hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý):

- E24 (lệnh: R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-khuon.mjs" --kiem --root .) — baseline: green

Baseline khong do

- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts: bo qua baseline: tep tests/e2e-db/nhap-excel.spec.ts co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/nhap-excel.db.test.ts co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: REJECT — sáu phát hiện trong hợp đồng của S4 vòng 1 và e2e của kho hàng đỏ. Trả về triển khai (đã sửa ở e9e58e38, bổ sung ca ở f8f49b38).
Round 2: REJECT — mọi eval máy qua; còn ba phát hiện trong hợp đồng (AC-7 gói giữa chừng hỏng, AC-2 cột chủ nhà chỉ chặn tiêu đề khớp nguyên văn, AC-7 căn chờ đã khớp danh mục vẫn nhận lần chào thứ hai). Trả về triển khai.
