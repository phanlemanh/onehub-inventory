---
schema_version: 2
feature_slug: thue-phi
verdict: PENDING-JUDGMENT
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: de3cbd2fd128867cd7fa3e73690da0f5a71ebd72
human_signoff:
---

# Evidence Report: thue-phi

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS (carried từ round 2) |
| E2 | AC-2 | test | PASS (carried từ round 2) |
| E2-ui | AC-2 | ui-check | PASS (carried từ round 2) |
| E3 | AC-3 | script | PASS (carried từ round 2) |
| E3-unit | AC-3 | test | PASS (carried từ round 2) |
| E3-ui | AC-3 | ui-check | PASS (carried từ round 2) |
| E4 | AC-4 | script | PASS (carried từ round 2) |
| E4-unit | AC-4 | test | PASS (carried từ round 2) |
| E4-ui | AC-4 | ui-check | PASS (carried từ round 2) |
| E5 | AC-5 | test | PASS (carried từ round 2) |
| E6 | AC-6 | test | PASS (carried từ round 2) |
| E6-e2e | AC-6 | script | PASS |
| E6-ui | AC-6 | ui-check | PASS (carried từ round 2) |
| E7 | AC-7 | script | PASS (carried từ round 2) |
| E7-db | AC-7 | script | PASS (carried từ round 2) |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E6-khuon | AC-6 | script | PASS (carried từ round 2) |
| E6-floor | AC-6 | script | PASS (carried từ round 2) |
| E9 | AC-9 | test | PASS (carried từ round 2) |
| E9-ui | AC-9 | ui-check | PASS (carried từ round 2) |
| E9-khuon | AC-9 | script | PASS (carried từ round 2) |
| E10 | AC-10 | script | PASS (carried từ round 2) |
| E10-ui | AC-10 | ui-check | PASS |

## Evidence

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-15T00:19:01Z
  output: |
    7 passed (25.6s)

- eval: E8
  run_id: minted-thue-phi-E8-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-15T00:19:01Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r3
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-15T00:19:01Z
  screenshot: evidence/E10-ui-step1.png
  observed: |
    I opened all five frames and compared them with Expected; they match.
    - E10-them.png (1440 wide): the Thuế phí page header shows «Thêm khoản». A fourth row is new and unsaved, with the name field «Phí dịch vụ hồ sơ», the rate field «0,3» in focus, and the label «Chưa lưu». «Lưu» is active, and the footer reads «Giá chào 3 tỷ bao phí → về tay 2,871 tỷ».
    - E10-luu.png: after Lưu the row is a saved item named «Phí dịch vụ hồ sơ», with «0,3 %», a toggle that is on, the label «Sàn thêm · [Tên] Thuế phí A CompanyAdmin · 15/11/2026», and a «…» button. «Lưu» is greyed out. The toast «Đã lưu thuế phí» is shown. The header reads «4 khoản · 3 đang tính vào giá bao phí».
    - E10-menu.png: the «…» of the added item is open, with the menu «Đổi tên khoản» and «Bỏ khoản» (red). There is no «Trả về mặc định», which is right for an item the company added itself.
    - E10-menu-moi-gioi.png: the «…» of Phí môi giới (label «Đã đổi») is open, with «Đổi tên khoản», «Trả về mặc định» and «Bỏ khoản» (red). This has the extra reset entry for a changed default item, as expected.
    - E10-luat.png: the two law rows, «Thuế thu nhập cá nhân» (2%, label «theo luật · Mặc định») and «Lệ phí trước bạ» (0,5%, label «theo luật · Đã đổi»), show a plain percentage and a toggle with no «…» menu and no rate field. The two company rows below them keep the field and «…». The «…» button of Phí môi giới has a focus ring and its menu is closed.
  network_observed: n-a (driver)

### Carry-forward (round 2 — delta không chạm paths của eval, round này không chạy lại)

- eval: E1
  run_id: minted-thue-phi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E2
  run_id: minted-thue-phi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval
  screenshot: evidence/E2-ui-step1.png
  observed: |
    Bốn khung (1440 và 1024, sáng và tối) cho thấy trang "Tuỳ chỉnh của sàn", tab Thuế phí, sàn "[Sàn A thử thuế phí]", đầu trang "3 khoản · 3 đang tính vào giá bao phí". Ba dòng: Thuế thu nhập cá nhân 2%, Lệ phí trước bạ 0,5% (cả hai "theo luật · Mặc định"), Phí môi giới 1,5 % "Đã đổi · [Tên] Thuế phí A CompanyAdmin · 15/11/2026". Chân trang "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ", nút Lưu, toast "Đã lưu thuế phí". Ở 1024 các ô điều khiển xuống dòng thứ hai, không bị cắt; chữ đọc được ở cả sáng và tối.
  network_observed: n-a (driver)

