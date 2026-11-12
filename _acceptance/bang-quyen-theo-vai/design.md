# Thiết kế: bảng quyền theo vai (hàng 9a)

Ngày 2026-11-12 · dãy N · hạng T3 · dựng trên hàng 9 (mời người, gán vai) và hàng 1d (bốn vai).

## Bài toán

Quyết định 0016 chốt: mỗi quyết định quyền xét vai, thao tác, phạm vi và trạng thái bản ghi; bảng quyền nằm trong mô hình
nghiệp vụ; API, cơ sở dữ liệu và màn cùng đọc từ bảng; mọi ô có bài kiểm; thao tác ghi không có dòng trong bảng thì kiểm
tra đỏ. Hôm nay kho chưa có bảng: hàng 9 giữ luật «chỉ Quản trị sàn xem người, mời, đổi vai» ở bốn hàm hẹp của cơ sở dữ
liệu, viết thẳng `identity.is_admin`, và ghi rõ hàng 9a sẽ chuyển luật ấy vào bảng chung.

Soát mã hiện có thấy thêm hai chỗ hở cùng loại lỗi «ai đọc được là sửa được» của Quỹ hàng:

- Bảng `company_members` cho vai API đọc mọi dòng của sàn (luật theo dòng chỉ lọc theo sàn), nên một Đầu chủ đọc thẳng
  được tên và vai của cả sàn ở cơ sở dữ liệu, dù đường `/api/v1/members` chỉ cho Quản trị sàn.
- Bảng `agreements` (thoả thuận kết nối) cho mọi thành viên thêm và sửa ở cơ sở dữ liệu. Chưa có đường API nào ghi bảng
  này, nhưng rào ở cơ sở dữ liệu mỏng hơn ý định (Quỹ hàng gọi đây là G7).

## Cách làm

### Một bảng, ở mô hình nghiệp vụ

Bảng quyền là `ontology/actions.yaml` — khái niệm «thao tác» mà bộ sinh mã của kho đã biết. Mỗi dòng là một thao tác:

| Trường | Nghĩa |
|---|---|
| `name` | tên mã của thao tác (động từ + danh từ, ví dụ `inviteMember`) |
| `kind` | `query` (đọc) hay `create` / `update` / `delete` / `command` (ghi) |
| `entity` | thực thể chính |
| `status` | `live` (đã có cửa trong mã) hay `planned` (nháp, chưa có cửa) |
| `scope` | mỗi vai một ô: `company` (Toàn sàn), `own` (Của tôi) hay vắng (không được) |
| `states` | trạng thái bản ghi cho phép (tuỳ chọn; xem «Trạng thái» dưới) |
| `doors.api` | các cửa API: `<METHOD> /api/v1/...` |
| `doors.db` | các cửa cơ sở dữ liệu: `function app.x(...)` hay `table <tên> <select|insert|update|delete>` |

Trường `roles` mà bộ sinh đang đọc được suy từ các vai có ô `scope`, nên khuôn cũ của bộ sinh vẫn đúng. Bộ sinh được mở
thêm để mang `scope`, `status`, `doors` sang mã sinh (`src/generated/ontology.ts`) và để kiểm khuôn: vai lạ, phạm vi lạ,
dòng `live` không có cửa, dòng `planned` có cửa đều đỏ ở `make ontology`. Tệp bộ sinh và tệp sinh nằm ngoài ranh giới của
dãy N; đã xin giám sát (yêu cầu N-8).

Phần cuối tệp là danh sách `exempt`: cửa không xét vai, mỗi cửa một lý do. Chỉ hai loại được vào: cửa danh tính chạy
trước khi có sàn (xin mã, đổi mã, đọc phiên, chọn sàn, đăng xuất — ngoại lệ danh tính của SP-1, một người thuộc nhiều sàn)
và hàm đọc ngữ cảnh phiên (`app.current_company_id()`, `app.allowed(text)`). Tập miễn viết trước, ghim ở cả hai lớp:
năm cửa `/api/v1/auth/**`; ở cơ sở dữ liệu `app.current_company_id()`, `app.allowed(text)` và sáu hàm đăng nhập của
migration 002 (`login_request_code`, `login_verify_code`, `session_read`, `session_companies`, `session_set_company`,
`session_end`).

### Cộng quyền

Người kiêm nhiều vai được cộng quyền (0016): phạm vi của người với một thao tác là phạm vi rộng nhất trong các vai họ giữ
(`company` > `own` > không). Một hàm thuần ở cửa công khai của mô-đun danh tính (`allowedScope(roles, action)`) tính điều
này từ bảng sinh; màn sau này (hàng 19a, nút làm việc kèm quyền của khuôn lưới) đọc cùng hàm.

### API đọc bảng

