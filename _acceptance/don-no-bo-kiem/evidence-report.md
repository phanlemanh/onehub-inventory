---
schema_version: 2
feature_slug: don-no-bo-kiem
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 6244f12aedbef6a801651d969b2cfd99609a2b93
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

- eval: E5
  run_id: minted-don-no-bo-kiem-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.gac_hydration_pha
  verified_at: 2026-11-15T23:48:35Z
  output: |
    gac-hydration-pha: luot co bai pha do (gac-hydration: 1 canh bao, bai: gac-hydration-pha.spec.ts › gac-hydration pha | screens/screens.spec.ts › man inventory › vung › vung cho-tai); luot khong bai pha xanh, 0 canh bao; hai cau hinh
    __EXIT=0

- eval: E6
  run_id: minted-don-no-bo-kiem-E6-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.so_quyet_dinh
  verified_at: 2026-11-15T23:48:35Z
  output: |
    src/generated/ontology.ts is up to date (21 entities)
    __EXIT=0

- eval: E8b
  run_id: minted-don-no-bo-kiem-E8b-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.release_de_xuat
  verified_at: 2026-11-15T23:48:35Z
  output: |
    release-de-xuat: khoa RELEASE_PLEASE_TOKEN, ba quyen doc-ghi, dong loi khop
    __EXIT=0

- eval: E10
  run_id: r6-l4-1-20261115234835
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T23:48:35Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

### Eval mang tu round truoc (carry-forward)

- eval: E1
  run_id: minted-don-no-bo-kiem-E1-r1
  exit_code: 0
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-don-no-bo-kiem-E2-r1
  exit_code: 0
  verifier: config:executors.script.cong_chay
  verified_at: 2026-11-15T18:18:36Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-don-no-bo-kiem-E3-r5
  exit_code: 0
  verifier: config:executors.script.cho_tai_pha
  verified_at: 2026-11-15T23:22:42Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-don-no-bo-kiem-E4-r5
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-15T23:22:42Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-don-no-bo-kiem-E7-r4
  exit_code: 0
  verifier: config:executors.script.wiki_so_trung
  verified_at: 2026-11-15T22:59:11Z
  carried_from_round: 4
  note: carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-don-no-bo-kiem-E9-r5
  exit_code: 0
  verifier: config:executors.script.ranh_gioi_1u
  verified_at: 2026-11-15T23:22:42Z
  carried_from_round: 5
  note: carry-forward tu round 5 — delta khong cham paths cua eval

### Judgment

- eval: E8
  judged_by: judge-subagent (fresh context)
  verdict: PASS
  rationale: panel giu nguyen tu round 4 — inputs khong doi, khong cham lai; rationale xem round do
  votes:
    - domain-correctness: PASS (r4)
    - operational-feasibility: PASS (r4)
    - spec-alignment: PASS (r4)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-don-no-bo-kiem-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-15T23:48:35Z

- cmd: make e2e
  run_id: minted-don-no-bo-kiem-SUITE-make_e2e-r6
  exit_code: 0
  verified_at: 2026-11-15T23:48:35Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval khong phan biet (xanh ca tren code moi lan baseline): E10 (`make check`) — regression-guard co chu y cho toan bo cay, khong phai eval rieng cua feature.

Baseline khong do:
- node _acceptance/don-no-bo-kiem/rang/gac-hydration-pha.mjs: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/gac-hydration-pha.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs --root . && make ontology: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/so-quyet-dinh.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/don-no-bo-kiem/rang/release-de-xuat.mjs --root .: bo qua baseline: tep _acceptance/don-no-bo-kiem/rang/release-de-xuat.mjs co o cay dang kiem nhung chua co o merge-base b6f4f2934b4bdc5d0625755bb59efacb6448f284 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 5: bi tu choi tren 7146525 — canh bao ngat vung sau #70 va danh sach ranh gioi con tep cua #66. Tra ve cho giai doan trien khai.
Round 6: PASS tren 6244f12 — bo trinh duyet xanh, phep gac hydration 0 canh bao; E5, E6, E8b, E10 chay lai, cac eval con lai mang tu round 1, 4 va 5.
