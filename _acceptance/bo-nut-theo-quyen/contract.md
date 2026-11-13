---
schema_version: 1
feature: Người dùng ở vai nào cũng thấy bộ nút thêm, sửa, gỡ đặt cùng một chỗ trên mọi màn và chỉ thấy nút mình được dùng theo bảng quyền
slug: bo-nut-theo-quyen
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui, api]
screens: []
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-12T13:32:50Z
design_doc: _acceptance/bo-nut-theo-quyen/design.md
---

# Acceptance Contract: bo-nut-theo-quyen

## Context

Hàng 9e của lộ trình. Bảng quyền và hàm `allowedScope` của hàng 9a đã có nhưng chưa nút nào đọc; Quỹ hàng chỉ thấy lỗi bộ nút
khi chạy thử (bốn cách gắn quyền, nút hiện rồi máy chủ từ chối, cùng việc đặt khác chỗ). Hàng này dựng khuôn: luật chỗ đặt,
một thành phần chung mọi nút thao tác đi qua, bộ kiểm đỏ khi nút đi đường khác, dòng nháp của bảng quyền cho thêm và gỡ căn,
liên hệ, bảng vai × màn tới cấp nút, và chuyển thanh bên cùng màn Thành viên sang đọc bảng quyền. Người dùng là mọi nhân viên
sàn, trên máy tính và điện thoại.

Source input: ô cơ hội `_acceptance/bo-nut-theo-quyen/opportunity.md` (chủ kho quyết «build» 2026-11-12), quyết định
`wiki/decisions/0016-permission-model.md` và `0023-chon-truoc-tao-sau.md`, bảng quyền `ontology/actions.yaml`, bản rà của
giám sát `.acceptance-runs/dieu-phoi-nen/trinh/bo-nut-theo-quyen-ra-soat.md`, thiết kế `design.md`, bản bấm được
`/proto/bo-nut-theo-quyen`.

Luật sản phẩm chạm: SP-1 (bảng quyền đọc qua cửa của mô-đun danh tính; không truy vấn mới). Không chạm SP-3, SP-4.

## Criteria

- AC-1: Given sổ thiết kế `design/behaviors.md`, When người đọc mục «Bộ nút theo quyền», Then mục nói chỗ đặt của nút thêm
  thứ chính của màn, nút của vùng, thao tác trên một dòng và thao tác trong hồ sơ, cho máy tính và cho điện thoại, thứ tự
  trong «…» (việc gỡ sau cùng, tách vạch, chữ đỏ, luôn qua hộp xác nhận) và cách xử nút không có quyền — đúng các lựa chọn
  chủ kho chốt ở Cổng Phạm vi. (judgment)
- AC-2: Given một thao tác của bảng quyền, một tập vai và bản ghi là của người xem hay của người khác, When thành phần chung
  `PermittedAction` quyết nút, Then nút hiện khi phạm vi là toàn sàn hoặc bản ghi là của người xem với phạm vi của tôi; nút
  ẩn khi không vai nào có ô; dòng của người khác với phạm vi của tôi theo đúng một cách đã chốt — đo trên mọi tổ hợp bốn vai
  × mọi thao tác của bảng × hai loại bản ghi.
- AC-3: Given một tệp giao diện gửi yêu cầu ghi mà không dựng nút qua `PermittedAction`, hoặc khai tên thao tác không có
  trong bảng quyền, hoặc viết cứng tên vai để ẩn hiện, When `make check` chạy, Then bộ kiểm đỏ và in tên tệp cùng luật bị
  phạm; tệp đi đúng đường thì xanh.
- AC-4: Given «…» của một dòng hay của hồ sơ, When người xem mở nó, Then việc thường đứng trước, việc gỡ đứng sau cùng, tách
  bằng một vạch, chữ đỏ; «…» không còn việc nào thì không hiện; trên điện thoại «…» nằm cuối thẻ của dòng.
