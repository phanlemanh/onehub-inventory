# Bản phạm vi MVP đợt 1: bỏ Sheet, gửi link

Một sàn, một khu căn hộ. Lấy từ các chặng 1, 2, 4, 5 và bảng «Cắt gọn cho MVP» của `docs/design-standard-proposal.md`, cùng đợt 1 của `mvp-mo-dan.md` bên Quỹ hàng. Chỉ gồm việc phát triển. Thứ tự giữ theo đề xuất: dựng màn trên dữ liệu mẫu trước, nối dữ liệu thật ở chặng 4.

<!-- <<<PHAM-VI-MA -->

```
dot: mvp-dot-1
dang: chuoi
nguon: wiki/dot/mvp-dot-1.md#7f664a75f65a948e220323281b15ca00c9353c93

- `F1` — khung ứng dụng đầy đủ: mục đang chọn, lối nhảy tới nội dung chính, tiêu đề tab theo màn, nút chính trên header, điều hướng theo vai, thanh bên thu gọn trên điện thoại
- `F2` — trạng thái toàn trang: lỗi, không tìm thấy, chờ tải, phiên hết hạn
- `F3` — bộ định dạng giá, diện tích, ngày, số điện thoại và màu của sáu trạng thái căn
- `F4` — luật chọn kênh thông báo, báo rõ khi mất mạng không lưu được
- `F5` — giao diện sáng và tối
- `F6` — thành phần trạng thái vùng dữ liệu: chờ tải, trống, tìm không ra, lỗi
- `F7` — ô theo kiểu, đầu vùng, Lưới, tìm lọc và chia trang, luật ô chỉ đọc
- `F8` — cổng chọn khối ba lối ở Cổng Phạm vi: Trong kho, ReUI, Vẽ mới, có bài chấm, luật vẽ mới và danh mục khối đã chuyển thể
- `N1` — mỗi sàn chỉ đọc và ghi được dữ liệu của mình, mọi truy vấn đi qua một cửa
- `N2` — đăng nhập bằng mã qua email
- `N3` — Quản trị sàn mời người và gán bốn vai Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn
- `N7` — một bảng quyền theo vai, thao tác, phạm vi và trạng thái; API, cơ sở dữ liệu và màn hình cùng đọc từ bảng
- `N8` — Quản trị sàn khoá người đã nghỉ, Trưởng nhóm bàn giao căn và khách của người đó
- `N9` — sửa liên hệ, gỡ căn tạo nhầm, xoá dữ liệu cá nhân theo yêu cầu của chính người đó
- `N10` — trang chỉ đọc vai nào làm được gì và nhật ký đổi vai, đổi cấu hình, mở số
- `N4` — một sàn mẫu có dữ liệu nhãn MAU đủ để dựng và đo các màn
- `N5` — Bảng hàng đọc và ghi dữ liệu thật của sàn qua /api/v1
- `N6` — menu tài khoản và đăng xuất
- `B1` — Bảng hàng bản đọc trên Lưới: ô theo kiểu, đủ trạng thái màn, bốn khổ
- `B2` — hồ sơ căn cạnh bảng
- `B3` — thẻ căn trên điện thoại
- `B4` — sửa giá và trạng thái ngay trên ô
- `B5` — dán một vùng từ Excel vào bảng
- `B6` — câu xác nhận cho hành động nguy hiểm
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
- `K7` — xem trước link khi gửi trên Zalo: tiêu đề và ảnh
- `K8` — trang khách báo rõ khi link hết hạn hoặc đã thu hồi
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
- `L12` — đổi sàn trong ứng dụng
```

<!-- PHAM-VI-MA>>> -->
