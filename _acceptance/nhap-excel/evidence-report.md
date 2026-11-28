---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2d814a8e2c6485c90d50ada24b850f92755ba800
human_signoff: Manh Phan 2026-11-28
---

# Evidence Report: nhap-excel

Round 12. Nội dung thay trọn round cũ; lịch sử nằm ở mục Iterations.

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

Bốn phép mang sang (E10 vòng 9 0f8e4c54, E11 vòng 8 ffb7216f, E19 vòng 6 849b0cb9, E23 vòng 1 1feca45a): mỗi khối được chép
nguyên từ báo cáo của vòng nó chạy thật bằng `_acceptance/nhap-excel/rang/dung-lai-mang-sang.mjs`, chỉ thêm
`carried_from_round`; bảng đối chiếu ở `_acceptance/nhap-excel/mang-sang.md` (G-2811-101).

## Evidence

- eval: E1
  run_id: minted-nhap-excel-E1-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T08:51:17Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (verbose reporter) finished green.

- eval: E3
  run_id: minted-nhap-excel-E3-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T08:51:17Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (verbose reporter) finished green.

- eval: E5
  run_id: minted-nhap-excel-E5-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T08:51:17Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (verbose reporter) finished green.

- eval: E7
  run_id: minted-nhap-excel-E7-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T08:51:17Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (verbose reporter) finished green.

- eval: E2
  run_id: minted-nhap-excel-E2-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T08:51:17Z
  output: |
    playwright -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts (lane D, port 5571)
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-nhap-excel-E15-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T08:51:17Z
  output: |
    playwright -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts (lane D, port 5571)
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-nhap-excel-E16-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T08:51:17Z
  output: |
    playwright -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts (lane D, port 5571)
    gac-hydration: 0 canh bao

- eval: E20
  run_id: minted-nhap-excel-E20-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T08:51:17Z
  output: |
    playwright -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts (lane D, port 5571)
    gac-hydration: 0 canh bao

- eval: E21
  run_id: minted-nhap-excel-E21-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T08:51:17Z
  output: |
    playwright -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts (lane D, port 5571)
    gac-hydration: 0 canh bao

- eval: E4
  run_id: minted-nhap-excel-E4-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E6
  run_id: minted-nhap-excel-E6-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E8
  run_id: minted-nhap-excel-E8-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E9
  run_id: minted-nhap-excel-E9-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E12
  run_id: minted-nhap-excel-E12-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E13
  run_id: minted-nhap-excel-E13-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E14
  run_id: minted-nhap-excel-E14-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E22
  run_id: minted-nhap-excel-E22-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T08:51:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose reporter) finished green.

- eval: E17
  run_id: minted-nhap-excel-E17-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T08:51:17Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E24
  run_id: minted-nhap-excel-E24-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-28T08:51:17Z
  output: |
    design-floor-khuon.mjs --kiem --root .
    9 tệp giao diện ngoài bản đồ

- eval: E18
  run_id: minted-nhap-excel-E18-r12
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T08:51:17Z
  screenshot: evidence/ui/nhap-tep-tai-1440.png
  observed: |
    1440 nhap-tep-tai: Chon tep step with a drop zone, the .xlsx/.csv, 10 MB and 5,000 rows hint, and a disabled Tiep button. 1440 ghep-cot (ban.xlsx, 4 rows): five-step bar with step 2 active. Rows Ma can (Giu nguyen), Block, DT, PN and TT (May sua), and the two 'Gia chao' columns (Gia KBP, Gia) marked Chan with 'Hai cot cung di vao mot cho'. Row 'View' has an empty selector and an orange 'Can nguoi' mark ('Ten cot la, chon noi di vao'). Row 'SDT chu' has a red 'Chan' mark and the reason that owner phone/name is not entered here, so drop the column. Button 'Tiep (7)'. 1440 xem-truoc-ban: counts Giu nguyen 14, May sua 0, Can nguoi 9, Chan 13; preview table with red and orange cells; 'Con 13 cho chan'; faded Ap button 'Ap 0 dong - 19 o giu chu goc'. 1440 xong (gon.xlsx): 'Da them 3 dong', '2 o giu chu goc cua tep', 'Vua hoc cho lan sau' with 'Can cho khop: SA5-12.08', and 'Hoan tac lan nap tep'. 1024: same content; xem-truoc-ban shows the same four counts and the Ap button faded; xong lists the learned items (template gon.xlsx, own labels 'Ma can' and 'Ngay check', pending unit SA5-12.08) and the undo button. This all matches Expected.
  network_observed: n-a (driver)

- eval: E10
  run_id: minted-nhap-excel-E10-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-28T06:10:25Z
  output: |
    cach-ly: 41 ca đạt, vai quy_hang_app, nối bằng quy_hang_login
  carried_from_round: 9

- eval: E11
  run_id: minted-nhap-excel-E11-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    __EXIT=0
  carried_from_round: 8

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
  carried_from_round: 6

- eval: E23
  run_id: minted-nhap-excel-E23-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  output: |
    8 tệp giao diện ngoài bản đồ
  carried_from_round: 1

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r12
  exit_code: 0
  verified_at: 2026-11-28T08:51:17Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nhap-excel-SUITE-DATABASE_URL_make_e2e-r12
  exit_code: 0
  verified_at: 2026-11-28T08:51:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay.

Eval không-phân-biệt cần người xem lại (xanh ở cả bản chính lẫn baseline, nên chứng minh bộ chạy chứ không phải tính năng; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E17 (make check)
- E24 (bước chấm khuôn luong-nhieu-buoc)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 11: not passed — one finding in the contract (AC-8: the last batch could close an import with earlier batches unwritten). Returned to implementation.
Round 12: all evals PASS on a672ea0f after fix 01dc882d (the last batch waits for every earlier batch); E10, E11, E19, E23 carried forward.

### Re-pin lần 1 — 2026-11-28, do hàng 11 nhap-excel trước Cổng Bằng chứng, sau vòng chấm 12: 22 hồ sơ cổng nêu (gồm 11 hồ sơ có dòng sửa-sau-ký của PR #130) và nhap-excel (G-2811-62)
run_id: repin-20261128T091000Z-36001
sha: 2d814a8e2c6485c90d50ada24b850f92755ba800 · suites: 3 lệnh exit 0 · evals: 22/22 eval máy đạt kỳ vọng · ngoài làn máy: E18, E19
