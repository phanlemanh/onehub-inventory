---
schema_version: 2
feature_slug: hanh-vi-trong-luoi-khung
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2f8c6b17ee810b2ba6ac8f7393f40b05aba75b17
human_signoff:
---

# Evidence Report: hanh-vi-trong-luoi-khung

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
| E9 | AC-9 | test | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-1 | script | PASS |
| E12 | AC-4 | script | PASS |
| E13 | AC-10 | script | PASS |
| E14 | AC-10 | ui-check | PASS |
| E15 | AC-5 | judgment | đề xuất PASS, chờ người quyết ở Cổng 2 |
| E16 | AC-10 | script | PASS |

Các eval máy đều xanh. Verdict tổng là REJECT vì còn hai phát hiện trong hợp đồng (AC-9) chưa sửa, xem review-findings.md.

## Evidence

- eval: E1
  run_id: minted-hanh-vi-trong-luoi-khung-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm tests/behavior.test.tsx (hồ sơ mở, tiêu điểm, Esc trả tiêu điểm).

- eval: E2
  run_id: minted-hanh-vi-trong-luoi-khung-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ca Trước/Sau theo thứ tự đã lọc và khung giống nhau giữa dòng căn và dòng người.

- eval: E3
  run_id: minted-hanh-vi-trong-luoi-khung-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ma trận 11 kiểu sửa tại ô hoặc trong hồ sơ.

- eval: E4
  run_id: minted-hanh-vi-trong-luoi-khung-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ca đồng hồ giả 999 ms, 1000 ms, 9999 ms, 10000 ms.

- eval: E5
  run_id: minted-hanh-vi-trong-luoi-khung-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ma trận trạng thái × phần đầu vùng.

- eval: E6
  run_id: minted-hanh-vi-trong-luoi-khung-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ma trận bốn ô quyền × trạng thái.

- eval: E7
  run_id: minted-hanh-vi-trong-luoi-khung-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ca TruncatedText đo lại khi đổi bề rộng.

- eval: E8
  run_id: minted-hanh-vi-trong-luoi-khung-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm ma trận hoàn tác hoặc xác nhận và băng mất mạng.

- eval: E9
  run_id: minted-hanh-vi-trong-luoi-khung-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make test: toàn bộ xanh, gồm tests/behavior-guard.test.ts và sáu ca phá thử có thông điệp ghim.

- eval: E10
  run_id: minted-hanh-vi-trong-luoi-khung-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make check:
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-hanh-vi-trong-luoi-khung-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make e2e:
      235 passed (58.9s)

- eval: E12
  run_id: minted-hanh-vi-trong-luoi-khung-E12-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make e2e:
      235 passed (58.9s)

- eval: E13
  run_id: minted-hanh-vi-trong-luoi-khung-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T05:20:46Z
  output: |
    make e2e:
      235 passed (58.9s)

- eval: E14
  run_id: minted-hanh-vi-trong-luoi-khung-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-11T05:20:46Z
  screenshot: evidence/E14-step1.png
  observed: |
    step1 (1440x900 sáng): bảng căn bên trái (24 dòng), hồ sơ dựa mép phải, đầu hồ sơ có tên dòng "S2.02-0302" cùng "Trước", "Sau", "Đóng"; thân hồ sơ liệt kê Căn, Trạng thái, Giá, Diện tích, Phòng ngủ, Toà, Xác nhận lần cuối. Khớp.
    step2: hồ sơ người "[Tên] 01" dùng đúng khung ấy, "Trước" mờ vì là dòng đầu; dữ liệu mẫu "0900 000 001", không có dữ liệu thật. Khớp.
    step3 (360x800 tối): hồ sơ phủ toàn màn, tiêu đề "S1.01-0201", hàng Trước/Sau/Đóng bên dưới, chữ sáng trên nền tối đọc được. step4 (?state=error): vùng "Căn mẫu" chỉ có "Vùng này chưa tải được", câu ba phần và một nút "Thử lại". step5: hộp xác nhận "Bạn chắc muốn gỡ căn?" nói việc sẽ xảy ra, có "Thôi" và nút động từ "Gỡ căn". Khớp.
  network_observed: clean

- eval: E16
  run_id: minted-hanh-vi-trong-luoi-khung-E16-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-11T05:20:46Z
  output: |
    design-floor-s4: không thấy mã màu hex thô trên các tệp giao diện của vòng.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-hanh-vi-trong-luoi-khung-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-11T05:20:46Z

### Phán đoán (đề xuất của hội đồng, chờ người)

- eval: E15
  proposal: PASS
  judged_by: hội đồng ba lens (fresh context)
  votes:
    - domain-correctness: PASS — error.title, error.why, error.nextNoRetry đủ ba phần và không nhắc «Thử lại»; partialEmpty.why nói có dữ liệu nhưng lần tải vừa rồi hỏng; slow.withCancel nói tải lâu hơn thường lệ và cho bấm «Huỷ»; confirm.note bảo đọc việc sẽ xảy ra trước khi bấm. Cả bốn dùng «bạn», không có dấu chấm than.
    - operational-feasibility: PASS — cả bốn câu đạt theo các hằng chữ trong GRID_COPY và FRAME_COPY: nextNoRetry là "Bạn tải lại trang…", partialEmpty.why không nói chưa ai nhập, slow.withCancel có «Huỷ», confirm.note bảo xem kỹ việc sẽ xảy ra. Gọi người dùng là «Bạn», không có dấu chấm than.
    - spec-alignment: PASS — error có title (chuyện gì), why (vì sao), nextNoRetry (làm gì tiếp) và không nhắc «Thử lại»; câu "chưa ai thêm" chỉ nằm ở empty; slow.withCancel cho biết bấm «Huỷ» để dừng; câu mô tả cụ thể của hộp xác nhận do từng màn đưa vào. Đúng design/language.md, không có dấu chấm than.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Không phân biệt (xanh cả trên mã mới lẫn mã cũ diffBase, chứng minh harness chứ chưa chứng minh feature). Cần viết lại để khẳng định hành vi mới, hoặc xác nhận là lưới hồi quy có chủ ý:
- make test: E1, E2, E3, E4, E5, E6, E7, E8, E9
- make check: E10
- design-floor-s4.mjs: E16

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, xác định)

## Iterations

Round 1: mọi eval máy xanh, nhưng còn hai phát hiện trong hợp đồng (AC-9): danh sách chặn của tests/behavior-guard.test.ts thiếu record-panel và region-state, và ca phá notification-channel chỉ đo bảng channelFor mà không đường chạy nào dùng. Trả về cho bước hiện thực.
