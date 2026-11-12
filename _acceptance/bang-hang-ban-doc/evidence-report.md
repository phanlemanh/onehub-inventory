---
schema_version: 2
feature_slug: bang-hang-ban-doc
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 99e90e33bcac25f33b499b6ce22f19786b1039d0
human_signoff:
---

# Evidence Report: bang-hang-ban-doc

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward round 1) |
| E2 | AC-2 | test | PASS (carry-forward round 2) |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS (carry-forward round 1) |
| E5 | AC-5 | script | PASS (carry-forward round 1) |
| E6 | AC-6 | test | PASS (carry-forward round 2) |
| E7 | AC-7 | test | PASS (carry-forward round 1) |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS (carry-forward round 1) |
| E10 | AC-10 | ui-check | PASS |
| E11 | AC-10 | judgment | UNCERTAIN |
| E12 | AC-6 | test | PASS (carry-forward round 2) |
| E13 | AC-11 | test | PASS |
| E14 | AC-11 | script | PASS |
| E15 | AC-7 | script | PASS (carry-forward round 2) |

## Judge

Đề xuất panel cho E11: PASS (2 phiếu PASS, 1 phiếu UNCERTAIN). Ý kiến khác hiển thị đầy đủ bên dưới; `human_override` để trống cho người quyết ở Cổng 2.

- domain-correctness: PASS — Bốn ảnh (360 và 1440, sáng và tối) cho thấy đầu màn "Bảng hàng", các đầu cột đọc được và không có chữ chồng nhau. Ảnh tối vẫn đủ tương phản, kể cả huy hiệu trạng thái. Dấu chấm lửng ("Vinhomes Ocean Park...") chỉ thấy trong ảnh chu-dai 1440 sáng, không có trong bốn ảnh chính; ảnh đó nằm trong danh sách input nên dùng được. Ảnh 360 chỉ hiện bốn cột đầu vì phần còn lại nằm trong vùng cuộn ngang, do E2/E3 đo nên không tính ở đây.
- operational-feasibility: PASS — Cả bốn ảnh có đầu màn "Bảng hàng" và vùng "Hàng · 60 dòng". Các đầu cột trong khung nhìn đọc rõ: 360 thấy #, Căn, Toà, Dự án; 1440 thấy đủ tám cột. Không có chữ chồng nhau. Ảnh tối (360 và 1440) có chữ sáng trên nền tối, nhãn trạng thái vẫn đọc được. Việc cắt tên khu dài bằng dấu chấm lửng thấy ở ảnh chu-dai 1440 ("Vinhomes Ocean Park..."), một đầu vào hợp lệ của eval này. Ở 360 cột Dự án bị cắt ở mép khung cuộn ngang, đúng thiết kế, không phải lỗi.
- spec-alignment: UNCERTAIN — Trong bốn ảnh, đầu màn "Bảng hàng" và các đầu cột đang hiện ra đều đọc được, không có chữ chồng nhau, và ảnh tối đủ tương phản. Dấu chấm lửng của tên khu dài không có trong bốn ảnh này: ở 1440 sáng và tối, "Vinhomes Ocean Park 1" vừa đủ ô; ở 360 chữ "Vinhomes C" bị khung cuộn cắt cụt chứ không có dấu chấm lửng. Dấu chấm lửng chỉ thấy ở ảnh thứ năm (inventory-1440-chu-dai.png, chỉ nền sáng), nên chưa chứng minh được cho ảnh tối hay cho 360.

- eval: E11
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment), fresh context
  verdict: UNCERTAIN
  rationale: Hai phiếu PASS, một phiếu UNCERTAIN từ spec-alignment. Dấu chấm lửng của tên khu dài chỉ được chứng minh ở một ảnh nền sáng 1440, chưa có ở nền tối hay ở 360.
  required_evidence:
    - Ảnh nền tối ở 1440 với bộ lọc Empire (cùng khung với inventory-1440-chu-dai.png), cho thấy cột Dự án cắt bằng dấu chấm lửng mà vẫn đọc được. Lấy từ bộ ảnh chụp màn Bảng hàng trong _acceptance/bang-hang-ban-doc/evidence/, ví dụ inventory-1440-chu-dai-toi.png.
    - Hoặc sửa câu hỏi E11 để nói rõ dấu chấm lửng chỉ chấm trên inventory-1440-chu-dai.png (ảnh thứ năm, nền sáng), để phạm vi bốn ảnh không đòi ảnh tĩnh ở 360 hay nền tối phải cho thấy dấu chấm lửng.
  human_override:  # chi nguoi ghi

