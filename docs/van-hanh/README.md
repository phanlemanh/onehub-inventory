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

| Quy trình         | Khi nào                                                         | Tệp                                          |
| ----------------- | --------------------------------------------------------------- | -------------------------------------------- |
| Đưa bản lên       | Có bản phát hành mới, hoặc vừa đổi biến trên Vercel             | [dua-ban-len.md](dua-ban-len.md)             |
| Lùi bản           | Bản đang chạy hỏng sau khi lên                                  | [lui-ban.md](lui-ban.md)                     |
| Xoay khoá bí mật  | Khoá lộ, người giữ khoá rời đi, hay tới hạn đổi                 | [xoay-khoa.md](xoay-khoa.md)                 |
| Khôi phục dữ liệu | Thử khôi phục lúc ra mắt rồi mỗi quý; mất hay hỏng dữ liệu thật | [khoi-phuc.md](khoi-phuc.md)                 |
| Nhật ký khôi phục | Ghi mỗi lần thử khôi phục                                       | [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md) |

Mỗi bước trong bốn quy trình ghi bốn điều: làm ở đâu, gõ hay bấm gì, thấy gì là đạt, đỏ thì làm gì. Mỗi việc ngoài kho
(mục cuối) cũng ghi «Đạt khi» và «Đỏ thì».

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

Chủ kho làm theo đúng thứ tự này một lần, trước lần đưa bản đầu: mỗi việc chỉ cần những việc đứng trước nó. Mỗi việc ghi
làm ở đâu và bấm gì, máy cần nhận lại biến nào, rồi hai dòng **Đạt khi:** (thấy gì là xong) và **Đỏ thì:** (làm gì khi
không thấy). Sổ tay chỉ ghi tên biến: giá trị gõ thẳng vào trang của dịch vụ, không dán vào kho, vào chat hay vào PR.
Bảng biến ở mục sau nói mỗi biến dùng cho gì.

1. **Supabase — hai dự án.** Ở supabase.com, trong tổ chức trả phí, tạo hai dự án: một cho bản thử, một cho bản thật,
   vùng Southeast Asia (Singapore), gói có sao lưu hằng ngày giữ 7 ngày. Mật khẩu vai chủ (`postgres`) do Supabase hỏi
   lúc tạo: cất vào trình giữ mật khẩu. Máy nhận lại: chưa biến nào ở bước này.
   - **Đạt khi:** trang tổ chức liệt hai dự án, cả hai ghi vùng Singapore; Project Settings › Infrastructure của mỗi dự án
     ghi bản Postgres; trình giữ mật khẩu có hai mật khẩu vai chủ.
   - **Đỏ thì:** không chọn được Singapore hay gói có sao lưu — tổ chức đang ở gói miễn phí: Billing › nâng gói rồi tạo
     lại; quên chép mật khẩu vai chủ — Project Settings › Database › Reset database password, cất mật khẩu mới.
2. **Supabase — tắt Data API ở cả hai dự án.** Ở mỗi dự án: Project Settings › Data API, tắt «Enable Data API», Save.
   Máy nhận lại: không biến nào.
   - **Đạt khi:** công tắc «Enable Data API» ở trạng thái tắt sau khi tải lại trang, ở cả hai dự án.
   - **Đỏ thì:** không thấy công tắc ấy thì để đó, đi tiếp: lần đưa bản đầu, bộ kiểm cách ly gọi tên từng bảng còn cấp
     quyền cho `anon` hay `authenticated`, và [dua-ban-len.md](dua-ban-len.md) (bảng «Đỏ thì làm gì», dòng `cach-ly`) nói
     cách thu quyền.
