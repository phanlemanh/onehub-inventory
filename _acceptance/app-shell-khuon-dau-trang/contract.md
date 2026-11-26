---
schema_version: 1
feature: Nhân viên sàn làm việc trong App Shell và đầu trang xếp theo mẫu Verve của ReUI — dải gập trên mép cột thứ hai, ô tìm giữa thanh trên, menu tài khoản có chọn giao diện ở đáy dải biểu tượng, đầu trang một hàng mảnh
slug: app-shell-khuon-dau-trang
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [ui]
screens: []
status: signed-off
approved_by: Manh Phan
approved_at: 2026-11-17T01:03:13Z
design_doc: _acceptance/app-shell-khuon-dau-trang/design.md
---

# Acceptance Contract: app-shell-khuon-dau-trang

## Context

Chủ kho so bản dev của Inventory với trang Settings của mẫu Verve CRM (ReUI) ngày 17/11/2026, khoanh sáu chỗ trên ảnh
chụp và bảo «dựng lại cho tôi xem trước hoàn chỉnh»; xem bản dựng ở cổng 3470 rồi «Cho nới» luật kiểm mã cho bề rộng
menu. Hợp đồng này GHI LẠI điều chủ kho đã bảo — lời nguyên văn từng chỗ ở `design.md` mục «Nguồn». Mã đã dựng trước
khi mở hồ sơ (commit bfcb647, giám sát đợt G-1611-91 giao mở hồ sơ để chấm), nên kế hoạch ở `design.md` là bảng việc đã
làm. Người dùng là mọi nhân viên sàn, trên máy tính và điện thoại.

Source input: lời chủ kho trong phiên «điều chỉnh hạng mục» · sổ ghi chú của đợt `dieu-chinh-hang-muc-verve-settings.md`
· hồ sơ đã ký `app-shell-chon-tu-reui` (hàng 1o) · `wiki/decisions/0050-app-shell-theo-verve.md`.

## Criteria

- AC-1: Given khổ 1024 và 1440, cột thứ hai đang mở, When nhìn mép phải của cột, Then dải gập nằm trên mép ấy (lệch
  ≤ 2 px), tâm dải ở giữa chiều cao cửa sổ (lệch ≤ 2 px), vùng màn bắt đầu ngay sau mép cột (không còn rãnh 24 px); rê
  chuột hay Tab tới thì hai nét của dải bẻ thành mũi tên chỉ hướng cột sẽ đi; bấm thì cột gập, tải lại vẫn gập, bấm
  lại thì mở.
- AC-2: Given khổ 1024 và 1440, When mở Hôm nay, Bảng hàng hay Đã gửi với cột thứ hai mở, Then viền
  phải của cột chạy từ đáy thanh trên tới đáy cửa sổ (cao ≥ chiều cao cửa sổ trừ 80 px), kể cả màn ít mục.
- AC-3: Given khổ 1024 và 1440, When nhìn thanh trên, Then ô tìm mã căn đứng giữa thanh (tâm lệch ≤ 2 px), rộng ≥ 300
  px, câu gợi ý hiện trọn không bị cắt; thanh trên không có nút đổi giao diện, không có nút tài khoản; ở 360 và 414 ô
  tìm là nút biểu tượng cuối thanh, trang không cuộn ngang.
- AC-4: Given người đã đăng nhập và người chưa đăng nhập, khổ máy tính và điện thoại, When mở menu tài khoản, Then nút
  menu nằm ở đáy dải biểu tượng (trên điện thoại: đáy tấm menu); menu rộng ≥ 256 px, tên và email mỗi thứ một dòng;
  có hàng «Giao diện» với ba lựa chọn Sáng, Tối, Theo thiết bị mà phím mũi tên đi tới được và chọn thì không đóng menu;
  chọn Tối thì giao diện tối giữ qua tải lại; người chưa đăng nhập thấy ba lựa chọn và «Đăng nhập»; người đã đăng nhập
  vẫn đổi sàn và đăng xuất như trước.
- AC-5: Given khổ 1440, When mở mỗi màn nội bộ, Then không còn tiêu đề lớn: `h1` mang tên màn với cỡ chữ ≤ 14 px trong
  một hàng cao ≤ 40 px, từ đáy thanh trên tới khung đầu tiên ≤ 64 px (trước: 88 px); màn có nơi ở cột thứ hai thì sau
  tên màn là «›» và tên nơi đang mở, chọn nơi khác thì tên ấy đổi theo; màn không có nơi, hay nơi trùng tên màn, thì
  chỉ có tên màn; nút chính của màn vẫn ở cuối hàng.
- AC-6: Given khổ 1024 và 1440, When nhìn thanh trên hay nhấn ⌘B, Then không thấy nút «Mở hoặc đóng thanh bên» và dải
  biểu tượng không mở thành cột có chữ; Given 360 và 414, Then nút ấy hiện và mở tấm menu như trước.
