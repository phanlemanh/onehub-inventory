---
schema_version: 2
feature_slug: dang-nhap-chon-tu-reui
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 8f483c908e395d82f5341db4b91b7c56e404dfa4
human_signoff: Manh Phan 2026-11-14
---

# Evidence Report: dang-nhap-chon-tu-reui

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | ui-check | PASS |
| E1b | AC-1 | test | PASS |
| E2 | AC-2 | test | PASS |
| E3 | AC-3 | test | PASS |
| E4 | AC-4 | ui-check | PASS |
| E4c | AC-4 | test | PASS |
| E4b | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-7 | script | PASS |

## Analyst

Eval không phân biệt (xanh cả trên HEAD lẫn baseline — chứng minh harness chứ không phải feature; nên viết lại để assert hành vi mới, hoặc xác nhận là regression-guard có chủ ý):

- make test: E2, E4b, E7
- make check: E6

## Evidence

- eval: E1
  run_id: minted-dang-nhap-chon-tu-reui-E1-r1
  exit_code: 0
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T06:31:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval
  screenshot: evidence/E1-step1.png
  observed: |
    E1-step1.png (1440x900, light): the "OneHub" mark and text sit top centre. Below, with no card or border, one narrow centred column holds the h1 "Đăng nhập" and the lead "Nhận mã qua email để vào sàn của bạn." Then comes the label "Email" and a field with a mail icon holding nhan-vien@example.test. The hint "Email bạn dùng ở sàn. Mã sẽ gửi tới hộp thư này." is under the field. The full-width blue "Gửi mã →" button follows, and the footer "© 2026 OneHub" is at the bottom centre. There is no Google, Apple or GitHub button. I opened the reference a-auth-15-1440-sang.png too: same layout. The reference has no visible Email label and a slightly narrower column. The Next.js dev "N" badge at bottom left comes from dev mode.
  network_observed: clean

- eval: E1b
  run_id: minted-dang-nhap-chon-tu-reui-E1b-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:55:58Z
  output: |
    1038 passed (7.9m)

- eval: E2
  run_id: minted-dang-nhap-chon-tu-reui-E2-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:55:58Z
  output: |
    make test: all unit tests passed

- eval: E3
  run_id: minted-dang-nhap-chon-tu-reui-E3-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.dang_nhap_1p_e2e
  verified_at: 2026-11-14T06:55:58Z
  output: |
    458 passed (8.4m)

- eval: E4
  run_id: e4-20261114-1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T06:55:58Z
  screenshot: evidence/E4-step1.png
  observed: |
    Đã mở từng ảnh bằng Read, khổ 1440x900, nền sáng. Cả sáu ảnh có cùng bố cục: dấu hình + chữ OneHub ở trên cùng giữa (y≈54), tiêu đề «Đăng nhập» và câu dẫn, nội dung bước nằm trong một cột hẹp giữa trang x=528..912 (384px, không khung), chân trang «© 2026 OneHub» ở dưới cùng giữa (y≈851). Số đo cột 528/384 và chân trang y=844 giống nhau ở cả sáu ảnh (E4-metrics-v2.txt).
    Step1 nhập mã: câu «Nếu <email> có tài khoản, mã đã được gửi…», ô «Mã đăng nhập», nút «Đăng nhập», liên kết «Gửi mã mới» và «Dùng email khác», trong cột.
    Step2 mã sai: nhãn và ô đỏ, câu «Mã không đúng hoặc đã hết hạn. Gõ lại, hoặc bấm «Gửi mã mới».», trong cột.
    Step3 xin mã quá nhiều: ô Email có biểu tượng thư, dòng đỏ «Đã xin mã quá nhiều lần. Thử lại sau 15 phút.», nút «Gửi mã →», trong cột.
    Step4 chọn sàn: «Bạn thuộc nhiều sàn. Chọn sàn để làm việc:» và hai nút [Sàn A], [Sàn B], trong cột.
    Step5 chưa thuộc sàn: «Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn.» kèm nút «Dùng email khác», trong cột.
    Step6 phiên không còn sàn: «Tài khoản của bạn không còn thuộc sàn nào. Nhờ quản trị sàn mời lại, hoặc đăng xuất để dùng email khác.» kèm nút «Đăng xuất», trong cột.
    Biểu tượng tròn «N» góc trái dưới là chỉ báo của máy chủ dev Next, không thuộc trang. Không có mâu thuẫn với Expected.
  network_observed: clean

- eval: E4c
  run_id: minted-dang-nhap-chon-tu-reui-E4c-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:55:58Z
  output: |
    1038 passed (7.9m)

- eval: E4b
  run_id: minted-dang-nhap-chon-tu-reui-E4b-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:55:58Z
  output: |
    make test: all unit tests passed

- eval: E5
  run_id: minted-dang-nhap-chon-tu-reui-E5-r2
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T06:55:58Z
  output: |
    1038 passed (7.9m)

- eval: E6
  run_id: minted-dang-nhap-chon-tu-reui-E6-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.script.check
  verified_at: 2026-11-14T06:55:58Z
  output: |
    CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: minted-dang-nhap-chon-tu-reui-E7-r2
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-14T06:55:58Z
  output: |
    make test: all unit tests passed

- eval: E8
  run_id: minted-dang-nhap-chon-tu-reui-E8-r1
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T06:31:37Z
  carried_from_round: 1
  # carry-forward tu round 1 — delta khong cham paths cua eval

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-dang-nhap-chon-tu-reui-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T06:55:58Z

## Known limits

## Ngoài hợp đồng

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (không eval nào có runs > 1)

## Iterations

Round 1: E1 và E8 đạt, được giữ lại (carry-forward) sang round 2.
Round 2: chạy lại E1b, E2, E3, E4, E4c, E4b, E5, E6, E7 và lệnh build — tất cả đạt; verdict PASS.

### Re-pin lần 1 — 2026-11-14, do gộp nhánh chính sau chữ ký
run_id: repin-20261114T095640Z-12823
sha: 92a67f7b4cb62ac90c5f8b364ee7d66388470a0a · suites: 3 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E1, E4

### Re-pin lần 2 — 2026-11-14, do gộp nhánh chính 1226ec5 (3a) sau chữ ký; làn trước đỏ E3 vì Postgres dãy H chưa bật
run_id: repin-20261114T105853Z-14222
sha: 5a86687335f99a5a579867eff191dc3512fb1729 · suites: 3 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E1, E4

### Re-pin lần 3 — 2026-11-14, do gộp nhánh chính f905ded (2e) sau chữ ký
run_id: repin-20261114T120957Z-14226
sha: 8f483c908e395d82f5341db4b91b7c56e404dfa4 · suites: 3 lệnh exit 0 · evals: 9/9 eval máy đạt kỳ vọng · ngoài làn máy: E1, E4
