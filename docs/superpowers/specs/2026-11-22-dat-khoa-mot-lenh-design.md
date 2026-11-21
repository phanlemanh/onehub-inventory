# Một lệnh đặt khoá — thiết kế

Hồ sơ: `_acceptance/dat-khoa-mot-lenh/`. Nối tiếp hàng 22 «Môi trường thử và bản thật»
(`_acceptance/moi-truong-thu-va-ban-that/`, đã ký 17/11), không sửa hồ sơ ấy.

## Vì sao

Ngày 22/11 chủ kho hỏi cách cấu hình để máy tự làm hết việc lên bản thật và chủ kho ít xuất hiện nhất. Máy đề xuất bốn
thay đổi; chủ kho trả lời «Làm đi».

Đo ngày 22/11 trên tài khoản thật:

- Hai dự án Supabase và hai dự án Vercel đã có.
- GitHub chưa có môi trường, khoá hay biến nào.
- Sổ tay hiện bắt chủ kho làm 14 việc ngoài kho. Trong đó có:
  - dựng tay hai chuỗi nối cơ sở dữ liệu;
  - đặt tay sáu biến ở mỗi dự án Vercel;
  - đặt tay mật khẩu vai đăng nhập giữa lần đưa bản đầu. Lần đưa bản đầu vì thế dừng hai lần ở mỗi môi trường.

Máy không được cầm giá trị khoá hay mật khẩu. Vậy việc của chủ kho chỉ thu về được đến mức: tạo khoá ở trang dịch vụ, rồi
dán vào một lệnh.

## Mục tiêu

1. Chủ kho dán mỗi khoá do dịch vụ cấp đúng một lần, vào một lệnh: `make dat-khoa`.
2. Khoá sinh được thì lệnh tự sinh, không ai thấy: khoá đăng nhập của ứng dụng (`AUTH_SECRET`) và mật khẩu vai đăng
   nhập (`LOGIN_DB_PASSWORD`).
3. Các môi trường GitHub là nơi duy nhất giữ khoá. Mỗi lần đưa bản lên, lệnh tự đẩy biến sang dự án Vercel của môi trường
   ấy, nên không còn việc đặt biến tay trên Vercel và hai nơi không lệch nhau.
4. Lệnh đưa bản lên tự đặt mật khẩu vai đăng nhập ngay sau migration, nên lần đưa bản đầu không còn dừng.
5. Sổ tay chỉ còn phần của chủ kho. Bản tệp `deploy.yml` mới để chủ kho dán là bản khớp đúng tên biến lệnh đòi.
6. Hướng dẫn của kho có một mục quyền đứng cho hạ tầng Inventory. Chủ kho duyệt mục ấy khi gộp PR.

## Không làm

- Không sửa `.github/workflows/` hay `governance/`: tệp CI chủ kho dán theo bản trong sổ tay.
- Không tự bấm duyệt bản thật. Môi trường `production` vẫn chỉ chủ kho duyệt (sổ hàng 22, `d-20261116T031557Z-13`).
- Không tạo khoá ở dịch vụ thay chủ kho: khoá Vercel, khoá Resend, khoá phát hành GitHub, mật khẩu vai chủ Supabase.
- Không có lịch tự thử khôi phục mỗi quý: cần một cơ sở nháp trên CI, để một hàng sau.
- Không dùng trình giữ mật khẩu ngoài (1Password, Bitwarden): thêm một dịch vụ nữa cho chủ kho giữ.

## Cách làm

### Lệnh đặt khoá — `make dat-khoa ENV=staging|production|all` (mặc định `all`)

`tools/deploy/dat-khoa.mjs`:

1. **Kiểm trước khi hỏi gì.** `gh` đã đăng nhập. Mỗi môi trường đích đã có trên GitHub; chưa có thì lệnh đỏ gọi tên môi
   trường. Lệnh đọc tên các khoá đang có (`gh secret list --env`); tên, không phải giá trị.
2. **Hỏi ẩn, mỗi khoá một lần.**
   - `VERCEL_TOKEN`: hỏi một lần, đặt cho mọi môi trường đích.
   - Mỗi môi trường:
     - `MIGRATE_DATABASE_URL`: chuỗi Session pooler. Chuỗi còn chữ `[YOUR-PASSWORD]` thì lệnh hỏi tiếp mật khẩu và tự
       thay vào.
     - `RESEND_API_KEY`.
     - `VERCEL_AUTOMATION_BYPASS_SECRET`: tuỳ chọn.
   - Khoá đã có trên GitHub thì Enter để giữ. Khoá chưa có mà bỏ trống thì đỏ.
