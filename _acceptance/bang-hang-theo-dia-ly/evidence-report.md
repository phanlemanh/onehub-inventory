---
schema_version: 2
feature_slug: bang-hang-theo-dia-ly
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 07fda26e32b92afbc8383f67c286dfe1af59b0dc
human_signoff:
---

# Evidence Report: bang-hang-theo-dia-ly

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
  run_id: minted-bang-hang-theo-dia-ly-E1-r1
  exit_code: 0
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-hang-theo-dia-ly-E2-r1
  exit_code: 0
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-bang-hang-theo-dia-ly-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:36:18Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose
    (chung mot lenh voi E5, E6; ket thuc sach)

- eval: E4
  run_id: minted-bang-hang-theo-dia-ly-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:36:18Z
  output: |
    playwright -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    11 passed (43.0s)

- eval: E5
  run_id: minted-bang-hang-theo-dia-ly-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh vitest voi E3, E6; ket thuc sach

- eval: E6
  run_id: minted-bang-hang-theo-dia-ly-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh vitest voi E3, E5; ket thuc sach

- eval: E7
  run_id: minted-bang-hang-theo-dia-ly-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh playwright voi E4; 11 passed (43.0s)

- eval: E8
  run_id: minted-bang-hang-theo-dia-ly-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh playwright voi E4; 11 passed (43.0s)

- eval: E9
  run_id: minted-bang-hang-theo-dia-ly-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh playwright voi E4; 11 passed (43.0s)

- eval: E10
  run_id: minted-bang-hang-theo-dia-ly-E10-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T17:36:18Z
  output: |
    make test; ket thuc sach

- eval: E11
  run_id: minted-bang-hang-theo-dia-ly-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh playwright voi E4; 11 passed (43.0s)

- eval: E12
  run_id: minted-bang-hang-theo-dia-ly-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T17:36:18Z
  output: |
    chung mot lenh playwright voi E4; 11 passed (43.0s)

- eval: E13
  run_id: minted-bang-hang-theo-dia-ly-E13-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-bang-hang-theo-dia-ly-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T17:36:18Z
  screenshot: evidence/E14-phan-khu-1440-sang.png
  observed: |
    I opened each saved frame with Read.
    - E14-phan-khu-1440-sang.png: second column is 'Bảng hàng' with 'Tất cả hàng', then the 'Theo trạng thái' group (6 statuses, no counts). Below it are one group per project (Vinhomes Ocean Park 1, 2 – The Empire, 3 – The Crown), each with 'Tất cả' and its children, headed in the same small grey style as 'Theo trạng thái'. 'The Sapphire 1' is the only lit entry, with S1.01, S1.02, S1.03 and S1.05 under it unlit. The footer reads '36 / 60 dòng'. The Toà box shows 'S1.01, S1.02, S' and the Dự án box 'Vinhomes Ocean P', both cut by column width. The lit entry shows 'The Sapphire 1' in full.
    - E14-phan-khu-1440-toi.png: the same layout in dark mode; The Sapphire 1 is the only lit entry; footer '36 / 60 dòng'.
    - E14-ngan-360-sang.png: the App Shell sheet is open, with the same groups, no counts and no tree beyond the project groups; 'Tất cả hàng' is lit because no place is chosen yet.
    - E14-toa-360-sang.png: the sheet has closed; the footer reads '12 / 60 dòng'; every row shows '[MAU] Toà E1'; the Toà box shows '[MAU] Toà E' cut by the narrow column.
    - E14-sent-1440-sang.png and E14-sent-360-sang.png: the second column has one group 'Đã gửi' with the single entry 'Tất cả link', lit, and no tree; both are byte-identical to their before shots.
    - E14-tuy-chinh-1440-sang.png and E14-tuy-chinh-360-sang.png: the second column has 'Tuỳ chỉnh của sàn' with 5 entries and 'Nhãn riêng' lit, and no tree. It matches the before shots in entries and highlight. Only the main-area state differs (error before, empty list now), and the network check above explains it.
    Everything matches the Expected text.
  network_observed: clean

- eval: E15
  run_id: minted-bang-hang-theo-dia-ly-E15-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-14T17:36:18Z

- cmd: npm run build
  run_id: minted-bang-hang-theo-dia-ly-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T17:36:18Z

- cmd: make e2e
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-14T17:36:18Z

## Known limits

## Ngoài hợp đồng

## Analyst

Non-discriminating (xanh ca tren HEAD lan baseline): E10 (lenh make test) — regression-guard co chu y cho bai luoi cu cua 2a, 2e; khong phai eval hanh vi moi.

Baseline khong do
- npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/listings/ui/geo-tree.test.ts co o cay dang kiem nhung chua co o merge-base 20a13c22aa0181e31d639306e6c25c4289a8f60f — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} npx playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts: bo qua baseline: tep tests/e2e-db/dia-ly.spec.ts co o cay dang kiem nhung chua co o merge-base 20a13c22aa0181e31d639306e6c25c4289a8f60f — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E14 (ui-check) did not pass — the second-column frames did not match the Expected text. Returned to implementation.
Round 2: E3, E4, E5, E6, E7, E8, E9, E10, E11, E12, E14 re-run and passed; E1, E2, E13, E15 carried forward from round 1 (delta did not touch their paths). Verdict PASS.
