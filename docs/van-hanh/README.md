# Sổ tay vận hành

Sổ tay cho người đưa Inventory lên mạng và giữ nó chạy: bản thử (staging) và bản thật (production) ở
`https://inventory.onehub.center`. Mỗi môi trường là một dự án Vercel riêng và một cơ sở dữ liệu Supabase riêng, cùng ở
Singapore. Mọi việc trong kho đi qua một lệnh `make`; việc ngoài kho (tài khoản, khoá, tên miền) do chủ kho làm theo danh
sách dưới đây. Sổ tay không bao giờ ghi giá trị của khoá, mật khẩu hay địa chỉ cơ sở dữ liệu — chỉ ghi tên biến.

Hai vai sổ tay gọi tên:

- **Chủ kho** — người có quyền quản trị ở GitHub, Vercel, Supabase và Resend, làm việc ngoài kho và duyệt bản thật.
- **Người giữ kho mã** — người viết và sửa mã của kho này. Báo người giữ kho mã nghĩa là mở một issue trên trang kho ở
  GitHub, dán nguyên dòng đỏ (dòng đỏ không bao giờ chứa giá trị khoá), và nhắn họ đường dẫn issue.

## Các quy trình

| Quy trình         | Khi nào                                                                                                                                                          | Tệp                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Đưa bản lên       | Có bản phát hành mới, hoặc vừa đổi biến trên Vercel                                                                                                              | [dua-ban-len.md](dua-ban-len.md)             |
| Lùi bản           | Bản đang chạy hỏng sau khi lên; vừa xoay mật khẩu vai đăng nhập thì đọc trước mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của [xoay-khoa.md](xoay-khoa.md) | [lui-ban.md](lui-ban.md)                     |
| Xoay khoá bí mật  | Khoá lộ, người giữ khoá rời đi, hay tới hạn đổi                                                                                                                  | [xoay-khoa.md](xoay-khoa.md)                 |
| Khôi phục dữ liệu | Thử khôi phục lúc ra mắt rồi mỗi quý; mất hay hỏng dữ liệu thật                                                                                                  | [khoi-phuc.md](khoi-phuc.md)                 |
| Nhật ký khôi phục | Ghi mỗi lần thử khôi phục                                                                                                                                        | [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md) |

Mỗi bước trong bốn quy trình ghi bốn điều: làm ở đâu, gõ hay bấm gì, thấy gì là đạt, đỏ thì làm gì. Mỗi việc ngoài kho
(mục cuối) cũng ghi «Đạt khi» và «Đỏ thì».

## Lệnh của kho

| Lệnh                           | Làm gì                                                                                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `make dat-khoa`                | Hỏi ẩn các khoá do dịch vụ cấp, tự sinh hai khoá, đặt tất cả vào hai môi trường GitHub                                                                                      |
| `make deploy ENV=staging`      | Đưa commit đang đứng lên bản thử: kiểm cấu hình, áp migration, đặt mật khẩu vai đăng nhập, kiểm cách ly, đẩy biến sang Vercel, dựng, kiểm, gắn tên miền                     |
| `make deploy ENV=production`   | Như trên cho bản thật; trước hết đòi bản thử đã chạy đúng commit này                                                                                                        |
| `make smoke ENV=staging`       | Kiểm nhanh chỉ đọc địa chỉ `APP_URL` của môi trường                                                                                                                         |
| `make rollback ENV=production` | Trỏ tên miền về bản trước, rồi kiểm nhanh; vừa xoay mật khẩu vai đăng nhập thì đọc trước mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của [xoay-khoa.md](xoay-khoa.md) |
| `make cach-ly-dich`            | Bộ kiểm cách ly chỉ đọc trên một cơ sở dữ liệu đích                                                                                                                         |
| `make sao-luu TEP=<tệp>`       | Sao lưu cơ sở dữ liệu đích ra một tệp ngoài kho, kèm tệp đếm dòng                                                                                                           |
| `make khoi-phuc-thu TEP=<tệp>` | Thử khôi phục tệp sao lưu vào một cơ sở nháp, đếm dòng, kiểm cách ly, in dòng cho nhật ký                                                                                   |

