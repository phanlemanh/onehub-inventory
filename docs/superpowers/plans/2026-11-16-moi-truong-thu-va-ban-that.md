# Kế hoạch dựng — hàng 22 «Môi trường thử và bản thật»

Hồ sơ: `_acceptance/moi-truong-thu-va-ban-that/` (contract duyệt 2026-11-16, Manh Phan, bảy câu theo khuyến nghị).
Bắt đầu khi giám sát báo «hàng 10 đã gộp»; gộp `origin/main` trước task 1. Postgres làn K: `make db-up DB_LANE=k DB_PORT=5564`.
Mọi bài kiểm tạo thư mục tạm dùng `tempDir()` của `tests/support/temp-dir.ts`. Mỗi phép đo mới kèm ca phá cùng fixture.

## Task 1 — Phép kiểm khởi động mở rộng

- Files: `src/modules/identity/config.ts`, `src/modules/identity/config-ban-that.test.ts` (mới), `src/instrumentation.ts`
  (chỉ nếu cần đổi chỗ gọi), `.env.example` (thêm `APP_ENV`).
- Việc: `APP_ENV` bắt buộc khi `NODE_ENV=production`; ba biến cấm; vai nối `quy_hang_login` (đọc tên người dùng từ
  `DATABASE_URL`, không in giá trị); bản thật đòi `APP_URL` = `https://inventory.onehub.center`; tên miền `MAIL_FROM` là
  `onehub.center` hay tên miền con; đường dẫn trong thư mã và thư mời bắt đầu bằng `APP_URL` (đọc thân thư qua `fetch` giả).
- Verify: `npx vitest run src/modules/identity/config.test.ts src/modules/identity/config-ban-that.test.ts`; ca phá: bỏ
  kiểm vai nối trên bản sao hàm → ca «DATABASE_URL vai postgres» đỏ.
- Phục vụ: E5. independent: true

## Task 2 — Đường sức khoẻ chỉ đọc

- Files: `src/modules/identity/server.ts` (hàm `healthOf`), `src/app/api/v1/health/route.ts` (mới), bài kiểm đơn vị kèm.
- Việc: `{ ok, commit, env, vai }`; `vai` đọc bằng phép kiểm vai của cửa truy vấn; không đọc bảng của sàn.
- Verify: bài đơn vị với cửa giả (vai đạt / vai chủ); `make check` cho ranh giới mô-đun.
- Phục vụ: E6, E12. independent: true

## Task 3 — Lệnh đưa bản lên, lùi bản, kiểm nhanh

- Files: `tools/deploy/len-ban.mjs`, `tools/deploy/kiem-nhanh.mjs`, `tools/deploy/lui-ban.mjs`, `tools/deploy/*.test.ts`,
  `mk/deploy.mk`, `vercel.json` (mới: vùng `sin1`, tắt tự triển khai theo nhánh, Node 24).
- Việc: bảy bước mỗi môi trường; dừng ở bước đỏ; tự lùi khi kiểm sau gắn tên miền đỏ; bản thật đòi bản thử chạy đúng
  commit; chặn migration xoá hay đổi tên mà thiếu `-- bo-sau:` (Hỏi-4); không in giá trị biến.
- Verify: `npx vitest run tools/deploy` với `vercel` giả trên PATH và máy chủ sức khoẻ giả; ma trận bước đỏ đầu
  `evals.yaml`; ca phá đổi thứ tự gắn tên miền trước kiểm nhanh → đỏ.
- Phục vụ: E1, E2, E3, E4. independent: false (cần đường sức khoẻ của task 2 cho phần đọc commit)

## Task 4 — Bộ kiểm cách ly đích chỉ đọc

- Files: `db/scripts/cach-ly-dich.sh`, `tests/db/cach-ly-dich.db.test.ts`, `mk/deploy.mk` (đích `cach-ly-dich`).
- Việc: giao dịch chỉ đọc; luật dòng ép trên mọi bảng có `company_id`; quyền `anon`, `authenticated`, `PUBLIC`; vai không
  chủ; ca phiên vai đăng nhập; đếm cơ sở dữ liệu và dòng trước = sau.
- Verify: lệnh `cach_ly_dich` trên Postgres làn K; ba bản phá với thông điệp ghim.
- Phục vụ: E7. independent: true

## Task 5 — Sao lưu và thử khôi phục

- Files: `db/scripts/sao-luu.sh`, `db/scripts/khoi-phuc-thu.sh`, `tests/db/sao-luu.db.test.ts`, `mk/deploy.mk`.
- Việc: từ chối đường trong cây kho; khôi phục vào cơ sở nháp, đếm dòng, chạy `cach-ly-dich`, in dòng nhật ký.
- Verify: lệnh `sao_luu_khoi_phuc`; bản phá xoá một bảng khỏi tệp → đỏ gọi tên bảng.
- Phục vụ: E8. independent: false (dùng `cach-ly-dich.sh` của task 4)

## Task 6 — Bản dựng thật trên làn K

- Files: `tools/deploy/thu-ban-dung.sh`.
- Việc: `next build` + `next start` với `NODE_ENV=production`, `APP_ENV=staging`, nối Postgres làn K bằng `quy_hang_login`;
  sức khoẻ; mọi `/proto/<slug>` 404; `?vai=`, `?mau=`, `?state=` không tác dụng khi chưa đăng nhập và với phiên tự ký;
  đối chứng dương trên máy dev; lần nối bằng vai chủ → `ok: false`.
- Verify: lệnh `ban_dung_that` (chạy dưới lượt chấm vì nặng).
- Phục vụ: E6. independent: false (cần task 1, 2)

## Task 7 — Bộ dò khoá bí mật và mẫu biến

- Files: `tests/khong-khoa-bi-mat.test.ts`, `.env.example` (năm biến còn lại).
- Verify: lệnh `khoa_bi_mat`; bản sao trong `tempDir()` có một dòng khoá giả → đỏ gọi tên tệp, dòng.
- Phục vụ: E11. independent: true

## Task 8 — Sổ tay vận hành và bản đề xuất tệp tự động triển khai

- Files: `docs/van-hanh/README.md`, `dua-ban-len.md`, `lui-ban.md`, `xoay-khoa.md`, `khoi-phuc.md`,
  `nhat-ky-khoi-phuc.md`, `tests/van-hanh.test.ts`, `_acceptance/moi-truong-thu-va-ban-that/workflows-de-xuat.md`
  (soạn lại theo lệnh đã dựng).
- Verify: lệnh `van_hanh`; bản phá sổ tay nhắc một đích không có → đỏ.
- Phục vụ: E9, E10. independent: false (cần tên đích của task 3–5)

## Task 9 — Sổ wiki

- Files: `wiki/log.md` (một dòng), `wiki/entities/` nếu có trang chạm.
- Verify: `make check`.
- Phục vụ: E12. independent: false (cuối)

Thứ tự: 1, 2, 4, 7 song song được → 3 → 5 → 6 → 8 → 9. Sau đó S4 dưới lượt chấm.
