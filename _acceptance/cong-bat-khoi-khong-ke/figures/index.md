# Hình tại điểm quyết định — cong-bat-khoi-khong-ke

| Điểm | Đếm | Hình |
|---|---|---|
| Luật kê ba chỗ + Hỏi-2 (tệp đã kê có thành phần mới) | 3 bước nối tiếp + 2 nhánh rẽ | luat-ke.html |
| Hỏi-1 (miễn mười hai tệp có trước hay bù sổ) | dưới ngưỡng: 1 bước, 2 lối | — |

## Đề bài luat-ke

- Loại: sơ đồ luồng quyết định, trái sang phải.
- Nút: «Tệp trong sổ thành phần» → «Thư mục nhà cung cấp?» (có → im) → «Có ở sổ khối?» → «Có ở danh sách có trước?» → «Bảng Khối của hồ sơ đang mở nêu một thành phần của tệp?» → không → «Đỏ: khoi-khong-ke». Mỗi «có» → «Đã kê».
- Nhánh Hỏi-2 ở nút «Đã kê»: thành phần mới thêm vào tệp đã kê — lối A (khuyên): vẫn đã kê · lối B: đỏ nếu tên không có ở bảng Khối.
- Nhãn bằng chữ Việt như trên; AC liên quan: AC-1, AC-2, AC-3.
