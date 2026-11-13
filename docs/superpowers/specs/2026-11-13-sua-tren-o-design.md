# Sửa trên ô — thiết kế (hàng 4)

Hàng 4 của lộ trình, mã phạm vi B4, B6. Câu giao: Đầu chủ sửa giá và trạng thái ngay trên ô, thấy lỗi ngay tại ô đó.
Vì sao: thay thao tác sửa trên Sheet. Ô Cổng Đáng: `_acceptance/sua-tren-o/opportunity.md` (build, Manh Phan,
2026-11-13). Nguồn đối chiếu: trang `docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md` và hàng 15 của Quỹ hàng
(`onehub-quy-hang` commit `1729b11f`, `_acceptance/sua-tren-o/`).

## Ý chính

- Bảng hàng trên máy tính (từ 768 px) mở sửa đúng hai cột: **Giá chào** và **Trạng thái**. Mọi cột khác giữ như cũ.
- Ô vào sửa bằng **F2**, **gõ một ký tự** (thay giá trị, như Sheet) hay **bấm đúp**. **Enter** trên ô đang chọn vẫn mở hồ
  sơ căn (luật 2a, 3 giữ nguyên); bấm mã căn vẫn mở hồ sơ, bấm lề ô vẫn chỉ chọn ô.
- Trình sửa là một khung nhỏ đặt ngay dưới ô (ô vẫn thấy được), lỗi và câu «Hiểu là» nằm ngay trong khung — đúng ô ấy.
  Trong khung: Enter ghi, Esc huỷ, Tab ghi rồi sang ô kế; đóng khung thì bàn phím về ô vừa sửa, mũi tên chạy tiếp.
- **Giá**: gõ theo cách nói của nghề («4,65 tỷ», «4ty65», «950tr», «4.650.000.000»), khung đọc lại «Hiểu là:
  4.650.000.000 ₫ (4,65 tỷ)» đúng từng đồng; chữ chưa hiểu thì báo «Chưa hiểu «…» — gõ như 4,65 tỷ hoặc 950 triệu» và
  Enter không ghi. Giá đổi quá 20% thì hỏi lại ngay tại ô: «Giá đổi +72% — đổi chứ? 2,71 tỷ → 4,65 tỷ» · Thôi · Đổi giá.
- **Trạng thái**: khung chỉ đưa các nấc chuyển hợp lệ từ trạng thái hiện tại (bảng 12 lối của Quỹ hàng). Đã bán hỏi giá
  chốt (cùng bộ đọc giá, điền sẵn giá chào) và ngày bán (mặc định hôm nay); Ngừng hẳn hỏi một trong ba lý do. Nấc không
  hoàn tác được (Đã bán, Ngừng hẳn) nói trước khi ghi.
- Căn **Đã bán khoá** giá và trạng thái: ô có ổ khoá và nói lý do khi trỏ vào; F2 không mở gì. Căn Ngừng hẳn khoá
  trạng thái (nấc cuối).
- Ghi xong: ô đổi ngay, cột Xác nhận lúc thành lúc vừa sửa (sửa giá hay trạng thái tính là vừa xác nhận với chủ nhà),
  thông báo «Đã đổi Giá chào căn 1101: 2,8 tỷ.» kèm **Hoàn tác**. Không có nút Lưu.
- **Hoàn tác là một lần ghi như mọi lần ghi**: hỏng (mất mạng, máy chủ từ chối) thì báo rõ «Chưa hoàn tác được vì mất
  kết nối mạng. Căn 1101 vẫn là 2,8 tỷ; có mạng lại thì bấm «Thử lại».» — thông báo đứng yên tới khi người bấm. Lần sửa
  hỏng thì ô về giá trị cũ và báo vì sao; máy chủ từ chối (403) thì câu riêng «Không đủ quyền làm việc này. Tải lại trang
  để thấy đúng các nút.».
- **Quyền**: ô chỉ vào chế độ sửa khi bảng quyền cho vai của phiên thao tác `updateListing` (khuôn bộ nút theo quyền của
  9e, bảng quyền của 9a). Không quyền thì ô hiện như chữ thường, không gợi ý sửa.
- **Điện thoại** (dưới 768 px) không sửa trên ô; sửa nhanh trên điện thoại là hàng 3d, gọi cùng luật.

## Luật ở một chỗ

