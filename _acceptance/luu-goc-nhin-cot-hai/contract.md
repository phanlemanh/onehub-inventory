---
schema_version: 1
feature: Đầu chủ lưu cách xem Bảng hàng (lọc, sắp xếp, nhóm, cột đang hiện) thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy
slug: luu-goc-nhin-cot-hai
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api]
screens: [inventory]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-12
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

Chủ kho duyệt theo khuyến nghị cả năm câu (2026-11-12): Hỏi-1 lưu trên máy chủ, Hỏi-2 riêng người lưu, Hỏi-3 danh sách L1
không số đếm, Hỏi-4 nút «Lưu góc nhìn» của vùng, Hỏi-5 không tự lưu; cả cột thứ hai một kiểu mục con.

## Criteria

- AC-1: Given Bảng hàng đang lọc theo toà và trạng thái, sắp theo giá giảm dần, nhóm theo toà và ẩn hai cột, When người bấm
  «Lưu góc nhìn», đặt tên rồi lưu, Then một mục mang tên ấy hiện ở cột thứ hai của App Shell, sáng lên, địa chỉ trang mang
  góc nhìn, và máy chủ giữ đủ bốn thứ của cách xem ấy (lọc cột, sắp xếp, nhóm, cột ẩn — không giữ chữ trong ô tìm) cho
  đúng người và sàn. (cross-layer)
- AC-2: Given một góc nhìn đã lưu, When người mở nó từ cột thứ hai, hoặc tải lại trang, hoặc mở địa chỉ ấy trong một phiên
  đăng nhập khác của cùng người, Then Bảng hàng ra đúng tập dòng, đúng thứ tự, đúng nhóm và đúng các cột đang hiện như lúc
  lưu, ô tìm trống. (cross-layer)

> Sửa sau Cổng Phạm vi, 2026-11-13 (giám sát G-1311-10, chờ chủ kho phê ở Cổng Bằng chứng): góc nhìn không lưu chữ tìm.
> Nguyên văn chủ kho: «Đồng ý lối A, một điểm tôi muốn bổ sung là đưa search đúng vào (⌘K) ở thanh trên đây cũng là nơi
> shell đã có ux?» — lối A bỏ ô tìm của vùng ở mọi bảng họ Lưới (hàng 2e); ở 2c ô tìm vẫn nguyên, chỉ không vào góc nhìn.
- AC-3: Given cột thứ hai có «Tất cả căn», các mục trạng thái và các góc nhìn, When người đi giữa chúng, Then đúng một mục
  sáng — mục đang mở; đầu màn mang tên góc nhìn đang mở; khi người đổi cách xem của góc nhìn đang mở, mục ấy mang dấu «đã
  đổi» và nút lưu có «Lưu thay đổi» và «Lưu thành mới»; bấm lại mục ấy thì về đúng cách xem đã lưu.
- AC-4: Given một góc nhìn đang mở đã đổi cách xem, When người bấm «Lưu thay đổi», Then máy chủ ghi đè cách xem của góc nhìn
  ấy, dấu «đã đổi» mất, tải lại vẫn ra cách xem mới; «Lưu thành mới» tạo mục thứ hai và để mục cũ nguyên. (cross-layer)
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
thao tác của một bản ghi (tạo, đọc, sửa, xoá), bốn thứ của cách xem, ba lớp người (chính mình, người cùng sàn, người sàn
khác), bảng trạng thái `design/states.md`.

- Trục thao tác: lưu mới (AC-1) | mở lại (AC-2) | lưu thay đổi (AC-4) | đổi tên (AC-5) | xoá (AC-6).
- Trục thứ trong cách xem: lọc cột | sắp xếp | nhóm | cột ẩn (AC-1, AC-2, AC-4); ô tìm không thuộc góc nhìn (sửa sau Cổng
  Phạm vi, G-1311-10).
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

