---
schema_version: 1
feature: Đầu chủ sửa được thông tin của căn ngoài giá và trạng thái — pháp lý, nội thất, tài chính, tình trạng sử dụng — ngay trong sản phẩm, không phải nhập lại tệp
slug: sua-thong-tin-can
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui, api]
screens: [inventory]
status: draft
design_doc: docs/superpowers/specs/2026-11-17-sua-thong-tin-can-design.md
---

# Acceptance Contract: sua-thong-tin-can

## Context

Hàng 3g của lộ trình. Hồ sơ căn (hàng 3b) hiện pháp lý, nội thất, tài chính, tình trạng sử dụng nhưng không cho sửa; giá
trị trường riêng của sàn (hàng 7e) chỉ lưu và hiện (hàng 10). Hàng này mở việc sửa cả hai qua đúng cửa ghi của hàng 4 và
10, và trả bốn nợ của cửa lưu (mục 3 của thiết kế). Không đổi cơ sở dữ liệu (cột có từ migration 013), không đổi
`ontology/`, không thêm thao tác vào bảng quyền.

Source input: ô cơ hội `_acceptance/sua-thong-tin-can/opportunity.md` (build, Manh Phan, 2026-11-15) · hàng 3g của
`docs/plan/lo-trinh.json` · LUAT của đợt, mục «Nợ giao HÀNG 3g» · Hỏi-3 của hàng 5 và hàng 10.

## Criteria

- AC-1: Given Bảng hàng có dữ liệu, When một người mở hồ sơ một căn có lần chào đang mở, Then mục «Lần chào đang mở» có
  nút «Sửa» ở đầu mục, bên phải, khi và chỉ khi vai của phiên có ô `updateListing` (Đầu chủ, Đầu khách, Trưởng nhóm thấy;
  Quản trị sàn không thấy); xem một lần chào trước, hay lần chào đã đóng, thì mục không có nút. Máy chủ từ chối (403) một
  lần sửa của vai không có ô dù gửi thẳng. (cross-layer)
- AC-2: Given Đầu chủ mở hộp «Sửa» của một căn, When chọn Nội thất, Tình trạng sử dụng trong các giá trị cố định, gõ Pháp
  lý và Tài chính rồi «Lưu», Then hộp đóng, bốn dòng của mục hiện giá trị mới, mức đủ thông tin đếm lại tại chỗ, thông báo
  «Đã đổi …» kèm «Hoàn tác»; «Hoàn tác» đưa cả bốn về như cũ; tải lại trang (có cơ sở dữ liệu) vẫn thấy giá trị đã lưu. Làm
  được ở khổ 1440 và 360. (cross-layer)
- AC-3: Given hộp «Sửa» đang mở, When người không đổi gì, gõ Pháp lý quá 200 ký tự, hay để trống một trường, Then không
  đổi gì thì «Lưu» không gửi gì; quá dài thì hộp nói tại trường và không gửi; để trống là xoá phần ấy (lưu thành không có,
  mức đủ thông tin đếm thiếu lại); một trường đã dài quá 200 ký tự từ lần nhập tệp mà người không đổi thì vẫn lưu được các
  trường khác. Máy chủ từ chối bản ghi có giá trị ngoài tập cố định hay chữ quá dài (400). (cross-layer)
- AC-4: Given một lần lưu trong hộp không qua, When cửa ghi trả mất mạng, căn vừa đổi (409), phiên hết hạn (401), máy chủ
  lỗi (500) hay không đủ quyền (403), Then hộp giữ nguyên chữ đã gõ và nói đúng một câu theo kết cục — bốn câu đầu kèm «Thử
  lại», câu 403 chỉ còn «Thôi»; căn vừa đổi (409 kèm bản hiện tại từ máy chủ) thì mục hiện bản mới nhất sau khi đóng
  hộp. (cross-layer)
- AC-5: Given căn điền đủ Pháp lý và Tình trạng sử dụng qua hộp, When hồ sơ đếm mức đủ thông tin, Then hai phần ấy không còn
  trong câu «Còn thiếu …» — đếm bằng đúng một luật `completeness` của hàng 3b (không bản thứ hai), là điều kiện hàng 15 đọc.
