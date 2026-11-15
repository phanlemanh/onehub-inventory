---
schema_version: 2
feature_slug: thue-phi
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 10869c2d9ec6fa5c20f6de719ef1415100784516
human_signoff:
---

# Evidence Report: thue-phi

Round 5. Mọi eval máy đều xanh; còn một mục judgment (E8-wiki) chờ người chốt nên verdict là PENDING-JUDGMENT. Lịch sử các round nằm ở mục Iterations.

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
| E5 | AC-5 | test | PASS (carry-forward từ round 2) |
| E6 | AC-6 | test | PASS (carry-forward từ round 2) |
| E6-e2e | AC-6 | script | PASS |
| E6-ui | AC-6 | ui-check | PASS (carry-forward từ round 2) |
| E7 | AC-7 | script | PASS (carry-forward từ round 2) |
| E7-db | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E6-khuon | AC-6 | script | PASS (carry-forward từ round 2) |
| E6-floor | AC-6 | script | PASS |
| E9 | AC-9 | test | PASS |
| E9-ui | AC-9 | ui-check | PASS |
| E9-khuon | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E10-ui | AC-10 | ui-check | PASS |

## Evidence

- eval: E1
  run_id: minted-thue-phi-E1-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest: fee-schedule.test.ts và ui/fee-part.test.tsx chạy xong, mọi ca xanh.

- eval: E2
  run_id: minted-thue-phi-E2-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest: fee-schedule.test.ts và ui/fee-part.test.tsx chạy xong, mọi ca xanh.

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest: fee-schedule.test.ts và ui/fee-part.test.tsx chạy xong, mọi ca xanh.

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest: fee-schedule.test.ts và ui/fee-part.test.tsx chạy xong, mọi ca xanh.

- eval: E9
  run_id: minted-thue-phi-E9-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest: fee-schedule.test.ts và ui/fee-part.test.tsx chạy xong, mọi ca xanh.

- eval: E3
  run_id: minted-thue-phi-E3-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest (vitest.db.config.ts, dãy N, cổng 5563): tests/db/thue-phi.db.test.ts xanh.

- eval: E4
  run_id: minted-thue-phi-E4-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest (vitest.db.config.ts, dãy N, cổng 5563): tests/db/thue-phi.db.test.ts xanh.

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest (vitest.db.config.ts, dãy N, cổng 5563): tests/db/thue-phi.db.test.ts xanh.

- eval: E10
  run_id: minted-thue-phi-E10-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-15T01:39:20Z
  output: |
    vitest (vitest.db.config.ts, dãy N, cổng 5563): tests/db/thue-phi.db.test.ts xanh.

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-15T01:39:20Z
  output: |
    playwright (playwright.db.config.ts): 7 passed (21.8s)

