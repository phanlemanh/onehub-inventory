# Chứng minh màn — thue-phi

Hàng 19 thêm phần «Thuế phí» vào màn «Tuỳ chỉnh của sàn» (hàng 7e), dựng bằng khối chung `FramedList` của họ danh sách
khung (hàng 9c), và thêm cột «Về tay» cùng cột ẩn sẵn «Điều kiện phí» vào Bảng hàng. Ảnh bản mẫu ở `cong/`, trang cổng
`cong-pham-vi.html`; ảnh của bản dựng vào `evidence/` trước lượt chấm.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/cai-dat-san.md | cột «Về tay» tính từ Giá chào và thuế phí của sàn, cờ «Phí CN» / «BP» trên từng hàng | cột tiền tính sẵn đứng sau Giá chào, cờ bao phí của từng hàng thành Điều kiện phí | dấu định nghĩa lúc tính trên từng giá; nhập cờ từ Sheet | giá thật chưa vào cơ sở dữ liệu (hàng 10); nhập Sheet là hàng 11 |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng này thêm hai cột, không đổi khuôn |

### Ứng viên ReUI

Không chọn khối nào: hai cột mới dựng bằng cột có kiểu khai sẵn của lưới trong kho (khối `DataRegion`), như cột riêng của
hàng 7e.

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-columns-5 | evidence/reui/data-grid-columns-5.png | |
| màn | data-grid-columns-4 | evidence/reui/data-grid-columns-4.png | |

### Ma trận trạng thái

Bảng hàng vẫn là màn mẫu của họ Lưới; hàng này thêm hai cột tính sẵn, các trạng thái giữ bài của các hàng trước.

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | tests/e2e/screens/screens.spec.ts (công thức cho-tai) |
| Trống | đạt | tests/e2e/screens/screens.spec.ts (công thức trong) |
| Không có dòng nào khớp | đạt | tests/e2e/screens/screens.spec.ts (công thức khong-khop) |
| Lỗi | đạt | tests/e2e/screens/screens.spec.ts (công thức loi); không đọc được thuế phí thì cột Về tay để trống, không lấy số của sàn khác (tests/thue-phi-cot.test.ts, ve-tay-theo-muc) |
| Một phần hỏng | đạt | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong) |
| Chữ dài | đạt | tests/e2e/screens/screens.spec.ts (công thức chu-dai) |
| Không đủ quyền | đạt | tests/e2e/sua-tren-o.spec.ts (khong-quyen-chu-thuong); sàn khác không thấy mức của nhau (tests/db/thue-phi.db.test.ts, hai-san-6-o) |
| Xung đột khi lưu | đạt | src/modules/listings/save-door.test.ts (cong-luu: conflict) |
| Phiên hết hạn | không áp | Của khung (App Shell), không của vùng |
| Mất mạng khi lưu | đạt | src/components/candidate/use-change.test.tsx (luu-hong-ve-cu) |
| Link hết hạn | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| PageHeader | trong-kho | | | | |

## Màn tuy-chinh-san

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/cai-dat-san.md | mục «Thuế phí» của màn Cài đặt sàn: thuế TNCN, lệ phí trước bạ, phí môi giới, mỗi khoản bật hay tắt khỏi giá bao phí | ba khoản mặc định, công tắc bao phí, tỉ lệ môi giới sàn tự đặt | khối biểu mẫu `settings-3`, màn Cài đặt sàn riêng | chủ kho chọn Hỏi-2 A (phần của Tuỳ chỉnh của sàn) và Hỏi-7 B (khung danh sách, sàn thêm khoản riêng) ở Cổng Phạm vi |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo mẫu | Màn Tuỳ chỉnh của sàn giữ họ của hàng 7e; riêng phần Thuế phí ghép từ khối `FramedList` của họ danh sách khung (design/patterns/danh-sach-khung.md) như màn Thành viên |

### Ảnh cạnh màn mẫu

