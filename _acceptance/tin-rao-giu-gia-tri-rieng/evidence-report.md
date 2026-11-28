---
schema_version: 2
feature_slug: tin-rao-giu-gia-tri-rieng
verdict: BLOCKED
failed_evals: ["E12"]
reason: "Lenh ghim cua E13 khong chay duoc nguyen van: ca chuoi bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E13 nam trong dau ngoac kep nen shell coi no la mot ten lenh duy nhat (loi quoting trong lenh ghim), nen khong tim thay lenh. Tep chay.sh co ton tai (rwxr-xr-x, 3126 byte), loi nam o cach viet lenh, khong phai thieu tep. Khong sua lenh va khong chay lai de cho pass; can nguoi viet lai lenh ghim (bo ngoac kep quanh bash ...) roi chay lai."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 144a0484e750a691052dbdef3298ed72e18d6afc
human_signoff:
---

# Evidence Report: tin-rao-giu-gia-tri-rieng

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | script | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | ui-check | PASS |
| E3 | AC-3 | ui-check | PASS |
| E3b | AC-3 | test | PASS |
| E4 | AC-4 | ui-check | PASS |
| E5 | AC-5 | ui-check | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | ui-check | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E11 | AC-11 | script | PASS |
| E11b | AC-11 | test | PASS |
| E12 | AC-1 | script | FAIL |
| E13 | AC-2 | test | BLOCKED |
| E14 | AC-12 | test | PASS |
| E14b | AC-12 | ui-check | PASS |
| E15 | AC-12 | test | PASS |
| E15b | AC-12 | ui-check | PASS |
| E16 | AC-4 | script | PASS |
| E17 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-tin-rao-giu-gia-tri-rieng-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make test (chung voi E2, E3b, E11b, E14, E15) chay xong, khong co ca nao do.

- eval: E1b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E1b-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    chay.sh: 1 passed case(s) named «doc-gia-tri-rieng»

- eval: E2
  run_id: minted-tin-rao-giu-gia-tri-rieng-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make test (lenh chung) xanh.

- eval: E2b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E2b-1024.png
  observed: |
    E2b-1024.png (1024 wide): the Bảng hàng grid is signed in under company [MAU o-1024-…]. Row 2 (căn 1101) has the Diện tích cell selected with a blue border, showing «72,5 m²» and a pencil icon. A toast at the bottom right reads «Đã đổi Diện tích căn 1101: 72,5 m².» with a black «Hoàn tác» button. E2b-1440.png (1440 wide): the same row and cell show «72,5 m²» with the pencil icon and a blue border. The same toast, «Đã đổi Diện tích căn 1101: 72,5 m².», is at the bottom right with «Hoàn tác», and the wider grid shows extra columns. Both frames match Expected: the cell reads «72,5 m²» and the saved notice offers «Hoàn tác». The reload, undo and no-PATCH-for-words checks are not visible in the frames; they were asserted in the spec, which passed.
  network_observed: n-a (driver)
  output: |
    Spec Playwright dem lenh PATCH: 1 cho gia tri hop le, 0 cho chu «bảy mươi». Sau tai lai o van doc «72,5 m²»; Hoan tac tra ve «72,5 m²». Hai anh E2b-1024.png va E2b-1440.png da mo bang Read.

- eval: E3
  run_id: minted-tin-rao-giu-gia-tri-rieng-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E3-360.png
  observed: |
    E3-360: drawer for 1101 · S1.01, block CĂN (Sửa / Báo sai thông tin): Loại căn 3PN, Phòng ngủ 3 (Sàn gõ), Diện tích 72,5 m² (Sàn gõ), Tầng 15A (Sàn gõ), Hướng Tây Bắc (Sàn gõ), Toà S1.01, Dự án Vinhomes Ocean Park 1, Loại hình Nhà phố (Sàn gõ); toast "Đã đổi thông tin căn 1101." + Hoàn tác. E3-414: same five values with Sàn gõ source and toast. E3-1024: grid plus drawer, same five values and Sàn gõ markers, toast with Hoàn tác. E3-1440: wider grid plus drawer, same five values with Sàn gõ markers, toast with Hoàn tác. All four match Expected (Tầng 15A, Hướng Tây Bắc, typed source). The '07' rejection and Undo steps are not visible in the frames (they are asserted by the passing spec only).
  network_observed: n-a (driver)
  output: |
    chay.sh: 4 passed case(s) named «sua-nam-truong» o 4 khổ 360/414/1024/1440. Mot PATCH mang nam gia tri, tang «07» bi tu choi khong co PATCH, Hoan tac tra ca nam (khang dinh trong spec).

