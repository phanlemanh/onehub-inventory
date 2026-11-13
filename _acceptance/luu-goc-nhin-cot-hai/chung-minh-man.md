# Chứng minh màn — luu-goc-nhin-cot-hai

Hàng 2c thêm góc nhìn đã lưu vào màn Bảng hàng (`inventory`), màn mẫu của họ Lưới. Mục ma trận trạng thái, khối, vùng và
dòng sổ khối điền ở S3, trước lượt chấm.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/app-shell.md | `app-shell-8`: cột thứ hai theo nhà là chỗ của góc nhìn đã lưu («góc nhìn của đội, của tôi, + Lưu góc nhìn») | chỗ đặt ở cột thứ hai của nhà Bảng hàng | thẻ chân cột độ tươi | hàng 1o đã chọn `app-shell-8` với cột thứ hai; độ tươi chưa có số đo |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | `solution-dev-ops-2`: nút «Góc nhìn ▾» đầu thanh công cụ lưu lọc, cột, sắp xếp, cách nhóm | năm thứ một góc nhìn mang; nút ấy thành ứng viên S3 | lưu trên máy theo người và sàn | kho này chưa cho giữ dữ liệu của sàn trên máy (AGENTS.md); máy khuyên lưu trên máy chủ (Hỏi-1) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | màn mẫu mới | `design/patterns/luoi.md` ghi `Màn: inventory`: hàng này sửa chính màn mẫu nên ma trận trạng thái của nó đo lại các trạng thái mới (danh sách góc nhìn rỗng, đang đọc, lưu hỏng, không còn, lọc ra rỗng) |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | c-sidebar-1 | evidence/reui-c-sidebar-1.png | ✓ |
| màn | solution-dev-ops-2 | evidence/reui-solution-dev-ops-2.png | |
| màn | data-grid-drag-drop-3 | evidence/reui-data-grid-drag-drop-3.png | |

Bản bấm được của các lối ghép từ ứng viên trên: `/proto/luu-goc-nhin` (L1, L2 cho danh sách; S1, S2, S3 cho cách lưu),
ảnh bốn khổ sáng tối ở `figures/proto/`. Chủ kho duyệt Cổng Phạm vi 2026-11-12 theo khuyến nghị (L1 không số, S1, riêng người lưu, lưu trên máy chủ, không tự lưu); cả cột thứ hai một kiểu mục con.

### Ma trận trạng thái

Hàng này đo lại các trạng thái của màn mẫu Bảng hàng với phần góc nhìn mới; trạng thái của vùng Lưới cũ giữ căn cứ của 2a.

| Trạng thái       | Kết quả  | Căn cứ                                                                                                                                                         |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chờ tải          | đạt      | tests/second-column-views.test.tsx (nhóm góc nhìn có đủ mục từ lần vẽ đầu ở cột máy tính và ngăn điện thoại, không khung chờ — G K-1311-1); tests/e2e/screens/screens.spec.ts (vùng Lưới) |
| Trống            | đạt      | tests/second-column-views.test.tsx (chưa có góc nhìn: câu gợi ý trong nhóm)                                                                                    |
| Tìm không ra     | đạt      | tests/grid-sheet.test.tsx (no match keeps the toolbar); tests/e2e/sheet.spec.ts (no match keeps filters, bốn khổ)                                              |
| Lỗi              | đạt      | tests/second-column-views.test.tsx (lưu hỏng giữ tên, «Thử lại»; góc nhìn không đọc được, App Shell vẫn dùng được)                                             |
| Một phần hỏng    | đạt      | tests/e2e/screens/screens.spec.ts (công thức mot-phan-hong của vùng Lưới, không đổi)                                                                           |
| Chữ dài          | đạt      | tests/e2e-db/goc-nhin.spec.ts (tên góc nhìn dài cắt bằng «…», đủ tên khi rê); tests/e2e/screens/screens.spec.ts (vùng Lưới)                                    |
| Không đủ quyền   | đạt      | tests/second-column-views.test.tsx (403 hiện câu của khuôn 9e); tests/db/goc-nhin.db.test.ts (Quản trị sàn nhận 403)                                           |
| Xung đột khi lưu | không áp | Góc nhìn là của riêng người lưu, không ai khác sửa được (AC-7); hai cửa sổ của cùng người thì lần lưu sau thắng như ghi đè có chủ ý                              |
| Phiên hết hạn    | không áp | Của khung (App Shell), không của vùng                                                                                                                          |
| Mất mạng khi lưu | đạt      | tests/second-column-views.test.tsx (lưu hỏng vì mạng: hộp giữ tên đã gõ, câu lỗi, «Thử lại»)                                                                    |
| Link hết hạn     | không áp | Trạng thái của trang khách; Bảng hàng là màn nội bộ. Địa chỉ của góc nhìn đã xoá: tests/e2e-db/goc-nhin.spec.ts (remove, câu «… không còn»)                    |

### Khối

| Khối                     | Bậc       | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| ------------------------ | --------- | ------ | ----------------- | ----------------- | ---- |
| DataRegion               | trong-kho |        |                   |                   |      |
| PageHeader               | trong-kho |        |                   |                   |      |
| RowActions               | trong-kho |        |                   |                   |      |
| FormDialog               | trong-kho |        |                   |                   |      |
| ShellFocus               | trong-kho |        |                   |                   |      |
| data-grid-grouping-2     | trong-kho |        |                   |                   |      |

Nhóm «Góc nhìn của tôi» là mục con của cột thứ hai App Shell (hàng 1o) dựng bằng `SidebarMenuSub` của shadcn, cùng kiểu với
«Theo trạng thái» như chủ kho chốt; dấu «đã đổi» là `Badge` của ReUI; nút lưu là `Button` của shadcn. Không khối nào mới
vào kho ở hàng này, nên không có dòng sổ khối và mục Vùng.
