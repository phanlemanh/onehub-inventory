# Đăng nhập bằng mã email — thiết kế (hàng 8, `dang-nhap-ma-email`)

Hàng 8 của lộ trình, mã N2 (đăng nhập bằng mã qua email) và N6 (menu tài khoản, đăng xuất). Dựng trên hàng 7
(cách ly mỗi sàn, cửa `withCompany`). Hàng 9 (mời người, gán vai) dựng trên hàng này.

Câu giao: nhân viên sàn nhập mã gửi qua email và vào đúng sàn của mình. Vì sao: đăng nhập là lớp khó đảo, tách riêng
khỏi quyền — hàng này không quyết ai làm được gì trong sàn (vai, bảng quyền là hàng 9 và 9a).

Luật sản phẩm chạm: **SP-1** (cách ly sàn). Mô-đun `identity` là ngoại lệ duy nhất của luật ấy vì một người có thể
thuộc nhiều sàn — nhưng hàng này không dùng ngoại lệ để mở luật đọc theo người trên bảng của công ty (xem §3).

## 1. Luồng

1. Người mở `/login`, gõ email, bấm «Gửi mã». Máy chủ trả cùng một câu cho mọi email («Nếu email này có tài khoản,
   mã đã được gửi»). Chỉ email đã có tài khoản và thuộc ít nhất một sàn mới nhận thư mang mã 6 số.
2. Người gõ (hoặc dán, hoặc để điện thoại tự điền) mã, bấm «Đăng nhập». Đúng → máy chủ tạo phiên, đặt cookie
   `ohi_session` (httpOnly, SameSite=Lax, Secure trên https), rồi:
   - thuộc một sàn → phiên gắn sàn đó, về trang người định mở (`next`) hoặc trang Hôm nay;
   - thuộc nhiều sàn → bước «chọn sàn» trên cùng màn, liệt kê đúng các sàn người là thành viên;
   - không còn thuộc sàn nào (bị gỡ sau khi xin mã) → thông báo «chưa thuộc sàn nào», không tạo phiên.
3. Trên khung ứng dụng, đầu trang có menu tài khoản: tên, email, sàn đang làm, «Đổi sàn» (khi thuộc nhiều sàn),
   «Đăng xuất». Chưa có phiên thì chỗ đó là nút «Đăng nhập».
4. Đăng xuất xoá phiên ở máy chủ, xoá cookie, về `/login`. Cookie cũ gửi lại không còn dùng được.

## 2. Số của đăng nhập (chờ chủ kho xác nhận — Hỏi-2)

Giữ đúng số của Quỹ hàng (ADR-0005): mã 6 chữ số; hết hạn sau 5 phút; sai 3 lần thì mã hỏng; mỗi email xin tối đa
5 lần trong 15 phút (email lạ cũng đếm, để giới hạn không thành đường dò); phiên sống 30 ngày, trượt theo ngày dùng
(dùng lại sau hơn một ngày thì hạn dời về «bây giờ + 30 ngày»). Xin mã mới làm mã cũ hết dùng. Mỗi số là một hằng
trong `src/modules/identity/constants.ts`.

## 3. Dữ liệu và cửa (khuyến nghị cho Hỏi-1)

Migration mới `db/migrations/002_dang_nhap_ma_email.sql`, tạo bằng quy trình `/new-migration`:

- Schema `identity` chỉ chủ đọc được (vai API không có quyền gì trên bảng): `identity.users` (id, email duy nhất viết
  thường, tên), `identity.login_codes` (một mã đang sống cho mỗi email: băm HMAC-SHA256 của mã, hạn, số lần sai),
  `identity.code_requests` (mỗi lần xin một dòng, để đếm giới hạn), `identity.sessions` (băm SHA-256 của mã phiên,
  người, sàn đang làm, hạn).
- Bảng `public.company_members` (company_id, user_id): bật và ép luật theo dòng, luật đọc đúng dạng
  `company_id = app.current_company_id()` — bộ kiểm cách ly của hàng 7 tự quét nó, không sửa bộ kiểm. Ghi thành viên
  chưa mở cho vai API (hàng 9 mở cùng vai và lời mời).