- AC-5: Given một việc gỡ, When người bấm nó trong «…», Then hộp xác nhận theo kiểu chủ kho chốt mở ra, focus đầu ở «Huỷ»,
  Esc là Huỷ, nút xác nhận mang đúng động từ và danh từ của việc; Huỷ không gửi gì.
- AC-6: Given máy chủ trả 403 cho một việc người đã bấm (bảng quyền hay vai vừa đổi), When giao diện nhận lỗi, Then người
  thấy câu «không đủ quyền» riêng, khác câu lỗi chung, kèm lời bảo tải lại, và trang làm mới bộ nút — đo thật trên hộp mời
  và hộp đổi vai của màn Thành viên với một phiên không còn vai Quản trị sàn. (cross-layer)
- AC-7: Given thanh bên và màn Thành viên, When người giữ một tập vai bất kỳ mở ứng dụng, Then mục Thành viên và màn Thành
  viên hiện khi và chỉ khi bảng quyền cho tập vai ấy `listMembers`; mã ở `src/app/**` không còn so tên vai; đổi ô
  `listMembers` trong bảng quyền thì thanh bên và màn theo ngay, không sửa mã. (cross-layer)
- AC-8: Given bảng quyền `ontology/actions.yaml`, When `make gen` và `make ontology` chạy, Then bảng có các dòng nháp
  (trạng thái planned) cho xoá căn, xem, thêm, sửa, xoá, gộp liên hệ và xoá tên, số của liên hệ theo yêu cầu, với chữ trên
  nút theo lựa chọn Hỏi-1 (động từ thường) và ô phạm vi của liên hệ theo lựa chọn Hỏi-6 (thông lệ CRM) ghi ở dòng sổ gate1;
  Quản trị sàn không có ô ở các dòng ấy; mã sinh khớp bảng.
- AC-9: Given bảng quyền và các nút đã khai trên từng màn, When lệnh sinh bảng vai × màn chạy, Then mỗi màn × vai liệt đúng
  các nút hiện kèm phạm vi; đổi một ô của bảng quyền thì bảng sinh đổi theo; tệp sinh lệch bảng quyền thì `make check` đỏ.
- AC-10: Given mẫu chạy của khuôn `/proto/bo-nut-theo-quyen`, When xem dưới bốn vai ở 360 và 1440, sáng và tối, Then bộ nút
  hiện đúng như bảng vai × màn sinh ra, chỗ đặt đúng luật AC-1, và bài axe không có vi phạm.

## Coverage

Thước đối chiếu: bốn vai `ontology/roles.yaml`; mọi dòng của `ontology/actions.yaml`; bốn chỗ đặt của bản rà Quỹ hàng (đầu màn,
vùng, dòng, hồ sơ); `design/states.md` dòng «Không đủ quyền». Quét tại chỗ theo trục (morphological), không chạy skill riêng
vì không gian đã khép bởi bảng quyền và bốn chỗ đặt.

- Trục loại việc: thêm (AC-1, AC-8) | sửa (AC-2, AC-4) | gỡ theo nghĩa 0016 (AC-4, AC-5, AC-8) | việc khác như gộp (AC-4, AC-8).
- Trục chỗ đặt: đầu màn | đầu vùng | dòng | hồ sơ (AC-1, AC-4, AC-10).
- Trục khổ: máy tính | điện thoại (AC-1, AC-4, AC-10).
- Trục quyền: toàn sàn | của tôi trên bản ghi của mình | của tôi trên bản ghi người khác | không có ô (AC-2, AC-7, AC-10).
- Trục đường đi: giao diện quyết (AC-2) | máy chủ từ chối (AC-6) | mã đi đường khác (AC-3).
- Trục nguồn sự thật: bảng quyền → nút (AC-2) → bảng vai × màn (AC-9) → thanh bên và màn (AC-7).
- Later: sửa hàng loạt và thanh hàng loạt (cắt khỏi MVP, H7); trang «Vai nào làm được gì» (hàng 19a); kiểm từng vai trên
  từng màn bằng trình duyệt (hàng 9b); Nhóm (phạm vi thứ ba của 0016, ngoài MVP).

## Vai × Màn

