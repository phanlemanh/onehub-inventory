---
schema_version: 2
feature_slug: thanh-vien-chon-tu-reui
verdict: REJECT
failed_evals: ["E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 08215a9eb286e385bd9b05ab611166628d2f8f73
human_signoff:
---

# Evidence Report: thanh-vien-chon-tu-reui

Round 1. Lệnh thất bại: `make check` (gắn với E10). Không có lệnh thất bại nào không gắn eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | test | PASS |
| E7 | AC-5 | ui-check | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-7 | test | PASS |
| E10 | AC-7 | script | FAIL |
| E11 | AC-8 | test | PASS |
| E12 | AC-9 | ui-check | PASS |
| E13 | AC-3 | test | PASS |
| E14 | AC-4 | script | PASS |
| E15 | AC-8 | test | PASS |
| E16 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-thanh-vien-chon-tu-reui-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Playwright db lane: 41 passed (4.1m) cho ba tệp thanh-vien.spec.ts, members.spec.ts, bo-nut-members.spec.ts.

- eval: E2
  run_id: minted-thanh-vien-chon-tu-reui-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E1: 41 passed (4.1m).

- eval: E3
  run_id: minted-thanh-vien-chon-tu-reui-E3-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E1: 41 passed (4.1m).

- eval: E4
  run_id: minted-thanh-vien-chon-tu-reui-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.script.moi_nguoi_db_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    vitest db config, tests/db/moi-nguoi.db.test.ts: mọi ca xanh.

- eval: E5
  run_id: minted-thanh-vien-chon-tu-reui-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E1: 41 passed (4.1m).

- eval: E6
  run_id: minted-thanh-vien-chon-tu-reui-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  output: |
    vitest: framed-list, form-dialog, thanh-vien-mot-cua, thanh-vien-khoa-bai đều xanh.

- eval: E7
  run_id: minted-thanh-vien-chon-tu-reui-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T13:46:40Z
  screenshot: evidence/E7-step1.png
  observed: |
    Pair 1 (Luu goc nhin, 1440 light, blurred table behind): truoc and sau both show title "Lưu góc nhìn", a two-line description ("Đặt tên cho cách xem này..."), one field "Tên" with focused empty input, footer with "Thôi" and blue "Lưu". Identical in spacing; no label beside the title. Pair 2 (Báo sai thông tin căn 0905): both show title, three-line description, fields "Thuộc tính sai" (select Căn, hint "Đang hiện: 0905"), "Giá trị đúng", "Ghi chú căn cứ" (textarea), footer "Thôi" and "Chép và mở bảng chia sẻ". Identical; no label beside the title. Pair 3 (Đổi sang Đã bán): both show title, two-line description, two side-by-side fields "Giá chốt" (2.710.000.000, hint) and "Ngày bán" (14/11/2026), footer "Thôi" and "Đổi trạng thái". Identical; no label beside the title. Each truoc/sau pair is byte-identical, matching Expected.
  network_observed: n-a (driver)

- eval: E8
  run_id: minted-thanh-vien-chon-tu-reui-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E1: 41 passed (4.1m).

- eval: E9
  run_id: minted-thanh-vien-chon-tu-reui-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E6: các tệp vitest đều xanh.

- eval: E10
  run_id: minted-thanh-vien-chon-tu-reui-E10-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T13:46:40Z
  output: |
    make check dừng ở bước lint: 205 vấn đề (190 lỗi, 15 cảnh báo).
    Phần lớn là lỗi no-undef ('args', 'log', 'phase' is not defined) ở một tệp script dài hơn 2000 dòng.
    Cảnh báo còn lại: account-menu.tsx (AUTH_BASE_PATH), identity/config.test.ts, bo-nut-members.spec.ts, sheet.spec.ts.
    make: *** [lint] Error 1

- eval: E11
  run_id: minted-thanh-vien-chon-tu-reui-E11-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T13:46:40Z
  output: |
    vitest tools/proof_gate: mọi ca xanh.

- eval: E12
  run_id: minted-thanh-vien-chon-tu-reui-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T13:46:40Z
  screenshot: evidence/E12-step1.png
  observed: |
    sau-members-1440-sang.png: app shell, page title "Thành viên" and blue "Mời người" button. Below it is one framed list with a header (title "Thành viên", count line "6 người trong sản"). Six rows, each with a round initials avatar (Đ1, Đ2, TA, QT), name over email, a "Người mời ... ngày" column, role tags in a straight column, and an "Đổi vai" button at the end of each row. There is no search box, no cards, no guest frame, no invite frame. This matches solution-users-8's Members frame (header with name and count, avatar, name over email, aligned columns, trailing action), minus the parts left out on purpose. sau-hop-moi-1440-sang.png: dialog over a blurred page. Title "Mời người" with a small orange tag "[Sàn mẫu Thành viên]" beside it, a close X, a short description, stacked fields (Email, Tên trong sản, Vai with four checkboxes), and a gray footer strip with "Thôi" and a blue "Mời" button on the right. This matches dialog-2 (tag beside title, stacked fields, footer strip with two buttons). lo-b-users8.png (approved) shows the same frame, rows and columns, with nine rows of sample data. hop-moi.png (approved) shows the same dialog with the name field filled. The built screen keeps that approved look; only sample data differs.
  network_observed: n-a (driver)

- eval: E13
  run_id: minted-thanh-vien-chon-tu-reui-E13-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E6: các tệp vitest đều xanh.

- eval: E14
  run_id: minted-thanh-vien-chon-tu-reui-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E1: 41 passed (4.1m).

- eval: E15
  run_id: minted-thanh-vien-chon-tu-reui-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  output: |
    Cùng lệnh với E6: các tệp vitest đều xanh.

- eval: E16
  run_id: minted-thanh-vien-chon-tu-reui-E16-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T13:46:40Z
  output: |
    design-floor-khuon --kiem: không có dòng «lệch:» nào; 7 tệp giao diện ngoài bản đồ.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thanh-vien-chon-tu-reui-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T13:46:40Z

- cmd: make e2e
  run_id: minted-thanh-vien-chon-tu-reui-SUITE-make_e2e-r1
  exit_code: 0
  verified_at: 2026-11-14T13:46:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline; chứng minh harness, không chứng minh feature):
