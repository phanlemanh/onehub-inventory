# Kế hoạch: ba luật lint giao diện chặn được mẫu thử của công cụ thiết kế

Hồ sơ: `_acceptance/sua-ba-luat-lint-giao-dien/` (Cổng Phạm vi duyệt 2026-11-26). Nhánh `fix/eslint-ui-rule-gaps`, PR #123.
Mã chính đã có trên nhánh từ trước khi mở hồ sơ (dòng sổ `d-20261126T061152Z-11`); kế hoạch ghi lại nó như việc đã xong
và chỉ thêm phần hợp đồng còn thiếu.

## Task 1 — sửa ba luật, nối bộ hậu xử lý, ghi lý do hai ngoại lệ (ĐÃ XONG, commit `6d5d332d`)

- Files: `tools/eslint-ui/rules/no-off-scale-spacing.mjs`, `tools/eslint-ui/rules/no-partial-class.mjs`,
  `tools/eslint-ui/rules/require-disable-reason.mjs`, `tools/eslint-ui/index.mjs`, `eslint.config.js`,
  `src/components/candidate/data-region.tsx`, `tests/eslint-ui/*.test.mjs`, `design/theme.json`,
  `.claude/rules/design-assembly.md`, một dòng `wiki/log/`.
- Verify: `npx vitest run tests/eslint-ui/` (168 đạt) và `node _acceptance/sua-ba-luat-lint-giao-dien/rang/two-way.mjs`.
- Phục vụ: E1, E2, E3, E4, E5, E8.
- independent: false

## Task 2 — trang quyết định trong wiki cho quy ước «mọi ngoại lệ lint có lý do»

- Files: `wiki/decisions/0049-moi-ngoai-le-lint-co-ly-do.md` (theo khuôn `decision` của `ontology/page-types.yaml`),
  một dòng nhật ký bằng `make log`.
- Nội dung: vì sao (công cụ thiết kế thấy dòng `lint-exceptions` chỉ «khai»), quyết định (chủ kho, Hỏi-1, dòng sổ
  `d-20261126T061152Z-5` và `d-20261126T062806Z-14`), cách giữ (luật `onehub-ui/require-disable-reason` + bộ hậu xử lý
  `onehub-ui/reasons`, Hỏi-2), hệ quả cho người viết màn, cách đảo.
- Verify: `node _acceptance/sua-ba-luat-lint-giao-dien/rang/wiki.mjs` thoát 0; `make check` (wiki-lint đọc khuôn trang).
- Phục vụ: E10.
- independent: false

## Task 3 — kiểm tổng

- Verify: `make check` và `npm run build` thoát 0; `two-way.mjs` thoát 0 với mười dòng «đúng».
- Phục vụ: E6, E7, E8, E9.
- independent: false

Thứ tự: Task 2 → Task 3. Không task nào chạy song song.
