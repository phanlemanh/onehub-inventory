---
schema_version: 1
slug: loi-vao-ho-so
feature: Đầu chủ mở một căn ở trang riêng bằng nút «Mở toàn màn», chép đường dẫn gửi đồng nghiệp mở đúng căn và đúng lần chào, và gõ mã căn ở thanh trên để tới thẳng hồ sơ căn
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T22:20:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3f
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3f của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ mở một căn ở trang riêng bằng nút «Mở toàn màn», chép đường dẫn gửi đồng nghiệp mở đúng căn và đúng lần chào, và gõ mã căn ở thanh trên để tới thẳng hồ sơ căn

Vì sao: Chủ kho 2026-11-12 ở Cổng Đáng của năm hàng tách ra khi so hồ sơ căn của Quỹ hàng với hàng 3 «Hồ sơ căn»: «Build cả năm hàng». Hồ sơ hàng 3 mở lại được bằng địa chỉ có mã hồ sơ nhưng không có trang riêng cho một căn (hợp đồng hàng 3 cắt ra), và chưa có chỗ gõ mã căn để tới thẳng hồ sơ; hàng 12 gõ mã để thêm căn, là việc khác. Quỹ hàng có cả hai, kèm bước chọn toà khi hai toà trùng mã

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Nút «Mở toàn màn» trên ngăn chi tiết sang trang riêng của căn, trang có nút chép đường dẫn; người cùng sàn mở đường dẫn thấy đúng căn và đúng lần chào; đường dẫn mang mã lạ thì báo «Không có căn này trong Bảng hàng» kèm lối về Bảng hàng; gõ mã căn ở thanh trên mở thẳng hồ sơ căn; mã có ở hai toà trở lên thì hiện «Nhiều căn — chọn toà» với một nút cho từng toà; mã không khớp căn nào thì nói rõ và không mở gì; đủ bốn khổ màn hình» chưa?
- Kết quả nào là SỐNG: [đề xuất] Nút «Mở toàn màn» trên ngăn chi tiết sang trang riêng của căn, trang có nút chép đường dẫn; người cùng sàn mở đường dẫn thấy đúng căn và đúng lần chào; đường dẫn mang mã lạ thì báo «Không có căn này trong Bảng hàng» kèm lối về Bảng hàng; gõ mã căn ở thanh trên mở thẳng hồ sơ căn; mã có ở hai toà trở lên thì hiện «Nhiều căn — chọn toà» với một nút cho từng toà; mã không khớp căn nào thì nói rõ và không mở gì; đủ bốn khổ màn hình
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Nút «Mở toàn màn» trên ngăn chi tiết sang trang riêng của căn, trang có nút chép đường dẫn; người cùng sàn mở đường dẫn thấy đúng căn và đúng lần chào; đường dẫn mang mã lạ thì báo «Không có căn này trong Bảng hàng» kèm lối về Bảng hàng; gõ mã căn ở thanh trên mở thẳng hồ sơ căn; mã có ở hai toà trở lên thì hiện «Nhiều căn — chọn toà» với một nút cho từng toà; mã không khớp căn nào thì nói rõ và không mở gì; đủ bốn khổ màn hình» khi hết timebox
- Timebox: …
