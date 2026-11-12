# Thiết kế — bộ nút theo quyền (hàng 9e)

Ngày 2026-11-12 · dãy V · hạng T3 (chạm `src/modules/identity/**`, `ontology/**`, `tools/coverage_matrix/**`).

## Vì sao

Chủ kho, phiên giám sát 2026-11-12: «phân quyền CRUD ở mọi màn… cấu trúc ux/ui của bộ nút không được suy nghĩ từ đầu» và
«build bộ nút theo quyền, ví dụ như thêm một căn vào, xoá một căn đi,… tương tự thêm một liên hệ, xoá một liên hệ».

Quỹ hàng (`/Users/manhphan/dev/onehub-quy-hang`, main 1729b11f, chỉ đọc) gặp đúng chỗ ấy khi chạy thử: bốn cách gắn quyền cho
nút, nút hiện rồi máy chủ từ chối (đổi trạng thái hàng loạt, thanh Gửi, Nhập Excel), cùng một việc đặt khác chỗ theo màn và
theo khổ, hai vai không có nút tạo. Rà soát của giám sát:
`/Users/manhphan/dev/onehub-inventory/.acceptance-runs/dieu-phoi-nen/trinh/bo-nut-theo-quyen-ra-soat.md`.

Kho này hôm nay: bảng quyền `ontology/actions.yaml` và hàm `allowedScope` (`src/modules/identity/permissions.ts`) của hàng
9a đã có nhưng chưa nút nào đọc; thanh bên (`src/app/(app)/nav.ts`) và màn Thành viên
(`src/app/(app)/members/page.tsx`) còn viết cứng vai `CompanyAdmin`; hộp thoại Thành viên gặp 403 hiện câu lỗi chung.

## Hàng này làm gì

Dựng KHUÔN chứ không dựng chức năng: luật chỗ đặt, một thành phần chung mọi nút thao tác phải đi qua, bộ kiểm đỏ khi một
nút đi đường khác, dòng nháp của bảng quyền cho các thao tác thêm và gỡ căn, liên hệ, bảng vai × màn tới cấp nút sinh từ
bảng quyền, và chuyển hai chỗ đang viết cứng vai. Chức năng thêm căn, gỡ căn, thêm và gỡ liên hệ thật là của hàng 12, 18b
và màn Liên hệ; các hàng ấy chỉ khai tên thao tác và đặt nút theo luật này.

### 1. Luật chỗ đặt (vào `design/behaviors.md`, mục mới «Bộ nút theo quyền»)

| Nút | Chỗ | Máy tính | Điện thoại |
|---|---|---|---|
| Thêm thứ chính của màn (thêm căn, thêm liên hệ) | theo Hỏi-2 | một nút chính, chữ «Thêm <danh từ>» | cùng chỗ, cùng chữ |
| Nút của vùng (việc trên cả vùng) | đầu vùng, bên phải | nút phụ cạnh nút chính | gập vào «…» của vùng khi quá một nút |
| Thao tác trên một dòng | theo Hỏi-3 | cuối dòng | cuối thẻ |
| Thao tác trong hồ sơ | đầu hồ sơ, bên phải | một nút chính (Sửa) + «…» | như máy tính |

Trong mọi «…»: việc thường trước, việc gỡ sau cùng, tách bằng một vạch, chữ đỏ. Việc gỡ luôn qua hộp xác nhận (Hỏi-5),
nút của hộp mang đúng động từ + danh từ (`design/language.md`). Nút không có quyền: theo Hỏi-4 cho phạm vi «của tôi»; vai
không có ô trong bảng quyền thì không thấy nút, «…» không còn việc nào thì không có «…».

### 2. Một thành phần chung

- `PermittedAction` ở `src/modules/identity/ui/` (cửa `ui` của mô-đun danh tính): nhận tên thao tác (kiểu `ActionName` sinh từ
  bảng quyền) và «bản ghi này của tôi không», đọc vai của phiên từ một ngữ cảnh dựng ở `src/app/(app)/layout.tsx`, trả một
  trong ba: hiện · ẩn · (nếu chủ kho chọn O2) mờ kèm lý do. Hàm quyết thuần nằm ở `src/modules/identity/permissions.ts`
  (`actionVisibility`), cạnh `allowedScope`, để máy chủ và màn đọc cùng một luật.
