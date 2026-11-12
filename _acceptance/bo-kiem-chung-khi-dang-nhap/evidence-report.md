---
schema_version: 2
feature_slug: bo-kiem-chung-khi-dang-nhap
verdict: REJECT
failed_evals: [E5, E6, E7, E13, E9, E10]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8e89609598ae5bbc9693c4abba68dc303a5969cf
human_signoff:
---

# Evidence Report: bo-kiem-chung-khi-dang-nhap

Round 2. Lịch sử các round nằm ở mục Iterations.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | REJECT |
| E6 | AC-5 | script | REJECT |
| E7 | AC-6 | script | REJECT |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | REJECT |
| E10 | AC-8 | script | REJECT |
| E11 | AC-9 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | REJECT |
| E14 | AC-9 | script | PASS |
| E15 | AC-8 | script | PASS |

## Evidence

Mọi eval ở round này là eval script, không có eval ui-check nên không có khối screenshot hay network_observed. Các eval cùng lệnh dùng chung một kết quả máy.

- eval: E1
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T10:57:52Z
  output: |
    DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts
    237 passed (10.8m)

- eval: E2
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh với E1.
    237 passed (10.8m)

- eval: E3
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh với E1.
    237 passed (10.8m)

- eval: E4
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:57:52Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    Lệnh kết thúc thành công.

- eval: E8
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh với E4. Lệnh kết thúc thành công.

- eval: E11
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh với E4. Lệnh kết thúc thành công.

- eval: E15
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh với E4. Lệnh kết thúc thành công.

- eval: E5
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E5-r2
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:57:52Z
  output: |
    make e2e: 1 failed, 473 skipped, 662 passed (15.4m)
    [360] tests/e2e/account.spec.ts:30:3 tai khoan khong co co so du lieu login-loi-may-chu
    Locator '[data-state="server-error"]' không tìm thấy, chờ "Chưa gửi được yêu cầu." quá 5000ms
    make: *** [e2e] Error 1

- eval: E6
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E6-r2
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh make e2e với E5, lệnh trả mã lỗi nên eval không đạt điều kiện "make e2e xanh".
    Bài đỏ duy nhất là account.spec.ts:30 ở khổ 360, không nằm trong settle.spec.ts.

- eval: E7
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E7-r2
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh make e2e với E5, lệnh trả mã lỗi nên eval không đạt điều kiện "make e2e xanh".
    Bài đỏ duy nhất là account.spec.ts:30 ở khổ 360, không nằm trong settle.spec.ts.

- eval: E13
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E13-r2
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T10:57:52Z
  output: |
    Cùng lệnh make e2e với E5: 1 failed, 662 passed (15.4m).
    Kỳ vọng "toàn bộ make e2e xanh ở 4 khổ" không đạt.

- eval: E9
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E9-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.kiem_chung_lap
  verified_at: 2026-11-12T10:57:52Z
  output: |
    E2E_CPU_THROTTLE=4 npx playwright test --grep @cho --project=360 --project=1024 --repeat-each=20
    2 failed, 120 skipped, 518 passed (16.1m)
    [360] app-shell.spec.ts:210:3 the sheet holds the rail and the second column ... @cho (repeat8)
    [360] app-shell.spec.ts:192:5 no column takes the screen ... (dark) @cho (repeat12)
    Error: ham cpu khong co tac dung — 28.1ms → 69.6ms (và 28.2ms → 67.9ms)

- eval: E10
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E10-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.kiem_chung_lap_phien
  verified_at: 2026-11-12T10:57:52Z
  output: |
    DB_LANE=h DB_PORT=5567 E2E_CPU_THROTTLE=4 npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts --grep @cho --project=360 --repeat-each=20
    1 failed, 59 passed (12.5m)
    [360] members.spec.ts:188:1 doi-vai-thanh-ben @cho (repeat15)
    Error: ham cpu khong co tac dung — 29.6ms → 71.2ms

- eval: E12
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-12T10:57:52Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E14
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_db_tron
  verified_at: 2026-11-12T10:57:52Z
  output: |
    DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts
    Lệnh kết thúc thành công.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-kiem-chung-khi-dang-nhap-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-12T10:57:52Z

Lệnh fail không gắn eval: không có. Cả ba lệnh đỏ đều thuộc eval: make e2e (E5, E6, E7, E13), lệnh lặp 20 lần ở 360 và 1024 (E9), lệnh lặp 20 lần của members (E10).

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

Danh sách eval không-phân-biệt không đo được ở round này vì baseline bị chặn; mọi field baseline ghi n-a.

Baseline khong do:
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make e2e: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- E2E_CPU_THROTTLE=4 npx playwright test --grep @cho --project=360 --project=1024 --repeat-each=20: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- DB_LANE=h DB_PORT=5567 E2E_CPU_THROTTLE=4 npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts --grep @cho --project=360 --repeat-each=20: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make check: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

## Variance

none — mọi eval chạy một lần, không có eval nhiều lần với tỉ lệ đạt lẫn lộn. Ba eval lặp 20 lần (E9, E10) đỏ do hàm hãm CPU tự chứng không đạt ở một vài lượt lặp, đã nêu ở mục Evidence; đó là lỗi của lệnh, không phải điểm phương sai cần người chấm.

## Iterations

Round 1: BLOCKED — hai lượt trình duyệt đụng cổng nhau, kèm một phát hiện trong hợp đồng; quay lại thực hiện (commit a7ac365, sửa ở 8e89609).
Round 2: E5, E6, E7, E13 đỏ vì make e2e còn 1 bài đỏ (account.spec.ts login-loi-may-chu, khổ 360, không thấy băng lỗi máy chủ); E9 và E10 đỏ vì hàm hãm CPU tự chứng không đủ chậm ở một vài lượt lặp (E9 hai lượt trên khổ 360, E10 một lượt). Trả về thực hiện.
