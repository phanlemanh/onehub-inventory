---
type: design
title: "3h · Tin rao giữ giá trị riêng, Danh bạ chỉ làm giàu — thiết kế lát A"
slug: tin-rao-giu-gia-tri-rieng
---

# 3h · Tin rao giữ giá trị riêng — thiết kế lát A

Nguồn: ô cơ hội đã ký (`_acceptance/tin-rao-giu-gia-tri-rieng/opportunity.md`, chủ kho «đáng, làm» 27/11), tám điểm
«Chốt hướng» ở sổ đợt `dieu-phoi-nen` (mục «Hướng mô hình»), luật chỗ sửa 17/11, phán G-2711-4 và G-2711-6 của giám
sát, onehub-invest ADR-0013 §1 §6, ADR-0016 §3 §5 §7, ADR-0017 §5 §6 (chỉ đọc; không chép tên nguồn nào). Đứng trên 3g
(PR #126, chưa gộp) và 11 (nhánh dãy D, chưa gộp): bản bấm được và ảnh dựng sau khi 3g vào main; lượt chấm đầu chứa
main có 11.

## 1. Bài toán

Hôm nay năm thuộc tính của căn — Diện tích, Tầng, Phòng ngủ, Hướng, Loại hình — chỉ đọc từ danh mục dùng chung
(`catalog_units`). Danh mục sai thì Đầu chủ chỉ có «Báo sai» (3e) rồi chờ. Căn chờ khớp (căn sàn tạo tay ở hàng 12, căn
nhập Sheet chưa có trong danh mục ở hàng 11) không có chỗ nào giữ năm thuộc tính; hàng 11 giữ nguyên văn chúng trong
bản ghi lần nhập (`import_runs.kept`, lý do `unit-attribute`) và chưa ghi đi đâu.

## 2. Mô hình (lựa chọn lõi)

Tin rao (`Listing`, resource RESO `Property`) thêm năm giá trị riêng, cùng tên RESO với căn (`Unit`):

| Thuộc tính | Tên trên Listing | RESO | Kiểu, luật |
|---|---|---|---|
| Diện tích | `livingArea` | LivingArea | số > 0, m², tối đa một chữ số lẻ khi hiện (`formatArea` có sẵn) |
| Tầng | `floor` | UnitFloorLocation | chữ theo luật `floor-text` của danh mục (`src/modules/catalog/unit-code.ts`) — một luật, không viết lại |
| Phòng ngủ | `bedroomsTotal` | BedroomsTotal | số nguyên ≥ 0 |
| Hướng | `directionFaces` | DirectionFaces | chọn từ danh sách hướng (Hỏi-5) |
| Loại hình | `propertySubType` | PropertySubType | một trong bốn giá trị đã có (Căn hộ, Nhà phố, Biệt thự, Đất) |

Mỗi giá trị riêng nhớ **nguồn** của nó (khái niệm riêng mới `AttributeSource`: `Typed` = sàn gõ, `File` = nhập từ tệp).
Không có giá trị riêng = **theo Danh bạ**: ô hiện giá trị danh mục. Thứ tự thắng: sàn gõ › tệp › Danh bạ. Danh bạ
không bao giờ đè giá trị riêng (như `registry_inherit` của Invest luôn ở lớp thấp nhất). RESO có `LivingAreaSource`
cho riêng diện tích; ta không dùng tên ấy cho năm nguồn vì nghĩa RESO là nguồn đo (Builder, Appraiser…), không phải ai
ghi — `AttributeSource` là khái niệm riêng, có dòng trong bảng thuật ngữ.

Cách lưu: năm cột giá trị + năm cột nguồn trên bảng `listings` (một migration mới, số chốt theo thứ tự gộp sau 015/016
của hàng 11). Cột nguồn null ⇔ cột giá trị null (ràng buộc). Bảng `listings` đã bật và ép cách ly theo dòng (013), nên
năm giá trị mới thuộc sàn ngay, không thêm chính sách. Lối khác đã loại: bảng phát biểu kiểu `FieldAssertion` của Invest
(cần bộ phân xử — ta chỉ có ba nguồn cố định, ADR-0018 cấm luật chung); một cột jsonb (mất kiểm kiểu ở cơ sở dữ liệu,
mất luật tầng).

Đọc: một hàm thuần `effectiveAttributes(listing, catalogUnit)` trong `listings` trả, cho mỗi thuộc tính, `{value,
source: "Typed"|"File"|"Catalog"|null, catalogValue, differs}` — `differs` đúng khi có giá trị riêng VÀ danh mục có
giá trị VÀ hai giá trị khác nhau (so số theo số, so chữ theo `foldWords`). Lưới, hồ sơ căn, thẻ điện thoại, tìm ⌘K,
cây địa lý và lọc cùng đọc qua hàm ấy — một luật một chỗ.

Loại căn (`UnitKind`, «Studio», «2PN») không lưu: vẫn suy bằng `unitKind()` từ Phòng ngủ — nay là Phòng ngủ hiệu lực
của tin. Cho gõ đè Loại căn hay không là Hỏi-2.

Căn chờ khớp: không đổi thực thể `PendingUnit`. Năm giá trị nằm trên tin rao trỏ căn chờ khớp (hàng 11:
`listing_pending_units`), nguồn Typed hay File; không có danh mục để so nên không có dấu. Khi căn chờ khớp được khớp vào
căn danh mục, giá trị riêng giữ nguyên, chỗ khác danh mục hiện dấu.

Ô vòng đời `Unit.sua = khong` (d-20261115T042837Z-14) giữ nguyên: sàn sửa bản của mình trên tin, Danh bạ không đổi.
`Listing.vong_doi.rieng` thêm `sua_thuoc_tinh_can: { co: updateListing }`.

## 3. Ghi

Một cửa: `PATCH /api/v1/listings/[id]` của 3g, thêm một dạng thay đổi `{field: "unitAttributes", livingArea?, floor?,
bedroomsTotal?, directionFaces?, propertySubType?}`; giá trị `null` = «lấy lại theo Danh bạ» (xoá giá trị riêng và
nguồn). Máy chủ đặt nguồn `Typed`, kiểm từng giá trị bằng luật thuần trong `edit-rules.ts` (một luật cho ô, hộp Sửa,
dán, máy chủ), khoá phiên bản như hàng 4, ghi `lastConfirmedAt` như 3g AC-10. Không cột mới nào nhận ghi ngoài cửa này.

Nhập tệp (hàng 11): `writeBatch` đặt năm giá trị lên tin mới tạo với nguồn `File` (hôm nay nó chỉ ghi vào `kept`). Lần
nhập đã chạy trước khi 3h vào: một bước đọc lại `import_runs.kept` (`why = unit-attribute`) đặt giá trị nguồn `File` cho
đúng tin của dòng ấy (`listingIdOf(runId, row)`) khi tin chưa có giá trị riêng — chạy một lần trong migration hay lệnh
`make`, quyết ở S2. Nhập lại để cập nhật tin đã có là hàng 11b; khi 11b làm, tệp không đè giá trị `Typed` (luật thắng ở
một hàm thuần `mergeSource(current, incoming)` của 3h, 11b gọi lại).

Xem trước lần nhập (G-2711-4): cột thuộc tính có ô khác danh mục của căn khớp thì ô ấy mang dấu khác Danh bạ (cùng
khối dấu với lưới) kèm giá trị danh mục; giá trị tệp vẫn là giá trị sẽ ghi.

Đổi căn hay toà (điểm 4 đã chốt): trong trang chi tiết, lệnh «Gắn sang căn khác» chọn căn danh mục (cùng ô tìm mã căn
của hàng 12); tin chuyển liên kết, giá trị Danh bạ tính lại theo căn mới, giá trị Typed/File giữ; luật «một căn một tin
mở» (013) chặn khi căn mới đã có tin mở, câu lỗi nói căn nào. Chỉ trong trang chi tiết, không trên ô.

## 4. Quyền và luật sản phẩm

- Sửa năm thuộc tính theo quyền `updateListing` (ListAgent, BuyerAgent, TeamLead — bảng quyền của 013), qua bộ nút theo
  quyền (9e). Vai không có quyền vẫn có «Báo sai thông tin căn» (3e) — vai của 3e thu về người không sửa được (sửa sau
  ký của 3e). Người có quyền sửa: nút «Báo sai» vẫn còn cho trường hợp muốn báo danh mục, không bắt buộc bỏ.
- SP-1: năm giá trị nằm trên `listings` (cách ly theo dòng, ép); thêm ca vào bộ kiểm cách ly: sàn B không đọc, không
  ghi được giá trị riêng của sàn A; danh mục không có dòng nào đổi sau mọi lần sửa. Không truy vấn ngoài `withCompany`.
- SP-3: không chạm (không gửi gì). SP-4: trang khách chưa dựng (hàng 17); khi dựng, nó đọc giá trị hiệu lực qua luật ẩn
  — ghi một dòng Notes, không làm ở đây.

## 5. Chỗ sửa (luật chỗ sửa 17/11: nhanh trên lưới, nhiều trường trong chi tiết căn)

- **Trên ô (máy tính, từ 768 px, như hàng 4):** hai cột đang có trên Bảng hàng — Diện tích, Phòng ngủ. Tầng, Hướng,
  Loại hình chưa là cột (giới hạn 8 cột đã ký ở hàng 2; «Bảng hàng đủ cột» là hàng riêng sau 3h theo lời chủ kho ở Cổng
  Đáng). Khi hàng ấy thêm cột, ô của chúng sửa theo cùng luật này, không cần hàng mới.
- **Trong chi tiết căn (mọi cỡ, 360 → 1440):** khối thuộc tính căn của hồ sơ có lệnh «Sửa» (cùng hộp `FormDialog` của
  3g) cho cả năm thuộc tính; mỗi dòng có lệnh «Lấy lại theo Danh bạ» khi đang khác. Sửa trường riêng của sàn trên điện
  thoại ở đây hay để 3d: Hỏi-3.
- Dán (hàng 5): dán vào cột Diện tích, Phòng ngủ theo luật của 3h (hôm nay bị bỏ kèm lý do «thuộc tính căn») — sửa sau
  ký của hàng 5.

## 6. Ảnh hưởng hồ sơ đã ký (sửa sau ký)

- Hàng 4 (`sua-tren-o`): dòng «Never: sửa thuộc tính căn (diện tích, phòng ngủ, toà) trên ô» — lật cho Diện tích, Phòng
  ngủ; Toà vẫn không sửa trên ô (đổi toà = gắn sang căn khác, chỉ trong chi tiết).
- Hàng 5 (`dan-tu-excel`): «sửa thuộc tính căn bằng dán» ngoài phạm vi — lật cho Diện tích, Phòng ngủ.
- 3g (`sua-thong-tin-can`): dòng ngoài phạm vi «sửa thông tin của căn (tầng, hướng, diện tích) — thuộc danh mục, hàng 3e».
- 3e (`hoi-dau-chu-bao-sai`): «Báo sai» nay chủ yếu cho người không có quyền sửa.
- Hàng 12 (`them-can`): «sửa thông tin khác ở hàng 3g» → thuộc tính căn sửa ở 3h (căn tạo tay gõ sai diện tích, hướng).

Mỗi hồ sơ một dòng `sua-sau-ky.md` khi 3h gộp; không sửa chữ ký cũ.

Làn ghim lại (giám sát báo 27/11): hồ sơ `sua-tren-o` (hàng 4) và `lop-rieng-cua-san` (7e) đang cũ bằng chứng trên main
(ghim 13/11 ở b3b6702, fee86ff); chạm `_acceptance/` của chúng là cổng báo «evidence is stale». Kế hoạch (S2) của 3h có
sẵn một bước ghim lại các hồ sơ 3h ghi sửa sau ký (4, 5, 3e, cùng 7e đang cũ) bằng lượt `ghim-lai` của đợt qua lệnh bọc
giữ nhịp; eval của 7e cần Postgres dãy R. Ghi chú lưới 12 cột của hàng 4 và 7e đang nằm tạm ở hồ sơ 3g (PR #129): chép về
đúng hồ sơ trong cùng bước ghim lại.

## 7. Ngoài lát A

Khoá một giá trị (lát B, sau khi dùng lát A). Gửi chỗ lệch về Invest (kết nối «xác nhận danh mục», sau MVP). Bảng hàng
đủ cột (hàng riêng). Lịch sử ai sửa gì (3c). Mức đủ thông tin không đổi (năm phần của 3b không gồm thuộc tính căn).
Trang khách (17). Nhập lại cập nhật tin đã có (11b).

<!-- <<<UX-SPEC-TEMPLATE -->
## Đặc tả UX

### 1. Luồng

- Suôn sẻ (ô): Bảng hàng ở 1024 → chọn ô Diện tích của một căn → gõ «72,5» → Enter → ô hiện «72,5 m²», dấu khác Danh bạ
  hiện nếu danh mục ghi khác, thông báo «Đã lưu» kèm Hoàn tác (điểm ra: vẫn ở ô).
- Suôn sẻ (chi tiết): mở hồ sơ căn (mọi cỡ) → khối «Thông tin căn» → «Sửa» → hộp năm trường, mỗi trường có dòng nhỏ
  «Danh bạ: <giá trị>» khi khác → Lưu → khối hiện giá trị mới, dòng nguồn.
- Lấy lại: ô hay dòng có dấu → mở dấu → «Lấy lại theo Danh bạ» → ô về giá trị danh mục, dấu tắt, Hoàn tác được.
- Biên: danh mục không có giá trị (ô trống) → sàn gõ vào, không dấu; căn chờ khớp → không dấu, không lệnh lấy lại; tin
  Đã bán hay Ngừng → khoá như 3g (`detailsLocked`); vai không có `updateListing` → không có lệnh sửa, còn «Báo sai».
- Lỗi & quay lại: chữ không đọc được (vd «bảy mươi», tầng «07») → câu lỗi dưới ô, giữ chữ đã gõ, Esc bỏ; lưu hỏng (mất
  mạng, người khác vừa sửa, hết phiên, không đủ quyền) → câu theo `write-failure.ts` của 3g, giữ chữ đã gõ.

### 2. Kiểm kê màn

| Màn | MỘT việc của màn | Vào từ / ra tới |
|---|---|---|
| Inventory (inventory) | Đầu chủ xem và sửa hàng của sàn như một bảng tính | thanh bên «Hàng» / hồ sơ căn trong ngăn chi tiết |
| Hồ sơ căn (ngăn chi tiết của inventory) | Xem đủ và sửa nhiều trường của một căn | dòng của lưới, thẻ điện thoại, ⌘K / về lưới |
| Xem trước lần nhập (màn nhập của hàng 11) | Thấy trước từng ô sẽ ghi, kể cả ô khác Danh bạ | bước 4 của lần nhập / bước Ghi |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->
| Trạng thái | Màn | Hiển thị gì | Người làm gì tiếp |
|---|---|---|---|
| ST-inventory-theo-danh-ba | inventory | ô hiện giá trị danh mục, không dấu | sửa nếu sai |
| ST-inventory-khac-danh-ba | inventory | ô hiện giá trị sàn + dấu nhỏ; mở dấu thấy «Danh bạ: <giá trị>» và «Lấy lại theo Danh bạ» | giữ, hoặc lấy lại |
| ST-inventory-dang-luu | inventory | ô giữ giá trị mới, chỉ báo đang lưu của hàng 4 | chờ |
| ST-inventory-loi-doc | inventory | câu lỗi dưới ô, chữ đã gõ còn nguyên | sửa chữ hoặc Esc |
| ST-inventory-loi-luu | inventory | câu theo `write-failure.ts`, giá trị trả về cũ | thử lại, tải lại |
| ST-inventory-khoa | inventory | ô thuộc tính của tin Đã bán / Ngừng không mở sửa, lý do như 3g | không |
| ST-inventory-khong-quyen | inventory | không có lệnh sửa; «Báo sai thông tin căn» còn | báo sai |
| ST-inventory-cho-khop | inventory | căn chờ khớp: giá trị sàn, không dấu, không lệnh lấy lại | sửa |
| ST-imports-khac-danh-ba | imports | ô xem trước khác danh mục mang dấu + giá trị danh mục | ghi theo tệp, hoặc sửa tệp |
<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Đọc số: Diện tích nhận «72,5», «72.5», «72,5 m2», «72,5m²»; Phòng ngủ nhận số nguyên ≥ 0 («Studio» không phải số —
  câu lỗi gợi «gõ 0»); Tầng theo `floor-text` (7, 15A; không số 0 đầu); Hướng, Loại hình là ô chọn.
- Dấu khác Danh bạ là chỉ báo, không phải lỗi: không đổi màu chữ của ô, không chặn lưu; có tên cho trình đọc màn hình
  («khác Danh bạ: <giá trị>»); nhìn được ở sáng và tối (axe).
- Phím: như hàng 4 (Enter, F2, gõ để mở; Esc bỏ; Tab sang ô kế). Dấu mở bằng chuột và bằng phím (mục trong menu ô).
- Khổ: ô sửa từ 768 px; dưới 768 px thẻ điện thoại hiện giá trị hiệu lực, sửa trong hồ sơ căn.

### 5. Xuất xứ component

| Component | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng) |
|---|---|---|
| DataRegion + ô sửa của hàng 4 | dùng | ô Diện tích, Phòng ngủ đi đúng đường sửa trên ô đã có |
| FormDialog + ListingDetailsEdit (3g) | mở rộng | hộp «Sửa» của chi tiết căn nhận thêm năm trường, không dựng hộp thứ hai |
| Dấu khác Danh bạ | tạo (ReUI trước) | khối mới: bày 2–3 ứng viên ReUI (chấm, badge, biểu tượng có tooltip) ở Cổng Phạm vi, vẽ tay sau cùng |
| Ô chọn Hướng, Loại hình | dùng | ô chọn một giá trị của 3g (`CustomChoiceEditor`) |
| Ô tìm mã căn (hàng 12) | dùng | «Gắn sang căn khác» dùng lại, không dựng ô tìm thứ hai |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: màn đã có (lưới + ngăn hồ sơ căn của hàng 3/3a); 3h không đổi khuôn, chỉ thêm ô sửa và dấu. Luồng hiển nhiên,
không tra mẫu.

### 7. Thẻ việc

| Trường | Giá trị |
|---|---|
| Ai dùng | Đầu chủ |
| Việc chính | Sửa thông tin căn sai hay thiếu ngay trên hàng của sàn, không chờ danh mục |
| Tần suất | mỗi ngày |
| Số bản ghi | hàng trăm trở lên |
| Thiết bị | cả hai |
<!-- UX-SPEC-TEMPLATE>>> -->

## 8. Quét độ phủ (bốn trục)

Chân sản phẩm: `ontology/`, `_acceptance/` các hàng 4, 5, 3e, 3g, 11, 12, sổ đợt. Chân ngành: RESO DD 2.1 (năm field
trên `Property`; `LivingAreaSource` là nguồn đo), onehub-invest ADR-0016 §7 (kế thừa hai chiều, không chép đè, lệch là
tín hiệu), Quỹ hàng (chỉ sửa ba cột trên ô — 3h đi xa hơn theo lời chủ kho).

- Trục A — nguồn giá trị: theo Danh bạ · sàn gõ · nhập từ tệp · không có ở đâu (căn chờ khớp chưa gõ). [thước CE: điểm 2
  đã chốt + ba nguồn của hàng 11]
- Trục B — thao tác: xem · sửa trên ô · sửa trong chi tiết · lấy lại · Danh bạ đổi về sau · khớp căn chờ · gắn sang căn
  khác · nhập tệp mới · nhập tệp cũ (đọc lại `kept`) · hoàn tác · hai người cùng sửa. [thước CE: vòng đời 1t + tám điểm]
- Trục C — thuộc tính: Diện tích · Tầng · Phòng ngủ · Hướng · Loại hình (+ Loại căn suy ra). [thước CE: điểm 1]
- Trục D — người: có `updateListing` · không có · sàn khác. [thước CE: bảng quyền 013, SP-1]

Core (thành tiêu chí): đọc hiệu lực A×C; sửa trên ô (B2 × Diện tích, Phòng ngủ); sửa trong chi tiết (B3 × C, mọi cỡ);
dấu và lấy lại; Danh bạ đổi không đè; nhập tệp mới và đọc lại `kept`; xem trước có dấu; căn chờ khớp và khi khớp; gắn
sang căn khác; quyền và cách ly. Later: tệp nhập lại đè/không đè (11b); trang khách (17); lịch sử (3c). Never: sàn sửa
Danh bạ; Danh bạ đè giá trị sàn; khoá (lát B, quyết sau).
