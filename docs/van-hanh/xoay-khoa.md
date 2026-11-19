# Xoay khoá bí mật

Thay một khoá hay mật khẩu bằng cái mới ở mọi chỗ nó nằm, đưa lại bản để bản đang chạy dùng cái mới, rồi thu hồi cái cũ.
Luôn xoay ở bản thử trước, kiểm, rồi mới tới bản thật. Mục lục và bảng biến: [README.md](README.md).

## Khi nào dùng

- Một khoá có thể đã lộ: dán nhầm vào chat, vào PR, vào nhật ký; máy hay tài khoản giữ khoá bị mất.
- Một người từng giữ khoá thôi làm.
- Tới hạn: `VERCEL_TOKEN` và `RELEASE_PLEASE_TOKEN` (hạn 1 năm) trước ngày hết hạn ghi ở lịch; các khoá khác mỗi năm
  một lần.

Khoá lộ thì làm ngay, kể cả ngoài giờ: thu hồi khoá cũ quan trọng hơn vài phút gián đoạn.

## Cần có trước

- Quyền quản trị ở dịch vụ của khoá (Vercel, Supabase, Resend) và quyền sửa môi trường GitHub của kho
  (với `RELEASE_PLEASE_TOKEN`: quyền sửa khoá của kho).
- Trình giữ mật khẩu để cất giá trị mới. Giá trị mới không bao giờ dán vào kho, chat, issue hay PR.
- Bảng dưới: mỗi khoá nằm ở đâu. Thiếu một chỗ là bản dựng hay lệnh đưa bản lên đỏ ở lần kế.

| Khoá                                    | Tạo mới ở đâu                                                                                                                                                                     | Đặt ở những chỗ nào                                                                                                                    | Thu hồi cái cũ                                 |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `AUTH_SECRET`                           | Máy chủ kho: `openssl rand -base64 48`                                                                                                                                            | Vercel, dự án của môi trường                                                                                                           | Không cần: cái cũ hết dùng khi bản mới lên     |
| `RESEND_API_KEY`                        | Resend › API Keys › Create, quyền Sending access                                                                                                                                  | Vercel, dự án của môi trường                                                                                                           | Resend › API Keys › khoá cũ › Revoke           |
| `VERCEL_TOKEN`                          | Vercel › Account Settings › Tokens › Create, phạm vi nhóm, hạn 1 năm                                                                                                              | GitHub, khoá của cả hai môi trường; tệp biến ở máy chủ kho                                                                             | Vercel › Tokens › khoá cũ › Delete             |
| `VERCEL_AUTOMATION_BYPASS_SECRET`       | Vercel › dự án › Settings › Deployment Protection › Protection Bypass for Automation › tạo mới                                                                                    | GitHub, khoá của môi trường ấy; tệp biến ở máy chủ kho                                                                                 | Cùng trang, xoá chuỗi cũ                       |
| Mật khẩu vai đăng nhập `quy_hang_login` | Trình giữ mật khẩu sinh một chuỗi dài                                                                                                                                             | `DATABASE_URL` ở Vercel; `LOGIN_DATABASE_URL` ở GitHub (bản thử) và máy chủ kho; `KHOI_PHUC_LOGIN_URL` nếu thử khôi phục trên dự án ấy | Lệnh đổi mật khẩu ở bước 3 làm cái cũ hết dùng |
| Mật khẩu vai chủ (`postgres`)           | Supabase › Project Settings › Database › Reset database password                                                                                                                  | `MIGRATE_DATABASE_URL` ở GitHub và máy chủ kho; `KHOI_PHUC_ADMIN_URL` nếu thử khôi phục trên dự án ấy                                  | Đặt lại mật khẩu làm cái cũ hết dùng           |
| `RELEASE_PLEASE_TOKEN`                  | GitHub › ảnh đại diện › Settings › Developer settings › Personal access tokens › Fine-grained tokens › Generate new token, đúng kho và ba quyền như việc 11 của README, hạn 1 năm | GitHub, khoá của kho: trang kho › Settings › Secrets and variables › Actions › Repository secrets › `RELEASE_PLEASE_TOKEN` › Update    | Fine-grained tokens › khoá cũ › Delete         |

