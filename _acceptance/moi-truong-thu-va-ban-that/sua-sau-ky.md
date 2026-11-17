# 22 · Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hàng 22 và hàng đã vào nhánh chính (PR #81). Lúc soát trước lần đưa bản đầu, dãy K
thấy hai chỗ phải sửa trong kho. Giám sát mở việc phụ VP6 (G-1611-90); thay đổi cơ sở dữ liệu là tầng T3 nên chủ kho
duyệt kế hoạch tại phiên dãy K ngày 17/11/2026, nguyên văn «Kế hoạch VP6 (thu quyền khoá công khai Supabase + kiểu dự
án Vercel) — duyệt hay sửa: duyệt».

## Việc phụ VP6, 17/11/2026

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `vercel.json` thêm `"framework": "nextjs"` — hai dự án Vercel đang để kiểu «Other» nên bản dựng không ra Next.js | Có: bản dựng trên Vercel chạy đúng ứng dụng | Lần đưa bản thử đầu (việc vận hành) | G-1611-90 |
| `db/migrations/014_thu_quyen_vai_cong_khai.sql`: thu mọi quyền của `anon`, `authenticated`, `service_role` và PUBLIC trên các lược đồ của ta, đổi quyền mặc định để migration sau không mở lại; trên Postgres không có các vai ấy thì bỏ qua | Không với người dùng; đóng lỗ khoá công khai của Supabase đọc được dữ liệu các sàn (SP-1) | `tests/db/thu-quyen-vai-cong-khai.db.test.ts` (cụm riêng dựng kiểu Supabase; chỉ chạy tới 013 thì đỏ gọi tên bảng và vai); `cach-ly-dich` xanh trên cụm ấy | G-1611-90, chủ kho duyệt kế hoạch |
| Trang quyết định [0044](../../wiki/decisions/0044-thu-quyen-vai-khoa-cong-khai.md) | Không | — | G-1611-90 |

Bằng chứng cuối cho SP-1 là `make cach-ly-dich` xanh trên bản thử thật sau khi VP6 gộp. Hồ sơ được ghim lại trên bản có
thay đổi này.
