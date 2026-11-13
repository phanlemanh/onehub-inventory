---
schema_version: 2
feature_slug: hoi-dau-chu-bao-sai
verdict: REJECT
failed_evals: ["E8b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c18b01e16c691989bf1d09b0fc130a5d35a9de3
human_signoff:
---

# Evidence Report: hoi-dau-chu-bao-sai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | test | PASS (carried từ round 3) |
| E2b | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS (carried từ round 2) |
| E4 | AC-4 | test | PASS (carried từ round 3) |
| E5 | AC-5 | test | PASS (carried từ round 3) |
| E5b | AC-5 | script | PASS |
| E6 | AC-6 | test | PASS (carried từ round 3) |
| E7 | AC-7 | test | PASS (carried từ round 3) |
| E8 | AC-8 | script | PASS |
| E8b | AC-8 | test | FAIL |
| E9 | AC-9 | script | PASS |
| E9b | AC-9 | ui-check | PASS |
| E9c | AC-9 | judgment | đề xuất PASS (panel giữ nguyên từ round 3), human_override trống |
| E10 | AC-9 | script | PASS (carried từ round 3) |
| E11 | AC-9 | script | PASS (carried từ round 3) |
| E12 | AC-10 | script | PASS (carried từ round 3) |

## Evidence

- eval: E1
  run_id: minted-hoi-dau-chu-bao-sai-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T21:51:46Z
  output: |
    21 passed (1.2m)

- eval: E2b
  run_id: minted-hoi-dau-chu-bao-sai-E2b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T21:51:46Z
  output: |
    21 passed (1.2m)

- eval: E5b
  run_id: minted-hoi-dau-chu-bao-sai-E5b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T21:51:46Z
  output: |
    21 passed (1.2m)

- eval: E8
  run_id: minted-hoi-dau-chu-bao-sai-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T21:51:46Z
  output: |
    21 passed (1.2m)

- eval: E9
  run_id: minted-hoi-dau-chu-bao-sai-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T21:51:46Z
  output: |
    21 passed (1.2m)

- eval: E8b
  run_id: minted-hoi-dau-chu-bao-sai-E8b-r5
  exit_code: 2
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T21:51:46Z
  output: |
    make test: tools/e2e_templates/e2e-templates.test.ts, 1 failed trong 40 bài.
    Bài hỏng: "every test that calls the shared waits, read from the code, is in CHO_TESTS".
    Danh sách chưa liệt kê: tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts › E9 · axe on the record with its foot bar and on the report dialog
    Test Files 1 failed | 80 passed (81); Tests 1 failed | 1448 passed (1449)

- eval: E9b
  run_id: minted-hoi-dau-chu-bao-sai-E9b-r5
  exit_code: 0
  baseline: n-a
  verifier: ui-check
  verified_at: 2026-11-13T21:51:46Z
  screenshot: evidence/E9b-hoi-1440-light.png
  observed: |
    hoi-1440/1024/414/360 sáng và tối (8 ảnh): hồ sơ có liên kết 'Báo sai thông tin' phía trên danh sách trường và thanh đáy với nút xanh 'Hỏi đầu chủ · [Tên] 03' rộng hết hồ sơ, dính đáy; không chồng chữ ở khổ nào. Ở ảnh tối nút là xanh nhạt.
    chua-ai-giu-1440 và 360 sáng: nút tắt chữ 'Căn chưa có đầu chủ giữ'. minh-giu-1440: căn của chính người xem không có thanh đáy, đúng hợp đồng.
    bao-sai 1440/1024/414/360 sáng và tối (8 ảnh): hộp tiêu đề 'Báo sai thông tin căn 1101', ô chọn 'Căn' với 'Đang hiện: 1101', ô giá trị đúng '72 m²', ô ghi chú, nút 'Chép và mở bảng chia sẻ' và 'Thôi'. Ở 414 và 360 là bảng trong hồ sơ, thanh đáy vẫn hiện ở 414.
    hoi-loi 1440 và 360 sáng và tối (4 ảnh): dưới nút có dòng đỏ 'Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.' và ô chứa nguyên tin, liên kết xuống dòng, không bị cắt.
    bao-sai-loi 1440 và 360 sáng và tối (4 ảnh): cùng thông báo trong hộp, ô sáu dòng tới 'Đúng là: 72 m²', hiện đủ, nút nằm dưới.
    dau-ho-so 1440/1024/414/360 sáng và tối (8 ảnh): đầu hồ sơ hai dòng, tiêu đề căn rồi hàng Trước/Sau/Đóng; hồ sơ khi chưa đăng nhập không có thanh hỏi và không có liên kết báo sai. Khớp với Expected.
  network_observed: n-a (driver)

- eval: E2
  run_id: minted-hoi-dau-chu-bao-sai-E2-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E3
  run_id: minted-hoi-dau-chu-bao-sai-E3-r2
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E4
  run_id: minted-hoi-dau-chu-bao-sai-E4-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E5
  run_id: minted-hoi-dau-chu-bao-sai-E5-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E6
  run_id: minted-hoi-dau-chu-bao-sai-E6-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E7
  run_id: minted-hoi-dau-chu-bao-sai-E7-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E10
  run_id: minted-hoi-dau-chu-bao-sai-E10-r3
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E11
  run_id: minted-hoi-dau-chu-bao-sai-E11-r3
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

- eval: E12
  run_id: minted-hoi-dau-chu-bao-sai-E12-r3
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  note: carry-forward từ round 3 — delta không chạm paths của eval

### Judgment

- eval: E9c
  judged_by: panel đề xuất, giữ nguyên từ round 3 — inputs không đổi, không chấm lại; rationale xem round 3
  proposal: PASS
  votes:
    - domain-correctness: PASS (r3)
    - operational-feasibility: PASS (r3)
    - spec-alignment: PASS (r3)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_check-r5
  exit_code: 2
  verified_at: 2026-11-13T21:51:46Z
  note: cùng một bài hỏng với E8b (danh sách CHO_TESTS thiếu bài E9 của hàng này); không gắn eval nào.

- cmd: npm run build
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-13T21:51:46Z

- cmd: make e2e
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_e2e-r5
  exit_code: 0
  verified_at: 2026-11-13T21:51:46Z
  output: |
    975 passed (7.6m)

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 4 — baseline khong do lai round nay

Baseline khong do: moi eval ghi n-a vì round này không đo lại (evals.yaml không đổi từ lần đo cuối, round 4). Không có eval nào bị liệt kê là không phân biệt.

Lệnh fail không gắn eval: make check (cùng nguyên nhân với E8b).

## Variance

none — mọi eval đều chạy một lần, không có eval nhiều lần chạy.

## Iterations

Round 1-4: xem lịch sử trong các round trước (thẻ bằng chứng round 4: e79d81a).
Round 5: E8b failed — bài E9 trong tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts đổi sang chờ chung nhưng chưa vào danh sách CHO_TESTS và chưa có thẻ @cho nên kiểm tra đơn vị đỏ. Trả về triển khai.