3. **Kiểm hết rồi mới đặt.** Có một giá trị sai thì không đặt khoá nào. Các luật kiểm:
   - chuỗi nối phải là `postgresql://`, cổng 5432 (Session pooler, không phải 6543), người dùng `postgres` hay
     `postgres.<mã dự án>`, có mật khẩu;
   - khoá Resend bắt đầu bằng `re_`;
   - khoá Vercel không rỗng, không có khoảng trắng.
4. **Tự sinh.**
   - `AUTH_SECRET`: 48 byte ngẫu nhiên, mã base64url.
   - `LOGIN_DB_PASSWORD`: 40 ký tự chữ và số.
   - Chỉ sinh khi môi trường chưa có khoá ấy. Cờ `--xoay` sinh lại cả hai (xoay khoá); không có cờ thì không bao giờ
     đổi khoá đang chạy.
5. **Đặt.** `gh secret set <tên> --env <env>`, giá trị đi qua đầu vào chuẩn, không bao giờ nằm trên dòng lệnh.
6. **In.** Mỗi khoá một dòng `dat-khoa <env>: <đặt|giữ|sinh> <tên>`, dòng cuối `dat-khoa <env>: xong`. Không bao giờ in
   giá trị, kể cả khi lỗi.

### Lệnh đưa bản lên — hai bước mới

`tools/deploy/len-ban.mjs`:

- Bản thử: `cau-hinh, migration, vai-dang-nhap, cach-ly, bien, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien`.
- Bản thật: `cau-hinh, ban-thu-truoc, migration, vai-dang-nhap, bien, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien`.

**Biến đòi ở bước `cau-hinh`, cả hai môi trường:**

- Đòi: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `MIGRATE_DATABASE_URL`, `LOGIN_DB_PASSWORD`, `AUTH_SECRET`,
  `RESEND_API_KEY`, `MAIL_FROM`, `APP_URL`. Bản thật đòi thêm `STAGING_APP_URL`.
- `LOGIN_DATABASE_URL` thôi là biến: lệnh dựng nó từ `MIGRATE_DATABASE_URL` (đổi người dùng `postgres` thành
  `quy_hang_login`, giữ phần `.<mã dự án>`, máy chủ, cổng và tên cơ sở) với mật khẩu `LOGIN_DB_PASSWORD`.
- `LOGIN_DB_PASSWORD` không phải chữ và số, hay ngắn hơn 24 ký tự, thì đỏ ở `cau-hinh`.

**Bước `vai-dang-nhap`:**

- Đặt mật khẩu cho `quy_hang_login` bằng vai chủ: `alter role quy_hang_login password '<dạng băm SCRAM-SHA-256>'`.
- Dạng băm do lệnh tính (4096 vòng, muối ngẫu nhiên 16 byte, khuôn chuẩn của Postgres). Câu lệnh gửi tới cơ sở dữ liệu
  không chứa mật khẩu trần, nên nhật ký câu lệnh của Postgres không bao giờ có mật khẩu.
- Câu đi qua đầu vào chuẩn của `psql`, không qua dòng lệnh.
- Đỏ khi vai chưa có hay câu lỗi. Dòng lỗi đã che giá trị.

**Bước `bien`:**

- Gọi API của Vercel với `VERCEL_TOKEN`:
  - đọc danh sách biến của dự án (`GET /v9/projects/<id>/env`);
  - rồi đặt hay ghi đè (`POST /v10/projects/<id>/env?upsert=true`) sáu biến cho môi trường Production của dự án.
- Sáu biến: `DATABASE_URL` (chuỗi vai đăng nhập vừa dựng), `AUTH_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`, `APP_URL`,
  `APP_ENV` (`staging` hay `production`).
- Ba biến đầu kiểu `encrypted`. Ba biến sau kiểu `plain`. Không dùng kiểu `sensitive`: biến kiểu ấy không kéo về được,
  mà bước `dung` dựng trên máy CI bằng `vercel pull`.
- Đỏ khi:
  - dự án đang có một trong ba biến cấm (`MIGRATE_DATABASE_URL`, `LOGIN_CODE_OUTBOX`, `NEXT_PUBLIC_E2E_BUTTON_RECORD`);
  - hay Vercel trả mã khác 2xx.
- Đỏ ở bước này là trước bước gắn tên miền, nên tên miền không đổi.
- Địa chỉ API đọc từ `VERCEL_API_URL`, mặc định `https://api.vercel.com`, để bài kiểm trỏ được tới máy giả.

**Che giá trị:** `SECRET_NAMES` thêm `LOGIN_DB_PASSWORD`, `AUTH_SECRET`, `RESEND_API_KEY`. Chuỗi vai đăng nhập dựng ra cũng
được che trong mọi dòng in.

