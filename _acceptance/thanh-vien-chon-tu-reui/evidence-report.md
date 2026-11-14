---
schema_version: 2
feature_slug: thanh-vien-chon-tu-reui
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 476666e8a81655f7e284fa787a8043074a8c3881
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: thanh-vien-chon-tu-reui

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
| E10 | AC-7 | script | PASS |
| E11 | AC-8 | test | PASS |
| E12 | AC-9 | ui-check | PASS |
| E13 | AC-3 | test | PASS |
| E14 | AC-4 | script | PASS |
| E15 | AC-8 | test | PASS |
| E16 | AC-8 | script | PASS |

Round 2 chạy lại E3, E4, E10, E13 (cùng hai lệnh suite). Các eval còn lại mang từ round 1 (carry-forward).

## Evidence

- eval: E3
  run_id: minted-thanh-vien-chon-tu-reui-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T14:06:26Z
  output: |
    41 passed (2.8m)

- eval: E4
  run_id: minted-thanh-vien-chon-tu-reui-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db_c
  verified_at: 2026-11-14T14:06:26Z
  output: |
    tests/db/moi-nguoi.db.test.ts: mọi ca xanh trên Postgres dãy C

- eval: E10
  run_id: minted-thanh-vien-chon-tu-reui-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-14T14:06:26Z
  output: |
    make check xanh
    CODEOWNERS matches governance/autonomy.yaml

- eval: E13
  run_id: minted-thanh-vien-chon-tu-reui-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T14:06:26Z
  output: |
    framed-list, form-dialog, thanh-vien-mot-cua, thanh-vien-khoa-bai: mọi ca xanh

- eval: E1
  run_id: minted-thanh-vien-chon-tu-reui-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-thanh-vien-chon-tu-reui-E2-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-thanh-vien-chon-tu-reui-E5-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-thanh-vien-chon-tu-reui-E6-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-thanh-vien-chon-tu-reui-E7-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  screenshot: evidence/E7-step1.png
  observed: |
    Pair 1 (Luu goc nhin, 1440 light, blurred table behind): truoc and sau both show title "Lưu góc nhìn", a two-line description ("Đặt tên cho cách xem này..."), one field "Tên" with focused empty input, footer with "Thôi" and blue "Lưu". Identical in spacing; no label beside the title. Pair 2 (Báo sai thông tin căn 0905): both show title, three-line description, fields "Thuộc tính sai" (select Căn, hint "Đang hiện: 0905"), "Giá trị đúng", "Ghi chú căn cứ" (textarea), footer "Thôi" and "Chép và mở bảng chia sẻ". Identical; no label beside the title. Pair 3 (Đổi sang Đã bán): both show title, two-line description, two side-by-side fields "Giá chốt" (2.710.000.000, hint) and "Ngày bán" (14/11/2026), footer "Thôi" and "Đổi trạng thái". Identical; no label beside the title. Each truoc/sau pair is byte-identical, matching Expected.
  network_observed: n-a (driver)
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-thanh-vien-chon-tu-reui-E8-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-thanh-vien-chon-tu-reui-E9-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-thanh-vien-chon-tu-reui-E11-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.proof_gate
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-thanh-vien-chon-tu-reui-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  screenshot: evidence/E12-step1.png
  observed: |
    sau-members-1440-sang.png: app shell, page title "Thành viên" and blue "Mời người" button. Below it is one framed list with a header (title "Thành viên", count line "6 người trong sản"). Six rows, each with a round initials avatar (Đ1, Đ2, TA, QT), name over email, a "Người mời ... ngày" column, role tags in a straight column, and an "Đổi vai" button at the end of each row. There is no search box, no cards, no guest frame, no invite frame. This matches solution-users-8's Members frame (header with name and count, avatar, name over email, aligned columns, trailing action), minus the parts left out on purpose. sau-hop-moi-1440-sang.png: dialog over a blurred page. Title "Mời người" with a small orange tag "[Sàn mẫu Thành viên]" beside it, a close X, a short description, stacked fields (Email, Tên trong sản, Vai with four checkboxes), and a gray footer strip with "Thôi" and a blue "Mời" button on the right. This matches dialog-2 (tag beside title, stacked fields, footer strip with two buttons). lo-b-users8.png (approved) shows the same frame, rows and columns, with nine rows of sample data. hop-moi.png (approved) shows the same dialog with the name field filled. The built screen keeps that approved look; only sample data differs.
  network_observed: n-a (driver)
  note: carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E14
  run_id: minted-thanh-vien-chon-tu-reui-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thanh_vien_e2e_c
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-thanh-vien-chon-tu-reui-E15-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thanh_vien_unit
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E16
  run_id: minted-thanh-vien-chon-tu-reui-E16-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T13:46:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thanh-vien-chon-tu-reui-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T14:06:26Z

- cmd: make e2e
  run_id: minted-thanh-vien-chon-tu-reui-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-14T14:06:26Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay. Baseline cua moi eval ghi n-a (round nay khong do).

Eval khong-phan-biet (pass tren ca HEAD lan baseline round 1; chung minh harness chu khong phai feature, viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):
- E4 — tests/db/moi-nguoi.db.test.ts (tep khong doi, la regression-guard co chu y cua hang 9)
- E11 — tools/proof_gate
- E16 — design-floor-khuon.mjs --kiem

## Variance

none — every multi-run eval is uniform

## Judge

Không có mục judgment trong hợp đồng này; không có panel nào cần đề xuất.

## Iterations

Round 1: E10 failed — bài khoá lời hàng 9c ném lỗi khi checkout nông nên make check đỏ. Returned to implementation.
Round 2: E3, E4, E10, E13 chạy lại và xanh trên 476666e; các eval còn lại mang từ round 1.
