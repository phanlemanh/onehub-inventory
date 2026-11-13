---
schema_version: 2
feature_slug: ho-so-du-thong-tin
verdict: REJECT
failed_evals: ["E1","E2","E3","E4","E5","E6","E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b506b6e935e137299e2a2096d01191a3b9843033
human_signoff:
---

# Evidence Report: ho-so-du-thong-tin

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | REJECT |
| E2 | AC-2 | test | REJECT |
| E3 | AC-3 | test | REJECT |
| E4 | AC-4 | test | REJECT |
| E5 | AC-5 | test | REJECT |
| E6 | AC-6 | test | REJECT |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | ui-check | REJECT |
| E11 | AC-8 | script | PASS |
| E12 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-ho-so-du-thong-tin-E1-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.check
  verified_at: 2026-11-13T11:11:03Z
  output: |
    make check dừng ở bước lint. ESLint: 0 lỗi, 4 cảnh báo (account-menu.tsx, identity/config.test.ts, bo-nut-members.spec.ts, sheet.spec.ts).
    Prettier --check báo định dạng sai ở hai tệp: _e10run.mjs và .claude/launch.json (cả hai chưa commit, không thuộc tính năng).
    make: lint báo lỗi nên các bước sau (ontology, gen, bài tests/ho-so-du-thong-tin.test.ts qua check) không được xác nhận trong lượt này.

- eval: E2
  run_id: minted-ho-so-du-thong-tin-E2-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:11:03Z
  output: |
    make test: Test Files 4 failed | 72 passed (76); Tests 6 failed | 1388 passed (1394).
    Sáu bài đỏ đều là quá thời gian 5000ms, gồm tools/proof_gate/proof-gate-0023.test.ts, tools/reui_catalog/catalog.test.mjs và một bài cột trong bảng hàng.
    Lệnh chung cho E2 đến E6 nên cả nhóm bị tính đỏ.

- eval: E3
  run_id: minted-ho-so-du-thong-tin-E3-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:11:03Z
  output: |
    Cùng lệnh make test với E2: 6 bài quá thời gian, 1388 bài qua.

- eval: E4
  run_id: minted-ho-so-du-thong-tin-E4-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:11:03Z
  output: |
    Cùng lệnh make test với E2: 6 bài quá thời gian, 1388 bài qua.

- eval: E5
  run_id: minted-ho-so-du-thong-tin-E5-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:11:03Z
  output: |
    Cùng lệnh make test với E2: 6 bài quá thời gian, 1388 bài qua.

- eval: E6
  run_id: minted-ho-so-du-thong-tin-E6-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:11:03Z
  output: |
    Cùng lệnh make test với E2: 6 bài quá thời gian, 1388 bài qua.

- eval: E7
  run_id: minted-ho-so-du-thong-tin-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:11:03Z
  output: |
    make e2e: 903 passed (8.1m)

- eval: E8
  run_id: minted-ho-so-du-thong-tin-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:11:03Z
  output: |
    make e2e: 903 passed (8.1m)

- eval: E9
  run_id: minted-ho-so-du-thong-tin-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T11:11:03Z
  output: |
    make e2e: 903 passed (8.1m)

- eval: E10
  run_id: E10-ui-verify
  exit_code: 1
  baseline: n-a
  verifier: scripts/verify-ui-login.sh
  verified_at: 2026-11-13T11:11:03Z
  screenshot: evidence/E10-step1.png
  observed: |
    step1 (1440 sáng): đầu hồ sơ 0905 · S1.01, thẻ căn (5,71 tỷ, Đang giao dịch, Diện tích 96,8 m² · Phòng ngủ 3 · Hướng Nam), câu xác nhận, Mức đủ thông tin 5/5, khối Căn, khối Lần chào đang mở; tiêu đề «Các lần chào của căn · 3» chỉ lộ một dải bị cắt ở mép dưới, không có dòng nào. Thứ tự đúng, không chồng chữ, không tràn ngang.
    step2 ở 1024: cùng chồng khối đến Lần chào đang mở, mục Các lần chào không hiện; ảnh tối đọc được. Ở 414 và 360: thẻ căn ở đầu, mục Các lần chào chỉ là tiêu đề bị cắt; ở 360 tiêu đề đầu hồ sơ xuống hai dòng và huy hiệu tròn «N» của máy chủ dev che nhãn «Tài chính».
    step3 (1440 sáng, sau Lần 1): hồ sơ cuộn qua thẻ căn nên không đọc được từ trên xuống; có dải «Đang xem lần chào cũ · Lần 1», Tài chính «Chưa có» nhạt nghiêng, mục Các lần chào hiện Lần 3 và Lần 2 còn dòng Lần 1 bị cắt; giá và ngày xuống dòng lẻ có dấu chấm đầu dòng.
    So với expected: thứ tự và không tràn ngang đạt, nhưng mục Các lần chào thiếu hoặc bị cắt ở hầu hết ảnh và chữ bị che ở 360, nên E10 không đạt.
  network_observed: n-a (driver)

- eval: E11
  run_id: minted-ho-so-du-thong-tin-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T11:11:03Z
  output: |
    6 tệp giao diện ngoài bản đồ

- eval: E12
  run_id: minted-ho-so-du-thong-tin-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T11:11:03Z
  output: |
    (không có dòng lỗi)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-ho-so-du-thong-tin-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-13T11:11:03Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả mã cũ lẫn mã mới, chứng minh bộ đo chứ không chứng minh tính năng): E11 và E12. Hai eval này là lưới hồi quy của sàn thiết kế; cần viết lại để khẳng định hành vi mới hoặc xác nhận là lưới có chủ ý.

Ghi chú: E2 đến E6 chạy chung một lệnh make test, trên mã cũ lệnh ấy xanh (baseline green) còn ở mã mới đỏ do sáu bài quá thời gian; bài của tính năng không được tách riêng trong lượt này.

Baseline không đo: E10 (eval ui-check, không chạy được trên mã cũ).

Lệnh đỏ không gắn riêng eval nào: không có; ba lệnh đỏ (make check, make test, ui-check E10) đều đã gắn với eval ở trên.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E1, E2, E3, E4, E5, E6, E10 failed — make check đỏ ở lint (định dạng hai tệp ngoài tính năng), make test có sáu bài quá thời gian 5000ms, E10 thấy mục Các lần chào bị cắt hoặc vắng trong ảnh và chữ bị che ở 360. Returned to implementation.
