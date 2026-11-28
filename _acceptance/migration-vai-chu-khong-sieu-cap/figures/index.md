# Hình tại điểm quyết định — migration-vai-chu-khong-sieu-cap

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Chứng PR trên Postgres 17 bằng tệp đo riêng, ba trạng thái trước khi chạy (dòng sổ thứ 3) | cần hình: ba nhánh rẽ (cơ sở mới · bản thử chỉ có 001_nen · đã áp mọi tệp cũ) | ba-trang-thai.png |
| Không sửa hai ca đỏ trên Postgres 17, không đổi ảnh CI | dưới ngưỡng: 1 bước, không nhánh rẽ | — |
| Gộp Gate 1.5 vào Cổng Phạm vi | dưới ngưỡng: 1 bước | — |

## Đề bài — ba-trang-thai

- Loại hình: sơ đồ luồng, ba nhánh song song từ trái sang phải, hội về một ô so sánh.
- Nút: «Vai chủ giả Supabase (không siêu vai, có CREATEROLE · CREATEDB · BYPASSRLS)» → ba nhánh: (1) «Cơ sở mới» → «áp
  001_nen, 001_vai, 002…014, 004 theo thứ tự tên»; (2) «Như bản thử: mới áp 001_nen» → «chạy lại: áp nốt 14 tệp»; (3)
  «Máy dãy: siêu vai đã áp 13 tệp cũ» → «chạy lại: chỉ áp 001_vai rồi 004».
- Ba nhánh hội về «So với bản siêu vai: chủ và quyền giống hệt, vai danh tính không giữ CREATE».
- Nhánh đối chứng tách riêng, màu cảnh báo: «Bỏ 001_vai và 004 → dừng ở 002: must be able to SET ROLE».
- AC liên quan: AC-1 (đối chứng), AC-2 (nhánh 1, 2), AC-3 (ô hội), AC-4 (nhánh 3).
