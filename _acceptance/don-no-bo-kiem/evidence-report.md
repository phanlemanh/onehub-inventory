---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: ef460462253830900915a3de6988f45e1b5824fc
human_signoff:
---

# Evidence Report: don-no-bo-kiem

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward round 1) |
| E2 | AC-2 | test | PASS (carry-forward round 1) |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS (carry-forward round 1) |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS (carry-forward round 4) |
| E8 | AC-8 | judgment | PASS |
| E8b | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-9 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-don-no-bo-kiem-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-don-no-bo-kiem-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-don-no-bo-kiem-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T23:22:42Z
  output: |
    cho-tai-pha: ca pha bat dung 'cho-tai: khung cho khong hien' o 360 va 1440, 0 canh bao, so dang ky bang main

- eval: E4
  run_id: minted-don-no-bo-kiem-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T23:22:42Z
  output: |
    gac-hydration: 0 canh bao

- eval: E5
  run_id: r1-l4-1-20261115181836
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gac_hydration_pha
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-don-no-bo-kiem-E6-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-15T23:22:42Z
  output: |
    src/generated/ontology.ts is up to date (21 entities)

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.wiki_so_trung
  verified_at: 2026-11-15T22:59:11Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T23:22:42Z
  output: |
    release-de-xuat: khoa RELEASE_PLEASE_TOKEN, ba quyen doc-ghi, dong loi khop

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T23:22:42Z
  output: |
    ranh-gioi-1u: khong tep cam nao doi

- eval: E10
  run_id: r5-l6-1-20261115232242
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T23:22:42Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Judgment

- eval: E8
  judged_by: judge-subagent (panel giu nguyen tu round 4 — inputs khong doi, khong cham lai; rationale xem round do)
  verdict: PASS
  votes:
    - domain-correctness: PASS (r4)
    - operational-feasibility: PASS (r4)
    - spec-alignment: PASS (r4)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-15T23:22:42Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval khong-phan-biet (xanh ca tren code moi lan baseline): E10 (make check) — regression-guard co chu y.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: carried evals E1, E2, E5 first verified here; evidence stored.
Round 4: E7 verified (wiki number duplicate check).
Round 5: grading round 4 outcome rejected 7146525 (region break warnings after #70); fixed in c0a49b2, all machine evals PASS on ef46046; E1, E2, E5, E7 carried forward.
