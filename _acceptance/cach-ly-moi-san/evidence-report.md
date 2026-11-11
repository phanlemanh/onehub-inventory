---
schema_version: 2
feature_slug: cach-ly-moi-san
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1197da9b907ca3ebc161dfd3865ef101e016b937
human_signoff:
---

# Evidence Report: cach-ly-moi-san

Vòng 2. Cả chín eval máy đều đạt, nhưng verdict là REJECT vì bước phân loại phạm vi còn năm phát hiện nằm trong hợp đồng (AC-6 và AC-8) chưa được sửa. Chi tiết trong review-findings.md, mục "Trong hợp đồng".

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | test | PASS |
| E9 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-cach-ly-moi-san-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E2
  run_id: minted-cach-ly-moi-san-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E3
  run_id: minted-cach-ly-moi-san-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E4
  run_id: minted-cach-ly-moi-san-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E5
  run_id: minted-cach-ly-moi-san-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E6
  run_id: minted-cach-ly-moi-san-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E7
  run_id: minted-cach-ly-moi-san-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:08:09Z
  output: |
    make test: đạt (đuôi đầu ra chỉ có dòng kẻ ngăn)

- eval: E8
  run_id: minted-cach-ly-moi-san-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:08:09Z
  output: |
    make test: đạt (đuôi đầu ra chỉ có dòng kẻ ngăn)

- eval: E9
  run_id: minted-cach-ly-moi-san-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T03:08:09Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-cach-ly-moi-san-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-11T03:08:09Z

- cmd: npm run build
  run_id: minted-cach-ly-moi-san-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T03:08:09Z

- cmd: make e2e
  run_id: minted-cach-ly-moi-san-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-11T03:08:09Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong đổi từ lần đo baseline cuối (round 1), nên field baseline của từng eval ghi n-a.

Eval không phân biệt (xanh trên cả code mới lẫn baseline đã đo): E7, E8 (lệnh make test). Cần viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: chín eval đạt; make check đỏ vì tệp kịch bản chấm chép vào thư mục chạy của kho; ba phát hiện trong hợp đồng (luật mở lọt phép dò chuỗi ở AC-6, lời gọi có khai kiểu lọt bộ quét ở AC-8). Đã sửa ở commit 3136708.
Round 2: cả chín eval và ba lệnh suite đều đạt, nhưng REJECT vì còn năm phát hiện trong hợp đồng chưa sửa (AC-6: t1, t9, t11; AC-8: t2, t10). Cùng lớp lỗi với round 1 — dừng-vá, không tự chạy round 3.
