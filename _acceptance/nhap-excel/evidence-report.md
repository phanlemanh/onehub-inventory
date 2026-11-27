---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1fc47a9a71db0fd0c6ed3b6ab53f31807324370d
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

- eval: E1
  run_id: minted-nhap-excel-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (1 lần chạy, 1 lần đạt)

- eval: E2
  run_id: minted-nhap-excel-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T18:36:02Z
  output: |
    playwright test tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E3
  run_id: minted-nhap-excel-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (1 lần chạy, 1 lần đạt)

- eval: E4
  run_id: minted-nhap-excel-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E5
  run_id: minted-nhap-excel-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (1 lần chạy, 1 lần đạt)

- eval: E6
  run_id: minted-nhap-excel-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E7
  run_id: minted-nhap-excel-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (1 lần chạy, 1 lần đạt)

- eval: E8
  run_id: minted-nhap-excel-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E9
  run_id: minted-nhap-excel-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E10
  run_id: minted-nhap-excel-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T16:56:56Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-nhap-excel-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T16:56:56Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-nhap-excel-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E13
  run_id: minted-nhap-excel-E13-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E14
  run_id: minted-nhap-excel-E14-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

- eval: E15
  run_id: minted-nhap-excel-E15-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T18:36:02Z
  output: |
    playwright test tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-nhap-excel-E16-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T18:36:02Z
  output: |
    playwright test tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E17
  run_id: minted-nhap-excel-E17-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-27T18:36:02Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E18
  run_id: minted-nhap-excel-E18-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T18:36:02Z
  screenshot: evidence/E18-step1.png
  observed: |
    1440 tai: five-step bar with step 1 active, a file drop area and a disabled 'Tiếp'. 1440 da-chon: ban.xlsx · 4 dòng and a 'Lần nhập gần đây' list. 1440 ghep-cot: a row for each column. Mã căn 'Giữ nguyên'. Block, DT, PN and TT 'Máy sửa'. Giá KBP and Giá 'Chặn' (two columns go to one place). View 'Cần người' ('Tên cột lạ — chọn nơi đi vào'). 'SĐT chủ' 'Chặn' ('Số và tên chủ nhà chưa nhập ở đây — bỏ cột'). 'Tiếp (7)'. 1440 gia-tri-va-ma: the value-mapping groups for 'còn' and 'cọc' in column TT, and the line about codes kept as they are. 1440 xem-truoc-ban: counts 14/0/9/13, rows coloured amber and red, 'Còn 13 chỗ chặn' and the faded 'Áp 0 dòng · 9 ô giữ chữ gốc'. 1440 xem-truoc (gon.xlsx): 14/0/1/0 and an active 'Áp 3 dòng'. 1440 dau-chu-mo: the list agent picker open with '[Tên] Nạp tệp ListAgent' and a faded Áp. 1440 xong: 'Đã thêm 3 dòng', 'Vừa học cho lần sau' with 'Căn chờ khớp: SA5-12.08', and the 'Hoàn tác lần nhập' button. 1024: the same screens, laid out with the step bar and rows narrower. In 1024 ghep-cot the checkbox text is cut. 1024 xong lists the template, two own labels and the pending unit. All of this matches Expected, apart from the word 'dòng' where the Expected text says 'số căn'.
  network_observed: n-a (driver)
  output: |
    - Xong shows 'Đã thêm 3 dòng', the 'Vừa học cho lần sau' section and 'Hoàn tác lần nhập'. PASS. It says 'dòng', not 'căn'.
    - Ghép cột at 1024: the long checkbox labels are cut at the right edge. Cosmetic. The marks and reasons are fully visible.
    Frames copied as E18-step1..4.png. E18-network.txt is a stub: the driver is Playwright with no network reader.

- eval: E19
  run_id: minted-nhap-excel-E19-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T16:20:40Z
  carried_from_round: 2
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    Frame 1 (inventory-trong-1440.png): the Bảng hàng screen for the company "[Sàn thử nạp tệp]". Breadcrumb is "Bảng hàng > Tất cả hàng". An outlined "Nạp tệp" button sits at the top right of the header. The table card shows "0 dòng", and the empty message reads "Chưa có dữ liệu ở đây / Sàn chưa có căn nào đang chào trên Bảng hàng. / Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." with "Nạp tệp" as an underlined link. The left rail has an import icon. Matches Expected.
    Frame 2 (inventory-sau-nhap-1440.png): the same company, "3 dòng". Row 1 has code ZZ-99.01 (the code the catalog lacks), with tower "Toà của tệp", no project ("—"), status "Đang bán" and price 2,1 tỷ. That is the pending-match listing with its source code in the code column. Rows 2 and 3 have codes 0905 and 0906, tower S1.01, project "Vinhomes Ocean Pa...", status "Đang bán", prices 4,65 tỷ and 3,9 tỷ. The "Nạp tệp" button is still at the top right, and the left rail now lists the project and tower tree. Matches Expected.
    Frame 3 (inventory-dau-khach-1440.png): the same three rows and the same table. There is no "Nạp tệp" button in the header, no import icon in the left rail, and the rail ends at the sliders icon. The Đầu khách role has no import entry. Matches Expected.
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E20
  run_id: minted-nhap-excel-E20-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T18:36:02Z
  output: |
    playwright test tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E21
  run_id: minted-nhap-excel-E21-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T18:36:02Z
  output: |
    playwright test tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E22
  run_id: minted-nhap-excel-E22-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T18:36:02Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (1 lần chạy, 1 lần đạt)

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
  output: |
    9 tệp giao diện ngoài bản đồ

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-27T18:36:02Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nhap-excel-SUITE-DATABASE_URL_make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-27T18:36:02Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay

Eval không phân biệt (xanh trên cả HEAD lẫn baseline; chứng minh harness, không chứng minh feature), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:

- E17 (`make check`): regression-guard có chủ ý, baseline: n-a vì round này không đo lại.
- E24 (bước chấm khuôn nhóm luong-nhieu-buoc): regression-guard có chủ ý, baseline: n-a vì round này không đo lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E23 chạy và đạt; giữ nguyên ở các round sau (carry-forward).
Round 2 và 3: E19 (r2), E10 và E11 (r3) chạy và đạt; giữ nguyên ở round 4; baseline đo ở round 3.
Round 4: chạy lại các eval còn lại và hai lệnh suite (build, e2e), tất cả đạt; verdict PASS.