- Sáu hàm hẹp ở schema `app` (`security definer`, `search_path` ghim, thu quyền của `public`), chỉ vai API gọi được,
  gọi BÊN TRONG cửa `withCompany`: xin mã (ghi băm, đếm giới hạn, trả «gửi / không gửi / quá giới hạn»), đổi mã lấy
  phiên (so băm, đếm sai, xoá mã khi đúng hoặc khi sai đủ 3 lần), đọc phiên (trượt hạn, kiểm lại thành viên), danh sách
  sàn của phiên, chọn sàn (kiểm thành viên), kết thúc phiên. Mọi hàm nhận băm của mã phiên — không hàm nào trả email
  hay sàn của người khác.
- **Ai sở hữu các hàm (phần ngoại lệ danh tính của SP-1 mà lối này dùng — Hỏi-1).** Bảng của sàn bật «ép» luật theo
  dòng, nên chính chủ bảng cũng bị lọc theo sàn của phiên; mà «mọi sàn của người này» thì không lọc theo một sàn được.
  Vì vậy các hàm thuộc một vai riêng `quy_hang_identity`: không đăng nhập được, không là siêu người dùng, được vượt luật
  theo dòng, nhưng chỉ có quyền trên schema danh tính và quyền ĐỌC đúng hai bảng `companies`, `company_members`, không
  sở hữu bảng nào của public. Vai API không là thành viên của nó; chỉ chạm tới nó qua sáu hàm. Bài kiểm (E15) đọc
  `pg_roles`, `pg_proc` và quyền trên bảng để giữ đúng ba điều ấy, kèm bản phá thử. Lối khác — luật đọc theo người như
  Quỹ hàng — làm bộ kiểm cách ly đỏ và cho mọi truy vấn của API thấy dòng thành viên ở mọi sàn.
- Mã và mã phiên không bao giờ nằm rõ trong cơ sở dữ liệu; mã băm bằng khoá bí mật `AUTH_SECRET` của máy chủ.

Vì sao không chép nguyên văn migration đăng nhập của Quỹ hàng: bản ấy cho người đọc dòng thành viên của chính mình ở
mọi sàn (`user_id = app.current_user_id() or …`) và cho đọc tên mọi sàn mình thuộc — hai dạng luật mà bộ kiểm cách ly
của hàng 7 báo đỏ; và thư viện better-auth đi kèm cần một kết nối chủ thứ hai ngoài cửa, làm bài quét một cửa (đã ký
ở hàng 7) đỏ. Lối ấy vẫn để chủ kho chọn ở Cổng Phạm vi (Hỏi-1) vì nó lệch câu chữ của quyết định 0007 và 0008.

Phiên dùng cửa: trình đọc phiên của mô-đun `identity` (`server.ts`) đọc cookie, gọi hàm đọc phiên qua `withCompany`
với sàn rỗng, rồi trả `{ userId, companyId }` — đúng đầu vào của `withCompany` cho mọi truy vấn của sàn về sau. Sàn
của phiên được kiểm lại là thành viên ở mỗi lần đọc phiên; người bị gỡ khỏi sàn thì lần gọi kế không còn sàn.

Trình điều khiển: gói `pg` (giám sát duyệt), nạp DUY NHẤT ở tệp cửa `with-company.ts` (bài quét một cửa của hàng 7
giữ luật này). Tệp cửa thêm hàm dựng bể kết nối từ `DATABASE_URL`.

## 4. Đường ghi

Dưới `/api/v1/auth` (luật kho: `/api/v1` là đường ghi duy nhất): `POST code` (xin mã), `POST session` (đổi mã lấy
phiên), `PUT session/company` (chọn sàn), `DELETE session` (đăng xuất), `GET session` (ai đang đăng nhập, sàn nào,
các sàn có thể đổi). Thân yêu cầu kiểm bằng zod. Lỗi trả mã máy đọc được: `code-invalid` (sai, hết hạn, đã dùng,
email lạ — một mã cho tất cả), `rate-limited` (429), `not-member` (chọn sàn không thuộc), `no-company`,
`unauthenticated` (401).

