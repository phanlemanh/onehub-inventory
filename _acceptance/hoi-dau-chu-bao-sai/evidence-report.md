---
schema_version: 2
feature_slug: hoi-dau-chu-bao-sai
verdict: REJECT
failed_evals: ["E9b"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: e3e337b914f1bfdd89376b071d37c7bd924b1069
human_signoff:
---

# Evidence Report: hoi-dau-chu-bao-sai

Vòng 4. Lệnh thất bại gắn eval: ui-check:E9b (eval E9b). Không có lệnh thất bại nào không gắn eval.

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS (carry-forward từ round 3) |
| E2 | AC-2 | test | PASS (carry-forward từ round 3) |
| E2b | AC-2 | script | PASS (carry-forward từ round 3) |
| E3 | AC-3 | test | PASS (carry-forward từ round 2) |
| E4 | AC-4 | test | PASS (carry-forward từ round 3) |
| E5 | AC-5 | test | PASS (carry-forward từ round 3) |
| E5b | AC-5 | script | PASS (carry-forward từ round 3) |
| E6 | AC-6 | test | PASS (carry-forward từ round 3) |
| E7 | AC-7 | test | PASS (carry-forward từ round 3) |
| E8 | AC-8 | script | PASS (carry-forward từ round 3) |
| E8b | AC-8 | test | PASS (carry-forward từ round 3) |
| E9 | AC-9 | script | PASS (carry-forward từ round 3) |
| E9b | AC-9 | ui-check | FAIL |
| E9c | AC-9 | judgment | đề xuất PASS (panel giữ nguyên từ round 3, chờ người chốt) |
| E10 | AC-9 | script | PASS (carry-forward từ round 3) |
| E11 | AC-9 | script | PASS (carry-forward từ round 3) |
| E12 | AC-10 | script | PASS (carry-forward từ round 3) |

## Evidence

- eval: E9b
  run_id: minted-hoi-dau-chu-bao-sai-E9b-r4
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-13T15:18:22Z
  runs: 1
  passes: 0
  screenshot: evidence/E9b-hoi-1440-light.png
  observed: |
    hoi-* (8 khung): hồ sơ (panel bên ở 1440 và 1024, toàn màn ở 414 và 360) có thanh đáy dưới một đường kẻ; nút rộng hết bề ngang, xanh (sáng) hoặc xanh nhạt (tối), chữ «Hỏi đầu chủ · [Tên] 03», dính đáy. Thân hồ sơ phía trên (1101 · S1.01, giá, trạng thái, thông tin, liên kết «Báo sai thông tin») kết thúc trước thanh, không chồng chữ.
    chua-ai-giu 1440 và 360 (sáng): hồ sơ 1603 · S1.01, thanh đáy có nút tắt mờ «Căn chưa có đầu chủ giữ». minh-giu 1440 (sáng): hồ sơ 0905, không có thanh và không có nút hỏi (căn của chính người xem).
    bao-sai-* (8 khung): hộp «Báo sai thông tin căn 1101», chọn «Căn», gợi ý «Đang hiện: 1101», ô «Giá trị đúng» = 72 m², «Ghi chú căn cứ», nút «Thôi» và «Chép và mở bảng chia sẻ»; ở 1440 và 1024 là hộp giữa màn, ở 414 và 360 là tấm trong panel với nút xếp dọc; không bị cắt, cả sáng lẫn tối (khung bao-sai-360-dark chụp lại sau lượt chạy lại).
    hoi-loi 1440 và 360, sáng và tối: dưới nút hỏi có dòng lỗi đỏ «Máy này không chép hay chia sẻ được. Chép tay tin dưới đây rồi gửi.» và ô chứa nguyên tin («Hỏi về căn 1101 · S1.01» cùng đường dẫn đầy đủ), xuống dòng, không bị cắt, có tay kéo co giãn (ô chỉ đọc). bao-sai-loi 1440 và 360, sáng và tối: cùng câu lỗi và ô chứa đủ 6 dòng tin báo sai, không bị cắt; ở 360 hộp cao kín màn, nút xếp dọc bên dưới.
    dau-ho-so-* (8 khung): đầu hồ sơ 1603 hai dòng (tên ở dòng 1; nút liên kết, «Trước», «Sau», «Đóng» ở dòng 2), không bị ép, sáng và tối ở cả 4 khổ; đây là khung chưa đăng nhập nên không có thanh đáy và liên kết báo sai, đúng với bài thử đầu hồ sơ.
    Tổng: mọi khung khớp Expected; chỗ thất bại duy nhất là bài axe không ổn định, mô tả ở output.
  network_observed: n-a (driver)
  output: |
    Bước 1 (spec DB, làn V, container chạy): 20 đạt, 19 bỏ qua, 1 thất bại. Thất bại: [360] bài axe E9 ở dòng 351 của spec, «report dark» mong [] nhưng nhận ["color-contrast"] (hộp báo sai, tối, 360). Khung bao-sai-360-dark.png KHÔNG được ghi lại trong lượt đó (dấu thời gian 21:09, cũ). Chạy lại riêng bài đó (-g axe --project=360) thì đạt và khung được ghi lại. Nên lỗi là chập chờn, không ổn định. Vì lệnh quy định đã thất bại một lần, eval ghi thất bại: phép khẳng định không tất định, cần sửa hoặc thêm chờ trước khi quét axe (nhiều khả năng hộp còn đang chạy hiệu ứng hoặc lớp phủ còn đang hoà màu).
    Bước 2 (ho-so-can «hai dòng»): 16 đạt.
    Bước 3: 35 khung chép vào _acceptance/hoi-dau-chu-bao-sai/evidence/ với tiền tố E9b-, mỗi khung đã mở bằng Read. Gồm hoi-{1440,1024,414,360}-{sáng,tối} (8); bao-sai-{4 khổ}-{sáng,tối} (8); hoi-loi-{1440,360}-{sáng,tối} (4); bao-sai-loi-{1440,360}-{sáng,tối} (4); chua-ai-giu-{1440,360}-sáng (2); minh-giu-1440-sáng (1); dau-ho-so-{4 khổ}-{sáng,tối} (8); thêm E9b-network.txt.
    Kiểm: thanh đáy với nút hỏi dính đáy, không chồng chữ, 4 khổ sáng và tối: đạt. Căn chưa ai giữ có nút tắt «Căn chưa có đầu chủ giữ»: đạt. Hộp báo sai 1440 và 360 có «Đang hiện: 1101»: đạt. Khung lỗi chép: nguyên tin hiện đủ, không cắt; khả năng bôi chọn không chứng minh được từ ảnh tĩnh, ô trông là vùng văn bản chỉ đọc. Nhãn: «Báo sai thông tin» 17 ký tự, «Hỏi đầu chủ» 11 ký tự, đều trong trần 17; nhãn ghép «Hỏi đầu chủ · [Tên] 03» là câu chữ ngoài trần như Expected nói. Không khung nào mâu thuẫn Expected. Độ ổn định bài thử: thất bại (một lần axe tương phản chập chờn ở 360 tối).

- eval: E1
  run_id: minted-hoi-dau-chu-bao-sai-E1-r3
  exit_code: 0
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E2
  run_id: minted-hoi-dau-chu-bao-sai-E2-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E2b
  run_id: minted-hoi-dau-chu-bao-sai-E2b-r3
  exit_code: 0
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E3
  run_id: minted-hoi-dau-chu-bao-sai-E3-r2
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T11:43:59Z
  carried_from_round: 2
  # carry-forward từ round 2 — delta không chạm paths của eval

- eval: E4
  run_id: minted-hoi-dau-chu-bao-sai-E4-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E5
  run_id: minted-hoi-dau-chu-bao-sai-E5-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E5b
  run_id: minted-hoi-dau-chu-bao-sai-E5b-r3
  exit_code: 0
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E6
  run_id: minted-hoi-dau-chu-bao-sai-E6-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E7
  run_id: minted-hoi-dau-chu-bao-sai-E7-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E8
  run_id: minted-hoi-dau-chu-bao-sai-E8-r3
  exit_code: 0
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E8b
  run_id: minted-hoi-dau-chu-bao-sai-E8b-r3
  exit_code: 0
  verifier: config:executors.test.unit
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E9
  run_id: minted-hoi-dau-chu-bao-sai-E9-r3
  exit_code: 0
  verifier: config:executors.script.hoi_dau_chu_e2e_db
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval. Lưu ý: lượt chạy round 4 của cùng spec có một lần axe tương phản chập chờn ở 360 tối (xem E9b); người xem xét ở Cổng 2.

- eval: E10
  run_id: minted-hoi-dau-chu-bao-sai-E10-r3
  exit_code: 0
  verifier: config:executors.design.floor
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E11
  run_id: minted-hoi-dau-chu-bao-sai-E11-r3
  exit_code: 0
  verifier: config:executors.design.khuon
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

- eval: E12
  run_id: minted-hoi-dau-chu-bao-sai-E12-r3
  exit_code: 0
  verifier: config:executors.script.e2e
  verified_at: 2026-11-13T14:06:43Z
  carried_from_round: 3
  # carry-forward từ round 3 — delta không chạm paths của eval

### Judgment

- eval: E9c
  judged_by: hội đồng ba góc nhìn (panel giữ nguyên từ round 3 — inputs không đổi, không chấm lại; rationale xem round 3)
  proposal: PASS
  votes:
    - domain-correctness: PASS (r3)
    - operational-feasibility: PASS (r3)
    - spec-alignment: PASS (r3)
  human_override:  # chi nguoi ghi

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_check-r4
  exit_code: 0
  verified_at: 2026-11-13T15:18:22Z

- cmd: npm run build
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-build-r4
  exit_code: 0
  verified_at: 2026-11-13T15:18:22Z

- cmd: make e2e
  run_id: minted-hoi-dau-chu-bao-sai-SUITE-make_e2e-r4
  exit_code: 0
  verified_at: 2026-11-13T15:18:22Z

## Known limits

## Ngoài hợp đồng

## Analyst

none — mọi eval feature đều red trên baseline (có phân biệt)

Baseline không đo: E9b (n-a, lượt ui-check chạy Playwright trên cây hiện tại, không chạy lại trên diffBase).

## Variance

none — mọi eval nhiều lượt đều đồng nhất. Ghi chú: E9b chạy một lượt, và bài axe E9 ở 360 tối chập chờn trong lượt đó (đã chạy lại riêng thì đạt); đó là nguyên nhân thất bại của E9b, cần sửa hoặc thêm chờ trước khi quét.

## Iterations

Round 2: REJECT do một bài ⌘K chập chờn đã biết (theo lịch sử commit); đã sửa bằng chờ ô tìm kiếm gắn bộ nghe phím.
Round 3: bằng chứng S4 vòng 3, chạm trần số vòng cho phép; chỉnh câu chữ E9b khớp AC-9.
Round 4: E9b thất bại — bài axe tương phản ở hộp báo sai, tối, 360 chập chờn một lần trong lượt chạy theo lệnh quy định (đạt khi chạy lại riêng). Trả về triển khai: làm bài ổn định (chờ hộp hết hiệu ứng trước khi quét).
