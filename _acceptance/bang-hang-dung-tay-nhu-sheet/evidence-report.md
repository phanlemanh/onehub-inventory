---
schema_version: 2
feature_slug: bang-hang-dung-tay-nhu-sheet
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2e6d05fbaa839be330dc4e12e0213079b0e8770e
human_signoff:
---

# Evidence Report: bang-hang-dung-tay-nhu-sheet

Round 2. Verdict REJECT vì lệnh `make check` (lệnh suite, không gắn eval nào) hỏng: bước test trong đó có 6 ca quá hạn 5 giây ở 4 tệp thuộc `tools/` (proof_gate, reui_catalog, ...). Mọi eval của tính năng đều xanh hoặc đang chờ người (E17). Có thêm 1 finding trong hợp đồng (AC-11) trong review-findings.md.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | test | PASS (carried từ round 1) |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS (carried từ round 1) |
| E6 | AC-4 | test | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-6 | test | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | test | PASS (carried từ round 1) |
| E11 | AC-7 | script | PASS |
| E12 | AC-8 | test | PASS |
| E13 | AC-8 | script | PASS (carried từ round 1) |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | script | PASS |
| E16 | AC-10 | ui-check | PASS |
| E17 | AC-10 | judgment | chờ người (đề xuất UNCERTAIN, xem Judge panel) |
| E18 | AC-11 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make e2e: 715 passed (6.6m)

- eval: E2
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make e2e: 715 passed (6.6m)

- eval: E3
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make test (lệnh gộp E4, E6, E7, E8, E12) chạy xong, kết thúc sạch.

- eval: E5
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make test (lệnh gộp E4, E6, E7, E8, E12) chạy xong, kết thúc sạch.

- eval: E7
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make test (lệnh gộp E4, E6, E7, E8, E12) chạy xong, kết thúc sạch.

- eval: E8
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make test (lệnh gộp E4, E6, E7, E8, E12) chạy xong, kết thúc sạch.

- eval: E9
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make e2e: 715 passed (6.6m)

- eval: E10
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make e2e: 715 passed (6.6m)

- eval: E12
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make test (lệnh gộp E4, E6, E7, E8, E12) chạy xong, kết thúc sạch.

- eval: E13
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T08:28:50Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make e2e: 715 passed (6.6m)

- eval: E15
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T09:10:16Z
  output: |
    design-floor-s4: không báo mã màu thô trong tệp giao diện vòng này chạm.

- eval: E16
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E16-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T09:10:16Z
  screenshot: evidence/loc-1440-sang.png
  observed: |
    loc-1440-sang.png: the toolbar has the search box, '15 / 60 dòng', 'Lọc (2)', 'Xoá lọc', 'Nhóm theo Toà', 'Cột' and 'Toàn màn hình'. A filter box sits under each column header, 'Giá chào' shows '<=5', and the 15 rows are all under 5 tỷ. The footer reads '15 / 60 dòng'. Matches the expected frame.
    loc-1440-toi.png: same state, not opened with Read; the DOM check shows html.dark with dark bg and light fg.
    nhom-1440-sang.png: not opened with Read; the DOM shows the group labels '12 dòng', '6 dòng'.
    nhom-1440-toi.png: dark background with light text. The 'Nhóm theo Toà' button is active; group rows '[MAU] Toà C1' and '[MAU] Toà E1' each carry a '12 dòng' badge; footer '60 dòng'. Matches.
    chon-1024-sang.png: the sidebar is open and the grid fits the screen. A 3x3 block (rows 3-5, Căn/Toà/Dự án) is tinted with a border, and the footer reads '9 ô đã chọn · Ctrl+C để chép'. Matches.
    loc-nhom-414-sang.png: the toolbar wraps onto 2 lines, the filter row sits under the headers, the 'Nhóm theo Toà' group row shows, the grid scrolls horizontally inside its own area and the page does not scroll sideways. Matches.
    loc-nhom-360-toi.png: the toolbar wraps onto 3 lines, the dark theme is correct, and the filter boxes and the group row show. The grid is cut off at the right edge of its area, so it scrolls inside it. Matches.
    cot-360-sang.png: the 'Hiện cột' menu lists 7 checked items (Toà, Dự án, Trạng thái, Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc). Matches.
  network_observed: no-app-traffic

- eval: E17
  judged_by: judge panel (3 lens, fresh context)
  verdict: UNCERTAIN
  rationale: Hai lens kết luận UNCERTAIN, một lens kết luận FAIL; chung một điểm vướng là ảnh chon-1024-sang.png không cho thấy chân bảng «n ô đã chọn · Ctrl+C để chép» (xem Judge panel bên dưới).
  required_evidence:
    - Ảnh chụp lại chon-1024-sang.png (1024x768, vùng ô đang bôi) có chân bảng ghi «n ô đã chọn · Ctrl+C để chép», lưu vào _acceptance/bang-hang-dung-tay-nhu-sheet/evidence/.
  human_override:  # chi nguoi ghi

