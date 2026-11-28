---
schema_version: 2
feature_slug: tin-rao-giu-gia-tri-rieng
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0bedf30137ce0e8fa47a217a86487d51968133c1
human_signoff:
---

# Evidence Report: tin-rao-giu-gia-tri-rieng

Round 2. Kết luận REJECT vì một lệnh suite không gắn eval nào chạy hỏng: `DATABASE_URL= make e2e` thoát với mã 2 (1 ca hỏng, 1454 ca đạt, 1369 ca bỏ qua). Mọi eval khai báo đều xanh, nên `failed_evals` để trống. Ca hỏng nằm ở bộ khung mẫu `tools/e2e_templates/suite.ts:121`, màn «nhap-tep», pha khung «khong-loi-trinh-duyet» ở khổ 360. Lỗi là `page.evaluate: TypeError: Cannot read properties of null (reading 'hasAttribute')`, ném trong `pageReady` (`tests/e2e/sua-trang.ts:29`) khi `waitReady` (`tools/e2e_templates/runner.ts:131`) đợi trang. Cần người xem lỗi này trước khi ký.

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
| E12 | AC-1 | script | PASS |
| E13 | AC-2 | test | PASS |
| E14 | AC-12 | test | PASS (carry-forward từ round 1) |
| E14b | AC-12 | ui-check | PASS |
| E15 | AC-12 | test | PASS (carry-forward từ round 1) |
| E15b | AC-12 | ui-check | PASS (carry-forward từ round 1) |
| E16 | AC-4 | script | PASS (carry-forward từ round 1) |
| E17 | AC-8 | script | PASS |

## Evidence

Ghi chú thời điểm: các khối round 2 không có `verified_at` riêng trong kết quả máy. Giá trị dưới đây suy từ giờ ghi khung hình (khoảng 19:05 giờ máy, tức khoảng 12:05Z) và chỉ mang tính xấp xỉ.

- eval: E1
  run_id: minted-tin-rao-giu-gia-tri-rieng-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T12:00:44Z
  output: |
    make test: toàn bộ bộ test xanh (lệnh phủ E1, E2, E3b, E11b).
    __EXIT=0

- eval: E1b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E1b-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 1 passed case(s) named «doc-gia-tri-rieng»
    __EXIT=0

- eval: E2
  run_id: minted-tin-rao-giu-gia-tri-rieng-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T12:00:44Z
  output: |
    make test: toàn bộ bộ test xanh.
    __EXIT=0

- eval: E2b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E2b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T12:00:44Z
  screenshot: evidence/E2b-1024.png
  observed: |
    E2b-1024.png: the Bảng hàng grid, with unit 1101 in row 2 selected. The Diện tích cell shows "72,5 m²" with the pencil icon, and the other rows show other values (96,8 / 68,5 / 78,5 m² and so on). At the very bottom, behind the dev badge, the saved notice is partly cut off: "Đã đổi Diện tích căn 1101: 72,5 m²." plus a faded, partly hidden "Hoàn tác" button. It is readable but clipped by the viewport. The spec's visibility assertion for the button passed in the same run.
    E2b-1440.png: the same grid, with unit 1101 in row 2. The Diện tích cell reads "72,5 m²". The bottom-right notice reads "Đã đổi Diện tích căn 1101: 72,5 m²." with a "Hoàn tác" button, slightly overlapped by the dev badge at its right edge.
    Both frames match the expected "72,5 m²" cell and the saved notice with Hoàn tác.
  network_observed: n-a (driver)
  output: |
    evidence/E2b-1024.png
    evidence/E2b-1440.png
    Wire check: the driver is Playwright through chay.sh, not a browser tool with a network reader, so no E2b-network.txt was written. The no-PATCH-for-words assertion came from the spec's own request counter.

