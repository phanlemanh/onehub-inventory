---
schema_version: 2
feature_slug: thue-phi
verdict: BLOCKED
failed_evals: []
reason: "Postgres dãy N không chạy được (ổ dữ liệu và kho siêu dữ liệu của Docker ở chế độ chỉ đọc: could not open file base/5/2601, meta.db read-only). Chặn 4 eval DB (E3, E4, E7-db, E10), E6-e2e, E7 và 6 eval ui-check (E2-ui, E3-ui, E4-ui, E6-ui, E9-ui, E10-ui). Cách gỡ: khởi động lại Docker Desktop, chạy make db-up cho dãy n cổng 5563, rồi chạy lại. Không phải lỗi mã của tính năng."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 46abb25cacfe01f48e0966eb79d34a6066b330b8
human_signoff:
---

# Evidence Report: thue-phi

Vòng 1. Các eval cần Postgres không chạy được vì hạ tầng DB cục bộ hỏng, không phải vì kết quả nghiệp vụ. Các khung ảnh E2, E3, E4, E6, E9, E10 có sẵn trong evidence/ có từ trước vòng này (00:53 ngày 15/11), không do vòng này tạo, nên không được dùng làm bằng chứng.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | BLOCKED |
| E3 | AC-3 | script | BLOCKED |
| E3-unit | AC-3 | test | PASS |
| E3-ui | AC-3 | ui-check | BLOCKED |
| E4 | AC-4 | script | BLOCKED |
| E4-unit | AC-4 | test | PASS |
| E4-ui | AC-4 | ui-check | BLOCKED |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6-e2e | AC-6 | script | BLOCKED |
| E6-ui | AC-6 | ui-check | BLOCKED |
| E7 | AC-7 | script | BLOCKED |
| E7-db | AC-7 | script | BLOCKED |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | chờ người quyết (đề xuất panel: FAIL) |
| E6-khuon | AC-6 | script | PASS |
| E6-floor | AC-6 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9-ui | AC-9 | ui-check | BLOCKED |
| E9-khuon | AC-9 | script | PASS |
| E10 | AC-10 | script | BLOCKED |
| E10-ui | AC-10 | ui-check | BLOCKED |

## Evidence

- eval: E1
  run_id: minted-thue-phi-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T22:40:36Z
  output: |
    npx vitest run src/modules/company-config/fee-schedule.test.ts src/modules/company-config/ui/fee-part.test.tsx
    lệnh chạy xong, __EXIT=0

- eval: E2
  run_id: minted-thue-phi-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh vitest với E1, __EXIT=0

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh vitest với E1, __EXIT=0

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh vitest với E1, __EXIT=0

- eval: E9
  run_id: minted-thue-phi-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh vitest với E1, __EXIT=0

- eval: E3
  run_id: minted-thue-phi-E3-r1
  status: BLOCKED (không chạy được, hạ tầng DB)
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T22:40:36Z
  output: |
    npx vitest run -c vitest.db.config.ts tests/db/thue-phi.db.test.ts
    cả 6 ca hỏng trước khi chạy assertion nào: could not open file "base/5/2601": Read-only file system (SQLSTATE 42501)
    Tests 6 failed (6)

- eval: E4
  run_id: minted-thue-phi-E4-r1
  status: BLOCKED (không chạy được, hạ tầng DB)
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh với E3; ca vai-8-o-api và vai-8-o-db hỏng vì lỗi ổ đĩa chỉ đọc của Postgres

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r1
  status: BLOCKED (không chạy được, hạ tầng DB)
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh với E3; ca hai-san-6-o hỏng vì lỗi ổ đĩa chỉ đọc của Postgres

- eval: E10
  run_id: minted-thue-phi-E10-r1
  status: BLOCKED (không chạy được, hạ tầng DB)
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh với E3; ca khoan-rieng hỏng vì lỗi ổ đĩa chỉ đọc của Postgres

- eval: E5
  run_id: minted-thue-phi-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T22:40:36Z
  output: |
    npx vitest run tests/thue-phi-ontology.test.ts tests/thue-phi-cot.test.ts
    lệnh chạy xong, __EXIT=0

