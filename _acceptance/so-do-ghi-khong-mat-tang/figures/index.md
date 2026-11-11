# Hình tại điểm quyết định — so-do-ghi-khong-mat-tang

| Điểm | Đếm | Hình |
|---|---|---|
| d-20261111T043649Z-3 · bản cũ hỏng thì dừng, không ghi đè | 4 nhánh rẽ (vắng · hợp lệ · không đọc được · không phải JSON · sai hình dạng) | luong-ghi |
| d-20261111T043649Z-4 · không thêm cờ ghi đè, hai đường gỡ | dưới ngưỡng: 1 bước, không rẽ | — |
| d-20261111T043649Z-5 · sáu dạng sai hình dạng | dưới ngưỡng: một danh sách, không rẽ | — |
| d-20261111T043649Z-6 · gop giữ giới hạn đã biết | dưới ngưỡng: 0 bước | — |
| d-20261111T043649Z-7 · phá thử bằng thư mục | dưới ngưỡng: 0 bước | — |

## Đề bài: luong-ghi

- Loại hình: luồng quyết định (flowchart), trên xuống.
- Nút: «chạy ghi» → «có bản số đo cũ?» — không → «dựng từ sổ chạy + --phan» → «ghi bản mới (thoát 0)»; có → «đọc được?» — không → «DỪNG thoát 1: khong doc duoc»; được → «là JSON?» — không → «DỪNG: khong phai JSON»; có → «đúng hình dạng?» — không → «DỪNG: sai hinh dang + chỗ sai»; đúng → «giữ tầng cũ, --phan thắng» → «ghi bản mới (thoát 0)».
- Ba nút DỪNG cùng chú thích: «không ghi đè · gỡ: khôi phục từ git, hoặc xoá tệp rồi khai lại bằng --phan».
- AC liên quan: AC-1 (không đọc được), AC-2 (không phải JSON), AC-3 (sai hình dạng), AC-4 (đường gỡ), AC-5 (nhánh lành).
