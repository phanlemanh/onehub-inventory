---
schema_version: 2
feature_slug: nhap-excel
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b20ecac863094cf9f8ef9528f2f211da00341ca9
human_signoff:
---

# Evidence Report: nhap-excel

Round 1. Mọi eval gắn AC đều xanh, nhưng lệnh suite `DATABASE_URL= make e2e` không gắn eval nào đã đỏ (5 ca trên màn Bảng hàng, vùng trống). Verdict REJECT.

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
  run_id: minted-nhap-excel-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T11:09:53Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel (verbose): all cases passed, command finished clean.

- eval: E3
  run_id: minted-nhap-excel-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same vitest run as E1: all cases passed, command finished clean.

- eval: E5
  run_id: minted-nhap-excel-E5-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same vitest run as E1: all cases passed, command finished clean.

- eval: E7
  run_id: minted-nhap-excel-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same vitest run as E1: all cases passed, command finished clean.

- eval: E11
  run_id: minted-nhap-excel-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same vitest run as E1: command finished clean. Note: tests/nhap-excel-ontology.test.ts is not in the tree, see Analyst.

- eval: E2
  run_id: minted-nhap-excel-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T11:09:53Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao

- eval: E15
  run_id: minted-nhap-excel-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same playwright run as E2.
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-nhap-excel-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same playwright run as E2.
    gac-hydration: 0 canh bao

- eval: E20
  run_id: minted-nhap-excel-E20-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same playwright run as E2.
    gac-hydration: 0 canh bao

- eval: E21
  run_id: minted-nhap-excel-E21-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same playwright run as E2.
    gac-hydration: 0 canh bao

- eval: E4
  run_id: minted-nhap-excel-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts (verbose): all cases passed, command finished clean.

- eval: E6
  run_id: minted-nhap-excel-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E8
  run_id: minted-nhap-excel-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E9
  run_id: minted-nhap-excel-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E12
  run_id: minted-nhap-excel-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E13
  run_id: minted-nhap-excel-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E14
  run_id: minted-nhap-excel-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E22
  run_id: minted-nhap-excel-E22-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-27T11:09:53Z
  output: |
    Same db vitest run as E4.

- eval: E10
  run_id: minted-nhap-excel-E10-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T11:09:53Z
  output: |
    cach-ly: 39 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E17
  run_id: minted-nhap-excel-E17-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-27T11:09:53Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E23
  run_id: minted-nhap-excel-E23-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  output: |
    8 tệp giao diện ngoài bản đồ

- eval: E24
  run_id: minted-nhap-excel-E24-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-27T11:09:53Z
  output: |
    8 tệp giao diện ngoài bản đồ

- eval: E18
  run_id: minted-nhap-excel-E18-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T11:09:53Z
  screenshot: evidence/ui/nhap-tep-tai-1440.png
  observed: |
    Each saved frame was opened and read.
    - nhap-tep-tai-1440: title Nạp tệp, step bar with step 1 active, a dashed drop zone "Kéo tệp vào đây hoặc bấm để chọn" with the note ".xlsx hoặc .csv, tối đa 10 MB và 5.000 dòng", and a faded Tiếp button.
    - nhap-tep-da-chon-1440: ban.xlsx · 4 dòng, a "Lần nhập gần đây" section listing gon.xlsx, and Tiếp enabled.
    - nhap-tep-ghep-cot-1440: step 2 active. Rows run Mã căn (Giữ nguyên), Block, DT, PN and TT (Máy sửa), Giá KBP and Giá (Chặn: "Hai cột cùng đi vào một chỗ"), View (Cần người) and SĐT chủ (Chặn). Tiếp (7).
    - nhap-tep-ghep-cot-1024: same layout, with the right-hand checkbox text clipped.
    - nhap-tep-gia-tri-va-ma-1440: step 3 shows the groups «còn» · 3 ô and «cọc» · 1 ô in column TT, plus the line "Giữ nguyên mã, chờ khớp danh mục: SA5-12.08, R2.11-1503 · 2 ô".
    - nhap-tep-xem-truoc-ban-1440 and -1024: counters Giữ nguyên 14, Máy sửa 0, Cần người 9, Chặn 13. The table has coloured cells (amber and red), the greyed button "Áp 0 dòng · 9 ô giữ chữ gốc" and "Còn 13 chỗ chặn".
    - nhap-tep-xem-truoc-1440 (gon.xlsx): Chặn 0, Cần người 1, and the active button "Áp 3 dòng".
    - nhap-tep-xong-1440: "Đã thêm 3 dòng", "Vừa học cho lần sau", "Căn chờ khớp: SA5-12.08", and the Hoàn tác lần nhập button.
    - nhap-tep-xong-1024: same, with the extra learned lines for the template and the two private labels.
    All of this matches Expected.
  network_observed: n-a (driver)

