---
schema_version: 2
feature_slug: thue-phi
verdict: REJECT
failed_evals: ["E10-ui"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 867776b5619adaffca43f29a58e9d6e7cf56e910
human_signoff:
---

# Evidence Report: thue-phi

Round 2. Một eval không đạt: E10-ui (bước chụp khung của AC-10). Lệnh ui-check:E10-ui đã gắn eval E10-ui, không có lệnh fail nào không gắn eval.

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
| E6-khuon | AC-6 | script | PASS |
| E6-floor | AC-6 | script | PASS |
| E7 | AC-7 | script | PASS |
| E7-db | AC-7 | script | PASS |
| E8 | AC-8 | script | PASS |
| E8-wiki | AC-8 | judgment | PASS (đề xuất, chờ người) |
| E9 | AC-9 | test | PASS |
| E9-ui | AC-9 | ui-check | PASS |
| E9-khuon | AC-9 | script | PASS |
| E10 | AC-10 | script | PASS |
| E10-ui | AC-10 | ui-check | FAIL |

## Evidence

- eval: E1
  run_id: minted-thue-phi-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed.

- eval: E2
  run_id: minted-thue-phi-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed.

- eval: E3-unit
  run_id: minted-thue-phi-E3-unit-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed.

- eval: E4-unit
  run_id: minted-thue-phi-E4-unit-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed.

- eval: E9
  run_id: minted-thue-phi-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest fee-schedule.test.ts + fee-part.test.tsx: all cases passed.

- eval: E3
  run_id: minted-thue-phi-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed.

- eval: E4
  run_id: minted-thue-phi-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed.

- eval: E7-db
  run_id: minted-thue-phi-E7-db-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed.

- eval: E10
  run_id: minted-thue-phi-E10-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_db
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest -c vitest.db.config.ts tests/db/thue-phi.db.test.ts: all cases passed.

- eval: E5
  run_id: minted-thue-phi-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest tests/thue-phi-ontology.test.ts + tests/thue-phi-cot.test.ts: all cases passed.

- eval: E6
  run_id: minted-thue-phi-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.thue_phi_ontology
  verified_at: 2026-11-14T23:28:17Z
  output: |
    vitest tests/thue-phi-ontology.test.ts + tests/thue-phi-cot.test.ts: all cases passed.

- eval: E6-e2e
  run_id: minted-thue-phi-E6-e2e-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.thue_phi_e2e
  verified_at: 2026-11-14T23:28:17Z
  output: |
    playwright tests/e2e-db/thue-phi.spec.ts: 7 passed (29.4s)

- eval: E7
  run_id: minted-thue-phi-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.cach_ly_n
  verified_at: 2026-11-14T23:28:17Z
  output: |
    cach-ly: 37 ca đạt, vai quy_hang_app, nối bằng quy_hang_login

- eval: E8
  run_id: minted-thue-phi-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-14T23:28:17Z
  output: |
    make check xanh; CODEOWNERS matches governance/autonomy.yaml

- eval: E6-khuon
  run_id: minted-thue-phi-E6-khuon-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T23:28:17Z
  output: |
    16 tệp giao diện ngoài bản đồ

- eval: E9-khuon
  run_id: minted-thue-phi-E9-khuon-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T23:28:17Z
  output: |
    16 tệp giao diện ngoài bản đồ

- eval: E6-floor
  run_id: minted-thue-phi-E6-floor-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-14T23:28:17Z
  output: |
    design-floor-s4: không hex thô trong tệp giao diện đã chạm.

- eval: E2-ui
  run_id: minted-thue-phi-E2-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui_check
  verified_at: 2026-11-14T23:28:17Z
  screenshot: evidence/E2-ui-step1.png
  observed: |
    Bốn khung (1440 và 1024, sáng và tối) cho thấy trang "Tuỳ chỉnh của sàn", tab Thuế phí, sàn "[Sàn A thử thuế phí]", đầu trang "3 khoản · 3 đang tính vào giá bao phí". Ba dòng: Thuế thu nhập cá nhân 2%, Lệ phí trước bạ 0,5% (cả hai "theo luật · Mặc định"), Phí môi giới 1,5 % "Đã đổi · [Tên] Thuế phí A CompanyAdmin · 15/11/2026". Chân trang "Giá chào 3 tỷ bao phí → về tay 2,88 tỷ", nút Lưu, toast "Đã lưu thuế phí". Ở 1024 các ô điều khiển xuống dòng thứ hai, không bị cắt; chữ đọc được ở cả sáng và tối.
  network_observed: n-a (driver)

- eval: E3-ui
  run_id: minted-thue-phi-E3-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui_check
  verified_at: 2026-11-14T23:28:17Z
  screenshot: evidence/E3-ui-step1.png
  observed: |
    E3-sai: sàn B, Phí môi giới nhập 6 viền đỏ, thông báo "Tỉ lệ tối đa 5%.", nút Lưu khoá, chân trang về tay 2,745 tỷ. E3-luu: môi giới 1,5 "Đã đổi" với tên và ngày 15/11/2026, Lệ phí trước bạ tắt, đầu trang "2 đang tính vào giá bao phí", toast "Đã lưu thuế phí", về tay 2,895 tỷ. E3-tai-lai: tải lại vẫn giữ 1,5 và Lệ phí trước bạ tắt, không có toast. Ba khung khớp kỳ vọng.
  network_observed: n-a (driver)

- eval: E4-ui
  run_id: minted-thue-phi-E4-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui_check
  verified_at: 2026-11-14T23:28:17Z
  screenshot: evidence/E4-ui-step1.png
  observed: |
    Khung sáng (1440x900): App Shell, menu "Tuỳ chỉnh của sàn" với Thuế phí được chọn, thẻ "3 khoản · 2 đang tính vào giá bao phí"; Thuế thu nhập cá nhân 2% bật, Lệ phí trước bạ 0,5% tắt, Phí môi giới 2% bật; chân trang "về tay 2,88 tỷ" và "Chỉ Quản trị sàn đổi được thuế phí". Khung tối cùng bố cục, vị trí, chữ và trạng thái công tắc, chỉ khác nền và biểu tượng chủ đề; chữ đọc được ở cả hai.
  network_observed: n-a (driver)

- eval: E6-ui
  run_id: minted-thue-phi-E6-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui_check
  verified_at: 2026-11-14T23:28:17Z
  screenshot: evidence/E6-ui-step1.png
  observed: |
    Bảng hàng 60 dòng ở 1440 sáng và tối: cột Về tay hiện ngay sau Giá chào (hàng S1.02: 3 tỷ, về tay 2,88 tỷ), Điều kiện phí ẩn sẵn. Ở 1024 bảng cắt ở Giá chào, Về tay nằm bên phải cần cuộn ngang, bố cục nguyên vẹn. Khung E6-dieu-kien (1440 sáng, mở menu Cột) hiện thêm cột Điều kiện phí với giá trị Bao phí hoặc Không bao phí, dấu — ở hàng không có giá trị. Các khung khớp nhau; Về tay thấy ngay ở 1440.
  network_observed: n-a (driver)

- eval: E9-ui
  run_id: minted-thue-phi-E9-ui-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui_check
  verified_at: 2026-11-14T23:28:17Z
  screenshot: evidence/E9-ui-step1.png
  observed: |
    Bốn khung đã mở bằng Read: Thuế phí và Thành viên ở 1440 và 360. Cùng App Shell, tiêu đề ở cùng độ cao, nút xanh bên phải, thẻ đầu xám với danh sách viền bên trong; chỉ khác nội dung khe (menu con, mô tả, chân trang, nội dung dòng). Ở 360 nút "Thêm khoản" xuống dòng riêng dưới tiêu đề dài còn "Mời người" nằm cùng dòng tiêu đề, một khác biệt nhỏ. Hai khung cùng một dáng.
  network_observed: n-a (driver)

- eval: E10-ui
  run_id: minted-thue-phi-E10-ui-r2
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui_check
  verified_at: 2026-11-14T23:28:17Z
  screenshot: evidence/E10-them.png
  observed: |
    E10-them (1440): mục Thuế phí 4 khoản, 3 tính vào giá chào; dòng mới có tên "Phí dịch vụ hồ sơ", ô tỉ lệ "0,3" đang focus, công tắc bật, «…» và "Chưa lưu", chân trang về tay 2,871 tỷ. E10-luu: dòng đã lưu "Sàn thêm · [Tên] Thuế phí A CompanyAdmin · 15/11/2026", toast "Đã lưu thuế phí". E10-menu: «…» của khoản thêm mở với "Đổi tên khoản" và "Bỏ khoản", không có "Trả về mặc định". E10-menu-moi-gioi và E10-luat trông đúng nhưng là khung CŨ (06:35), không do bước 1440 vừa chạy sinh ra.
  network_observed: n-a (driver)
  output: |
    Playwright: 8 đạt, 6 bỏ qua, 1 không đạt. Ca không đạt là [1440] anh-ui-check (thue-phi.spec.ts:323): getByRole('menu') khớp 2 menu (strict mode), menu "Việc khác với Phí dịch vụ hồ sơ" còn đang đóng sau Escape và menu "Việc khác với Phí môi giới" vừa mở. Test dừng trước khi lưu hai khung cuối. Nguyên nhân gần là cuộc đua trong test (không chờ menu đầu đóng hẳn), chưa rõ là lỗi sản phẩm. Dòng __EXIT=0 ở cuối là của tail, không phải của lần chạy.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-thue-phi-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T23:28:17Z

- cmd: make e2e
  run_id: minted-thue-phi-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-14T23:28:17Z

### Judgment

- eval: E8-wiki
  judged_by: panel đề xuất PASS (ba góc nhìn)
  verdict: PASS
  rationale: |
    - domain-correctness: PASS — Trang fee-schedule nêu đủ TNCN 2% và Lệ phí trước bạ 0,5% theo luật, Phí môi giới mặc định 1% khoảng 0–5%, Quản trị sàn đặt (setFeeSchedule), bốn vai đọc (readFeeSchedule), và nội bộ, trang khách không đọc (SP-4). Trang listing có đoạn Điều kiện phí (feeInclusion, hàng 19). Log có đúng một dòng hàng 19 ngày 2026-11-14. screens.yaml có phần ?phan=thue-phi với nút setFeeSchedule.
    - operational-feasibility: PASS — Trang fee-schedule nêu đủ hai khoản theo luật, mặc định 1% trong 0–5%, chỉ Quản trị sàn đặt và bốn vai đọc, nội bộ (SP-4). Trang listing có đoạn Điều kiện phí, log có đúng một dòng 2026-11-14 cho hàng 19, screens.yaml có phần Thuế phí với nút setFeeSchedule.
    - spec-alignment: PASS — Đủ các ý: hai khoản theo luật, mặc định 1% trong 0–5%, người đặt, người đọc, trang khách không đọc (SP-4); trang listing có đoạn Điều kiện phí; log có dòng 2026-11-14 hàng 19; sổ màn có phần Thuế phí và nút setFeeSchedule.
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

Có 12 mục ngoài hợp đồng đang chờ người quyết ở Gate 2; danh sách đầy đủ ở review-findings.md.

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: evals.yaml không đổi từ lần đo baseline cuối (round 1); mọi eval máy ghi baseline n-a.

Eval không-phân-biệt (xanh trên cả bản mới lẫn baseline; chứng minh harness chứ không chứng minh feature; cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):
- E8 (make check)
- E6-khuon, E9-khuon (design-floor-khuon.mjs --kiem)
- E6-floor (design-floor-s4.mjs)

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: kiểu chấm vòng 1 bị chặn bởi kho Docker chỉ-đọc (commit f508d55), chưa có kết luận về sản phẩm. Quay lại thực thi.
Round 2: E10-ui không đạt, ca anh-ui-check ở 1440 vỡ strict-mode vì hai menu cùng mở trong lúc menu đầu đang đóng; hai khung E10-menu-moi-gioi và E10-luat là khung cũ. Trả về thực thi.
