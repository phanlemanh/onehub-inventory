---
schema_version: 2
feature_slug: thue-phi
verdict: PENDING-JUDGMENT
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: b171fb04125daf21073039ab6a9aec3837036be9
human_signoff:
---

# Evidence Report: thue-phi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carry-forward từ round 6) |
| E2 | AC-2 | test | PASS (carry-forward từ round 6) |
| E2-ui | AC-2 | ui-check | PASS (carry-forward từ round 6) |
| E3 | AC-3 | script | PASS (carry-forward từ round 6) |
| E3-unit | AC-3 | test | PASS (carry-forward từ round 6) |
| E3-ui | AC-3 | ui-check | PASS (carry-forward từ round 6) |
| E4 | AC-4 | script | PASS (carry-forward từ round 6) |
| E4-unit | AC-4 | test | PASS (carry-forward từ round 6) |
| E4-ui | AC-4 | ui-check | PASS (carry-forward từ round 6) |
| E5 | AC-5 | test | PASS (carry-forward từ round 6) |
| E6 | AC-6 | test | PASS |
| E6-e2e | AC-6 | script | PASS |
| E6-ui | AC-6 | ui-check | PASS (carry-forward từ round 6) |
| E7 | AC-7 | script | PASS (carry-forward từ round 2) |
| E7-db | AC-7 | script | PASS (carry-forward từ round 6) |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E6-khuon | AC-6 | script | PASS (carry-forward từ round 6) |
| E6-floor | AC-6 | script | PASS (carry-forward từ round 6) |
| E9 | AC-9 | test | PASS (carry-forward từ round 6) |
| E9-ui | AC-9 | ui-check | PASS (carry-forward từ round 6) |
| E9-khuon | AC-9 | script | PASS (carry-forward từ round 6) |
| E10 | AC-10 | script | PASS (carry-forward từ round 6) |
| E10-ui | AC-10 | ui-check | PASS (carry-forward từ round 6) |

## Evidence

- eval: E6
  run_id: minted-thue-phi-E6-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-15T19:33:06Z
  output: |
    npx vitest run tests/thue-phi-ontology.test.ts tests/thue-phi-cot.test.ts tests/thue-phi-cot-an.test.tsx --coverage.enabled=false --reporter=verbose
    1 lần chạy, 1 lần đạt; ba tệp xanh.

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-15T19:33:06Z
  output: |
    18 passed (30.9s)

- eval: E8
  run_id: minted-thue-phi-E8-r7
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T19:33:06Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E1
  run_id: minted-thue-phi-E1-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E2
  run_id: minted-thue-phi-E2-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval
  screenshot: evidence/E2-ui-step1.png
  observed: |
    All four frames are the Thue phi page under "Tuy chinh cua san", company "[San A thu thue phi]". Header says "3 khoan · 3 dang tinh vao gia bao phi". Rows: Thue thu nhap ca nhan 2% (on), Le phi truoc ba 0,5% (on), Phi moi gioi with input 1,5 % (on, "Da doi · [Ten] A4 · 15/11/2026"). Footer says "Gia chao 3 ty bao phi → ve tay 2,88 ty" with a Luu button, and a toast "Da luu thue phi" appears at the bottom right.
    - E2-1440-sang: light theme, rows on one line with the value and toggle at the right. Text is dark on white and clearly readable. The Luu button is pale blue because it is disabled. No overlap or clipping.
    - E2-1440-toi: dark theme with the same layout. Text is light on near-black and readable. The "Them khoan" and Luu buttons keep legible labels. No clipping.
    - E2-1024-sang: light theme. Each row stacks, with the value and toggle under the title. Everything is readable with no overflow, and the layout fits 1024 wide.
    - E2-1024-toi: dark theme with the same stacked layout. Text and toggles are legible, and no element is cut off.
    The frames match each other and the Expected: "Moi khung khop; chu doc duoc o ca sang va toi".
  network_observed: n-a (driver)

- eval: E3
  run_id: minted-thue-phi-E3-r6
  exit_code: 0
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai.png (1440 wide, company B "[Sàn B thử thuế phí]", Tuỳ chỉnh của sàn, Thuế phí): the Phí môi giới row has a red-bordered input with 6, the red message "Tỉ lệ tối đa 5%.", the Lưu button greyed out, the summary "3 khoản · 3 đang tính vào giá bao phí" and the footer "Giá chào 3 tỷ bao phí → về tay 2,745 tỷ". The other two rows (Thuế thu nhập cá nhân 2%, Lệ phí trước bạ 0,5%) are on. E3-luu.png: Phí môi giới shows 1,5 with the note "Đã đổi · [Tên] B4 · 15/11/2026"; Lệ phí trước bạ is off, noted "Đã đổi"; the summary reads "3 khoản · 2 đang tính", the footer "về tay 2,895 tỷ", and the toast "Đã lưu thuế phí" is visible. E3-tai-lai.png: after reopening, the same state persists: 1,5, Lệ phí trước bạ off, "2 đang tính", "về tay 2,895 tỷ", the "Đã đổi" notes, and no toast. All three frames match the expected "Ba khung khớp".
  network_observed: n-a (driver)

