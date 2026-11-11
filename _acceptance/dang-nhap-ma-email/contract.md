---
schema_version: 1
feature: Nhân viên sàn nhập mã gửi qua email và vào đúng sàn của mình
slug: dang-nhap-ma-email
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api, config]
screens: [sign-in, today, inventory, sent]
status: draft
approved_by:
approved_at:
design_doc: docs/superpowers/specs/2026-11-11-dang-nhap-ma-email-design.md
---

# Acceptance Contract: dang-nhap-ma-email

## Context

Hàng 8 của lộ trình (mã N2 đăng nhập bằng mã qua email, N6 menu tài khoản và đăng xuất), dựng trên hàng 7 (cách ly
mỗi sàn, cửa `withCompany`). Nhân viên gõ email, nhận mã 6 số qua thư, gõ mã và vào đúng sàn mình là thành viên; đầu
khung có menu tài khoản để đổi sàn và đăng xuất. Hàng này không quyết ai làm được gì trong sàn (vai, bảng quyền là hàng
9 và 9a). Luật chạm: SP-1 — bảng thành viên chỉ có luật lọc theo sàn; việc đọc tài khoản, mã, phiên đi qua vài hàm
hẹp gọi bên trong cửa; trình điều khiển Postgres chỉ nạp ở tệp cửa.

Source input: hàng 8 của `docs/plan/lo-trinh.json`, ô cơ hội `_acceptance/dang-nhap-ma-email/opportunity.md` đã quyết
«build» bởi Manh Phan. Số của đăng nhập theo khuyến nghị Hỏi-2 (giữ số của Quỹ hàng): mã 6 chữ số, hết hạn 5 phút,
sai 3 lần thì hỏng, 5 lần xin trong 15 phút, phiên 30 ngày trượt theo ngày dùng.

## Criteria

- AC-1: Given ba email — một có tài khoản thuộc ít nhất một sàn, một có tài khoản không thuộc sàn nào, một không có
  tài khoản — When mỗi email xin mã, Then cả ba nhận đúng một câu trả lời và mã trạng thái như nhau; chỉ email thứ nhất
  được gửi đúng một thư mang mã 6 chữ số; và ở bản thật thiếu khoá gửi thư, địa chỉ gửi, khoá bí mật hay địa chỉ cơ
  sở dữ liệu thì máy chủ không khởi động (nêu tên biến thiếu), còn đường xin mã nếu bị gọi thì trả lỗi máy chủ, không
  thư nào gửi và mã không xuất hiện trong nhật ký.
- AC-2: Given người thuộc đúng một sàn đã xin mã, When gõ đúng mã lấy từ chính thư vừa gửi, trong 5 phút, Then máy chủ
  tạo phiên, đặt cookie phiên chỉ máy chủ đọc được, phiên gắn sàn ấy, và người về trang định mở (hoặc trang Hôm nay)
  với tên sàn trên menu tài khoản. (cross-layer)
- AC-3: Given một mã đang sống, When người gõ mã sai, gõ sai lần thứ ba rồi gõ mã đúng, gõ mã đã hết hạn, gõ lại mã đã
  dùng, gõ mã cũ sau khi xin mã mới, hoặc gõ mã cho một email lạ, Then mọi trường hợp đều bị từ chối với cùng một mã lỗi
  và cùng một câu, không phiên nào được tạo; mã mới (sau khi xin lại) vẫn dùng được.
- AC-4: Given một email đã xin mã 5 lần trong 15 phút (email có tài khoản hay email lạ như nhau), When xin lần thứ sáu,
  Then máy chủ trả «quá giới hạn» (429), không thư nào gửi và lần bị từ chối không kéo dài cửa sổ đếm.
- AC-5: Given người thuộc hai sàn A, B và một sàn C người không thuộc, When người gõ đúng mã, Then màn mời chọn sàn liệt
  kê đúng A và B; chọn A thì phiên gắn A; gửi yêu cầu chọn C bị từ chối là «không phải thành viên» và phiên không đổi
  sàn; menu tài khoản đổi được sang B; và người bị gỡ khỏi mọi sàn sau khi xin mã mà gõ đúng mã thì nhận «chưa thuộc
  sàn nào», không phiên nào được tạo, không cookie nào được đặt. (cross-layer)
- AC-6: Given phiên gắn sàn A, When một truy vấn của sàn chạy qua cửa với người và sàn đọc từ phiên, Then nó chỉ thấy
  dữ liệu của A; và khi người bị gỡ khỏi A sau khi đăng nhập, lần đọc phiên kế không còn sàn nào. (cross-layer)
- AC-7: Given một phiên, When người dùng lại sau hơn một ngày, Then hạn dời về «bây giờ + 30 ngày»; When phiên đã quá
  hạn hay cookie là chuỗi bịa, Then máy chủ coi như chưa đăng nhập (401 ở đường cần phiên) và màn `/login?next=<trang>`
  đưa người về đúng trang ấy sau khi đăng nhập lại. (cross-layer)
- AC-8: Given người đã đăng nhập, When mở menu tài khoản trên khung, Then thấy tên, email, sàn đang làm, «Đổi sàn» chỉ
  khi thuộc từ hai sàn, và «Đăng xuất»; bấm «Đăng xuất» thì phiên bị xoá ở máy chủ, cookie bị xoá, người về `/login`,
  và gửi lại cookie cũ thì máy chủ coi như chưa đăng nhập. Chưa đăng nhập thì chỗ menu là nút «Đăng nhập». (cross-layer)