Bảng quyền thêm bốn thao tác góc nhìn (đọc danh sách — quyết mục nào hiện ở cột thứ hai —, lưu, sửa — gồm đổi tên và lưu
thay đổi —, xoá) với phạm vi «của tôi» cho đúng các vai
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
- Góc nhìn cho màn Lưới khác (Đã gửi, Liên hệ): nhóm mục động ở cột thứ hai và kiểu cách xem dùng lại được, mỗi màn một hàng.
- Sắp thứ tự góc nhìn bằng kéo thả, góc nhìn mặc định khi mở Bảng hàng, ghim góc nhìn lên điện thoại.
- Chia sẻ góc nhìn ra ngoài sàn: không bao giờ (SP-4).
- Sửa hàng loạt, phần còn lại của mục gác L7.
- Lưu chế độ toàn màn hình, ô đang chọn, nhóm đang mở, vị trí cuộn vào góc nhìn.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Trình tự: S3 chỉ bắt đầu khi hàng 3 (hồ sơ căn) và hàng 9e (bộ nút theo quyền) đã ở nhánh chính; khi đó gộp `origin/main`
  một lần rồi mới dựng.
- Đổi `ontology/**` (thực thể Góc nhìn, nhãn, ba dòng bảng quyền), `db/migrations/**` (bảng mới, số 009 giám sát đã cấp),
  `src/components/candidate/**` (lưới dùng chung, Ngoài-4) phải xin giám sát bằng yêu cầu chạm tệp; PR có mục «Đổi ontology
  — chủ kho soi».
- Dữ liệu căn của Bảng hàng vẫn là dữ liệu mẫu; góc nhìn lưu trên máy chủ thật, nên bộ kiểm chạy trên Postgres của dãy K
  (`DB_LANE=k`, `DB_PORT=5564`).
- Known limits — chọn ở Cổng Bằng chứng 2026-11-13:
  - Ngoài-1: Lời mô tả của góc nhìn trong mô hình nghiệp vụ vẫn nói có lưu chữ tìm, trong khi thực tế đã bỏ.
  - Ngoài-2: Báo cáo gửi chủ kho không nêu rõ rằng lần này có đụng tới luật cách ly giữa các sàn, nên chủ kho có thể ký duyệt mà không biết cần soi kỹ chỗ ấy.
  - Ngoài-4: Nhật ký thay đổi chưa ghi việc góc nhìn không còn lưu chữ tìm và bước chuyển dữ liệu đã bỏ chữ ấy khỏi các góc nhìn cũ.
  - Ngoài-5: Ảnh chụp thanh công cụ trên điện thoại có thể không chứng minh cả hai nút lưu đều nằm trong khung nhìn.
  - Ngoài-6: Một câu mô tả nội bộ vẫn nói góc nhìn giữ cả chữ trong ô tìm, trong khi sản phẩm thật đã bỏ.
  - Ngoài-7: Cổng kiểm bằng chứng cho phép bỏ qua một bước với các khối cũ chỉ cần khai một dòng, nên có thể lọt một khối chưa có chứng từ thật.
  - Ngoài-8: Mã kiểm quyền được xếp mức rủi ro thấp hơn đáng lẽ, nhưng lần thay đổi này vẫn tính là mức cao và cần chủ mã duyệt.
  - Ngoài-9: Nhật ký chung chưa ghi việc góc nhìn bỏ chữ tìm kiếm theo phán quyết của chủ kho.
  - Ngoài-10: Một người đăng nhập có thể lưu một góc nhìn rất lớn của riêng mình.
  - Ngoài-11: Khi máy chủ lỗi tạm lúc mở một góc nhìn, người dùng bị báo là góc nhìn đã xoá và thấy mọi căn không lọc.
  - Ngoài-12: Nếu góc nhìn đã bị xoá ở tab khác, bấm lưu báo kiểm tra mạng và Thử lại mãi không được.
  - Ngoài-13: Một bài kiểm tự động chưa chứng minh được nó bắt được lỗi lưới giữ nguyên trạng thái khi bấm lại mục.
  - Ngoài-14: Bài kiểm có thể xanh dù bộ đếm không thấy được yêu cầu xoá thật.
  - Ngoài-15: Bài kiểm quyền có thể bỏ sót trường hợp bị từ chối mà vẫn ghi một góc nhìn.
  - Ngoài-16: Bài kiểm không canh nút Toàn màn hình khi không còn dòng khớp, nên nếu nút ấy biến mất thì có thể không ai biết.
  - SP-1: tệp phá thử của bộ kiểm cách ly tắt cách ly bắt buộc của bảng góc nhìn, chỉ trên cơ sở dữ liệu tạm, để chứng bộ kiểm báo đỏ đúng tên bảng.
