# Chứng minh màn — loi-vao-ho-so

Lối «màn mẫu mới» (họ Lưới, `design/patterns/luoi.md` ghi `Màn: inventory`, chính màn này). Hàng 3f thêm nút «Chép đường
dẫn» ở đầu hồ sơ căn, cách mở Bảng hàng từ ô tìm ⌘K (lọc đầu cột điền sẵn) và một báo khi đường dẫn đã cũ. Trạng thái vùng
của Bảng hàng không đổi; bộ bài sinh từ sổ màn vẫn đo chúng như hàng 2, hàng 3.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/ho-so-can.md | trang `/units/<mã>` dùng lại cột hồ sơ, nút «Mở toàn màn», ô «Gõ mã căn» là bảng lệnh ⌘K trên thanh trên, «Nhiều căn — chọn toà» | ô ⌘K ở thanh trên có gợi ý, phím ⌘K và «/», chỉ vai có Bảng hàng thấy ô, chép đường dẫn | trang riêng, «Mở toàn màn», hàng nút chọn toà, nhảy theo tên màn | chủ kho chọn giữ hồ sơ nổi cạnh Bảng hàng và ô ⌘K là chỗ tìm duy nhất (Cổng Phạm vi 2026-11-13) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| grid | màn mẫu mới | Không thêm màn; nút và cách mở mới nằm trên Bảng hàng, màn mẫu của họ Lưới |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | navbar-4 | evidence/reui/navbar-4.png | x |
| màn | app-shell-2 | evidence/reui/app-shell-2.png | |
| màn | solution-crm-4 | evidence/reui/solution-crm-4.png | |
| UnitJump | navbar-6 | evidence/reui/navbar-6.png | |
| UnitJump | app-shell-12 | evidence/reui/app-shell-12.png | |
| UnitJump | c-command-3 | evidence/reui/c-command-3.png | |

### Ma trận trạng thái

| Trạng thái       | Kết quả  | Căn cứ                                                                                         |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai; không có mã căn nên không mở được hồ sơ) |
| Trống            | đạt      | tests/e2e/screens/screens.spec.ts (công thức trong)                                            |
| Tìm không ra     | đạt      | tests/e2e/screens/screens.spec.ts (công thức tim-khong-ra); mã lạ từ ô ⌘K: tests/e2e/loi-vao-ho-so.spec.ts |
| Lỗi              | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi)                                              |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong)                                    |
| Chữ dài          | đạt      | tests/e2e/screens/screens.spec.ts (công thức chu-dai)                                          |
| Không đủ quyền   | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-du-quyen)                                   |
| Xung đột khi lưu | không áp | Hàng này không lưu gì                                                                          |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                          |
| Mất mạng khi lưu | không áp | Hàng này không lưu gì; chép đường dẫn chỉ ghi vào bộ nhớ chép của máy                          |
| Link hết hạn     | không áp | Trạng thái của trang khách; đường dẫn cũ tới Bảng hàng có báo riêng (tests/e2e/loi-vao-ho-so.spec.ts) |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| DataRegion | trong-kho | | | | |
| RecordPanel | trong-kho | | | | |
| Button | trong-kho | | | | |
| Command | trong-kho | | | | |
| UnitJump | ve-tay | navbar, app shell, command (tools/reui_catalog «command», «search») | navbar-4 | navbar-4 và navbar-6 là cả một thanh trên, app-shell-12 cả một khung; kho đã có thanh trên của App Shell (hàng 1o) nên chỉ lấy ô tìm ⌘K của navbar-4 đặt vào khe, ráp từ Command của shadcn với gợi ý ghi loại như nhóm của c-command-3 | |
