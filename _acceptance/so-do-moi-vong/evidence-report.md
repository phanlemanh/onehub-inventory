---
schema_version: 2
feature_slug: so-do-moi-vong
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b55bd7edc3365d406a18461df592ad559b8dc347
human_signoff:
---

# Evidence Report: so-do-moi-vong

Round 1. Lệnh suite `make check` thoát khác 0 (lint đỏ) và không gắn eval nào. Eval E9 (judgment) được ba tiêu chí chấm đề xuất FAIL, người chưa quyết.

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
| E9 | AC-9 | judgment | FAIL (đề xuất của hội đồng, chờ người quyết ở Cổng 2) |

## Evidence

- eval: E1
  run_id: minted-so-do-moi-vong-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'ghi: một lượt REJECT hai tầng, BLOCKED và repin-do' và bài 'ghi: lượt chấm lại và PENDING-JUDGMENT' đạt.

- eval: E2
  run_id: minted-so-do-moi-vong-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'ghi lại giữ tầng đã khai' đạt.

- eval: E3
  run_id: minted-so-do-moi-vong-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'ghi từ chối đầu vào sai' đạt.

- eval: E4
  run_id: minted-so-do-moi-vong-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'kiem: ma trận trạng thái và loại hồ sơ' đạt.

- eval: E5
  run_id: minted-so-do-moi-vong-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Các bài 'kho thật' đạt.

- eval: E6
  run_id: minted-so-do-moi-vong-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'gop: làm lại theo tầng' và 'mốc Quỹ hàng khớp 0019' đạt.

- eval: E7
  run_id: minted-so-do-moi-vong-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'gop: quyết định có kiểm theo tầng' đạt.

- eval: E8
  run_id: minted-so-do-moi-vong-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-10T23:39:52Z
  output: |
    make test chạy cả bộ, kết thúc xanh. Bài 'kiem-moc: mốc thật xanh và sáu lần phá' đạt.

### Judgment (E9)

Hội đồng đề xuất cho E9 là FAIL. Mỗi phiếu ghi đầy đủ, không gộp.