3. **Supabase — chuỗi nối của vai chủ.** Ở mỗi dự án: nút Connect › Session pooler, chép chuỗi nối, thay chỗ
   `[YOUR-PASSWORD]` bằng mật khẩu vai chủ của việc 1, cất vào trình giữ mật khẩu. Máy nhận lại: `MIGRATE_DATABASE_URL`,
   đặt ở việc 10 làm khoá bí mật của môi trường GitHub tương ứng.
   - **Đạt khi:** trình giữ mật khẩu có hai chuỗi bắt đầu bằng `postgresql://postgres.`, cổng `5432`, mỗi dự án một chuỗi,
     không còn chữ `[YOUR-PASSWORD]`.
   - **Đỏ thì:** chuỗi có cổng `6543` — đó là Transaction pooler, chọn lại Session pooler; không thấy nút Connect — dự án
     còn đang khởi tạo, chờ vài phút rồi tải lại trang.
4. **Chọn mật khẩu vai đăng nhập.** Ứng dụng nối bằng vai `quy_hang_login`; vai này được migration tạo ở lần đưa bản đầu,
   chưa có mật khẩu. Trình giữ mật khẩu sinh trước hai mật khẩu dài ngẫu nhiên (một cho bản thử, một cho bản thật), chỉ
   chữ và số. Từ đó dựng hai chuỗi nối: chép chuỗi của việc 3, thay tên người dùng `postgres` (phần trước dấu chấm) bằng
   `quy_hang_login` và mật khẩu vai chủ bằng mật khẩu vừa sinh; máy chủ và cổng giữ nguyên. Máy nhận lại: `DATABASE_URL`
   (việc 9), `LOGIN_DATABASE_URL` (việc 10, chỉ bản thử).
   - **Đạt khi:** trình giữ mật khẩu có hai chuỗi bắt đầu bằng `postgresql://quy_hang_login.`, cùng máy chủ và cổng với
     chuỗi vai chủ của dự án ấy. Chưa nối thử được: vai chỉ có sau lần đưa bản đầu (việc 12).
   - **Đỏ thì:** mật khẩu có ký tự như `@`, `:`, `/`, `#` — chuỗi nối sẽ hỏng; sinh lại mật khẩu chỉ chữ và số.
5. **Vercel — hai dự án.** Ở vercel.com, trong nhóm gói Pro: Add New › Project, nhập kho này hai lần, đặt tên khác nhau
   cho bản thử và bản thật, khung Next.js. Ở mỗi dự án, Settings › Git: kiểm tự triển khai theo nhánh đã tắt (kho ghi sẵn
   ở `vercel.json`); Settings › Functions: vùng Singapore (`sin1`). Máy nhận lại: `VERCEL_ORG_ID` (Team Settings ›
   General › Team ID, chung hai dự án) và `VERCEL_PROJECT_ID` (Project Settings › General › Project ID, mỗi dự án một
   giá trị).
   - **Đạt khi:** nhóm có hai dự án; Settings › Functions của mỗi dự án ghi `sin1`; trình giữ mật khẩu có Team ID và hai
     Project ID (`VERCEL_ORG_ID` bắt đầu bằng `team_`, `VERCEL_PROJECT_ID` bắt đầu bằng `prj_`).
   - **Đỏ thì:** lần nhập kho tự dựng một bản và bản ấy đỏ vì thiếu biến — bình thường, bỏ qua: biến đặt ở việc 9, bản
     thật đi qua lệnh của kho; không chọn được vùng Singapore — nhóm chưa ở gói Pro, nâng gói rồi làm lại.
6. **Vercel — khoá cho máy đưa bản lên.** Account Settings › Tokens › Create, phạm vi là nhóm có hai dự án, hạn 1 năm.
   Ghi ngày hết hạn vào lịch để xoay khoá ([xoay-khoa.md](xoay-khoa.md)). Máy nhận lại: `VERCEL_TOKEN`.
   - **Đạt khi:** danh sách Tokens có khoá mới, phạm vi là nhóm ấy, ngày hết hạn sau một năm; giá trị đã nằm trong trình
     giữ mật khẩu và lịch có ngày nhắc.
   - **Đỏ thì:** đóng hộp thoại trước khi chép giá trị — Vercel không cho xem lại: xoá khoá ấy (Delete) và tạo khoá mới;
     phạm vi chỉ có tài khoản cá nhân — chủ kho chưa là thành viên nhóm, nhờ người quản trị nhóm mời.
