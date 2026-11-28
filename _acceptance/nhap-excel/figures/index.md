# Hình tại điểm quyết định — nhap-excel

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-3 · Bố cục màn Nạp tệp (năm bước) | 5 bước nối tiếp | luong-nam-buoc |
| Hỏi-2 · Lần chào trỏ căn danh mục hay căn chờ khớp; tra mã bốn nguồn | 2 nhánh rẽ + 4 bước tra | tra-ma-va-can-cho |
| Hỏi-1 · Cửa tạo lần chào ở hàng 11 hay hàng 12 | 2 nhánh rẽ | dưới ngưỡng: đã nói trong câu hỏi |
| Hỏi-4..10 | một lựa chọn mỗi câu | dưới ngưỡng: 1 nhánh |

## Đề bài hình luong-nam-buoc
- Loại: flowchart ngang (process), 5 nút + 1 nhánh quay lại.
- Nút: Chọn tệp (đọc trên trình duyệt) → Ghép cột (mẫu nhập · nhãn · từ điển tiêu đề) → Giá trị và căn (câu gom theo chữ) → Xem trước (bốn dấu, số từ máy chủ, còn «chặn» thì Áp tắt) → Xong (đã thêm, sàn vừa học, Hoàn tác).
- Nhánh: «lần sau cùng dạng tệp» đi thẳng từ Chọn tệp tới Xem trước (0 câu hỏi).
- Ghi chú dưới: chỉ bảng chữ lên máy chủ; Áp là một giao dịch; học khi thành công.
- AC liên quan: AC-1, AC-2, AC-4, AC-5, AC-6, AC-8, AC-9.

## Đề bài hình tra-ma-va-can-cho
- Loại: decision tree / flow dọc.
- Nút: ô mã căn → mã riêng của sàn → mã gốc danh mục → bộ đọc 8 dạng → căn chờ khớp có sẵn → không ra.
- Kết cục: một căn danh mục (giữ nguyên / máy sửa) · nhiều căn (cần người chọn, nhớ thành mã riêng) · không ra (cần người, mặc định thành căn chờ khớp mới).
- Cuối: Lần chào trỏ ĐÚNG MỘT trong hai: căn danh mục (upi) hoặc căn chờ khớp của sàn; danh mục chung không đổi.
- AC liên quan: AC-5, AC-7, AC-11.