`ENV` nhận `staging` hoặc `production`. Lệnh chỉ kiểm biến có mặt, không bao giờ in giá trị.

Đường kiểm sức khoẻ của mỗi bản đang chạy: `<APP_URL>/api/v1/health`, trả đúng bốn khoá `ok`, `commit`, `env`, `vai`. Bản
khoẻ trả `ok: true`, `vai: "dat"` (vai nối cơ sở dữ liệu đạt luật cách ly).

## Việc ngoài kho

Làm đúng thứ tự này một lần, trước lần đưa bản đầu: mỗi việc chỉ cần những việc đứng trước nó. Mỗi việc ghi ai làm, làm ở
đâu, máy cần nhận lại gì, rồi hai dòng **Đạt khi:** (thấy gì là xong) và **Đỏ thì:** (làm gì khi không thấy). Sổ tay chỉ
ghi tên biến. Giá trị khoá chủ kho tạo ở trang của dịch vụ và chỉ dán vào lệnh `make dat-khoa` (việc 8) hay vào trang của
GitHub (việc 9), không dán vào kho, vào chat hay vào PR.

| Ai      | Việc        | Vì sao                                                                                                     |
| ------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| Máy     | 1–3, 10, 13 | Cài đặt và biến không bí mật, làm theo quyền đứng trong `AGENTS.md` («Infrastructure standing permission») |
| Chủ kho | 4–9, 11, 12 | Cần tài khoản của chủ kho: tạo khoá, dán khoá, dán tệp CI, tạo Quản trị sàn đầu, duyệt bản thật            |

Máy báo lại sau mỗi việc của máy. Chủ kho làm xong một việc của mình thì nhắn máy, máy kiểm (chỉ đọc) rồi đi tiếp.

1. **Máy — Vercel: cài đặt hai dự án.** Hai dự án `onehub-inventory-thu` (bản thử) và `onehub-inventory` (bản thật):
   kiểu Next.js, Node 24, vùng Singapore (`sin1`), tắt tự triển khai theo nhánh; dự án bản thật gắn tên miền
   `inventory.onehub.center`; bản thử dùng địa chỉ sẵn của dự án (Hỏi-1 ở Cổng Phạm vi). Máy nhận lại: `VERCEL_ORG_ID` và
   `VERCEL_PROJECT_ID` của mỗi dự án, đặt ở việc 3.
   - **Đạt khi:** trang dự án trên Vercel ghi Next.js, Node 24.x, `sin1`; Settings › Domains của dự án bản thật ghi
     `inventory.onehub.center` ở trạng thái Valid Configuration.
   - **Đỏ thì:** tên miền báo Invalid Configuration — bản ghi DNS của `onehub.center` trên Vercel chưa trỏ đúng; máy báo
     chủ kho dòng Vercel đưa ra và không tự sửa DNS của tên miền chung.
2. **Máy — Supabase: tắt Data API ở hai dự án.** Project Settings › Data API, tắt «Enable Data API». Máy nhận lại: không
   biến nào.
   - **Đạt khi:** công tắc ở trạng thái tắt sau khi tải lại trang, ở cả hai dự án.
   - **Đỏ thì:** không thấy công tắc — để đó, đi tiếp: migration thu quyền của kho đóng các vai khoá công khai, và bước
     `cach-ly` của lần đưa bản đầu gọi tên bảng nào còn mở.
