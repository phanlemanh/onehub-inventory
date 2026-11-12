---
schema_version: 1
slug: thu-moi-dia-chi-tu-cau-hinh
feature: Thư mời dẫn người được mời tới đúng trang đăng nhập của sản phẩm, lấy từ cấu hình chứ không từ yêu cầu gửi tới
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T01:49:02Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 9d
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 9d của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#eda65bbab423f707ecfec5947798f0f1d04fb0db` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Thư mời dẫn người được mời tới đúng trang đăng nhập của sản phẩm, lấy từ cấu hình chứ không từ yêu cầu gửi tới

Vì sao: Mục ngoài hợp đồng 2 của hàng 9; chủ kho chọn mở hợp đồng mới ở Cổng Bằng chứng ngày 2026-11-11. Ở một số cách triển khai đường trong thư có thể bị trỏ sang trang khác

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Đường trong thư mời lấy từ địa chỉ gốc khai trong cấu hình; yêu cầu mang tên máy chủ lạ không đổi được đường trong thư; bản thật thiếu cấu hình ấy thì không khởi động» chưa?
- Kết quả nào là SỐNG: [đề xuất] Đường trong thư mời lấy từ địa chỉ gốc khai trong cấu hình; yêu cầu mang tên máy chủ lạ không đổi được đường trong thư; bản thật thiếu cấu hình ấy thì không khởi động
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Đường trong thư mời lấy từ địa chỉ gốc khai trong cấu hình; yêu cầu mang tên máy chủ lạ không đổi được đường trong thư; bản thật thiếu cấu hình ấy thì không khởi động» khi hết timebox
- Timebox: …
