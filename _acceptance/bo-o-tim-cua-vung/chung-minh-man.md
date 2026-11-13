# Chứng minh màn — bo-o-tim-cua-vung

Hàng 2e bỏ ô tìm của vùng ở lưới dùng chung, nên hai màn họ Lưới đang có vùng cùng đổi: Bảng hàng (`inventory`, màn mẫu
của họ) và Đã gửi (`sent`, theo mẫu). Ma trận trạng thái, ảnh cạnh màn mẫu, mặt so và bảng Khối điền ở đợt B (S3), trước
lượt chấm.

## Màn inventory

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/bang-hang.md | Bảng hàng lọc theo ô đầu cột như Sheet, ô tìm của vùng («tầng 18, trục 08» gõ nhanh hơn tìm) | lọc bằng ô dưới tiêu đề cột, chồng nhiều cột | ô tìm của vùng | chủ kho chốt 2026-11-13 lối A: một chỗ để gõ lọc; tìm chuyển lên ô ⌘K của thanh trên (hàng 3f) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | màn mẫu mới | `design/patterns/luoi.md` ghi `Màn: inventory`: hàng này sửa chính màn mẫu (bỏ ô tìm, hàng ô lọc luôn hiện, trạng thái «Không có dòng nào khớp»), nên ma trận trạng thái của nó đo lại |

### Ứng viên ReUI

Ba lưới của ReUI có lọc theo cột hay bộ lọc, để so với lối lọc đầu cột; không chọn ứng viên nào — vùng giữ khối Lưới trong
kho (`DataRegion`), chỉ bớt ô tìm và cho hàng ô lọc luôn hiện (Hỏi-1, chủ kho duyệt 2026-11-13).

| Cho | Ứng viên | Ảnh | Chọn |
| --- | -------- | --- | ---- |
| màn | data-grid-grouping-1 | evidence/reui-data-grid-grouping-1.png | |
| màn | data-grid-filtering-3 | evidence/reui-data-grid-filtering-3.png | |
| màn | data-grid-columns-1 | evidence/reui-data-grid-columns-1.png | |

Bản bấm được của hai lối Hỏi-1 (sau nút «Lọc» · luôn hiện): ảnh bốn khổ sáng tối ở `figures/proto/`.

## Màn sent

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| ----- | --------------------- | --- | --- | ------ |
| docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md | danh sách link đã gửi trên cùng Lưới với Bảng hàng (hàng 6) | lọc link bằng ô dưới tiêu đề cột | ô tìm của vùng | cùng lưới dùng chung với Bảng hàng; lời chốt 2026-11-13 áp cho mọi màn họ Lưới |

### Họ

| Họ đề xuất | Lối | Vì sao |
| ---------- | --- | ------ |
| grid | theo mẫu | `design/screens.yaml` khai sent thuộc họ grid; `design/patterns/luoi.md` ghi màn mẫu là inventory, nên Đã gửi so cạnh Bảng hàng |
