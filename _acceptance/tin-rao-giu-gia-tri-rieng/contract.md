---
schema_version: 1
feature: "Đầu chủ sửa được diện tích, tầng, phòng ngủ, hướng và loại hình của căn mình chào — ngay trên ô ở máy tính và trong chi tiết căn ở mọi cỡ màn — và giá trị ấy là của sàn: danh mục dùng chung chỉ điền chỗ sàn chưa có, ô khác danh mục có dấu nhỏ và lệnh «lấy lại theo danh mục»"
slug: tin-rao-giu-gia-tri-rieng
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api, db]
screens: [inventory]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-27
design_doc: _acceptance/tin-rao-giu-gia-tri-rieng/design.md
---

# Acceptance Contract: tin-rao-giu-gia-tri-rieng

## Context

Hàng 3h của lộ trình, lát A. Chủ kho ký Cổng Đáng 27/11: «đáng, làm · (a) Bảng hàng đủ cột: hàng riêng sau 3h · (b) lỗi
ngăn chi tiết: sửa trong trang chi tiết của 3h, tôi liệt kê lỗi ở Cổng Phạm vi». Tám điểm «Chốt hướng» (sổ đợt
`dieu-phoi-nen`) đã quyết, không hỏi lại. Tin rao (`Listing`) thêm năm giá trị riêng — Diện tích, Tầng, Phòng ngủ, Hướng,
Loại hình — mỗi giá trị nhớ nguồn (sàn gõ · nhập từ tệp); không có giá trị riêng thì theo Danh bạ (danh mục dùng chung).
Thứ tự thắng: sàn gõ › tệp › Danh bạ. Danh bạ không bao giờ bị sàn sửa và không bao giờ đè giá trị riêng.

Đổi thực thể Listing (tầng high), một migration mới, cửa ghi `/api/v1` của 3g. Chạm SP-1 (giữ: năm giá trị nằm trên
`listings` đã cách ly theo dòng; thêm ca vào bộ kiểm cách ly). Không chạm SP-3, SP-4.

