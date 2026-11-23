---
schema_version: 2
feature_slug: english-route-names
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2a4be2c49592b96046cdbd3ff78625739f42b197
human_signoff:
---

# Evidence Report: english-route-names

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1-pha | AC-8 | script | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E5 | AC-6 | test | PASS |
| E6 | AC-9 | script | PASS |
| E8 | AC-5 | test | PASS |
| E1 | AC-8 | script | PASS (carried từ round 2) |
| E4 | AC-7 | test | PASS (carried từ round 2) |
| E7 | AC-4 | script | PASS (carried từ round 1) |
| E9 | AC-1 | script | PASS (carried từ round 2) |
| E10 | AC-9 | script | PASS (carried từ round 1) |
| E11 | AC-9 | script | PASS (carried từ round 1) |
| E12 | AC-9 | script | PASS (carried từ round 1) |
| E13 | AC-9 | script | PASS (carried từ round 1) |
| E14-ui | AC-3 | ui-check | PASS (carried từ round 1) |
| E15 | AC-4 | script | PASS (carried từ round 1) |

## Evidence

- eval: E1-pha
  run_id: minted-english-route-names-E1-pha-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T07:38:49Z
  output: |
    self-test: 11/11 do dung cho

- eval: E2
  run_id: minted-english-route-names-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/chay.sh
  verified_at: 2026-11-23T07:38:49Z
  output: |
    bash _acceptance/english-route-names/rang/chay.sh E2 chay xong, khong co dong do

- eval: E3
  run_id: minted-english-route-names-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/chay.sh
  verified_at: 2026-11-23T07:38:49Z
  output: |
    bash _acceptance/english-route-names/rang/chay.sh E3 chay xong, khong co dong do

- eval: E5
  run_id: minted-english-route-names-E5-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/chay.sh
  verified_at: 2026-11-23T07:38:49Z
  output: |
    bash _acceptance/english-route-names/rang/chay.sh E5 chay xong, khong co dong do

- eval: E6
  run_id: minted-english-route-names-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-23T07:38:49Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E8
  run_id: minted-english-route-names-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/chay.sh
  verified_at: 2026-11-23T07:38:49Z
  output: |
    gac-hydration: 0 canh bao

- eval: E1
  run_id: minted-english-route-names-E1-r2
  exit_code: 0
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T07:17:17Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-english-route-names-E4-r2
  exit_code: 0
  verifier: _acceptance/english-route-names/rang/old-ids.sh
  verified_at: 2026-11-23T07:17:17Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-english-route-names-E7-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-english-route-names-E9-r2
  exit_code: 0
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-23T07:17:17Z
  carried_from_round: 2
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-english-route-names-E10-r1
  exit_code: 0
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-english-route-names-E11-r1
  exit_code: 0
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-english-route-names-E12-r1
  exit_code: 0
  verifier: config:executors.script.bo_nut_e2e_db
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E13
  run_id: minted-english-route-names-E13-r1
  exit_code: 0
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14-ui
  run_id: minted-english-route-names-E14-ui-r1
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval
  screenshot: evidence/E14-ui-step1.png
  observed: |
    Step1 (fields, 1440): the page is signed in, shows header "[Sàn A thử lớp riêng]", a sub-menu "Tuỳ chỉnh của sàn" (Nhãn riêng, Trường riêng highlighted, Từ điển giá trị, Căn chờ khớp, Mẫu nhập, Thuế phí), the heading "Tuỳ chỉnh của sàn" and the "Thêm trường riêng" button. The "Trường riêng" table is empty: "0 dòng", "Chưa có dữ liệu ở đây", "Tải lại". The layout is intact and complete, with no error and no raw label. Step2 (templates, 1440): same shell, with "Mẫu nhập" highlighted in the sub-menu and the description "Dạng tệp Sheet đã nhập và cột nào đi vào đâu." The "Mẫu nhập" table is empty ("0 dòng", empty state "Chưa có mẫu nào...", "Tải lại"). The two frames share the same layout, differing only in the selected part, so they match each other and the screen looks normal, as it did before the address change (no broken layout or missing labels).
  network_observed: n-a (driver)

- eval: E15
  run_id: minted-english-route-names-E15-r1
  exit_code: 0
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-english-route-names-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-23T07:38:49Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-english-route-names-SUITE-DATABASE_URL_make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-23T07:38:49Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

Baseline khong do:
- node _acceptance/english-route-names/rang/old-names.mjs --root . --self-test: bo qua baseline: tep _acceptance/english-route-names/rang/old-names.mjs co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-route-names/rang/chay.sh E2: bo qua baseline: tep _acceptance/english-route-names/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-route-names/rang/chay.sh E3: bo qua baseline: tep _acceptance/english-route-names/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-route-names/rang/chay.sh E5: bo qua baseline: tep _acceptance/english-route-names/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- make check: baseline vuot tran 180 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- bash _acceptance/english-route-names/rang/chay.sh E8: bo qua baseline: tep _acceptance/english-route-names/rang/chay.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E7, E10, E11, E12, E13, E14-ui, E15 verified (run-log r1); chuyen sang round 2 de chay lai cac eval bi delta cham.
Round 2: E1, E4, E9 verified lai (run-log r2); phan con lai carry-forward tu round 1.
Round 3: E1-pha, E2, E3, E5, E6, E8 va hai lenh suite chay lai tren commit 2a4be2c4 (lenh eval chuyen sang rang/chay.sh); E1, E4, E7, E9-E15 carry-forward, PASS.