- AC-9: Given cơ sở dữ liệu đã áp migration của hàng này, When chạy bộ kiểm cách ly của hàng 7 và bài kiểm cơ sở dữ
  liệu của hàng này, Then bộ kiểm cách ly xanh với bảng thành viên trong tập bảng của sàn; vai của API không đọc, ghi
  thẳng được bảng nào của schema danh tính; mã và mã phiên chỉ nằm dạng băm; vai riêng của các hàm danh tính không đăng
  nhập được, không sở hữu bảng nào của public và chỉ có quyền đọc hai bảng sàn; mỗi hàm hẹp không trả email hay sàn
  của người khác; và trình điều khiển Postgres chỉ được nạp ở tệp cửa.
- AC-10: Given màn `/login` ở bốn khổ 360, 414, 1024, 1440, sáng và tối, When người đi trọn luồng, Then ô email cho
  trình duyệt tự điền, ô mã là một ô nhận dán cả chuỗi (có dấu cách hay gạch) và cho điện thoại tự điền mã, Enter gửi
  bước đang mở, mỗi trạng thái của bảng trạng thái hiện đúng câu của nó, và kiểm tra khả năng tiếp cận (axe) không có
  lỗi.

## Coverage

Quét không gian bằng morphological-scan (preset entity-feature cộng risk-premortem). Chân sản phẩm: lộ trình, bản phạm
vi MVP đợt 1, sổ hành vi, sổ trạng thái, ADR-0005 của Quỹ hàng. Chân ngành: [NGÀNH: NIST SP 800-63B — xác thực ngoài
kênh, giới hạn thử], [NGÀNH: OWASP Authentication Cheat Sheet — trả lời đồng nhất cho email lạ, cookie phiên], [NGÀNH:
Slack — đăng nhập bằng mã gửi qua email].

- Trục bước luồng: xin mã | đổi mã lấy phiên | chọn sàn | dùng phiên | đăng xuất [thước CE: bản phạm vi N2 + N6] →
  AC-1, AC-2, AC-5, AC-6/AC-7, AC-8.
- Trục trạng thái người: email lạ | tài khoản không sàn | một sàn | nhiều sàn | bị gỡ khỏi mọi sàn giữa lúc xin mã
  và gõ mã | bị gỡ khỏi sàn sau khi đăng nhập [thước CE: ngành OWASP + ADR-0005 §4, §5] → AC-1, AC-2, AC-5, AC-5, AC-6.
- Trục tình huống mã: đúng | sai | sai lần ba | hết hạn | đã dùng | bị thay bởi mã mới | email lạ | xin quá giới hạn
  [thước CE: ngành NIST SP 800-63B §5.1.3] → AC-3, AC-4.
- Trục lớp giữ luật: cơ sở dữ liệu (luật theo dòng, hàm hẹp, băm) | đường `/api/v1/auth` | màn | khung → AC-9, AC-1..AC-8,
  AC-10, AC-8.
- [GIẢ ĐỊNH] Năm số của đăng nhập giữ như Quỹ hàng — chờ Hỏi-2.
- Ô bỏ có tên: bắt đăng nhập ở màn dữ liệu mẫu (Hỏi-3, Out of scope); đăng nhập thay người, mật khẩu, số điện thoại
  (Out of scope); thu mọi phiên khi khoá người (hàng N8).

## Vai × Màn

Đăng nhập là của mọi vai; menu tài khoản nằm trên khung nên chạm mọi màn nội bộ. Hàng này không quyết vai nào vào màn
nào (bảng quyền 9a).

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| sign-in | được — mọi vai đăng nhập cùng một màn | được — mọi vai đăng nhập cùng một màn | được — mọi vai đăng nhập cùng một màn | được — mọi vai đăng nhập cùng một màn |
| today | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai |
| inventory | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung; quyền thấy hàng là của 9a |
| sent | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung, như mọi vai | được — menu tài khoản trên khung; quyền thấy hàng là của 9a |

## Out of scope

- Bắt đăng nhập ở Hôm nay, Bảng hàng, Đã gửi (dữ liệu mẫu): hàng N5 làm cùng lúc CI có Postgres (Hỏi-3).
- Mời người, gán vai, ghi thành viên sàn qua API (hàng 9); bảng quyền (9a); khoá người và thu phiên (N8).
- Mật khẩu, đăng nhập bằng số điện thoại hay Google, đăng nhập thay người.
- Mở sàn và tài khoản đầu tiên của sàn thật: giữ lối vận hành hiện tại; hàng này chỉ có hàm nạp dữ liệu cho bài kiểm.
- Chạy bài kiểm cơ sở dữ liệu và bài trình duyệt có cơ sở dữ liệu trên CI: cần job có Postgres ở `.github/workflows/`,
  việc của người.
- Gửi thư thật trong bài kiểm: chủ kho nhận mã thật qua một yêu cầu `can-nguoi` ở Cổng Bằng chứng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ô cơ hội không khai ngưỡng nghiệm thu và chủ kho dời nghiệm thu giá trị tới cuối lộ trình; hàng này không có mục
  Đường đo.
- Đổi ontology — chủ kho soi: thêm hai nhãn hành động riêng «Đăng nhập» (`SignIn`) và «Đăng xuất» (`SignOut`) vào
  `ontology/labels.yaml` cho tiêu đề màn đăng nhập trong sổ màn và nút trên khung (đã xin giám sát, N-1111-4). Không
  thêm thực thể: tài khoản, phiên, mã là phần kỹ thuật của mô-đun danh tính; thành viên sàn có vai là của hàng 9.
- Thêm gói `pg` vào `package.json` và `package-lock.json` (giám sát duyệt N-1111-3). Các dãy khác chạy cài lại sau khi
  hàng này gộp.
