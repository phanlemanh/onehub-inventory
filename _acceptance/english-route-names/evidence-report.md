---
schema_version: 2
feature_slug: english-route-names
verdict: REJECT
failed_evals: ["E5","E8"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9263c65acfd876a0eac74fa440d3a656f37be821
human_signoff:
---

# Evidence Report: english-route-names

Round 1. Hai eval E5 và E8 đỏ: cả hai đều đọc `design/role-screen-buttons.md`, tệp này không có trên cây kiểm (tệp sinh ra, gitignore) nên bài kiểm dừng ở lỗi không thấy tệp. Không có lệnh fail nào nằm ngoài hai eval này.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-8 | script | PASS |
| E1-pha | AC-8 | script | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-7 | test | PASS |
| E5 | AC-6 | test | FAIL |
| E6 | AC-9 | script | PASS |
| E7 | AC-4 | script | PASS |
| E8 | AC-5 | test | FAIL |
| E9 | AC-1 | script | PASS |
| E10 | AC-9 | script | PASS |
| E11 | AC-9 | script | PASS |
| E12 | AC-9 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14-ui | AC-3 | ui-check | PASS |
| E15 | AC-4 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-english-route-names-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T06:41:15Z
  output: |
    luu-tru: 0 bang luu dia chi

- eval: E1-pha
  run_id: minted-english-route-names-E1-pha-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T06:41:15Z
  output: |
    self-test: 11/11 do dung cho

- eval: E2
  run_id: minted-english-route-names-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test
  verified_at: 2026-11-23T06:41:15Z
  output: |
    vitest tests/company-layer-route.test.ts src/modules/company-config/ui: xanh

- eval: E3
  run_id: minted-english-route-names-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test
  verified_at: 2026-11-23T06:41:15Z
  output: |
    vitest tests/company-layer-route.test.ts: xanh

- eval: E4
  run_id: minted-english-route-names-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-ids.sh
  verified_at: 2026-11-23T06:41:15Z
  output: |
    pha-thu-mo-dung-ma-cu: do dung cho — old-ids: open contract uses tuy-chinh-san

- eval: E5
  run_id: minted-english-route-names-E5-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test
  verified_at: 2026-11-23T06:41:15Z
  output: |
    Test Files  3 failed | 3 passed (6)
    Tests  12 failed | 126 passed (138)
    ENOENT: no such file or directory, open '/Users/manhphan/dev/onehub-inventory-cham-url/design/role-screen-buttons.md'
    (tests/e2e-db/vai-man.spec.ts:43, tests/vai-man-nut-sinh.test.ts:174, tools/e2e_templates/e2e-templates.test.ts)

- eval: E6
  run_id: minted-english-route-names-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-23T06:41:15Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E7
  run_id: minted-english-route-names-E7-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-23T06:41:15Z
  output: |
    gac-hydration: 0 canh bao

- eval: E8
  run_id: minted-english-route-names-E8-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.test
  verified_at: 2026-11-23T06:41:15Z
  output: |
    Error: ENOENT: no such file or directory, open 'design/role-screen-buttons.md'
    at generatedCells (tests/e2e/bo-nut.spec.ts:23:16)
    8 failed (bon-vai-hai-kho: listings, contacts x các vai) · 3 passed (23.1s)
    gac-hydration: 0 canh bao

- eval: E9
  run_id: minted-english-route-names-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.lop_rieng_e2e
  verified_at: 2026-11-23T06:41:15Z
  output: |
    gac-hydration: 0 canh bao

- eval: E10
  run_id: minted-english-route-names-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-23T06:41:15Z
  output: |
    gac-hydration: 0 canh bao

- eval: E11
  run_id: minted-english-route-names-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.kiem_chung_phien
  verified_at: 2026-11-23T06:41:15Z
  output: |
    gac-hydration: 0 canh bao

- eval: E12
  run_id: minted-english-route-names-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e_db
  verified_at: 2026-11-23T06:41:15Z
  output: |
    gac-hydration: 0 canh bao

- eval: E13
  run_id: minted-english-route-names-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: _acceptance/english-route-names/rang/old-names.mjs
  verified_at: 2026-11-23T06:41:15Z
  output: |
    wiki: 0 trang thuc the tro dia chi cu · nhat ky: 1 dong english-route-names

- eval: E14-ui
  run_id: minted-english-route-names-E14-ui-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-23T06:41:15Z
  screenshot: evidence/E14-ui-step1.png
  observed: |
    Step1 (fields, 1440): the page is signed in, shows header "[Sàn A thử lớp riêng]", a sub-menu "Tuỳ chỉnh của sàn" (Nhãn riêng, Trường riêng highlighted, Từ điển giá trị, Căn chờ khớp, Mẫu nhập, Thuế phí), the heading "Tuỳ chỉnh của sàn" and the "Thêm trường riêng" button. The "Trường riêng" table is empty: "0 dòng", "Chưa có dữ liệu ở đây", "Tải lại". The layout is intact and complete, with no error and no raw label. Step2 (templates, 1440): same shell, with "Mẫu nhập" highlighted in the sub-menu and the description "Dạng tệp Sheet đã nhập và cột nào đi vào đâu." The "Mẫu nhập" table is empty ("0 dòng", empty state "Chưa có mẫu nào...", "Tải lại"). The two frames share the same layout, differing only in the selected part, so they match each other and the screen looks normal, as it did before the address change (no broken layout or missing labels).
  network_observed: n-a (driver)

- eval: E15
  run_id: minted-english-route-names-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.ban_dung_that
  verified_at: 2026-11-23T06:41:15Z
  output: |
    ban-dung-that: 33 phép kiểm đạt

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-english-route-names-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-23T06:41:15Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả HEAD lẫn baseline): E6 (make check). Đây là bộ hồi quy bao trùm, nên xác nhận là regression-guard có chủ ý hoặc viết lại để khẳng định hành vi mới.

Baseline khong do:
- node _acceptance/english-route-names/rang/old-names.mjs --root .: bo qua baseline: tep _acceptance/english-route-names/rang/old-names.mjs co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- node _acceptance/english-route-names/rang/old-names.mjs --root . --self-test: bo qua baseline: tep _acceptance/english-route-names/rang/old-names.mjs co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/company-layer-route.test.ts src/modules/company-config/ui --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/company-layer-route.test.ts co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/company-layer-route.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/company-layer-route.test.ts co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- bash _acceptance/english-route-names/rang/old-ids.sh: bo qua baseline: tep _acceptance/english-route-names/rang/old-ids.sh co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts tests/e2e-db/lop-rieng.spec.ts: baseline vuot tran 50 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts tests/e2e-db/screens.spec.ts: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- DB_LANE=${DB_LANE:-v} DB_PORT=${DB_PORT:-5570} npx playwright test -c playwright.db.config.ts tests/e2e-db/bo-nut-members.spec.ts: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay
- node _acceptance/english-route-names/rang/old-names.mjs --root . --wiki: bo qua baseline: tep _acceptance/english-route-names/rang/old-names.mjs co o cay dang kiem nhung chua co o merge-base 9bf4054f6cb2bd2509277830b6c35d3c6297295d — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-k} DB_PORT=${DB_PORT:-5564} bash tools/deploy/thu-ban-dung.sh: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E5, E8 failed — cả hai bài kiểm đọc design/role-screen-buttons.md (tệp sinh ra, không có trên cây kiểm) và dừng vì không thấy tệp. Returned to implementation.
