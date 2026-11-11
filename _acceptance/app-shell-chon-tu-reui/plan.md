# Kế hoạch — App Shell chọn từ ReUI (hàng 1o)

Viết theo phương án máy khuyên cho năm câu hỏi; chủ kho chọn khác thì việc 3, 4, 5 đổi theo trước khi bắt đầu.
Việc 4 và 6 chạm tệp đang nằm trong PR của hàng 9: chỉ bắt đầu sau khi hàng 9 gộp.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ | Độc lập |
|---|---|---|---|---|---|
| 1 | Cài thành phần còn thiếu đúng như nhà cung cấp giao (chỉ khi câu 2 chọn có ô gõ: `kbd`, `input-group`) | `src/components/ui/**` (xin chạm tệp) | `make lint` | E9 | có |
| 2 | Dựng App Shell mới: cột biểu tượng, cột thứ hai, tay nắm gập (nhớ qua tải lại), thanh trên với tên sàn, đổi giao diện, menu tài khoản; ngăn trượt trên điện thoại | `src/components/templates/app-shell.tsx`, `src/components/templates/app-shell/**`, `src/components/templates/nav-menu.tsx` | `make typecheck`, `make lint` | E1, E3, E4, E5, E9 | không |
| 3 | Bài kiểm đơn vị: ma trận 16 tổ hợp vai trên cột biểu tượng mới; trạng thái toàn trang và băng báo trong App Shell mới | `tests/app-shell.test.tsx`, `tests/frame.test.tsx` | `make test` (kèm lượt phá thử: rò vai, lệch thứ tự) | E2, E6 | không |
| 4 | Nối App Shell mới vào nhóm `(app)`: mục điều hướng có biểu tượng, cột thứ hai theo màn, tên sàn từ phiên | `src/app/(app)/layout.tsx`, `src/app/(app)/nav.ts` (sau hàng 9) | `make check` | E1, E3, E4 | không |
| 5 | Bài trình duyệt của App Shell ở bốn khổ, sáng và tối | `tests/e2e/app-shell.spec.ts`, `tests/e2e/shell.spec.ts` (sau hàng 9) | `make e2e` (kèm lượt phá thử từng thông điệp ghim) | E1, E3, E4, E5, E7 | không |
| 6 | Gỡ bản bấm được, ghi dòng nhập kho (sổ khối của hàng 1n nếu đã gộp; không thì design.md), nhóm khuôn `app-shell`, một dòng `wiki/log.md` | `src/app/(app)/proto/app-shell/**`, `design.md`, `design/patterns/app-shell.md` (xin chạm tệp) | `make check` | E8 | không |

Thứ tự: 1 → 2 → 3 → (đợi hàng 9 gộp) → 4 → 5 → 6 → lượt chấm.
