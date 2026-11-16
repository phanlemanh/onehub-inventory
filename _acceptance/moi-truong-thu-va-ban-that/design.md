# Thiết kế — hàng 22 «Môi trường thử và bản thật»

Ngày soạn 2026-11-16, dãy K. Nguồn: hàng 22 của `docs/plan/lo-trinh.json`, ô cơ hội `opportunity.md` (quyết «build»,
Manh Phan, 2026-11-15), quyết định [0041](../../wiki/decisions/0041-ban-that-o-dia-chi-rieng.md), luật kho `AGENTS.md`,
`PRODUCT-INVARIANTS.md` (SP-1, SP-3, SP-4). Chi phí: [chi-phi.md](chi-phi.md).

## Mục tiêu

Người của sàn mở `inventory.onehub.center`, nhận mã qua email và vào đúng sàn của mình trên bản chạy thật. Mỗi bản mới đi
qua bản thử trước khi lên bản thật, và lùi được về bản trước. Hàng này không có màn mới.

## Phần của máy (trong kho) và phần của chủ kho (ngoài kho)

| Phần của máy — trong kho, kiểm được tại máy và trên Postgres của làn K | Phần của chủ kho — ngoài kho |
|---|---|
| Lệnh `make deploy ENV=staging|production`: kiểm cấu hình → áp migration → (bản thử) kiểm cách ly → dựng bản mới chưa gắn tên miền → kiểm nhanh chỉ đọc → gắn tên miền → kiểm nhanh lần hai | Tạo tài khoản Vercel, Supabase, Resend và chọn gói (chi phí) |
| Lệnh `make rollback ENV=…`: gắn tên miền về bản trước, rồi kiểm nhanh | Hai dự án Vercel, hai cơ sở dữ liệu Supabase vùng Singapore |
| Đường kiểm sức khoẻ chỉ đọc `GET /api/v1/health`: bản nào đang chạy, môi trường nào, vai nối cơ sở dữ liệu có đạt luật SP-1 không | Tắt Data API của Supabase; xác minh tên miền gửi thư ở Resend; trỏ tên miền |
| Phép kiểm cấu hình lúc khởi động mở rộng: thiếu biến, biến chỉ của máy dev, vai chủ bảng, địa chỉ gửi thư lệch tên miền → không khởi động, gọi tên biến | Nhập khoá bí mật vào môi trường của GitHub và Vercel |
| Bộ kiểm cách ly chỉ đọc chạy trên một cơ sở dữ liệu đích (bản thử), không tạo bảng, không ghi | Đặt hai tệp tự động triển khai `.github/workflows/deploy.yml`, `release.yml` từ bản đề xuất |
| Lệnh sao lưu ra tệp ngoài kho và lệnh thử khôi phục vào một cơ sở nháp, đếm dòng và chạy kiểm cách ly trên bản khôi phục | Thử khôi phục thật trên bản thử một lần và ghi vào nhật ký khôi phục |
| Sổ tay vận hành `docs/van-hanh/`: đưa bản lên, lùi bản, xoay khoá, khôi phục; danh sách việc ngoài kho theo thứ tự | Đặt người duyệt cho môi trường production trên GitHub |
| `vercel.json`: vùng `sin1`, tắt tự triển khai theo nhánh của Vercel | |
| Bộ dò khoá bí mật trong kho, `.env.example` kê mọi biến mới với giá trị rỗng | |
| Bản đề xuất hai tệp tự động triển khai, dạng văn bản trong hồ sơ: `workflows-de-xuat.md` | |

## Luồng đưa bản lên

Mỗi môi trường là một dự án Vercel riêng (bản thử, bản thật) và một cơ sở dữ liệu Supabase riêng. Lệnh đi từng bước, mỗi
bước in một dòng `deploy <ENV>: <bước> đạt` hoặc `deploy <ENV>: <bước> ĐỎ — <lý do>`; dòng cuối
`deploy <ENV>: xong <commit ngắn> tại <tên miền>` hoặc `deploy <ENV>: DỪNG ở <bước> — <ENV> vẫn chạy bản <commit cũ>`.

1. `cau-hinh` — đủ tên biến cần cho ENV (chỉ kiểm có mặt, không in giá trị); `vercel.json` ghi vùng `sin1` và tắt tự
   triển khai theo nhánh.
2. `ban-thu-truoc` — chỉ ở bản thật: bản thử đang chạy đúng commit này (đọc `GET /api/v1/health` của bản thử). Khác thì
   dừng: «bản thử chưa chạy <commit>».
3. `migration` — áp migration chưa chạy bằng `db/scripts/migrate.sh`, qua `MIGRATE_DATABASE_URL` (vai chủ, chỉ ở bước
   này, không bao giờ tới ứng dụng).
4. `cach-ly` — chỉ ở bản thử: bộ kiểm cách ly chỉ đọc trên cơ sở dữ liệu bản thử.
5. `dung` — `vercel build` rồi `vercel deploy --prebuilt --prod --skip-domain`: bản mới có địa chỉ riêng, tên miền vẫn trỏ
   bản cũ.
