---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: fe7d63cc965912ff08156200dd684ef51505c01f
human_signoff:
---

# Evidence Report: don-no-bo-kiem

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-5 | script | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |
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
  run_id: minted-don-no-bo-kiem-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T20:07:04Z
  output: |
    cho-tai-pha: ca pha bat dung 'cho-tai: khung cho khong hien' o 360 va 1440, 0 canh bao, so dang ky bang main

- eval: E4
  run_id: minted-don-no-bo-kiem-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T20:07:04Z
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
  run_id: minted-don-no-bo-kiem-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.wiki_so_trung
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: Panel giu nguyen tu round 3 — inputs khong doi, khong cham lai; rationale xem round do.
  votes:
    - domain-correctness: PASS (r3)
    - operational-feasibility: PASS (r3)
    - spec-alignment: PASS (r3)
  human_override:  # chi nguoi ghi

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-don-no-bo-kiem-E10-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T20:07:04Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-15T20:07:04Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: moi eval ghi n-a vi evals.yaml khong doi tu lan baseline cuoi (round 1).

Eval khong phan biet (xanh ca tren HEAD lan baseline, chung minh harness chu khong phai feature): make check (E10) — regression-guard co chu y.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bo kiem trinh duyet do vi canh bao hydration do bai kiem cham trang qua som; tra ve trien khai.
Round 2: con do cung nguyen nhan (E4); mot cua chung cho moi bai kiem doi trang sau dau hydrat hoa; tra ve trien khai.
Round 3: PASS — cho vung du lieu truoc, hai bai pha cat trang bat dau tren dau hydrat hoa; E3, E4, E10 va lenh build xanh; cac eval con lai mang tu round 1.