3. **Máy — GitHub: hai môi trường.** Settings › Environments, tạo `staging` và `production`. Môi trường `production`:
   Required reviewers là chủ kho, đặt một lần và máy không bao giờ đổi; Deployment branches and tags: nhánh `main` và thẻ
   khuôn `*v*`. Đặt biến không bí mật (Environment variables): ở cả hai — `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (dự án của
   môi trường ấy), `APP_URL`, `MAIL_FROM` (Hỏi-1); ở `production` thêm `STAGING_APP_URL`. Máy nhận lại: không biến mới.
   - **Đạt khi:** Settings › Environments liệt hai môi trường; `production` ghi đúng một người duyệt là chủ kho; mỗi môi
     trường liệt đúng các tên biến trên.
   - **Đỏ thì:** không tạo được môi trường — tài khoản của máy thiếu quyền quản trị kho; máy báo chủ kho, không tìm lối
     khác.
4. **Chủ kho — Supabase: chuỗi nối của vai chủ.** Ở mỗi dự án: nút Connect › Session pooler, chép chuỗi (còn chữ
   `[YOUR-PASSWORD]` cũng được). Cần mật khẩu vai chủ: lấy trong trình giữ mật khẩu, hay Project Settings › Database ›
   Reset database password rồi cất mật khẩu mới. Máy nhận lại: chưa — chuỗi dán ở việc 8.
   - **Đạt khi:** có hai chuỗi bắt đầu bằng `postgresql://postgres.`, cổng `5432`, mỗi dự án một chuỗi, cùng mật khẩu vai
     chủ của dự án ấy.
   - **Đỏ thì:** chuỗi có cổng `6543` — đó là Transaction pooler, chọn lại Session pooler; không thấy nút Connect — dự án
     còn đang khởi tạo, chờ vài phút rồi tải lại trang.
5. **Chủ kho — Vercel: khoá cho máy đưa bản lên.** Account Settings › Tokens › Create, phạm vi là nhóm có hai dự án, hạn 1
   năm. Ghi ngày hết hạn vào lịch để xoay khoá ([xoay-khoa.md](xoay-khoa.md)). Máy nhận lại: chưa — khoá dán ở việc 8
   thành `VERCEL_TOKEN`.
   - **Đạt khi:** danh sách Tokens có khoá mới, phạm vi là nhóm ấy, hết hạn sau một năm.
   - **Đỏ thì:** đóng hộp thoại trước khi chép — Vercel không cho xem lại: xoá khoá ấy và tạo khoá mới; phạm vi chỉ có tài
     khoản cá nhân — chủ kho chưa là thành viên nhóm, nhờ người quản trị nhóm mời.
6. **Chủ kho — Vercel: bảo vệ bản mới (chỉ khi bật).** Ở mỗi dự án: Settings › Deployment Protection. «Vercel
   Authentication» đang bật thì tạo «Protection Bypass for Automation» để lệnh kiểm nhanh đọc được địa chỉ riêng của bản
   mới. Tắt thì bỏ qua việc này. Máy nhận lại: chưa — chuỗi dán ở việc 8 thành `VERCEL_AUTOMATION_BYPASS_SECRET`.
   - **Đạt khi:** hoặc «Vercel Authentication» tắt, hoặc trang ghi một chuỗi «Protection Bypass for Automation».
   - **Đỏ thì:** không thấy mục Protection Bypass — gói chưa có tính năng ấy: tắt «Vercel Authentication» cho dự án ấy.
7. **Chủ kho — Resend: hai khoá gửi thư.** Ở resend.com: API Keys › Create, quyền Sending access, mỗi môi trường một
   khoá. Tên miền `onehub.center` đã xác minh ở Resend (Quỹ hàng đang dùng). Máy nhận lại: chưa — khoá dán ở việc 8 thành
   `RESEND_API_KEY`.
   - **Đạt khi:** danh sách API Keys có hai khoá mới bắt đầu bằng `re_`; Domains ghi `onehub.center` ở trạng thái Verified.
   - **Đỏ thì:** tên miền không còn Verified — Domains › `onehub.center` › Verify, so từng bản ghi DNS trên Vercel với trang
     của Resend.
