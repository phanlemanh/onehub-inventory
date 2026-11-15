---
schema_version: 2
feature_slug: dan-tu-excel
verdict: BLOCKED
failed_evals: []
reason: "make e2e chạy quá 30 phút chưa xong (khoảng 84 phút, từ 19:17 đến 20:41, chưa có dòng kết thúc). Không tìm thấy khai báo long_running cho e2e trong evals/ hoặc Makefile nên áp mức vàng mặc định 30 phút. Không kill tiến trình, không chạy lại. Output nằm tại /private/tmp/claude-501/-Users-manhphan-dev-onehub-inventory--claude-worktrees-hopeful-hopper-7b4945/e102c147-2e14-4fe1-8f27-e9857201cac9/tasks/btadrlt6i.output. Cần khai long_running cho make e2e nếu cần chờ tiếp."
blocked:
  - cmd: make e2e
    reason: "lệnh chạy quá 30 phút chưa xong (khoảng 84 phút, từ 19:17 đến 20:41, chưa có dòng kết thúc); chưa khai long_running cho e2e nên áp mức vàng mặc định 30 phút; không kill, không chạy lại"
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 5df48118c660066f1e7eb86e657d4c9ce5bb6d21
human_signoff:
---

# Evidence Report: dan-tu-excel

Round 5. Nội dung thay toàn bộ round cũ; lịch sử nằm ở mục Iterations. Các eval gắn AC đều xanh. Lệnh suite `make e2e` chưa kết thúc nên verdict tổng là BLOCKED, và việc cần làm là chờ lệnh đó chạy xong chứ không phải sửa mã.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1-ui | AC-1 | ui-check | PASS |
| E2 | AC-2 | test | PASS (carry-forward từ round 4) |
| E2b | AC-2 | judgment | PASS (đề xuất của hội đồng, chờ người) |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4-e2e | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6-e2e | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7-e2e | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E12 | AC-10 | test | PASS |
| E9 | AC-9 | script | PASS |
| E9-axe | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS (carry-forward từ round 3) |
| E11 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dan-tu-excel-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E1-ui
  run_id: minted-dan-tu-excel-E1-ui-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check.default
  verified_at: 2026-11-15T12:15:56Z
  screenshot: evidence/E1-1440-sang.png
  observed: |
    E1-1440-sang.png: light, modal "Dán vào 3 căn / 6 ô sẽ đổi / Sẽ đổi · 6"; lines Căn 0905 Trạng thái Đang giao dịch -> Đang bán, Căn 0905 Giá chào 5,71 tỷ -> 5,81 tỷ, Căn 1101 Trạng thái Đang bán -> Đang giao dịch, Căn 1101 Giá chào 2,71 tỷ -> 2,81 tỷ, Căn 1202 Trạng thái Chưa đủ để rao -> Đang bán with badge "Không hoàn tác được"; footer "Thôi" and "Áp 6 ô". Blurred grid behind is unchanged, selection frame on the status/price cells. E1-1440-toi.png: same content in dark theme, grid behind sharper and visibly still shows old prices 5,71 tỷ, 2,71 tỷ, 4,32 tỷ and old statuses; footer "Áp 6 ô". E1-1024-sang.png and E1-1024-toi.png: same dialog and same five visible lines at 1024 wide, light and dark, narrower layout, behind it the old values (status chips Đang giao dịch, Đang bán, Chưa đủ để rao) kept; no clipping or overlap, text legible. All four frames agree with each other and with Expected: every frame matches and the table behind keeps the old values. The 6th line (Căn 1202 Giá chào) sits below the fold of the scrolling list.
  network_observed: clean

- eval: E2
  run_id: minted-dan-tu-excel-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  carried_from_round: 4
  output: |
    carry-forward từ round 4 — delta không chạm paths của eval

- eval: E2b
  judged_by: hội đồng ba góc nhìn (fresh context), đề xuất PASS
  verdict: PASS
  rationale: Luật đọc ô dán chỉ gọi hàm của edit-rules, không tự đặt ngưỡng; mọi lần ghi qua một cửa lưu. Xem mục Judge bên dưới.
  human_override:  # chi nguoi ghi

- eval: E3
  run_id: minted-dan-tu-excel-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T12:15:56Z
  output: |
    vitest paste-rules, listing-paste, door-batch, data-region-paste
    __EXIT=0

- eval: E4
  run_id: minted-dan-tu-excel-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T12:15:56Z
  output: |
    vitest paste-rules, listing-paste, door-batch, data-region-paste
    __EXIT=0

