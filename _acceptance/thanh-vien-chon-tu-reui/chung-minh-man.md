# Chứng minh màn — thanh-vien-chon-tu-reui

## Màn members

### Từ Quỹ hàng

| Trang | Khối Quỹ hàng đã chọn | Giữ | Bỏ | Vì sao |
| --- | --- | --- | --- | --- |
| docs/tri-thuc/wiki/chu-de/nguoi-dung-va-vai.md | solution-users-8 (đích của màn Người dùng) | khung Members, dòng người, việc trên dòng | thẻ Alerts, khung Guests và Invites, chỗ ngồi, xuất CSV, ô chọn một vai | Sản phẩm không có khách, lời mời chờ nhận, chỗ ngồi; một người giữ nhiều vai; tìm ở ⌘K (quyết định 0028) |

### Họ

| Họ đề xuất | Lối | Vì sao |
| --- | --- | --- |
| list-frame | màn mẫu mới | Chủ kho chọn lối B ở Cổng Phạm vi 2026-11-14: họ Danh sách khung mới cạnh họ Lưới, màn members là màn mẫu (design/patterns/danh-sach-khung.md) |

### Ứng viên ReUI

| Cho | Ứng viên | Ảnh | Chọn |
| --- | --- | --- | --- |
| màn | solution-users-8 | evidence/reui/solution-users-8.png | x |
| màn | solution-users-1 | evidence/reui/solution-users-1.png | |
| solution-users-8 | solution-users-8 | evidence/reui/solution-users-8.png | x |
| solution-users-8 | solution-users-1 | evidence/reui/solution-users-1.png | |
| dialog-2 | dialog-2 | evidence/reui/dialog-2.png | x |
| dialog-2 | dialog-1 | evidence/reui/dialog-1.png | |

solution-users-1 là bảng có lọc, chọn nhiều dòng, phân trang — cùng loại với khuôn Lưới mà chủ kho không chọn; dialog-1
là hộp chọn khoảng giờ, không hỏi trường văn bản. Trang Cổng Phạm vi: `cong-pham-vi.html`.

### Ma trận trạng thái

| Trạng thái | Kết quả | Căn cứ |
| --- | --- | --- |
| Chờ tải | đạt | tests/e2e-db/thanh-vien.spec.ts (chin-trang-thai, ST-members-loading) |
| Trống | không áp | Người vào được màn là thành viên của sàn, nên danh sách luôn có ít nhất chính người ấy |
| Không có dòng nào khớp | không áp | Màn không có ô tìm hay lọc (họ Danh sách khung, design/patterns/danh-sach-khung.md) |
| Lỗi | đạt | tests/e2e-db/thanh-vien.spec.ts (chin-trang-thai, ST-members-error, «Thử lại») |
| Một phần hỏng | không áp | Một lần đọc trả cả danh sách hoặc lỗi; không có phần nào tải riêng |
| Chữ dài | đạt | tests/e2e-db/thanh-vien.spec.ts (chin-trang-thai và cot-thang-hang, tên 117 ký tự cắt gọn, đủ chữ khi rê) |
| Không đủ quyền | đạt | tests/e2e-db/thanh-vien.spec.ts (chin-trang-thai, ST-members-forbidden) |
| Xung đột khi lưu | không áp | Đổi vai ghi cả tập vai một lần; luật sàn còn ít nhất một Quản trị sàn do máy chủ chặn (ST-roles-last-admin, tests/e2e-db/thanh-vien.spec.ts) |
| Phiên hết hạn | đạt | tests/e2e-db/members.spec.ts (khong-du-quyen: không phiên thì về trang đăng nhập với lối quay lại /members) |
| Mất mạng khi lưu | không áp | Ngoại tuyến là việc sau MVP; gửi hỏng vì mạng đi cùng đường lỗi gửi, giữ chữ đã gõ (ST-invite-failed, tests/e2e-db/thanh-vien.spec.ts) |
| Link hết hạn | không áp | Trạng thái của trang khách; Thành viên là màn nội bộ |

### Khối

| Khối | Bậc | Đã tra | Ứng viên gần nhất | Vì sao không dùng | Cách |
| --- | --- | --- | --- | --- | --- |
| solution-users-8 | reui | danh sách người có việc trên dòng (solution-users-1…8, khuôn Lưới DataRegion) | solution-users-1 | bảng lọc, chọn nhiều, phân trang — cùng loại khuôn Lưới mà chủ kho không chọn | ghép từ thành phần |
| dialog-2 | reui | hộp mời người (dialog-1…3, hộp mời của solution-users-8) | dialog-1 | hộp chọn khoảng giờ; hộp mời của solution-users-8 mời nhiều email và khách, trái luật mời hàng 9 | chọn khối |
| FormDialog | trong-kho | | | | |
| PageHeader | trong-kho | | | | |
| Frame | trong-kho | | | | |
| Item | trong-kho | | | | |
| Avatar | trong-kho | | | | |
| Badge | trong-kho | | | | |
| Checkbox | trong-kho | | | | |
| Field | trong-kho | | | | |
| Input | trong-kho | | | | |
| Button | trong-kho | | | | |

### Vùng

| Khối | Vùng | Xử lý | Lý do |
| --- | --- | --- | --- |
| solution-users-8 | đầu trang: tiêu đề và nút mời | lấy | tiêu đề màn và «Mời người» ở đầu màn (luật nút 9e) |
| solution-users-8 | khung Members: tiêu đề và dòng đếm | lấy | Quản trị sàn biết sàn có bao nhiêu người |
| solution-users-8 | dòng người: ảnh, tên, email | lấy | ai là ai; chữ cái đầu thay ảnh vì kho không lưu ảnh |
| solution-users-8 | việc ở cuối dòng | lấy | «Đổi vai» một lần bấm trên chính dòng |
| solution-users-8 | cột phương thức đăng nhập, hoạt động gần nhất | bỏ | kho không có dữ liệu ấy; thay bằng người mời |
| solution-users-8 | ô chọn một vai | bỏ | một người giữ nhiều vai; nhãn từng vai thay |
| solution-users-8 | thẻ People và Alerts | bỏ | sản phẩm không có cảnh báo quản trị |
| solution-users-8 | ô tìm tên, email | bỏ | tìm ở ⌘K (quyết định 0028) |
| solution-users-8 | thanh chỗ ngồi và xuất CSV | bỏ | không có gói chỗ ngồi, không xuất danh sách |
| solution-users-8 | khung Guests và Invites | bỏ | không có khách, mời là vào sàn ngay |
| solution-users-8 | nút xoá người | bỏ | bảng quyền không có thao tác xoá người (N8 sau) |
| solution-users-8 | cột «Người mời: [Tên] · ngày» | thêm | kho có dữ liệu ấy; biết ai đưa người này vào |
| dialog-2 | tiêu đề kèm nhãn nhỏ | lấy | nhãn mang tên sàn đang mời vào |
| dialog-2 | trường xếp dọc, dải chân hai nút | lấy | cùng dáng hộp của kho |
| dialog-2 | ô nhiều email và đếm «Gửi N lời mời» | bỏ | luật mời hàng 9: một người mỗi lần, có tên trong sàn |
| dialog-2 | ô chọn một vai | bỏ | luật mời hàng 9: ít nhất một vai, nhiều vai — giữ bốn ô đánh dấu |
| dialog-2 | trường tên trong sàn | thêm | luật mời hàng 9 |