8. **Chủ kho — dán khoá: `make dat-khoa`.** Ở máy của chủ kho, trong bản sao của kho, đã đăng nhập `gh`
   (`gh auth status` báo Logged in). Gõ `make dat-khoa` rồi dán từng thứ khi lệnh hỏi, chữ không hiện khi dán:
   khoá Vercel (việc 5, hỏi một lần cho cả hai môi trường), rồi cho mỗi môi trường chuỗi Session pooler (việc 4; chuỗi
   còn `[YOUR-PASSWORD]` thì lệnh hỏi tiếp mật khẩu vai chủ), khoá Resend (việc 7), chuỗi bỏ bảo vệ (việc 6, Enter để bỏ
   qua). Lệnh tự sinh khoá đăng nhập của ứng dụng và mật khẩu vai đăng nhập. Máy nhận lại: khoá bí mật `VERCEL_TOKEN`,
   `MIGRATE_DATABASE_URL`, `RESEND_API_KEY`, `AUTH_SECRET`, `LOGIN_DB_PASSWORD` (và `VERCEL_AUTOMATION_BYPASS_SECRET` nếu
   có) ở cả hai môi trường.
   - **Đạt khi:** lệnh in `dat-khoa staging: xong` và `dat-khoa production: xong`; Settings › Environments của GitHub liệt
     đủ các tên ấy ở mỗi môi trường (GitHub chỉ hiện tên).
   - **Đỏ thì:** lệnh in `dat-khoa: <lý do>` và chưa đặt khoá nào — sửa đúng chỗ dòng ấy gọi tên rồi chạy lại; dòng `lỗi
khi đặt <tên>; đã đặt: …` — chạy lại, Enter để giữ các khoá đã đặt; `môi trường … chưa có trên GitHub` — việc 3 chưa
     xong, nhắn máy.
