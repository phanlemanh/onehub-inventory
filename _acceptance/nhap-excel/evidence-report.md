---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b4f8b282caa1201d667d0c8fdb0e27a36b2eb368
human_signoff:
---

# Evidence Report: nhap-excel

Round 5. Nội dung thay toàn bộ round cũ; lịch sử round nằm ở mục Iterations. Round này chạy lại 10 eval (E2, E9, E10, E11, E14, E15, E16, E19, E20, E21) và ba lệnh suite; 14 eval còn lại mang từ các round trước vì delta không chạm paths của chúng.

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

- eval: E2
  run_id: minted-nhap-excel-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  output: |
    Playwright tests/e2e-db/nhap-excel.spec.ts, lane D, port 5571: pass.
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-nhap-excel-E15-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  output: |
    Playwright tests/e2e-db/nhap-excel.spec.ts, lane D, port 5571: pass.
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-nhap-excel-E16-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  output: |
    Playwright tests/e2e-db/nhap-excel.spec.ts, lane D, port 5571: pass.
    gac-hydration: 0 canh bao

- eval: E20
  run_id: minted-nhap-excel-E20-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  output: |
    Playwright tests/e2e-db/nhap-excel.spec.ts, lane D, port 5571: pass.
    gac-hydration: 0 canh bao

- eval: E21
  run_id: minted-nhap-excel-E21-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T23:10:29Z
  output: |
    Playwright tests/e2e-db/nhap-excel.spec.ts, lane D, port 5571: pass.
    gac-hydration: 0 canh bao

- eval: E9
  run_id: minted-nhap-excel-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T23:10:29Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts, lane D, port 5571: pass.

- eval: E14
  run_id: minted-nhap-excel-E14-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T23:10:29Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts, lane D, port 5571: pass.

- eval: E10
  run_id: minted-nhap-excel-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T23:10:29Z
  output: |
    cach-ly: 41 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E11
  run_id: minted-nhap-excel-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T23:10:29Z
  output: |
    vitest run src/modules/imports tests/nhap-excel: pass.

- eval: E19
  run_id: minted-nhap-excel-E19-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T23:10:29Z
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    inventory-trong-1440.png: the screen is the Bảng hàng page for the company «[Sàn thử nạp tệp]». It shows "0 dòng" and the empty state "Chưa có dữ liệu ở đây / Sàn chưa có căn nào đang chào trên Bảng hàng. / Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." The «Nạp tệp» link is underlined. An outlined «Nạp tệp» button sits at the top right of the page header. The left rail has an import icon. This matches Expected.
    inventory-sau-nhap-1440.png: the same Đầu chủ view with "3 dòng". The rows are ZZ-99.01 (Toà "Toà của tệp", Dự án "—", Đang bán, 2,1 tỷ), 0905 (S1.01, Vinhomes Ocean Park, Đang bán, 4,65 tỷ, 96,8 m², 3 phòng ngủ) and 0906 (S1.01, 3,9 tỷ, 110,4 m²). ZZ-99.01 is the code the catalog lacks and it shows in the Mã căn column (the column is titled Mã căn, not Căn). The «Nạp tệp» button is still at the top right. The left tree now shows Vinhomes Ocean Park 1 / The Sapphire 1 / S1.01. This matches Expected.
    inventory-dau-khach-1440.png: the same 3 rows, but the page header has no «Nạp tệp» button and the left rail has no import icon. This is the Đầu khách view with no way to import, which matches Expected.
  network_observed: n-a (driver)

### Eval mang từ round trước (carry-forward)

- eval: E1
  run_id: minted-nhap-excel-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T18:36:02Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

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
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

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
  run_id: minted-nhap-excel-SUITE-make_check-r5
  exit_code: 0
  verified_at: 2026-11-27T23:10:29Z

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-27T23:10:29Z

- cmd: DATABASE_URL= make e2e
  run_id: bn4x4fp8w
  exit_code: 0
  verified_at: 2026-11-27T23:10:29Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 3), nen mọi eval ghi baseline n-a.

Eval không phân biệt (green trên cả HEAD lẫn baseline, regression-guard có chủ ý):
- E17 (lệnh make check)
- E24 (lệnh design-floor-khuon.mjs --kiem --root .)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 5: all 24 evals PASS; 10 evals re-run on b4f8b282 (E2, E9, E10, E11, E14, E15, E16, E19, E20, E21) plus three suite commands, 14 carried from earlier rounds (E1, E3 to E8, E12, E13, E17, E18, E22 to E24).
Rounds 1 to 4: evidence of the carried evals comes from round 4 (E23 from round 1); details are in the history of those rounds.
