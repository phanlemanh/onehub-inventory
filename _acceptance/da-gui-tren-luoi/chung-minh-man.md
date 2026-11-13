# Chứng minh màn — da-gui-tren-luoi

## Màn sent

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md | wishlist-4 (thẻ mỗi link), bố cục danh sách → chi tiết | Bố cục danh sách → chi tiết; đúng các thông tin của thẻ (người nhận, số căn, lượt mở, quan tâm, giờ mở gần nhất) cộng giờ gửi | Thẻ wishlist-4 và ảnh ghép bìa | Bản phạm vi K4 chốt Đã gửi trên cùng Lưới với Bảng hàng (`docs/plan/pham-vi-mvp-dot-1.md`); trang sổ bối cảnh ghi là đổi có chủ ý |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | theo mẫu | `design/screens.yaml` khai sent thuộc họ grid; `design/patterns/luoi.md` ghi màn mẫu là inventory, nên Đã gửi so cạnh Bảng hàng |

### Ứng viên ReUI

Lối theo mẫu không đòi nhóm `màn`; ba ứng viên dưới để chủ kho thấy lối thẻ của Quỹ hàng cạnh Lưới, không chọn ứng viên nào
(màn dùng khuôn Lưới trong kho).

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | wishlist-4 | evidence/reui-wishlist-4.png | |
| màn | wishlist-1 | evidence/reui-wishlist-1.png | |
| màn | list-6 | evidence/reui-list-6.png | |

### Ảnh cạnh màn mẫu

| Khổ | Màn này | Màn mẫu | Dữ liệu |
| --- | --- | --- | --- |
| 360 | evidence/sent-360.png | evidence/inventory-360.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |
| 414 | evidence/sent-414.png | evidence/inventory-414.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |
| 1024 | evidence/sent-1024.png | evidence/inventory-1024.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |
| 1440 | evidence/sent-1440.png | evidence/inventory-1440.png | mẫu Ocean Park hàng 1 (60 lần chào) và 14 link mẫu dựng trên chúng |

### Mặt so

| Mặt | Kết quả | Căn cứ |
| --- | --- | --- |
| Khung và bố cục | giống | ảnh 1440: App Shell, đầu màn, khung vùng có tên, thanh công cụ, lưới, chân bảng ở cùng chỗ như Bảng hàng |
| Cột chính và góc nhìn | khác — có lý do | `src/modules/sharing/ui/sent-rows.ts`: cột đầu là Người nhận, không có nhóm theo toà vì link không có trường nhóm (sổ quyết định) |
| Thanh công cụ, lọc, tìm, sắp xếp | giống | ảnh 1440: ô tìm, số dòng, Lọc, Cột, Toàn màn hình; mũi tên sắp xếp ở mọi đầu cột |
| Bảng | giống | ảnh 1440: cột số dòng ghim, kẻ dọc giữa cột, số canh phải, mật độ dòng như Bảng hàng |
| Mở chi tiết cạnh bảng | giống | ảnh 1440: chữ cột đầu là nút mở; ngăn nổi theo `wiki/decisions/0024-ngan-noi-xem-chi-tiet.md` (evidence/sent-ho-so-1440.png) |
| Trạng thái tải, trống, lỗi | khác — có lý do | `src/app/(app)/sent/page.tsx`: lời mời ở trạng thái trống là «Mở Bảng hàng» thay vì «Tải lại», vì chưa có lối gửi (`design/states.md`) |
| Ghi và báo đã lưu | khác — có lý do | `_acceptance/da-gui-tren-luoi/contract.md`: màn chỉ đọc, không ô nào sửa được, như Bảng hàng bản đọc |
| Phím tắt | giống | ảnh 1440: cùng lưới nên cùng phím của `design/behaviors.md`; bài phím của khuôn chạy trên mọi màn Lưới |
| Điện thoại | giống | ảnh 360: lưới cuộn ngang trong vùng, cột số dòng và cột đầu đứng yên, trang không cuộn ngang |
| Tốc độ mở màn | giống | ảnh 1024: trang dựng ở máy chủ từ dữ liệu mẫu như Bảng hàng; 14 dòng ít hơn 60 dòng của màn mẫu |
| Chữ và nhãn | giống | ảnh 1440: mọi đầu cột và tên vùng lấy từ `ontology/labels.yaml` |
| Quyền theo vai | khác — có lý do | `_acceptance/da-gui-tren-luoi/contract.md`: Vai × Màn khai ý định như Bảng hàng; vai thật nối ở hàng 18 |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| RecordPanel | trong-kho | | | | |
| PageHeader | trong-kho | | | | |
| Button | trong-kho | | | | |
