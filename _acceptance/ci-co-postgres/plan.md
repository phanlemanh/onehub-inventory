# Kế hoạch — 1s · CI có Postgres

Hồ sơ `_acceptance/ci-co-postgres/` · T3 · dãy C. Thứ tự tuần tự (các việc dùng chung `ci-db.sh` và một lượt dựng lại),
không tách song song.

| # | Việc | Tệp | Kiểm từng việc | Phục vụ |
|---|---|---|---|---|
| 1 | Bản chép bộ chạy cách ly ở d85d815 và 83d1764; bài cách ly đọc tệp chép; bài quét không gọi lịch sử git | `tests/fixtures/cach-ly-d85d815.sh`, `tests/fixtures/cach-ly-83d1764.sh`, `tests/db/cach-ly.db.test.ts`, `tests/ci-ban-sao-nong.test.ts` | `npx vitest run tests/ci-ban-sao-nong.test.ts` xanh; phá: bản sao còn `git show` → đỏ nêu tệp, dòng; bài cách ly trên Postgres dãy C xanh | E7 |
| 2 | Hàm dọn thư mục dựng tạm, gắn vào `globalSetup` của cả hai cấu hình Playwright | `tests/e2e-db/don-dung-tam.ts`, `playwright.config.ts`, `playwright.db.config.ts`, `tests/don-dung-tam.test.ts` | bài dọn xanh; phá: bỏ kiểm tiến trình sống → bài «lượt sống còn nguyên» đỏ; một lượt `make e2e` thật không để lại thư mục lượt | E8 |
| 3 | Phép đếm giao–nhận + báo cáo thật làm vật kiểm | `tests/e2e-db/dem-giao-nhan.ts`, `tests/dem-giao-nhan.test.ts`, `tests/fixtures/ci-db/*.json` | báo cáo chép từ lượt thật (việc 5 sinh lại nếu cần); ba bản phá đỏ đúng dòng ghim; đối chứng dương xanh | E4 |
| 4 | Lệnh một bước `make ci-db` | `db/scripts/ci-db.sh`, `mk/db.mk`, `tests/ci-db.test.ts`, `.env.example` (thêm dòng) | bài lệnh giả xanh đủ ma trận bước đỏ; `make ci-db DB_PORT=5569` trên Postgres dãy C xanh 6/6 | E1, E2, E3 |
| 5 | Lượt dựng lại máy chủ CI và bài bản vá | `db/scripts/ci-thu.sh`, `tests/ci-yml-patch.test.ts`, `_acceptance/ci-co-postgres/ci-yml.patch` | `bash db/scripts/ci-thu.sh` dòng cuối `ci-thu: xanh … · pha bo-phien do · pha vai-chu do`; bài bản vá xanh, đổi ảnh trong bản sao → in ảnh mới | E1, E2, E5, E6, E8b, E9 |
| 6 | Sổ ghi: wiki log, trang quyết định (số do G cấp nếu cần), tệp CI theo Hỏi-1 | `wiki/log.md`, `.github/workflows/ci.yml` (chỉ khi chủ kho cho) | `make check` xanh | — |

Việc 6 về tệp CI: nếu chủ kho chọn «thợ dán», thợ áp đúng `ci-yml.patch` đã duyệt (`git apply`), không sửa thêm chữ nào,
và PR chờ CI job `e2e-db` xanh trước Cổng Bằng chứng. Nếu chủ kho tự dán, Cổng Bằng chứng dựa vào lượt dựng lại (E5).
