# Bản phạm vi MVP đợt 1: bỏ Sheet, gửi link

Một sàn, một khu căn hộ. Lấy từ các chặng 1, 2, 4, 5 và bảng «Cắt gọn cho MVP» của `docs/design-standard-proposal.md`, cùng đợt 1 của `mvp-mo-dan.md` bên Quỹ hàng. Chỉ gồm việc phát triển. Thứ tự giữ theo đề xuất: dựng màn trên dữ liệu mẫu trước, nối dữ liệu thật ở chặng 4.

<!-- <<<PHAM-VI-MA -->

```
dot: mvp-dot-1
dang: chuoi
nguon: docs/design-standard-proposal.md (chặng 1, 2, 4, 5 và mục Cắt gọn cho MVP), chủ kho duyệt cắt lượt 09/11/2026

- `N1` — mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa
- `N2` — đăng nhập bằng mã qua email
- `N3` — Quản trị sàn mời người và gán bốn vai Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn
- `N4` — một sàn mẫu có dữ liệu nhãn MAU đủ để dựng và đo các màn
- `N5` — Bảng hàng đọc và ghi dữ liệu thật của sàn qua /api/v1
- `B1` — Bảng hàng bản đọc trên Lưới: ô theo kiểu, đủ trạng thái màn, bốn khổ
- `B2` — hồ sơ căn cạnh bảng
- `B3` — thẻ căn trên điện thoại
- `B4` — sửa giá và trạng thái ngay trên ô
- `B5` — dán một vùng từ Excel vào bảng
- `V1` — nhập tệp Excel có xem trước và hoàn tác
- `V2` — thêm căn bằng cách gõ mã căn
- `V3` — tạo căn tay khi danh mục chưa có
- `G1` — số chủ nhà trên hồ sơ căn, lưu dạng rõ ở MVP
- `G2` — Hôm nay một danh sách việc
- `G3` — ghi kết quả cuộc gọi
- `G4` — ảnh của căn
- `G5` — căn đủ điều kiện thì thành Sẵn sàng bán
- `K1` — luồng Gửi: chọn căn, tạo link, người tự bấm gửi qua bảng chia sẻ của thiết bị
- `K2` — trang khách dựng từ luật ẩn
- `K3` — trang khách mở đúng trong trình duyệt của Zalo
- `K4` — màn Đã gửi trên cùng Lưới, dữ liệu mẫu
- `K5` — lưu khách
- `K6` — Đã gửi đọc dữ liệu thật và lượt mở
- `C1` — Thuế phí của sàn
- `R1` — lược đồ mới và lệnh chuyển dữ liệu một lần từ Quỹ hàng, giải mã số chủ nhà
- `R2` — thu Core Web Vitals từ người dùng thật
- `R3` — một lệnh đọc số đo của đợt bỏ Sheet
- `L1` — chế độ ngoại tuyến: bản đọc trên máy, ghi khi mất mạng, thay đổi chờ gửi, Cần xem
- `L2` — cửa lead, vai Telesales, nhà Liên hệ
- `L3` — xuất bảng, nhóm môi giới, mẫu bài
- `L4` — cách gọi, trạng thái riêng, trường riêng, từ điển theo sàn
- `L5` — nhập có AI, nhớ mẫu nhập
- `L6` — thấp tầng
- `L7` — góc nhìn lưu, sửa hàng loạt, đổi đầu chủ hàng loạt
- `L8` — gọi điều chỉnh giá, ba màn Hôm nay riêng theo vai
- `L9` — ba cờ mở dần và trang vận hành đầy đủ
- `L10` — các loại kết nối khác và xác nhận danh mục
- `L11` — đăng nhập bằng mật khẩu
```

<!-- PHAM-VI-MA>>> -->