- eval: E3
  run_id: minted-tin-rao-giu-gia-tri-rieng-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T12:00:44Z
  screenshot: evidence/E3-360.png
  observed: |
    E3-360.png: panel «1101 · S1.01», CĂN section with Loại căn 3PN, Phòng ngủ 3 (Sàn gõ), Diện tích 72,5 m² (Sàn gõ), Tầng 15A (Sàn gõ), Hướng Tây Bắc (Sàn gõ), Loại hình Nhà phố (Sàn gõ); toast «Đã đổi thông tin căn 1101.» with a Hoàn tác button. E3-414.png: same values and Sàn gõ tags, toast with Hoàn tác. E3-1024.png: panel beside the grid with the same five values and Sàn gõ tags, toast with Hoàn tác. E3-1440.png: same, with the Pin icon, five values with Sàn gõ tags, toast with Hoàn tác. All four match the expected section: the new values, Tầng 15A and Hướng Tây Bắc, shown with the typed source.
  network_observed: n-a (driver)
  output: |
    The PATCH count, the «07» rejection and the undo are asserted inside the Playwright case, which passed; they were not re-checked on the wire. The frames show only the post-save state.
    The dev server on 3470 was not running. The Playwright DB config started its own WebServer.
    Network: n-a (driver). A note was written to evidence/E3-network.txt.

- eval: E3b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E3b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T12:00:44Z
  output: |
    make test: toàn bộ bộ test xanh.
    __EXIT=0

- eval: E4
  run_id: minted-tin-rao-giu-gia-tri-rieng-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T12:00:44Z
  screenshot: evidence/E4-1440.png
  observed: |
    E4-1440.png: lưới 60 dòng ở bên trái và hồ sơ căn 1303 · S1.01 ở bên phải; ở khối CĂN, sau «Diện tích 78,5 m²» có đúng một chấm nhỏ kèm chữ «Sàn gỗ». Chữ «78,5 m²» cùng màu tối với các giá trị khác (2PN, 13, Tây Bắc). Các hàng khác trong khối CĂN không có chấm. E4-360.png: bố cục điện thoại 360 của cùng hồ sơ, cũng một chấm và «Sàn gỗ» sau «78,5 m²», giá trị cùng màu với các giá trị khác, không có chấm ở dòng nào khác. Khớp Expected. Hai ảnh do chính ca E4 của chay.sh ghi lúc chạy (19:04). Không có file E4-step*.png riêng.
  network_observed: n-a (driver)
  output: |
    PASS: đã mở và đối chiếu E4-1440.png và E4-360.png (một dấu sau diện tích, giá trị cùng màu).
    Frame đã lưu: E4-1440.png, E4-360.png trong thư mục evidence/ (do ca E4 ghi; tool chụp ngoài không dùng).
    Ghi chú: log WebServer có «kết nối rảnh bị đóng: terminating connection due to administrator command», là log dọn kết nối, không phải lỗi request. Driver là Playwright trong chay.sh nên không có dump network (n-a (driver)). Không start server nào nên không có gì để tắt.

- eval: E5
  run_id: minted-tin-rao-giu-gia-tri-rieng-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T12:00:44Z
  screenshot: evidence/E5-1440.png
  observed: |
    E5-1440.png: grid at 1440. Row 4 (căn 1303, S1.01) has the Diện tích cell highlighted (focus border) and reads "75 m²", with no dot or mark after it. Row 5 also reads 75 m² with no mark. Dots appear only on other rows (9 and 11), outside the checked cell. The toast reads "Đã đổi Diện tích căn 1303: 75 m² (Theo danh mục)." with a "Hoàn tác" button. This matches the expectation: catalog value shown, mark gone, undo offered.
    E5-360.png: record sheet for 1303 · S1.01 at 360. The CĂN section shows "Diện tích 75 m²" with no mark. The same toast "Đã đổi Diện tích căn 1303: 75 m² (Theo danh mục)." with "Hoàn tác" is visible at the bottom. This matches the expectation.
  network_observed: n-a (driver)
  output: |
    The spec case asserts the PATCH body {field:"unitAttributes", livingArea:null}. The cell and the record both contain 75 with no attribute-differs mark. The value and source columns both read back null from the database. "Hoàn tác" restores the own value and source. A File-source listing typed over, then reverted, goes straight to the catalog with both columns null. The control case rejects with "label not from labels.yaml". It passed on both projects. PASS.
    Frames: E5-1440.png and E5-360.png were rewritten by this run (19:05). Copies: E5-step1.png, E5-step2.png.
    The frames come from Playwright (chay.sh starts its own web server). The dev server on 3470 was not running.

- eval: E6
  run_id: minted-tin-rao-giu-gia-tri-rieng-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 1 passed case(s) named «danh-muc-khong-de»
    __EXIT=0

