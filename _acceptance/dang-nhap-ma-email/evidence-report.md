---
schema_version: 2
feature_slug: dang-nhap-ma-email
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e4829d9735098c43fb39ab51a62eb130bf226366
human_signoff:
---

# Evidence Report: dang-nhap-ma-email

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-7 | script | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-8 | script | PASS |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | script | PASS |
| E16 | AC-9 | script | PASS |
| E17 | AC-10 | script | PASS |
| E18 | AC-10 | ui-check | PASS |
| E19 | AC-2 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dang-nhap-ma-email-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E2
  run_id: minted-dang-nhap-ma-email-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: make test
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E3
  run_id: minted-dang-nhap-ma-email-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E4
  run_id: minted-dang-nhap-ma-email-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E5
  run_id: minted-dang-nhap-ma-email-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E6
  run_id: minted-dang-nhap-ma-email-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E7
  run_id: minted-dang-nhap-ma-email-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts
    32 passed (57.9s)

- eval: E8
  run_id: minted-dang-nhap-ma-email-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E9
  run_id: minted-dang-nhap-ma-email-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E10
  run_id: minted-dang-nhap-ma-email-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts
    32 passed (57.9s)

- eval: E11
  run_id: minted-dang-nhap-ma-email-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E12
  run_id: minted-dang-nhap-ma-email-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts
    32 passed (57.9s)

- eval: E13
  run_id: minted-dang-nhap-ma-email-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: make e2e
    195 passed (1.0m)

- eval: E14
  run_id: minted-dang-nhap-ma-email-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: bash db/scripts/cach-ly.sh
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E15
  run_id: minted-dang-nhap-ma-email-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    runs: 1, passes: 1, no variance. Command finished clean.

- eval: E16
  run_id: minted-dang-nhap-ma-email-E16-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E17
  run_id: minted-dang-nhap-ma-email-E17-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts
    32 passed (57.9s)

- eval: E18
  run_id: minted-dang-nhap-ma-email-E18-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:58:01Z
  screenshot: evidence/E18-step1.png
  observed: |
    step1 (email, 1440 light): small card centred on the page with the title Đăng nhập, an Email field, the hint "Email bạn dùng ở sàn. Mã sẽ gửi tới hộp thư này." and a blue Gửi mã button. step2 (code, 1440 light): the text says "Nếu mot-1440-...@example.test có tài khoản, mã đã được gửi tới hộp thư này. Mã dùng được 5 phút." so the email is named; a Mã đăng nhập field with focus ring, hint "Gõ hoặc dán 6 chữ số trong thư.", a disabled Đăng nhập button, links Gửi mã mới and Dùng email khác.
    step3 (code invalid, 360 light): email wraps inside the card with no horizontal overflow; red text "Mã không đúng hoặc đã hết hạn. Gõ lại, hoặc bấm «Gửi mã mới»." sits under the field holding 000000 and is readable. step4 (choose company, 360 dark): near-black background with white text; "Bạn thuộc nhiều sàn. Chọn sàn để làm việc:" then two full-width buttons [Sàn A] and [Sàn B]. step5 (rate limited, 414 light): red text "Đã xin mã quá nhiều lần. Thử lại sau 15 phút." between the email field and the Gửi mã button.
    step6 (no company, 1024 dark): dark card with "Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn." and a Dùng email khác button. step7 (account menu open, 1440 dark): [Tên], the email, "Đang làm ở [Sàn A]", Đổi sàn with an arrow, Đăng xuất; readable in dark. step8 (signed-out shell, 360 light): header with sidebar toggle, theme toggle and an Đăng nhập button at top right; no sideways scroll. No frame contradicts Expected.
  network_observed: n-a (driver)

- eval: E19
  run_id: minted-dang-nhap-ma-email-E19-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:58:01Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts
    32 passed (57.9s)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dang-nhap-ma-email-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T06:58:01Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 1); moi eval ghi baseline n-a.

Eval khong-phan-biet (xanh tren ca HEAD lan baseline, chung minh harness chu khong phai feature; can viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- make test: E2
- bash db/scripts/cach-ly.sh: E14
- make check: E16

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lịch sử round này nằm trong báo cáo round 1, không chép lại ở đây.
Round 2: toàn bộ 19 eval xanh, lệnh suite build xanh; verdict PASS.
