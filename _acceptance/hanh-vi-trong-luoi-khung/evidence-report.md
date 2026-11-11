---
schema_version: 2
feature_slug: hanh-vi-trong-luoi-khung
verdict: REJECT
failed_evals: ["E11","E12","E13"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 89d8b246ddedfc20c27425cf4519ddc632a57148
human_signoff:
---

# Evidence Report: hanh-vi-trong-luoi-khung

Round 2. Nội dung thay toàn bộ round cũ; lịch sử các round nằm ở mục Iterations.

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
| E11 | AC-1 | script | FAIL |
| E12 | AC-4 | script | FAIL |
| E13 | AC-10 | script | FAIL |
| E14 | AC-10 | ui-check | PASS |
| E15 | AC-5 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E16 | AC-10 | script | PASS |

Ghi chú về lệnh fail: lệnh `make e2e` gánh ba eval E11, E12, E13 trong một lần chạy nên cả ba bị ghi chung. Chi tiết lần chạy: 233 ca qua, 9 bỏ qua, 2 ca đỏ. Hai ca đỏ cùng là `behavior › no serious accessibility violations` (ở hai khổ màn hình), cùng một nguyên nhân: cảnh "dark confirm" bị axe báo `color-contrast`. Đây là ca của E13 (AC-10). Nhật ký chạy không tách được riêng E11 và E12, nên hai eval này chưa có bằng chứng xanh riêng và phải chạy lại sau khi sửa.

## Evidence

- eval: E1
  run_id: minted-hanh-vi-trong-luoi-khung-E1-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E2
  run_id: minted-hanh-vi-trong-luoi-khung-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E3
  run_id: minted-hanh-vi-trong-luoi-khung-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E4
  run_id: minted-hanh-vi-trong-luoi-khung-E4-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E5
  run_id: minted-hanh-vi-trong-luoi-khung-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E6
  run_id: minted-hanh-vi-trong-luoi-khung-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E7
  run_id: minted-hanh-vi-trong-luoi-khung-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E8
  run_id: minted-hanh-vi-trong-luoi-khung-E8-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E9
  run_id: minted-hanh-vi-trong-luoi-khung-E9-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Chạy chung lệnh make test; toàn bộ bộ kiểm đơn vị xanh.

- eval: E10
  run_id: minted-hanh-vi-trong-luoi-khung-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-11T05:35:25Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E11
  run_id: minted-hanh-vi-trong-luoi-khung-E11-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Lệnh make e2e: 233 ca qua, 9 bỏ qua, 2 ca đỏ.
    Hai ca đỏ đều là behavior › no serious accessibility violations (thuộc E13).
    Không có ca nào của E11 được nêu đỏ riêng; E11 bị ghi chung vì cùng một lệnh.

- eval: E12
  run_id: minted-hanh-vi-trong-luoi-khung-E12-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Lệnh make e2e: 233 ca qua, 9 bỏ qua, 2 ca đỏ.
    Hai ca đỏ đều là behavior › no serious accessibility violations (thuộc E13).
    Không có ca nào của E12 được nêu đỏ riêng; E12 bị ghi chung vì cùng một lệnh.

- eval: E13
  run_id: minted-hanh-vi-trong-luoi-khung-E13-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T05:35:25Z
  output: |
    expect(found).toEqual({}) ở tests/e2e/behavior.spec.ts:233
    Nhận được: { "dark confirm": ["color-contrast"] }
    2 ca đỏ: [360] và [414], cùng ca "no serious accessibility violations".

- eval: E14
  run_id: minted-hanh-vi-trong-luoi-khung-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui.capture
  verified_at: 2026-11-11T05:35:25Z
  screenshot: evidence/E14-step1.png
  observed: |
    step1 (1440 sáng): bảng bên trái, hồ sơ dính bên phải (x khoảng 992, rộng 448), đầu hồ sơ 'S2.02-0302' với Trước, Sau, Đóng; các trường Căn/Trạng thái/Giá/Diện tích/Phòng ngủ/Toà/Xác nhận lần cuối. step2 (lưới người): hồ sơ cùng vị trí, '[Tên] 01', Trước mờ vì dòng đầu, Sau, Đóng (đến được bằng cách bấm Đóng trước vì lớp chặn). step3 (360x800 tối): hồ sơ phủ toàn màn, tiêu đề S1.01-0201, chữ đọc được, huy hiệu 'Đang bán'. step4 (?state=error): vùng 'Căn mẫu', 'Vùng này chưa tải được', câu ba phần và nút 'Thử lại'; đầu vùng còn nút 'Thêm dòng' (nhỏ, ngoài thân lỗi). step5: hộp 'Bạn chắc muốn gỡ căn?', nêu việc sẽ xảy ra, nút 'Thôi' và 'Gỡ căn'.
  network_observed: no-app-traffic

- eval: E16
  run_id: minted-hanh-vi-trong-luoi-khung-E16-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-11T05:35:25Z
  output: |
    Sàn thiết kế bậc M1 không thấy mã màu hex thô.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-hanh-vi-trong-luoi-khung-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T05:35:25Z

### Judgment

- eval: E15
  judged_by: hội đồng ba góc nhìn (fresh context)
  proposal: PASS
  rationale: Ba góc nhìn cùng thấy bốn nhóm chữ (lỗi vùng, vùng một phần rỗng, chờ lâu, hộp xác nhận) đúng yêu cầu AC-5. Mốc 10 giây không nằm trong hai file hằng chữ nên hội đồng chỉ chấm nội dung câu.
  votes:
    - domain-correctness: PASS — GRID_COPY.error có tiêu đề, why (lỗi khi lấy dữ liệu) và nextNoRetry (tải lại trang), không nhắc «Thử lại». partialEmpty.why nói «Vùng này có dữ liệu nhưng lần tải vừa rồi hỏng», không nói chưa ai nhập. slow.withCancel nói «lâu hơn thường lệ» và mời bấm «Huỷ». FRAME_COPY.confirm.note bảo bạn đọc việc sẽ xảy ra trước khi bấm. Cả bốn nhóm gọi người dùng là «bạn», không có dấu chấm than, đúng design/language.md. Mốc 10 giây không nằm trong hai file hằng chữ nên chỉ chấm nội dung câu.
    - operational-feasibility: PASS — GRID_COPY.error có title, why và nextNoRetry («Bạn tải lại trang; nếu vẫn lỗi, mở lại màn này sau ít phút»), không nhắc «Thử lại». partialEmpty.why nói «có dữ liệu nhưng lần tải vừa rồi hỏng». slow.withCancel nói «lâu hơn thường lệ» và cho bấm «Huỷ». FRAME_COPY.confirm.note bảo «Bạn đọc kỹ việc sẽ xảy ra dưới đây trước khi bấm». Cả bốn dùng «bạn» (language.md mục 5), không có dấu chấm than. Chỉ chấm câu chữ, không chấm mốc 10 giây.
    - spec-alignment: PASS — `error` có tiêu đề, `why` và `nextNoRetry`, và `nextNoRetry` không nhắc «Thử lại». `partialEmpty.why` nói "Vùng này có ddữ liệu nhưng lần tải vừa rồi hỏng…" và không nói chưa ai nhập. `slow.withCancel` nói "Vẫn đang tải, lâu hơn thường lệ" và cho biết có thể bấm «Huỷ»; mốc 10 giây là hành vi chứ không phải chữ. `FRAME_COPY.confirm.note` bảo bạn đọc kỹ việc sẽ xảy ra trước khi bấm. Cả bốn dùng «bạn» theo `design/language.md` mục 5, không có dấu chấm than.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh khung kiểm chứ không chứng minh tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- Lệnh `make test`: E1, E2, E3, E4, E5, E6, E7, E8, E9
- Lệnh `make check`: E10
- Lệnh design-floor-s4 (sàn thiết kế): E16

Ba eval E11, E12, E13 đều red trên baseline, nghĩa là có phân biệt.

## Variance

none — mọi eval chạy nhiều lần đều đồng đều (mọi eval chạy một lần, tất định).

## Iterations

Round 1: lịch sử round 1 nằm trong round cũ, không có trong dữ liệu của round này.
Round 2: E11, E12, E13 chưa đạt — lệnh make e2e có 2 ca đỏ ở bài quét trợ năng, cảnh "dark confirm" bị báo color-contrast; ba eval cùng lệnh nên ghi chung. Trả về triển khai.
