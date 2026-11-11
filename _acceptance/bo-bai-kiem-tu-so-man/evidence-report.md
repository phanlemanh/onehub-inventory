---
schema_version: 2
feature_slug: bo-bai-kiem-tu-so-man
verdict: REJECT
failed_evals: ["E3","E4","E6","E7","E8","E9"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2f71ee542aea79afda5170c2d6f6efc5e20990d4
human_signoff:
---

# Evidence Report: bo-bai-kiem-tu-so-man

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | FAIL |
| E4 | AC-4 | script | FAIL |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | FAIL |
| E7 | AC-7 | script | FAIL |
| E8 | AC-8 | script | FAIL |
| E9 | AC-9 | script | FAIL |
| E10 | AC-10 | script | PASS |

Lệnh `make e2e` (phủ E3, E4, E6, E7, E8, E9) thoát khác 0: 511 bài đạt, 1 bài đỏ, 472 bài bị bỏ qua. Bài đỏ duy nhất là `tests/e2e/screens/screens.spec.ts:136` — vùng hiệu chuẩn, ca `cho-tai`, khổ 414, thông điệp "cho-tai: khong co khung cho sau 1 giay" (recipes.ts:50, gọi từ recipes.ts:312). Vì cả sáu eval dùng chung một lệnh, cả sáu bị tính đỏ. Không có lệnh fail nào ngoài `make e2e`.

## Evidence

- eval: E1
  run_id: minted-bo-bai-kiem-tu-so-man-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T08:45:41Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    (lệnh chung với E2 và E10, một lượt chạy, toàn bộ đạt)

- eval: E2
  run_id: minted-bo-bai-kiem-tu-so-man-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T08:45:41Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    (lệnh chung với E1 và E10, một lượt chạy, toàn bộ đạt)

- eval: E3
  run_id: minted-bo-bai-kiem-tu-so-man-E3-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T08:45:41Z
  output: |
    1) [414] › tests/e2e/screens/screens.spec.ts:136:7 › vung hieu-chuan › vung › vung cho-tai
       Error: cho-tai: khong co khung cho sau 1 giay
       at ../../tools/e2e_templates/recipes.ts:50
    1 failed, 472 skipped, 511 passed (3.8m)
    make: *** [e2e] Error 1

- eval: E4
  run_id: minted-bo-bai-kiem-tu-so-man-E4-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T08:45:41Z
  output: |
    (cùng lượt make e2e với E3)
    1 failed, 472 skipped, 511 passed (3.8m)
    make: *** [e2e] Error 1

- eval: E5
  run_id: minted-bo-bai-kiem-tu-so-man-E5-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T08:45:41Z
  output: |
    make test: toàn bộ đạt

- eval: E6
  run_id: minted-bo-bai-kiem-tu-so-man-E6-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T08:45:41Z
  output: |
    (cùng lượt make e2e với E3)
    Bài đỏ: vung hieu-chuan › vung › vung cho-tai, khổ 414
    make: *** [e2e] Error 1

- eval: E7
  run_id: minted-bo-bai-kiem-tu-so-man-E7-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T08:45:41Z
  output: |
    (cùng lượt make e2e với E3)
    Bài đỏ: cho-tai: khong co khung cho sau 1 giay
    make: *** [e2e] Error 1

- eval: E8
  run_id: minted-bo-bai-kiem-tu-so-man-E8-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T08:45:41Z
  output: |
    (cùng lượt make e2e với E3)
    1 failed, 472 skipped, 511 passed (3.8m)
    make: *** [e2e] Error 1

- eval: E9
  run_id: minted-bo-bai-kiem-tu-so-man-E9-r2
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T08:45:41Z
  output: |
    (cùng lượt make e2e với E3)
    bản chậm 'cham' ở khổ 1440 đạt các bài đã chạy; lượt lệnh vẫn đỏ vì bài cho-tai khổ 414
    make: *** [e2e] Error 1

- eval: E10
  run_id: minted-bo-bai-kiem-tu-so-man-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T08:45:41Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    (lệnh chung với E1 và E2, một lượt chạy, toàn bộ đạt)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-11T08:45:41Z

- cmd: npm run build
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T08:45:41Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): E5 (`make test`) — hồi quy giữ nguyên, cần xác nhận là regression-guard có chủ ý hoặc viết lại để khẳng định hành vi mới.

Baseline khong do
- npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tools/e2e_templates co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, không có phương sai.

## Iterations

Round 1: lịch sử round 1 không nằm trong dữ liệu của round này.
Round 2: E3, E4, E6, E7, E8, E9 failed — một bài đỏ duy nhất trong `make e2e`: vùng `cho-tai` ở khổ 414 không thấy khung chờ trong 1 giây (recipes.ts:312). Returned to implementation.
