---
schema_version: 2
feature_slug: thue-phi
verdict: REJECT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 9e693b3ee0041b83d699c1b9d2d591f8d51c96b5
human_signoff:
---

# Evidence Report: thue-phi

Round 4. Mọi eval máy đều xanh, nhưng việc rà soát tìm thấy một lỗi trong hợp đồng (AC-3, mức cao): bấm «Trả về mặc định» trên khoản môi giới đã đổi tên rồi Lưu thì khoản vẫn giữ tên tuỳ chỉnh. Chi tiết ở review-findings.md. Vì vậy verdict là REJECT.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E2-ui | AC-2 | ui-check | PASS |
| E3 | AC-3 | script | PASS |
| E3-unit | AC-3 | test | PASS |
| E3-ui | AC-3 | ui-check | PASS |
| E4 | AC-4 | script | PASS |
| E4-unit | AC-4 | test | PASS |
| E4-ui | AC-4 | ui-check | PASS |
| E5 | AC-5 | test | PASS (carry-forward round 2) |
| E6 | AC-6 | test | PASS (carry-forward round 2) |
| E6-e2e | AC-6 | script | PASS |
| E6-ui | AC-6 | ui-check | PASS (carry-forward round 2) |
| E7 | AC-7 | script | PASS (carry-forward round 2) |
| E7-db | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | PASS (panel giữ nguyên từ round 2) |
| E6-khuon | AC-6 | script | PASS (carry-forward round 2) |
| E6-floor | AC-6 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9-ui | AC-9 | ui-check | PASS |
| E9-khuon | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E10-ui | AC-10 | ui-check | PASS |

## Evidence

- eval: E1
  run_id: minted-thue-phi-E1-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed
    __EXIT=0

- eval: E2
  run_id: minted-thue-phi-E2-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed
    __EXIT=0

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T00:56:38Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    E2-1440-sang: light, page "Tuỳ chỉnh của sàn" for [Sàn A thử thuế phí], Thuế phí selected. Three rows in one table: Thuế thu nhập cá nhân 2% (on), Lệ phí trước bạ 0,5% (on), Phí môi giới input 1,5% (on, "Đã đổi · [Tên] A4 · 15/11/2026"). Footer "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ", Lưu button disabled (pale), toast "Đã lưu thuế phí". Dark text on white, clear.
    E2-1440-toi: same layout in dark, light text on near-black, toggles and blue Thêm khoản readable, Lưu muted but legible.
    E2-1024-sang: same content, rows stack with value and toggle under the title, nothing clipped, readable. E2-1024-toi: same in dark, readable, toast visible. All four match each other and the Expected; no overlap or cut-off text.
  network_observed: n-a (driver)

- eval: E3
  run_id: minted-thue-phi-E3-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed
    __EXIT=0

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed
    __EXIT=0

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T00:56:38Z
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai.png: company B admin, Thuế phí default schedule, Phí môi giới input shows 6 with red border and red text "Tỉ lệ tối đa 5%.", Lưu button disabled/faded, footer "Giá chào 3 tỷ bao phí → về tay 2,745 tỷ", 3 khoản/3 đang tính.
    E3-luu.png: Phí môi giới 1,5, Lệ phí trước bạ toggle off, row note "Đã đổi · [Tên] B4 · 15/11/2026", toast "Đã lưu thuế phí", "3 khoản · 2 đang tính", footer về tay 2,895 tỷ.
    E3-tai-lai.png: reopened part shows same saved state (1,5; trước bạ off; 2 đang tính; 2,895 tỷ), no toast, no error. Three frames match expected.
  network_observed: n-a (driver)

- eval: E4
  run_id: minted-thue-phi-E4-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed
    __EXIT=0

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed
    __EXIT=0

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T00:56:38Z
  screenshot: evidence/E4-ui-step1.png
  observed: |
    E4-sang.png (light, 1440): page "Tuỳ chỉnh của sàn", header "[Sàn A thử thuế phí]", the sidebar item "Thuế phí" highlighted. The card "Thuế phí" reads "3 khoản · 2 đang tính vào giá bao phí". The three rows are: Thuế thu nhập cá nhân 2% (switch on, "theo luật · Mặc định"); Lệ phí trước bạ 0,5% (switch off, "theo luật · Đã đổi · [Tên] A4 · 15/11/2026"); Phí môi giới 2% (switch on, "Đã đổi · [Tên] A4 · 15/11/2026"). Footer lines: "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and "Chỉ Quản trị sàn đổi được thuế phí". There is no save button or editable field, so the part is read-only for TeamLead.
    E4-toi.png (dark, 1440): same structure, text, numbers, switch states, spacing and sidebar highlight; only the colours change (near-black background, light text, dark-tone switches, moon icon in the header). Text is readable and nothing is clipped or broken. The frames match in light and dark, as expected.
  network_observed: n-a (driver)

- eval: E5
  run_id: minted-thue-phi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-thue-phi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-15T00:56:38Z
  output: |
    playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts
    7 passed (25.2s)
    __EXIT=0

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  screenshot: evidence/E6-ui-step1.png
  observed: |
    Bảng hàng 60 dòng ở 1440 sáng và tối: cột Về tay hiện ngay sau Giá chào (hàng S1.02: 3 tỷ, về tay 2,88 tỷ), Điều kiện phí ẩn sẵn. Ở 1024 bảng cắt ở Giá chào, Về tay nằm bên phải cần cuộn ngang, bố cục nguyên vẹn. Khung E6-dieu-kien (1440 sáng, mở menu Cột) hiện thêm cột Điều kiện phí với giá trị Bao phí hoặc Không bao phí, dấu — ở hàng không có giá trị. Các khung khớp nhau; Về tay thấy ngay ở 1440.
  network_observed: n-a (driver)
  note: carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-thue-phi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed
    __EXIT=0

