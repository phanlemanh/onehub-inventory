---
schema_version: 1
slug: bo-nut-theo-quyen
feature: Người dùng ở vai nào cũng thấy bộ nút thêm, sửa, gỡ đặt cùng một chỗ trên mọi màn — thêm một căn, gỡ một căn, thêm một liên hệ, gỡ một liên hệ — và chỉ thấy nút mình được dùng theo bảng quyền
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T10:36:36Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 9e
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 9e của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Người dùng ở vai nào cũng thấy bộ nút thêm, sửa, gỡ đặt cùng một chỗ trên mọi màn — thêm một căn, gỡ một căn, thêm một liên hệ, gỡ một liên hệ — và chỉ thấy nút mình được dùng theo bảng quyền

Vì sao: Chủ kho 2026-11-12 ở phiên giám sát: «Kiểm tra và phân tích tôi thấy đó là phân quyền CRUD ở mọi màn. Trong quá trình chạy thử của onehub-quy-hang tôi mới nhận ra điều này dẫn đến cấu trúc ux/ui của bộ nút không được suy nghĩ từ đầu.» và «build bộ nút theo quyền, ví dụ như thêm một căn vào, xoá một căn đi,...tương tự thêm một liên hệ, xoá một liên hệ,...». Quỹ hàng có bốn cách gắn quyền cho nút, nút hiện rồi máy chủ từ chối, cùng một việc đặt khác chỗ theo màn và theo khổ. Ở kho này bảng quyền của hàng 9a đã có hàm cho màn hỏi quyền nhưng chưa màn nào gọi; hàng 4 là hàng đầu tiên có nút ghi trên Bảng hàng nên hàng này đi trước

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Sổ thiết kế có luật chỗ đặt cho nút thêm ở đầu màn, nút của vùng, thao tác trên dòng và thao tác trong hồ sơ, ở máy tính lẫn điện thoại; mọi nút thao tác khai tên thao tác trong bảng quyền và đi qua một thành phần chung, nút không khai thì bộ kiểm của kho đỏ; vai không có quyền không thấy nút, người chỉ được làm trên bản ghi của mình thấy dòng của người khác theo đúng một cách đã chốt, bị máy chủ từ chối thì có câu «không đủ quyền» riêng; thanh bên và màn Thành viên đọc bảng quyền thay cho vai viết cứng; bảng quyền có dòng nháp cho thêm và gỡ căn, thêm và gỡ liên hệ theo nghĩa nghiệp vụ của quyết định 0016; bảng vai × màn xuống tới cấp nút và sinh từ bảng quyền; thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023 trên một bản bấm được» chưa?
- Kết quả nào là SỐNG: [đề xuất] Sổ thiết kế có luật chỗ đặt cho nút thêm ở đầu màn, nút của vùng, thao tác trên dòng và thao tác trong hồ sơ, ở máy tính lẫn điện thoại; mọi nút thao tác khai tên thao tác trong bảng quyền và đi qua một thành phần chung, nút không khai thì bộ kiểm của kho đỏ; vai không có quyền không thấy nút, người chỉ được làm trên bản ghi của mình thấy dòng của người khác theo đúng một cách đã chốt, bị máy chủ từ chối thì có câu «không đủ quyền» riêng; thanh bên và màn Thành viên đọc bảng quyền thay cho vai viết cứng; bảng quyền có dòng nháp cho thêm và gỡ căn, thêm và gỡ liên hệ theo nghĩa nghiệp vụ của quyết định 0016; bảng vai × màn xuống tới cấp nút và sinh từ bảng quyền; thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023 trên một bản bấm được
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Sổ thiết kế có luật chỗ đặt cho nút thêm ở đầu màn, nút của vùng, thao tác trên dòng và thao tác trong hồ sơ, ở máy tính lẫn điện thoại; mọi nút thao tác khai tên thao tác trong bảng quyền và đi qua một thành phần chung, nút không khai thì bộ kiểm của kho đỏ; vai không có quyền không thấy nút, người chỉ được làm trên bản ghi của mình thấy dòng của người khác theo đúng một cách đã chốt, bị máy chủ từ chối thì có câu «không đủ quyền» riêng; thanh bên và màn Thành viên đọc bảng quyền thay cho vai viết cứng; bảng quyền có dòng nháp cho thêm và gỡ căn, thêm và gỡ liên hệ theo nghĩa nghiệp vụ của quyết định 0016; bảng vai × màn xuống tới cấp nút và sinh từ bảng quyền; thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023 trên một bản bấm được» khi hết timebox
- Timebox: …
