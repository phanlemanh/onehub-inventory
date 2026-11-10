# Hình tại điểm quyết định — cach-ly-moi-san

| Điểm                                                          | Đếm                                          | Hình                    |
| ------------------------------------------------------------- | -------------------------------------------- | ----------------------- |
| Cửa withCompany (lựa chọn 2, AC-7)                            | 5 bước nối tiếp, 2 nhánh (commit / rollback) | `cua-va-bo-kiem.html`   |
| Bộ kiểm cách ly chạy qua psql, không gói pg (lựa chọn 4, AC-9) | 4 bước nối tiếp, 5 nhánh (lành + 4 bản phá)  | `cua-va-bo-kiem.html`   |
| Chép nguyên văn 001 từ Quỹ hàng (lựa chọn 1)                  | dưới ngưỡng: 1 bước                          | —                       |
| Quét danh mục theo cột company_id (lựa chọn 4)                | dưới ngưỡng: 1 bước, 1 nhánh                 | —                       |
| Bỏ chạy bộ kiểm trên CI (descope)                             | dưới ngưỡng: 0 bước                          | —                       |
| Bỏ ca thời chạy của cửa trên Postgres thật (descope)          | dưới ngưỡng: 0 bước                          | —                       |
| [CE chưa kiểm chứng] cửa thời chạy chỉ đo bằng bể giả         | dưới ngưỡng: 1 bước                          | —                       |

## Đề bài hình `cua-va-bo-kiem`

- Loại: sơ đồ luồng hai làn, trái là «một truy vấn đi qua cửa», phải là «bộ kiểm cách ly chứng minh cửa giữ».
- Làn trái: mã nghiệp vụ → withCompany → begin → đổi sang vai không sở hữu bảng → đặt người và sàn (chỉ cho giao dịch)
  → việc → luật theo dòng của Postgres lọc theo sàn → ghi (thành công) hoặc huỷ (lỗi), kết nối luôn trả về bể.
- Làn phải: cơ sở nháp mới → áp migration hai lần → 14 ca SQL dưới vai của API (dùng đúng hai câu của cửa) → bốn bản
  phá, mỗi bản phải đỏ đúng thông điệp → dòng tổng «19 ca đạt».
- Nối giữa hai làn: mũi tên «cùng hai câu» từ bước đổi vai và đặt sàn sang các ca SQL (AC-7 ràng câu).
- AC liên quan: AC-2..AC-9.
