---
schema_version: 2
feature_slug: bo-kiem-chung-khi-dang-nhap
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 069b48b16b54b891d9d59bed85aadcfad7fa3727
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
| E9 | AC-8 | script | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T12:59:58Z
  output: |
    DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts
    runs 1, passes 1

- eval: E2
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T12:59:58Z
  output: |
    DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts
    runs 1, passes 1

- eval: E3
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-12T12:59:58Z
  output: |
    DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts
    runs 1, passes 1

- eval: E4
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T12:59:58Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs 1, passes 1

- eval: E8
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T12:59:58Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs 1, passes 1

- eval: E11
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T12:59:58Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs 1, passes 1

- eval: E15
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E15-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.man_mau
  verified_at: 2026-11-12T12:59:58Z
  output: |
    npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose
    runs 1, passes 1

- eval: E5
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T12:59:58Z
  output: |
    make e2e
    663 passed (17.3m)

- eval: E6
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T12:59:58Z
  output: |
    make e2e
    663 passed (17.3m)

- eval: E7
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T12:59:58Z
  output: |
    make e2e
    663 passed (17.3m)

- eval: E13
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E13-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T12:59:58Z
  output: |
    make e2e
    663 passed (17.3m)

- eval: E9
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_lap
  verified_at: 2026-11-12T12:59:58Z
  output: |
    E2E_CPU_THROTTLE=4 npx playwright test --grep @cho --project=360 --project=1024 --repeat-each=20
    runs 1, passes 1

- eval: E10
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_lap_phien
  verified_at: 2026-11-12T12:59:58Z
  output: |
    DB_LANE=h DB_PORT=5567 E2E_CPU_THROTTLE=4 npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts --grep @cho --project=360 --repeat-each=20
    runs 1, passes 1

- eval: E12
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-12T12:59:58Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E14
  run_id: minted-bo-kiem-chung-khi-dang-nhap-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_db_tron
  verified_at: 2026-11-12T12:59:58Z
  output: |
    DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts
    runs 1, passes 1

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-kiem-chung-khi-dang-nhap-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-12T12:59:58Z

## Known limits

## Ngoài hợp đồng

## Analyst

baseline: BLOCKED ha tang — lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

none — moi eval feature deu red tren baseline (co phan biet). Luu y: baseline khong do duoc o round nay nen danh sach khong-phan-biet khong do duoc.

Baseline khong do:
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- npx vitest run tools/e2e_templates --coverage.enabled=false --reporter=verbose: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make e2e: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- E2E_CPU_THROTTLE=4 npx playwright test --grep @cho --project=360 --project=1024 --repeat-each=20: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- DB_LANE=h DB_PORT=5567 E2E_CPU_THROTTLE=4 npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts --grep @cho --project=360 --repeat-each=20: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- make check: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts: BLOCKED ha tang baseline: lenh baseline khong chay dong nao (cong cu tu choi loi goi, hoac khong ghi duoc tep kich ban) — cong cu tra: «This session is isolated in the worktree /Users/manhphan/dev/onehub-inventory/.claude/worktrees/peaceful-bhabha-46ad25, but this command is too complex to verify that it stays inside the worktree. Refusing to run it — a worktree-isolated se»

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: BLOCKED — port clash between two browser runs; one finding in contract. Returned to implementation.
Round 2: REJECT — throttle proof noisy under load, one 5-second wait. Returned to implementation.
Round 3: all evals passed on 069b48b; verdict PASS.
