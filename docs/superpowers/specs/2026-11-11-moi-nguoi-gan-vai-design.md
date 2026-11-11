# Mời người, gán vai — thiết kế (hàng 9)

Hàng 9 của lộ trình (mã N3): Quản trị sàn mời người vào sàn và gán vai. Dựng trên hàng 7 (cách ly mỗi sàn, cửa
`withCompany`), hàng 8 (đăng nhập bằng mã email, bảng `company_members`, vai riêng `quy_hang_identity` cho các hàm
danh tính), hàng 1d (bốn vai khai trong `ontology/roles.yaml`, một người giữ nhiều vai) và hàng 1i (thanh bên lọc mục
theo vai). Hàng này không quyết vai nào làm được gì ngoài việc quản trị người: đó là bảng quyền của hàng 9a.

## Việc người dùng làm được sau hàng này

1. Quản trị sàn mở màn **Thành viên** từ thanh bên (chỉ người giữ vai Quản trị sàn thấy mục này), thấy mọi người của sàn
   mình: tên, email, các vai, ai mời và lúc nào.
2. Bấm **Mời người**, gõ email, tên, chọn ít nhất một trong bốn vai, bấm **Mời**. Người ấy vào danh sách ngay; máy gửi
   đúng một thư mời (Hỏi-1). Từ lúc đó email ấy xin được mã đăng nhập và vào sàn này như hàng 8.
3. Bấm **Đổi vai** ở một dòng, chọn lại tập vai (ít nhất một), lưu. Lần tải trang kế của người ấy đã theo vai mới (thanh
   bên thêm hay bớt mục).

## Dữ liệu — migration `003_moi_nguoi_gan_vai.sql` (số kế tiếp trên `origin/main` lúc tạo)

Bảng `company_members` (của hàng 8) thêm cột:

- `roles text[] not null` — tập vai, ràng buộc: ít nhất một phần tử, mỗi phần tử thuộc đúng bốn tên của
  `ontology/roles.yaml`, không trùng. Dòng có sẵn (chỉ là dữ liệu thử, quyết định 0008) nhận `{CompanyAdmin}`.
- `name text not null` — tên sàn đặt cho người (tên quản trị gõ khi mời); dòng có sẵn lấy tên tài khoản.
- `invited_by uuid null references identity.users`, `invited_at timestamptz null` — dòng có sẵn để trống.

Không thêm luật theo dòng nào: luật đọc của hàng 8 (`company_id = app.current_company_id()`) giữ nguyên, nên bộ kiểm cách
ly hàng 7 vẫn quét bảng này như cũ. Vai API vẫn chỉ có `select` trên bảng; mọi lần ghi đi qua bốn hàm hẹp ở schema `app`,
thuộc vai `quy_hang_identity` (được thêm quyền `insert, update` trên `company_members` và `insert` trên
`identity.users`), mỗi hàm tự đọc người và sàn của phiên (`app.user_id`, `app.current_company_id()`), không nhận sàn
qua tham số:

| Hàm                                     | Làm gì                                                                                               | Trả                                              |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `app.member_roles()`                    | vai của người gọi ở sàn của phiên                                                                    | `text[]` (rỗng khi không thuộc)                  |
| `app.member_list()`                     | người của sàn: id, tên trong sàn, email, vai, người mời, lúc mời — chỉ khi người gọi là Quản trị sàn | bảng, hoặc lỗi `forbidden`                       |
| `app.member_invite(email, name, roles)` | tìm hay tạo tài khoản theo email, thêm dòng thành viên ở sàn của phiên                               | `ok` · `already-member` · `forbidden`            |
| `app.member_set_roles(user_id, roles)`  | đổi vai một người của sàn của phiên; từ chối nếu sàn mất quản trị cuối cùng                          | `ok` · `not-member` · `last-admin` · `forbidden` |

Ràng buộc vai sai, email sai khuôn, tên rỗng do máy chủ chặn trước (400) và do ràng buộc bảng chặn lần nữa. Danh sách
bốn vai trong ràng buộc được bài kiểm so với `Role` sinh từ `ontology/roles.yaml` — một nguồn, một lưới.

## Mô-đun và đường ghi

- `src/modules/identity/members.ts` — logic: gọi bốn hàm qua `withCompany` với người và sàn của phiên. Gửi thư mời
  trong cùng giao dịch, sau khi thêm dòng: thư hỏng thì giao dịch lùi, không ai được thêm.
