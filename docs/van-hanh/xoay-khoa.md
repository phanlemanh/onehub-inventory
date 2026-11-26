# Xoay khoá bí mật

> **Đã xoay mật khẩu vai đăng nhập?** Mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» ở dưới thắng mọi câu khác của
> sổ này về lùi bản và về việc bản đang chạy có yên không. Đọc nó trước khi lùi bản, và khi một lượt đưa bản lên đỏ lúc
> vừa xoay.

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
- **Đỏ thì:** xoay mật khẩu vai đăng nhập có một khoảng hở. Từ lúc bước `vai-dang-nhap` đạt tới khi lần đưa bản kế chạy
  xanh trọn (vài phút), bản đang chạy chưa có mật khẩu mới nên không nối được cơ sở dữ liệu. Bước `bien` chạy trước
  `vai-dang-nhap`, nên lỗi của Vercel ở bước ấy không mở khoảng hở; bước `vai-dang-nhap` đỏ thì mật khẩu chưa đổi. Nên
  xoay mật khẩu vai đăng nhập lúc vắng người dùng, hoặc ngay nếu khoá lộ. Lần đưa bản ấy đỏ, hay về sau cần lùi bản: đọc
  mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» ở dưới trước khi lùi.

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
  lại. Khoá cũ chưa bị thu hồi nên, trừ mật khẩu vai đăng nhập (bước 3), bản đang chạy không bị ảnh hưởng; lùi bản sau
  khi xoay mật khẩu vai đăng nhập thì theo mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» ở dưới.

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

## Lùi bản sau khi xoay mật khẩu vai đăng nhập

Đây là chỗ duy nhất nói về lùi bản sau khi xoay mật khẩu vai đăng nhập; đầu mỗi sổ vận hành có một dòng chặn trỏ về đây.

**Luật.** Mỗi bản trên Vercel giữ mật khẩu vai đăng nhập của lúc nó được dựng (bước `dung`). Từ khi một lượt đưa bản lên
in `vai-dang-nhap đạt` với mật khẩu mới, cơ sở dữ liệu chỉ nhận mật khẩu mới. Mọi bản dựng trước lượt ấy giữ mật khẩu cũ
nên không nối được cơ sở dữ liệu nữa — mãi, không riêng mấy phút của lượt ấy, kể cả nhiều ngày sau một lượt xanh. Lùi về
một bản như thế, bằng đường nào cũng vậy (lệnh tự lùi, `make rollback`, Instant Rollback trên trang Vercel), không khôi
phục kết nối. Chỉ bản dựng ở bước `dung` của lượt xoay hay của một lượt sau nó mới nối được.

**Thước.** Sức khoẻ `<APP_URL>/api/v1/health` trả `"vai":"dat"` là bản đang giữ tên miền nối được cơ sở dữ liệu. Kiểm
nhanh của `make deploy` và `make rollback` đọc đúng trường ấy.

**Buộc phải lùi thì chọn bản nào.**

1. Tìm giờ lượt xoay: GitHub › Actions › Deploy, lượt đầu tiên chạy sau `make dat-khoa ENV=<env> XOAY=1` (hay sau khi
   chủ kho đặt mật khẩu tự giữ, mục «Mật khẩu vai đăng nhập ở máy chủ kho» của [README.md](README.md)) mà nhật ký có
   `vai-dang-nhap đạt`. Mục sổ wiki ghi lúc xoay (mục «Đỏ thì làm gì» dưới) cũng có ngày.
2. `make rollback ENV=<ENV>`, không kèm `BAN`, in mỗi bản một dòng `bản <id> · <url> · commit … · tạo <giờ UTC>`. Chỉ
   chọn bản tạo sau giờ lượt xoay.
3. Không có bản nào như thế ngoài bản hỏng: đừng lùi. Sửa nguyên nhân rồi đưa bản sửa lên; một lượt `make deploy` xanh
   trọn là đường ra.

**Dòng của lệnh lúc vừa xoay.** Mật khẩu chỉ đổi ở lượt đầu tiên in `vai-dang-nhap đạt` với mật khẩu mới (lượt xoay).
Bảng gọi lượt ấy và mọi lượt trước nó, kể từ khi mật khẩu mới được đặt ở GitHub, là «trước khi đổi mật khẩu»; mọi lượt sau
nó, tới lượt đầu tiên in `xong <commit>`, là «lượt chạy lại». Một lượt đỏ ở `bien` hay trước đó, hay ở `vai-dang-nhap`,
chưa đổi mật khẩu, nên nó là «trước khi đổi mật khẩu» nếu chưa lượt nào in `vai-dang-nhap đạt`.

