---
schema_version: 2
feature_slug: dat-khoa-mot-lenh
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ece85f767ec13b160d83fc1ced33812c8f77445b
human_signoff:
---

# Evidence Report: dat-khoa-mot-lenh

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E8b | AC-8 | test | PASS |
| E9 | AC-9 | judgment | PENDING-JUDGMENT (hội đồng đề xuất PASS, chờ người chốt) |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dat-khoa-mot-lenh-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dat_khoa
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy/dat-khoa.test.ts --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E2
  run_id: minted-dat-khoa-mot-lenh-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dat_khoa
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy/dat-khoa.test.ts --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E3
  run_id: minted-dat-khoa-mot-lenh-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dat_khoa
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy/dat-khoa.test.ts --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E4
  run_id: minted-dat-khoa-mot-lenh-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E4b
  run_id: minted-dat-khoa-mot-lenh-E4b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dk_vai_db
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/mat-khau-vai-dang-nhap.db.test.ts --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E5
  run_id: minted-dat-khoa-mot-lenh-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E6
  run_id: minted-dat-khoa-mot-lenh-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E7
  run_id: minted-dat-khoa-mot-lenh-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.deploy_kiem
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E8
  run_id: minted-dat-khoa-mot-lenh-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dk_so_tay
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tools/deploy/so-tay-khop.test.ts --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E8b
  run_id: minted-dat-khoa-mot-lenh-E8b-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.van_hanh
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: npx vitest run tests/van-hanh.test.ts --coverage.enabled=false --reporter=verbose
    lượt chạy: 1, đạt: 1, không dao động. Lệnh kết thúc thành công.

- eval: E10
  run_id: minted-dat-khoa-mot-lenh-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-22T00:16:15Z
  output: |
    cmd: make check
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dat-khoa-mot-lenh-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-22T00:16:15Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-dat-khoa-mot-lenh-SUITE-DATABASE_URL_make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-22T00:16:15Z

### Phán đoán (E9)

Đề xuất panel (ba lens, cùng đề xuất PASS). Đây chỉ là ý kiến của máy; người quyết ở Cổng 2.

- domain-correctness: PASS — Phần chủ kho trong README (việc 4–9, 11, 12) chỉ gồm việc cần tài khoản của chủ kho, và mỗi việc có «Đạt khi» và «Đỏ thì». Phần máy (1–3, 10, 13) được tách bằng bảng «Ai» và nhãn ở từng việc. Mục «Infrastructure standing permission» trong AGENTS.md có đủ năm điều cấm, và danh sách được làm không cho đổi, bỏ hay thêm người duyệt production. Danh sách ấy khớp README và spec: cùng bộ biến, người duyệt chỉ đặt một lần, `DEPLOY_ENABLED` chỉ bật sau khi `deploy.yml` đã gộp. Có các lệch nhỏ, không làm sai quyền hạn. README việc 1 dẫn «Hỏi-1» mà người chưa biết kho không tra được. Spec ghi cờ `--xoay` còn README ghi `XOAY=1`. AGENTS.md cấm thêm «domain, environment», rộng hơn spec. Việc 3 đặt `APP_URL` và `MAIL_FROM` mà không ghi giá trị cho bản thử.
- operational-feasibility: PASS — Việc 4–9, 11, 12 của chủ kho đều cần tài khoản của chủ kho, và mỗi việc có «Đạt khi» và «Đỏ thì». Phần máy (1–3, 10, 13) tách bằng bảng «Ai», và việc 3 giữ người duyệt `production` là chủ kho, đặt một lần. Mục «Infrastructure standing permission» ở AGENTS.md dòng 147–175 có đủ năm điều cấm, khớp với bản thiết kế. Danh sách được làm không cho đổi, bỏ hay thêm người duyệt, và không mâu thuẫn với năm điều cấm. AGENTS.md còn cấm chặt hơn thiết kế ở chỗ xoá miền và môi trường, nhưng chỗ này không lệch.
- spec-alignment: PASS — Trong docs/van-hanh/README.md, bảng «Việc ngoài kho» giao chủ kho các việc 4–9, 11, 12 (tạo khoá, `make dat-khoa`, dán `deploy.yml`, tạo Quản trị sàn đầu, duyệt bản thật). Việc nào cũng có «Đạt khi» và «Đỏ thì», và máy làm riêng các việc 1–3, 10, 13. Mục «Infrastructure standing permission» trong AGENTS.md liệt kê đúng các việc máy được làm không hỏi và đủ năm điều cấm. Danh sách được làm không cho đổi, bỏ hay thêm người duyệt production, nên không mâu thuẫn với điều cấm. Cả ba tệp khớp nhau.

- eval: E9
  judged_by: judge panel ba lens (fresh context)
  proposal: PASS
  rationale: Ba lens cùng đề xuất PASS, không có ý kiến trái. Các lệch nhỏ đã nêu ở lens domain-correctness (dẫn «Hỏi-1», cờ `--xoay` so với `XOAY=1`, AGENTS.md cấm rộng hơn spec, thiếu giá trị `APP_URL` và `MAIL_FROM` cho bản thử) không làm sai quyền hạn nhưng người nên xem.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ chưa chứng minh tính năng; xác nhận là regression-guard có chủ ý hoặc viết lại để assert hành vi mới):
- E4, E5, E6, E7: cmd `npx vitest run tools/deploy --coverage.enabled=false --reporter=verbose`
- E8b: cmd `npx vitest run tests/van-hanh.test.ts --coverage.enabled=false --reporter=verbose`
- E10: cmd `make check`

Baseline không đo
- npx vitest run tools/deploy/dat-khoa.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tools/deploy/dat-khoa.test.ts co o cay dang kiem nhung chua co o merge-base 63037a34e2f178ba4cf27ac28c2dbc07c4ff4c34 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx vitest run -c vitest.db.config.ts tests/db/mat-khau-vai-dang-nhap.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/mat-khau-vai-dang-nhap.db.test.ts co o cay dang kiem nhung chua co o merge-base 63037a34e2f178ba4cf27ac28c2dbc07c4ff4c34 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tools/deploy/so-tay-khop.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tools/deploy/so-tay-khop.test.ts co o cay dang kiem nhung chua co o merge-base 63037a34e2f178ba4cf27ac28c2dbc07c4ff4c34 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval máy đạt; E9 (judgment) chờ người chốt ở Cổng 2 nên verdict là PENDING-JUDGMENT. Chưa có round nào bị trả lại.
