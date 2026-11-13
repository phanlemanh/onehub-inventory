---
schema_version: 1
slug: dang-nhap-chon-tu-reui
feature: Nhân viên sàn đăng nhập bằng mã email trên màn đăng nhập chọn từ ReUI Pro, luồng và luật an toàn giữ nguyên
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T02:16:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1p
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1p của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền

Nhân viên sàn đăng nhập bằng mã email trên màn đăng nhập chọn từ ReUI Pro, luồng và luật an toàn giữ nguyên

Vì sao: Quyết định 0023: màn đăng nhập ghép tay khi kho còn rỗng; Quỹ hàng đã chọn auth-15

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thẻ Phạm vi bày hai đến ba khối đăng nhập của ReUI kèm ảnh, trong đó có auth-15; mọi bài kiểm đăng nhập của hàng 8 và 1m vẫn xanh, không đổi lời» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thẻ Phạm vi bày hai đến ba khối đăng nhập của ReUI kèm ảnh, trong đó có auth-15; mọi bài kiểm đăng nhập của hàng 8 và 1m vẫn xanh, không đổi lời
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thẻ Phạm vi bày hai đến ba khối đăng nhập của ReUI kèm ảnh, trong đó có auth-15; mọi bài kiểm đăng nhập của hàng 8 và 1m vẫn xanh, không đổi lời» khi hết timebox
- Timebox: …
