# 9c · Sửa sau chữ ký

Chủ kho ký Cổng Bằng chứng của hàng 9c. Ngày 17/11/2026 chủ kho đổi khuôn App Shell (hồ sơ
`app-shell-khuon-dau-trang`, VP7): menu tài khoản xuống đáy dải biểu tượng, trên điện thoại nằm trong tấm menu đóng.
Giám sát cho thay đổi dưới đây (R-1711-5, G-1711-25), lý do «chủ kho đổi khuôn 2026-11-17».

## Đã đổi, giám sát cho

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `tests/e2e-db/members.spec.ts` và `tests/e2e-db/bo-nut-members.spec.ts`: dòng chờ «nút tài khoản đã sẵn sàng» đổi thành lời gọi cửa chung `shellReady(page)` (`tests/e2e-db/dang-nhap-vai.ts`), thêm một dòng nhập. Không lời kiểm nào khác đổi | Không. Màn Thành viên, lời mời, đổi vai, câu từ chối giữ nguyên | Khoá lời hàng 9 (`tests/thanh-vien-khoa-bai.test.ts`) nhận đúng cặp thay thế này, nguyên văn, cộng đúng một dòng nhập; ba ca phá thử đỏ (thay bằng lời gọi khác, kèm đổi một câu kỳ vọng, chỉ có dòng nhập). Cửa chung không yếu hơn lời cũ: ở máy tính vẫn chờ nút tài khoản đã sẵn sàng; ở điện thoại chờ tên sàn hiện và ô tìm đã sẵn sàng; ca đối chứng ở `tests/e2e-db/app-shell-verve.spec.ts` (trang đăng nhập không có khung thì cửa đỏ). Hồ sơ 9c được ghim lại trên bản có thay đổi này | R-1711-5, G-1711-25; trình ở Cổng Bằng chứng VP7, mục công cụ kiểm |
