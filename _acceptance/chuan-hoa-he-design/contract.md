---
schema_version: 1
feature: Đầu chủ, Đầu khách và Trưởng nhóm đọc trạng thái căn bằng sáu màu không trùng nhau ở cả nền sáng lẫn tối, và sửa nhanh trên ô bằng Enter, phím cách mở hồ sơ, bấm ra ngoài là lưu — lát 1 của điều chủ kho đã duyệt «Duyệt cả ba lối A» ngày 27/11/2026
slug: chuan-hoa-he-design
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: []
status: draft
design_doc: _acceptance/chuan-hoa-he-design/design.md
---

# Acceptance Contract: chuan-hoa-he-design

## Context

Chủ kho xem Bảng hàng thật ngày 27/11/2026 ở phiên «BH · Điều chỉnh UX Bảng hàng» và duyệt trên ảnh dựng ba phần chuẩn
hoá: màu trạng thái, bấm ô và dòng, lọc — nguyên văn «Duyệt cả ba lối A». Hợp đồng này là LÁT 1: đúng những thứ hàng 3h
cần để dựng nhịp ba mà khỏi dựng hai lần — bảng màu trạng thái kèm bài «không hai trạng thái trùng màu», bỏ ổ khoá ở chỗ
trạng thái đã nói, và cách sửa trên ô (Enter là sửa, phím cách mở hồ sơ, bút chì khi rê, bấm ra ngoài là lưu) kèm một bộ
trợ giúp bài trình duyệt mở sửa một ô. Lát 2 (liên kết mã căn, nút mở ở ô số thứ tự, ngăn theo dòng, Tuỳ chỉnh sửa trong
ô, vai Thành viên trung tính) và lát 3 (lọc) là hồ sơ riêng, dẫn nguyên văn câu trả lời ở Cổng Phạm vi này. Người dùng là
nhân viên sàn trên máy tính; sửa trên ô từ 768 px như luật hàng 4.

Source input: mục «VP11 «Chuẩn hoá hệ design»» và «VP11 — đầu vào Cổng Phạm vi» của sổ đợt `dieu-phoi-nen` (G-2711-16,
G-2811-15) · bàn giao phiên BH `bh-ban-giao-2026-11-27.md` · trang `chuan-hoa-he-design-2026-11-27.html` · `design.md`.

## Criteria

- AC-1: Given Bảng hàng ở 1440 có đủ sáu trạng thái, sáng và tối, When đo màu chữ hiện ra của sáu nhãn trạng thái, Then mọi
  cặp hai trạng thái cách nhau ΔE2000 ≥ 12 ở cả hai nền (ngưỡng theo Hỏi-2), «Chưa đủ để rao» là xám (độ bão hoà chữ ≤
  8), «Đang giao dịch» là sắc tím chủ kho chọn ở Hỏi-2 ở cả hai nền, «Đang bán», «Đã bán», «Tạm ngừng», «Ngừng hẳn» giữ
  sắc hôm nay, mỗi trạng thái có màu cùng một họ sắc ở sáng và tối (lệch sắc ≤ 30° khi độ bão hoà > 8), và trong mã ứng
  dụng chỉ nhãn trạng thái dùng biến thể info; bài đo đỏ khi không tìm thấy nhãn nào.
- AC-2: Given một căn của mỗi trạng thái, When nhìn nhãn của nó ở lưới (1440), thẻ điện thoại (360), đầu ngăn chi tiết và
  lịch sử lần chào, sáng và tối, Then cùng một trạng thái có cùng màu ở mọi chỗ ấy (ΔE2000 ≤ 3).
- AC-3: Given căn đã bán và căn ngừng hẳn trên lưới ở 1024 và 1440, When nhìn các ô khoá của dòng ấy (trạng thái, giá chào,
  phí, cột riêng của sàn), Then không ô nào vẽ ổ khoá; rê chuột thấy lý do khoá và trình đọc màn hình đọc được lý do ấy; ô
  vẫn không mở sửa bằng Enter, F2, gõ hay bấm đúp.
- AC-4 (chờ Hỏi-1): Given Bảng hàng ở 1024 và 1440, When chọn một ô rồi bấm Enter, Then ô sửa được (người có quyền, dòng không khoá,
  kiểu sửa trên ô) mở khung sửa trên ô và ngăn chi tiết không mở; ô không sửa được (không quyền, dòng khoá, kiểu không sửa
  trên ô, ô mã căn) mở ngăn chi tiết của dòng; trên Đã gửi Enter mở chi tiết; trên màn có lưới mà không có ngăn chi tiết
  (Tuỳ chỉnh của sàn) Enter vẫn đi xuống một dòng.