7. **Vercel — bảo vệ bản mới.** Ở mỗi dự án: Settings › Deployment Protection. Nếu «Vercel Authentication» đang bật, tạo
   «Protection Bypass for Automation» để lệnh kiểm nhanh đọc được địa chỉ riêng của bản mới. Tắt thì bỏ qua việc này.
   Máy nhận lại: `VERCEL_AUTOMATION_BYPASS_SECRET` (chỉ khi bật).
   - **Đạt khi:** hoặc «Vercel Authentication» tắt, hoặc trang ghi một chuỗi «Protection Bypass for Automation» và chuỗi
     ấy đã nằm trong trình giữ mật khẩu.
   - **Đỏ thì:** không thấy mục Protection Bypass — gói chưa có tính năng ấy: tắt «Vercel Authentication» cho dự án ấy
     (bản thật vẫn chỉ phục vụ qua tên miền và đăng nhập của ứng dụng).
8. **Resend — tên miền gửi thư.** Ở resend.com: Domains › Add Domain, nhập `onehub.center` hoặc một tên miền con của nó
   (bản dựng chỉ nhận địa chỉ gửi thuộc `onehub.center` và các tên miền con). Thêm các bản ghi DNS Resend đưa vào trang
   DNS của `onehub.center` trên Vercel (Domains › `onehub.center`). Rồi API Keys › Create, quyền Sending access, mỗi môi
   trường một khoá. Máy nhận lại: `RESEND_API_KEY`, `MAIL_FROM` (dạng `OneHub <dia-chi@tên miền đã xác minh>`).
   - **Đạt khi:** Resend › Domains ghi tên miền ấy ở trạng thái Verified; trình giữ mật khẩu có hai khoá bắt đầu bằng
     `re_`.
   - **Đỏ thì:** trạng thái còn Pending sau một giờ — so từng bản ghi trên Vercel với trang của Resend (tên, loại, giá
     trị), sửa chỗ lệch rồi bấm Verify lại; Failed — xoá tên miền trên Resend và thêm lại.
9. **Vercel — tên miền và biến của từng dự án.** Dự án bản thật: Settings › Domains, thêm `inventory.onehub.center`. Dự
   án bản thử: thêm tên miền bản thử chủ kho chọn (không ghi vào kho). Rồi ở mỗi dự án, Settings › Environment Variables,
   đặt cho môi trường **Production** của dự án ấy (cả dự án bản thử: bản thử là bản Production của dự án riêng của nó):
   `DATABASE_URL` (chuỗi của việc 4), `AUTH_SECRET` (chuỗi ngẫu nhiên dài, mỗi môi trường một chuỗi), `RESEND_API_KEY`,
   `MAIL_FROM`, `APP_URL` (`https://inventory.onehub.center` ở bản thật; địa chỉ https của tên miền bản thử ở bản thử),
   `APP_ENV` (`staging` hoặc `production`). Không bao giờ đặt `MIGRATE_DATABASE_URL`, `LOGIN_CODE_OUTBOX` hay
   `NEXT_PUBLIC_E2E_BUTTON_RECORD` ở Vercel: bản dựng thấy chúng thì không khởi động. Máy nhận lại: sáu biến trên ở mỗi
   dự án.
   - **Đạt khi:** Settings › Domains ghi tên miền ở trạng thái Valid Configuration; Settings › Environment Variables của
     mỗi dự án liệt đúng sáu tên trên, môi trường Production, không có ba tên bị cấm.
   - **Đỏ thì:** tên miền báo Invalid Configuration — thêm bản ghi DNS Vercel đưa ra vào trang DNS của `onehub.center`, chờ
     vài phút; lỡ đặt một trong ba tên bị cấm — xoá nó (menu ba chấm › Remove).
