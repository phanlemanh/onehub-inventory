---
schema_version: 2
feature_slug: so-do-moi-vong
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 58ea81799dd4aa7c7e681227ac959ea7128d9ee6
human_signoff:
---

# Evidence Report: so-do-moi-vong

Vòng 2. Nội dung thay toàn bộ vòng cũ; lịch sử vòng nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | judgment | PASS (đề xuất của hội đồng, còn một phiếu phản đối, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-so-do-moi-vong-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E2
  run_id: minted-so-do-moi-vong-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E3
  run_id: minted-so-do-moi-vong-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E4
  run_id: minted-so-do-moi-vong-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E5
  run_id: minted-so-do-moi-vong-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E6
  run_id: minted-so-do-moi-vong-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E7
  run_id: minted-so-do-moi-vong-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

- eval: E8
  run_id: minted-so-do-moi-vong-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:52:27Z
  output: |
    lệnh make test chạy trọn bộ, kết thúc xanh (1 lần chạy, 1 lần đạt, không phương sai)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-so-do-moi-vong-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-10T23:52:27Z

- cmd: npm run build
  run_id: minted-so-do-moi-vong-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-10T23:52:27Z

- cmd: make e2e
  run_id: minted-so-do-moi-vong-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-10T23:52:27Z

### Judgment

Đề xuất của hội đồng cho E9 là PASS, nhưng có một phiếu phản đối. Mọi phiếu hiện đầy đủ bên dưới. Ô human_override để TRỐNG cho người điền ở Cổng 2.

- eval: E9
  judged_by: hội đồng ba góc nhìn (fresh context), đề xuất PASS
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — (1) Câu giao trong ba tệp agent-N.md trùng câu giao trong de-bai-ba-agent.md. Chỉ có `<bản kho>` được thay bằng đường tuyệt đối. (2) Các ô agent 1, 2, 3 của 52 dòng khớp với các dòng quyết định được dẫn trong từng tệp agent. Nhãn Giống và Lệch đúng ba luật xếp dòng, kể cả khi một agent không nêu (dòng 24, 34, 35, 52) và khi luật 3 tính lại ghim cột (dòng 4 và 20). (3) Số đếm khớp: 21 dòng bắt buộc có 10 Giống và 11 Lệch, toàn bảng 52 dòng có 24 Giống và 28 Lệch, Giống mang lỗi là 0. Các số tự đoán, lượt gọi công cụ và số tệp đọc trong so-sanh.md và moc.json khớp với phần tổng kết cuối mỗi tệp agent. Có hai chỗ xếp dòng còn bàn được nhưng không vi phạm rõ ràng: dòng 6 coi bước đọc dữ liệu mẫu tạm của agent 2 là chưa thành khác biệt, và dòng 49 xếp Giống dù agent 2 không nêu `redactPII`.
    - operational-feasibility: FAIL — Câu giao khớp và số cuối bảng khớp các dòng. Nhưng dòng 6 (agent 2 chọn đọc dữ liệu mẫu MAU tạm, hai agent kia không nêu) và dòng 33 (agent 3 ghi nút «Mở số», hai agent kia «Hiện số») bị xếp Giống, trái định nghĩa «ba agent cùng lựa chọn» và luật 1. Dòng 1 (bố cục) cũng có khả năng là Lệch theo luật 3, vì agent 2 ghi «mật độ dày» trong chính lựa chọn bố cục.
    - spec-alignment: PASS — (1) Cả ba agent-N.md chép câu giao khớp nguyên văn với de-bai-ba-agent.md. Chỉ có `<bản kho>` được thay bằng đường dẫn thật. (2) Tôi đối chiếu cả 52 dòng của bảng so với số dòng agent tự đánh trong từng tệp. Lựa chọn ghi cho từng agent khớp tệp gốc, và nhãn Giống / Lệch đúng định nghĩa cùng ba luật xếp dòng. Giống, mang lỗi bằng 0 là hợp lý, vì không phương án nào tự trích luật mà lựa chọn chung trái luật đó. (3) Đếm lại ra 10 Giống và 11 Lệch ở 21 dòng bắt buộc, 24 Giống và 28 Lệch ở toàn bảng. Số theo agent (44/47/65; 15/15/23 căn cứ đủ; 14/15/28 một phần; 6/7/23 tự đoán hệ; 12/10/13 sản phẩm; 20/22/21 lượt công cụ; 58/53/53 tệp) khớp moc.json. Hai chỗ đáng ngờ là dòng 6 và dòng 1, nhưng cách xếp của bảng so vẫn hợp lý. Ở dòng 6, bước đọc dữ liệu mẫu của Agent 2 không được tính là khác biệt. Ở dòng 1, mật độ dày được xét ở dòng 5 và 24, không tính vào bố cục.
  required_evidence:
    - Phiếu phản đối của operational-feasibility đòi: so-sanh.md dòng 6 (Cách nạp dữ liệu) xếp lại Lệch, hoặc ghi chú giải thích vì sao bước tạm «đọc dữ liệu mẫu MAU» của agent 2 (agent-2.md #9) không phải khác biệt trong khi luật 1 xếp «không nêu» là Lệch ở các dòng 24, 34, 35, 52.
    - so-sanh.md dòng 33 (Che số và mở số) xếp lại Lệch (agent-3.md #39 ghi nút «Mở số», agent-1.md #25 và agent-2.md #29 ghi «Hiện số»), hoặc căn cứ trong de-bai-ba-agent.md rằng tên nút không thuộc lựa chọn của dòng này.
    - so-sanh.md dòng 1 (Bố cục) được xét lại theo luật 3: agent-2.md #3 đưa «mật độ dày» vào bố cục, agent-1.md không ghi mật độ ở bố cục. Xếp Lệch hoặc ghi lý do rõ vì sao mật độ không nằm trong quyết định bố cục.
    - Bảng «Đếm kết quả» trong so-sanh.md và khối ket_qua trong moc.json cập nhật lại theo các dòng đã sửa. Hiện đang là 10/0/11 cho 21 dòng bắt buộc và 24/0/28 cho 52 dòng.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Carried từ round 1 — baseline không đo lại round này (evals.yaml không đổi từ lần baseline cuối). Baseline không đo: field baseline của từng eval ghi n-a.

Eval không phân biệt (pass trên cả HEAD lẫn baseline), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:

- make test, phủ E1, E2, E3, E4, E5, E6, E7, E8

Các lệnh suite make check, npm run build, make e2e xanh cả hai phía là regression-guard bình thường, không liệt kê.

## Variance

none — mọi eval chạy một lần, không có phương sai.

## Iterations

Round 1: có sửa sau lần chấm đầu (commit 58ea817: coi mọi trạng thái sau Cổng của hồ sơ 1a là đã gộp, phát biểu lại luật so sánh của mốc). Chi tiết xem lịch sử git.
Round 2: tám eval máy E1 đến E8 và ba lệnh suite đều xanh; E9 là mục judgment còn một phiếu phản đối, chờ người chốt ở Cổng 2. Verdict PENDING-JUDGMENT.
