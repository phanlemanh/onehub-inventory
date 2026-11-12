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
