---
schema_version: 2
feature_slug: hoi-dau-chu-bao-sai
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 0e18f9dd8ced5efe35e021cd104fb307241609ea
human_signoff:
---

# Evidence Report: hoi-dau-chu-bao-sai

Vòng 2. Verdict REJECT vì một lệnh suite (`make e2e`) đỏ; lệnh này không gắn eval nào nên `failed_evals` để trống. Ca đỏ nằm ở tệp `tests/e2e/loi-vao-ho-so.spec.ts` (hộp ⌘K trên thanh đầu trang, ở khổ 1440), không phải tệp của hàng này. Mọi eval của hàng này chạy vòng 2 hoặc mang từ vòng 1 đều xanh.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carry-forward từ round 1) |
| E2 | AC-2 | test | PASS |
| E2b | AC-2 | script | PASS (carry-forward từ round 1) |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5b | AC-5 | script | PASS (carry-forward từ round 1) |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS (carry-forward từ round 1) |
| E9b | AC-9 | ui-check | PASS (carry-forward từ round 1) |
| E9c | AC-9 | judgment | judge đề xuất PASS, chờ người chốt |
| E10 | AC-9 | script | PASS (carry-forward từ round 1) |
| E11 | AC-9 | script | PASS (carry-forward từ round 1) |
| E12 | AC-10 | script | PASS (carry-forward từ round 1) |

## Evidence

### Eval chạy vòng 2

- eval: E2
  run_id: minted-hoi-dau-chu-bao-sai-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E3
  run_id: minted-hoi-dau-chu-bao-sai-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E4
  run_id: minted-hoi-dau-chu-bao-sai-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E5
  run_id: minted-hoi-dau-chu-bao-sai-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E6
  run_id: minted-hoi-dau-chu-bao-sai-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E7
  run_id: minted-hoi-dau-chu-bao-sai-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E8b
  run_id: minted-hoi-dau-chu-bao-sai-E8b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    make test chạy một lần, phủ E2, E3, E4, E5, E6, E7, E8b; kết thúc xanh.

- eval: E8
  run_id: minted-hoi-dau-chu-bao-sai-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:43:59Z
  runs: 1
  output: |
    21 passed (58.4s)

### Eval mang từ vòng 1 (carry-forward)

- eval: E1
  run_id: minted-hoi-dau-chu-bao-sai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E2b
  run_id: minted-hoi-dau-chu-bao-sai-E2b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E5b
  run_id: minted-hoi-dau-chu-bao-sai-E5b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E9
  run_id: minted-hoi-dau-chu-bao-sai-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E9b
  run_id: minted-hoi-dau-chu-bao-sai-E9b-r1
  exit_code: 0
  baseline: n-a
  verifier: ui-check
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval
  screenshot: evidence/E9b-hoi-1440-light.png
  observed: |
    hoi-1440-light, hoi-1024-dark, hoi-360-dark: the record panel has a foot bar pinned to its bottom with a button 'Hỏi đầu chủ · [Tên] 03'; the body above has the 'Báo sai thông tin' button and no text overlaps. dau-ho-so-360-light: the head is on two lines, name '1603 · S1.01' on one and the buttons (link, Trước, Sau, Đóng) on the next. chua-ai-giu-1440-light and chua-ai-giu-360-light: the foot bar button is greyed out and reads 'Căn chưa có đầu chủ giữ'. bao-sai-1440-light and bao-sai-360-dark: report dialog with 'Thuộc tính sai' = Căn, 'Đang hiện: 1101', 'Giá trị đúng' = '72 m²', and buttons 'Chép và mở bảng chia sẻ' and 'Thôi'. hoi-loi-360-light: red message 'Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.' with a text box showing the whole message including the link, no cut-off. hoi-loi-1440-dark: same message and full text box in the foot area. bao-sai-loi-360-light and bao-sai-loi-1440-dark: the report dialog shows the failure message and a read-only box holding the full text (title, Toà, Dự án, Thuộc tính, Đang hiện, Đúng là), nothing cut. No frame differs from the expected. Note: 'Hỏi đầu chủ · [Tên] 03' (22 chars) and 'Chép và mở bảng chia sẻ' (23) are over 17, but the first has the person name as data and the second is the dialog's submit button; the contract limits the two main buttons, and chung-minh-man.md already records the 21-character case as a known item. I did not treat this as a failure. Chỉ 12 trong 35 khung được mở bằng Read; 23 khung còn lại dựa vào các assert đã qua. Tính chọn-bôi được của ô chỉ đọc không thấy được trên điểm ảnh nên không kiểm bằng ảnh.
  network_observed: n-a (driver)

