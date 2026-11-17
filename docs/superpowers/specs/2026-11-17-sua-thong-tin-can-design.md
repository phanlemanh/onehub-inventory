# Sửa thông tin căn — thiết kế (hàng 3g)

Hồ sơ: `_acceptance/sua-thong-tin-can/` · hàng 3g của `docs/plan/lo-trinh.json` · dãy H, đợt dieu-phoi-nen · T2.

## 1. Việc của hàng

Hàng 4 và 3d chỉ cho sửa giá, điều kiện phí và trạng thái. Pháp lý, nội thất, tài chính, tình trạng sử dụng — bốn phần
mà mức đủ thông tin (hàng 3b) đếm và điều kiện «Sẵn sàng bán» (hàng 15) sẽ đòi — chỉ vào được qua đường nhập tệp. Giá trị
các trường riêng của sàn (hàng 7e) cũng chỉ lưu và hiện (hàng 10), dán vào bị bỏ (hàng 5, Hỏi-3). Hàng này mở cả hai, và
trả bốn nợ của cửa lưu mà giám sát giao từ Cổng Bằng chứng hàng 10.

## 2. Chọn gì, căn cứ gì

| #   | Lựa chọn                                                                                                                                                                                                                                                                            | Căn cứ                                                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | Bốn trường sửa trong hồ sơ căn, ở mục «Lần chào đang mở»: nút phụ «Sửa» ở đầu mục, bên phải                                                                                                                                                                                         | `design/behaviors.md`, bảng «Bộ nút theo quyền»: «Việc trên một mục của hồ sơ — Đầu mục, bên phải — Nút phụ không viền». Bảng hàng không có cột cho bốn trường (tám cột đã ký ở hàng 2), nên «trên ô» không có ô để sửa                       |
| L2  | «Sửa» mở hộp `FormDialog` có bốn trường, «Lưu» và «Thôi»; một lần lưu là một thay đổi, một «Hoàn tác»                                                                                                                                                                               | `.claude/rules/ui.md`: «Follow the reuse order: reference screen and recipe, then `candidate`, then a ReUI block, then write your own.» — `FormDialog` là khối của kho cho «một màn hỏi vài trường» (hàng 9); không dựng khối sửa tại chỗ mới |
| L3  | Nội thất và Tình trạng sử dụng chọn trong ba giá trị cố định (cộng «Chưa có» để xoá); Pháp lý và Tài chính gõ chữ tự do, tối đa 200 ký tự                                                                                                                                           | sổ hàng 3b, Hỏi-1 (chủ kho chốt): «Pháp lý và Tài chính là chữ tự do như Quỹ hàng»; trần 200 ký tự là trần máy chọn cho một dòng chữ                                                                                                          |
| L4  | Chỉ lần chào đang mở có «Sửa»; xem lần chào trước thì không có nút                                                                                                                                                                                                                  | câu giao của hàng: «của lần chào đang mở»                                                                                                                                                                                                     |
| L5  | Quyền là ô `updateListing` của bảng quyền, qua `PermittedAction` (hàng 9e): ba vai sửa toàn sàn, Quản trị sàn không thấy nút                                                                                                                                                        | `ontology/actions.yaml` + Hỏi-2 hàng 10 (chủ kho chọn A: toàn sàn). Không thêm thao tác mới                                                                                                                                                   |
| L6  | Trường riêng của sàn sửa trên ô của lưới từ 768 px (như giá), mỗi kiểu một bộ sửa: chữ, số, ngày, chọn một, có/không; ô để trống là xoá giá trị                                                                                                                                     | câu `bat_khi` của hàng: «mỗi trường sửa theo kiểu của nó (chữ, số, ngày, chọn một, có/không)»; điện thoại không sửa trên ô (hàng 4, `use-listing-cell-edit.tsx`: «Phones do not edit in a cell (the quick phone edit is row 3d)»)             |
| L7  | Dán từ Excel vào cột riêng theo kiểu của trường: giá trị sai kiểu, lựa chọn không có hay trường đã ngừng nằm ở nhóm «sai kiểu» của hộp xem trước                                                                                                                                    | câu `bat_khi`: «dán từ Excel (hàng 5) cũng dán được vào các cột ấy, theo kiểu của trường»; hộp `PastePreview` của hàng 5                                                                                                                      |
| L8  | Máy chủ kiểm giá trị trường riêng bằng luật `checkCustomValue` của mô-đun company-config, tiêm vào handler từ tệp route (`src/app/api/v1/listings/[id]/route.ts`)                                                                                                                   | một luật một chỗ (AGENTS.md); mô-đun listings không phụ thuộc company-config (`architecture/modules.yaml`) — thêm phụ thuộc là đổi thiết kế, còn với vào bảng của mô-đun khác thì bị cấm                                                      |
| L9  | Ghi đi đúng một cửa `PATCH /api/v1/listings/[id]`, cùng phiên bản, cùng `applyChange` của hàng 4: hai loại thay đổi mới `details` (bốn trường) và `customField` (một mã, một giá trị)                                                                                               | AGENTS.md «`/api/v1` is the only write path»; câu `bat_khi`: «không viết luật thứ hai»                                                                                                                                                        |
| L10 | Nợ (a)+(b): một luật đọc kết cục ghi ở `src/lib/write-failure.ts` cho cả cửa lưu Bảng hàng và cửa ghi chung `useChange`: 401 → «phiên hết hạn», 403 → «không đủ quyền», 409/404 → «căn vừa đổi», 400 → «máy chủ không nhận», 5xx và thân trả lời không đọc được → «máy chủ báo lỗi» | lời giao của giám sát (Nợ giao HÀNG 3g); luật «một nhu cầu một chủ»                                                                                                                                                                           |
| L11 | Câu «phiên hết hạn» đặt ở `cell-edit-copy.ts` cạnh các câu lỗi đang có; `labels.yaml` chỉ giữ chữ khái niệm                                                                                                                                                                         | G-1711-8 duyệt; `design/language.md`                                                                                                                                                                                                          |

