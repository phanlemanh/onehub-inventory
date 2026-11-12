---
schema_version: 2
feature_slug: bo-nut-theo-quyen
verdict: PASS
failed_evals: []
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: df2561e7183a5d5f787ab7c01ead0f43aba75ae9
human_signoff: Manh Phan 2026-11-13
---

# Evidence Report: bo-nut-theo-quyen

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | judgment | PASS (người chốt) |
| E2 | AC-2 | script | PASS |
| E3 | AC-3 | script | PASS |
| E4 | AC-3 | script | PASS |
| E5 | AC-4 | script | PASS |
| E6 | AC-5 | script | PASS |
| E7 | AC-6 | script | PASS |
| E8 | AC-7 | script | PASS |
| E9 | AC-8 | script | PASS |
| E10 | AC-9 | script | PASS (carry-forward từ round 1) |
| E11 | AC-10 | script | PASS |
| E12 | AC-10 | ui-check | PASS |
| E13 | AC-6 | judgment | PASS (người chốt) |
| E14 | AC-10 | script | PASS (carry-forward từ round 1) |
| E15 | AC-1 | script | PASS |

## Evidence

- eval: E2
  run_id: minted-bo-nut-theo-quyen-E2-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_unit
  verified_at: 2026-11-12T16:49:25Z
  output: |
    npx vitest run src/modules/identity/permitted-action.test.tsx src/components/candidate/row-actions.test.tsx src/modules/identity/permissions.test.ts (một lần chạy chung với E5, E6)

- eval: E5
  run_id: minted-bo-nut-theo-quyen-E5-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_unit
  verified_at: 2026-11-12T16:49:25Z
  output: |
    cùng lần chạy vitest với E2 và E6

- eval: E6
  run_id: minted-bo-nut-theo-quyen-E6-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_unit
  verified_at: 2026-11-12T16:49:25Z
  output: |
    cùng lần chạy vitest với E2 và E5

- eval: E3
  run_id: minted-bo-nut-theo-quyen-E3-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_kiem
  verified_at: 2026-11-12T16:49:25Z
  output: |
    npx vitest run tests/bo-nut-kiem.test.ts

- eval: E4
  run_id: minted-bo-nut-theo-quyen-E4-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.check
  verified_at: 2026-11-12T16:49:25Z
  output: |
    make check
    CODEOWNERS matches governance/autonomy.yaml

- eval: E7
  run_id: minted-bo-nut-theo-quyen-E7-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e_db
  verified_at: 2026-11-12T16:49:25Z
  output: |
    9 passed (29.6s)

- eval: E8
  run_id: minted-bo-nut-theo-quyen-E8-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e_db
  verified_at: 2026-11-12T16:49:25Z
  output: |
    9 passed (29.6s), cùng lần chạy với E7

- eval: E9
  run_id: minted-bo-nut-theo-quyen-E9-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bang_quyen_unit
  verified_at: 2026-11-12T16:49:25Z
  output: |
    npx vitest run src/modules/identity/permissions.test.ts src/modules/identity/permission-table.test.ts

- eval: E10
  run_id: minted-bo-nut-theo-quyen-E10-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_vai_man
  verified_at: 2026-11-12T16:37:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E11
  run_id: minted-bo-nut-theo-quyen-E11-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.script.bo_nut_e2e
  verified_at: 2026-11-12T16:49:25Z
  output: |
    21 passed (14.7s)

- eval: E12
  run_id: E12-verify-1
  exit_code: 0
  baseline: n-a
  verifier: config:capture.ui
  verified_at: 2026-11-12T16:49:25Z
  screenshot: evidence/E12-listings-ListAgent-1440-sang.png
  observed: |
    I opened frames with Read and checked the menu text for all 32 pages by script.
    - listings-ListAgent-1440-sang-minh: title «Bảng hàng · Đầu chủ", blue «Thêm căn" at top right beside the title. Row 1 is "Tôi". Its «…" menu shows «Sửa", a separator, then «Xoá căn" in red. Every row has a «…" at the end. This matches the expectation.
    - listings-BuyerAgent-1440-toi-nguoikhac (dark): «Thêm căn" present. The [Tên] 03 row menu has only «Sửa". Matches.
    - listings-TeamLead-360-sang-nguoikhac: the [Tên] row menu shows «Sửa", separator, red «Xoá căn". Matches, because TeamLead is like ListAgent on every row.
    - listings-CompanyAdmin-360-toi: the heading «Bạn chưa có quyền xem vùng này" with an explanation, and no «Thêm" or «…". Matches.
    - contacts-ListAgent-360-sang: «Thêm liên hệ" present. «…" appears only on rows 1, 3, 4, 6 and 7 (the "Tôi" rows). Rows 2, 5 and 8 have none. Matches.
    - contacts-ListAgent-1440-toi-minh: the menu is «Sửa", a separator, red «Xoá liên hệ". The rows by [Tên] 03, 06 and 09 have no «…". Matches.
    - contacts-TeamLead-360-toi-nguoikhac: «…" on all 8 rows. The menu on row 2 has «Sửa", «Gộp với liên hệ khác…", a separator, and red «Xoá liên hệ" and «Xoá tên và số theo yêu cầu". Matches.
    - The remaining frames I did not open one by one were checked through the menu item text captured from the DOM for every page, and all match.
  network_observed: clean

- eval: E14
  run_id: minted-bo-nut-theo-quyen-E14-r1
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T16:37:40Z
  carried_from_round: 1
  output: |
    carry-forward tu round 1 — delta khong cham paths cua eval

