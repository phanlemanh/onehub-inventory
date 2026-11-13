---
schema_version: 1
feature: Đầu chủ sửa giá và trạng thái ngay trên ô, thấy lỗi ngay tại ô đó
slug: sua-tren-o
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-13T03:15:58Z
design_doc: docs/superpowers/specs/2026-11-13-sua-tren-o-design.md
---

# Acceptance Contract: sua-tren-o

## Context

Hàng 4 của lộ trình (B4, B6). Bảng hàng đã đọc như Sheet (2a), có hồ sơ căn (3) và bộ nút theo quyền (9e); hàng này mở
sửa trên ô cho hai cột Giá chào và Trạng thái trên máy tính, lỗi báo ngay tại ô, hoàn tác hỏng thì báo rõ. Luật đọc giá,
ngưỡng hỏi lại và chuyển trạng thái nằm ở một chỗ trong mô-đun căn để hàng 3d dùng lại. Hàng lên T3 vì thêm bốn nhãn vào
`ontology/labels.yaml` (G duyệt H-1311-1). Không chạm ba luật sản phẩm: không bảng mới, không gửi gì, không ra trang khách.

Source input: ô cơ hội `_acceptance/sua-tren-o/opportunity.md` (build, Manh Phan, 2026-11-13) · hàng 4 của
`docs/plan/lo-trinh.json` · trang `docs/tri-thuc/wiki/chu-de/sua-tren-o-va-dan-excel.md` · lời giao của giám sát.

## Criteria

- AC-1: Given bộ đọc giá `readPrice` xuất qua cửa `index.ts` của mô-đun căn, When đọc một bảng chữ viết trước (ít nhất 20
  dòng: «4,65 tỷ», «4.65 tỷ», «4,65t», «4 tỷ 650», «4ty65», «950 triệu», «950tr», «4650000000», «4.650.000.000», «1,2 tỷ»,
  …), Then mỗi dòng ra đúng số đồng viết trước; chữ trống, «abc», «12», «4,65», số âm, quá 1.000 tỷ ra «chưa hiểu», không
  đoán. Ô Giá, ô Trạng thái và hộp giá chốt chỉ gọi các hàm của tệp luật ấy, không tự viết luật.
- AC-2: Given Đầu chủ trên Bảng hàng khổ 1440, When chọn ô Giá chào của căn đang bán rồi gõ «2,8 tỷ» (hoặc F2, hoặc bấm
  đúp), Then khung sửa hiện ngay dưới ô với «Hiểu là: 2.800.000.000 ₫ (2,8 tỷ)»; Enter gọi cổng lưu đúng MỘT lần với giá
  2.800.000.000; ô hiện 2,8 tỷ, Xác nhận lúc của dòng thành lúc vừa sửa, thông báo «Đã đổi …» kèm Hoàn tác; không có nút
  Lưu. (cross-layer)
- AC-3: Given khung sửa giá, When gõ chữ bộ đọc trả «chưa hiểu» rồi Enter, Then trong khung báo «Chưa hiểu «…» — gõ như
  4,65 tỷ hoặc 950 triệu», cổng lưu không được gọi; Esc đóng khung, ô giữ giá cũ.
- AC-4: Given ngưỡng hỏi lại 20% khai một chỗ ở tệp luật, When giá mới lệch quá 20% so với giá cũ, Then khung hỏi lại tại
  ô với phần trăm và giá cũ → mới; «Đổi giá» ghi, «Thôi» không ghi; lệch đúng 20% hay ít hơn, hay căn chưa có giá, thì ghi
  thẳng. Ma trận viết trước: biên 20% / 20,01%, tăng và giảm, chưa có giá.