- AC-6: Given sàn có trường riêng đủ năm kiểu (chữ, số, ngày, chọn một, có/không) và Đầu chủ ở khổ từ 768 px, When mở ô
  của một cột riêng, Then bộ sửa đúng kiểu hiện ra (ô chữ, ô số, ô ngày dd/mm/yyyy, danh sách lựa chọn, Có/Không/Chưa có);
  Enter lưu qua cùng cửa ghi với «Hoàn tác»; gõ sai kiểu thì dòng dưới ô nói kiểu cần gõ và không gửi; máy chủ từ chối giá
  trị sai kiểu, lựa chọn không có hay trường đã ngừng bằng luật `checkCustomValue` của lớp riêng của sàn. Vai không có ô
  `updateListing` thì ô không mở. (cross-layer)
- AC-7: Given cửa lưu của Bảng hàng, When máy chủ trả 401, 403, 409, 404, 400, 500 hay thân trả lời không đọc được, Then
  kết cục lần lượt là phiên hết hạn, không đủ quyền, căn vừa đổi, căn vừa đổi, máy chủ không nhận, máy chủ lỗi, máy chủ lỗi
  — đọc bằng MỘT luật ở `src/lib/write-failure.ts` mà cả cửa lưu và cửa ghi chung `useChange` dùng (không tệp nào trên
  đường ghi của căn còn bảng mã thứ hai); bài của cửa lưu lấy thân trả lời từ handler thật `createListingsHandlers`, không viết tay.
- AC-8: Given Đầu chủ dán một khối từ Sheet phủ cột riêng của sàn, When hộp xem trước mở, Then giá trị đúng kiểu nằm ở
  «sẽ đổi» và áp được bằng một lần, một «Hoàn tác»; giá trị sai kiểu, lựa chọn không có nằm ở «sai kiểu» kèm lý do; chữ rơi
  vào cột tính (Về tay) theo Hỏi-2. Bài màn không đủ quyền `tests/bang-hang-khong-du-quyen.test.tsx` có đối chứng dương cho
  hai kiểm tra phụ «không vùng hàng», «không mã căn».
- AC-9: Given hộp «Sửa» và ô cột riêng đang mở, When bộ quét trợ năng chạy ở nền sáng và tối, và bài trình duyệt chạy ở bốn
  khổ 360, 414, 1024, 1440, Then không có lỗi trợ năng mức nghiêm trọng, nút «Sửa» có tên đọc được, tiêu điểm về «Sửa» khi
  hộp đóng; hộp mở từ hồ sơ có đúng một lớp nền mờ ở mọi khổ (cả hồ sơ toàn màn ở điện thoại, nơi hộp lồng trước đây
  không có nền mờ); thông báo sau khi lưu không đè lên nút chính ở đáy hồ sơ, và khi không mở hồ sơ thì thông báo ở chỗ cũ.
  Hai sửa này ở khối dùng chung nên chữa luôn hộp «Báo sai thông tin» (3e) và thông báo của sửa trên ô (4) khi hồ sơ mở.
- AC-11: Given Bảng hàng ở khổ từ 768 px (Hỏi-3, chủ kho chọn lối C), When mở trang, Then lưới có thêm bốn cột Nội
  thất, Pháp lý, Tài chính, Tình trạng sử dụng ngay sau Phòng ngủ, hiện sẵn và ẩn được bằng «Cột» (lưu trong Góc nhìn);
  mỗi ô sửa được một phần — Nội thất, Tình trạng chọn trong giá trị cố định cộng «Chưa có», Pháp lý, Tài chính gõ chữ tối
  đa 200 ký tự — qua cùng cửa ghi và cùng thay đổi `details` của hộp trong hồ sơ, có «Hoàn tác»; dán từ Excel vào bốn
  cột theo kiểu của cột; lưu ở ô thì hồ sơ đang mở hiện giá trị mới, lưu ở hộp thì ô hiện giá trị mới; căn đã bán hay
  ngừng thì ô khoá. Lối C lật dòng tám cột đã ký ở Hỏi-2 hàng 2. (cross-layer)
- AC-10: Given một lần sửa bốn trường hay một giá trị trường riêng được lưu, When máy chủ ghi căn, Then «Xác nhận lúc» của
  căn theo đúng câu chủ kho chọn ở Hỏi-1 (khuyến nghị: mọi lần sửa đặt «Xác nhận lúc» là lúc lưu, một luật với hàng 4) và
  ô «Xác nhận lúc» trên lưới đổi theo. (cross-layer)

## Vai × Màn

