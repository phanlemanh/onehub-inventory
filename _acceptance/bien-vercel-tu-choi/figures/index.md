# Hình tại điểm quyết định — bien-vercel-tu-choi

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1 — gộp Ngoài-2 (lần đọc không có danh sách biến) | 2 nhánh rẽ (gộp · không gộp) | buoc-bien.html |
| Hỏi-2 — đòi đủ sáu tên trong câu trả lời ghi | 2 nhánh rẽ (đủ sáu · câu đề) | buoc-bien.html |
| P1 gap-probe — câu trả lời thật của Vercel chưa có (human-gate1) | cùng điểm với Hỏi-2 | buoc-bien.html |

## Đề bài: buoc-bien

- Loại hình: flowchart dọc, một luồng chính và các nhánh đỏ ra bên phải.
- Nút: «Đọc danh sách biến của Vercel» → [Hỏi-1] «Có danh sách biến?» (không → đỏ «danh sách biến không đúng khuôn», 0 lần
  ghi) → «Có biến cấm?» (có → đỏ «biến cấm <tên>») → «Ghi sáu biến» → «Vercel từ chối biến nào?» (có → đỏ «từ chối ghi biến
  <tên> (<mã>)») → [Hỏi-2] «Vercel xác nhận đủ sáu?» (thiếu → đỏ «không xác nhận đã ghi biến <tên>») → «bien đạt» →
  «Dựng bản».
- Mọi nút đỏ dẫn tới một nút chung «DỪNG — bản chưa dựng, tên miền không đổi».
- Hai nút có nhãn Hỏi-1, Hỏi-2 được tô khác (chờ chủ kho); chú thích ngắn cạnh Hỏi-2: «chưa có câu trả lời thật của
  Vercel — ca xanh không chứng được».
- AC liên quan: AC-1, AC-3, AC-4, AC-5.
