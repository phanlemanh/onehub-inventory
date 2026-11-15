# Thiết kế · 9c Thành viên chọn từ ReUI

Hàng 9c của `docs/plan/lo-trinh.json`, ô Cổng Đáng `opportunity.md` (chủ kho «build» 13/11). Quyết định 0023: màn
Thành viên và hộp mời ghép tay khi kho còn rỗng; sổ màn để họ của màn rỗng nên màn không được so với màn danh sách nào.
Hàng này chọn lại hai phần của màn — danh sách người và hộp mời — từ kho và ReUI Pro. Quyền và luật mời của hàng 9 giữ
nguyên: chỉ ai được bảng quyền cho `listMembers` mới vào; mời là một email, một tên trong sàn, ít nhất một vai; đổi vai giữ
luật «sàn còn ít nhất một Quản trị sàn».

## Nguồn khối

Mã gốc của cả hai khối lấy từ kho ReUI bằng khoá của kho ngày 14/11 (registry `@reui`, kiểu `base-nova`):

- `solution-users-8` — 13 tệp: `team-access.tsx` (đầu trang, hai thẻ People/Alerts, nút Invite People), `people-tab.tsx`
  (ô tìm, ba khung Members/Guests/Invites cùng một trục cột), `invite-dialog.tsx`, `alerts-tab.tsx`, `choice-select.tsx`,
  `columns.ts`, `value-faces.tsx`, `team-states.tsx`, `data.ts`, `demo-state.ts`, `export.ts`, `icons.tsx`, `page.tsx`.
- `dialog-2` — 4 tệp: `workspace-invite-dialog.tsx`, `invite-role-picker.tsx`, `data.ts`, `page.tsx`.

Ảnh khối gốc chụp ở trang xem trước của ReUI, 1440, nền sáng, TRƯỚC khi dựng: `evidence/design-pass/anh/goc-users8.png`,
`goc-users8-moi.png` (hộp mời của chính khối), `goc-dialog2.png`.

## Câu hỏi cho chủ kho (Cổng Phạm vi)

**Hỏi-1 · Danh sách người theo khuôn nào?** Phần chiếm gần hết màn.

- **A · Khuôn Lưới của kho** (`DataRegion`, như Bảng hàng, Đã gửi): mỗi người một dòng bảng tính, năm cột Tên, Email, Vai,
  Người mời, Ngày mời; hàng ô lọc dưới mỗi tiêu đề cột; «…» cuối dòng mang «Đổi vai»; nút «Mời người» ở đầu màn. Được:
  lọc theo vai hay người mời bằng ô đầu cột như Sheet, cùng thói quen với Bảng hàng. Mất: màn ít người (vài chục) mà mang
  cả bộ máy bảng tính (cột ghim, số dòng, cuộn trong khung), «Đổi vai» sâu thêm một lần bấm sau «…»; mô hình nghiệp vụ
  phải thêm bốn trường hiển thị của Thành viên: Email (`Member.email`, RESO `MemberEmail`), Vai (`Member.roles`), Người
  mời (`Member.invitedBy`), Ngày mời (`Member.invitedAt`). Bản đồ khuôn `design/patterns/luoi.md` hôm nay không nhận màn
  này (nhận việc «Đầu chủ xem, lọc và sửa danh sách hàng»).
- **B · `solution-users-8`** (khối Quỹ hàng đã chọn, `docs/tri-thuc/wiki/chu-de/nguoi-dung-va-vai.md`): một khung
  «Thành viên» với dòng đếm, mỗi người một dòng có chữ cái đầu, tên, email, người mời, vai, nút «Đổi vai» ngay trên dòng.
  Được: thấy ngay ai, vai gì, một lần bấm để đổi vai, đúng khuôn trang quản người mà người dùng quen ở các ứng dụng khác.
  Mất: không lọc theo cột; sàn đông (trên trăm người) phải cuộn.

**Máy khuyên B.** Việc của màn là Quản trị sàn xem ai đang trong sàn và đổi vai cho một người — vài chục dòng, ít khi lọc;
khuôn Lưới sinh ra cho việc xem và sửa hàng như bảng tính. Lối B không đổi mô hình nghiệp vụ. Nếu chủ kho chọn A, hợp
đồng đổi lời ở AC-1, AC-2, AC-3 và thêm việc đổi bốn trường trên trong PR (chữ chọn của chủ kho cũng là chữ phê đổi mô
hình).

### Đã chốt (máy quyết, có căn cứ)

