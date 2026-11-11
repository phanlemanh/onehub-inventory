---
schema_version: 2
feature_slug: bo-bai-kiem-tu-so-man
verdict: BLOCKED
failed_evals: []
reason: |
  E9: lệnh chạy thật (không bị công cụ giết, không timeout) nhưng Playwright dừng ngay lúc khởi động webServer vì cổng 127.0.0.1:3892 đã bị một tiến trình khác chiếm. Không suite nào được chạy, nên không có kết quả PASS hay FAIL. Cần người dùng đóng tiến trình đang giữ cổng 3892 (hoặc giải phóng cổng) rồi chạy lại lệnh đã ghim. Lệnh: E2E_CPU_THROTTLE=4 npx playwright test tests/e2e/screens --project=1440 --retries=0
  Lệnh suite make e2e: không khởi động được bài nào, vì webServer của Playwright báo http://127.0.0.1:3892 đã được dùng bởi tiến trình khác; chưa có kết quả e2e hợp lệ cho tới khi cổng được giải phóng hoặc đặt reuseExistingServer.
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: eb9f7a1c9cd3fbb4e4829312ed71205a070376ff
human_signoff:
---

# Evidence Report: bo-bai-kiem-tu-so-man

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | BLOCKED |
| E10 | AC-10 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bo-bai-kiem-tu-so-man-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1

- eval: E2
  run_id: minted-bo-bai-kiem-tu-so-man-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1

- eval: E3
  run_id: minted-bo-bai-kiem-tu-so-man-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_e2e
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx playwright test tests/e2e/screens
    208 passed (47.5s)

- eval: E4
  run_id: minted-bo-bai-kiem-tu-so-man-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_e2e
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx playwright test tests/e2e/screens
    208 passed (47.5s)

- eval: E5
  run_id: minted-bo-bai-kiem-tu-so-man-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T08:28:26Z
  output: |
    make test
    runs: 1, passes: 1

- eval: E6
  run_id: minted-bo-bai-kiem-tu-so-man-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_e2e
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx playwright test tests/e2e/screens
    208 passed (47.5s)

- eval: E7
  run_id: minted-bo-bai-kiem-tu-so-man-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_e2e
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx playwright test tests/e2e/screens
    208 passed (47.5s)

- eval: E8
  run_id: minted-bo-bai-kiem-tu-so-man-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_e2e
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx playwright test tests/e2e/screens
    208 passed (47.5s)

- eval: E9
  run_id: minted-bo-bai-kiem-tu-so-man-E9-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.man_e2e_cham
  verified_at: 2026-11-11T08:28:26Z
  output: |
    E2E_CPU_THROTTLE=4 npx playwright test tests/e2e/screens --project=1440 --retries=0
    Error: http://127.0.0.1:3892 is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer.
    BLOCKED: không suite nào chạy; cổng 3892 bị tiến trình khác chiếm.

- eval: E10
  run_id: minted-bo-bai-kiem-tu-so-man-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-11T08:28:26Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-11T08:28:26Z
  note: không gắn eval nào; bước lint báo 200 vấn đề (189 lỗi, 11 cảnh báo), phần lớn là no-undef ('args', 'log', 'phase' chưa khai báo) ở một tệp có hơn 2000 dòng; make dừng ở bước lint.

- cmd: npm run build
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-11T08:28:26Z

- cmd: make e2e
  run_id: minted-bo-bai-kiem-tu-so-man-SUITE-make_e2e-r1
  exit_code: 1
  verified_at: 2026-11-11T08:28:26Z
  note: không gắn eval nào; webServer của Playwright báo cổng 127.0.0.1:3892 đã bị chiếm, chưa chạy bài nào.

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code hiện tại lẫn baseline): E5 (make test), nên xem là regression-guard có chủ ý hoặc viết lại để khẳng định hành vi mới.

Baseline khong do
- npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tools/e2e_templates co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi
- npx playwright test tests/e2e/screens: bo qua baseline: tep tests/e2e/screens co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi
- E2E_CPU_THROTTLE=4 npx playwright test tests/e2e/screens --project=1440 --retries=0: bo qua baseline: tep tests/e2e/screens co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi

Judge panels: không có eval nào thuộc loại judgment; không có panel nào cần đề xuất.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E9 bị chặn (BLOCKED) vì cổng 3892 đang bị tiến trình khác chiếm; make check dừng ở bước lint (200 vấn đề, chủ yếu no-undef); make e2e không khởi động được vì cùng lý do cổng. Chờ người giải phóng cổng rồi chạy lại.
