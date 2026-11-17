# Chứng minh màn — sua-thong-tin-can

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3g thêm việc sửa vào hồ
sơ căn và ô cột riêng của Bảng hàng; không thêm màn. Ma trận trạng thái, bảng Khối điền trước lượt chấm (từ
`implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | pháp lý, tài chính là chữ tự do; nội thất, tình trạng chọn giá trị cố định | chữ tự do cho pháp lý, tài chính (Hỏi-1 hàng 3b) | sửa cả bản ghi trong một trang riêng | hồ sơ căn đã là chỗ đọc bốn trường; sửa tại mục theo bảng chỗ đặt nút của kho |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng 3g thêm hộp sửa của kho vào hồ sơ và bộ sửa ô theo kiểu, cùng khung sửa trên ô của hàng 4 |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |

Không chọn lại: ba ứng viên và lựa chọn là của hàng 4 (ảnh chép từ `_acceptance/sua-tren-o/evidence/reui/`); hàng 3g
không đổi khối nào của màn, chỉ dùng `FormDialog` của kho trong hồ sơ.

### Ma trận trạng thái

Đo ở bốn khổ (bài trình duyệt chế độ mẫu) và trên dữ liệu thật của sàn (Postgres của dãy H), sáng và tối với bộ quét trợ
năng. Hàng 3g thêm hộp «Sửa» trong hồ sơ, bốn cột chi tiết và ô cột riêng sửa trên ô; các trạng thái của vùng giữ như hàng
10 đã chứng minh.

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | không đổi từ hàng 10: tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai); tests/e2e/screens/screens.spec.ts (cho-tai) |
| Trống | đạt | không đổi từ hàng 10: tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai, sàn trống) |
| Không có dòng nào khớp | đạt | không đổi từ hàng 10: tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai, lọc không khớp) |
| Lỗi | đạt | tests/sua-thong-tin-can.test.tsx (hop-nam-ket-cuc: máy chủ lỗi trong hộp); src/modules/listings/ui/http-save-door.test.ts (bay-tra-loi-tu-handler-that: 500 và thân hỏng là máy chủ lỗi) |
| Một phần hỏng | đạt | không đổi từ hàng 10: tests/e2e/screens/screens.spec.ts (mot-phan-hong) |
| Chữ dài | đạt | tests/sua-thong-tin-can.test.tsx (hop-qua-dai, hop-truong-cu-dai: pháp lý 350 ký tự sẵn không chặn lần lưu); tests/e2e/screens/screens.spec.ts (chu-dai) |
| Không đủ quyền | đạt | tests/sua-thong-tin-can.test.tsx (nut-sua-12-o: Quản trị sàn không có nút); tests/e2e-db/sua-thong-tin-can.spec.ts (quan-tri-khong-nut: không nút, ô không mở); tests/bang-hang-khong-du-quyen-doi-chung.test.tsx (đối chứng của màn không đủ quyền) |
| Xung đột khi lưu | đạt | tests/sua-thong-tin-may-chu.test.ts (hop-409-ban-hien-tai, hop-409-tai-ban-moi); tests/sua-thong-tin-can.test.tsx (hop-nam-ket-cuc: căn vừa đổi) |
| Phiên hết hạn | đạt | src/lib/write-failure.test.ts (mot-bang-ma: 401); tests/sua-thong-tin-can.test.tsx (hop-nam-ket-cuc: phiên hết hạn) |
| Mất mạng khi lưu | đạt | tests/sua-thong-tin-can.test.tsx (hop-nam-ket-cuc: mất mạng); src/modules/listings/ui/http-save-door.test.ts (offline không gửi gì) |
| Link hết hạn | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ |

### Khối

Hàng 3g không thêm khối giao diện mới: hộp «Sửa» là `FormDialog` của kho; ô chi tiết và ô cột riêng dùng khung sửa trên ô
của hàng 4 (`ListingCellEdit`, cùng tệp); hai sửa chung nằm trong khối có sẵn (`FormDialog` vẽ nền mờ khi lồng,
`RecordPanel` đo chiều cao thanh đáy).

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| FormDialog | trong-kho | | | | |
| RecordPanel | trong-kho | | | | |
| Button | trong-kho | | | | |
| Input | trong-kho | | | | |
| Select | trong-kho | | | | |
| Field | trong-kho | | | | |