- eval: E6
  run_id: minted-thue-phi-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh vitest với E5, __EXIT=0

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r1
  status: BLOCKED (không chạy được, hạ tầng DB)
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-14T22:40:36Z
  output: |
    npx playwright test -c playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts
    error: could not open file "base/5/2601": Read-only file system (lặp ở pg-protocol)
    spec không đến được bước kiểm nào

- eval: E7
  run_id: minted-thue-phi-E7-r1
  status: BLOCKED (không chạy được, hạ tầng DB)
  baseline: red
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-14T22:40:36Z
  output: |
    bash db/scripts/cach-ly.sh
    psql: FATAL: could not open file "base/5/2601": Read-only file system

- eval: E8
  run_id: minted-thue-phi-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T22:40:36Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T22:40:36Z
  output: |
    design-floor-khuon.mjs --kiem
    16 tệp giao diện ngoài bản đồ
    __EXIT=0

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T22:40:36Z
  output: |
    cùng lệnh với E6-khuon, __EXIT=0

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-14T22:40:36Z
  output: |
    design-floor-s4.mjs --root .
    __EXIT=0

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r1
  status: BLOCKED (không chụp được khung, hạ tầng DB)
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T22:40:36Z
  screenshot: (không có khung mới ở vòng này)
  observed: |
    Không có khung nào được chụp ở vòng này; bốn khung E2 cũ có sẵn không được mở và không tính làm bằng chứng.
  network_observed: n-a (driver)

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r1
  status: BLOCKED (không chụp được khung, Docker chỉ đọc)
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T22:40:36Z
  screenshot: (không có khung mới ở vòng này)
  observed: |
    Không có khung nào được chụp ở vòng này; ba khung E3 cũ có sẵn không được mở và không tính làm bằng chứng.
  network_observed: n-a (driver)

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r1
  status: BLOCKED (không chụp được khung, Docker chỉ đọc)
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T22:40:36Z
  screenshot: (không có khung mới ở vòng này)
  observed: |
    Không có khung nào được chụp ở vòng này; khung sáng và tối của E4 chưa được kiểm.
  network_observed: n-a (driver)

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r1
  status: BLOCKED (không chụp được khung, cổng 5563 từ chối kết nối)
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T22:40:36Z
  screenshot: (không có khung mới ở vòng này)
  observed: |
    Không có khung nào được chụp ở vòng này; chưa kiểm được cột Về tay ở 1440, năm khung E6 cũ không được mở.
  network_observed: n-a (driver)

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r1
  status: BLOCKED (không chụp được khung, Docker chỉ đọc)
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T22:40:36Z
  screenshot: (không có khung mới ở vòng này)
  observed: |
    Không có khung nào được chụp ở vòng này; chưa so được khung Thuế phí với khung Thành viên.
  network_observed: n-a (driver)

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r1
  status: BLOCKED (không chụp được khung, Docker chỉ đọc)
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-14T22:40:36Z
  screenshot: (không có khung mới ở vòng này)
  observed: |
    Không có khung nào được chụp ở vòng này; bốn khung E10 chưa được kiểm, các khung cũ không được mở.
  network_observed: n-a (driver)

### Judge panel (đề xuất, chưa có người quyết)

