---
schema_version: 2
feature_slug: sua-tren-o
verdict: REJECT
failed_evals: ["E2-ui"]
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: d87dcccaed4e63897b21c618db46eaff7608827d
human_signoff:
---

# Evidence Report: sua-tren-o

Round 2. Nội dung thay toàn bộ round cũ; lịch sử nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E1b | AC-1 | judgment | PASS (đề xuất của hội đồng, chờ người) |
| E2 | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | FAIL |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4-e2e | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E5-e2e | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E7-ui | AC-7 | ui-check | PASS |
| E8 | AC-8 | test | PASS |
| E8-e2e | AC-8 | test | PASS |
| E9 | AC-9 | test | PASS |
| E10 | AC-10 | test | PASS |
| E10b | AC-10 | script | PASS |
| E10c | AC-10 | judgment | PASS (đề xuất của hội đồng, chờ người) |
| E11 | AC-2 | test | PASS |
| E12 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-sua-tren-o-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:36:10Z
  output: |
    npx vitest run src/modules/listings/edit-rules.test.ts src/modules/listings/save-door.test.ts src/components/candidate/use-change.test.tsx src/components/candidate/data-region-cell-edit.test.tsx (1 lần chạy, qua)

- eval: E4
  run_id: minted-sua-tren-o-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh vitest với E1 (1 lần chạy, qua)

- eval: E5
  run_id: minted-sua-tren-o-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh vitest với E1 (1 lần chạy, qua)

- eval: E7
  run_id: minted-sua-tren-o-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh vitest với E1 (1 lần chạy, qua)

- eval: E8
  run_id: minted-sua-tren-o-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh vitest với E1 (1 lần chạy, qua)

- eval: E2
  run_id: minted-sua-tren-o-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    npx playwright test tests/e2e/sua-tren-o.spec.ts tests/e2e/sheet.spec.ts tests/e2e/ho-so-can.spec.ts
    164 passed (1.2m)

- eval: E3
  run_id: minted-sua-tren-o-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E4-e2e
  run_id: minted-sua-tren-o-E4-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E5-e2e
  run_id: minted-sua-tren-o-E5-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E6
  run_id: minted-sua-tren-o-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E8-e2e
  run_id: minted-sua-tren-o-E8-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E9
  run_id: minted-sua-tren-o-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E11
  run_id: minted-sua-tren-o-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_e2e
  verified_at: 2026-11-13T10:36:10Z
  output: |
    Cùng lệnh playwright với E2: 164 passed (1.2m)

- eval: E10
  run_id: minted-sua-tren-o-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.sua_tren_o_rao
  verified_at: 2026-11-13T10:36:10Z
  output: |
    npx vitest run tests/behavior-guard.test.ts (1 lần chạy, qua)

- eval: E10b
  run_id: minted-sua-tren-o-E10b-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-13T10:36:10Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E12
  run_id: minted-sua-tren-o-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T10:36:10Z
  output: |
    design-floor-khuon.mjs --kiem --root .
    12 tệp giao diện ngoài bản đồ

- eval: E2-ui
  run_id: minted-sua-tren-o-E2-ui-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T10:36:10Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    Đã mở 8 khung bằng Read. Ở 1440 (sáng và tối) khung sửa «2,8 tỷ» nằm đúng trên ô Giá chào của căn 1101/1303, gợi ý «Hiểu là: 2.800.000.000 ₫ (2,8 tỷ)» mở bên dưới, không che ô đang sửa; Enter ở 1440 sáng ghi được, ô hiện 2,8 tỷ, Xác nhận lúc đổi, thông báo có Hoàn tác.
    Ở 1024 (sáng và tối) khung sửa nằm ở x khoảng 659 trong khi ô Giá chào ở x khoảng 882-978 cùng dòng: khung lệch khoảng 223px sang trái, đè một phần nhãn Trạng thái; sau Enter khung nhảy sang x khoảng 818. Ở 1024 tối, gợi ý bị cắt ở chân lưới và thẻ hỏi lại che chữ ở chân. Kỳ vọng «mọi khung khớp» không đạt ở 1024.
  network_observed: no-app-traffic