Câu chỉ người có (lên thẻ Cổng Phạm vi):

- **Hỏi-1** · Sửa bốn trường hay trường riêng có tính là «vừa xác nhận với chủ nhà» không. Khuyên **có, mọi lần sửa** —
  đúng một luật của hàng 4 (`applyChange` đặt «Xác nhận lúc» cho mọi thay đổi). Lối khác: chỉ bốn trường tính, trường
  riêng không — thêm một nhánh luật; giá: hai luật để nhớ.
- **Hỏi-2** · Khối dán từ Sheet đi qua cột tính (Về tay nằm ngay sau Giá chào). Khuyên **giữ vị trí như Sheet** — khối
  rơi đúng cột người thấy, chữ rơi vào cột tính bị bỏ và hộp xem trước nói vì sao (hàng 5 đang làm thế). Lối khác: nhảy
  qua cột tính — khối lệch một cột so với lưới người đang nhìn; giá: sửa khối lưới dùng chung, người dán phải nhớ cột nào
  bị nhảy.

## 3. Nợ của cửa lưu (đưa vào hợp đồng)

- (a) Cửa lưu báo 500, 401 và thân hỏng thành «không có quyền» → AC-7.
- (b) Hai bản luật báo lỗi (`http-save-door.ts`, `src/lib/write-failure.ts`) → gộp một, AC-7.
- (c) Bài nhỏ của cửa lưu dùng thân trả lời viết tay → bài lấy Response thật từ `createListingsHandlers`, AC-7.
- (d) `tests/bang-hang-khong-du-quyen.test.tsx` ca `khong-du-quyen-tren-man` thiếu đối chứng dương → AC-8.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng → bấm một dòng, hồ sơ căn mở → mục «Lần chào đang mở» → «Sửa» → hộp bốn trường → «Lưu» → hộp
  đóng, mục hiện giá trị mới, mức đủ thông tin đếm lại, thông báo «Đã đổi thông tin căn 1101.» kèm «Hoàn tác».
- Trường riêng: ô của cột riêng → Enter hay gõ → bộ sửa theo kiểu → Enter lưu, Esc thôi → thông báo kèm «Hoàn tác».
- Biên: vai không có ô `updateListing` không thấy «Sửa» và ô không mở; lần chào đã đóng hay đang xem lần trước thì không có
  «Sửa»; không đổi gì thì «Lưu» không gửi.
- Lỗi & quay lại: mất mạng, căn vừa đổi, phiên hết hạn, máy chủ lỗi → hộp giữ chữ đã gõ, nói vì sao, «Thử lại»; 403 → câu
  «Không đủ quyền…», chỉ còn «Thôi». Trên ô: ô về giá trị cũ và thông báo nói vì sao (luật hàng 4).

### 2. Kiểm kê màn