### Sổ tay và tệp CI

- `docs/van-hanh/README.md`, mục «Việc ngoài kho»:
  - Chia hai phần: phần chủ kho (tạo khoá, chạy `make dat-khoa`, dán `deploy.yml`, tạo Quản trị sàn đầu, duyệt bản thật);
  - và phần máy làm theo quyền đứng (cài đặt dự án Vercel, tên miền, môi trường GitHub cùng người duyệt và biến, tắt
    Data API, bật `DEPLOY_ENABLED`).
  - Bảng biến đổi theo.
  - Khối `deploy.yml` đọc khoá bằng `secrets.*`, biến bằng `vars.*`, đúng tập tên lệnh đòi.
- `docs/van-hanh/dua-ban-len.md`: mục «Lần đầu ở một môi trường» bỏ bước đặt mật khẩu tay. Bảng «Đỏ thì làm gì» thêm hai
  bước mới.

### Quyền đứng

`AGENTS.md` có thêm mục «Infrastructure standing permission», bằng tiếng Anh như phần còn lại của tệp.

- **Được làm không hỏi**, với hai dự án Vercel, hai dự án Supabase và hai môi trường GitHub của Inventory:
  - đổi cài đặt dự án, gắn tên miền;
  - tạo môi trường, đặt biến không bí mật;
  - đặt người duyệt của `production` đúng một lần, là chủ kho; không bao giờ đổi, bỏ hay thêm người duyệt;
  - tắt Data API;
  - chạy Deploy (bản thử) và chạy lại;
  - lùi bản thử;
  - chạy kiểm cách ly, kiểm nhanh và thử khôi phục;
  - bật `DEPLOY_ENABLED` sau khi `deploy.yml` đã gộp.
- **Không bao giờ:**
  - cầm, gõ hay in giá trị khoá (chủ kho chạy `make dat-khoa`);
  - duyệt bản thật, hay đổi người duyệt của `production`;
  - xoá dữ liệu, dự án hay khoá;
  - sửa `.github/workflows/` hay `governance/`;
  - nới quyền của chính mình.
- **Trước khi xin chủ kho duyệt bản thật**, máy gửi một gói ngắn: các thay đổi, và bản thử đã chạy đúng commit ấy và xanh
  chưa.

## Lựa chọn và căn cứ

| Lựa chọn                                                                   | Căn cứ                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Khoá ở môi trường GitHub, biến Vercel do lệnh đưa bản lên đẩy              | Một lối sống. Lối khác là `make dat-khoa` đẩy thẳng sang Vercel, và lối ấy chết vì hai lẽ. Một: đổi `APP_URL` hay `MAIL_FROM` (biến máy đặt) lại phải chờ chủ kho chạy lệnh. Hai: `--xoay` đổi mật khẩu vai tách khỏi lượt đặt mật khẩu ấy vào Postgres |
| `DATABASE_URL` giữ máy chủ và cổng của chuỗi vai chủ (Session pooler 5432) | Mục tiêu đã khai: sổ tay hàng 22 việc 4, «máy chủ và cổng giữ nguyên»                                                                                                                                                                                   |
| Mật khẩu vai đăng nhập dạng băm SCRAM                                      | Một lối sống: câu `password '<trần>'` để mật khẩu trong nhật ký câu lệnh khi Postgres ghi DDL; md5 đã bị Postgres bỏ                                                                                                                                    |
| `encrypted` thay `sensitive` ở Vercel                                      | Một lối sống: bước `dung` kéo biến về máy CI để dựng; `sensitive` không kéo về được                                                                                                                                                                     |
| Không tự xoay khoá khi chạy lại                                            | Một lối sống: đổi `AUTH_SECRET` mỗi lần chạy làm mọi mã đăng nhập đang chờ mất hiệu lực                                                                                                                                                                 |
| Địa chỉ bản thử, địa chỉ gửi thư                                           | Chỉ chủ kho có (sổ tay hàng 22: «tên miền bản thử chủ kho chọn»). Khuyến nghị ở Hỏi-1                                                                                                                                                                   |
| Phạm vi quyền đứng                                                         | Chỉ chủ kho có (khẩu vị rủi ro). Khuyến nghị ở Hỏi-2                                                                                                                                                                                                    |

## Rủi ro đã biết

- API biến của Vercel đổi phiên bản. Bước `bien` gọi đúng hai đường đã ghi. Vercel trả lỗi thì bước đỏ trước khi dựng,
  không có gì lên.
- Chủ kho chạy `make dat-khoa --xoay` lúc có người đang đăng nhập: mã đăng nhập đang chờ mất hiệu lực, người ấy xin mã
  lại. Sổ tay ghi điều này ở mục xoay khoá.