- eval: E3b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E3b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make test (lenh chung) xanh.

- eval: E4
  run_id: minted-tin-rao-giu-gia-tri-rieng-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E4-1440.png
  observed: |
    E4-1440.png: the grid is on the left. The record panel for 1303 · S1.01 is on the right with Loại căn 2PN, Phòng ngủ 2, Diện tích "78,5 m²", a single small dot mark right after the area, and "Sàn gỗ" beside it. Tầng 13, Hướng Tây Bắc and the other rows have no mark. The "78,5 m²" text is the same dark colour as the other values. E4-360.png: the phone-width record for 1303 · S1.01 shows the same thing, with one dot after "78,5 m²" plus "Sàn gỗ", no mark on the other rows, and the value in the same colour as the rest. Both frames agree with the expected result of exactly one mark after the living area, in the usual value colour.
  network_observed: n-a (driver)
  output: |
    Hai anh E4-1440.png va E4-360.png do spec luu; da mo bang Read. Khong luu E4-step1/E4-step2.

- eval: E5
  run_id: minted-tin-rao-giu-gia-tri-rieng-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E5-1440.png
  observed: |
    E5-1440.png: grid, row 4 (căn 1303) cell Diện tích reads "75 m²" (cell outlined as selected) with no dot after it, whereas rows 9 and 11 (112 m², 55,5 m²) still show the mark dot; toast bottom right "Đã đổi Diện tích căn 1303: 75 m² (Theo danh mục)." with a "Hoàn tác" button. E5-360.png: record panel "1303 · S1.01", field Diện tích reads "75 m²" with no mark; toast text behind footer shows the same "Theo danh mục" message with "Hoàn tác". Both match Expected.
  network_observed: n-a (driver)
  output: |
    Hai anh E5-1440.png va E5-360.png da mo bang Read; o Dien tich doc «75 m²», khong dau.

- eval: E6
  run_id: minted-tin-rao-giu-gia-tri-rieng-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    chay.sh: 1 passed case(s) named «danh-muc-khong-de»

- eval: E7
  run_id: minted-tin-rao-giu-gia-tri-rieng-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    chay.sh: 2 passed case(s) named «nhap-tep-gia-tri-tep|doc-lai-lan-nhap-cu»

- eval: E8
  run_id: minted-tin-rao-giu-gia-tri-rieng-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E8-1440.png
  observed: |
    E8-1440.png: import wizard at step 4 "Xem trước" (e8.csv, 2 rows). Table with 2 rows: op1/S1.01-0501 with DT 57.7 and a single small dot mark next to the 57.7 cell; op1/S1.01-0502 with DT 68.5 and no mark. The cell still shows the file's value 57.7. Only one cell carries a mark. Matches Expected. E8-360.png: screen titled "Nạp tệp" with only the text "Màn này dùng trên máy tính." No file picker, no mark. Matches Expected.
  network_observed: n-a (driver)
  output: |
    chay.sh: 2 passed case(s) named «dau-xem-truoc» (360 va 1440). Phep do DOM nam trong spec; khong kiem lai DOM rieng.

- eval: E9
  run_id: minted-tin-rao-giu-gia-tri-rieng-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    chay.sh: 1 passed case(s) named «can-cho-khop»

- eval: E10
  run_id: minted-tin-rao-giu-gia-tri-rieng-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    chay.sh: 1 passed case(s) named «gan-sang-can-khac»

- eval: E11
  run_id: minted-tin-rao-giu-gia-tri-rieng-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    chay.sh: 4 passed case(s) named «sua-lay-lai-theo-vai|san-khac-khong-cham|cung-san-khac-nguoi-giu»

- eval: E11b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E11b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make test (lenh chung) xanh.

- eval: E12
  run_id: minted-tin-rao-giu-gia-tri-rieng-E12-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make check dung o buoc design-assembly (khong phai o buoc ontology). Cac buoc truoc do chay qua: wiki-lint 24 entities, 0 loi, 1 canh bao; src/generated/ontology.ts cap nhat; boundaries 0 loi, 1 canh bao; coverage-matrix ok.
    Buoc design-assembly nem loi ENOENT khi stat thu muc test-results trong worktree (tools/design-assembly/ledger.mjs, ham filesNamed, qua pointerProblem va ledgerProblems), roi make bao loi o muc tieu design-assembly.

