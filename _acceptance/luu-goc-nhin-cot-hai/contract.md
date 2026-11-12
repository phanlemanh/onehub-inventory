---
schema_version: 1
feature: Đầu chủ lưu cách xem Bảng hàng (lọc, sắp xếp, nhóm, cột đang hiện) thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy
slug: luu-goc-nhin-cot-hai
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api]
screens: [inventory]
status: draft
design_doc: _acceptance/luu-goc-nhin-cot-hai/design.md
---

# Acceptance Contract: luu-goc-nhin-cot-hai

## Context

Hàng 2c của lộ trình. Hàng 2a cho Bảng hàng lọc, tìm, sắp xếp, nhóm theo toà, ẩn hiện cột, nhưng cách xem mất khi rời
trang. Ở Sheet mỗi khu một tab; hàng này cho người dùng đặt tên một cách xem, thấy nó thành một mục ở cột thứ hai của App
Shell và mở lại đúng cách xem ấy. Kèm hai lỗi chủ kho chọn «mở hợp đồng mới» ở Cổng Bằng chứng của 2a (Ngoài-4, Ngoài-5).
Người dùng chính là Đầu chủ trên máy tính; mọi vai đọc được Bảng hàng (Đầu chủ, Đầu khách, Trưởng nhóm) lưu được góc nhìn
của mình; Quản trị sàn không đọc Bảng hàng nên không có nút góc nhìn.

Source input: ô cơ hội `_acceptance/luu-goc-nhin-cot-hai/opportunity.md` (chủ kho «build» 2026-11-12), thiết kế `design.md`,
bản bấm được `/proto/luu-goc-nhin`, hồ sơ 2a `_acceptance/bang-hang-dung-tay-nhu-sheet/` (`review-findings.md`, `contract.md`
mục Notes), khuôn bộ nút của hàng 9e (`_acceptance/bo-nut-theo-quyen/`, Cổng Phạm vi đã duyệt 2026-11-12).

Luật sản phẩm chạm: SP-1 (bảng mới của sàn). Không chạm SP-3, SP-4.

Các tiêu chí dưới viết theo khuyến nghị của máy cho Hỏi-1 (lưu trên máy chủ), Hỏi-2 (riêng người lưu), Hỏi-4 (nút «Lưu góc
nhìn» của vùng) và Hỏi-5 (không tự lưu). Chủ kho chọn khác thì máy sửa lời tiêu chí trước khi duyệt.

## Criteria

- AC-1: Given Bảng hàng đang lọc theo toà và trạng thái, có chữ trong ô tìm, sắp theo giá giảm dần, nhóm theo toà và ẩn hai
  cột, When người bấm «Lưu góc nhìn», đặt tên rồi lưu, Then một mục mang tên ấy hiện ở cột thứ hai của App Shell, sáng lên,
  địa chỉ trang mang góc nhìn, và máy chủ giữ đủ năm thứ của cách xem ấy cho đúng người và sàn. (cross-layer)
- AC-2: Given một góc nhìn đã lưu, When người mở nó từ cột thứ hai, hoặc tải lại trang, hoặc mở địa chỉ ấy trong một phiên
  đăng nhập khác của cùng người, Then Bảng hàng ra đúng tập dòng, đúng thứ tự, đúng nhóm, đúng các cột đang hiện và đúng chữ
  trong ô tìm như lúc lưu. (cross-layer)
- AC-3: Given cột thứ hai có «Tất cả căn», các mục trạng thái và các góc nhìn, When người đi giữa chúng, Then đúng một mục
  sáng — mục đang mở; đầu màn mang tên góc nhìn đang mở; khi người đổi cách xem của góc nhìn đang mở, mục ấy mang dấu «đã
  đổi» và nút lưu có «Lưu thay đổi» và «Lưu thành góc nhìn mới»; bấm lại mục ấy thì về đúng cách xem đã lưu.
