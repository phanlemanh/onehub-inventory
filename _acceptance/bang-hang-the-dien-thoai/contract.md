---
schema_version: 1
feature: Đầu chủ và Đầu khách mở Bảng hàng trên điện thoại thấy danh sách thẻ căn và chạm thẻ để mở hồ sơ căn
slug: bang-hang-the-dien-thoai
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [inventory]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-14
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

- AC-1: Given Bảng hàng ở 360 và 414 với 60 căn mẫu, When vùng ở trạng thái có dòng, Then thân vùng là danh sách thẻ dùng
  trọn bề ngang, không khung nào bao quanh danh sách, không bảng, không thanh cuộn ngang của trang; mỗi thẻ là dáng «ngang
  gọn» của thẻ căn đang có ở đầu hồ sơ (một khối, hai dáng): ô vuông bên trái (ảnh căn khi có, khi chưa có theo Hỏi-1),
  mã căn và giá «x,xx tỷ» một dòng, nơi và nhãn trạng thái dòng hai, diện tích · phòng ngủ dòng ba; màn đầu ở 360 thấy
  trọn ít nhất 6 căn, ở 414 ít nhất 7; thứ tự thẻ bằng thứ tự dòng của bảng; đầu hồ sơ giữ dáng xếp dọc như hôm nay.
- AC-2: Given Bảng hàng ở 767 và 768 px, When mở và khi đổi khổ qua lại giữa hai khổ ấy, Then 767 hiện thẻ, 768 hiện bảng
  như hôm nay (tiêu đề cột, hàng ô lọc, nút «Cột», «Toàn màn hình»); 1024 và 1440 không đổi; đổi khổ không mất lọc, nhóm,
  sắp xếp đang bật.
- AC-3: Given danh sách thẻ ở 360, đã cuộn xuống quá một màn, When chạm một thẻ, Then hồ sơ căn của hàng 3 mở toàn màn với
  địa chỉ `?ho-so=<id>` của căn ấy, «Trước/Sau» đi theo thứ tự thẻ; When đóng bằng «Đóng» hay nút lùi của trình duyệt, Then
  danh sách vẫn ở đúng chỗ cuộn cũ (lệch không quá 1 px) và tiêu điểm nằm trên thẻ vừa mở.
- AC-4: Given Bảng hàng dưới 768, When người dùng hàng công cụ (ba nút biểu tượng có tên đọc được và nhãn khi chạm giữ) và lọc theo Hỏi-2 (khuyến nghị: nút Lọc mở ngăn đáy đủ
  ô lọc, lọc đang chạy hiện thành chip có nút bỏ; lối kia: hàng ô lọc luôn hiện), Then ngăn lọc mở đầu bằng «Sắp theo» (chọn một cột của bảng, tăng hay giảm dần — cùng sắp xếp với bảng, giữ khi qua
  ngưỡng 768); hàng công cụ là một dòng dính dưới
  thanh trên khi cuộn, gồm số dòng và ba nút biểu tượng 36 px của kho, mỗi nút trong vùng chạm 44 × 44 px (phán quyết giám sát G-1411-130) (Lọc kèm số ô đang lọc, Nhóm theo Toà, «…» chứa
  Lưu góc nhìn), không «Cột», không «Toàn màn hình»; thẻ chỉ còn căn khớp, hai ô lọc chồng nhau như ở bảng, «x / 60 dòng»
  và «Xoá lọc» hiện; không còn căn nào khớp thì «Không có dòng nào khớp» và «Xoá lọc».
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
- AC-9: Given mọi vai của sàn đọc được Bảng hàng (Đầu chủ, Đầu khách, Trưởng nhóm — 9a, 9b), When dùng Bảng hàng dưới 768, Then thẻ
  không có ô sửa, nút sửa giá hay trạng thái, nút «Cột»; hồ sơ mở từ thẻ mang đúng bộ nút theo vai như hồ sơ mở từ bảng; cả
  thẻ là một liên kết tới địa chỉ hồ sơ, tên đọc là chữ trên thẻ bắt đầu bằng mã căn (WCAG 2.5.3 — sửa sau Cổng Phạm vi), vùng chạm cao ít nhất 44 px, «…» của từng thẻ trong vùng chạm 44 × 44 px, Tab đi qua từng thẻ, Enter mở hồ sơ; quét axe ở 360 và 414,
  sáng và tối, không lỗi; Quản trị sàn thấy câu không đủ quyền, không thẻ.
- AC-11: Given Bảng hàng dưới 768 khi màn có nút theo vai (khuôn 9e), When người dùng mở danh sách thẻ, Then nút thêm
  căn nằm ở đầu màn và việc của một căn (Sửa, Xoá căn) nằm theo Hỏi-3 (khuyến nghị: «…» cuối mỗi thẻ và ở đầu hồ sơ; lối
  kia: chỉ ở đầu hồ sơ); nút chỉ hiện với vai có quyền theo bảng quyền (Đầu chủ: Sửa, Xoá căn của mình; Đầu khách: Sửa;
  Trưởng nhóm: cả sàn), không bao giờ hiện mà mờ; xoá hỏi lại trước khi làm. Các việc Thêm căn, Xoá căn, sửa trên điện
  thoại sống khi hàng 12, 18b, 3d gộp — hàng này dựng chỗ đặt và bài đo chỗ đặt trên mẫu khuôn 9e.
