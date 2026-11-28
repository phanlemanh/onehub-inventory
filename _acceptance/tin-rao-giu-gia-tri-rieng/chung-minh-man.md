# Chứng minh màn — tin-rao-giu-gia-tri-rieng

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3h thêm giá trị riêng
cho năm thuộc tính căn, dấu khác danh mục, dòng khoá và thân hồ sơ căn theo bốn nhóm A–D; không thêm màn.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | danh mục chung mọi sàn khoá lại; năm thuộc tính căn chỉ đọc từ danh mục | danh mục chung không ai trong sàn sửa được | thuộc tính căn chỉ đọc từ danh mục | chủ kho chốt hướng 27/11: tin rao giữ giá trị riêng, danh mục chỉ điền chỗ trống |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng 3h thêm hai ô sửa được theo khung sửa trên ô của kho và một dấu nhỏ trong ô |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |
| c-badge-22 | c-badge-22 | evidence/reui/c-badge-22.png | x |
| c-badge-22 | c-badge-16 | evidence/reui/c-badge-16.png | |
| c-badge-22 | c-tooltip-3 | evidence/reui/c-tooltip-3.png | |

Không chọn lại khối của màn: ba ứng viên và lựa chọn là của hàng 4 (ảnh chép từ `_acceptance/sua-tren-o/evidence/reui/`).
Dấu khác danh mục: chủ kho chọn «chấm» (c-badge-22, Status Dot) ở Cổng Phạm vi 27/11 (Hỏi-6) trên ba ứng viên có ảnh
(`ung-vien/`, chép sang PNG ở `evidence/reui/`).

### Ma trận trạng thái

Đo ở bốn khổ (bài trình duyệt chế độ mẫu) và trên dữ liệu thật của sàn (Postgres của dãy R), sáng và tối với bộ quét
trợ năng. Hàng 3h thêm hai ô thuộc tính sửa được, dấu khác danh mục, hộp «Sửa» khối căn và thân hồ sơ A–D; các trạng
thái của vùng giữ như hàng 10 và 3g đã chứng minh.

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | không đổi từ hàng 10: tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai); tests/e2e/screens/screens.spec.ts (cho-tai) |
| Trống | đạt | không đổi từ hàng 10: tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai, sàn trống) |
| Không có dòng nào khớp | đạt | không đổi từ hàng 10: tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai, lọc không khớp) |
| Lỗi | đạt | tests/tin-rao-gia-tri-rieng.test.ts (o-gui-mot-lan: câu xung đột của hàng 4); src/modules/listings/ui/http-save-door.test.ts (máy chủ lỗi); tests/tin-rao-giu-gia-tri-rieng.test.tsx (hop-nam-truong: tầng «07» bị từ chối tại ô) |
| Một phần hỏng | đạt | không đổi từ hàng 10: tests/e2e/screens/screens.spec.ts (mot-phan-hong) |
| Chữ dài | đạt | tests/e2e/screens/screens.spec.ts (chu-dai); tests/e2e-db/tin-rao-gia-tri-rieng.spec.ts (than-ho-so: hai dòng đều nhau ở 320) |
| Không đủ quyền | đạt | tests/tin-rao-giu-gia-tri-rieng.test.tsx (nut-theo-quyen E11b: Sửa, Lấy lại theo bảng quyền); tests/db/tin-rao-gia-tri-rieng.db.test.ts (sua-lay-lai-theo-vai: 403 không updateListing) |
| Xung đột khi lưu | đạt | tests/tin-rao-gia-tri-rieng.test.ts (o-gui-mot-lan: 409 hiện giá trị máy chủ); tests/db/tin-rao-gia-tri-rieng.db.test.ts (hai-nguoi-cung-sua) |
| Phiên hết hạn | đạt | không đổi từ hàng 3g: tests/sua-thong-tin-can.test.tsx (hop-nam-ket-cuc: phiên hết hạn) — hộp «Sửa» khối căn dùng cùng một luật đọc kết cục ghi |
| Mất mạng khi lưu | đạt | src/modules/listings/ui/http-save-door.test.ts (offline không gửi gì); tests/sua-thong-tin-can.test.tsx (hop-nam-ket-cuc: mất mạng) |
| Link hết hạn | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| c-badge-22 | chấm tròn màu trước chữ | lấy | dấu nhỏ đứng ngay sau giá trị, không che giá trị (Hỏi-6 «chấm») |
| c-badge-22 | chữ trạng thái trong huy hiệu | bỏ | giá trị của ô là chữ; tên dấu đọc qua tên truy cập và chú thích |
| c-badge-22 | chú thích khi rê và chạm (Popover của kho) | thêm | thấy giá trị danh mục và lệnh «Lấy lại» của màn; đọc được bằng phím |

### Khối

Hàng 3h dựng trên khối có sẵn: ô sửa trên ô là khung của hàng 4 (`ListingCellEdit`), hộp «Sửa» khối căn là `FormDialog`
của kho, thân hồ sơ ghép từ `TypedCell`, `Progress`, `Button` trong `RecordPanel` của VP10. Khối mới duy nhất là dấu khác
danh mục, chọn từ ReUI.

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| c-badge-22 | reui | `tools/reui_catalog` «badge dot status, tooltip icon» | c-badge-16 | chủ kho chọn chấm ở Hỏi-6; nhãn chữ chiếm chỗ trong ô hẹp | ghép từ thành phần |
| DataRegion | trong-kho | | | | |
| RecordPanel | trong-kho | | | | |
| FormDialog | trong-kho | | | | |
| TypedCell | trong-kho | | | | |
| Button | trong-kho | | | | |
| Popover | trong-kho | | | | |
| Progress | trong-kho | | | | |
| Input | trong-kho | | | | |
| Select | trong-kho | | | | |
