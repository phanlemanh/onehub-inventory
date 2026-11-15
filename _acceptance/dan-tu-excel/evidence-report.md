---
schema_version: 2
feature_slug: dan-tu-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7988967d8dd9cae2c4052b9727edd77dc236e549
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
| E12 | AC-10 | test | PASS |
| E9 | AC-9 | script | PASS |
| E9-axe | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dan-tu-excel-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    npx playwright test tests/e2e/dan-tu-excel.spec.ts tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts
    155 passed (1.1m)

- eval: E1-ui
  run_id: minted-dan-tu-excel-E1-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-15T10:29:13Z
  screenshot: evidence/E1-1440-sang.png
  observed: |
    I opened all four frames with Read. E1-1440-sang: a light dialog "Dán vào 3 căn / 6 ô sẽ đổi / Sẽ đổi · 6" over a blurred grid. It lists 6 lines with the old value struck through and the new value after an arrow: Căn 0905 Trạng thái Đang giao dịch → Đang bán and Giá chào 5,71 tỷ → 5,81 tỷ; Căn 1101 Đang bán → Đang giao dịch and 2,71 tỷ → 2,81 tỷ; Căn 1202 Chưa đủ để rao → Đang bán, with a "Không hoàn tác được" tag, and 4,32 tỷ → 4,42 tỷ. The "Thôi" and "Áp 6 ô" buttons are visible. The count of 6 matches the 6 lines. In the grid behind (blurred), the selected cells still show the old prices. E1-1440-toi: the same content in dark mode with readable contrast, checkboxes and primary button legible. E1-1024-sang: the same 6 lines and the same count, with the dialog narrower and nothing clipped. E1-1024-toi: the same in dark. No line is dropped, wrapped badly or cut off at any size. Everything matches the Expected: all frames agree with each other, and the grid behind keeps the old values. This sample has no skipped or invalid-type cells, so the reason lines for rejected cells were not exercised here.
  network_observed: clean
  output: |
    GET /inventory?vai=ListAgent returned 200 on the shared server. At 1440 and 1024, light and dark: the 3x2 block was pasted and the preview showed "Dán vào 3 căn", "6 ô sẽ đổi", 6 change lines and "Áp 6 ô". Cells behind the dialog kept the old values. Frames: E1-1440-sang.png, E1-1440-toi.png, E1-1024-sang.png, E1-1024-toi.png, E1-ui-step1.png, E1-ui-step2.png. Raw network dump in E1-ui-network.txt.

- eval: E2
  run_id: minted-dan-tu-excel-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:29:13Z
  output: |
    npx vitest run src/modules/listings/paste-rules.test.ts src/modules/listings/ui/listing-paste.test.ts src/components/candidate/door-batch.test.tsx src/components/candidate/data-region-paste.test.tsx
    all test files passed

- eval: E3
  run_id: minted-dan-tu-excel-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same vitest command as E2, all test files passed

- eval: E4
  run_id: minted-dan-tu-excel-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same vitest command as E2, all test files passed

- eval: E4-e2e
  run_id: minted-dan-tu-excel-E4-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E5
  run_id: minted-dan-tu-excel-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E5b
  run_id: minted-dan-tu-excel-E5b-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same vitest command as E2, all test files passed

- eval: E6
  run_id: minted-dan-tu-excel-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same vitest command as E2, all test files passed

- eval: E6-e2e
  run_id: minted-dan-tu-excel-E6-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E7
  run_id: minted-dan-tu-excel-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same vitest command as E2, all test files passed

- eval: E7-e2e
  run_id: minted-dan-tu-excel-E7-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E8
  run_id: minted-dan-tu-excel-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E12
  run_id: minted-dan-tu-excel-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E9
  run_id: minted-dan-tu-excel-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T10:29:13Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E9-axe
  run_id: minted-dan-tu-excel-E9-axe-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:29:13Z
  output: |
    same playwright command as E1, 155 passed (1.1m)

- eval: E10
  run_id: minted-dan-tu-excel-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:29:13Z
  output: |
    design-floor-khuon --kiem
    13 tệp giao diện ngoài bản đồ

- eval: E11
  run_id: minted-dan-tu-excel-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T10:29:13Z
  output: |
    design-floor-s4 --root . finished with no finding

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dan-tu-excel-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-15T10:29:13Z

- cmd: make e2e
  run_id: minted-dan-tu-excel-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-15T10:29:13Z

### Judgment

