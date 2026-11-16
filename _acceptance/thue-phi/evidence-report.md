---
schema_version: 2
feature_slug: thue-phi
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 038f0756f995c1fef3b8028b48d689a3280ddade
human_signoff: Manh Phan 2026-11-16
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
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E6-e2e | AC-6 | script | PASS |
| E6-ui | AC-6 | ui-check | PASS |
| E7 | AC-7 | script | PASS |
| E7-db | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người điền human_override) |
| E6-khuon | AC-6 | script | PASS |
| E6-floor | AC-6 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9-ui | AC-9 | ui-check | PASS |
| E9-khuon | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E10-ui | AC-10 | ui-check | PASS |

## Evidence

- eval: E8
  run_id: minted-thue-phi-E8-r9
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T21:29:58Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E1
  run_id: minted-thue-phi-E1-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E2
  run_id: minted-thue-phi-E2-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  screenshot: evidence/E2-ui-step1.png
  observed: |
    E2-1440-sang (light, 1440x900): Admin of "[Sàn A thử thuế phí]", sidebar with "Thuế phí" selected. Heading "Tuỳ chỉnh của sàn", a "Thuế phí" card reading "3 khoản · 3 đang tính vào giá bao phí". Rows: Thuế thu nhập cá nhân 2% on (theo luật · Mặc định), Lệ phí trước bạ 0,5% on (theo luật · Mặc định), Phí môi giới input 1,5 % on (Đã đổi · [Tên] A4 · 16/11/2026). Footer "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and a pale (disabled) "Lưu" button; toast "Đã lưu thuế phí". Text dark on white, sharp and readable. E2-1440-toi (dark): same layout and content; light text on near-black, blue toggles and blue "Thêm khoản" button, "Lưu" muted blue, toast readable; no clipping or contrast problems. E2-1024-sang (light, 1024x768): same content, rows stacked (value and toggle under the title), still the 3 items with 2%, 0,5%, 1,5, footer 2,88 tỷ, toast; readable. E2-1024-toi (dark): same as the light frame in dark colours, all text readable, toggles on. All four frames match each other in content and layout and match Expected: every frame agrees, text readable in both light and dark.
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E3
  run_id: minted-thue-phi-E3-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai.png: Tuy chinh cua san > Thue phi, workspace "[San B thu thue phi]". 3 khoan, 3 dang tinh. Thue TNCN 2% on, Le phi truoc ba 0,5% on, Phi moi gioi input shows 6 with red border and red message "Ti le toi da 5%."; footer "Gia chao 3 ty bao phi -> ve tay 2,745 ty"; Luu button greyed out. E3-luu.png: Phi moi gioi 1,5 (note "Da doi - [Ten] B4 - 16/11/2026"), Le phi truoc ba toggle off (note "Da doi", 0,5% still shown), header "3 khoan - 2 dang tinh", footer "ve tay 2,895 ty", toast "Da luu thue phi", Luu greyed. E3-tai-lai.png: identical to E3-luu minus the toast: 1,5, Le phi truoc ba off, 2 dang tinh, ve tay 2,895 ty, same change notes. All three frames match Expected "Ba khung khop".
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E4
  run_id: minted-thue-phi-E4-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  screenshot: evidence/E4-ui-step1.png
  observed: |
    E4-sang.png (light): header "[Sàn A thử thuế phí]", left nav with "Thuế phí" highlighted, page "Tuỳ chỉnh của sàn", card "Thuế phí – 3 khoản · 2 đang tính vào giá bao phí". Rows: Thuế thu nhập cá nhân 2% (on), Lệ phí trước bạ 0,5% (off), Phí môi giới 2% (on). Footer "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and "Chỉ Quản trị sàn đổi được thuế phí" (read-only note for TeamLead). E4-toi.png (dark): the same layout, text, toggles, positions and rows, with dark background and light text. Contrast is readable and no element is missing or shifted. Matches Expected "Khung khớp ở cả sáng và tối".
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E5
  run_id: minted-thue-phi-E5-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E6
  run_id: minted-thue-phi-E6-r7
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-15T19:33:06Z
  carried_from_round: 7
  output: |
    carry-forward tu round 7 — delta khong cham paths cua eval

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
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
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-thue-phi-E7-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r6
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T10:42:02Z
  carried_from_round: 6
  output: |
    carry-forward tu round 6 — delta khong cham paths cua eval

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E9
  run_id: minted-thue-phi-E9-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  screenshot: evidence/E9-ui-step1.png
  observed: |
    1440 pair: both frames have the same App Shell (left icon rail, top bar with the company name, search and theme toggle, avatar), the same second column at the same position (sub-nav column, vertical divider and collapse handle at x~308), the same h1 at x=352 y~103, the primary button at the right edge of the title row (Thêm khoản / Mời người), and the same bordered card: header with title plus subtitle, then an inner bordered list with row separators. Thuế phí shows a sub-nav list, a description line and a footer row (Giá chào 3 tỷ... / Lưu); Thành viên shows "Màn này chưa có mục con." and member rows. These are slot content differences only.
    360 pair: both have the same top bar, the same 16px gutter, the same h1, and the same card with a header plus inner bordered list with row separators and controls on the lower line of each row (toggle and percent vs role badge and Đổi vai button). One observation: in Thuế phí the primary button Thêm khoản sits below the title, while in Thành viên the button Mời người sits on the title row. This is the shared PageHeader flex-wrap reacting to the longer title text, not a different frame. Overall the two frames have the same shape; they differ in slot content.
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E10
  run_id: minted-thue-phi-E10-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r8
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T21:12:43Z
  carried_from_round: 8
  screenshot: evidence/E10-ui-step1.png
  observed: |
    E10-them.png (step1): Thuế phí card with 4 khoản. The new row shows the name input "Phí dịch vụ hồ sơ", the value input "0,3" focused (blue ring) with "%", toggle on, "…" and the caption "Chưa lưu". The "Thêm khoản" button is pressed (lighter blue). The footer reads "Giá chào 3 tỷ bao phí → về tay 2,871 tỷ" with a Lưu button. E10-luu.png (step2): after Lưu the row is saved as "Phí dịch vụ hồ sơ", "Sàn thêm · [Tên] A4 · 16/11/2026", value 0,3%. The Lưu button is disabled (lighter), and a toast "Đã lưu thuế phí" shows at the bottom right. E10-menu.png (step3): the "…" of the added row is open with two items, "Đổi tên khoản" and "Bỏ khoản" (red). E10-menu-moi-gioi.png (step4): the "…" of Phí môi giới ("Đã đổi", value 2%) is open with three items, "Đổi tên khoản", "Trả về mặc định" and "Bỏ khoản" (red). E10-luat.png (step5): the two law rows, "Thuế thu nhập cá nhân" (theo luật · Mặc định, 2%, toggle on) and "Lệ phí trước bạ" (theo luật · Đã đổi, 0,5%, toggle off), show a read-only percent and a toggle with no "…" menu. All four frames match "Bốn khung khớp".
  network_observed: n-a (driver)
  output: |
    carry-forward tu round 8 — delta khong cham paths cua eval

