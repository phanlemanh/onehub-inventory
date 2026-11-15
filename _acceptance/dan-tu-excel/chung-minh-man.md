# Chứng minh màn — dan-tu-excel

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 5 thêm việc dán một vùng
từ Excel vào Bảng hàng, thấy trước những ô sẽ đổi rồi áp một lần; không thêm màn. Bản xem trước là hộp thoại danh sách
(lối A, chủ kho chọn ở Cổng Phạm vi 2026-11-15). Ma trận trạng thái, bảng Khối và Vùng điền trước lượt chấm.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md | @reui/data-grid với dán khối từ Excel (đã qua bài thử dán 500 ô 54 ms); Quỹ hàng chưa dựng việc dán nên không có màn cũ | dán theo vị trí lên vùng đang chọn như Sheet; xem trước chỗ sẽ đổi trước khi ghi; luật đọc giá và nấc trạng thái của hàng 4 | kéo điền; hoàn tác bằng Ctrl/Cmd+Z; ghép cột theo tiêu đề tệp | kéo điền để sau; Ctrl/Cmd+Z cần đường ghi thật của hàng 10; ghép cột là việc của hàng 11 (nhập tệp) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Dán diễn ra trong Bảng hàng, màn mẫu của họ Lưới (mặt so «Ghi và báo đã lưu», «Phím tắt», «Quyền theo vai») |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |
| PastePreview | dialog-3 | evidence/reui/dialog-3.png | |
| PastePreview | dialog-4 | evidence/reui/dialog-4.png | |
| PastePreview | dialog-6 | evidence/reui/dialog-6.png | |

Bản xem trước (Hỏi-1, chủ kho chọn lối A): ba lối chụp trên Bảng hàng thật, cùng một vùng dán — `figures/lua-chon-A.png`,
`figures/lua-chon-B.png`, `figures/lua-chon-C.png`. Không ứng viên ReUI nào là bản xem trước của một lần dán: dialog-3 là
lưới ô chọn lý do không có giá trị cũ → mới; dialog-4 là danh sách việc có khúc gấp và ô sửa tại chỗ (Hỏi-5 chọn không sửa
chữ trong bản xem trước); dialog-6 là lưới thẻ chọn một. Tra: `node tools/reui_catalog/tra.mjs dialog checkbox list`.

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                                     |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai); chưa có dòng thì không có ô để dán                  |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                                        |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra)                                                 |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                                          |
| Một phần hỏng    | đạt      | tests/e2e/dan-tu-excel.spec.ts (ap-hong-mot-phan); src/components/candidate/door-batch.test.tsx (ap-hong-mot-phan) |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai); danh sách trong bản xem trước cuộn trong khung cao tối đa 24rem |
| Không đủ quyền   | đạt      | tests/e2e/dan-tu-excel.spec.ts (khong-quyen); src/components/candidate/data-region-paste.test.tsx (khong-quyen-khong-mo) |
| Xung đột khi lưu | đạt      | src/components/candidate/door-batch.test.tsx (ap-hong-mot-phan: conflict); src/modules/listings/ui/listing-paste.test.ts (noi-phien-ban) |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                                      |
| Mất mạng khi lưu | đạt      | tests/e2e/dan-tu-excel.spec.ts (ngoai-tuyen-tu-dau, ap-hong-mot-phan); src/components/candidate/door-batch.test.tsx (hoan-tac-hong-bao-ro) |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                        |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| PastePreview | ve-tay | hộp thoại có danh sách chọn (dialog-3, dialog-4, dialog-6) | dialog-3 | lưới ô chọn lý do, không có dòng giá trị cũ → mới, không có ngăn «Bị bỏ», «Sai kiểu» kèm lý do | ghép từ thành phần |
| DataRegion | trong-kho | | | | |
| FormDialog | trong-kho | | | | |
| Item | trong-kho | | | | |
| Checkbox | trong-kho | | | | |
| Badge | trong-kho | | | | |
