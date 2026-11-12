# Thiết kế — Lưu góc nhìn ở cột thứ hai (hàng 2c)

Hồ sơ `luu-goc-nhin-cot-hai` · hạng T3 (bảng dữ liệu mới) · dãy K · ngày 2026-11-12.

## Vì sao

Ở Sheet mỗi khu một tab: mở tab là thấy đúng các dòng, đúng cột, đúng thứ tự. Bảng hàng của hàng 2a đã có lọc, tìm, sắp
xếp, nhóm theo toà và ẩn hiện cột, nhưng mọi thứ ấy mất khi rời trang (sổ 2a: «cách xem khác chỉ sống trong phiên, không
lên địa chỉ, không lưu trên máy»). Hàng này cho Đầu chủ đặt tên một cách xem, thấy nó thành một mục ở cột thứ hai của App
Shell, bấm là mở lại đúng cách xem ấy. Chủ kho mở hàng riêng ngày 2026-11-12 («Có, tách hàng riêng»), tách khỏi mục gác
L7/H7 của phạm vi MVP.

Kèm hai lỗi chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng của 2a: Ngoài-4 (lọc ra rỗng thì ô tìm và ô lọc cột biến
mất) và Ngoài-5 (rời trang khi đang toàn màn hình thì App Shell ẩn tới khi tải lại). Cả hai nằm đúng chỗ hàng này phải
sửa: lưới dùng chung và chế độ tập trung của App Shell.

## Từ Quỹ hàng

Quỹ hàng đặt góc nhìn ở cột thứ hai của nhà Bảng hàng («góc nhìn của đội, của tôi, + Lưu góc nhìn»,
`docs/design/vo-va-ia.md` §1) và thêm nút «Góc nhìn ▾» đầu thanh công cụ (ứng viên ReUI `solution-dev-ops-2`). Góc nhìn
lưu trên máy theo người và sàn; góc nhìn của đội để một hàng sau (`docs/plan/ra-soat-crud-phan-quyen.md:54`).

- Giữ: chỗ đặt ở cột thứ hai, tên «góc nhìn», một góc nhìn gồm lọc, cột, sắp xếp, cách nhóm.
- Đổi: chỗ lưu. Kho này chưa cho giữ bản sao dữ liệu của sàn trên máy (AGENTS.md: «no copy of company data kept on the
  device»); lọc mang tên toà, giá, nên góc nhìn là dữ liệu của sàn. Máy khuyên lưu trên máy chủ (Hỏi-1).
- Chưa quyết: của riêng hay cả sàn (Hỏi-2) — Quỹ hàng làm riêng trước, đội sau.

## Góc nhìn là gì

Một góc nhìn = tên + năm thứ của Bảng hàng lúc lưu: chữ trong ô tìm, lọc từng cột, sắp xếp, có nhóm theo toà hay không,
các cột đang ẩn. Không gồm: toàn màn hình (là chế độ, không phải cách xem), ô đang chọn, nhóm nào đang mở, vị trí cuộn.

Tên khái niệm: `SavedView` («Góc nhìn»), khái niệm riêng của kho. RESO có `SavedSearch` nhưng là tiêu chí tìm của khách để
báo căn mới; dùng lại tên ấy là sai nghĩa (AGENTS.md cấm). Thêm vào `ontology/` (thực thể, nhãn, bảng thuật ngữ) cần giám
sát duyệt chạm tệp và chủ kho soi trong PR.

## Cách làm

1. **Lưới dùng chung** (`src/components/candidate/data-region.tsx`, `grid-view.ts`): thêm kiểu `GridView` (năm thứ trên),
   hai cửa `initialView` và `onViewChange`; lưới mở với góc nhìn được giao và báo mỗi lần cách xem đổi. Một hàm so hai
   góc nhìn (`sameView`) cho dấu «đã đổi». Cùng tệp sửa Ngoài-4: khi lọc ra rỗng, thanh công cụ, ô tìm và hàng ô lọc cột
   ở nguyên chỗ (vẽ lưới với thân rỗng), câu «Không căn nào khớp» nằm trong thân lưới; ô tìm không dựng lại nên giữ focus.
