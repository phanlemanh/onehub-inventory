---
schema_version: 2
feature_slug: dan-tu-excel
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 82ea4fdd4521f1b55fa1132d97935d5dfe0a24de
human_signoff: Manh Phan 2026-11-16
---

# Evidence Report: dan-tu-excel

Round 6. Nội dung thay toàn bộ round cũ; lịch sử nằm ở mục Iterations. Mọi eval gắn AC đều xanh, hai lệnh suite (`npm run build`, `make e2e`) cũng xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1-ui | AC-1 | ui-check | PASS |
| E2 | AC-2 | test | PASS (carry-forward round 4) |
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
| E10 | AC-9 | script | PASS (carry-forward round 3) |
| E11 | AC-9 | script | PASS |

## Analyst

carried tu round 1 — baseline khong do lai round nay.

Baseline không đo lại ở round này (evals.yaml không đổi từ lần đo cuối, round 1); mọi block eval ghi `baseline: n-a`.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không chứng minh tính năng; nên viết lại để khẳng định hành vi mới hoặc xác nhận là lớp chặn hồi quy có chủ ý):
- E9 (lệnh `make check`)
- E10 (lệnh `design-floor-khuon.mjs --kiem`)
- E11 (lệnh `design-floor-s4.mjs`)

## Variance

none — every multi-run eval is uniform

## Evidence

- eval: E1
  run_id: minted-dan-tu-excel-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    npx playwright test tests/e2e/dan-tu-excel.spec.ts tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts
    158 passed (1.3m)

- eval: E1-ui
  run_id: minted-dan-tu-excel-E1-ui-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T18:04:22Z
  screenshot: evidence/E1-ui-step1.png
  observed: |
    I opened the 4 preview frames (E1-1440-sang, E1-1440-toi, E1-1024-sang, E1-1024-toi; step2 is a copy of 1440-sang). Each frame shows the same thing: a modal "Dán vào 3 căn / 6 ô sẽ đổi" with "Sẽ đổi · 6" over a blurred grid. Line pairs shown: Căn 0905 Trạng thái Đang giao dịch → Đang bán and Giá chào 5,71 tỷ → 5,81 tỷ; Căn 1101 Trạng thái Đang bán → Đang giao dịch and Giá chào 2,71 tỷ → 2,81 tỷ; Căn 1202 Trạng thái Chưa đủ để rao → Đang bán with the tag "Không hoàn tác được". The sixth line (Căn 1202 Giá chào 4,32 tỷ → 4,42 tỷ) is scrolled out of view in the dialog but present in the DOM text. All checkboxes are ticked; footer has Thôi and the primary button "Áp 6 ô". Light and dark both render legibly with correct contrast, and the layout fits at 1024 (narrower dialog, no clipping). The grid behind is dimmed and blurred, with the selected 3x1 status cell block highlighted, and the DOM check confirmed the price cells still hold the old values. This matches Expected "Mọi khung khớp; bảng phía sau giữ giá trị cũ".
  network_observed: clean

- eval: E2
  run_id: minted-dan-tu-excel-E2-r4
  exit_code: 0
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T11:14:07Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-dan-tu-excel-E3-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T18:04:22Z
  output: |
    npx vitest run src/modules/listings/paste-rules.test.ts src/modules/listings/ui/listing-paste.test.ts src/components/candidate/door-batch.test.tsx src/components/candidate/data-region-paste.test.tsx

- eval: E4
  run_id: minted-dan-tu-excel-E4-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T18:04:22Z
  output: |
    cùng lệnh vitest với E3

- eval: E4-e2e
  run_id: minted-dan-tu-excel-E4-e2e-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E5
  run_id: minted-dan-tu-excel-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E5b
  run_id: minted-dan-tu-excel-E5b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T18:04:22Z
  output: |
    cùng lệnh vitest với E3

- eval: E6
  run_id: minted-dan-tu-excel-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T18:04:22Z
  output: |
    cùng lệnh vitest với E3

- eval: E6-e2e
  run_id: minted-dan-tu-excel-E6-e2e-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E7
  run_id: minted-dan-tu-excel-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel
  verified_at: 2026-11-15T18:04:22Z
  output: |
    cùng lệnh vitest với E3

- eval: E7-e2e
  run_id: minted-dan-tu-excel-E7-e2e-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E8
  run_id: minted-dan-tu-excel-E8-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E12
  run_id: minted-dan-tu-excel-E12-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E9
  run_id: minted-dan-tu-excel-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T18:04:22Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E9-axe
  run_id: minted-dan-tu-excel-E9-axe-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dan_tu_excel_e2e
  verified_at: 2026-11-15T18:04:22Z
  output: |
    158 passed (1.3m)

- eval: E10
  run_id: minted-dan-tu-excel-E10-r3
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:29:13Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-dan-tu-excel-E11-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T18:04:22Z
  output: |
    design-floor-s4.mjs --root . chạy xong, không có mã màu thô

### Judge panels (đề xuất)

- eval: E2b
  panel giu nguyen tu round 5 — inputs khong doi, khong cham lai; rationale xem round do
  proposal: PASS
  votes:
    - domain-correctness: PASS (r5)
    - operational-feasibility: PASS (r5)
    - spec-alignment: PASS (r5)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dan-tu-excel-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-15T18:04:22Z

- cmd: make e2e
  run_id: minted-dan-tu-excel-SUITE-make_e2e-r6
  exit_code: 0
  verified_at: 2026-11-15T18:04:22Z

## Known limits

## Ngoài hợp đồng

## Iterations

Round 1: baseline đo lần cuối.
Round 2: chấm lại, sửa luật hoàn tác giá và giờ xác nhận (commit 7988967).
Round 3: đạt; hồ sơ bằng chứng và thẻ cổng (commit 0641b01).
Round 4: delta — dòng Excel ngắn khớp cột theo thứ tự lưới hiển thị (commit ddef774).
Round 5: mọi eval gắn AC xanh; BLOCKED vì lệnh suite make e2e quá 30 phút chưa kết thúc, cần khai long_running rồi chờ hoặc chạy lại với thời hạn dài hơn.
Round 6: chạy lại sau khi máy ngủ làm gián đoạn round 5; mọi eval và hai lệnh suite xanh trên commit 82ea4fd; E2 và E10 mang từ round 4 và round 3.