Mỗi bộ xử lý `/api/v1` của thao tác có vai gọi một cửa chung `requireAction(ctx, "<thao tác>")` trước khi chạm dữ liệu:
cửa đọc vai của người ở sàn của phiên (`app.member_roles()`), tính phạm vi bằng `allowedScope`, trả `403 forbidden` khi
không được. Lời từ chối giống hệt nhau với mọi thao tác và không nêu tên ai. Cơ sở dữ liệu vẫn tự chặn lần nữa (dưới).

### Cơ sở dữ liệu đọc bảng

Migration `004_bang_quyen_theo_vai.sql` (tạo bằng `/new-migration`):

- Bảng `app.permissions (action, role, scope)` — danh mục dùng chung, không có `company_id` (ngoại lệ danh mục chung của
  AGENTS.md), chủ là vai danh tính, vai API chỉ đọc. Hạt là các dòng `live` của bảng.
- Hàm `app.allowed(p_action text) returns text`: phạm vi của người của phiên ở sàn của phiên — rộng nhất theo các vai,
  `null` khi không được, khi chưa chọn sàn hay không thuộc sàn. Hàm chạy bằng quyền của người gọi (không `security
  definer`): nó lấy vai qua `app.member_roles()` — hàm vượt luật theo dòng duy nhất, đã duyệt ở hàng 9 dưới ngoại lệ danh
  tính của SP-1, đọc đúng một dòng của người của phiên ở sàn của phiên — rồi đọc `app.permissions`. Vòng này không thêm
  hàm vượt luật theo dòng nào. `search_path` cố định.
- Bốn hàm của hàng 9 thay `identity.is_admin(...)` bằng `app.allowed('<thao tác>') = 'company'` (viết lại bằng
  `create or replace` trong migration mới; migration 003 không sửa). Luật «sàn luôn còn một quản trị» giữ nguyên.
- Luật theo dòng của `company_members` thu lại: đọc dòng của chính mình, hoặc mọi dòng của sàn khi `listMembers` cho phép.
- Luật theo dòng ghi của `agreements` thêm điều kiện `app.allowed('manageAgreements') = 'company'`; đọc theo
  `readAgreements`. Cách ly theo sàn giữ nguyên.

Bản trong cơ sở dữ liệu là bản chép của bảng (migration đã commit không sửa được, và vai API không đọc tệp của kho). Bài
kiểm so từng dòng của `app.permissions` với các dòng `live` của bảng sinh; lệch là đỏ, nêu thao tác và vai. Hàng sau thêm
thao tác thì thêm dòng vào `actions.yaml` và một migration chèn dòng tương ứng.

### Trạng thái

Bảng có trường `states`, và các dòng nháp của hàng (Đưa lên «Đang bán») dùng nó. Chưa có thao tác sống nào phụ thuộc trạng
thái bản ghi, nên vòng này không dựng phần thi hành trạng thái ở cửa API và cơ sở dữ liệu: phần ấy không đo được khi
không có bản ghi nào mang trạng thái. Hàng đầu tiên mở một thao tác theo trạng thái (dự kiến hàng 10) dựng nó cùng bài kiểm;
bộ sinh đỏ khi một dòng `live` khai `states` mà cửa chưa đọc trạng thái — xem AC-1.

### Bảng nháp từ Quỹ hàng

0016 nói bảng nháp lấy từ bảng thực tế của Quỹ hàng. Vòng này thêm năm dòng `planned` cho Bảng hàng, lấy từ bảng hai của
rà soát phân quyền Quỹ hàng 05/11 và bảng `bang-quyen-hang.json` đã ký của Quỹ hàng (bỏ vai Telesales):

| Thao tác | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| Xem hàng | Toàn sàn | Toàn sàn | Toàn sàn | — |
| Tạo hàng | Toàn sàn | Toàn sàn | Toàn sàn | — |
| Sửa hàng (giá, phí, chi tiết) | Toàn sàn | Toàn sàn | Toàn sàn | — |
| Đưa lên «Đang bán» | Của tôi (căn mình giữ, hoặc căn chưa ai giữ) | — | Toàn sàn | — |
| Xem số chủ nhà | Của tôi (căn mình giữ) | — | Toàn sàn | — |

Dòng nháp không có cửa và không vào cơ sở dữ liệu; hàng mở cửa của nó (hàng 10 trở đi) chốt từng ô ở Cổng Phạm vi của mình
rồi đổi sang `live`.

### Bảng sống sau vòng này

