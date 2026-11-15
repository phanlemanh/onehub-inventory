---
schema_version: 2
feature_slug: dan-tu-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9cb62b7cfcfc07b72034ac4975345a56a21360f2
human_signoff:
---

# Evidence Report: dan-tu-excel

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1-ui | AC-1 | ui-check | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | judgment | PASS |
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
| E9 | AC-9 | script | PASS |
| E9-axe | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS (carry-forward từ round 3) |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | test | PASS |

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 1); moi block eval ghi baseline n-a.

Eval khong-phan-biet (pass tren ca HEAD lan baseline, chung minh harness chu khong phai feature; viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y): E9 (make check), E10 (design-floor-khuon --kiem), E11 (design-floor-s4).

## Evidence

- eval: E1
  run_id: minted-dan-tu-excel-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — lệnh playwright tests/e2e/dan-tu-excel.spec.ts tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts

- eval: E1-ui
  run_id: minted-dan-tu-excel-E1-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T11:14:07Z
  screenshot: evidence/E1-1440-sang.png
  observed: |
    All four frames (1440 and 1024 wide, light and dark), opened and read. Each shows the "Dán vào 3 căn" dialog, "6 ô sẽ đổi", "Sẽ đổi · 6", and the buttons "Thôi" and "Áp 6 ô".
    - The 6 lines: Căn 0905 Trạng thái Đang giao dịch → Đang bán; Căn 0905 Giá chào 5,71 tỷ → 5,81 tỷ; Căn 1101 Trạng thái Đang bán → Đang giao dịch; Căn 1101 Giá chào 2,71 tỷ → 2,81 tỷ; Căn 1202 Trạng thái Chưa đủ để rao → Đang bán, with the tag "Không hoàn tác được"; Căn 1202 Giá chào 4,32 tỷ → 4,42 tỷ.
    - Every line has a ticked checkbox, with the old value struck through.
    - At 1440 the dialog is centred over the blurred grid. At 1024 it is also centred and the three selected cells stay highlighted behind it. All text is legible and nothing is clipped.
    - Dark frames: dark background, light text, light-blue "Áp 6 ô" button, same content as the light frames. Contrast is fine.
    - Behind the dialog the table keeps the old values: the DOM read after the paste shows the old three statuses and prices. In the 1024 frames the status column behind shows Đang giao dịch / Đang bán / Chưa đủ để rao.
    This matches the expected result: every frame agrees, and the table behind keeps its old values.
  network_observed: clean

- eval: E2
  run_id: minted-dan-tu-excel-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  output: |
    vitest run paste-rules.test.ts, listing-paste.test.ts, door-batch.test.tsx, data-region-paste.test.tsx — xanh

- eval: E2b
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Ba góc nhìn cùng thấy bộ đọc ô dán không tự so số hay đặt ngưỡng (luật nằm ở edit-rules.ts) và mọi lần ghi đi qua một hàm write gọi door.save.
  panel (đề xuất): domain-correctness, operational-feasibility, spec-alignment
  human_override:  # chi nguoi ghi

### Phiếu của hội đồng cho E2b

