---
schema_version: 1
feature: Nhân viên sàn làm việc trong một App Shell chọn từ ReUI Pro, giữ đủ thanh bên theo vai, băng báo và các trạng thái toàn trang đang có
slug: app-shell-chon-tu-reui
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: [proto]
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-11T14:19:02Z
design_doc: _acceptance/app-shell-chon-tu-reui/design.md
---

# Acceptance Contract: app-shell-chon-tu-reui

## Context

App Shell hiện có là thanh bên shadcn mở rộng, ghép tay khi kho còn rỗng. Quyết định 0023 đòi chọn trước, tạo sau: lần
đầu của App Shell bắt đầu ở ReUI. Chủ kho chốt ngày 11/11/2026 dùng khối `app-shell-8`, giữ cả hai cột; các phần còn lại
quyết trên bản bấm được `/proto/app-shell`. Hàng này thay App Shell của mọi màn trong nhóm `(app)` bằng bản đã xếp từ
`app-shell-8`, giữ các phần kho đã có (băng báo, trạng thái toàn trang, đổi sáng tối, menu tài khoản, lối nhảy tới nội
dung, lọc thanh bên theo mọi vai). Người dùng là nhân viên sàn, trên máy tính và điện thoại.

Source input: hàng 1o của `docs/plan/lo-trinh.json` · ô cơ hội `_acceptance/app-shell-chon-tu-reui/opportunity.md`
(chủ kho gõ build) · `wiki/decisions/0023-chon-truoc-tao-sau.md` · Quỹ hàng `docs/design/vo-va-ia.md` mục 1, ADR-0002,
hồ sơ đã ký `vo-ung-dung`.

Các tiêu chí dưới viết theo phương án máy khuyên cho năm câu hỏi của Cổng Phạm vi (design.md). Chủ kho chọn khác thì
tiêu chí tương ứng đổi lời trước khi duyệt.

## Criteria

- AC-1: Given khổ 1024 và 1440, sáng và tối, When mở Hôm nay, Bảng hàng hay Đã gửi, Then App Shell có cột biểu tượng
  (dấu OneHub ở đầu, mỗi màn một biểu tượng có tên đọc được và chú thích khi rê chuột), cột thứ hai và thanh trên;
  biểu tượng của màn đang mở mang `aria-current="page"`; bấm biểu tượng khác thì mở màn đó trong cùng App Shell.
- AC-2: Given người giữ một, hai, ba hoặc bốn vai, When App Shell dựng, Then cột biểu tượng hiện đúng các mục của mọi vai
  người ấy giữ, mỗi mục một lần, theo thứ tự khai — cùng luật lọc của hàng 1i; trên điện thoại ngăn trượt hiện cùng
  danh sách ấy.
- AC-3: Given khổ máy tính, When mở từng màn, Then cột thứ hai hiện mục của màn ấy theo Hỏi-1 (khuyên: Bảng hàng có
  «Tất cả hàng» và lối tắt theo từng trạng thái hàng lấy nhãn từ `ontology/labels.yaml`, chưa mang số đếm, bấm vào
  mở Bảng hàng; Đã gửi có «Tất cả link»; Hôm nay nói chưa có mục con); bấm tay nắm thì cột gập, màn chiếm chỗ của
  cột, bấm lại thì mở; tải lại trang vẫn giữ đúng mở hay gập.
- AC-4: Given khổ máy tính, When nhìn thanh trên, Then có tên sàn đang làm theo Hỏi-4 (khuyên: ở đầu thanh trên; người
  thuộc nhiều sàn bấm vào thì đổi sàn bằng đúng lối đổi sàn của menu tài khoản), nút đổi giao diện và menu tài khoản
  của kho; không có nút tạo chung, không có bộ chọn ứng dụng hay môi trường; ô gõ mã căn và chuông theo Hỏi-2, Hỏi-3
  (khuyên: chưa có); chọn sàn thứ hai thì phiên chuyển sang sàn ấy — tải lại trang vẫn ở sàn mới và người dùng
  chỉ thấy dữ liệu của sàn mới, đo trên màn Thành viên (màn duy nhất đang đọc dữ liệu thật theo sàn). (cross-layer)
- AC-5: Given khổ 360 và 414, sáng và tối, When mở mỗi màn, Then không có cột nào chiếm màn, trang không cuộn ngang;
  theo Hỏi-5 (khuyên: thanh bên thu gọn) nút mở thanh bên ở thanh trên mở ngăn trượt có cột biểu tượng và cột thứ hai
  của màn đang mở; chọn một mục thì ngăn đóng và màn mới hiện.
- AC-6: Given App Shell mới, When nhấn Tab lần đầu, mất mạng, lưu hỏng hay màn gặp lỗi, không tìm thấy, hết phiên, Then
  lối nhảy tới nội dung, băng báo trên màn và trạng thái toàn trang là đúng các phần của kho (cùng chữ, cùng hành vi như
  trước hàng này), hiện trong vùng màn, và App Shell vẫn đứng quanh để người đi tiếp.
