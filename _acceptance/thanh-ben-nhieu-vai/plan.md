# Kế hoạch: thanh-ben-nhieu-vai (hàng 1i, T2)

Hai việc, làm tuần tự (việc 2 dựa trên API của việc 1).

## Việc 1 — luật lọc theo danh sách vai

- Files: `src/components/templates/nav-menu.tsx`, `src/components/templates/app-shell.tsx`, `tests/frame.test.tsx`
- Làm: `NavItem.roles` dùng `Role` sinh từ `ontology/roles.yaml`; `visibleNav(items, roles?)` hiện mục không giới hạn và mục có ít nhất một vai trong danh sách, theo thứ tự khai; `NavMenu` và `AppShell` nhận `roles` thay `role`; ba chỗ gọi trong `tests/frame.test.tsx` truyền danh sách một vai, bảng một vai giữ nguyên.
- Verify: `npx vitest run tests/frame.test.tsx --coverage.enabled=false`, `npm run typecheck`
- Phục vụ: E2, E4, E5
- independent: false

## Việc 2 — bài kiểm nhiều vai

- Files: `tests/nav-roles.test.tsx` (mới)
- Làm: ma trận viết trước 16 tổ hợp × 5 mục xen kẽ, so tập khoá với tập tổ hợp con; ca nhiều vai, một vai, không rõ vai; khung `AppShell` dựng thật; kiểm kiểu vai lạ (`@ts-expect-error`) và so kiểu vai với `Role`; các ca đối chứng ghim thông điệp.
- Verify: `npx vitest run tests/nav-roles.test.tsx --coverage.enabled=false`, `npm run typecheck`, phá thử (lọc theo một vai, dồn mục chung, nới kiểu về chuỗi) thấy đỏ rồi hoàn lại
- Phục vụ: E1, E2, E3, E4, E5
- independent: false
