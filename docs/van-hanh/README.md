# Sổ tay vận hành

Sổ tay cho người đưa Inventory lên mạng và giữ nó chạy: bản thử (staging) và bản thật (production) ở
`https://inventory.onehub.center`. Mỗi môi trường là một dự án Vercel riêng và một cơ sở dữ liệu Supabase riêng, cùng ở
Singapore. Mọi việc trong kho đi qua một lệnh `make`; việc ngoài kho (tài khoản, khoá, tên miền) do chủ kho làm theo danh
sách dưới đây. Sổ tay không bao giờ ghi giá trị của khoá, mật khẩu hay địa chỉ cơ sở dữ liệu — chỉ ghi tên biến.

## Các quy trình

| Quy trình         | Khi nào                                                         | Tệp                                          |
| ----------------- | --------------------------------------------------------------- | -------------------------------------------- |
| Đưa bản lên       | Có bản phát hành mới, hoặc vừa đổi biến trên Vercel             | [dua-ban-len.md](dua-ban-len.md)             |
| Lùi bản           | Bản đang chạy hỏng sau khi lên                                  | [lui-ban.md](lui-ban.md)                     |
| Xoay khoá bí mật  | Khoá lộ, người giữ khoá rời đi, hay tới hạn đổi                 | [xoay-khoa.md](xoay-khoa.md)                 |
| Khôi phục dữ liệu | Thử khôi phục lúc ra mắt rồi mỗi quý; mất hay hỏng dữ liệu thật | [khoi-phuc.md](khoi-phuc.md)                 |
| Nhật ký khôi phục | Ghi mỗi lần thử khôi phục                                       | [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md) |

Mỗi bước trong bốn quy trình ghi bốn điều: làm ở đâu, gõ hay bấm gì, thấy gì là đạt, đỏ thì làm gì.

## Lệnh của kho

| Lệnh                           | Làm gì                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `make deploy ENV=staging`      | Đưa commit đang đứng lên bản thử: kiểm cấu hình, áp migration, kiểm cách ly, dựng, kiểm, gắn tên miền |
| `make deploy ENV=production`   | Như trên cho bản thật; trước hết đòi bản thử đã chạy đúng commit này                                  |
| `make smoke ENV=staging`       | Kiểm nhanh chỉ đọc địa chỉ `APP_URL` của môi trường                                                   |
| `make rollback ENV=production` | Trỏ tên miền về bản trước, rồi kiểm nhanh                                                             |
| `make cach-ly-dich`            | Bộ kiểm cách ly chỉ đọc trên một cơ sở dữ liệu đích                                                   |
| `make sao-luu TEP=<tệp>`       | Sao lưu cơ sở dữ liệu đích ra một tệp ngoài kho, kèm tệp đếm dòng                                     |
| `make khoi-phuc-thu TEP=<tệp>` | Thử khôi phục tệp sao lưu vào một cơ sở nháp, đếm dòng, kiểm cách ly, in dòng cho nhật ký             |

`ENV` nhận `staging` hoặc `production`. Lệnh chỉ kiểm biến có mặt, không bao giờ in giá trị.

Đường kiểm sức khoẻ của mỗi bản đang chạy: `<APP_URL>/api/v1/health`, trả đúng bốn khoá `ok`, `commit`, `env`, `vai`. Bản
khoẻ trả `ok: true`, `vai: "dat"` (vai nối cơ sở dữ liệu đạt luật cách ly).

## Việc ngoài kho

Chủ kho làm theo đúng thứ tự này một lần, trước lần đưa bản đầu. Mỗi việc ghi máy cần nhận lại biến nào và đặt ở đâu —
chỉ tên biến, giá trị gõ thẳng vào trang của dịch vụ, không dán vào kho, vào chat hay vào PR. Bảng biến ở mục sau nói mỗi
biến dùng cho gì.

1. **Supabase — hai dự án.** Ở supabase.com, trong tổ chức trả phí, tạo hai dự án: một cho bản thử, một cho bản thật,
   vùng Southeast Asia (Singapore), gói có sao lưu hằng ngày giữ 7 ngày. Mật khẩu vai chủ (`postgres`) do Supabase hỏi
   lúc tạo: cất vào trình giữ mật khẩu. Máy nhận lại: chưa biến nào ở bước này.