- eval: E8
  run_id: minted-thue-phi-E8-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T01:39:20Z
  output: |
    make check xanh, dòng cuối: CODEOWNERS matches governance/autonomy.yaml

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-15T01:39:20Z
  output: |
    design-floor-s4: không hex thô trong tệp giao diện mà vòng chạm.

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-15T01:39:20Z
  output: |
    design-floor-khuon --kiem: 16 tệp giao diện ngoài bản đồ; không dòng «lệch:» cho nhóm danh-sach-khung.

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T01:39:20Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    E2-1440-sang (light): the "Tuỳ chỉnh của sàn" screen, "Thuế phí" tab selected. The header reads "3 khoản · 3 đang tính vào giá bao phí". Three rows: Thuế thu nhập cá nhân 2% (theo luật, on), Lệ phí trước bạ 0,5% (theo luật, on), Phí môi giới with input 1,5% (Đã đổi, on, "..." menu). The footer reads "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ". The Lưu button is pale because it is disabled after saving. A toast reads "Đã lưu thuế phí". Dark text on a light background, all readable, no overlap.
    E2-1440-toi (dark): same layout and content on a dark background. Text is light and readable, toggles are blue, the Lưu and Thêm khoản buttons are visible, and the toast is readable.
    E2-1024-sang (light): the same content in a narrower layout. Each row stacks as a title and subtitle, then the % value and toggle on the next line. The Phí môi giới row shows 1,5 % with its toggle and the "..." menu. The footer, Lưu button and toast are fine and nothing is clipped.
    E2-1024-toi (dark): the same stacked layout in dark mode, all text readable.
    All four frames match the Expected: frames consistent, text readable in light and dark.
  network_observed: n-a (driver)

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T01:39:20Z
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai.png (also E3-ui-step1): Company B, "Thuế phí" part on the default schedule. The "Phí môi giới" row has a red-outlined input showing 6 and the error "Tỉ lệ tối đa 5%." The Save button is greyed out. Header reads 3 items, 3 counted, with a 2,745 tỷ net. This matches "typed 6". E3-luu.png (also E3-ui-step2): "Phí môi giới" shows 1,5 with no error. "Lệ phí trước bạ" has its toggle off, with the note "Đã đổi · [Tên] B4 · 15/11/2026". Header reads 3 items, 2 counted, net 2,895 tỷ. The toast "Đã lưu thuế phí" appears. This matches "1,5 saved with Lệ phí trước bạ off". E3-tai-lai.png (also E3-ui-step3): same part opened again with no toast. "Phí môi giới" is 1,5, "Lệ phí trước bạ" is off, header is 2 counted, net 2,895 tỷ. The saved state persisted. The three frames agree with Expected.
  network_observed: n-a (driver)

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T01:39:20Z
  screenshot: evidence/E4-ui-step1.png
  observed: |
    E4-sang.png (light): company A TeamLead, screen "Tuỳ chỉnh của sàn", Thuế phí part selected in the left menu. Three rows: Thuế thu nhập cá nhân 2% (on, "theo luật · Mặc định"), Lệ phí trước bạ 0,5% (off, "theo luật · Đã đổi · [Tên] A4 · 15/11/2026"), Phí môi giới 2% (on, "Đã đổi · [Tên] A4 · 15/11/2026"). Footer reads "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ" and "Chỉ Quản trị sàn đổi được thuế phí" (read only). The header shows "3 khoản · 2 đang tính vào giá bao phí". E4-toi.png (dark): the same layout, text, values, toggle states and positions on a dark background. The text and toggles are readable and the part is selected in the menu. No overlap or clipping. The dev "N" badge is hidden. Light and dark match, as expected.
  network_observed: n-a (driver)

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T01:39:20Z
  screenshot: evidence/E9-ui-step1.png
  observed: |
    1440 pair. Thuế phí and Thành viên share the same elements. Left icon rail with the logo and 5 icons, the same position and highlight style. Top bar with the sidebar toggle, "[Sàn A thử thuế phí]", the search field, the theme toggle and the avatar "T". A rounded white panel. A sub-nav column at the left of the panel with a collapse handle. An H1 at the same x (352) with a blue primary action button at the right edge. A rounded card with a bold title, a muted subtitle and an inset rounded list with hairline-separated rows. Differences are slot content only. Sub-nav: 6 links with "Thuế phí" active, versus "Màn này chưa có mục con.". Title and button: "Tuỳ chỉnh của sàn" with "Thêm khoản", versus "Thành viên" with "Mời người". Thuế phí adds a one-line description above the card. The rows hold names, toggles and a % input, versus avatars, emails and role badges. Thuế phí has a footer with the "Giá chào" total and a "Lưu" button.
    360 pair. The same top bar (toggle, name, search, theme, avatar), the same 16px gutter, the same H1 and the same card, with its title, subtitle and inset list. In Thuế phí the "Thêm khoản" button sits on its own row under the H1, plus a description and a footer. In Thành viên the "Mời người" button is inline at the right of the H1. Otherwise the frames match in shape and spacing, and the differences are slot content.
  network_observed: n-a (driver)

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r5
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T01:39:20Z
  screenshot: evidence/E10-ui-step1.png
  observed: |
    E10-them: Tuỳ chỉnh của sàn, Thuế phí section «4 khoản · 3 đang tính vào giá bao phí». Rows: Thuế thu nhập cá nhân 2% (theo luật), Lệ phí trước bạ 0,5% (theo luật, off), Phí môi giới with input 2 (Đã đổi), and a new row with name field «Phí dịch vụ hồ sơ» and input 0,3, labelled «Chưa lưu». The footer shows «Giá chào 3 tỷ bao phí → về tay 2,871 tỷ» and the Lưu button is active. E10-luu: the new row now reads «Phí dịch vụ hồ sơ · Sàn thêm · [Tên] A4 · 15/11/2026», value 0,3, with a «…» button. Lưu is disabled and the toast «Đã lưu thuế phí» shows. E10-menu: the «…» menu of the added item shows two entries, Đổi tên khoản and Bỏ khoản (red). E10-menu-moi-gioi: the «…» menu of Phí môi giới shows three entries, Đổi tên khoản, Trả về mặc định, Bỏ khoản (red). E10-luat: the two law rows (Thuế thu nhập cá nhân, Lệ phí trước bạ) show a plain percentage and a toggle only, with no input and no «…»; the «…» button on the Phí môi giới row has focus. All four expected frames match «Bốn khung khớp».
  network_observed: n-a (driver)

