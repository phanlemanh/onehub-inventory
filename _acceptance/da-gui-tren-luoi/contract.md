---
schema_version: 1
feature: "Đầu khách mở Đã gửi và thấy các link đã gửi trên cùng Lưới với Bảng hàng"
slug: da-gui-tren-luoi
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [sent]
status: verified
approved_by: Manh Phan
approved_at: 2026-11-13
design_doc: _acceptance/da-gui-tren-luoi/design.md
---

# Acceptance Contract: da-gui-tren-luoi

## Context

Màn Lưới thứ hai: Đã gửi (`/sent`) đọc 14 link mẫu trên khuôn Lưới dùng chung, theo mẫu Bảng hàng (hàng 2), với ngăn chi
tiết của quyết định 0024. Mục đích của hàng: chứng Lưới dùng lại được mà màn không thêm prop kiểu dáng. Dữ liệu mẫu (mã
phạm vi K4): không gửi thật (hàng 16), không lượt mở thật hay lưu khách (hàng 18), không trang khách (hàng 17). Hạng T3:
thêm khái niệm «Link đã gửi» (`ShareLink`) vào mô hình nghiệp vụ và `architecture/modules.yaml` (giám sát duyệt D-1311-2),
chạm `src/modules/sharing/**`, gỡ `sent` khỏi danh sách «chưa có vùng» của `tools/e2e_templates/` (D-1311-3), và sửa cột
đầu của Lưới dùng chung không cắt chữ dài (D-1311-4).

Luật sản phẩm: chạm SP-4 về phạm vi (`src/modules/sharing/ui/**` là thư mục dấu hiệu) — vùng nội bộ, không nhập liên hệ,
máy chủ danh tính hay nhãn vai; không chạm SP-1 (không truy vấn cơ sở dữ liệu), SP-3 (không nút gửi).

Source input: hàng `6` của `docs/plan/lo-trinh.json`, ô `_acceptance/da-gui-tren-luoi/opportunity.md` (build), lời giao
của giám sát đợt «nen», trang sổ bối cảnh `docs/tri-thuc/wiki/chu-de/da-gui-va-trang-khach.md`.

## Criteria

- AC-1: Given dữ liệu mẫu của hàng 1 (60 lần chào của sàn mẫu), When dựng link mẫu, Then có đúng 14 link cùng sàn mẫu, id
  mang nhãn MAU, tên người nhận bắt đầu bằng `[Tên]`, số căn của mỗi link bằng số lần chào trong link (có link 1 căn và
  link 30 căn, có link đã mở mà không quan tâm căn nào), quan tâm không quá số căn, link chưa mở không có lúc mở, link đã mở có lúc mở không sớm hơn lúc gửi; và
  When phá từng luật trên một bản sao, Then bộ kiểm luật báo đúng thông điệp của luật ấy.
- AC-2: Given Đã gửi ở trạng thái có dữ liệu, When trang sẵn sàng, Then đầu màn là «Đã gửi», vùng tên «Link đã gửi» có
  cột số dòng rồi sáu cột theo thứ tự Người nhận · Lượt mở · Quan tâm · Mở gần nhất · Gửi lúc · Số căn với nhãn lấy từ
  `ontology/labels.yaml`; 14 dòng mới gửi trước, chân bảng «14 dòng»; cột số canh phải; link chưa mở hiện «—» ở Mở gần
  nhất; và Given trạng thái trống, Then vùng nói vì sao trống và có «Mở Bảng hàng» dẫn tới `/inventory`.
- AC-3: Given bộ bài sinh từ sổ màn (hàng 1f), When chạy bộ khung và bộ vùng trên Đã gửi ở bốn khổ, Then màn không còn bị
  bỏ qua: bốn bài khung (đầu màn đúng nhãn, không cuộn ngang trang, không lỗi trình duyệt, axe sáng và tối) và bảy trạng
  thái vùng (đúng các ca vùng bộ bài có lúc chấm — ô tìm của vùng sẽ bỏ theo lời chốt 13/11, hàng 2e) đều xanh, mỗi ca
  phá đỏ với thông điệp ghim của nó trên chính Đã gửi; và danh sách «chưa có vùng»
  không còn `sent`, một bản sao thêm lại `sent` thì xếp loại Đã gửi đỏ «go khoi danh sach: sent».