Hợp đồng không khai màn sản phẩm (sửa sau Cổng Phạm vi, giám sát duyệt ở V-1211-8): hàng này dựng khuôn bộ nút và đổi hành vi
nút, câu từ chối trên màn Thành viên; chứng minh họ màn Thành viên là của hàng 9c. Trạng thái đích của màn Thành viên, nay
viết thành câu thay cho bảng: Đầu chủ, Đầu khách và Trưởng nhóm bị chặn — không có ô `listMembers`, mục không có trên thanh
bên; Quản trị sàn được — xem (`listMembers`), nút Mời (`inviteMember`), nút Đổi vai (`changeMemberRoles`), toàn sàn. Từ AC-9
bảng này sinh từ bảng quyền.

## Đường đo

Bỏ — xem dòng sổ «bỏ đường-đo»: chủ kho dời nghiệm thu giá trị tới cuối lộ trình MVP; ô cơ hội chỉ có ngưỡng đề xuất là
chính các tiêu chí trên.

## Out of scope

- Không dựng chức năng thêm căn, gỡ căn, thêm hay gỡ liên hệ thật: hàng 12, 18b và màn Liên hệ; các hàng ấy khai tên thao
  tác và đặt nút theo luật này.
- Không mở cửa API hay luật cơ sở dữ liệu cho các dòng nháp: hàng mở cửa quyết lại từng ô và chuyển dòng sang live.
- Không sửa hàng loạt, không thanh hàng loạt, không chọn nhiều dòng: đã cắt khỏi MVP (H7).
- Không làm trang «Vai nào làm được gì»: hàng 19a.
- Không kiểm từng vai trên từng màn sản phẩm bằng trình duyệt: hàng 9b; ở đây đo trên mẫu chạy của khuôn và màn Thành viên.
- Không chọn lại màn Thành viên từ ReUI: hàng 9c.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Notes

- Trình tự: S3 chỉ bắt đầu khi hàng 2a và hàng 3 đã ở nhánh chính; khi đó gộp `origin/main` một lần rồi mới dựng.
- Đổi `ontology/**` (dòng nháp, nhãn nút, câu «không đủ quyền») phải xin giám sát bằng yêu cầu chạm tệp; PR có mục «Đổi
  ontology — chủ kho soi».
- Known limits — chọn ở Cổng Bằng chứng 2026-11-13:
  - Ngoài-1: Hai dòng sổ quyết định của vòng từng sai cú pháp; đã sửa, chữ giữ nguyên.
  - Ngoài-2: Dòng sổ quyết định 33 từng sai cú pháp; đã sửa, chữ giữ nguyên.
  - Ngoài-3: Bài kiểm mục Thành viên trên thanh bên dựng lại mục bằng cách đọc mã thay vì lấy mục thật, nên kém nhạy khi đổi cách khai mục.
  - Ngoài-4: Màn nào quên khai bản ghi là của ai thì nút việc «của tôi» hiện cả trên bản ghi người khác; máy chủ vẫn từ chối.
  - Ngoài-5: Trang mẫu bộ nút dùng tên trường chuẩn RESO cho nghĩa khác (người giữ, người tạo).
  - Ngoài-6: Trang mẫu bộ nút giữ bản riêng danh sách bốn vai, có thể cũ khi vai đổi.
  - Ngoài-7: Bài kiểm chỉ đo nút chính của hồ sơ biến mất khi không quyền, chưa đo nó hiện khi có quyền.
  - Ngoài-8: Bài kiểm chưa đo việc ai cũng làm được vẫn còn trong «…» trên bản ghi người khác.
  - Ngoài-9: Bài kiểm vai không được xem chỉ đo không có «…», chưa đo câu «không đủ quyền» hiện ra.
  - Ngoài-10: Bài kiểm mục Thành viên dựng lại mục thanh bên từ mã nguồn thay vì mục thật.
  - Ngoài-11: Bài kiểm câu từ chối so với câu lỗi chung viết tay, nên đổi chữ câu lỗi chung thì bài cần sửa một dòng.