- E4: tests/db/moi-nguoi.db.test.ts — regression-guard có chủ ý (tệp không đổi theo E13).
- E11: lưới chứng minh màn (tools/proof_gate) — regression-guard có chủ ý.
- E16: bước chấm khuôn — regression-guard có chủ ý.

Baseline khong do
- DB_LANE=${DB_LANE:-c} DB_PORT=${DB_PORT:-5569} npx playwright test -c playwright.db.config.ts tests/e2e-db/thanh-vien.spec.ts tests/e2e-db/members.spec.ts tests/e2e-db/bo-nut-members.spec.ts: bo qua baseline: tep tests/e2e-db/thanh-vien.spec.ts co o cay dang kiem nhung chua co o merge-base 01c11df5a667416193ca8746a64e7fa97a7f2ad1 — eval moi, chay tren code cu khong phan biet gi
- npx vitest run tests/framed-list.test.tsx tests/form-dialog.test.tsx tests/thanh-vien-mot-cua.test.ts tests/thanh-vien-khoa-bai.test.ts --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/framed-list.test.tsx co o cay dang kiem nhung chua co o merge-base 01c11df5a667416193ca8746a64e7fa97a7f2ad1 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval chạy một lần, không có eval nhiều lần chạy.

## Iterations

Round 1: E10 failed — make check dừng ở bước lint (190 lỗi, phần lớn no-undef ở một tệp script ngoài src); baseline của E10 xanh nên lỗi nằm trong cây đang kiểm. Returned to implementation.
