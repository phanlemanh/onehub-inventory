# Chứng minh màn — nhap-excel

Hàng 11 có hai màn trong `screens:`: màn mới `nhap-tep` (họ mới «Luồng nhiều bước», Hỏi-10) và `inventory` (Bảng hàng, họ
Lưới, màn mẫu của họ — hàng này chỉ thêm nút «Nạp tệp» và căn chờ khớp). Mục `inventory` viết đủ khi hợp đồng `implemented`.

## Màn nhap-tep

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/nhap-excel.md | solution-crm-6 (năm bước: tải · ghép cột · xem trước · trùng · tóm tắt), khuôn KhungNhap | khung năm bước ngang, đọc tệp trên trình duyệt, con số từ máy chủ, hoàn tác cả lần nhập | bước «trùng» riêng (gộp vào dấu của ô căn), «tin bổ sung cho căn người khác», AI | bảng năm chỗ ghép của đề xuất 7d thay bước «trùng» bằng bước «giá trị và căn»; AI hoãn (H5) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| luong-nhieu-buoc | màn mẫu mới | ba họ của kho (Lưới, Danh sách khung, Đăng nhập) không nhận một luồng nhiều bước; họ mới «Luồng nhiều bước» (chủ kho duyệt ở Cổng Phạm vi 2026-11-17, Hỏi-10) nay có tệp họ `design/patterns/luong-nhieu-buoc.md` ghi màn này là màn mẫu, nên lối máy suy là màn mẫu mới |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | solution-crm-6 | evidence/reui-solution-crm-6.png | x |
| màn | onboarding-2 | evidence/reui-onboarding-2.png | |
| màn | wizard-1 | evidence/reui-wizard-1.png | |
| solution-crm-6 | solution-crm-6 | evidence/reui-solution-crm-6.png | x |
| solution-crm-6 | onboarding-2 | evidence/reui-onboarding-2.png | |
| solution-crm-6 | wizard-1 | evidence/reui-wizard-1.png | |

### Hướng

| Hướng | Ảnh | Động cơ | Đánh đổi | Chọn |
| --- | --- | --- | --- | --- |
| A — năm bước ngang (solution-crm-6) | evidence/nhap-tep-huong-1.png | lưới xem trước và bảng ghép cột có trọn bề ngang; đúng khối Quỹ hàng đã chạy | thanh bước chiếm một dải ngang; tên bước dài phải ngắn | x |
| B — bước dọc ở cột trái (onboarding-2) | evidence/nhap-tep-huong-2.png | thấy cả năm bước và số câu còn lại mọi lúc | mất khoảng 240 px bề ngang cho lưới xem trước 7–15 cột | |

### Ma trận trạng thái

Bài trình duyệt chạy ở bốn khổ (`tests/e2e-db/nhap-excel.spec.ts`, dự án 360, 414, 1024, 1440 của `playwright.db.config.ts`):
màn dùng ở 1024 và 1440; ở 360 và 414 nó nói «Màn này dùng trên máy tính.» (ST-nhap-tep-dien-thoai).

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Trống | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Không có dòng nào khớp | không áp | lưới xem trước không có ô lọc: nó hiện trọn tệp vừa nạp, không có gì để lọc ra rỗng |
| Lỗi | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Một phần hỏng | đạt | tests/nhap-excel-man.test.tsx |
| Chữ dài | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Không đủ quyền | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Xung đột khi lưu | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Phiên hết hạn | không áp | bài của khung App Shell; màn không giữ bản nào trên máy (tệp đọc lại được), đăng nhập lại thì chọn lại tệp |
| Mất mạng khi lưu | đạt | tests/e2e-db/nhap-excel.spec.ts |
| Link hết hạn | không áp | chỉ trang khách có link |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| Frame | trong-kho | | | | |
| Badge | trong-kho | | | | |
| DataRegion (lưới xem trước) | trong-kho | | | | |
| RegionLoading (khung chờ khi đọc tệp) | trong-kho | | | | |
| solution-crm-6 | reui | `node tools/reui_catalog/tra.mjs import wizard csv --loai block` | solution-crm-6 | — (được chọn theo Hỏi-3) | chọn khối |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| solution-crm-6 | tiêu đề và dòng tệp đang nạp | lấy | người luôn thấy đang ở bước nào và tệp nào, bao nhiêu dòng |
| solution-crm-6 | thanh năm bước | lấy | khung của họ Luồng nhiều bước; tên bước theo năm chỗ ghép của hàng 11 |
| solution-crm-6 | vùng thả tệp | lấy | chọn hay thả một tệp `.xlsx`/`.csv`, kèm giới hạn 10 MB, 5.000 dòng |
| solution-crm-6 | chân bước với nút bước kế | lấy | «Quay lại» và «Tiếp» (kèm số câu còn lại), nút Áp ở bước Xem trước |
| solution-crm-6 | nhãn đối tượng ở góc tiêu đề | bỏ | chỉ nạp vào Bảng hàng, không có đối tượng nào khác để chọn |
| solution-crm-6 | danh sách tệp đã tải lên | bỏ | một lần nạp một tệp; tên tệp đã ở dòng tiêu đề |
| solution-crm-6 | ô chọn nơi nhập | bỏ | đích luôn là Bảng hàng của sàn đang chọn |
| solution-crm-6 | công tắc «dòng đầu là tiêu đề» | bỏ | máy đọc dòng tiêu đề và hỏi qua dấu Cần người khi không chắc |
| solution-crm-6 | lần nhập gần đây | thêm | lần nhập dở hay đã hoàn tác hiện ở bước 1 (đề xuất 7d, Review Focus) |
| solution-crm-6 | băng mất mạng và xung đột | thêm | trạng thái Mất mạng khi lưu và Xung đột khi lưu của `design/states.md` |

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/nhap-excel.md | nút viền «Nhập Excel» ở đầu Bảng hàng, ẩn theo vai (`qh:docs/design/vo-va-ia.md` §2) | nút viền ở đầu màn theo vai; căn nhập vào hiện ngay trên bảng | trang trống có nút | luật design-assembly: trạng thái trống chỉ có nút khi điền được ngay trên màn, nên ở đây là liên kết trong câu |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng này thêm một nút, một liên kết ở trạng thái trống và dòng của căn chờ khớp, không đổi khuôn |

### Ứng viên ReUI

Không chọn khối nào: nút đi qua `PermittedAction` của kho (hàng 9e), trạng thái trống là `RegionEmpty` của kho.

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | empty-state-13 | evidence/reui-empty-state-13.png | |
| màn | empty-state-14 | evidence/reui-empty-state-14.png | |
