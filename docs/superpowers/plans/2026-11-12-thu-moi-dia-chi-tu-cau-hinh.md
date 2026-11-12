# Kế hoạch: thư mời lấy địa chỉ từ cấu hình (hàng 9d)

Thiết kế: `docs/superpowers/specs/2026-11-12-thu-moi-dia-chi-tu-cau-hinh-design.md` · hồ sơ:
`_acceptance/thu-moi-dia-chi-tu-cau-hinh/`. Làm tuần tự (các việc chạm chung `config.ts`), viết bài kiểm trước.

## Việc 1 — Thư mời dựng từ địa chỉ cấu hình

- Files: `src/modules/identity/invite-mail.ts`, `src/modules/identity/invite-mail.test.ts`
- Làm: `inviteEmail(mail, appUrl?)` dùng `appUrl` khi có, gốc của thư khi không; `resendInviteSender` và
  `devInviteSender` nhận `appUrl` tuỳ chọn. Ca kiểm `thu-moi-dia-chi-cau-hinh-thang-goc-yeu-cau` (kèm lượt phá: bộ gửi bỏ
  `appUrl` thì ca đỏ đúng thông điệp).
- Verify: `npx vitest run src/modules/identity/invite-mail.test.ts --coverage.enabled=false`
- Phục vụ: E2 · independent: false

## Việc 2 — Biến bắt buộc và kiểm khuôn

- Files: `src/modules/identity/config.ts`, `src/modules/identity/config.test.ts`
- Làm: thêm `APP_URL` vào `PRODUCTION_VARS`; hàm kiểm khuôn (tuyệt đối, không tên/mật khẩu, không `?`/`#`, bản thật chỉ
  `https` — theo câu trả lời ở Cổng Phạm vi) gọi tên biến, không in giá trị; `readAuthConfig` truyền địa chỉ đã chuẩn hoá
  vào hai bộ gửi thư mời (máy phát triển: chỉ khi đã khai). Ca kiểm `ban-that-thieu-cau-hinh` (mở rộng),
  `dia-chi-goc-sai-khuon`, `thu-moi-khong-theo-ten-may-chu`, `thu-moi-duong-con`, `may-dev-theo-cau-hinh`,
  `thu-ma-khong-co-duong`, và ca khởi động của `src/instrumentation.ts` (không đổi tệp ấy trừ khi cần).
- Verify: `npx vitest run src/modules/identity/config.test.ts --coverage.enabled=false`, mỗi ca mới có lượt phá-thử.
- Phục vụ: E1, E2, E3, E4, E5, E6 · independent: false

## Việc 3 — Tài liệu cấu hình

- Files: `.env.example` (chỉ thêm dòng), `src/modules/identity/config.test.ts` (ca `env-mau-co-dia-chi-goc`)
- Verify: như việc 2
- Phục vụ: E7 · independent: false

## Việc 4 — Bài cơ sở dữ liệu của hàng 8 (chờ giám sát duyệt R-2)

- Files: `tests/db/dang-nhap.db.test.ts` — thêm đúng một dòng `APP_URL` vào cấu hình bản thật của ca đối chứng dương.
- Verify: `DB_LANE=r DB_PORT=5565 npx vitest run -c vitest.db.config.ts tests/db/dang-nhap.db.test.ts`
- Phục vụ: giữ bộ đầy đủ xanh · independent: false

## Việc 5 — Ghi chép

- Files: `wiki/log.md` (một dòng), `wiki/decisions/0021-dang-nhap-ma-email.md` hoặc 0022 — thêm một câu về `APP_URL`
  (xin chạm nếu ngoài ranh giới), `make check` một lần trước khi chấm.
