# Dán từ Excel — thiết kế (hàng 5)

Hàng 5 của lộ trình, mã phạm vi B5. Câu giao: Đầu chủ dán một vùng từ Excel vào bảng và thấy trước những ô sẽ đổi. Vì
sao: giữ thói quen dán từ Sheet. Ô Cổng Đáng: `_acceptance/dan-tu-excel/opportunity.md` (build, Manh Phan, 2026-11-15,
«Cho cả đợt»). Đứng trên hàng 4 «Sửa trên ô» (đã gộp). Nguồn đối chiếu: trang
`docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md` («dán một cột từ Excel thì xem trước chỗ sẽ đổi rồi mới áp»; Quỹ
hàng chưa bao giờ dựng dán, nên B5 không có bản cũ để tham khảo).

## Ý chính

- Đầu chủ chọn một ô (hay một vùng) trên Bảng hàng ở máy tính rồi **Ctrl/Cmd+V** một vùng chép từ Excel hay Sheet. **Chưa
  ô nào đổi**: máy đọc vùng dán rồi mở **bản xem trước**.
- Bản xem trước nói ba điều, theo từng ô: **sẽ đổi** («Căn 1101 · Giá chào · 2,71 tỷ → 2,8 tỷ»), **bị bỏ và vì sao**
  («Căn 1102 · Diện tích — thuộc tính căn, không sửa trên bảng»), **sai kiểu** («Căn 1103 · Giá chào — chưa hiểu «hai
  tỷ», gõ như 4,65 tỷ hoặc 950 triệu»). Giá lệch quá 20% được đánh dấu ngay trên dòng ấy kèm phần trăm (và để bỏ chọn sẵn, Hỏi-6).
- **Áp một lần** cho cả vùng: nút «Áp 6 ô». Mỗi ô đi qua đúng cửa lưu của hàng 4, thông báo «Đã đổi 6 ô của 3 căn.» kèm
  **Hoàn tác một lần** cho cả vùng. «Thôi» hay Esc không ghi gì.
- Không viết luật thứ hai: đọc giá bằng `readPrice`, nấc trạng thái bằng `canMove` / `statusNeeds`, khoá bằng
  `priceLocked` / `statusLocked`, quyền bằng thao tác `updateListing` của bảng quyền, ghi bằng cửa lưu `save-door`, báo và
  hoàn tác bằng `use-change`. Thêm đúng một hàm thuần đọc chữ trạng thái theo từ điển giá trị (nhãn trạng thái của sàn
  theo bán hay cho thuê) vào tệp luật của mô-đun căn.

## Đọc một vùng dán (khuôn Excel, lưới ReUI đã có)

Lưới ReUI dưới `DataRegion` đã có đường dán khuôn Excel: đọc chữ tách tab (kể cả ô nhiều dòng trong nháy), khối 1×1 điền
cả vùng chọn, khối lặp khi vùng chọn là bội số của khối, còn lại dán một lần từ góc trên trái và dừng ở mép bảng; dòng
đang ẩn vì lọc bị bỏ qua; mỗi ô gọi `parse` của cột. Hôm nay `DataRegion` không nối đường ấy nên dán không làm gì. Hàng 5
nối nó: `DataRegion` nhận một lô thay đổi và chuyển cho màn — không ghi gì tự mình.

Từng ô của lô rơi vào đúng một ngăn:

