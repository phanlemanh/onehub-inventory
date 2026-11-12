---
schema_version: 2
feature_slug: bang-hang-dung-tay-nhu-sheet
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 788b31d61b6593b485c264afe05585b38ffaf266
human_signoff:
---

# Evidence Report: bang-hang-dung-tay-nhu-sheet

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-6 | test | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | test | PASS |
| E11 | AC-7 | script | PASS |
| E12 | AC-8 | test | PASS |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | script | PASS |
| E16 | AC-10 | ui-check | PASS |
| E17 | AC-10 | judgment | PASS |
| E18 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:57:48Z
  output: |
    717 passed (5.6m)

- eval: E2
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:57:48Z
  output: |
    717 passed (5.6m)

- eval: E9
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:57:48Z
  output: |
    717 passed (5.6m)

- eval: E11
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:57:48Z
  output: |
    717 passed (5.6m)

- eval: E14
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:57:48Z
  output: |
    717 passed (5.6m)

- eval: E18
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E18-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:57:48Z
  output: |
    717 passed (5.6m)

- eval: E4
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:57:48Z
  output: |
    make test xanh

- eval: E6
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:57:48Z
  output: |
    make test xanh

- eval: E7
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:57:48Z
  output: |
    make test xanh

- eval: E8
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:57:48Z
  output: |
    make test xanh

- eval: E12
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:57:48Z
  output: |
    make test xanh

- eval: E15
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T09:57:48Z
  output: |
    sàn thiết kế xanh

- eval: E16
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E16-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T09:57:48Z
  screenshot: evidence/E16-step2.png
  observed: |
    I opened frames 2 to 9; step 1 has no screenshot.
    Step 2 (1440, light): the App Shell sidebar is on the left with "Đang bán" highlighted. The toolbar has the search box, "15 / 60 dòng", "Lọc (2)", "Xoá lọc", "Nhóm theo Toà", "Cột" and "Toàn màn hình". A filter box sits under each header, and Giá chào shows "<=5" with focus. Rows are all "Đang bán" with prices up to 4,86 tỷ. The footer reads "15 / 60 dòng".
    Step 3 (1440, dark): the same layout on a black background with light text.
    Step 4 (1440, light): the toolbar has "Lọc", "Nhóm theo Toà" (pressed), "Cột" and "Toàn màn hình". The group row "[MAU] Toà C1" carries a "12 dòng" badge, and "[MAU] Toà E1 · 12 dòng" follows.
    Step 5 (1440, dark): the same as step 4 on a dark background.
    Step 6 (1024, light): a block of cells from Căn 1202 to Dự án is tinted and outlined, over rows 3 to 5. The footer reads "9 ô đã chọn · Ctrl+C để chép". The grid sits inside the card and scrolls horizontally in its own area.
    Step 7 (414, light): the toolbar wraps onto 2 lines. The grid is grouped by "[MAU] Toà C1" with filter boxes under Căn, Toà and Dự án. Page does not scroll horizontally; the grid scrolls inside its area.
    Step 8 (360, dark): the same as step 7 with a dark background and light text. The toolbar wraps and "Nhóm theo Toà" is pressed.
    Step 9 (360, light): the toolbar wraps. The "Cột" menu is open with "Hiện cột" and 7 checked items: Toà, Dự án, Trạng thái, Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc.
    All of this matches Expected. In steps 7 and 8, "Lọc" is not drawn pressed, but the filter row is open.
  network_observed: clean

- eval: E3
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Judgment

- eval: E17
  judged_by: judge panel (fresh context, 3 lens)
  verdict: PASS
  rationale: Panel đề xuất PASS, cả ba góc nhìn đều PASS. Ảnh cho thấy đủ ba trạng thái lọc mở, nhóm, chọn vùng; chữ đọc được ở nền sáng lẫn tối. Điểm nhẹ không làm sai trạng thái nào là ô lọc Trạng thái bị cắt chữ, nhãn «n dòng» ở 360 nằm ngoài khung, màu vùng chọn khá nhạt.
  human_override:  # chi nguoi ghi