- `RowActions` và `RecordActions` ở `src/components/candidate/`: nhận danh sách việc đã quyết, dựng «…» theo luật mục 1.
  `DataRegion` thêm khe thao tác dòng (cột cuối) dùng `RowActions`; thêm khe là mở rộng khuôn Lưới, không đẻ khuôn thứ hai
  (quyết định 0023).
- Hộp xác nhận gỡ: `ConfirmRemove` ở `src/components/candidate/`, dựng trên AlertDialog của shadcn (cài bằng CLI vào
  `src/components/ui`, không thêm gói npm mới — `@base-ui/react` đã có; báo G trước khi cài).
- Câu «không đủ quyền»: máy chủ trả 403 → một câu riêng «Không đủ quyền làm việc này» kèm «Tải lại trang để thấy đúng các
  nút», khác câu lỗi chung, và trang làm mới để bộ nút theo bảng quyền mới. Chữ vào `ontology/labels.yaml`.

### 3. Bộ kiểm của kho (đỏ khi nút đi đường khác)

Một bài kiểm mới ở `tests/` (không sửa `eslint.config.js`) quét `src/app/**` và `src/modules/*/ui/**`:

- tệp gửi yêu cầu ghi (`method: "POST" | "PUT" | "PATCH" | "DELETE"`, hay gọi hàm ghi của `/api/v1`) mà không dựng nút qua
  `PermittedAction` → đỏ, in tên tệp;
- `PermittedAction action="X"` mà X không phải một dòng của bảng quyền → đỏ ở kiểm kiểu (kiểu sinh) và ở bài quét;
- `roles.includes("…")` hay `roles: [...]` viết cứng trong `src/app/**` → đỏ, in tên tệp.

Mỗi luật có cặp hai chiều trên cùng một tệp mẫu (lành → xanh, phá → đỏ với tên luật).

### 4. Dòng nháp của bảng quyền (đổi `ontology/**` — xin G, chủ kho soi)

Theo quyết định 0016 «xoá tách theo nghĩa nghiệp vụ»; trạng thái `planned`, hàng mở cửa thật quyết lại từng ô:

| Thao tác | Nghĩa | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|---|
| withdrawListing | Ngừng bán (sang Ngừng hẳn) | của tôi | — | toàn sàn | — |
| removeListingCreatedByMistake | Gỡ căn tạo nhầm | của tôi | — | toàn sàn | — |
| viewContacts | Xem liên hệ | toàn sàn | toàn sàn | toàn sàn | — |
| createContact | Thêm liên hệ | toàn sàn | toàn sàn | toàn sàn | — |
| updateContact | Sửa liên hệ | của tôi | của tôi | toàn sàn | — |
| mergeContacts | Gộp liên hệ | — | — | toàn sàn | — |
| removeContactCreatedByMistake | Gỡ liên hệ tạo nhầm | của tôi | của tôi | toàn sàn | — |
| eraseContactPersonalData | Xoá tên và số theo yêu cầu | — | — | toàn sàn | — |

`createListing`, `updateListing`, `viewListings` đã có từ hàng 9a. Quản trị sàn không có ô nào ở đây: 0016 «Quản trị sàn lo
người và cấu hình, không tự có quyền xem hàng hay số chủ». Nếu chủ kho chọn H1 ở Hỏi-1, hai dòng gỡ căn gộp thành một dòng
`removeListing` và hai dòng gỡ liên hệ thành `removeContact`, và hộp xác nhận hỏi lý do (X2).

### 5. Vai × Màn tới cấp nút

