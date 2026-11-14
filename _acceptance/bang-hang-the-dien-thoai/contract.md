---
schema_version: 1
feature: Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại thấy danh sách thẻ căn và chạm thẻ để mở hồ sơ căn
slug: bang-hang-the-dien-thoai
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: draft
approved_by:
approved_at:
design_doc: _acceptance/bang-hang-the-dien-thoai/design.md
---

# Acceptance Contract: bang-hang-the-dien-thoai

## Context

Hàng 2b của lộ trình. Hôm nay Bảng hàng trên điện thoại là bảng cuộn ngang: ở 360 chỉ trọn hai cột, giá và trạng thái
khuất bên phải. Chủ kho 2026-11-11 tách «bảng thẻ điện thoại» thành hàng riêng sau hàng 3 và quyết «build» 2026-11-13.
Hàng này đổi phần thân của vùng Lưới trên Bảng hàng dưới 768 px thành danh sách thẻ căn, giữ nguyên lọc, nhóm, trạng thái
vùng và hồ sơ căn toàn màn đã có (hàng 3, 3a, 3e, 3f); từ 768 trở lên bảng không đổi. Sửa giá, trạng thái trên điện thoại
là hàng 3d, đứng sau.

Source input: ô cơ hội `_acceptance/bang-hang-the-dien-thoai/opportunity.md` (chủ kho «build» 2026-11-13), câu giao của
hàng 2b trong `docs/plan/lo-trinh.json`, sổ đợt (mục «Ô tìm của họ Lưới», «Bộ nút của hồ sơ căn»), Quỹ hàng
`docs/design/vo-va-ia.md` hàng 32, thiết kế `design.md`, bản bấm được (ảnh `cong/`).

Luật sản phẩm chạm: không (SP-1, SP-3, SP-4 đọc lại; màn này trong ứng dụng, không đổi luật che, không truy vấn mới).

## Criteria

- AC-1: Given Bảng hàng ở 360 và 414 với 60 căn mẫu, When vùng ở trạng thái có dòng, Then thân vùng là danh sách thẻ, không
  có bảng, không có thanh cuộn ngang của trang; mỗi thẻ hiện mã căn, giá chào dạng «x,xx tỷ» và nhãn trạng thái của căn ấy
  (lối A thêm nơi và ba thông số — theo Hỏi-1); số thẻ bằng số dòng, thứ tự thẻ bằng thứ tự dòng của bảng ở cùng lọc và sắp
  xếp; chân vùng «60 dòng».
- AC-2: Given Bảng hàng ở 767 và 768 px, When mở và khi đổi khổ qua lại giữa hai khổ ấy, Then 767 hiện thẻ, 768 hiện bảng
  như hôm nay (tiêu đề cột, hàng ô lọc, nút «Cột», «Toàn màn hình»); 1024 và 1440 không đổi; đổi khổ không mất lọc, nhóm,
  sắp xếp đang bật.
- AC-3: Given danh sách thẻ ở 360, đã cuộn xuống quá một màn, When chạm một thẻ, Then hồ sơ căn của hàng 3 mở toàn màn với
  địa chỉ `?ho-so=<id>` của căn ấy, «Trước/Sau» đi theo thứ tự thẻ; When đóng bằng «Đóng» hay nút lùi của trình duyệt, Then
  danh sách vẫn ở đúng chỗ cuộn cũ (lệch không quá 1 px) và tiêu điểm nằm trên thẻ vừa mở.
- AC-4: Given Bảng hàng dưới 768, When người lọc trên điện thoại theo Hỏi-2 (khuyến nghị: hàng ô lọc luôn hiện, cuộn ngang,
  cùng ô như dưới tiêu đề cột; chủ kho chọn nút «Lọc» thì: nút «Lọc (n)» mở ngăn đáy đủ ô lọc), Then thẻ chỉ còn căn khớp,
  hai ô lọc chồng nhau như ở bảng, «x / 60 dòng» và «Xoá lọc» hiện; không còn căn nào khớp thì «Không có dòng nào khớp» và
  «Xoá lọc» ở chỗ danh sách, ô lọc ở nguyên chỗ.
