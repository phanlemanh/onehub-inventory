# Chứng minh màn — bo-nut-theo-quyen (hàng 9e)

Hợp đồng không khai màn sản phẩm (`screens: []`, sửa sau Cổng Phạm vi ở V-1211-8): hàng này dựng khuôn bộ nút, chứng minh
họ màn Thành viên là của hàng 9c. Tệp này giữ bảng Khối cho hai khối hàng này nhập kho (`design/so-khoi.yaml`, quyết định
0023) trên mẫu chạy của khuôn `proto-bo-nut` (bản dev, không phải màn sản phẩm). Ứng viên ReUI đã bày ở Cổng Phạm vi
(`cong-pham-vi.html`, chủ kho chọn R1 cho việc trên dòng và X1 cho hộp xoá).

## Màn proto-bo-nut

### Khối

| Khối          | Bậc       | Đã tra                                                     | Ứng viên gần nhất                    | Vì sao không dùng                                                                                     | Cách |
| ------------- | --------- | ---------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------- | ---- |
| DataRegion    | trong-kho |                                                            |                                      |                                                                                                       |      |
| PageHeader    | trong-kho |                                                            |                                      |                                                                                                       |      |
| RowActions    | ve-tay    | `tools/reui_catalog` «row actions», «dropdown», «data grid» | data-grid-base-1, solution-users-1   | ReUI chỉ có «…» nằm trong khối lưới trọn; kho cần một «…» đọc bảng quyền gắn vào `DataRegion` đã có     | ghép DropdownMenu và Button của shadcn, giữ nguyên |
| RecordActions | ve-tay    | `tools/reui_catalog` «record header», «actions»             | data-grid-base-7                     | ReUI đặt nút Sửa trên từng dòng; chủ kho chọn R1, nút chính chỉ ở đầu hồ sơ                           | ghép Button và RowActions |

### Ứng viên ReUI

| Cho           | Ứng viên         | Ảnh                         | Chọn |
| ------------- | ---------------- | --------------------------- | ---- |
| RowActions    | data-grid-base-1 | evidence/ban-bam/dong-R1.png |      |
| RowActions    | data-grid-base-7 | evidence/ban-bam/dong-R2.png |      |
| RecordActions | data-grid-base-7 | evidence/ban-bam/dong-R2.png |      |
| RecordActions | solution-users-1 | evidence/ban-bam/dong-R3-ho-so.png |      |
