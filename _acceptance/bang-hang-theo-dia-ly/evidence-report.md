---
schema_version: 2
feature_slug: bang-hang-theo-dia-ly
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7a98b9a25e0434aff21a5637fc9f4f43366d1207
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

- eval: E4
  run_id: minted-bang-hang-theo-dia-ly-E4-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T18:06:53Z
  output: |
    12 passed (38.5s)

- eval: E7
  run_id: minted-bang-hang-theo-dia-ly-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T18:06:53Z
  output: |
    12 passed (38.5s)

- eval: E8
  run_id: minted-bang-hang-theo-dia-ly-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T18:06:53Z
  output: |
    12 passed (38.5s)

- eval: E9
  run_id: minted-bang-hang-theo-dia-ly-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T18:06:53Z
  output: |
    12 passed (38.5s)

- eval: E11
  run_id: minted-bang-hang-theo-dia-ly-E11-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T18:06:53Z
  output: |
    12 passed (38.5s)

- eval: E12
  run_id: minted-bang-hang-theo-dia-ly-E12-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly_e2e_db
  verified_at: 2026-11-14T18:06:53Z
  output: |
    12 passed (38.5s)

- eval: E6
  run_id: minted-bang-hang-theo-dia-ly-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T18:06:53Z
  output: |
    vitest geo-tree.test.ts và dia-ly.test.tsx xanh (reporter verbose)

- eval: E14
  run_id: minted-bang-hang-theo-dia-ly-E14-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T18:06:53Z
  screenshot: evidence/E14-phan-khu-1440-sang.png
  observed: |
    E14-phan-khu-1440-sang.png: signed in as [Sàn mẫu Ocean]. Second column has "Bảng hàng" with "Tất cả hàng" not lit, then "Theo trạng thái" with 6 statuses, then one group per project with the same heading style: "Vinhomes Ocean Park 1" (Tất cả, The Sapphire 1, S1.01, S1.02, S1.03, S1.05), "Vinhomes Ocean Park 2 – The Empire" (Tất cả, [MAU] Toà E1), "Vinhomes Ocean Park 3 – The Crown" (Tất cả, [MAU] Toà C1). No counts anywhere. Only "The Sapphire 1" is lit, in full. The Toà box shows "S1.01, S1.02, S" (cut) and the Dự án box "Vinhomes Ocean P" (cut). Footer "36 / 60 dòng".
    E14-phan-khu-1440-toi.png: the same screen in dark. Same tree, only The Sapphire 1 lit, same cut filter boxes, footer "36 / 60 dòng".
    E14-ngan-360-sang.png: the App Shell sheet at 360 shows the same tree (status group, three project groups, no counts), with "Tất cả hàng" lit as nothing is picked yet.
    E14-toa-360-sang.png: after clicking [MAU] Toà E1 the sheet is closed. Toà box shows "[MAU] Toà E" (cut), the grid rows are all "[MAU] Toà E1", footer "12 / 60 dòng".
    E14-sent-1440-sang.png vs -truoc: second column identical, "Đã gửi" with "Tất cả link" lit and no tree. E14-sent-360-sang.png vs -truoc: identical sheet with "Đã gửi" and "Tất cả link" lit, no tree.
    E14-tuy-chinh-1440-sang.png vs -truoc: second column identical ("Tuỳ chỉnh của sàn" with Nhãn riêng lit, 4 more entries, no tree); only the main area differs (empty state versus error panel). E14-tuy-chinh-360-sang.png vs -truoc: sheet identical.
    All frames match the expected text.
  network_observed: clean

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
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:36:18Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-bang-hang-theo-dia-ly-E5-r2
  exit_code: 0
  verifier: config:executors.test.dia_ly
  verified_at: 2026-11-14T17:36:18Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-bang-hang-theo-dia-ly-E10-r2
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T17:36:18Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-bang-hang-theo-dia-ly-E13-r1
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-bang-hang-theo-dia-ly-E15-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T17:19:00Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-theo-dia-ly-SUITE-make_check-r3
  exit_code: 0
  verified_at: 2026-11-14T18:06:53Z

- cmd: npm run build
  run_id: minted-bang-hang-theo-dia-ly-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-14T18:06:53Z

- cmd: make e2e
  run_id: bpviob33o
  exit_code: 0
  verified_at: 2026-11-14T18:06:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 2 — baseline khong do lai round nay

Eval khong-phan-biet (xanh tren ca code moi lan baseline): lenh `make test` phu E10 — chu y giu lam regression-guard cho bai luoi cu cua 2a, 2e; baseline round nay khong do lai (n-a).

## Variance

none — moi eval chay mot lan, deterministic, khong co phuong sai

## Iterations

Round 1: E14 khong dat — khung ui-check chua dat; tra ve implementation.
Round 2: PASS sau khi sua; bang chung va run log round 2 da ghi.
Round 3: sau sua «Tất cả hàng» sau khi chon mot noi (commit 7a98b9a), chay lai E4, E6, E7, E8, E9, E11, E12, E14 va suite; tat ca PASS, E1, E2, E3, E5, E10, E13, E15 carry-forward.