- AC-5: Given ô Trạng thái, When mở sửa, Then khung chỉ đưa các nấc chuyển hợp lệ từ trạng thái hiện tại (sáu trạng thái ×
  nấc đi, ma trận viết trước theo bảng 12 lối); chọn Đã bán đòi giá chốt (cùng bộ đọc giá, điền sẵn giá chào) và ngày bán
  (mặc định hôm nay); chọn Ngừng hẳn đòi một lý do trong danh sách của Hỏi-2; thiếu thì báo «Còn thiếu …» trong khung và
  không ghi; nấc không hoàn tác được (theo Hỏi-3) nói trước khi ghi và thông báo sau đó không có Hoàn tác. (cross-layer)
- AC-6: Given căn Đã bán và câu trả lời Hỏi-3 là khoá (khuyến nghị), When thử mở sửa ô Giá chào hay Trạng thái (F2, gõ, bấm đúp), Then không khung nào mở; ô có ổ
  khoá và nói lý do khi trỏ vào. Căn Ngừng hẳn: ô Trạng thái khoá như vậy, ô Giá vẫn sửa được.
- AC-7: Given một lần sửa vừa ghi, When bấm Hoàn tác, Then cổng lưu được gọi một lần với giá trị trước và ô về giá trị ấy;
  khi lần hoàn tác hỏng — thiết bị mất mạng (cổng lưu không ghi khi mất mạng; lỗi mạng của fetch là TypeError) hay bị
  máy chủ từ chối (phản hồi 403) — Then thông báo đứng yên nói căn nào vẫn đang mang giá trị mới kèm «Thử lại», không bao
  giờ im; lần lưu thành công thì không có thông báo lỗi nào. Khi chính lần sửa hỏng, ô về giá trị cũ và thông báo nói vì sao; máy chủ trả 403 thì câu
  riêng «Không đủ quyền làm việc này. Tải lại trang để thấy đúng các nút.». (cross-layer)
- AC-8: Given bảng quyền của 9a, When vai của phiên không có thao tác `updateListing` (ví dụ Quản trị sàn), Then ô Giá
  chào và Trạng thái hiện như chữ thường và F2, gõ, bấm đúp không mở khung; vai có quyền thì mở. Ở 1440 với vai có quyền, sáu cột còn lại
  (Căn, Toà, Khu, Diện tích, Phòng ngủ, Xác nhận lúc) không mở khung bằng F2, gõ hay bấm đúp — đúng hai trên tám cột mở.
  Dưới 768 px không cột nào mở sửa, ở mọi vai.
- AC-9: Given luật phím 2a và «Chữ mở trong ô» của hàng 3, When dùng Bảng hàng có sửa trên ô, Then Enter trên ô đang chọn
  vẫn mở hồ sơ căn, bấm mã căn vẫn mở hồ sơ, bấm lề ô vẫn chỉ chọn ô, Ctrl/Cmd+C vẫn chép chữ đang hiện; trong khung Tab ghi
  rồi sang ô kế, Esc huỷ; đóng khung thì tiêu điểm về ô vừa sửa và mũi tên chạy tiếp từ đó.
- AC-10: Given bài rào «màn tự dựng lại hành vi», When một tệp màn `.ts` có câu ép kiểu `<T>x` đứng trước câu nhập một thành
  phần bị cấm, Then bài rào đỏ gọi tên tệp và câu nhập (tệp `.ts` đọc như TypeScript, `.tsx` như TSX); và trên cây sau hàng
  này `make check` xanh, nhãn mới (trường Lý do ngừng và các lý do theo Hỏi-2) đến từ
  `ontology/labels.yaml`, mỗi nhãn tối đa 17 ký tự.

## Đường đo

Ngưỡng của ô cơ hội (đề xuất): đạt «Hoàn tác hỏng thì báo rõ, kể cả khi mất mạng; bài rào «màn tự dựng lại hành vi» đọc
đúng tệp .ts».

- Thước: hoàn tác hỏng thì báo rõ · số từ: E7, E7-ui · bảo đảm bởi: AC-7
- Thước: bài rào đọc đúng tệp .ts · số từ: E10 · bảo đảm bởi: AC-10

