---
schema_version: 2
feature_slug: so-do-moi-vong
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 56013b11ba49363c3aa486b69e869f024460a62a
human_signoff:
---

# Evidence Report: so-do-moi-vong

Vòng 4. Verdict REJECT vì lệnh suite `make check` không xanh (xem mục Lệnh suite). Không eval nào có chỉ số fail: tám eval máy E1–E8 đều xanh, E9 là mục phán xét chưa ai chốt.

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
| E9 | AC-9 | judgment | UNCERTAIN |

## Evidence

- eval: E1
  run_id: minted-so-do-moi-vong-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E2
  run_id: minted-so-do-moi-vong-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E3
  run_id: minted-so-do-moi-vong-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E4
  run_id: minted-so-do-moi-vong-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E5
  run_id: minted-so-do-moi-vong-E5-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E6
  run_id: minted-so-do-moi-vong-E6-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E7
  run_id: minted-so-do-moi-vong-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

- eval: E8
  run_id: minted-so-do-moi-vong-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T01:17:03Z
  output: |
    make test (một lượt chung cho E1–E8): toàn bộ bài xanh, lệnh kết thúc thành công.

### Mục phán xét (E9)

Đề xuất của hội đồng: UNCERTAIN. Hai trong ba phiếu chưa kết luận PASS. Ô `human_override` để trống cho người quyết ở Cổng 2. Bản đồ run_id của vòng này không có mã cho E9 nên báo cáo không ghi run_id cho mục này.

