---
schema_version: 2
feature_slug: cach-ly-moi-san
verdict: REJECT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: f24ddc6a05b48ef277154dde9364c4cbf3becd8a
human_signoff:
---

# Evidence Report: cach-ly-moi-san

Lý do REJECT: lệnh suite `make check` không đạt (bước lint) và lệnh này không gắn eval nào, nên `failed_evals` để trống. Cả chín eval của hợp đồng đều đạt. Nguyên nhân lint nằm ở tệp sinh ra của lượt nghiệm thu, không phải mã của tính năng (xem review-findings.md).

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
  run_id: minted-cach-ly-moi-san-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E2
  run_id: minted-cach-ly-moi-san-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E3
  run_id: minted-cach-ly-moi-san-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E4
  run_id: minted-cach-ly-moi-san-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E5
  run_id: minted-cach-ly-moi-san-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E6
  run_id: minted-cach-ly-moi-san-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E7
  run_id: minted-cach-ly-moi-san-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T02:27:36Z
  output: |
    make test chạy xong, kết thúc thành công (phần cuối đầu ra chỉ là dòng kẻ ngăn cách).

- eval: E8
  run_id: minted-cach-ly-moi-san-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T02:27:36Z
  output: |
    make test chạy xong, kết thúc thành công (phần cuối đầu ra chỉ là dòng kẻ ngăn cách).

- eval: E9
  run_id: minted-cach-ly-moi-san-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T02:27:36Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-cach-ly-moi-san-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-11T02:27:36Z
  note: bước lint đỏ, 189 lỗi no-undef và 11 cảnh báo, toàn bộ ở tệp sinh ra .acceptance-runs/cach-ly-moi-san/acceptance-verify.js (git bỏ qua, ESLint không bỏ qua). Lệnh này không gắn eval nào.

- cmd: npm run build
  run_id: minted-cach-ly-moi-san-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-11T02:27:36Z

- cmd: make e2e
  run_id: minted-cach-ly-moi-san-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-11T02:27:36Z
  note: 16 ca đạt.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (đạt trên cả HEAD lẫn baseline):
- make test: E7, E8

Baseline khong do
- bash db/scripts/cach-ly.sh: bo qua baseline: tep db/scripts/cach-ly.sh co o cay dang kiem nhung chua co o merge-base c706223901220e35f8095854249c171294b79739 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, xác định, không có phương sai.

## Iterations

Round 1: chín eval đạt nhưng make check (lệnh suite không gắn eval) không đạt ở bước lint vì tệp sinh ra của lượt nghiệm thu; verdict REJECT.