2. **App Shell** (`src/components/templates/`, `src/app/(app)/layout.tsx`, `nav.ts`): (a) layout đọc góc nhìn của người
   xem trên máy chủ và đưa chúng thành một nhóm mục của Bảng hàng trong cấu hình điều hướng, nên cột máy tính và cột trong
   ngăn trượt điện thoại có mục ngay lần vẽ đầu; mục sáng lên theo luật sẵn có (địa chỉ khớp đúng, gồm phần sau dấu hỏi);
   lưu, đổi tên, xoá xong thì làm mới trang. Dấu «đã đổi» đi qua một ngữ cảnh nhỏ phía trình duyệt của App Shell. (b) Ngoài-5: chế độ tập trung tự tắt khi đường dẫn đổi và khi vùng xin nó rời
   màn (dọn khi gỡ), nên quay lại bằng phím hay cử chỉ không để App Shell ẩn.
3. **Mô-đun listings**: `server.ts` đọc, ghi góc nhìn qua `withCompany`; ba cửa `/api/v1/saved-views` (thêm), `…/[id]`
   (đổi tên, lưu thay đổi, xoá). Bảng `saved_view` có `company_id`, người lưu, tên, góc nhìn (jsonb đã kiểm khuôn), bật cách
   ly theo dòng ngay trong migration; số migration 009 (giám sát cấp).
4. **Bảng hàng** (`src/app/(app)/inventory/`): `?goc-nhin=<id>` mở góc nhìn; trang đọc danh sách của người xem, đưa vào
   khe cột thứ hai và giao góc nhìn cho lưới. Góc nhìn không có (đã xoá, của người khác) thì mở Bảng hàng trống lọc kèm
   một câu báo.
5. **Bộ nút** theo khuôn hàng 9e đã duyệt: nút lưu là nút của vùng; việc trên một mục nằm trong «…» cuối mục (Đổi tên; vạch;
   Xoá góc nhìn chữ đỏ, cuối); xoá qua hộp xác nhận ngắn, focus đầu ở «Thôi», nút mang đúng «Xoá góc nhìn»; người không
   được làm thì không thấy nút. Bốn thao tác (đọc danh sách, lưu, đổi tên và lưu thay đổi, xoá) vào bảng quyền với phạm vi «của tôi» cho
   các vai đọc được Bảng hàng (Đầu chủ, Đầu khách, Trưởng nhóm — Quản trị sàn bị chặn ở Bảng hàng từ hàng 2a), qua
   `PermittedAction` của 9e.

Trình tự dựng: chờ hàng 3 (hồ sơ căn, cùng sửa `data-region.tsx`) và hàng 9e (bộ nút, bảng quyền) vào nhánh chính, gộp
nhánh chính về một lần, rồi mới viết mã.

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → lọc, sắp, nhóm, ẩn cột → «Lưu góc nhìn» → đặt tên → mục mới hiện ở cột thứ hai, sáng lên, địa chỉ
  mang góc nhìn (điểm ra: Bảng hàng đang ở góc nhìn vừa lưu). Lần sau: bấm mục ở cột thứ hai → đúng tập dòng, thứ tự,
  nhóm, cột; tải lại hay mở ở máy khác vẫn vậy.
- Đổi rồi lưu: đang ở một góc nhìn, đổi lọc → mục mang dấu «đã đổi»; «Lưu thay đổi» ghi đè, «Lưu thành góc nhìn mới» tạo
  mục khác; bấm lại mục ấy (hay mục khác) thì bỏ thay đổi chưa lưu (Hỏi-5).
- Biên: chưa có góc nhìn nào → câu gợi ý trong nhóm; tên trống hay trùng → báo ngay dưới ô; lọc ra rỗng → vẫn sửa riêng
  từng luật lọc (Ngoài-4); rời trang khi đang toàn màn hình → màn kế đầy đủ App Shell (Ngoài-5).
- Lỗi & quay lại: lưu, đổi tên, xoá hỏng → hộp giữ tên đã gõ, câu lỗi, nút «Thử lại»; 403 → câu «không đủ quyền» của 9e;
  mở một góc nhìn không còn → Bảng hàng trống lọc + câu báo.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| inventory | xem căn của sàn theo cách xem mình cần, lưu cách xem ấy | cột biểu tượng, mục góc nhìn ở cột thứ hai / hồ sơ căn |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-views-empty | inventory | nhóm «Góc nhìn của tôi» với câu «Chưa có góc nhìn nào. Lọc, sắp xếp hay ẩn cột rồi bấm «Lưu góc nhìn».» | lọc rồi lưu |
