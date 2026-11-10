---
schema_version: 1
slug: du-lieu-mau
feature: Dựng một sàn mẫu trên Vinhomes Ocean Park 1, 2, 3, căn và liên hệ nối sẵn với nhau, nhãn MAU đủ cho các màn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã N4

Dựng một sàn mẫu trên Vinhomes Ocean Park 1, 2, 3, căn và liên hệ nối sẵn với nhau, nhãn MAU đủ cho các màn

Vì sao: Các màn dựng trên dữ liệu mẫu trước khi có dữ liệu thật. Quyết định 0020: Bảng hàng và Liên hệ dùng chung dữ liệu từ đầu

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Dựng lại hai lần ra cùng dữ liệu; mọi bản ghi mang nhãn MAU; không có tên hay số thật; đủ ca một chủ nhiều căn, một căn nhiều chủ, một người vừa là chủ vừa là khách, căn chưa có chủ; đổi số của một liên hệ thì mọi căn của người đó cùng thấy số mới» chưa?
- Kết quả nào là SỐNG: [đề xuất] Dựng lại hai lần ra cùng dữ liệu; mọi bản ghi mang nhãn MAU; không có tên hay số thật; đủ ca một chủ nhiều căn, một căn nhiều chủ, một người vừa là chủ vừa là khách, căn chưa có chủ; đổi số của một liên hệ thì mọi căn của người đó cùng thấy số mới
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Dựng lại hai lần ra cùng dữ liệu; mọi bản ghi mang nhãn MAU; không có tên hay số thật; đủ ca một chủ nhiều căn, một căn nhiều chủ, một người vừa là chủ vừa là khách, căn chưa có chủ; đổi số của một liên hệ thì mọi căn của người đó cùng thấy số mới» khi hết timebox
- Timebox: …
