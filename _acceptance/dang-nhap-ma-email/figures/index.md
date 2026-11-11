# Hình tại điểm quyết định — dang-nhap-ma-email

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 tự viết hay better-auth | hai nhánh rẽ, mỗi nhánh bốn bước nối tiếp | `hai-loi-dang-nhap.html` |
| Hỏi-2 năm số của đăng nhập | dưới ngưỡng: một lựa chọn có/không | — |
| Hỏi-3 chưa bắt đăng nhập ở màn mẫu | dưới ngưỡng: một lựa chọn có/không | — |
| Hỏi-4 nhà gửi thư | dưới ngưỡng: một lựa chọn có/không | — |

## Đề bài `hai-loi-dang-nhap`

- Loại hình: luồng so sánh hai làn (lối A trên, lối B dưới), cùng điểm đầu «Trình duyệt gửi email + mã» và điểm cuối «Truy vấn của sàn qua withCompany».
- Lối A (khuyến nghị) «Tự viết»: Đường /api/v1/auth → cửa withCompany (vai quy_hang_app) → hàm hẹp quyền chủ → schema identity (chỉ chủ đọc); bảng thành viên lọc theo sàn; bộ kiểm cách ly giữ nguyên, xanh.
- Lối B «better-auth»: Đường /api/v1/auth → thư viện better-auth → kết nối chủ thứ hai (ngoài cửa) → schema identity chép từ Quỹ hàng; bảng thành viên có luật đọc theo người → bộ kiểm cách ly đỏ, phải thêm danh sách cho phép; bài quét một cửa phải thêm tệp miễn.
- Nhãn bằng chữ tiếng Việt; tô đỏ hai ô «bộ kiểm cách ly đỏ» và «thêm tệp miễn».
- AC liên quan: AC-6, AC-9.
