# Điểm quyết định ở Cổng Phạm vi — danh-muc-reui

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · chép tên và mô tả ReUI vào kho công khai (d-20261111T012410Z-7) | hai lối, không chuỗi bước | dưới ngưỡng: 2 nhánh, nhưng mỗi nhánh một bước — câu chữ đủ |
| Bản ghim là ảnh chụp có băm (d-20261111T012410Z-3) cùng đường sinh lại, tra, kiểm, ghim lại (d-12, d-5) | 5 bước nối tiếp, 2 nhánh (tra / kiểm) | cần hình: `luong-ghim.html` |
| Phạm vi loại mục (d-20261111T012410Z-4) | 1 bước | dưới ngưỡng |
| Quét chuỗi cấm cả ảnh chụp (d-20261111T013136Z-13) | 1 bước | dưới ngưỡng |

## Đề bài: luong-ghim

- Loại hình: sơ đồ luồng trái sang phải, một nhánh tách ở cuối.
- Nút: «reui.io (mạng)» → [chỉ khi ghim lại] «Ảnh chụp trong kho + tệp ghim (SHA-256, ngày)» → «Lệnh sinh lại (không mạng)» → «Danh mục trong kho (tên, tiêu đề, mô tả)» → tách hai nhánh: «Lệnh tra (agent dùng)» và «Bộ kiểm trong make check: băm khớp · sinh lại trùng byte · mọi mục tra ra · không chuỗi cấm».
- Nhãn trên cạnh đầu: «chỉ khi người chạy ghim lại — đường mạng duy nhất».
- Ghi chú dưới: «Ô đỏ khi: băm lệch · số mục lệch số khai · mục tra không ra · có mã hay khoá».
- AC liên quan: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7.