- eval: E4
  run_id: minted-thue-phi-E4-r6
  exit_code: 0
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval
  screenshot: evidence/E4-sang.png
  observed: |
    Light frame (E4-sang.png, 1440x900): the page "Tùy chỉnh của sàn", sub-menu with "Thuế phí" highlighted, and the card "Thuế phí – 3 khoản · 2 đang tính vào giá bao phí". It lists three rows. "Thuế thu nhập cá nhân" shows 2% with the toggle on, "Lệ phí trước bạ" shows 0,5% with the toggle off, and "Phí môi giới" shows 2% with the toggle on. The footer reads "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and "Chỉ Quản trị sàn đổi được thuế phí". There is no save button or input field, so it reads as read-only for the TeamLead. Dark frame (E4-toi.png): the same page, the same three rows, the same values and toggle states, the same footer text and the same positions. The only difference is the dark background and light text, so the frame matches in light and dark, as expected.
  network_observed: n-a (driver)

- eval: E5
  run_id: minted-thue-phi-E5-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval
  screenshot: evidence/E6-ui-step1.png
  observed: |
    E6-1440-sang.png (light, 1440): the Bảng hàng table shows the toolbar with the 60 dòng count, the Nhóm theo Toà, Cột, Toàn màn hình and Lưu góc nhìn buttons. The columns Căn, Toà, Dự án, Trạng thái, Giá chào, Về tay, Diện tích, Phòng ngủ and Xác nhận lúc are all visible. Row 8 is 0602, S1.02, status Chưa đủ để rao, Giá chào 3 tỷ and Về tay 2,88 tỷ, so Về tay is visible straight away. No broken layout.
    E6-1440-toi.png (dark, 1440): the same content as the light frame, with 0602 showing 3 tỷ and 2,88 tỷ. Contrast is readable and the status badges are readable.
    E6-1024-sang.png (light, 1024): the same table, now narrower. The columns end at Giá chào (cut off), so Về tay is not visible without scrolling. There is a horizontal scrollbar and no overflow break. Row 0602 shows no visible value because Giá chào is clipped.
    E6-1024-toi.png (dark, 1024): the same as the light 1024 frame, with a correct dark theme.
    E6-dieu-kien.png (1440, light): the Cột button is highlighted and the table is scrolled right to show Giá chào, Về tay, Diện tích, Phòng ngủ, Xác nhận lúc and Điều kiện phí. Row 0602 reads Giá chào 3 tỷ, Về tay 2,88 tỷ and Điều kiện phí "Bao phí". Other rows show "Không bao phí" or a dash.
    This matches the expected result: the frames agree across light and dark and across 1440 and 1024, and Về tay is visible at once at 1440.
  network_observed: n-a (driver)

- eval: E7
  run_id: minted-thue-phi-E7-r2
  exit_code: 0
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  # carry-forward từ round 2 — delta không chạm paths của eval

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r6
  exit_code: 0
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r6
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r6
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E9
  run_id: minted-thue-phi-E9-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval
  screenshot: evidence/E9-ui-step1.png
  observed: |
    E9-thue-phi-1440 vs E9-thanh-vien-1440: both show the same App Shell. The left icon rail is the same, with the same nav icons. The top bar has the company name, a search box and a theme toggle. There is a secondary sub-nav column with the same width and divider. The content has an h1 title at the left and a blue primary button at the right at the same position (Thêm khoản / Mời người). Below that is one bordered card with a grey header (title plus count line), and inside it a rounded list of rows separated by dividers. The slot content differs: Thuế phí has a sub-nav list (Nhãn riêng ... Thuế phí), a description line, fee rows with toggles and an input, and a footer with a Lưu button. Thành viên has the "no sub-items" text, avatar rows, role badges and Đổi vai buttons. Verdict at 1440: same shape.
    E9-thue-phi-360 vs E9-thanh-vien-360: both have the same top bar (menu toggle, company name, search icon, theme toggle, avatar), the same 16px gutter, an h1 title, and one card with a header (title plus count) and an inner rounded row list. Rows stack their content vertically in both. The difference at 360: in Thuế phí the Thêm khoản button wraps under the title (the title is longer and there is a description), while in Thành viên the Mời người button stays beside the title. The card, rows and header have the same shape. Verdict: same shape with a small content-driven wrap in the title row.
  network_observed: n-a (driver)

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r6
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E10
  run_id: minted-thue-phi-E10-r6
  exit_code: 0
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  # carry-forward từ round 6 — delta không chạm paths của eval
  screenshot: evidence/E10-ui-step1.png
  observed: |
    E10-them.png (1440 wide): Thuế phí card, subtitle "4 khoản · 3 đang tính vào giá bao phí". Rows: Thuế thu nhập cá nhân 2% and Lệ phí trước bạ 0,5% (both marked "theo luật", no «…» menu), Phí môi giới "Đã đổi" with an input showing 2, and a new row with a name field "Phí dịch vụ hồ sơ", rate field 0,3 focused, marked "Chưa lưu". The Lưu button is active and the footer reads "Giá chào 3 tỷ bao phí → về tay 2,871 tỷ". The Thêm khoản button is at top right. This matches.
    E10-luu.png: the new row is now saved as "Phí dịch vụ hồ sơ 0,3%", marked "Sàn thêm · [Tên] A4 · 15/11/2026". The toast "Đã lưu thuế phí" appears, Lưu is greyed out, and the footer still reads 2,871 tỷ. This matches.
    E10-menu.png: the «…» of the added item is open with two entries, "Đổi tên khoản" and "Bỏ khoản" (red). This matches.
    E10-menu-moi-gioi.png: the «…» of Phí môi giới is open with three entries, "Đổi tên khoản", "Trả về mặc định" and "Bỏ khoản" (red), which is right for a changed default item. This matches.
    E10-luat.png: the two law rows, Thuế thu nhập cá nhân (2%, toggle on) and Lệ phí trước bạ (0,5%, toggle off), are labelled "theo luật" and have no input or menu. Focus sits on the «…» of Phí môi giới. This matches. All frames are consistent in layout, with no overlap or clipping.
  network_observed: n-a (driver)

