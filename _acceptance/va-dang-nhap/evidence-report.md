---
schema_version: 2
feature_slug: va-dang-nhap
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1194e61df4964c7ec89819fd7f59e945742101ff
human_signoff: Manh Phan 2026-11-12
---

# Evidence Report: va-dang-nhap

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-3 | script | PASS |
| E6 | AC-4 | script | PASS |
| E7 | AC-5 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | script | PASS |
| E11 | AC-7 | script | PASS |
| E12 | AC-7 | script | PASS |
| E13 | AC-7 | script | PASS |
| E14 | AC-8 | script | PASS |
| E15 | AC-8 | ui-check | PASS |
| E16 | AC-6 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-va-dang-nhap-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: make test
    toàn bộ ca đơn vị xanh, gồm tests/next-path-matrix.test.ts

- eval: E2
  run_id: minted-va-dang-nhap-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E3
  run_id: minted-va-dang-nhap-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E4
  run_id: minted-va-dang-nhap-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E5
  run_id: minted-va-dang-nhap-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E6
  run_id: minted-va-dang-nhap-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E7
  run_id: minted-va-dang-nhap-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E8
  run_id: minted-va-dang-nhap-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E9
  run_id: minted-va-dang-nhap-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E10
  run_id: minted-va-dang-nhap-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_db
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx vitest run -c vitest.db.config.ts --reporter=verbose
    các ca của tests/db/dang-nhap.db.test.ts xanh trên Postgres dãy R

- eval: E11
  run_id: minted-va-dang-nhap-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_cach_ly
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 bash db/scripts/cach-ly.sh
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E12
  run_id: minted-va-dang-nhap-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E13
  run_id: minted-va-dang-nhap-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E14
  run_id: minted-va-dang-nhap-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

- eval: E15
  run_id: minted-va-dang-nhap-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  screenshot: evidence/E15-step1.png
  observed: |
    Each frame was opened with Read.
    step1 (360 light): the centred sign-in block titled "Đăng nhập" holds the sentence "Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác." and a full-width "Đăng xuất" button. There is no list of companies, empty or otherwise. There is no horizontal scroll at 360. Matches Expected.
    step2 (1440 dark): the same block and sentence sit in the middle of the screen. The background is near-black and the text is white, so the theme has changed and it reads clearly. The "Đăng xuất" button is inside the block, and there is no company list. Matches Expected.
    step3 (414 light): the same no-company block is still on screen after the failure. A toast at the bottom, above the content, says "Chưa đăng xuất được. Bạn vẫn đang đăng nhập trên máy này — kiểm tra mạng rồi bấm «Đăng xuất» lại." It is legible and does not cover the "Đăng xuất" button. The dev "N" badge overlaps the toast's left edge, a dev-only artifact. Matches Expected.
    step4 (1440 light): the "Hôm nay" page with sidebar and header is fully visible. The failure toast sits at bottom right, above the content, legible, and does not cover the account or sign-out controls. Matches Expected.
    step5 (360 dark): the "Hôm nay" page is dark with light text. The toast has the same wording, wraps in the narrow width and is legible. The dev "N" badge covers part of the word "xuất", a dev-only overlay. No horizontal overflow at 360. Matches Expected.
    Overall: no frame contradicts Expected.
  network_observed: n-a (driver)

- eval: E16
  run_id: minted-va-dang-nhap-E16-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.va_dang_nhap_e2e
  verified_at: 2026-11-11T10:31:49Z
  output: |
    lệnh: DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts
    72 passed (1.7m)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-va-dang-nhap-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T10:31:49Z

- cmd: make e2e
  run_id: minted-va-dang-nhap-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-11T10:31:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml khong doi tu lan baseline cuoi (round 1), nen round nay khong do lai; moi block eval ghi baseline n-a.

Eval khong-phan-biet (xanh tren ca HEAD lan baseline cu, chung minh harness chu khong phai feature; can viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- E1 (make test)
- E10 (vitest db, dang-nhap.db.test.ts)
- E11 (cach-ly.sh)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: co sua sau vong dau — commit 1194e61 (e2e-db build folder out of .next, settle toast before frames). Returned to implementation.
Round 2: moi eval va lenh suite xanh, verdict PASS.
