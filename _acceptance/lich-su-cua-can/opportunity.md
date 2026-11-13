---
schema_version: 1
slug: lich-su-cua-can
feature: "Đầu chủ mở hồ sơ căn và thấy lịch sử của căn: tạo lần chào, đổi giá, đổi trạng thái, đổi thông tin, xác nhận với chủ nhà, mỗi việc kèm vai người làm và lúc làm"
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T22:20:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3c
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3c của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ mở hồ sơ căn và thấy lịch sử của căn: tạo lần chào, đổi giá, đổi trạng thái, đổi thông tin, xác nhận với chủ nhà, mỗi việc kèm vai người làm và lúc làm

Vì sao: Chủ kho 2026-11-12 ở Cổng Đáng của năm hàng tách ra khi so hồ sơ căn của Quỹ hàng với hàng 3 «Hồ sơ căn»: «Build cả năm hàng». Quỹ hàng có dòng thời gian lịch sử trong hồ sơ căn, trên điện thoại gọn còn ba việc gần nhất; lộ trình của kho này chưa có chỗ nào cho việc ấy, trong khi hàng 18b đã giả định lịch sử có sẵn. Lịch sử cần sổ ghi từng thay đổi trên dữ liệu thật nên đứng sau hàng 10; thêm sổ là đổi mô hình nghiệp vụ và lược đồ

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Mỗi lần tạo lần chào, đổi giá, đổi trạng thái, đổi thông tin và xác nhận với chủ nhà đều ghi một dòng lịch sử có khoá sàn, vai người làm và lúc làm, sàn khác không đọc được và bộ kiểm cách ly vẫn xanh; hồ sơ hiện dòng thời gian mới trước, đổi giá ghi giá cũ → giá mới, đổi trạng thái ghi nấc cũ → nấc mới; trên điện thoại chỉ hiện ba việc gần nhất kèm «Xem cả N việc» và «Thu gọn»; vùng lịch sử có đủ trạng thái đang tải, cần mạng, không tải được kèm Thử lại, mà phần còn lại của hồ sơ vẫn dùng được; khái niệm lịch sử được khai trong mô hình nghiệp vụ và có lần chuyển lược đồ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Mỗi lần tạo lần chào, đổi giá, đổi trạng thái, đổi thông tin và xác nhận với chủ nhà đều ghi một dòng lịch sử có khoá sàn, vai người làm và lúc làm, sàn khác không đọc được và bộ kiểm cách ly vẫn xanh; hồ sơ hiện dòng thời gian mới trước, đổi giá ghi giá cũ → giá mới, đổi trạng thái ghi nấc cũ → nấc mới; trên điện thoại chỉ hiện ba việc gần nhất kèm «Xem cả N việc» và «Thu gọn»; vùng lịch sử có đủ trạng thái đang tải, cần mạng, không tải được kèm Thử lại, mà phần còn lại của hồ sơ vẫn dùng được; khái niệm lịch sử được khai trong mô hình nghiệp vụ và có lần chuyển lược đồ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Mỗi lần tạo lần chào, đổi giá, đổi trạng thái, đổi thông tin và xác nhận với chủ nhà đều ghi một dòng lịch sử có khoá sàn, vai người làm và lúc làm, sàn khác không đọc được và bộ kiểm cách ly vẫn xanh; hồ sơ hiện dòng thời gian mới trước, đổi giá ghi giá cũ → giá mới, đổi trạng thái ghi nấc cũ → nấc mới; trên điện thoại chỉ hiện ba việc gần nhất kèm «Xem cả N việc» và «Thu gọn»; vùng lịch sử có đủ trạng thái đang tải, cần mạng, không tải được kèm Thử lại, mà phần còn lại của hồ sơ vẫn dùng được; khái niệm lịch sử được khai trong mô hình nghiệp vụ và có lần chuyển lược đồ» khi hết timebox
- Timebox: …