- eval: E7
  run_id: minted-tin-rao-giu-gia-tri-rieng-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 2 passed case(s) named «nhap-tep-gia-tri-tep|doc-lai-lan-nhap-cu»
    __EXIT=0

- eval: E8
  run_id: minted-tin-rao-giu-gia-tri-rieng-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T12:00:44Z
  screenshot: evidence/E8-1440.png
  observed: |
    E8-1440.png: import preview step 4 "Xem trước" for e8.csv with 2 rows. The DT column has 57.7 in row op1/S1.01-0501 with a single small dot mark beside it. Row op1/S1.01-0502 (68.5) has no mark. No other cell carries a mark. The cell text shows the file's value. The apply button reads "Áp 2 dòng · 2 ô giữ chữ gốc". E8-360.png: the "Nạp tệp" screen with only the line "Màn này dùng trên máy tính." No file picker and no mark. Both match Expected.
  network_observed: n-a (driver)
  output: |
    chay.sh E8 on lane R (DB_LANE=r, port 5565 was up): "2 passed (20.3s)", "chay.sh: 2 passed case(s) named «dau-xem-truoc»" (cases at 360 and 1440). PASS.
    E8-1440.png and E8-360.png re-made at 19:05 by this run. Frames saved: E8-1440.png, E8-360.png, E8-step1.png, E8-step2.png, E8-network.txt. The catalog value and the data-slot attribute-differs are asserted by the passing Playwright case; the picture only shows the dot.

- eval: E9
  run_id: minted-tin-rao-giu-gia-tri-rieng-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 1 passed case(s) named «can-cho-khop»
    __EXIT=0

- eval: E10
  run_id: minted-tin-rao-giu-gia-tri-rieng-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 1 passed case(s) named «gan-sang-can-khac»
    __EXIT=0

- eval: E11
  run_id: minted-tin-rao-giu-gia-tri-rieng-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 4 passed case(s) named «sua-lay-lai-theo-vai|san-khac-khong-cham|cung-san-khac-nguoi-giu»
    __EXIT=0

- eval: E11b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E11b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T12:00:44Z
  output: |
    make test: toàn bộ bộ test xanh.
    __EXIT=0

- eval: E12
  run_id: minted-tin-rao-giu-gia-tri-rieng-E12-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-28T12:00:44Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance
    __EXIT=0

- eval: E13
  run_id: minted-tin-rao-giu-gia-tri-rieng-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh
  verified_at: 2026-11-28T12:00:44Z
  output: |
    chay.sh: 3 passed case(s) named «o-thuoc-tinh-theo-kho»
    __EXIT=0

- eval: E14
  run_id: minted-tin-rao-giu-gia-tri-rieng-E14-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E14b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T12:00:44Z
  screenshot: evidence/E14b-360-light.png
  observed: |
    360-light and 360-dark: panel for 0606, "Đã bán", in the unit section header "CĂN" there is a small lock icon plus the pale text "Căn đã bán, không sửa" and no Sửa button. The foot is a single pale line "Căn đã bán, không hỏi đầu chủ" with no button, dimmed or otherwise. 414-light and 414-dark: same, with the section line on one row and the same foot line. 1440-light and 1440-dark: right-hand panel for 0606 with the lock line "Căn đã bán, không sửa" at the right of the section header next to "Báo sai thông tin", and the same pale foot line; no dimmed button. Dark themes keep the lines readable and quiet. Everything matches Expected for the sold unit. 1201, the unkept unit, the open unit with two buttons and the 44/28 px heights are not in any image; the Playwright spec asserts them and passed. The images match Expected where they show anything.
  network_observed: n-a (driver)
  output: |
    Opened all 6 PNGs (E14b-360/414/1440 x light/dark). Saved frames: E14b-360-light, E14b-360-dark, E14b-414-light, E14b-414-dark, E14b-1440-light, E14b-1440-dark (.png), plus E14b-step1.png and E14b-network.txt. PASS.
    Gap, not a failure of the steps: the E14b spec has no axe call. axeFaults is used only by the E4 and E15b tests. The step list does not require it, so axe was not run for this eval. The 1201 and unkept-unit cases are asserted by the spec but have no PNG, because only the sold unit is captured.
    Dev server at 3470 was not running; the spec's own web server handled it.

