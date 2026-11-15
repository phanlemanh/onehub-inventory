---
schema_version: 1
slug: so-chu-nha
feature: Đầu chủ ghi và mở số chủ nhà trên hồ sơ căn, và gỡ được chủ nhà ghi nhầm khỏi căn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 13
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 13 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/lien-he.md#e42a0ae3eb85d1a28c18575c1a1545af316e9767`

Đầu chủ ghi và mở số chủ nhà trên hồ sơ căn, và gỡ được chủ nhà ghi nhầm khỏi căn

Vì sao: Cần cho việc gọi giữ tươi. Dữ liệu cá nhân, lưu dạng rõ theo quyết định 0014; ai được thấy số chốt ở Cổng Phạm vi của hàng

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Số chủ nhà ghi vào liên hệ, không ghi vào căn; một người có nhiều căn chỉ có một liên hệ; chủ nhà của căn có đủ vòng đời, ghi đích danh vế nào ở hàng nào: ghi chủ nhà và mở số ở hàng này, gỡ chủ nhà khỏi căn ở hàng này, sửa tên và số là sửa liên hệ ở hàng 13a» chưa?
- Kết quả nào là SỐNG: [đề xuất] Số chủ nhà ghi vào liên hệ, không ghi vào căn; một người có nhiều căn chỉ có một liên hệ; chủ nhà của căn có đủ vòng đời, ghi đích danh vế nào ở hàng nào: ghi chủ nhà và mở số ở hàng này, gỡ chủ nhà khỏi căn ở hàng này, sửa tên và số là sửa liên hệ ở hàng 13a
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Số chủ nhà ghi vào liên hệ, không ghi vào căn; một người có nhiều căn chỉ có một liên hệ; chủ nhà của căn có đủ vòng đời, ghi đích danh vế nào ở hàng nào: ghi chủ nhà và mở số ở hàng này, gỡ chủ nhà khỏi căn ở hàng này, sửa tên và số là sửa liên hệ ở hàng 13a» khi hết timebox
- Timebox: …