- `src/modules/identity/members-http.ts` — `Request` vào, `Response` ra, như `http.ts` của hàng 8 (không sửa `http.ts`,
  hàng 1m đang chạm tệp ấy). Đường dưới `/api/v1/members`: `GET` danh sách, `POST` mời, `PUT /api/v1/members/<id>/roles`
  đổi vai. Lỗi: 401 `unauthenticated` (không phiên hay phiên chưa chọn sàn), 403 `forbidden`, 404 `not-member`, 409
  `already-member` · `last-admin`, 400 `bad-request`, 500 `server-error`.
- `src/modules/identity/invite-mail.ts` — thư mời: tiêu đề và thân lấy chữ từ bảng nhãn, đường đăng nhập dựng từ gốc của
  yêu cầu (không thêm biến môi trường). Bản thật gửi qua Resend với khoá và địa chỉ gửi đã có của hàng 8; máy dev in ra
  nhật ký và ghi hộp thư thử như mã đăng nhập.
- `src/app/(app)/members/` — màn; `src/app/(app)/nav.ts` thêm mục chỉ cho vai Quản trị sàn; `src/app/(app)/layout.tsx`
  truyền vai của phiên vào khung (thanh bên của hàng 1i đã nhận `roles`). Không sửa menu tài khoản.

Luật sản phẩm chạm: **SP-1** — bốn hàm mới là phần mở rộng của ngoại lệ danh tính đã chấp nhận ở hàng 8; mỗi hàm có ma
trận ca và bản phá riêng. Nới một luật khó đảo là câu hỏi cho chủ luật ở Cổng Phạm vi, kèm lối khác (vai API ghi bảng
thành viên theo sàn, kiểm quản trị ở máy chủ). Tên riêng theo sàn cũng là câu hỏi (lối khác: tên tài khoản chung). **SP-3** — thư mời chỉ đi khi quản trị bấm «Mời»; không gửi tự động, không nhắc lại. **SP-4** —
không chạm trang khách.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: thanh bên «Thành viên» → bảng người của sàn → «Mời người» → hộp thoại (email, tên, vai) → «Mời» → hộp đóng,
  dòng mới ở đầu bảng, thông báo «Đã mời <tên>» (điểm ra: vẫn ở màn Thành viên).
- Đổi vai: «Đổi vai» ở một dòng → hộp thoại đánh dấu sẵn vai hiện có → «Lưu» → dòng đổi nhãn vai, thông báo «Đã đổi vai».
- Biên: email đã ở sàn → câu dưới ô email, hộp vẫn mở; bỏ vai Quản trị sàn của quản trị cuối cùng → câu trong hộp, nút
  lưu không đổi gì; người không phải Quản trị sàn mở thẳng `/members` → trạng thái Không đủ quyền; chưa đăng nhập →
  về `/login?next=/members`.
- Lỗi & quay lại: thư mời hay máy chủ hỏng → câu ba phần trong hộp, phần đã gõ giữ nguyên, «Thử lại»; mất mạng khi lưu →
  như trên.

### 2. Kiểm kê màn

| Màn                     | MỘT việc của màn                                    | Vào từ / ra tới       |
| ----------------------- | --------------------------------------------------- | --------------------- |
| Thành viên (`/members`) | Quản trị sàn xem ai thuộc sàn, mời người và đổi vai | thanh bên / ở lại màn |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái           | Màn         | Hiển thị gì                                                                    | Người làm gì tiếp  |
| -------------------- | ----------- | ------------------------------------------------------------------------------ | ------------------ |
| ST-members-loading   | Thành viên  | khung chờ đúng bố cục bảng (từ 1 giây)                                         | chờ                |
| ST-members-ready     | Thành viên  | bảng người: tên, email, nhãn vai, người mời và ngày mời                        | mời người, đổi vai |
| ST-members-error     | Thành viên  | «Chưa tải được danh sách thành viên. Máy chủ không trả lời. Bấm Thử lại.»      | Thử lại            |
| ST-members-forbidden | Thành viên  | «Chỉ Quản trị sàn xem được danh sách thành viên.» — không bảng, không số người | về Hôm nay         |
| ST-members-long      | Thành viên  | tên, email rất dài cắt gọn, xem đủ khi rê chuột hay chạm                       | đọc                |
| ST-invite-invalid    | hộp Mời     | câu dưới ô sai (email sai khuôn, tên trống, chưa chọn vai)                     | sửa ô              |
| ST-invite-already    | hộp Mời     | «Email này đã ở trong sàn.» dưới ô email                                       | sửa email hay đóng |
| ST-invite-failed     | hộp Mời     | câu ba phần, phần đã gõ giữ nguyên                                             | Thử lại            |
| ST-roles-last-admin  | hộp Đổi vai | «Sàn cần ít nhất một Quản trị sàn. Gán vai này cho người khác trước.»          | chọn lại vai       |

