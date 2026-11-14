# Hình tại Cổng Phạm vi — adopt-design-assembly

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1: phủ tiêu chí bằng bảng sáu bước hay chạy morphological-scan (d-20261114T134424Z-12) | hai nhánh rẽ | cần hình: `coverage-choice` |
| Dòng sổ máy quyết chờ niêm phong (luật nạp, tra tri thức, chấm thay đổi đã làm, chỗ đặt phép đo, bỏ đặc tả UX, bỏ đường «không thể đỏ», giữ cỡ) | mỗi dòng một bước | dưới ngưỡng: 1 bước mỗi dòng |
| Phát hiện phản biện xử lý human-gate1 | một (là Hỏi-1) | gộp vào hình `coverage-choice` |

## Đề bài `coverage-choice`

- Loại hình: cây quyết định, một gốc, hai nhánh.
- Gốc: «Mỗi thứ nhánh đổi đã có tiêu chí chưa?»
- Nhánh A (máy khuyên): «Giữ bảng sáu bước» → sáu bước trỏ AC-1…AC-11, bước 5 ngoài phạm vi → «chấm ngay, 11 tiêu chí».
- Nhánh B: «Chạy morphological-scan» → «thêm một lượt máy, có thể thêm tiêu chí» → «Cổng Phạm vi kéo dài».
- AC liên quan: mục Coverage của contract.md.