- eval: E8
  run_id: minted-thue-phi-E8-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T00:56:38Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml
    __EXIT=0

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T00:56:38Z
  output: |
    design-floor-s4.mjs --root .
    __EXIT=0

- eval: E9
  run_id: minted-thue-phi-E9-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed
    __EXIT=0

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T00:56:38Z
  screenshot: evidence/E9-ui-step1.png
  observed: |
    E9-ui-step1 (Thuế phí 1440): the shell has a left icon rail, a top bar showing "[Sàn A thử thuế phí]" with search, theme toggle and avatar, a sub-nav column with Thuế phí highlighted, the title "Tuỳ chỉnh của sàn" with a blue "Thêm khoản" button on the right, and one card headed "Thuế phí - 3 khoản · 2 đang tính vào giá bao phí". The card holds three rows, each with a name, a muted sub-line and a toggle on the right, and a footer with "Giá chào 3 tỷ bao phí → về tay 2,91 tỷ" and a "Lưu" button.
    E9-ui-step2 (Thành viên 1440): the same shell and top bar. The sub-nav column holds only "Thành viên / Màn này chưa có mục con." The title "Thành viên" sits on the left with a blue "Mời người" button on the right, in the same position and style. The card is headed "Thành viên - 4 người trong sàn", with the same inset row card and four rows (avatar, name and email, role badge, "Đổi vai" button). There is no footer.
    E9-ui-step3 (Thuế phí 360): the compact top bar, title "Tuỳ chỉnh của sàn", the "Thêm khoản" button wrapped below the title, a card with the same header pattern and an inset row card with stacked rows, then a footer with the sum line and "Lưu".
    E9-ui-step4 (Thành viên 360): the same compact top bar, title "Thành viên" with "Mời người" beside it, a card with the same header pattern and an inset row card of stacked rows.
    Comparison against Expected: the two frames match in shape (shell, top bar, page header with a primary action, titled card with count line, inset row card, row separators and padding). They differ only in what fills the slots: sub-nav items, row content, footer, and the button label. This matches "Hai khung cùng một dáng; khác nhau chỉ ở nội dung khe".
  network_observed: n-a (driver)

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T00:56:38Z
  output: |
    design-floor-khuon.mjs --kiem --root .
    16 tệp giao diện ngoài bản đồ
    __EXIT=0

- eval: E10
  run_id: minted-thue-phi-E10-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T00:56:38Z
  output: |
    vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed
    __EXIT=0

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r4
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T00:56:38Z
  screenshot: evidence/E10-them.png
  observed: |
    E10-them.png (1440 wide): page «Tuỳ chỉnh của sàn», Thuế phí card with 4 rows. The new row is in edit mode: the name field holds «Phí dịch vụ hồ sơ», the percent field holds «0,3» (focused), the toggle is on, the caption is «Chưa lưu», and the «…» menu button is present. The footer reads «Giá chào 3 tỷ bao phí → về tay 2,871 tỷ» with the «Lưu» button active. «Thêm khoản» was pressed. Matches Expected.
    E10-luu.png: the same row is now fixed as «Phí dịch vụ hồ sơ», caption «Sàn thêm · [Tên] A4 · 15/11/2026», percent 0,3, toggle on. «Lưu» is greyed out and the toast «Đã lưu thuế phí» shows at the bottom right. Matches.
    E10-menu.png: «…» of the added item is open with two entries, «Đổi tên khoản» and «Bỏ khoản» (red). Matches. E10-menu-moi-gioi.png: «…» of Phí môi giới (Đã đổi, percent 2) is open with three entries, «Đổi tên khoản», «Trả về mặc định» and «Bỏ khoản» (red). This is the extra «Trả về mặc định» for a changed default item. Matches.
    E10-luat.png: the two law rows, «Thuế thu nhập cá nhân» (2%, theo luật · Mặc định, toggle on) and «Lệ phí trước bạ» (0,5%, theo luật · Đã đổi · [Tên] A4 · 15/11/2026, toggle off), have no «…» menu and no percent input. Only a toggle is shown. This is consistent with law rows being read-only apart from the switch. Overall the four frames agree: «Bốn khung khớp».
  network_observed: n-a (driver)

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-15T00:56:38Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-15T00:56:38Z

### Judgment

- eval: E8-wiki
  judged_by: judge panel (giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round 2)
  proposal: PASS
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh cả trên bản cũ lẫn bản mới, chỉ chứng minh bộ chạy; cần viết lại để assert hành vi mới hoặc xác nhận là lưới hồi quy có chủ ý):
- make check: E8
- design-floor-khuon.mjs --kiem: E6-khuon, E9-khuon
- design-floor-s4.mjs: E6-floor

Baseline khong do: round này không đo lại (evals.yaml không đổi từ lần đo cuối, round 1); mọi field baseline ghi n-a.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: xem lịch sử round đầu — baseline được đo ở round này.
Round 2: các eval AC-5, AC-6, AC-7 được chạy và ghi nhận; sau đó carry-forward sang các round sau.
Round 3: chấm lại, bằng chứng chờ Cổng Bằng chứng.
Round 4: mọi eval máy xanh, nhưng rà soát tìm thấy một lỗi trong hợp đồng (AC-3): đặt lại khoản môi giới đã đổi tên không khôi phục tên mặc định (commit c332ae4, fee-store.ts). Trả về triển khai.
