# Hình tại điểm quyết định — bo-kiem-chung-khi-dang-nhap

| Điểm | Đếm | Hình |
|---|---|---|
| Hỏi-1: lượt có đăng nhập chạy ở đâu (máy dãy và lượt chấm, hay CI) | 2 nhánh rẽ, mỗi nhánh 3 bước (chuẩn bị phiên → bộ kiểm chung → màn cần đăng nhập) | hai-luot-chay |
| Dòng sổ: nhận màn cần đăng nhập bằng đường địa chỉ | 1 bước | dưới ngưỡng: 1 |
| Dòng sổ: một phiên đủ bốn vai, để ma trận vai cho 9b | 1 bước | dưới ngưỡng: 1 |
| Dòng sổ: hai hàm chờ dùng chung | 1 bước | dưới ngưỡng: 1 |

## Đề bài hình `hai-luot-chay`

- Loại hình: luồng hai làn (swimlane) — làn trên «Lượt không cơ sở dữ liệu (make e2e, CI)», làn dưới «Lượt có cơ sở dữ liệu (máy dãy, lượt chấm)».
- Làn dưới: Chuẩn bị (sàn thử + người thử đủ 4 vai) → Đăng nhập một lần qua màn đăng nhập thật → Lưu phiên → Bộ kiểm chung mở mọi màn bằng phiên (Hôm nay, Bảng hàng, Đã gửi, Thành viên) → «bỏ qua vì cần đăng nhập: 0».
- Làn trên: Bộ kiểm chung mở màn khi chưa đăng nhập → màn bị đẩy về trang đăng nhập → «giao sang lượt có phiên» (mũi tên chéo xuống làn dưới); màn mở được → đo như hàng 1f. Màn Đăng nhập chỉ đo ở làn trên.
- Một hộp nhánh «Hỏi-1»: nếu chủ kho thêm Postgres vào CI thì làn dưới cũng chạy trên CI.
- AC liên quan: AC-1, AC-2, AC-3, AC-4.
