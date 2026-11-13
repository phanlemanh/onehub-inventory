# Hình tại điểm quyết định — sua-tren-o

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · lần sửa ghi vào đâu | hai nhánh rẽ (bộ mẫu trên trình duyệt / cửa API trên kho bộ nhớ), mỗi nhánh ba bước tới hàng 10 | `hoi-1-ghi-vao-dau.html` |
| Hỏi-2 · danh sách lý do ngừng | dưới ngưỡng: một bước chọn danh sách, không nhánh luồng | — |
| Hỏi-3 · Đã bán là nấc cuối và khoá | hai nhánh rẽ sau khi ghi Đã bán (khoá ngay / hoàn tác được trong lúc thông báo còn hiện rồi khoá) | `hoi-3-da-ban-nac-cuoi.html` |
| Gap-probe xử lý human-gate1 | 0 điểm | — |

## Đề bài hình

### hoi-1-ghi-vao-dau

- Loại hình: luồng hai nhánh (flowchart), trái sang phải.
- Nút: «Đầu chủ sửa ô» → «Cổng lưu (một chỗ)» → nhánh A «Bộ dữ liệu mẫu trên trình duyệt — tải lại thì về mẫu» → «Hàng 10 cắm đường ghi /api/v1 thật vào cổng» · nhánh B «PATCH /api/v1/listings/{id} — kho mẫu trong bộ nhớ máy chủ» → «Bảng quyền: updateListing sang live, bản thay đổi 011» → «Hàng 10 thay kho bộ nhớ bằng bảng».
- Nhãn: A «khuyến nghị · nhanh, hạng giữ nguyên»; B «+ nửa ngày · «Không đủ quyền» đo trên máy chủ thật sớm hơn».
- AC liên quan: AC-2, AC-7, AC-8.

### hoi-3-da-ban-nac-cuoi

- Loại hình: luồng hai nhánh, trái sang phải.
- Nút: «Chọn Đã bán, điền giá chốt và ngày» → «Khung nói trước: không hoàn tác được» → «Ghi» → nhánh A «Khoá ngay: thông báo không có Hoàn tác, ô Giá và Trạng thái khoá» · nhánh B «Thông báo có Hoàn tác khoảng 10 giây» → «Hết giờ thì khoá».
- Nhãn: A «khuyến nghị · như Quỹ hàng»; B «+ khoảng hai giờ · đỡ sửa nhầm».
- AC liên quan: AC-5, AC-6.
