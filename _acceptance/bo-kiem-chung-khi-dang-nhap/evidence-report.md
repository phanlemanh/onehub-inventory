---
schema_version: 2
feature_slug: bo-kiem-chung-khi-dang-nhap
verdict: BLOCKED
failed_evals: []
reason: 'E9 không chạy được: Playwright không khởi động được webServer vì cổng 127.0.0.1:3864 đã có tiến trình khác dùng. Thông báo: "http://127.0.0.1:3864 is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer." Có thể là verifier khác đang chạy song song hoặc server cũ còn sót. Không kill tiến trình, không sửa config, không đổi branch, và không chạy lại nhiều lần theo yêu cầu. Lệnh bị chặn: E2E_CPU_THROTTLE=4 npx playwright test --grep @cho --project=360 --project=1024 --repeat-each=20'
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fab09ee1cb4ade4eb4a09706dcaf4592a2a59946
human_signoff:
---

# Evidence Report: bo-kiem-chung-khi-dang-nhap

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | BLOCKED |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T10:06:19Z
  output: |
    237 passed (5.3m)

- eval: E2
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T10:06:19Z
  output: |
    237 passed (5.3m)

- eval: E3
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T10:06:19Z
  output: |
    237 passed (5.3m)

- eval: E4
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:06:19Z
  output: |
    (vitest tools/e2e_templates: lệnh kết thúc thành công, không có dòng lỗi)

- eval: E5
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:06:19Z
  output: |
    663 passed (8.3m)

- eval: E6
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:06:19Z
  output: |
    663 passed (8.3m)

- eval: E7
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:06:19Z
  output: |
    663 passed (8.3m)

- eval: E8
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:06:19Z
  output: |
    (vitest tools/e2e_templates: lệnh kết thúc thành công, không có dòng lỗi)

- eval: E9
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E9-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.kiem_chung_lap
  verified_at: 2026-11-12T10:06:19Z
  output: |
    Error: http://127.0.0.1:3864 is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer.
    (BLOCKED, không phải lỗi tính năng: webServer không khởi động được, chưa có bài nào chạy)

- eval: E10
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_lap_phien
  verified_at: 2026-11-12T10:06:19Z
  output: |
    60 passed (7.3m)

- eval: E11
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:06:19Z
  output: |
    (vitest tools/e2e_templates: lệnh kết thúc thành công, không có dòng lỗi)

- eval: E12
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-12T10:06:19Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E13
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:06:19Z
  output: |
    663 passed (8.3m)

- eval: E14
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_db_tron
  verified_at: 2026-11-12T10:06:19Z
  output: |
    341 passed (8.1m)

- eval: E15
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:06:19Z
  output: |
    (vitest tools/e2e_templates: lệnh kết thúc thành công, không có dòng lỗi)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-kiem-chung-khi-dang-nhap-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T10:06:19Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Mọi field baseline là n-a; danh sách eval không-phân-biệt không đo được ở round này.

none — không đo được vì baseline bị chặn hạ tầng (không có eval nào được xác nhận green trên cả hai phía).

Baseline khong do
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make e2e: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- E2E_CPU_THROTTLE=4 npx playwright test --grep @cho --project=360 --project=1024 --repeat-each=20: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- DB_LANE=h DB_PORT=5567 E2E_CPU_THROTTLE=4 npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts --grep @cho --project=360 --repeat-each=20: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make check: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

## Variance

none — mọi eval chạy một lần, kết quả đồng nhất (không có eval nào mang runs lớn hơn 1).

## Iterations

Round 1: E9 BLOCKED — cổng 127.0.0.1:3864 đã bị tiến trình khác chiếm nên webServer của Playwright không khởi động; 14 eval còn lại xanh. Cần chạy lại E9 khi cổng trống (không phải lỗi mã).
