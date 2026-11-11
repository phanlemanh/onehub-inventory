# Thiết kế: du-lieu-mau — sàn mẫu Ocean Park, căn và liên hệ nối sẵn

Ngày: 2026-11-11 · Hàng lộ trình `1` (N4) · Hạng T2 · Dãy D của đợt «nen»

## Mục tiêu

Các màn (Bảng hàng, hồ sơ căn, Đã gửi, Liên hệ) dựng trên dữ liệu mẫu trước khi có dữ liệu thật. Quyết định
[0020](../../wiki/decisions/0020-linked-sample-data-ocean-park.md): Bảng hàng và Liên hệ dùng chung dữ liệu từ đầu —
chủ nhà của một căn là một liên hệ, số chủ nhà ghi vào liên hệ, không ghi vào căn.

Ngưỡng bật của hàng: dựng lại hai lần ra cùng dữ liệu; mọi bản ghi mang nhãn MAU; không có tên hay số thật; đủ ca một
chủ nhiều căn, một căn nhiều chủ, một người vừa là chủ vừa là khách, căn chưa có chủ; đổi số của một liên hệ thì mọi
căn của người đó cùng thấy số mới.

## Hình dạng

Kho chưa có cơ sở dữ liệu (`db/` chưa có; hàng `7` dựng cách ly). Dữ liệu mẫu là **hàm dựng thuần, tất định**, mỗi
mô-đun dựng phần nó sở hữu (`architecture/modules.yaml`), đi ra qua cửa `index.ts`:

| Mô-đun | Dựng gì | Đầu vào |
|---|---|---|
| `catalog` | ba dự án Ocean Park, toà căn hộ, căn (`Unit`), dòng cách đọc mã căn của từng dự án | không |
| `listings` | sàn mẫu, 60 lần chào (`Listing`) phủ sáu trạng thái, liên kết lần chào → căn | mã sàn + danh sách căn (dữ liệu thuần) |
| `contacts` | 50 liên hệ (`Contact`), liên kết chủ nhà → lần chào, kho liên hệ đổi được số | mã sàn + danh sách mã lần chào |

Ba mô-đun không gọi nhau: `depends_on` đang rỗng và đổi nó là quyết định thiết kế ngoài phạm vi hàng này. Bên gọi
(màn ở `src/app`, bài kiểm ở `tests/`) nối chúng bằng cách chuyển mã: `sampleUnits()` → `buildSampleListings(...)`
→ `buildSampleContacts(...)`.

### Danh mục (catalog)

- Dự án: Vinhomes Ocean Park 1 · Vinhomes Ocean Park 2 – The Empire · Vinhomes Ocean Park 3 – The Crown (tên công khai).
- Toà Ocean Park 1: S1.01, S1.02, S1.03, S1.05 — bốn trong mười một toà Sapphire 1 đã đối chiếu nguồn công khai
  (S1.01–S1.12, không có S1.04). Toà Ocean Park 2 và 3: nguồn công khai đọc được không liệt kê tên toà căn hộ —
  xem Hỏi-2; bản nháp dùng tên giả mang nhãn «[MAU] Toà E1», «[MAU] Toà C1».
- Ba dự án, sáu toà (bốn ở Ocean Park 1, một ở mỗi dự án còn lại). Mỗi toà 12 tầng (5–16) × 6 trục = 72 căn, cộng
  432 căn; trục quyết diện tích, phòng ngủ, hướng (bảng trục lấy từ Quỹ hàng commit
  `1f8a6edd`, `packages/db/seed/du-lieu-mau.mjs`).
- `unitNumber` = tầng hai chữ số + trục hai chữ số (`1208`). Dòng cách đọc mã căn mỗi dự án: `S1.05-1208` = toà S1.05 ·
  tầng 12 · trục 08. Hàm `unitCode(unit)` dựng mã, `readUnitCode(code)` đọc ngược.
- `upi` = `urn:onehub:upi:mau:<dự án>:<toà>:<căn>` — tiền tố `mau` là nhãn của căn (khuôn `Unit` không có trường nhãn).

### Lần chào (listings)

- Sàn mẫu `[MAU] Sàn mẫu Ocean Park`, mã `4d415500-0000-4000-8000-000000000001`.
- 60 lần chào trên 60 căn khác nhau: 36 ở Ocean Park 1, 12 ở mỗi dự án còn lại. Trạng thái: Active 24 · Incomplete 8 ·
  Pending 7 · Hold 7 · Closed 7 · Withdrawn 7. Closed có giá chốt và ngày chốt; Withdrawn có lý do. Giá = diện tích ×
  45–75 triệu/m², làm tròn 10 triệu. Mọi mốc giờ là hằng, không đọc đồng hồ.
- Bộ sinh số giả ngẫu nhiên mulberry32 với hạt giống cố định (Quỹ hàng `1f8a6edd`).
- Liên kết lần chào → căn là một bản ghi `{ id, companyId, listingId, upi }` (quan hệ `Unit offered_as Listing` đã có
  trong `ontology/relations.yaml`), 60 bản; `buildingName`, `unitNumber`, `subdivisionName` của lần chào chép từ căn.

### Liên hệ (contacts)

- 40 chủ nhà, 10 khách. Hai chủ nhà vừa là khách (`contactTypes` = `Seller, Buyer`).
- Tên `[Tên] Chủ bán 01 · MAU`, `[Tên] Người mua 01 · MAU` — chữ «Chủ bán», «Người mua», «Sàn», «Toà» lấy từ bảng nhãn
  sinh từ `ontology/labels.yaml`, không gõ cứng trong mã. Số `0900 000 0xx`; ba chủ nhà có hai số.
