---
schema_version: 2
feature_slug: thue-phi
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4efd99daaaa147b6e3511ae230a4fede080f3b6b
human_signoff:
---

# Evidence Report: thue-phi

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
| E5 | AC-5 | test | PASS (carried từ round 6) |
| E6 | AC-6 | test | PASS (carried từ round 7) |
| E6-e2e | AC-6 | script | PASS |
| E6-ui | AC-6 | ui-check | PASS (carried từ round 6) |
| E7 | AC-7 | script | PASS |
| E7-db | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | UNCERTAIN |
| E6-khuon | AC-6 | script | PASS (carried từ round 6) |
| E6-floor | AC-6 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9-ui | AC-9 | ui-check | PASS |
| E9-khuon | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E10-ui | AC-10 | ui-check | PASS |

## Evidence

- eval: E1
  run_id: minted-thue-phi-E1-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx, 1 run, all passed.

- eval: E2
  run_id: minted-thue-phi-E2-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx, 1 run, all passed.

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx, 1 run, all passed.

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx, 1 run, all passed.

- eval: E9
  run_id: minted-thue-phi-E9-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx, 1 run, all passed.

- eval: E3
  run_id: minted-thue-phi-E3-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts, lane n, 1 run, all passed.

- eval: E4
  run_id: minted-thue-phi-E4-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts, lane n, 1 run, all passed.

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts, lane n, 1 run, all passed.

- eval: E10
  run_id: minted-thue-phi-E10-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts, lane n, 1 run, all passed.

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-15T21:12:43Z
  output: |
    18 passed (40.3s)