- eval: E9
  judged_by: hội đồng ba tiêu chí (fresh context)
  proposal: FAIL
  votes:
  - domain-correctness: FAIL — Câu giao khớp nguyên văn (chỉ thay đường dẫn kho) và các số đếm 13/0/8, 30/0/22 cùng số tự đoán khớp các dòng bảng và moc.json. Nhưng so-sanh.md thêm vào định nghĩa Lệch mệnh đề «một agent không nêu trong khi hai agent kia nêu» mà de-bai-ba-agent.md không có (chỉ «ít nhất hai lựa chọn khác nhau»), nên các dòng 24, 31, 34, 35, 52 bị gán Lệch không đúng định nghĩa. Dòng 34 (0900 000 000 so với nhóm 4-3-3) còn là hai lựa chọn tương thích.
  - operational-feasibility: FAIL — (1) Đạt: câu giao trong ba tệp agent giống de-bai-ba-agent.md, chỉ thay `<bản kho>` bằng đường tuyệt đối. (3) Đạt: các số 13/0/8, 30/0/22 và số tự đoán của từng agent khớp các dòng bảng. (2) Không đạt: dòng 20 (Điện thoại) ghi "Giống" nhưng Agent 2 ghim cột Họ tên còn Agent 1 và 3 không ghim, nên theo de-bai là "Lệch". so-sanh.md cũng tự đổi định nghĩa so với de-bai: coi "không nêu" là Lệch (dòng 24, 31, 34, 35, 52) và chỉ tính "Giống, mang lỗi" khi chính agent chỉ ra luật.
  - spec-alignment: FAIL — Phần (1) đạt: câu giao trong ba tệp agent-N.md trùng câu giao của de-bai-ba-agent.md, chỉ thay `<bản kho>` bằng đường dẫn. Phần (3) đạt: các dòng của bảng cho 13/0/8 ở 21 dòng bắt buộc và 30/0/22 toàn bảng (17 Giống và 14 Lệch ở 31 dòng thêm). Số agent tự tổng kết trong so-sanh.md khớp moc.json. Phần (2) có dòng lệch định nghĩa: dòng 20, 34, 35, 24 và 52.
  required_evidence:
    - (domain-correctness) de-bai-ba-agent.md (mục «Danh sách quyết định của bảng so») được sửa để định nghĩa Lệch có thêm trường hợp «một agent không nêu», hoặc so-sanh.md gán lại dòng 24, 31, 35, 52 (và dòng 34) bằng nhãn đúng định nghĩa hiện hành trong de-bai-ba-agent.md. Nếu có một trong hai thì đánh giá đổi.
    - (domain-correctness) Nếu dòng 34 vẫn là Lệch: ghi chú trong so-sanh.md giải thích vì sao «0900 000 000 từ E.164» (agent-1.md, dòng #25) và «chia nhóm 4-3-3» (agent-3.md, dòng #38) là hai lựa chọn khác nhau về thực chất.
    - (domain-correctness) Sau khi gán lại, đếm lại và sửa bảng «Đếm kết quả» trong so-sanh.md cùng khối ket_qua trong moc.json cho khớp các dòng.
    - (operational-feasibility) Sửa dòng 20 trong so-sanh.md từ Giống sang Lệch, hoặc nêu trong de-bai-ba-agent.md luật không tính lại ghim cột ở dòng đã tính (so-sanh.md dòng 35 ghi chú; agent-2.md #30 «cột Họ tên ghim» đối chiếu agent-3.md #46 và #9 «không ghim»). Khi đó số bắt buộc đổi thành 12 Giống / 9 Lệch, toàn bảng 29 Giống / 23 Lệch, và phải cập nhật so-sanh.md mục «Đếm kết quả» cùng moc.json `ket_qua`.
    - (operational-feasibility) Một câu trong de-bai-ba-agent.md (mục «Danh sách quyết định của bảng so») cho phép coi «một agent không nêu» là Lệch, và giới hạn «Giống, mang lỗi» ở trường hợp agent tự chỉ ra luật. Hiện de-bai chỉ định nghĩa Lệch là «ít nhất hai lựa chọn khác nhau» và «lựa chọn trái một luật đã ghi trong kho», nên các dòng 24, 31, 34, 35, 52 (và phần nào dòng 43) chưa có căn cứ trong định nghĩa gốc. Dòng 34 còn có A1 («0900 000 000») và A3 («4-3-3») cùng nhóm số.
    - (operational-feasibility) Giải thích hoặc sửa chênh lệch số lượt gọi công cụ của Agent 2: agent-2.md và so-sanh.md ghi 22, moc.json ghi 23. moc.json có ghi chú đây là số harness đo, nhưng so-sanh.md vẫn ghi cột này là «chép số agent tự tổng kết».
    - (spec-alignment) Dòng 34 (Cách viết số điện thoại) ghi Lệch, nhưng Agent 1 (agent-1.md, dòng #25) viết «0900 000 000», tức nhóm 4-3-3, trùng Agent 3 (agent-3.md, dòng #38). Cả hai cùng chọn, Agent 2 không nêu. Muốn đổi: sửa dòng này thành Giống, hoặc chỉ ra tệp agent nào viết nhóm số khác.
    - (spec-alignment) Dòng 35 (Bấm gọi), dòng 24 (Cỡ control) và dòng 52 (Ghi sổ sau khi làm) ghi Lệch chỉ vì một agent «không nêu», trong khi hai agent kia chọn như nhau. de-bai-ba-agent.md, mục «Danh sách quyết định của bảng so», định nghĩa Lệch là «ít nhất hai lựa chọn khác nhau» và không có điều khoản «không nêu». Quy tắc phụ này do so-sanh.md tự thêm ở đầu tệp. Muốn đổi: bổ sung quy tắc vào de-bai-ba-agent.md (nguồn định nghĩa), hoặc đổi ba dòng thành Giống.
    - (spec-alignment) Dòng 20 (Điện thoại, khổ nhỏ) ghi Giống, nhưng agent-2.md dòng #30 chọn «cột Họ tên ghim» còn agent-1.md dòng #24 và agent-3.md dòng #46 không ghim. Đây là hai lựa chọn khác nhau. Ghi chú của dòng nói ghim đã tính ở dòng 4, nhưng định nghĩa không cho loại trừ chồng lấn như vậy. Muốn đổi: đổi dòng 20 thành Lệch (rồi sửa số đếm 13/8 và 30/22), hoặc thêm điều khoản loại trừ chồng lấn vào de-bai-ba-agent.md.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-so-do-moi-vong-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-10T23:39:52Z
  output: |
    Bước lint đỏ: 200 vấn đề (189 lỗi, 11 cảnh báo), phần lớn là 'args' / 'log' / 'phase' is not defined (no-undef) và '_' is defined but never used.
    make: *** [lint] Error 1
    Lệnh không gắn eval nào; làm vòng này bị REJECT.

- cmd: npm run build
  run_id: minted-so-do-moi-vong-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-10T23:39:52Z

- cmd: make e2e
  run_id: minted-so-do-moi-vong-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-10T23:39:52Z
  output: |
    16 passed (5.5s)

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (đạt cả trên HEAD lẫn baseline): E1, E2, E3, E4, E5, E6, E7, E8 (cùng lệnh make test, baseline green). Cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý.

Lệnh fail không gắn eval: make check (thoát khác 0 ở bước lint, xem khối suite).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lệnh suite make check đỏ ở bước lint; E9 được hội đồng đề xuất FAIL (so-sanh.md thêm định nghĩa Lệch ngoài de-bai, dòng 20 và 34 có thể gán sai, chênh số lượt gọi công cụ của Agent 2). Returned to implementation.