9. **Chủ kho — GitHub: khoá phát hành và tệp tự động triển khai.** Hai phần, theo thứ tự. Máy nhận lại: khoá kho
   `RELEASE_PLEASE_TOKEN`; tệp `deploy.yml` mới trên `main`.

   **Phần một — khoá phát hành `RELEASE_PLEASE_TOKEN`.** Việc «Release» (mở PR phát hành sau mỗi lần gộp) cần khoá này
   để mở PR và để PR ấy chạy kiểm như PR thường. Ở GitHub: ảnh đại diện › Settings › Developer settings › Personal access
   tokens › Fine-grained tokens › Generate new token. Đặt Token name dễ nhận; Expiration 1 năm (ghi ngày hết hạn vào
   lịch); Repository access: Only select repositories, chọn đúng kho này; Repository permissions: Contents — Read and
   write, Pull requests — Read and write, Issues — Read and write. Bấm Generate token. Rồi ở trang kho: Settings › Secrets
   and variables › Actions › tab Secrets › New repository secret, Name `RELEASE_PLEASE_TOKEN`, dán giá trị, Add secret.

   **Phần hai — tệp `deploy.yml`.** Ở trang kho: Code › thư mục `.github/workflows` › tệp `deploy.yml` › nút bút chì (Edit
   this file). Xoá hết nội dung cũ, dán nguyên khối dưới. Bấm Commit changes…, chọn «Create a new branch for this commit
   and start a pull request», tên commit `ci: deploy to Vercel staging and production`, bấm Propose changes rồi Create pull
   request. Gộp khi các bước kiểm xanh.

   ```yaml
   name: Deploy

   # Staging goes up on its own after a release; production waits for the owner's approval on the
   # "production" environment (Settings > Environments > production > Required reviewers).
   # Runbook and variable table: docs/van-hanh/README.md. Secrets are set by `make dat-khoa`;
   # make deploy pushes the app's variables to the Vercel project of each environment.
   on:
     workflow_call:
     workflow_dispatch:

   permissions:
     contents: read

   concurrency:
     group: deploy
     cancel-in-progress: false

   jobs:
     staging:
       if: vars.DEPLOY_ENABLED == 'true'
       runs-on: ubuntu-latest
       environment: staging
       timeout-minutes: 30
       steps:
         - uses: actions/checkout@v7
         - uses: ./.github/actions/setup-project
         - run: sudo apt-get update && sudo apt-get install -y postgresql-client
         - run: npm install --global vercel@65.9.0
         - run: make deploy ENV=staging
           env:
             VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
             VERCEL_ORG_ID: ${{ vars.VERCEL_ORG_ID }}
             VERCEL_PROJECT_ID: ${{ vars.VERCEL_PROJECT_ID }}
             MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
             LOGIN_DB_PASSWORD: ${{ secrets.LOGIN_DB_PASSWORD }}
             AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
             RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
             MAIL_FROM: ${{ vars.MAIL_FROM }}
             APP_URL: ${{ vars.APP_URL }}
             VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}

     production:
       needs: staging
       runs-on: ubuntu-latest
       environment: production
       timeout-minutes: 30
       steps:
         - uses: actions/checkout@v7
         - uses: ./.github/actions/setup-project
         - run: sudo apt-get update && sudo apt-get install -y postgresql-client
         - run: npm install --global vercel@65.9.0
         - run: make deploy ENV=production
           env:
             VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
             VERCEL_ORG_ID: ${{ vars.VERCEL_ORG_ID }}
             VERCEL_PROJECT_ID: ${{ vars.VERCEL_PROJECT_ID }}
             MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
             LOGIN_DB_PASSWORD: ${{ secrets.LOGIN_DB_PASSWORD }}
             AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
             RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
             MAIL_FROM: ${{ vars.MAIL_FROM }}
             APP_URL: ${{ vars.APP_URL }}
             STAGING_APP_URL: ${{ vars.STAGING_APP_URL }}
             VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
   ```

   - **Đạt khi:** tab Secrets của kho liệt `RELEASE_PLEASE_TOKEN`; PR của `deploy.yml` đã gộp, tệp trên `main` có dòng
     `npm install --global vercel@65.9.0` ở cả hai việc `staging` và `production`.
   - **Đỏ thì:** kiểm của PR đỏ ở việc đọc tệp workflow — thường là dán thiếu hay lệch thụt đầu dòng: mở lại tệp, xoá hết,
     dán lại nguyên khối; Release vẫn đỏ với `GitHub Actions is not permitted to create or approve pull requests` — khoá
     chưa đặt hay sai tên; `Resource not accessible` hay mã 403 — khoá thiếu quyền hay không phủ kho này: tạo khoá mới đủ
     ba quyền trên, Update secret.

10. **Máy — bật tự động triển khai và đưa bản thử lên lần đầu.** Settings › Secrets and variables › Actions › tab Variables,
    biến kho `DEPLOY_ENABLED` = `true`; rồi Actions › Deploy › Run workflow, nhánh `main` (lần đầu chưa có thẻ phát hành).
    Lần đưa bản đầu không còn dừng giữa chừng: ngay sau `migration`, bước `bien` tự đặt biến của dự án Vercel, rồi bước
    `vai-dang-nhap` tự đặt mật khẩu vai đăng nhập. Việc `production` dừng chờ chủ kho duyệt (việc 12). Máy nhận lại: không biến mới.
    - **Đạt khi:** nhật ký lượt Deploy có `deploy staging: xong <commit>`; `<địa chỉ bản thử>/api/v1/health` trả
      `"ok":true`, `"env":"staging"`, `"vai":"dat"`.
    - **Đỏ thì:** đọc dòng đỏ trong nhật ký và làm theo bảng «Đỏ thì làm gì» của [dua-ban-len.md](dua-ban-len.md); lượt
      Deploy không chạy — `DEPLOY_ENABLED` đặt nhầm trong một môi trường thay vì ở tab Variables của kho.
