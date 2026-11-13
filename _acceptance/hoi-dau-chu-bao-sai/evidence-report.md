---
schema_version: 2
feature_slug: hoi-dau-chu-bao-sai
verdict: REJECT
failed_evals: ["E2","E3","E4","E5","E6","E7","E8b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f71ca93996c24e3fbe334e97ca2a8c311002ebcb
human_signoff:
---

# Evidence Report: hoi-dau-chu-bao-sai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | test | FAIL |
| E2b | AC-2 | script | PASS |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E5b | AC-5 | script | PASS |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | test | FAIL |
| E9 | AC-9 | script | PASS |
| E9b | AC-9 | ui-check | PASS |
| E9c | AC-9 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-10 | script | PASS |

Lệnh fail không gắn riêng eval nào: `make test` bao các eval E2, E3, E4, E5, E6, E7, E8b và kết thúc với mã lỗi. Trong lần chạy này chỉ một bài thử tại tests/grid-sheet.test.tsx (ca «Toà «khong-co»» ) báo quá 5000ms; 76 tệp còn lại và 1421 bài thử khác qua. Cả bảy eval trên cùng một lệnh nên cùng bị tính là không đạt.

## Evidence

- eval: E1
  run_id: minted-hoi-dau-chu-bao-sai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  output: |
    DB_LANE=v DB_PORT=5570 npx playwright test -c playwright.db.config.ts tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts
    21 passed (1.8m)

- eval: E2
  run_id: minted-hoi-dau-chu-bao-sai-E2-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run)
    FAIL tests/grid-sheet.test.tsx > no match keeps the toolbar > Toà «khong-co»
    Test timed out in 5000ms.
    Test Files  1 failed | 76 passed (77)
    Tests  1 failed | 1421 passed (1422)

- eval: E2b
  run_id: minted-hoi-dau-chu-bao-sai-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  output: |
    21 passed (1.8m)

- eval: E3
  run_id: minted-hoi-dau-chu-bao-sai-E3-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run), cùng lần chạy với E2
    Tests  1 failed | 1421 passed (1422)

- eval: E4
  run_id: minted-hoi-dau-chu-bao-sai-E4-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run), cùng lần chạy với E2
    Tests  1 failed | 1421 passed (1422)

- eval: E5
  run_id: minted-hoi-dau-chu-bao-sai-E5-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run), cùng lần chạy với E2
    Tests  1 failed | 1421 passed (1422)

- eval: E5b
  run_id: minted-hoi-dau-chu-bao-sai-E5b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  output: |
    21 passed (1.8m)

- eval: E6
  run_id: minted-hoi-dau-chu-bao-sai-E6-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run), cùng lần chạy với E2
    Tests  1 failed | 1421 passed (1422)

- eval: E7
  run_id: minted-hoi-dau-chu-bao-sai-E7-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run), cùng lần chạy với E2
    Tests  1 failed | 1421 passed (1422)

- eval: E8
  run_id: minted-hoi-dau-chu-bao-sai-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  output: |
    21 passed (1.8m)

- eval: E8b
  run_id: minted-hoi-dau-chu-bao-sai-E8b-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make test (vitest run), cùng lần chạy với E2
    Tests  1 failed | 1421 passed (1422)

- eval: E9
  run_id: minted-hoi-dau-chu-bao-sai-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  output: |
    21 passed (1.8m)

