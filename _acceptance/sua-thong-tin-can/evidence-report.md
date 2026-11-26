---
schema_version: 2
feature_slug: sua-thong-tin-can
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1c0db7a53ead8ac3ca23c20991b2746df50d1e98
human_signoff:
---

# Evidence Report: sua-thong-tin-can

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6b | AC-6 | test | PASS |
| E6-ui | AC-6 | ui-check | PASS |
| E7 | AC-7 | test | PASS |
| E7b | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | test | PASS |
| E9b | AC-9 | test | PASS |
| E13 | AC-11 | test | PASS |
| E13b | AC-11 | test | PASS |
| E13-ui | AC-11 | ui-check | PASS |

Round 4 chạy lại E2, E2b, E2-ui và ba lệnh suite. Các eval còn lại mang từ round 3 (carry-forward), vì thay đổi của round này không chạm paths của chúng.

## Evidence

- eval: E2
  run_id: minted-sua-thong-tin-can-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-26T11:10:32Z
  output: |
    npx playwright test tests/e2e/sua-thong-tin-can.spec.ts
    gac-hydration: 0 canh bao
    expected: exit 0 ở bốn khổ; ca 'sua-bon-truong' và 'hoan-tac-bon-truong'

- eval: E2b
  run_id: minted-sua-thong-tin-can-E2b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e_db
  verified_at: 2026-11-26T11:10:32Z
  output: |
    DB_LANE=${DB_LANE:-h} DB_PORT=${DB_PORT:-5567} npx playwright test -c playwright.db.config.ts tests/e2e-db/sua-thong-tin-can.spec.ts
    gac-hydration: 0 canh bao
    expected: ca 'tai-lai-con' (đăng nhập, sửa bốn trường, tải lại: hồ sơ vẫn hiện giá trị đã lưu)

- eval: E2-ui
  run_id: minted-sua-thong-tin-can-E2-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-26T11:10:32Z
  screenshot: evidence/E2-ho-so-1440.png
  observed: |
    E2-ho-so-1440.png: the 1101 · S1.01 panel is open beside the grid. It shows «Mức đủ thông tin 4/5» with a bar at about 80%, and «Còn thiếu: Tài chính». The «CĂN» section is visible. «Lần chào đang mở» is below the fold, so «Sửa» is not in this frame.
    E2-hop-1440.png: the centered box «Sửa thông tin căn 1101» has the hint «Xoá chữ trong ô là chưa có». It holds four fields: Pháp lý «Hợp đồng mua bán», Nội thất «Một phần nội thất», Tài chính (empty), Hiện trạng «Chủ đang ở». The «Thôi» and «Lưu» buttons are shown.
    E2-da-luu-1440.png: the panel has scrolled to «LẦN CHÀO ĐANG MỞ» with «Sửa» at the right. It shows Pháp lý «Sổ hồng», Nội thất «Một phần nội thất», Tài chính «Đang vay ngân hàng», Hiện trạng «Chủ đang ở». The toast «Đã đổi thông tin căn 1101. Hoàn tác» is visible. The 5/5 count is above the fold and was confirmed by DOM text, not by this image.
    E2-ho-so-360.png: the panel fills the phone width and shows «Mức đủ thông tin 4/5» and «Còn thiếu: Tài chính». «LẦN CHÀO ĐANG MỞ» with «Sửa» sits at the bottom edge. There is no horizontal overflow.
    E2-hop-360.png: the box is full width with the same four fields and the same values (Tài chính empty), and «Lưu» stacked above «Thôi». Layout is clean.
    E2-da-luu-360.png: the panel shows «Xác nhận hôm nay», «Mức đủ thông tin 5/5», the bar full, and «Đủ thông tin». The «Sửa» button is visible at the edge of the section. The new values (Sổ hồng and so on) were confirmed by DOM text, since the section is cut off by the viewport.
    Against Expected: the right place, all four fields, and changed values and count at both widths all hold.
  network_observed: no-app-traffic