- AC-5 (chờ Hỏi-1): Given Bảng hàng và Đã gửi ở 1024 và 1440, When chọn một ô bất kỳ (kể cả ô sửa được) rồi bấm phím cách, Then ngăn chi
  tiết của dòng ấy mở, ô không mở sửa và trang không cuộn; khi khung sửa đang mở thì phím cách gõ một dấu cách vào ô.
- AC-6: Given Bảng hàng ở 1024 và 1440, When rê chuột lên một ô, Then ô sửa được với người có quyền hiện bút chì ở mép phải
  ô, có chữ gợi ý; ô khoá, ô không sửa trên ô, và mọi ô với người chỉ được xem không hiện bút; trên máy cảm ứng không rê
  được (1024, chạm) bút hiện trên ô sửa được đang chọn.
- AC-7: Given khung sửa đang mở trên một ô của Bảng hàng, When bấm ra ngoài khung (vào ô khác hay vùng trống của lưới), Then
  giá trị đọc hiểu được ghi như bấm Enter — đọc lại, hỏi lại khi giá đổi quá 20 %, thông báo «Hoàn tác» — và ô vừa bấm là
  ô đang chọn; giá trị chưa hiểu thì khung ở lại và báo ở ô; Esc vẫn huỷ không ghi; Tab ghi rồi sang ô kế; mỗi lần sửa
  ghi xuống máy chủ đúng một lần (bấm ra ngoài một lần, Enter một lần, không ghi thêm khi khung đóng; Esc và giá trị chưa
  hiểu không ghi), tải lại trang vẫn thấy giá mới. (cross-layer)
- AC-8: Given một bài trình duyệt của hàng khác (3h) cần mở sửa một ô, When gọi bộ trợ giúp dùng chung với dòng và cột, Then
  bộ trợ giúp mở khung sửa trên đúng ô ấy (bằng Enter; bằng F2 nếu Hỏi-1 giữ luật cũ) và trả khung; ô không mở sửa thì đỏ có tên ô; bộ chọn không khớp ô nào
  thì đỏ «no cell matches», không xanh rỗng.
- AC-9: Given cây sau vòng này, When chạy `make check`, bộ bài trình duyệt chung ở bốn khổ sáng và tối và bộ có đăng nhập
  trên Postgres, Then tất cả xanh, axe không lỗi serious hay critical, và không tệp nào dưới `src/components/ui` hay
  `src/components/reui` đổi.
- AC-10: Given `design.md`, `design/behaviors.md` và `wiki/decisions/0052-chuan-hoa-he-design.md`, When đặt cạnh lời chủ kho
  ở mục «Nguồn» và câu trả lời ở Cổng Phạm vi, Then mỗi điều của lát 1 có đúng một chỗ làm và một dòng sổ hành vi mang lời
  và ngày của ông (dòng «Sửa dữ liệu», «Phím trong lưới», «Chữ mở trong ô», «Ô không sửa được»); điều của lát 2, lát 3 và
  các câu ông chưa quyết không lọt vào phần đã làm. (judgment)

- AC-11 (chờ Hỏi-4): Given Bảng hàng ở 1440 nền tối với ngăn chi tiết của một căn đang mở, When đo độ sáng của trang, lưới
  và thân ngăn, rồi mở trình đơn tiêu đề một cột và rê lên một mục, Then thân ngăn sáng hơn lưới ít nhất 5 nấc xám (khuyên
  nửa nấc: lưới 23, ngăn 30) và mục đang rê trong trình đơn vẫn sáng hơn nền trình đơn ít nhất 5 nấc; ở nền sáng mọi màu ấy
  không đổi.

## Coverage

Thước đối chiếu: ba phần chủ kho đã duyệt (cắt theo lát ở `design.md`), luật đã ký của hàng 2a, 4, 3 và phân xử D-1211-19,
bốn khổ, hai giao diện, vai có quyền và chỉ xem, các kiểu ô.

- Trục điều đã quyết (lát 1): xám và tím, bốn màu giữ (AC-1) | một nguồn ở mọi chỗ (AC-2) | không ổ khoá ở chỗ trạng thái
  nói (AC-3) | Enter là sửa (AC-4) | phím cách mở hồ sơ (AC-5) | bút chì khi rê (AC-6) | bấm ra ngoài là lưu (AC-7) | bộ
  trợ giúp cho 3h, G-2811-15 (AC-8) | sổ hành vi (AC-10).
