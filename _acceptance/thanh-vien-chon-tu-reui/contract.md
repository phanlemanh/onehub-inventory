---
schema_version: 1
feature: "Quản trị sàn xem danh sách người và mời người trên màn Thành viên chọn từ kho và ReUI Pro, quyền và luật mời giữ nguyên"
slug: thanh-vien-chon-tu-reui
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [ui]
screens: [members]
status: approved
approved_by: Manh Phan
approved_at: 2026-11-14T13:02:38Z
design_doc: _acceptance/thanh-vien-chon-tu-reui/design.md
---

# Acceptance Contract: thanh-vien-chon-tu-reui

## Context

Màn Thành viên (`/members`) và hộp mời được ghép tay ở hàng 9 khi kho còn rỗng; sổ màn để họ của màn rỗng nên nó không
được so với màn nào. Quyết định 0023 đòi chọn trước, vẽ sau. Hàng này xếp lại danh sách người theo khối ReUI
`solution-users-8` (khối Quỹ hàng đã chọn) và hộp mời theo khối `dialog-2`, giữ nguyên quyền và luật mời của hàng 9.
Người dùng là Quản trị sàn, trên máy tính.

Source input: hàng 9c của `docs/plan/lo-trinh.json` · ô cơ hội `opportunity.md` (chủ kho build 13/11) · quyết định 0023 ·
`docs/tri-thuc/wiki/chu-de/nguoi-dung-va-vai.md` · hồ sơ đã ký `moi-nguoi-gan-vai` (hàng 9), `bo-nut-theo-quyen` (9e).

Các tiêu chí viết theo lối máy khuyên ở Hỏi-1 (B · `solution-users-8`). Chủ kho chọn A (khuôn Lưới) thì AC-1, AC-2, AC-3
đổi lời trước khi duyệt và hợp đồng thêm việc đổi mô hình nghiệp vụ (thiết kế, mục «Câu hỏi cho chủ kho»).

## Criteria

- AC-1: Given Quản trị sàn của một sàn có chín người, When mở Thành viên ở 1440, Then danh sách nằm trong một khung tên
  «Thành viên» có dòng «9 người trong sàn», mỗi người đúng một dòng mang chữ cái đầu, tên, email, «Người mời: [Tên] ·
  ngày» (hoặc «—»), nhãn từng vai bằng chữ của bảng nhãn, và nút «Đổi vai» trên chính dòng ấy; không có ô tìm, thẻ, thanh
  chỗ ngồi hay nút xuất nào.
- AC-2: Given cùng sàn ở 1440, 1024, 414 và 360, When đo bề rộng của chính khung danh sách, Then khung ≥ 896 px thì bốn
  phần của mọi dòng (người, người mời, vai, nút) bắt đầu cùng một toạ độ ngang giữa các dòng; khung từ 672 tới dưới 896 px
  thì phần người mời ẩn và ba phần còn lại thẳng hàng; khung dưới 672 px thì tên và email chiếm một dòng riêng, vai và nút
  ở dòng dưới; ở 1440 khung ≥ 896 px; không khổ nào cuộn ngang; tên hay email dài cắt bằng «…» và có đủ chữ khi rê chuột.
- AC-3: (cross-layer) Given bảng quyền hiện tại, When từng vai mở Thành viên, Then nút «Mời người» ở đầu màn và nút «Đổi vai» trên dòng
  chỉ hiện khi bảng quyền cho; vai không có `listMembers` thấy «Không đủ quyền»; mọi bài kiểm quyền của hàng 9 và 9e
  (`tests/e2e-db/members.spec.ts`, `tests/e2e-db/bo-nut-members.spec.ts`, `tests/db/moi-nguoi.db.test.ts`) xanh, không
  đổi lời hay kỳ vọng — chỉ được đổi cách tìm dòng người, liệt từng chỗ ở Cổng Bằng chứng.
- AC-4: (cross-layer) Given Quản trị sàn bấm «Mời người», When hộp mở, Then tiêu đề «Mời người» có nhãn nhỏ mang tên sàn đang làm cạnh
  bên, dưới là một câu mô tả, ba trường Email, Tên trong sàn, Vai (bốn ô đánh dấu), dải chân «Thôi» và «Mời»; luật mời
  của hàng 9 giữ nguyên — một email, một tên, ít nhất một vai, câu lỗi email sai khuôn, đã trong sàn, máy chủ lỗi và từ
  chối 403 như hàng 9 và 9e; mời xong hộp đóng, báo «Đã mời [Tên]», người mới có trong danh sách và trong bảng thành viên
  của sàn với đúng tên và vai đã chọn.
- AC-5: Given hộp dùng chung `FormDialog`, When không truyền ô nhãn, Then hộp dựng đúng như trước hàng này (không phần tử
  thêm quanh tiêu đề); When truyền, Then nhãn đứng cạnh tiêu đề; ba màn khác dùng hộp (đặt tên góc nhìn, sửa trên ô, báo
  sai thông tin) không đổi dáng — ảnh trước/sau ở Cổng Bằng chứng.