- eval: E2b
  judged_by: judge panel (3 lenses, fresh context)
  proposal: PASS
  votes:
    - domain-correctness: UNCERTAIN — Phần giá và đường ghi đạt: paste-rules.ts chỉ gọi hàm của edit-rules.ts (readPrice, priceAsksAgain, priceLocked, canMove, statusNeeds, statusLocked, cộng thêm priceSwing, priceUnchanged, priceUndoable, statusUndoable, STATUS_NEXT, foldWords), không có ngưỡng hay phép so số riêng. Mọi ghi đều qua `write` ở use-listing-cell-edit.tsx dòng 125-136, tức `door.save`, kể cả hoàn tác, và không có đường thứ hai. Riêng hàm đọc chữ trạng thái thì paste-rules.ts dòng 54-61 tự định nghĩa `readStatusText` (foldWords cộng statusLabel từ lib/format) chứ không gọi hàm của tệp luật mô-đun căn. Tệp luật đó không nằm trong danh sách Input nên không biết có hàm sẵn để gọi hay không.
    - operational-feasibility: PASS — Trong paste-rules.ts, readPastePrice và readPasteStatus (dòng 68–106) chỉ nối các hàm của edit-rules (readPrice, priceUnchanged, priceLocked, priceAsksAgain, priceSwing, priceUndoable, canMove, statusLocked, statusNeeds, statusUndoable, foldWords). Danh sách nấc trạng thái lấy từ Object.keys(STATUS_NEXT) (dòng 51), không có số so, ngưỡng hay bậc tự đặt. listing-paste.ts chỉ gọi hai hàm đọc này cùng readStatusText và chỉ định dạng hiển thị (swingMark, formatMoney). Mọi lần ghi đi qua useListingCellEdit.applyPaste → write → door.save (use-listing-cell-edit.tsx dòng 127, 234), cùng cửa với sửa trong ô, hoàn tác cũng qua cửa đó. save-door.applyChange kiểm lại luật bằng hàm của edit-rules, và không thấy fetch hay đường ghi thứ hai nào trong data-region, paste-preview, use-change.
    - spec-alignment: PASS — `listing-paste.ts` và `paste-rules.ts` không tự so số, liệt kê nấc hay đặt ngưỡng. Mọi luật giá và trạng thái đều gọi từ `edit-rules.ts`, còn `readStatusText` lấy danh sách nấc từ `Object.keys(STATUS_NEXT)`. Mọi lần ghi từ ô dán, kể cả hoàn tác, đều đi qua `write()` → `door.save()` (`use-listing-cell-edit.tsx:125-127`, `:223`, `:234`), cùng cửa với ô đơn, không có đường ghi thứ hai. Hai điều không vi phạm nhưng người nên xem: `paste-rules.ts` gọi thêm vài hàm của `edit-rules.ts` ngoài sáu hàm đề bài nêu, và cờ `cell.open`/`row.locked` do lưới cấp (`lockedReasons`) nằm ngoài danh sách tệp nên không kiểm được.
  required_evidence:
    - Tệp luật của mô-đun căn (unit), ví dụ src/modules/units/*-rules.ts hoặc tệp tương đương mà architecture/modules.yaml chỉ ra. Nếu tệp đó đã có hàm đọc chữ trạng thái từ chữ dán, thì readStatusText ở paste-rules.ts dòng 54-61 là luật viết trùng và kết luận đổi thành FAIL.
    - Nếu tệp luật mô-đun căn không có hàm đọc chữ trạng thái: một câu của hợp đồng hoặc contract.md nói readStatusText của paste-rules.ts (dòng 54-61) là chỗ duy nhất được đọc chữ trạng thái. Khi đó kết luận đổi thành PASS.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay (evals.yaml khong doi tu lan baseline cuoi). Mọi eval ghi baseline: n-a vì round này không đo.

Eval không phân biệt (xanh trên cả bản mới lẫn bản cũ, chứng minh harness chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make check — E9
- design-floor-khuon --kiem — E10
- design-floor-s4 — E11

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chấm lần 1, sửa theo kết quả (không hoàn tác giá dán lên căn chưa có giá, một chỗ gấp chữ và một danh sách trạng thái, siết phép đo). Returned to implementation.
Round 2: chấm lần 2, sửa luật hoàn tác giá trong luật hàng 4, giữ mốc xác nhận khi còn ô của hàng giữ, bốn vai. Returned to implementation.
Round 3: mọi eval máy xanh trên commit 7988967; E2b đề xuất PASS, còn một phiếu chưa chắc ở lăng kính domain-correctness chờ người ở Cổng 2.