- AC-7: Given cây sau hàng này, When chạy bộ bài kiểm chung sinh từ sổ màn và bài axe, Then mọi màn đang có (Hôm nay,
  Bảng hàng, Đã gửi, và các màn nội bộ khác trong sổ màn) qua ở bốn khổ 360, 414, 1024, 1440, sáng và tối, không lỗi trợ
  năng mức nghiêm trọng.
- AC-8: Given PR của hàng này, When người duyệt đọc design.md và sổ khối của kho, Then mỗi vùng của `app-shell-8` có một
  dòng lấy, bỏ hay thêm kèm lý do trỏ vào việc của người dùng; App Shell có một dòng nhập kho (từ khối nào, cho nhu cầu
  gì, chủ kho duyệt ngày nào); thành phần dùng giữ nguyên như ReUI và shadcn giao. (judgment)

## Coverage

Thước đối chiếu: các vùng của `app-shell-8` (design.md, 15 vùng), bảng trạng thái ở Đặc tả UX, bốn vai của
`ontology/roles.yaml`, bốn khổ và hai giao diện của bộ bài kiểm chung.

- Trục vùng của App Shell: cột biểu tượng (AC-1, AC-2) | cột thứ hai (AC-3) | thanh trên (AC-4) | ngăn trượt điện thoại
  (AC-5) | vùng màn (AC-6, AC-7).
- Trục khổ: 360 | 414 (AC-5, AC-7) | 1024 | 1440 (AC-1, AC-3, AC-4, AC-7).
- Trục giao diện: sáng | tối (AC-1, AC-5, AC-7).
- Trục vai: một | nhiều | không rõ (AC-2; luật lọc giữ của hàng 1i).
- Trục trạng thái: bình thường | mất mạng | lưu hỏng | lỗi | không tìm thấy | hết phiên (AC-6).
- Trục nhập kho: bảng vùng | dòng sổ khối | thành phần nguyên bản (AC-8).
- Later: góc nhìn đã lưu trong cột thứ hai; ô gõ mã căn khi có hồ sơ căn; chuông khi có nguồn thông báo.

## Vai × Màn

Màn hàng này dựng là bản mẫu App Shell (chỉ ở máy làm). App Shell bọc mọi màn nội bộ nhưng không đổi ai vào màn nào:
Hôm nay, Bảng hàng, Đã gửi hiện với mọi vai; Thành viên (hàng 9) chỉ quản trị sàn. Bảng quyền của hàng 9a quyết phần
còn lại. Dòng màn sửa sau Cổng Phạm vi, xem sổ quyết định.

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| proto | được — bản mẫu chỉ ở máy làm | được — bản mẫu chỉ ở máy làm | được — bản mẫu chỉ ở máy làm | được — bản mẫu chỉ ở máy làm |

## Out of scope

- Không làm góc nhìn đã lưu; không đếm và không lọc khi bấm lối tắt trạng thái: số đếm và lọc tới cùng bộ lọc trạng thái
  của Bảng hàng (hàng 2).
- Không đo vế «Bảng hàng chỉ còn hàng của sàn mới» sau khi đổi sàn: Bảng hàng chưa đọc dữ liệu thật; vế ấy đo ở hàng nối
  dữ liệu thật (hàng 10).
- Không làm ô gõ mã căn và chuông (nếu chủ kho chọn «chưa»): MVP chưa có hồ sơ căn và nguồn thông báo.
- Không đổi ai vào màn nào và không thêm màn: bảng quyền của hàng 9a và các hàng màn.
- Không làm bốn tab dưới cho điện thoại (nếu chủ kho chọn thanh bên thu gọn).
- Không đổi màn đăng nhập, chọn sàn, trang khách: các màn ấy không có App Shell.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Đường đo

- «App Shell được chọn có dòng trong sổ khối»: dòng nhập kho trong design.md, sau 1n là sổ khối — AC-8, E8.
- «Mọi màn đang có vẫn qua bộ bài kiểm chung ở bốn khổ, sáng và tối»: AC-7, E7.
- «Thanh bên vẫn hiện đủ mục của mọi vai người giữ»: AC-2, E2.
- «Thẻ Phạm vi bày hai đến ba App Shell của ReUI»: bỏ, chủ kho đã chốt app-shell-8 trước khi hàng mở (dòng sổ descope).

## Notes

- Chủ kho dời nghiệm thu giá trị tới cuối lộ trình; ngưỡng của ô cơ hội đi theo mục Đường đo dưới.
- Hạng: máy suy T2 từ đường tệp (`src/components/templates/**` không thuộc `t3_paths`); lộ trình ghi T3. Hồ sơ giữ T3
  theo lộ trình, nên có duyệt kế hoạch.