| Thao tác | Loại | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn | Cửa API | Cửa cơ sở dữ liệu |
|---|---|---|---|---|---|---|---|
| `readOwnRoles` — đọc vai của mình | đọc | Của tôi | Của tôi | Của tôi | Của tôi | — | `app.member_roles()`; `company_members` dòng của mình |
| `readCompany` — đọc tên sàn | đọc | Toàn sàn | Toàn sàn | Toàn sàn | Toàn sàn | — | bảng `companies` |
| `listMembers` — xem người của sàn | đọc | — | — | — | Toàn sàn | `GET /api/v1/members` | `app.member_list()`; `company_members` mọi dòng |
| `inviteMember` — mời người | ghi | — | — | — | Toàn sàn | `POST /api/v1/members` | `app.member_invite(...)` |
| `changeMemberRoles` — đổi vai | ghi | — | — | — | Toàn sàn | `PUT /api/v1/members/[id]/roles` | `app.member_set_roles(...)` |
| `readAgreements` — xem thoả thuận kết nối | đọc | Toàn sàn | Toàn sàn | Toàn sàn | Toàn sàn | — | bảng `agreements` select |
| `manageAgreements` — thêm, sửa thoả thuận | ghi | — | — | — | Toàn sàn | — | bảng `agreements` insert, update |

Hai ô của thoả thuận kết nối (`readAgreements`, `manageAgreements`) là câu Hỏi-1 cho chủ kho (sổ quyết định): máy khuyên
mọi vai đọc được, chỉ Quản trị sàn thêm và sửa; lối khác là chỉ Quản trị sàn đọc, hay để cả Trưởng nhóm ghi.

### Bài kiểm (đếm ô)

- **Thuần** (`src/modules/identity/permissions.test.ts`): mỗi thao tác sống × 15 tổ hợp vai (mọi tập con khác rỗng của
  bốn vai) ra đúng phạm vi rộng nhất; số assert = số thao tác sống × 15.
- **API** (`tests/db/bang-quyen-api.db.test.ts`, Postgres của dãy): một sàn có bốn người, mỗi người một vai, cộng một người
  của sàn khác và người X — Quản trị sàn ở sàn khác nhưng chỉ là Đầu chủ ở sàn này (ô của X theo vai ở sàn của phiên); mỗi cửa API sống × bốn vai gọi thật qua bộ xử lý của route với phiên thật → được (2xx hay lỗi nghiệp vụ
  không phải 403) hay `403 forbidden` đúng như ô; số kết quả khớp = số ô API (cửa × 4).
- **Cơ sở dữ liệu** (`tests/db/bang-quyen.db.test.ts`): mỗi cửa cơ sở dữ liệu sống × bốn vai, gọi qua cửa `withCompany`
  dưới vai API → được hay bị từ chối đúng như ô; bản `app.permissions` khớp từng dòng với bảng sinh.
- **Không cửa nào ngoài bảng**: bài quét liệt mọi route trong `src/app/api/v1/**/route.ts` (mọi phương thức xuất ra) và
  mọi quyền của vai API trong cơ sở dữ liệu (`has_function_privilege`, `has_table_privilege` cho select, insert, update,
  delete trên các lược đồ của sản phẩm); mỗi cửa phải có ít nhất một dòng sống hay một dòng `exempt`, và mỗi cửa khai trong
  bảng phải có thật. Cặp phá thử trên bản sao: thêm một route ghi mới, một hàm ghi cấp cho vai API, một quyền insert
  trên bảng → đỏ, thông điệp nêu tên cửa.

## Không làm ở vòng này

- Màn «Vai nào làm được gì» và nhật ký quản trị: hàng 19a. Vòng này không dựng màn nào.
- Phần thi hành trạng thái bản ghi ở API và cơ sở dữ liệu: hàng đầu tiên có thao tác theo trạng thái.
- Phạm vi Nhóm: 0016 để sau MVP.
- Sàn tự thu hẹp quyền trong khuôn (điểm chọn của sàn): khai và màn chỉnh chờ điều kiện có sàn thứ hai (0016).
- Đổi bộ kiểm trình duyệt theo vai: hàng 9b.
- Khoá người, bàn giao, xoá dữ liệu cá nhân: hàng 18a, 18b.

## Rủi ro

- Thu luật đọc `company_members` có thể làm gãy chỗ đang đọc thẳng bảng: chỉ có một, câu lấy tên người mời trong thư mời,
  đọc dòng của chính người gọi — vẫn được. Bài kiểm của hàng 9 (`moi-nguoi.db.test.ts`) và bài trình duyệt Thành viên chạy
  lại trên cây mới.
- Bản chép trong cơ sở dữ liệu có thể lệch bảng: bài so dòng chặn.
- Bộ sinh mở rộng nằm ở `tools/` (hạng cao): chờ giám sát cho chạm. Không được thì lối lùi là một tệp bảng viết tay trong
  mô-đun danh tính kèm bài so với `actions.yaml` — rẻ hơn nhưng có hai bản.