- AC-5: Given Bảng hàng dưới 768 mở từ lối tắt trạng thái (`?status=`), từ ô ⌘K (`?ma=`) hay từ một góc nhìn đã lưu (2c),
  When danh sách hiện, Then thẻ đúng tập căn bảng hiện ở cùng địa chỉ; góc nhìn đang mở bị đổi lọc trên điện thoại thì cột
  thứ hai vẫn đánh dấu «đã đổi» như ở bảng.
- AC-6: Given Bảng hàng dưới 768 đang nhóm theo Toà, When danh sách hiện, Then mỗi nhóm có một dòng tên toà kèm số căn,
  thẻ của toà nằm dưới dòng ấy, thứ tự nhóm và số căn bằng bảng ở cùng khổ trên 768.
- AC-7: Given Bảng hàng dưới 768 ở các trạng thái vùng đang tải, trống, lỗi, một phần hỏng, không đủ quyền (`design/states.md`),
  When vùng hiện, Then mỗi trạng thái hiện đúng câu và nút của vùng như ở bảng; thẻ chỉ có ở trạng thái có dòng và một phần.
- AC-8: Given thẻ căn ở 360 với dữ liệu kiểm của bản phát triển (`?mau=bien`; bản production bỏ qua tham số này) (mã căn 14 ký tự liền không khoảng trắng, giá 125,5 tỷ, giá thuê theo tháng,
  căn chưa có giá «—», đủ sáu trạng thái), When thẻ hiện, Then không chữ nào tràn khỏi thẻ, thẻ không rộng hơn khổ, mã căn
  xuống dòng chứ không bị cắt mất, giá và nhãn trạng thái đọc trọn.
- AC-9: Given mọi vai của sàn (Quản trị sàn, Trưởng nhóm, Đầu chủ, Đầu khách — 9a, 9b), When dùng Bảng hàng dưới 768, Then thẻ
  không có ô sửa, nút sửa giá hay trạng thái, nút «Cột»; hồ sơ mở từ thẻ mang đúng bộ nút theo vai như hồ sơ mở từ bảng; cả
  thẻ là một nút tên «Căn <mã>», vùng chạm cao ít nhất 44 px, Tab đi qua từng thẻ, Enter mở hồ sơ; quét axe ở 360 và 414,
  sáng và tối, không lỗi.
- AC-10: Given tài liệu của kho, When người đọc, Then trang thực thể `wiki/entities/listing.md` có hành vi thẻ dưới 768 trỏ tới hàng 2b; `design/behaviors.md` có hành vi danh sách thẻ dưới 768 (ngưỡng, chạm
  mở hồ sơ, lùi giữ chỗ cuộn); khuôn Lưới `design/patterns/luoi.md` nói lọc trên điện thoại theo Hỏi-2; sổ khối có dòng cho
  khối thẻ đã chọn; nhật ký có dòng của hàng này.

## Coverage

Không chạy quét hình thái — xem dòng sổ «bỏ coverage-scan»; trục lấy từ khổ so của họ Lưới, ma trận trạng thái và bảng
quyền đã có. Thước đối chiếu:

- Khổ: 360, 414, 767 (thẻ) · 768, 1024, 1440 (bảng) — AC-1, AC-2.
- Việc trên điện thoại: xem (AC-1), lọc (AC-4), vào từ chỗ khác (AC-5), nhóm (AC-6), mở và lùi (AC-3) — sửa thuộc 3d
  (Later).