Phiếu của từng góc nhìn:

- domain-correctness: PASS — Cả năm ảnh cho thấy đúng ba trạng thái loc-mo, nhom, chon-vung. Nút công cụ và ô lọc đọc được ở nền sáng lẫn tối. Dòng nhóm có nút gập, tên toà in đậm, nhãn «12 dòng» và không có số thứ tự nên phân biệt được với dòng thường. Vùng 9 ô ở 1024 có viền và nền nhạt, chân bảng ghi «9 ô đã chọn · Ctrl+C để chép». Chữ không chồng nhau, ảnh tối đủ tương phản. Ba điểm nhẹ không làm sai trạng thái nào: ô lọc Trạng thái bị cắt chữ «Đang», nhãn «n dòng» của dòng nhóm nằm ngoài khung ở 360, màu vùng chọn khá nhạt.
- operational-feasibility: PASS — Ảnh lọc 1440 (sáng và tối) có hàng lọc dưới tiêu đề với ô đúng kiểu, «Lọc (2)», «Xoá lọc», «15 / 60 dòng». Ảnh nhóm 1440 tối có dòng nhóm với nút gập, tên toà và «12 dòng», số dòng chạy liền qua nhóm. Ảnh 1024 có vùng ô 3x3 tô màu có viền và chân «9 ô đã chọn · Ctrl+C để chép». Chữ không chồng nhau và ảnh tối đọc được. Ở 360 tối, dòng nhóm khác dòng thường nhờ nút gập và ô số trống, dù huy hiệu «n dòng» bị cuộn ngang che. Vùng chọn tô nhạt nhưng có viền nên vẫn phân biệt được.
- spec-alignment: PASS — Ảnh lọc 1440 (sáng và tối) có hàng lọc dưới tiêu đề với ô riêng từng cột, nút «Lọc (2)», «Xoá lọc» và «15 / 60 dòng». Ảnh nhóm 1440 tối có dòng nhóm gồm nút gập, tên toà và «12 dòng», số dòng chạy liền qua nhóm, dòng nhóm phân biệt được với dòng thường bằng chữ đậm và các ô trống. Ảnh 1024 có vùng 3×3 ô có viền và nền nhạt cùng chân «9 ô đã chọn · Ctrl+C để chép». Ảnh 360 tối đọc được nút «Lọc», «Nhóm theo Toà», «Cột», ô lọc và dòng nhóm. Chữ không chồng nhau và ảnh tối đủ tương phản. Chỗ còn nhẹ: dòng nhóm trong ảnh tối ít khác nền, vùng ô đã bôi nền khá nhạt (viền vẫn rõ), và cột Trạng thái bị cắt «Đang».

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-dung-tay-nhu-sheet-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-12T09:57:48Z

- cmd: npm run build
  run_id: minted-bang-hang-dung-tay-nhu-sheet-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-12T09:57:48Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh ở cả code mới lẫn baseline), cần viết lại để khẳng định hành vi mới hoặc xác nhận là regression-guard có chủ ý:

- make test: E3, E4, E5, E6, E7, E8, E10, E12
- design-floor-khuon (--kiem): E13
- design-floor-s4: E15

Baseline của mọi block eval ghi n-a vì round này không đo lại (evals.yaml không đổi từ round 1).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E16 không đạt (ảnh chưa đủ), hồ sơ REJECT. Returned to implementation.
Round 2: make check đỏ, hội đồng E17 chưa đồng ý PASS (thiếu ảnh chân bảng ở 1024) và có một phát hiện trong hợp đồng cho AC-11 (toàn màn hình giữ chiều cao thường từ 1024). Returned to implementation.
Round 3: mọi eval xanh, make check và build xanh, E16 có khung nhìn thấy khớp Expected, E17 đề xuất PASS. Verdict PASS.
