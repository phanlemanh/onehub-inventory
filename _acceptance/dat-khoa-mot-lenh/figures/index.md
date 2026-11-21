# Hình tại điểm quyết định — dat-khoa-mot-lenh

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Lệnh đưa bản lên lệch hàng 22: hai bước mới, khoá đi một đường từ chủ kho tới Vercel | 9 bước nối tiếp, 3 nơi giữ (GitHub, Supabase, Vercel) | `luong-khoa.html` |
| Hỏi-1: địa chỉ bản thử và địa chỉ gửi thư | 2 nhánh, không bước nối tiếp | dưới ngưỡng: 2 |
| Hỏi-2: phạm vi quyền đứng | 1 danh sách, không bước nối tiếp | dưới ngưỡng: 1 |

## Đề bài `luong-khoa`

- Loại hình: luồng (data flow), trái sang phải, hai làn.
- Làn trên «Chủ kho»: tạo khoá ở dịch vụ (Vercel, Resend, Supabase) → chạy `make dat-khoa`, dán từng khoá → khoá vào môi
  trường GitHub. Cạnh hai khoá tự sinh: khoá đăng nhập của ứng dụng, mật khẩu vai đăng nhập.
- Làn dưới «Lượt Deploy trên CI»: chín bước của bản thử — kiểm cấu hình → migration → đặt mật khẩu vai (dạng băm) →
  kiểm cách ly → đẩy sáu biến sang Vercel → dựng → kiểm nhanh → gắn tên miền → kiểm tên miền. Hai bước mới tô nổi.
- Nhãn bằng chữ: «máy không thấy giá trị khoá»; «đỏ trước gắn tên miền thì tên miền không đổi».
- AC liên quan: AC-1, AC-4, AC-5, AC-7.