6. `kiem-nhanh` — chỉ đọc, trên địa chỉ riêng của bản mới: sức khoẻ trả đúng commit, đúng ENV, vai nối đạt; trang đăng
   nhập mở được; lối thử của máy dev bị khoá (`/proto/*` không có, `?vai=`, `?mau=`, `?state=` không đổi gì, chưa đăng
   nhập thì về trang đăng nhập).
7. `gan-ten-mien` — `vercel promote <địa chỉ bản mới>`.
8. `kiem-nhanh-ten-mien` — cùng phép kiểm trên tên miền. Đỏ thì tự lùi về bản trước (`vercel rollback`) và báo.

Bước 1–6 đỏ: tên miền không đổi, bản thật vẫn chạy bản cũ. Riêng bước 3 đã áp thì cơ sở dữ liệu đã đổi trong khi mã vẫn
cũ — vì vậy migration phải để bản cũ chạy tiếp được (thêm trước, bỏ sau ở một bản kế), xem Hỏi-4.

Hai dự án Vercel hay một (Hỏi-6): máy khuyên hai — lệnh gắn tên miền và lùi bản giống hệt nhau cho cả hai, biến của
hai bên không lẫn. Lối «một dự án với môi trường tuỳ biến» vẫn chạy được trên gói Pro (bản thử lùi bằng cách gắn lại địa
chỉ bản trước), ít việc ngoài kho hơn.

Vì sao tắt tự triển khai theo nhánh của Vercel: nó đưa mã lên trước khi migration chạy, trái với «áp migration trước».

## Cấu hình lúc khởi động (bản thử và bản thật)

Bản dựng chạy với `NODE_ENV=production` ở cả hai môi trường; `APP_ENV` phân biệt `staging` và `production`.
`src/modules/identity/config.ts` và `src/instrumentation.ts` dừng khởi động, gọi tên biến, không in giá trị, khi:

- thiếu một trong `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`, `APP_URL`, `APP_ENV`;
- `APP_ENV` không phải `staging` hay `production`;
- có mặt một biến chỉ của máy dev hay máy kiểm: `LOGIN_CODE_OUTBOX`, `NEXT_PUBLIC_E2E_BUTTON_RECORD`,
  `MIGRATE_DATABASE_URL`;
- `DATABASE_URL` không nối bằng vai `quy_hang_login`;
- `APP_ENV=production` mà `APP_URL` khác `https://inventory.onehub.center`;
- tên miền của `MAIL_FROM` ngoài tập được phép (Hỏi-7; khuyên `onehub.center` và mọi tên miền con của nó).

Đường dẫn trong thư mã đăng nhập và thư mời dựng từ `APP_URL` (đã đúng từ hàng 9d); hàng này thêm phép đo trên bản dựng.

## Sức khoẻ chỉ đọc

`GET /api/v1/health` trả `{ ok, commit, env, vai }`. `vai` là `"dat"` hoặc lý do cửa truy vấn từ chối vai (đọc bằng chính
phép kiểm vai của cửa, `src/modules/identity/with-company.ts`). Không đọc bảng nào của sàn, không cần đăng nhập, không trả
địa chỉ hay khoá. Thuộc mô-đun `identity` (ngoại lệ của SP-1), đi qua `server.ts` của nó.

## Cách ly trên bản thử (SP-1)

`db/scripts/cach-ly-dich.sh` nối tới một cơ sở dữ liệu đích, mọi lệnh trong giao dịch chỉ đọc rồi huỷ:

- mọi bảng có `company_id` bật và ép luật theo dòng;
- vai `quy_hang_app` và `quy_hang_login` không sở hữu bảng, không vượt luật dòng, không là siêu người dùng;
- `anon`, `authenticated` và `PUBLIC` không có quyền nào trên bảng của sàn (Supabase mặc định cấp quyền cho hai vai này qua
  Data API — chủ kho tắt Data API, bộ kiểm giữ cả khi ai đó bật lại);
- ca phiên của vai đăng nhập (`db/tests/vai-dang-nhap-phien.sql`) trong giao dịch huỷ.

Bộ kiểm cách ly đầy đủ (`db/scripts/cach-ly.sh`, tạo cơ sở nháp) vẫn chỉ chạy trên Postgres của làn và CI.

## Sao lưu và khôi phục

Sao lưu hằng ngày là của Supabase (gói Pro, giữ 7 ngày — Hỏi-1, Hỏi-3). Kho thêm:

- `db/scripts/sao-luu.sh <tệp>` — `pg_dump` dạng nén qua `MIGRATE_DATABASE_URL`; từ chối đường nằm trong cây kho (tệp có
  dữ liệu thật).
- `db/scripts/khoi-phuc-thu.sh <tệp>` — khôi phục vào một cơ sở nháp trên Postgres của làn hay của một đích được chỉ, đếm
  dòng từng bảng so với tệp, chạy `cach-ly-dich.sh` trên bản khôi phục, in một dòng kết quả để chép vào
  `docs/van-hanh/nhat-ky-khoi-phuc.md`.