- Liên kết chủ nhà → lần chào `{ id, companyId, contactId, listingId, contactType: "Seller" }` (quan hệ `Contact owns
  Listing`), 60 bản: 56 lần chào có một chủ chính, bốn lần chào có thêm chủ thứ hai, bốn lần chào chưa có chủ.
  Đủ bốn ca: một chủ nhiều căn, một căn hai chủ, một người vừa chủ vừa khách, căn chưa có chủ.
- `phones` là một chuỗi (kiểu sinh từ ontology), nhiều số nối bằng dấu phân cách cố định `", "`; `phoneList(contact)`
  tách ra từng số. 50 liên hệ, ba người có số thứ hai: đúng 53 số.
- Số chỉ nằm ở liên hệ (thuộc tính `phones` mới của `Contact`, giám sát duyệt ở tin D-1011-2). `createContactStore`
  giữ dữ liệu đã chuẩn hoá: `ownersOf(listingId)` đọc số từ liên hệ, nên `updatePhones` một lần là mọi lần chào của
  người đó thấy số mới.

### Nhãn MAU trên mọi bản ghi

Khuôn ontology không có trường nhãn và lời duyệt D-1011-2 không cho đổi gì khác trong ontology, nên nhãn đi bằng giá trị
đã có, hai lớp:

- Mỗi bản ghi tự nhận ra được: mã (uuid) của sàn, lần chào, liên hệ và hai loại liên kết mở đầu `4d415500-` (chữ «MAU»
  viết hệ mười sáu); `upi` của căn mở đầu `urn:onehub:upi:mau:`; tên sàn mở đầu `[MAU]`, tên liên hệ kết thúc `· MAU`.
- Mọi bản ghi thuộc sàn (lần chào, liên hệ, hai loại liên kết) mang mã sàn mẫu.

Lớp thứ hai đủ cho bản ghi thuộc sàn; lớp thứ nhất để một bản ghi đứng riêng (một dòng nhật ký, một liên kết) vẫn nhận ra
là mẫu, và để lệnh gỡ dữ liệu mẫu sau này chỉ xoá khi đủ hai điều kiện (cách Quỹ hàng làm với tên sàn cộng miền email).
Chọn giữa hai lớp hay giữ cả hai là Hỏi-3.

Số bản ghi viết trước: 1 sàn · 432 căn · 60 lần chào · 60 liên kết căn · 50 liên hệ · 60 liên kết chủ. Mỗi mô-đun có
hàm kiểm nhãn trả lỗi gọi đích danh loại và mã bản ghi thiếu nhãn.

### Không dữ liệu thật

Hàm quét chạy trên MỌI chuỗi của căn, lần chào, liên hệ và liên kết. Hàm quét chuỗi lấy từ Quỹ hàng (`quetChuoi`, commit `1f8a6edd`): chuẩn hoá NFKC, bỏ số mẫu, uuid, upi, mốc giờ ISO, mã
toà và mã căn, rồi đếm chữ số còn lại — từ 9 chữ số trở lên là đỏ. Thêm: mọi số khớp `0900 000 0xx`, mọi tên mở đầu
`[Tên]`.

### Kiểm tra

Mỗi luật có hàm kiểm thuần trả danh sách lỗi có tên. Bài kiểm chạy hàm trên vật lành (0 lỗi) và trên bản sao bị phá
đúng một chỗ (đúng thông điệp) — cặp hai chiều cùng vật. Tất định đo bằng hai lần dựng so từng byte cộng một băm SHA-256
ghim trong bài kiểm, dựng dưới hai múi giờ (UTC và Asia/Ho_Chi_Minh). Hàm dựng không đọc đồng hồ, không dùng `Intl` hay
`Math.random`. Bài kiểm nằm ở `tests/sample-data.test.ts` (giám sát mở ranh giới ở tin D-1011-4) và chỉ gọi ba mô-đun
qua cửa `index.ts`.

## Ngoài phạm vi

- Nạp vào cơ sở dữ liệu (chưa có `db/`; hàng `7` và `21`).
- Màn hình nào cũng không dựng ở đây (hàng `2`, `3`, `6`).
- Cho thuê (chủ nhà là Landlord), thấp tầng Ocean Park 2 và 3 (H6, L6).
- Người dùng mẫu và vai (hàng `9`, `1d`).

## Đặc tả UX

Bỏ — hàng không dựng màn nào (sổ quyết định: «bỏ đặc-tả-UX»).

## Câu hỏi cho Cổng Phạm vi

- Hỏi-1 — chủ nhà gắn với lần chào hay với căn trong phạm vi sàn (0020 để mở). Khuyến nghị: gắn với lần chào, đúng quan
  hệ `Contact owns Listing` đang có và giữ được liên hệ của từng sàn vì danh mục căn dùng chung.
- Hỏi-2 — tên toà Ocean Park 2 và 3. Khuyến nghị: tạm dùng tên giả mang nhãn `[MAU]` tới khi có nguồn công khai; đổi
  sau chỉ là sửa dữ liệu.
- Hỏi-3 — nhãn MAU đi bằng tiền tố mã của từng bản ghi cộng mã sàn mẫu, hay chỉ bằng mã sàn mẫu. Khuyến nghị: giữ cả hai.