| Màn                                 | MỘT việc của màn                    | Vào từ / ra tới              |
| ----------------------------------- | ----------------------------------- | ---------------------------- |
| inventory · hồ sơ căn               | đọc và sửa thông tin một lần chào   | dòng của lưới / đóng hồ sơ   |
| inventory · hộp «Sửa thông tin căn» | đổi bốn trường của lần chào đang mở | nút «Sửa» của mục / về hồ sơ |
| inventory · ô cột riêng             | đổi một giá trị trường riêng        | ô của lưới / về ô            |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái           | Màn         | Hiển thị gì                                                                        | Người làm gì tiếp |
| -------------------- | ----------- | ---------------------------------------------------------------------------------- | ----------------- |
| ST-ho-so-co-nut-sua  | hồ sơ căn   | mục «Lần chào đang mở» có nút «Sửa»                                                | bấm «Sửa»         |
| ST-ho-so-khong-quyen | hồ sơ căn   | mục không có nút (Quản trị sàn, lần chào trước, lần chào đã đóng)                  | chỉ đọc           |
| ST-hop-sua-dang-luu  | hộp sửa     | «Đang lưu», nút tắt                                                                | chờ               |
| ST-hop-sua-loi       | hộp sửa     | câu lỗi theo kết cục, chữ đã gõ còn nguyên, «Thử lại»                              | thử lại / thôi    |
| ST-hop-sua-tu-choi   | hộp sửa     | «Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.», chỉ còn «Thôi» | thôi, tải lại     |
| ST-o-rieng-sai-kieu  | ô cột riêng | dòng dưới ô nói kiểu cần gõ                                                        | gõ lại / Esc      |
| ST-o-rieng-loi-luu   | ô cột riêng | ô về giá trị cũ, thông báo nói vì sao                                              | sửa lại           |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Hộp: tiêu điểm đầu ở trường Pháp lý; Enter lưu, Esc thôi; tiêu điểm về nút «Sửa» khi đóng (luật `FormDialog`).
- Pháp lý, Tài chính: tối đa 200 ký tự, cắt khoảng trắng hai đầu; để trống là xoá.
- Trường riêng chữ: tối đa 500 ký tự (`TEXT_VALUE_LIMIT`); số: hiểu dấu phẩy thập phân kiểu Việt; ngày: dd/mm/yyyy; có/không:
  chọn «Có», «Không», «Chưa có».
- Điện thoại: hồ sơ toàn màn, hộp sửa như máy tính; ô không mở dưới 768 px.

### 5. Xuất xứ component

| Component                 | Nấc     | Vì sao                                                                               |
| ------------------------- | ------- | ------------------------------------------------------------------------------------ |
| FormDialog                | dùng    | hộp vài trường của kho (hàng 9)                                                      |
| Field, Input, Select (ui) | dùng    | trường của hộp, như các hộp khác                                                     |
| PermittedAction           | dùng    | nút theo bảng quyền (hàng 9e)                                                        |
| ListingCellEdit           | mở rộng | thêm bộ sửa theo kiểu cho cột riêng, cùng khung «editing-2 + dòng dưới ô» của hàng 4 |
| PastePreview              | dùng    | xem trước khi dán (hàng 5)                                                           |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: Bảng hàng đã là danh sách và hồ sơ căn mở cạnh (hàng 2, 3b); hàng này chỉ thêm việc sửa vào chi tiết — một khuôn, không tra.

### 7. Thẻ việc

| Trường     | Giá trị                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Ai dùng    | Đầu chủ (cùng Đầu khách, Trưởng nhóm)                                                                        |
| Việc chính | Đầu chủ xem, lọc và sửa danh sách hàng thay cho bảng tính — ở đây: điền đủ thông tin căn sau khi gọi chủ nhà |
| Tần suất   | mỗi ngày nhiều lần                                                                                           |
| Số bản ghi | hàng trăm trở lên                                                                                            |
| Thiết bị   | cả hai                                                                                                       |

<!-- UX-SPEC-TEMPLATE>>> -->

## 4. Tệp sẽ chạm

Trong vùng: `src/modules/listings/{save-door,listings-http,paste-rules,edit-rules,index,server}.ts`,
`src/modules/listings/ui/{http-save-door.ts,cell-edit-copy.ts,listing-cell-edit.tsx,use-listing-cell-edit.tsx,listing-paste.ts,listing-record-full.tsx,inventory-grid.tsx,inventory-rows.ts,record-copy.ts}`, tệp mới
`src/modules/listings/ui/listing-details-edit.tsx`. Ngoài vùng (G-1711-8 duyệt H-8): route PATCH, `inventory/page.tsx`,
`inventory-view.ts`, `src/lib/write-failure.ts`, `use-change.tsx` (+ bài), `tests/bang-hang-khong-du-quyen.test.tsx`;
bài mới trong `tests/`. Không chạm `unit-jump.tsx` (VP7 của dãy R).
