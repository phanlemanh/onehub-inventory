# Hình tại điểm quyết định — upgrade-design-assembly-tool

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1: nhận rằng sau khi gộp không gì canh cây công cụ, hay chép bước cổng mới ngay | 2 nhánh rẽ | cần hình: `tool-guard-choice` |
| Hồ sơ chấm thay đổi đã làm, không làm lại | 1 bước, 0 nhánh | dưới ngưỡng |
| Lỗi ở công cụ sửa bằng bản plugin mới, không sửa tay | 1 bước, 0 nhánh (lối kia chết) | dưới ngưỡng |
| «Công cụ đúng bản 0.1.0» đo bằng mã cây ghim và sổ phát hành | 1 bước, 0 nhánh (lối kia chết) | dưới ngưỡng |
| Phép đo nằm ở `rang/`, không thêm vào `tools/` | 1 bước, 0 nhánh | dưới ngưỡng |
| Không sửa hồ sơ refresh-design-assembly-tool đã ký | 1 bước, 0 nhánh (lối kia chết) | dưới ngưỡng |
| Bỏ quét không gian tiêu chí | 1 bước, 0 nhánh | dưới ngưỡng |
| Bỏ đặc tả UX | 1 bước, 0 nhánh | dưới ngưỡng |
| Không đo cách lệnh upgrade chạy | 1 bước, 0 nhánh | dưới ngưỡng |

## Đề bài hình `tool-guard-choice`

- Loại hình: cây quyết định hai nhánh, đọc từ trái sang phải.
- Nút gốc: «Sau khi gộp: kho chạy công cụ bản 0.1.0, có dấu phiên bản».
- Nhánh A (máy khuyên): «Nhận tới lần lên đời sau» → «Cổng kiểm của kho không canh cây công cụ» và «Lệnh status và
  upgrade của plugin đọc dấu khi được gọi» → «Bước cổng vào kho cùng bản plugin biết ghi nó».
- Nhánh B: «Chép bước cổng mới ngay» → «Thay đổi thêm ở cổng kiểm (vùng hạng cao nhất)» và «Thêm một tiêu chí, lượt chấm
  dài hơn» → «Sửa tay một tệp công cụ làm cổng đỏ ngay».
- Ghi chú dưới hình: AC-2 chứng minh cây công cụ đúng bản 0.1.0 tại lúc gộp, ở cả hai nhánh.
