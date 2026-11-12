---
schema_version: 1
slug: va-dang-nhap
feature: Sau khi đăng nhập người dùng không bao giờ bị đưa sang trang ngoài, bấm Đăng xuất mà lỗi thì được báo rõ, và người không còn thuộc sàn nào có lối thoát khỏi màn chọn sàn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-11T08:35:18Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1m
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1m của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền

Sau khi đăng nhập người dùng không bao giờ bị đưa sang trang ngoài, bấm Đăng xuất mà lỗi thì được báo rõ, và người không còn thuộc sàn nào có lối thoát khỏi màn chọn sàn

Vì sao: Bốn mục ngoài hợp đồng của hàng 8, ba lỗ an toàn của phần đăng nhập. Chủ kho chọn mở hợp đồng mới ở Cổng Bằng chứng ngày 11/11/2026. Phải xong trước hàng đầu tiên đọc dữ liệu thật

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