2. **Supabase — tắt Data API ở cả hai dự án.** Ở mỗi dự án: Project Settings › Data API, tắt «Enable Data API». Không
   thấy công tắc ấy thì để đó: lần đưa bản đầu, bộ kiểm cách ly gọi tên từng bảng còn cấp quyền cho `anon` hay
   `authenticated`, và [dua-ban-len.md](dua-ban-len.md) nói cách thu quyền. Máy nhận lại: không biến nào.
3. **Supabase — chuỗi nối của vai chủ.** Ở mỗi dự án: nút Connect › Session pooler, chép chuỗi nối (có mật khẩu vai chủ).
   Máy nhận lại: `MIGRATE_DATABASE_URL`, đặt ở bước 10 làm khoá bí mật của môi trường GitHub tương ứng.
4. **Chọn mật khẩu vai đăng nhập.** Ứng dụng nối bằng vai `quy_hang_login`; vai này được migration tạo ở lần đưa bản đầu,
   chưa có mật khẩu. Tạo trước hai mật khẩu dài ngẫu nhiên (một cho bản thử, một cho bản thật), cất vào trình giữ mật khẩu.
   Từ đó dựng hai chuỗi nối: cùng máy chủ và cổng như chuỗi Session pooler của bước 3, tên người dùng là `quy_hang_login`.
   Máy nhận lại: `DATABASE_URL` (bước 9), `LOGIN_DATABASE_URL` (bước 10, chỉ bản thử).
5. **Vercel — hai dự án.** Ở vercel.com, trong nhóm gói Pro: Add New › Project, nhập kho này hai lần, đặt tên khác nhau
   cho bản thử và bản thật, khung Next.js. Ở mỗi dự án, Settings › Git: kiểm tự triển khai theo nhánh đã tắt (kho ghi sẵn
   ở `vercel.json`); Settings › Functions: vùng Singapore (`sin1`). Máy nhận lại: `VERCEL_ORG_ID` (Team Settings ›
   General › Team ID, chung hai dự án) và `VERCEL_PROJECT_ID` (Project Settings › General › Project ID, mỗi dự án một
   giá trị).
6. **Vercel — khoá cho máy đưa bản lên.** Account Settings › Tokens › Create, phạm vi là nhóm có hai dự án, hạn 1 năm.
   Ghi ngày hết hạn vào lịch để xoay khoá ([xoay-khoa.md](xoay-khoa.md)). Máy nhận lại: `VERCEL_TOKEN`.
7. **Vercel — bảo vệ bản mới.** Ở mỗi dự án: Settings › Deployment Protection. Nếu «Vercel Authentication» đang bật, tạo
   «Protection Bypass for Automation» để lệnh kiểm nhanh đọc được địa chỉ riêng của bản mới. Tắt thì bỏ qua bước này.
   Máy nhận lại: `VERCEL_AUTOMATION_BYPASS_SECRET` (chỉ khi bật).
8. **Resend — tên miền gửi thư.** Ở resend.com: Domains › Add Domain, nhập `onehub.center` hoặc một tên miền con của nó
   (bản dựng chỉ nhận địa chỉ gửi thuộc `onehub.center` và các tên miền con). Thêm các bản ghi DNS Resend đưa vào trang
   DNS của `onehub.center` trên Vercel (Domains › `onehub.center`), chờ trạng thái Verified. Rồi API Keys › Create, quyền
   Sending access, mỗi môi trường một khoá. Máy nhận lại: `RESEND_API_KEY`, `MAIL_FROM` (dạng `OneHub <dia-chi@tên miền
đã xác minh>`).
9. **Vercel — tên miền và biến của từng dự án.** Dự án bản thật: Settings › Domains, thêm `inventory.onehub.center`. Dự
   án bản thử: thêm tên miền bản thử chủ kho chọn (không ghi vào kho). Rồi ở mỗi dự án, Settings › Environment Variables,
   đặt cho môi trường **Production** của dự án ấy (cả dự án bản thử: bản thử là bản Production của dự án riêng của nó):
   `DATABASE_URL`, `AUTH_SECRET` (chuỗi ngẫu nhiên dài, mỗi môi trường một chuỗi), `RESEND_API_KEY`, `MAIL_FROM`,
   `APP_URL` (`https://inventory.onehub.center` ở bản thật; địa chỉ https của tên miền bản thử ở bản thử), `APP_ENV`
   (`staging` hoặc `production`). Không bao giờ đặt `MIGRATE_DATABASE_URL`, `LOGIN_CODE_OUTBOX` hay
   `NEXT_PUBLIC_E2E_BUTTON_RECORD` ở Vercel: bản dựng thấy chúng thì không khởi động. Máy nhận lại: sáu biến trên ở mỗi
   dự án.