## Coverage

Quét không gian AC theo trục (morphological, preset entity-feature, rút gọn):

- Trục A — cột: Giá chào · Trạng thái · (sáu cột khác chỉ đọc) [thước CE: câu giao hàng 4]
- Trục B — loại thay đổi: giá trong ngưỡng · vượt ngưỡng · chưa có giá · từng nấc chuyển · nấc cần thêm thông tin (Đã
  bán, Ngừng hẳn) · nấc cuối [thước CE: bảng 12 lối, luật thực thể Listing]
- Trục C — chữ người gõ: đúng · mơ hồ · sai · biên [thước CE: bảng chữ viết trước của AC-1]
- Trục D — sau khi ghi: hoàn tác được · không hoàn tác được · lưu hỏng · bị từ chối · hoàn tác hỏng [thước CE: điều kiện
  xong của hàng]
- Trục E — ai và ở đâu: vai có quyền · vai không quyền · căn khoá · máy tính · điện thoại [thước CE: bảng quyền 9a, trang
  Sửa trên ô]
- Trục F — phím: vào sửa · trong khung · ra khung · luật cũ của 2a, 3 [thước CE: design/behaviors.md]
- Core: A×B ở AC-2, AC-4, AC-5; C ở AC-1, AC-3; D ở AC-7; E ở AC-6, AC-8; F ở AC-9; rào AC-10.
- Later: cột Phí và điều kiện phí · hoàn tác bằng Ctrl/Cmd+Z · báo khi hai người cùng sửa · sàn chỉnh ngưỡng 20%.
- Never: sửa thuộc tính căn (diện tích, phòng ngủ, toà) trên ô · sửa trên ô ở điện thoại.

## Out of scope

- Cột Phí và điều kiện phí: thực thể chưa có trường; thêm khi hàng thuế phí khai trường.
- Dán một vùng từ Excel, kéo điền, sửa hàng loạt (hàng 5).
- Hoàn tác bằng Ctrl/Cmd+Z và báo khi hai người cùng sửa một căn — cần đường ghi thật (hàng 10).
- Sửa nhanh trên điện thoại (hàng 3d, dùng lại tệp luật của hàng này).
- Ghi vào cơ sở dữ liệu: hôm nay chưa có bảng căn (Hỏi-1).

## Notes

- Hỏi-1 (ghi vào đâu), Hỏi-2 (danh sách lý do ngừng), Hỏi-3 (Đã bán là nấc cuối và khoá) chờ chủ kho ở Cổng Phạm vi;
  khuyến nghị ở sổ quyết định.
- Hỏi-1 chọn lối cửa API: thêm `api` vào surfaces, bỏ dòng «Ghi vào cơ sở dữ liệu» khỏi Out of scope, và thêm AC-11: vai
  không có `updateListing` (CompanyAdmin) gọi `PATCH /api/v1/listings/{id}` nhận 403 và dữ liệu không đổi; vai ListAgent
  nhận 200 (đối chứng dương); eval cross-layer `layer: backend-effect` đo cả hai.
- Hỏi-2 chọn thêm «Khác»: AC-5 và E5-e2e thêm ca «Khác» bắt buộc ghi chú; E10c đếm năm nhãn thay bốn.
- Hỏi-3 chọn cho hoàn tác Đã bán trong lúc thông báo còn hiện: AC-5 đổi câu «không hoàn tác được», E5 ca hoan-tac-duoc đổi
  ma trận, AC-6 khoá sau khi thông báo tắt.
- Mất mạng ở hàng này đo trên trình duyệt đặt ngoại tuyến (cổng lưu từ chối); hàng 10 đo lại trên đường ghi thật.
- Lệch hydrate ở trạng thái tải (dãy V): không tái hiện ở 1440 trên nhánh hiện tại, đã báo G, không sửa trong hàng này.
