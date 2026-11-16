# Chứng minh màn — bang-hang-theo-dia-ly

Hàng 2d đặt các nhóm dự án vào cột thứ hai của App Shell trên Bảng hàng (`inventory`, màn mẫu của họ Lưới) và nối chúng
với ô lọc Dự án, Toà thành một trạng thái lọc. Màn không đổi vùng, cột hay đường ghi; cột thứ hai chỉ thêm nhóm bằng chính
mục của nó (lối D, chủ kho duyệt ở Cổng Phạm vi 2026-11-14).

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | mỗi khu một tab của Sheet, lọc tiếp bằng cột | đi theo dự án → phân khu → toà, lọc bằng ô đầu cột | tab riêng cho từng khu, số căn trên mỗi tab | chủ kho 2026-11-14: cột thứ hai một kiểu mục, không số; số của nơi đang mở đọc ở chân bảng |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | màn mẫu mới | `design/patterns/luoi.md` ghi `Màn: inventory`: hàng này sửa chính màn mẫu (cột thứ hai có nhóm địa lý, lọc Dự án, Toà theo nơi), nên ma trận trạng thái của nó đo lại |

### Ứng viên ReUI

Hai khối Cây của ReUI được bày ở Cổng Phạm vi (lối A và C); chủ kho chọn lối D — các mục có sẵn của cột thứ hai — nên
không chọn ứng viên nào, và gói Cây đã gỡ khỏi nhánh.

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | c-tree-1 | evidence/reui/reui-tree-goc-1440.png | |
| màn | c-tree-7 | evidence/reui/reui-c-tree-7-goc-1440.png | |

Bản bấm được của bốn lối (A, B, C, D): ảnh ở `figures/proto/`, trang so `cong-pham-vi.html`.

### Ma trận trạng thái

| Trạng thái             | Kết quả  | Căn cứ |
| ---------------------- | -------- | ------ |
| Chờ tải                | đạt      | tests/e2e/screens/screens.spec.ts (công thức cho-tai) — cột thứ hai dựng ở máy chủ cùng trang, không có lượt tải riêng |
| Trống                  | đạt      | tests/dia-ly.test.tsx (no units: one group says so) — «Chưa có căn nào trên Bảng hàng.» ở chỗ các nhóm dự án; tests/e2e/screens/screens.spec.ts (công thức trong) |
| Không có dòng nào khớp | đạt      | tests/e2e/screens/screens.spec.ts (công thức khong-khop); tests/e2e-db/dia-ly.spec.ts (E8: Trạng thái giữ khi chọn toà, có thể 0 dòng, cây vẫn đủ 10 nơi) |
| Lỗi                    | đạt      | tests/e2e/screens/screens.spec.ts (công thức loi) — hàng này không đổi vùng |
| Một phần hỏng          | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong) |
| Chữ dài                | đạt      | tests/e2e-db/dia-ly.spec.ts (E11: tên dự án hiện trọn ở 1024 và 1440); tests/e2e/screens/screens.spec.ts (công thức chu-dai) |
| Không đủ quyền         | đạt      | tests/e2e-db/vai-man.spec.ts — cây đi cùng mục Bảng hàng theo bảng quyền; Quản trị sàn không có mục, không cây |
| Xung đột khi lưu       | không áp | Chọn nơi không ghi gì; góc nhìn lưu theo hàng 2c (tests/second-column-views.test.tsx) |
| Phiên hết hạn          | không áp | Của khung (App Shell), không của vùng |
| Mất mạng khi lưu       | không áp | Chọn nơi không ghi gì |
| Link hết hạn           | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ. Đường dẫn trỏ nơi không còn căn mở bảng như thường (tests/e2e-db/dia-ly.spec.ts, E9) |

### Khối

Không khối mới: nhóm địa lý dựng bằng chính mục của cột thứ hai (khuôn App Shell của hàng 1o), mục con lồng bằng danh sách
con của cùng thành phần Sidebar (nhóm `SidebarGroup`, danh sách con `SidebarMenuSub`).

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| Sidebar | trong-kho | | | | |
| DataRegion | trong-kho | | | | |