- AC-6: Given màn Thành viên, When đang tải, tải lỗi, không đủ quyền, sẵn sàng, tên dài, và hộp mời ở ba lỗi, hộp đổi vai
  ở lỗi «Quản trị sàn cuối cùng», Then mỗi trạng thái hiện như bảng trạng thái của thiết kế, và quét trợ năng ở sáng và tối
  không có lỗi nặng hay nghiêm trọng.
- AC-7: Given mã của màn, When quét, Then màn chỉ đọc và ghi người qua cửa của mô-đun `identity` (`MEMBERS_BASE_PATH`),
  không thêm đường truy vấn mới; chữ trên màn không ghim trong `src/` ngoài tệp câu chữ của màn và bảng nhãn; `make check`
  xanh.
- AC-8: Given sổ thiết kế, When đọc, Then sổ màn ghi họ của màn Thành viên, tệp họ ở `design/patterns/` mô tả khuôn danh
  sách khung chọn ở hàng này, sổ khối có hai dòng `solution-users-8` và `dialog-2` trỏ hồ sơ hàng này, và tệp chứng minh
  màn `chung-minh-man.md` qua lưới chứng minh màn của kho.
- AC-9: (judgment) Given ảnh màn Thành viên ở 1440 sáng và ảnh hộp mời, cạnh ảnh khối gốc `solution-users-8` và
  `dialog-2`, When người chấm so, Then danh sách giống khung Members của khối (khung có đầu, dòng có chữ cái đầu, cột thẳng
  hàng, nút cuối dòng) và hộp giống `dialog-2` (nhãn cạnh tiêu đề, trường xếp dọc, dải chân hai nút), các vùng bỏ đúng
  bảng «Vùng» của thiết kế.

## Vai × Màn

| Màn | Đầu chủ | Đầu khách | Trưởng nhóm | Quản trị sàn |
|---|---|---|---|---|
| members | chặn — «Không đủ quyền» | chặn — «Không đủ quyền» | chặn — «Không đủ quyền» | được — danh sách, «Mời người», «Đổi vai» |

## Coverage

Bỏ quét hình thái — màn đã có, đổi dáng hai phần theo hai khối chỉ định; xem dòng `descope` «bỏ coverage-scan» trong sổ
quyết định. Các trục cố định đã phủ bằng tiêu chí:

- Phần màn: danh sách (AC-1, AC-2) · hộp mời (AC-4) · hộp đổi vai (AC-3, AC-6) · hộp dùng chung ở màn khác (AC-5).
- Vai: bốn vai, có và không có từng thao tác (AC-3).
- Khổ: 360 · 414 · 1024 · 1440; sáng · tối (AC-2, AC-6).
- Trạng thái: chờ tải · lỗi · không đủ quyền · sẵn sàng · tên dài · ba lỗi mời · Quản trị sàn cuối (AC-6).
- Luật kho: một cửa dữ liệu, chữ từ bảng nhãn (AC-7); sổ thiết kế và chứng minh màn (AC-8); giống khối (AC-9).

## Đường đo

- bỏ đường đo — ô cơ hội chưa khai ngưỡng số (sổ quyết định).

## Out of scope

- Xoá người, khoá người nghỉ, bàn giao (N8) — hàng sau.
- Khách ngoài sàn, lời mời chờ nhận, gửi lại lời mời, hết hạn lời mời — sản phẩm không có các khái niệm ấy.
- Ô tìm trên màn, lọc theo vai, xuất danh sách — tìm ở ⌘K; lọc chỉ có nếu chủ kho chọn khuôn Lưới.
- Ảnh đại diện người — kho không lưu ảnh.
- Đổi luật mời (nhiều email một lần, một vai) — giữ luật hàng 9.

## Notes

- Hỏi-1 cho chủ kho ở Cổng Phạm vi: khuôn của danh sách (A Lưới · B `solution-users-8`, máy khuyên B). Chọn A thì đổi lời
  AC-1, AC-2, AC-3, AC-8, AC-9, phép đo E1, E2, E5, E12, bản đồ khuôn `luoi.md` nhận thêm màn, và PR có mục «Đổi ontology —
  chủ kho soi» cho bốn trường của Thành viên (thiết kế, mục «Nếu chủ kho chọn A»).
- Ngoài vùng, G cho 14/11 (tin G-1411-80): cài `avatar`, `item` bằng lệnh shadcn; sinh lại `design/component-registry.json`;
  ô `badge` tuỳ chọn ở `form-dialog.tsx`, mặc định tắt, bài kiểm cả bật và tắt. Chỉ khi chọn A: bốn trường hiển thị của
  Thành viên ở `ontology/entities/Member.yaml`.
- Công tắc bản mẫu `?lo=` ở `/members` và lối không được chọn gỡ trước lượt chấm.