10. **GitHub — hai môi trường.** Ở trang kho trên GitHub: Settings › Environments, tạo `staging` và `production`. Môi
    trường `production`: Required reviewers chỉ có chủ kho (Hỏi-2); Deployment branches and tags: Selected, thêm
    nhánh `main` và thẻ khuôn `*v*` (thẻ phát hành, để đưa lại đúng bản đang chạy). Đặt khoá bí mật
    (Environment secrets) và biến (Environment variables) theo cột GitHub của bảng biến. Máy nhận lại: ở `staging` —
    khoá `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (dự án bản thử), `MIGRATE_DATABASE_URL` (dự án bản thử),
    `LOGIN_DATABASE_URL`, `VERCEL_AUTOMATION_BYPASS_SECRET` (nếu có) và biến `APP_URL`; ở `production` — khoá
    `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (dự án bản thật), `MIGRATE_DATABASE_URL` (dự án bản thật),
    `VERCEL_AUTOMATION_BYPASS_SECRET` (nếu có) và biến `APP_URL`, `STAGING_APP_URL`.
11. **GitHub — tệp tự động triển khai.** Sau khi PR của hàng 22 đã gộp, chép tệp `deploy.yml` từ
    `_acceptance/moi-truong-thu-va-ban-that/workflows-de-xuat.md` vào `.github/workflows/deploy.yml` bằng một commit
    riêng. Việc Release đang đỏ vì thiếu khoá `RELEASE_PLEASE_TOKEN`: làm theo
    `_acceptance/don-no-bo-kiem/release-de-xuat.md`. Cuối cùng, Settings › Secrets and variables › Actions › Variables,
    đặt biến kho `DEPLOY_ENABLED` là `true`. Máy nhận lại: biến kho `DEPLOY_ENABLED`.
12. **Lần đưa bản đầu và mật khẩu vai đăng nhập.** Theo [dua-ban-len.md](dua-ban-len.md), mục «Lần đầu ở một môi
    trường»: lần chạy đầu dừng ở bước cần vai đăng nhập (bản thử: `cach-ly`; bản thật: `kiem-nhanh`) vì vai vừa được tạo
    chưa có mật khẩu. Đặt mật khẩu của bước 4 cho vai ấy trong SQL Editor của Supabase rồi chạy lại. Máy nhận lại: không
    biến mới; sức khoẻ của hai môi trường trả `vai: "dat"`.
13. **Lần thử khôi phục đầu.** Theo [khoi-phuc.md](khoi-phuc.md) trên bản thử, chép dòng kết quả vào
    [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md). Đặt lịch nhắc thử lại mỗi quý (Hỏi-3). Máy nhận lại: một dòng mới trong
    nhật ký khôi phục.

## Bảng biến

Mọi biến sổ tay nhắc, đặt ở đâu và dùng cho gì. «Máy chủ kho» là máy của người vận hành, khi chạy lệnh bằng tay; giữ biến
ở một tệp ngoài kho (quyền chỉ chủ đọc), nạp vào vỏ lệnh trước khi chạy, không gõ thẳng giá trị vào dòng lệnh.

