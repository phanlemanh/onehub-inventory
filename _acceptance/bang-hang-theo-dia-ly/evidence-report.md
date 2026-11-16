---
schema_version: 2
feature_slug: bang-hang-theo-dia-ly
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e00877f1136c9bf2053baa4af86d2d238659ec7b
human_signoff: Manh Phan 2026-11-16
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
  run_id: minted-bang-hang-theo-dia-ly-E1-r6
  exit_code: 0
  carried_from_round: 6
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-bang-hang-theo-dia-ly-E2-r6
  exit_code: 0
  carried_from_round: 6
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T10:58:37Z
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-bang-hang-theo-dia-ly-E3-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T13:44:08Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx (verbose): all tests passed, command finished with status zero

- eval: E4
  run_id: minted-bang-hang-theo-dia-ly-E4-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T13:44:08Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (58.9s)

- eval: E5
  run_id: minted-bang-hang-theo-dia-ly-E5-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T13:44:08Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx (verbose): all tests passed, command finished with status zero

- eval: E6
  run_id: minted-bang-hang-theo-dia-ly-E6-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-15T13:44:08Z
  output: |
    npx vitest run src/modules/listings/ui/geo-tree.test.ts tests/dia-ly.test.tsx (verbose): all tests passed, command finished with status zero

- eval: E7
  run_id: minted-bang-hang-theo-dia-ly-E7-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T13:44:08Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (58.9s)

- eval: E8
  run_id: minted-bang-hang-theo-dia-ly-E8-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T13:44:08Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (58.9s)

- eval: E9
  run_id: minted-bang-hang-theo-dia-ly-E9-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T13:44:08Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (58.9s)

- eval: E10
  run_id: minted-bang-hang-theo-dia-ly-E10-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-15T13:44:08Z
  output: |
    make test: finished green, command finished with status zero

- eval: E11
  run_id: minted-bang-hang-theo-dia-ly-E11-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T13:44:08Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (58.9s)

- eval: E12
  run_id: minted-bang-hang-theo-dia-ly-E12-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-15T13:44:08Z
  output: |
    playwright test -c playwright.db.config.ts tests/e2e-db/dia-ly.spec.ts
    13 passed (58.9s)

- eval: E13
  run_id: minted-bang-hang-theo-dia-ly-E13-r6
  exit_code: 0
  carried_from_round: 6
  baseline: n-a
  verifier: config:executors.test.unit
  verified_at: 2026-11-15T10:58:37Z
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-bang-hang-theo-dia-ly-E14-r6
  exit_code: 0
  carried_from_round: 6
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-15T10:58:37Z
  screenshot: evidence/E14-phan-khu-1440-sang.png
  observed: |
    phan-khu-1440-sang: App Shell with second column: Bảng hàng/Tất cả hàng, Theo trạng thái (6 statuses, no counts), then per-project groups; 'The Sapphire 1' is the only highlighted entry with S1.01/02/03/05 beneath; footer '36 / 60 dòng'; Toà filter cell shows 'S1.01, S1.02, S' and Dự án cell 'Vinhomes Ocean P' cut by the column width, full text in title. phan-khu-1440-toi: same layout in dark, same highlight and footer. ngan-360-sang: sheet open, same groups, no counts, 'Tất cả hàng' lit. toa-360-sang: phone card list, footer '12 / 60 dòng', chips Toà and Dự án, all rows '[MAU] Toà E1'. sent-1440/360: 'Đã gửi' group with only 'Tất cả link' lit, no tree, identical to before. tuy-chinh-1440/360: 'Tuỳ chỉnh của sàn' with 5 entries, 'Nhãn riêng' lit, no tree; column same as before, only main content differs (empty vs error state).
  network_observed: clean
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-bang-hang-theo-dia-ly-E15-r6
  exit_code: 0
  carried_from_round: 6
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:58:37Z
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_check-r7
  exit_code: 0
  verified_at: 2026-11-15T13:44:08Z

- cmd: npm run build
  run_id: minted-bang-hang-theo-dia-ly-SUITE-build-r7
  exit_code: 0
  verified_at: 2026-11-15T13:44:08Z

- cmd: make e2e
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_e2e-r7
  exit_code: 0
  verified_at: 2026-11-15T13:44:08Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Eval khong-phan-biet (xanh ca tren HEAD lan baseline; regression-guard hoac harness, can viet lai de assert hanh vi moi hoac xac nhan co chu y):
- E10 (make test)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 7: moi eval may chay lai xanh (E3-E12); E1, E2, E13, E14, E15 carry-forward tu round 6 vi delta khong cham paths cua chung. Lich su cac round truoc: xem run-log.

### Re-pin lần 1 — 2026-11-16, do gop main b6f4f29 (VP4) sau chu ky
run_id: repin-20261116T005008Z-52041
sha: 5e2dd3b6e91e8345f5a1222f7d58ab3b9fe36891 · suites: 3 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E14

### Re-pin lần 2 — 2026-11-16, do hang 1u chuyen hai ca pha cua bai dia ly qua cua chung (sua sau ky)
run_id: repin-20261116T041749Z-80952
sha: 34b762bc6b33d5849f6582b0217f48db2945e32a · suites: 3 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E14 · diff chạm vật đo ngoài làn máy: E14 — chưa chứng lại, đi vòng S4 delta

### Re-pin lần 3 — 2026-11-16, do lượt ghim lại cuối của hàng 1u sau khi gộp nhánh chính 7ea2f53 (G-1611-41)
run_id: repin-20261116T070937Z-41988
sha: 038f0756f995c1fef3b8028b48d689a3280ddade · suites: 3 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E14 · diff chạm vật đo ngoài làn máy: E14 — chưa chứng lại, đi vòng S4 delta

### Re-pin lần 4 — 2026-11-16, do VP5: dia chi muc noi mang cac loc dang co (sua-sau-ky)
run_id: repin-20261116T115228Z-11669
sha: e00877f1136c9bf2053baa4af86d2d238659ec7b · suites: 3 lệnh exit 0 · evals: 14/14 eval máy đạt kỳ vọng · ngoài làn máy: E14 · diff chạm vật đo ngoài làn máy: E14 — chưa chứng lại, đi vòng S4 delta
