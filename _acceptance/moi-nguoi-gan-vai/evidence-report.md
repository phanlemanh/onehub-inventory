---
schema_version: 2
feature_slug: moi-nguoi-gan-vai
verdict: BLOCKED
failed_evals: ["E7","E9","E13","E14"]
reason: "bash db/scripts/cach-ly.sh (E11): Script db/scripts/cach-ly.sh thoát với mã 2 vì thiếu biến môi trường DB_LANE. Script báo có 2 container onehub-inventory-db-* đang chạy và yêu cầu đặt DB_LANE=<dãy>. Không chạy lại, không tự đặt DB_LANE và không đổi lệnh đã ghim. Cần người xác định dãy DB_LANE đúng rồi chạy lại."
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 26333f014aecd8461a333ef33c1f25951e7b14ef
human_signoff:
---

# Evidence Report: moi-nguoi-gan-vai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-5 | script | FAIL |
| E8 | AC-6 | script | PASS |
| E9 | AC-6 | script | FAIL |
| E10 | AC-7 | script | PASS |
| E11 | AC-7 | script | BLOCKED |
| E12 | AC-8 | script | PASS |
| E13 | AC-9 | script | FAIL |
| E14 | AC-9 | ui-check | FAIL |
| E15 | AC-8 | script | PASS |

Round này BLOCKED: E11 không chạy được vì thiếu DB_LANE (xem frontmatter). Bốn eval E7, E9, E13, E14 đỏ. Ghi chú về E7, E9, E13: lệnh Playwright chạy toàn bộ bốn khổ trong 7,5 phút, 21 ca lỗi "Internal Server Error" ở trang đăng nhập (không thấy `data-state=email`); E14 ghi nhận chạy lại theo từng khổ thì 1440 và 360 đều qua 6/6 nhưng khổ 414 và 1024 chưa được chạy lại, nên lệnh ghim vẫn đỏ.

## Evidence

- eval: E1
  run_id: minted-moi-nguoi-gan-vai-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts (cùng lệnh với E2, E4, E5, E6, E8, E10, E12) hoàn tất, __EXIT=0

- eval: E2
  run_id: minted-moi-nguoi-gan-vai-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E3
  run_id: minted-moi-nguoi-gan-vai-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T09:58:45Z
  output: |
    make test hoàn tất, __EXIT=0

- eval: E4
  run_id: minted-moi-nguoi-gan-vai-E4-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E5
  run_id: minted-moi-nguoi-gan-vai-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E6
  run_id: minted-moi-nguoi-gan-vai-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E7
  run_id: minted-moi-nguoi-gan-vai-E7-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T09:58:45Z
  output: |
    playwright members.spec.ts: 21 failed, 3 passed (7.5m). Ca 'doi-vai-thanh-ben' lỗi ở các khổ 414, 1024, 1440.
    Lỗi tại signIn (members.spec.ts:93): waiting for locator('[data-state="email"][data-ready]')

- eval: E8
  run_id: minted-moi-nguoi-gan-vai-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E9
  run_id: minted-moi-nguoi-gan-vai-E9-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T09:58:45Z
  output: |
    playwright members.spec.ts: ca 'khong-du-quyen' lỗi ở các khổ 414, 1024, 1440 (cùng lệnh với E7).

- eval: E10
  run_id: minted-moi-nguoi-gan-vai-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E11
  run_id: minted-moi-nguoi-gan-vai-E11-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.cach_ly
  verified_at: 2026-11-11T09:58:45Z
  output: |
    BLOCKED, không chạy được: cần DB_LANE: thấy 2 container onehub-inventory-db-* đang chạy — đặt DB_LANE=<dãy> (make db-up DB_LANE=<dãy>)

- eval: E12
  run_id: minted-moi-nguoi-gan-vai-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/db/moi-nguoi.db.test.ts hoàn tất, __EXIT=0

- eval: E13
  run_id: minted-moi-nguoi-gan-vai-E13-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T09:58:45Z
  output: |
    playwright members.spec.ts: các ca 'loi-va-thu-lai', 'ban-phim-hop-thoai', 'axe-sang-toi' lỗi ở các khổ 360, 414, 1024, 1440;
    'moi-nguoi-va-dang-nhap' lỗi ở 414, 1024, 1440. Nguyên nhân đầu tiên: trang đăng nhập không hiện data-state=email.