| ST-inventory-view-open | inventory | mục góc nhìn sáng ở cột thứ hai, đầu màn mang tên góc nhìn, lưới đúng cách xem | làm việc trên lưới |
| ST-inventory-view-changed | inventory | mục đang mở mang dấu «đã đổi»; nút lưu có «Lưu thay đổi» và «Lưu thành góc nhìn mới» | lưu hay bỏ |
| ST-inventory-view-missing | inventory | Bảng hàng trống lọc + câu «Góc nhìn này không còn» | chọn mục khác |
| ST-inventory-view-save-failed | inventory | hộp giữ tên, câu lỗi, nút «Thử lại» | thử lại hay thôi |
| ST-inventory-view-refused | inventory | câu «không đủ quyền» + «Tải lại trang để thấy đúng các nút» (9e) | tải lại |
| ST-inventory-no-match | inventory | thanh công cụ, ô tìm, ô lọc cột ở nguyên chỗ; thân lưới «Không căn nào khớp» + «Xoá lọc» | sửa một luật lọc hay xoá hết |
| ST-inventory-views-loading | inventory | nhóm góc nhìn hiện ba dòng khung trong lúc đọc (`SidebarMenuSkeleton`) | chờ |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Tên: bắt buộc, tối đa 40 ký tự, không trùng (không phân biệt hoa thường) trong danh sách của chính người lưu; Enter lưu,
  Esc đóng, focus trả về nút đã mở hộp.
- Mục trong cột: một dòng, tên dài cắt bằng «…» và hiện đủ khi rê; «…» hiện khi rê hay khi focus bằng phím; mũi tên đi trong
  menu, Esc đóng và trả focus về «…».
- Xoá góc nhìn đang mở → về «Tất cả căn»; xoá góc nhìn khác → giữ nguyên chỗ đang xem.
- Điện thoại: cột thứ hai nằm trong ngăn trượt như hiện nay; nút lưu ở thanh công cụ của vùng (khổ 360, 414 theo luật bố trí
  của 2a).
- Góc nhìn mang cột không còn (cột bị bỏ sau này) → bỏ phần ấy, mở phần còn lại.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| `SidebarGroup`, `SidebarMenuSub*`, `SidebarGroupAction`, `SidebarMenuAction`, `SidebarMenuBadge` (shadcn) | dùng | cột thứ hai của App Shell đã dựng bằng chúng |
| `DataRegion` (candidate) | mở rộng | thêm `initialView`, `onViewChange`; sửa Ngoài-4 tại chỗ |
| `FormDialog` (candidate) | dùng | hộp đặt tên và đổi tên — khuôn hộp biểu mẫu sẵn có |
| Hộp xác nhận xoá, `PermittedAction`, «…» của dòng (9e) | dùng | khuôn bộ nút chủ kho đã duyệt ở 9e |
| `DropdownMenu` (shadcn) | dùng | «…» của mục; menu «Góc nhìn ▾» nếu chọn S3 |
| Nhóm mục động ở cột thứ hai (`NavSection` sẵn có, dữ liệu theo người xem) | mở rộng | dùng đúng mục con của cột thứ hai (1o), cả cột một kiểu; «…», số đếm và dấu «đã đổi» qua lớp bọc ngoài |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: cột thứ hai là danh sách các cách xem, vùng làm việc là chi tiết (Bảng hàng theo cách xem ấy) — đúng khuôn App Shell
`app-shell-8` đã chọn ở hàng 1o; Quỹ hàng đặt góc nhìn cùng chỗ (`docs/design/vo-va-ia.md` §1). Không tra thêm: chỗ đặt đã
có căn cứ hai kho.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ (Đầu khách, Trưởng nhóm cũng lưu được góc nhìn của mình; Quản trị sàn không đọc Bảng hàng) |
| Việc chính | mở nhanh lại một cách xem Bảng hàng hay dùng, thay cho tab của Sheet |
| Tần suất | mỗi ngày nhiều lần |
| Số bản ghi | vài chục góc nhìn mỗi người |
| Thiết bị | máy tính (điện thoại đọc được) |
<!-- UX-SPEC-TEMPLATE>>> -->

## Ứng viên cho chủ kho chọn (bản bấm được `/proto/luu-goc-nhin`)