- AC-4: Given một góc nhìn đang mở đã đổi cách xem, When người bấm «Lưu thay đổi», Then máy chủ ghi đè cách xem của góc nhìn
  ấy, dấu «đã đổi» mất, tải lại vẫn ra cách xem mới; «Lưu thành góc nhìn mới» tạo mục thứ hai và để mục cũ nguyên. (cross-layer)
- AC-5: Given «…» cuối một mục góc nhìn, When người chọn «Đổi tên», gõ tên mới rồi lưu, Then mục mang tên mới ở cột thứ hai,
  vẫn sáng nếu đang mở, cách xem không đổi, và tải lại vẫn mang tên mới. (cross-layer)
- AC-6: Given «…» cuối một mục, When người chọn «Xoá góc nhìn», Then việc ấy đứng cuối, tách bằng vạch, chữ đỏ; hộp xác nhận
  mở với focus ở «Thôi», Esc là thôi và không gửi gì; bấm «Xoá góc nhìn» thì mục mất khỏi cột thứ hai, máy chủ không còn trả
  góc nhìn ấy, góc nhìn đang mở bị xoá thì Bảng hàng về «Tất cả căn»; mở lại địa chỉ cũ thì thấy câu «Góc nhìn này không còn»
  và Bảng hàng trống lọc. (cross-layer)
- AC-7: Given hai người A và B cùng một sàn và một người C ở sàn khác, When A lưu góc nhìn, Then B và C không thấy góc nhìn
  của A ở cột thứ hai, không mở được nó bằng địa chỉ, không đổi tên, lưu thay đổi hay xoá được nó qua `/api/v1` (403 hoặc 404, không đổi gì);
  Quản trị sàn gọi lưu, sửa hay xoá góc nhìn qua `/api/v1` nhận 403;
  và bộ kiểm cách ly chứng bảng mới bật cách ly theo dòng bắt buộc dưới vai không sở hữu bảng. (cross-layer)
- AC-8: Given hộp đặt tên (lưu hay đổi tên), When tên trống, chỉ có dấu cách, dài quá 40 ký tự hoặc trùng tên một góc nhìn
  khác của chính người ấy (không phân biệt hoa thường), Then hộp không đóng, câu báo hiện ngay dưới ô và máy chủ cũng từ chối
  cùng các ca ấy; lưu hỏng vì mạng hay máy chủ thì hộp giữ tên đã gõ, có câu lỗi và «Thử lại»; 403 hiện câu «không đủ quyền»
  của khuôn 9e. (cross-layer)
- AC-9: Given Bảng hàng có lọc cột và chữ trong ô tìm, When một luật lọc hay chữ tìm làm không còn dòng nào khớp, Then thanh
  công cụ, ô tìm và hàng ô lọc cột ở nguyên chỗ, ô tìm giữ focus và chữ đang gõ, thân lưới hiện «Không căn nào khớp» kèm
  «Xoá lọc»; sửa riêng luật sai thì các dòng hiện lại mà không phải xoá hết lọc. (Ngoài-4 của 2a)
- AC-10: Given Bảng hàng đang toàn màn hình, When người rời trang bằng phím hay cử chỉ quay lại (hoặc bấm một liên kết đưa
  sang màn khác), Then màn kế hiện đủ cột biểu tượng, thanh trên, cột thứ hai và đầu màn mà không cần tải lại; quay lại Bảng
  hàng thì Bảng hàng ở chế độ thường. (Ngoài-5 của 2a)

## Coverage

Quét không gian theo trục (skill `morphological-scan`, preset entity-feature cho thực thể Góc nhìn), thước đối chiếu: bốn
thao tác của một bản ghi (tạo, đọc, sửa, xoá), năm thứ của cách xem, ba lớp người (chính mình, người cùng sàn, người sàn
khác), bảng trạng thái `design/states.md`.

