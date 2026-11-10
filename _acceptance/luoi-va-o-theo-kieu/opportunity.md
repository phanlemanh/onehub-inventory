---
schema_version: 1
slug: luoi-va-o-theo-kieu
feature: Mọi vùng dữ liệu dùng chung Lưới, ô theo kiểu, đầu vùng và đủ trạng thái
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1b
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1b của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã F6, mã F7

Mọi vùng dữ liệu dùng chung Lưới, ô theo kiểu, đầu vùng và đủ trạng thái

Vì sao: Khoá đúng chỗ các tác tử từng làm lệch nhau ở Quỹ hàng

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Hai cột cùng kiểu luôn ra cùng canh lề, bề rộng và định dạng; mỗi trạng thái vùng có bài kiểm đỏ được khi phá» chưa?
- Kết quả nào là SỐNG: [đề xuất] Hai cột cùng kiểu luôn ra cùng canh lề, bề rộng và định dạng; mỗi trạng thái vùng có bài kiểm đỏ được khi phá
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Hai cột cùng kiểu luôn ra cùng canh lề, bề rộng và định dạng; mỗi trạng thái vùng có bài kiểm đỏ được khi phá» khi hết timebox
- Timebox: …