- **Hộp mời theo `dialog-2`, giữ luật mời của hàng 9.** Hộp mời của chính `solution-users-8` (ô nhiều email, chọn
  Thành viên/Khách, một vai) chết: hàng 9 mời một người mỗi lần, có tên trong sàn, nhiều vai, và sản phẩm không có khách
  (nguồn: `_acceptance/moi-nguoi-gan-vai/contract.md`). Từ `dialog-2` giữ: tiêu đề kèm nhãn nhỏ (ở đây là tên sàn đang mời
  vào — một người có thể quản trị nhiều sàn), mô tả một câu, các trường xếp dọc, dải chân hai nút. Không giữ: ô nhiều
  email và đếm «Gửi N lời mời» (luật một người mỗi lần), ô chọn một vai (luật nhiều vai — giữ bốn ô đánh dấu).
- **Không ô tìm, không thẻ Alerts, không khung Guests/Invites, không xuất CSV, không thanh chỗ ngồi**: sản phẩm không có
  các khái niệm ấy; tìm nằm ở ⌘K (chủ kho 13/11, hàng 2e).
- **Nút theo luật 9e**: «Mời người» ở đầu màn, qua cửa nút theo quyền; «Đổi vai» chỉ hiện khi bảng quyền cho.
- **Ô nhãn của hộp dùng chung**: `form-dialog.tsx` thêm một ô tuỳ chọn `badge`, mặc định tắt; ba màn khác dùng hộp
  (`view-name-dialog`, `listing-cell-edit`, `report-unit-error`) không đổi dáng.

## Vùng của `solution-users-8` (theo lối B)

| Vùng của khối | Làm gì | Vì sao (việc của người dùng) |
| --- | --- | --- |
| Đầu trang: tiêu đề, phụ đề, nút Invite People | Lấy: tiêu đề màn và nút «Mời người» ở đầu màn | Mời là việc thứ hai của màn; nút đầu màn theo 9e |
| Thẻ People / Alerts | Bỏ | Sản phẩm không có cảnh báo quản trị |
| Ô tìm tên, email | Bỏ | Tìm ở ⌘K; vài chục người nhìn là thấy |
| Khung Members: tiêu đề, mô tả đếm | Lấy: «Thành viên» · «N người trong sàn» | Biết sàn có bao nhiêu người |
| Thanh chỗ ngồi, Export CSV | Bỏ | Không có gói chỗ ngồi, không xuất danh sách |
| Dòng người: ảnh, tên, email | Lấy: chữ cái đầu thay ảnh | Kho không lưu ảnh người |
| Cột phương thức đăng nhập / hoạt động gần nhất | Thay: «Người mời: [Tên] · ngày» | Dữ liệu kho có; biết ai đưa người này vào |
| Ô chọn một vai | Thay: nhãn các vai | Một người giữ nhiều vai |
| Nút xoá người | Bỏ | Khoá người nghỉ là hàng N8, chưa tới |
| Khung Guests, khung Invites | Bỏ | Không có khách, mời là vào sàn ngay |
| Hộp mời của khối | Bỏ, dùng `dialog-2` | Xem «Đã chốt» |

Khối giữ bốn vùng trên mười một: theo luật «Giữ dáng theo tầng» của `inventory-ui`, màn này gọi là «ghép từ thành phần,
xếp theo solution-users-8» — các thành phần `Frame`, `Item`, `Avatar`, `Badge` giữ nguyên như nhà cung cấp.

## Đặc tả UX

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: thanh bên «Thành viên» → danh sách người → «Mời người» → điền email, tên, vai → «Mời» → hộp đóng, báo «Đã mời
  [Tên]», người mới có trong danh sách (điểm ra: ở lại màn).
- Suôn sẻ 2: dòng một người → «Đổi vai» → chọn vai → «Lưu» → báo «Đã đổi vai của [Tên]».
- Biên: người không có `listMembers` → «Không đủ quyền»; có xem mà không có `inviteMember`/`changeMemberRoles` → không thấy
  nút ấy; sàn chỉ một người → danh sách một dòng.
- Lỗi & quay lại: email sai khuôn, đã trong sàn, máy chủ lỗi → câu dưới trường hoặc cuối hộp, chữ đã gõ còn nguyên, nút
  thành «Thử lại»; máy chủ từ chối (403) → câu từ chối, chỉ còn «Thôi», đóng hộp thì trang tải lại theo bảng quyền.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Thành viên (`/members`) | Quản trị sàn xem ai trong sàn với vai gì, mời người, đổi vai | Thanh bên / ở lại |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-members-loading | Thành viên | Khung trang chờ tải (PageSkeleton), nút «Mời người» đã có | Chờ |
