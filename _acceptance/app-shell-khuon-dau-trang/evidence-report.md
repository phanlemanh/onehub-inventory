---
schema_version: 2
feature_slug: app-shell-khuon-dau-trang
verdict: REJECT
failed_evals: ["E10"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e5662d4f497cfc1aa496992fd48cdef56cc7c1cf
human_signoff:
---

# Evidence Report: app-shell-khuon-dau-trang

Vòng 4. E1, E2, E3, E6, E7, E8, E9 mang từ vòng 3 (delta không chạm paths của các eval này). E10 đỏ ở vòng này; lệnh `make check` đã gắn với E10, không có lệnh fail nào không gắn eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carry-forward r3) |
| E2 | AC-2 | script | PASS (carry-forward r3) |
| E3 | AC-3 | script | PASS (carry-forward r3) |
| E4 | AC-4 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS (carry-forward r3) |
| E7 | AC-5 | test | PASS (carry-forward r3) |
| E8 | AC-6 | script | PASS (carry-forward r3) |
| E9 | AC-6 | test | PASS (carry-forward r3) |
| E10 | AC-7 | script | REJECT |
| E11 | AC-7 | script | PASS |
| E12 | AC-8 | ui-check | PASS |
| E13 | AC-8 | judgment | UNCERTAIN |
| E14 | AC-7 | script | PASS |
| E15 | AC-4 | script | PASS |
| E16 | AC-5 | script | PASS |
| E17 | AC-3 | script | PASS |

## Evidence

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
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T07:26:40Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E5
  run_id: minted-app-shell-khuon-dau-trang-E5-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T07:26:40Z
  output: |
    playwright.db.config.ts, dãy R
    gac-hydration: 0 canh bao

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
  run_id: minted-app-shell-khuon-dau-trang-E10-r4
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-17T07:26:40Z
  output: |
    npm run lint -> eslint . && prettier --check .
    eslint: 0 lỗi, 4 cảnh báo (account-menu.tsx 27:10 AUTH_BASE_PATH không dùng; config.test.ts 174:19 _from; bo-nut-members.spec.ts 195:41 _page; sheet.spec.ts 205:7 biểu thức không dùng)
    prettier: [warn] .claude/launch.json — Code style issues found in the above file
    make: *** [lint] Error 1

- eval: E11
  run_id: minted-app-shell-khuon-dau-trang-E11-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-17T07:26:40Z
  output: |
    make e2e
    gac-hydration: 0 canh bao

- eval: E12
  run_id: minted-app-shell-khuon-dau-trang-E12-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-17T07:26:40Z
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