- eval: E7-ui
  run_id: minted-sua-tren-o-E7-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T10:36:10Z
  screenshot: evidence/E7-1440-sang.png
  observed: |
    Đã mở 4 khung bằng Read (E7-1440-sang, E7-1440-toi-sau-10s, E7-1024-sang-sau-10s, E7-1024-toi). Thông báo «Chưa hoàn tác được vì mất kết nối mạng. Căn 1101 vẫn là 2,8 tỷ; có mạng lại thì bấm «Thử lại».» đứng yên sau 10 giây, có nút Thử lại; ô Giá chào của 1101 hiện 2,8 tỷ (2,8 ở 1024 do cột hẹp), khớp lời báo; chủ đề tối áp đúng, có băng «Mất kết nối mạng».
    Bốn khung còn lại không mở bằng Read; chữ thông báo và giá trị ô của chúng do kịch bản đọc từ DOM và khớp các khung đã xem.
  network_observed: no-app-traffic

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-sua-tren-o-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T10:36:10Z

- cmd: make e2e
  run_id: minted-sua-tren-o-SUITE-make_e2e-r2
  exit_code: 2
  verified_at: 2026-11-13T10:36:10Z

Lệnh `make e2e` hỏng, không gắn eval nào. Kết quả: 903 qua, 660 bỏ qua, 1 hỏng. Ca hỏng là bộ khung chung ở 1440, màn inventory, vùng «vung chu-dai», báo «chu-dai: khong co o chu dai bi cat» (tools/e2e_templates/recipes.ts:62). Không eval nào của hợp đồng trỏ vào lệnh này nên nó không đổi danh sách eval hỏng, nhưng cần người xem.

### Hội đồng chấm (đề xuất, để trống human_override)

- eval: E1b
  judged_by: judge panel (3 lens, fresh context)
  proposal: PASS
  votes:
    - domain-correctness: PASS — edit-rules.ts chứa đủ readPrice, ngưỡng 20%, bảng 12 nấc, statusNeeds; giao diện chỉ gọi, không tự đặt luật.
    - operational-feasibility: PASS — không dòng nào trong giao diện tự so số với ngưỡng hay tự liệt kê nấc; chỉ lưu ý thứ tự lý do ngừng nằm ở tệp ngoài danh sách.
    - spec-alignment: PASS — luật xuất qua index.ts, giao diện và lưới chỉ import; phần còn lại là ngày chốt mặc định và làm tròn để hiển thị.
  human_override:  # chi nguoi ghi

- eval: E10c
  judged_by: judge panel (3 lens, fresh context)
  proposal: PASS
  votes:
    - domain-correctness: PASS — đủ nhãn Lý do ngừng và ba lý do theo khuyến nghị Hỏi-2, không nhãn nào quá 17 ký tự, glossary ghi là khái niệm riêng.
    - operational-feasibility: PASS — không có dòng gate1 trả lời Hỏi-2 nên theo khuyến nghị; nhãn dài nhất 17 ký tự.
    - spec-alignment: PASS — ba lý do không có «Khác», các nhãn đều không quá 17 ký tự, glossary ghi «Riêng của ta; RESO DD 2.1 không có trường này».
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml không đổi từ lần đo baseline cuối (round 1); mọi block eval ghi baseline n-a.

Eval không phân biệt (xanh cả trên HEAD lẫn baseline), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:
- E10 (npx vitest run tests/behavior-guard.test.ts)
- E12 (design-floor-khuon.mjs --kiem --root .)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: các phát hiện của vòng review được sửa (sổ khoá, ngày chốt theo giờ Việt Nam, luật lấy từ edit-rules, bài kiểm đo đường ghi thật).
Round 2: E2-ui không đạt — ở khổ 1024 khung sửa giá lệch khoảng 223px khỏi ô Giá chào, đè nhãn Trạng thái và nhảy vị trí sau Enter; ca e2e của E2 xanh nhưng không đo vị trí khung. Ngoài ra `make e2e` hỏng một ca khung chung (vung chu-dai, 1440). Trả về triển khai.
