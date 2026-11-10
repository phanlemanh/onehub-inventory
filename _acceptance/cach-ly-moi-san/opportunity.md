---
schema_version: 1
slug: cach-ly-moi-san
feature: Mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 7
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 7 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã N1

Mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa

Vì sao: Luật SP-1, là nền của mọi dữ liệu thật

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Bộ kiểm cách ly chạy dưới vai không sở hữu bảng: mọi bảng công ty đều chặn đọc và ghi chéo sàn» chưa?
- Kết quả nào là SỐNG: [đề xuất] Bộ kiểm cách ly chạy dưới vai không sở hữu bảng: mọi bảng công ty đều chặn đọc và ghi chéo sàn
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Bộ kiểm cách ly chạy dưới vai không sở hữu bảng: mọi bảng công ty đều chặn đọc và ghi chéo sàn» khi hết timebox
- Timebox: …