11. **Chủ kho — tài khoản đăng nhập đầu ở mỗi môi trường.** Kho không có lệnh hay màn tạo sàn đầu tiên: lời mời chỉ do một
    Quản trị sàn đã đăng nhập gửi, và cơ sở dữ liệu mới chưa có ai. Chủ kho tạo sàn và Quản trị sàn đầu tiên bằng SQL, một
    lần cho bản thử (sau việc 10), một lần cho bản thật (sau việc 12). Ở đâu: Supabase › dự án của môi trường › SQL Editor ›
    New query. Gõ câu dưới, thay `[Tên sàn]`, `[Tên]` và địa chỉ thư bằng tên sàn, tên và hộp thư thật của người quản trị
    (gõ thẳng ở SQL Editor, không ghi vào kho; địa chỉ thư viết thường, không khoảng trắng), rồi Run. Những người khác vào
    sau bằng thư mời của người này trong ứng dụng. Máy nhận lại: không biến mới.

    ```sql
    with c as (insert into companies (name) values ('[Tên sàn]') returning id),
         u as (insert into identity.users (email, name) values ('quan-tri@example.test', '[Tên]') returning id)
    insert into company_members (company_id, user_id, name, roles)
    select c.id, u.id, '[Tên]', array['CompanyAdmin'] from c, u
    returning company_id, user_id;
    ```

    - **Đạt khi:** SQL Editor trả đúng một dòng có hai mã `company_id`, `user_id`; ở trang đăng nhập của môi trường ấy,
      xin mã bằng địa chỉ thư vừa gõ thì thư mã tới và đăng nhập vào được.
    - **Đỏ thì:** `relation "companies" does not exist` — bước `migration` của môi trường ấy chưa đạt; `duplicate key value
violates unique constraint "users_email_key"` — địa chỉ ấy đã có tài khoản: không chạy lại, báo người giữ kho mã;
      `violates check constraint` — địa chỉ có chữ hoa hay khoảng trắng, hoặc tên rỗng hay quá 120 ký tự: sửa rồi Run lại;
      dòng có `row-level security` — dừng, báo người giữ kho mã; không có thư mã — kiểm việc 7 và `MAIL_FROM`.

12. **Chủ kho — duyệt bản thật.** Trước khi xin duyệt, máy gửi một gói ngắn: các thay đổi, và bản thử đã chạy đúng commit
    ấy và xanh. Ở đâu: trang của lượt Deploy trên GitHub › Review deployments › đánh dấu `production` › Approve and deploy.
    Máy nhận lại: không biến mới.
    - **Đạt khi:** nhật ký có `deploy production: xong <commit>`; `https://inventory.onehub.center/api/v1/health` trả
      `"ok":true`, `"env":"production"`, `"vai":"dat"`.
    - **Đỏ thì:** không thấy nút — tài khoản đang dùng không phải người duyệt của `production`; không muốn lên lúc này —
      bấm Reject, bản thật giữ nguyên; dòng đỏ trong nhật ký — bảng «Đỏ thì làm gì» của [dua-ban-len.md](dua-ban-len.md).
13. **Máy — báo lại và ghi.** Máy kiểm nhanh hai địa chỉ (`make smoke`), ghi kết quả vào sổ của kho và báo chủ kho một
    dòng. Lần thử khôi phục đầu theo [khoi-phuc.md](khoi-phuc.md) cần chuỗi vai đăng nhập trên máy chủ kho: xem «Mật khẩu
    vai đăng nhập ở máy chủ kho» dưới. Máy nhận lại: không biến mới.
    - **Đạt khi:** `smoke staging: đạt <commit>` và `smoke production: đạt <commit>`.
    - **Đỏ thì:** lùi bản theo [lui-ban.md](lui-ban.md), rồi tìm nguyên nhân; vừa xoay mật khẩu vai đăng nhập thì đọc
      trước mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của [xoay-khoa.md](xoay-khoa.md).