Đứng trên 3g (#126) và 11 (dãy D): bản bấm được dựng sau khi 3g vào main; lượt chấm đầu chứa main có 11.

Source input: hàng `3h` (`docs/plan/lo-trinh.json`), ô `opportunity.md` (build), phán G-2711-4, G-2711-6 của giám sát.

## Criteria

- AC-1 (cross-layer): Given một tin rao có giá trị riêng cho một thuộc tính và một tin khác không có, When Bảng hàng, hồ sơ căn và thẻ
  điện thoại hiện năm thuộc tính, Then tin thứ nhất hiện giá trị riêng, tin thứ hai hiện giá trị danh mục; Loại căn
  («Studio», «2PN») suy từ Phòng ngủ hiệu lực của tin; lọc (cả phần chạy ở máy chủ), ⌘K và cây địa lý đọc cùng giá trị ấy (một hàm đọc hiệu lực).
- AC-2: Given Bảng hàng ở 1024 hoặc 1440 và vai có quyền sửa hàng, When sửa ô Diện tích hoặc Phòng ngủ của một tin đang mở
  theo luật sửa trên ô hiện hành của kho, Then giá trị lưu qua cửa `/api/v1` với nguồn «sàn gõ», ô hiện giá trị mới, thông báo đã lưu có Hoàn tác
  trả đúng giá trị trước; gửi với phiên bản cũ (người khác vừa sửa) bị từ chối, câu báo theo luật của hàng 4, giá trị đã lưu không đổi; chữ không đọc được (vd «bảy mươi», Phòng ngủ «2,5») hiện câu lỗi dưới ô, không gửi gì, chữ đã
  gõ còn nguyên — cùng luật đọc, câu lỗi, phiên bản và hoàn tác của hàng 4; cách mở và xác nhận sửa theo luật sửa trên ô hiện hành của
  kho (VP11 sẽ đổi nó: Enter là sửa, bấm ra ngoài là lưu), không chép phím của hàng 4.
- AC-3: Given hồ sơ căn của một tin đang mở ở 360, 414, 1024 và 1440, When bấm «Sửa» ở khối thông tin căn, đổi năm trường
  rồi Lưu, Then cả năm giá trị lưu một lần với nguồn «sàn gõ» và khối hiện giá trị mới; Tầng theo luật tầng của danh mục
  (7, 15A; «07» bị từ chối), Hướng chọn từ tám hướng cố định (Hỏi-5), Loại hình chọn từ danh sách; Loại căn không có ô gõ — luôn suy từ Phòng ngủ
  (Hỏi-2); Hoàn tác trả cả năm về trước.
- AC-4: Given một ô có giá trị riêng khác giá trị danh mục, When nhìn ô trên lưới và dòng trong hồ sơ căn, Then có một dấu
  nhỏ có tên cho trình đọc màn hình «khác danh mục: <giá trị danh mục>» (chữ đọc từ bảng nhãn); ô bằng danh mục, ô danh mục trống và căn chờ khớp
  KHÔNG có dấu; dấu không đổi màu chữ ô, không chặn lưu, đạt axe ở sáng và tối.
- AC-5: Given một ô có dấu khác Danh bạ, When chọn lệnh lấy lại (chữ «danh mục», đọc từ bảng nhãn; trên ô hoặc trong hồ sơ căn), Then giá trị riêng
  và nguồn bị xoá, ô hiện giá trị danh mục, dấu tắt; Hoàn tác trả lại giá trị riêng và nguồn cũ. Tin từng có giá trị tệp
  rồi bị sàn gõ đè: lấy lại về thẳng danh mục (Hỏi-7), không về giá trị tệp trước.
- AC-6 (cross-layer): Given tin của sàn có giá trị riêng nguồn «sàn gõ» và «nhập từ tệp» cho căn X, và một tin khác không
  có giá trị riêng, When danh mục đổi giá trị của căn X, Then giá trị riêng của tin không đổi một byte; tin không có giá trị
  riêng hiện giá trị danh mục mới; không lệnh nào của sàn đổi được một dòng `catalog_units` (đếm dòng và băm trước/sau).
- AC-7 (cross-layer): Given một tệp nhập có cột Diện tích, Tầng, Phòng ngủ, Hướng, Loại hình, When lần nhập ghi tin mới
  (hàng 11), Then mỗi ô đọc được thành giá trị riêng nguồn «nhập từ tệp» trên đúng tin của dòng ấy; và với lần nhập đã
  chạy trước 3h, bước đọc lại `import_runs.kept` (lý do «unit-attribute») đặt giá trị nguồn «nhập từ tệp» cho đúng tin
  chưa có giá trị riêng, không đụng tin đã có giá trị «sàn gõ»; ô giữ nguyên văn không đọc được (vd «2PN» ở Loại hình) vẫn
  ở `kept` với dấu cần người, không thành giá trị.
- AC-8: Given bước xem trước của lần nhập với căn khớp danh mục, When một ô thuộc tính của tệp khác giá trị danh mục, Then
  ô ấy mang cùng dấu khác Danh bạ kèm giá trị danh mục; giá trị sẽ ghi vẫn là giá trị tệp.
- AC-9 (cross-layer): Given một tin trỏ căn chờ khớp (tạo tay ở hàng 12 hoặc nhập ở hàng 11), When sửa năm thuộc tính
  trong hồ sơ căn rồi căn chờ khớp được khớp vào căn danh mục, Then trước khớp tin giữ và hiện năm giá trị không dấu;
  sau khớp giá trị riêng giữ nguyên, ô nào khác danh mục mới có dấu.
- AC-10 (cross-layer): Given hồ sơ căn của một tin đang mở, When chọn «Gắn sang căn khác» và chọn một căn danh mục, Then tin
  chuyển liên kết sang căn ấy, giá trị theo Danh bạ tính lại theo căn mới, giá trị riêng giữ; căn mới đã có tin mở thì bị
  từ chối với câu nói căn nào và không đổi gì; lệnh này không có trên ô của lưới.
- AC-11 (cross-layer): Given bốn vai của sàn A và một người của sàn B, When đọc và gửi thay đổi năm thuộc tính qua giao
  diện, `/api/v1` và cơ sở dữ liệu, Then chỉ vai có `updateListing` thấy lệnh sửa, lấy lại, gắn sang căn khác (qua bộ nút
  theo quyền); vai khác vẫn thấy «Báo sai thông tin căn»; máy chủ trả 403 cho vai không quyền; người sàn B không đọc,
  không ghi được giá trị riêng của sàn A (ca mới trong bộ kiểm cách ly); tin Đã bán, Ngừng khoá năm thuộc tính như 3g.
- AC-12: Given hồ sơ căn ở 360 và 1440, When mở một tin Đã bán và một tin Ngừng hẳn với vai có `updateListing` và với vai
  không giữ căn, Then chỗ nút «Sửa» của khối thông tin căn là một dòng chữ nhạt có ổ khoá nói lý do (C1), chỗ nút «Hỏi đầu
  chủ» ở đáy hồ sơ là một dòng chữ nhạt nói lý do (C2; cùng cách ấy cho tin chưa ai giữ, thay nút mờ «Căn chưa có đầu
  chủ giữ») — không nút mờ, không biến mất im lặng, chữ đọc từ bảng nhãn; tin
  đang mở thì hai nút như cũ; trên điện thoại nút «Sửa» ở đầu mục có vùng bấm ít nhất 44px, máy tính 28px (C10); ngăn hiện
  thuộc tính căn chỉ để đọc khi không bấm «Sửa» (C16). Và thân hồ sơ theo bốn nhóm A–D chủ kho duyệt sau Cổng Phạm vi
  (mục «Sửa sau Cổng Phạm vi»): (A) thân mở bằng một dòng trạng thái bên trái, giá bên phải ở mọi khổ, rồi «dự án · loại
  hình»; mã căn không lặp trong thân, không còn dải ba dữ kiện, thuộc tính căn chỉ hiện ở khối căn; (B) căn đủ thông tin
  hiện một dòng «✓ Đủ thông tin · 5/5», căn thiếu giữ thanh và số đếm, mỗi tên trong «Còn thiếu» bấm được — nhảy tới dòng
  ấy và mở «Sửa» của khối ấy — giá trị thiếu đọc «Chưa có» với chấm hổ phách trước nhãn, cách đếm mức đủ không đổi; (C)
  dòng «Xác nhận với chủ nhà N ngày trước», quá 14 ngày thêm dòng hổ phách «Quá 14 ngày — nên xác nhận lại»; (D) cột nhãn
  cố định khoảng 120px (điện thoại khoảng 104px), lần chào đang xem đọc «Lần n · đang xem» không nền xám, các lần khác như
  liên kết có «›», dưới 360px mỗi lần chào hai dòng đều nhau. Chữ đọc từ bảng nhãn; màu hổ phách theo bảng màu của VP11.

## Vai × Màn

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
| --- | --- | --- | --- | --- |
| inventory | được — xem năm thuộc tính; sửa, lấy lại, gắn sang căn khác; Báo sai | được — như Đầu chủ | được — như Đầu chủ | được — xem theo `viewListings`; không sửa, không lấy lại, không gắn sang căn khác; Báo sai theo 3e |

## Coverage

- Trục nguồn giá trị (theo Danh bạ · sàn gõ · nhập từ tệp · không có ở đâu): AC-1, AC-2, AC-5, AC-7, AC-9. Thước: điểm 2
  đã chốt, ba nguồn của hàng 11.
- Trục thao tác (xem · sửa trên ô · sửa trong chi tiết · lấy lại · Danh bạ đổi · khớp căn chờ · gắn sang căn khác · nhập
  mới · đọc lại `kept` · hoàn tác · hai người cùng sửa): AC-1 đến AC-10; hai người cùng sửa đi luật phiên bản của hàng 4
  trong AC-2, AC-3. Nhập lại cập nhật tin đã có: Later (11b).
- Trục thuộc tính (Diện tích · Tầng · Phòng ngủ · Hướng · Loại hình; Loại căn suy ra): AC-1, AC-3; trên ô chỉ Diện tích,
  Phòng ngủ (AC-2) vì ba cột kia chưa có trên Bảng hàng.
- Trục người (có `updateListing` · không · sàn khác): AC-11. Thước: bảng quyền 013, SP-1.
- Danh sách hướng là tám hướng (Hỏi-5, chủ kho duyệt ở Cổng Phạm vi).
- Trục trạng thái của nút trong hồ sơ căn (đang mở · Đã bán · Ngừng hẳn) × vai (có quyền sửa · không giữ căn): AC-12.
- Trục thân hồ sơ (đủ · thiếu · xác nhận trong 14 ngày · quá 14 ngày · một lần chào · nhiều lần chào) × khổ (320/360 ·
  1440): AC-12 (A–D), E15, E15b.

## Đường đo

- Ngưỡng của ô cơ hội («Đầu chủ sửa … thì Bảng hàng, hồ sơ căn hiện giá trị của sàn; danh mục không đổi một dòng; ô khác
  có dấu; lấy lại; danh mục đổi không đè; căn chờ khớp giữ; sàn khác không thấy») — mỗi vế một AC: AC-2/3 (sửa), AC-6
  (danh mục không đổi, không đè), AC-4/5 (dấu, lấy lại), AC-9 (căn chờ khớp), AC-11 (sàn khác). Số đếm dùng thật sau giao
  (số ô sửa, số lần lấy lại) đọc từ bảng `listings` nguồn «sàn gõ» ở phiên nghiệm thu — không cần mã mới.
- Vế «mức đủ thông tin hiện giá trị của sàn» của ngưỡng: năm phần của mức đủ (hàng 3b) không gồm thuộc tính căn, nên vế
  này gạch khỏi ngưỡng (Hỏi-8, chủ kho duyệt ở Cổng Phạm vi: mức đủ giữ như cũ).
- Vế «giá và trạng thái giữ luật đã ký, ô máy tính ra không sửa»: E13 (bộ bài của hàng 4 chạy lại, cộng ca ô thuộc tính
  không mở sửa dưới 768 px).

## Sửa sau Cổng Phạm vi

- 2026-11-27 · Tám điểm còn lại của chi tiết căn (C3, C4, C6, C8, C9, C11, C14, C15) vào AC-12 thành bốn nhóm A–D. Chủ
  kho duyệt tại phiên BH, nguyên văn «Duyệt cả bốn nhóm», trả lời câu «Duyệt cả bốn nhóm chi tiết căn theo lối khuyên?»
  (trang `chi-tiet-can-diem-con-lai-2026-11-27.html` ở thư mục ghi chú chung của đợt; sổ đợt `dieu-phoi-nen`, mục «Tám
  điểm còn lại của chi tiết căn»). Xếp vào 3h theo G-2711-20: nội dung ngăn chi tiết có một chủ là 3h. Không thêm tiêu
  chí mới để hợp đồng giữ 12 tiêu chí (một lượt chấm); đo bằng E15, E15b. Tên người xác nhận ở nhóm C chờ lịch sử của
  hàng 3c — tới lúc ấy chỉ hiện số ngày.
- 2026-11-27 · C2 phủ thêm tin chưa ai giữ: đáy hồ sơ hôm nay hiện nút chính mờ «Căn chưa có đầu chủ giữ», nay thành dòng
  chữ nhạt nói lý do như căn đã bán và ngừng hẳn. Giám sát thấy khi soi ảnh VP10 và xếp vào 3h; đây là chính luật chủ kho
  đã duyệt (câu 2 «Chuẩn nút dùng chung», «Duyệt cả ba câu» ở phiên BH; C2 «Theo luật mới» tại phiên R), không hỏi lại. Đo
  bằng E14, E14b.
- 2026-11-28 · E13 chạy đúng tệp đang giữ ca điện thoại. Ca «dưới 768px ô Diện tích, Phòng ngủ không mở sửa» nằm ở
  `src/modules/listings/ui/attribute-cell-edit.test.tsx`, không ở tệp bài lưới dùng chung mà E13 gọi tên: luật ranh giới
  mô-đun không cho bài của khối dùng chung nhập mô-đun nghiệp vụ. Lệnh mới chạy bộ bài của hàng 4 không đổi rồi chạy
  ca điện thoại, và đỏ khi không ca nào chạy. Câu kỳ vọng và tiêu chí giữ nguyên. Giám sát quyết theo lối R khuyên
  (G-2811-52); thẻ Cổng Bằng chứng trình điểm này ở khối «chưa duyệt».
- 2026-11-28 · Câu E8 đổi khổ đo (G-2811-55). Ở 1440 đo dấu khác Danh bạ ở bước xem trước; ở 360 đo đúng lời báo màn
  nhập tệp dùng trên máy tính. Luật đã ký của hàng 11: dưới 768px màn nhập tệp không có bước xem trước, nên câu cũ
  «ở 1440 và 360 bước xem trước» không làm được ở 360. Tiêu chí AC-8 giữ nguyên; bài giữ cả hai khổ. Thẻ Cổng Bằng chứng
  trình điểm này ở khối «chưa duyệt».
- 2026-11-28 · Phép E10b rời bộ đo của 3h theo lời chủ kho 28/11: Hoãn sang hàng 12 (G-2811-70, G-2811-72). Nút «Gắn sang
  căn khác» trên màn (phép E10b) hoãn sang hàng 12 `them-can`. Chủ kho trả lời câu hỏi của
  giám sát (G-2811-70), nguyên văn: «Hoãn sang hàng 12». AC-10 giữ nguyên chữ. Ở 3h vẫn đo phần máy chủ (E10) và luật «lệnh
  này không có trên ô của lưới». E10b rời bộ phép của 3h, vì kit chỉ cho phép máy khai «không chạy»; câu kỳ vọng của nó chép
  nguyên văn sang `ban-giao-hang-12-them-can.md` cho Cổng Phạm vi hàng 12.

## Out of scope

- Khoá một giá trị — lát B, chủ kho quyết sau khi dùng lát A (ai quyết: chủ kho, điểm 7 «Chốt hướng»).
- Thêm cột Tầng, Hướng, Loại hình và các cột còn lại vào Bảng hàng — hàng riêng «Bảng hàng đủ cột như Quỹ hàng» sau 3h
  (ai quyết: chủ kho, Cổng Đáng 3h).
- Gửi chỗ lệch về onehub-invest (kết nối «xác nhận danh mục») — sau MVP (ai quyết: chủ kho, điểm 6).
- Nhập lại để cập nhật tin đã có — hàng 11b; nó gọi luật thắng của 3h (ai quyết: chủ kho, Cổng Phạm vi hàng 11).
- Lịch sử ai sửa gì — hàng 3c. Mức đủ thông tin không đổi (năm phần của 3b không gồm thuộc tính căn).
- Trang khách — hàng 17; khi dựng thì đọc giá trị hiệu lực qua luật ẩn (SP-4).

## Đã chốt ở Cổng Phạm vi

Chủ kho duyệt 2026-11-27 tại phiên dãy R, nguyên văn dòng trả lời:

> Hỏi-1: C1, C2 (căn đã bán, ngừng hẳn: thay «Hỏi đầu chủ» bằng dòng nhạt nói lý do), C10, C16 vào 3h · Hỏi-2: không gõ
> đè Loại căn · Hỏi-3: làm ở 3h · Hỏi-4: «danh mục» · Hỏi-5: tám hướng · Hỏi-6: chấm · Hỏi-7: lấy lại về danh mục · Hỏi-8:
> mức đủ giữ như cũ · Hỏi-9: hai cột · Hỏi-10: mỗi khối một «Sửa» · duyệt hay sửa: duyệt

- Hỏi-1 → AC-12. C1, C10 và Hỏi-10 cùng là ba câu «Chuẩn nút dùng chung» chủ kho đã duyệt ở phiên BH 2026-11-27, nguyên
  văn «Duyệt cả ba câu» (sổ đợt `dieu-phoi-nen`, mục «Chuẩn nút dùng chung»). C2 theo câu 2 của chuẩn ấy (lời chủ kho tại
  phiên R: «Theo luật mới»). Các điểm C khác không chọn; C5, C7, C12, C13 thuộc việc khung VP10.
- Hỏi-2 → AC-3. Hỏi-3 → AC-3 (làm ở 3h, trong hồ sơ căn ở mọi cỡ). Hỏi-4 → AC-4, AC-5 (chữ «danh mục»). Hỏi-5 → AC-3.
  Hỏi-6 → AC-4 (dấu chấm). Hỏi-7 → AC-5. Hỏi-8 → Đường đo. Hỏi-9 → AC-2. Hỏi-10 → AC-3, AC-12.
- Luật đã duyệt ở phiên BH mà 3h áp, không hỏi lại: luật nút «…» («Duyệt luật đã sửa» — đầu mục căn có «Sửa» và «Báo
  sai thông tin», hai việc thường, hiện thẳng); khung ngăn và đầu ngăn một dòng («Chốt cả bốn», «Chốt một dòng» — việc
  VP10, 3h dựng trên đó); cách bấm và sửa ô («Duyệt cả ba lối A» — việc VP11, 3h dựng trên đó).

## Notes

- Bản bấm được, ảnh và ứng viên ReUI dựng sau khi 3g vào main (G-2711-6); Cổng Phạm vi trình sau khi giám sát soi.
- Thi công đứng sau VP10 `khung-luoi-va-ngan-chi-tiet` và VP11 `chuan-hoa-he-design` (G-2711-12, G-2711-16): gộp main có
  cả hai rồi mới dựng; ảnh bằng chứng chụp trên khung mới.
- Sửa sau ký khi 3h gộp: hàng 4, hàng 5, 3g, 3e, 12 (design §6).