`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `APP_URL`, `STAGING_APP_URL`, `MAIL_FROM`, `APP_ENV` không phải khoá bí mật, không
cần xoay (`VERCEL_ORG_ID` dùng chung hai môi trường nhưng chỉ là mã nhóm).

**Khoá dùng chung hai môi trường** — `VERCEL_TOKEN` (một khoá cho cả `staging` lẫn `production` và máy chủ kho):

- Tạo khoá mới **một lần** (bước 1), đặt ngay ở mọi chỗ của cả hai môi trường (bước 2). Không tạo khoá thứ hai cho bản
  thật.
- Đưa lại bản (bước 4) cho bản thử, kiểm (bước 5), rồi duyệt `production` trong cùng lượt Deploy và kiểm bản thật.
- Chỉ thu hồi khoá cũ (bước 6) sau khi **cả hai** môi trường đã đưa lại bản xanh và kiểm đạt. Thu hồi sớm hơn thì môi
  trường chưa đưa lại sẽ đỏ ở lần đưa bản hay lùi bản kế tiếp.

**`RELEASE_PLEASE_TOKEN`** (khoá của kho, chỉ việc «Release» dùng): làm bước 1 và 2 theo dòng của nó trong bảng, bỏ qua
bước 3–5 (không cần đưa lại bản). Kiểm: ở lần gộp kế tiếp vào `main`, Actions › Release xanh và PR
`chore(main): release` có các bước kiểm chạy. Đạt thì làm bước 6; đỏ thì đọc dòng «Đỏ thì» ở việc 11 của README.

## Các bước

Làm một khoá một lần. Khoá riêng của từng môi trường: ở bản thử trước (bước 1–6), rồi lặp lại cho bản thật. Khoá dùng
chung (`VERCEL_TOKEN`): bước 1–2 một lần cho cả hai, bước 4–5 ở bản thử rồi bản thật, bước 6 sau cùng — xem đoạn «Khoá
dùng chung hai môi trường» ở trên.

### 1. Tạo khoá mới

- **Ở đâu:** cột «Tạo mới ở đâu» của bảng trên. Hai mật khẩu cơ sở dữ liệu: xem bước 3 trước khi làm gì.
- **Gõ hay bấm:** tạo khoá; chép ngay vào trình giữ mật khẩu, ghi tên khoá, môi trường và ngày.
- **Đạt khi:** trình giữ mật khẩu có giá trị mới; khoá cũ vẫn còn hiệu lực.
- **Đỏ thì:** không có quyền tạo — người có quyền quản trị dịch vụ ấy làm bước này.

### 2. Đặt khoá mới ở mọi chỗ

- **Ở đâu:** cột «Đặt ở những chỗ nào». Vercel: dự án › Settings › Environment Variables › biến › Edit, môi trường
  Production. GitHub: trang kho › Settings › Environments › môi trường › Environment secrets › biến › Update. Máy chủ kho:
  tệp biến ngoài kho.
- **Gõ hay bấm:** dán giá trị mới, lưu. Với chuỗi nối cơ sở dữ liệu, chỉ thay phần mật khẩu, giữ nguyên tên người dùng,
  máy chủ, cổng.
- **Đạt khi:** mọi chỗ của dòng bảng đã có giá trị mới (Vercel ghi «Updated just now»; GitHub ghi giờ cập nhật mới).
- **Đỏ thì:** quên một chỗ thì bước 4 hay lần đưa bản kế đỏ, gọi tên biến; quay lại bước này.

### 3. Riêng mật khẩu cơ sở dữ liệu: đổi trên Supabase

- **Ở đâu:** Supabase › dự án của môi trường. Vai đăng nhập: SQL Editor. Vai chủ: Project Settings › Database › Reset
  database password.
- **Gõ hay bấm:** vai đăng nhập — `alter role quy_hang_login password '<mật khẩu mới>';` rồi Run. Vai chủ — dán mật khẩu
  mới của bước 1, lưu.
- **Đạt khi:** Supabase báo đã lưu. Từ lúc này mật khẩu cũ hết dùng: với vai đăng nhập, bản đang chạy không nối được cơ sở
  dữ liệu cho tới khi bước 4 xong (vài phút) — làm lúc vắng người dùng, hoặc ngay nếu khoá lộ.
- **Mật khẩu chỉ gồm chữ cái a–z, A–Z và chữ số 0–9, dài ít nhất 32 ký tự** — cho cả hai vai. Vì mật khẩu nằm giữa chuỗi
  nối `postgres://<vai>:<mật khẩu>@<máy>`, các ký tự như `@ : / ? # % '` làm hỏng chuỗi hay câu lệnh. Bộ sinh của
  Supabase (Generate a password) có thể ra ký tự đặc biệt: đừng dùng nó, dán mật khẩu tự sinh trong trình giữ mật khẩu với
  tuỳ chọn «chỉ chữ và số».
