---
schema_version: 2
feature_slug: sua-tren-o
verdict: REJECT
failed_evals: [E10b]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8d22faa7b427aaaa70bba7825b1afc7e629e0ba9
human_signoff:
---

# Evidence Report: sua-tren-o

Round 1. Verdict REJECT: eval E10b (make check) is red. Eval E1b is rated FAIL by all three judge lenses (advisory, awaiting a human). Eval E10c is rated PASS by all three lenses (advisory).

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | judgment | FAIL (judge proposal, human_override empty) |
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
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | script | FAIL |
| E10c | AC-10 | judgment | PASS (judge proposal, human_override empty) |
| E11 | AC-2 | test | PASS |
| E12 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-tren-o-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T09:32:45Z
  output: |
    npx vitest run src/modules/listings/edit-rules.test.ts src/modules/listings/save-door.test.ts src/components/candidate/use-change.test.tsx src/components/candidate/data-region-cell-edit.test.tsx
    runs: 1, passes: 1

- eval: E4
  run_id: minted-sua-tren-o-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same vitest command as E1; runs: 1, passes: 1

- eval: E5
  run_id: minted-sua-tren-o-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same vitest command as E1; runs: 1, passes: 1

- eval: E7
  run_id: minted-sua-tren-o-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same vitest command as E1; runs: 1, passes: 1

- eval: E8
  run_id: minted-sua-tren-o-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same vitest command as E1; runs: 1, passes: 1

- eval: E2
  run_id: minted-sua-tren-o-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    npx playwright test tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts tests/e2e/ho-so-can.spec.ts
    164 passed (1.4m)

- eval: E3
  run_id: minted-sua-tren-o-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E4-e2e
  run_id: minted-sua-tren-o-E4-e2e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E5-e2e
  run_id: minted-sua-tren-o-E5-e2e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E6
  run_id: minted-sua-tren-o-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E8-e2e
  run_id: minted-sua-tren-o-E8-e2e-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E9
  run_id: minted-sua-tren-o-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E11
  run_id: minted-sua-tren-o-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T09:32:45Z
  output: |
    same playwright command as E2; 164 passed (1.4m)

- eval: E10
  run_id: minted-sua-tren-o-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.sua_tren_o_rao
  verified_at: 2026-11-13T09:32:45Z
  output: |
    npx vitest run tests/behavior-guard.test.ts: passed

- eval: E10b
  run_id: minted-sua-tren-o-E10b-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-13T09:32:45Z
  output: |
    make check failed in the test step.
    + proof-gate: 3 lỗi — mẫu tệp chứng minh: tools/proof_gate/khuon-chung-minh.md
    tools/proof_gate/proof-gate.test.ts:792 "lưới xanh trên chính kho": expected stderr to be empty
    tools/proof_gate/proof-gate.test.ts:809 "thêm vòng implemented khai Bảng hàng mà thiếu chứng minh thì đỏ": run on a copy of the repo returned status 1, expected 0
    Test Files  3 failed | 74 passed (77)
    Tests  7 failed | 1445 passed (1452)

- eval: E12
  run_id: minted-sua-tren-o-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T09:32:45Z
  output: |
    11 tệp giao diện ngoài bản đồ
    no «lệch:» line for the luoi group

- eval: E2-ui
  run_id: minted-sua-tren-o-E2-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T09:32:45Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    I opened these frame files: E2-1440-sang (step1), E2-1440-sang-sau-enter, E2-1440-toi, E2-1440-toi-sau-enter, E2-1024-sang, E2-1024-toi-sau-enter, E2-1024-toi-sau-doi-gia, E2-1440-sang-sau-doi-gia. I did not open the other frame files; the claims about them rest on the script's measured values: E2-1024-toi, E2-1024-sang-sau-enter, E2-1440-toi-sau-doi-gia, E2-1024-sang-sau-doi-gia and the extra 1101 frames.
    - 1440 light, before Enter: the Giá chào cell of 1303 shows an input with "2,8 tỷ" and a blue ring, in place of the cell. Right under it is a panel with "Hiểu là: 2.800.000.000 ₫ (2,8 tỷ)" and "Enter ghi · Esc huỷ · Tính là vừa xác nhận với chủ nhà." The cell is visible and not covered. The panel overlaps the cells of the next row and a half. In the 1440 light extra 1101 frame, the same layout.
    - 1440 light, after Enter (1101, extra frame): the cell shows 2,8 tỷ, Xác nhận lúc is 16:34 13/11/2026, a toast "Đã đổi Giá chào căn 1101: 2,8 tỷ." with Hoàn tác, and no Lưu button.
    - 1440 dark, before Enter: same layout in dark colours, with "Hiểu là" panel under the input and the cell visible. After Enter: panel "Giá đổi -44% — đổi chứ? 5,03 tỷ → 2,8 tỷ" with Thôi and Đổi giá, and the input still in place. Dark colours are readable.
    - 1024 light, before Enter: row 0801 sits at the bottom of the grid. The input (2,8 tỷ) is right-aligned to the cell and sits over the Dự án/Trạng thái columns, partly covering the Đang bán badge of the same row. The edited cell (4,07 tỷ) stays visible at the right with a focus ring. The "Hiểu là" panel is under the row and overflows below the grid bottom, still readable. This is the only frame where the input is not above the edited cell; the edited cell itself is not covered.
    - 1024 dark, after Enter: ask panel "Giá đổi -49% — đổi chứ?" with "5,52 tỷ → 2,8 tỷ", Thôi and Đổi giá. After "Đổi giá": the cell shows 2,8 tỷ and the toast "Đã đổi Giá chào căn 1606: 2,8 tỷ." with Hoàn tác. 1440 light, after Đổi giá: the cell shows 2,8 tỷ, Xác nhận lúc 16:35 13/11/2026, toast with Hoàn tác.
    Against Expected "Mọi khung khớp; khung không che ô đang sửa": the edited cell is not covered in any of the 4 combos, the Hiểu là sentence reads the exact figure each time, and the Hoàn tác toast appears. Two deviations, both noted: (1) at 1024 the input does not sit over the cell but over the neighbouring column; (2) the first Enter on a unit whose price changes by more than 20% shows the ask, and the toast comes only after Đổi giá. Result: pass with these notes.
  network_observed: no-app-traffic

