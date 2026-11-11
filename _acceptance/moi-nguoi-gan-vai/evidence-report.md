---
schema_version: 2
feature_slug: moi-nguoi-gan-vai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 7008b7bdab3511c46277cc8fc3ae6bb0d1246656
human_signoff: Manh Phan 2026-11-11
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
| E7 | AC-5 | script | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | script | PASS |
| E11 | AC-7 | script | PASS |
| E12 | AC-8 | script | PASS |
| E13 | AC-9 | script | PASS |
| E14 | AC-9 | ui-check | PASS |
| E15 | AC-8 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-moi-nguoi-gan-vai-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E2
  run_id: minted-moi-nguoi-gan-vai-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E3
  run_id: minted-moi-nguoi-gan-vai-E3-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: make test
    ================================================================================
    __EXIT=0

- eval: E4
  run_id: minted-moi-nguoi-gan-vai-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E5
  run_id: minted-moi-nguoi-gan-vai-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E6
  run_id: minted-moi-nguoi-gan-vai-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E7
  run_id: minted-moi-nguoi-gan-vai-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts
    24 passed (2.2m)
    __EXIT=0

- eval: E8
  run_id: minted-moi-nguoi-gan-vai-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E9
  run_id: minted-moi-nguoi-gan-vai-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts
    24 passed (2.2m)
    __EXIT=0

- eval: E10
  run_id: minted-moi-nguoi-gan-vai-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E11
  run_id: minted-moi-nguoi-gan-vai-E11-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} bash db/scripts/cach-ly.sh
    cach-ly: 19 ca đạt, vai quy_hang_app
    __EXIT=0

- eval: E12
  run_id: minted-moi-nguoi-gan-vai-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_db
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose
    __EXIT=0

- eval: E13
  run_id: minted-moi-nguoi-gan-vai-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts
    24 passed (2.2m)
    __EXIT=0

- eval: E14
  run_id: minted-moi-nguoi-gan-vai-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.moi_nguoi_e2e
  verified_at: 2026-11-11T10:24:30Z
  screenshot: evidence/members-ready-1440-sang.png
  observed: |
    members-ready-1440-sang: light theme, title "Thành viên", blue "Mời người" button top right of the title row, 3 rows ([Tên] LA / P / R) with email, role chips in words (Đầu chủ, Quản trị sàn, Đầu khách + Trưởng nhóm), "Người mời: —", "Đổi vai" button; readable, no overlap. members-ready-1440-toi: same in dark, chips, button and text readable. members-ready-360-sang/toi: single column, "Mời người" next to the title, chips in words, no sideways overflow, no overlapping text. members-invite-open-1440-sang/toi: centered "Mời người" dialog with Email, Tên trong sàn, Vai (4 checkboxes in words), Thôi and Mời; list blurred behind. members-invite-open-360-sang/toi: dialog fits the 360 width, checkboxes stacked, buttons full width, no overlap. ST-members-ready: 3-row list. ST-members-long: long name cut with an ellipsis, chips and Đổi vai intact. ST-members-loading: skeleton blocks under the title, no data (the earlier contradiction is fixed). ST-members-error: "Màn này chưa hiện được", the explaining sentence, Thử lại. ST-members-forbidden: "Không đủ quyền", the role sentence, "Về trang đầu", no "Thành viên" in the sidebar, no data. ST-invite-already: "Email này đã ở trong sàn." under a red field. ST-invite-failed: "Chưa lưu được. Máy chủ đang gặp lỗi, phần bạn đã gõ vẫn còn..." with Thử lại. ST-invite-invalid: "Email chưa đúng khuôn, ví dụ ten@congty.vn.", "Gõ tên người này như sàn vẫn gọi.", "Chọn ít nhất một vai." ST-roles-last-admin: "Mỗi sàn cần ít nhất một Quản trị sàn. Gán vai này cho người khác trước." No frame contradicts Expected.
  network_observed: n-a (driver)
  output: |
    ST frames show the state-table sentences: ready, long (ellipsis), loading (skeleton, no data), error, forbidden, invite-already, invite-failed, invite-invalid, roles-last-admin: PASS
    Frames saved: evidence/members-{ready,invite-open}-{1440,360}-{sang,toi}.png, ST-*.png (9), E14-step1.png, E14-step2.png, E14-network.txt (note only).
    Caveat: "đúng câu của bảng trạng thái" was checked against the contract and the earlier evidence report, not against a literal state table, because design/states.md has no members-specific sentences.

- eval: E15
  run_id: minted-moi-nguoi-gan-vai-E15-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.vai_man
  verified_at: 2026-11-11T10:24:30Z
  output: |
    cmd: npx vitest run tests/coverage-matrix.test.ts --coverage.enabled=false
    __EXIT=0

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-moi-nguoi-gan-vai-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-11T10:24:30Z

- cmd: npm run build
  run_id: minted-moi-nguoi-gan-vai-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-11T10:24:30Z

- cmd: make e2e
  run_id: minted-moi-nguoi-gan-vai-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-11T10:24:30Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh khung chạy chứ không phải tính năng; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E3 (make test)
- E11 (DB_LANE=${DB_LANE:-n} bash db/scripts/cach-ly.sh)
- E15 (npx vitest run tests/coverage-matrix.test.ts --coverage.enabled=false)

Baseline không đo
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/moi-nguoi.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/moi-nguoi.db.test.ts co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/members.spec.ts: bo qua baseline: tep tests/e2e-db/members.spec.ts co o cay dang kiem nhung chua co o merge-base 90ad801c5bc2b93cff0b408cd37533bb7cd48347 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lịch sử chi tiết nằm trong run-log.jsonl và commit "round 1 record"; báo cáo này thay thế nội dung round cũ.
Round 2: toàn bộ 15 eval và 3 lệnh suite đạt; không có mục chờ người chấm.
