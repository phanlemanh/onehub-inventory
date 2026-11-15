# Hình tại điểm quyết định — refresh-design-assembly-tool

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Chép cả thư mục công cụ hay chỉ tệp sửa ghi trùng (câu hỏi của sổ bước thiết kế) | 2 nhánh rẽ | cần hình: `tool-scope-choice` |
| Hồ sơ chấm thay đổi đã làm, không làm lại | 1 bước, 0 nhánh | dưới ngưỡng |
| «Khớp plugin» đo bằng dấu vân tay ghim sẵn | 1 bước, 0 nhánh (lối kia chết) | dưới ngưỡng |
| Phép đo nằm ở `rang/`, không thêm vào `tools/` | 1 bước, 0 nhánh | dưới ngưỡng |
| Bỏ quét không gian tiêu chí | 1 bước, 0 nhánh | dưới ngưỡng |
| Bỏ đặc tả UX | 1 bước, 0 nhánh | dưới ngưỡng |
| Không đo hành vi phần đọc sổ màn nối mô hình | 1 bước, 0 nhánh | dưới ngưỡng |

## Đề bài hình `tool-scope-choice`

- Loại hình: cây quyết định hai nhánh, đọc từ trái sang phải.
- Nút gốc: «Công cụ ở Inventory lệch plugin ở năm tệp».
- Nhánh A (nhánh đã làm, máy khuyên): «Chép cả thư mục» → «Một phiên bản công cụ, khớp plugin từng byte (AC-3)» và
  «Phần đọc sổ màn đi kèm, chưa chạy ở kho này (AC-4)».
- Nhánh B: «Chỉ chép tệp sửa ghi trùng» → «Ít mã chưa dùng hơn» và «Công cụ thành bản trộn hai phiên bản; AC-3 phải viết
  lại cho một tệp».
- Cả hai nhánh cùng tới: «Sổ linh kiện hết ghi trùng chín linh kiện bộ lọc (AC-2)».
