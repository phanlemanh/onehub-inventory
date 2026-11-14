# Chứng minh màn — lop-rieng-cua-san

Hàng 7e đổi Bảng hàng (nhãn riêng thay nhãn chuẩn ở tiêu đề cột, trường riêng sau tám cột chuẩn) và thêm màn «Tuỳ chỉnh
của sàn» (bảng xem lại tối giản của lớp riêng). Bản mẫu (đã gỡ khi dựng): ảnh ở `cong/`, trang cổng `cong-pham-vi.html`. Ảnh của bản dựng ở `evidence/`, chụp trên
Postgres dãy R sau ba ca của `tests/e2e-db/lop-rieng.spec.ts` (sàn mẫu có nhãn «Lô» cho Toà và trường «Hướng view»).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | cột `custom:<mã>` dựng từ định nghĩa trường riêng, tiêu đề đọc từ vốn từ của sàn (`truong-rieng.ts`, `doc-tu-vung.ts`) | cột trường riêng sau cột chuẩn, kiểu cột theo kiểu trường, nhãn riêng thay nhãn chuẩn | đọc qua `/company/labels` riêng | kho này đọc qua cửa `withCompany` ở máy chủ, cùng lượt đọc của trang |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng này thêm cột, không đổi khuôn |

### Ứng viên ReUI

Không chọn khối nào: cột riêng dựng bằng cột có kiểu khai sẵn của lưới trong kho (khối `DataRegion`), không thêm khối.

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-columns-5 | evidence/reui/data-grid-columns-5.png | |
| màn | data-grid-columns-4 | evidence/reui/data-grid-columns-4.png | |

### Ma trận trạng thái

Bảng hàng vẫn là màn mẫu của họ Lưới; hàng này chỉ thêm cột riêng và chữ riêng, các trạng thái giữ bài của các hàng trước.

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | tests/e2e/screens/screens.spec.ts (công thức cho-tai) |
| Trống | đạt | tests/e2e/screens/screens.spec.ts (công thức trong) |
| Không có dòng nào khớp | đạt | tests/e2e/screens/screens.spec.ts (công thức khong-khop) |
| Lỗi | đạt | tests/e2e/screens/screens.spec.ts (công thức loi); không đọc được lớp riêng thì trang hiện chữ chuẩn (src/modules/company-config/server.ts, `myCompanyLayer`) |
| Một phần hỏng | đạt | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong) |
| Chữ dài | đạt | tests/e2e/screens/screens.spec.ts (công thức chu-dai); tên trường riêng tối đa 40 ký tự (src/modules/company-config/rules.ts) |
| Không đủ quyền | đạt | tests/e2e/sua-tren-o.spec.ts (khong-quyen-chu-thuong); sàn khác không thấy chữ riêng (tests/e2e-db/lop-rieng.spec.ts, company words on inventory) |
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
| docs/tri-thuc/wiki/chu-de/cai-dat-san.md | màn Cài đặt sàn bố cục Đọc, khối `settings-3`, chỉ Quản trị sàn mở | ý «màn hiếm dùng, máy tính là chính» | khối `settings-3` dạng biểu mẫu cài đặt | bảng xem lại là danh sách năm phần, không phải biểu mẫu; màn Cài đặt đầy đủ là H4 |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo mẫu | Lối A của Hỏi-3: mỗi phần là một vùng Lưới, so cạnh Bảng hàng; chọn B thì họ đổi, chứng minh lại lúc dựng |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | settings-4 | evidence/reui/settings-4-goc-1440.png | |
| màn | settings-11 | evidence/reui/settings-11-goc-1440.png | |
| màn | settings-9 | evidence/reui/settings-9.png | |

### Ảnh cạnh màn mẫu