- **Đỏ thì:** báo lỗi cú pháp — kiểm dấu nháy đơn quanh mật khẩu; nếu sau bước 4 bản không nối được cơ sở dữ liệu với lỗi
  «invalid port», «password authentication failed» hay chuỗi nối bị cắt — mật khẩu có ký tự đặc biệt: sinh lại mật khẩu
  chỉ chữ và số, làm lại bước 1–4.

### 4. Đưa lại bản

- **Ở đâu:** GitHub › Actions › Deploy › Run workflow.
- **Gõ hay bấm:** ô «Use workflow from» chọn thẻ phát hành đang chạy (không chọn `main`, để không đưa lên commit chưa phát
  hành); bấm Run workflow. Duyệt `production` chỉ khi đang xoay khoá của bản thật hay khoá dùng chung. Đang chỉ xoay
  bản thử: khi việc `staging` xong và lượt hiện nút «Review deployments», bấm Review deployments › đánh dấu
  `production` › Reject — bản thật giữ nguyên, lượt kết thúc.
- **Đạt khi:** việc của môi trường ấy in `deploy <ENV>: xong <commit>` như [dua-ban-len.md](dua-ban-len.md). Lượt này dùng
  mọi khoá mới: `VERCEL_TOKEN` (gọi Vercel), mật khẩu vai chủ (bước `migration`), vai đăng nhập (`cach-ly`, `kiem-nhanh`),
  `AUTH_SECRET` và `RESEND_API_KEY` (bản dựng mới khởi động với chúng).
- **Đỏ thì:** đọc dòng đỏ theo bảng của [dua-ban-len.md](dua-ban-len.md). Đỏ do khoá mới sai: sửa ở bước 2 rồi chạy lại.
  Khoá cũ chưa bị thu hồi nên, trừ hai mật khẩu cơ sở dữ liệu, bản đang chạy không bị ảnh hưởng.

### 5. Kiểm bằng mắt

- **Ở đâu:** trình duyệt, `<APP_URL>/api/v1/health` của môi trường, rồi trang đăng nhập.
- **Gõ hay bấm:** mở sức khoẻ; xin mã đăng nhập cho chính mình và đăng nhập.
- **Đạt khi:** `"ok":true`, `"vai":"dat"`; thư mã tới (kiểm `RESEND_API_KEY`); đăng nhập được (kiểm `AUTH_SECRET`). Mã đã
  gửi trước lúc xoay `AUTH_SECRET` không dùng được nữa — xin mã mới là đúng.
- **Đỏ thì:** không có thư — khoá Resend mới thiếu quyền Sending access hay đặt nhầm dự án; sức khoẻ `vai` chưa đạt — mật
  khẩu trong `DATABASE_URL` khác mật khẩu đã đặt ở bước 3. Sửa rồi làm lại bước 4.

### 6. Thu hồi khoá cũ

Khoá riêng: làm ngay sau bước 5 của môi trường ấy. Khoá dùng chung (`VERCEL_TOKEN`): chỉ làm khi bước 4 và 5 đã đạt ở
**cả** bản thử **và** bản thật.

- **Ở đâu:** cột «Thu hồi cái cũ» của bảng.
- **Gõ hay bấm:** xoá hay Revoke khoá cũ; xoá giá trị cũ khỏi trình giữ mật khẩu.
- **Đạt khi:** dịch vụ không còn liệt kê khoá cũ.
- **Đỏ thì:** xoá nhầm khoá mới — tạo lại từ bước 1. Sau khi thu hồi mà lệnh nào đó đỏ, đó là chỗ còn giữ khoá cũ bị bỏ
  sót ở bước 2: thêm chỗ ấy vào bảng trên trong PR kế tiếp.

## Đỏ thì làm gì

- Một bước đỏ mà chưa thu hồi khoá cũ: đặt lại giá trị cũ ở chỗ vừa sửa là bản trở lại như trước (trừ hai mật khẩu cơ sở
  dữ liệu, vốn đã đổi ở bước 3: sửa cho chuỗi nối trùng mật khẩu mới).
- Bản thật không nối được cơ sở dữ liệu sau bước 3 và bước 4 đỏ: đừng lùi bản — bản cũ cũng dùng mật khẩu cũ. Sửa
  `DATABASE_URL` ở Vercel cho đúng mật khẩu mới, rồi chạy lại bước 4.
- Khoá lộ mà không tạo được khoá mới (mất quyền quản trị): thu hồi khoá lộ trước, chấp nhận gián đoạn, rồi xin lại quyền.
- Sau khi xong, ghi một mục sổ wiki bằng `make log m="<khoá nào, môi trường nào>"` (lệnh tự thêm ngày) — không ghi giá trị.
  Đừng sửa tay `wiki/log.md`: tệp ấy vẽ ra từ `wiki/log/`.
