---
schema_version: 1
slug: hanh-vi-trong-luoi-khung
feature: Hồ sơ cạnh bảng, lọc rỗng, chờ tải, lỗi, lưu và hoàn tác chỉ có một cách dựng, màn chỉ khai mình cần gì
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1e
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1e của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã F9

Hồ sơ cạnh bảng, lọc rỗng, chờ tải, lỗi, lưu và hoàn tác chỉ có một cách dựng, màn chỉ khai mình cần gì

Vì sao: Quyết định 0019: trạng thái và hành vi chiếm 36% số lần làm lại có đổi sản phẩm ở Quỹ hàng, đúng chỗ Bảng hàng lệch Liên hệ

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Sáu quyết định tầng hành vi đều có bài kiểm đỏ được; một màn tự dựng lại các hành vi này thì kiểm tra đỏ; hồ sơ cạnh bảng nhận được cả căn lẫn người, đi qua lại mà không đổi khung» chưa?
- Kết quả nào là SỐNG: [đề xuất] Sáu quyết định tầng hành vi đều có bài kiểm đỏ được; một màn tự dựng lại các hành vi này thì kiểm tra đỏ; hồ sơ cạnh bảng nhận được cả căn lẫn người, đi qua lại mà không đổi khung
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Sáu quyết định tầng hành vi đều có bài kiểm đỏ được; một màn tự dựng lại các hành vi này thì kiểm tra đỏ; hồ sơ cạnh bảng nhận được cả căn lẫn người, đi qua lại mà không đổi khung» khi hết timebox
- Timebox: …
