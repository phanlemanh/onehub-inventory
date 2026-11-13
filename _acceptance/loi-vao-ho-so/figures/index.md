# Hình tại điểm quyết định — loi-vao-ho-so

| Điểm | Đếm | Hình |
|---|---|---|
| Hai lối vào cùng Bảng hàng (Hỏi-1, Hỏi-3) | 4 bước nối tiếp, 3 nhánh rẽ (một căn · nhiều toà · không có) | cần hình — `luong-loi-vao` (vẽ lại sau lời chủ kho ở Cổng Phạm vi) |
| Hỏi-4 đường dẫn cũ | dưới ngưỡng: 1 bước, 2 lối | — |

## Đề bài `luong-loi-vao`

- Loại: luồng (flowchart), trái sang phải.
- Ba điểm vào: «Mở toàn màn» ở hồ sơ cạnh Bảng hàng · «Gõ mã căn» ở thanh trên (⌘K, «/») · đường dẫn đồng nghiệp gửi.
- Cả ba về một nút: «Trang riêng /inventory/units/<mã>?toa=&ho-so=» → phép tìm căn rẽ ba nhánh: một căn → hồ sơ (thân hàng 3)
  + «Chép đường dẫn» → «Đã chép đường dẫn»; nhiều toà → «Nhiều căn — chọn toà» → bấm toà → hồ sơ; không có → «Không có căn
  này trong Bảng hàng» → «Về Bảng hàng».
- AC: AC-1, AC-3, AC-4, AC-5, AC-6, AC-7.
