# Chứng minh màn — sua-tren-o

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 4 mở sửa Giá chào và
Trạng thái trên ô của Bảng hàng; không thêm màn. Ma trận trạng thái, bảng Khối và Vùng điền trước lượt chấm (từ
`implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md | @reui/data-grid sửa tại ô; trình sửa giá «Hiểu là», hỏi lại khi lệch quá 20%, trạng thái chỉ nấc hợp lệ | gõ là thay, F2, Esc huỷ, Tab sang ô kế; đọc giá theo cách nói của nghề; ngưỡng 20%; Đã bán hỏi giá chốt và ngày; Ngừng hẳn hỏi lý do; hoàn tác trên thông báo | cột Phí và điều kiện phí; Enter để sửa (Enter vẫn mở hồ sơ, luật 2a, 3); Ctrl/Cmd+Z; báo hai người cùng sửa | thực thể chưa có trường phí; Enter đã là lối mở hồ sơ; hoàn tác bằng phím và xung đột thật cần đường ghi của hàng 10 |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Sửa trên ô diễn ra trong Bảng hàng, màn mẫu của họ Lưới (mặt so «Ghi và báo đã lưu», «Phím tắt», «Quyền theo vai») |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |
| data-grid-editing-2 | data-grid-editing-2 | evidence/reui/data-grid-editing-2.png | x |
| data-grid-editing-2 | data-grid-editing-5 | evidence/reui/data-grid-editing-5.png | |
| data-grid-editing-2 | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | |

Khung sửa trên ô (Hỏi-4, chủ kho chọn 2026-11-13): ô nhập nằm trong ô theo data-grid-editing-2, thêm một dòng ngay dưới
ô cho «Hiểu là…», lời báo chưa hiểu và câu hỏi lại; Đã bán, Ngừng hẳn hỏi trong hộp giữa màn. Ảnh hai ứng viên chụp trên
Bảng hàng thật (tình huống gõ sai, khổ 1440); trang so sánh đủ: `chon-khung-sua.html`.

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                                     |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai); ô không mở sửa khi chưa có dòng                     |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                                        |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra)                                                 |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                                          |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                                |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai); dòng dưới ô xuống dòng trong bề rộng tối đa 20rem   |
| Không đủ quyền   | đạt      | tests/e2e/sua-tren-o.spec.ts (khong-quyen-chu-thuong); src/components/candidate/data-region-cell-edit.test.tsx (mo-theo-quyen) |
| Xung đột khi lưu | đạt      | src/components/candidate/use-change.test.tsx; src/modules/listings/save-door.test.ts (cong-luu: conflict) — câu riêng, ô về giá trị cũ |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                                      |
| Mất mạng khi lưu | đạt      | src/components/candidate/use-change.test.tsx (luu-hong-ve-cu, hoan-tac-hong-bao-ro)                        |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ                                                        |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| data-grid-editing-6 | reui | lưới có sửa tại ô (data-grid-editing-*, data-grid-columns-*, data-grid-virtualization-*) | data-grid-columns-3 | không có sửa tại ô | ghép từ thành phần |
| data-grid-editing-2 | reui | khung sửa một ô (data-grid-editing-2, data-grid-editing-5, data-grid-editing-6) | data-grid-editing-5 | ô nhập phủ kín ô, không đọc lại giá trước khi ghi; gõ sai chỉ báo ở góc màn sau Enter (Hỏi-4) | ghép từ thành phần |
| DataRegion | trong-kho | | | | |
| FormDialog | trong-kho | | | | |
| Input | trong-kho | | | | |
| Button | trong-kho | | | | |
| Badge | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| data-grid-editing-2 | ô nhập nằm trong ô, viền màu nhấn | lấy | gõ như Sheet, ô vẫn ở đúng chỗ (Hỏi-4) |
| data-grid-editing-2 | chữ đỏ ngay dưới ô khi gõ sai | lấy | lỗi báo tại ô (AC-3) |
| data-grid-editing-2 | danh sách chọn đè lên ô | lấy | ô Trạng thái chỉ đưa nấc hợp lệ (AC-5) |
| data-grid-editing-2 | hộp xác nhận giữa màn khi xoá dòng | bỏ | hàng này không xoá dòng |
| data-grid-editing-2 | thêm dòng mới ở cuối bảng | bỏ | thêm căn là hàng khác |
| data-grid-editing-2 | dòng «Hiểu là…» và câu hỏi lại dưới ô | thêm | đọc lại giá và hỏi lại khi giá đổi quá 20%, tại ô (AC-2, AC-4; Hỏi-4) |
| data-grid-editing-2 | hộp giữa màn cho Đã bán, Ngừng hẳn | thêm | hỏi giá chốt, ngày, lý do và nói nấc cuối (AC-5; Hỏi-4) |
| data-grid-editing-6 | sửa tại ô theo cột | lấy | hai cột Giá chào, Trạng thái |
| data-grid-editing-6 | ô khoá có ổ khoá và lý do | lấy | căn Đã bán, Ngừng hẳn (AC-6) |
