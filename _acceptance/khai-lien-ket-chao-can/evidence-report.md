---
schema_version: 2
feature_slug: khai-lien-ket-chao-can
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: a1b8f0cc902026313a384e916d3b00f739739127
human_signoff: Manh Phan 2026-11-11
---

# Evidence Report: khai-lien-ket-chao-can

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | script | PASS |
| E7 | AC-7 | test | PASS |

## Evidence

- eval: E1
  run_id: minted-khai-lien-ket-chao-can-E1-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make test (tests/link-types.test.ts, ca AC-1) xanh; lệnh kết thúc thành công.

- eval: E2
  run_id: minted-khai-lien-ket-chao-can-E2-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make test (ca AC-2: sáu quan hệ mới, hai quan hệ cũ còn nguyên) xanh.

- eval: E3
  run_id: minted-khai-lien-ket-chao-can-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make test (ca AC-3: kiểu dùng lại từ bản sinh, không khai lại bằng tay) xanh.

- eval: E4
  run_id: minted-khai-lien-ket-chao-can-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make test (ca AC-4: vai liên kết chủ thuộc Seller hoặc Landlord) xanh.

- eval: E5
  run_id: minted-khai-lien-ket-chao-can-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make test (ca AC-5: băm SHA-256 sàn mẫu khớp hằng) xanh.

- eval: E6
  run_id: minted-khai-lien-ket-chao-can-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make check xanh; CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: minted-khai-lien-ket-chao-can-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T03:42:20Z
  output: |
    make test (ca AC-7: cùng sàn, mỗi lần chào đúng một căn) xanh.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-khai-lien-ket-chao-can-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-11T03:42:20Z

- cmd: make e2e
  run_id: minted-khai-lien-ket-chao-can-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-11T03:42:20Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh trên cả HEAD lẫn baseline), cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý:
- make test: E1, E2, E3, E4, E5, E7
- make check: E6

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: mọi eval xanh (E1-E7), hai lệnh suite xanh; verdict PASS.
