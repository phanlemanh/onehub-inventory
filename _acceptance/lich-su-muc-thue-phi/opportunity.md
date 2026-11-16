---
schema_version: 1
slug: lich-su-muc-thue-phi
feature: Quản trị sàn đổi mức Thuế phí mà Về tay của các giá đã đặt trước đó không đổi, và trên căn thấy được con số tính theo mức nào
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T09:38:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 19b
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 19b của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Quản trị sàn đổi mức Thuế phí mà Về tay của các giá đã đặt trước đó không đổi, và trên căn thấy được con số tính theo mức nào

Vì sao: Tách khỏi hàng 10 ở Cổng Phạm vi của hàng ấy ngày 2026-11-15 (Hỏi-5): chủ kho trước đó chọn làm việc này ở hàng 10, nay nhận khuyến nghị chuyển sang một hàng riêng, vì phần Thuế phí của hàng 19 chỉ giữ mức đang áp, chưa giữ lịch sử mức. Giới hạn đã biết cho tới khi hàng này xong: đổi mức thì Về tay của các giá cũ đổi theo. Cần một bảng lịch sử mới trong cơ sở dữ liệu nên là T3. Hàng chưa qua Cổng Đáng

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Mỗi lần sàn đổi mức thuế phí, mức cũ được giữ lại cùng khoảng thời gian nó áp dụng; Về tay của một giá tính theo các mức đang áp lúc giá ấy được đặt, nên đổi mức sau đó không làm đổi Về tay của giá đã đặt trước, còn giá đặt sau lần đổi tính theo mức mới; trên căn thấy được con số Về tay tính theo những mức nào; lịch sử mức là dữ liệu của từng sàn, qua bộ kiểm cách ly, sàn khác không thấy; mức và Về tay vẫn là nội bộ, không ra trang khách» chưa?
- Kết quả nào là SỐNG: [đề xuất] Mỗi lần sàn đổi mức thuế phí, mức cũ được giữ lại cùng khoảng thời gian nó áp dụng; Về tay của một giá tính theo các mức đang áp lúc giá ấy được đặt, nên đổi mức sau đó không làm đổi Về tay của giá đã đặt trước, còn giá đặt sau lần đổi tính theo mức mới; trên căn thấy được con số Về tay tính theo những mức nào; lịch sử mức là dữ liệu của từng sàn, qua bộ kiểm cách ly, sàn khác không thấy; mức và Về tay vẫn là nội bộ, không ra trang khách
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Mỗi lần sàn đổi mức thuế phí, mức cũ được giữ lại cùng khoảng thời gian nó áp dụng; Về tay của một giá tính theo các mức đang áp lúc giá ấy được đặt, nên đổi mức sau đó không làm đổi Về tay của giá đã đặt trước, còn giá đặt sau lần đổi tính theo mức mới; trên căn thấy được con số Về tay tính theo những mức nào; lịch sử mức là dữ liệu của từng sàn, qua bộ kiểm cách ly, sàn khác không thấy; mức và Về tay vẫn là nội bộ, không ra trang khách» khi hết timebox
- Timebox: …
