# Đưa bản lên

Đưa một commit của nhánh `main` lên bản thử, rồi lên bản thật. Lệnh đi từng bước và dừng ở bước đỏ đầu tiên; trước khi
gắn tên miền, một bước đỏ không đổi gì ở bản đang phục vụ người dùng. Mục lục và bảng biến: [README.md](README.md).

## Khi nào dùng

- Chủ kho vừa gộp PR phát hành: bản thử tự lên, bản thật chờ chủ kho duyệt.
- Vừa đổi một biến trên Vercel (ví dụ sau khi xoay khoá): biến mới chỉ có hiệu lực ở bản dựng kế tiếp, nên đưa lại đúng
  commit đang chạy.
- Lần đầu ở một môi trường: xem mục «Lần đầu ở một môi trường» ở cuối trang.

## Cần có trước

- Mười một việc đầu của danh sách «Việc ngoài kho» trong [README.md](README.md) đã xong.
- Quyền duyệt môi trường `production` trên GitHub (chỉ chủ kho có).
- Luật migration: một migration mới không được làm hỏng bản đang chạy. Thêm bảng, thêm cột thì được; xoá hay đổi
  tên bảng hoặc cột chỉ được ở một bản sau, khi bản trước đã thôi dùng, và tệp migration ấy phải có một dòng
  `-- bo-sau: <bản nào đã thôi dùng, vì sao an toàn>`. Thiếu dòng ấy thì lệnh dừng ở bước `migration`, chưa áp gì.

## Các bước

### 1. Bắt đầu lượt đưa bản lên

- **Ở đâu:** trang kho trên GitHub.
- **Gõ hay bấm:** gộp PR phát hành (tên bắt đầu bằng `chore(main): release`). Muốn đưa lại commit đang chạy mà không
  phát hành: tab Actions › Deploy › Run workflow, ô «Use workflow from» chọn thẻ phát hành đang chạy (tab Tags,
  thẻ mới nhất), bấm Run workflow. Chọn nhánh `main` thì mọi commit chưa phát hành trên `main` cũng lên.
- **Đạt khi:** tab Actions có một lượt Deploy mới, việc `staging` đang chạy.
- **Đỏ thì:** không thấy lượt Deploy — kiểm biến kho `DEPLOY_ENABLED` là `true` (việc 11 của README) và việc Release đã
  xanh; việc `staging` bị bỏ qua (Skipped) cũng là do `DEPLOY_ENABLED`.

### 2. Theo dõi bản thử

- **Ở đâu:** Actions › lượt Deploy vừa mở › việc `staging` › bước `make deploy ENV=staging`.
- **Gõ hay bấm:** không gõ gì; mở bước ấy để đọc nhật ký.
- **Đạt khi:** có đủ bảy dòng theo thứ tự `deploy staging: cau-hinh đạt`, `migration đạt`, `cach-ly đạt`, `dung đạt`,
  `kiem-nhanh đạt`, `gan-ten-mien đạt`, `kiem-nhanh-ten-mien đạt`, dòng cuối `deploy staging: xong <7 ký tự commit>`, việc
  xanh.
- **Đỏ thì:** đọc dòng `deploy staging: <bước> ĐỎ — <lý do>` và làm theo dòng của bước ấy ở mục «Đỏ thì làm gì». Bản thật
  không bị đụng tới: việc `production` không chạy khi `staging` đỏ.

### 3. Nhìn bản thử bằng mắt

- **Ở đâu:** trình duyệt, địa chỉ bản thử (`STAGING_APP_URL`).
- **Gõ hay bấm:** mở `<địa chỉ bản thử>/api/v1/health`; rồi mở trang chủ bản thử và đăng nhập bằng thư mời của mình.
- **Đạt khi:** sức khoẻ trả `"ok":true`, `"env":"staging"`, `"vai":"dat"` và `commit` trùng commit của lượt Deploy; thư mã
  đăng nhập tới, đăng nhập vào được.
- **Đỏ thì:** không duyệt bản thật. Sức khoẻ sai — xem dòng `kiem-nhanh` ở mục «Đỏ thì làm gì»; không có thư — kiểm
  `MAIL_FROM`, `RESEND_API_KEY` của dự án bản thử và trạng thái Verified của tên miền ở Resend; trang lỗi — lùi bản thử
  theo [lui-ban.md](lui-ban.md) và báo người giữ kho mã.

### 4. Duyệt bản thật

- **Ở đâu:** trang của lượt Deploy trên GitHub; nút «Review deployments» hiện khi việc `production` chờ duyệt.
- **Gõ hay bấm:** Review deployments › đánh dấu `production` › Approve and deploy.
- **Đạt khi:** việc `production` chuyển sang chạy.
- **Đỏ thì:** không thấy nút — tài khoản đang dùng không phải người duyệt của môi trường `production` (việc 10 của README).
  Không muốn lên bản thật lúc này: bấm Reject; bản thật giữ nguyên.