<!-- UX-STATE-TABLE>>> -->

Không có trạng thái Trống: sàn luôn có ít nhất một Quản trị sàn, chính là người đang xem. Không có Tìm không ra: bảng
không có ô tìm ở hàng này (một sàn MVP có vài chục người).

### 4. Hành vi

- Email: kiểu `email`, trình duyệt tự điền tắt; chuẩn hoá chữ thường, bỏ dấu cách hai đầu trước khi gửi.
- Tên: bắt buộc, tối đa 120 ký tự. Vai: bốn ô chọn theo thứ tự của `ontology/roles.yaml`, nhãn từ bảng nhãn, ít nhất một.
- Enter trong hộp gửi hộp; Esc đóng hộp, tiêu điểm về nút đã mở hộp. Nút gửi khoá trong lúc chờ, không gửi hai lần.
- Điện thoại (360, 414): bảng thành danh sách thẻ một cột theo khung; hộp thoại chiếm trọn chiều ngang.

### 5. Xuất xứ component

| Component                                                                             | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                           |
| ------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| Khung, đầu màn, trạng thái trang (`templates/app-shell`, `page-header`, `page-state`) | dùng                              | mọi màn nội bộ đứng trong khung                           |
| Bảng (`ui/table`), nhãn vai (`ui/badge`)                                              | dùng                              | danh sách vài chục dòng chỉ đọc, không cần lưới sửa tại ô |
| Hộp thoại, ô nhập, ô chọn (`ui/dialog`, `ui/input`, `ui/checkbox`, `ui/field`)        | ghép                              | hai hộp Mời và Đổi vai                                    |
| Thông báo (`templates/notify`)                                                        | dùng                              | báo đã mời, đã đổi vai                                    |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: luồng hiển nhiên — một bảng người và hai hộp thoại thao tác trên một dòng; cùng kiểu trang «Members» của Slack
và GitHub Organizations (bảng người, nút mời ở đầu, đổi vai từng dòng). Không dùng họ Lưới: Lưới là bảng tính sửa tại ô
cho Đầu chủ (`design/patterns/luoi.md`), màn này chỉ đọc theo dòng.

### 7. Thẻ việc

| Trường     | Giá trị                                                         |
| ---------- | --------------------------------------------------------------- |
| Ai dùng    | Quản trị sàn                                                    |
| Việc chính | Thêm người mới vào sàn với đúng vai, sửa vai khi người đổi việc |
| Tần suất   | mỗi tuần                                                        |
| Số bản ghi | vài chục                                                        |
| Thiết bị   | cả hai                                                          |

<!-- UX-SPEC-TEMPLATE>>> -->

## Không làm ở hàng này

Gỡ người, khoá người, huỷ hay gửi lại lời mời, trạng thái «đã vào hay chưa» (hàng 18a và việc tách «người hết sàn kẹt»
chủ kho đã chọn làm riêng); bảng quyền theo vai (9a); nhãn vai riêng của từng sàn (cấu hình sàn, chờ có sàn thứ hai);
mở sàn mới và quản trị đầu tiên của sàn thật (giữ lối vận hành của hàng 8).

## Bài kiểm

- Bài kiểm cơ sở dữ liệu `tests/db/moi-nguoi.db.test.ts` (Postgres của dãy N, cơ sở nháp riêng mỗi tệp), mỗi ca một tên
  ghim, kèm bản phá ở `tests/db/pha-thu/` cho từng hàm hẹp.
- Bộ kiểm cách ly của hàng 7 chạy trên lược đồ đã áp migration 003.
- Bài trình duyệt có cơ sở dữ liệu `tests/e2e-db/members.spec.ts` ở bốn khổ, sáng và tối, gồm axe.
- Bài kiểm đơn vị cho thư mời và cho «bốn vai trong ràng buộc = bốn vai của mô hình».
