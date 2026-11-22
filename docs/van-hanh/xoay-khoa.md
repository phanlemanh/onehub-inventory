# Xoay khoá bí mật

Thay một khoá hay mật khẩu bằng cái mới ở mọi chỗ nó nằm, đưa lại bản để bản đang chạy dùng cái mới, rồi thu hồi cái cũ.
Luôn xoay ở bản thử trước, kiểm, rồi mới tới bản thật. Mục lục và bảng biến: [README.md](README.md).

Khoá chỉ nằm ở hai môi trường GitHub. Lệnh `make dat-khoa` đặt chúng; lệnh đưa bản lên tự đẩy phần ứng dụng cần sang dự
án Vercel và tự đặt mật khẩu vai đăng nhập vào cơ sở dữ liệu. Không ai sửa biến tay trên Vercel.

## Khi nào dùng

- Một khoá có thể đã lộ: dán nhầm vào chat, vào PR, vào nhật ký; máy hay tài khoản giữ khoá bị mất.
- Một người từng giữ khoá thôi làm.
- Tới hạn: `VERCEL_TOKEN` và `RELEASE_PLEASE_TOKEN` (hạn 1 năm) trước ngày hết hạn ghi ở lịch; các khoá khác mỗi năm
  một lần.

Khoá lộ thì làm ngay, kể cả ngoài giờ: thu hồi khoá cũ quan trọng hơn vài phút gián đoạn.

## Cần có trước

- Quyền quản trị ở dịch vụ của khoá (Vercel, Supabase, Resend) và quyền quản trị kho trên GitHub; `gh` đã đăng nhập trên
  máy của chủ kho (`gh auth status` báo Logged in).
- Giá trị mới không bao giờ dán vào kho, chat, issue hay PR: chỉ dán vào `make dat-khoa` khi lệnh hỏi.
- Bảng dưới: mỗi khoá tạo mới ở đâu và đặt bằng gì.

| Khoá                                                | Tạo mới ở đâu                                                                                                                                                                    | Đặt bằng                                                                                                      | Thu hồi cái cũ                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `AUTH_SECRET`                                       | Lệnh tự sinh                                                                                                                                                                     | `make dat-khoa ENV=<env> XOAY=1`; lần đưa bản kế đẩy sang Vercel                                              | Không cần: cái cũ hết dùng khi bản mới lên                  |
| `LOGIN_DB_PASSWORD` (mật khẩu vai `quy_hang_login`) | Lệnh tự sinh (cùng lượt `XOAY=1` với `AUTH_SECRET`)                                                                                                                              | `make dat-khoa ENV=<env> XOAY=1`; lần đưa bản kế đặt vào cơ sở dữ liệu và vào Vercel                          | Bước `vai-dang-nhap` của lần đưa bản kế làm cái cũ hết dùng |
| `RESEND_API_KEY`                                    | Resend › API Keys › Create, quyền Sending access                                                                                                                                 | `make dat-khoa ENV=<env>`, dán khi lệnh hỏi                                                                   | Resend › API Keys › khoá cũ › Revoke                        |
| `VERCEL_TOKEN`                                      | Vercel › Account Settings › Tokens › Create, phạm vi nhóm, hạn 1 năm                                                                                                             | `make dat-khoa` (cả hai môi trường cùng lúc)                                                                  | Vercel › Tokens › khoá cũ › Delete                          |
| `VERCEL_AUTOMATION_BYPASS_SECRET`                   | Vercel › dự án › Settings › Deployment Protection › Protection Bypass for Automation › tạo mới                                                                                   | `make dat-khoa ENV=<env>`                                                                                     | Cùng trang, xoá chuỗi cũ                                    |
| Mật khẩu vai chủ (`postgres`)                       | Supabase › Project Settings › Database › Reset database password                                                                                                                 | `make dat-khoa ENV=<env>`, dán chuỗi Session pooler còn `[YOUR-PASSWORD]` rồi mật khẩu mới                    | Đặt lại mật khẩu làm cái cũ hết dùng                        |
| `RELEASE_PLEASE_TOKEN`                              | GitHub › ảnh đại diện › Settings › Developer settings › Personal access tokens › Fine-grained tokens › Generate new token, đúng kho và ba quyền như việc 9 của README, hạn 1 năm | Trang kho › Settings › Secrets and variables › Actions › Repository secrets › `RELEASE_PLEASE_TOKEN` › Update | Fine-grained tokens › khoá cũ › Delete                      |

