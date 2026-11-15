---
schema_version: 2
feature_slug: bang-hang-theo-dia-ly
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 942e8fdb2e7fe82d2621e82a7087735e37728672
human_signoff:
---

# Evidence Report: bang-hang-theo-dia-ly

Round 6.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-1 | test | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-2 | script | PASS |
| E5 | AC-3 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | script | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | test | PASS |
| E11 | AC-8 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-10 | test | PASS |
| E14 | AC-10 | ui-check | PASS |
| E15 | AC-2 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-bang-hang-theo-dia-ly-E1-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1, variance: false

- eval: E2
  run_id: minted-bang-hang-theo-dia-ly-E2-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1, variance: false

- eval: E3
  run_id: minted-bang-hang-theo-dia-ly-E3-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1, variance: false

- eval: E5
  run_id: minted-bang-hang-theo-dia-ly-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1, variance: false

- eval: E6
  run_id: minted-bang-hang-theo-dia-ly-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    runs: 1, passes: 1, variance: false

- eval: E4
  run_id: minted-bang-hang-theo-dia-ly-E4-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (42.5s)

- eval: E7
  run_id: minted-bang-hang-theo-dia-ly-E7-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (42.5s)

- eval: E8
  run_id: minted-bang-hang-theo-dia-ly-E8-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (42.5s)

- eval: E9
  run_id: minted-bang-hang-theo-dia-ly-E9-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (42.5s)

- eval: E11
  run_id: minted-bang-hang-theo-dia-ly-E11-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (42.5s)

- eval: E12
  run_id: minted-bang-hang-theo-dia-ly-E12-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (42.5s)

- eval: E10
  run_id: minted-bang-hang-theo-dia-ly-E10-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: make test
    runs: 1, passes: 1, variance: false

- eval: E13
  run_id: minted-bang-hang-theo-dia-ly-E13-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: make test
    runs: 1, passes: 1, variance: false

- eval: E15
  run_id: minted-bang-hang-theo-dia-ly-E15-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:58:37Z
  output: |
    cmd: node "$R/scripts/design-floor-khuon.mjs" --kiem --root .
    14 tệp giao diện ngoài bản đồ

- eval: E14
  run_id: minted-bang-hang-theo-dia-ly-E14-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-15T10:58:37Z
  screenshot: evidence/E14-phan-khu-1440-sang.png
  observed: |
    phan-khu-1440-sang: App Shell with second column: Bảng hàng/Tất cả hàng, Theo trạng thái (6 statuses, no counts), then per-project groups; 'The Sapphire 1' is the only highlighted entry with S1.01/02/03/05 beneath; footer '36 / 60 dòng'; Toà filter cell shows 'S1.01, S1.02, S' and Dự án cell 'Vinhomes Ocean P' cut by the column width, full text in title. phan-khu-1440-toi: same layout in dark, same highlight and footer. ngan-360-sang: sheet open, same groups, no counts, 'Tất cả hàng' lit. toa-360-sang: phone card list, footer '12 / 60 dòng', chips Toà and Dự án, all rows '[MAU] Toà E1'. sent-1440/360: 'Đã gửi' group with only 'Tất cả link' lit, no tree, identical to before. tuy-chinh-1440/360: 'Tuỳ chỉnh của sàn' with 5 entries, 'Nhãn riêng' lit, no tree; column same as before, only main content differs (empty vs error state).
  network_observed: clean

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_check-r6
  exit_code: 0
  verified_at: 2026-11-15T10:58:37Z

- cmd: npm run build
  run_id: minted-bang-hang-theo-dia-ly-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-15T10:58:37Z

- cmd: make e2e
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_e2e-r6
  exit_code: 0
  verified_at: 2026-11-15T10:58:37Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Baseline khong do: moi eval round nay ghi baseline n-a vi evals.yaml khong doi tu lan baseline cuoi (round 2).

Eval khong-phan-biet (pass tren ca HEAD lan baseline, can viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y): E10 (lenh make test).

## Variance

none — every multi-run eval is uniform (moi eval chay 1 lan, deterministic, khong flaky).

## Iterations

Round 6: tat ca 15 eval PASS va 3 lenh suite xanh (make check, npm run build, make e2e); khong co judgment item, khong co variance. Lich su round 1 den 5 nam trong run-log.jsonl cua feature.