- eval: E15
  run_id: minted-tin-rao-giu-gia-tri-rieng-E15-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-28T07:10:01Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15b
  run_id: minted-tin-rao-giu-gia-tri-rieng-E15b-r1
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-28T07:10:01Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval
  screenshot: evidence/E15b-320-light.png
  observed: |
    All six frames opened with Read. 320-light/dark and 360-light/dark: record drawer with title «0704 · S1.03» (truncated «0704 · S...» at 320), green «Đang bán» badge at left and «5,93 tỷ» at right on the same row; «Xác nhận với chủ nhà 15 ngày trước» then amber/orange line «Quá 14 ngày — nên xác nhận lại» (dark red-brown on light, amber on dark); progress «Mức đủ thông tin 3/5» with «Còn thiếu: Pháp lý , Hiện trạng» as links; label column narrow (labels Loại căn, Phòng ngủ… with values starting about x=128 at 320, x=128 at 360); amber dot before «Pháp lý» in «Lần chào đang mở». At 1440-light/dark: grid with the drawer on the right, same status/price row («Đang bán» left, «5,93 tỷ» right), same stale line in warning colour, «Còn thiếu: Pháp lý, Hiện trạng», narrow label column (values start about 128px after the label start), amber dots before Pháp lý and Hiện trạng, header «Các lần chào của căn · 3» visible at the bottom edge. Not visible in the frames: the three listings of the unit at 320 (below the fold), and the Sửa-dialog click; those are covered by the test's measured assertions, which passed. Nothing in the frames contradicts the Expected.
  network_observed: n-a (driver)

- eval: E16
  run_id: minted-tin-rao-giu-gia-tri-rieng-E16-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-28T07:10:01Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E17
  run_id: minted-tin-rao-giu-gia-tri-rieng-E17-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-28T12:00:44Z
  output: |
    38 tệp giao diện ngoài bản đồ
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-tin-rao-giu-gia-tri-rieng-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-28T12:00:44Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-tin-rao-giu-gia-tri-rieng-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 2
  verified_at: 2026-11-28T12:00:44Z
  note: lệnh này không gắn eval nào, nên `failed_evals` để trống; đây là lý do duy nhất của REJECT. Ca hỏng duy nhất là [360] tools/e2e_templates/suite.ts:121 › màn nhap-tep › pha khung «khong-loi-trinh-duyet: nem loi tren trang». 1454 ca đạt, 1369 ca bỏ qua, gac-hydration 0 cảnh báo.
  output: |
    1) [360] › tools/e2e_templates/suite.ts:121:11 › man nhap-tep › pha khung khong-loi-trinh-duyet: nem loi tren trang
       Error: page.evaluate: TypeError: Cannot read properties of null (reading 'hasAttribute')
       at pageReady (tests/e2e/sua-trang.ts:29:23)
       at waitReady (tools/e2e_templates/runner.ts:131:9)
       at open (tools/e2e_templates/runner.ts:154:52)
       at runBreak (tools/e2e_templates/runner.ts:196:15)
    1 failed
    1369 skipped
    1454 passed (11.4m)
    make: *** [e2e] Error 1

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả nhánh lẫn baseline, chứng minh khung chạy chứ không chứng minh tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý):
- make test: E1, E2, E3b, E11b
- make check: E12
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-khuon.mjs" --kiem --root .: E17

Baseline khong do:
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E1b: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E6: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E7: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E9: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E10: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E11: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh E13: bo qua baseline: tep _acceptance/tin-rao-giu-gia-tri-rieng/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 05cdff86a63bf4e3e9497ada5f7b941bc23337d6 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy nhiều lần đều đồng nhất (mọi eval round này chạy một lần, xác định).

## Iterations

Round 1: E12 đỏ (make check dừng ở bước design-assembly vì thiếu thư mục test-results); E13 BLOCKED (lệnh ghim bị bọc nhầm trong dấu ngoặc kép nên không chạy). Chuyển người xử lý lệnh ghim và bước design-assembly rồi chạy lại.
Round 2: mọi eval khai báo đều xanh; E14, E15, E15b, E16 được mang từ round 1 vì thay đổi không chạm đường dẫn của chúng. Lệnh suite `DATABASE_URL= make e2e` thoát với mã 2 do một ca khung mẫu hỏng ở khổ 360 (màn nhap-tep, pha khung khong-loi-trinh-duyet). Trả về triển khai.