### Mật khẩu vai đăng nhập ở máy chủ kho

`make dat-khoa` tự sinh `LOGIN_DB_PASSWORD` và `AUTH_SECRET` rồi chỉ đặt chúng ở GitHub: không ai xem lại được, và lệnh
đưa bản lên trên GitHub không cần ai xem. Việc tay trên máy chủ kho cần mật khẩu vai đăng nhập (`make cach-ly-dich`, thử
khôi phục, đưa bản lên từ máy chủ kho). Muốn làm những việc ấy, chủ kho tự giữ mật khẩu vai: sinh trong trình giữ mật
khẩu một chuỗi chữ và số từ 24 ký tự, đặt bằng `gh secret set LOGIN_DB_PASSWORD --env <env>` (lệnh hỏi giá trị), rồi
chạy một lượt Deploy để bước `vai-dang-nhap` đặt nó vào cơ sở dữ liệu. Từ đó `make dat-khoa` giữ nguyên khoá ấy; chỉ
`make dat-khoa XOAY=1` sinh lại nó. Lượt Deploy đặt mật khẩu tự giữ ấy cũng là một lần xoay mật khẩu vai đăng nhập: sau
lượt ấy, đọc mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của [xoay-khoa.md](xoay-khoa.md) trước khi lùi bản.

## Bảng biến

Mọi biến sổ tay nhắc, đặt ở đâu và dùng cho gì. «Máy chủ kho» là máy của người vận hành, khi chạy lệnh bằng tay; giữ biến
ở một tệp ngoài kho (quyền chỉ chủ đọc), nạp vào vỏ lệnh trước khi chạy, không gõ thẳng giá trị vào dòng lệnh.

