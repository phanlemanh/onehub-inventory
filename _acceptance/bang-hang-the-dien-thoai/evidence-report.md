---
schema_version: 2
feature_slug: bang-hang-the-dien-thoai
verdict: PASS
failed_evals: []
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: af334f969b261d075b242c8c3de66171767690f5
human_signoff:
---

# Evidence Report: bang-hang-the-dien-thoai

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-4 | test | PASS |
| E5 | AC-5 | test | PASS |
| E6 | AC-6 | test | PASS |
| E7 | AC-7 | test | PASS |
| E8 | AC-8 | script | PASS |
| E9 | AC-9 | script | PASS |
| E10 | AC-10 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |
| E11 | AC-1 | ui-check | PASS |
| E12 | AC-10 | script | PASS |
| E13 | AC-8 | test | PASS |
| E14 | AC-11 | test | PASS |
| E15 | AC-12 | script | PASS |
| E16 | AC-12 | judgment | PASS (đề xuất của hội đồng, chờ người chốt) |

## Evidence

- eval: E1
  run_id: minted-bang-hang-the-dien-thoai-E1-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E4
  run_id: minted-bang-hang-the-dien-thoai-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E5
  run_id: minted-bang-hang-the-dien-thoai-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E6
  run_id: minted-bang-hang-the-dien-thoai-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E7
  run_id: minted-bang-hang-the-dien-thoai-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E13
  run_id: minted-bang-hang-the-dien-thoai-E13-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E14
  run_id: minted-bang-hang-the-dien-thoai-E14-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.test.the_dien_thoai
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx vitest run tests/the-dien-thoai.test.tsx --coverage.enabled=false --reporter=verbose
    lệnh kết thúc thành công, mã trả về 0

- eval: E2
  run_id: minted-bang-hang-the-dien-thoai-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.the_dien_thoai_e2e
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx playwright test tests/e2e/the-dien-thoai.spec.ts
    31 passed (38.7s)

- eval: E3
  run_id: minted-bang-hang-the-dien-thoai-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.the_dien_thoai_e2e
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx playwright test tests/e2e/the-dien-thoai.spec.ts
    31 passed (38.7s)

- eval: E8
  run_id: minted-bang-hang-the-dien-thoai-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.the_dien_thoai_e2e
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx playwright test tests/e2e/the-dien-thoai.spec.ts
    31 passed (38.7s)

- eval: E9
  run_id: minted-bang-hang-the-dien-thoai-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.the_dien_thoai_e2e
  verified_at: 2026-11-14T16:31:26Z
  output: |
    npx playwright test tests/e2e/the-dien-thoai.spec.ts
    31 passed (38.7s)

- eval: E12
  run_id: minted-bang-hang-the-dien-thoai-E12-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-14T16:31:26Z
  output: |
    node design-floor-khuon.mjs --kiem --root .
    9 tệp giao diện ngoài bản đồ

- eval: E15
  run_id: minted-bang-hang-the-dien-thoai-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.e2e
  verified_at: 2026-11-14T16:31:26Z
  output: |
    make e2e
    1182 passed (9.0m)

- eval: E11
  run_id: minted-bang-hang-the-dien-thoai-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.ui_check
  verified_at: 2026-11-14T16:31:26Z
  screenshot: evidence/E11-the-360-sang.png
  observed: |
    E11-the-360-sang.png: header 'Bảng hàng', '60 dòng', list of cards; each card has block tile (S1.01), unit code (0905, 1101...) in bold, price right (5,71 tỷ), status pill (Đang giao dịch blue, Đang bán green, Chưa đủ để rao orange), subline with project, area and bedrooms. Legible. E11-the-360-toi.png: same cards on dark background, text white, pills (purple/green/amber) clearly readable. E11-the-414-sang.png: same card list, wider, project name less truncated, code/price/status all readable. E11-ho-so-360-sang.png: full-screen record titled '0801 · S1.02', price 4,07 tỷ, status Đang bán, Trước/Sau/Đóng controls, details sections (Căn, Lần chào đang mở) — the unit just tapped (0801). E11-lui-360-sang.png: back on /inventory, scrolled list shows the same cards (0701, 0801 highlighted, 1201, 1204, 1505, 1606, 0601, 0605) with code, price, status. E11-bang-768-sang.png: sidebar plus a real data table with columns # / Căn / Toà / Dự án, filter inputs, rows 0905..0606, toolbar Nhóm theo Toà / Cột / Toàn màn hình — still a table. All match Expected.
  network_observed: clean

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-the-dien-thoai-SUITE-make_check-r2
  exit_code: 0
  verified_at: 2026-11-14T16:31:26Z

- cmd: npm run build
  run_id: minted-bang-hang-the-dien-thoai-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-14T16:31:26Z

## Known limits

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Eval không phân biệt (xanh cả trên bản cũ lẫn bản mới, theo kết quả đo ở round 1): E12 (lệnh kiểm khuôn Lưới). Đây là bảo vệ chống hồi quy có chủ ý; không cần viết lại. Mọi eval khác ghi baseline n-a vì round này không đo lại.

Lệnh suite xanh là bảo vệ hồi quy bình thường, không liệt kê.

## Variance

none — every multi-run eval is uniform

## Hội đồng chấm (đề xuất — để trống human_override cho người chốt ở Cổng 2)

