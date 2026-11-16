# Bảng hàng trên dữ liệu thật — thiết kế (hàng 10, `bang-hang-du-lieu-that`)

Ngày: 2026-11-15 · Hạng: T3 · Dãy R, đợt «dieu-phoi-nen» · Câu giao: «Đầu chủ đăng nhập và thấy, sửa được hàng thật của
sàn mình trên Bảng hàng» — chặng 4: nối màn đã dựng với lược đồ và API thật.

## 1. Điều đang có, điều còn thiếu

Hôm nay Bảng hàng, hồ sơ căn, ô ⌘K và (sau 2d) cây địa lý đều đọc **một bộ dữ liệu mẫu chung** dựng trong bộ nhớ
(`src/app/(app)/inventory-sample-rows.ts`, `src/modules/listings/sample.ts`): mọi sàn thấy cùng 60 căn của «[MAU]». Sửa
giá và trạng thái trên ô (hàng 4) ghi vào bộ mẫu qua **cổng lưu** `ListingSaveDoor` (`src/modules/listings/save-door.ts`),
mất khi tải lại. Người giữ căn là giả (`sampleKeeperOf`). Lược đồ (`db/migrations/001`–`011`, 012 của hàng 19) **chưa có
bảng căn chào nào**; danh mục căn chung (007) và lớp riêng của sàn (010) đã có.

Đã sẵn để cắm: lưới nhận cổng lưu từ ngoài (`InventoryGrid door=`), luật sửa thuần (`edit-rules.ts`, `applyChange`), luật
đọc lỗi ghi dùng chung (`src/lib/write-failure.ts`: mất mạng · 403 · 409), cửa truy vấn theo sàn `withCompany`, khuôn
API của góc nhìn đã lưu (`saved-views-http.ts`), bảng quyền trong cơ sở dữ liệu (`app.permissions`, `app.allowed`).

## 2. Tri thức và luật đã nạp

- Luật sản phẩm (`PRODUCT-INVARIANTS.md`, ba luật): SP-1 chạm trực tiếp — bảng mới có `company_id`, ép luật theo dòng,
  mọi truy vấn qua `withCompany` dưới vai không chủ bảng; SP-3, SP-4 không chạm (không gửi, không trang khách).
- Trang tri thức `wiki/chu-de/bang-hang.md` (kho tri thức trong `docs/tri-thuc`): «thường chỉ vài người sửa, cả đội xem»;
  cuộn liền không chia trang; sàn 5.000 căn từng làm bảng Quỹ hàng sập.
- Quyết định 0016 (bảng quyền), 0027 (vai nối không chủ), 0028 (⌘K gợi ý từ các dòng đã đọc), 0029 (hàng 10 thêm
  `custom_fields`, gọi hàm kiểm giá trị khi ghi), 0030 (hàng 10 chốt cửa vào và Quản trị sàn), 0036 của 2d (cây phải dựng
  từ đúng các dòng đọc cho sàn đang đăng nhập).

## 3. Nợ dồn về hàng 10 — làm gì, hoãn gì

