---
schema_version: 2
feature_slug: dang-nhap-chon-tu-reui
verdict: REJECT
failed_evals: ["E1b","E5","E2","E4b","E7","E3","E6","E4"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 1b0abcf6ca6037c13d7e86a869203086f6cf122c
human_signoff:
---

# Evidence Report: dang-nhap-chon-tu-reui

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | ui-check | PASS |
| E1b | AC-1 | test | FAIL |
| E2 | AC-2 | test | FAIL |
| E3 | AC-3 | test | FAIL |
| E4 | AC-4 | ui-check | FAIL |
| E4b | AC-4 | test | FAIL |
| E5 | AC-5 | test | FAIL |
| E6 | AC-6 | test | FAIL |
| E7 | AC-7 | test | FAIL |
| E8 | AC-7 | script | PASS |

## Evidence

- eval: E1
  run_id: minted-dang-nhap-chon-tu-reui-E1-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.ui
  verified_at: 2026-11-14T06:31:37Z
  screenshot: evidence/E1-step1.png
  observed: |
    E1-step1.png (1440x900, light): the "OneHub" mark and text sit top centre. Below, with no card or border, one narrow centred column holds the h1 "Đăng nhập" and the lead "Nhận mã qua email để vào sàn của bạn." Then comes the label "Email" and a field with a mail icon holding nhan-vien@example.test. The hint "Email bạn dùng ở sàn. Mã sẽ gửi tới hộp thư này." is under the field. The full-width blue "Gửi mã →" button follows, and the footer "© 2026 OneHub" is at the bottom centre. There is no Google, Apple or GitHub button. I opened the reference a-auth-15-1440-sang.png too: same layout. The reference has no visible Email label and a slightly narrower column. The Next.js dev "N" badge at bottom left comes from dev mode.
  network_observed: clean

- eval: E1b
  run_id: minted-dang-nhap-chon-tu-reui-E1b-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: make e2e. Cả bộ Playwright dừng lỗi: 38 passed, 562 skipped, 270 did not run (5.3m).
    Nhiều bài tests/e2e/sheet.spec.ts, shell.spec.ts, sua-tren-o.spec.ts ở khổ 1440 đỏ.
    Ca 'dang-cua-khoi' và 'khong-dang-nhap-ngoai' không được chứng minh xanh ở bốn khổ.

- eval: E2
  run_id: minted-dang-nhap-chon-tu-reui-E2-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: make test. Test Files 3 failed | 94 passed (97); Tests 7 failed | 1699 passed (1706).
    tools/proof_gate/proof-gate.test.ts:792 «lưới xanh trên chính kho»: stderr có "proof-gate: 2 lỗi — mẫu tệp chứng minh: tools/proof_gate/khuon-chung-minh.md".
    tools/proof_gate/proof-gate.test.ts:809 «thêm vòng implemented khai Bảng hàng mà thiếu chứng minh thì đỏ» đỏ ngay ở bước đầu.

- eval: E3
  run_id: minted-dang-nhap-chon-tu-reui-E3-r1
  exit_code: 1
  baseline: red
  verifier: config:executors.script.dang_nhap_1p_e2e
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: DB_LANE=h DB_PORT=5567 npx playwright test -c playwright.db.config.ts. 4 passed, 59 skipped, 344 did not run (4.3m).
    Hai bước dựng phiên [phien] phien.setup.ts và [vai] vai.setup.ts đỏ, nên các bài phụ thuộc không chạy.
    login.spec.ts và va-dang-nhap.spec.ts ở khổ 1440 cùng nằm trong danh sách đỏ hoặc không chạy.

- eval: E4
  run_id: minted-dang-nhap-chon-tu-reui-E4-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui
  verified_at: 2026-11-14T06:31:37Z
  screenshot: evidence/E4-step1.png
  observed: |
    Seven frames at 1440x900, light theme, all read. Every frame has the OneHub logo mark and wordmark centred at the top (x=670, y=40). In every frame one narrow centred column (x=528, w=384, centred on 1440) holds the "Đăng nhập" heading, the lead line and the step content, with no frame box. The footer "© 2026 OneHub" is centred at the bottom (y=844) in every frame. The measurements are in E4-metrics.txt. Per frame: (1) code step after "Gửi mã": confirmation line, "Mã đăng nhập" field in focus, hint, "Đăng nhập" button, links "Gửi mã mới" and "Dùng email khác". (2) wrong code: red field and label and the line "Mã không đúng hoặc đã hết hạn. Gõ lại, hoặc bấm «Gửi mã mới»." (3) too many requests: email field and red "Đã xin mã quá nhiều lần. Thử lại sau 15 phút." with the "Gửi mã →" button. (4) choose a company: "Bạn thuộc nhiều sàn…" with buttons [Sàn A] and [Sàn B]. (5) not in any company: "Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn." with the "Dùng email khác" button. (6) session with no company: "Tài khoản của bạn không còn thuộc sàn nào…" with the "Đăng xuất" button. (7) server error, no database: red "Chưa gửi được yêu cầu. Máy chủ đang gặp lỗi…" and the "Thử lại" button. The Next.js dev-tools badge at bottom left is dev tooling, not the page. All seven frames match Expected (steps 1-6 via the lane H browser run, step 7 via a dev server with no database).
  network_observed: app-fail
  note: Mọi khẳng định thị giác đạt. Eval bị tính đỏ chỉ vì luật mạng — bước 7 cố ý gây lỗi máy chủ trên gốc ứng dụng để hiện trạng thái server-error, Expected không khai mã đó. Người quyết ở Cổng 2 xét đây có phải dương tính giả không; số thô nằm trong evidence/E4-network.txt.

- eval: E4b
  run_id: minted-dang-nhap-chon-tu-reui-E4b-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: make test (cùng lần chạy với E2). 7 bài đỏ trong 3 tệp, đều thuộc tools/proof_gate.
    Ca 'giu-cau-copy' không có dòng đỏ riêng trong phần đuôi đã giữ; cả lệnh dừng lỗi nên eval không đạt.

- eval: E5
  run_id: minted-dang-nhap-chon-tu-reui-E5-r1
  exit_code: 2
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: make e2e (cùng lần chạy với E1b). 38 passed, 562 skipped, 270 did not run (5.3m).
    Bộ chạy dừng lỗi nên 'khong-cuon-ngang', 'nut-trong-man-dau', 'logo-doc-duoc-nen-toi', 'axe-dang-nhap' không được chứng minh xanh ở bốn khổ, sáng và tối.

- eval: E6
  run_id: minted-dang-nhap-chon-tu-reui-E6-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: make check. Dừng ở bước make test: Test Files 3 failed | 94 passed (97); Tests 7 failed | 1699 passed (1706).
    Nguyên nhân cùng gốc với E2 và E7: tools/proof_gate/proof-gate.test.ts:792 báo "proof-gate: 2 lỗi — mẫu tệp chứng minh: tools/proof_gate/khuon-chung-minh.md".

- eval: E7
  run_id: minted-dang-nhap-chon-tu-reui-E7-r1
  exit_code: 2
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:31:37Z
  output: |
    Lệnh: make test (cùng lần chạy với E2). Lưới chứng minh màn (tools/proof_gate) báo 2 lỗi trên chính kho, nên không đạt điều kiện «không báo mã nào».
    Đỏ tại tools/proof_gate/proof-gate.test.ts:792 và :809.

- eval: E8
  run_id: minted-dang-nhap-chon-tu-reui-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T06:31:37Z
  output: |
    2 tệp giao diện ngoài bản đồ
    Bước chấm khuôn không in dòng «lệch:» nào.

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dang-nhap-chon-tu-reui-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-14T06:31:37Z

Lệnh đỏ không gắn eval: không có. Mọi lệnh đỏ đều đã gắn eval ở trên (make e2e cho E1b và E5; make test cho E2, E4b và E7; lệnh Playwright làn H cho E3; make check cho E6; ui-check:E4 cho E4).

## Known limits

## Ngoài hợp đồng

## Analyst

E8 — pass trên cả HEAD lẫn baseline (lệnh chấm khuôn, hồi quy có chủ ý hoặc cần viết lại để khẳng định hành vi mới của nhóm dang-nhap). Chưa xác nhận là regression-guard có chủ ý.

## Variance

none — mọi eval chạy một lần, kết quả đồng nhất

## Iterations

Round 1: E1b, E5, E2, E4b, E7, E3, E6, E4 failed — make e2e dừng lỗi (E1b, E5); make test đỏ 7 bài ở tools/proof_gate (E2, E4b, E7, E6); bộ Playwright làn H đỏ ở hai bước dựng phiên (E3); E4 đỏ vì luật mạng ở bước 7 cố ý gây lỗi máy chủ. Returned to implementation.