- AC-7: Given cây sau vòng này, When chạy `make check`, bộ bài trình duyệt chung (sổ màn, khung, App Shell, lưới) ở bốn
  khổ sáng và tối và bộ bài trình duyệt có đăng nhập trên Postgres, Then tất cả xanh, axe không lỗi serious hay
  critical; luật kiểm mã cho bề rộng `DropdownMenuContent` là một dòng hợp đồng theo lớp thành phần trong
  `eslint.config.js`, không có dòng miễn trừ tại chỗ (`eslint-disable`).
- AC-8: Given ảnh chụp trước và sau ở bốn khổ 360, 414, 1024, 1440, When người đặt cạnh nhau, Then mỗi chỗ A1–A6 đổi
  đúng như lời chủ kho ở `design.md`, sáng và tối đọc được, không có chỗ nào khác của màn đổi dáng ngoài sáu chỗ ấy.
  (judgment)

## Coverage

Thước đối chiếu: sáu chỗ chủ kho khoanh (A1–A6, `design.md`), bốn khổ và hai giao diện của bộ bài chung, hai trạng thái
đăng nhập.

- Trục chỗ đổi: A1 dải gập (AC-1) | A2 viền (AC-2) | A3 ô tìm (AC-3) | A4 menu tài khoản (AC-4) | A5 đầu trang (AC-5) |
  A6 nút thanh bên (AC-6).
- Trục khổ: 360 | 414 (AC-3, AC-4, AC-6, AC-8) | 1024 | 1440 (AC-1..AC-6, AC-8).
- Trục giao diện: sáng | tối (AC-4, AC-7, AC-8).
- Trục đăng nhập: đã đăng nhập (AC-4, AC-7 e2e-db) | chưa đăng nhập (AC-4, bộ bài chung).
- Trục không hồi quy: kiểm cả kho, bộ bài chung, bộ có đăng nhập (AC-7).
- Later: P1 phần hồ sơ sàn, P2 tìm/lọc/sắp ở màn Thành viên, P3 chia nhóm cột mục con — chủ kho «chỉ ghi lại», chờ Cổng
  Đáng kế tiếp.

## Vai × Màn

Hợp đồng không khai màn sản phẩm (`screens: []`): vòng này đổi App Shell và khuôn đầu trang bọc mọi màn nội bộ, không dựng
màn nào và không đổi ai vào màn nào. Mọi vai (Đầu chủ, Đầu khách, Trưởng nhóm, Quản trị sàn) thấy cùng App Shell, cùng menu
tài khoản và cùng đầu trang trên các màn mình vào được; bảng quyền của hàng 9a giữ nguyên. Bảng khối ở
`chung-minh-man.md`.

## Out of scope

- Không làm phần hồ sơ sàn, tìm/lọc/sắp ở màn Thành viên, chia nhóm cột mục con (P1–P3): chủ kho «chỉ ghi lại», giám sát
  đưa vào Cổng Đáng kế tiếp.
- Không thêm Hồ sơ, Tuỳ chọn, Thông báo vào menu tài khoản như Verve: Inventory chưa có các màn ấy.
- Không thêm ô chọn phạm vi «All» cạnh ô tìm: Inventory chỉ tìm mã căn.
- Không đổi tên khung bên dưới đầu trang (vd khung «Thành viên» của màn Thành viên): chủ kho bàn tiêu đề lớn, tên khung
  là phần của khung.
- Không đổi câu gợi ý của ô tìm.

> Out of scope = scope-truth (Gate 1 duyệt mục này). Rationale/trade-off từng mục → 1 entry `descope` trong `decisions.jsonl`.

## Đường đo

- Bỏ đường đo — vòng không có ô cơ hội và ngưỡng; xem dòng sổ «bỏ đường-đo».

## Notes

- Hạng T3 vì chạm `tools/e2e_templates/settle.ts` (thêm một tên bài vào danh sách bài «chờ chậm» `CHO_TESTS`). Kế hoạch
  đã thực hiện trước khi mở hồ sơ; Cổng Phạm vi trình hợp đồng và kế hoạch cùng một lần.
- A6 lật dòng sổ đã ký `app-shell-chon-tu-reui#d-20261111T174239Z-22` («Nút mở thanh bên giữ ở mọi khổ»): dòng sổ
  `supersedes` của vòng này nêu lời chủ kho.
- Tệp và bài thử bị hồ sơ đã ký ghim mà vòng này sửa (App Shell hàng 1o, các màn có tiêu đề lớn) được ghi «sửa sau ký»
  và ghim lại trong cùng lượt, lý do «chủ kho đổi khuôn 2026-11-17».
- Known limits — chọn ở Cổng Bằng chứng 2026-11-26:
  - Ngoài-1: Bản mô tả menu tài khoản trên trang ký từng ghi theo menu cũ (còn ảnh đại diện nhỏ, email khoảng 40 ký tự); thẻ và trang bằng chứng đã dựng lại ngày 26/11.
  - Ngoài-2: Phím tắt đóng mở thanh bên trên máy tính chỉ được kiểm ở chiều «không mở dải», chưa có phép thử chứng chiều ngược lại.
