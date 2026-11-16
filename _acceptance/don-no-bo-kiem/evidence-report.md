---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a00b21736339730f558224a83be763d05479bd38
human_signoff: Manh Phan 2026-11-16
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
  run_id: minted-don-no-bo-kiem-E3-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-16T03:51:33Z
  output: |
    cho-tai-pha: ca pha bat dung 'cho-tai: khung cho khong hien' o 360 va 1440, 0 canh bao, so dang ky bang main

- eval: E4
  run_id: minted-don-no-bo-kiem-E4-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-16T03:51:33Z
  output: |
    gac-hydration: 0 canh bao

- eval: E5
  run_id: minted-don-no-bo-kiem-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gac_hydration_pha
  verified_at: 2026-11-15T23:48:35Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-don-no-bo-kiem-E6-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-16T03:51:33Z
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
  run_id: minted-don-no-bo-kiem-E8b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T23:48:35Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T23:22:42Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-don-no-bo-kiem-E10-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-16T03:51:33Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

### Judgment

- eval: E8
  judged_by: judge panel (carried)
  verdict: PASS
  rationale: panel giu nguyen tu round 4 — inputs khong doi, khong cham lai; rationale xem round do.
  votes:
    - domain-correctness: PASS (r4)
    - operational-feasibility: PASS (r4)
    - spec-alignment: PASS (r4)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r7
  exit_code: 0
  verified_at: 2026-11-16T03:51:33Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 6 — baseline khong do lai round nay

Eval khong-phan-biet (xanh tren ca HEAD lan baseline), nen xac nhan la regression-guard co chu y:
- make check (E10)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1-6: lich su nam trong run-log (E1, E2 o round 1; E7 o round 4; E9 o round 5; E5, E8b o round 6).
Round 7: E3, E4, E6, E10 chay lai va dat; E1, E2, E5, E7, E8, E8b, E9 carry-forward; lenh suite npm run build dat.

### Re-pin lần 1 — 2026-11-16, do lượt ghim lại cuối của hàng 1u sau khi gộp nhánh chính 7ea2f53 (G-1611-41)
run_id: repin-20261116T070937Z-41988
sha: 038f0756f995c1fef3b8028b48d689a3280ddade · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths)

### Re-pin lần 2 — 2026-11-16, do tests/wiki-lint-so-trung.test.ts: so dich 0043 thanh 0999 (hang 22, K-30, G-1611-71)
run_id: repin-20261116T161618Z-52851
sha: 3ceeee39da0f6c5d65eeb78f6308574a8911e6c3 · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths)

### Re-pin lần 3 — 2026-11-16, do hang 22 sua bai DB cho CI (tests/db), ghim lai 1u
run_id: repin-20261116T175753Z-34800
sha: d8444a91547391b8ca0671933cd7b1cb1bb5c827 · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths)

### Re-pin lần 4 — 2026-11-16, do hang 22 so ban cong cu sao luu (db/scripts, tests/db), ghim lai 1u
run_id: repin-20261116T192708Z-87025
sha: fa302e8e94c40cfc7ce6e51b3d53271d13cab48a · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths)

### Re-pin lần 5 — 2026-11-16, do hang 22: Next 16.4.6 va cau in khoi-phuc-thu.sh, ghim lai 1u
run_id: repin-20261116T203737Z-82999
sha: a00b21736339730f558224a83be763d05479bd38 · suites: 3 lệnh exit 0 · evals: 10/10 eval máy đạt kỳ vọng · ngoài làn máy: E8 (E8 không khai paths)
