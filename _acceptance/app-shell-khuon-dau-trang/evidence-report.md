---
schema_version: 2
feature_slug: app-shell-khuon-dau-trang
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 957bb3c12c1f63adb237b58c40c28ace2112c22b
human_signoff: Manh Phan 2026-11-26
---

# Evidence Report: app-shell-khuon-dau-trang

Round 7. Năm eval chạy lại (E5, E15, E16, E17 trên Postgres dãy R; E10 là make check) đều xanh, cùng hai lệnh suite (build, make e2e). Các eval còn lại giữ nguyên từ các round trước vì delta không chạm paths của chúng. Mục E13 vẫn chờ người chốt ở Cổng 2.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carried r3) |
| E2 | AC-2 | script | PASS (carried r3) |
| E3 | AC-3 | script | PASS (carried r3) |
| E4 | AC-4 | script | PASS (carried r4) |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS (carried r3) |
| E7 | AC-5 | test | PASS (carried r3) |
| E8 | AC-6 | script | PASS (carried r3) |
| E9 | AC-6 | test | PASS (carried r3) |
| E10 | AC-7 | script | PASS |
| E11 | AC-7 | script | PASS (carried r5) |
| E12 | AC-8 | ui-check | PASS (carried r4) |
| E13 | AC-8 | judgment | UNCERTAIN (carried r5) |
| E14 | AC-7 | script | PASS (carried r4) |
| E15 | AC-4 | script | PASS |
| E16 | AC-5 | script | PASS |
| E17 | AC-3 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-app-shell-khuon-dau-trang-E1-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-app-shell-khuon-dau-trang-E2-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-app-shell-khuon-dau-trang-E3-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-app-shell-khuon-dau-trang-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T07:26:40Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-app-shell-khuon-dau-trang-E5-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-26T08:39:53Z
  output: |
    make -s design-role-table && npx playwright test -c playwright.db.config.ts trên Postgres dãy R: toàn bộ bài xanh.

- eval: E6
  run_id: minted-app-shell-khuon-dau-trang-E6-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-app-shell-khuon-dau-trang-E7-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.app_shell_verve_unit
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E8
  run_id: minted-app-shell-khuon-dau-trang-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-app-shell-khuon-dau-trang-E9-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.app_shell_verve_unit
  verified_at: 2026-11-17T03:36:00Z
  carried_from_round: 3
  output: |
    carry-forward tu round 3 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-app-shell-khuon-dau-trang-E10-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-26T08:39:53Z
  output: |
    make check passed: upgrade lint typecheck test ontology boundaries coverage-matrix derived-untracked ledgers-check design-assembly design governance

- eval: E11
  run_id: minted-app-shell-khuon-dau-trang-E11-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-26T07:51:02Z
  carried_from_round: 5
  output: |
    carry-forward tu round 5 — delta khong cham paths cua eval

- eval: E12
  run_id: minted-app-shell-khuon-dau-trang-E12-r4
  exit_code: 0
  baseline: n-a
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

- eval: E14
  run_id: minted-app-shell-khuon-dau-trang-E14-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-17T07:26:40Z
  carried_from_round: 4
  output: |
    carry-forward tu round 4 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-app-shell-khuon-dau-trang-E15-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-26T08:39:53Z
  output: |
    Cùng lệnh với E5 (Postgres dãy R, bốn khổ): bài tests/e2e-db/app-shell-verve.spec.ts xanh.

- eval: E16
  run_id: minted-app-shell-khuon-dau-trang-E16-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-26T08:39:53Z
  output: |
    Cùng lệnh với E5: bài đầu trang mỏng và nút chính cuối hàng xanh ở 1024 và 1440.

- eval: E17
  run_id: minted-app-shell-khuon-dau-trang-E17-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-26T08:39:53Z
  output: |
    Cùng lệnh với E5: bài tên sàn dài cắt bằng dấu ba chấm, không đè ô tìm, xanh ở 768, 1024, 1440.

### Judgment

- eval: E13
  judged_by: judge panel (carried from round 5)
  verdict: UNCERTAIN
  rationale: panel giu nguyen tu round 5 — inputs khong doi, khong cham lai; rationale xem round do.
  votes:
    - domain-correctness: UNCERTAIN (r5)
    - operational-feasibility: UNCERTAIN (r5)
    - spec-alignment: UNCERTAIN (r5)
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override: Manh Phan 2026-11-26 — Đạt

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-app-shell-khuon-dau-trang-SUITE-build-r7
  exit_code: 0
  verified_at: 2026-11-26T08:39:53Z

- cmd: DATABASE_URL= make e2e
  run_id: minted-app-shell-khuon-dau-trang-SUITE-DATABASE_URL_make_e2e-r7
  exit_code: 0
  verified_at: 2026-11-26T08:39:53Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 6 — baseline khong do lai round nay.

Baseline khong do: mọi eval ghi baseline n-a vì evals.yaml không đổi từ lần đo cuối (round 6); round này không đo lại.

Eval không-phân-biệt: none được liệt kê. Hai lệnh suite xanh-cả-hai-phía là regression-guard bình thường.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 3: E1, E2, E3, E6, E7, E8, E9 xanh, giữ lại cho các round sau.
Round 4: E4, E12, E14 xanh, giữ lại.
Round 5: E10, E11 xanh, giữ lại; panel E13 chấm UNCERTAIN.
Round 6: E5, E15, E16, E17 đỏ — bài app-shell-verve.spec.ts:201 (màn Thành viên, 1024 và 1440) không thấy page-header-action. Trả về cho khâu cài đặt.
Round 7: E5, E15, E16, E17 và E10 xanh, cùng build và make e2e; E13 còn chờ người chốt ở Cổng 2.
