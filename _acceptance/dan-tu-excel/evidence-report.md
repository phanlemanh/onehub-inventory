---
schema_version: 2
feature_slug: dan-tu-excel
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ea1cd541a2c104486c943310694973d7278f48c1
human_signoff:
---

# Evidence Report: dan-tu-excel

Round 2. Các eval máy đều xanh; còn một mục judgment (E2b) chờ người quyết ở Cổng 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1-ui | AC-1 | ui-check | PASS |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | judgment | PENDING-HUMAN (hội đồng đề xuất FAIL) |
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
  run_id: minted-dan-tu-excel-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    npx playwright test tests/e2e/dan-tu-excel.spec.ts tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts
    155 passed (1.2m)

- eval: E1-ui
  run_id: minted-dan-tu-excel-E1-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T10:12:04Z
  screenshot: evidence/E1-1440-sang.png
  observed: |
    All four frames opened and read. 1440 light: dialog "Dán vào 3 căn / 6 ô sẽ đổi / Sẽ đổi · 6" with 6 checked lines, each old value struck through then new: Căn 0905 Trạng thái Đang giao dịch → Đang bán; Giá chào 5,71 tỷ → 5,81 tỷ; Căn 1101 Trạng thái Đang bán → Đang giao dịch; Giá 2,71 → 2,81 tỷ; Căn 1202 Trạng thái Chưa đủ để rao → Đang bán with a "Không hoàn tác được" tag; Giá 4,32 → 4,42 tỷ. Buttons "Thôi" and "Áp 6 ô". The blurred table behind still shows the old values, with the 3 x 2 selection outlined. 1440 dark: same content and count, readable contrast, background dimmed. 1024 light and 1024 dark: same dialog and same 6 lines, narrower, nothing clipped; the table behind is blurred and still shows the old statuses (Đang giao dịch / Đang bán / Chưa đủ để rao). No frame deviates. No dropped or wrong-type cell appears in this sample because every pasted cell is valid, so the "bỏ/sai kiểu" section is correctly absent and the count 6 equals the list length. Matches Expected: every frame consistent; the table behind keeps its old values.
  network_observed: clean
  output: |
    Server on 3487 already running (shared, not stopped); GET /inventory?vai=ListAgent returned 200. Driver: Playwright chromium, 4 contexts (1440 and 1024 wide, light and dark). Preview visible, 6 lines, 0 saves before Áp, cells behind the preview unchanged.
    Frames: evidence/E1-1440-sang.png, E1-1440-toi.png, E1-1024-sang.png, E1-1024-toi.png. Network dump: evidence/E1-ui-network.txt.

- eval: E2
  run_id: minted-dan-tu-excel-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:12:04Z
  output: |
    npx vitest run src/modules/listings/paste-rules.test.ts src/modules/listings/ui/listing-paste.test.ts src/components/candidate/door-batch.test.tsx src/components/candidate/data-region-paste.test.tsx
    all files passed

- eval: E3
  run_id: minted-dan-tu-excel-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh vitest như E2; tất cả bài đã qua

- eval: E4
  run_id: minted-dan-tu-excel-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh vitest như E2; tất cả bài đã qua

- eval: E4-e2e
  run_id: minted-dan-tu-excel-E4-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E5
  run_id: minted-dan-tu-excel-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E5b
  run_id: minted-dan-tu-excel-E5b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh vitest như E2; tất cả bài đã qua

- eval: E6
  run_id: minted-dan-tu-excel-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh vitest như E2; tất cả bài đã qua

- eval: E6-e2e
  run_id: minted-dan-tu-excel-E6-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E7
  run_id: minted-dan-tu-excel-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh vitest như E2; tất cả bài đã qua

- eval: E7-e2e
  run_id: minted-dan-tu-excel-E7-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E8
  run_id: minted-dan-tu-excel-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E12
  run_id: minted-dan-tu-excel-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E9
  run_id: minted-dan-tu-excel-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T10:12:04Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E9-axe
  run_id: minted-dan-tu-excel-E9-axe-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T10:12:04Z
  output: |
    cùng lệnh playwright như E1; 155 passed (1.2m)

- eval: E10
  run_id: minted-dan-tu-excel-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:12:04Z
  output: |
    design-floor-khuon --kiem
    12 tệp giao diện ngoài bản đồ

- eval: E11
  run_id: minted-dan-tu-excel-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T10:12:04Z
  output: |
    design-floor-s4 chạy xong, không in lỗi

### Judgment

- eval: E2b
  judged_by: judge panel (3 lens, fresh context) — đề xuất, người quyết ở Cổng 2
  proposal: FAIL
  votes:
    - domain-correctness: FAIL — Đường ghi sạch: applyPaste chỉ ghi qua write() rồi door.save(), cùng cửa với sửa trong ô. Nhưng paste-rules.ts dòng 78 tự viết luật số `undoable: typeof previous === "number" && previous > 0`, edit-rules.ts không định nghĩa phép so đó; dòng 96 tự gọi tên hai trạng thái bằng tay.
    - operational-feasibility: FAIL — Đường ghi đạt (use-listing-cell-edit.tsx:125, 218). Bộ đọc không đạt: paste-rules.ts:78 tự so số, dòng 79-80 lặp ngưỡng previous>0 của priceAsksAgain; dòng 96 tự chọn nhánh lý do.
    - spec-alignment: FAIL — Đường ghi đạt, không có đường ghi thứ hai. Luật "hoàn tác được" ở paste-rules.ts dòng 78 không gọi hàm nào của edit-rules.ts; dòng 79 lặp `&& previous` và ngưỡng đã nằm trong priceAsksAgain.
  required_evidence:
    - Đưa luật "giá hoàn tác được" (paste-rules.ts dòng 78) vào edit-rules.ts thành một hàm (ví dụ priceUndoable) để paste-rules.ts chỉ gọi hàm đó.
    - Hoặc một ghi chú ở contract.md nói rõ việc kiểm "có giá cũ > 0" để quyết định hoàn tác được là phần của bộ đọc ô dán, không phải luật hàng 4.
    - Dòng 96 lấy lý do từ danh sách StatusNeed mà statusNeeds trả về thay vì phép so "Closed" viết cứng; hoặc hợp đồng ghi rõ danh sách sáu hàm chỉ là ví dụ.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dan-tu-excel-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-15T10:12:04Z

- cmd: make e2e
  run_id: minted-dan-tu-excel-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-15T10:12:04Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline không đo: evals.yaml không đổi từ lần đo baseline cuối (round 1); mọi eval ghi baseline n-a vì round này không đo.

Eval không-phân-biệt (xanh trên cả bản mới lẫn bản cũ, theo kết quả carried): E9 (make check), E10 (design-floor khuôn), E11 (design-floor s4). Cần viết lại để khẳng định hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chấm vòng 1 tìm lỗi luật giá/trạng thái và độ phủ bài kiểm thử; đã sửa (không còn gợi ý hoàn tác cho giá dán lên căn chưa có giá, gộp một lần gấp chữ và một danh sách trạng thái, siết số đo) rồi bổ sung bài kiểm thử. Returned to implementation.
Round 2: mọi eval máy xanh; còn mục judgment E2b chờ người quyết ở Cổng 2.
