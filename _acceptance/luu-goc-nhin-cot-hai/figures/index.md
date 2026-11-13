# Hình tại điểm quyết định — luu-goc-nhin-cot-hai

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1 · lưu ở đâu | hai nhánh rẽ (máy chủ · trình duyệt), mỗi nhánh kéo theo đường đi của dữ liệu khác nhau | cho-luu.html |
| Hỏi-2 · của riêng hay cả sàn | hai nhánh rẽ | ảnh bản bấm được `proto/L1-S1-*`, `proto/chung-ca-san-*` |
| Hỏi-3 · danh sách L1 hay L2 | hai nhánh rẽ | ảnh bản bấm được `proto/L1-S1-*`, `proto/L2-S1-*` |
| Hỏi-4 · cách lưu S1, S2, S3 | ba nhánh rẽ | ảnh bản bấm được `proto/L1-S1-*`, `proto/L1-S2-*`, `proto/L1-S3-menu-*` |
| Hỏi-5 · đổi góc nhìn đang mở | ba bước nối tiếp, hai nhánh rẽ | doi-goc-nhin.html |
| Gap-probe P0 (khe cột thứ hai) | đã sửa, không lên cổng | dưới ngưỡng: 0 |

## Đề bài hình

### cho-luu
- Loại: sơ đồ luồng dữ liệu, hai làn song song.
- Làn A «Lưu trên máy chủ» (máy khuyên): Bảng hàng → nút Lưu góc nhìn → máy chủ của sàn (bảng góc nhìn, cách ly theo sàn) → mở ở máy khác, tải lại: còn.
- Làn B «Lưu trên trình duyệt»: Bảng hàng → nút Lưu góc nhìn → trình duyệt của máy này → đổi máy: mất; đăng xuất: phải xoá; dữ liệu sàn nằm trên máy (trái luật kho).
- Nhãn tiếng Việt, không tên kỹ thuật. Liên quan AC-1, AC-2, AC-7.

### doi-goc-nhin
- Loại: lưu đồ.
- Bước: mở góc nhìn → đổi lọc, sắp, nhóm hay cột → mục mang dấu «đã đổi».
- Rẽ 1 «Lưu thay đổi» → góc nhìn ghi đè, dấu mất. Rẽ 2 «Lưu thành góc nhìn mới» → mục mới, mục cũ nguyên. Rẽ 3 bấm lại mục hay sang mục khác → bỏ thay đổi, về cách xem đã lưu.
- Ghi chú bên cạnh: lối khác «tự lưu như tab Sheet» — không có dấu, không có đường về.
- Liên quan AC-3, AC-4.
