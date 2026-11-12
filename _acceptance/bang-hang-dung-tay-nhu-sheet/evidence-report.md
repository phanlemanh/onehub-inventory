---
schema_version: 2
feature_slug: bang-hang-dung-tay-nhu-sheet
verdict: REJECT
failed_evals: ["E16"]
reason:
verified_by: fresh-context verification subagent
enforcement_mode: strict
bypass_used: false
verified_commit: 4f28ff7e7f7d9ca3821420c89de3a412c026e43b
human_signoff:
---

# Evidence Report: bang-hang-dung-tay-nhu-sheet

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | script | PASS |
| E2 | AC-2 | script | PASS |
| E3 | AC-2 | test | PASS |
| E4 | AC-3 | test | PASS |
| E5 | AC-4 | test | PASS |
| E6 | AC-4 | test | PASS |
| E7 | AC-5 | test | PASS |
| E8 | AC-6 | test | PASS |
| E9 | AC-6 | script | PASS |
| E10 | AC-7 | test | PASS |
| E11 | AC-7 | script | PASS |
| E12 | AC-8 | test | PASS |
| E13 | AC-8 | script | PASS |
| E14 | AC-9 | script | PASS |
| E15 | AC-9 | script | PASS |
| E16 | AC-10 | ui-check | FAIL |
| E17 | AC-10 | judgment | UNCERTAIN |
| E18 | AC-11 | script | PASS |

Lệnh fail không gắn riêng eval nào: `ui-check:E16` (đã gắn vào E16, xem khối Evidence bên dưới).

## Evidence

- eval: E1
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E1-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:28:50Z
  output: |
    711 passed (6.2m)

- eval: E2
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E2-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:28:50Z
  output: |
    711 passed (6.2m)

- eval: E3
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E3-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E4
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E4-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E5
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E5-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E6
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E6-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E7
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E7-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E8
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E8-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E9
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E9-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:28:50Z
  output: |
    711 passed (6.2m)

- eval: E10
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E10-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E11
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E11-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:28:50Z
  output: |
    711 passed (6.2m)

- eval: E12
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E12-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.test.unit
  verified_at: 2026-11-12T08:28:50Z
  output: |
    make test hoàn tất, không có ca đỏ

- eval: E13
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E13-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.khuon
  verified_at: 2026-11-12T08:28:50Z
  output: |
    13 tệp giao diện ngoài bản đồ

- eval: E14
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E14-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:28:50Z
  output: |
    711 passed (6.2m)

- eval: E15
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E15-r1
  exit_code: 0
  baseline: green
  verifier: config:executors.design.floor
  verified_at: 2026-11-12T08:28:50Z
  output: |
    sàn thiết kế không báo mã màu thô

- eval: E16
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E16-r1
  exit_code: 1
  baseline: n-a
  verifier: config:executors.ui-check
  verified_at: 2026-11-12T08:28:50Z
  screenshot: evidence/E16-step1.png   # chỉ là ô khung đầu; tệp này không tồn tại, khung thật đầu tiên là evidence/E16-step2.png (tới E16-step9.png)
  observed: |
    E16-step2 (lọc, 1440 sáng): trong App Shell, tiêu đề "Bảng hàng"; thanh công cụ có ô tìm "Gõ để tìm", "15 / 60 dòng", "Lọc (2)", "Xoá lọc", "Nhóm theo Toà", "Cột", "Toàn màn hình"; mỗi tiêu đề có một ô lọc, Giá chào chứa "<=5", 15 dòng đều từ 5 tỷ trở xuống. Khớp. E16-step3 (tối): nền gần đen, chữ sáng, cùng 15 dòng. Khớp.
    E16-step4 và step5 (nhóm theo Toà, 1440 sáng và tối): dòng nhóm "[MAU] Toà C1" và "[MAU] Toà E1" kèm "12 dòng"; thanh công cụ còn ô tìm, số dòng, Lọc, Nhóm, Cột. Khớp. E16-step7 (414 sáng) và step8 (360 tối): thanh công cụ xuống dòng, lưới cuộn ngang trong vùng, trang không cuộn ngang, có ô lọc và dòng nhóm; nút "Lọc (n)" và "Xoá lọc" vắng vì chưa gõ giá trị lọc, đúng với các bước. E16-step9 (360 sáng, menu Cột): "Hiện cột" liệt kê bảy mục tích: Toà, Dự án, Trạng thái, Giá chào, Diện tích, Phòng ngủ, Xác nhận lúc. Khớp.
    E16-step6 (chọn, 1024 sáng): thanh công cụ xuống dòng, vùng 3 dòng (3 đến 5) x 3 cột (Căn, Toà, Dự án) được tô màu có viền; KHÔNG thấy chân "n ô đã chọn · Ctrl+C để chép" trong ảnh vì chân nằm trong DOM nhưng ở dưới mép khung 768px. Khung này trái với expected nên E16 FAIL; 7 trên 8 khung khớp.
  network_observed: clean

