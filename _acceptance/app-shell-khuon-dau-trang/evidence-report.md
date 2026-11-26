---
schema_version: 2
feature_slug: app-shell-khuon-dau-trang
verdict: REJECT
failed_evals: ["E5","E15","E16","E17"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8c47d39ac4704d84ed821034cde6d5136514ed92
human_signoff:
---

# Evidence Report: app-shell-khuon-dau-trang

Round 6. Bốn eval chạy lại trên Postgres dãy R (E5, E15, E16, E17) đỏ. Các eval còn lại giữ nguyên từ các round trước vì delta không chạm paths của chúng.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carried r3) |
| E2 | AC-2 | script | PASS (carried r3) |
| E3 | AC-3 | script | PASS (carried r3) |
| E4 | AC-4 | script | PASS (carried r4) |
| E5 | AC-4 | script | FAIL |
| E6 | AC-5 | script | PASS (carried r3) |
| E7 | AC-5 | test | PASS (carried r3) |
| E8 | AC-6 | script | PASS (carried r3) |
| E9 | AC-6 | test | PASS (carried r3) |
| E10 | AC-7 | script | PASS (carried r5) |
| E11 | AC-7 | script | PASS (carried r5) |
| E12 | AC-8 | ui-check | PASS (carried r4) |
| E13 | AC-8 | judgment | UNCERTAIN (panel giữ nguyên từ round 5) |
| E14 | AC-7 | script | PASS (carried r4) |
| E15 | AC-4 | script | FAIL |
| E16 | AC-5 | script | FAIL |
| E17 | AC-3 | script | FAIL |

## Evidence

### Eval chạy lại ở round 6 (đỏ)

Bốn eval dưới đây dùng chung một lệnh: `make -s design-role-table && DB_LANE=${DB_LANE:-r} DB_PORT=${DB_PORT:-5565} npx playwright test -c playwright.db.config.ts`. Kết quả của lệnh: 717 bài xanh, 203 bài bỏ qua, 2 bài đỏ, chạy 19.1 phút. Cả hai bài đỏ đều là cùng một bài ở hai khổ (1024 và 1440): `tests/e2e-db/app-shell-verve.spec.ts:201`, "members and company layer: one thin head with the primary action at its end, a full-height column edge". Tại dòng 212 của tệp đó, `expect(locator('[data-slot="page-header-action"]')).toBeVisible()` chờ 20000 ms mà không thấy phần tử nào. Đây là bài của E16 (nút chính cuối hàng đầu trang ở màn Thành viên). Lệnh gộp bốn eval nên máy ghi cả bốn đỏ. Báo cáo này không tách riêng bài nào của E5, E15 hay E17 đỏ. Cần chạy lại từng eval nếu muốn tách.

Lệnh đỏ không gắn riêng eval nào: không có. Lệnh duy nhất đỏ đã được gắn cho E5, E15, E16, E17.

- eval: E5
  run_id: minted-app-shell-khuon-dau-trang-E5-r6
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  output: |
    717 passed, 203 skipped, 2 failed (cả bộ playwright.db.config.ts, 19.1m)
    gac-hydration: 0 canh bao
    Hai bài đỏ: app-shell-verve.spec.ts:201 ở 1024 và 1440 (chi tiết ở E16)

- eval: E15
  run_id: minted-app-shell-khuon-dau-trang-E15-r6
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  output: |
    Lệnh chung với E5 đỏ vì 2 bài của app-shell-verve.spec.ts:201.
    Bài menu tài khoản của E15 không nằm trong hai bài đỏ nêu trong đuôi kết quả.

- eval: E16
  run_id: minted-app-shell-khuon-dau-trang-E16-r6
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  output: |
    2) [1440] › tests/e2e-db/app-shell-verve.spec.ts:201:1 › members and company layer: one thin head with the primary action at its end, a full-height column edge
    Error: expect(locator).toBeVisible() failed
    Locator: locator('[data-slot="page-header-action"]')
    Expected: visible; Timeout: 20000ms; Error: element(s) not found
    > 212 |     await expect(action).toBeVisible();
    Bài đỏ tương tự ở khổ 1024.

- eval: E17
  run_id: minted-app-shell-khuon-dau-trang-E17-r6
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  output: |
    Lệnh chung với E5 đỏ vì 2 bài của app-shell-verve.spec.ts:201.
    Bài tên sàn dài của E17 không nằm trong hai bài đỏ nêu trong đuôi kết quả.

### Eval giữ nguyên từ round trước