## 5. Gửi thư (khuyến nghị cho Hỏi-4)

Bộ gửi mã là một hàm: bản thật gửi qua API HTTP của Resend bằng `fetch` (không thêm gói), từ `MAIL_FROM` với
`RESEND_API_KEY`; máy dev in mã ra nhật ký máy chủ; bài kiểm dùng bộ gửi giữ thư trong bộ nhớ. Bản thật
(`NODE_ENV=production`) thiếu `RESEND_API_KEY`, `MAIL_FROM`, `AUTH_SECRET` hay `DATABASE_URL` thì không khởi động
(kiểm ở `src/instrumentation.ts` lúc máy chủ lên, nêu tên biến thiếu); nếu vẫn lọt tới lúc xin mã thì đường xin mã trả
500, không thư nào gửi — không bao giờ rơi về in mã ra nhật ký. Không bài kiểm nào gửi thư thật; việc chủ kho nhận mã thật
gom vào một yêu cầu `can-nguoi` ở Cổng Bằng chứng.

## 6. Màn hiện có (khuyến nghị cho Hỏi-3)

Hàng 8 chưa bắt đăng nhập ở Hôm nay, Bảng hàng, Đã gửi (đều chạy dữ liệu mẫu). Lý do: bài kiểm trình duyệt trên CI chưa
có Postgres và tệp CI là của chủ kho. Màn đọc dữ liệu thật (hàng N5) bắt đăng nhập cùng lúc CI có Postgres. Không có
cờ tính năng nào: khung chỉ đổi nút «Đăng nhập» ↔ menu tài khoản theo phiên.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: `/login` (hoặc nút «Đăng nhập» trên khung) → gõ email → «Gửi mã» → gõ/dán mã → «Đăng nhập» → trang Hôm nay
  hoặc `next` (điểm ra: khung ứng dụng có menu tài khoản mang tên sàn).
- Biên: nhiều sàn → bước chọn sàn; không còn sàn → thông báo, nút «Dùng email khác»; đã có phiên mà mở `/login` →
  về thẳng trang Hôm nay.
- Lỗi & quay lại: mã sai/hết hạn → báo dưới ô mã, giữ email, có «Gửi mã mới»; quá giới hạn → báo chờ 15 phút; lỗi
  mạng/máy chủ → câu ba phần có «Thử lại», không mất phần đã gõ; «Dùng email khác» về bước email.

### 2. Kiểm kê màn

| Màn                         | MỘT việc của màn                               | Vào từ / ra tới                                           |
| --------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Đăng nhập (`/login`)        | Đổi email + mã thành phiên ở đúng sàn          | nút trên khung, phiên hết hạn / trang Hôm nay hoặc `next` |
| Menu tài khoản (trên khung) | Biết mình là ai, ở sàn nào; đổi sàn, đăng xuất | mọi màn nội bộ / chính màn đó, `/login`                   |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái              | Màn       | Hiển thị gì                                                                                             | Người làm gì tiếp    |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| ST-login-email          | Đăng nhập | Ô email (tự điền), nút «Gửi mã»                                                                         | gõ email, gửi        |
| ST-login-sending        | Đăng nhập | Nút bận có chỉ báo, ô khoá                                                                              | chờ                  |
| ST-login-code           | Đăng nhập | «Mã đã gửi tới <email> nếu email có tài khoản», ô mã 6 số, «Đăng nhập», «Gửi mã mới», «Dùng email khác» | gõ/dán mã            |
| ST-login-code-invalid   | Đăng nhập | «Mã không đúng hoặc đã hết hạn» dưới ô mã                                                               | gõ lại, xin mã mới   |
| ST-login-rate-limited   | Đăng nhập | «Đã xin mã quá nhiều lần. Thử lại sau 15 phút.»                                                         | chờ, dùng email khác |
| ST-login-error          | Đăng nhập | Câu ba phần, «Thử lại», giữ phần đã gõ                                                                  | thử lại              |
| ST-login-choose-company | Đăng nhập | Danh sách sàn người thuộc, mỗi sàn một nút                                                              | chọn sàn             |
| ST-login-no-company     | Đăng nhập | «Tài khoản chưa thuộc sàn nào. Nhờ quản trị sàn mời bạn.»                                               | dùng email khác      |
| ST-shell-signed-out     | Khung     | Nút «Đăng nhập» ở đầu trang                                                                             | bấm để đăng nhập     |
| ST-shell-account        | Khung     | Nút tài khoản (chữ đầu tên); menu: tên, email, sàn đang làm, «Đổi sàn», «Đăng xuất»                     | đổi sàn, đăng xuất   |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Ô email `type=email autocomplete=email`; ô mã MỘT ô `inputmode=numeric autocomplete=one-time-code`, nhận dán cả
  chuỗi (bỏ dấu cách, gạch), tối đa 6 chữ số (sổ hành vi: «Dán được mã, cho trình quản lý mật khẩu điền»).
