---
schema_version: 2
feature_slug: nhap-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: dfad40e42b06d7e4137710e55cbfb680f5809ed6
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
  run_id: minted-nhap-excel-E1-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E3
  run_id: minted-nhap-excel-E3-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E5
  run_id: minted-nhap-excel-E5-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E7
  run_id: minted-nhap-excel-E7-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E11
  run_id: minted-nhap-excel-E11-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.nhap_excel_unit
  verified_at: 2026-11-28T05:23:19Z
  output: |
    npx vitest run src/modules/imports tests/nhap-excel --coverage.enabled=false --reporter=verbose
    __EXIT=0

- eval: E2
  run_id: minted-nhap-excel-E2-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T05:23:19Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao
    __EXIT=0

- eval: E15
  run_id: minted-nhap-excel-E15-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T05:23:19Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao
    __EXIT=0

- eval: E16
  run_id: minted-nhap-excel-E16-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T05:23:19Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao
    __EXIT=0

- eval: E20
  run_id: minted-nhap-excel-E20-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T05:23:19Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao
    __EXIT=0

- eval: E21
  run_id: minted-nhap-excel-E21-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_e2e
  verified_at: 2026-11-28T05:23:19Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/nhap-excel.spec.ts
    gac-hydration: 0 canh bao
    __EXIT=0

- eval: E4
  run_id: minted-nhap-excel-E4-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E6
  run_id: minted-nhap-excel-E6-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E8
  run_id: minted-nhap-excel-E8-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E9
  run_id: minted-nhap-excel-E9-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E12
  run_id: minted-nhap-excel-E12-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E13
  run_id: minted-nhap-excel-E13-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E14
  run_id: minted-nhap-excel-E14-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E22
  run_id: minted-nhap-excel-E22-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.nhap_excel_db
  verified_at: 2026-11-28T05:23:19Z
  output: |
    vitest run -c vitest.db.config.ts tests/db/nhap-excel.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E17
  run_id: minted-nhap-excel-E17-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-28T05:23:19Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance
    __EXIT=0

- eval: E18
  run_id: minted-nhap-excel-E18-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T05:23:19Z
  screenshot: evidence/ui/nhap-tep-ghep-cot-1440.png
  observed: |
    Da mo 14 trong 18 anh: ghep-cot, xem-truoc-ban, xong (ca 1440 va 1024), tai, da-chon, gia-tri-va-ma, xem-truoc va dau-chu-mo (1440). Chua mo 4 anh: tai-1024, da-chon-1024, gia-tri-va-ma-1024, xem-truoc-1024 va dau-chu (1440 va 1024), cac anh nay chi la ban khac kho cua cung buoc. Cac anh con lai da mo cho thay: tai co thanh nam buoc (Chọn tệp, Ghép cột, Giá trị và mã, Xem trước, Xong), o chon tep va nut Tiếp mo; da-chon (ban.xlsx · 4 dòng) co muc 'Lần nhập gần đây' gon.xlsx; ghep-cot 1440 co hang Mã căn Giữ nguyên, Block/DT/PN/TT Máy sửa, Giá KBP va Giá cung vao Giá chào bi Chặn (Hai cột cùng đi vào một chỗ), View 'Cần người' (Tên cột lạ — chọn nơi đi vào), SĐT chủ 'Chặn' (Số và tên chủ nhà chưa nhập ở đây — bỏ cột), nut Tiếp (7); gia-tri-va-ma hoi gia tri «còn»/«cọc» o cot TT va 'Giữ nguyên mã, chờ khớp danh mục: SA5-12.08, R2.11-1503'; xem-truoc-ban co bon dau Giữ nguyên 14, Máy sửa 0, Cần người 9, Chặn 13, bang co o do/cam, nut 'Còn 13 chỗ chặn' va nut mo 'Áp 0 dòng · 9 ô giữ chữ gốc'; xong (gon.xlsx · 3 dòng) 'Đã thêm 3 dòng', 'Vừa học cho lần sau' (1440 co 1 muc 'Căn chờ khớp: SA5-12.08'; 1024 co 4 muc gom Mẫu nhập, hai Nhãn riêng, căn chờ khớp), nut 'Hoàn tác lần nhập'; xem-truoc (gon.xlsx) co dau Cần người 1, Chặn 0, nut 'Áp 3 dòng' bat; dau-chu-mo (Trưởng nhóm) co danh sach chon '[Tên] Nạp tệp ListAgent' dang mo tren nut Áp. Khop Expected.
  network_observed: n-a (driver)

- eval: E10
  run_id: minted-nhap-excel-E10-r5
  exit_code: 0
  verifier: config:executors.script.cach_ly_d
  verified_at: 2026-11-27T23:10:29Z
  carried_from_round: 5
  # carry-forward tu round 5 — delta khong cham paths cua eval

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
  run_id: minted-nhap-excel-SUITE-build-r8
  exit_code: 0
  verified_at: 2026-11-28T05:23:19Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-nhap-excel-SUITE-DATABASE_URL_make_e2e-r8
  exit_code: 0
  verified_at: 2026-11-28T05:23:19Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 3), nen moi eval ghi baseline n-a o round nay.

Eval khong-phan-biet (xanh ca tren HEAD lan baseline cu, chung minh harness chu khong phai feature; viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- E17 (lenh make check) — regression-guard co chu y.
- E24 (lenh design-floor-khuon.mjs --kiem --root .) — regression-guard co chu y.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 7: S4 not passed — one finding in the contract (AC-6: tower text dropped for a unit that exists); fixed in f072a264, preview-versus-written check widened to the whole space.
Round 8: all 24 evals PASS on verified_commit; E10, E19, E23, E24 carried forward (delta does not touch their paths).
