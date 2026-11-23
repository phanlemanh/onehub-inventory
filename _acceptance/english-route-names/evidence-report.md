---
schema_version: 2
feature_slug: english-route-names
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 88aca04cf0ce0687f0a3670fbba591ffda17a797
human_signoff:
---

# Evidence Report: english-route-names

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-8 | script | PASS |
| E1-pha | AC-8 | script | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-7 | test | PASS |
| E5 | AC-6 | test | PASS |
| E6 | AC-9 | script | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | test | PASS |
| E9 | AC-1 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14-ui | AC-3 | ui-check | PASS |
| E15 | AC-4 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-english-route-names-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T07:17:17Z
  output: |
    luu-tru: 0 bang luu dia chi

- eval: E1-pha
  run_id: minted-english-route-names-E1-pha-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T07:17:17Z
  output: |
    self-test: 11/11 do dung cho

- eval: E2
  run_id: minted-english-route-names-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test
  verified_at: 2026-11-23T07:17:17Z
  output: |
    vitest run tests/company-layer-route.test.ts src/modules/company-config/ui: all cases passed

- eval: E3
  run_id: minted-english-route-names-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test
  verified_at: 2026-11-23T07:17:17Z
  output: |
    vitest run tests/company-layer-route.test.ts: all cases passed

- eval: E4
  run_id: minted-english-route-names-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-ids.sh
  verified_at: 2026-11-23T07:17:17Z
  output: |
    pha-thu-mo-dung-ma-cu: do dung cho — old-ids: open contract uses tuy-chinh-san

- eval: E5
  run_id: minted-english-route-names-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test
  verified_at: 2026-11-23T07:17:17Z
  output: |
    vitest run vai-man-so-man, vai-man-nut-sinh, bo-nut-vai-man, vong-doi-thao-tac, coverage-matrix, tools/e2e_templates: all passed

- eval: E6
  run_id: minted-english-route-names-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-23T07:17:17Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E7
  run_id: minted-english-route-names-E7-r1
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T06:41:15Z
  carried_from_round: 1
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-english-route-names-E8-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.test
  verified_at: 2026-11-23T07:17:17Z
  output: |
    gac-hydration: 0 canh bao

- eval: E9
  run_id: minted-english-route-names-E9-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-23T07:17:17Z
  output: |
    gac-hydration: 0 canh bao

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
  run_id: minted-english-route-names-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-23T07:17:17Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-english-route-names-SUITE-DATABASE_URL_make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-23T07:17:17Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline): E6 (make check) — regression-guard có chủ ý, không phải bằng chứng riêng cho tính năng.

Baseline không đo:
- node _acceptance/english-route-names/rang/old-names.mjs --root .: bo qua baseline: tep _acceptance/english-route-names/rang/old-names.mjs co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/english-route-names/rang/old-names.mjs --root . --self-test: bo qua baseline: tep _acceptance/english-route-names/rang/old-names.mjs co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/company-layer-route.test.ts src/modules/company-config/ui --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/company-layer-route.test.ts co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/company-layer-route.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/company-layer-route.test.ts co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-route-names/rang/old-ids.sh: bo qua baseline: tep _acceptance/english-route-names/rang/old-ids.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào có runs lớn hơn 1).

## Iterations

Round 1: bộ eval đầu chạy xanh; S4 round 1 ghi nhận các phát hiện, đã sửa phần trong hợp đồng.
Round 2: E1, E1-pha, E2, E3, E4, E5, E6, E8, E9 chạy lại và xanh; E7, E10, E11, E12, E13, E14-ui, E15 mang từ round 1 (delta không chạm paths của chúng).
