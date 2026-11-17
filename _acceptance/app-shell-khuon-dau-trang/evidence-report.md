---
schema_version: 2
feature_slug: app-shell-khuon-dau-trang
verdict: REJECT
failed_evals: ["E5","E15","E16","E10","E11"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 2b76a3331d7846c7cabcce9fa616baafe78e2102
human_signoff:
---

# Evidence Report: app-shell-khuon-dau-trang

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | script | PASS |
| E5 | AC-4 | script | FAIL |
| E6 | AC-5 | script | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-6 | script | PASS |
| E9 | AC-6 | test | PASS |
| E10 | AC-7 | script | FAIL |
| E11 | AC-7 | script | FAIL |
| E12 | AC-8 | ui-check | PASS |
| E13 | AC-8 | judgment | UNCERTAIN |
| E14 | AC-7 | script | PASS |
| E15 | AC-4 | script | FAIL |
| E16 | AC-5 | script | FAIL |

## Evidence

- eval: E1
  run_id: minted-app-shell-khuon-dau-trang-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E2
  run_id: minted-app-shell-khuon-dau-trang-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E3
  run_id: minted-app-shell-khuon-dau-trang-E3-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E4
  run_id: minted-app-shell-khuon-dau-trang-E4-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E5
  run_id: minted-app-shell-khuon-dau-trang-E5-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T01:22:55Z
  output: |
    playwright.db.config.ts, dãy R: 32 failed, 157 skipped, 40 did not run, 661 passed (31.9m)
    Đỏ ở 360 và 414: bo-nut-members, login, members, thue-phi, va-dang-nhap (dang-xuat, dang-xuat-mang-dut, dang-xuat-may-chu-loi, dang-xuat-duoc, axe-sang-toi, moi-nguoi-va-dang-nhap, doi-vai-thanh-ben, khong-du-quyen, tu-choi-403-cau-rieng, dat-muc-roi-bang-hang-doi)
    Đỏ ở 1024 và 1440: login.spec dang-xuat, thue-phi.spec dat-muc-roi-bang-hang-doi
    Đỏ ở vai-360: vai-man.spec thanh ben theo vai
    gac-hydration: 0 canh bao

- eval: E6
  run_id: minted-app-shell-khuon-dau-trang-E6-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E7
  run_id: minted-app-shell-khuon-dau-trang-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.app_shell_verve_unit
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx vitest run tests/app-shell.test.tsx tests/frame.test.tsx tools/e2e_templates/e2e-templates.test.ts

- eval: E8
  run_id: minted-app-shell-khuon-dau-trang-E8-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.app_shell_verve_e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx playwright test tests/e2e/app-shell.spec.ts tests/e2e/frame.spec.ts tests/e2e/grid.spec.ts
    gac-hydration: 0 canh bao

- eval: E9
  run_id: minted-app-shell-khuon-dau-trang-E9-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.app_shell_verve_unit
  verified_at: 2026-11-17T01:22:55Z
  output: |
    npx vitest run tests/app-shell.test.tsx tests/frame.test.tsx tools/e2e_templates/e2e-templates.test.ts

- eval: E10
  run_id: minted-app-shell-khuon-dau-trang-E10-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-17T01:22:55Z
  output: |
    make check: Test Files 2 failed | 145 passed (147); Tests 2 failed | 2463 passed | 2 skipped
    Đỏ 1: tests/dang-nhap-giu-loi.test.ts:75 giu-loi-bai-dang-nhap, mã băm tệp lệch với mã đã giữ (nhận 9a1630cf48f58ca9ba4a607da478bbbb6b0d6562f5073970623d2648764495c3)
    Đỏ 2: tests/sua-trang.test.ts:35 "sua-trang: tests/e2e-db/app-shell-verve.spec.ts:150 screenshot khong qua cua chung"

- eval: E11
  run_id: minted-app-shell-khuon-dau-trang-E11-r1
  exit_code: 2
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-17T01:22:55Z
  output: |
    make e2e: 2 failed, 1151 skipped, 1267 passed (18.6m); cả hai ở khổ 1440
    Đỏ 1: tools/e2e_templates/suite.ts:116 cham / man sent / khung tieu-de, "page not hydrated" (trang chua gan xong)
    Đỏ 2: tools/e2e_templates/suite.ts:272 pha vung cho-tai "khung cho khong bao gio hien" phai do trong 15000ms, đo 52801ms

- eval: E12
  run_id: minted-app-shell-khuon-dau-trang-E12-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-17T01:22:55Z
  screenshot: evidence/E12-step1.png
  observed: |
    1440 sáng/tối, 1024 sáng: trước có nút thanh bên ở góc trái, ô tìm kèm nút giao diện và "Đăng nhập" ở góc phải, tiêu đề lớn "Bảng hàng"/"Hôm nay" và menu giao diện (Sáng/Tối/Theo thiết bị). Sau: ô tìm giữa thanh trên, không còn nút giao diện và đăng nhập ở góc phải, một hàng nhỏ "Bảng hàng › Tất cả hàng", không còn nút thanh bên, biểu tượng tài khoản nhỏ ở đáy dải; menu mở có hàng "Giao diện" ba lựa chọn và "Đăng nhập". Dải gập nằm giữa chiều cao trên mép cột, mép cột chạy tới đáy, bảng không đổi.
    414/360 sáng/tối: sau giữ nút mở tấm menu ở góc trái và biểu tượng tìm, bỏ giao diện và đăng nhập khỏi thanh trên, thay tiêu đề lớn bằng hàng đường dẫn; tấm menu mở có nút tài khoản ở đáy với hàng Giao diện ba lựa chọn. Đăng nhập thật ở bốn khổ: tên, email dài và dòng "Đang làm ở" mỗi thứ một dòng, ba kiểu giao diện, "Đăng xuất". Tối đọc được. Ghi chú: Hôm nay sau chỉ có tiêu đề cột nhỏ, không có hàng đường dẫn (màn không có nút chính).
  network_observed: n-a (driver)

- eval: E13
  judged_by: judge panel (3 lens, fresh context) — đề xuất
  verdict: UNCERTAIN
  rationale: Cả ba lens không phân biệt được việc làm đúng lời chủ kho với việc thêm ngoài lời, vì nhiều chi tiết cột «Sau» và việc dời dấu dev Next.js không có trong «Nguồn».
  panel_votes:
    - domain-correctness: UNCERTAIN — Mỗi chỗ A1–A6 có đúng một dòng, P1–P3 nằm ở Out of scope, nhưng nhiều chi tiết A1, A3, A4 (nét bẻ ‹ ›, ô tìm 320 px, menu 320 px, email 40 ký tự) và việc dời dấu dev Next.js không thấy trong lời chủ kho ở mục «Nguồn»; design.md không nói P1–P3 ứng với lời nào.
    - operational-feasibility: UNCERTAIN — Phần lớn khớp lời chủ kho, nhưng P1–P3 chỉ được nêu tên ở contract.md, và việc dời dấu dev nằm ngoài sáu chỗ nên có thể trái AC-8.
    - spec-alignment: UNCERTAIN — Có đúng sáu hàng A1–A6; chi tiết cột «Sau» vượt lời nguyên văn trong «Nguồn», và «Ngoài sáu chỗ» nêu việc dời dấu dev mà không có câu chủ kho nào đòi.
  required_evidence:
    - Sổ ghi chú của đợt `dieu-chinh-hang-muc-verve-settings.md`: cho thấy các chi tiết cột «Sau» của A1, A3, A4 (nét bẻ ‹ › khi rê, ô tìm 320 px, menu 320 px, cắt email sau 40 ký tự) là điều chủ kho bảo hoặc số đo Verve chủ kho đã bảo theo.
    - Lời nguyên văn của chủ kho cho P1 (phần hồ sơ sàn), P2 (tìm/lọc/sắp ở màn Thành viên), P3 (chia nhóm cột mục con) với dấu «chỉ ghi lại», để xác nhận contract.md Out of scope không thiếu việc nào.
    - Lời hay dòng quyết định của chủ kho cho phép dời dấu bản dev Next.js sang góc phải dưới; ảnh trước/sau bốn khổ của góc dưới trái và dấu dev để xác nhận không trái AC-8.
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-app-shell-khuon-dau-trang-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-17T01:22:55Z

- eval: E14
  run_id: minted-app-shell-khuon-dau-trang-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-17T01:22:55Z
  output: |
    design-floor-s4.mjs --root . xong, không thấy màu hex thô trên các tệp giao diện vòng này chạm

- eval: E15
  run_id: minted-app-shell-khuon-dau-trang-E15-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T01:22:55Z
  output: |
    Cùng lần chạy playwright.db.config.ts với E5: 32 failed, 661 passed. Chưa có dòng đỏ riêng của app-shell-verve.spec.ts trong phần đuôi đã lưu; đồng thời bài sua-trang chỉ ra app-shell-verve.spec.ts:150 có screenshot không qua cửa chung.
    gac-hydration: 0 canh bao

- eval: E16
  run_id: minted-app-shell-khuon-dau-trang-E16-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.app_shell_verve_db
  verified_at: 2026-11-17T01:22:55Z
  output: |
    Cùng lần chạy playwright.db.config.ts với E5: 32 failed, 661 passed. Đỏ gồm thue-phi.spec.ts:315 dat-muc-roi-bang-hang-doi ở 360, 414, 1024, 1440 (Tuỳ chỉnh của sàn › Thuế phí).
    gac-hydration: 0 canh bao

Lệnh fail không gắn eval: không có. Ba lệnh fail đều đã gắn eval (dãy db gắn E5, E15, E16; make check gắn E10; make e2e gắn E11).

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline, chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý): E7, E9 (lệnh npx vitest run tests/app-shell.test.tsx tests/frame.test.tsx tools/e2e_templates/e2e-templates.test.ts --coverage.enabled=false --reporter=verbose).

Baseline không đo:
- make check: baseline vuột trần 178 giây/lệnh — đã dừng cả cây tiến trình; BLOCKED hạ tầng, không phải kết quả của code cũ
- make e2e: hết trần tổng 480 giây của lane baseline trước khi tới lệnh này — không chạy
- R="${CLAUDE_PLUGIN_ROOT:-$(node tools/kit-root.mjs)}" && node "$R/scripts/design-floor-s4.mjs" --root .: hết trần tổng 480 giây của lane baseline trước khi tới lệnh này — không chạy

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, không có phương sai)

## Iterations

Round 1: E5, E15, E16, E10, E11 failed — bài đăng nhập thật trên Postgres dãy R đỏ ở đăng xuất, thành viên, thuế phí và vai × màn; make check đỏ vì mã băm bài giữ lời đăng nhập lệch và vì app-shell-verve.spec.ts:150 có screenshot không qua cửa chung; make e2e đỏ ở khổ 1440 (trang chưa gắn xong ở khung tiêu đề, pha chờ-tải quá 15000 ms). Returned to implementation.
