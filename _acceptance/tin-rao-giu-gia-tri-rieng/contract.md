---
schema_version: 1
feature: "Đầu chủ sửa được diện tích, tầng, phòng ngủ, hướng và loại hình của căn mình chào — ngay trên ô ở máy tính và trong chi tiết căn ở mọi cỡ màn — và giá trị ấy là của sàn: danh mục dùng chung chỉ điền chỗ sàn chưa có, ô khác danh mục có dấu nhỏ và lệnh «lấy lại theo Danh bạ»"
slug: tin-rao-giu-gia-tri-rieng
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api, db]
screens: [inventory]
status: draft
approved_by:
approved_at:
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
  (gõ, Enter), Then giá trị lưu qua cửa `/api/v1` với nguồn «sàn gõ», ô hiện giá trị mới, thông báo đã lưu có Hoàn tác
  trả đúng giá trị trước; gửi với phiên bản cũ (người khác vừa sửa) bị từ chối, câu báo theo luật của hàng 4, giá trị đã lưu không đổi; chữ không đọc được (vd «bảy mươi», Phòng ngủ «2,5») hiện câu lỗi dưới ô, không gửi gì, chữ đã
  gõ còn nguyên — cùng luật đọc, câu lỗi, phiên bản và hoàn tác của hàng 4.
- AC-3: Given hồ sơ căn của một tin đang mở ở 360, 414, 1024 và 1440, When bấm «Sửa» ở khối thông tin căn, đổi năm trường
  rồi Lưu, Then cả năm giá trị lưu một lần với nguồn «sàn gõ» và khối hiện giá trị mới; Tầng theo luật tầng của danh mục
  (7, 15A; «07» bị từ chối), Hướng và Loại hình chọn từ danh sách; Hoàn tác trả cả năm về trước.
- AC-4: Given một ô có giá trị riêng khác giá trị danh mục, When nhìn ô trên lưới và dòng trong hồ sơ căn, Then có một dấu
  nhỏ có tên cho trình đọc màn hình «khác <nhãn danh mục theo Hỏi-4>: <giá trị danh mục>» (chữ đọc từ bảng nhãn); ô bằng danh mục, ô danh mục trống và căn chờ khớp
  KHÔNG có dấu; dấu không đổi màu chữ ô, không chặn lưu, đạt axe ở sáng và tối.
- AC-5: Given một ô có dấu khác Danh bạ, When chọn lệnh lấy lại (chữ theo Hỏi-4, đọc từ bảng nhãn; trên ô hoặc trong hồ sơ căn), Then giá trị riêng
  và nguồn bị xoá, ô hiện giá trị danh mục, dấu tắt; Hoàn tác trả lại giá trị riêng và nguồn cũ. Tin từng có giá trị tệp
  rồi bị sàn gõ đè: lấy lại về đâu theo câu trả lời Hỏi-7 (khuyên: về danh mục).
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
- [GIẢ ĐỊNH] Danh sách hướng là tám hướng (Hỏi-5) — người gạch ở Cổng Phạm vi.

## Đường đo

- Ngưỡng của ô cơ hội («Đầu chủ sửa … thì Bảng hàng, hồ sơ căn hiện giá trị của sàn; danh mục không đổi một dòng; ô khác
  có dấu; lấy lại; danh mục đổi không đè; căn chờ khớp giữ; sàn khác không thấy») — mỗi vế một AC: AC-2/3 (sửa), AC-6
  (danh mục không đổi, không đè), AC-4/5 (dấu, lấy lại), AC-9 (căn chờ khớp), AC-11 (sàn khác). Số đếm dùng thật sau giao
  (số ô sửa, số lần lấy lại) đọc từ bảng `listings` nguồn «sàn gõ» ở phiên nghiệm thu — không cần mã mới.
- Vế «mức đủ thông tin hiện giá trị của sàn» của ngưỡng: năm phần của mức đủ (hàng 3b) không gồm thuộc tính căn, nên vế
  này không đo được như đang viết — máy đề nghị gạch (Hỏi-8, chủ kho quyết ở Cổng Phạm vi).
- Vế «giá và trạng thái giữ luật đã ký, ô máy tính ra không sửa»: E13 (bộ bài của hàng 4 chạy lại, cộng ca ô thuộc tính
  không mở sửa dưới 768 px).

## Out of scope

- Khoá một giá trị — lát B, chủ kho quyết sau khi dùng lát A (ai quyết: chủ kho, điểm 7 «Chốt hướng»).
- Thêm cột Tầng, Hướng, Loại hình và các cột còn lại vào Bảng hàng — hàng riêng «Bảng hàng đủ cột như Quỹ hàng» sau 3h
  (ai quyết: chủ kho, Cổng Đáng 3h).
- Gửi chỗ lệch về onehub-invest (kết nối «xác nhận danh mục») — sau MVP (ai quyết: chủ kho, điểm 6).
- Nhập lại để cập nhật tin đã có — hàng 11b; nó gọi luật thắng của 3h (ai quyết: chủ kho, Cổng Phạm vi hàng 11).
- Lịch sử ai sửa gì — hàng 3c. Mức đủ thông tin không đổi (năm phần của 3b không gồm thuộc tính căn).
- Trang khách — hàng 17; khi dựng thì đọc giá trị hiệu lực qua luật ẩn (SP-4).

## Câu hỏi cho chủ kho (Cổng Phạm vi)

- Hỏi-1 · Lỗi ngăn chi tiết căn ông thấy 27/11 — ông liệt kê; lỗi nào nằm ở trang chi tiết thì sửa trong 3h (lời ông ở Cổng
  Đáng).
- Hỏi-2 · Loại căn (Studio, 2PN) — khuyên: không cho gõ đè, luôn suy từ Phòng ngủ của tin; muốn «2PN» khác thì sửa Phòng ngủ.
- Hỏi-3 · Sửa trường riêng của sàn trên điện thoại — khuyên: làm ở 3h trong trang chi tiết (ô cơ hội 3d chỉ có giá và trạng
  thái; trang chi tiết sửa được mọi thứ ở mọi cỡ).
- Hỏi-4 · Chữ trên màn «Tin rao» / «Danh bạ» so với «Hàng» / «danh mục» hôm nay.
- Hỏi-5 · Hướng chọn từ tám hướng cố định hay gõ chữ tự do.
- Hỏi-7 · Tin có giá trị tệp rồi bị sàn gõ đè: «lấy lại» về danh mục (khuyên) hay về giá trị tệp trước rồi mới về danh mục.
- Hỏi-8 · Mức đủ thông tin giữ năm phần của 3b, không gồm thuộc tính căn (khuyên: giữ) — gạch vế ấy khỏi ngưỡng của ô cơ hội.
- Hỏi-6 · Dấu khác Danh bạ — chọn một trong 2–3 ứng viên ReUI có ảnh (khối mới).

## Notes

- Bản bấm được, ảnh và ứng viên ReUI dựng sau khi 3g vào main (G-2711-6); Cổng Phạm vi trình sau khi giám sát soi.
- Sửa sau ký khi 3h gộp: hàng 4, hàng 5, 3g, 3e, 12 (design §6).
