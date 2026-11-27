---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 42d6d2ba02cdb38bf94f025f6f5e93b44f7a915b
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
| E23 | AC-11 | script | PASS |
| E24 | AC-12 | script | PASS |

## Evidence

Các eval chạy lại ở round 6: E9, E14, E15, E19. Các eval còn lại mang từ round trước, vì thay đổi của round này không chạm đường dẫn của chúng.

- eval: E9
  run_id: minted-nhap-excel-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T23:38:25Z
  output: |
    DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    lệnh này cũng phủ E14; lượt chạy xanh.

- eval: E14
  run_id: minted-nhap-excel-E14-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T23:38:25Z
  output: |
    cùng lệnh với E9 (tests/db/nhap-excel.db.test.ts), khối 'hoan tac'; lượt chạy xanh.

- eval: E15
  run_id: minted-nhap-excel-E15-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:38:25Z
  output: |
    DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E19
  run_id: minted-nhap-excel-E19-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T23:38:25Z
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    1) inventory-trong-1440.png (Đầu chủ, company [Sàn thử nạp tệp], no listings). The "Bảng hàng" screen is open. The grid card shows "0 dòng" and the heading "Chưa có dữ liệu ở đây". Below it is "Sàn chưa có căn nào đang chào trên Bảng hàng." and "Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." where "Nạp tệp" is an underlined link. At the top right of the page header is a bordered "Nạp tệp" button. The left rail also has an import icon. This matches Expected.
    2) inventory-sau-nhap-1440.png (same company after the three-row file). The grid shows 3 dòng. Row 1 is ZZ-99.01, building "Toà của tệp", no project ("—"), status "Đang bán", price 2,1 tỷ. This is the pending-match listing, and its original code is in the "Mã căn" column. Rows 2 and 3 are 0905 and 0906, building S1.01, project Vinhomes Ocean Pa..., status "Đang bán", 4,65 tỷ and 3,9 tỷ. The "Nạp tệp" button is still at the top right. The rail now lists the project Vinhomes Ocean Park 1. This matches Expected.
    3) inventory-dau-khach-1440.png (Đầu khách, same company, same three rows). The grid content is identical to frame 2. The top right of the header has no "Nạp tệp" button. The left icon rail has one icon fewer, with no import icon. The rail's "Theo trạng thái" list has no import entry. This matches Expected: Đầu khách does not see the import entry.
  network_observed: n-a (driver)

- eval: E1
  run_id: minted-nhap-excel-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-nhap-excel-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-nhap-excel-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-nhap-excel-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-nhap-excel-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-nhap-excel-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-nhap-excel-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-nhap-excel-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-nhap-excel-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-nhap-excel-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-nhap-excel-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-nhap-excel-E13-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-nhap-excel-E16-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-nhap-excel-E17-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E18
  run_id: minted-nhap-excel-E18-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  screenshot: evidence/E18-step1.png
  observed: |
    1440 tai: five-step bar with step 1 active, a file drop area and a disabled 'Tiếp'.
    1440 da-chon: ban.xlsx · 4 dòng and a 'Lần nhập gần đây' list. 1440 ghep-cot: a row for each column. Mã căn 'Giữ nguyên'. Block, DT, PN and TT 'Máy sửa'. Giá KBP and Giá 'Chặn' (two columns go to one place). View 'Cần người' ('Tên cột lạ — chọn nơi đi vào'). 'SĐT chủ' 'Chặn' ('Số và tên chủ nhà chưa nhập ở đây — bỏ cột'). 'Tiếp (7)'.
    1440 gia-tri-va-ma: the value-mapping groups for 'còn' and 'cọc' in column TT, and the line about codes kept as they are.
    1440 xem-truoc-ban: counts 14/0/9/13, rows coloured amber and red, 'Còn 13 chỗ chặn' and the faded 'Áp 0 dòng · 9 ô giữ chữ gốc'. 1440 xem-truoc (gon.xlsx): 14/0/1/0 and an active 'Áp 3 dòng'.
    1440 dau-chu-mo: the list agent picker open with '[Tên] Nạp tệp ListAgent' and a faded Áp.
    1440 xong: 'Đã thêm 3 dòng', 'Vừa học cho lần sau' with 'Căn chờ khớp: SA5-12.08', and the 'Hoàn tác lần nhập' button.
    1024: the same screens, laid out with the step bar and rows narrower. In 1024 ghep-cot the checkbox text is cut. 1024 xong lists the template, two own labels and the pending unit.
    All of this matches Expected, apart from the word 'dòng' where the Expected text says 'số căn'.
  network_observed: n-a (driver)
  note: carry-forward tu round 4 — delta khong cham paths cua eval; khung của lượt gốc, cùng run_id.

- eval: E20
  run_id: minted-nhap-excel-E20-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E21
  run_id: minted-nhap-excel-E21-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E22
  run_id: minted-nhap-excel-E22-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E23
  run_id: minted-nhap-excel-E23-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E24
  run_id: minted-nhap-excel-E24-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-nhap-excel-SUITE-make_check-r6
  exit_code: 0
  verified_at: 2026-11-27T23:38:25Z

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-27T23:38:25Z

- cmd: DATABASE_URL= make e2e
  run_id: bm8d9myd8
  exit_code: 0
  verified_at: 2026-11-27T23:38:25Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay.

Baseline khong do: moi eval round nay ghi baseline n-a, vì evals.yaml không đổi từ lần đo cuối (round 3).

Eval không phân biệt cần xác nhận là regression-guard có chủ ý hoặc viết lại để assert hành vi mới:
- E17 (make check)
- E24 (bước chấm khuôn, nhóm luong-nhieu-buoc)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 6: E9, E14, E15, E19 chạy lại trên commit 42d6d2ba (đọc danh sách tồn kho lại thành hai phép nối trong); cả bốn đạt, các eval còn lại mang từ round 1, 4, 5. Lịch sử các round trước nằm trong run-log.jsonl.
