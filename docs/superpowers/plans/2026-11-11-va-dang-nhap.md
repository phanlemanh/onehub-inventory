# Vá phần đăng nhập (hàng 1m) — kế hoạch

Thiết kế: `docs/superpowers/specs/2026-11-11-va-dang-nhap-design.md` · Hợp đồng: `_acceptance/va-dang-nhap/contract.md`.

| Người dùng thấy gì khác                                                                     | Đụng đâu                                                   | Phục vụ tiêu chí                          |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------- |
| Đường link lách bằng tab, xuống dòng hay gạch ngược sau đăng nhập luôn đưa về trang Hôm nay | `next-path.ts`, `tests/next-path-matrix.test.ts`           | AC-1, AC-2 (đường trở về chỉ trong trang) |
| Bấm Đăng xuất mà lỗi thì thấy câu «Chưa đăng xuất được…», ở nguyên trang                    | `src/app/login/sign-out.ts`, `account-menu.tsx`, `copy.ts` | AC-3, AC-4 (đăng xuất báo đúng)           |
| Người hết sàn mà còn phiên thấy câu giải thích và nút Đăng xuất thay vì danh sách trống     | `login-form.tsx`, `page.tsx`                               | AC-5, AC-6 (lối thoát hết sàn)            |
| Bài trình duyệt chứng ba lỗ đã vá ở bốn khổ, sáng và tối; bài của hàng 8 vẫn xanh           | `tests/e2e-db/va-dang-nhap.spec.ts`                        | AC-2..AC-8 (đo trên trình duyệt)          |

## Task 1 — Kiểm đường trở về (independent: true)

- Files: `src/modules/identity/next-path.ts`, `tests/next-path-matrix.test.ts` (mới).
- Viết ma trận 18 ca dạng + 2 ca quan hệ trước (đỏ trên bản cũ ở L6..L9, L11..L13), rồi đổi `safeNext` sang danh sách
  cho phép + `new URL` với gốc giả, trả chuỗi gốc khi qua.
- Verify: `npx vitest run tests/next-path-matrix.test.ts src/modules/identity/code.test.ts --coverage.enabled=false`;
  lượt phá thử: dán lại bản cũ thì ca L6 đỏ với «L6 tab giữa hai gạch».
- Phục vụ E1.

## Task 2 — Hàm đăng xuất dùng chung và menu tài khoản (independent: false — Task 3 dùng hàm này)

- Files: `src/app/login/sign-out.ts` (mới), `src/app/login/copy.ts` (thêm câu `signOutFailed`, `noCompanySession`),
  `src/app/(app)/account-menu.tsx` (chỉ hàm `signOut`).
- `signOut(): Promise<boolean>` gọi `DELETE /api/v1/auth/session`; 2xx → `true`; lỗi mạng hay khác 2xx →
  `notify("result", { message: COPY.signOutFailed })` rồi `false`. Menu: `false` thì bỏ khoá nút, ở nguyên trang.
- Verify: `make typecheck`, `npx vitest run tests/behavior-guard.test.ts tests/label.test.ts --coverage.enabled=false`.
- Phục vụ E4, E5, E6.

## Task 3 — Trạng thái hết sàn khi còn phiên (independent: false — sau Task 2)

- Files: `src/app/login/login-form.tsx`, `src/app/login/page.tsx` (nếu cần truyền cờ phiên).
- Phiên không sàn và danh sách sàn rỗng → bước `no-company-session`: câu `noCompanySession` + nút «Đăng xuất» (nhãn
  `SignOut`), nút chỉ bị khoá khi chờ. Thoát được → tải lại `/login`.
- Verify: `make typecheck`, `make lint`.
- Phục vụ E7, E8, E9.

## Task 4 — Bài trình duyệt trên Postgres dãy R (independent: false — sau Task 1–3)

- Files: `tests/e2e-db/va-dang-nhap.spec.ts` (mới).
- Tám ca theo `evals.yaml`; cắt mạng bằng `page.route`; đếm phiên bằng vai chủ; `SHOTS_DIR` chụp khung `E15-step<n>.png`.
- Lượt phá thử: hàm đăng xuất bỏ qua kết quả → `dang-xuat-mang-dut` đỏ với «đăng xuất lỗi mà rời trang»; ghi ở đầu tệp.
- Verify: `DB_LANE=r DB_PORT=5565 npx playwright test -c playwright.db.config.ts`.
- Phục vụ E2–E9, E13–E15.

## Task 5 — Kiểm trọn và ghi sổ (independent: false — cuối)

- `make check`; ba lệnh dãy R (`va_dang_nhap_db`, `va_dang_nhap_e2e`, `va_dang_nhap_cach_ly`); một dòng `wiki/log.md`.
- Phục vụ E10, E11, E12.
