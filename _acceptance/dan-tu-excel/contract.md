---
schema_version: 1
feature: Đầu chủ dán một vùng từ Excel vào bảng và thấy trước những ô sẽ đổi
slug: dan-tu-excel
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-15T04:11:20Z
design_doc: docs/superpowers/specs/2026-11-15-dan-tu-excel-design.md
---

# Acceptance Contract: dan-tu-excel

## Context

Hàng 5 của lộ trình (B5), đứng trên hàng 4 «Sửa trên ô» (đã gộp). Bảng hàng trên máy tính đã sửa được Giá chào và Trạng
thái từng ô qua một cửa lưu có hoàn tác; hàng này cho dán một vùng từ Excel hay Sheet vào bảng, thấy trước ô nào sẽ đổi,
ô nào bị bỏ và vì sao, rồi áp một lần, hoàn tác một lần. Mọi luật đi qua đúng tệp luật, bảng quyền, cửa lưu và hoàn tác của
hàng 4 — không đường ghi thứ hai. Không chạm ba luật sản phẩm: không bảng mới, không gửi gì, không ra trang khách.

Source input: ô cơ hội `_acceptance/dan-tu-excel/opportunity.md` (build, Manh Phan, 2026-11-15) · hàng 5 của
`docs/plan/lo-trinh.json` · trang `docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md` · lời giao của giám sát.

## Criteria

- AC-1: Given Đầu chủ trên Bảng hàng khổ 1440 đã chọn ô Trạng thái của căn đầu bảng, When dán (Ctrl/Cmd+V) một vùng chữ
  tách tab 3 dòng × 2 cột như Excel chép ra (trạng thái, giá), Then chưa ô nào đổi và cửa lưu chưa được gọi lần nào; bản
  xem trước mở, mỗi ô sẽ đổi một dòng «căn · cột · cũ → mới», và dòng đếm nói đúng số ô sẽ đổi, bị bỏ, sai kiểu, giữ
  nguyên. (cross-layer)
- AC-2: Given bảng chữ dán viết trước (ít nhất 24 ca: giá đọc được, giá chưa hiểu, nhãn trạng thái có dấu, không dấu, hoa
  thường, nhãn cho thuê, chữ lạ, ô trống, giá trị giống hệt), When máy đọc từng ô của vùng dán, Then mỗi ca rơi vào đúng
  ngăn viết trước (sẽ đổi · sai kiểu · giữ nguyên) với giá trị đúng từng đồng hay đúng trạng thái; giá đọc bằng `readPrice`
  của hàng 4 và chữ trạng thái bằng một hàm thuần của tệp luật mô-đun căn; ô sai kiểu nói câu gợi ý của hàng 4 («gõ như
  4,65 tỷ hoặc 950 triệu») hay danh sách nhãn trạng thái.
- AC-3: Given vùng dán phủ các ô không sửa được, When bản xem trước mở, Then mỗi ô ấy nằm ở ngăn «bị bỏ» kèm đúng lý do
  viết trước: cột thuộc tính căn, cột Xác nhận lúc, cột tính, cột riêng của sàn (theo Hỏi-3), ô khoá của căn Đã bán, nấc
  trạng thái không đi được, nấc Đã bán hay Ngừng hẳn (theo Hỏi-2), dòng tiêu đề nhóm, phần vùng dán thừa ra ngoài đáy hay
  mép phải bảng (nói số dòng, cột thừa; dán không thêm căn). Ma trận viết trước, mỗi lý do ít nhất một ca.
- AC-4: Given ngưỡng hỏi lại 20% của hàng 4, When một ô giá sẽ đổi lệch quá 20% so với giá cũ, Then dòng ấy trong bản xem
  trước mang dấu phần trăm và giá cũ → mới, và theo Hỏi-6 (khuyên) dòng ấy để bỏ chọn sẵn — không được ghi trừ khi người
  dán tự chọn; lệch đúng 20% hay ít hơn, hay căn chưa có giá, thì không dấu và chọn sẵn; không hộp hỏi lại nào mở sau khi
  bấm Áp. Biên viết trước: +20% / +20,01% / −20,01% / chưa có giá; ca màn: một giá +110% trong vùng dán → Áp ghi các ô
  khác, không ghi ô ấy, 0 hộp thoại mở sau Áp; chọn ô ấy rồi Áp → ô ấy được ghi. (cross-layer)