- Trạng thái vùng của `design/states.md`: bảy trạng thái — AC-1, AC-4 (không khớp), AC-7.
- Dữ liệu biên: mã dài, giá lớn, giá thuê, thiếu giá, sáu trạng thái — AC-8 [CE chưa kiểm chứng: dữ liệu mẫu của kho
  không có mã dài, giá thuê, thiếu giá; đo bằng dữ liệu kiểm].
- Vai: bốn vai × quyền đọc — AC-9.

## Out of scope

- Sửa giá, trạng thái trên thẻ hay trên điện thoại — hàng 3d.
- Thẻ cho các màn Lưới khác (Đã gửi, Liên hệ sau này) — vùng có khe dùng chung, nhưng chỉ Bảng hàng dùng ở hàng này.
- Ảnh căn trên thẻ — kho chưa có ảnh căn.
- Chọn nhiều thẻ (giữ lâu) và gửi khách từ danh sách — chưa có hàng lộ trình.
- Khoá ghim cột «Căn» ở menu tiêu đề cột (việc gắn kèm từ 2e) — theo Hỏi-3; khuyến nghị tách việc nhỏ riêng.

## Đường đo

Ngưỡng SỐNG của ô cơ hội, từng vế:

- «Ở 360 và 414 Bảng hàng hiện thẻ căn thay cho bảng» — E1 (mọi thẻ, ở 360), E2 (ma trận khổ 360, 414, 767 / 768, 1024,
  1440), E11 (ảnh 360, 414).
- «mỗi thẻ đủ mã căn, giá, trạng thái» — E1 (ma trận 60 thẻ), E8 (dữ liệu biên ở 360).
- «chạm thẻ mở hồ sơ căn toàn màn, lùi về giữ chỗ đang cuộn» — E3.
- «thẻ Phạm vi bày ứng viên ReUI kèm ảnh theo quyết định 0023» — đo ở Cổng Phạm vi, không phải mã: trang
  `cong-pham-vi.html` bày A | B (Hỏi-1) và L1 | L2 (Hỏi-2) ở 360 cạnh ảnh khối gốc; lưới chứng minh màn
  (`tools/proof_gate/check.py`, trong `make test`) đòi nhóm `màn` của `### Ứng viên ReUI` có hai đến ba ứng viên kèm ảnh.

## Notes

- Tiêu chí và bài đo đổi theo lối chủ kho chọn ở Cổng Phạm vi:

  | Chọn | Đổi |
  |---|---|
  | Hỏi-1 A | AC-1 và E1: mỗi thẻ thêm nơi (Toà · Dự án) và ba thông số (Diện tích, Phòng ngủ, Xác nhận lúc) đúng của dòng ấy, ca phá «phone card missing fact: <mã> <trường>» |
  | Hỏi-1 B | AC-1 và E1: mỗi thẻ thêm nơi; không ba thông số |
  | Hỏi-2 L1 | AC-4, E4: hàng ô lọc ở trên danh sách, tám ô theo thứ tự cột; E9 Tab bắt đầu từ ô lọc cuối của hàng |
  | Hỏi-2 L2 | AC-4, E4: nút «Lọc» khi không lọc, «Lọc (n)» đúng n ô đang lọc ở cả bốn ca, ngăn đáy mở và đóng (Esc, nút đóng), tiêu điểm về nút; E9 Tab bắt đầu từ nút «Lọc» |
  | Hỏi-3 làm trong hàng | thêm một tiêu chí khoá ghim cột Căn ở menu tiêu đề cột và một bài đo ở 1440 |

  Lối không được chọn: mã bản bấm được của lối ấy (`?the=`, `?loc=`) gỡ trước lượt chấm.

- Tệp ngoài vùng của hàng: `src/components/candidate/data-region.tsx` (khe danh sách điện thoại) và tệp mới
  `src/components/candidate/phone-list.tsx`; `design/behaviors.md`, `design/patterns/luoi.md`, `design/so-khoi.yaml`,
  `_acceptance/config.yaml` (thêm dòng). Báo giám sát trước khi dựng.