| Ô dán vào                                                                                       | Ngăn          | Lời nói trong bản xem trước                                                           |
| ----------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| Giá chào, chữ đọc được, khác giá cũ                                                             | sẽ đổi        | cũ → mới; lệch >20% có dấu «+72%»                                                     |
| Giá chào, chữ chưa hiểu                                                                         | sai kiểu      | «Chưa hiểu «…» — gõ như 4,65 tỷ hoặc 950 triệu» (câu của hàng 4)                      |
| Trạng thái, chữ khớp một nhãn trạng thái (bỏ dấu, không phân biệt hoa thường) và là nấc đi được | sẽ đổi        | cũ → mới                                                                              |
| Trạng thái, chữ không khớp nhãn nào                                                             | sai kiểu      | «Chưa hiểu «…» — gõ một trong: Đang bán, Đang giữ chỗ, …»                             |
| Trạng thái, nấc không đi được từ trạng thái hiện tại                                            | bị bỏ         | «Từ Đang giữ chỗ không sang Chưa đủ thông tin được»                                   |
| Trạng thái sang Đã bán hay Ngừng hẳn                                                            | bị bỏ (Hỏi-2) | «Đã bán cần giá chốt và ngày bán — mở ô để đổi»                                       |
| Ô khoá (căn Đã bán; trạng thái nấc cuối)                                                        | bị bỏ         | lý do khoá của hàng 4 («Đã bán — giữ nguyên như lúc bán»)                             |
| Giá trị giống hệt giá trị đang có                                                               | giữ nguyên    | chỉ đếm «2 ô giữ nguyên», không ghi                                                   |
| Ô trống trong vùng dán                                                                          | giữ nguyên    | đếm cùng «giữ nguyên» — cửa lưu không có thao tác xoá giá, trạng thái luôn có giá trị |
| Cột thuộc tính căn (Căn, Toà, Khu, Diện tích, Phòng ngủ)                                        | bị bỏ         | «thuộc tính căn — không sửa trên bảng» (hàng 4, Never chủ kho đã ký)                  |
| Cột Xác nhận lúc                                                                                | bị bỏ         | «máy tự ghi khi giá hay trạng thái đổi»                                               |
| Cột tính (Về tay, hàng 19)                                                                      | bị bỏ         | «tính từ Giá chào và mức của sàn»                                                     |
| Cột riêng của sàn (hàng 7e)                                                                     | bị bỏ (Hỏi-3) | «sửa ở hồ sơ căn — hàng 3g»                                                           |
| Dòng tiêu đề nhóm (khi đang nhóm theo Toà)                                                      | bị bỏ         | «dòng nhóm «Toà A»»                                                                   |
| Phần vùng dán thừa ra ngoài đáy hay mép phải bảng                                               | bị bỏ         | «3 dòng thừa dưới đáy bảng — dán không thêm căn» (thêm căn là hàng 12)                |

Vai không có `updateListing` (Quản trị sàn): dán không mở bản xem trước; thông báo «Vai của bạn chưa sửa được căn trên
bảng.» — không im.

## Áp và hoàn tác

- «Áp N ô»: các ô sẽ đổi đổi ngay trên bảng; cửa lưu được gọi một lần cho mỗi ô (một `ListingChange` mỗi ô, theo thứ tự
  dòng rồi cột); Xác nhận lúc của mỗi căn có ô đổi thành lúc áp. Hai ô của cùng một căn ghi nối nhau với phiên bản mới của
  căn.
- Thông báo kết quả: «Đã đổi 6 ô của 3 căn.» kèm Hoàn tác. Hoàn tác ghi lại giá trị cũ của mọi ô đã ghi, theo thứ tự
  ngược. Hoàn tác hỏng thì thông báo đứng yên nói căn nào vẫn mang giá trị mới, kèm «Thử lại» (khuôn hàng 4).
- Một phần hỏng khi áp (mất mạng giữa chừng, xung đột, 403): ô đã ghi giữ giá trị mới, ô hỏng về giá trị cũ; thông báo
  «Đã đổi 4 ô; 2 ô chưa ghi được — mất kết nối mạng.» kèm Hoàn tác cho phần đã ghi. Mất mạng từ đầu thì không ô nào đổi và
  thông báo nói vì sao.

## Câu hỏi cho chủ kho (Cổng Phạm vi)

- **Hỏi-1 — dáng bản xem trước.** Khuyên **A: hộp thoại danh sách** (khối hộp biểu mẫu của kho) — đọc được từng lý do bằng
  chữ, đi bằng phím, bảng phía sau không đổi tới khi áp. Lối khác: **B: đánh dấu ngay trên lưới** (ô sẽ đổi tô góc, ô bỏ
  góc đỏ, thanh «Áp / Thôi» trên đầu lưới — giống Sheet nhất, nhưng lý do chỉ hiện khi trỏ vào từng ô); **C: ngăn bên
  cạnh bảng** (danh sách ở chỗ hồ sơ căn, lưới đánh dấu ô — thấy cả hai, nhưng hẹp, chữ dài bị cắt). Ảnh ba lối cùng một
  vùng dán đặt cạnh nhau trên trang Cổng Phạm vi.
