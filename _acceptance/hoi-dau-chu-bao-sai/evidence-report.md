---
schema_version: 2
feature_slug: hoi-dau-chu-bao-sai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 3c27f1e61d9239376869461db9311f3cd23bc94d
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: hoi-dau-chu-bao-sai

Round 6. Mọi phép đo máy đều xanh; còn một mục judgment (E9c) chờ người ở Cổng 2.

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
| E8b | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |
| E9b | AC-9 | ui-check | PASS (carried từ round 5) |
| E9c | AC-9 | judgment | PENDING-JUDGMENT (đề xuất PASS, chờ người) |
| E10 | AC-9 | script | PASS (carried từ round 3) |
| E11 | AC-9 | script | PASS (carried từ round 3) |
| E12 | AC-10 | script | PASS (carried từ round 3) |

## Evidence

- eval: E1
  run_id: minted-hoi-dau-chu-bao-sai-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T22:13:01Z
  output: |
    DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts
    21 passed (1.0m)

- eval: E2b
  run_id: minted-hoi-dau-chu-bao-sai-E2b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T22:13:01Z
  output: |
    cùng lệnh với E1 — 21 passed (1.0m)

- eval: E5b
  run_id: minted-hoi-dau-chu-bao-sai-E5b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T22:13:01Z
  output: |
    cùng lệnh với E1 — 21 passed (1.0m)

- eval: E8
  run_id: minted-hoi-dau-chu-bao-sai-E8-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T22:13:01Z
  output: |
    cùng lệnh với E1 — 21 passed (1.0m)

- eval: E9
  run_id: minted-hoi-dau-chu-bao-sai-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T22:13:01Z
  output: |
    cùng lệnh với E1 — 21 passed (1.0m)

- eval: E8b
  run_id: minted-hoi-dau-chu-bao-sai-E8b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T22:13:01Z
  output: |
    make test — hoàn tất, không ca nào trượt

- eval: E2
  run_id: minted-hoi-dau-chu-bao-sai-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-hoi-dau-chu-bao-sai-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  carried_from_round: 2
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-hoi-dau-chu-bao-sai-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-hoi-dau-chu-bao-sai-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-hoi-dau-chu-bao-sai-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-hoi-dau-chu-bao-sai-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E9b
  run_id: minted-hoi-dau-chu-bao-sai-E9b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T21:51:46Z
  carried_from_round: 5
  # carry-forward tu round 5 — delta khong cham paths cua eval
  screenshot: evidence/E9b-hoi-1440-light.png
  observed: |
    hoi-1440/1024/414/360 sáng và tối (8 ảnh): hồ sơ có liên kết 'Báo sai thông tin' phía trên danh sách trường và thanh đáy với nút xanh 'Hỏi đầu chủ · [Tên] 03' rộng hết hồ sơ, dính đáy; không chồng chữ ở khổ nào. Ở ảnh tối nút là xanh nhạt.
    chua-ai-giu-1440 và 360 sáng: nút tắt chữ 'Căn chưa có đầu chủ giữ'. minh-giu-1440: căn của chính người xem không có thanh đáy, đúng hợp đồng.
    bao-sai 1440/1024/414/360 sáng và tối (8 ảnh): hộp tiêu đề 'Báo sai thông tin căn 1101', ô chọn 'Căn' với 'Đang hiện: 1101', ô giá trị đúng '72 m²', ô ghi chú, nút 'Chép và mở bảng chia sẻ' và 'Thôi'. Ở 414 và 360 là bảng trong hồ sơ, thanh đáy vẫn hiện ở 414.
    hoi-loi 1440 và 360 sáng và tối (4 ảnh): dưới nút có dòng đỏ 'Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.' và ô chứa nguyên tin, liên kết xuống dòng, không bị cắt.
    bao-sai-loi 1440 và 360 sáng và tối (4 ảnh): cùng thông báo trong hộp, ô sáu dòng tới 'Đúng là: 72 m²', hiện đủ, nút nằm dưới.
    dau-ho-so 1440/1024/414/360 sáng và tối (8 ảnh): đầu hồ sơ hai dòng, tiêu đề căn rồi hàng Trước/Sau/Đóng; hồ sơ khi chưa đăng nhập không có thanh hỏi và không có liên kết báo sai. Khớp với Expected.
  network_observed: n-a (driver)

- eval: E10
  run_id: minted-hoi-dau-chu-bao-sai-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-hoi-dau-chu-bao-sai-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-hoi-dau-chu-bao-sai-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward tu round 3 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_check-r6
  exit_code: 0
  verified_at: 2026-11-13T22:13:01Z

- cmd: npm run build
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-13T22:13:01Z

- cmd: make e2e
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_e2e-r6
  exit_code: 0
  verified_at: 2026-11-13T22:13:01Z

### Judgment

- eval: E9c
  judged_by: hội đồng ba lăng kính (fresh context), giữ nguyên từ round 3 — inputs không đổi, không chấm lại; rationale xem round 3
  proposal: PASS
  votes:
    - domain-correctness: PASS (r3)
    - operational-feasibility: PASS (r3)
    - spec-alignment: PASS (r3)
  human_override: PASS — Manh Phan 2026-11-14: Đạt

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 4 — baseline khong do lai round nay

Không có eval nào bị liệt kê là không-phân-biệt. Lệnh suite xanh cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — mọi eval chạy một lượt (runs: 1), không có phương sai.

## Iterations

Round 5: E8b trượt (kiểm SP-3 trên các tệp nút mới); các eval khác giữ PASS hoặc carried. Trả về sửa code.
Round 6: E1, E2b, E5b, E8, E8b, E9 chạy lại và xanh; E2, E3, E4, E5, E6, E7, E9b, E10, E11, E12 carried; suite make check, build, make e2e xanh. Còn E9c (judgment, panel carried từ round 3) chờ người ở Cổng 2.

### Re-pin lần 1 — 2026-11-14, do gộp nhánh chính sau 3b (PR #47) trước khi gộp PR #49
run_id: repin-20261114T032125Z-52321
sha: 3c27f1e61d9239376869461db9311f3cd23bc94d · suites: 3 lệnh exit 0 · evals: 15/15 eval máy đạt kỳ vọng · ngoài làn máy: E9b, E9c (E9c không khai paths) · diff chạm vật đo ngoài làn máy: E9b — chưa chứng lại, đi vòng S4 delta
