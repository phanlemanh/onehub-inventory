---
loai: chu-de
ma: [G2, G3]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Hôm nay

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Mở app là vào Hôm nay: hàng đợi gọi lại, căn mới đổi, căn thiếu thông tin, link khách đã mở. Hôm nay trả lời một câu
  «giờ làm gì?». `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:35` · `qh:docs/product/tham-chieu.md:221`
- Đầu chủ giữ hàng trăm căn, không nhớ căn nào gọi ngày nào, quên căn đang cần bán gấp để sàn khác ép mất.
  `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:65`

## Ai dùng và làm việc gì

- Đầu chủ: năm nhóm Lead mới · Nên gọi điều chỉnh giá · Cần gọi lại · Thiếu thông tin · Mới đổi; mỗi căn đúng một nhóm, lý
  do bằng chữ, kết quả gọi một chạm. `qh:design/patterns/hom-nay-dau-chu.md:15-17`
- Đầu khách (điện thoại): tin 7 ngày về link của mình — Khách phản ứng · Vừa đổi · Căn mới. Trưởng nhóm (máy tính): lead
  quá hạn, ngoại lệ, hàng cũ theo người. `qh:docs/product/tham-chieu.md:390` · `qh:design/patterns/hom-nay-truong-nhom.md:15-17`

## Thói quen phải giữ

- Trong Sheet, gọi lại nằm ở cột ngày gọi và tab «gọi lại»; Hôm nay thay chỗ đó.
  `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:13,136`
- Ghi kết quả gọi nhanh như sửa ô: một chạm (Còn · Đổi giá · Đã cọc/bán · Không nghe máy); sửa giá hay trạng thái tính luôn
  là vừa xác nhận với chủ nhà. `qh:docs/product/tham-chieu.md:94` · `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:51`
- «Nói trên điện thoại, ghi trên máy tính»: máy áp tai thì không chạm được, nên màn cuộc gọi chính ở máy tính, có phím tắt.
  `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:80,84-88`

## Quỹ hàng đã chọn gì

- Đầu chủ (máy tính): `solution-agents-2` cộng ô hạn của `data-grid-base-5`; mỗi dòng Việc · Vì sao hôm nay · Giá · Hành
  động; đúng một nút viền mỗi dòng, còn lại trong ⋯. `qh:design/patterns/hom-nay-dau-chu.md:17-21`
- Dưới 768 px thành danh sách thẻ hai tầng, khoảng tám việc một màn. `qh:design/patterns/hom-nay-dau-chu.md:42-44` ·
  `qh:docs/design/vo-va-ia.md:138`
- Ngưỡng mặc định: cần gọi lại sau 14 ngày chưa xác nhận; nên gọi điều chỉnh giá sau 10 ngày; mỗi căn đúng một hàng đợi.
  `qh:docs/product/tham-chieu.md:157`

## Lỗi đã gặp

- Bản đầu theo `data-grid-grouping-1`: nút rối, lý do khó đọc; làm lại với một nút mỗi dòng.
  `qh:docs/design/vo-va-ia.md:147,153` · `qh:_acceptance/lam-lai-hom-nay-dau-chu/contract.md:18-20`
- Lối «không nút trên dòng, việc ở chân hồ sơ» bị loại vì tốn hai chạm mỗi kết quả. `qh:docs/design/vo-va-ia.md:128`
- Nút «Gửi căn» ở trạng thái trống của Hôm nay đầu khách trỏ tới đường không có trang. `qh:_acceptance/va-link-gui-can/contract.md:20-23`

## MVP này giữ gì, bỏ gì

- Giữ G2 một danh sách việc, G3 ghi kết quả cuộc gọi. `docs/plan/pham-vi-mvp-dot-1.md:46-47`
- Cắt gọi điều chỉnh giá và ba Hôm nay riêng theo vai (L8); Hôm nay của Telesales mất theo L2.
  `docs/plan/pham-vi-mvp-dot-1.md:63,69`
- Đầu khách thấy gì trên danh sách chung: chưa xác nhận.
- Quỹ hàng chốt 06/11 (chưa dựng): căn nhập từ file còn thiếu ảnh hay pháp lý thành việc ở Hôm nay của đầu chủ giữ căn. MVP
  có làm theo không: chưa xác nhận. `qh:docs/product/tham-chieu.md:421-422`