- eval: E7
  run_id: minted-thue-phi-E7-r8
  exit_code: 0
  baseline: red
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-15T21:12:43Z
  output: |
    cach-ly: 37 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E8
  run_id: minted-thue-phi-E8-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-15T21:12:43Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T21:12:43Z
  output: |
    design-floor-s4: không hex thô trong tệp giao diện đã chạm.

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r8
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T21:12:43Z
  output: |
    17 tệp giao diện ngoài bản đồ

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T21:12:43Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    E2-1440-sang (light, 1440x900): Admin of "[Sàn A thử thuế phí]", sidebar with "Thuế phí" selected. Heading "Tuỳ chỉnh của sàn", a "Thuế phí" card reading "3 khoản · 3 đang tính vào giá bao phí". Rows: Thuế thu nhập cá nhân 2% on (theo luật · Mặc định), Lệ phí trước bạ 0,5% on (theo luật · Mặc định), Phí môi giới input 1,5 % on (Đã đổi · [Tên] A4 · 16/11/2026). Footer "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and a pale (disabled) "Lưu" button; toast "Đã lưu thuế phí". Text dark on white, sharp and readable. E2-1440-toi (dark): same layout and content; light text on near-black, blue toggles and blue "Thêm khoản" button, "Lưu" muted blue, toast readable; no clipping or contrast problems. E2-1024-sang (light, 1024x768): same content, rows stacked (value and toggle under the title), still the 3 items with 2%, 0,5%, 1,5, footer 2,88 tỷ, toast; readable. E2-1024-toi (dark): same as the light frame in dark colours, all text readable, toggles on. All four frames match each other in content and layout and match Expected: every frame agrees, text readable in both light and dark.
  network_observed: n-a (driver)

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T21:12:43Z
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai.png: Tuy chinh cua san > Thue phi, workspace "[San B thu thue phi]". 3 khoan, 3 dang tinh. Thue TNCN 2% on, Le phi truoc ba 0,5% on, Phi moi gioi input shows 6 with red border and red message "Ti le toi da 5%."; footer "Gia chao 3 ty bao phi -> ve tay 2,745 ty"; Luu button greyed out. E3-luu.png: Phi moi gioi 1,5 (note "Da doi - [Ten] B4 - 16/11/2026"), Le phi truoc ba toggle off (note "Da doi", 0,5% still shown), header "3 khoan - 2 dang tinh", footer "ve tay 2,895 ty", toast "Da luu thue phi", Luu greyed. E3-tai-lai.png: identical to E3-luu minus the toast: 1,5, Le phi truoc ba off, 2 dang tinh, ve tay 2,895 ty, same change notes. All three frames match Expected "Ba khung khop".
  network_observed: n-a (driver)

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T21:12:43Z
  screenshot: evidence/E4-ui-step1.png
  observed: |
    E4-sang.png (light): header "[Sàn A thử thuế phí]", left nav with "Thuế phí" highlighted, page "Tuỳ chỉnh của sàn", card "Thuế phí – 3 khoản · 2 đang tính vào giá bao phí". Rows: Thuế thu nhập cá nhân 2% (on), Lệ phí trước bạ 0,5% (off), Phí môi giới 2% (on). Footer "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and "Chỉ Quản trị sàn đổi được thuế phí" (read-only note for TeamLead). E4-toi.png (dark): the same layout, text, toggles, positions and rows, with dark background and light text. Contrast is readable and no element is missing or shifted. Matches Expected "Khung khớp ở cả sáng và tối".
  network_observed: n-a (driver)

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T21:12:43Z
  screenshot: evidence/E9-ui-step1.png
  observed: |
    1440 pair: both frames have the same App Shell (left icon rail, top bar with the company name, search and theme toggle, avatar), the same second column at the same position (sub-nav column, vertical divider and collapse handle at x~308), the same h1 at x=352 y~103, the primary button at the right edge of the title row (Thêm khoản / Mời người), and the same bordered card: header with title plus subtitle, then an inner bordered list with row separators. Thuế phí shows a sub-nav list, a description line and a footer row (Giá chào 3 tỷ... / Lưu); Thành viên shows "Màn này chưa có mục con." and member rows. These are slot content differences only.
    360 pair: both have the same top bar, the same 16px gutter, the same h1, and the same card with a header plus inner bordered list with row separators and controls on the lower line of each row (toggle and percent vs role badge and Đổi vai button). One observation: in Thuế phí the primary button Thêm khoản sits below the title, while in Thành viên the button Mời người sits on the title row. This is the shared PageHeader flex-wrap reacting to the longer title text, not a different frame. Overall the two frames have the same shape; they differ in slot content.
  network_observed: n-a (driver)

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T21:12:43Z
  screenshot: evidence/E10-ui-step1.png
  observed: |
    E10-them.png (step1): Thuế phí card with 4 khoản. The new row shows the name input "Phí dịch vụ hồ sơ", the value input "0,3" focused (blue ring) with "%", toggle on, "…" and the caption "Chưa lưu". The "Thêm khoản" button is pressed (lighter blue). The footer reads "Giá chào 3 tỷ bao phí → về tay 2,871 tỷ" with a Lưu button. E10-luu.png (step2): after Lưu the row is saved as "Phí dịch vụ hồ sơ", "Sàn thêm · [Tên] A4 · 16/11/2026", value 0,3%. The Lưu button is disabled (lighter), and a toast "Đã lưu thuế phí" shows at the bottom right. E10-menu.png (step3): the "…" of the added row is open with two items, "Đổi tên khoản" and "Bỏ khoản" (red). E10-menu-moi-gioi.png (step4): the "…" of Phí môi giới ("Đã đổi", value 2%) is open with three items, "Đổi tên khoản", "Trả về mặc định" and "Bỏ khoản" (red). E10-luat.png (step5): the two law rows, "Thuế thu nhập cá nhân" (theo luật · Mặc định, 2%, toggle on) and "Lệ phí trước bạ" (theo luật · Đã đổi, 0,5%, toggle off), show a read-only percent and a toggle with no "…" menu. All four frames match "Bốn khung khớp".
  network_observed: n-a (driver)

### Carry-forward

