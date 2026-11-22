# Đưa bản lên

Đưa một commit của nhánh `main` lên bản thử, rồi lên bản thật. Lệnh đi từng bước và dừng ở bước đỏ đầu tiên; trước khi
gắn tên miền, một bước đỏ không đổi gì ở bản đang phục vụ người dùng. Mục lục và bảng biến: [README.md](README.md).

## Khi nào dùng

- Chủ kho vừa gộp PR phát hành: bản thử tự lên, bản thật chờ chủ kho duyệt.
- Vừa đổi một biến trên Vercel (ví dụ sau khi xoay khoá): biến mới chỉ có hiệu lực ở bản dựng kế tiếp, nên đưa lại đúng
  commit đang chạy.
- Lần đầu ở một môi trường: xem mục «Lần đầu ở một môi trường» ở cuối trang.

## Cần có trước

- Chín việc đầu của danh sách «Việc ngoài kho» trong [README.md](README.md) đã xong (lần đầu: việc 10 là chính quy trình này).
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
- **Đỏ thì:** không thấy lượt Deploy — kiểm biến kho `DEPLOY_ENABLED` là `true` (việc 10 của README) và việc Release đã
  xanh; việc `staging` bị bỏ qua (Skipped) cũng là do `DEPLOY_ENABLED`.

### 2. Theo dõi bản thử

- **Ở đâu:** Actions › lượt Deploy vừa mở › việc `staging` › bước `make deploy ENV=staging`.
- **Gõ hay bấm:** không gõ gì; mở bước ấy để đọc nhật ký.
- **Đạt khi:** có đủ chín dòng theo thứ tự `deploy staging: cau-hinh đạt`, `migration đạt`, `bien đạt`,
  `vai-dang-nhap đạt`, `cach-ly đạt`, `dung đạt`, `kiem-nhanh đạt`, `gan-ten-mien đạt`, `kiem-nhanh-ten-mien đạt`, dòng cuối
  `deploy staging: xong <7 ký tự commit>`, việc xanh.
- **Đỏ thì:** đọc dòng `deploy staging: <bước> ĐỎ — <lý do>` và làm theo dòng của bước ấy ở mục «Đỏ thì làm gì». Bản thật
  không bị đụng tới: việc `production` không chạy khi `staging` đỏ.

### 3. Nhìn bản thử bằng mắt

- **Ở đâu:** trình duyệt, địa chỉ bản thử (`STAGING_APP_URL`).
- **Gõ hay bấm:** mở `<địa chỉ bản thử>/api/v1/health`; rồi mở trang chủ bản thử và đăng nhập bằng thư mời của mình
  (lần đầu ở môi trường: tài khoản tạo ở việc 11 của [README.md](README.md)).
- **Đạt khi:** sức khoẻ trả `"ok":true`, `"env":"staging"`, `"vai":"dat"` và `commit` trùng commit của lượt Deploy; thư mã
  đăng nhập tới, đăng nhập vào được.
- **Đỏ thì:** không duyệt bản thật. Sức khoẻ sai — xem dòng `kiem-nhanh` ở mục «Đỏ thì làm gì»; không có thư — kiểm
  `MAIL_FROM`, `RESEND_API_KEY` của dự án bản thử và trạng thái Verified của tên miền ở Resend; trang lỗi — lùi bản thử
  theo [lui-ban.md](lui-ban.md) và báo người giữ kho mã.

### 4. Duyệt bản thật

- **Ở đâu:** trang của lượt Deploy trên GitHub; nút «Review deployments» hiện khi việc `production` chờ duyệt.
- **Gõ hay bấm:** Review deployments › đánh dấu `production` › Approve and deploy.
- **Đạt khi:** việc `production` chuyển sang chạy.
- **Đỏ thì:** không thấy nút — tài khoản đang dùng không phải người duyệt của môi trường `production` (việc 3 của README).
  Không muốn lên bản thật lúc này: bấm Reject; bản thật giữ nguyên.