| Dòng                                                                                                                                                                                                                    | Bản đang giữ tên miền                                                                                                                                                                                                                                                                           | Làm gì                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cau-hinh`, `ban-thu-truoc`, `migration` hay `bien` ĐỎ, rồi `DỪNG ở <bước> — tên miền không đổi`                                                                                                                        | Trước khi đổi mật khẩu: mật khẩu chưa đổi, bản đang chạy yên. Lượt chạy lại: mật khẩu đã đổi từ lượt trước, bản đang chạy đã mất kết nối, trừ khi sức khoẻ còn `"vai":"dat"`.                                                                                                                   | Sửa theo dòng của bước ấy trong bảng «Đỏ thì làm gì» của [dua-ban-len.md](dua-ban-len.md), chạy lại. Đừng lùi.                                        |
| `vai-dang-nhap` ĐỎ, rồi `DỪNG ở vai-dang-nhap — tên miền không đổi`                                                                                                                                                     | Lượt này không đổi mật khẩu: như dòng trên. Bước `bien` đã ghi mật khẩu mới vào biến của Vercel.                                                                                                                                                                                                | Đừng bấm dựng lại trên Vercel trước khi lệnh chạy xanh. Sửa, chạy lại.                                                                                |
| `cach-ly`, `dung`, `kiem-nhanh` hay `gan-ten-mien` ĐỎ sau `vai-dang-nhap đạt`, rồi `DỪNG ở <bước> — tên miền không đổi`                                                                                                 | Tên miền vẫn ở bản dựng trước lượt xoay: đã mất kết nối từ lúc `vai-dang-nhap đạt`.                                                                                                                                                                                                             | Coi như sự cố: đừng lùi; sửa nguyên nhân và chạy lại `make deploy` ngay.                                                                              |
| `kiem-nhanh-ten-mien ĐỎ`, rồi `đã lùi về bản trước`                                                                                                                                                                     | Lệnh chỉ in dòng này khi bản trước vừa qua kiểm nhanh, kể cả `"vai":"dat"`: lúc kiểm, nó nối được. Sau khi xoay, điều ấy chỉ xảy ra khi bản trước cũng dựng từ lượt xoay trở đi (một lượt chạy lại đã gắn tên miền).                                                                            | Mở sức khoẻ để chắc; `vai` chưa đạt thì làm như dòng `lùi bản ĐỎ — tên miền đã về bản` dưới. Rồi tìm nguyên nhân đỏ như dòng `kiem-nhanh` cùng lý do. |
| `kiem-nhanh-ten-mien ĐỎ`, rồi `lùi bản DỪNG — không đọc được bản tên miền trỏ tới trước khi gắn`, `lùi bản DỪNG — không đọc được mã bản mới` hay `lùi bản DỪNG — trước khi gắn, tên miền đã trỏ vào chính bản mới <id>` | Lệnh không lùi: tên miền vẫn ở bản mới của lượt này, dựng sau bước `bien` nên mang mật khẩu mới — không mất kết nối vì mật khẩu. Lý do đỏ nằm ở dòng `kiem-nhanh-ten-mien ĐỎ` ngay trên.                                                                                                        | Đừng chọn bản trong danh sách in kèm, trừ bản tạo sau giờ lượt xoay. Sửa nguyên nhân, chạy lại.                                                       |
| `kiem-nhanh-ten-mien ĐỎ`, rồi `lùi bản ĐỎ — vercel rollback lỗi` hay `lùi bản ĐỎ — tên miền chưa về bản <id>`                                                                                                           | Không chắc tên miền đang ở bản nào.                                                                                                                                                                                                                                                             | Mở sức khoẻ: `"vai":"dat"` là đang nối được. Đừng lùi tay về bản dựng trước lượt xoay; sửa nguyên nhân, chạy lại.                                     |
| `lùi bản ĐỎ — không đọc được danh sách bản của Vercel` (dòng phụ)                                                                                                                                                       | Lệnh in dòng này ngay sau một dòng `lùi bản …` khác, khi không đọc được danh sách bản để in kèm. Tên miền ở đâu là theo dòng đứng trước nó: sau một dòng `lùi bản DỪNG` thì ở bản mới; sau `lùi bản ĐỎ — tên miền đã về bản` thì ở bản trước; sau hai dòng `lùi bản ĐỎ` còn lại thì không chắc. | Làm theo hàng của dòng đứng trước nó.                                                                                                                 |
| `kiem-nhanh-ten-mien ĐỎ`, rồi `lùi bản ĐỎ — tên miền đã về bản <id> nhưng kiểm nhanh đỏ: <lý do>`                                                                                                                       | Lệnh tự lùi đã chuyển tên miền khỏi bản mới còn nối được, về bản dựng trước lượt xoay: mất kết nối, lý do là `sức khoẻ ok khác true (vai: …)`. Đây là dòng hay gặp nhất khi lượt xoay đỏ ở bước cuối.                                                                                           | Coi như sự cố: đừng lùi tiếp; sửa nguyên nhân của dòng `kiem-nhanh-ten-mien ĐỎ` đầu tiên và chạy lại `make deploy` ngay.                              |
| `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — sức khoẻ ok khác true (vai: …)` (của `make rollback`)                                                                                                                         | Bản vừa chọn dựng trước lượt xoay; tên miền đang ở nó, mất kết nối.                                                                                                                                                                                                                             | Đừng thử bản cũ hơn: bản nào cũng vậy. Chọn bản tạo sau giờ lượt xoay; không có thì đưa bản sửa lên.                                                  |
| Instant Rollback trên trang Vercel                                                                                                                                                                                      | Không kiểm gì: bản dựng trước lượt xoay không nối được.                                                                                                                                                                                                                                         | Chỉ chọn bản tạo sau giờ lượt xoay.                                                                                                                   |

## Đỏ thì làm gì

- Một bước đỏ mà chưa thu hồi khoá cũ: chạy lại bước 2 với giá trị cũ là bản trở lại như trước (trừ mật khẩu vai đăng
  nhập đã đặt vào cơ sở dữ liệu: đưa lại bản cho xanh để Vercel nhận mật khẩu mới).
- Lần đưa bản đỏ sau khi xoay mật khẩu vai đăng nhập: đừng lùi bản trước khi đọc mục «Lùi bản sau khi xoay mật khẩu vai
  đăng nhập» ở trên; thường là sửa nguyên nhân đỏ rồi chạy lại bước 4.
- Khoá lộ mà không tạo được khoá mới (mất quyền quản trị): thu hồi khoá lộ trước, chấp nhận gián đoạn, rồi xin lại quyền.
- Sau khi xong, ghi một mục sổ wiki bằng `make log m="<khoá nào, môi trường nào>"` (lệnh tự thêm ngày) — không ghi giá trị.
  Đừng sửa tay `wiki/log.md`: tệp ấy vẽ ra từ `wiki/log/`.