- eval: E1
  run_id: minted-sua-thong-tin-can-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E1b
  run_id: minted-sua-thong-tin-can-E1b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-sua-thong-tin-can-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-sua-thong-tin-can-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E4b
  run_id: minted-sua-thong-tin-can-E4b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-sua-thong-tin-can-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-sua-thong-tin-can-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E6b
  run_id: minted-sua-thong-tin-can-E6b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E6-ui
  run_id: minted-sua-thong-tin-can-E6-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  screenshot: evidence/E6-text-1440.png
  observed: |
    Cả năm khung đều là bảng Hàng 1440px trên công ty thật "[MAU] rieng-1440-...", một ô đang mở có viền xanh dương cùng kiểu.
    E6-text-1440.png: ô Ghi chú dòng 1 là ô nhập chữ, hiện "Chủ cần bán nhanh".
    E6-number-1440.png: ô Chỗ xe dòng 1 là ô nhập trống, căn phải, cùng khung viền xanh.
    E6-date-1440.png: ô Bàn giao dòng 1 là ô ngày với gợi ý "dd/mm/yyyy".
    E6-single_select-1440.png: ô Hướng view dòng 1 mở danh sách chọn gồm Hồ, Phố, Chưa có, cùng viền xanh.
    E6-boolean-1440.png: ô Ban công dòng 1 mở danh sách chọn gồm Có, Không, Chưa có.
    Mỗi kiểu có bộ sửa đúng kiểu, cùng khung viền. Khớp "Năm bộ sửa đúng kiểu, cùng khung".
  network_observed: n-a (driver)
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-sua-thong-tin-can-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E7b
  run_id: minted-sua-thong-tin-can-E7b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-sua-thong-tin-can-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-sua-thong-tin-can-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-sua-thong-tin-can-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-sua-thong-tin-can-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-sua-thong-tin-can-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E9b
  run_id: minted-sua-thong-tin-can-E9b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-sua-thong-tin-can-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_unit
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E13b
  run_id: minted-sua-thong-tin-can-E13b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_thong_tin_e2e
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E13-ui
  run_id: minted-sua-thong-tin-can-E13-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-26T10:50:41Z
  carried_from_round: 3
  screenshot: evidence/E13-luoi-1440.png
  observed: |
    E13-luoi-1440: lưới Hàng với Căn, Toà, # ghim; cột Dự án, Trạng thái, Giá chào, Về tay, Diện tích, Phòng ngủ hiện, Nội thất bị cắt ở mép phải; 60 dòng.
    E13-luoi-1024: cùng lưới, hẹp hơn, chỉ còn cột ghim cộng Dự án, Trạng thái và một phần Giá chào.
    E13-bon-cot-1440: cuộn phải, #, Căn, Toà đứng yên; Nội thất, Pháp lý, Tài chính, Hiện trạng, Xác nhận lúc hiện đủ cùng nhau với giá trị như 'Đầy đủ nội thất', 'Sổ hồng', 'Không vay', 'Để trống'.
    E13-cot-noi-that-1024, E13-cot-phap-ly-1024, E13-cot-tai-chinh-1024, E13-cot-hien-trang-1024: từng cột hiện đủ ở khổ 1024, cột ghim không dời.
    E13-o-noi-that-1440: ô Nội thất của căn 1101 mở bộ chọn bốn lựa chọn (Đầy đủ nội thất được tô, Một phần nội thất, Không nội thất, Chưa có), khung viền bo tròn đúng bề rộng ô; chân bảng ghi "1 ô đã chọn · Ctrl+C để chép".
    Khớp expected: bốn cột đúng chỗ ở hai khổ, khoá đúng, bộ chọn cùng khung.
  network_observed: clean
  # carry-forward tu round 3 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-sua-thong-tin-can-SUITE-make_check-r4
  exit_code: 0
  verified_at: 2026-11-26T11:10:32Z

- cmd: npm run build
  run_id: minted-sua-thong-tin-can-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-26T11:10:32Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-sua-thong-tin-can-SUITE-DATABASE_URL_make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-26T11:10:32Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 3 — baseline khong do lai round nay

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, carried từ round 3): E10 (config:executors.design.khuon), E11 (config:executors.design.floor). Hai eval này chứng minh bộ chấm khuôn và sàn thiết kế chứ không chứng minh tính năng. Xác nhận là regression-guard có chủ ý, hoặc viết lại để assert hành vi mới.

Không có mục judgment nào trong round này: không có panel để đề xuất, và không có human_override cần điền.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: make check failed — returned to implementation (chi tiết trong run-log.jsonl).
Round 2: xem run-log.jsonl.
Round 3: E2b rejected — sign-in wait at phone widths after the App Shell merge; round cap reached.
Round 4: test chờ App Shell theo cách dùng chung; E2, E2b, E2-ui và ba lệnh suite xanh; các eval khác carry-forward từ round 3 — PASS.

### Re-pin lần 1 — 2026-11-26, do gộp main #124 và sửa hai bài thử sau CI nặng (G-2611-13)
run_id: repin-20261126T165751Z-54219
sha: 1c0db7a53ead8ac3ca23c20991b2746df50d1e98 · suites: 3 lệnh exit 0 · evals: 20/20 eval máy đạt kỳ vọng · ngoài làn máy: E2-ui, E6-ui, E13-ui