`src/modules/listings/edit-rules.ts` (hàm thuần, qua `index.ts`): `readPrice`, `priceAsksAgain` (ngưỡng 20% khai một
chỗ), `STATUS_NEXT`, `nextStatuses`, `statusNeeds`, `statusUndoable`, `isLocked`. Ô và hàng 3d chỉ gọi các hàm này.

## Ghi vào đâu (Hỏi-1 — chủ kho duyệt theo khuyến nghị, 2026-11-13)

Lần sửa đi qua **một cổng lưu** ghi vào bộ dữ liệu mẫu trong bộ nhớ của trang — không ghi xuống bộ nhớ lâu dài của
trình duyệt, tải lại trang là về dữ liệu mẫu. Chữ ký của cổng mang đủ bốn kết cục mà đường ghi thật `/api/v1` sẽ trả —
**được**, **bị từ chối** (403), **lỗi mạng**, **xung đột** (căn đã đổi từ chỗ khác) — để hàng 10 cắm đường ghi thật vào mà
không đổi mã ô. Ở hàng này cổng mẫu chỉ sinh ra «được» và «lỗi mạng» (thiết bị mất mạng); «bị từ chối» và «xung đột» đo
bằng cổng giả trong bài kiểm; ô báo «xung đột» bằng câu riêng và về giá trị cũ. Lối cửa API không chọn; nếu sau này mở thì
dùng migration 012 (011 đã cấp cho 2c).

## Việc đi kèm

- Bài rào «màn tự dựng lại hành vi» (`tests/behavior-guard.test.ts`) đọc tệp theo đuôi: `.ts` là TypeScript, `.tsx` là
  TSX (việc phụ K-5 của hàng 1e) — một câu ép kiểu `<T>x` trong tệp `.ts` không còn che câu nhập phía sau.
- Lệch hydrate ở trạng thái tải của Bảng hàng (dãy V báo sau 9e): thử `?state=loading` ở 1440, tải lại hai lần — không
  tái hiện trên nhánh hiện tại; báo G, không sửa.
- Bốn nhãn mới ở `ontology/labels.yaml` (G duyệt H-1311-1): trường «Lý do ngừng» (`withdrawnReason`, khái niệm riêng —
  RESO DD 2.1 không có trường lý do rút) và ba giá trị «Chủ bán nơi khác», «Chủ đổi ý», «Mất liên lạc» (≤ 17 ký tự).
  Giá chốt, ngày bán đã có trong mô hình (RESO `ClosePrice`, `CloseDate`).

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → chọn ô Giá chào → gõ «2,8 tỷ» → khung đọc «Hiểu là» → Enter → ô đổi, Xác nhận lúc đổi, thông báo
  có Hoàn tác (điểm ra: ô vừa sửa, bàn phím ở đó).
- Biên: giá đổi quá 20% → hỏi lại tại ô; Đã bán → hỏi giá chốt, ngày; Ngừng hẳn → hỏi lý do; căn Đã bán → ô khoá; vai
  không quyền → ô như chữ thường; điện thoại → không mở sửa.
- Lỗi & quay lại: chữ chưa hiểu → báo trong khung, Enter không ghi, Esc về giá cũ · lưu hỏng → ô về giá cũ, thông báo nói
  vì sao · 403 → câu «Không đủ quyền» riêng · hoàn tác hỏng → thông báo đứng yên «Chưa hoàn tác được…» kèm Thử lại.

### 2. Kiểm kê màn