- eval: E13
  run_id: minted-tin-rao-giu-gia-tri-rieng-E13-r1
  exit_code: 1
  baseline: n-a
  verifier: _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T07:10:01Z
  output: |
    Khong chay duoc: shell bao khong co lenh ten «bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E13» (loi quoting trong lenh ghim; ma tra ve cua shell la 127). Khong co ket qua ca nao.

- eval: E14
  run_id: minted-tin-rao-giu-gia-tri-rieng-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make test (lenh chung) xanh.

- eval: E14b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E14b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E14b-360-light.png
  observed: |
    Each frame shows the 0606 · S1.02 record, status Đã bán, price 6,73 tỷ. The 360 and 414 frames are phone-width, light and dark. The 1440 frames are the unit drawer beside the grid, light and dark.
    In every frame, the unit section «CĂN» has a lock icon and quiet gray text «Căn đã bán, không sửa» in the place of the «Sửa» button, next to the «Báo sai thông tin» button. The foot is a quiet centered line «Căn đã bán, không hỏi đầu chủ», with no dimmed button.
    This matches Expected for the sold unit only. No frame shows 1201, an open listing nobody holds, the 44px/28px box heights, or the axe result.
  network_observed: n-a (driver)
  output: |
    Spec Playwright qua; 6 anh E14b-<360|414|1440>-<light|dark>.png. Khoang trong so voi Expected: khong anh nao cho thay can 1201 hay tin dang mo chua ai giu; chieu cao 44px/28px chi duoc khang dinh trong spec.

- eval: E15
  run_id: minted-tin-rao-giu-gia-tri-rieng-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  output: |
    make test (lenh chung) xanh.

- eval: E15b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E15b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  screenshot: evidence/E15b-320-light.png
  observed: |
    All six frames opened with Read. 320-light/dark and 360-light/dark: record drawer with title «0704 · S1.03» (truncated «0704 · S...» at 320), green «Đang bán» badge at left and «5,93 tỷ» at right on the same row; «Xác nhận với chủ nhà 15 ngày trước» then amber/orange line «Quá 14 ngày — nên xác nhận lại» (dark red-brown on light, amber on dark); progress «Mức đủ thông tin 3/5» with «Còn thiếu: Pháp lý , Hiện trạng» as links; label column narrow (labels Loại căn, Phòng ngủ… with values starting about x=128 at 320, x=128 at 360); amber dot before «Pháp lý» in «Lần chào đang mở». At 1440-light/dark: grid with the drawer on the right, same status/price row («Đang bán» left, «5,93 tỷ» right), same stale line in warning colour, «Còn thiếu: Pháp lý, Hiện trạng», narrow label column (values start about 128px after the label start), amber dots before Pháp lý and Hiện trạng, header «Các lần chào của căn · 3» visible at the bottom edge. Not visible in the frames: the three listings of the unit at 320 (below the fold), and the Sửa-dialog click; those are covered by the test's measured assertions, which passed. Nothing in the frames contradicts the Expected.
  network_observed: n-a (driver)
  output: |
    chay.sh: 2 passed case(s) named «than-ho-so» (hai du an 360 va 1440). Spec do bang getBoundingClientRect, mau --warning, axe khong loi, bam ten phan thieu mo hop Sua.

- eval: E16
  run_id: minted-tin-rao-giu-gia-tri-rieng-E16-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-28T07:10:01Z
  output: |
    38 tệp giao diện ngoài bản đồ

- eval: E17
  run_id: minted-tin-rao-giu-gia-tri-rieng-E17-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-28T07:10:01Z
  output: |
    38 tệp giao diện ngoài bản đồ

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-tin-rao-giu-gia-tri-rieng-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-28T07:10:01Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-tin-rao-giu-gia-tri-rieng-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-28T07:10:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline; chứng minh harness chứ không phải tính năng; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test: E1, E2, E3b, E11b, E14, E15
- lệnh chấm khuôn (design-floor-khuon --kiem): E16, E17

Ghi chú: E12 (baseline green) đỏ ở HEAD do buoc design-assembly của make check thiếu thư mục test-results trong worktree; E13 chưa có kết quả vì lệnh ghim sai quoting. Hai việc này cần người xử lý rồi chạy lại.

Baseline khong do:
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E1b: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E6: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E7: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E9: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E10: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E11: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- "bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E13": bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy nhiều lần đều đồng nhất (mọi eval đều chạy một lần, không có phương sai).

## Iterations

Round 1: E12 đỏ (make check dừng ở bước design-assembly vì thiếu thư mục test-results); E13 BLOCKED (lệnh ghim bị bọc nhầm trong dấu ngoặc kép nên không chạy). Chuyển người xử lý lệnh ghim và bước design-assembly rồi chạy lại.