10. **GitHub — hai môi trường.** Ở trang kho trên GitHub: Settings › Environments, tạo `staging` và `production`. Môi
    trường `production`: Required reviewers chỉ có chủ kho (bản thật chỉ lên khi chủ kho bấm duyệt); Deployment branches
    and tags: Selected, thêm nhánh `main` và thẻ khuôn `*v*` (thẻ phát hành, để đưa lại đúng bản đang chạy). Đặt khoá bí
    mật (Environment secrets) và biến (Environment variables) theo cột GitHub của bảng biến. Máy nhận lại: ở `staging` —
    khoá `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (dự án bản thử), `MIGRATE_DATABASE_URL` (dự án bản thử),
    `LOGIN_DATABASE_URL`, `VERCEL_AUTOMATION_BYPASS_SECRET` (nếu có) và biến `APP_URL`; ở `production` — khoá
    `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (dự án bản thật), `MIGRATE_DATABASE_URL` (dự án bản thật),
    `VERCEL_AUTOMATION_BYPASS_SECRET` (nếu có) và biến `APP_URL`, `STAGING_APP_URL`.
    - **Đạt khi:** Settings › Environments liệt hai môi trường; mỗi môi trường liệt đúng các tên khoá và biến trên (GitHub
      chỉ hiện tên, không hiện giá trị); `production` ghi một người duyệt và hai luật nhánh, thẻ.
    - **Đỏ thì:** đặt nhầm ở Repository secrets thay vì Environment secrets — xoá ở đó, đặt lại trong môi trường; nhầm
      giá trị giữa hai môi trường — không xem lại được trên GitHub, đặt lại từ trình giữ mật khẩu (Update secret).
11. **GitHub — khoá phát hành và tệp tự động triển khai.** Làm sau khi lệnh `make deploy` đã có trên nhánh `main` (trang
    kho › nhánh `main` có tệp `mk/deploy.mk`). Ba phần, theo thứ tự. Máy nhận lại: khoá kho `RELEASE_PLEASE_TOKEN`, biến
    kho `DEPLOY_ENABLED`.

    **Phần một — khoá phát hành `RELEASE_PLEASE_TOKEN`.** Việc «Release» (mở PR phát hành sau mỗi lần gộp) cần khoá này
    để mở PR và để PR ấy chạy kiểm như PR thường. Ở GitHub: ảnh đại diện › Settings › Developer settings › Personal access
    tokens › Fine-grained tokens › Generate new token. Đặt Token name dễ nhận; Expiration 1 năm (ghi ngày hết hạn vào
    lịch); Repository access: Only select repositories, chọn đúng kho này; Repository permissions: Contents — Read and
    write, Pull requests — Read and write, Issues — Read and write (Metadata — Read tự có). Bấm Generate token, chép giá
    trị vào trình giữ mật khẩu. Rồi ở trang kho: Settings › Secrets and variables › Actions › tab Secrets › New repository
    secret, Name `RELEASE_PLEASE_TOKEN`, dán giá trị, Add secret.

    - **Đạt khi:** tab Secrets của kho liệt `RELEASE_PLEASE_TOKEN`; ở lần gộp kế tiếp vào `main`, Actions › Release xanh
      và có một PR tên bắt đầu bằng `chore(main): release`, PR ấy có các bước kiểm chạy.
    - **Đỏ thì:** Release vẫn đỏ với dòng `GitHub Actions is not permitted to create or approve pull requests` — khoá
      chưa đặt hay sai tên, kiểm đúng chữ `RELEASE_PLEASE_TOKEN` ở Repository secrets; dòng `Resource not accessible` hay
      mã 403 — khoá thiếu quyền hay không phủ kho này: tạo khoá mới đủ ba quyền trên, Update secret.

    **Phần hai — tệp `deploy.yml`.** Ở trang kho: Code › thư mục `.github/workflows` › tệp `deploy.yml` › nút bút chì
    (Edit this file). Xoá hết nội dung cũ, dán nguyên khối dưới. Bấm Commit changes…, chọn «Create a new branch for this
    commit and start a pull request», tên commit `ci: deploy to Vercel staging and production`, bấm Propose changes rồi
    Create pull request. Chờ các bước kiểm xanh rồi gộp PR.

    ```yaml
    name: Deploy

    # Staging goes up on its own after a release; production waits for the owner's approval on the
    # "production" environment (Settings > Environments > production > Required reviewers).
    # Runbook and variable table: docs/van-hanh/README.md. Each environment holds its own secrets.
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
              VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
              VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
              MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
              LOGIN_DATABASE_URL: ${{ secrets.LOGIN_DATABASE_URL }}
              VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
              APP_URL: ${{ vars.APP_URL }}

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
              VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
              VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
              MIGRATE_DATABASE_URL: ${{ secrets.MIGRATE_DATABASE_URL }}
              VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
              APP_URL: ${{ vars.APP_URL }}
              STAGING_APP_URL: ${{ vars.STAGING_APP_URL }}
    ```

    - **Đạt khi:** PR đã gộp; tệp `deploy.yml` trên `main` bắt đầu bằng `name: Deploy` và có dòng
      `npm install --global vercel@65.9.0` ở cả hai việc `staging` và `production`.
    - **Đỏ thì:** kiểm của PR đỏ ở việc đọc tệp workflow — thường là dán thiếu hay lệch thụt đầu dòng: mở lại tệp, xoá hết,
      dán lại nguyên khối; GitHub không cho sửa tệp này — chủ kho chưa có quyền ghi vào kho, nhờ người quản trị kho.

    **Phần ba — bật tự động triển khai.** Settings › Secrets and variables › Actions › tab Variables › New repository
    variable, Name `DEPLOY_ENABLED`, Value `true`, Add variable.

    - **Đạt khi:** tab Variables liệt `DEPLOY_ENABLED` với giá trị `true`.
    - **Đỏ thì:** đặt nhầm trong một môi trường (Environment variables) — việc `staging` vẫn bị bỏ qua (Skipped); xoá ở đó,
      đặt lại ở tab Variables của kho.