- AC-4 (cross-layer): Given bản thật (`NODE_ENV=production`), When mở Đã gửi với `?state=` là `loading`, `empty`, `error`,
  `partial` hay `forbidden`, Then vùng ở trạng thái có dữ liệu; Given bản phát triển, When mở với từng tham số ấy, Then vùng
  ở đúng trạng thái ấy, và tham số lạ thì có dữ liệu; đo ở chính trang Đã gửi, không chỉ ở bộ đọc thuần.
- AC-5: Given Đã gửi có dữ liệu, When bấm tên người nhận của một link, Then ngăn chi tiết mở cạnh bảng với địa chỉ
  `?ho-so=<id link>`, tiêu đề là tên người nhận, sáu trường mang giá trị của đúng dòng ấy, và mục «Căn trong link» liệt
  đúng các căn của các lần chào trong link (số mục bằng số căn); «Đóng» trả tiêu điểm về dòng vừa mở.
- AC-6: Given vùng Đã gửi, When đọc mã của nó, Then vùng dựng bằng đúng khuôn Lưới (`DataRegion`) và chỉ truyền các prop
  mà Bảng hàng cũng dùng — không prop kiểu dáng (`className`, `style`, cỡ, màu), không lưới ReUI dựng ngoài khuôn; bài rào
  «màn tự dựng lại hành vi» và bước chấm khuôn của nhóm `luoi` xanh trên tệp của Đã gửi.
- AC-7: Given tệp chứng minh màn của hồ sơ này, When chạy lưới chứng minh màn, Then mục `## Màn sent` theo lối theo mẫu có
  Từ Quỹ hàng, Họ, ứng viên ReUI kèm ảnh, Ảnh cạnh màn mẫu ở bốn khổ (cùng bộ dữ liệu mẫu), Mặt so đủ mười hai mặt của họ
  Lưới không mặt nào «khác — vô cớ», và bảng Khối; lưới xanh; `design/patterns/luoi.md` không còn ngoại lệ của trang Đã gửi.
- AC-8: Given khái niệm mới «Link đã gửi», When chạy bộ kiểm mô hình, ngôn ngữ, ranh giới và sinh lại, Then thực thể có
  `companyId` bắt buộc, tên người nhận đánh dấu dữ liệu cá nhân, hai quan hệ (sàn giữ link, link gồm lần chào), mô-đun
  `sharing` sở hữu nó; bảy nhãn mới ghi là khái niệm riêng, nhãn ưu tiên duy nhất, không quá 17 ký tự, khớp bảng thuật
  ngữ; không tệp nào dưới `src/` gõ cứng các nhãn ấy; `make gen` không đổi tệp sinh; và không tệp nào dưới
  `src/modules/sharing/ui/` chạm dấu hiệu của SP-4.
- AC-9: Given Lưới dùng chung, When chữ ở cột đầu (chữ mở hồ sơ) dài hơn cột — tên người nhận dài ở Đã gửi, mã căn dài
  dựng thử ở Bảng hàng —, Then chữ bị cắt bằng dấu ba chấm trong ô, không đè sang ô bên, đọc đủ qua `title`, một lần bấm
  vào chữ vẫn mở hồ sơ, dòng không cao lên; và When bỏ chỗ sửa, Then bài kiểm đỏ với thông điệp ghim.
- AC-10: Given Đã gửi đang chạy, When nhìn ở bốn khổ với trạng thái có dữ liệu và với ngăn chi tiết mở, sáng và tối, Then
  thấy đầu màn, sáu cột đọc được (cuộn ngang trong vùng ở khổ hẹp), tên dài bị cắt gọn, trang không cuộn ngang, ngăn chi
  tiết không che thanh trên của App Shell. (judgment)

## Vai × Màn