### 5. Theo dõi bản thật

- **Ở đâu:** Actions › lượt Deploy › việc `production` › bước `make deploy ENV=production`.
- **Gõ hay bấm:** không gõ gì; đọc nhật ký.
- **Đạt khi:** đủ bảy dòng `deploy production: cau-hinh đạt`, `ban-thu-truoc đạt`, `migration đạt`, `dung đạt`,
  `kiem-nhanh đạt`, `gan-ten-mien đạt`, `kiem-nhanh-ten-mien đạt`, dòng cuối `deploy production: xong <commit>`.
- **Đỏ thì:** làm theo dòng của bước đỏ ở mục «Đỏ thì làm gì». Thấy `đã lùi về bản trước` là bản thật đã tự quay về bản
  cũ — vẫn phải tìm nguyên nhân trước khi đưa lại.

### 6. Kiểm bản thật

- **Ở đâu:** trình duyệt; hoặc máy chủ kho, trong bản sao của kho đang đứng ở đúng commit vừa lên.
- **Gõ hay bấm:** mở `https://inventory.onehub.center/api/v1/health`; hoặc gõ `make smoke ENV=production`.
- **Đạt khi:** sức khoẻ trả `"ok":true`, `"env":"production"`, `"vai":"dat"`, đúng commit; lệnh in
  `smoke production: đạt <commit>`.
- **Đỏ thì:** lệnh in `smoke production: ĐỎ — <lý do>` hay trang lỗi: lùi bản ngay theo [lui-ban.md](lui-ban.md), rồi tìm
  nguyên nhân.

## Đỏ thì làm gì

Mọi bước đỏ trước `gan-ten-mien` kết thúc bằng `DỪNG ở <bước> — tên miền không đổi`: người dùng vẫn ở bản cũ, không cần
lùi. Sửa nguyên nhân rồi chạy lại từ bước 1 (Run workflow); migration đã áp thì lần sau bỏ qua.