- eval: E8-wiki
  judged_by: judge panel (fresh context), đề xuất panel là FAIL
  verdict: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — Phần lớn đạt: trang fee-schedule nêu 2% và 0,5% theo luật, khoảng 0–5% bước 0,1%, mặc định 1%, nội bộ, trang khách không đọc (SP-4); listing.md có Điều kiện phí; log.md đúng một dòng cho hàng 19. Còn hai chỗ hở: trang fee-schedule chỉ nêu tên quyền readFeeSchedule và setFeeSchedule, không nói vai nào đặt hay đọc; screens.yaml chỉ có setFeeSchedule trong nut của màn tuy-chinh-san, không có phần tên Thuế phí.
    - operational-feasibility: FAIL — Trang listing có Điều kiện phí và log có đúng một dòng hàng 19. Nhưng sổ màn chỉ thêm setFeeSchedule vào nút của màn tuy-chinh-san, không có phần tên «Thuế phí». Trang fee-schedule không nói ai đặt, ai đọc theo vai, và không nói rõ khoảng môi giới.
    - spec-alignment: FAIL — Trang fee-schedule có hai khoản luật 2% và 0,5%, Phí môi giới mặc định 1%, khoảng 0–5% và dòng «trang khách không đọc (SP-4)»; trang listing có Điều kiện phí; log có đúng một dòng hàng 19. Nhưng design/screens.yaml chỉ có setFeeSchedule trong nut của màn tuy-chinh-san (dòng 85), không có phần «Thuế phí»; vao_vung chỉ trỏ phan=can-cho. Trang fee-schedule chưa nói vai nào đặt hay đọc mức.
  rationale: Hai phiếu FAIL và một phiếu UNCERTAIN cùng chỉ vào hai chỗ hở, sổ màn thiếu phần Thuế phí và wiki không nêu vai đặt và vai đọc. Người quyết ở Cổng 2.
  required_evidence:
    - Chỗ chốt cách đọc «ai đặt, ai đọc»: trang wiki/entities/fee-schedule.md có câu nêu vai (chủ sàn, quản lý, nhân viên) cho từng quyền, hoặc _acceptance/thue-phi/contract.md hay ontology/actions.yaml cho thấy việc ánh xạ quyền sang vai nằm ở chỗ khác và đủ để coi là đã nói.
    - Chỗ chốt «phần Thuế phí» trong sổ màn: contract.md AC-8 nói rõ chỉ cần setFeeSchedule nằm trong nut của màn tuy-chinh-san, hoặc design/screens.yaml có mục riêng tên Thuế phí trên màn tuy-chinh-san.
    - Trong design/screens.yaml (màn tuy-chinh-san, dòng 77-87): thêm một phần Thuế phí để câu «sổ màn có phần Thuế phí» đọc được; trong wiki/entities/fee-schedule.md nêu vai đặt và vai đọc bằng tiếng sản phẩm, và nêu rõ khoảng 0–5% của Phí môi giới đứng cạnh mặc định 1%.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T22:40:36Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-14T22:40:36Z
  ghi_chú: không gắn eval nào. 1141 ca qua, 925 bỏ qua, 10 ca hỏng ở sheet.spec.ts, ho-so-can.spec.ts, sua-tren-o.spec.ts, ho-so-du-thong-tin.spec.ts và screens/inventory-width.spec.ts (ví dụ sua-tren-o.spec.ts dòng 270, ô Unit.livingArea của căn 1101 không có thuộc tính data-cell-focused). Tệp bị hỏng không thuộc tệp thuế phí; người xem Cổng 2 cần xác định có phải hồi quy do nhánh này hay không.

## Known limits

## Ngoài hợp đồng

## Analyst

Baseline không đo
- npx vitest run src/modules/company-config/fee-schedule.test.ts src/modules/company-config/ui/fee-part.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/company-config/fee-schedule.test.ts co o cay dang kiem nhung chua co o merge-base 20a13c22aa0181e31d639306e6c25c4289a8f60f — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/thue-phi.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/thue-phi.db.test.ts co o cay dang kiem nhung chua co o merge-base 20a13c22aa0181e31d639306e6c25c4289a8f60f — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/thue-phi-ontology.test.ts tests/thue-phi-cot.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/thue-phi-ontology.test.ts co o cay dang kiem nhung chua co o merge-base 20a13c22aa0181e31d639306e6c25c4289a8f60f — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts: bo qua baseline: tep tests/e2e-db/thue-phi.spec.ts co o cay dang kiem nhung chua co o merge-base 20a13c22aa0181e31d639306e6c25c4289a8f60f — eval moi, chay tren code cu khong phan biet gi

Eval không phân biệt (xanh trên cả nhánh lẫn baseline, chứng minh harness chứ chưa chứng minh tính năng; viết lại để kiểm hành vi mới, hoặc xác nhận là lớp chặn hồi quy có chủ ý):
- E8 (make check)
- E6-khuon và E9-khuon (design-floor-khuon.mjs --kiem)
- E6-floor (design-floor-s4.mjs)

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào chạy nhiều hơn một lần).

## Iterations

Round 1: bị chặn bởi hạ tầng. Postgres dãy N và kho siêu dữ liệu của Docker Desktop ở chế độ chỉ đọc, nên 4 eval DB, E6-e2e, E7 và 6 eval ui-check không chạy được; không sửa mã, không chạy lại. Cần khởi động lại Docker Desktop, make db-up cho dãy n cổng 5563 rồi chạy lại vòng 2. make e2e có 10 ca hỏng ngoài các tệp thuế phí cần người xem.