## Sổ tay vận hành `docs/van-hanh/`

`README.md` (mục lục, việc ngoài kho theo thứ tự, bảng biến) · `dua-ban-len.md` · `lui-ban.md` · `xoay-khoa.md` ·
`khoi-phuc.md` · `nhat-ky-khoi-phuc.md`. Mọi lệnh sổ tay nhắc có trong `Makefile`/`mk/`; mọi biến có trong `.env.example`.

## Việc ngoài kho theo thứ tự (máy cần nhận lại tên biến, không bao giờ giá trị)

1. Chọn gói (Hỏi-1). Máy nhận: không gì.
2. Supabase: hai dự án vùng Singapore (bản thử, bản thật); tắt Data API ở cả hai. Máy nhận: không gì (địa chỉ ở bước 6).
3. Vercel: hai dự án nối kho này, vùng hàm Singapore, tắt tự triển khai theo nhánh (kho cũng ghi ở `vercel.json`). Máy
   nhận: tên biến `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` có ở mỗi môi trường GitHub.
4. Resend: xác minh tên miền gửi thư (bản ghi DNS của `onehub.center`). Máy nhận: `MAIL_FROM` dạng
   `<tên> <dia-chi@tên miền đã xác minh>` có ở cả hai môi trường Vercel.
5. Trỏ tên miền: `inventory.onehub.center` vào dự án bản thật; tên miền bản thử do chủ kho chọn, vào dự án bản thử. Máy
   nhận: `APP_URL` ở mỗi môi trường.
6. Nhập khoá bí mật. Vercel (mỗi dự án): `DATABASE_URL` (vai `quy_hang_login`, cổng của bộ gom kết nối), `AUTH_SECRET`,
   `RESEND_API_KEY`, `MAIL_FROM`, `APP_URL`, `APP_ENV`. GitHub (môi trường `staging` và `production`): `VERCEL_TOKEN`,
   `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `MIGRATE_DATABASE_URL`, `LOGIN_DATABASE_URL` (cho bộ kiểm cách ly đích),
   `APP_URL`; biến kho `DEPLOY_ENABLED=true`.
7. Đặt hai tệp tự động triển khai từ `workflows-de-xuat.md`; đặt người duyệt cho môi trường `production` (Hỏi-2).
   Release đang đỏ vì thiếu `RELEASE_PLEASE_TOKEN`: theo `_acceptance/don-no-bo-kiem/release-de-xuat.md` của hàng 1u.
8. Chạy lần đưa bản đầu, rồi thử khôi phục một lần trên bản thử và ghi nhật ký.

## Tệp hạng cao sẽ sửa hay thêm

| Tệp | Sửa gì |
|---|---|
| `mk/deploy.mk` | Thay hai lệnh rỗng bằng `deploy`, `smoke`, `rollback`, `cach-ly-dich`, `sao-luu`, `khoi-phuc-thu` |
| `db/scripts/cach-ly-dich.sh` (mới), `db/scripts/sao-luu.sh` (mới), `db/scripts/khoi-phuc-thu.sh` (mới) | Như trên; `migrate.sh`, `psql.sh` không đổi hành vi |
| `tools/deploy/**` (mới; G xác nhận không trùng hàng 1u) | Lệnh đưa bản lên, lùi bản, kiểm nhanh; bài kiểm với `vercel` giả và máy chủ sức khoẻ giả |
| `.env.example` | Chỉ thêm dòng: `APP_ENV`, `MIGRATE_DATABASE_URL`, `LOGIN_DATABASE_URL`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| `src/instrumentation.ts` | Gọi phép kiểm cấu hình mở rộng (không đổi chỗ gọi) |
| `src/modules/identity/config.ts` | Thêm `APP_ENV`, biến cấm, vai nối, tên miền gửi thư, địa chỉ bản thật |
| `src/modules/identity/server.ts`, `src/app/api/v1/health/route.ts` (mới) | Đường sức khoẻ chỉ đọc |
| `vercel.json` (mới) | Vùng `sin1`, tắt tự triển khai theo nhánh |
| `docs/van-hanh/**` (mới) | Sổ tay vận hành |

Không sửa: `.github/workflows/**`, `governance/**`, `PRODUCT-INVARIANTS.md`, migration đã có.

## Luật sản phẩm chạm

- SP-1: chỉ siết — vai nối bị kiểm lúc khởi động, cách ly kiểm trên bản thử, Data API của Supabase bị khoá. Đường sức khoẻ
  không đọc bảng của sàn.
- SP-3, SP-4: không chạm.

## Phụ thuộc

Phần dựng bắt đầu khi hàng 10 «Bảng hàng trên dữ liệu thật» đã gộp: trước đó Bảng hàng còn chạy trên bộ mẫu, phép kiểm
«bản thật không có dữ liệu mẫu» không đo được trên mã thật.

## Đặc tả UX

Bỏ: hàng không có màn mới (dòng sổ «bỏ đặc-tả-UX»).
