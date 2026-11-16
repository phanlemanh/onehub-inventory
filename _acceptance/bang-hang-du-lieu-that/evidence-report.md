---
schema_version: 2
feature_slug: bang-hang-du-lieu-that
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9ba5850e7694baf63c0dfd0194ccf860f360fc33
human_signoff:
---

# Evidence Report: bang-hang-du-lieu-that

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E3b | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8-ui | AC-8 | ui-check | PASS |
| E8-khuon | AC-8 | script | PASS (carry-forward từ round 1) |
| E8-floor | AC-8 | script | PASS (carry-forward từ round 1) |
| E9 | AC-9 | test | PASS |
| E9b | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-hang-du-lieu-that-E1-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_r
  verified_at: 2026-11-16T11:13:31Z
  output: |
    cach-ly: 38 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E1b
  run_id: minted-bang-hang-du-lieu-that-E1b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn (chung một lần chạy với E2, E4, E5, E6, E7b, E10)

- eval: E2
  run_id: minted-bang-hang-du-lieu-that-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn (chung một lần chạy với E1b)

- eval: E2b
  run_id: minted-bang-hang-du-lieu-that-E2b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ src/modules/listings và ba tệp tests/ đạt trọn (chung một lần chạy với E3b, E9)

- eval: E2-ui
  run_id: minted-bang-hang-du-lieu-that-E2-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-16T11:13:31Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    Frame 1 (E2-ui-step1.png = E2-mau-1440.png, 1440 wide, [MAU] ListAgent mau-listagent@example.test): top bar shows company [MAU]; page "Bảng hàng", grid total line "60 dòng" (top and bottom). Rows start 0905, 1101, 1202, 1303, 1603, 1604 (S1.01), 0601, 0602, 0606, 0701... (S1.02). Left tree lists Vinhomes Ocean Park 1 (The Sapphire 1: S1.01, S1.02, S1.03, S1.05), Park 2 with "[MAU] Toà E1", Park 3 with "[MAU] Toà C1". Frame 2 (E2-ui-step2.png = E2-mau2-1440.png, after choosing [MAU-2] in the App Shell company menu; the "Đổi sàn" menu is still drawn open with a check beside [MAU-2]): top bar [MAU-2]; grid total "3 dòng" with only 0905, 1101, 1202, all S1.01. Tree has only Vinhomes Ocean Park 1 > The Sapphire 1 > S1.01; the [MAU] Toà E1 and Toà C1 and S1.02/S1.03/S1.05 are gone. The two frames have clearly different sets (60 vs 3, different tree). Caveat: the 3 codes of [MAU-2] (0905/1101/1202, S1.01, same prices) also appear in [MAU] because db/scripts/nap-mau.ts seeds [MAU-2] with the first 3 sample listings. The question text "toà, mã khác hẳn" is therefore not literally true. DB check shows the listing ids are different and company-owned (MAU 90 rows, MAU-2 3 rows, ids differ). No MAU-only căn (e.g. 0601, E1, C1) appears in the [MAU-2] frame. The frame also says "60 dòng" and "3 dòng", not the «n / N căn» wording from the question.
  network_observed: clean

- eval: E3
  run_id: minted-bang-hang-du-lieu-that-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E3b
  run_id: minted-bang-hang-du-lieu-that-E3b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ src/modules/listings và ba tệp tests/ đạt trọn (chung một lần chạy với E2b, E9)

- eval: E4
  run_id: minted-bang-hang-du-lieu-that-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn

- eval: E4b
  run_id: minted-bang-hang-du-lieu-that-E4b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E5
  run_id: minted-bang-hang-du-lieu-that-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn

- eval: E5b
  run_id: minted-bang-hang-du-lieu-that-E5b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E6
  run_id: minted-bang-hang-du-lieu-that-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn

- eval: E6b
  run_id: minted-bang-hang-du-lieu-that-E6b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E7
  run_id: minted-bang-hang-du-lieu-that-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E7b
  run_id: minted-bang-hang-du-lieu-that-E7b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn

- eval: E8
  run_id: minted-bang-hang-du-lieu-that-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E8-ui
  run_id: minted-bang-hang-du-lieu-that-E8-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-16T11:13:31Z
  screenshot: evidence/E8-ui-step1.png
  observed: |
    I opened 8 of the 32 frames; the other 24 I checked only through DOM selectors, visibility, background colour and horizontal scroll.
    - cho-tai 1440 sang: Grid-family shell. "Bảng hàng" title, "Hàng" card, "Lưu góc nhìn" button, a 10x5 grid of grey skeleton cells. No data or text mixed in.
    - cho-tai 414 toi: dark background, same skeleton grid and card, fits the width.
    - loi 1440 toi: the card shows "Vùng này chưa tải được" with a 3-part message, a blue "Thử lại" button and the "Lưu góc nhìn" button. Text is readable on dark.
    - loi 360 toi: same content stacked in one column, no overflow, readable.
    - trong 1024 sang (company [MAU-TRONG]): "0 dòng", "Chưa có dữ liệu ở đây", "Sàn chưa có căn nào đang chào trên Bảng hàng.", "Tải lại" button.
    - trong 414 sang: same, stacked at phone width.
    - khong-khop 1024 toi: header filter "KHON" in the Căn column, "0 / 60 dòng", "Không có dòng nào khớp", explanation, "Xoá lọc" button. Toolbar shows Nhóm theo Toà, Cột, Toàn màn hình.
    - khong-khop 360 sang: phone layout with filter chip "Căn", "Xoá lọc", "Không có dòng nào khớp" and a "Xoá lọc" button.
    All opened frames show the right state and the same Grid-family shape (header, card, toolbar, state block in the grid area), and text reads in both modes. The only deviation is the button wording «Thử lại» versus «Tải lại» noted in the Analyst section.
  network_observed: clean

- eval: E8-khuon
  run_id: minted-bang-hang-du-lieu-that-E8-khuon-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-16T07:34:59Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8-floor
  run_id: minted-bang-hang-du-lieu-that-E8-floor-r1
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-16T07:34:59Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-bang-hang-du-lieu-that-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_unit
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ src/modules/listings và ba tệp tests/ đạt trọn (chung một lần chạy với E2b, E3b)

- eval: E9b
  run_id: minted-bang-hang-du-lieu-that-E9b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

- eval: E10
  run_id: minted-bang-hang-du-lieu-that-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_db
  verified_at: 2026-11-16T11:13:31Z
  output: |
    bộ tests/db/bang-hang-that.db.test.ts đạt trọn

- eval: E10b
  run_id: minted-bang-hang-du-lieu-that-E10b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.bang_hang_that_e2e
  verified_at: 2026-11-16T11:13:31Z
  output: |
    gac-hydration: 0 canh bao

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_check-r4
  exit_code: 0
  verified_at: 2026-11-16T11:13:31Z

- cmd: npm run build
  run_id: minted-bang-hang-du-lieu-that-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-16T11:13:31Z

- cmd: make e2e
  run_id: minted-bang-hang-du-lieu-that-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-16T11:13:31Z

## Known limits

- AC-8: trạng thái «Không đủ quyền» của Bảng hàng không chụp màn — từ Hỏi-1 A không vai thật nào gặp nó; đo bằng ca máy khong-du-quyen-tren-man của E2b (dựng trang, đọc màn), theo chủ kho 2026-11-16 (sổ quyết định d-20261116T081513Z-40, ghi chú AC-8 của hợp đồng).

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet) không áp dụng được cho phần lớn eval vì baseline không đo; chỉ E1 đo được và là red. Không có eval nào xanh trên cả hai phía.

Ghi chú lời chữ: khung lỗi dùng nút «Thử lại» (theo design/states.md) còn hợp đồng và câu hỏi eval E8-ui ghi «Tải lại»; khung trống dùng «Tải lại». Có nút thử lại trên khung lỗi, không xem là lỗi. Chỉ mở 8 trong 32 khung; 24 khung còn lại dựa vào kiểm DOM.

Ghi chú E2-ui: ba mã của [MAU-2] (0905, 1101, 1202) cũng có ở [MAU] do dữ liệu mẫu nap-mau.ts; id căn khác nhau và thuộc từng sàn, không căn nào lẫn sàn. Chữ «mã khác hẳn» trong câu hỏi không đúng nghĩa đen, chủ kho cân nhắc.

### Baseline khong do

- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx vitest run -c vitest.db.config.ts tests/db/bang-hang-that.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/bang-hang-that.db.test.ts co o cay dang kiem nhung chua co o merge-base ecfc16ebe68a18619994f47c57ddb4024d0fbb39 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/listings tests/bang-hang-that.test.ts tests/mot-lan-doc.test.tsx tests/bang-hang-khong-du-quyen.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/bang-hang-that.test.ts co o cay dang kiem nhung chua co o merge-base ecfc16ebe68a18619994f47c57ddb4024d0fbb39 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/bang-hang-that.spec.ts: bo qua baseline: tep tests/e2e-db/bang-hang-that.spec.ts co o cay dang kiem nhung chua co o merge-base ecfc16ebe68a18619994f47c57ddb4024d0fbb39 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: mọi eval máy và ui đạt; E8-khuon và E8-floor mang từ round 1 vì delta không chạm paths của chúng. Lịch sử các round trước nằm trong run-log.jsonl.
