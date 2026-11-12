---
schema_version: 1
slug: thang-chon-khoi-vao-cong
feature: Vòng dựng màn đi đúng thang kho, kho kết hợp ReUI Pro, tạo tay; thứ mới nhập kho được bày cho chủ kho chọn ở Cổng Phạm vi và có một dòng trong sổ khối
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-11T14:53:31Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1n
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1n của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền

Vòng dựng màn đi đúng thang kho, kho kết hợp ReUI Pro, tạo tay; thứ mới nhập kho được bày cho chủ kho chọn ở Cổng Phạm vi và có một dòng trong sổ khối

Vì sao: Quyết định 0023: cổng chứng minh màn cho khối tự làm trong vòng tính là có sẵn, chỉ tra từng khối nhỏ, và luật giao diện còn dòng «chuyển thể khối chỉ đổi dữ liệu, chữ, tham số»

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Khối tạo trong chính vòng mà ghi «trong kho» thì đỏ; màn hay khối mới nhập kho thiếu ứng viên ReUI kèm ảnh thì đỏ; khối ReUI lấy về thiếu dòng lý do cho vùng lấy, bỏ, thêm thì đỏ; hai dòng sổ khối cho cùng một nhu cầu thì đỏ; hồ sơ màn thiếu mục «Từ Quỹ hàng» hay thiếu họ của màn thì đỏ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Khối tạo trong chính vòng mà ghi «trong kho» thì đỏ; màn hay khối mới nhập kho thiếu ứng viên ReUI kèm ảnh thì đỏ; khối ReUI lấy về thiếu dòng lý do cho vùng lấy, bỏ, thêm thì đỏ; hai dòng sổ khối cho cùng một nhu cầu thì đỏ; hồ sơ màn thiếu mục «Từ Quỹ hàng» hay thiếu họ của màn thì đỏ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Khối tạo trong chính vòng mà ghi «trong kho» thì đỏ; màn hay khối mới nhập kho thiếu ứng viên ReUI kèm ảnh thì đỏ; khối ReUI lấy về thiếu dòng lý do cho vùng lấy, bỏ, thêm thì đỏ; hai dòng sổ khối cho cùng một nhu cầu thì đỏ; hồ sơ màn thiếu mục «Từ Quỹ hàng» hay thiếu họ của màn thì đỏ» khi hết timebox
- Timebox: …
