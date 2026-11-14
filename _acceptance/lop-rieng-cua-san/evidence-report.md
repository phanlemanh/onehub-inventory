---
schema_version: 2
feature_slug: lop-rieng-cua-san
verdict: REJECT
failed_evals: ["E15","E13"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 10f9e5618dc2cc59a751dd773f6f12b0c8e0932e
human_signoff:
---

# Evidence Report: lop-rieng-cua-san

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-8 | test | PASS |
| E11 | AC-8 | ui-check | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | ui-check | FAIL |
| E14 | AC-9 | script | PASS |
| E15 | AC-10 | script | FAIL |
| E16 | AC-10 | test | PASS |
| E17 | AC-8 | script | PASS |
| E18 | AC-9 | script | PASS |
| E19 | AC-11 | script | PASS |

Lệnh fail không gắn eval: không có. Hai lệnh fail đều gắn eval (make check gắn E15, ui-check E13 gắn E13).

## Evidence

- eval: E1
  run_id: minted-lop-rieng-cua-san-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/db/lop-rieng.db.test.ts chạy xanh trên Postgres dãy R (một lần chạy, không phương sai).

- eval: E2
  run_id: minted-lop-rieng-cua-san-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/db/lop-rieng.db.test.ts chạy xanh trên Postgres dãy R.

- eval: E3
  run_id: minted-lop-rieng-cua-san-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lop_rieng_unit
  verified_at: 2026-11-14T01:19:59Z
  output: |
    vitest: src/modules/company-config, tests/lop-rieng-ontology.test.ts, tests/lop-rieng-cot.test.ts xanh.

- eval: E4
  run_id: minted-lop-rieng-cua-san-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/db/lop-rieng.db.test.ts chạy xanh trên Postgres dãy R.

- eval: E5
  run_id: minted-lop-rieng-cua-san-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/db/lop-rieng.db.test.ts chạy xanh trên Postgres dãy R. Lưu ý: xem review-findings về độ chặt của khẳng định unit_key.

- eval: E6
  run_id: minted-lop-rieng-cua-san-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/db/lop-rieng.db.test.ts chạy xanh trên Postgres dãy R.

- eval: E7
  run_id: minted-lop-rieng-cua-san-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_r
  verified_at: 2026-11-14T01:19:59Z
  output: |
    cach-ly: 36 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E8
  run_id: minted-lop-rieng-cua-san-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_db
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/db/lop-rieng.db.test.ts chạy xanh trên Postgres dãy R.

- eval: E9
  run_id: minted-lop-rieng-cua-san-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-14T01:19:59Z
  output: |
    3 passed (38.7s)

- eval: E10
  run_id: minted-lop-rieng-cua-san-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lop_rieng_unit
  verified_at: 2026-11-14T01:19:59Z
  output: |
    vitest xanh cho ma trận kiểu trường sang kind cột.

- eval: E11
  run_id: minted-lop-rieng-cua-san-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T01:19:59Z
  screenshot: evidence/E11-step1.png
  observed: |
    Ở 1440 sáng, tiêu đề cột Block nằm đúng chỗ Toà (giá trị S1.01, S1.02); kéo đến cuối lưới thì Hướng view và Ghi chú theo sau Xác nhận lúc, giá trị Hồ, Phố, Công viên và "Chủ cần bán nhanh" đọc được, không cắt.
    Nền tối chữ sáng rõ, huy hiệu trạng thái đọc được; ở 1024, 414 và 360 cột ghim giữ chỗ, phần còn lại cuộn ngang, không vỡ. Nhận xét nhỏ: vài vạch mảnh cạnh cột ghim ở nền tối, không ảnh hưởng đọc.
  network_observed: n-a (driver)

- eval: E12
  run_id: minted-lop-rieng-cua-san-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-14T01:19:59Z
  output: |
    3 passed (38.7s)

- eval: E13
  run_id: minted-lop-rieng-cua-san-E13-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T01:19:59Z
  screenshot: evidence/E13-step1.png
  observed: |
    Ở 1024 và 1440, cột thứ hai "Tuỳ chỉnh của sàn" liệt kê đủ năm phần (Nhãn riêng, Trường riêng, Từ điển giá trị, Căn chờ khớp, Mẫu nhập); trạng thái rỗng ở Mẫu nhập nói lý do và chỉ đường nhập; chỉ vùng Lưới cuộn ngang, không chữ đè.
    Ở 360 và 414 không thấy cột thứ hai, ngăn trượt đóng và không có nút mở, nên năm phần không được liệt kê, trái với expected. Ngoài ra ở 1024 giá trị "Hồ, Phố, Công viên, Nội khu" bị cắt không có dấu «…» và biểu tượng ghim ở tiêu đề bị cạnh ô che một phần. Ảnh tối 414, 1024 chưa được mở đọc.
  network_observed: n-a (driver)

- eval: E14
  run_id: minted-lop-rieng-cua-san-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T01:19:59Z
  output: |
    vitest tools/proof_gate xanh.

- eval: E15
  run_id: minted-lop-rieng-cua-san-E15-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T01:19:59Z
  output: |
    npm run lint: eslint 0 lỗi, 4 cảnh báo ở tệp ngoài tính năng (account-menu.tsx, config.test.ts, bo-nut-members.spec.ts, sheet.spec.ts).
    prettier --check báo lỗi định dạng ở .claude/launch.json (tệp đang sửa dở, chưa commit); make dừng ở bước lint nên các bước sau không chạy.

- eval: E16
  run_id: minted-lop-rieng-cua-san-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.lop_rieng_unit
  verified_at: 2026-11-14T01:19:59Z
  output: |
    tests/lop-rieng-ontology.test.ts xanh.

- eval: E17
  run_id: minted-lop-rieng-cua-san-E17-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T01:19:59Z
  output: |
    17 tệp giao diện ngoài bản đồ

- eval: E18
  run_id: minted-lop-rieng-cua-san-E18-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-14T01:19:59Z
  output: |
    sàn thiết kế không báo mã màu thô.

- eval: E19
  run_id: minted-lop-rieng-cua-san-E19-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-14T01:19:59Z
  output: |
    3 passed (38.7s)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-lop-rieng-cua-san-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T01:19:59Z

- cmd: make e2e
  run_id: minted-lop-rieng-cua-san-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-14T01:19:59Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không phải tính năng; viết lại để khẳng định hành vi mới hoặc xác nhận là regression-guard có chủ ý): E14, E17, E18.

