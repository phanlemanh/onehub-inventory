---
loai: chu-de
ma: [B4, B5, B6]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Sửa trên ô và dán từ Excel

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Sửa trên ô là lý do lớn nhất người giữ sổ chưa rời Sheet. Nhưng chép nguyên ô chữ tự do là chép lỗi của bảng thật (giá
  thiếu điều kiện phí, trạng thái mỗi người một kiểu). Câu chốt: gõ nhanh như Sheet, lưu chặt như cơ sở dữ liệu.
  `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:39`
- Bảng phải mượt với vài nghìn dòng, sửa tại ô, dán khối từ Excel. `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:177`

## Ai dùng và làm việc gì

- Đầu chủ trên máy tính. Chỉ sửa phần của lần rao (giá, phí, trạng thái, nội thất, người giữ, ghi chú); thuộc tính căn
  khoá. Điện thoại không sửa trên ô. `qh:docs/product/tham-chieu.md:139` · `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:41`
- Bản dựng đầu chỉ mở ba cột Giá, Phí, Trạng thái. `qh:docs/product/tham-chieu.md:357`

## Thói quen phải giữ

- Bàn phím như Sheet: mũi tên đi, gõ là thay, Enter lưu, Esc huỷ, Tab sang ô kế; dán một cột từ Excel thì xem trước chỗ sẽ
  đổi rồi mới áp. `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:45`
- Gõ giá theo cách nói của nghề («4,65 tỷ», «4ty65», «950tr»), máy đọc lại «Hiểu là…» rồi Enter là ghi.
  `qh:docs/product/tham-chieu.md:357`
- Không có nút Lưu; hoàn tác bằng thông báo hay Ctrl/Cmd+Z. Sửa giá hay trạng thái tính là vừa xác nhận với chủ nhà.
  `qh:docs/product/tham-chieu.md:141-142,357`

## Quỹ hàng đã chọn gì

- Lưới `@reui/data-grid` qua bài thử 5.000 × 20, CPU giảm tốc 4×: gõ p95 16,8 ms, dán 500 ô 54 ms (ngưỡng 1.000 ms).
  `qh:docs/adr/0004-luoi-bang-hang.md:30-36,42` · `qh:docs/product/tham-chieu.md:328`
- Giá đổi quá 20% hay đổi điều kiện phí thì hỏi lại kèm giá cũ → mới; Đã bán hỏi giá chốt và ngày; trạng thái chỉ đưa nấc
  hợp lệ. `qh:docs/product/tham-chieu.md:357`
- Ô chỉ đọc mặc định tới khi từng cột được mở sửa. `qh:design/patterns/bang-hang.md:35`
- Dán từ Excel và kéo điền: Quỹ hàng chưa bao giờ dựng, nên B5 không có bản cũ để tham khảo.
  `qh:docs/product/tham-chieu.md:357,365`

## Lỗi đã gặp

- Dòng «Hiểu là» làm tròn giá, nên mở ô rồi Enter có thể đổi giá; vá bằng cách viết đúng từng đồng.
  `qh:_acceptance/va-sua-tren-o/contract.md:18-19` · `qh:docs/product/tham-chieu.md:358`
- Nút Hoàn tác trên thông báo cũ đảo nhầm lần sửa sau; Ctrl+Z khi đang gõ ô lọc lại hoàn tác lần sửa căn.
  `qh:docs/product/tham-chieu.md:358`
- Các thành phần ReUI nguyên bản (data-grid, filters, cascader, event-calendar) không qua kiểu chặt, gộp 69 lỗi. `qh:docs/adr/0004-luoi-bang-hang.md:55-58`

## MVP này giữ gì, bỏ gì

- Giữ B4 sửa giá và trạng thái trên ô, B5 dán một vùng từ Excel, B6 câu xác nhận cho hành động nguy hiểm.
  `docs/plan/pham-vi-mvp-dot-1.md:39-41`
- Kiểu sửa được trên ô theo kiểu dữ liệu, còn lại mở hồ sơ cạnh bảng. `docs/design-standard-proposal.md:172`
- Bỏ sửa hàng loạt, đổi đầu chủ hàng loạt, góc nhìn lưu (L7). `docs/plan/pham-vi-mvp-dot-1.md:68`
- Kho này có giữ ngưỡng dán 500 ô dưới một giây không: chưa xác nhận.
