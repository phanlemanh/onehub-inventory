---
schema_version: 1
slug: lop-rieng-cua-san
feature: Mỗi sàn có lớp riêng của mình trên lõi chuẩn — nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp và mẫu nhập — và Bảng hàng hiện trường riêng, đọc nhãn riêng của sàn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T11:00:42Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 7e
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 7e của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Mỗi sàn có lớp riêng của mình trên lõi chuẩn — nhãn riêng, trường riêng, từ điển giá trị, căn chờ khớp và mẫu nhập — và Bảng hàng hiện trường riêng, đọc nhãn riêng của sàn

Vì sao: Chủ kho 2026-11-12 ở phiên dãy R: «chuẩn hoá danh mục căn như onehub-invest vì đều gốc là tiêu chuẩn dữ liệu reso, nhưng không cứng mà cho người dùng thêm trường riêng, nhãn riêng, vì người dùng là các công ty môi giới họ hoạt động thường thiếu chuẩn hoá và triển khai nếu không khả năng thay đổi thì thường thất bại» và «MVP sẽ cho người dùng bắt đầu bằng import file google sheet hay excel mà họ đang làm việc quản lý bảng hàng vào […] Khi Import vào thì đây chính là thời điểm mapping giữa sự chuẩn hoá của onehub-inventory và sự không chuẩn của người dùng.» Chủ kho nhận Hỏi-5 ở Cổng Phạm vi hàng 7d cùng ngày: mở hàng này ngay sau 7d, trước khi nối dữ liệu thật; lật phần hoãn L4 và phần nhớ mẫu nhập của L5 (AI vẫn hoãn). Bản đề xuất: _acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Sàn lưu và đọc được nhãn riêng của trường chuẩn, trường riêng (chữ, số, ngày, chọn một, có/không; trần 20 trường, 30 lựa chọn), từ điển giá trị, căn chờ khớp và mẫu nhập; mọi bảng của lớp này có khoá sàn và qua bộ kiểm cách ly, sàn khác không thấy; Bảng hàng hiện trường riêng sau cột chuẩn và hiện nhãn riêng thay nhãn chuẩn; căn chờ khớp dùng được ngay và khớp vào danh mục chung khi danh mục có căn ấy mà sàn không phải nhập lại; có một bảng xem lại tối giản cho lớp riêng; trong rào ADR-0018: không đối tượng tự tạo, không công thức, không bộ máy luật; màn Cài đặt sàn đầy đủ để H4» chưa?
- Kết quả nào là SỐNG: [đề xuất] Sàn lưu và đọc được nhãn riêng của trường chuẩn, trường riêng (chữ, số, ngày, chọn một, có/không; trần 20 trường, 30 lựa chọn), từ điển giá trị, căn chờ khớp và mẫu nhập; mọi bảng của lớp này có khoá sàn và qua bộ kiểm cách ly, sàn khác không thấy; Bảng hàng hiện trường riêng sau cột chuẩn và hiện nhãn riêng thay nhãn chuẩn; căn chờ khớp dùng được ngay và khớp vào danh mục chung khi danh mục có căn ấy mà sàn không phải nhập lại; có một bảng xem lại tối giản cho lớp riêng; trong rào ADR-0018: không đối tượng tự tạo, không công thức, không bộ máy luật; màn Cài đặt sàn đầy đủ để H4
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Sàn lưu và đọc được nhãn riêng của trường chuẩn, trường riêng (chữ, số, ngày, chọn một, có/không; trần 20 trường, 30 lựa chọn), từ điển giá trị, căn chờ khớp và mẫu nhập; mọi bảng của lớp này có khoá sàn và qua bộ kiểm cách ly, sàn khác không thấy; Bảng hàng hiện trường riêng sau cột chuẩn và hiện nhãn riêng thay nhãn chuẩn; căn chờ khớp dùng được ngay và khớp vào danh mục chung khi danh mục có căn ấy mà sàn không phải nhập lại; có một bảng xem lại tối giản cho lớp riêng; trong rào ADR-0018: không đối tượng tự tạo, không công thức, không bộ máy luật; màn Cài đặt sàn đầy đủ để H4» khi hết timebox
- Timebox: …