- **Hỏi-2 — dán trạng thái Đã bán hay Ngừng hẳn.** Khuyên **bỏ, kèm lý do «cần giá chốt và ngày bán — mở ô để đổi»**: hai
  nấc này là nấc cuối và đòi thêm thông tin (hàng 4, Hỏi-3 đã ký). Lối khác: bản xem trước hỏi thêm từng căn (giá chốt,
  ngày, lý do) — dài và dễ sai khi dán nhiều căn.
- **Hỏi-3 — cột riêng của sàn (hàng 7e).** Khuyên **để hàng 3g «Sửa thông tin căn»**: hôm nay chưa ô nào sửa được cột
  riêng và cửa lưu chưa có đường ghi trường riêng; mở ở hàng 5 là viết đường ghi trước luật sửa. Lối khác: mở ngay, đọc
  theo kiểu của cột (số, tiền, ngày, có/không, chọn một) — thêm một đường ghi ở cửa lưu và luật đọc từng kiểu.
- **Hỏi-4 — điện thoại.** Khuyên **không dán ở điện thoại** (dưới 768 px): từ hàng 2b điện thoại hiện thẻ căn, không có
  bảng ô để chọn vùng; sửa trên ô cũng chỉ mở từ 768 px (hàng 4). Lối khác: dán vào thẻ — không có chỗ đặt một vùng nhiều
  cột.
- **Hỏi-5 — làm gì với từng ô trong bản xem trước.** Khuyên **bỏ chọn được từng ô sẽ đổi** (ô đánh dấu, mặc định chọn hết;
  nút đổi theo số ô còn chọn) và **không sửa chữ ngay trong bản xem trước** — sửa ở Excel rồi dán lại, hay áp rồi sửa trên
  ô. Lối khác: chỉ «Áp tất cả» hay «Thôi» (ít bấm hơn nhưng một ô sai buộc dán lại cả vùng); hoặc cho sửa chữ trong bản xem
  trước (thêm một trình sửa thứ hai cạnh trình sửa trên ô — hai chỗ một luật).

- **Hỏi-6 — giá lệch quá 20% trong vùng dán.** Đây là mức chặn chống ghi sai giá của hàng 4. Khuyên **dòng ấy mang dấu phần
  trăm và để bỏ chọn sẵn** — người dán tự chọn nó mới được ghi; nút «Áp» đếm theo dòng đang chọn. Lối khác: bấm «Áp» là câu
  trả lời cho mọi dòng có dấu (ít bấm nhất, chặn lỏng nhất — một cột giá lệch dòng trong Excel ghi sai cả loạt); hỏi gom
  một lần sau khi bấm «Áp», liệt các dòng lệch lớn (thêm một hộp). Phản biện ngữ cảnh sạch chỉ ra câu này (gap-probe P0).

## Máy đã quyết (đổi được ở cổng)

- Ô trống trong vùng dán giữ nguyên giá trị (như «bỏ qua ô trống» của Excel): cửa lưu không có thao tác xoá giá.
- Hoàn tác bằng Ctrl/Cmd+Z và báo khi hai người cùng sửa vẫn ở hàng 10 (như hàng 4).
- Kéo điền (kéo góc ô) không mở ở hàng này: câu giao chỉ nói dán; sửa vẫn làm được bằng dán và sửa trên ô.
- Nấc trạng thái mà đường về không là nấc hợp lệ (Chưa đủ để rao → Đang bán) mang nhãn «Không hoàn tác được» trên dòng ấy;
  Hoàn tác của cả vùng đảo các ô còn lại và nói «Đã hoàn tác 5 ô; 1 ô không hoàn tác được.».
- Cắt (Ctrl/Cmd+X), Delete/Backspace trên vùng chọn không ghi gì — lưới chỉ ghi qua bản xem trước và trình sửa trên ô.

## Ranh giới với hàng 11 «Nạp tệp Excel hay Sheet»

