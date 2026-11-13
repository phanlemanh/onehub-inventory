---
schema_version: 2
feature_slug: sua-tren-o
verdict: REJECT
failed_evals: ["E10b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 67466464bde609ccdc372ab6641509a7c8e8c035
human_signoff:
---

# Evidence Report: sua-tren-o

Round 3. Nội dung này thay toàn bộ round cũ; lịch sử round nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E2 | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4-e2e | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5-e2e | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7-ui | AC-7 | ui-check | PASS |
| E8 | AC-8 | test | PASS |
| E8-e2e | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS (carry-forward từ round 2) |
| E10b | AC-10 | script | FAIL |
| E10c | AC-10 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E11 | AC-2 | test | PASS |
| E12 | AC-9 | script | PASS (carry-forward từ round 2) |

Lệnh fail không gắn eval nào ngoài E10b: không có. Lệnh duy nhất fail là `make check`, gắn với E10b.

## Evidence

- eval: E1
  run_id: minted-sua-tren-o-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Bộ vitest (edit-rules, save-door, use-change, data-region-cell-edit) xanh.

- eval: E4
  run_id: minted-sua-tren-o-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Bộ vitest xanh.

- eval: E5
  run_id: minted-sua-tren-o-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Bộ vitest xanh.

- eval: E7
  run_id: minted-sua-tren-o-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Bộ vitest xanh.

- eval: E8
  run_id: minted-sua-tren-o-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Bộ vitest xanh.

- eval: E2
  run_id: minted-sua-tren-o-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E3
  run_id: minted-sua-tren-o-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E4-e2e
  run_id: minted-sua-tren-o-E4-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E5-e2e
  run_id: minted-sua-tren-o-E5-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E6
  run_id: minted-sua-tren-o-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E8-e2e
  run_id: minted-sua-tren-o-E8-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E9
  run_id: minted-sua-tren-o-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E11
  run_id: minted-sua-tren-o-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:54:49Z
  output: |
    Playwright: 164 passed (1.5m)

- eval: E10b
  run_id: minted-sua-tren-o-E10b-r3
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-13T10:54:49Z
  output: |
    make check dừng ở bước test: 2 bài hết hạn 5000ms.
    - tests/grid-sheet.test.tsx > sort by the header menu > orders the price column up and keeps row numbers 1..60 (Test timed out in 5000ms)
    - tools/proof_gate/proof-gate-0023.test.ts > nấc trạng thái × mục > ma trận 2 × 8 viết trước: mỗi ô đỏ đúng mã hay im (Test timed out in 5000ms)
    Test Files  2 failed | 77 passed (79); Tests  2 failed | 1475 passed (1477)

- eval: E2-ui
  run_id: minted-sua-tren-o-E2-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T10:54:49Z
  screenshot: evidence/E2-1440-sang.png
  observed: |
    Da Read 8 frame. 1440 sang/toi (truoc Enter): hang 1101 "Đang bán", o Giá chào co khung xanh chua "2,8 tỷ" nam dung o, ngay duoi la the "Hiểu là: 2.800.000.000 ₫ (2,8 tỷ) / Enter ghi · Esc huỷ · Tính là vừa xác nhận với chủ nhà." — the nam duoi o, che cac o hang 1202/1303 ben duoi nhung KHONG che o dang sua; chu doc duoc ca sang lan toi. 1440 sau Enter: khung dong, o hien "2,8 tỷ" (giu vien chon), cot Xác nhận lúc cua 1101 doi thanh 17:55 13/11/2026, toast goc phai duoi "Đã đổi Giá chào căn 1101: 2,8 tỷ." kem nut "Hoàn tác" (sang va toi deu dung). 1024 sang/toi truoc Enter: bo cuc thu gon (thanh cong cu 2 dong), o Giá chào 1101 chua khung sua "2,8 tỷ" nam tren o, the "Hiểu là…" ngay duoi o, khong che o; sau Enter o = "2,8 ..." (cot bi cat mep phai do luoi cuon ngang), toast "Đã đổi Giá chào căn 1101: 2,8 tỷ." + Hoàn tác. Tat ca 4 khung khop nhau va khop Expected "Mọi khung khớp; khung không che ô đang sửa".
  network_observed: no-app-traffic

- eval: E7-ui
  run_id: minted-sua-tren-o-E7-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T10:54:49Z
  screenshot: evidence/E7-ui-step1.png
  observed: |
    I opened step1 to step8 with Read and checked them against the Expected line.
    - step1 (1440 light, 1.5s after offline Hoàn tác): the grid shows row 1101 with Giá chào 2,8 tỷ, and the cell has a focus ring. An amber banner at the top says "Mất kết nối mạng ... thay đổi mới chưa lưu được". The bottom-right toast reads «Chưa hoàn tác được vì mất kết nối mạng. Căn 1101 vẫn là 2,8 tỷ; có mạng lại thì bấm «Thử lại».» with a dark Thử lại button.
    - step2 (1440 light, +10s): identical. Toast still there, same text, Thử lại present, cell still 2,8 tỷ.
    - step3 and step4 (1440 dark): same content on a dark theme. Toast and Thử lại button (light button) are legible, and the toast is still there after 10s. Cell 1101 is 2,8 tỷ.
    - step5 and step6 (1024 light): the toast is the same text with Thử lại, and it persists across the 10s. Cell 1101 is truncated by the narrow width but reads "2,8", consistent with 2,8 tỷ (DOM text also read 2,8 tỷ). Offline banner present.
    - step7 and step8 (1024 dark): same toast and Thử lại, persisting, cell 1101 shows 2,8.
    In all 8 frames the toast stays put, names căn 1101 and the carried price 2,8 tỷ, and has Thử lại. The cell matches the toast. It matches Expected, so there is no contradiction.
  network_observed: clean

### Eval carry-forward

- eval: E10
  run_id: minted-sua-tren-o-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_rao
  verified_at: 2026-11-13T10:36:10Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-sua-tren-o-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T10:36:10Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-sua-tren-o-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-13T10:54:49Z

- cmd: make e2e
  run_id: minted-sua-tren-o-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-13T10:54:49Z

### Judgment (đề xuất của hội đồng — để human_override TRỐNG, người chốt ở Cổng 2)

- eval: E1b
  judged_by: hội đồng 3 lens (đề xuất)
  proposal: PASS
  votes:
    - domain-correctness: PASS — edit-rules.ts giữ trọn luật (readPrice, PRICE_SWING_ASK = 0.2 với priceAsksAgain, bảng STATUS_NEXT 12 nấc, statusNeeds, statusUndoable) dưới dạng hàm thuần, index.ts xuất lại; listing-cell-edit.tsx, inventory-grid.tsx, data-region.tsx chỉ gọi. Hai ghi chú nhẹ: `companyToday` là hàm ngày mặc định; danh sách lý do ngừng có ở WITHDRAWN_REASON_ORDER (cell-edit-copy) và WITHDRAWN_REASONS (edit-rules), chưa đối chiếu được hai danh sách có trùng nhau không.
    - operational-feasibility: PASS — các hàm luật đều ở edit-rules.ts, giao diện chỉ gọi, không có ngưỡng hay danh sách nấc riêng. L109 là điều kiện hiển thị lỗi; L358 dùng WITHDRAWN_REASON_ORDER của cell-edit-copy thay vì WITHDRAWN_REASONS (danh sách lý do, không phải nấc).
    - spec-alignment: PASS — luật và hằng đều ở edit-rules.ts, được xuất qua index.ts; không thấy phép so số với ngưỡng hay danh sách nấc trong listing-cell-edit.tsx. Ghi chú nhẹ: dòng 351-373 giả định chỉ có hai kiểu hỏi lại; WITHDRAWN_REASON_ORDER nằm ngoài danh sách input nên chưa so với WITHDRAWN_REASONS.
  human_override:  # chi nguoi ghi

- eval: E10c
  judged_by: hội đồng 3 lens (đề xuất)
  proposal: PASS
  votes:
    - domain-correctness: PASS — không có dòng stage gate1 trả lời Hỏi-2, tính theo khuyến nghị: ba lý do, không có «Khác». labels.yaml đủ bốn nhãn, đều không quá 17 ký tự (Lý do ngừng 11, Chủ bán nơi khác 16, biến thể thuê «Cho thuê nơi khác» 17, Chủ đổi ý 9, Mất liên lạc 12). glossary.md có dòng WithdrawnReason ghi «Riêng của ta; RESO DD 2.1 không có trường này».
    - operational-feasibility: PASS — cùng căn cứ: đủ bốn nhãn, không nhãn nào quá 17 ký tự, glossary ghi khái niệm riêng.
    - spec-alignment: PASS — đủ 4 nhãn trong labels.yaml, ba lý do khớp khuyến nghị Hỏi-2, glossary có mục WithdrawnReason ghi khái niệm riêng.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline khong do: round này không đo lại, evals.yaml không đổi từ lần đo cuối ở round 1; mọi block eval ghi baseline n-a.

Eval không phân biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E10 — lệnh `npx vitest run tests/behavior-guard.test.ts --coverage.enabled=false --reporter=verbose`
- E12 — lệnh `design-floor-khuon.mjs --kiem --root .`

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: các phát hiện vòng 1 được sửa (sổ chặn, ngày chốt theo giờ Việt Nam, luật lấy từ edit-rules, bài thử đo đường ghi thật). Returned to implementation.
Round 2: các phát hiện vòng 2 được sửa (ô sửa giữ đúng ô gần mép phải, lỗi ghi lạ làm ô về giá trị cũ). Returned to implementation.
Round 3: E10b failed — make check dừng ở hai bài hết hạn 5000ms (tests/grid-sheet.test.tsx và tools/proof_gate/proof-gate-0023.test.ts); mọi eval tính năng khác, npm run build và make e2e (904 passed) đều xanh. Returned to implementation.
