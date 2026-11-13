---
schema_version: 2
feature_slug: da-gui-tren-luoi
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3c8ef3ee9fdede4c847d0642ce2e60bf1ac0c19c
human_signoff:
---

# Evidence Report: da-gui-tren-luoi

Round 2. Mọi eval máy đều xanh; còn một mục judgment (E15) chờ người chốt ở Cổng 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS (carry-forward từ round 1) |
| E4 | AC-3 | script | PASS (carry-forward từ round 1) |
| E5 | AC-4 | test | PASS |
| E6 | AC-4 | test | PASS (carry-forward từ round 1) |
| E7 | AC-5 | script | PASS (carry-forward từ round 1) |
| E8 | AC-6 | test | PASS (carry-forward từ round 1) |
| E9 | AC-6 | script | PASS (carry-forward từ round 1) |
| E10 | AC-7 | test | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | test | PASS (carry-forward từ round 1) |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | ui-check | PASS |
| E15 | AC-10 | judgment | UNCERTAIN (panel đề xuất PASS, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-da-gui-tren-luoi-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T06:04:20Z
  output: |
    lệnh make test, toàn bộ bộ bài xanh (cover E1, E2, E5)

- eval: E2
  run_id: minted-da-gui-tren-luoi-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T06:04:20Z
  output: |
    lệnh make test, toàn bộ bộ bài xanh (cover E1, E2, E5)

- eval: E3
  run_id: minted-da-gui-tren-luoi-E3-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-da-gui-tren-luoi-E4-r1
  exit_code: 0
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-da-gui-tren-luoi-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T06:04:20Z
  output: |
    lệnh make test, toàn bộ bộ bài xanh (cover E1, E2, E5)

- eval: E6
  run_id: minted-da-gui-tren-luoi-E6-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-da-gui-tren-luoi-E7-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-da-gui-tren-luoi-E8-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-da-gui-tren-luoi-E9-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-da-gui-tren-luoi-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-13T06:04:20Z
  output: |
    lệnh npx vitest run tools/proof_gate, lưới chứng minh màn xanh

- eval: E11
  run_id: minted-da-gui-tren-luoi-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T06:04:20Z
  output: |
    lệnh make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E12
  run_id: minted-da-gui-tren-luoi-E12-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-da-gui-tren-luoi-E13-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T06:04:20Z
  output: |
    lệnh make e2e
      915 passed (6.9m)

- eval: E14
  run_id: minted-da-gui-tren-luoi-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T06:04:20Z
  screenshot: evidence/sent-1440-sang.png
  observed: |
    I opened 11 of the 15 frames with Read: the ones listed below. The other four (sent-1024-sang, sent-360-toi, sent-1440-ho-so-toi, sent-360-ho-so) were not opened; their DOM checks passed (see outputTail).
    - sent-1440-sang: App Shell with the left rail, the sub-nav 'Đã gửi / Tất cả link' and a top bar. The heading is 'Đã gửi' and the card is 'Link đã gửi'. The toolbar has a search box, '14 dòng', Lọc, Cột and Toàn màn hình. The grid shows '#' and all six columns. The third recipient is cut with '...' inside its column and does not run into the next one. The footer says '14 dòng'. The page does not scroll sideways.
    - sent-1440-toi: the same layout with a dark background and light text, readable.
    - sent-360-sang: the heading, card, '14 dòng', the '#' and Người nhận columns, with Lượt mở partly visible. The grid scrolls sideways inside its area and the page does not. The third name ends with '...'.
    - sent-1024-toi: dark theme, the toolbar wraps to a second row, and the grid scrolls sideways inside its area. Readable.
    - sent-414-toi: dark theme, the grid is cut at the Quan tâm column and scrolls inside its area. Readable.
    - sent-1440-ho-so: the detail pane sits on the right side, below the top bar. It shows '[Tên] Khách 05' with Trước, Sau and Đóng buttons, the six fields and the list 'Căn trong link'.
    - sent-1024-ho-so: the pane sits below the top bar and has the same content.
    - sent-414-ho-so: the pane fills the screen with the name, the six fields and the unit list.
    - sent-360-ho-so-toi: the pane fills the screen in dark theme with all fields and the list. Readable.
    - sent-360-ten-dai: same as sent-360-sang, with the long name ending in '...' and no tooltip visible.
    Everything matches Expected.
  network_observed: clean

- eval: E15
  judged_by: judge panel (3 lens), đề xuất PASS
  verdict: UNCERTAIN
  rationale: Panel đề xuất PASS (domain-correctness, operational-feasibility, spec-alignment đều PASS), nhưng máy không tự chốt mục judgment; người quyết ở Cổng 2.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-da-gui-tren-luoi-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T06:04:20Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên code cũ lẫn code mới, chỉ chứng minh harness): E1, E2, E5 (qua make test), E10 (proof_gate), E11 (make check). Cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý. E13 đỏ trên baseline nên có phân biệt. E14 baseline n-a.

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần).

## Judge

Panel đề xuất cho E15 (human_override để trống):
- domain-correctness: PASS — tám ảnh cho thấy đầu màn «Đã gửi», đầu cột đọc được (ở 360 chỉ thấy hai cột đầu vì lưới cuộn ngang theo Đặc tả), tên dài bị cắt bằng dấu ba chấm, ngăn chi tiết có tên người nhận, sáu trường và danh sách căn; ảnh tối đủ tương phản. Nút «N» của công cụ dev Next.js che một dòng ở ảnh 360 của ngăn chi tiết là lớp phủ môi trường dev.
- operational-feasibility: PASS — ở 1440 sáng và tối sáu đầu cột đọc được; ở 360 thấy «Người nhận» và «Lượt mở»; tên dài bị cắt bằng dấu ba chấm; ngăn chi tiết đọc được; ảnh tối đủ tương phản. Nút «N» dev che dòng «1504 · S1.05» không tính là chữ chồng nhau.
- spec-alignment: PASS — đúng mục Đặc tả UX: đầu màn, sáu đầu cột ở 1440, chữ không chồng nhau, tên dài cắt bằng dấu ba chấm ở cả hai khổ, ngăn chi tiết đủ tên, sáu trường và danh sách căn.

## Iterations

Round 1: làm lại sau vòng đầu — E2 và E13 đo lưới đã dựng, E14 theo quyết định 0024 trên điện thoại (commit 3c8ef3e).
Round 2: mọi eval máy xanh; E3, E4, E6, E7, E8, E9, E12 carry-forward từ round 1; E15 chờ người chốt ở Cổng 2.