- eval: E8-wiki
  judged_by: judge panel (3 lens, fresh context)
  verdict: PASS
  rationale: Cả ba góc nhìn cùng đề xuất PASS; panel chờ người chốt ở Cổng 2.
  votes:
    - domain-correctness: PASS — Trang fee-schedule nêu đủ hai khoản luật (TNCN 2%, trước bạ 0,5%) và Phí môi giới mặc định 1% trong khoảng 0–5%, ai đặt (setFeeSchedule: Quản trị sàn), ai đọc (readFeeSchedule), và "Nội bộ; trang khách không đọc (SP-4)". Trang listing có đoạn Điều kiện phí (feeInclusion, hàng 19). Log có dòng 2026-11-15 riêng cho hàng 19, screens.yaml có phần Thuế phí (?phan=thue-phi) với nút setFeeSchedule.
    - operational-feasibility: PASS — Trang fee-schedule nêu hai khoản theo luật và Phí môi giới mặc định 1%, khoảng 0–5%, Quản trị sàn đặt, bốn vai đọc, và "Nội bộ; trang khách không đọc (SP-4)". Trang listing có đoạn Điều kiện phí (hàng 19). Log dòng 11 ghi riêng hàng 19 (dòng 10 cũng nhắc hàng 19 như phần bổ sung). screens.yaml có phần ?phan=thue-phi với nút setFeeSchedule.
    - spec-alignment: PASS — fee-schedule.md nêu đủ TNCN 2% và Lệ phí trước bạ 0,5% theo luật, Phí môi giới mặc định 1% trong khoảng 0–5%, Quản trị sàn đặt, bốn vai đọc, và "trang khách không đọc (SP-4)". listing.md có đoạn Điều kiện phí (hàng 19). wiki/log.md dòng 11 là dòng riêng cho hàng 19, screens.yaml có phần ?phan=thue-phi với nút setFeeSchedule.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r7
  exit_code: 0
  verified_at: 2026-11-15T19:33:06Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r7
  exit_code: 0
  verified_at: 2026-11-15T19:33:06Z

## Known limits

## Ngoài hợp đồng

## Analyst

Không phân biệt (xanh trên cả bản hiện tại lẫn baseline): E8 (make check). Đây là lệnh kiểm chung của repo, nên coi là regression-guard có chủ ý; các eval riêng của tính năng không có số đo baseline để so (xem dưới).

Baseline không đo:
- npx vitest run tests/thue-phi-ontology.test.ts tests/thue-phi-cot.test.ts tests/thue-phi-cot-an.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep tests/thue-phi-ontology.test.ts co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts: bo qua baseline: tep tests/e2e-db/thue-phi.spec.ts co o cay dang kiem nhung chua co o merge-base 9cf7a596f3602e455f4ae61c2442332d93f80871 — eval moi, chay tren code cu khong phan biet gi

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval round này chạy 1 lần, xác định).

## Iterations

Round 7: chạy lại E6, E6-e2e, E8 và hai lệnh suite sau các commit kiểm thử cột Về tay và điều kiện phí; tất cả xanh, các eval còn lại mang từ round 6 (E7 từ round 2). Chờ người chốt mục E8-wiki ở Cổng 2.
Rounds 1–6: lịch sử trong _acceptance/thue-phi/run-log.jsonl.