- domain-correctness: PASS — Bộ đọc ô dán (listing-paste.ts qua paste-rules.ts) không tự so số, không liệt kê nấc, không đặt ngưỡng: mọi phép so và ngưỡng nằm trong edit-rules.ts (PRICE_SWING_ASK, MILLION, PRICE_CEILING, STATUS_NEXT). Mọi ghi, kể cả hoàn tác, đều đi qua một hàm write trong use-listing-cell-edit.tsx (dòng 125-136) gọi door.save. data-region.tsx chỉ chuyển ô dán đi, không ghi. Điểm nhỏ để chủ kho biết, không làm hỏng tiêu chí: paste-rules.ts gọi thêm priceUnchanged, priceSwing, priceUndoable, statusUndoable, foldWords, STATUS_NEXT (đều của tệp luật hàng 4); dòng 51 lấy STATUSES từ khóa của STATUS_NEXT nên không có danh sách thứ hai; ô rỗng tính là "same" (paste-rules.ts dòng 69 và 87; listing-paste.ts dòng 76), to === from là "same" (dòng 91), UNIT_FACTS (listing-paste.ts dòng 21-27) là danh sách cột cố định xếp vào phần "bỏ qua"; row.locked lấy từ lockedReasons trong listing-cell-edit.tsx, tệp này không nằm trong danh sách đầu vào nên không chấm.
- operational-feasibility: PASS — Việc đọc ô dán chỉ gọi hàm của edit-rules.ts: readPrice, priceAsksAgain, priceSwing, priceLocked, statusLocked, canMove, statusNeeds, priceUnchanged, priceUndoable, statusUndoable, foldWords. Ngoài ra chỉ có readStatusText tự tra chữ trạng thái; danh sách trạng thái lấy từ khoá của STATUS_NEXT, không có ngưỡng hay nấc nào viết lại. Mọi lần ghi đi qua write ở use-listing-cell-edit.tsx (dòng 125-136, door.save), cùng cửa với ô đơn; paste-preview.tsx chỉ gọi onApply(ids), và applyPaste (dòng 197-271) gọi write. Không thấy đường ghi thứ hai.
- spec-alignment: PASS — Bộ đọc ô dán không tự so số, liệt kê nấc hay đặt ngưỡng. paste-rules.ts gọi readPrice, priceAsksAgain, priceLocked (dòng 70-80), canMove, statusNeeds, statusLocked (dòng 92-95) và readStatusText (dòng 54-61, trong tệp này). Chỉ dòng 51 lấy danh sách trạng thái từ khoá của STATUS_NEXT, không viết nấc riêng; listing-paste.ts chỉ định dạng chữ «+72%». Ghi đi qua một cửa: applyPaste trong use-listing-cell-edit.tsx (dòng 197-271) gọi write() (dòng 125-136), tức door.save(), cùng đường với sửa trong ô (dòng 166). Chưa đọc kỹ toàn bộ inventory-grid.tsx, data-region.tsx, paste-preview.tsx, use-change.tsx; đây là điểm chưa kiểm chứng đầy đủ.

- eval: E3
  run_id: minted-dan-tu-excel-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  output: |
    vitest run (cùng lệnh với E2) — xanh

- eval: E4
  run_id: minted-dan-tu-excel-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  output: |
    vitest run (cùng lệnh với E2) — xanh

- eval: E4-e2e
  run_id: minted-dan-tu-excel-E4-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

- eval: E5
  run_id: minted-dan-tu-excel-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

- eval: E5b
  run_id: minted-dan-tu-excel-E5b-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  output: |
    vitest run (cùng lệnh với E2) — xanh

- eval: E6
  run_id: minted-dan-tu-excel-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  output: |
    vitest run (cùng lệnh với E2) — xanh

- eval: E6-e2e
  run_id: minted-dan-tu-excel-E6-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

- eval: E7
  run_id: minted-dan-tu-excel-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  output: |
    vitest run (cùng lệnh với E2) — xanh

- eval: E7-e2e
  run_id: minted-dan-tu-excel-E7-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

- eval: E8
  run_id: minted-dan-tu-excel-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

- eval: E9
  run_id: minted-dan-tu-excel-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T11:14:07Z
  output: |
    make check xanh — CODEOWNERS matches governance/autonomy.yaml

- eval: E9-axe
  run_id: minted-dan-tu-excel-E9-axe-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

- eval: E10
  run_id: minted-dan-tu-excel-E10-r3
  exit_code: 0
  carried_from_round: 3
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:29:13Z
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-dan-tu-excel-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T11:14:07Z
  output: |
    design-floor-s4 xanh, không mã màu thô trên tệp giao diện

- eval: E12
  run_id: minted-dan-tu-excel-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T11:14:07Z
  output: |
    156 passed (1.5m) — cùng lệnh playwright với E1

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dan-tu-excel-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-15T11:14:07Z

- cmd: make e2e
  run_id: minted-dan-tu-excel-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-15T11:14:07Z

## Known limits

## Ngoài hợp đồng

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chấm vòng 1, sửa độ lệch giá chính xác, dòng ẩn trong khối dán, dán tới trang điện thoại, xác nhận hôm nay. Returned to implementation.
Round 2: chấm vòng 2, sửa luật hoàn tác giá, giữ lúc xác nhận khi một ô của dòng còn khoá, bốn vai. Returned to implementation.
Round 3: PASS (hồ sơ bằng chứng, ghi chú rà soát, thẻ cổng); sau đó giám sát sửa dòng ngắn từ Excel để trống ô thiếu và ghim đồng hồ cho giờ xác nhận.
Round 4: PASS — chạy lại trên commit 9cb62b7; E10 mang từ round 3.