- eval: E1
  run_id: minted-app-shell-khuon-dau-trang-E1-r3
  exit_code: 0
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-app-shell-khuon-dau-trang-E2-r3
  exit_code: 0
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-app-shell-khuon-dau-trang-E3-r3
  exit_code: 0
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-app-shell-khuon-dau-trang-E4-r4
  exit_code: 0
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T07:26:40Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-app-shell-khuon-dau-trang-E6-r3
  exit_code: 0
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-app-shell-khuon-dau-trang-E7-r3
  exit_code: 0
  verifier: config:executors.test.app_shell_verve_unit
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-app-shell-khuon-dau-trang-E8-r3
  exit_code: 0
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-app-shell-khuon-dau-trang-E9-r3
  exit_code: 0
  verifier: config:executors.test.app_shell_verve_unit
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-app-shell-khuon-dau-trang-E10-r5
  exit_code: 0
  verifier: config:executors.script.check
  verified_at: 2026-11-26T07:51:02Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-app-shell-khuon-dau-trang-E11-r5
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-26T07:51:02Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-app-shell-khuon-dau-trang-E12-r4
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-17T07:26:40Z
  carried_from_round: 4
  screenshot: evidence/E12-step1.png
  observed: |
    Frames I opened and read:
    - truoc/bang-hang-1440-light: top bar has a side-panel button at the left and a theme button plus «Đăng nhập» at the right. A large «Bảng hàng» title sits above the table. The column-two border stops around y=375. The fold strip sits high at y~215.
    - sau/bang-hang-1440-light: search box centered in the top bar, no theme button and no «Đăng nhập» at the right, no side-panel button at the left. One row «Bảng hàng › Tất cả hàng» replaces the big title. The column-two border runs to the bottom. The fold strip sits at the middle of the column edge (y~451). An account icon sits at the bottom of the rail. The table is unchanged apart from position. A1 A2 A3 A5 A6 match.
    - sau/bang-hang-360-light: phone keeps the menu-sheet button at the top left and a search icon. No theme button or «Đăng nhập», breadcrumb «Bảng hàng › Tất cả hàng», no big title; the list rows are unchanged. truoc/bang-hang-360-light still had the large title plus theme and «Đăng nhập» buttons. A6 phone OK.
    - sau/bang-hang-1440-dark and sau/menu-1440-dark: readable in dark, same layout as light, column border to the bottom. In menu-1440-dark (signed out) the menu shows a Giao diện row with 3 icons and «Đăng nhập». In truoc/menu-1440-dark the theme was a separate dropdown from the top-right button (Sáng/Tối/Theo thiết bị). A4 theme row now sits in the account menu.
    - sau/hom-nay-1024-light: search centered, a single «Hôm nay» crumb, fold strip at the middle, account icon at the rail bottom, no top-right buttons.
    - sau/menu-dang-nhap-1440: «[Tên] Quản trị MAU» on one line, the long email on one line, «Đang làm ở [Sàn 1 ...]» on one line, a Giao diện row with three icons, «Đăng xuất». The menu is about 320 px wide and opens from the account button at the rail bottom. A4 OK.
    - sau/menu-dang-nhap-360 and 414: same menu, email on one line, company line, three looks, sign-out. The phone panel (menu sheet) is open with the rail and the «Hôm nay» sub-list. OK.
    - sau/menu-dang-nhap-1024: same, the menu is fully visible.
    Outside the six listed spots, the table, status chips and rows look the same before and after. No contradiction with Expected found in the frames I read.
  network_observed: n-a (driver)
  note: carry-forward tu round 4 — delta khong cham paths cua eval; khung cua luot goc, cung run_id

- eval: E13
  judged_by: panel giữ nguyên từ round 5 — inputs không đổi, không chấm lại; rationale xem round 5
  verdict: UNCERTAIN
  rationale: Panel đề xuất UNCERTAIN, giữ nguyên từ round 5. Ba lens đều UNCERTAIN (r5).
  votes:
    - domain-correctness: UNCERTAIN (r5)
    - operational-feasibility: UNCERTAIN (r5)
    - spec-alignment: UNCERTAIN (r5)
  required_evidence:
    - (xem round 5)
  human_override:  # chi nguoi ghi

- eval: E14
  run_id: minted-app-shell-khuon-dau-trang-E14-r4
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-17T07:26:40Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-app-shell-khuon-dau-trang-SUITE-make_check-r6
  exit_code: 0
  verified_at: 2026-11-26T08:16:16Z

- cmd: npm run build
  run_id: minted-app-shell-khuon-dau-trang-SUITE-build-r6
  exit_code: 0
  verified_at: 2026-11-26T08:16:16Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-app-shell-khuon-dau-trang-SUITE-DATABASE_URL_make_e2e-r6
  exit_code: 0
  verified_at: 2026-11-26T08:16:16Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất

## Iterations

Round 3: E1, E2, E3, E6, E7, E8, E9 xanh, giữ lại cho các round sau.
Round 4: E4, E12, E14 xanh, giữ lại.
Round 5: E10, E11 xanh, giữ lại; panel E13 chấm UNCERTAIN.
Round 6: E5, E15, E16, E17 đỏ — bài `app-shell-verve.spec.ts:201` (màn Thành viên, 1024 và 1440) không thấy `page-header-action`. Trả về cho khâu cài đặt.