- eval: E7-ui
  run_id: minted-sua-tren-o-E7-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T09:32:45Z
  screenshot: evidence/E7-1440-sang.png
  observed: |
    I opened the frames with Read; I did not open every file.
    - E7-1440-sang.png (1.5s after the failed undo, light): the Giá chào cell of căn 1101 shows 2,8 tỷ with a focus ring, and its Xác nhận lúc cell changed to 17:04 13/11/2026. The bottom-right toast reads "Chưa hoàn tác được vì mất kết nối mạng. Căn 1101 vẫn là 2,8 tỷ; có mạng lại thì bấm «Thử lại»." and has a black Thử lại button. The page also shows an orange "Mất kết nối mạng" banner.
    - E7-1440-sang-sau-10s.png (light, after 10s): identical to the first frame, so the toast is still there.
    - E7-1440-toi.png (1440 dark): the same layout on a dark theme with good contrast. The cell for căn 0602 shows 2,8 tỷ, and the toast says "Căn 0602 vẫn là 2,8 tỷ" with a Thử lại button.
    - E7-1024-sang.png (1024 light): the toast "Căn 0701 vẫn là 2,8 tỷ" with a Thử lại button, bottom right. The Giá chào column is partly clipped by the narrow width and the 0701 row is off-screen.
    - E7-1024-toi-sau-10s.png (1024 dark, after 10s): the toast "Căn 0901 vẫn là 2,8 tỷ" with a Thử lại button is still present. The 0901 cell shows 2,8 and has a focus ring.
    - The other eight frames were not opened; the toast text for those cases comes from the script's DOM readout.
    This matches Expected: the toast stays, names the unit and the price it carries, has Thử lại, and the cell matches the message.
  network_observed: no-app-traffic

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-sua-tren-o-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T09:32:45Z

- cmd: make e2e
  run_id: minted-sua-tren-o-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-13T09:32:45Z

### Lệnh fail không gắn eval

Không có lệnh fail nào không gắn eval. Lệnh fail duy nhất, `make check`, gắn với eval E10b (kết thúc mã 2).

### Judge (đề xuất, human_override để trống)