- eval: E18
  run_id: minted-bang-hang-dung-tay-nhu-sheet-E18-r1
  exit_code: 0
  baseline: red
  verifier: config:executors.script.e2e
  verified_at: 2026-11-12T08:28:50Z
  output: |
    711 passed (6.2m)

### Lệnh suite (hồi quy)

- cmd: make check
  run_id: minted-bang-hang-dung-tay-nhu-sheet-SUITE-make_check-r1
  exit_code: 0
  verified_at: 2026-11-12T08:28:50Z

- cmd: npm run build
  run_id: minted-bang-hang-dung-tay-nhu-sheet-SUITE-build-r1
  exit_code: 0
  verified_at: 2026-11-12T08:28:50Z

### Phán đoán (judge panel đề xuất)

- eval: E17
  judged_by: judge panel đề xuất (domain-correctness, operational-feasibility, spec-alignment), fresh context
  proposal: UNCERTAIN
  votes:
    - domain-correctness: UNCERTAIN — Cả năm ảnh trong danh sách Input không tồn tại ở đường dẫn được giao (Read báo lỗi, thư mục evidence không có tệp nào), nên không xét được nút công cụ, ô lọc, dòng nhóm, vùng ô đã bôi, chồng chữ hay tương phản. Chỉ đọc được design.md, mô tả ba trạng thái ST-inventory-loc-mo, ST-inventory-nhom, ST-inventory-chon-vung, nhưng không có ảnh để đối chiếu.
    - operational-feasibility: UNCERTAIN — Không đọc được ảnh nào trong năm ảnh; cả năm đường dẫn dưới thư mục evidence đều báo tệp không tồn tại. Chỉ biết các trạng thái cần hiện gì, chưa thấy ảnh nào để so.
    - spec-alignment: UNCERTAIN — Năm ảnh trong Input (loc-1440-sang, loc-1440-toi, nhom-1440-toi, chon-1024-sang, loc-nhom-360-toi) không tồn tại ở đường dẫn đã cho; thư mục evidence lúc đó chỉ có design-pass/*.png và reui/*.png. Không dùng ảnh design-pass thay thế vì nằm ngoài danh sách input.
  required_evidence:
    - Năm tệp ảnh loc-1440-sang.png, loc-1440-toi.png, nhom-1440-toi.png, chon-1024-sang.png, loc-nhom-360-toi.png có mặt đúng trong thư mục evidence của hàng này. Ghi chú: sau vòng chấm của hội đồng, bước E16 đã tạo các tệp tên ngắn này (chưa commit) trong thư mục evidence, nên cần chấm lại E17 trên chúng.
    - Nếu cả năm ảnh đọc được và cho thấy hàng lọc cùng nút «Lọc (n)», «Xoá lọc», «n / 60 dòng» đọc rõ, dòng nhóm có nút gập, tên toà, «n dòng» khác dòng thường, vùng ô bôi tô màu cùng chân «n ô đã chọn · Ctrl+C để chép», không chồng chữ, ảnh tối đủ tương phản, thì phán PASS. Lưu ý: ảnh chon-1024-sang không hiện chân chọn trong khung nhìn (xem E16).
  human_override:  # chi nguoi ghi

## Known limits

## Ngoài hợp đồng

## Analyst

Eval không phân biệt (xanh ở cả code hiện tại lẫn baseline; chứng minh harness chứ không chứng minh feature; nên viết lại để assert hành vi mới hoặc xác nhận là regression-guard có chủ ý):

- `make test`: E3, E4, E5, E6, E7, E8, E10, E12
- bước chấm khuôn (design-floor-khuon): E13
- sàn thiết kế (design-floor-s4): E15

Baseline đo được red (có phân biệt): E1, E2, E9, E11, E14, E18. E16 baseline n-a.

## Variance

none — mọi eval nhiều lần chạy đều đồng nhất (mọi eval chạy một lần, xác định).

## Iterations

Round 1: E16 failed — khung chon-1024-sang không hiện chân «n ô đã chọn · Ctrl+C để chép» vì chân nằm dưới mép khung nhìn 768px (có trong DOM, ở dưới màn hình); E17 còn UNCERTAIN chờ người vì ảnh chưa có lúc hội đồng chấm. Returned to implementation.
