# 1p · Sửa sau chữ ký

Ngày 17/11/2026 chủ kho đổi khuôn App Shell (hồ sơ `app-shell-khuon-dau-trang`, VP7): menu tài khoản xuống đáy dải biểu
tượng, trên điện thoại nằm trong tấm menu đóng; người chưa đăng nhập tìm «Đăng nhập» trong chính menu ấy. Bảng băm
«giữ lối bài đăng nhập» (`tests/dang-nhap-giu-loi.test.ts`, lời hứa E2 của hồ sơ này) được ghi lại cho bốn tệp đổi có
chủ đích, đúng như đầu tệp ấy dặn. Không câu chữ nào của màn đăng nhập đổi: bảng câu chữ của tệp giữ nguyên và vẫn xanh.

## Đã đổi

| Tệp | Đổi gì | Người dùng thấy khác gì | Phép |
| --- | --- | --- | --- |
| `tests/e2e-db/login.spec.ts` | Mở menu tài khoản qua cửa chung; sau khi đăng xuất, tìm «Đăng nhập» là mục của menu | Không | Chủ kho duyệt phạm vi và kế hoạch VP7 ngày 17/11/2026 |
| `tests/e2e-db/va-dang-nhap.spec.ts` | Đăng xuất qua cửa chung; hai ca đăng xuất lỗi chờ thông báo tắt rồi bấm lại (trên điện thoại thông báo đứng đè nút tài khoản) | Không | như trên |
| `tests/e2e-db/dang-nhap-vai.ts` | Thêm cửa chung `shellReady` và `openAccountMenu`; đăng nhập xong chờ khung sẵn sàng qua cửa chung | Không | như trên; giám sát R-1711-5 |
| `tests/e2e/account.spec.ts` | Chưa đăng nhập: mở menu tài khoản (điện thoại mở tấm menu trước), thấy mục «Đăng nhập» trỏ đúng trang | Không | như trên |

Trình ở Cổng Bằng chứng VP7, mục công cụ kiểm, cạnh phép đổi của hàng 9c.
