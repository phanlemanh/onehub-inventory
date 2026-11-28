# Hình tại điểm quyết định — chuan-hoa-he-design

| Điểm | Đếm | Hình |
| ---- | --- | ---- |
| Hỏi-1 · Enter là sửa, phím cách là mở hồ sơ | ba nhánh (ô sửa được · ô không sửa được · màn không có ngăn) | `phim-enter-space` |
| Hỏi-2 · bảng màu ở chỗ chủ kho chưa xem | dưới ngưỡng: một lựa chọn, ảnh chụp trước/sau thay hình | — |
| Hỏi-3 · dải «Đang lọc» trên điện thoại | dưới ngưỡng: một lựa chọn, ảnh chụp trước/sau thay hình | — |
| Hỏi-4 · lớp nổi ở nền tối | ba lối (giữ · nửa nấc · trọn nấc): bảng số đo và ảnh ba lối cạnh nhau ở trang cổng thay hình | ảnh `cong-pham-vi/lop-noi-*` |
| Cắt ba lát | dưới ngưỡng: bảng ba dòng ở `design.md` | — |

## Đề bài `phim-enter-space`

- Loại hình: sơ đồ luồng, trái sang phải, hai cột «Hôm nay» và «Sau lát 1».
- Nút: «Chọn một ô» → «Enter» rẽ ba nhánh: «Ô sửa được» → hôm nay «Mở hồ sơ», sau «Mở sửa trên ô»; «Ô không sửa được (khoá, không quyền, mã căn)» → «Mở hồ sơ» cả hai cột; «Màn không có ngăn (Tuỳ chỉnh)» → «Đi xuống một dòng» cả hai cột.
- Nhánh thêm ở cột «Sau»: «Chọn một ô» → «Phím cách» → «Mở hồ sơ» (mọi ô); hôm nay «Phím cách» → «Không làm gì».
- Nhãn bằng chữ tiếng Việt như trên; tô khác màu chỗ đổi (Enter trên ô sửa được, phím cách).
- AC liên quan: AC-4, AC-5.