### 5. Theo dõi bản thật

- **Ở đâu:** Actions › lượt Deploy › việc `production` › bước `make deploy ENV=production`.
- **Gõ hay bấm:** không gõ gì; đọc nhật ký.
- **Đạt khi:** đủ chín dòng `deploy production: cau-hinh đạt`, `ban-thu-truoc đạt`, `migration đạt`,
  `bien đạt`, `vai-dang-nhap đạt`, `dung đạt`, `kiem-nhanh đạt`, `gan-ten-mien đạt`, `kiem-nhanh-ten-mien đạt`, dòng cuối
  `deploy production: xong <commit>`.
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

Mọi bước đỏ trước `gan-ten-mien` kết thúc bằng `DỪNG ở <bước> — tên miền không đổi`: không cần lùi. Sửa nguyên nhân rồi
chạy lại từ bước 1 (Run workflow); migration đã áp thì lần sau bỏ qua.

Thường thì người dùng vẫn ở bản cũ và bản ấy chạy bình thường. **Trừ khi lượt này vừa xoay mật khẩu vai đăng nhập**
([xoay-khoa.md](xoay-khoa.md), bước 3). Khi ấy xem bước đỏ nằm ở đâu:

- Đỏ ở `bien` hay trước đó: mật khẩu chưa đổi, bản đang chạy không bị đụng.
- Đỏ ở `vai-dang-nhap`: mật khẩu chưa đổi, bản đang chạy không bị đụng. Nhưng bước `bien` vừa ghi mật khẩu mới vào biến
  của Vercel.
- Đỏ sau khi `vai-dang-nhap` đạt (`cach-ly`, `dung`, `kiem-nhanh`): cơ sở dữ liệu đã đổi sang mật khẩu mới, bản đang chạy
  còn giữ mật khẩu cũ nên **đã mất kết nối**. Coi như sự cố: sửa nguyên nhân và chạy lại ngay.

Khi lệnh còn đỏ, đừng bấm dựng lại (Redeploy) trên trang Vercel: biến của Vercel có thể đã mang mật khẩu mới mà cơ sở dữ
liệu chưa có, và bản dựng ấy sẽ không nối được.