12. **Lần đưa bản đầu và mật khẩu vai đăng nhập.** Theo [dua-ban-len.md](dua-ban-len.md), mục «Lần đầu ở một môi
    trường». Bắt đầu ở trang kho: Actions › Deploy › Run workflow, ô «Use workflow from» để tab Branches, chọn nhánh
    `main` (lần đầu chưa có thẻ phát hành nào), bấm Run workflow. Lần chạy đầu dừng ở bước cần vai đăng nhập (bản thử:
    `cach-ly`; bản thật: `kiem-nhanh`) vì vai vừa được tạo chưa có mật khẩu. Đặt mật khẩu của việc 4 cho vai ấy trong SQL
    Editor của Supabase rồi chạy lại cùng cách. Với bản thật: bản thử đã xong, chủ kho duyệt `production`, bản thật dừng ở
    `kiem-nhanh` với dòng `deploy production: kiem-nhanh ĐỎ — vai nối chưa đạt …` và `DỪNG ở kiem-nhanh — tên miền không
đổi` (tên miền chưa gắn bản mới, không ai bị ảnh hưởng); mở SQL Editor của **dự án bản thật**, chạy
    `alter role quy_hang_login password '<mật khẩu chỉ chữ và số>';`, đặt cùng mật khẩu vào `DATABASE_URL` của dự án
    Vercel bản thật (việc 9), rồi Run workflow lại như trên. Lượt chạy lại đi lại cả bản thử (nhanh, đã xanh) rồi lại chờ
    duyệt `production` — duyệt lần nữa. Khi bản thử đã xong và lượt chờ duyệt `production`, làm việc 13 cho bản
    thử trước khi nhìn bản thử và duyệt. Máy nhận lại: không biến mới.
    - **Đạt khi:** nhật ký lượt Deploy có `deploy staging: xong <commit>` rồi `deploy production: xong <commit>`; mở
      `<APP_URL>/api/v1/health` của hai môi trường thấy `"ok":true` và `"vai":"dat"`.
    - **Đỏ thì:** đọc dòng đỏ trong nhật ký lượt Deploy và làm theo bảng «Đỏ thì làm gì» của
      [dua-ban-len.md](dua-ban-len.md); không có lượt Deploy nào — xem lại phần ba của việc 11.