Khung chưa gắn vai thật của người đăng nhập vào vùng (Bảng hàng cũng vậy); ô dưới là ý định cho dữ liệu thật của hàng 18.
Bản khai vai nói Quản trị sàn không thấy hàng theo mặc định, mà link mang lần chào.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| sent | được — thấy link mình đã gửi | được — thấy link mình đã gửi | được — thấy link cả đội đã gửi | chặn — vùng báo không đủ quyền; bảng quyền của hàng 18 quyết |

## Coverage

Quét bằng bộ quét hình thái, khuôn «entity-feature» (`_acceptance/da-gui-tren-luoi/coverage-scan.md`); chân ngành: theo dõi
link chia sẻ của DocSend và HubSpot Documents.

- Trục A — dạng link: chưa mở · đã mở, không quan tâm căn nào · có quan tâm · (Later) đã tắt hay hết hạn — hàng 17.
- Trục B — cỡ dữ liệu: 1 căn · 30 căn · tên người nhận dài · (Later) số đếm lớn — dữ liệu thật của hàng 18.
- Trục C — vai × phạm vi: bốn vai của bản khai; phạm vi thật là Later (bảng quyền của hàng 18).
- Trục D — vào và ra: dữ liệu mẫu · ngăn chi tiết · (Later) dữ liệu thật, sao chép hay gửi lại link · (Never) xuất bảng (L3).
- Cố định bởi `design/states.md` và `design/patterns/luoi.md`, không thành trục: trạng thái vùng (bảy trạng thái + bốn
  không áp: xung đột khi lưu, mất mạng khi lưu vì màn chỉ đọc; phiên hết hạn của khung; link hết hạn của trang khách),
  khổ 360 · 414 · 1024 · 1440 sáng · tối, môi trường phát triển · thật, chiều đo ca chính · ca phá.

Thước: AC-1 phủ trục A và B (ba dạng link, 1 và 30 căn, tên dài); AC-2 phủ trục A trên màn (ô «—» của link chưa mở); AC-5
phủ trục D (ngăn chi tiết) và B (30 căn); AC-9 phủ B (tên dài ở cột đầu); AC-3, AC-4, AC-7, AC-10 phủ phần cố định; Vai ×
Màn phủ trục C bằng ý định. [CE chưa kiểm chứng]: trục C chưa có phép đo — vai thật chưa nối vào vùng.

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng (sổ quyết định).

## Out of scope

- Không gửi link, không nút «Gửi căn», không chọn căn để gửi (hàng 16); không bảng chia sẻ của thiết bị.
- Không lượt mở thật, không lưu khách, không nối người nhận sang Liên hệ (hàng 18); không tắt link, không hạn link, không
  trang khách hay luật che (hàng 17, K2, K8).
- Không thao tác nào trên dòng hay ở đầu màn, không thêm dòng vào bảng quyền (`ontology/actions.yaml`).
- Không thẻ trên điện thoại (Hỏi-3): lưới cuộn ngang trong vùng như Bảng hàng.
- Không nhóm dòng, không cột người gửi, không trạng thái link.
- Không đọc cơ sở dữ liệu, không bảng mới, không bắt đăng nhập.
- Không chuyển luật đọc `?state=` lên lưới dùng chung (sổ quyết định, revisit khi 2c gộp).

## Notes

- Hỏi cho chủ kho ở Cổng Phạm vi: Hỏi-1 người nhận chưa nối Liên hệ · Hỏi-2 thứ tự cột · Hỏi-3 điện thoại · Hỏi-4 thêm
  khái niệm vào mô hình nghiệp vụ (`design.md`, mục «Câu hỏi cho chủ kho»).
- Bảng Vai × Màn là ý định như của Bảng hàng; ai được thấy tên người nhận (dữ liệu cá nhân) với dữ liệu thật do bảng
  quyền của hàng 18 quyết, không lấy bảng này làm lời duyệt (phản biện, P1).
- Thứ tự gộp: hàng 2c gộp trước; sửa lưới dùng chung (AC-9) làm sau cùng trên cây đã gộp main có 2c.
