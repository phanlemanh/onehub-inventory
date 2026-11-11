---
schema_version: 1
feature: Quản trị sàn mời người vào sàn và gán một trong bốn vai
slug: moi-nguoi-gan-vai
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api, config]
screens: [members]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-11
design_doc: docs/superpowers/specs/2026-11-11-moi-nguoi-gan-vai-design.md
---

# Acceptance Contract: moi-nguoi-gan-vai

## Context

Hàng 9 của lộ trình (mã N3), dựng trên hàng 8 (đăng nhập bằng mã email) và hàng 1d (bốn vai, một người giữ nhiều vai).
Quản trị sàn mở màn Thành viên, mời một người bằng email và tên, chọn ít nhất một trong bốn vai (Đầu chủ, Đầu khách,
Trưởng nhóm, Quản trị sàn), và đổi vai người đã ở sàn. Người được mời đăng nhập bằng mã email như hàng 8. Hàng này chỉ
giữ một luật quyền: chỉ Quản trị sàn quản trị người; mọi quyền khác là bảng quyền của hàng 9a.

Luật chạm: SP-1 (bốn hàm hẹp mới của vai danh tính; tên trong sàn tách theo sàn; mời email đã có ở sàn khác không để lộ
điều đó), SP-3 (thư mời chỉ đi khi quản trị bấm «Mời»). Source input: hàng 9 của `docs/plan/lo-trinh.json`, ô cơ hội
`_acceptance/moi-nguoi-gan-vai/opportunity.md` đã quyết «build» bởi Manh Phan.

## Criteria

- AC-1: Given Quản trị sàn của sàn A đã đăng nhập, When mời một email chưa có tài khoản với tên và tập vai {Đầu chủ,
  Trưởng nhóm}, Then danh sách của A có người ấy với đúng tên, email, hai vai, người mời và lúc mời; và email ấy xin mã,
  gõ mã trong thư thì vào thẳng sàn A với đúng hai vai ấy. (cross-layer)
- AC-2: Given quản trị bấm «Mời» thành công, Then đúng một thư mời đi tới email người được mời, nêu tên sàn A, tên người
  mời, các vai và đường tới trang đăng nhập, không chứa mã đăng nhập; When lần mời bị từ chối (sai dữ liệu, đã ở sàn,
  không đủ quyền) Then không thư nào đi; When gửi thư hỏng Then không ai được thêm vào sàn và quản trị thấy lỗi kèm
  «Thử lại».
- AC-3: Given một email đã có tài khoản thuộc sàn B với tên «[Tên] B», When quản trị sàn A mời email ấy với tên «[Tên]
  A», Then phản hồi giống hệt từng byte phản hồi khi mời một email mới (khác id), A thấy tên «[Tên] A», danh sách của B
  vẫn ghi «[Tên] B», và người ấy đăng nhập thì chọn được cả A và B.
- AC-4: Given quản trị sàn A, When mời một email đã ở A, hoặc gửi email sai khuôn, tên trống, tập vai rỗng, vai ngoài bốn
  vai hay vai lặp, Then máy chủ từ chối (409 `already-member` hoặc 400 `bad-request`), không dòng thành viên hay tài
  khoản nào được thêm, không thư nào đi; cơ sở dữ liệu cũng từ chối tập vai rỗng hay sai khi ghi thẳng bằng vai chủ.
- AC-5: Given sàn A có hai quản trị P và Q và một Đầu khách R, When P đổi vai R thành {Đầu chủ, Trưởng nhóm}, Then danh
  sách và lần đọc vai kế của R đều ra đúng tập mới; When P bỏ vai Quản trị sàn của Q rồi của chính P, Then lần đầu được,
  lần sau bị từ chối 409 `last-admin` và vai của P không đổi. (cross-layer)
- AC-6: Given người của A chỉ giữ Đầu chủ, Đầu khách hay Trưởng nhóm, người chưa đăng nhập, và người đăng nhập chưa chọn
  sàn, When gọi đường xem danh sách, mời hay đổi vai, Then đường trả 403 `forbidden` (ba vai) hay 401 `unauthenticated`
  (hai trường hợp sau), không gì đổi, không thư nào đi; màn `/members` hiện Không đủ quyền không kèm tên hay số người
  nào (người chưa đăng nhập về `/login?next=/members`); và mục «Thành viên» trên thanh bên chỉ hiện cho người giữ vai
  Quản trị sàn. (cross-layer)
- AC-7: Given hai sàn A và B, When quản trị A gọi đổi vai với id một người chỉ thuộc B, hay gọi các hàm hẹp với sàn của
  phiên là A, Then đổi vai trả 404 `not-member` và người ấy ở B không đổi; danh sách của A không có ai của B; và trên
  lược đồ đã áp migration của hàng này, bộ kiểm cách ly hàng 7 xanh, vai API không có quyền ghi thẳng bảng thành viên
  hay đọc schema danh tính, và mỗi hàm hẹp mới chỉ đọc, ghi sàn của phiên.
- AC-8: Given `ontology/roles.yaml` khai bốn vai, When so tập vai mà cơ sở dữ liệu nhận, tập vai đường mời nhận và tập ô
  chọn trên màn, Then cả ba bằng đúng bốn vai ấy theo cùng thứ tự, nhãn lấy từ bảng nhãn; và dòng thành viên có sẵn
  trước migration nhận vai Quản trị sàn.