- eval: E19
  run_id: minted-nhap-excel-E19-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-27T11:09:53Z
  screenshot: evidence/ui/inventory-trong-1440.png
  observed: |
    inventory-trong-1440.png: workspace "[Sàn thử nạp tệp]", breadcrumb Bảng hàng > Tất cả hàng, outlined "Nạp tệp" button at top right; table panel "Hàng" with "0 dòng" and the empty state "Chưa có dữ liệu ở đây / Sàn chưa có căn nào đang chào trên Bảng hàng. / Có sẵn bảng trong Excel hay Google Sheet? Nạp tệp." with "Nạp tệp" as an underlined link; the sidebar also has an import icon. Matches Expected.
    inventory-sau-nhap-1440.png: the "Nạp tệp" button is still at the top; "3 dòng" with rows: ZZ-99.01 (Tòa "Toà của tệp", no project, Đang bán, 2,1 tỷ), 0905 (S1.01, Vinhomes Ocean Pa..., Đang bán, 4,65 tỷ, 96,8 m², 3 phòng ngủ), 0906 (S1.01, 3,9 tỷ, 110,4 m²). The pending-match unit with the original code ZZ-99.01 is in the Mã căn column, and the sidebar now lists Vinhomes Ocean Park 1 > The Sapphire 1 > S1.01. Matches Expected.
    inventory-dau-khach-1440.png: same company, same 3 rows, no "Nạp tệp" button at the top (breadcrumb only) and no import icon in the left rail. Matches Expected (Đầu khách sees no import path).
  network_observed: n-a (driver)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-nhap-excel-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-27T11:09:53Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nhap-excel-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-27T11:09:53Z

Ghi chú lệnh suite `DATABASE_URL= make e2e` (không gắn eval nào): 1300 ca qua, 1227 bỏ qua, 5 ca đỏ. Cả 5 là ca «man inventory › vung › vung trong» (khổ 360, 414, 1024, 1440 và một ca «cham» ở 1440), cùng lỗi «trong: khong co buoc tiep» tại tools/e2e_templates/recipes.ts:63 (gọi từ recipes.ts:681). Chi tiết: test-results/screens-cham-man-inventory-vung-vung-trong-1440/error-context.md.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline; chứng minh bộ đo chứ không chứng minh feature, cần viết lại để khẳng định hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make check: E17
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-khuon.mjs" --kiem --root .: E23, E24

Baseline khong do:
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts: bo qua baseline: tep tests/e2e-db/nhap-excel.spec.ts co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-d} DB_PORT=${DB_PORT:-5571} npx vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/nhap-excel.db.test.ts co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi

Lệnh fail không gắn eval: `DATABASE_URL= make e2e` (5 ca «vung trong» của màn inventory đỏ, mô tả ở mục Lệnh suite). Đây là lý do REJECT, không có eval nào để đưa vào failed_evals.

Ghi chú nhẹ từ E18, không làm eval đỏ: ở 1024 các hàng Ghép cột bị cắt chữ của ô chọn bên phải; huy hiệu hàng đầu là «Giữ nguyên» ở 1440 nhưng «Máy sửa» ở 1024; khung «Giá trị và mã» ở 1440 có hai nhóm giá trị trông như ô nhập trống.

Ghi chú E11: tệp tests/nhap-excel-ontology.test.ts mà eval nêu không có trong cây; lệnh vitest vẫn xanh nên E11 xanh mà không đo gì (xem review-findings.md).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lệnh suite `DATABASE_URL= make e2e` đỏ 5 ca «vung trong» của màn inventory (lỗi «trong: khong co buoc tiep»); 24 eval gắn AC đều xanh. Returned to implementation.