| Khổ | Màn này | Màn mẫu | Dữ liệu |
| --- | --- | --- | --- |
| 360 | evidence/tuy-chinh-san-360.png | evidence/inventory-360.png | sàn mẫu A thử thuế phí của tests/e2e-db/thue-phi.spec.ts: Quản trị sàn, Phí môi giới 1%, Lệ phí trước bạ tắt, 60 lần chào mẫu |
| 414 | evidence/tuy-chinh-san-414.png | evidence/inventory-414.png | sàn mẫu A thử thuế phí của tests/e2e-db/thue-phi.spec.ts: Quản trị sàn, Phí môi giới 1%, Lệ phí trước bạ tắt, 60 lần chào mẫu |
| 1024 | evidence/tuy-chinh-san-1024.png | evidence/inventory-1024.png | sàn mẫu A thử thuế phí của tests/e2e-db/thue-phi.spec.ts: Quản trị sàn, Phí môi giới 1%, Lệ phí trước bạ tắt, 60 lần chào mẫu |
| 1440 | evidence/tuy-chinh-san-1440.png | evidence/inventory-1440.png | sàn mẫu A thử thuế phí của tests/e2e-db/thue-phi.spec.ts: Quản trị sàn, Phí môi giới 1%, Lệ phí trước bạ tắt, 60 lần chào mẫu |

Ảnh màn Thành viên cùng khổ đặt cạnh để so khung chung (AC-9): evidence/members-360.png, evidence/members-1440.png.

### Mặt so

| Mặt | Kết quả | Căn cứ |
| --- | --- | --- |
| Khung và bố cục | giống | ảnh 1440: App Shell, cột thứ hai liệt sáu phần, đầu màn có nút «Thêm khoản» ở bên phải như màn Thành viên, khung có tên và dòng đếm |
| Cột chính và góc nhìn | khác — có lý do | `src/modules/company-config/ui/fee-part.tsx`: phần Thuế phí là danh sách khung vài dòng (design/patterns/danh-sach-khung.md), không phải lưới, nên không có cột và góc nhìn |
| Thanh công cụ, lọc, tìm, sắp xếp | khác — có lý do | `design/patterns/danh-sach-khung.md`: danh sách khung không có thanh công cụ; ba đến tám khoản không cần lọc hay sắp |
| Bảng | khác — có lý do | `src/components/candidate/framed-list.tsx`: mỗi khoản một dòng của khung chung, đường kẻ giữa dòng như màn Thành viên |
| Mở chi tiết cạnh bảng | khác — có lý do | `src/modules/company-config/ui/fee-part.tsx`: mọi thứ của một khoản đã ở trên dòng (tỉ lệ, công tắc, «…»), không có ngăn chi tiết |
| Trạng thái tải, trống, lỗi | giống | ảnh 1440: tải dùng khung xương của trang, lỗi có «Thử lại» như màn Thành viên; phần không bao giờ trống vì luôn có hai khoản luật (src/modules/company-config/fee-schedule.ts) |
| Ghi và báo đã lưu | khác — có lý do | `wiki/decisions/0037-thue-phi-la-du-lieu-cua-san.md`: cả mức lưu một lần bằng nút Lưu ở chân khung, báo «Đã lưu thuế phí»; lý do sai gắn dưới đúng dòng |
| Phím tắt | khác — có lý do | `design/patterns/danh-sach-khung.md`: không có bảng nên không có phím của lưới; Tab đi qua ô số, công tắc, «…», Lưu theo thứ tự đọc |
| Điện thoại | giống | ảnh 360: phần trong ngăn trượt của App Shell, mỗi khoản xếp tên trên, tỉ lệ và công tắc dưới, trang không cuộn ngang |
| Tốc độ mở màn | giống | ảnh 1024: một lần đọc `/api/v1/company/fee-schedule`, vài dòng |
| Chữ và nhãn | giống | ảnh 1440: tên phần, ba khoản, «Thêm khoản», «Đổi tên khoản», «Bỏ khoản», «Trả về mặc định» lấy từ `ontology/labels.yaml`; câu ở `src/modules/company-config/ui/fee-copy.ts` |
| Quyền theo vai | giống | ảnh 1440: «Thêm khoản», ô số, «…» và Lưu của Quản trị sàn; `tests/e2e-db/thue-phi.spec.ts` (vai-khac-chi-doc): ba vai kia chỉ đọc |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| FramedList | trong-kho | | | | |
| PageHeader | trong-kho | | | | |
| Switch | trong-kho | | | | |
| Input | trong-kho | | | | |
| DropdownMenu | trong-kho | | | | |
| Button | trong-kho | | | | |
