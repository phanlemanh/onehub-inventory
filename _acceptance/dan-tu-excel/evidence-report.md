---
schema_version: 2
feature_slug: dan-tu-excel
verdict: REJECT
failed_evals: ["E1","E4-e2e","E5","E6-e2e","E7-e2e","E8","E12","E9-axe"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9557dc0aff8dd9736f5dce058ec1877495c2d706
human_signoff:
---

# Evidence Report: dan-tu-excel

Lưu ý đọc kết quả: tám eval Playwright chạy chung một lệnh nên cùng bị ghi là rớt khi lệnh đó rớt. Trong lần chạy riêng có 154 ca xanh và đúng một ca đỏ: `tests/e2e/dan-tu-excel.spec.ts:221` ca «thoi-khong-ghi» (thuộc E5). Sau khi nhấn Esc, hộp xem trước `[data-slot="paste-preview"]` vẫn còn 1 phần tử, kỳ vọng 0. Lệnh `make e2e` (không gắn eval nào) cũng rớt đúng ca này ở khổ 1024 (1207 ca xanh, 1 ca đỏ). Chưa có bằng chứng ca nào khác trong lệnh bị đỏ; để xác nhận phải chạy lại sau khi sửa.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | FAIL |
| E1-ui | AC-1 | ui-check | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | judgment | ĐỀ XUẤT FAIL (chờ người quyết) |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4-e2e | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E5b | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6-e2e | AC-6 | test | FAIL |
| E7 | AC-7 | test | PASS |
| E7-e2e | AC-7 | test | FAIL |
| E8 | AC-8 | test | FAIL |
| E12 | AC-10 | test | FAIL |
| E9 | AC-9 | script | PASS |
| E9-axe | AC-9 | test | FAIL |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dan-tu-excel-E1-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Lệnh: npx playwright test tests/e2e/dan-tu-excel.spec.ts tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts
    1 failed: [1440] dan-tu-excel.spec.ts:221 thoi-khong-ghi
    paste-preview Expected: 0, Received: 1 (sau Esc)
    109 skipped, 154 passed (1.2m)

- eval: E4-e2e
  run_id: minted-dan-tu-excel-E4-e2e-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh Playwright như E1; ca gia-lech-lon-bo-chon-san không nằm trong danh sách ca đỏ, lệnh rớt vì ca thoi-khong-ghi.

- eval: E5
  run_id: minted-dan-tu-excel-E5-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Ca đỏ: dan-tu-excel.spec.ts:221 thoi-khong-ghi
    expect(locator).toHaveCount(0) failed, locator paste-preview, Received: 1, hết 5000ms
    Dòng 230: sau Escape bản xem trước vẫn còn

- eval: E6-e2e
  run_id: minted-dan-tu-excel-E6-e2e-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh Playwright như E1; ca hoan-tac-ca-vung và ap-hong-mot-phan không nằm trong danh sách ca đỏ, lệnh rớt vì ca thoi-khong-ghi.

- eval: E7-e2e
  run_id: minted-dan-tu-excel-E7-e2e-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh Playwright như E1; ca khong-quyen và dien-thoai-khong-dan không nằm trong danh sách ca đỏ, lệnh rớt vì ca thoi-khong-ghi.

- eval: E8
  run_id: minted-dan-tu-excel-E8-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh Playwright như E1; ca phim-trong-ban-xem-truoc không nằm trong danh sách ca đỏ, lệnh rớt vì ca thoi-khong-ghi.

- eval: E12
  run_id: minted-dan-tu-excel-E12-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh Playwright như E1; bốn ca của E12 không nằm trong danh sách ca đỏ, lệnh rớt vì ca thoi-khong-ghi.

- eval: E9-axe
  run_id: minted-dan-tu-excel-E9-axe-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh Playwright như E1; ca axe-sang-toi (sua-tren-o) báo xanh ở sáng và tối, lệnh rớt vì ca thoi-khong-ghi.

- eval: E2
  run_id: minted-dan-tu-excel-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T09:46:36Z
  output: |
    npx vitest run paste-rules.test.ts listing-paste.test.ts door-batch.test.tsx data-region-paste.test.tsx
    Toàn bộ ca xanh.

- eval: E3
  run_id: minted-dan-tu-excel-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh vitest như E2; toàn bộ ca xanh.

- eval: E4
  run_id: minted-dan-tu-excel-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh vitest như E2; toàn bộ ca xanh.

- eval: E5b
  run_id: minted-dan-tu-excel-E5b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh vitest như E2; toàn bộ ca xanh.

- eval: E6
  run_id: minted-dan-tu-excel-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh vitest như E2; toàn bộ ca xanh.

- eval: E7
  run_id: minted-dan-tu-excel-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T09:46:36Z
  output: |
    Cùng lệnh vitest như E2; toàn bộ ca xanh.

- eval: E9
  run_id: minted-dan-tu-excel-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T09:46:36Z
  output: |
    make check xanh
    CODEOWNERS matches governance/autonomy.yaml

- eval: E10
  run_id: minted-dan-tu-excel-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T09:46:36Z
  output: |
    design-floor-khuon.mjs --kiem --root .
    11 tệp giao diện ngoài bản đồ

- eval: E11
  run_id: minted-dan-tu-excel-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T09:46:36Z
  output: |
    design-floor-s4.mjs --root .
    Không có mã màu thô.

- eval: E1-ui
  run_id: minted-dan-tu-excel-E1-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: ui-check driver (Playwright script, không khai config: ref)
  verified_at: 2026-11-15T09:46:36Z
  screenshot: evidence/E1-1440-sang.png   # còn E1-1440-toi.png, E1-1024-sang.png, E1-1024-toi.png
  observed: |
    Cả bốn khung (1440 và 1024, sáng và tối) cùng hiện hộp thoại «Dán vào 3 căn», dòng «6 ô sẽ đổi», mục «Sẽ đổi · 6», các dòng «Căn · cột / cũ gạch ngang → mới», ô chọn đều đánh dấu, nút «Thôi» và «Áp 6 ô».
    Chỉ thấy 5 trong 6 dòng, dòng thứ 6 (căn 1202 Giá chào 4,32 → 4,42 tỷ) nằm dưới mép danh sách cuộn được, có trong DOM. Bảng phía sau mờ giữ giá trị cũ (0905 Đang giao dịch, 5,71 tỷ); đọc DOM xác nhận 0 lần ghi trước khi Áp.
  network_observed: no-app-traffic

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dan-tu-excel-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-15T09:46:36Z

- cmd: make e2e
  run_id: minted-dan-tu-excel-SUITE-make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-15T09:46:36Z
  note: không gắn eval nào. Rớt đúng một ca, dan-tu-excel.spec.ts:221 thoi-khong-ghi ở khổ 1024 (cùng nguyên nhân với E5). 1207 ca xanh, 1060 skipped.

### Phán đoán (judgment)

- eval: E2b
  judged_by: hội đồng đề xuất, ba lens (fresh context)
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — Đường ghi đạt, chỉ có write() qua door.save (use-listing-cell-edit.tsx dòng 124); xem trước, data-region.tsx, paste-preview.tsx, listing-paste.ts đều không ghi. Phần đọc ô dán không đạt: paste-rules.ts tự viết bộ đọc chữ trạng thái với mảng STATUSES sáu nấc (dòng 47-54), hàm fold (56-65) và readStatusText (67-75), và gọi thêm priceUnchanged, priceSwing, statusUndoable là các hàm ngoài danh sách được phép.
    - operational-feasibility: FAIL — Đường ghi sạch (use-listing-cell-edit.tsx:122-133, 217, 211; data-region.tsx:1064). Nhưng paste-rules.ts:47-75 tự viết STATUSES, fold, readStatusText; dòng 83 và 101 tự đặt luật «ô rỗng là same»; dòng 93 gọi priceSwing, priceUnchanged, statusUndoable là các hàm ngoài danh sách đã nêu.
    - spec-alignment: PASS — Trong paste-rules.ts (dòng 82-116) mọi phán đoán giá và trạng thái gọi hàm của edit-rules.ts (readPrice, priceLocked, priceAsksAgain, canMove, statusLocked, statusNeeds, priceUnchanged, priceSwing, statusUndoable). Ngưỡng 20% và bảng chuyển nấc chỉ nằm ở edit-rules.ts; mọi lần ghi đi qua write() → door.save().
  required_evidence:
    - Chỉ ra hàm đọc chữ trạng thái đã có trong tệp luật mô-đun căn (ví dụ src/modules/units/*-rules.ts) mà paste-rules.ts gọi thay cho STATUSES, fold và readStatusText tự viết (dòng 47-75); khi đó kết quả đổi.
    - Hoặc hợp đồng (contract.md, AC-2) ghi rõ cho phép readStatusText đặt trong paste-rules.ts và STATUSES lấy từ khoá STATUS_NEXT của edit-rules.ts thay vì liệt kê lại.
    - Hợp đồng ghi rõ priceUnchanged, priceSwing và statusUndoable của edit-rules.ts cũng thuộc tập hàm được gọi.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả bản hiện tại lẫn baseline, chứng minh bộ đo chứ không phải tính năng; nên viết lại để khẳng định hành vi mới hoặc xác nhận là lớp chắn hồi quy có chủ ý): E9 (make check), E10 (design-floor-khuon), E11 (design-floor-s4).

Lệnh rớt không gắn eval: `make e2e` rớt vì đúng ca thoi-khong-ghi của E5 (xem ghi chú dưới bảng và khối suite).

Baseline khong do
- npx playwright test tests/e2e/dan-tu-excel.spec.ts tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts: bo qua baseline: tep tests/e2e/dan-tu-excel.spec.ts co o cay dang kiem nhung chua co o merge-base c53b35db086534d61d7a2dc5f2b35e3237d08759 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/listings/paste-rules.test.ts src/modules/listings/ui/listing-paste.test.ts src/components/candidate/door-batch.test.tsx src/components/candidate/data-region-paste.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/listings/paste-rules.test.ts co o cay dang kiem nhung chua co o merge-base c53b35db086534d61d7a2dc5f2b35e3237d08759 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E4-e2e, E5, E6-e2e, E7-e2e, E8, E12, E9-axe failed — lệnh Playwright rớt; ca đỏ thực sự là thoi-khong-ghi (bản xem trước còn mở sau Esc). Returned to implementation.