- eval: E15
  run_id: minted-bo-nut-theo-quyen-E15-r2
  exit_code: 0
  baseline: n-a
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T16:49:25Z
  output: |
    design-floor-s4.mjs --root . không in dòng lỗi nào

### Lệnh suite (hồi quy)

- cmd: npm run build
  run_id: minted-bo-nut-theo-quyen-SUITE-build-r2
  exit_code: 0
  verified_at: 2026-11-12T16:49:25Z

- cmd: make e2e
  run_id: minted-bo-nut-theo-quyen-SUITE-make_e2e-r2
  exit_code: 0
  verified_at: 2026-11-12T16:49:25Z

### Judge panels (đề xuất, chờ người chốt)

- eval: E1
  judged_by: judge panel (3 lens), đề xuất PASS
  rationale: Mục «Bộ nút theo quyền» trong behaviors.md (dòng 34-59) có đủ bốn chỗ đặt cho máy tính và điện thoại, thứ tự trong «…», cách xử nút không quyền, khớp các dòng gate1 không bị lật. Chỉ thiếu ý nhỏ «Ngừng bán là đổi trạng thái qua Sửa», nằm ngoài các điều câu hỏi liệt kê.
  votes:
    - domain-correctness: PASS — khớp H1, C, R1, O1, X1 và các sửa S2/S3; chỉ thiếu một ý nhỏ không lệch lựa chọn nào.
    - operational-feasibility: PASS — đủ bốn chỗ đặt, thứ tự trong «…» và cách xử nút không quyền (ẩn, không nút mờ, 403 có câu riêng).
    - spec-alignment: PASS — khớp d-17, d-18, d-5, d-6, d-7 và d-26; chỉ thiếu một điều nhỏ ngoài phạm vi câu hỏi.
  human_override: "Đạt — Manh Phan 2026-11-13"

- eval: E13
  judged_by: judge panel (3 lens), đề xuất PASS
  rationale: Cả bốn ảnh hiện đúng câu «Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.» bằng chữ đỏ riêng, đọc rõ ở nền sáng lẫn tối.
  votes:
    - domain-correctness: PASS — câu riêng về quyền, không phải câu lỗi chung, đọc rõ ở cả hai chế độ màu.
    - operational-feasibility: PASS — câu nằm riêng trong hộp, tương phản đủ, không bị cắt hay che; ảnh không có câu lỗi chung để đối chiếu.
    - spec-alignment: PASS — chữ đỏ đặt riêng phía trên nút «Thôi», là câu riêng cho trường hợp thiếu quyền.
  human_override: "Đạt — Manh Phan 2026-11-13"

## Known limits

- Known limits — chọn ở Cổng Bằng chứng 2026-11-13:
  - Ngoài-1: Hai dòng sổ quyết định của vòng từng sai cú pháp; đã sửa, chữ giữ nguyên.
  - Ngoài-2: Dòng sổ quyết định 33 từng sai cú pháp; đã sửa, chữ giữ nguyên.
  - Ngoài-3: Bài kiểm mục Thành viên trên thanh bên dựng lại mục bằng cách đọc mã thay vì lấy mục thật, nên kém nhạy khi đổi cách khai mục.
  - Ngoài-4: Màn nào quên khai bản ghi là của ai thì nút việc «của tôi» hiện cả trên bản ghi người khác; máy chủ vẫn từ chối.
  - Ngoài-5: Trang mẫu bộ nút dùng tên trường chuẩn RESO cho nghĩa khác (người giữ, người tạo).
  - Ngoài-6: Trang mẫu bộ nút giữ bản riêng danh sách bốn vai, có thể cũ khi vai đổi.
  - Ngoài-7: Bài kiểm chỉ đo nút chính của hồ sơ biến mất khi không quyền, chưa đo nó hiện khi có quyền.
  - Ngoài-8: Bài kiểm chưa đo việc ai cũng làm được vẫn còn trong «…» trên bản ghi người khác.
  - Ngoài-9: Bài kiểm vai không được xem chỉ đo không có «…», chưa đo câu «không đủ quyền» hiện ra.
  - Ngoài-10: Bài kiểm mục Thành viên dựng lại mục thanh bên từ mã nguồn thay vì mục thật.
  - Ngoài-11: Bài kiểm câu từ chối so với câu lỗi chung viết tay, nên đổi chữ câu lỗi chung thì bài cần sửa một dòng.

## Ngoài hợp đồng

## Analyst

carried tu round 1 — baseline khong do lai round nay

Baseline khong do: toan bo eval round nay (evals.yaml khong doi tu lan baseline cuoi, round 1); field baseline cua tung block ghi n-a.

Eval không-phân-biệt (xanh cả trên HEAD lẫn baseline, cần viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý): E4 (make check), E9 (permissions.test.ts và permission-table.test.ts), E14 (design-floor-khuon.mjs --kiem), E15 (design-floor-s4.mjs).

## Variance

none — every multi-run eval is uniform

## Iterations

Round 1: bản ghi S4 round 1 ở trạng thái PENDING-JUDGMENT với một finding trong hợp đồng (AC-3: menu, thao tác dòng và thanh bên phải gọi tên việc theo kiểu của bảng quyền). Đã sửa ở commit df2561e, trả về để chạy lại.
Round 2: mọi eval máy xanh, E10 và E14 mang từ round 1 (delta không chạm paths); E1 và E13 chờ người chốt ở Cổng 2; còn ba finding ngoài hợp đồng trong review-findings.md.