Ô sửa theo Hỏi-2 hàng 10 (chủ kho chọn A: ba vai, toàn sàn); Quản trị sàn xem chỉ đọc (Hỏi-1 hàng 10).

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
| --- | --- | --- | --- | --- |
| inventory | được — sửa bốn trường trong hồ sơ, sửa trường riêng trên ô, toàn sàn | được — như Đầu chủ | được — như Đầu chủ | được — xem, không có nút «Sửa», ô không mở |

## Đường đo

- Ô cơ hội khai ngưỡng đề xuất bằng chính câu «bật khi» của hàng (sửa được ở máy tính và điện thoại, lưu xong hồ sơ và
  mức đủ thông tin hiện giá trị mới). Đường đo: AC-2 đo ở khổ 1440 và 360; số căn đủ năm phần trên tổng căn đang chào của
  mỗi sàn đếm từ bảng `listings` bằng luật `completeness` (AC-5). Không thêm bảng đếm.

## Coverage

Quét theo preset entity-feature, làm trong lúc thiết kế. Trục: trường (bốn trường · năm kiểu trường riêng) × chỗ sửa (hộp
trong hồ sơ · ô · dán) × kết cục ghi (lưu · hoàn tác · mất mạng · căn vừa đổi · phiên hết hạn · máy chủ lỗi · không đủ quyền ·
sai luật) × vai (ba vai sửa · Quản trị sàn) × khổ (360 · 1440). Thước CE: mỗi ô của trục kết cục có một ca trong bài cửa lưu
(AC-7) hoặc bài hộp (AC-4).

- [GIẢ ĐỊNH] Trần 200 ký tự cho Pháp lý và Tài chính là máy chọn (một dòng chữ); chưa đo trên dữ liệu thật của sàn. Chỉ
  kiểm trường người vừa đổi: giá trị dài sẵn từ lần nhập tệp không chặn lần lưu (AC-3).
- [GIẢ ĐỊNH] Sửa trường riêng trên điện thoại để hàng 3d (sửa nhanh trên điện thoại) — điện thoại không sửa trên ô.

## Out of scope

- Sửa trường riêng trên điện thoại — để hàng 3d (ai quyết: chủ kho, lộ trình; luật hàng 4 «điện thoại không sửa trên ô»).
- Thêm đủ 26 cột như Quỹ hàng (tầng, hướng, loại hình, loại căn, giá chốt, ngày bán, đầu chủ, mức đủ, ai thấy…) —
  hàng riêng «Bảng hàng đủ cột như Quỹ hàng» ở Cổng Đáng kế (ai quyết: chủ kho, 2026-11-17; giám sát ghi).
- Danh sách giá trị cố định cho Pháp lý, Tài chính — chờ dữ liệu nhập Sheet hàng 11 (ai quyết: chủ kho, Hỏi-1 hàng 3b).
- Sửa thông tin của căn (tầng, hướng, diện tích) — thuộc danh mục dùng chung, hàng «Báo sai thông tin» 3e (ai quyết: chủ kho).
- Điều kiện «Sẵn sàng bán» — hàng 15 (ai quyết: chủ kho, lộ trình).
- Lịch sử ai sửa gì — hàng 3c «Lịch sử của căn» (ai quyết: chủ kho, lộ trình).

## Câu hỏi cho chủ kho

- Hỏi-3 · Chỗ sửa bốn trường — **ĐÃ CHỐT lối C** (chủ kho tại phiên H, 2026-11-17, nguyên văn «Lấy lối C», sau luật
  chỗ sửa «Sửa nhanh -> Sửa trên bảng/lưới · Sửa nhiều trường trên căn -> Sửa trên chi tiết căn»): bốn cột hiện sẵn trên
  Bảng hàng, sửa trên ô từng phần; hộp «Sửa» trong hồ sơ cho nhiều trường và điện thoại (AC-11, AC-1, AC-2). Lật dòng tám
  cột của Hỏi-2 hàng 2: hồ sơ có ảnh lưới ghi sửa sau ký và ghim lại trong vòng này.

- Hỏi-1 · Sửa bốn trường hay trường riêng có tính là «vừa xác nhận với chủ nhà» không: khuyên **có, mọi lần sửa** — một
  luật của hàng 4. Lối khác: trường riêng không tính; giá: hai luật để nhớ.
- Hỏi-2 · Khối dán đi qua cột tính Về tay: khuyên **giữ vị trí như Sheet** (hàng 5 đang làm thế; chữ rơi vào Về tay bị bỏ
  kèm lý do). Lối khác: nhảy qua cột tính; giá: khối lệch một cột so với lưới đang thấy, sửa khối lưới dùng chung.

## Notes
