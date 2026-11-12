# Hình tại điểm quyết định — bang-quyen-theo-vai

| Điểm | Đếm | Hình |
|---|---|---|
| Bảng quyền ở mô hình nghiệp vụ, API và cơ sở dữ liệu cùng đọc (sổ d-…-3, d-…-4) | 4 bước nối tiếp: bảng → mã sinh → cửa API → bản chép trong cơ sở dữ liệu | mot-bang-ba-lop |
| Hỏi-1 ai đọc thoả thuận | 2 lối, không chuỗi bước | dưới ngưỡng: 1 nhánh |
| Hỏi-2 đổi mô hình nghiệp vụ | 1 gói, không chuỗi bước | dưới ngưỡng: 0 |
| Trạng thái bản ghi để sau | 1 bước | dưới ngưỡng: 1 |

## Đề bài: mot-bang-ba-lop

- Loại hình: luồng dữ liệu (data flow), trái sang phải.
- Nút: «Bảng quyền (ontology/actions.yaml)» → «Mã sinh» → hai nhánh: «Cửa API: requireAction → 403» và «Cơ sở dữ liệu: app.permissions + app.allowed → hàm hẹp, luật theo dòng»; nút phụ «Bài so dòng» nối Mã sinh với app.permissions; nút phụ «Bài quét cửa» nhìn vào route /api/v1 và quyền của vai API.
- Nhãn bằng chữ tiếng Việt đời thường, tên mã chỉ ở dòng phụ nhỏ.
- AC liên quan: AC-1, AC-3, AC-4, AC-5.