| Nợ (nguồn)                                                                       | Ở hàng 10                                                                                                                             | Vì sao                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Người không giữ căn vẫn đưa căn lên «Đang bán» (hàng 4, mở hợp đồng mới 1)       | **Làm** — AC-5                                                                                                                        | Bảng quyền đã có ô `activateListing` (Đầu chủ: căn mình giữ hoặc chưa ai giữ; Trưởng nhóm: toàn sàn); đường ghi thật là chỗ đầu tiên giữ được nó ở máy chủ và cơ sở dữ liệu                                                                                                                                            |
| Bản thử cho chọn vai bằng `?vai=` khi chưa đăng nhập (hàng 4, mở hợp đồng mới 2) | **Làm** — AC-9, cách làm theo **Hỏi-6**                                                                                               | Phải xong trước khi bất kỳ bản nào mang dữ liệu thật (LUAT). 11 tệp bài trình duyệt không cơ sở dữ liệu đang mở Bảng hàng trên bộ mẫu: khuyên giữ chế độ mẫu chỉ khi máy không cấu hình cơ sở dữ liệu (dữ liệu thật và cửa thay vai không bao giờ cùng có mặt); lối khác là chuyển cả 11 tệp sang làn có cơ sở dữ liệu |
| Hoàn tác giá sau đổi trạng thái hiện trạng thái cũ (hàng 4, mở hợp đồng mới 3)   | **Làm** — AC-6                                                                                                                        | Đường ghi thật trả bản ghi mới nhất; hoàn tác ghi lại đúng trường đã đổi trên phiên bản mới nhất                                                                                                                                                                                                                       |
| Quản trị sàn thiếu `viewListings` (0030, Hỏi-6 của 19)                           | **Câu hỏi Hỏi-1**                                                                                                                     | Vai này «không thấy hàng theo mặc định» trong `ontology/roles.yaml`; mở hay không là quyết định của chủ kho                                                                                                                                                                                                            |
| Căn nhập từ Sheet «chưa có đầu chủ giữ» (7e, hàng 11)                            | **Làm phần lược đồ** — cột người giữ căn để trống được; luật «chưa ai giữ» trong ô `activateListing`. Nhận căn chưa ai giữ: **Hỏi-4** | Nhập là hàng 11; hàng 10 chỉ cần lược đồ và luật quyền nhận được căn không người giữ                                                                                                                                                                                                                                   |
| ⌘K đọc từ mẫu của một sàn (3f)                                                   | **Làm** — AC-3                                                                                                                        | SP-1                                                                                                                                                                                                                                                                                                                   |
| Đo «Bảng hàng chỉ còn hàng của sàn mới» sau khi đổi sàn (1o)                     | **Làm** — AC-2                                                                                                                        | Chỉ đo được khi đọc thật                                                                                                                                                                                                                                                                                               |
| Cây địa lý đọc mẫu chung (2d, quyết định 0036)                                   | **Làm** — AC-3, khi 2d đã gộp                                                                                                         | Cây dựng từ chính các dòng trang đọc cho sàn đang đăng nhập; tên trong mã theo từ điển (`Subdivision` cho «Dự án»); toà không còn căn nào không hiện; bài «không số đếm trên mục» và «cây không thêm lần đọc» quét đủ các màn có cột thứ hai; ca bấm chuột giữa mở thẻ mới không áp nơi tại chỗ                        |
| Sửa Điều kiện phí trên ô (Hỏi-8 của 19, chủ kho chọn «để hàng 10»)               | **Làm** — AC-7                                                                                                                        | Chủ kho đã chốt ngày 14/11                                                                                                                                                                                                                                                                                             |
| Dấu mức thuế phí lúc tính trên từng giá (Hỏi-4 của 19, «để hàng 10»)             | **Câu hỏi Hỏi-5**                                                                                                                     | Cần lịch sử của mức thuế phí (bảng của 19 chỉ giữ mức đang áp); thêm bảng lịch sử là một việc riêng — máy khuyên hoãn kèm giới hạn đã biết                                                                                                                                                                             |
| Bảng quyền nháp cho ba vai sửa hàng toàn sàn (LUAT, «hàng 10 chốt»)              | **Câu hỏi Hỏi-2**                                                                                                                     | Đánh đổi giữa thói quen sổ chung và độ tin của dữ liệu                                                                                                                                                                                                                                                                 |
| Sửa giá trị trường riêng của sàn trên căn thật (7e)                              | **Lưu và hiện — làm**; sửa trên ô: **Hỏi-3**                                                                                          | 0029 đặt cột `custom_fields` ở hàng 10; sửa là thêm một kiểu ô mới                                                                                                                                                                                                                                                     |

Không làm, vì đã có hàng đích: thêm căn (12), sửa pháp lý · nội thất · tài chính · tình trạng sử dụng (3g), sửa nhanh
trên điện thoại (3d), gỡ căn (18b), bàn giao căn khi người nghỉ (18a), màn Liên hệ (13a), nhập tệp (11). Thiết kế chừa
chỗ cho 13a và 3g: bảng căn chào giữ đủ các trường của `Listing` (kể cả `legalStatus`, `financing`, `furnished`,
`occupantType`), đường `PATCH` nhận một loại thay đổi mỗi lần nên 3g thêm loại «thông tin» mà không đổi khuôn.

## 4. Ba hàng đang chờ gộp cùng chạm Bảng hàng

