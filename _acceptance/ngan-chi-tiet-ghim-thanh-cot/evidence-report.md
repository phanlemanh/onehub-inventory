---
schema_version: 2
feature_slug: ngan-chi-tiet-ghim-thanh-cot
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: cb88024b0c4664fc0843f7bf67aa5c3e2233d847
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: ngan-chi-tiet-ghim-thanh-cot

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | test | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | ui-check | PASS |
| E12 | AC-9 | judgment | PASS |

## Evidence

- eval: E1
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T06:18:04Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T06:18:04Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T06:18:04Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T06:18:04Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T05:11:47Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ghim_ngan_e2e
  verified_at: 2026-11-14T05:11:47Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-14T05:11:47Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-14T06:18:04Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-ngan-chi-tiet-ghim-thanh-cot-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T06:18:04Z
  carried_from_round: 5
  screenshot: evidence/ghim-1440-sang.png
  observed: |
    I opened all 6 saved frames with Read.

    1. ghim-1440-sang.png: the record is a column flush to the right edge, below the top bar. It has a thin vertical divider with a small grip handle on its left edge. The table on the left is fully visible and not covered. Header row 1 is '0905 · S1.01'. Row 2 holds the link icon, the pin icon (slashed, meaning pinned), then Trước (greyed), Sau and Đóng. Matches Expected.
    2. ghim-1440-toi.png: same layout in dark theme, with readable contrast and the same icon order. Matches.
    3. ghim-1024-sang.png: the App Shell's second column is folded (only the icon rail is visible). The record is a pinned column on the right with a divider and grip, and the table on the left is not covered. The slashed pin icon comes before Trước, Sau, Đóng. The measured data-region width is 480 px, which is ≥ 480. Matches.
    4. ghim-1024-toi.png: same as 3 in dark theme, width 480. Matches.
    5. ghim-1024-cot-hai-mo.png: the second column is open. The record is a floating card with a shadow, overlapping the table's right side. Its header shows only link, Trước, Sau, Đóng, with no pin button. The data region measures 632. Matches Expected (no Ghim button, D-1411-5).
    6. ho-so-360-sang.png: the record is full screen with no table behind it. The header shows link, Trước, Sau, Đóng and no Ghim button. The round dev badge overlaps the lower-left of the content; that is the Next.js dev indicator, not app UI. Matches.
  network_observed: clean
  note: carry-forward tu round 5 — delta khong cham paths cua eval

### Judgment

Panel de xuat cho E12 (de human_override TRONG):

- eval: E12
  judged_by: judge panel (fresh context, 3 lens)
  verdict: PASS
  rationale: Ba lens cung de xuat PASS tren cac anh ghim 1440 va 1024 sang/toi va anh 360 toan man.
  votes:
    - domain-correctness: PASS — Cả bốn ảnh (1440 sáng/tối, 1024 sáng/tối) cho thấy cột chi tiết liền mép phải, không bóng nổi, vạch chia mảnh có tay cầm nhỏ giữa vùng dữ liệu và cột (x≈919 ở 1440, x≈640 ở 1024). Dáng này tương đương Details của app-shell-11, và vạch vẫn thấy được ở nền tối. Nút Ghim (biểu tượng ghim gạch chéo) nằm ở dòng hai, sau nút liên kết và trước Trước, Sau, Đóng, đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, dòng hai chỉ có liên kết, Trước, Sau, Đóng, không có nút Ghim.
    - operational-feasibility: PASS — Cả bốn ảnh ghim (1440 sáng/tối, 1024 sáng/tối) có cột hồ sơ liền mép phải, không bóng nổi, vạch chia mảnh có tay cầm nhìn thấy được kể cả nền tối, giống cột Details của app-shell-11. Nút Ghim nằm ở dòng hai, sau nút liên kết của bản ghi và ngay trước Trước, Sau, Đóng, đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn không có nút Ghim.
    - spec-alignment: PASS — Cả bốn ảnh ghim (1440 và 1024, sáng và tối) cùng dáng với cột Details của app-shell-11: cột chi tiết liền mép phải, không bóng nổi, vạch chia mảnh có tay cầm nhỏ giữa bảng và cột. Ở nền tối vạch vẫn nhìn thấy nhờ nền hai bên khác nhau và tay cầm hiện rõ. Nút Ghim (biểu tượng cắm ghim) nằm ở dòng hai, sau nút liên kết và trước Trước, Sau, Đóng, đúng AC-1. Ảnh ho-so-360-sang là hồ sơ toàn màn, dòng hai chỉ có liên kết, Trước, Sau, Đóng, không có nút Ghim.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 5 — baseline khong do lai round nay

Eval khong-phan-biet (pass tren ca HEAD lan baseline) — regression-guard co chu y, khong can viet lai:
- E10 (make check) — chay toan bo bo kiem CI; la regression-guard, khong khang dinh hanh vi moi cua feature.

Baseline khong do: toan bo eval round nay (evals.yaml khong doi tu lan baseline cuoi, round 5); field baseline cua tung eval ghi n-a.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 4: E11 only re-run — the pinned column at 1024 followed D-1411-5 (App Shell second column folded); evidence recorded for E11 and the machine evals.
Round 5: machine evals and E11 re-run; E12 panel proposes PASS on the pinned 1440 and 1024 frames and the 360 full-screen frame. Remaining evals carried forward from rounds 4 and 5.

## Chấm lại hội đồng E12 trong vòng 5 (giám sát cho, D-1411-7)

- Lần chấm đầu của vòng 5: hội đồng E12 chạy lúc 06:18Z và đọc hai ảnh ghim-1024-sang.png, ghim-1024-toi.png CŨ của vòng 4
  (hồ sơ nổi, cột thứ hai App Shell mở); bước E11 ghi lại hai ảnh ấy lúc 06:20Z (cột thứ hai gập, đã ghim, vùng dữ liệu 480 px).
  Cả ba phiếu đề xuất trượt vì ảnh cũ.
- Lần chấm lại: chỉ hội đồng E12, trên ảnh hiện tại; mọi phép đo máy (E1–E11) mang kết quả vòng 5, không chạy bộ kiểm chung,
  không đổi mã. Kết quả: hội đồng E12 đề xuất ĐẠT.

### Re-pin lần 1 — 2026-11-14, do gop nhanh chinh 786cadf sau chu ky
run_id: repin-20261114T093351Z-35812
sha: cb88024b0c4664fc0843f7bf67aa5c3e2233d847 · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E11, E12 (E12 không khai paths) · AC không có chốt máy: AC-9