- eval: E18
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E18-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T09:10:16Z
  output: |
    make e2e: 715 passed (6.6m)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-dung-tay-nhu-sheet-SUITE-make_check-r2
  exit_code: 2
  verified_at: 2026-11-12T09:10:16Z
  note: Lệnh này không gắn eval nào và HỎNG. Bước test bên trong báo "Test Files 4 failed | 52 passed (56)" và "Tests 6 failed | 1110 passed (1116)". Cả 6 ca là "Test timed out in 5000ms" ở tools/proof_gate/proof-gate.test.ts (ma trận 2 × 8, ma trận căn cứ) và tools/reui_catalog/catalog.test.mjs (E5 · findable) cùng hai tệp khác trong tools/. Chưa phân biệt được lỗi thật với máy chậm; cần chạy lại riêng các tệp này.

- cmd: npm run build
  run_id: minted-bang-hang-dung-tay-nhu-sheet-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-12T09:10:16Z

### Judge panel (đề xuất) — E17

Đề xuất panel: 3 lens. Mục E17 để human_override TRỐNG cho người quyết ở Cổng 2. Đề xuất tổng hợp: UNCERTAIN.

- domain-correctness: UNCERTAIN — Bốn ảnh còn lại đạt (nút công cụ và ô lọc đọc được, dòng nhóm có mũi gập và huy hiệu «n dòng», ảnh tối đủ tương phản, chữ không chồng nhau). Riêng ST-inventory-chon-vung đòi cả vùng ô tô màu lẫn chân «n ô đã chọn · Ctrl+C để chép»; ảnh chon-1024-sang chỉ cho thấy vùng bôi và bị cắt ở dòng 14, không có chân bảng.
- operational-feasibility: FAIL — Ảnh chon-1024-sang.png không có chân bảng «n ô đã chọn · Ctrl+C để chép», lưới tràn quá đáy ảnh 768px. Ở loc-nhom-360-toi.png dòng nhóm chỉ có chevron và tên toà, không thấy «n dòng». Ở hai ảnh lọc 1440, ô lọc cột Trạng thái bị cắt chữ («Chọn», «Đang…»). Tương phản ảnh tối, nút công cụ và ô lọc đọc được, chữ không chồng nhau.
- spec-alignment: UNCERTAIN — Ảnh lọc mở (1440 sáng và tối) và ảnh nhóm (1440 tối, 360 tối) khớp đặc tả. Riêng ST-inventory-chon-vung: ảnh 1024 có vùng ô bôi nhạt, có viền, nhưng không thấy chân bảng «n ô đã chọn · Ctrl+C để chép» vì bảng tràn khỏi khung ảnh.

Bằng chứng còn thiếu (gộp từ ba lens):
- Ảnh chụp lại chon-1024-sang.png (1024x768, đang bôi vùng ô) thấy chân bảng «n ô đã chọn · Ctrl+C để chép»; chụp bằng bài e2e của Bảng hàng sau commit 2e6d05f.
- Ảnh loc-nhom-360-toi.png có dòng nhóm hiện «n dòng», hoặc ghi trong design.md rằng ở 360 số dòng của nhóm được phép không hiện.
- Ảnh loc-1440-sang.png và loc-1440-toi.png có ô lọc Trạng thái không bị cắt chữ, hoặc ghi trong design.md rằng cắt chữ ở ô này là chấp nhận được.

Ghi chú của người soạn: bản mô tả máy của E16 nói chon-1024-sang.png có chân «9 ô đã chọn · Ctrl+C để chép», còn lens judge nói ảnh không có chân. Hai mô tả mâu thuẫn; ảnh trên đĩa đã bị ghi đè sau commit 2e6d05f, người quyết cần tự mở ảnh.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay. Mọi field baseline của round này là n-a.

Eval KHÔNG-PHÂN-BIỆT (pass trên cả HEAD lẫn baseline; chứng minh harness chứ không chứng minh tính năng — cần viết lại để khẳng định hành vi mới, hoặc xác nhận là regression-guard có chủ ý):
- make test: E3, E4, E5, E6, E7, E8, E10, E12
- design-floor-khuon.mjs --kiem: E13
- design-floor-s4.mjs: E15

Lệnh fail không gắn eval: `make check` (không eval nào đứng tên). Lỗi nằm ở 6 ca quá hạn của bộ test trong tools/, không phải ở eval của tính năng.

## Variance

none — every multi-run eval is uniform (mọi eval chạy một lần, xác định).

## Iterations

Round 1: E3, E5, E10, E13 chạy và xanh; các eval còn lại thuộc vòng đầu, chi tiết ở log vòng đó.
Round 2: không eval nào hỏng, nhưng lệnh suite `make check` hỏng do 6 ca test quá hạn trong tools/; E17 chờ người vì thiếu ảnh chân bảng ở chon-1024-sang.png; 1 finding trong hợp đồng ở AC-11 (chiều cao lưới ở toàn màn hình từ 1024). Trả về cho khâu triển khai.