- eval: E10
  run_id: minted-hoi-dau-chu-bao-sai-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E11
  run_id: minted-hoi-dau-chu-bao-sai-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

- eval: E12
  run_id: minted-hoi-dau-chu-bao-sai-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:29:56Z
  carried_from_round: 1
  note: carry-forward từ round 1 — delta không chạm paths của eval

### Judgment (đề xuất, chưa có người chốt)

- eval: E9c
  judged_by: hội đồng 3 judge (fresh context)
  proposal: PASS
  panel: domain-correctness, operational-feasibility, spec-alignment
  votes:
    - domain-correctness: PASS — AskListAgent có pref «Hỏi đầu chủ» (11 ký tự), ReportUnitError có pref «Báo sai thông tin» (17 ký tự), cả hai kind action, own true; chữ khớp design.md và AC-1, AC-6. Hai tên không phải tên trường RESO nào judge biết; judge không đối chiếu được RESO DD 2.1 vì nằm ngoài danh sách input.
    - operational-feasibility: PASS — chữ hai nút khớp design.md và contract.md (đã duyệt, T3, trần 17 ở AC-9); hai tên không phải tên RESO nên không dùng lại nghĩa nào.
    - spec-alignment: PASS — chữ khớp design.md và trần 17 ký tự của AC-9; own true nghĩa là khái niệm riêng của kho.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-13T11:43:59Z

- cmd: npm run build
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T11:43:59Z

- cmd: make e2e
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_e2e-r2
  exit_code: 2
  verified_at: 2026-11-13T11:43:59Z
  note: lệnh không gắn eval nào. 889 ca qua, 634 bỏ qua, 1 ca đỏ.
  failing_case: tests/e2e/loi-vao-ho-so.spec.ts:334 (khổ 1440), E5 · the top-bar ⌘K box, "Ctrl+K, Meta+K and / open the box; / in a field stays in the field". Phép thử mong đợi ô nhập của bảng nhảy-tới-căn (`unit-jump-palette`) nhận focus sau khi bấm Control+K; sau 5000 ms không tìm thấy phần tử. Tệp thuộc hàng loi-vao-ho-so, không phải hàng này.
  output: |
    1 failed
    [1440] › tests/e2e/loi-vao-ho-so.spec.ts:334:3 › E5 · the top-bar ⌘K box
    634 skipped
    889 passed (6.9m)

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E10 (lệnh `design-floor-s4.mjs`): quét mã màu thô, kết quả không phụ thuộc hành vi mới của hàng này.
- E11 (lệnh `design-floor-khuon.mjs --kiem`): chấm khuôn nhóm luoi, kết quả không phụ thuộc hành vi mới của hàng này.

Baseline không đo vòng này: mọi eval ghi n-a vì evals.yaml không đổi từ lần baseline cuối ở round 1.

## Variance

none — mọi eval chạy một lần, không có eval nào ngẫu nhiên và không có eval nào lúc xanh lúc đỏ.

## Iterations

Round 1: S4 vòng 1 bị REJECT vì một ca lưới (grid) quá giờ, không liên quan hàng này (theo commit 0e18f9d).
Round 2: eval của hàng này xanh (E2 tới E8b chạy lại, E1, E2b, E5b, E9, E9b, E10, E11, E12 mang từ round 1); make check và npm run build xanh; make e2e đỏ một ca ở tests/e2e/loi-vao-ho-so.spec.ts:334 (hộp ⌘K, khổ 1440), không gắn eval nào. Trả về để người xem ca đó có phải do thay đổi của hàng này hay do hàng loi-vao-ho-so.