- Trục thao tác: lưu mới (AC-1) | mở lại (AC-2) | lưu thay đổi (AC-4) | đổi tên (AC-5) | xoá (AC-6).
- Trục thứ trong cách xem: ô tìm | lọc cột | sắp xếp | nhóm | cột ẩn (AC-1, AC-2, AC-4).
- Trục đường mở: cột thứ hai | tải lại | phiên khác | địa chỉ của góc nhìn đã xoá (AC-2, AC-6).
- Trục người: chính mình | người cùng sàn | người sàn khác | vai không đọc Bảng hàng (AC-7).
- Trục đường đi: giao diện (AC-3, AC-8) | `/api/v1` (AC-7, AC-8) | cơ sở dữ liệu (AC-1, AC-7).
- Trục trạng thái: rỗng (ST-inventory-views-empty, E10) | đang đọc (E10) | lỗi lưu (AC-8) | không đủ quyền (AC-8) | không
  còn (AC-6) | lọc ra rỗng (AC-9).
- Trục khổ: 1440 | 1024 | 414 | 360, sáng và tối (E2 ca điện thoại, E13, E15).
- Hai lỗi kèm của 2a: Ngoài-4 (AC-9), Ngoài-5 (AC-10).
- Later: góc nhìn của sàn nếu chủ kho chọn riêng ở Hỏi-2; sắp thứ tự mục bằng kéo thả; góc nhìn mặc định; góc nhìn cho màn
  Lưới khác; ghim góc nhìn lên điện thoại.

## Vai × Màn

Bảng quyền thêm ba thao tác góc nhìn (lưu, sửa — gồm đổi tên và lưu thay đổi —, xoá) với phạm vi «của tôi» cho đúng các vai
đọc được Bảng hàng theo hàng 2a (Đầu chủ, Đầu khách, Trưởng nhóm); Quản trị sàn không có ô nên không thấy nút và `/api/v1`
trả 403.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| inventory | được — đọc, lọc, lưu góc nhìn; đổi tên, lưu thay đổi, xoá góc nhìn của mình | được — như Đầu chủ | được — như Đầu chủ | chặn — vùng báo không đủ quyền theo bảng quyền hàng 9a; không thấy nút góc nhìn |

## Đường đo

Bỏ — xem dòng sổ «bỏ đường-đo»: chủ kho dời nghiệm thu giá trị tới cuối lộ trình MVP; ô cơ hội chỉ có ngưỡng đề xuất là
chính các tiêu chí trên.

## Out of scope

- Góc nhìn dùng chung cả sàn, nếu chủ kho chọn «riêng người lưu» ở Hỏi-2: một hàng sau, kèm dòng bảng quyền cho người thêm,
  sửa, xoá góc nhìn của sàn.
- Góc nhìn cho màn Lưới khác (Đã gửi, Liên hệ): khe cột thứ hai và kiểu cách xem dùng lại được, mỗi màn một hàng.
- Sắp thứ tự góc nhìn bằng kéo thả, góc nhìn mặc định khi mở Bảng hàng, ghim góc nhìn lên điện thoại.
- Chia sẻ góc nhìn ra ngoài sàn: không bao giờ (SP-4).
- Sửa hàng loạt, phần còn lại của mục gác L7.
- Lưu chế độ toàn màn hình, ô đang chọn, nhóm đang mở, vị trí cuộn vào góc nhìn.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Trình tự: S3 chỉ bắt đầu khi hàng 3 (hồ sơ căn) và hàng 9e (bộ nút theo quyền) đã ở nhánh chính; khi đó gộp `origin/main`
  một lần rồi mới dựng.
- Đổi `ontology/**` (thực thể Góc nhìn, nhãn, ba dòng bảng quyền), `db/migrations/**` (bảng mới, số do giám sát cấp),
  `src/components/candidate/**` (lưới dùng chung, Ngoài-4) phải xin giám sát bằng yêu cầu chạm tệp; PR có mục «Đổi ontology
  — chủ kho soi».
- Dữ liệu căn của Bảng hàng vẫn là dữ liệu mẫu; góc nhìn lưu trên máy chủ thật, nên bộ kiểm chạy trên Postgres của dãy K
  (`DB_LANE=k`, `DB_PORT=5564`).
