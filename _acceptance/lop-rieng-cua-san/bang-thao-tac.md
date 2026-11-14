# 7e · Bảng thao tác của từng thực thể

Màn «Tuỳ chỉnh của sàn», theo luật của đợt ngày 14/11/2026 (G-1411-113). Mỗi thứ người dùng thấy trên màn một dòng.
Vai: «ba vai ghi» là Đầu chủ, Trưởng nhóm, Quản trị sàn; «bốn vai» là thêm Đầu khách. Đầu khách chỉ xem, không có nút
ghi nào, còn `/api/v1` trả 403 cho Đầu khách. Quyền lấy từ `ontology/actions.yaml`.

| Thứ trên màn | Thêm | Xem | Sửa | Xoá / Gỡ | Thao tác riêng |
| --- | --- | --- | --- | --- | --- |
| Nhãn riêng | có: «Thêm nhãn riêng» ở đầu phần, ba vai ghi | có: bốn vai | có: «Sửa» ở «…» mỗi dòng, ba vai ghi | có: «Ngừng dùng» ở «…» mỗi dòng, ba vai ghi; không có Xoá | — |
| Trường riêng | có: «Thêm trường riêng» ở đầu phần, ba vai ghi | có: bốn vai | có: «Sửa» tên và lựa chọn, ba vai ghi; không đổi kiểu sau khi tạo | có: «Ngừng dùng», ba vai ghi; không có Xoá | — |
| Từ điển giá trị | có: «Thêm cách viết» ở đầu phần, ba vai ghi | có: bốn vai | có: «Sửa», ba vai ghi | có: «Ngừng dùng», ba vai ghi; không có Xoá | — |
| Căn chờ khớp | để hàng 12 (thêm căn tay), hàng 11 (sinh khi nhập Sheet) | có: bốn vai | không | có: «Ngừng dùng», ba vai ghi; không có Xoá | «Khớp với danh mục» ở đầu phần, ba vai ghi |
| Mẫu nhập | để hàng 11 (lưu mẫu khi nhập Sheet) | có: bốn vai | có: «Đổi tên mẫu», ba vai ghi | có: «Ngừng dùng», ba vai ghi; không có Xoá | — |

## Các ô «không» và «chỉ Ngừng dùng»: ai đã quyết

Không ô nào do máy tự quyết. Mọi ô dưới đây đều do chủ kho chọn ở Cổng Phạm vi ngày 13/11/2026.

| Ô | Người dùng mất gì | Ai quyết, ở đâu |
| --- | --- | --- |
| Không có Xoá ở cả năm phần, chỉ «Ngừng dùng» | Không xoá hẳn được. Thứ đã ngừng không hiện nữa, còn giá trị đã ghi trên căn vẫn giữ. | Chủ kho, câu «Tôi thấy thiếu bộ nút crud như các kiến trúc chung?», sổ quyết định `d-20261113T133315Z-21` (người quyết Manh Phan) |
| Trường riêng không đổi kiểu sau khi tạo | Muốn đổi kiểu thì ngừng trường cũ, tạo trường mới. | Cùng `d-20261113T133315Z-21` |
| Căn chờ khớp không Sửa | Gõ sai mã thì ngừng mã ấy; mã gõ lại đến từ lần nhập sau. | Cùng `d-20261113T133315Z-21` («Khớp và Ngừng dùng ở Căn chờ khớp») |
| Căn chờ khớp không Thêm ở 7e | Trước hàng 11, 12 sàn chưa tự thêm căn chờ được. | Hỏi-7 trên trang Cổng Phạm vi, `d-20261113T133315Z-22`, chủ kho duyệt theo khuyến nghị (để hàng 12) |
| Mẫu nhập không Thêm ở 7e | Mẫu chỉ sinh khi nhập Sheet. | Cùng `d-20261113T133315Z-21` («Đổi tên và Ngừng dùng ở Mẫu nhập»); việc lưu mẫu là của hàng 11 |