- eval: E4-e2e
  run_id: minted-dan-tu-excel-E4-e2e-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E5
  run_id: minted-dan-tu-excel-E5-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E5b
  run_id: minted-dan-tu-excel-E5b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T12:15:56Z
  output: |
    vitest paste-rules, listing-paste, door-batch, data-region-paste
    __EXIT=0

- eval: E6
  run_id: minted-dan-tu-excel-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T12:15:56Z
  output: |
    vitest paste-rules, listing-paste, door-batch, data-region-paste
    __EXIT=0

- eval: E6-e2e
  run_id: minted-dan-tu-excel-E6-e2e-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E7
  run_id: minted-dan-tu-excel-E7-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T12:15:56Z
  output: |
    vitest paste-rules, listing-paste, door-batch, data-region-paste
    __EXIT=0

- eval: E7-e2e
  run_id: minted-dan-tu-excel-E7-e2e-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E8
  run_id: minted-dan-tu-excel-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E12
  run_id: minted-dan-tu-excel-E12-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E9
  run_id: minted-dan-tu-excel-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T12:15:56Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

- eval: E9-axe
  run_id: minted-dan-tu-excel-E9-axe-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T12:15:56Z
  output: |
    158 passed (1.2m)
    __EXIT=0

- eval: E10
  run_id: minted-dan-tu-excel-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:29:13Z
  carried_from_round: 3
  output: |
    carry-forward từ round 3 — delta không chạm paths của eval

- eval: E11
  run_id: minted-dan-tu-excel-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T12:15:56Z
  output: |
    design-floor-s4 --root .
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dan-tu-excel-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-15T12:15:56Z

- cmd: make e2e
  run_id: minted-dan-tu-excel-SUITE-make_e2e-r5
  status: chưa kết thúc (BLOCKED) — tiến trình PID 47871 chạy 01:23:44 lúc 20:41 +07 ngày 2026-11-15, chưa có dòng kết thúc; worker Playwright và chromium headless vẫn chạy
  verified_at: 2026-11-15T12:15:56Z

### Judge (đề xuất, human_override để trống)

- E2b, đề xuất PASS. Tệp chờ người điền human_override.
  - domain-correctness: PASS — paste-rules.ts chỉ đọc giá và trạng thái qua hàm của edit-rules (readPrice, priceAsksAgain, priceLocked, statusLocked, canMove, statusNeeds và các hàm phụ), không đặt ngưỡng, không giữ danh sách nấc riêng; STATUSES lấy từ STATUS_NEXT. Mọi lần ghi qua write() → door.save, cửa kiểm lại bằng applyChange nên không có đường ghi thứ hai. Judge chưa đọc trọn data-region.tsx và use-change.tsx.
  - operational-feasibility: PASS — paste-rules.ts chỉ gọi hàm của edit-rules, không so số, không đặt ngưỡng; ghi cả ô đơn lẫn dán đều qua write rồi door.save của save-door.ts, nơi applyChange kiểm lại luật; không thấy đường ghi thứ hai.
  - spec-alignment: PASS — bộ đọc ô dán không tự so số hay đặt ngưỡng; PRICE_SWING_ASK=0.2 chỉ nằm ở edit-rules.ts:21; mọi lần ghi (ô đơn, dán, hoàn tác) đi qua write() → door.save(), chỉ có một đường ghi.

## Known limits

## Ngoài hợp đồng

## Analyst

carried từ round 1 — baseline không đo lại round này.

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline ở lần đo round 1, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make check (E9)
- design-floor-khuon --kiem (E10)
- design-floor-s4 (E11)

Baseline không đo: mọi eval ở round này ghi n-a vì evals.yaml không đổi từ lần đo cuối (round 1).

## Variance

none — mọi eval chạy một lần, đều xác định, không có phương sai.

## Iterations

Round 1: baseline đo lần cuối.
Round 2: chấm lại, sửa luật hoàn tác giá và giờ xác nhận (commit 7988967).
Round 3: đạt; hồ sơ bằng chứng và thẻ cổng (commit 0641b01).
Round 4: delta — dòng Excel ngắn khớp cột theo thứ tự lưới hiển thị (commit ddef774).
Round 5: mọi eval gắn AC xanh; BLOCKED vì lệnh suite make e2e quá 30 phút chưa kết thúc, cần khai long_running rồi chờ hoặc chạy lại với thời hạn dài hơn.