`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `APP_URL`, `STAGING_APP_URL`, `MAIL_FROM` không phải khoá bí mật, không cần xoay; máy
đặt chúng ở môi trường GitHub. `DATABASE_URL` và `APP_ENV` ở Vercel do lệnh đưa bản lên đặt.

**Khoá dùng chung hai môi trường** — `VERCEL_TOKEN`:

- `make dat-khoa` (không `ENV`) hỏi nó một lần và đặt ở cả hai môi trường. Không tạo khoá thứ hai cho bản thật.
- Đưa lại bản (bước 4) cho bản thử, kiểm (bước 5), rồi duyệt `production` trong cùng lượt Deploy và kiểm bản thật.
- Chỉ thu hồi khoá cũ (bước 6) sau khi **cả hai** môi trường đã đưa lại bản xanh và kiểm đạt.

**`RELEASE_PLEASE_TOKEN`** (khoá của kho, chỉ việc «Release» dùng): làm bước 1 và 2 theo dòng của nó trong bảng, bỏ qua
bước 3–5 (không cần đưa lại bản). Kiểm: ở lần gộp kế tiếp vào `main`, Actions › Release xanh và PR
`chore(main): release` có các bước kiểm chạy. Đạt thì làm bước 6; đỏ thì đọc dòng «Đỏ thì» ở việc 9 của README.

## Các bước

Làm một khoá một lần. Khoá riêng của từng môi trường: ở bản thử trước (bước 1–6), rồi lặp lại cho bản thật. Khoá dùng
chung (`VERCEL_TOKEN`): bước 1–2 một lần cho cả hai, bước 4–5 ở bản thử rồi bản thật, bước 6 sau cùng.

### 1. Tạo khoá mới

- **Ở đâu:** cột «Tạo mới ở đâu» của bảng trên. Hai khoá lệnh tự sinh thì bỏ qua bước này.
- **Gõ hay bấm:** tạo khoá ở trang của dịch vụ; để trang mở cho tới bước 2.
- **Đạt khi:** trang dịch vụ hiện khoá mới; khoá cũ vẫn còn hiệu lực.
- **Đỏ thì:** không có quyền tạo — người có quyền quản trị dịch vụ ấy làm bước này.

### 2. Đặt khoá mới bằng `make dat-khoa`

- **Ở đâu:** máy của chủ kho, trong bản sao của kho.
- **Gõ hay bấm:** `make dat-khoa ENV=<env>`, dán khoá mới khi lệnh hỏi đúng tên khoá ấy, Enter ở mọi câu khác để giữ khoá
  đang có. Xoay `AUTH_SECRET` và `LOGIN_DB_PASSWORD`: `make dat-khoa ENV=<env> XOAY=1`, Enter ở mọi câu.
- **Đạt khi:** lệnh in `dat-khoa <env>: đặt <tên>` (hay `sinh <tên>`) cho khoá vừa xoay, `giữ <tên>` cho các khoá khác, và
  `dat-khoa <env>: xong`.
- **Đỏ thì:** lệnh in `dat-khoa: <lý do>` và chưa đặt khoá nào — sửa đúng chỗ dòng ấy gọi tên rồi chạy lại; dòng `lỗi khi
đặt <tên>` — chạy lại, Enter để giữ các khoá đã đặt.

### 3. Riêng hai mật khẩu cơ sở dữ liệu

- **Ở đâu:** mật khẩu vai chủ — Supabase › Project Settings › Database › Reset database password, làm trước bước 2. Mật
  khẩu vai đăng nhập — không làm tay: bước `vai-dang-nhap` của lần đưa bản kế đặt nó vào cơ sở dữ liệu.
- **Gõ hay bấm:** vai chủ — đặt lại mật khẩu, rồi bước 2 với chuỗi Session pooler còn `[YOUR-PASSWORD]` và mật khẩu mới.
- **Đạt khi:** Supabase báo đã lưu; bước 2 in `đặt MIGRATE_DATABASE_URL`. Đổi mật khẩu vai chủ không làm bản đang chạy
  mất kết nối: ứng dụng nối bằng vai đăng nhập.
- **Đỏ thì:** xoay mật khẩu vai đăng nhập có một khoảng hở. Từ lúc bước `vai-dang-nhap` đạt tới bước `gan-ten-mien` của
  lần đưa bản kế (vài phút), bản đang chạy còn giữ mật khẩu cũ nên không nối được cơ sở dữ liệu. Lần đưa bản ấy mà đỏ
  giữa hai bước thì bản đang chạy hỏng tới khi một lần đưa bản xanh. Bước `bien` chạy trước `vai-dang-nhap`, nên lỗi của
  Vercel ở bước ấy không mở khoảng hở; bước `vai-dang-nhap` đỏ thì mật khẩu chưa đổi. Bảng «Đỏ thì làm gì» của
  [dua-ban-len.md](dua-ban-len.md) nói từng vùng. Nên xoay mật khẩu vai đăng nhập lúc vắng người dùng, hoặc ngay nếu khoá
  lộ, và sửa nguyên nhân đỏ trước khi lùi bản.

### 4. Đưa lại bản

- **Ở đâu:** GitHub › Actions › Deploy › Run workflow.
- **Gõ hay bấm:** ô «Use workflow from» chọn thẻ phát hành đang chạy (không chọn `main`, để không đưa lên commit chưa phát
  hành); bấm Run workflow. Duyệt `production` chỉ khi đang xoay khoá của bản thật hay khoá dùng chung. Đang chỉ xoay
  bản thử: khi việc `staging` xong và lượt hiện nút «Review deployments», bấm Review deployments › đánh dấu
  `production` › Reject — bản thật giữ nguyên, lượt kết thúc.
- **Đạt khi:** việc của môi trường ấy in `deploy <ENV>: xong <commit>` như [dua-ban-len.md](dua-ban-len.md). Lượt này dùng
  mọi khoá mới: `VERCEL_TOKEN` (gọi Vercel), mật khẩu vai chủ (bước `migration`), mật khẩu vai đăng nhập (bước
  `vai-dang-nhap`, rồi `cach-ly`, `kiem-nhanh`), `AUTH_SECRET` và `RESEND_API_KEY` (bước `bien` đẩy sang Vercel, bản dựng
  mới khởi động với chúng).
- **Đỏ thì:** đọc dòng đỏ theo bảng của [dua-ban-len.md](dua-ban-len.md). Đỏ do khoá mới sai: làm lại bước 2 rồi chạy
  lại. Khoá cũ chưa bị thu hồi nên, trừ mật khẩu vai đăng nhập (bước 3), bản đang chạy không bị ảnh hưởng.

### 5. Kiểm bằng mắt

- **Ở đâu:** trình duyệt, `<APP_URL>/api/v1/health` của môi trường, rồi trang đăng nhập.
- **Gõ hay bấm:** mở sức khoẻ; xin mã đăng nhập cho chính mình và đăng nhập.
- **Đạt khi:** `"ok":true`, `"vai":"dat"`; thư mã tới (kiểm `RESEND_API_KEY`); đăng nhập được (kiểm `AUTH_SECRET`). Mã đã
  gửi trước lúc xoay `AUTH_SECRET` không dùng được nữa — xin mã mới là đúng.
- **Đỏ thì:** không có thư — khoá Resend mới thiếu quyền Sending access hay đặt nhầm môi trường; sức khoẻ `vai` chưa đạt —
  báo người giữ kho mã kèm dòng `kiem-nhanh` của lượt Deploy.

### 6. Thu hồi khoá cũ

Khoá riêng: làm ngay sau bước 5 của môi trường ấy. Khoá dùng chung (`VERCEL_TOKEN`): chỉ làm khi bước 4 và 5 đã đạt ở
**cả** bản thử **và** bản thật.

- **Ở đâu:** cột «Thu hồi cái cũ» của bảng.
- **Gõ hay bấm:** xoá hay Revoke khoá cũ.
- **Đạt khi:** dịch vụ không còn liệt kê khoá cũ.
- **Đỏ thì:** xoá nhầm khoá mới — tạo lại từ bước 1. Sau khi thu hồi mà lệnh nào đó đỏ, đó là chỗ còn giữ khoá cũ: thêm
  chỗ ấy vào bảng trên trong PR kế tiếp.

## Đỏ thì làm gì

- Một bước đỏ mà chưa thu hồi khoá cũ: chạy lại bước 2 với giá trị cũ là bản trở lại như trước (trừ mật khẩu vai đăng
  nhập đã đặt vào cơ sở dữ liệu: đưa lại bản cho xanh để Vercel nhận mật khẩu mới).
- Bản không nối được cơ sở dữ liệu sau khi xoay mật khẩu vai đăng nhập và lần đưa bản đỏ: đừng lùi bản — bản cũ cũng
  dùng mật khẩu cũ. Sửa nguyên nhân đỏ rồi chạy lại bước 4.
- Khoá lộ mà không tạo được khoá mới (mất quyền quản trị): thu hồi khoá lộ trước, chấp nhận gián đoạn, rồi xin lại quyền.
- Sau khi xong, ghi một mục sổ wiki bằng `make log m="<khoá nào, môi trường nào>"` (lệnh tự thêm ngày) — không ghi giá trị.
  Đừng sửa tay `wiki/log.md`: tệp ấy vẽ ra từ `wiki/log/`.