Nguyên nhân REJECT:
- E15: make check dừng ở bước lint vì prettier báo tệp .claude/launch.json chưa định dạng (thay đổi chưa commit trong cây làm việc). Bốn cảnh báo eslint là cảnh báo, không phải lỗi. Cần định dạng hoặc loại tệp này rồi chạy lại make check.
- E13: ảnh khổ điện thoại (360, 414) không có cột thứ hai hay ngăn trượt liệt kê năm phần, trái với expected. Cần thêm lối mở ngăn trượt ở khổ nhỏ rồi chụp lại.

Baseline không đo:
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx vitest run -c vitest.db.config.ts tests/db/lop-rieng.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/lop-rieng.db.test.ts co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run src/modules/company-config tests/lop-rieng-ontology.test.ts tests/lop-rieng-cot.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/lop-rieng-ontology.test.ts co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/lop-rieng.spec.ts: bo qua baseline: tep tests/e2e-db/lop-rieng.spec.ts co o cay dang kiem nhung chua co o merge-base d7c8f5d391a95fe1f7721bc38bb4145024667b37 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E15, E13 failed — make check dừng ở lint do prettier báo .claude/launch.json chưa định dạng; ảnh khổ điện thoại thiếu cột thứ hai/ngăn trượt năm phần. Returned to implementation.