- eval: E13
  judged_by: judge-subagent (fresh context), panel đề xuất 3 góc nhìn
  verdict: UNCERTAIN
  rationale: |
    - domain-correctness: UNCERTAIN — P1–P3 nằm ở Out of scope của contract.md và không lọt vào bảng A1–A6; A2, A5, A6 và phần chuyển nút «T» với nút giao diện vào menu (A4) khớp lời chủ kho. Nhưng nhiều chi tiết cột «Sau» (dải gập giữa chiều cao cửa sổ, mũi tên ‹ › khi rê chuột, ô tìm 320 px, ⌘ và K tách hai ô, menu 320 px với email cắt ở 40 ký tự, ⌘B không mở dải, dời dấu Next.js sang góc phải dưới, giữ dải không mở rộng) không có trong lời nguyên văn ở mục «Nguồn». Hai tệp được phép đọc không chứng minh chúng đến từ số đo Verve do chủ kho yêu cầu hay là việc thêm ngoài lời chủ kho. Cũng không đối chiếu được P1–P3 với lời «Chỉ ghi lại» vì câu 9 không nêu P1–P3 là gì.
    - operational-feasibility: UNCERTAIN — Cấu trúc khớp: mỗi chỗ A1–A6 có đúng một dòng, P1–P3 nằm ở Out of scope. Nhưng nhiều chi tiết cột «Sau» không có trong lời nguyên văn mục «Nguồn» (mũi tên ‹ ›, viền sáng khi rê, ô tìm 320 px, email cắt «…» hiện đủ khi rê, ⌘B không mở). Hai tệp cho phép không nói đó là lời chủ kho hay số đo Verve do máy suy ra; design.md cũng không nêu P1–P3 là gì và không gắn câu 9 «Chỉ ghi lại» với chúng.
    - spec-alignment: UNCERTAIN — Sáu dòng A1–A6 khớp các câu 2–7 của mục «Nguồn» và P1–P3 nằm đúng ở Out of scope. Nhưng chi tiết cột «Sau» (dải ‹ ›, viền sáng khi rê, 320 px, cắt «…» sau 40 ký tự, hàng «nơi đang mở» ở A5) vượt quá lời nguyên văn, và design.md không nối câu «Chỉ ghi lại» với P1–P3.
  required_evidence:
    - Tệp `dieu-chinh-hang-muc-verve-settings.md` (sổ ghi chú của đợt, nêu ở mục «Nguồn» của design.md), phần số đo Verve cho từng chỗ: cần thấy dải gập giữa chiều cao cửa sổ, ô tìm 320 px, menu 320 px, 40 ký tự và ⌘B đều là số đo hay lời của chủ kho. Nếu có mục không có nguồn thì kết luận chuyển sang không đạt.
    - Cùng sổ ghi chú, dòng ghi lời «Chỉ ghi lại» của chủ kho, nêu rõ ba việc P1 (hồ sơ sàn), P2 (tìm/lọc/sắp ở Thành viên), P3 (chia nhóm cột mục con).
    - Dòng sổ quyết định (`decisions.jsonl` của hồ sơ này, hoặc dòng sổ `supersedes` nói ở contract.md Notes) cho phép dời dấu Next.js dev sang góc phải dưới và giữ dải không mở rộng, đủ để biết chúng là việc chủ kho bảo hay việc tự thêm.
    - Chi tiết A1 (mũi tên, viền sáng), A3 (⌘ và K tách ô), A4 (cắt «…» hiện đủ khi rê), A5 (hàng «tên màn › nơi đang mở» từ câu 4 chỉ là một câu hỏi) có dòng nguồn trong sổ ghi chú.
  human_override:  # chi nguoi ghi

- eval: E14
  run_id: minted-app-shell-khuon-dau-trang-E14-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-17T07:26:40Z
  output: |
    design-floor-s4.mjs --root .

- eval: E15
  run_id: minted-app-shell-khuon-dau-trang-E15-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T07:26:40Z
  output: |
    playwright.db.config.ts, dãy R
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-app-shell-khuon-dau-trang-E16-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T07:26:40Z
  output: |
    playwright.db.config.ts, dãy R
    gac-hydration: 0 canh bao

- eval: E17
  run_id: minted-app-shell-khuon-dau-trang-E17-r4
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T07:26:40Z
  output: |
    playwright.db.config.ts, dãy R
    gac-hydration: 0 canh bao

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-app-shell-khuon-dau-trang-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-17T07:26:40Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — moi eval feature deu red tren baseline (co phan biet)

E10 (`make check`) xanh trên baseline và đỏ ở vòng này: lỗi do prettier báo `.claude/launch.json` (tệp đang sửa, chưa commit) sai khuôn; eslint chỉ có cảnh báo, không có lỗi.

### Baseline khong do

- make e2e: baseline vuot tran 120 giay/lenh — da dung ca cay tien trinh; BLOCKED ha tang, khong phai ket qua cua code cu
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-s4.mjs" --root .: het tran tong 480 giay cua lane baseline truoc khi toi lenh nay — khong chay

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: E10 failed — make check đỏ. Returned to implementation.
Round 2: mọi eval xanh. Round 3: PENDING-JUDGMENT — E13 chưa có người chốt.
Round 4: E10 failed — prettier báo .claude/launch.json sai khuôn khiến lint dừng; E13 vẫn UNCERTAIN chờ người. Returned to implementation.