- Enter gửi bước đang mở; focus chuyển sang ô mã khi tới bước mã; lỗi gắn `aria-describedby` vào ô.
- Bốn khổ 360, 414, 1024, 1440; khối đăng nhập rộng tối đa 24rem, giữa màn.

### 5. Xuất xứ component

| Component                            | Nấc  | Vì sao                                               |
| ------------------------------------ | ---- | ---------------------------------------------------- |
| Frame                                | dùng | khung khối của màn nội bộ                            |
| Field, Input, Label, Button, Spinner | dùng | ô và nút đã cài                                      |
| DropdownMenu                         | dùng | menu tài khoản trên khung                            |
| LoginForm, AccountMenu               | ghép | màn và menu mới ghép từ phần đã cài, đặt ở `src/app` |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: wizard
Căn cứ: luồng hiển nhiên ba bước nối tiếp (email → mã → chọn sàn), một việc mỗi bước, như đăng nhập bằng mã của
Slack và Quỹ hàng; không tra mẫu.

### 7. Thẻ việc

| Trường     | Giá trị                           |
| ---------- | --------------------------------- |
| Ai dùng    | Nhân viên sàn (mọi vai)           |
| Việc chính | Vào đúng sàn của mình để làm việc |
| Tần suất   | hiếm (phiên sống 30 ngày)         |
| Số bản ghi | một                               |
| Thiết bị   | cả hai                            |

<!-- UX-SPEC-TEMPLATE>>> -->

## 7. Bài kiểm

- Bài kiểm đơn vị (không cơ sở dữ liệu, chạy trong `make test`): sinh mã, băm, đọc cookie, chọn bộ gửi, kiểm thân yêu
  cầu, nội dung thư.
- Bài kiểm trên Postgres của dãy (`vitest.db.config.ts`, cơ sở nháp `dang_nhap_*`, chạy riêng — CI chưa có Postgres):
  đi trọn đường `/api/v1/auth` bằng chính bộ xử lý route, hàm hẹp, ca phá thử từng hàm.
- Bộ kiểm cách ly của hàng 7 (`bash db/scripts/cach-ly.sh`) phải xanh với bảng mới.
- Bài kiểm trình duyệt trên Postgres của dãy (`playwright.db.config.ts`, thư mục `tests/e2e-db/`): trọn luồng ở bốn
  khổ, axe sáng và tối. Bài trình duyệt chung (`make e2e`, không cơ sở dữ liệu) thêm ca khung chưa đăng nhập.

## 8. Ngoài phạm vi

- Mời người, gán vai, ghi thành viên (hàng 9); bảng quyền (9a).
- Bắt đăng nhập ở màn dữ liệu mẫu (hàng N5, cùng Postgres trên CI — việc của chủ kho).
- Mật khẩu, đăng nhập bằng số điện thoại, Google (bản đề xuất chuẩn thiết kế xếp mật khẩu ra ngoài MVP).
- Mở sàn và tài khoản đầu tiên của sàn thật: giữ lối vận hành hiện tại.