- AC-9: Given màn `/members` ở bốn khổ 360, 414, 1024, 1440, sáng và tối, When quản trị đi trọn luồng mời và đổi vai,
  Then mỗi trạng thái của bảng trạng thái trong đặc tả UX hiện đúng câu của nó, hộp thoại đi được bằng bàn phím (Enter
  gửi, Esc đóng và trả tiêu điểm), và kiểm tra khả năng tiếp cận (axe) không có lỗi.

## Coverage

Quét không gian bằng morphological-scan (preset entity-feature cộng risk-premortem). Chân sản phẩm: lộ trình hàng 9,
quyết định 0016, bản khai vai `ontology/roles.yaml`, migration 002 và quyết định 0021. Chân ngành: [NGÀNH: Slack — mời
thành viên bằng email, vai trong workspace], [NGÀNH: GitHub Organizations — mời thành viên, tổ chức luôn giữ ít nhất
một owner], [NGÀNH: OWASP Authentication Cheat Sheet — trả lời đồng nhất để không lộ tài khoản đã có].

- Trục thao tác: xem danh sách | mời | đổi vai [thước CE: lời giao hàng 9 + ngành Slack] → AC-1, AC-1/AC-2/AC-3/AC-4,
  AC-5. Gỡ người, huỷ lời mời, gửi lại thư: Later (Out of scope).
- Trục người được mời: email mới | có tài khoản ở sàn khác | đã ở sàn này | dữ liệu sai [thước CE: ngành OWASP + bảng
  thành viên của migration 002] → AC-1, AC-3, AC-4, AC-4.
- Trục người làm: Quản trị sàn | ba vai còn lại | chưa đăng nhập | chưa chọn sàn | quản trị sàn khác [thước CE: quyết
  định 0016 + màn chọn sàn của hàng 8] → AC-1, AC-6, AC-6, AC-6, AC-7.
- Trục tập vai: một vai | nhiều vai | bỏ quản trị cuối cùng | rỗng hoặc ngoài bốn vai [thước CE: `ontology/roles.yaml`
  + ngành GitHub] → AC-1, AC-1/AC-5, AC-5, AC-4/AC-8.
- Lớp giữ luật: cơ sở dữ liệu (ràng buộc, hàm hẹp, cách ly) | đường `/api/v1/members` | màn và thanh bên | thư → AC-4,
  AC-7, AC-8 | AC-1..AC-7 | AC-6, AC-9 | AC-2.
- [GIẢ ĐỊNH] Một sàn MVP có vài chục người — bảng không có tìm, lọc, chia trang.

## Vai × Màn

Màn Thành viên chỉ của Quản trị sàn ở hàng này. Thanh bên của khung (không phải một màn trong sổ) đổi theo vai của phiên:
thêm mục «Thành viên» cho Quản trị sàn, ba vai còn lại không thấy mục ấy (AC-6). Vai nào thấy dữ liệu gì trên Hôm nay,
Bảng hàng, Đã gửi là việc của bảng quyền 9a.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| members | chặn — thấy Không đủ quyền, không lộ người | chặn — thấy Không đủ quyền, không lộ người | chặn — thấy Không đủ quyền, không lộ người | được — xem, mời, đổi vai |

## Out of scope

- Gỡ người khỏi sàn, khoá người, huỷ lời mời chưa dùng, gửi lại thư mời, trạng thái «đã vào hay chưa»: hàng 18a và việc
  tách «người hết sàn kẹt ở màn chọn sàn» chủ kho đã chọn làm riêng.
- Bảng quyền theo vai cho mọi thao tác khác (hàng 9a); trang chỉ đọc «Vai nào làm được gì» (hàng 19a).
- Nhãn vai riêng của từng sàn (cấu hình sàn): chờ điều kiện có sàn thứ hai (quyết định 0016).
- Mở sàn mới và quản trị đầu tiên của sàn thật: giữ lối vận hành của hàng 8.
- Tìm, lọc, chia trang danh sách thành viên.
- Gửi thư thật trong bài kiểm: chủ kho nhận một thư mời thật qua một yêu cầu `can-nguoi` ở Cổng Bằng chứng.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Ô cơ hội không khai ngưỡng nghiệm thu và chủ kho dời nghiệm thu giá trị tới cuối lộ trình; hàng này không có mục Đường
  đo.
- Đổi ontology — chủ kho soi: thêm thực thể `Member` (RESO 2.1 Member, `companyId` bắt buộc, thuộc mô-đun `identity`),
  nhãn thực thể «Thành viên», nhãn màn và hai nhãn hành động «Mời người» (`Invite`), «Đổi vai» (`ChangeRoles`) — theo
  Hỏi-2; đã xin giám sát.
- Lối vận hành mở sàn và quản trị đầu tiên (ngoài phạm vi) phải điền thêm vai và tên trong sàn khi thêm dòng thành viên
  sau migration này; câu lệnh mẫu của yêu cầu thử tay hàng 8 cập nhật theo.
- Migration mới `003_moi_nguoi_gan_vai.sql` viết trong kho này theo bổ sung 2026-11-11 của quyết định 0008; số đổi nếu
  `origin/main` đã có 003 lúc gộp.
