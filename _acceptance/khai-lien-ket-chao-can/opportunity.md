---
schema_version: 1
slug: khai-lien-ket-chao-can
feature: Hai loại liên kết chủ nhà với lần chào và lần chào với căn được khai trong mô hình nghiệp vụ, kèm sàn sở hữu và vai trên quan hệ, và mã dùng kiểu sinh ra từ đó
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-11T02:58:17Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1j
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1j của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền

Hai loại liên kết chủ nhà với lần chào và lần chào với căn được khai trong mô hình nghiệp vụ, kèm sàn sở hữu và vai trên quan hệ, và mã dùng kiểu sinh ra từ đó

Vì sao: Hai mục ngoài hợp đồng của hàng 1: liên kết đang nằm trong mã mà chưa khai trong mô hình nghiệp vụ. Chủ kho chọn mở hợp đồng mới ở Cổng Bằng chứng ngày 11/11/2026. Phải xong trước khi có cơ sở dữ liệu thật

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
