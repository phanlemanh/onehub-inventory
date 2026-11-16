---
schema_version: 1
slug: moi-truong-thu-va-ban-that
feature: Người của sàn mở inventory.onehub.center, nhận mã qua email và vào đúng sàn của mình trên bản chạy thật; mỗi bản mới đi qua bản thử trước khi lên bản thật, và lùi được về bản trước
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T09:38:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 22
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 22 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Người của sàn mở inventory.onehub.center, nhận mã qua email và vào đúng sàn của mình trên bản chạy thật; mỗi bản mới đi qua bản thử trước khi lên bản thật, và lùi được về bản trước

Vì sao: Lộ trình không có hàng nào dựng môi trường chạy thật. Chủ kho 2026-11-15 ở phiên giám sát: «Tôi muốn chuyển sang dùng domain inventory.onehub.center như là một cổng quản trị hàng hóa cho đối tác vẫn giữ lại quyhang.onehub.center» và «Hiện nay quyhang cũng chưa ai sử dụng nên dùng nó để so sánh tính năng chứ không cần chuyển dữ liệu». Tài khoản, tên miền, khoá bí mật và hai tệp trong .github/workflows/ là việc của chủ kho ngoài kho, máy chỉ soạn bản đề xuất; chi phí hằng tháng trình ở Cổng Phạm vi

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Một lệnh đưa bản mới lên bản thử rồi bản thật: áp thay đổi cơ sở dữ liệu trước, kiểm nhanh chỉ đọc sau, kiểm đỏ thì dừng và bản thật không đổi; bản thật thiếu một cấu hình bắt buộc thì không khởi động và nói rõ thiếu gì; bản thật không có bộ dữ liệu mẫu và không có lối chọn vai để thử; bản thật nối cơ sở dữ liệu bằng vai không sở hữu bảng, đúng luật cách ly giữa các sàn, và bộ kiểm cách ly chạy được trên bản thử; thư mã đăng nhập và thư mời gửi từ tên miền đã xác minh, đường trong thư trỏ đúng địa chỉ mới; cơ sở dữ liệu thật có sao lưu hằng ngày và một lần thử khôi phục có ghi lại kết quả; có sổ tay vận hành cho đưa bản lên, lùi bản, xoay khoá bí mật, khôi phục dữ liệu; không khoá bí mật nào nằm trong kho mã» chưa?
- Kết quả nào là SỐNG: [đề xuất] Một lệnh đưa bản mới lên bản thử rồi bản thật: áp thay đổi cơ sở dữ liệu trước, kiểm nhanh chỉ đọc sau, kiểm đỏ thì dừng và bản thật không đổi; bản thật thiếu một cấu hình bắt buộc thì không khởi động và nói rõ thiếu gì; bản thật không có bộ dữ liệu mẫu và không có lối chọn vai để thử; bản thật nối cơ sở dữ liệu bằng vai không sở hữu bảng, đúng luật cách ly giữa các sàn, và bộ kiểm cách ly chạy được trên bản thử; thư mã đăng nhập và thư mời gửi từ tên miền đã xác minh, đường trong thư trỏ đúng địa chỉ mới; cơ sở dữ liệu thật có sao lưu hằng ngày và một lần thử khôi phục có ghi lại kết quả; có sổ tay vận hành cho đưa bản lên, lùi bản, xoay khoá bí mật, khôi phục dữ liệu; không khoá bí mật nào nằm trong kho mã
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Một lệnh đưa bản mới lên bản thử rồi bản thật: áp thay đổi cơ sở dữ liệu trước, kiểm nhanh chỉ đọc sau, kiểm đỏ thì dừng và bản thật không đổi; bản thật thiếu một cấu hình bắt buộc thì không khởi động và nói rõ thiếu gì; bản thật không có bộ dữ liệu mẫu và không có lối chọn vai để thử; bản thật nối cơ sở dữ liệu bằng vai không sở hữu bảng, đúng luật cách ly giữa các sàn, và bộ kiểm cách ly chạy được trên bản thử; thư mã đăng nhập và thư mời gửi từ tên miền đã xác minh, đường trong thư trỏ đúng địa chỉ mới; cơ sở dữ liệu thật có sao lưu hằng ngày và một lần thử khôi phục có ghi lại kết quả; có sổ tay vận hành cho đưa bản lên, lùi bản, xoay khoá bí mật, khôi phục dữ liệu; không khoá bí mật nào nằm trong kho mã» khi hết timebox
- Timebox: …