| Hàng (PR)                     | Chạm gì                                                                                                       | Hàng 10 làm sao để không giẫm                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 2b thẻ căn ở điện thoại (#63) | `ListingCard` dáng ngang gọn, khe danh sách điện thoại của `DataRegion`                                       | Không sửa thẻ hay khe; thẻ đọc cùng `rows` — dữ liệu thật tới thẻ không cần thêm gì                 |
| 2d cây địa lý (#65)           | `geo-tree.ts`, `use-geo-place.ts`, mục cột thứ hai qua `sections`                                             | Cây nhận `rows` và vị trí toà từ trang; hàng 10 thay nguồn của hai đầu vào ấy, không đổi luật cây   |
| 19 Thuế phí (#64)             | `inventory-fees.ts` (Về tay tính từ mức của sàn, không lưu), cột `feeInclusion` trên `Listing`, migration 012 | Bảng căn chào có cột `fee_inclusion`; Về tay vẫn tính khi đọc từ giá thật và mức của sàn, không lưu |

Thứ tự: S0–S2 làm trên main ngay; phần DỰNG chờ cả ba vào main rồi gộp main (lời dặn của giám sát). Số migration của
hàng 10 là **013** (012 là của 19).

## 5. Lối giải

### 5.1 Lược đồ (migration 013, skill `/new-migration`)

- `listings`: `id`, `company_id → companies`, `standard_status` (sáu giá trị), `list_price`, `close_price`, `close_date`,
  `withdrawn_reason`, `fee_inclusion`, `furnished`, `occupant_type`, `legal_status`, `financing`, `custom_fields jsonb`
  (đối tượng, mặc định `{}`), `list_agent_user_id → identity.users` (để trống được: «chưa ai giữ»),
  `original_entry_timestamp`, `last_confirmed_at`, `version int ≥ 1`, `created_at`, `updated_at`.
- `listing_units`: `listing_id → listings`, `company_id`, `upi → catalog_units(upi)`; một căn mỗi lần chào.
- Luật trong bảng: Đã bán phải có giá chốt và ngày bán; Ngừng hẳn phải có lý do (ràng buộc `check` trên `listings`).
  Mỗi căn tối đa một lần chào đang mở mỗi sàn: `listing_units` mang cột `open` do một trigger trên `listings` giữ
  đúng theo trạng thái (Chưa đủ, Đang bán, Đang giữ chỗ, Tạm ngừng là mở) trong cùng giao dịch, và chỉ mục duy nhất có
  điều kiện `(company_id, upi) where open`. Lối khác đã xét: hàm kiểm khi ghi — chết vì hai giao dịch đồng thời cùng
  qua được lần kiểm; chỉ chỉ mục duy nhất mới chặn được ca chạy đua.
- Ranh giới luật (một luật một chỗ): **cơ sở dữ liệu giữ quyền và luật dữ liệu**, **máy chủ giữ luật nấc**. Nấc nào
  được đi từ nấc nào, giá trần, Đã bán cần gì: chỉ ở `edit-rules.ts`/`applyChange`, máy chủ gọi trước khi ghi. Cơ sở dữ
  liệu không biết bảng chuyển nấc; nó giữ: ràng buộc dữ liệu ở trên, luật theo sàn, luật thu hẹp theo bảng quyền, và
  một trigger `before update` chặn việc đưa dòng từ nấc khác sang «Đang bán» khi `app.allowed('activateListing')` không
  phải `company` và (phạm vi «của tôi») người giữ căn không phải người của phiên mà cũng không trống. Trigger cần vì
  luật theo dòng không thấy giá trị cũ của dòng.
- Ép luật theo dòng: luật theo sàn cho bốn lệnh như mọi bảng của sàn; luật thu hẹp theo bảng quyền: đọc cần
  `app.allowed('viewListings')`, sửa cần `app.allowed('updateListing')` (phạm vi «của tôi» theo Hỏi-2 = người giữ căn là
  người của phiên hoặc trống). Máy chủ mở cửa theo thao tác của loại thay đổi; cơ sở dữ liệu giữ lần khoá thứ hai.
- Hai dòng bảng quyền đổi `planned → live`: `viewListings`, `updateListing`, `activateListing` (cửa API và cửa bảng khai
  trong `ontology/actions.yaml`), cộng ô Quản trị sàn nếu chủ kho chọn ở Hỏi-1.
- Bộ cách ly (`db/tests/cach-ly.sql`, `db/scripts/cach-ly.sh`): hai bảng mới vào danh sách bảng của sàn và danh sách luật
  thu hẹp; ca phá: bảng thiếu luật thì bộ đỏ.
- Vai nối ứng dụng `quy_hang_app` được `select, update` (không `insert`, `delete` — hàng 12, 18b mở sau).

### 5.2 Đường đọc

`src/modules/listings/server.ts` thêm `myInventory()`: qua `sessionDoor('viewListings')` và `withCompany`, đọc các lần
chào đang hiện của sàn nối `listing_units` → `catalog_units` (toà, mã căn, diện tích, số phòng ngủ, loại căn) →
`catalog_nodes` (tên dự án). Trả `{listings, listingUnits, units, keepers}` đúng kiểu của mô hình sinh sẵn, để
`inventoryRows` (mô-đun căn) dựng hàng như hôm nay — một luật dựng hàng, không viết thứ hai. Kết quả là `ready` ·
`unreadable` · `forbidden`, theo khuôn của `myCompanyLayer`.

Trang Bảng hàng (`src/app/(app)/inventory/page.tsx`) thay `sampleInventoryRows()` bằng `myInventory()`. Cùng các dòng ấy
đi tới: lưới, hồ sơ căn (`fullRecord`), ô ⌘K (`layout.tsx` lấy gợi ý từ cùng một lần đọc theo sàn — xem 5.4), cây địa lý
(2d), cột Về tay (19). Lần chào cũ của căn (lịch sử hàng 3b) đọc trong cùng lần đọc.

### 5.3 Đường ghi

`PATCH /api/v1/listings/[id]` (tệp đường một dòng; xử lý ở `src/modules/listings/listings-http.ts` theo khuôn
`saved-views-http.ts`). Thân: `{version, change}`; `change` là đúng một trong: giá chào, chuyển trạng thái (kèm giá
chốt, ngày bán, lý do), điều kiện phí. Máy chủ: mở cửa theo thao tác của loại thay đổi (`updateListing`;
`activateListing` khi đích là «Đang bán»), chạy `applyChange` rồi `update … where id = $1 and version = $2` trong `withCompany`, trả `200 {listing}` ·
`403 forbidden` · `404 not-found` · `409 {error:"conflict", current}` (phiên bản đã đổi — kèm bản hiện tại) ·
`400 invalid`. Luật kiểm (nấc được đi, giá trần, Đã bán cần gì) gọi lại `edit-rules.ts`/`applyChange` — một luật.

Phía trình duyệt: `httpSaveDoor` trong `src/modules/listings/ui/` cắm vào `InventoryGrid door=`; đọc lỗi qua
`failureOutcome` sẵn có; `conflict` mang bản hiện tại để ô hiện giá trị mới nhất và một câu. Cổng mẫu `sampleSaveDoor` ở
lại cho bài kiểm đơn vị.

### 5.4 ⌘K theo sàn đang mở

Ô ⌘K nằm ở khung (`layout.tsx`), đọc trước khi trang con chạy. Lối máy chọn (máy quyết, ghi sổ kèm lối khác): khung gọi `myInventory()` một lần cho mỗi lượt
dựng và đưa dòng gợi ý xuống (đọc qua cùng cửa theo sàn); trang Bảng hàng gọi lại hàm ấy trong cùng lượt dựng — React
`cache()` gộp hai lần gọi thành một lần đọc. Không có lần đọc thứ hai đi đường riêng. Lối khác: khung đọc riêng một danh sách gợi ý gọn qua cùng cửa theo sàn — vẫn
đúng SP-1 nhưng là hai lần đọc mỗi lượt; chọn nếu bài đo một lần đọc cho thấy `cache()` không gộp được khung và trang
trong Next 16.

### 5.5 Cửa vào và bốn trạng thái

- Có cơ sở dữ liệu, chưa đăng nhập: Bảng hàng về trang đăng nhập; `?vai=` không tác dụng. Một hàm nguồn hàng duy nhất
  (`inventorySource`) quyết: có cơ sở dữ liệu → `myInventory()`; không cấu hình cơ sở dữ liệu và không phải bản chạy thật →
  bộ mẫu «[MAU]» và `?vai=` (Hỏi-6, lối B). Bài trình duyệt có cơ sở dữ liệu đăng nhập theo vai bằng cửa của 9b
  (`tests/e2e-db/dang-nhap-vai.ts`).
- Vai không có `viewListings`: vùng ở trạng thái «Không đủ quyền» sẵn có.
- Chờ tải: `loading.tsx` của tuyến Bảng hàng dựng vùng ở trạng thái `loading` sẵn có (không khung mới).
- Trống: sàn chưa có căn nào → `RegionEmpty` với câu sẵn có; nút thêm căn để hàng 12.
- Lỗi: đọc không được → `RegionError` có «Tải lại».
- Không khớp: lọc không còn dòng → `RegionNoMatch` có «Xoá lọc».
- Công tắc `?state=` của bản dev giữ (chỉ ngoài bản chạy thật) để chụp ảnh.

### 5.6 Dữ liệu cho bản dev và bài kiểm

Lệnh nạp của kho (`db/scripts/`) đưa bộ mẫu hiện có (60 căn Ocean Park, `[Tên]`, `0900 000 0xx`) vào sàn «[MAU]», một
sàn thứ hai nhỏ «[MAU-2]» để đo cách ly trên màn, và một sàn «[MAU-TRONG]» không căn nào để chụp trạng thái trống. Bộ sinh mẫu giữ một nguồn: `buildSampleListings` → câu lệnh nạp như
`catalogLoadStatements` của danh mục.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: đăng nhập → Bảng hàng của sàn đang mở → chọn ô Giá chào, Trạng thái hay Điều kiện phí → Enter → giá trị lưu,
  thông báo «Đã đổi …» có Hoàn tác (điểm ra: vẫn ở Bảng hàng).
- Biên: sàn chưa có căn (trống); lọc không còn dòng (không khớp); vai không có quyền xem (Không đủ quyền); căn người khác
  giữ thì ô Trạng thái không có nấc «Đang bán»; đổi sàn ở App Shell thì bảng chỉ còn căn của sàn mới.
- Lỗi & quay lại: đọc hỏng → vùng lỗi có «Tải lại»; lưu bị từ chối hay mất mạng → ô về giá trị cũ kèm câu tại ô; xung đột
  phiên bản → ô hiện giá trị mới nhất kèm câu «Căn vừa được người khác sửa».

### 2. Kiểm kê màn

| Màn       | MỘT việc của màn                               | Vào từ / ra tới                         |
| --------- | ---------------------------------------------- | --------------------------------------- |
| Bảng hàng | Xem và sửa hàng thật của sàn như một bảng tính | App Shell, ô ⌘K, cây địa lý / hồ sơ căn |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái             | Màn       | Hiển thị gì                                                    | Người làm gì tiếp        |
| ---------------------- | --------- | -------------------------------------------------------------- | ------------------------ |
| ST-inventory-loading   | Bảng hàng | vùng `loading` của `DataRegion`                                | chờ                      |
| ST-inventory-empty     | Bảng hàng | `RegionEmpty`: «Sàn chưa có căn nào đang chào trên Bảng hàng.» | thêm căn (hàng 12)       |
| ST-inventory-error     | Bảng hàng | `RegionError` có «Tải lại»                                     | bấm Tải lại              |
| ST-inventory-nomatch   | Bảng hàng | `RegionNoMatch`: «Không có dòng nào khớp» có «Xoá lọc»         | xoá lọc                  |
| ST-inventory-forbidden | Bảng hàng | «Không đủ quyền» của vùng                                      | đổi sàn hay hỏi Quản trị |
| ST-inventory-conflict  | Bảng hàng | ô về giá trị mới nhất + câu tại ô                              | sửa lại nếu cần          |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Sửa trên ô chỉ ở 1024 và 1440 (luật hàng 4); 360 và 414 chỉ đọc (thẻ 2b) cho tới hàng 3d.
- Ô Điều kiện phí mở khung chọn hai giá trị như khung chọn Trạng thái; không hỏi lại.
- `?state=` của bản dev giữ để chụp; bản chạy thật bỏ qua nó.

### 5. Xuất xứ component

| Component                   | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                     |
| --------------------------- | --------------------------------- | --------------------------------------------------- |
| DataRegion                  | dùng                              | năm trạng thái vùng đã có                           |
| InventoryGrid, ô sửa hàng 4 | mở rộng                           | thêm cổng lưu thật và một kiểu ô chọn Điều kiện phí |
| ListingCard (2b)            | dùng                              | thẻ đọc cùng các dòng                               |
| PermittedAction (9e)        | dùng                              | nút và ô theo quyền                                 |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: không tra — luồng hiển nhiên; Bảng hàng đã là họ Lưới với hồ sơ căn bên cạnh từ hàng 2, 3; hàng 10 chỉ đổi nguồn
dữ liệu.

### 7. Thẻ việc

| Trường     | Giá trị                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| Ai dùng    | Đầu chủ                                                                     |
| Việc chính | Đầu chủ xem, lọc và sửa danh sách hàng thật của sàn mình thay cho bảng tính |
| Tần suất   | mỗi ngày nhiều lần                                                          |
| Số bản ghi | hàng trăm trở lên                                                           |
| Thiết bị   | cả hai                                                                      |

<!-- UX-SPEC-TEMPLATE>>> -->

## 7. Quét không gian (preset entity-feature, rút theo hàng)

Chân sản phẩm: `ontology/actions.yaml`, `ontology/roles.yaml`, `docs/plan/lo-trinh.json`, `trinh/ra-soat-crud/bao-cao.md`
của đợt [SUY-TỪ-REPO]. Chân ngành: RESO Data Dictionary 2.1 (`ListAgentKey`, `StandardStatus`) [NGÀNH: RESO DD 2.1];
Quỹ hàng (onehub-quy-hang) — sản phẩm cận kề, bảng quyền 05/11 [NGÀNH: cận kề, Quỹ hàng].

Trục:

- **Vòng đời căn chào trên màn**: xem · sửa giá · đổi trạng thái (từng nấc) · đổi điều kiện phí · sửa trường riêng ·
  sửa thông tin khác · thêm · gỡ · nhận/đổi người giữ · hoàn tác [thước CE: bảng thao tác RS2 1.1].
- **Vai × phạm vi**: Đầu chủ (căn mình giữ / căn chưa ai giữ / căn người khác giữ) · Đầu khách · Trưởng nhóm · Quản trị
  sàn · chưa đăng nhập · người của sàn khác [thước CE: `ontology/actions.yaml`].
- **Kết cục của lần đọc/ghi**: được · từ chối quyền · xung đột phiên bản · mất mạng · lỗi máy chủ · sai luật · trống ·
  chậm [thước CE: `src/lib/write-failure.ts`, `design/states.md`].
- **Chỗ hiện cùng dữ liệu**: Lưới · hồ sơ căn · ⌘K · cây địa lý · thẻ điện thoại · cột Về tay [thước CE: sổ đối chiếu màn].

Core → AC-1…AC-10 của hợp đồng. Later và Never → mục «Sẽ KHÔNG» của hợp đồng, có cột «ai quyết».

## 8. Bảng thao tác của «Căn chào» trên Bảng hàng

| Thao tác                                     | Đầu chủ                                               | Đầu khách  | Trưởng nhóm  | Quản trị sàn                     | Hàng                          |
| -------------------------------------------- | ----------------------------------------------------- | ---------- | ------------ | -------------------------------- | ----------------------------- |
| Xem                                          | có — Lưới, hồ sơ, thẻ, ⌘K, cây                        | có         | có           | Hỏi-1                            | 10                            |
| Thêm                                         | —                                                     | —          | —            | —                                | để hàng 12 (`createListing`)  |
| Sửa giá, điều kiện phí                       | có — ô Giá chào, ô Điều kiện phí (phạm vi theo Hỏi-2) | theo Hỏi-2 | có, toàn sàn | không (cấu hình, không sửa hàng) | 10                            |
| Đổi trạng thái sang «Đang bán»               | có — căn mình giữ hoặc chưa ai giữ                    | không      | có, toàn sàn | không                            | 10 (`activateListing`)        |
| Đổi trạng thái khác                          | theo Hỏi-2                                            | theo Hỏi-2 | có           | không                            | 10 (`updateListing`)          |
| Sửa trường riêng                             | Hỏi-3                                                 | Hỏi-3      | Hỏi-3        | —                                | 10 hay 3g                     |
| Sửa pháp lý, nội thất, tài chính, tình trạng | —                                                     | —          | —            | —                                | để hàng 3g                    |
| Gỡ khỏi danh sách                            | —                                                     | —          | —            | —                                | để hàng 18b (`removeListing`) |
| Nhận căn chưa ai giữ                         | Hỏi-4                                                 | —          | —            | —                                | 10 hay 18a                    |
| Đổi người giữ                                | —                                                     | —          | —            | —                                | để hàng 18a (bàn giao)        |
| Hoàn tác lần sửa                             | có — theo cùng quyền của lần sửa                      |            |              |                                  | 10                            |

## 9. Rủi ro

- Sàn lớn (5.000 căn): đọc một lần toàn sàn như Sheet; hàng 10 đo thời gian đọc và dựng trang với 5.000 căn mẫu ở bài
  cơ sở dữ liệu, ngưỡng ghi ở hợp đồng; phân trang phía máy chủ không làm (trái thói quen «cuộn liền»).
- Luật nấc và quyền ở hai tầng: đã chia ở 5.1 — nấc ở máy chủ, quyền và dữ liệu ở cơ sở dữ liệu; một trang quyết định
  mới ghi ranh giới này.