| Biến                              | Đặt ở đâu                                                                                   | Dùng cho                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN`                    | GitHub, khoá của cả hai môi trường (`make dat-khoa`); máy chủ kho                           | Lệnh đưa bản lên gọi Vercel và API biến của dự án                                              |
| `MIGRATE_DATABASE_URL`            | GitHub, khoá của mỗi môi trường (`make dat-khoa`); máy chủ kho. Không bao giờ ở Vercel      | Vai chủ: áp migration, đặt mật khẩu vai đăng nhập, đọc danh mục cho bộ kiểm cách ly, sao lưu   |
| `LOGIN_DB_PASSWORD`               | GitHub, khoá của mỗi môi trường (`make dat-khoa` tự sinh); máy chủ kho khi chủ kho tự giữ   | Mật khẩu vai `quy_hang_login`; lệnh dựng chuỗi vai đăng nhập từ chuỗi vai chủ với mật khẩu này |
| `AUTH_SECRET`                     | GitHub, khoá của mỗi môi trường (`make dat-khoa` tự sinh); lệnh đưa bản lên đẩy sang Vercel | Khoá băm mã đăng nhập                                                                          |
| `RESEND_API_KEY`                  | GitHub, khoá của mỗi môi trường (`make dat-khoa`); lệnh đưa bản lên đẩy sang Vercel         | Gửi thư mã đăng nhập và thư mời                                                                |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | GitHub, khoá của cả hai môi trường (`make dat-khoa`) — chỉ khi bật bảo vệ; máy chủ kho      | Lệnh kiểm nhanh đọc được địa chỉ riêng của bản mới                                             |
| `VERCEL_ORG_ID`                   | GitHub, biến của cả hai môi trường (máy đặt); máy chủ kho                                   | Nhóm Vercel chứa hai dự án                                                                     |
| `VERCEL_PROJECT_ID`               | GitHub, biến của mỗi môi trường (máy đặt, khác nhau); máy chủ kho                           | Dự án Vercel của môi trường                                                                    |
| `APP_URL`                         | GitHub, biến của cả hai môi trường (máy đặt); lệnh đưa bản lên đẩy sang Vercel; máy chủ kho | Địa chỉ của môi trường; đường dẫn trong thư dựng từ nó; lệnh kiểm nhanh đọc nó                 |
| `MAIL_FROM`                       | GitHub, biến của cả hai môi trường (máy đặt); lệnh đưa bản lên đẩy sang Vercel              | Địa chỉ gửi thư, thuộc `onehub.center` hay tên miền con                                        |
| `STAGING_APP_URL`                 | GitHub, biến của môi trường `production` (máy đặt)                                          | Bản thật kiểm bản thử đã chạy đúng commit trước khi lên                                        |
| `DATABASE_URL`                    | Vercel, mỗi dự án — lệnh đưa bản lên đặt, không ai đặt tay                                  | Ứng dụng nối cơ sở dữ liệu bằng vai `quy_hang_login`, không bao giờ bằng vai chủ               |
| `APP_ENV`                         | Vercel, mỗi dự án — lệnh đưa bản lên đặt                                                    | `staging` hoặc `production`; bản dựng không khởi động nếu thiếu hay lạ                         |
| `KHOI_PHUC_ADMIN_URL`             | Máy chủ kho                                                                                 | Máy chủ cơ sở dữ liệu nơi thử khôi phục, bằng vai được tạo cơ sở nháp                          |
| `KHOI_PHUC_LOGIN_URL`             | Máy chủ kho                                                                                 | Vai đăng nhập trên cùng máy chủ ấy, cho bộ kiểm cách ly bản khôi phục                          |
| `KHOI_PHUC_GIU`                   | Máy chủ kho, tuỳ chọn                                                                       | `1` để giữ cơ sở nháp sau lần thử, xem bằng tay                                                |
| `SAO_LUU_LUOC_DO`                 | Máy chủ kho, tuỳ chọn                                                                       | Chỉ sao lưu và đếm các lược đồ của ta (trên Supabase: `public identity app`)                   |
| `PSQL_DICH`                       | Máy chủ kho, tuỳ chọn                                                                       | Lệnh `psql` dùng để nối (mặc định `psql`)                                                      |
| `PG_DUMP_CMD`                     | Máy chủ kho, tuỳ chọn                                                                       | Lệnh `pg_dump` (mặc định `pg_dump`)                                                            |
| `PG_DUMP_ARGS`                    | Máy chủ kho, tuỳ chọn                                                                       | Cờ thêm cho `pg_dump`                                                                          |
| `PG_RESTORE_CMD`                  | Máy chủ kho, tuỳ chọn                                                                       | Lệnh `pg_restore` (mặc định `pg_restore`)                                                      |
| `LOGIN_CODE_OUTBOX`               | Chỉ máy dev. Không bao giờ ở Vercel                                                         | Ghi mã đăng nhập ra tệp cho bài kiểm trình duyệt                                               |
| `NEXT_PUBLIC_E2E_BUTTON_RECORD`   | Chỉ bài kiểm trình duyệt. Không bao giờ ở Vercel                                            | Ghi quyết định của nút quyền lên trang                                                         |
| `CACH_LY_CMD`                     | Chỉ bài kiểm của kho                                                                        | Thay lệnh kiểm cách ly trong bài kiểm lệnh đưa bản lên                                         |
| `VERCEL_API_URL`                  | Chỉ bài kiểm của kho                                                                        | Thay địa chỉ API của Vercel bằng máy giả trong bài kiểm lệnh đưa bản lên                       |

Ba thứ không phải biến của lệnh nên không có trong bảng: khoá kho `RELEASE_PLEASE_TOKEN` của GitHub (việc «Release» mở PR
phát hành, việc 9), biến kho `DEPLOY_ENABLED` của GitHub (bật tệp tự động triển khai, việc 10) và mã commit mà lệnh đưa bản
lên tự gắn vào bản dựng để sức khoẻ trả đúng `commit`.