- eval: E5
  run_id: minted-thue-phi-E5-r6
  exit_code: 0
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-thue-phi-E6-r7
  exit_code: 0
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-15T19:33:06Z
  carried_from_round: 7
  output: |
    carry-forward tu round 7 — delta khong cham paths cua eval

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r6
  exit_code: 0
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  screenshot: evidence/E6-ui-step1.png
  observed: |
    E6-1440-sang.png (light, 1440): the Bảng hàng table shows the toolbar with the 60 dòng count, the Nhóm theo Toà, Cột, Toàn màn hình and Lưu góc nhìn buttons. The columns Căn, Toà, Dự án, Trạng thái, Giá chào, Về tay, Diện tích, Phòng ngủ and Xác nhận lúc are all visible. Row 8 is 0602, S1.02, status Chưa đủ để rao, Giá chào 3 tỷ and Về tay 2,88 tỷ, so Về tay is visible straight away. No broken layout.
    E6-1440-toi.png (dark, 1440): the same content as the light frame, with 0602 showing 3 tỷ and 2,88 tỷ. Contrast is readable and the status badges are readable.
    E6-1024-sang.png (light, 1024): the same table, now narrower. The columns end at Giá chào (cut off), so Về tay is not visible without scrolling. There is a horizontal scrollbar and no overflow break. Row 0602 shows no visible value because Giá chào is clipped.
    E6-1024-toi.png (dark, 1024): the same as the light 1024 frame, with a correct dark theme.
    E6-dieu-kien.png (1440, light): the Cột button is highlighted and the table is scrolled right to show Giá chào, Về tay, Diện tích, Phòng ngủ, Xác nhận lúc and Điều kiện phí. Row 0602 reads Giá chào 3 tỷ, Về tay 2,88 tỷ and Điều kiện phí "Bao phí". Other rows show "Không bao phí" or a dash.
    This matches the expected result: the frames agree across light and dark and across 1440 and 1024, and Về tay is visible at once at 1440.
  network_observed: n-a (driver)

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r6
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

### Judgment

- eval: E8-wiki
  judged_by: judge panel (domain-correctness, operational-feasibility, spec-alignment)
  verdict: UNCERTAIN
  rationale: Cả ba lens đề xuất PASS. domain-correctness: PASS — trang fee-schedule nêu đủ ba khoản (TNCN 2%, trước bạ 0,5%, Phí môi giới mặc định 1% trong 0–5%), ai đặt (setFeeSchedule), ai đọc (readFeeSchedule, bốn vai) và "Nội bộ; trang khách không đọc (SP-4)". operational-feasibility: PASS — cùng căn cứ, thêm trang listing có đoạn Điều kiện phí (feeInclusion, hàng 19) và dòng log 2026-11-15. spec-alignment: PASS — đủ các ý hợp đồng, design/screens.yaml có phần Thuế phí (?phan=thue-phi) với nút setFeeSchedule. Đề xuất panel là PASS; người quyết ở Cổng 2.
  required_evidence:
    - (judge không nêu bằng-chứng-thiếu)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r8
  exit_code: 0
  verified_at: 2026-11-15T21:12:43Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r8
  exit_code: 0
  verified_at: 2026-11-15T21:12:43Z

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline; là lưới hồi quy có chủ ý hoặc chứng minh harness, không chứng minh tính năng mới):
- E8 (make check)
- E6-floor (design-floor-s4)
- E9-khuon (design-floor-khuon)

Baseline khong do
- npx vitest run src/modules/company-config/fee-schedule.test.ts src/modules/company-config/ui/fee-part.test.tsx --coverage.enabled=false --reporter=verbose: bo qua baseline: tep src/modules/company-config/fee-schedule.test.ts co o cay dang kiem nhung chua co o merge-base 2da953437e868503f508569ba3fe8ba799392fcd — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx vitest run -c vitest.db.config.ts tests/db/thue-phi.db.test.ts --reporter=verbose: bo qua baseline: tep tests/db/thue-phi.db.test.ts co o cay dang kiem nhung chua co o merge-base 2da953437e868503f508569ba3fe8ba799392fcd — eval moi, chay tren code cu khong phan biet gi
- DB_LANE=${DB_LANE:-n} DB_PORT=${DB_PORT:-5563} npx playwright test -c playwright.db.config.ts tests/e2e-db/thue-phi.spec.ts: bo qua baseline: tep tests/e2e-db/thue-phi.spec.ts co o cay dang kiem nhung chua co o merge-base 2da953437e868503f508569ba3fe8ba799392fcd — eval moi, chay tren code cu khong phan biet gi

## Variance

none — every multi-run eval is uniform

## Iterations

Round 2: E10-ui chưa đạt trong run-log — trả về triển khai. Rounds 3-7: chi tiết từng vòng nằm trong run-log.jsonl.
Round 8: mọi eval máy đạt, các eval không chạm paths được mang từ vòng cũ; còn một mục judgment (E8-wiki) chờ người quyết.