## Evidence

Các eval chạy lại ở round 3 (code đã đổi ở commit sửa lưới vào được bằng bàn phím):

- eval: E3
  run_id: minted-bang-hang-ban-doc-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T04:08:03Z
  output: |
    639 passed (5.1m)

- eval: E14
  run_id: minted-bang-hang-ban-doc-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T04:08:03Z
  output: |
    639 passed (5.1m)

- eval: E8
  run_id: minted-bang-hang-ban-doc-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T04:08:03Z
  output: |
    make test hoàn tất, không có ca đỏ.

- eval: E13
  run_id: minted-bang-hang-ban-doc-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T04:08:03Z
  output: |
    make test hoàn tất, không có ca đỏ.

- eval: E10
  run_id: minted-bang-hang-ban-doc-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-12T04:08:03Z
  screenshot: evidence/E10-step1.png
  observed: |
    step1 (1440 light): The App Shell is in place, with a left sidebar (Bảng hàng, Tất cả hàng, status list) and the page title "Bảng hàng". The frame "Hàng" holds a search box with a magnifier icon reading "Gõ để tìm" and "60 dòng". The grid has # plus 8 columns, all readable: Căn, Toà, Dự án (full "Vinhomes Ocean Park 1"), Trạng thái (coloured badges), Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc. Vertical rules separate the columns. All 8 columns fit with no horizontal scrollbar. The footer is below the fold in this frame; the DOM has it. step2 (1440 dark): same layout on a near-black background. Text is white and the badges have dark variants, all readable. step3 (1024 light): the grid is cut after "Giá chào" and scrolls sideways inside the frame. The page itself does not scroll, and the Dự án column is truncated with an ellipsis ("Vinhomes Ocean Pa..."). step4 (1024 dark): same as step3 in dark, readable. step5 (414 light): the sidebar is hidden and the title, frame "Hàng", search box and "60 dòng" are visible. The grid shows #, Căn, Toà and the start of Dự án, then cuts off to the right. A footer "60 dòng" shows at the bottom. The page does not scroll sideways. step6 (414 dark): same as step5 in dark, readable. step7 (360 light) and step8 (360 dark): same as 414 but narrower; the search box is narrower and the grid shows #, Căn, Toà, and part of Dự án. Both are readable and there is no overlapping text. step10 (1440 light, "Empire"): the search box has focus and shows "Empire" with a clear (x) button; the count is "12 / 60 dòng". 12 rows are listed. The Toà column reads "[MAU] Toà E1" and the Dự án column reads "Vinhomes Ocean Park..." with a trailing ellipsis, as expected. The grid keeps its fixed height, so there is blank space under the rows. This is not a defect. No frame has overlapping text.
  network_observed: clean

Các eval mang sang từ round trước (carry-forward, delta không chạm paths của eval; round này không chạy lại):

- eval: E1
  run_id: minted-bang-hang-ban-doc-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-hang-ban-doc-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bang-hang-ban-doc-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-hang-ban-doc-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-bang-hang-ban-doc-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-bang-hang-ban-doc-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-bang-hang-ban-doc-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:10:45Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-bang-hang-ban-doc-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T03:24:46Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-bang-hang-ban-doc-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T03:24:46Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-ban-doc-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-12T04:08:03Z

- cmd: npm run build
  run_id: minted-bang-hang-ban-doc-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-12T04:08:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay.

Baseline khong do: toan bo eval (n-a) — evals.yaml khong doi tu lan baseline cuoi (round 2), nen round nay khong do lai.

Eval khong-phan-biet (xanh tren ca HEAD lan baseline, chung to harness chu khong phai feature; nen viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- make test: E2, E6, E8, E12
- design-floor-khuon (buoc cham khuon): E15

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E3, E14 failed — bai e2e chua xanh (vung chua co du lieu o buoc chay dau). Returned to implementation.
Round 2: machine evals green, panel E11 waits for the owner.
Round 3: sua lưới vào được bằng bàn phím trước khi trang nhận thao tác; E3, E14, E8, E13, E10 chạy lại và xanh, các eval còn lại carry-forward; E11 vẫn chờ người quyết ở Cổng 2.