`tools/coverage_matrix` thêm một lệnh sinh: với mỗi màn của `design/screens.yaml`, lấy các tên thao tác các nút trên màn ấy
khai (quét `PermittedAction` trong thư mục của màn), tra bảng quyền, in một bảng màn × vai, mỗi ô là danh sách nút hiện kèm
phạm vi. Tệp sinh nằm cạnh sổ màn (đường cụ thể xin G cùng lần xin `ontology/**`); lệch với bảng quyền thì `make check` đỏ.
Khối «Vai × Màn» của hợp đồng các hàng sau trỏ tới bảng sinh thay cho chữ tự do.

### 6. Hai chỗ đang viết cứng

- `nav.ts`: mục Thành viên khai `action: "listMembers"` thay cho `roles: ["CompanyAdmin"]`; `visibleNav` (khuôn App Shell)
  hiện mục khi `allowedScope(roles, action) !== null`. Mục không khai thao tác vẫn hiện với mọi vai như nay.
- `members/page.tsx`: chặn bằng `allowedScope(session.roles, "listMembers")`; nút «Mời» và «Đổi vai» đi qua
  `PermittedAction` (`inviteMember`, `changeMemberRoles`); hộp thoại gặp 403 hiện câu «không đủ quyền» của mục 2.

## Từ Quỹ hàng

- Giữ: luật «một nút chính, tối đa hai phụ, còn lại vào «…»» của `DauMan`
  (`apps/web/src/components/bo-cuc/dau-man.tsx:22`, ADR-0024 dòng 52–66); hộp xác nhận là AlertDialog; gỡ là sự kiện, không
  xoá dòng (ADR-0008, ADR-0012, ADR-0014).
- Bỏ: bốn cách gắn quyền (so tên vai trong trang, `navigationFor().actions`, cờ của lõi, cờ do API trả) — thay bằng một
  thành phần đọc một bảng. Bỏ «nút hiện rồi máy chủ từ chối» bằng bộ kiểm mục 3.
- Thêm: câu «không đủ quyền» riêng (ADR-0024 dòng 78 để lại sau); luật cho phạm vi «của tôi».

## Bản bấm được

`/proto/bo-nut-theo-quyen` (chỉ bản dev, dữ liệu mẫu, không gọi API ghi), dãy V chạy ở cổng 3489. Bảng chọn trên đầu đổi
vai, màn (Bảng hàng · Liên hệ) và từng ứng viên; `?bang=an` ẩn bảng chọn để chụp. Ảnh: `evidence/ban-bam/`. Bảng quyền nháp
của bản mẫu nằm ở `src/app/(app)/proto/bo-nut-theo-quyen/draft-permissions.ts` và đi qua đúng hàm `allowedScope` của 9a.

## Ứng viên ReUI (quyết định 0023)

| Chỗ | Ứng viên | Ảnh |
|---|---|---|
| Nút thêm (Hỏi-2) | A `data-grid-base-1` / `solution-crm-3` (đầu vùng) · B `data-grid-base-7` (một dòng cùng ô tìm — cũng là khe `action` của `RegionToolbar` đang có) · C khe nút của `PageHeader` (đầu màn) | `thanh-A.png`, `thanh-B.png`, `thanh-C.png` |
| Thao tác trên dòng (Hỏi-3) | R1 «…» cuối dòng (`data-grid-base-1`, `solution-users-1`) · R2 nút Sửa + «…» (`data-grid-base-7`) · R3 không nút trên dòng, việc nằm trong hồ sơ | `dong-R1/R2/R3.png`, `dong-R3-ho-so.png` |
| Hộp xác nhận gỡ (Hỏi-5) | X1 `c-alert-dialog-5` · X2 `c-alert-dialog-8` (chọn lý do) · X3 `c-dialog-7` (kể hậu quả) | `hop-X1/X2/X3.png` và bản 414 |

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: người mở màn danh sách → thấy nút thêm ở chỗ đã chốt và «…» trên dòng → chọn việc → việc thường chạy ngay, việc
  gỡ mở hộp xác nhận → bấm nút động từ → thông báo kết quả (điểm ra: danh sách đã đổi).