- AC-10: Given tài liệu của kho, When người đọc, Then trang thực thể `wiki/entities/listing.md` có hành vi thẻ dưới 768 trỏ tới hàng 2b; `design/behaviors.md` có hành vi danh sách thẻ dưới 768 (ngưỡng, chạm
  mở hồ sơ, lùi giữ chỗ cuộn); khuôn Lưới `design/patterns/luoi.md` nói lọc trên điện thoại theo Hỏi-2; sổ khối có dòng cho
  khối thẻ đã chọn; nhật ký có dòng của hàng này.

- AC-12 (sửa sau Cổng Phạm vi — phán quyết giám sát XONG V-1411-12, 2026-11-14; chủ kho phê ở Cổng Bằng chứng): Given mọi bài
  kiểm trình duyệt của các hàng trước từng khẳng định «ở 360/414 Bảng hàng là bảng», When hàng này viết lại chúng, Then
  mỗi ca cũ có đúng một dòng trong `doi-bai-kiem.md` («chuyển — ca mới» hay «không còn áp ở điện thoại — vì sao»), không
  dòng trống; ca chỉ của bảng ở điện thoại thành phép có đo «không bảng, có thẻ» kèm ca phá; việc người dùng vẫn làm ở
  điện thoại (lọc qua ngăn Lọc, lối tắt trạng thái, nhóm, Tab, axe, mở hồ sơ và lùi, không cuộn ngang) có ca thay ở điện
  thoại; không ca nào ở 1024, 1440 đổi lời hay kỳ vọng; không ca nào bị xoá hay bỏ trống.

## Vai × Màn

Hàng này không đổi quyền: thẻ chỉ đọc với mọi vai đọc được Bảng hàng; vai không đọc được vẫn chỉ thấy câu không đủ quyền.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — thẻ căn dưới 768, chạm mở hồ sơ, không sửa trên thẻ | được — như Đầu chủ | được — như Đầu chủ | chặn — vùng báo không đủ quyền, không thẻ |

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
- Tải ảnh căn — hàng 15; thẻ có sẵn chỗ ảnh, ảnh trong trang cổng là ảnh minh hoạ của bản phát triển.
- Chọn nhiều thẻ (giữ lâu) và gửi khách từ danh sách — chưa có hàng lộ trình.
- Khoá ghim cột «Căn» ở menu tiêu đề cột (việc gắn kèm từ 2e) — theo Hỏi-4; khuyến nghị tách việc nhỏ riêng.

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
  | Hỏi-1 Ô | AC-1 và E1: căn chưa có ảnh có ô vuông ghi mã toà; mọi thẻ cùng chiều rộng chữ; ca phá «phone card missing tile: <mã>» |
  | Hỏi-1 Gọn | AC-1 và E1: căn chưa có ảnh không có ô; chữ bắt đầu sát lề trái |
  | Hỏi-2 Nút | AC-4, E4: nút Lọc mang tên «Lọc» khi không lọc, «Lọc (n)» đúng n ô đang lọc ở cả bốn ca, chip mỗi cột đang lọc bỏ được từng cái, ngăn đáy mở và đóng (Esc, nút đóng), tiêu điểm về nút; E9 Tab bắt đầu từ nút Lọc |
  | Hỏi-2 Hàng ô | AC-4, E4: hàng ô lọc dưới hàng công cụ, tám ô theo thứ tự cột, không nút Lọc; E9 Tab bắt đầu từ ô lọc cuối của hàng |
  | Hỏi-3 làm trong hàng | thêm một tiêu chí khoá ghim cột Căn ở menu tiêu đề cột và một bài đo ở 1440 |

  | Hỏi-3 «…» trên thẻ | AC-11: mỗi thẻ có «…» theo quyền, cạnh nút mở; ca phá «…» hiện mà mờ → đỏ |
  | Hỏi-3 chỉ ở hồ sơ | AC-11: thẻ không có «…»; đầu hồ sơ có «…» theo quyền |

  Lối không được chọn: mã bản bấm được của lối ấy (`?the=`, `?loc=`, `?o=`, `?nut=`, `?anh=`) gỡ trước lượt chấm.
- Phán quyết giám sát G-1411-91 (2026-11-14): ba nút biểu tượng của hàng công cụ có tên đọc được (trình đọc màn hình) và
  nhãn hiện khi chạm giữ; dữ liệu hôm nay chưa căn nào có ảnh nên ảnh minh hoạ chỉ ở trang cổng — bản dựng không mang ảnh
  giả, thẻ hiện ô mã toà (hay không ô, theo Hỏi-1) cho mọi căn tới khi hàng 15 có ảnh thật.

- Tệp ngoài vùng của hàng: `src/components/candidate/data-region.tsx` (khe danh sách điện thoại) và tệp mới
  `src/components/candidate/phone-list.tsx`; dáng «ngang gọn» thêm vào `ListingCard` (`src/modules/listings/ui/listing-record.tsx`), không thêm tệp thẻ thứ hai; `design/behaviors.md`, `design/patterns/luoi.md`, `design/so-khoi.yaml`,
  `_acceptance/config.yaml` (thêm dòng). Báo giám sát trước khi dựng.
