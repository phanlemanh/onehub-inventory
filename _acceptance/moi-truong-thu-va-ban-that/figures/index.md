# Hình tại điểm quyết định — hàng 22

| Điểm | Đếm | Hình |
|---|---|---|
| Luồng đưa bản lên (sổ: áp migration trước, gắn tên miền sau kiểm) | 8 bước nối tiếp, 2 nhánh rẽ (đỏ trước / sau gắn tên miền) | luong-dua-ban-len |
| Hỏi-1 chi phí | 3 lối, bảng là đủ | dưới ngưỡng: bảng 3 cột |
| Hỏi-2 ai bấm bản thật | 2 bước | dưới ngưỡng: 2 |
| Hỏi-3 sao lưu | 2 lối | dưới ngưỡng: 2 |
| Hỏi-4 migration giữ bản cũ | 2 bước | dưới ngưỡng: 2 |
| Hỏi-5 dữ liệu bản thử | 2 lối | dưới ngưỡng: 2 |
| Việc ngoài kho theo thứ tự | 8 bước nối tiếp | viec-ngoai-kho |

## Đề bài

### luong-dua-ban-len
- Loại: flowchart dọc, hai làn «Bản thử» rồi «Bản thật».
- Nút bản thử: Kiểm cấu hình → Áp migration → Kiểm cách ly → Dựng bản mới (chưa gắn tên miền) → Kiểm nhanh chỉ đọc → Gắn tên miền → Kiểm lại trên tên miền.
- Bản thật: Kiểm cấu hình → Bản thử đã chạy đúng bản này? → Áp migration → Dựng → Kiểm nhanh → Gắn tên miền → Kiểm lại; giữa hai làn có cổng «Chủ kho duyệt».
- Nhánh: bất kỳ bước trước «Gắn tên miền» đỏ → «Dừng — tên miền không đổi»; «Kiểm lại» đỏ → «Tự lùi về bản trước».
- AC: AC-1, AC-2, AC-3.

### viec-ngoai-kho
- Loại: timeline đánh số 1–8, mỗi bước một ô: việc của chủ kho · máy nhận lại (tên biến).
- 1 Chọn gói · 2 Supabase hai dự án Singapore, tắt Data API · 3 Vercel hai dự án, vùng Singapore, tắt tự triển khai → VERCEL_ORG_ID, VERCEL_PROJECT_ID · 4 Resend xác minh tên miền → MAIL_FROM · 5 Trỏ tên miền → APP_URL · 6 Nhập khoá → DATABASE_URL, AUTH_SECRET, RESEND_API_KEY, APP_ENV, VERCEL_TOKEN, MIGRATE_DATABASE_URL, LOGIN_DATABASE_URL · 7 Đặt hai tệp tự động triển khai, người duyệt production · 8 Lần đưa bản đầu, thử khôi phục.
- AC: AC-9.