- eval: E9
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  votes:
  - domain-correctness: PASS — (1) Câu giao trong ba tệp agent-N.md trùng nguyên văn câu giao trong de-bai-ba-agent.md. Khác biệt duy nhất là `<bản kho>` được thay bằng /tmp/moc-tree, và moc.json có ghi việc thay này. (2) Đối chiếu cả 52 dòng của so-sanh.md với các dòng quyết định `#` trỏ tới trong từng tệp agent: lựa chọn ghi cho từng agent khớp, nhãn Giống / Lệch đúng ba luật xếp dòng, và Giống mang lỗi = 0 là hợp lý. (3) Đếm lại ra 10 Giống và 11 Lệch cho 21 dòng bắt buộc, 24 Giống và 28 Lệch cho cả bảng 52 dòng, cùng số tổng, căn cứ đủ, một phần, tự đoán, lượt công cụ, tệp đọc của ba agent, tất cả khớp với moc.json. Không có dòng nào lệch.
  - operational-feasibility: UNCERTAIN — (1) Ba tệp agent chép câu giao khớp de-bai-ba-agent.md, chỉ thay `<bản kho>` bằng /tmp/moc-tree, và moc.json có ghi chú về việc thay đó. (3) Số đếm khớp: bắt buộc 10 Giống và 11 Lệch, các dòng thêm 14 Giống và 17 Lệch, toàn bảng 24 Giống, 28 Lệch, 0 mang lỗi. Số theo agent trong bảng khớp moc.json. (2) Phần lớn dòng khớp tệp nguồn, nhưng dòng 1 và dòng 33 phụ thuộc cách đọc luật 3, nên không khẳng định PASS.
  - spec-alignment: UNCERTAIN — (1) Câu giao trong cả ba tệp agent-N.md trùng de-bai-ba-agent.md, chỉ khác `<bản kho>` được thay bằng `/tmp/moc-tree`. (3) Số liệu khớp: bắt buộc 10 Giống và 11 Lệch, toàn bảng 24 Giống và 28 Lệch, Giống mang lỗi bằng 0, tổng quyết định 44/47/65, lượt gọi công cụ và số tệp đọc khớp moc.json. (2) Không tìm thấy dòng nào ghi sai lựa chọn của agent hay xếp sai nhãn. Riêng dòng 49 (Dữ liệu cá nhân và dữ liệu thử) xếp Giống dù Agent 2 (#45) không nêu pii hay redactPII mà Agent 1 và 3 có nêu, trong khi các dòng 24, 34, 35, 52 coi "không nêu" là Lệch theo luật 1. Cách áp luật 1 chưa nhất quán nên chưa thể kết luận PASS.
  required_evidence:
    - Dòng 1 (Bố cục) xếp Giống, nhưng ô Bố cục của agent-2.md (#3) ghi «màn vận hành, mật độ dày», còn agent-1.md (#5) chọn mức thường. Luật 3 trong de-bai-ba-agent.md bắt tính lại khác biệt đã tính ở dòng khác nếu nó nằm trong quyết định của dòng này. Cần người sở hữu đề bài xác nhận «mật độ dày» ở agent 2 là cỡ control (khớp cỡ `size="sm"` của agent 1 và 3), không phải chiều cao dòng. Nếu là chiều cao dòng thì dòng 1 phải là Lệch, và số Giống, Lệch của 21 dòng bắt buộc và của toàn bảng đổi theo. Lấy ở ghi chú của so-sanh.md dòng 1 hoặc một phán quyết bổ sung của chủ đề bài.
    - Dòng 33 (Che số và mở số) xếp Giống, nhưng agent-1.md (#25) và agent-2.md (#29) ghi nút «Hiện số», còn agent-3.md (#39) ghi «Mở số». Cần chủ đề bài xác nhận hai tên nút này là cùng một lựa chọn. Nếu khác nhau thì dòng 33 là Lệch và số toàn bảng đổi thành 23 Giống, 29 Lệch.
    - Dòng 6 (Cách nạp dữ liệu) xếp Giống, dù agent-2.md (#9) thêm bước tạm đọc dữ liệu mẫu MAU và agent-1.md (#6) thêm «đọc không đi qua /api/v1». Cần phán quyết rằng các chi tiết thêm này không phải lựa chọn khác theo ba luật xếp dòng.
    - Quyết định của người lập đề về dòng 49 trong so-sanh.md: khi Agent 2 chỉ nêu dữ liệu thử (agent-2.md #45) còn Agent 1 (#38) và Agent 3 (#53) nêu thêm pii và redactPII, dòng này tính là Giống hay Lệch theo luật 1. Nếu là Lệch thì số toàn bảng đổi thành 23 Giống và 29 Lệch, cần sửa so-sanh.md và moc.json.
    - Cách tính nhất quán cho các dòng mà Agent 2 chỉ nêu một phần: dòng 23 (Agent 2 #3 chỉ ghi 'Một Frame', không có `FramePanel p-0` và 'không Card' như Agent 1 #34 và Agent 3 #4), dòng 1 (Agent 2 thêm 'mật độ dày'), dòng 6 (Agent 2 #9 đọc dữ liệu mẫu MAU tạm thời trong khi Agent 1 và 3 chờ hàng 1). Cần ghi rõ ngưỡng 'không nêu' ngay trong mục Danh sách quyết định của de-bai-ba-agent.md.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-so-do-moi-vong-SUITE-make_check-r4
  exit_code: 2
  verified_at: 2026-11-11T01:17:03Z
  ghi_chú: lint, định dạng, typecheck đều xanh. Bước `npm test` bên trong dừng trước khi chạy bài vì thư mục báo cáo coverage đang bị một tiến trình Vitest khác giữ (pid 23838), thông báo của Vitest đề nghị cho mỗi lượt chạy một thư mục coverage riêng hoặc chạy tuần tự. Lệnh này không gắn eval nào. `make test` chạy riêng vẫn xanh (E1–E8).

- cmd: npm run build
  run_id: minted-so-do-moi-vong-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-11T01:17:03Z

- cmd: make e2e
  run_id: minted-so-do-moi-vong-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-11T01:17:03Z
  ghi_chú: 16 bài đạt.

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml không đổi từ lần đo baseline cuối (round 1), nên field `baseline:` của từng eval máy ghi n-a.

Eval không phân biệt (xanh trên cả HEAD lẫn baseline đã mang theo): E1, E2, E3, E4, E5, E6, E7, E8 (lệnh `make test`). Cần viết lại để khẳng định hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

## Variance

none — mọi eval máy chạy một lượt (runs: 1), không có eval đa lượt.

## Iterations

Round 1–3: lịch sử nằm trong các bản bằng chứng cũ của vòng đó (xem git log, các commit b05e980 và f8676dc); không chép lại ở đây.
Round 4: `make check` không xanh vì hai tiến trình Vitest tranh cùng thư mục coverage; E1–E8 xanh; E9 còn UNCERTAIN ở hai phiếu. Đã chạm giới hạn vòng — chuyển người quyết, verdict REJECT.
