# Chứng minh màn — bang-hang-du-lieu-that

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 10 thay nguồn dữ liệu của
Bảng hàng từ bộ mẫu trong bộ nhớ sang bảng căn chào của sàn; không thêm màn, không thêm khối giao diện. Ma trận trạng
thái, bảng Khối và Vùng điền trước lượt chấm (từ `implemented`).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | @reui/data-grid đọc toàn sàn, cuộn ảo, bài thử 5.000 dòng (ADR-0004) | đọc một lần toàn sàn, cuộn liền, đo 5.000 căn; bảng quyền 05/11 làm khởi điểm | bảng thẻ điện thoại gắn ẩn trên máy tính (lỗi sập React #185) | màn này đã có thẻ điện thoại của 2b chỉ dựng ở khổ nhỏ; giữ phép đo 5.000 căn để không lặp lỗi |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Bảng hàng là màn mẫu của họ Lưới; hàng 10 chỉ đổi nguồn dữ liệu và nối năm trạng thái của vùng với kết quả đọc thật |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | data-grid-editing-6 | evidence/reui/data-grid-editing-6.png | x |
| màn | data-grid-columns-3 | evidence/reui/data-grid-columns-3.png | |
| màn | data-grid-virtualization-1 | evidence/reui/data-grid-virtualization-1.png | |

Không chọn lại: ba ứng viên và lựa chọn là của hàng 4 (ảnh chép từ `_acceptance/sua-tren-o/evidence/reui/`); hàng 10
không đổi khối nào của màn.

### Ma trận trạng thái

Đo trên dữ liệu thật của sàn (Postgres của dãy, bộ mẫu nạp vào sàn thử bằng `tests/db/can-mau.ts`), ở bốn khổ, sáng và tối.

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai: ?state=loading, sáng và tối); tests/e2e/screens/screens.spec.ts (công thức cho-tai) |
| Trống | đạt | tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai: sàn [MAU-TRONG] chưa có căn, axe sáng và tối) |
| Không có dòng nào khớp | đạt | tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai: lọc mã căn không có, nút Xoá lọc, axe) |
| Lỗi | đạt | tests/e2e-db/bang-hang-that.spec.ts (nam-trang-thai: cơ sở dữ liệu từ chối lần đọc thật của sàn, vùng lỗi có Thử lại); tests/bang-hang-that.test.ts (loi-doc-that: lần đọc hỏng trả unreadable, không ném) |
| Một phần hỏng | đạt | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong; bộ khuôn có phiên thật chạy cùng công thức trên màn inventory) |
| Chữ dài | đạt | tests/e2e/screens/screens.spec.ts (công thức chu-dai; bộ khuôn có phiên thật chạy cùng công thức trên màn inventory) |
| Không đủ quyền | đạt | tests/bang-hang-khong-du-quyen.test.tsx (khong-du-quyen-tren-man: cửa đọc trả forbidden → màn chỉ có khối «Không đủ quyền», không vùng hàng); tests/the-dien-thoai.test.tsx (cua-vao: «không đủ quyền», không thẻ). Không vai thật nào gặp ở trạng thái này từ Hỏi-1 A (sổ quyết định) |
| Xung đột khi lưu | đạt | tests/e2e-db/bang-hang-that.spec.ts (xung-dot-tai-o: phiên hai nhận câu tại ô, ô hiện giá mới nhất); tests/db/bang-hang-that.db.test.ts (xung-dot: 409 kèm bản hiện tại) |
| Phiên hết hạn | đạt | tests/e2e-db/bang-hang-that.spec.ts (chua-dang-nhap-ve-dang-nhap: không phiên → trang đăng nhập, kể cả ?vai=) |
| Mất mạng khi lưu | đạt | src/modules/listings/listings-http.test.ts (httpSaveDoor: mạng hỏng hay máy báo ngoại tuyến → offline, không gửi gì); src/components/candidate/use-change.test.tsx (luu-hong-ve-cu) |
| Link hết hạn | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ |

### Khối

Hàng 10 không thêm khối giao diện nào: ô chọn Điều kiện phí dùng đúng khuôn danh sách trong ô của ô Trạng thái (hàng 4).

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| Button | trong-kho | | | | |
| Badge | trong-kho | | | | |