- eval: E8-wiki
  judged_by: hội đồng ba lăng kính (carried)
  verdict: PASS
  rationale: panel giu nguyen tu round 8 — inputs khong doi, khong cham lai; rationale xem round do.
  votes:
    - domain-correctness: PASS (r8)
    - operational-feasibility: PASS (r8)
    - spec-alignment: PASS (r8)
  human_override: Manh Phan 2026-11-16 — Đạt

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r9
  exit_code: 0
  verified_at: 2026-11-15T21:29:58Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r9
  exit_code: 0
  verified_at: 2026-11-15T21:29:58Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 8 — baseline khong do lai round nay

Eval khong-phan-biet (xanh ca tren HEAD lan baseline; harness, khong phai feature — viet lai de assert hanh vi moi hoac xac nhan la regression-guard co chu y):

- E8 (make check)
- E6-floor (design-floor-s4.mjs --root .)
- E9-khuon (design-floor-khuon.mjs --kiem --root .)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1-7: xem run-log.jsonl cho tung vong; cac loi da duoc tra ve implementation va sua.
Round 8: delta grading tren 4efd99d, khong eval nao hong trong hop dong.
Round 9: delta grading tren f70147d; chi E8 chay lai, ba lenh suite xanh; cac eval con lai carry-forward; con cho human_override o muc E8-wiki va duyet muc SP-1 o Cong 2.

### Re-pin lần 1 — 2026-11-16, do gộp main ebbbe77 sau chữ ký; nối cột tính vào luật dán
run_id: repin-20261116T033759Z-18765
sha: 19b5266d5821f3a68b13b0e6328b3a3701254f0d · suites: 3 lệnh exit 0 · evals: 17/17 eval máy đạt kỳ vọng · ngoài làn máy: E2-ui, E3-ui, E4-ui, E6-ui, E8-wiki (E8-wiki không khai paths), E9-ui, E10-ui · diff chạm vật đo ngoài làn máy: E6-ui — chưa chứng lại, đi vòng S4 delta

### Re-pin lần 2 — 2026-11-16, do lượt ghim lại cuối của hàng 1u sau khi gộp nhánh chính 7ea2f53 (G-1611-41)
run_id: repin-20261116T070937Z-41988
sha: 038f0756f995c1fef3b8028b48d689a3280ddade · suites: 3 lệnh exit 0 · evals: 17/17 eval máy đạt kỳ vọng · ngoài làn máy: E2-ui, E3-ui, E4-ui, E6-ui, E8-wiki (E8-wiki không khai paths), E9-ui, E10-ui