| Màn       | MỘT việc của màn                                           | Vào từ / ra tới       |
| --------- | ---------------------------------------------------------- | --------------------- |
| Bảng hàng | Đầu chủ xem và sửa giá, trạng thái từng căn như trên Sheet | App Shell / hồ sơ căn |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái                   | Màn       | Hiển thị gì                                                                                                                   | Người làm gì tiếp                           |
| ---------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| ST-bang-hang-sua-gia         | Bảng hàng | Khung dưới ô Giá chào: ô nhập, «Hiểu là: 2.800.000.000 ₫ (2,8 tỷ)», «Enter ghi · Esc huỷ · Tính là vừa xác nhận với chủ nhà.» | Enter ghi / Esc huỷ / Tab ghi rồi sang ô kế |
| ST-bang-hang-gia-chua-hieu   | Bảng hàng | Dòng đỏ trong khung «Chưa hiểu «abc» — gõ như 4,65 tỷ hoặc 950 triệu»                                                         | Gõ lại / Esc                                |
| ST-bang-hang-gia-hoi-lai     | Bảng hàng | «Giá đổi +72% — đổi chứ?» · «2,71 tỷ → 4,65 tỷ» · Thôi · Đổi giá                                                              | Đổi giá / Thôi                              |
| ST-bang-hang-sua-trang-thai  | Bảng hàng | Các nấc hợp lệ dạng nhãn trạng thái; Đã bán thêm Giá chốt, Ngày bán; Ngừng hẳn thêm Lý do ngừng                               | Chọn nấc, điền, Đổi trạng thái / Thôi       |
| ST-bang-hang-thieu-dieu-kien | Bảng hàng | «Còn thiếu giá chốt.» trong khung                                                                                             | Điền / Thôi                                 |
| ST-bang-hang-nac-cuoi        | Bảng hàng | «Đã bán là nấc cuối: không hoàn tác được.» trước khi ghi                                                                      | Đổi trạng thái / Thôi                       |
| ST-bang-hang-da-ghi          | Bảng hàng | Ô đổi, Xác nhận lúc đổi, thông báo «Đã đổi …» kèm Hoàn tác (hoặc «Không hoàn tác được.»)                                      | Hoàn tác / đi tiếp                          |
| ST-bang-hang-luu-hong        | Bảng hàng | Ô về giá trị cũ; thông báo «Chưa lưu được … — mất kết nối mạng…»                                                              | Sửa lại khi có mạng                         |
| ST-bang-hang-khong-du-quyen  | Bảng hàng | Ô về giá trị cũ; «Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.»                                           | Tải lại trang                               |
| ST-bang-hang-hoan-tac-hong   | Bảng hàng | Thông báo đứng yên «Chưa hoàn tác được vì mất kết nối mạng. Căn 1101 vẫn là 2,8 tỷ…» · Thử lại                                | Thử lại khi có mạng                         |
| ST-bang-hang-o-khoa          | Bảng hàng | Ổ khoá trên ô, trỏ vào nói «Đã bán — giữ nguyên như lúc bán»                                                                  | Mở hồ sơ để xem                             |
| ST-bang-hang-khong-quyen-sua | Bảng hàng | Ô như chữ thường; F2, gõ, bấm đúp không mở gì                                                                                 | Đọc, chép                                   |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Phím: F2, gõ ký tự, bấm đúp mở khung; Enter trên ô vẫn mở hồ sơ; trong khung Enter ghi, Esc huỷ, Tab ghi rồi sang ô
  kế; đóng khung thì tiêu điểm về ô vừa sửa.
- Giá viết đúng từng đồng ở mọi chỗ (chữ điền sẵn, «Hiểu là», hộp hỏi lại), nên mở ô rồi Enter không bao giờ đổi giá.
- Ngưỡng hỏi lại 20% khai một chỗ; đúng 20% thì ghi thẳng.
- Từ 768 px mới mở sửa; dưới đó cột Giá, Trạng thái chỉ đọc.

### 5. Xuất xứ component

| Component                                                 | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                                 |
| --------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------- |
| ReUI data-grid (`onCellEditRequest`, `cellEdit.editable`) | dùng                              | Lưới đã có F2, gõ để sửa, bấm đúp, khoá theo dòng               |
| `DataRegion` (`cellEdit`)                                 | mở rộng                           | Một chỗ quyết ô nào mở sửa theo bảng quyền và khoá của dòng     |
| `CellEditor` theo dáng ReUI data-grid-editing-2           | ghép                              | Ô nhập nằm trong ô, một dòng dưới ô (Hỏi-4); hàng 5 dùng lại    |
| `FormDialog`                                              | dùng                              | Đã bán, Ngừng hẳn và hỏi lại giá hỏi trong hộp giữa màn (Hỏi-4) |
| `useChange`                                               | mở rộng                           | Hoàn tác đi qua cổng lưu, hỏng thì báo                          |
| Badge trạng thái, Input, Button                           | dùng                              | Đã có trong kho                                                 |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: luồng hiển nhiên — Bảng hàng đã là danh sách với hồ sơ cạnh bảng (hàng 3); hàng này thêm sửa tại ô, không đổi
khuôn.

### 7. Thẻ việc

| Trường     | Giá trị                                                          |
| ---------- | ---------------------------------------------------------------- |
| Ai dùng    | Đầu chủ                                                          |
| Việc chính | Sửa giá và trạng thái một căn ngay trên Bảng hàng như trên Sheet |
| Tần suất   | mỗi ngày nhiều lần                                               |
| Số bản ghi | hàng trăm trở lên                                                |
| Thiết bị   | máy tính                                                         |

<!-- UX-SPEC-TEMPLATE>>> -->