- AC-5: Given bản xem trước có N ô đang chọn, When bấm «Áp N ô», Then cửa lưu được gọi đúng N lần, mỗi lần một ô với đúng
  giá trị đã thấy, hai ô của cùng một căn ghi nối nhau (lần ghi sau mang phiên bản lần ghi trước trả về, không xung đột),
  ô trên bảng hiện giá trị mới, Xác nhận lúc của mỗi căn có ô đổi thành lúc áp, và một thông báo «Đã đổi N ô của K căn.»
  kèm Hoàn tác; When bấm «Thôi» hay Esc, Then cửa lưu 0 lần và bảng như cũ. Theo Hỏi-5: bỏ chọn một ô thì nút thành
  «Áp N−1 ô» và ô ấy không được ghi. (cross-layer)
- AC-6: Given một lần áp vừa ghi, When bấm Hoàn tác, Then cửa lưu được gọi một lần cho mỗi ô đã ghi với giá trị trước, theo
  thứ tự ngược, và mọi ô về giá trị ấy; When áp hỏng một phần, Then ô đã ghi giữ giá trị mới, ô hỏng về giá trị cũ và thông
  báo nói đúng số ô chưa ghi được và đúng lý do theo ma trận ba nguyên nhân viết trước (mất mạng · căn vừa đổi từ chỗ khác ·
  không đủ quyền); When hoàn tác hỏng, Then thông báo đứng yên nói ô nào vẫn mang giá trị mới kèm «Thử lại», không bao giờ
  im. (cross-layer)
- AC-7: Given bảng quyền của 9a, When vai không có thao tác `updateListing` (Quản trị sàn) dán vào Bảng hàng, Then không
  bản xem trước nào mở, cửa lưu 0 lần và một thông báo nói vai chưa sửa được căn trên bảng; vai có quyền thì mở. Dưới 768 px
  không dán được, ở mọi vai (theo Hỏi-4); cắt, Delete và Backspace trên vùng chọn không ghi gì ở mọi khổ.
- AC-8: Given bản xem trước đang mở, When chỉ dùng bàn phím, Then tiêu điểm vào ở nút Áp; Tab và Shift+Tab đi qua ô chọn
  từng dòng và hai nút; Space bật tắt một dòng; Esc đóng không ghi và tiêu điểm về ô đang chọn của lưới, mũi tên chạy tiếp
  từ đó; hộp thoại có tên và mô tả là dòng đếm cho trình đọc màn hình; kết quả áp đọc qua vùng thông báo. Luật phím của 2a,
  3 và 4 giữ nguyên (Enter mở hồ sơ, F2 mở sửa ô, Ctrl/Cmd+C chép).
- AC-9: Given cây sau hàng này, When chạy `make check` và bài axe của Bảng hàng có bản xem trước mở ở sáng và tối, Then xanh;
  thân bản xem trước là một khối dùng chung ở `src/components/candidate/` có dòng trong sổ khối (`design/so-khoi.yaml`), mọi
  chữ của nó nằm ở tệp chữ của khối hay đến từ `ontology/labels.yaml` (mỗi nhãn mới tối đa 17 ký tự), không chữ cứng trong
  màn.

- AC-10: Given Bảng hàng 1440 với vai có quyền, When dán theo bốn hình viết trước — một ô lên vùng chọn 4 ô Giá chào; khối
  1 × 2 lên vùng chọn 2 × 2; 3 dòng khi đang lọc Toà (dòng đang ẩn nằm giữa); trình duyệt ngoại tuyến từ đầu rồi Áp —
  Then bản xem trước có đúng 4 dòng sẽ đổi; khối lặp đúng 2 lần; chỉ dòng đang hiện vào bản xem trước và 0 lần ghi vào dòng
  ẩn (đối chứng dương: dòng hiện có đổi); ngoại tuyến thì 0 ô đổi trên bảng và thông báo «Chưa ô nào được ghi — mất kết
  nối mạng.». (cross-layer)