Hàng 11 nạp cả tệp, ghép cột, tên cột, giá trị và mã căn của sàn vào chuẩn, lần sau nhớ cách ghép. Hàng 5 chỉ dán một vùng
vào **đúng các cột đang hiện** của bảng, theo vị trí: không ghép cột, không đọc tiêu đề, không tạo căn, không nhớ gì. Khối
bản xem trước (danh sách «sẽ đổi / bị bỏ / sai kiểu» kèm áp một lần, hoàn tác một lần) đặt ở `src/components/candidate/`
để hàng 11 dùng lại — một nhu cầu, một chủ: hàng 5 làm chủ.

## Ba hàng đang chờ gộp cùng chạm Bảng hàng

- 2b (thẻ căn ở điện thoại, PR #63): ở 360/414 không có bảng; dán không có ở điện thoại (Hỏi-4). Phần dựng chờ 2b vào main.
- 2d (cây địa lý ở cột thứ hai, PR #65): không chạm lưới; hàng gộp sau ghép tay.
- 19 (cột Về tay, PR #64): cột tính, dán bị bỏ với lý do riêng; hàng gộp sau ghép tay câu lý do vào cột ấy.

<!-- <<<UX-SPEC-TEMPLATE -->

## Đặc tả UX

### 1. Luồng

- Suôn sẻ: Bảng hàng (1440, Đầu chủ) → chọn ô Trạng thái của căn đầu → Ctrl/Cmd+V vùng 3 dòng × 2 cột từ Excel → bản xem
  trước «6 ô sẽ đổi» → «Áp 6 ô» → ô đổi, Xác nhận lúc đổi, thông báo «Đã đổi 6 ô của 3 căn.» kèm Hoàn tác (điểm ra: ô vừa
  chọn, bàn phím ở đó).
- Biên: vùng dán có ô bị bỏ hay sai kiểu → nằm ở ngăn riêng kèm lý do, nút «Áp» đếm đúng số ô sẽ đổi · không ô nào đổi được
  → bản xem trước chỉ còn «Thôi» · giá lệch >20% → dấu phần trăm trên dòng · vai không quyền → thông báo, không bản xem
  trước · đang lọc → dán vào dòng đang hiện · điện thoại → không dán.
- Lỗi & quay lại: Esc hay «Thôi» → bảng như cũ · áp hỏng một phần → ô hỏng về giá trị cũ, thông báo nói số ô và vì sao ·
  hoàn tác hỏng → thông báo đứng yên kèm Thử lại.

### 2. Kiểm kê màn

| Màn                               | MỘT việc của màn                               | Vào từ / ra tới                    |
| --------------------------------- | ---------------------------------------------- | ---------------------------------- |
| Bảng hàng — bản xem trước khi dán | Đầu chủ thấy trước ô nào sẽ đổi rồi áp một lần | Bảng hàng (Ctrl/Cmd+V) / Bảng hàng |

### 3. Bảng trạng thái

<!-- <<<UX-STATE-TABLE -->

| Trạng thái           | Màn           | Hiển thị gì                                                                                                         | Người làm gì tiếp              |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ST-dan-xem-truoc     | bản xem trước | «Dán vào 3 căn» · «6 ô sẽ đổi · 2 ô bị bỏ · 1 ô sai kiểu · 2 ô giữ nguyên», từng dòng cũ → mới, ngăn bị bỏ có lý do | Áp N ô / Thôi                  |
| ST-dan-khong-o-nao   | bản xem trước | «Không ô nào đổi được» kèm danh sách bị bỏ, sai kiểu                                                                | Thôi                           |
| ST-dan-dang-ap       | bản xem trước | nút «Đang áp…» khoá, danh sách giữ nguyên                                                                           | chờ                            |
| ST-dan-da-ap         | Bảng hàng     | ô mới, thông báo «Đã đổi 6 ô của 3 căn.» · Hoàn tác                                                                 | Hoàn tác / làm tiếp            |
| ST-dan-ap-mot-phan   | Bảng hàng     | thông báo «Đã đổi 4 ô; 2 ô chưa ghi được — mất kết nối mạng.» · Hoàn tác                                            | Hoàn tác / dán lại khi có mạng |
| ST-dan-hoan-tac-hong | Bảng hàng     | thông báo đứng yên «Chưa hoàn tác được … vẫn là …» · Thử lại                                                        | Thử lại                        |
| ST-dan-khong-quyen   | Bảng hàng     | thông báo «Vai của bạn chưa sửa được căn trên bảng.»                                                                | —                              |

<!-- UX-STATE-TABLE>>> -->

### 4. Hành vi

- Phím: Ctrl/Cmd+V trên ô đang chọn của lưới. Bản xem trước mở với tiêu điểm ở nút «Áp»; Tab, Shift+Tab đi qua ô đánh dấu
  từng dòng và hai nút; Space bật tắt một dòng; Esc đóng không ghi; đóng thì tiêu điểm về ô đang chọn của lưới.
- Trình đọc màn hình: tên hộp thoại «Dán vào 3 căn», mô tả là dòng đếm; danh sách có tên «Sẽ đổi», «Bị bỏ»; kết quả áp đọc
  qua thông báo (vùng `status`).
- Khổ: từ 768 px (như sửa trên ô); dưới 768 px không dán (Hỏi-4).
- Giới hạn: vùng dán theo đúng dòng đang hiện và cột đang hiện; không thêm dòng, không thêm cột.

### 5. Xuất xứ component

| Component                                         | Nấc (dùng / ghép / mở rộng / tạo) | Vì sao (1 dòng)                                                                        |
| ------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `DataRegion`                                      | mở rộng                           | nối đường dán sẵn có của lưới ReUI vào cửa sửa của màn; không ghi gì tự mình           |
| `FormDialog`                                      | dùng                              | hộp biểu mẫu của kho: tiêu đề, một câu, phần thân, «Thôi» và nút chính                 |
| `Item`, `Checkbox`, `Badge`                       | dùng                              | dòng của danh sách, chọn từng ô, dấu lệch giá                                          |
| `PastePreview` (mới, `src/components/candidate/`) | ghép                              | thân bản xem trước «sẽ đổi / bị bỏ / sai kiểu» ghép từ các khối trên; hàng 11 dùng lại |
| `runDoorBatch` (mới, `use-change`)                | mở rộng                           | áp một lần, hoàn tác một lần cho nhiều lần ghi qua cùng cửa                            |

### 6. Khuôn IA đã chọn + căn cứ

Khuôn IA: danh-sách-chi-tiết (master-detail)
Căn cứ: (ii) — bản xem trước là một bước xác nhận đặt trên màn Lưới đang mở, không phải màn mới; Bảng hàng giữ khuôn
danh-sách-chi-tiết của họ Lưới (hồ sơ căn cạnh bảng). Không tra mẫu thị trường: luồng hiển nhiên.

### 7. Thẻ việc

| Trường     | Giá trị                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ |
| Ai dùng    | Đầu chủ                                                                                    |
| Việc chính | Dán một vùng giá và trạng thái từ Excel vào Bảng hàng, thấy trước ô nào đổi rồi áp một lần |
| Tần suất   | mỗi ngày                                                                                   |
| Số bản ghi | hàng trăm trở lên                                                                          |
| Thiết bị   | máy tính                                                                                   |

<!-- UX-SPEC-TEMPLATE>>> -->

## Độ phủ (quét không gian)

Chân sản phẩm: `docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md`, hợp đồng hàng 4, `src/modules/listings/edit-rules.ts`.
Chân ngành: khuôn dán của Microsoft Excel và Google Sheets (khối lặp theo vùng chọn, dán từ góc trên trái, «bỏ qua ô
trống») — đây là thói quen câu giao đòi giữ.

- Trục A — cột đích: Giá chào · Trạng thái · thuộc tính căn · Xác nhận lúc · cột tính · cột riêng của sàn
- Trục B — chữ trong ô: đọc được và khác · giống hệt · trống · chưa hiểu · nấc không đi được · nấc cần thêm thông tin
- Trục C — căn và người: căn mở · căn khoá · vai có quyền · vai không quyền · dòng nhóm · dòng đang ẩn vì lọc
- Trục D — hình vùng dán: một ô · vừa khít · lặp theo vùng chọn · thừa ra ngoài đáy hay mép phải
- Trục E — sau khi áp: ghi hết · hỏng một phần · mất mạng từ đầu · hoàn tác · hoàn tác hỏng
- Lớp chung: phím và trình đọc màn hình · khổ màn · chữ từ bảng nhãn
