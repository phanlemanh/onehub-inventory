---
schema_version: 1
slug: nhap-excel
feature: Đầu chủ nạp tệp Excel hay Sheet đang dùng, ghép cột, tên cột, giá trị và mã căn của mình vào chuẩn ngay ở màn xem trước, áp vào bảng và hoàn tác được; lần sau cùng dạng tệp không phải ghép lại
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 11
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 11 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/nhap-excel.md#178e754304d853b9c5f0488055f664d10e0f3416`

Đầu chủ nạp tệp Excel hay Sheet đang dùng, ghép cột, tên cột, giá trị và mã căn của mình vào chuẩn ngay ở màn xem trước, áp vào bảng và hoàn tác được; lần sau cùng dạng tệp không phải ghép lại

Vì sao: Đường chính để bỏ Sheet. Chủ kho 2026-11-12 ở phiên dãy R: «chuẩn hoá danh mục căn như onehub-invest vì đều gốc là tiêu chuẩn dữ liệu reso, nhưng không cứng mà cho người dùng thêm trường riêng, nhãn riêng, vì người dùng là các công ty môi giới họ hoạt động thường thiếu chuẩn hoá và triển khai nếu không khả năng thay đổi thì thường thất bại» và «MVP sẽ cho người dùng bắt đầu bằng import file google sheet hay excel mà họ đang làm việc quản lý bảng hàng vào […] Khi Import vào thì đây chính là thời điểm mapping giữa sự chuẩn hoá của onehub-inventory và sự không chuẩn của người dùng.» Lần nhập là lúc sàn bắt đầu dùng sản phẩm và là lúc ghép chuẩn với không chuẩn

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Năm chỗ ghép trong một lần nhập: cột, tên cột, giá trị, căn, dạng tệp; mỗi ô mang một trong bốn dấu giữ nguyên · máy sửa kèm lý do · cần người · chặn, không có đường nhập thẳng; trên bộ tệp thử bẩn có đáp án 100% ô có đích (trường chuẩn, trường riêng, hay giữ nguyên kèm dấu cần người), không ô nào bị bỏ lặng lẽ; lựa chọn của người ghi vào lớp riêng của sàn (hàng 7e) khi lần nhập thành công; lần nhập thứ hai cùng dạng tệp không hỏi lại câu nào đã trả lời; hoàn tác gỡ cả ô lẫn phần vừa học; không dùng AI (H5). Cổng Phạm vi cân việc tách làm hai hàng nếu vượt 12 tiêu chí» chưa?
- Kết quả nào là SỐNG: [đề xuất] Năm chỗ ghép trong một lần nhập: cột, tên cột, giá trị, căn, dạng tệp; mỗi ô mang một trong bốn dấu giữ nguyên · máy sửa kèm lý do · cần người · chặn, không có đường nhập thẳng; trên bộ tệp thử bẩn có đáp án 100% ô có đích (trường chuẩn, trường riêng, hay giữ nguyên kèm dấu cần người), không ô nào bị bỏ lặng lẽ; lựa chọn của người ghi vào lớp riêng của sàn (hàng 7e) khi lần nhập thành công; lần nhập thứ hai cùng dạng tệp không hỏi lại câu nào đã trả lời; hoàn tác gỡ cả ô lẫn phần vừa học; không dùng AI (H5). Cổng Phạm vi cân việc tách làm hai hàng nếu vượt 12 tiêu chí
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Năm chỗ ghép trong một lần nhập: cột, tên cột, giá trị, căn, dạng tệp; mỗi ô mang một trong bốn dấu giữ nguyên · máy sửa kèm lý do · cần người · chặn, không có đường nhập thẳng; trên bộ tệp thử bẩn có đáp án 100% ô có đích (trường chuẩn, trường riêng, hay giữ nguyên kèm dấu cần người), không ô nào bị bỏ lặng lẽ; lựa chọn của người ghi vào lớp riêng của sàn (hàng 7e) khi lần nhập thành công; lần nhập thứ hai cùng dạng tệp không hỏi lại câu nào đã trả lời; hoàn tác gỡ cả ô lẫn phần vừa học; không dùng AI (H5). Cổng Phạm vi cân việc tách làm hai hàng nếu vượt 12 tiêu chí» khi hết timebox
- Timebox: …
