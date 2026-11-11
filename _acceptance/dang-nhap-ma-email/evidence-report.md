---
schema_version: 2
feature_slug: dang-nhap-ma-email
verdict: BLOCKED
failed_evals: ["E18"]
reason: Playwright khong khoi dong duoc webServer cho lenh "DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts" (cac eval E7, E10, E12, E17, E19). Co mot next dev server khac dang chay san trong chinh thu muc worktree (PID 51392, port 3723); Playwright bao "Another next dev server is already running" nen config.webServer thoat voi ma 1. Khong kill tien trinh nay vi co the la phien song song dang dung; khong doi branch, khong sua code, khong chay lai.
blocked:
  - cmd: "DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts"
    reason: "Playwright khong khoi dong duoc webServer: co mot next dev server khac dang chay san trong chinh thu muc worktree (PID 51392, port 3723). Playwright bao \"Another next dev server is already running\" nen config.webServer thoat voi ma 1. Khong kill tien trinh nay vi co the la phien song song dang dung; khong doi branch, khong sua code, khong chay lai."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ec9ac8d218b142d392352d35fccd9a2949e1ff89
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
| E7 | AC-5 | script | BLOCKED |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | script | PASS |
| E10 | AC-7 | script | BLOCKED |
| E11 | AC-8 | script | PASS |
| E12 | AC-8 | script | BLOCKED |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | script | PASS |
| E16 | AC-9 | script | PASS |
| E17 | AC-10 | script | BLOCKED |
| E18 | AC-10 | ui-check | FAIL |
| E19 | AC-2 | script | BLOCKED |

## Evidence

- eval: E1
  run_id: minted-dang-nhap-ma-email-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Lenh: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose
    Ket thuc khong loi (chung cho E1, E3, E4, E5, E6, E8, E9, E11, E15).

- eval: E3
  run_id: minted-dang-nhap-ma-email-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E4
  run_id: minted-dang-nhap-ma-email-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E5
  run_id: minted-dang-nhap-ma-email-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E6
  run_id: minted-dang-nhap-ma-email-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E8
  run_id: minted-dang-nhap-ma-email-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E9
  run_id: minted-dang-nhap-ma-email-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E11
  run_id: minted-dang-nhap-ma-email-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E15
  run_id: minted-dang-nhap-ma-email-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.dang_nhap_db
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Chung lenh vitest.db.config.ts voi E1; ket thuc khong loi.

- eval: E2
  run_id: minted-dang-nhap-ma-email-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Lenh: make test
    Ket thuc khong loi.

- eval: E7
  run_id: minted-dang-nhap-ma-email-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:31:49Z
  output: |
    BLOCKED: lenh playwright.db.config.ts khong chay duoc (cannotRun).
    [WebServer] Another next dev server is already running (PID 51392, port 3723).
    Error: Process from config.webServer was not able to start.

- eval: E10
  run_id: minted-dang-nhap-ma-email-E10-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:31:49Z
  output: |
    BLOCKED: cung nguyen nhan voi E7, webServer khong khoi dong duoc.

- eval: E12
  run_id: minted-dang-nhap-ma-email-E12-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:31:49Z
  output: |
    BLOCKED: cung nguyen nhan voi E7, webServer khong khoi dong duoc.

- eval: E17
  run_id: minted-dang-nhap-ma-email-E17-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:31:49Z
  output: |
    BLOCKED: cung nguyen nhan voi E7, webServer khong khoi dong duoc.

- eval: E19
  run_id: minted-dang-nhap-ma-email-E19-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:31:49Z
  output: |
    BLOCKED: cung nguyen nhan voi E7, webServer khong khoi dong duoc.

- eval: E13
  run_id: minted-dang-nhap-ma-email-E13-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Lenh: make e2e
    195 passed (52.5s)

- eval: E14
  run_id: minted-dang-nhap-ma-email-E14-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T06:31:49Z
  output: |
    cach-ly: 19 ca đạt, vai quy_hang_app

- eval: E16
  run_id: minted-dang-nhap-ma-email-E16-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-11T06:31:49Z
  output: |
    Lenh: make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E18
  run_id: minted-dang-nhap-ma-email-E18-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.dang_nhap_e2e
  verified_at: 2026-11-11T06:31:49Z
  screenshot: evidence/E18-step1.png
  observed: |
    step1 (1440 sang): the 'Dang nhap' nho o giua man, truong Email + goi y + nut xanh 'Gui ma'; rong vua. step2: nen ro 'Neu mot-1440-...@example.test co tai khoan, ma da duoc gui toi hop thu nay. Ma dung duoc 5 phut.'. step3 (360): cau do 'Ma khong dung hoac da het han...' ngay duoi o ma, khong tran ngang. step4: 2 nut '[San A]' '[San B]'. step5: 'Da xin ma qua nhieu lan. Thu lai sau 15 phut.'. step6: 'Tai khoan chua thuoc san nao. Nho quan tri san moi ban.'. step7 (1440 toi, menu mo): co '[Ten]', email, 'Dang lam o [San A]', 'Doi san', 'Dang xuat', NHUNG dong email bi cat o mep phai ('...@ex'), khong doc het -> lech Expected. step8 (360): nut 'Dang nhap' kem icon o goc tren phai dau trang.
  network_observed: n-a (driver)
  ghi_chu: |
    Chay spec dang_nhap_e2e voi SHOTS_DIR=_acceptance/dang-nhap-ma-email/evidence DB_LANE=n DB_PORT=5563: 32 passed (36.2s). Lan dau bi chan vi mot playwright khac trong cung worktree giu khoa next dev; cho no xong roi chay lai, khong kill gi. 8 frame luu E18-step1..8.png. Cac buoc 1-6 va 8 dat; buoc 7 (menu tai khoan) lech Expected vi dong email bi cat.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dang-nhap-ma-email-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-11T06:31:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh ở cả code mới lẫn baseline, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test: E2
- bash db/scripts/cach-ly.sh: E14
- make check: E16

Baseline khong do
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts --reporter=verbose: bo qua baseline: tep vitest.db.config.ts co o cay dang kiem nhung chua co o merge-base d8f6667f126ffe6f72d732be4020b1273b81b76d — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts: bo qua baseline: tep playwright.db.config.ts co o cay dang kiem nhung chua co o merge-base d8f6667f126ffe6f72d732be4020b1273b81b76d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào có runs > 1).

## Iterations

Round 1: E18 fail — menu tài khoản ở 1440 tối cắt dòng email ở mép phải; E7, E10, E12, E17, E19 không chạy được vì một next dev server khác đang giữ khoá trong worktree (PID 51392, port 3723), cần chạy lại khi cổng trống. Trả về triển khai.