13. **Tài khoản đăng nhập đầu ở mỗi môi trường.** Kho không có lệnh hay màn tạo sàn đầu tiên: lời mời chỉ do một
    Quản trị sàn đã đăng nhập gửi, và cơ sở dữ liệu mới chưa có ai. Nên chủ kho tạo sàn và Quản trị sàn đầu tiên bằng SQL,
    một lần cho bản thử, một lần cho bản thật, sau khi bước `migration` của môi trường ấy đạt (việc 12). Ở đâu: Supabase ›
    dự án của môi trường › SQL Editor › New query. Gõ câu dưới, thay `[Tên sàn]`, `[Tên]` và địa chỉ thư bằng tên sàn, tên
    và hộp thư thật của người quản trị (gõ thẳng ở SQL Editor, không ghi vào kho; địa chỉ thư viết thường, không khoảng
    trắng), rồi Run. Những người khác vào sau bằng thư mời của người này trong ứng dụng. Máy nhận lại: không biến mới.

    ```sql
    with c as (insert into companies (name) values ('[Tên sàn]') returning id),
         u as (insert into identity.users (email, name) values ('quan-tri@example.test', '[Tên]') returning id)
    insert into company_members (company_id, user_id, name, roles)
    select c.id, u.id, '[Tên]', array['CompanyAdmin'] from c, u
    returning company_id, user_id;
    ```

    - **Đạt khi:** SQL Editor trả đúng một dòng có hai mã `company_id`, `user_id`; ở trang đăng nhập của môi trường ấy,
      xin mã bằng địa chỉ thư vừa gõ thì thư mã tới và đăng nhập vào được.
    - **Đỏ thì:** `relation "companies" does not exist` hay `relation "identity.users" does not exist` — migration chưa áp,
      làm xong việc 12 trước; `duplicate key value violates unique constraint "users_email_key"` — địa chỉ ấy đã có tài
      khoản: không chạy lại, báo người giữ kho mã; `violates check constraint` — địa chỉ có chữ hoa hay khoảng trắng, hoặc
      tên rỗng hay quá 120 ký tự: sửa rồi Run lại (lỗi nào cũng không ghi dòng nào); dòng có `row-level security` — vai
      của SQL Editor không vượt được luật theo dòng: dừng, báo người giữ kho mã; không có thư mã — kiểm việc 8 và
      `RESEND_API_KEY`, `MAIL_FROM` của dự án Vercel ấy.

14. **Lần thử khôi phục đầu.** Theo [khoi-phuc.md](khoi-phuc.md) trên bản thử, chép dòng kết quả vào
    [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md). Đặt lịch nhắc thử lại mỗi quý. Máy nhận lại: một dòng mới trong nhật ký
    khôi phục.
    - **Đạt khi:** bảng «Các lần thử» của nhật ký khôi phục có một dòng `khoi-phuc: … cach-ly đạt` với ngày hôm nay; lịch
      có nhắc lặp lại mỗi ba tháng.
    - **Đỏ thì:** làm theo dòng «Đỏ thì» của bước đỏ trong [khoi-phuc.md](khoi-phuc.md); vẫn đỏ thì ghi lần thử đỏ vào nhật
      ký như bước 5 ở đó và báo người giữ kho mã.

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

Ba thứ không phải biến của lệnh nên không có trong bảng: khoá kho `RELEASE_PLEASE_TOKEN` của GitHub (việc «Release»
mở PR phát hành, việc 11), biến kho `DEPLOY_ENABLED` của GitHub (bật tệp tự động triển khai, việc 11) và mã commit mà
lệnh đưa bản lên tự gắn vào bản dựng để sức khoẻ trả đúng `commit`.