- eval: E10
  judged_by: judge panel (fresh context), đề xuất PASS
  - domain-correctness: PASS — Cả năm điểm đều đúng trong các tệp được giao. Mục «Danh sách thẻ điện thoại» của behaviors.md ghi dưới 768 là thẻ, từ 768 là bảng, chạm thẻ mở hồ sơ toàn màn, đóng hay lùi giữ chỗ cuộn và trả tiêu điểm về thẻ. luoi.md nói thân vùng trên điện thoại là danh sách thẻ, lọc bằng nút «Lọc (n)» mở ngăn đáy, không có câu nào nói điện thoại vẫn là bảng cuộn ngang. so-khoi.yaml có đúng một dòng PhoneList với nhu_cau danh-sach-the-dien-thoai, nguon filter-sidebar-5, ho_so bang-hang-the-dien-thoai, không nhu_cau nào trùng. log.md dòng 10 ngày 2026-11-14 nói Bảng hàng trên điện thoại thành danh sách thẻ căn (hàng 2b). listing.md có đoạn «Hàng 2b» nói dưới 768 px Bảng hàng hiện thẻ căn.
  - operational-feasibility: PASS — Cả năm ý đều đúng với các tệp đã đọc: behaviors.md (dưới 768 là thẻ, từ 768 là bảng, giữ chỗ cuộn và trả tiêu điểm), luoi.md dòng 30-33 (lọc ở ngăn Lọc mở từ nút «Lọc (n)», không có hàng ô lọc luôn hiện trên điện thoại; «cuộn ngang» chỉ còn ở behaviors.md dòng 15 nói về cột đứng yên của lưới), so-khoi.yaml (đúng một dòng danh-sach-the-dien-thoai, the-can giữ nguyên), wiki/log.md (dòng 2026-11-14, hàng 2b), listing.md dòng 45-46.
  - spec-alignment: PASS — behaviors.md có mục «Danh sách thẻ điện thoại» đúng hành vi; luoi.md nói điện thoại là danh sách thẻ, lọc đúng một cách là nút «Lọc (n)» mở ngăn đáy; so-khoi.yaml có đúng một dòng nhu_cau danh-sach-the-dien-thoai, không trùng; log.md có dòng 2026-11-14 hàng 2b; listing.md có câu «Hàng 2b … dưới 768 px Bảng hàng hiện … thẻ căn» kèm trỏ tới hồ sơ.
  human_override:  # chi nguoi ghi

- eval: E16
  judged_by: judge panel (fresh context), đề xuất PASS
  - domain-correctness: PASS — Bảng có đúng 108 dòng (dòng 14–121), khớp «108 ca đỏ» ở đầu tệp (86 + 22 của bộ bài chung), dòng nào cũng có cột Xử lý lẫn Ca mới. Mọi dòng «không còn áp ở điện thoại» chỉ là phím bảng tính, cột ghim, nút tiêu đề, bề rộng cột, và đều trỏ tới phoneStandIn hoặc phoneStandInBreak; sheet.spec.ts gọi đúng các phép này, phoneStandInBreak gỡ thẻ rồi kỳ vọng ném lỗi có chữ ghim. Lọc, lối tắt trạng thái, Tab, axe, mở hồ sơ và ⌘K đều có dòng «chuyển», mã trong sheet.spec.ts và loi-vao-ho-so.spec.ts đo đúng điều đã ghi; các tệp bài khác nằm ngoài danh sách nên không đối chiếu.
  - operational-feasibility: PASS — Bảng có đúng 108 dòng, khớp số 108 ở đầu tệp, đủ cột Xử lý và Ca mới. Các dòng «không còn áp ở điện thoại» là việc chỉ bảng mới có; mỗi dòng trỏ tới phoneStandIn hoặc phoneStandInBreak, sheet.spec.ts gọi đúng ở các dòng 128, 142, 287, 296, 1089, 1100, 1149, 1157, và hai phép này ném lỗi có tên ca nên không phải bỏ qua trống. Các việc còn làm được ở điện thoại đều có dòng «chuyển» và ca thay đo đúng việc ấy. Chỉ đối chiếu trong bốn tệp được giao; các dòng chuyển thuộc tệp spec khác nằm ngoài danh sách input nên không kiểm.
  - spec-alignment: PASS — Bảng có 108 dòng (dòng 14–121), khớp con số 108 ở đầu tệp (22 + 86), cột Xử lý và Ca mới dòng nào cũng có chữ. Mọi dòng «không còn áp ở điện thoại» trỏ tới phoneStandIn hoặc phoneStandInBreak và sheet.spec.ts gọi đúng các tên đó. Lối tắt trạng thái, lọc, Tab, mở hồ sơ và ⌘K có dòng «chuyển» với nhánh isPhone đo đúng việc; riêng axe không có nhánh isPhone, nó quét trang ở khổ 360/414 nên ghi «quét danh sách thẻ» là suy ra từ cách trang dựng ở khổ ấy, không có khẳng định riêng.
  human_override:  # chi nguoi ghi

## Iterations

Round 1: chấm xong, kết quả ở trạng thái chờ phán quyết (hồ sơ chấm vòng 1, commit a83b893). Quay lại triển khai.
Round 2: toàn bộ eval máy xanh trên commit 360da09 (thẻ mang giá trong tên, ca khổ rộng giữ nghiêm); E10 và E16 hội đồng đề xuất PASS, chờ người chốt ở Cổng 2.

### Re-pin lần 1 — 2026-11-14, do gộp main có hàng 9c (PR #60) trước khi trình Cổng Bằng chứng
run_id: repin-20261114T170708Z-52120
sha: af334f969b261d075b242c8c3de66171767690f5 · suites: 3 lệnh exit 0 · evals: 13/13 eval máy đạt kỳ vọng · ngoài làn máy: E10 (E10 không khai paths), E11, E16 (E16 không khai paths) · diff chạm vật đo ngoài làn máy: E11 — chưa chứng lại, đi vòng S4 delta