| Câu | Ứng viên | Địa chỉ trên bản bấm được |
|---|---|---|
| Danh sách ở cột thứ hai | L1 `c-sidebar-1` — nhóm có tiêu đề, mỗi mục một dòng, «…» khi rê · L2 như L1 kèm số căn mỗi góc nhìn (kiểu hộp thư của `c-sidebar-1`) | `?ds=l1` · `?ds=l2` |
| Cách lưu | S1 nút «Lưu góc nhìn» ở thanh công cụ của vùng → hộp đặt tên · S2 dấu «+» ở tiêu đề nhóm trong cột thứ hai → hộp đặt tên · S3 nút «Góc nhìn ▾» ở thanh công cụ (`solution-dev-ops-2`, Quỹ hàng) gồm danh sách, «Lưu góc nhìn…», «Lưu thay đổi» | `?luu=s1` · `?luu=s2` · `?luu=s3` |
| Của ai | Riêng người lưu (một nhóm) · Cả sàn (thêm nhóm «Góc nhìn của sàn») | `?chung=rieng` · `?chung=ca-san` |

## Câu hỏi cho chủ kho (Cổng Phạm vi)

Đã chốt 2026-11-12 (Manh Phan): duyệt theo khuyến nghị cả năm câu — Hỏi-1 máy chủ, Hỏi-2 riêng người lưu, Hỏi-3 L1
không số, Hỏi-4 S1, Hỏi-5 không tự lưu; cả cột thứ hai một kiểu mục.

- Hỏi-1 · Lưu ở đâu. Khuyên: trên máy chủ — mở ở máy nào cũng thấy, hợp luật kho không giữ dữ liệu sàn trên máy; giá: một
  bảng dữ liệu mới, hàng thành T3. Lối khác: lưu trên trình duyệt như Quỹ hàng — không cần bảng mới, nhưng phạm luật «không
  giữ dữ liệu của sàn trên máy», đổi máy là mất, và phải xoá khi đăng xuất.
- Hỏi-2 · Góc nhìn của riêng người lưu hay cả sàn cùng thấy. Khuyên: riêng người lưu — mỗi Đầu chủ giữ khu của mình, không
  ai sửa xoá được góc nhìn của người khác, quyền chỉ một ô «của tôi». Lối khác: cả sàn thấy (như tab Sheet dùng chung) — cần
  chốt thêm ai được thêm, sửa, xoá góc nhìn của sàn (thêm dòng bảng quyền), thêm một nhóm ở cột thứ hai.
- Hỏi-3 · Danh sách ở cột thứ hai: L1 hay L2. Khuyên L1 — gọn, giống các mục trạng thái đang có (chưa mang số); L2 cho
  thấy số căn mỗi góc nhìn nhưng số ấy phải tính lại mỗi khi căn đổi, và các mục trạng thái cũng nên có số cho đồng bộ.
- Hỏi-4 · Cách lưu: S1, S2 hay S3. Khuyên S1 — nút của vùng đúng chỗ khuôn 9e đặt nút của vùng, người thấy nút ngay khi vừa
  lọc xong; S3 gom mọi việc vào một menu nhưng giấu nút lưu một lớp; S2 đặt nút xa chỗ vừa lọc.
- Hỏi-5 · Đổi một góc nhìn đang mở rồi rời đi: khuyên không tự lưu — mục mang dấu «đã đổi», người bấm «Lưu thay đổi» mới
  ghi; lối khác: tự lưu mọi thay đổi (như Sheet) — không có đường quay về góc nhìn cũ.

## Ngoài phạm vi

- Góc nhìn cho màn khác (Đã gửi, Liên hệ): khe cột thứ hai và `GridView` dùng lại được, nhưng mỗi màn là một hàng sau.
- Sắp thứ tự mục bằng kéo thả, ghim góc nhìn lên điện thoại, đặt góc nhìn mặc định khi mở Bảng hàng.
- Chia sẻ góc nhìn bằng link cho người ngoài sàn: không bao giờ (SP-4).
- Sửa hàng loạt (phần còn lại của L7).

## Luật sản phẩm chạm

SP-1: bảng mới mang `company_id`, bật cách ly theo dòng ngay trong migration, đọc ghi qua `withCompany`; bộ kiểm cách ly
thêm một ca cho bảng này. Không chạm SP-3, SP-4.
