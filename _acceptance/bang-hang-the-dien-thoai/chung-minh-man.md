# Chứng minh màn — bang-hang-the-dien-thoai

Hàng 2b đổi thân vùng Lưới của Bảng hàng dưới 768 px thành danh sách thẻ căn; từ 768 bảng không đổi. Bảng hàng là màn mẫu
của họ Lưới, nên ma trận trạng thái của nó đo lại ở khổ điện thoại (điền trước lượt chấm).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | Bảng hàng thẻ điện thoại (hàng 32 của Quỹ hàng): product-grid-4 + ngăn lọc filter-sidebar-5 thành ngăn đáy, dưới md | thẻ một căn: mã căn + giá một dòng, ba thông số trên vạch mảnh; dòng nhóm toà; cùng địa chỉ /inventory | ảnh căn (kho chưa có ảnh), câu chuyện, chọn nhiều khi giữ lâu, cuộn ảo, chỉ hai trạng thái | mười việc trên điện thoại chỉ là tra, xem giá, mở hồ sơ (trang bối cảnh); ngăn lọc là Hỏi-2 vì chủ kho đã chốt ô lọc luôn hiện ở 2e |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | màn mẫu mới | `design/patterns/luoi.md` ghi `Màn: inventory`: hàng này sửa chính màn mẫu ở khổ điện thoại, nên ma trận trạng thái của nó đo lại |

### Ứng viên ReUI

Ảnh khối gốc chụp ở 360 từ trang xem trước công khai của ReUI trước khi dựng. Chủ kho chọn ở Cổng Phạm vi (2026-11-14): thẻ theo product-grid-4 — chính thẻ căn của kho thêm dáng ngang; lọc bằng
ngăn đáy theo filter-sidebar-5 (Câu 2 «Nút»).

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | product-grid-4 | evidence/reui-product-grid-4.png | x |
| màn | list-5 | evidence/reui-list-5.png | |
| màn | data-grid-columns-3 | evidence/reui-data-grid-columns-3.png | |
| filter-sidebar-5 | filter-sidebar-5 | evidence/reui-filter-sidebar-5.png | x |
| filter-sidebar-5 | data-grid-columns-3 | evidence/reui/data-grid-columns-3-the-goc-360.png | |

data-grid-columns-3 (bảng ↔ thẻ) không đưa thành lối: ở 360 mỗi thẻ cao gần một màn, đầu thẻ mang nút sửa, xoá thuộc 3d
và 9e. Ngăn lọc filter-sidebar-5 (`evidence/reui-filter-sidebar-5.png`) là lối L2 của Hỏi-2.

### Ma trận trạng thái

Đo ở khổ điện thoại (danh sách thẻ); từ 768 px bảng không đổi và giữ căn cứ của các hàng trước.

| Trạng thái             | Kết quả  | Căn cứ                                                                                                     |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Chờ tải                | đạt      | tests/the-dien-thoai.test.tsx (trang-thai: loading, không thẻ); tests/e2e/screens/screens.spec.ts (cho-tai) |
| Trống                  | đạt      | tests/the-dien-thoai.test.tsx (trang-thai: empty, câu trống của màn)                                        |
| Không có dòng nào khớp | đạt      | tests/the-dien-thoai.test.tsx (loc: zzz-khong-co); tests/e2e/sheet.spec.ts (no match keeps filters, 360)    |
| Lỗi                    | đạt      | tests/the-dien-thoai.test.tsx (trang-thai: error, không thẻ)                                                |
| Một phần hỏng          | đạt      | tests/the-dien-thoai.test.tsx (trang-thai: partial, 40 thẻ và dải báo)                                      |
| Chữ dài                | đạt      | tests/e2e/the-dien-thoai.spec.ts (du-lieu-bien: mã 14 ký tự, giá 125,5 tỷ, giá thuê, không giá)             |
| Không đủ quyền         | đạt      | tests/the-dien-thoai.test.tsx (trang-thai: forbidden); tests/e2e/the-dien-thoai.spec.ts (CompanyAdmin)      |
| Xung đột khi lưu       | không áp | Thẻ không sửa gì (sửa trên điện thoại là hàng 3d)                                                           |
| Phiên hết hạn          | không áp | Của khung (App Shell), không của vùng                                                                       |
| Mất mạng khi lưu       | không áp | Thẻ không lưu gì                                                                                            |
| Link hết hạn           | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                         |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| filter-sidebar-5 | reui | danh sách thẻ, ngăn lọc (`tra.mjs mobile list`, `tra.mjs card view`, `tra.mjs property listing card`) | data-grid-columns-3 | thẻ của nó cao gần một màn 360, đầu thẻ mang nút sửa, xoá thuộc 3d và 9e | ghép từ thành phần |
| DataRegion | trong-kho | | | | |
| ListingCard | trong-kho | | | | |
| Sheet | trong-kho | | | | |
| Button | trong-kho | | | | |
| Tooltip | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| filter-sidebar-5 | ngăn lọc trượt lên | lấy | lọc trên điện thoại trong một ngăn, chủ kho chọn «Nút» |
| filter-sidebar-5 | chip lọc đang chạy | lấy | thấy lọc nào đang chạy, bỏ từng cái một chạm |
| filter-sidebar-5 | nút áp dụng, đặt lại | bỏ | lọc áp ngay khi gõ như ở bảng; «Xoá lọc» ở hàng chip |
| filter-sidebar-5 | thanh trượt giá, màu, cỡ | bỏ | ô lọc của từng cột thay, cùng luật với bảng |
| filter-sidebar-5 | Sắp theo | thêm | giám sát chốt (G-1411-100): một họ không rơi sắp xếp khi đổi khổ |