## Vai × Màn

Dán theo dòng `updateListing` của bảng quyền (hàng 9a, nhắc lại AC-7); đọc giữ như hàng 2.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — dán vào Giá chào và Trạng thái, từ 768 px | được — dán vào Giá chào và Trạng thái, từ 768 px | được — dán vào Giá chào và Trạng thái, từ 768 px | chặn — dán không mở bản xem trước, thông báo nói vì sao |

## Bảng thao tác

| Thứ trên màn | Thêm | Xem | Sửa | Xoá / Gỡ | Ai quyết |
|---|---|---|---|---|---|
| Căn | để hàng 12 — dán dưới đáy bảng không thêm căn | có — Bảng hàng, mọi vai | có — Giá chào, Trạng thái, vai có `updateListing`; thông tin khác để hàng 3g; thuộc tính căn: không (hàng 4 Never, chủ kho ký 2026-11-13) | để hàng 18b | chủ kho (hàng 4) |
| Ô sẽ đổi trong bản xem trước | có — từ vùng dán | có — cũ → mới | theo Hỏi-5 (khuyên: không sửa chữ ở đây) | theo Hỏi-5 (khuyên: bỏ chọn từng ô) | chủ kho ở Cổng Phạm vi |
| Lần áp | có — nút Áp | có — thông báo | — | có — Hoàn tác một lần cho cả vùng | máy theo câu giao |

## Đường đo

Ô cơ hội chưa khai ngưỡng UAT (bốn dòng còn «…»). Đường đo đề xuất: dán đúng một vùng 3 × 2 thì bản xem trước nói đúng
từng ô và áp một lần ghi đúng N ô — bảo đảm bởi AC-1, AC-5; ngưỡng thật đo ở phiên nghiệm thu cuối lộ trình.

- Thước: thấy trước đúng ô sẽ đổi · số từ: E1, E1-ui · bảo đảm bởi: AC-1
- Thước: áp một lần ghi đúng N ô · số từ: E5 · bảo đảm bởi: AC-5

## Coverage

Quét không gian AC theo trục (morphological, preset entity-feature, rút gọn; chân ngành: khuôn dán của Microsoft Excel và
Google Sheets):

- Trục A — cột đích: Giá chào · Trạng thái · thuộc tính căn · Xác nhận lúc · cột tính · cột riêng của sàn [thước CE: cột
  của `src/modules/listings/ui/inventory-rows.ts` và hàng 7e, 19]
- Trục B — chữ trong ô: đọc được và khác · giống hệt · trống · chưa hiểu · nấc không đi được · nấc cần thêm thông tin
  [thước CE: `src/modules/listings/edit-rules.ts`, bảng chữ của AC-1 hàng 4]
- Trục C — căn và người: căn mở · căn khoá · vai có quyền · vai không quyền · dòng nhóm · dòng ẩn vì lọc [thước CE: bảng
  quyền 9a, luật khoá hàng 4, họ Lưới]
- Trục D — hình vùng dán: một ô điền cả vùng chọn · vừa khít · lặp theo vùng chọn · thừa ra ngoài đáy hay mép phải [thước CE: ngành
  Microsoft Excel, Google Sheets; lưới ReUI `data-grid-cell-selection`]
- Trục E — sau khi áp: ghi hết · hỏng một phần · mất mạng từ đầu · hoàn tác · hoàn tác hỏng [thước CE: bốn kết cục cửa lưu
  hàng 4]
- Core: A×B ở AC-2, AC-3; C ở AC-3, AC-7, AC-10 (dòng ẩn vì lọc); D ở AC-1 (vừa khít), AC-3 (thừa), AC-10 (một ô, lặp);
  ngưỡng ở AC-4; E ở AC-5, AC-6, AC-10 (mất mạng từ đầu); phím và trình đọc ở AC-8; khối chung ở AC-9.