### Eval mang sang (carry-forward)

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
  # carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E7
  run_id: minted-thue-phi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  output: |
    carry-forward tu round 2 — delta khong cham paths cua eval

### Judgment

- eval: E8-wiki
  judged_by: hội đồng judge (đề xuất PASS, chỉ để tham khảo)
  proposal: PASS
  rationale: Cả ba góc nhìn đều thấy đủ bốn tệp khớp hợp đồng.
  votes:
    - domain-correctness: PASS — Trang fee-schedule nêu đủ: hai khoản theo luật (TNCN 2%, trước bạ 0,5%), Phí môi giới mặc định 1% trong khoảng 0–5%, Quản trị sàn đặt (setFeeSchedule), bốn vai đọc (readFeeSchedule), và nội bộ, trang khách không đọc (SP-4). Trang listing có đoạn Điều kiện phí (feeInclusion, hàng 19). log.md có đúng một dòng hàng 19 ngày 2026-11-14. screens.yaml có phần ?phan=thue-phi với nút setFeeSchedule.
    - operational-feasibility: PASS — Trang fee-schedule nêu đủ ba khoản, ai đặt (chỉ Quản trị sàn, setFeeSchedule), ai đọc (bốn vai, readFeeSchedule) và rằng đây là dữ liệu nội bộ, trang khách không đọc (SP-4). Trang listing có đoạn Điều kiện phí (feeInclusion, hàng 19) và nói trang khách không đọc. Log có đúng một dòng 2026-11-14 cho hàng 19. Sổ màn có phần Thuế phí (?phan=thue-phi) với nút setFeeSchedule.
    - spec-alignment: PASS — Trang fee-schedule nêu hai khoản theo luật, Phí môi giới mặc định 1% trong khoảng 0–5%, ai đặt và ai đọc, và ghi "Nội bộ; trang khách không đọc (SP-4)". Trang listing có đoạn Điều kiện phí (feeInclusion, hàng 19), log.md có dòng 2026-11-14 cho hàng 19, và screens.yaml có phần ?phan=thue-phi với nút setFeeSchedule.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r5
  exit_code: 0
  verified_at: 2026-11-15T01:39:20Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r5
  exit_code: 0
  verified_at: 2026-11-15T01:39:20Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness hơn là tính năng; viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E8 (lệnh make check)
- E6-khuon, E9-khuon (lệnh design-floor-khuon --kiem)
- E6-floor (lệnh design-floor-s4)

Baseline khong do: mọi eval ghi baseline n-a vì round này không đo lại.

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: lượt gốc, chạy đầy đủ và đo baseline.
Round 2: chạy lại đầy đủ; E5, E6, E6-ui, E7, E6-khuon xanh và được mang sang các round sau.
Round 3: mang sang phần không đổi, chạy lại phần có đổi.
Round 4: chấm trả về vì đặt lại mặc định sau khi đổi tên làm rơi tên khoản; sửa ở commit 2f49510, thêm bài đo ở d76ed4b.
Round 5: mọi eval máy xanh trên cây 10869c2; E8-wiki chờ người chốt ở Cổng 2.
