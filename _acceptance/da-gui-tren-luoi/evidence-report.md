---
schema_version: 2
feature_slug: da-gui-tren-luoi
verdict: REJECT
failed_evals: ["E14"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 91de7a064bf11f4ee12978cb3e60d3910c755b52
human_signoff:
---

# Evidence Report: da-gui-tren-luoi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | test | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | test | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | test | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-10 | ui-check | FAIL |
| E15 | AC-10 | judgment | FAIL (đề xuất của hội đồng, chưa có người chốt) |

Lệnh fail không gắn eval: ui-check:E14 (gắn với E14, đã tính ở failed_evals). Không có lệnh nào khác fail ngoài eval.

## Evidence

- eval: E1
  run_id: minted-da-gui-tren-luoi-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make test chạy xong, toàn bộ xanh (lệnh chung với E2, E5, E6, E8, E12).

- eval: E2
  run_id: minted-da-gui-tren-luoi-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make test chạy xong, toàn bộ xanh (lệnh chung).

- eval: E3
  run_id: minted-da-gui-tren-luoi-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make e2e: 915 passed (7.3m)

- eval: E4
  run_id: minted-da-gui-tren-luoi-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-13T05:50:21Z
  output: |
    npx vitest run tools/e2e_templates xanh.

- eval: E5
  run_id: minted-da-gui-tren-luoi-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make test chạy xong, toàn bộ xanh (lệnh chung).

- eval: E6
  run_id: minted-da-gui-tren-luoi-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make test chạy xong, toàn bộ xanh (lệnh chung).

- eval: E7
  run_id: minted-da-gui-tren-luoi-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make e2e: 915 passed (7.3m)

- eval: E8
  run_id: minted-da-gui-tren-luoi-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make test chạy xong, toàn bộ xanh (lệnh chung).

- eval: E9
  run_id: minted-da-gui-tren-luoi-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T05:50:21Z
  output: |
    design-floor-khuon --kiem: 5 tệp giao diện ngoài bản đồ

- eval: E10
  run_id: minted-da-gui-tren-luoi-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-13T05:50:21Z
  output: |
    npx vitest run tools/proof_gate xanh.

- eval: E11
  run_id: minted-da-gui-tren-luoi-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make check: CODEOWNERS matches governance/autonomy.yaml

- eval: E12
  run_id: minted-da-gui-tren-luoi-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make test chạy xong, toàn bộ xanh (lệnh chung).

- eval: E13
  run_id: minted-da-gui-tren-luoi-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T05:50:21Z
  output: |
    make e2e: 915 passed (7.3m)

- eval: E14
  run_id: minted-da-gui-tren-luoi-E14-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui
  verified_at: 2026-11-13T05:50:21Z
  screenshot: evidence/sent-1440-sang.png
  observed: |
    sent-1440-sang: App Shell with sidebar and top bar. Title 'Đã gửi', frame 'Link đã gửi', toolbar showing '14 dòng', then # + 6 readable columns (Người nhận, Lượt mở, Quan tâm, Mở gần nhất, Gửi lúc, Số căn). Footer '14 dòng'. Row 3's long name ends in '...'. The grid scrolls inside its own area, not the page. Matches expected.
    sent-360-sang: Top bar with 'Đăng nhập'. Title 'Đã gửi' and frame 'Link đã gửi'. Grid shows # / Người nhận / Lượt mở, the rest scrolls sideways inside the frame. Footer '14 dòng'. Row 3 truncated with an ellipsis. No page horizontal scroll. Matches expected.
    sent-360-ten-dai: same as above (hover on row 3, long name truncated with an ellipsis, nothing overlapping the next column). Matches expected.
    sent-1440-ho-so: detail pane on the right under the top bar. Title '[Tên] Khách 05', Trước/Sau/Đóng buttons, six fields (Người nhận, Lượt mở 4, Quan tâm 6, Mở gần nhất 18:00 12/11/2026, Gửi lúc 14:20 11/11/2026, Số căn 30), 'Căn trong link' list. Top bar not covered. Matches expected.
    sent-1440-ho-so-toi: same layout in dark; background, text and the blue links readable. Matches expected.
    sent-1024-ho-so: detail pane on the right, under the top bar, same content, list pane squeezed on the left. Matches expected.
    sent-414-ho-so and sent-360-ho-so: the detail pane fills the whole screen and the App Shell top bar is gone, with the pane title at y=0. Contradicts expected (không che thanh trên).
    Dark list frames (1440/1024/414/360 toi): not individually opened as images. Checked by DOM (dark class, dark background, same text, no horizontal scroll). The 1440 dark detail frame and the 1440 light frames were read as images.
  network_observed: clean
  output: |
    Server on 3483 was not answering, so it was started (PORT=3483 npm run dev), got HTTP 200 on /sent, and only that process was stopped. Frames were saved with a Playwright script; all 15 PNGs are in _acceptance/da-gui-tren-luoi/evidence/ (sent-1440-sang, sent-1440-toi, sent-1024-sang, sent-1024-toi, sent-414-sang, sent-414-toi, sent-360-sang, sent-360-toi, sent-1440-ho-so, sent-1440-ho-so-toi, sent-1024-ho-so, sent-414-ho-so, sent-360-ho-so, sent-360-ho-so-toi, sent-360-ten-dai). Network and console log: evidence/E14-network.txt.
    PASS: /sent returns 200 at all four widths.
    PASS: DOM text has 'Đã gửi', 'Link đã gửi', '14 dòng' and the seven headers.
    PASS: no page-level horizontal scroll at 1440, 1024, 414 and 360, light and dark.
    PASS: dark mode switches body background and the dark frames are readable.
    PASS: the long name in row 3 ends in an ellipsis without overlapping the next column, at 1440 and 360.
    PASS: detail pane at 1440 and 1024 has recipient name, six fields and the unit list, below the App Shell top bar.
    FAIL: at 414 and 360 the detail pane covers the App Shell top bar (dialog top is 0, point inside the header resolves to a DIV, not the header). This contradicts "không che thanh trên của App Shell".
    Network/console: 0 failed requests, 0 console errors across all 15 pages.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-da-gui-tren-luoi-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T05:50:21Z

### Judgment

- eval: E15
  judged_by: judge panel (fresh context) — đề xuất, chưa có người chốt
  proposal: FAIL
  lưu ý: hội đồng báo nhiều ảnh "không tồn tại" và thấy tên dài tràn cột, còn bước chụp của máy (E14) ghi 15 ảnh có đủ và tên dài kết thúc bằng dấu chấm lửng. Hai bên mâu thuẫn; người quyết ở Cổng 2 đối chiếu với ảnh thật trong evidence/.
  votes:
  - domain-correctness: FAIL — Trong sent-1440-sang.png, tên người nhận dài ở dòng 3 không bị cắt bằng dấu ba chấm mà tràn sang cột "Quan tâm" và đè lên chữ khác ("tế, xem cuối tuần" nằm đè lên ô bên cạnh). Điều này vi phạm ST-sent-long-text và tiêu chí "chữ không chồng nhau". sent-360-sang.png cũng cắt cụt ở mép cột, không có dấu chấm lửng. Sáu trong tám ảnh không tồn tại (sent-360-toi, sent-360-ten-dai, sent-1440-toi, sent-1440-ho-so, sent-1440-ho-so-toi, sent-360-ho-so), nên ảnh tối và ngăn chi tiết không chứng minh được.
  - operational-feasibility: FAIL — Trong 8 ảnh chỉ đọc được 2 ảnh (sent-360-sang.png, sent-1440-sang.png). 6 ảnh còn lại báo "File does not exist". Ảnh 1440 sáng cho thấy dòng 3 "[Tên] Khách 03 — anh chị cần căn hai phòng ngủ gầ…" tràn sang cột Lượt mở và Quan tâm. Chữ "tế, xem cuối tuần" đè lên ô "1", không có dấu chấm lửng. Điều này vi phạm "chữ không chồng nhau" và "tên dài cắt bằng dấu ba chấm" trong design.md.
  - spec-alignment: FAIL — Chỉ đọc được 2 trong 8 ảnh (sent-360-toi.png, sent-1440-toi.png); 6 ảnh kia không tồn tại. Ở sent-1440-toi.png, tên dài ở dòng 3 không bị cắt bằng dấu ba chấm mà tràn và đè lên ô "Quan tâm" (thấy "tế, xem cuối tuần" chồng lên số 1), trái ST-sent-long-text và yêu cầu chữ không chồng nhau. Ở sent-360-toi.png tên dài bị cắt cứng ở mép cột, không có dấu ba chấm.
  required_evidence:
    - Ảnh sent-1440-sang.png chụp lại sau bản sửa lưới dùng chung (D-1311-4): tên dài ở dòng 3 kết thúc bằng dấu ba chấm trong cột Người nhận, không tràn sang cột bên. Lấy từ _acceptance/da-gui-tren-luoi/evidence/.
    - Ảnh sent-360-ten-dai.png (hiện không có): dòng tên dài ở khổ 360, có dấu ba chấm và không đè lên chữ khác. Lấy từ _acceptance/da-gui-tren-luoi/evidence/.
    - Ảnh sent-360-toi.png và sent-1440-toi.png (hiện không có): màn Đã gửi ở chế độ tối, đủ đầu màn, đầu cột, chữ đọc được. Lấy từ _acceptance/da-gui-tren-luoi/evidence/.
    - Ảnh sent-1440-ho-so.png, sent-1440-ho-so-toi.png và sent-360-ho-so.png (hiện không có): ngăn chi tiết mở bằng ?ho-so=, có tên người nhận làm tiêu đề, sáu trường và danh sách «Căn trong link». Lấy từ _acceptance/da-gui-tren-luoi/evidence/.
    - Ảnh chụp lại cho thấy ngăn chi tiết ở 414 và 360 không che thanh trên của App Shell (từ bước chụp E14).
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline), chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:

- make test: E1, E2, E5, E6, E8, E12
- npx vitest run tools/e2e_templates: E4
- design-floor-khuon --kiem: E9
- npx vitest run tools/proof_gate: E10
- make check: E11

E3, E7, E13 đỏ trên baseline (có phân biệt). E14 baseline n-a.

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (mọi eval chạy một lần, xác định).

## Iterations

Round 1: E14 failed — ngăn chi tiết ở khổ 414 và 360 che thanh trên của App Shell; panel E15 đề xuất FAIL (tên dài tràn cột ở ảnh 1440, ảnh thiếu). Returned to implementation.