- eval: E9b
  run_id: minted-hoi-dau-chu-bao-sai-E9b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T11:29:56Z
  screenshot: evidence/E9b-hoi-1440-light.png
  observed: |
    hoi-1440-light, hoi-1024-dark, hoi-360-dark: the record panel has a foot bar pinned to its bottom with a button 'Hỏi đầu chủ · [Tên] 03'; the body above has the 'Báo sai thông tin' button and no text overlaps. dau-ho-so-360-light: the head is on two lines, name '1603 · S1.01' on one and the buttons (link, Trước, Sau, Đóng) on the next. chua-ai-giu-1440-light and chua-ai-giu-360-light: the foot bar button is greyed out and reads 'Căn chưa có đầu chủ giữ'. bao-sai-1440-light and bao-sai-360-dark: report dialog with 'Thuộc tính sai' = Căn, 'Đang hiện: 1101', 'Giá trị đúng' = '72 m²', and buttons 'Chép và mở bảng chia sẻ' and 'Thôi'. hoi-loi-360-light: red message 'Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.' with a text box showing the whole message including the link, no cut-off. hoi-loi-1440-dark: same message and full text box in the foot area. bao-sai-loi-360-light and bao-sai-loi-1440-dark: the report dialog shows the failure message and a read-only box holding the full text (title, Toà, Dự án, Thuộc tính, Đang hiện, Đúng là), nothing cut. No frame differs from the expected. Note: 'Hỏi đầu chủ · [Tên] 03' (22 chars) and 'Chép và mở bảng chia sẻ' (23) are over 17, but the first has the person name as data and the second is the dialog's submit button; the contract limits the two main buttons, and chung-minh-man.md already records the 21-character case as a known item. I did not treat this as a failure. Chỉ 12 trong 35 khung được mở bằng Read; 23 khung còn lại dựa vào các assert đã qua. Tính chọn-bôi được của ô chỉ đọc không thấy được trên điểm ảnh nên không kiểm bằng ảnh.
  network_observed: n-a (driver)

- eval: E10
  run_id: minted-hoi-dau-chu-bao-sai-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T11:29:56Z
  output: |
    design-floor-s4.mjs --root .
    không có mã màu thô

- eval: E11
  run_id: minted-hoi-dau-chu-bao-sai-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T11:29:56Z
  output: |
    design-floor-khuon.mjs --kiem --root .
    8 tệp giao diện ngoài bản đồ

- eval: E12
  run_id: minted-hoi-dau-chu-bao-sai-E12-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:29:56Z
  output: |
    make e2e
    890 passed (8.2m)

- eval: E9c
  judged_by: judge panel (fresh context, 3 lens)
  verdict: PASS (đề xuất)
  rationale: Ba lens đều đọc labels.yaml, design.md, contract.md và thấy AskListAgent «Hỏi đầu chủ» và ReportUnitError «Báo sai thông tin» (17 ký tự) khớp chữ trong thiết kế, cùng cờ own: true.
  panel:
    - domain-correctness: PASS — labels.yaml có AskListAgent («Hỏi đầu chủ», 11 ký tự) và ReportUnitError («Báo sai thông tin», đúng 17 ký tự), cả hai kind action và own true; chữ khớp design.md và AC-9; hai tên không phải trường hay tên RESO.
    - operational-feasibility: PASS — hai nhãn khớp chữ nút trong design.md và contract.md; 17 và 11 ký tự; danh sách RESO không nằm trong input nên chỉ kết luận dựa trên các file được giao.
    - spec-alignment: PASS — nhãn khớp design.md và contract.md (AC-6, AC-9); hai tên ghép riêng của kho, chỉ kiểm được qua tên và cờ own vì không có từ điển RESO trong các file được giao.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-13T11:29:56Z

- cmd: npm run build
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T11:29:56Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên code cũ lẫn code mới): E10 và E11. Cả hai là cổng thiết kế dùng như lưới hồi quy có chủ ý, không chứng minh hành vi mới.

Baseline không đo
- DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts: bo qua baseline: tep tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts co o cay dang kiem nhung chua co o merge-base dcf39ffb28f1957965010d18cf636b9879096332 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần)

## Iterations

Round 1: E2, E3, E4, E5, E6, E7, E8b không đạt — cùng một lệnh `make test` dừng ở một bài thử quá thời gian 5000ms trong tests/grid-sheet.test.tsx (ca «Toà «khong-co»»). Quay lại phần thực hiện.