- Trục khổ: 360 (AC-2 thẻ) | 1024 | 1440 (AC-1..AC-7); 414 không có điều riêng ở lát này (sửa trên ô từ 768).
- Trục giao diện: sáng | tối (AC-1, AC-2, AC-11, eval ui-check).
- Trục lớp nổi ở nền tối: ngăn chi tiết | trình đơn có dấu rê (AC-11); hộp thoại và ô gợi ý dùng cùng màu, đo qua ảnh.
- Trục vai: có quyền sửa (AC-4, AC-6, AC-7) | chỉ được xem (AC-4, AC-6).
- Trục kiểu ô: sửa được | khoá do trạng thái (AC-3, AC-4, AC-6) | kiểu không sửa trên ô, ô mã căn (AC-4, AC-6).
- Trục màn: Bảng hàng (mọi AC) | Đã gửi (AC-4, AC-5) | Tuỳ chỉnh của sàn, không ngăn (AC-4).
- Trục thiết bị nhập: chuột (AC-6, AC-7) | bàn phím (AC-4, AC-5, AC-7) | chạm từ 768 (AC-6).
- Trục không hồi quy: kiểm cả kho, bộ chung, bộ có đăng nhập, bộ kit không đổi (AC-9).
- Later: lát 2 `chuan-hoa-he-design-2` và lát 3 `chuan-hoa-he-design-3` (`design.md`, «Cắt lát»).
- Never: lối B của cả ba phần (chủ kho không chọn).

## Vai × Màn

Hợp đồng không khai màn mới (`screens: []`): vòng này đổi màu nhãn và cách dùng phím của lưới dùng chung, không dựng màn
nào và không đổi ai vào màn nào. Bảng quyền giữ nguyên: ô chỉ mở sửa khi bảng quyền cho vai thao tác, như luật hàng 4.

## Out of scope

- Lát 2: mã căn là liên kết thật, nút mở ở ô số thứ tự, ngăn chi tiết đi theo dòng đang chọn, Tuỳ chỉnh sửa trong ô, vai
  Thành viên về trung tính (chạm `src/modules/identity/ui`, hạng T3).
- Lát 3: cả phần lọc (dải «Đang lọc», dấu tiêu đề, lọc vào URL, «Từ … đến …», một chiều cao, câu không có kết quả, mục
  trạng thái ở cột thứ hai).
- Không đổi sửa trên điện thoại: theo hàng 3d.
- Không chọn màu cho dấu «khác danh mục» của 3h: 3h chọn sau, không trùng trạng thái nào (sổ đợt, «Chỗ trùng cần VP11 và 3h
  cùng giữ»).
- Không đụng trang khách (SP-4) và không sửa tệp của bộ kit dưới `src/components/ui`, `src/components/reui`.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Đường đo

- Bỏ đường đo — vòng không có ô cơ hội và ngưỡng; xem dòng sổ «bỏ đường-đo».

## Notes

- Hai câu ở Cổng Phạm vi đổi hợp đồng: Hỏi-1 «giữ» thì AC-4, AC-5 và bài E5, E6 rơi khỏi lát 1, AC-8 và E9 mở sửa bằng
  F2, dòng sổ hành vi «Phím trong lưới» giữ như cũ; Hỏi-2 «tím như ảnh 27/11» thì ngưỡng AC-1 hạ xuống 10 (cặp «Đang giao
  dịch» – «Đã bán» đo được 10,4 ở nền sáng). Bảng đo 15 cặp × 2 nền ở `design.md`. Hỏi-4 «giữ như hôm nay» thì AC-11
  và E19 rơi; «trọn một nấc» thì AC-11 thêm việc nâng màu rê của cả ứng dụng một nấc.
- Hỏi-4 do giám sát thêm (G-2811-17): ở nền tối ngăn nổi của VP10 lát 1 cùng màu với lưới, chỉ tách bằng viền; đổi màu lớp
  nổi là việc bảng màu nên thuộc VP11.
- Dựng chồng lên nhánh VP10 lát 1 (`feat/khung-luoi-va-ngan-chi-tiet` @a1aa19c6), theo G-2811-15; gộp sau VP10 lát 1.
- Hồ sơ đã ký có bài đổi kỳ vọng vì Enter thôi mở hồ sơ ở ô sửa được (dự kiến; S3 xác định danh sách đúng): 2a
  `bang-hang-dung-tay-nhu-sheet`, 3 `ho-so-can`, 4 `sua-tren-o`, 3g `sua-thong-tin-can`. Mỗi hồ sơ một dòng «sửa sau ký»
  và ghim lại một làn trước khi gộp.
- Mọi bài đo trên một tập phần tử phải đỏ khi tập rỗng; bài đo điểm ảnh hay màu thử trong ảnh Linux của Playwright trước khi
  coi là xanh (sổ đợt, 28/11).
