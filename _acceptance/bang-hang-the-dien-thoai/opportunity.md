---
schema_version: 1
slug: bang-hang-the-dien-thoai
feature: Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại thấy danh sách thẻ căn và chạm thẻ để mở hồ sơ căn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T02:16:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 2b
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 2b của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#eda65bbab423f707ecfec5947798f0f1d04fb0db` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại thấy danh sách thẻ căn và chạm thẻ để mở hồ sơ căn

Vì sao: Chủ kho 2026-11-11 chọn làm bảng thẻ điện thoại thành hàng riêng sau hàng 3. Sheet trên điện thoại gần như không dùng được; Quỹ hàng dùng danh sách thẻ. Hôm nay Bảng hàng trên điện thoại là bảng cuộn ngang, thấy trọn hai cột

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ở 360 và 414 Bảng hàng hiện thẻ căn thay cho bảng, mỗi thẻ đủ mã căn, giá, trạng thái; chạm thẻ mở hồ sơ căn toàn màn, lùi về giữ chỗ đang cuộn; thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ở 360 và 414 Bảng hàng hiện thẻ căn thay cho bảng, mỗi thẻ đủ mã căn, giá, trạng thái; chạm thẻ mở hồ sơ căn toàn màn, lùi về giữ chỗ đang cuộn; thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ở 360 và 414 Bảng hàng hiện thẻ căn thay cho bảng, mỗi thẻ đủ mã căn, giá, trạng thái; chạm thẻ mở hồ sơ căn toàn màn, lùi về giữ chỗ đang cuộn; thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023» khi hết timebox
- Timebox: …
