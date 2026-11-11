---
loai: chu-de
ma: [K2, K3, K4, K5, K6, K8]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Đã gửi và trang khách

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Thay các bản «bảng hàng cập nhật 14h» trôi trong nhóm Zalo bằng link sống: khách thấy giá và trạng thái của lúc mở.
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:51` · `qh:docs/product/tham-chieu.md:171`
- Lần gửi ghi công cho người gửi; lượt mở, lượt quan tâm cho biết hàng có được phát ra từ đây không. Đã gửi trả lời câu
  «khách đang phản ứng ra sao?». `qh:docs/product/tham-chieu.md:73,221`

## Ai dùng và làm việc gì

- Đầu khách theo dõi ở Đã gửi: mỗi link một thẻ (người nhận, số căn, lượt mở · quan tâm, giờ mở gần nhất); trưởng nhóm thấy
  cả đội. `qh:docs/product/tham-chieu.md:274` · `qh:docs/superpowers/specs/2026-11-04-da-gui-design.md:14,21`
- Khách mở link từ Zalo, không đăng nhập, chạm «Quan tâm» một lần mỗi căn, không form, không hỏi số.
  `qh:docs/superpowers/specs/2026-11-04-trang-khach-rieng-design.md:23,32-33`
- Lưu khách bằng tên và số; một Lần gửi tối đa 30 căn. `qh:docs/product/tham-chieu.md:384`

## Thói quen phải giữ

- Khách mở từ Zalo, nên trang khách luôn điện thoại trước. `qh:docs/product/tham-chieu.md:42`
- Khách riêng không thấy mã căn, chỉ toà và tầng cao hay thấp. `qh:docs/product/tham-chieu.md:169`
- Thẻ xem trước của Zalo cần đủ thẻ `og:*`, ảnh 1200×630 dưới 300 KB. `qh:docs/adr/0003-bai-thu-zalo.md:31-43`

## Quỹ hàng đã chọn gì

- Đã gửi: thẻ theo `wishlist-4`, bố cục Danh sách → chi tiết; tắt link hỏi xác nhận. `qh:design/patterns/da-gui.md:15-19,26-27`
- Trang khách: không có App Shell; danh sách `wishlist-3`, chi tiết `product-detail-5`, bỏ giỏ và đánh giá.
  `qh:design/patterns/trang-khach.md:15-19`
- Mọi chữ, ảnh khách thấy dựng từ một luật ẩn ở lõi; mỗi đường công khai có bài kiểm rò rỉ. Không lưu đệm: căn đã cọc mờ đi,
  không còn nút «Quan tâm». `qh:design/patterns/trang-khach.md:28-31`
- Đếm lượt mở bằng mã chạy trên máy khách, vì máy lấy xem trước của Zalo không chạy mã (ADR-0003).
  `qh:docs/adr/0003-bai-thu-zalo.md:19-27`
- Link tắt, mã sai hay người gửi rời sàn: cùng một câu «Link không còn mở được», không lộ tên sàn.
  `qh:docs/superpowers/specs/2026-11-04-trang-khach-rieng-design.md:72-77`

## Lỗi đã gặp

- Lỗi máy chủ của trang khách từng hiện thành «link không còn mở được»; nay hiện «Chưa mở được — thử lại sau».
  `qh:docs/superpowers/specs/2026-11-04-da-gui-design.md:29-31`
- Căn đã gỡ (lần nhập bị hoàn tác) vẫn vào được Lần gửi và nhận «Quan tâm». `qh:docs/product/tham-chieu.md:395`
- Nút «Gửi căn» ở trạng thái trống trỏ tới đường không có trang. `qh:_acceptance/va-link-gui-can/contract.md:20-23`

## MVP này giữ gì, bỏ gì

- Giữ K2 luật ẩn, K3 mở đúng trong trình duyệt Zalo, K4 Đã gửi, K5 lưu khách, K6 lượt mở thật, K8 báo link hết hạn hay
  thu hồi. `docs/plan/pham-vi-mvp-dot-1.md:51-57`
- **Đổi có chủ ý:** Quỹ hàng dựng Đã gửi bằng thẻ `wishlist-4`; MVP dựng trên cùng Lưới với Bảng hàng (K4).
  `docs/plan/pham-vi-mvp-dot-1.md:53`
- Bỏ nhóm môi giới, xuất bảng, mẫu bài (L3). `docs/plan/pham-vi-mvp-dot-1.md:64`
- Link hết hạn tự động: chưa xác nhận. Quỹ hàng chỉ có «Tắt link» bấm tay, nên hạn của K8 là luật mới.
  `qh:docs/product/tham-chieu.md:468`