| Bước                  | Dòng đỏ (lý do)                                                                            | Làm gì                                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cau-hinh`            | `thiếu biến <tên>`                                                                         | Đặt biến ấy ở môi trường GitHub tương ứng (bảng biến trong README), chạy lại.                                                                                                                                                                 |
| `cau-hinh`            | `cây chưa sạch` · `không phải một kho git`                                                 | Trên GitHub không xảy ra. Ở máy chủ kho: commit hay bỏ thay đổi; chỉ còn thư mục `.vercel/` thì xoá nó.                                                                                                                                       |
| `cau-hinh`            | `vercel.json: …`                                                                           | Ai đó đã đổi `vercel.json`. Không đưa bản lên; báo người giữ kho mã trả lại vùng `sin1` và tắt tự triển khai.                                                                                                                                 |
| `ban-thu-truoc`       | `bản thử chưa chạy <commit>`                                                               | Đưa commit ấy lên bản thử trước (bước 1–3), rồi duyệt lại bản thật. `STAGING_APP_URL` sai cũng ra dòng này: kiểm biến ở môi trường `production`.                                                                                              |
| `migration`           | `<tệp> xoá hay đổi tên bảng hoặc cột mà thiếu dòng «-- bo-sau:»`                           | Chưa áp gì. Báo người viết migration: tách thành bản sau, hoặc thêm dòng `-- bo-sau:` bằng một migration mới (không sửa tệp đã commit).                                                                                                       |
| `migration`           | `migrate.sh lỗi: …` · `không đọc được sổ migration`                                        | Mỗi tệp áp trong một giao dịch, tệp lỗi không để lại gì. Kiểm `MIGRATE_DATABASE_URL` (mật khẩu, chuỗi Session pooler) rồi báo người giữ kho mã với dòng lỗi.                                                                                  |
| `cach-ly`             | `vai anon co quyen tren: <bảng>` · `vai authenticated co quyen tren: <bảng>`               | Data API của Supabase còn bật. Tắt nó (việc 2 của README); không tắt được thì trong SQL Editor của dự án bản thử chạy `revoke all on all tables in schema <lược đồ> from anon, authenticated;` cho từng lược đồ có bảng bị gọi tên, chạy lại. |
| `cach-ly`             | vai đăng nhập không nối được, ở lần đầu                                                    | Dự kiến ở lần đầu: xem «Lần đầu ở một môi trường».                                                                                                                                                                                            |
| `cach-ly`             | dòng khác (`bang khong ep luat dong`, `vai dang nhap la chu`, `thay dong cua san khac`, …) | Lỗi cách ly giữa các sàn (SP-1). Không đưa bản lên, không tự sửa trên cơ sở dữ liệu; báo người giữ kho mã kèm nguyên dòng.                                                                                                                    |
| `dung`                | `vercel pull lỗi` · `vercel build lỗi` · `vercel deploy lỗi`                               | Đọc nhật ký ngay phía trên dòng đỏ. Khoá hết hạn hay sai: xoay `VERCEL_TOKEN` theo [xoay-khoa.md](xoay-khoa.md). Lỗi dựng mã: báo người giữ kho mã.                                                                                           |
| `kiem-nhanh`          | `vai nối chưa đạt: …` · `sức khoẻ ok khác true`                                            | Bản mới không nối được cơ sở dữ liệu bằng vai đăng nhập. Kiểm `DATABASE_URL` ở dự án Vercel: tên người dùng đúng `quy_hang_login`, đúng mật khẩu. Ở lần đầu: «Lần đầu ở một môi trường».                                                      |
| `kiem-nhanh`          | `sức khoẻ không trả lời` · `sức khoẻ trả <mã>, không phải JSON`                            | Bản mới không khởi động (thiếu hay sai biến: mở Vercel › dự án › Deployments › bản mới › Logs, dòng lỗi gọi tên biến) hoặc bảo vệ bản mới chặn lệnh kiểm: đặt `VERCEL_AUTOMATION_BYPASS_SECRET` (việc 7).                                     |
| `kiem-nhanh`          | `env là <x>, cần <y>`                                                                      | `APP_ENV` của dự án Vercel sai, hoặc `VERCEL_PROJECT_ID` của môi trường GitHub trỏ nhầm dự án. Sửa rồi chạy lại.                                                                                                                              |
| `kiem-nhanh`          | `chạy commit <a>, cần <b>`                                                                 | Báo người giữ kho mã: bản dựng không mang đúng commit.                                                                                                                                                                                        |
| `kiem-nhanh`          | `/proto/x trả <mã>, cần 404`                                                               | Lối thử của máy dev còn mở trên bản dựng. Không đưa bản lên; báo người giữ kho mã.                                                                                                                                                            |
| `gan-ten-mien`        | `vercel promote lỗi`                                                                       | Tên miền chưa đổi. Kiểm `VERCEL_TOKEN` còn hạn và tên miền đã gắn vào đúng dự án (việc 9), chạy lại.                                                                                                                                          |
| `kiem-nhanh-ten-mien` | đỏ, rồi `đã lùi về bản trước`                                                              | Lệnh đã tự trỏ tên miền về bản cũ. Mở sức khoẻ của tên miền để chắc, rồi tìm nguyên nhân như dòng `kiem-nhanh` cùng lý do.                                                                                                                    |
| `kiem-nhanh-ten-mien` | đỏ, rồi `lùi bản ĐỎ` hay `không có bản trước để lùi`                                       | Tên miền đang trỏ bản hỏng. Lùi bằng tay ngay theo [lui-ban.md](lui-ban.md); vẫn đỏ thì Vercel › dự án › Deployments, chọn bản trước, «Instant Rollback».                                                                                     |

## Lần đầu ở một môi trường

Vai `quy_hang_login` do migration tạo ở lần đưa bản đầu và chưa có mật khẩu, nên lần chạy đầu dừng ở bước đầu tiên cần vai
ấy: bản thử ở `cach-ly`, bản thật ở `kiem-nhanh`. Tên miền chưa đổi.

1. **Ở đâu:** Supabase › dự án của môi trường ấy › SQL Editor. **Gõ:** `alter role quy_hang_login password '<mật khẩu
của việc 4 trong README>';` rồi Run. **Đạt khi:** Supabase báo «Success. No rows returned». **Đỏ thì:**
   `role "quy_hang_login" does not exist` — bước `migration` chưa đạt; đọc lại nhật ký lượt Deploy.
2. **Ở đâu:** GitHub › Actions › Deploy › Run workflow. **Gõ:** không gì; chạy lại. **Đạt khi:** đủ các dòng đạt như bước
   2 hay 5 ở trên. **Đỏ thì:** vẫn `vai nối chưa đạt` — mật khẩu trong `DATABASE_URL` (Vercel) hay `LOGIN_DATABASE_URL`
   (GitHub) khác mật khẩu vừa đặt; sửa cho trùng rồi chạy lại. Lỗi khởi động gọi tên `DATABASE_URL phải nối bằng vai
quy_hang_login` mà tên người dùng trong chuỗi đã đúng: dừng, báo người giữ kho mã.

## Đưa bản lên từ máy chủ kho

Chỉ khi GitHub Actions không dùng được. Cần một máy có Node 24 (`node --version` in `v24.…`; tải ở nodejs.org, bản
24 LTS), `vercel` đúng bản tệp tự động triển khai dùng — gõ `npm install --global vercel@65.9.0`, đạt khi
`vercel --version` in `65.9.0` — và `psql` (gói `postgresql-client`); bản sao
kho sạch, đứng ở commit cần đưa lên; nạp các biến của môi trường ấy (bảng biến) từ tệp ngoài kho. Gõ
`make deploy ENV=staging`, đọc các dòng như bước 2; đạt thì `make deploy ENV=production`, đọc như bước 5. Cách đọc dòng đỏ
giống hệt mục trên.
