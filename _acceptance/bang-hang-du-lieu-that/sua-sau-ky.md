# Sửa sau chữ ký — bang-hang-du-lieu-that

- 2026-11-17 — hàng 11 «Nhập Excel» (`_acceptance/nhap-excel/`, dãy D; chủ kho duyệt Hỏi-1: hàng 11 nhận cửa tạo lần
  chào): migration 015 mở quyền thêm lần chào (createListing: Đầu chủ căn mình giữ, Trưởng nhóm toàn sàn) và quyền xoá có
  rào (chỉ lần chào của một lần nhập chưa hoàn tác, version 1, khi undoImport cho phép). Ca 23 «can-chao-theo-san» của
  `db/tests/cach-ly.sql` đổi hai kỳ vọng cho đúng luật mới: Đầu chủ thêm lần chào không phải của mình bị luật
  `listings_insert_by_permission` chặn (trước: «permission denied»), và `delete from listings` dưới vai API xoá 0 lần chào
  không đến từ lần nhập (trước: «permission denied»). Hai dòng luật thu hẹp thêm của 013 trong danh sách cho phép đổi
  theo biểu thức mới. Ý của ca giữ nguyên: sàn khác không đọc, không sửa; không lần chào nào ngoài lần nhập bị xoá. Hồ sơ
  này ghim lại cùng lượt ghim của hàng 11.
