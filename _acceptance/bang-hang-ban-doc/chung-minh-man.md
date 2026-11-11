# Chứng minh màn — bang-hang-ban-doc

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` còn ghi chưa có màn mẫu). Bảy trạng thái vùng chạy bằng bộ bài sinh
từ sổ màn trên chính Bảng hàng, ở bốn khổ, cả bản máy hãm CPU; mỗi trạng thái có ca phá đỏ đúng thông điệp.

## Màn inventory

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                                       |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai)                     |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong, bước tiếp «Tải lại»)                                     |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra, lối thoát «Xoá lọc»)                              |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi, «Thử lại»)                                                 |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                                  |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai, tên khu dài cắt gọn, đọc đủ khi focus)                 |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen)                                                 |
| Xung đột khi lưu | không áp | Bảng hàng bản đọc không lưu gì; sửa trên ô là hàng 4, trạng thái này đi cùng hàng ấy                         |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng; Bảng hàng chưa bắt đăng nhập (hàng 8 để màn đọc dữ liệu thật bắt)     |
| Mất mạng khi lưu | không áp | Bảng hàng bản đọc không lưu gì; không có lần lưu nào để mất mạng                                             |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                          |

### Khối

| Khối                 | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng |
| -------------------- | --------- | ------ | ----------------- | ----------------- |
| PageHeader           | trong-kho |        |                   |                   |
| DataRegion           | trong-kho |        |                   |                   |
| Frame                | trong-kho |        |                   |                   |
| DataGrid             | trong-kho |        |                   |                   |
| DataGridScrollArea   | trong-kho |        |                   |                   |
| DataGridTableVirtual | trong-kho |        |                   |                   |
| InputGroup           | trong-kho |        |                   |                   |
| TypedCell            | trong-kho |        |                   |                   |
| TruncatedText        | trong-kho |        |                   |                   |
| Badge                | trong-kho |        |                   |                   |
| Button               | trong-kho |        |                   |                   |