- eval: E3
  run_id: minted-thue-phi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai: sàn B, Phí môi giới nhập 6 viền đỏ, thông báo "Tỉ lệ tối đa 5%.", nút Lưu khoá, chân trang về tay 2,745 tỷ. E3-luu: môi giới 1,5 "Đã đổi" với tên và ngày 15/11/2026, Lệ phí trước bạ tắt, đầu trang "2 đang tính vào giá bao phí", toast "Đã lưu thuế phí", về tay 2,895 tỷ. E3-tai-lai: tải lại vẫn giữ 1,5 và Lệ phí trước bạ tắt, không có toast. Ba khung khớp kỳ vọng.
  network_observed: n-a (driver)

- eval: E4
  run_id: minted-thue-phi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval
  screenshot: evidence/E4-ui-step1.png
  observed: |
    Khung sáng (1440x900): App Shell, menu "Tuỳ chỉnh của sàn" với Thuế phí được chọn, thẻ "3 khoản · 2 đang tính vào giá bao phí"; Thuế thu nhập cá nhân 2% bật, Lệ phí trước bạ 0,5% tắt, Phí môi giới 2% bật; chân trang "về tay 2,88 tỷ" và "Chỉ Quản trị sàn đổi được thuế phí". Khung tối cùng bố cục, vị trí, chữ và trạng thái công tắc, chỉ khác nền và biểu tượng chủ đề; chữ đọc được ở cả hai.
  network_observed: n-a (driver)

- eval: E5
  run_id: minted-thue-phi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E6
  run_id: minted-thue-phi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval
  screenshot: evidence/E6-ui-step1.png
  observed: |
    Bảng hàng 60 dòng ở 1440 sáng và tối: cột Về tay hiện ngay sau Giá chào (hàng S1.02: 3 tỷ, về tay 2,88 tỷ), Điều kiện phí ẩn sẵn. Ở 1024 bảng cắt ở Giá chào, Về tay nằm bên phải cần cuộn ngang, bố cục nguyên vẹn. Khung E6-dieu-kien (1440 sáng, mở menu Cột) hiện thêm cột Điều kiện phí với giá trị Bao phí hoặc Không bao phí, dấu — ở hàng không có giá trị. Các khung khớp nhau; Về tay thấy ngay ở 1440.
  network_observed: n-a (driver)

- eval: E7
  run_id: minted-thue-phi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E9
  run_id: minted-thue-phi-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval
  screenshot: evidence/E9-ui-step1.png
  observed: |
    Bốn khung đã mở bằng Read: Thuế phí và Thành viên ở 1440 và 360. Cùng App Shell, tiêu đề ở cùng độ cao, nút xanh bên phải, thẻ đầu xám với danh sách viền bên trong; chỉ khác nội dung khe (menu con, mô tả, chân trang, nội dung dòng). Ở 360 nút "Thêm khoản" xuống dòng riêng dưới tiêu đề dài còn "Mời người" nằm cùng dòng tiêu đề, một khác biệt nhỏ. Hai khung cùng một dáng.
  network_observed: n-a (driver)

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

- eval: E10
  run_id: minted-thue-phi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  carried_from_round: 2
  note: carry-forward từ round 2 — delta không chạm paths của eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r3
  exit_code: 0
  verified_at: 2026-11-15T00:19:01Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r3
  exit_code: 0
  verified_at: 2026-11-15T00:19:01Z

### Judgment

- eval: E8-wiki
  judged_by: hội đồng judge (đề xuất PASS), panel giữ nguyên từ round 2 — inputs không đổi, không chấm lại; rationale xem round 2
  verdict: PASS
  votes:
    - domain-correctness: PASS (r2)
    - operational-feasibility: PASS (r2)
    - spec-alignment: PASS (r2)
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Carried từ round 1 — baseline không đo lại round này. Field baseline của từng eval ghi n-a vì round này không đo.

Eval không phân biệt (pass trên cả HEAD lẫn baseline; chứng minh harness chứ không phải feature — viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- make check (E8)
- node design-floor-khuon.mjs --kiem --root . (E6-khuon, E9-khuon)
- node design-floor-s4.mjs --root . (E6-floor)

## Variance

none — mọi eval chạy một lần (deterministic), không có pass_rate hỗn hợp.

## Iterations

Round 1: bị chặn — kho Docker chỉ đọc nên các eval cần cơ sở dữ liệu không chạy được; không có lỗi mã.
Round 2: chạy toàn bộ eval AC-1 đến AC-10, đều xanh; E8-wiki chờ người.
Round 3: chạy lại E6-e2e, E8, E10-ui và hai lệnh suite (build, make e2e), đều xanh; các eval còn lại carry-forward từ round 2. Verdict PENDING-JUDGMENT vì E8-wiki còn chờ người chốt.