| ST-members-error | Thành viên | Trạng thái lỗi của kho, nút «Thử lại» | Thử lại |
| ST-members-forbidden | Thành viên | «Không đủ quyền», lối về Hôm nay | Về Hôm nay |
| ST-members-ready | Thành viên | Khung «Thành viên», «N người trong sàn», mỗi người một dòng | Mời người, đổi vai |
| ST-members-long | Thành viên | Tên, email dài cắt bằng «…», đủ chữ khi rê chuột | Đọc |
| ST-invite-invalid | Hộp mời | Câu lỗi dưới trường | Sửa |
| ST-invite-already | Hộp mời | «Email này đã ở trong sàn.» | Đổi email |
| ST-invite-failed | Hộp mời | Câu lỗi máy chủ, nút «Thử lại» | Thử lại |
| ST-roles-last-admin | Hộp đổi vai | Câu «Mỗi sàn cần ít nhất một Quản trị sàn…» | Gán vai cho người khác trước |
<!-- UX-STATE-TABLE>>> -->

Không có trạng thái rỗng: danh sách luôn có ít nhất người đang xem (người vào được màn là thành viên của sàn).

### 4. Hành vi

- Ngưỡng đo theo bề rộng của chính khung danh sách (không theo cửa sổ, nên cột thứ hai App Shell mở hay gập không làm
  lệch): khung ≥ 56rem (896 px) thì mỗi dòng bốn cột thẳng hàng — người, người mời, vai, nút; khung từ 42rem tới dưới
  56rem thì cột «Người mời» ẩn, ba cột còn lại thẳng hàng; khung dưới 42rem (672 px) thì người chiếm một dòng riêng, vai
  và nút xuống dòng dưới.
- Hộp: Enter gửi, Esc đóng và trả tiêu điểm về nút mở; tên trong sàn tối đa `MEMBER_NAME_MAX` ký tự.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| `Frame` (ReUI) | dùng | Khung vùng của màn nội bộ |
| `Item`, `Avatar` (shadcn, cài mới) | dùng | Dòng người và chữ cái đầu của solution-users-8 |
| `Badge` (ReUI) | dùng | Nhãn vai, nhãn tên sàn trong hộp |
| `FormDialog` (kho) | mở rộng | Thêm ô `badge` tuỳ chọn cho dáng dialog-2 |
| `PermittedAction` (kho) | dùng | Nút theo quyền 9e |
| `MembersList` | ghép | Xếp theo solution-users-8 |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: một-cột-cuộn
Căn cứ: màn một danh sách ngắn, không ngăn chi tiết (đổi vai là hộp). Đã xem khối mẫu thị trường qua ReUI
`solution-users-1…8` (trang xem trước, 14/11): cả tám xếp danh sách người một cột, hành động trên dòng.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Quản trị sàn |
| Việc chính | Xem ai đang trong sàn với vai gì, mời người mới, đổi vai một người |
| Tần suất | mỗi tuần |
| Số bản ghi | vài chục |
| Thiết bị | máy tính |
<!-- UX-SPEC-TEMPLATE>>> -->

## Bài kiểm của hàng 9 phải đổi cách tìm phần tử

Lời và kỳ vọng không đổi. Dòng người đổi thẻ từ `li` sang phần tử dòng của `Item`, nên bộ tìm `li[data-member=…]` trong
`tests/e2e-db/members.spec.ts` (và `bo-nut-members.spec.ts` nếu dùng) đổi thành `[data-member=…]`. Liệt từng bài ở Cổng
Bằng chứng.

## Nếu chủ kho chọn A (khuôn Lưới)

Đổi lời trước khi duyệt: AC-1, AC-2, AC-3, AC-8, AC-9 và các phép đo E1, E2, E5, E12; tệp họ là `design/patterns/luoi.md`
(bản đồ khuôn phải nhận thêm màn Thành viên và việc của Quản trị sàn); PR mang mục «Đổi ontology — chủ kho soi» cho bốn
trường `Member.email`, `Member.roles`, `Member.invitedBy`, `Member.invitedAt`.

## Ngoài vùng của hàng (đã báo G, G cho 14/11)

- `src/components/ui/avatar.tsx`, `src/components/ui/item.tsx` — cài bằng `shadcn add`, không sửa tay.
- `design/component-registry.json` — sinh lại bằng `make gen`.
- `src/components/candidate/form-dialog.tsx` — ô `badge` tuỳ chọn, mặc định tắt; bài kiểm cả bật và tắt; ảnh chụp lại ba
  màn kia ở Cổng Bằng chứng.
- `design/screens.yaml` (họ của màn), `design/so-khoi.yaml` (hai dòng khối), `design/patterns/<họ mới>.md` — sổ thiết kế.
- Chỉ khi chủ kho chọn A: `ontology/entities/Member.yaml` và tệp sinh.

Bản mẫu cho trang cổng: công tắc `?lo=list|grid` ở `/members`, chỉ ở bản dev; gỡ cùng lối không được chọn trước khi chấm.