- Tệp `src/app/(app)/layout.tsx`, `src/app/(app)/nav.ts`, `tests/e2e/shell.spec.ts` đang nằm trong PR của hàng 9; hàng này
  chạm chúng sau khi hàng 9 gộp. Sổ khối `design/so-khoi.yaml` do hàng 1n dựng; dòng nhập kho của App Shell ghi vào đó
  khi 1n đã gộp, trước đó ghi ở design.md.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-12:
  - Ngoài-1: Bản ghi phạm vi chấm luật sản phẩm có thể dừng sớm một commit; người dùng không thấy khác gì.
  - Ngoài-2: Phép chờ trước khi chụp ngăn trượt từng chỉ đo âm tính; lượt 3 đã thay bằng phép kiểm ngăn nằm trong khung nhìn có đối chứng.
  - Ngoài-3: Thứ tự trạng thái ở cột thứ hai có thể khác thứ tự trên màn Bảng hàng; đủ trạng thái và bấm vẫn đúng, sửa cùng bộ lọc trạng thái của hàng 2.
  - Ngoài-4: Đổi sàn đúng lúc mất mạng hay hết phiên thì nút đổi sàn có thể khoá và không báo gì; tải lại trang thì gỡ được.
  - Ngoài-5: Bài kiểm chưa bắt được hai biểu tượng màn bị tráo tên cho nhau.
  - Ngoài-6: Bài kiểm có thể không phát hiện nếu ô gõ mã căn vô tình xuất hiện trên thanh trên.
  - Ngoài-7: Bài kiểm đơn vị không bắt được nếu tiêu đề nhóm ở cột thứ hai biến mất.
- Known limits — chọn ở Cổng Bằng chứng 2026-11-12 (ký lại sau lượt chấm lại; thay danh sách trên):
  - Ngoài-1: Ở cột thứ hai, hai trạng thái «Đã đóng» và «Tạm giữ» có thể nằm khác thứ tự so với màn Bảng hàng. Đủ trạng thái và bấm vào vẫn đúng.
  - Ngoài-2: Người dùng không thấy khác gì: cột thứ hai vẫn nhớ đang mở hay gập. Chỉ là tên lưu trong trình duyệt đặt chưa đúng quy ước tiếng Anh của đội.
  - Ngoài-3: Người dùng không bị ảnh hưởng. Chỉ có một tệp kiểm thử đặt tên chưa theo quy ước tiếng Anh của đội.
  - Ngoài-4: Nếu mất mạng hoặc phiên hết hạn đúng lúc đổi sàn, nút đổi sàn có thể bị khoá và không báo gì. Người dùng phải tải lại trang mới dùng lại được.
  - Ngoài-5: Nếu bấm đăng xuất đúng lúc đang đổi sàn, việc đổi sàn có thể chạy dở rồi trang làm mới sau khi đã thoát. Người dùng chỉ thấy màn đăng nhập hoặc phải thử lại.
  - Ngoài-6: Nếu một ô gõ mã căn vô tình hiện lên thanh trên, bài kiểm tự động có thể không báo. Người dùng sẽ thấy một ô chưa có chức năng.
  - Ngoài-7: Bài kiểm chỉ xác nhận cột thứ hai có hiện, chưa xác nhận tên cột đúng với màn đang mở. Nếu tên cột sai, người dùng thấy tiêu đề lạc màn.
  - Ngoài-8: Người dùng không thấy khác gì. Chỉ là cách mở ngăn trượt trên điện thoại trong bài kiểm có hai bản giống nhau, nên sau này sửa một bên mà quên bên kia thì bài kiểm có thể báo sai.
  - Ngoài-9: The grading record may stop one commit early, so the last small fixes to the phone menu might not be reviewed in the next round. Staff using the app see no difference.
  - Ngoài-10: The automatic check before taking the phone-menu picture could pass even when the menu is not open, so a wrong picture could slip through again. Staff using the app are not affected directly.
  - Ngoài-11: Danh sách trạng thái hàng ở cột thứ hai có thể xếp khác thứ tự so với màn Bảng hàng. Nhân viên thấy hai thứ tự khác nhau, nhưng mọi trạng thái vẫn đủ và bấm vẫn đúng.
  - Ngoài-12: Nếu mất mạng hoặc phiên hết hạn đúng lúc đổi sàn, nút đổi sàn có thể bị khoá và không báo lỗi gì. Người dùng phải tải lại trang mới đổi được.
  - Ngoài-13: Bài kiểm chưa bắt được trường hợp hai biểu tượng bị tráo tên cho nhau. Người dùng chỉ gặp điều này nếu sau này ai đó vô tình đảo nhãn.
  - Ngoài-14: Bài kiểm có thể không phát hiện nếu ô gõ mã căn vô tình xuất hiện trên thanh trên khi chưa có hồ sơ căn. Hiện tại ô này không được làm nên người dùng không bị ảnh hưởng.
  - Ngoài-15: Nếu tiêu đề nhóm ở cột thứ hai biến mất, bài kiểm vẫn xanh. Người dùng chỉ mất một dòng chữ phân nhóm, các lối tắt vẫn dùng được.