- Later: dán vào cột riêng của sàn theo kiểu cột (nếu Hỏi-3 chọn để sau, hàng 3g) · kéo điền · hoàn tác bằng Ctrl/Cmd+Z
  (hàng 10) · ngưỡng dán 500 ô dưới một giây đo trên dữ liệu thật (hàng 10).
- Never: dán thêm căn mới (hàng 12 làm chủ việc thêm căn) · ghép cột theo tiêu đề tệp (hàng 11).

## Out of scope

- Nạp cả tệp Excel hay Sheet, ghép cột, tên cột, giá trị, mã căn và nhớ cách ghép — ai quyết: chủ kho (lộ trình hàng 11); hàng 5 chỉ dán vào các cột đang hiện, theo vị trí.
- Thêm căn bằng dán dưới đáy bảng — ai quyết: chủ kho (lộ trình hàng 12 «Thêm căn»).
- Sửa thuộc tính căn (diện tích, phòng ngủ, toà) bằng dán — ai quyết: chủ kho (hàng 4, Never đã ký).
- Hoàn tác bằng Ctrl/Cmd+Z, báo khi hai người cùng sửa — ai quyết: chủ kho (hàng 4, Later đã ký); cần đường ghi thật (hàng 10).
- Dán ở điện thoại — ai quyết: chủ kho ở Cổng Phạm vi (Hỏi-4).
- Dán vào cột «Điều kiện phí» (Bao phí / Không bao phí) — ai quyết: chủ kho (hàng 10 mở sửa cột ấy trên ô); hôm nay ô bị bỏ kèm lý do «cột này không sửa trên bảng», và khi hàng 10 gộp thì dán vào cột ấy theo đúng luật của hàng 10.

## Notes

- Hỏi-1 (dáng bản xem trước), Hỏi-2 (dán Đã bán, Ngừng hẳn), Hỏi-3 (cột riêng của sàn), Hỏi-4 (điện thoại), Hỏi-5 (bỏ chọn
  từng ô, sửa chữ trong bản xem trước), Hỏi-6 (giá lệch quá 20%) chờ chủ kho ở Cổng Phạm vi; khuyến nghị ở sổ quyết định
  và bản thiết kế.
- Hỏi-6 chọn «bấm Áp là câu trả lời»: AC-4 bỏ vế «bỏ chọn sẵn», dòng lệch lớn chọn sẵn như mọi dòng. Chọn «hỏi gom một
  lần»: AC-4 thêm một hộp liệt các dòng lệch lớn sau khi bấm Áp, «Đổi giá» ghi, «Thôi» bỏ đúng các dòng ấy.
- Hỏi-3 chọn mở ngay: AC-3 bỏ lý do «cột riêng của sàn», thêm một AC đọc theo kiểu cột (số, tiền, ngày, có/không, chọn một)
  và một đường ghi trường riêng ở cửa lưu; hàng lên T3 nếu chạm `ontology/`.
- Hỏi-2 chọn hỏi thêm: AC-3 bỏ lý do «Đã bán, Ngừng hẳn», thêm một AC cho phần hỏi giá chốt, ngày, lý do trong bản xem trước.
- Quyền dán không ghi cứng vai nào: dán đi qua đúng thao tác sửa căn của bảng quyền mà ô dùng; hàng 10 đổi «ai được sửa giá
  và trạng thái» thì dán theo cùng câu trả lời ấy, không sửa mã hàng 5.
- Khối mới `PastePreview` (bản xem trước dùng chung) khai ở bảng Khối của hồ sơ chứng minh màn và sổ khối khi dựng; giám sát
  đã ghi sổ đối chiếu: hàng 5 làm chủ, hàng 11 dùng lại.
- Ba hàng chờ gộp cùng chạm Bảng hàng: 2b (PR #63) — phần dựng chờ 2b vào main; 2d (PR #65), 19 (PR #64) — hàng gộp sau
  ghép tay; câu lý do của cột Về tay viết khi 19 vào main.
