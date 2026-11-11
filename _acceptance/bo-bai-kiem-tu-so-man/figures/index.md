# Hình tại điểm quyết định — bo-bai-kiem-tu-so-man

| Điểm | Đếm | Hình |
|---|---|---|
| Tệp kiểm đọc sổ lúc chạy, dựng bài từ công thức (sổ quyết định dòng 3–4) | 4 bước nối tiếp (sổ → bộ đọc 1d → công thức → bộ khung/bộ vùng) | `luong-bo-sinh` |
| Màn nào nhận bộ nào (dòng 5–6) | 4 nhánh rẽ (planned/dev bỏ · không họ → khung · Lưới có vùng → khung + vùng · Lưới chưa vùng → bỏ qua có tên · Lưới ngoài khuôn → đỏ) | `luong-bo-sinh` (cùng hình) |
| Ca chính và ca phá dùng chung một hàm kiểm (bốn lỗ của 1b) | 3 bước (đưa vào → phá → cùng hàm kiểm đỏ đúng lời) | `luong-bo-sinh` (cùng hình) |
| Hỏi-1 vai (dòng 7) | dưới ngưỡng: 2 lối, không bước nối tiếp | — |
| Ca phá chỉ ở khổ 1440 (dòng 8) | dưới ngưỡng: 1 lựa chọn | — |

## Đề bài hình `luong-bo-sinh`

- Loại: luồng (flowchart) trái sang phải.
- Nút: «Sổ màn + bản khai vai» → «Bộ đọc của hàng 1d (sổ sai → đỏ, gọi đúng lỗi)» → rẽ theo màn: «planned / dev → dòng bỏ qua có tên» · «màn built → Bộ khung (tiêu đề, cuộn ngang, lỗi trình duyệt, axe sáng/tối)» · «họ Lưới có vùng, và bản mẫu Lưới → Bộ vùng 7 trạng thái» · «họ Lưới chưa có vùng → bỏ qua có tên» · «bảng ngoài vùng dùng chung → đỏ "lưới dựng ngoài khuôn"».
- Mỗi công thức: «đưa vào trạng thái» → «một hàm kiểm» ← «ca phá (phá đúng chỗ đo)»; ca chính đòi xanh, ca phá đòi chính hàm ấy đỏ đúng thông điệp ghim.
- Nhãn bằng chữ, tiếng Việt; AC liên quan: AC-1, AC-2, AC-4, AC-6, AC-7.
