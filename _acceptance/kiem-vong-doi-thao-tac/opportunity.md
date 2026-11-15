---
schema_version: 1
slug: kiem-vong-doi-thao-tac
feature: Sổ màn khai mỗi màn hiện những thứ gì, và bộ kiểm của kho (make check) đỏ khi một thứ trên màn thiếu thêm, xem, sửa hoặc gỡ theo từng vai, trừ khi ô thiếu mang lý do đã duyệt trỏ tới một hàng lộ trình
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1t
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1t của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Sổ màn khai mỗi màn hiện những thứ gì, và bộ kiểm của kho (make check) đỏ khi một thứ trên màn thiếu thêm, xem, sửa hoặc gỡ theo từng vai, trừ khi ô thiếu mang lý do đã duyệt trỏ tới một hàng lộ trình

Vì sao: Bản rà soát thêm · xem · sửa · xoá theo vai ngày 2026-11-14 kê 21 thứ người dùng thấy trên màn: 7 thao tác thiếu thật, 5 thao tác chỉ «để hàng sau» trên giấy, 7 ô máy tự loại mà không thành câu hỏi; chủ kho đã tự bắt ba lần (hàng 7e, 2b, 19). Phép kiểm bộ nút hiện chỉ so nút đã khai và sổ màn không khai màn hiện thứ gì, nên thao tác chưa từng khai thì không ai thấy thiếu; luật bằng chữ đã có ba lần và vẫn rơi. Bản rà soát xếp phép kiểm máy này là đề xuất số một. Chủ kho 2026-11-15 ở Cổng Đáng của đợt hàng kế: «Cho cả đợt». Phép kiểm nằm trong thư mục công cụ của kho, nên hàng này là T3

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Sổ màn có trường khai các thứ mỗi màn hiện; mô hình nghiệp vụ khai vòng đời của từng thứ, mỗi thao tác thêm, sửa, gỡ trỏ một trong ba: tên thao tác trong bảng quyền, mã một hàng lộ trình, hoặc «không» kèm mã quyết định của chủ kho; phép kiểm chạy trong make check và đỏ đúng câu khi một thứ trên màn thiếu một thao tác mà không trỏ được chỗ nào, hay ghi «không» mà không trỏ quyết định nào; ca phá gỡ thao tác gỡ căn khỏi bảng quyền làm phép kiểm đỏ đúng câu; lần chạy đầu kê đúng các chỗ thiếu thật của bản rà soát ngày 2026-11-14, mỗi chỗ được trỏ tới hàng nhận nó hoặc thành câu hỏi cho chủ kho trước khi phép kiểm xanh» chưa?
- Kết quả nào là SỐNG: [đề xuất] Sổ màn có trường khai các thứ mỗi màn hiện; mô hình nghiệp vụ khai vòng đời của từng thứ, mỗi thao tác thêm, sửa, gỡ trỏ một trong ba: tên thao tác trong bảng quyền, mã một hàng lộ trình, hoặc «không» kèm mã quyết định của chủ kho; phép kiểm chạy trong make check và đỏ đúng câu khi một thứ trên màn thiếu một thao tác mà không trỏ được chỗ nào, hay ghi «không» mà không trỏ quyết định nào; ca phá gỡ thao tác gỡ căn khỏi bảng quyền làm phép kiểm đỏ đúng câu; lần chạy đầu kê đúng các chỗ thiếu thật của bản rà soát ngày 2026-11-14, mỗi chỗ được trỏ tới hàng nhận nó hoặc thành câu hỏi cho chủ kho trước khi phép kiểm xanh
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Sổ màn có trường khai các thứ mỗi màn hiện; mô hình nghiệp vụ khai vòng đời của từng thứ, mỗi thao tác thêm, sửa, gỡ trỏ một trong ba: tên thao tác trong bảng quyền, mã một hàng lộ trình, hoặc «không» kèm mã quyết định của chủ kho; phép kiểm chạy trong make check và đỏ đúng câu khi một thứ trên màn thiếu một thao tác mà không trỏ được chỗ nào, hay ghi «không» mà không trỏ quyết định nào; ca phá gỡ thao tác gỡ căn khỏi bảng quyền làm phép kiểm đỏ đúng câu; lần chạy đầu kê đúng các chỗ thiếu thật của bản rà soát ngày 2026-11-14, mỗi chỗ được trỏ tới hàng nhận nó hoặc thành câu hỏi cho chủ kho trước khi phép kiểm xanh» khi hết timebox
- Timebox: …