- Biên: vai không có ô → không thấy nút, «…» rỗng thì không có «…»; vai không xem được vùng → trạng thái «Không đủ quyền»
  của vùng (đã có trong `DataRegion`); phạm vi «của tôi» trên dòng của người khác → theo Hỏi-4.
- Lỗi & quay lại: máy chủ trả 403 (bảng quyền vừa đổi, vai vừa đổi) → câu «Không đủ quyền làm việc này» + «Tải lại trang để
  thấy đúng các nút», trang làm mới; lỗi khác → câu lỗi chung như nay.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| members | Quản trị sàn xem và mời người, đổi vai | thanh bên (mục Thành viên, đọc bảng quyền) / hộp mời, hộp đổi vai |
| proto bo-nut-theo-quyen | mẫu chạy của khuôn bộ nút, không phải màn sản phẩm | gõ địa chỉ ở bản dev |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-members-forbidden-nav | members | mục Thành viên không có trên thanh bên của vai không có `listMembers` | không gì; mục không tồn tại với vai ấy |
| ST-members-refused | members | câu «Không đủ quyền làm việc này» + «Tải lại trang để thấy đúng các nút» trong hộp thoại | đóng hộp, trang tự làm mới |
| ST-proto-row-menu-empty | proto | dòng không có «…» khi vai không còn việc nào trên dòng ấy | mở hồ sơ để xem |
| ST-proto-own-other | proto | việc của phạm vi «của tôi» trên dòng người khác: ẩn (O1) hoặc mờ kèm lý do (O2) | nhờ người giữ hoặc Trưởng nhóm |
| ST-proto-confirm-remove | proto | hộp xác nhận gỡ theo Hỏi-5, nút mang động từ + danh từ | bấm động từ hoặc Huỷ |
| ST-proto-forbidden-region | proto | vùng «Bạn chưa có quyền xem vùng này» cho Quản trị sàn | hỏi quản trị sàn |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- «…» mở bằng bàn phím (Enter, Space), mũi tên đi trong menu, Esc đóng và trả focus về «…» (DropdownMenu của shadcn).
- Hộp xác nhận: focus đầu ở «Huỷ», Esc = Huỷ; trên điện thoại hai nút xếp dọc, nút động từ ở trên.
- Nút bị mờ (chỉ khi chủ kho chọn O2) không nhận bấm và đọc được lý do bằng trình đọc màn hình.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DropdownMenu, Button (shadcn) | dùng | đã cài, giữ nguyên |
| AlertDialog (shadcn) | dùng (cài mới bằng CLI) | hộp xác nhận của Quỹ hàng và của ba ứng viên ReUI |
| DataRegion | mở rộng (khe thao tác dòng) | một nhu cầu một lời giải: không dựng lưới thứ hai |
| RegionToolbar, PageHeader | dùng | khe nút đã có |
| PermittedAction, RowActions, RecordActions, ConfirmRemove | tạo (ghép từ thành phần trên) | kho chưa có; ReUI chỉ có khối trọn, không có thành phần đọc quyền |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: màn đích (Bảng hàng, Liên hệ, Thành viên) đều là danh sách mở hồ sơ cạnh bên (hàng 3, «Lấy B có ghim»); bộ nút chỉ
đặt vào các chỗ của khuôn ấy, không đổi khuôn.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn |
| Việc chính | thêm, sửa, gỡ bản ghi của danh sách, chỉ bằng nút mình được dùng |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## Sống chung với hàng 2a và hàng 3

Hai hàng ấy đang sửa `src/components/candidate/**` (Lưới dùng tay như Sheet, hồ sơ ngăn nổi). Hàng này không sửa tệp nào của
họ trước khi cả hai vào nhánh chính; khi đó gộp `origin/main` một lần rồi mới dựng. Khe thao tác dòng là cột cuối của
`DataRegion`, đứng ngoài vùng sửa trên ô của 2a; phím mũi tên của 2a đi qua cột ấy như một ô không sửa được. Đầu hồ sơ ngăn
nổi của hàng 3 nhận `RecordActions` ở bên phải, cạnh nút ghim.