| Bước                  | Dòng đỏ (lý do)                                                                               | Làm gì                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cau-hinh`            | `thiếu biến <tên>`                                                                            | Biến ấy chưa có ở môi trường GitHub tương ứng. Khoá: chủ kho chạy `make dat-khoa ENV=<env>` (việc 8 của README). Biến không bí mật: máy đặt (việc 3). Chạy lại.                                                                                                                                                                                                                                                     |
| `cau-hinh`            | `LOGIN_DB_PASSWORD phải là chữ và số, từ 24 ký tự` · `MIGRATE_DATABASE_URL không đọc được: …` | Khoá đặt tay sai khuôn. Chạy `make dat-khoa ENV=<env>` và dán lại chuỗi Session pooler; mật khẩu vai đăng nhập tự giữ thì sinh lại chỉ chữ và số.                                                                                                                                                                                                                                                                   |
| `cau-hinh`            | `cây chưa sạch` · `không phải một kho git`                                                    | Trên GitHub không xảy ra. Ở máy chủ kho: commit hay bỏ thay đổi; chỉ còn thư mục `.vercel/` thì xoá nó.                                                                                                                                                                                                                                                                                                             |
| `cau-hinh`            | `vercel.json: …`                                                                              | Ai đó đã đổi `vercel.json`. Không đưa bản lên; báo người giữ kho mã trả lại vùng `sin1` và tắt tự triển khai.                                                                                                                                                                                                                                                                                                       |
| `ban-thu-truoc`       | `bản thử chưa chạy <commit>`                                                                  | Đưa commit ấy lên bản thử trước (bước 1–3), rồi duyệt lại bản thật. `STAGING_APP_URL` sai cũng ra dòng này: kiểm biến ở môi trường `production`.                                                                                                                                                                                                                                                                    |
| `migration`           | `<tệp> xoá hay đổi tên bảng hoặc cột mà thiếu dòng «-- bo-sau:»`                              | Chưa áp gì. Báo người viết migration: tách thành bản sau, hoặc thêm dòng `-- bo-sau:` bằng một migration mới (không sửa tệp đã commit).                                                                                                                                                                                                                                                                             |
| `migration`           | `migrate.sh lỗi: …` · `không đọc được sổ migration`                                           | Mỗi tệp áp trong một giao dịch, tệp lỗi không để lại gì. Kiểm `MIGRATE_DATABASE_URL` (mật khẩu, chuỗi Session pooler) rồi báo người giữ kho mã với dòng lỗi.                                                                                                                                                                                                                                                        |
| `vai-dang-nhap`       | `không đặt được mật khẩu vai đăng nhập: role "quy_hang_login" does not exist`                 | Bước `migration` chưa áp tới migration tạo vai. Đọc lại dòng `migration` của cùng lượt; tên miền không đổi. Mật khẩu chưa đổi nên bản đang chạy không bị đụng; bước `bien` đã ghi mật khẩu mới vào biến của Vercel. Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                                                                                                                     |
| `vai-dang-nhap`       | `không đặt được mật khẩu vai đăng nhập: …` (dòng khác)                                        | Vai chủ không đổi được mật khẩu vai đăng nhập: kiểm `MIGRATE_DATABASE_URL` là chuỗi vai chủ `postgres`; báo người giữ kho mã kèm dòng ấy (giá trị đã che). Mật khẩu chưa đổi nên bản đang chạy không bị đụng; bước `bien` đã ghi mật khẩu mới vào biến của Vercel. Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                                                                      |
| `cach-ly`             | `vai anon co quyen tren: <bảng>` · `vai authenticated co quyen tren: <bảng>`                  | Data API của Supabase còn bật. Tắt nó (việc 2 của README); không tắt được thì trong SQL Editor của dự án bản thử chạy `revoke all on all tables in schema <lược đồ> from anon, authenticated;` cho từng lược đồ có bảng bị gọi tên, chạy lại.                                                                                                                                                                       |
| `cach-ly`             | vai đăng nhập không nối được                                                                  | Bước `vai-dang-nhap` vừa đặt mật khẩu nên lỗi này không còn ở lần đầu. Còn gặp: báo người giữ kho mã kèm dòng ấy.                                                                                                                                                                                                                                                                                                   |
| `cach-ly`             | dòng khác (`bang khong ep luat dong`, `vai dang nhap la chu`, `thay dong cua san khac`, …)    | Lỗi cách ly giữa các sàn (SP-1). Không đưa bản lên, không tự sửa trên cơ sở dữ liệu; báo người giữ kho mã kèm nguyên dòng.                                                                                                                                                                                                                                                                                          |
| `bien`                | `dự án Vercel đang có biến cấm <tên>`                                                         | Ai đó đặt tay một biến của máy dev trên Vercel. Máy xoá biến ấy khỏi dự án Vercel rồi chạy lại; tên miền không đổi. Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                                                                                                                                                                                                                     |
| `bien`                | `Vercel trả <mã>` · `Vercel không trả lời`                                                    | 401 hay 403: `VERCEL_TOKEN` hết hạn hay sai phạm vi — xoay theo [xoay-khoa.md](xoay-khoa.md). 404: `VERCEL_PROJECT_ID` hay `VERCEL_ORG_ID` trỏ nhầm dự án — máy sửa biến của môi trường GitHub. Mã khác: chạy lại; còn đỏ thì báo người giữ kho mã. Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                                                                                     |
| `bien`                | `Vercel từ chối ghi biến <tên> (<mã>)`                                                        | Bản chưa dựng, tên miền không đổi. Vercel nhận lệnh ghi nhưng không ghi biến được gọi tên, nên khoá mới (vd vừa xoay) chưa có hiệu lực. Không xoá hay sửa biến ấy trên Vercel: gửi nguyên dòng đỏ cho người giữ kho mã — mã lỗi trong ngoặc nói vì sao Vercel từ chối. Các biến khác có thể đã mang giá trị mới; đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                        |
| `bien`                | `Vercel không xác nhận đã ghi biến <tên>`                                                     | Bản chưa dựng, tên miền không đổi. Vercel trả thành công nhưng không xác nhận đã ghi các biến được gọi tên. Chạy lại một lần; còn đỏ thì gửi nguyên dòng đỏ cho người giữ kho mã — Vercel có thể đã đổi cách trả lời. Không xoá hay sửa biến trên Vercel. Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                                                                               |
| `bien`                | `Vercel trả danh sách biến không đúng khuôn`                                                  | Bản chưa dựng, tên miền không đổi, chưa ghi biến nào: lệnh không đọc được danh sách biến của dự án nên chưa kiểm được biến cấm. Chạy lại một lần; còn đỏ thì gửi nguyên dòng đỏ cho người giữ kho mã. Đừng bấm dựng lại trên Vercel trước khi lệnh này chạy xanh.                                                                                                                                                   |
| `dung`                | `vercel pull lỗi` · `vercel build lỗi` · `vercel deploy lỗi`                                  | Đọc nhật ký ngay phía trên dòng đỏ. Khoá hết hạn hay sai: xoay `VERCEL_TOKEN` theo [xoay-khoa.md](xoay-khoa.md). Lỗi dựng mã: báo người giữ kho mã.                                                                                                                                                                                                                                                                 |
| `kiem-nhanh`          | `vai nối chưa đạt: …` · `sức khoẻ ok khác true`                                               | Bản mới không nối được cơ sở dữ liệu bằng vai đăng nhập. `DATABASE_URL` của Vercel do bước `bien` đặt từ cùng mật khẩu bước `vai-dang-nhap` vừa đặt, nên hai bên không lệch: báo người giữ kho mã kèm dòng ấy.                                                                                                                                                                                                      |
| `kiem-nhanh`          | `sức khoẻ không trả lời` · `sức khoẻ trả <mã>, không phải JSON`                               | Bản mới không khởi động (thiếu hay sai biến: mở Vercel › dự án › Deployments › bản mới › Logs, dòng lỗi gọi tên biến) hoặc bảo vệ bản mới chặn lệnh kiểm: đặt `VERCEL_AUTOMATION_BYPASS_SECRET` (việc 7).                                                                                                                                                                                                           |
| `kiem-nhanh`          | `env là <x>, cần <y>`                                                                         | `APP_ENV` của dự án Vercel sai, hoặc `VERCEL_PROJECT_ID` của môi trường GitHub trỏ nhầm dự án. Sửa rồi chạy lại.                                                                                                                                                                                                                                                                                                    |
| `kiem-nhanh`          | `chạy commit <a>, cần <b>`                                                                    | Báo người giữ kho mã: bản dựng không mang đúng commit.                                                                                                                                                                                                                                                                                                                                                              |
| `kiem-nhanh`          | `/proto/x trả <mã>, cần 404`                                                                  | Lối thử của máy dev còn mở trên bản dựng. Không đưa bản lên; báo người giữ kho mã.                                                                                                                                                                                                                                                                                                                                  |
| `gan-ten-mien`        | `vercel promote lỗi`                                                                          | Tên miền chưa đổi. Kiểm `VERCEL_TOKEN` còn hạn và tên miền đã gắn vào đúng dự án (việc 9), chạy lại.                                                                                                                                                                                                                                                                                                                |
| `kiem-nhanh-ten-mien` | đỏ, rồi `đã lùi về bản trước`                                                                 | Lệnh đã tự trỏ tên miền về đúng bản tên miền trỏ tới ngay trước khi gắn, đọc lại tên miền thấy đúng bản ấy, và kiểm sức khoẻ đạt. Mở sức khoẻ của tên miền để chắc, rồi tìm nguyên nhân như dòng `kiem-nhanh` cùng lý do.                                                                                                                                                                                           |
| `kiem-nhanh-ten-mien` | đỏ, rồi `lùi bản DỪNG — …, không tự lùi; tên miền vẫn ở bản mới`                              | Lệnh không biết chắc bản nào giữ tên miền trước khi gắn (lần gắn đầu, Vercel không trả lời, hay tên miền đã ở chính bản mới), nên không lùi. Tên miền đang trỏ bản hỏng. Đọc danh sách in ngay dưới (`bản <id> · <url> · commit … · tạo …`), chọn bản đã chạy tốt gần nhất, gõ `make rollback ENV=<ENV> BAN=<id>` theo [lui-ban.md](lui-ban.md) bước 2–5. Lần gắn đầu không có bản cũ: sửa lỗi rồi đưa bản mới lên. |
| `kiem-nhanh-ten-mien` | đỏ, rồi `lùi bản ĐỎ — …`                                                                      | Lệnh đã thử lùi mà không chắc tên miền về đúng bản khoẻ (Vercel báo lỗi, tên miền chưa đổi, hay bản cũ cũng đỏ). Làm như dòng trên: chọn trong danh sách in ngay dưới, `make rollback ENV=<ENV> BAN=<id>`; vẫn đỏ thì Vercel › dự án › Deployments, chọn bản đã chạy tốt gần nhất, «Instant Rollback».                                                                                                              |

## Lần đầu ở một môi trường

Lần đầu chưa có thẻ phát hành nào, nên ở bước 1 chọn nhánh `main`. Lần đầu không còn dừng giữa chừng: bước
`bien` đặt biến của dự án Vercel ngay sau migration, rồi bước `vai-dang-nhap` đặt mật khẩu cho vai `quy_hang_login` mà
migration vừa tạo, trước khi dựng.

Cơ sở dữ liệu mới chưa có sàn hay người nào, nên chưa ai đăng nhập được và chưa ai gửi được thư mời. Khi bản thử đã xong
(lượt chờ duyệt `production`), làm việc 11 của [README.md](README.md) cho bản thử, rồi mới làm bước 3 «Nhìn bản thử» ở
trên, đăng nhập bằng địa chỉ thư vừa tạo. Bản thật: làm việc 11 cho bản thật sau khi bước 5 xong, rồi bước 6.

## Đưa bản lên từ máy chủ kho

Chỉ khi GitHub Actions không dùng được. Cần một máy có Node 24 (`node --version` in `v24.…`; tải ở nodejs.org, bản
24 LTS), `vercel` đúng bản tệp tự động triển khai dùng — gõ `npm install --global vercel@65.9.0`, đạt khi
`vercel --version` in `65.9.0` — và `psql` (gói `postgresql-client`); bản sao
kho sạch, đứng ở commit cần đưa lên; nạp các biến của môi trường ấy (bảng biến) từ tệp ngoài kho. Gõ
`make deploy ENV=staging`, đọc các dòng như bước 2; đạt thì `make deploy ENV=production`, đọc như bước 5. Cách đọc dòng đỏ
giống hệt mục trên. Tệp biến cần cả hai khoá `make dat-khoa` tự sinh, mà GitHub không cho xem lại: đặt
`LOGIN_DB_PASSWORD` mà chủ kho tự giữ (README, mục «Mật khẩu vai đăng nhập ở máy chủ kho»); `AUTH_SECRET`
thì đặt một chuỗi mới cho lượt ấy (`openssl rand -base64 48`) — lượt ấy đẩy nó sang Vercel, mã đăng nhập đang chờ hết
hiệu lực và người dùng xin mã lại.
