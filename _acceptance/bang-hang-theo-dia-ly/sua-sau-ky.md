# 2d · Sửa sau chữ ký

Chủ kho đã ký Cổng Bằng chứng của hàng 2d. Dưới đây là mọi chỗ đổi sau chữ ký, mỗi chỗ có phép của giám sát và được chủ
kho soi ở Cổng Bằng chứng của hàng mang nó.

## Hàng 1u (Dọn nợ của bộ kiểm), 16/11/2026

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| `tests/e2e-db/dia-ly.spec.ts`: hai ca phá («gỡ chân bảng» ở E6, «thu hẹp cột» ở E11) đổi trang qua cửa chung `suaTrang` (`tests/e2e/sua-trang.ts`) thay vì gọi thẳng; cửa chung chờ trang gắn xong rồi mới đổi | Không. Bài vẫn đổi đúng chỗ ấy, cùng cách, và vẫn chờ cùng thông báo lỗi; chỉ thêm bước chờ trang gắn xong trước khi đổi | Bài của 2d giữ nguyên ý; bộ quét `tests/sua-trang.test.ts` đỏ nếu một trong hai chỗ quay về gọi thẳng. Hồ sơ 2d được ghim lại trên bản có thay đổi này trước khi PR #71 gộp | G-1611-19; trình ở Cổng Bằng chứng hàng 1u, mục «Bài của hàng khác đã đổi» |
