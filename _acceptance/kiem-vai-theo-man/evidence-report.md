---
schema_version: 2
feature_slug: kiem-vai-theo-man
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ad777eb2aa954565e98bc2d7a306e4c09f1189ad
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: kiem-vai-theo-man

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-7 | test | PASS |
| E10 | AC-8 | script | PASS |
| E11 | AC-1 | script | PASS |
| E12 | AC-9 | test | PASS |
| E13 | AC-10 | test | PASS |
| E14 | AC-11 | script | PASS |
| E15 | AC-11 | script | PASS |
| E16 | AC-11 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-kiem-vai-theo-man-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-kiem-vai-theo-man-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-kiem-vai-theo-man-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:57:15Z
  output: |
    npx vitest run tests/vai-man-so-man.test.ts --coverage.enabled=false --reporter=verbose
    lenh thoat sach, ca 'cua-dang-nhap-chung' xanh

- eval: E4
  run_id: minted-kiem-vai-theo-man-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:57:15Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E5
  run_id: minted-kiem-vai-theo-man-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:57:15Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E6
  run_id: minted-kiem-vai-theo-man-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:57:15Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E7
  run_id: minted-kiem-vai-theo-man-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:57:15Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E8
  run_id: minted-kiem-vai-theo-man-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:57:15Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E9
  run_id: minted-kiem-vai-theo-man-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_so
  verified_at: 2026-11-13T15:32:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-kiem-vai-theo-man-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_pha_thu
  verified_at: 2026-11-13T15:57:15Z
  output: |
    cay goc: xanh (TeamLead, ListAgent, BuyerAgent, CompanyAdmin @1440)

- eval: E11
  run_id: minted-kiem-vai-theo-man-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-13T15:57:15Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E12
  run_id: minted-kiem-vai-theo-man-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-13T15:32:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-kiem-vai-theo-man-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-13T15:32:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-kiem-vai-theo-man-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_e2e
  verified_at: 2026-11-13T15:57:15Z
  output: |
    vai x man: 20 cap, 29 buoc

- eval: E15
  run_id: minted-kiem-vai-theo-man-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.vai_man_pha_thu
  verified_at: 2026-11-13T15:57:15Z
  output: |
    cay goc: xanh (TeamLead, ListAgent, BuyerAgent, CompanyAdmin @1440)

- eval: E16
  run_id: minted-kiem-vai-theo-man-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.vai_man_nut
  verified_at: 2026-11-13T15:32:51Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-kiem-vai-theo-man-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-13T15:57:15Z

- cmd: make e2e
  run_id: minted-kiem-vai-theo-man-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-13T15:57:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Non-discriminating evals: none

Baseline khong do: moi eval ghi baseline n-a vi round nay khong do lai (evals.yaml khong doi tu lan baseline cuoi, round 1).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E11 (make check) failed — returned to implementation.
Round 2: moi eval xanh; E1, E2, E9, E12, E13, E16 carry-forward tu round 1 (delta khong cham paths), phan con lai chay lai tren ad777eb.