- eval: E1b
  proposal: FAIL
  votes:
  - domain-correctness: FAIL — edit-rules.ts chứa đủ luật đọc giá, ngưỡng 20% (PRICE_SWING_ASK, priceAsksAgain), bảng STATUS_NEXT và điều kiện từng nấc (statusNeeds), và index.ts xuất chúng bằng `export *`. Nhưng listing-cell-edit.tsx vẫn tự viết luật ở dòng 86 (`read.value === previous`, so số để bỏ qua khi giá không đổi, không hỏi lại, không lưu), dù đầu tệp (dòng 6) khẳng định "nothing here compares numbers". Ở dòng 288-290 và 316 giao diện còn tự rẽ nhánh `to === "Closed"` / `"Withdrawn"` để biết nấc nào cần ô nào, thay vì chỉ dựa vào kết quả statusNeeds. inventory-grid.tsx, cell-editor.tsx và data-region.tsx không tự viết luật nào về giá hay trạng thái.
  - operational-feasibility: FAIL — Phần lớn luật nằm trong edit-rules.ts và xuất qua index.ts (export *), inventory-grid.tsx không tự viết luật. Nhưng listing-cell-edit.tsx vẫn tự viết luật: dòng 86 so số (read.value === previous), và các nhánh to === "Closed" (dòng 288-290, 316, 338) tự quyết nấc nào cần trường nào, trái với chú thích đầu tệp nói không so số.
  - spec-alignment: FAIL — Luật đọc giá, ngưỡng 20%, bảng STATUS_NEXT và statusNeeds nằm trọn trong edit-rules.ts và xuất qua index.ts (export *), inventory-grid.tsx không có luật nào. Nhưng listing-cell-edit.tsx dòng 86 (`read.value === previous`) tự so số, và dòng 288-290, 316 tự gắn nấc Closed/Withdrawn với đầu vào của nó, lặp lại điều statusNeeds đã biết. Dòng 370-375 cũng tự suy ra "giá khoá thì trạng thái khoá" mà không hỏi statusLocked.
  required_evidence:
    - Một hàm thuần trong src/modules/listings/edit-rules.ts (ví dụ priceUnchanged hoặc một kết quả gộp từ priceAsksAgain) mà dòng 86 của ui/listing-cell-edit.tsx gọi thay cho `read.value === previous`; có mục này thì phần so số đổi sang PASS.
    - Hoặc một dòng quyết định ghi trong wiki/ hay design/ rằng việc bỏ qua khi giá không đổi và việc chọn ô nhập theo nấc (Closed/Withdrawn) là hành vi giao diện, không phải luật nghiệp vụ, kèm chữ ký của chủ kho; khi đó câu hỏi AC-1 phải được sửa lại cho khớp.
    - listing-cell-edit.tsx dòng 288-290, 316, 338 lấy việc chọn trường theo nấc từ edit-rules.ts; lockedReasons (dòng 370-375) lấy khoá ô trạng thái từ statusLocked(status); WITHDRAWN_REASON_ORDER suy ra từ WITHDRAWN_REASONS của edit-rules.ts.
  human_override:  # chi nguoi ghi

- eval: E10c
  proposal: PASS
  votes:
  - domain-correctness: PASS — decisions.jsonl không có dòng stage gate1 trả lời Hỏi-2, nên theo khuyến nghị: ba lý do (Chủ bán nơi khác, Chủ đổi ý, Mất liên lạc), không có «Khác». labels.yaml có đủ bốn nhãn: Lý do ngừng (11 ký tự), Chủ bán nơi khác (16; biến thể thuê «Cho thuê nơi khác» 17), Chủ đổi ý, Mất liên lạc, đều không quá 17. glossary.md ghi WithdrawnReason là «Riêng của ta; RESO DD 2.1 không có trường này».
  - operational-feasibility: PASS — Không có dòng stage gate1 nào trả lời Hỏi-2 (các dòng gate1 chỉ nói Hỏi-4), nên theo khuyến nghị Hỏi-2 là ba lý do «Chủ bán nơi khác», «Chủ đổi ý», «Mất liên lạc». labels.yaml có đủ 4 nhãn: Lý do ngừng (11 ký tự), Chủ bán nơi khác (16; biến thể thuê «Cho thuê nơi khác» đúng 17), Chủ đổi ý (9), Mất liên lạc (11), nên không nhãn nào vượt 17. glossary.md có dòng `WithdrawnReason` ghi «Riêng của ta; RESO DD 2.1 không có trường này».
  - spec-alignment: PASS — decisions.jsonl không có dòng stage gate1 trả lời Hỏi-2 (chỉ có dòng Hỏi-4), nên theo khuyến nghị của d-13: ba lý do, không có «Khác». labels.yaml có đủ 4 nhãn: Lý do ngừng (11 ký tự), Chủ bán nơi khác (16; biến thể cho thuê «Cho thuê nơi khác» 16), Chủ đổi ý (9), Mất liên lạc (12), đều không quá 17 ký tự. glossary.md có dòng `WithdrawnReason` ghi «Riêng của ta; RESO DD 2.1 không có trường này», và nêu đủ ba lý do.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (pass trên cả HEAD lẫn baseline, chứng minh harness chứ không phải feature; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E10 (npx vitest run tests/behavior-guard.test.ts): green on both sides.
- E12 (design-floor-khuon.mjs --kiem): green on both sides.

Baseline khong do:
- npx vitest run src/modules/listings/edit-rules.test.ts src/modules/listings/save-door.test.ts src/components/candidate/use-change.test.tsx src/components/candidate/data-region-cell-edit.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/listings/edit-rules.test.ts co o cay dang kiem nhung chua co o merge-base 5d40a3cb46fab43df4c1e67e1c3ba0b669a59e1d — eval moi, chay tren code cu khong phan biet gi
- npx playwright test tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts tests/e2e/ho-so-can.spec.ts: bo qua baseline: tep tests/e2e/sua-tren-o.spec.ts co o cay dang kiem nhung chua co o merge-base 5d40a3cb46fab43df4c1e67e1c3ba0b669a59e1d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10b failed — make check is red because the proof gate reports 3 errors for sua-tren-o (candidate group and screenshot for data-grid-editing-6 missing in chung-minh-man.md; no `ho_so: sua-tren-o` ledger lines in design/so-khoi.yaml for data-grid-editing-6 and data-grid-editing-2). Returned to implementation.