| Biến                              | Đặt ở đâu                                                            | Dùng cho                                                                         |
| --------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `APP_ENV`                         | Vercel, mỗi dự án                                                    | `staging` hoặc `production`; bản dựng không khởi động nếu thiếu hay lạ           |
| `DATABASE_URL`                    | Vercel, mỗi dự án                                                    | Ứng dụng nối cơ sở dữ liệu bằng vai `quy_hang_login`, không bao giờ bằng vai chủ |
| `AUTH_SECRET`                     | Vercel, mỗi dự án                                                    | Khoá băm mã đăng nhập                                                            |
| `RESEND_API_KEY`                  | Vercel, mỗi dự án                                                    | Gửi thư mã đăng nhập và thư mời                                                  |
| `MAIL_FROM`                       | Vercel, mỗi dự án                                                    | Địa chỉ gửi thư, thuộc `onehub.center` hay tên miền con                          |
| `APP_URL`                         | Vercel, mỗi dự án; GitHub, biến của cả hai môi trường; máy chủ kho   | Địa chỉ của môi trường; đường dẫn trong thư dựng từ nó; lệnh kiểm nhanh đọc nó   |
| `STAGING_APP_URL`                 | GitHub, biến của môi trường `production`                             | Bản thật kiểm bản thử đã chạy đúng commit trước khi lên                          |
| `VERCEL_TOKEN`                    | GitHub, khoá của cả hai môi trường; máy chủ kho                      | Lệnh đưa bản lên và lùi bản gọi Vercel                                           |
| `VERCEL_ORG_ID`                   | GitHub, khoá của cả hai môi trường; máy chủ kho                      | Nhóm Vercel chứa hai dự án                                                       |
| `VERCEL_PROJECT_ID`               | GitHub, khoá của mỗi môi trường (khác nhau); máy chủ kho             | Dự án Vercel của môi trường                                                      |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | GitHub, khoá của cả hai môi trường; máy chủ kho — chỉ khi bật bảo vệ | Lệnh kiểm nhanh đọc được địa chỉ riêng của bản mới                               |
| `MIGRATE_DATABASE_URL`            | GitHub, khoá của mỗi môi trường; máy chủ kho. Không bao giờ ở Vercel | Vai chủ: áp migration, đọc danh mục cho bộ kiểm cách ly, sao lưu                 |
| `LOGIN_DATABASE_URL`              | GitHub, khoá của môi trường `staging`; máy chủ kho                   | Vai đăng nhập cho bộ kiểm cách ly đích                                           |
| `KHOI_PHUC_ADMIN_URL`             | Máy chủ kho                                                          | Máy chủ cơ sở dữ liệu nơi thử khôi phục, bằng vai được tạo cơ sở nháp            |
| `KHOI_PHUC_LOGIN_URL`             | Máy chủ kho                                                          | Vai đăng nhập trên cùng máy chủ ấy, cho bộ kiểm cách ly bản khôi phục            |
| `KHOI_PHUC_GIU`                   | Máy chủ kho, tuỳ chọn                                                | `1` để giữ cơ sở nháp sau lần thử, xem bằng tay                                  |
| `SAO_LUU_LUOC_DO`                 | Máy chủ kho, tuỳ chọn                                                | Chỉ sao lưu và đếm các lược đồ của ta (trên Supabase: `public identity app`)     |
| `PSQL_DICH`                       | Máy chủ kho, tuỳ chọn                                                | Lệnh `psql` dùng để nối (mặc định `psql`)                                        |
| `PG_DUMP_CMD`                     | Máy chủ kho, tuỳ chọn                                                | Lệnh `pg_dump` (mặc định `pg_dump`)                                              |
| `PG_DUMP_ARGS`                    | Máy chủ kho, tuỳ chọn                                                | Cờ thêm cho `pg_dump`                                                            |
| `PG_RESTORE_CMD`                  | Máy chủ kho, tuỳ chọn                                                | Lệnh `pg_restore` (mặc định `pg_restore`)                                        |
| `LOGIN_CODE_OUTBOX`               | Chỉ máy dev. Không bao giờ ở Vercel                                  | Ghi mã đăng nhập ra tệp cho bài kiểm trình duyệt                                 |
| `NEXT_PUBLIC_E2E_BUTTON_RECORD`   | Chỉ bài kiểm trình duyệt. Không bao giờ ở Vercel                     | Ghi quyết định của nút quyền lên trang                                           |
| `CACH_LY_CMD`                     | Chỉ bài kiểm của kho                                                 | Thay lệnh kiểm cách ly trong bài kiểm lệnh đưa bản lên                           |

Hai thứ không phải biến của lệnh nên không có trong bảng: biến kho `DEPLOY_ENABLED` của GitHub (bật tệp tự động triển
khai, việc 11) và mã commit mà lệnh đưa bản lên tự gắn vào bản dựng để sức khoẻ trả đúng `commit`.