| Khổ | Màn này | Màn mẫu | Dữ liệu |
| --- | --- | --- | --- |
| 360 | evidence/tuy-chinh-san-360.png | evidence/inventory-360.png | sàn mẫu thử vai sau ba ca của lop-rieng.spec.ts: nhãn «Lô», trường «Hướng view», 60 lần chào mẫu |
| 414 | evidence/tuy-chinh-san-414.png | evidence/inventory-414.png | sàn mẫu thử vai sau ba ca của lop-rieng.spec.ts: nhãn «Lô», trường «Hướng view», 60 lần chào mẫu |
| 1024 | evidence/tuy-chinh-san-1024.png | evidence/inventory-1024.png | sàn mẫu thử vai sau ba ca của lop-rieng.spec.ts: nhãn «Lô», trường «Hướng view», 60 lần chào mẫu |
| 1440 | evidence/tuy-chinh-san-1440.png | evidence/inventory-1440.png | sàn mẫu thử vai sau ba ca của lop-rieng.spec.ts: nhãn «Lô», trường «Hướng view», 60 lần chào mẫu |

### Mặt so

| Mặt | Kết quả | Căn cứ |
| --- | --- | --- |
| Khung và bố cục | giống | ảnh 1440: App Shell, cột thứ hai liệt năm phần, đầu màn có nút ở bên phải, khung vùng có tên, thanh công cụ, lưới, chân bảng ở cùng chỗ như Bảng hàng |
| Cột chính và góc nhìn | khác — có lý do | `src/modules/company-config/ui/layer-screen.tsx`: mỗi phần một lưới riêng chọn ở cột thứ hai (lối A của Hỏi-3), không có góc nhìn đã lưu vì mỗi phần chỉ vài chục dòng |
| Thanh công cụ, lọc, tìm, sắp xếp | giống | ảnh 1440: ô tìm, số dòng, Lọc, Cột, Toàn màn hình; mũi tên sắp xếp ở mọi đầu cột |
| Bảng | giống | ảnh 1440: cột số dòng ghim, kẻ dọc giữa cột, cột «…» ghim cuối như hàng 9e |
| Mở chi tiết cạnh bảng | khác — có lý do | `src/modules/company-config/ui/layer-screen.tsx`: mỗi dòng chỉ hai, ba ô nên sửa bằng hộp mở từ «…», không mở ngăn chi tiết |
| Trạng thái tải, trống, lỗi | giống | ảnh 1440 của phần Mẫu nhập (tuy-chinh-san-mau-1440.png): câu trống riêng từng phần nói lý do và đường nhập; lỗi có «Thử lại» như Bảng hàng; câu ở `src/modules/company-config/ui/copy.ts` |
| Ghi và báo đã lưu | khác — có lý do | `wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md`: ghi qua hộp và «…» của hàng 9e, báo «Đã thêm», «Đã lưu», «Đã ngừng dùng»; không sửa trên ô vì tên trường và nhãn cần kiểm trùng trước khi ghi |
| Phím tắt | giống | ảnh 1440: cùng lưới nên cùng phím của `design/behaviors.md` |
| Điện thoại | giống | ảnh 360: năm phần trong ngăn trượt của App Shell, lưới cuộn ngang trong vùng, trang không cuộn ngang |
| Tốc độ mở màn | giống | ảnh 1024: một lần đọc `/api/v1/company-layer` cho cả năm phần, vài dòng mỗi phần |
| Chữ và nhãn | giống | ảnh 1440: tên màn, tên phần, nút đầu vùng, «Sửa», «Ngừng dùng», «Đổi tên mẫu» lấy từ `ontology/labels.yaml`; câu riêng ở `src/modules/company-config/ui/copy.ts` |
| Quyền theo vai | giống | ảnh 1440: nút «Thêm trường riêng» và «…» của Quản trị sàn; `tests/e2e-db/lop-rieng.spec.ts` (review screen): bốn vai × năm phần đúng bảng nút; Đầu khách xem, không nút ghi |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| PageHeader | trong-kho | | | | |
| RowActions | trong-kho | | | | |
| FormDialog | trong-kho | | | | |
| Select | trong-kho | | | | |
| Input | trong-kho | | | | |
| Textarea | trong-kho | | | | |
| Button | trong-kho | | | | |