- eval: E14
  run_id: minted-moi-nguoi-gan-vai-E14-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-11T09:58:45Z
  screenshot: evidence/E14-step1.png   # E14-step2.png là bản sao ST-members-loading
  observed: |
    members-ready-1440-sang: light, title "Thành viên", blue "Mời người" button at top right, 3 rows ([Tên] LA, P, R) with email, role chips "Đầu chủ", "Quản trị sàn", "Đầu khách"+"Trưởng nhóm", "Người mời: —", "Đổi vai" button; readable, no overlap. members-ready-1440-toi: same in dark, chips and button readable. members-ready-360-sang/toi: single column, button next to title, chips in words, no sideways overflow, no overlapping text. members-invite-open-1440-sang/toi: "Mời người" dialog centered with Email, Tên trong sàn, Vai (4 checkboxes in words), buttons "Thôi" and "Mời"; list blurred behind. members-invite-open-360-sang/toi: dialog fits the 360 width, checkboxes stacked, buttons full width, no overlap. ST-members-ready: 3-row list. ST-members-long: long name cut with an ellipsis, chips and buttons intact. ST-members-error: "Màn này chưa hiện được" with the explaining sentence and a "Thử lại" button. ST-members-forbidden: "Không đủ quyền", the sentence about the role, button "Về trang đầu", no "Thành viên" in the sidebar. ST-invite-already: "Email này đã ở trong sàn." under a red field. ST-invite-failed: "Chưa lưu được. Máy chủ đang gặp lỗi, phần bạn đã gõ vẫn còn..." with "Thử lại". ST-invite-invalid: "Email chưa đúng khuôn, ví dụ ten@congty.vn.", "Gõ tên người này như sàn vẫn gọi.", "Chọn ít nhất một vai." ST-roles-last-admin: "Mỗi sàn cần ít nhất một Quản trị sàn. Gán vai này cho người khác trước." CONTRADICTION: ST-members-loading shows the full list with data (identical to ST-members-long), no skeleton, so the loading state is not shown.
  network_observed: n-a (driver)

- eval: E15
  run_id: minted-moi-nguoi-gan-vai-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.vai_man
  verified_at: 2026-11-11T09:58:45Z
  output: |
    vitest tests/coverage-matrix.test.ts hoàn tất, __EXIT=0

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-moi-nguoi-gan-vai-SUITE-make_check-r1
  exit_code: 2
  verified_at: 2026-11-11T09:58:45Z

- cmd: npm run build
  run_id: minted-moi-nguoi-gan-vai-SUITE-build-r1
  exit_code: 1
  verified_at: 2026-11-11T09:58:45Z

- cmd: make e2e
  run_id: minted-moi-nguoi-gan-vai-SUITE-make_e2e-r1
  exit_code: 2
  verified_at: 2026-11-11T09:58:45Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh trên cả HEAD lẫn baseline, chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make test: E3
- npx vitest run tests/coverage-matrix.test.ts --coverage.enabled=false: E15

Baseline khong do
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/moi-nguoi.db.test.ts co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts: bo qua baseline: tep tests/e2e-db/members.spec.ts co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi

Lệnh đỏ không gắn eval nào (ghi để người xem): make check (lint lỗi no-undef trên tệp có tên 'args', 'log', 'phase'; 200 vấn đề), npm run build (lỗi ENOTEMPTY khi xoá thư mục .next/e2e-db-*), make e2e (1 ca axe khổ 414 của frame.spec.ts không thấy screen-banner khi ngoại tuyến; 246 qua).

Giám khảo: không có eval dạng judgment trong vòng này, nên không có panel.

## Variance

none — mọi eval nhiều lần chạy đều đồng đều (mọi eval chạy một lần, xác định)

## Iterations

Round 1: E7, E9, E13, E14 failed; E11 BLOCKED (thiếu DB_LANE). Nguyên nhân: Playwright đăng nhập gặp Internal Server Error ở 3 khổ (dev server quá tải khi chạy 4 khổ), ảnh ST-members-loading không chứng minh trạng thái đang tải (trùng ST-members-long), và bộ kiểm cách ly chưa chạy. Cần người xác định DB_LANE rồi chạy lại.
