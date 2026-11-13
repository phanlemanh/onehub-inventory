---
type: decision
title: Sổ màn là một chỗ khai quyền vào màn và nút của mỗi màn
links:
  [
    design/screens.yaml,
    design/vai-man-nut.md,
    tools/coverage_matrix/buttons.py,
    src/modules/identity/ui/permitted-action.tsx,
    tests/e2e-db/vai-man.ts,
    tests/e2e-db/dang-nhap-vai.ts,
    tests/e2e-db/vai-man.spec.ts,
    _acceptance/kiem-vai-theo-man/design.md,
  ]
sources:
  [
    "user, 2026-11-13",
    _acceptance/kiem-vai-theo-man/decisions.jsonl,
    _acceptance/kiem-vai-theo-man/sua-sau-cong-pham-vi.md,
  ]
---

# 0030 Sổ màn là một chỗ khai quyền vào màn và nút của mỗi màn

## Status

Accepted, 2026-11-13, tại Cổng Phạm vi của hàng 9b. Chủ kho nhận ba khuyến nghị: Hỏi-1 (đủ cặp ở khổ 1440, cặp bị chặn ở
bốn khổ), Hỏi-2 (luật vào màn khai ở sổ màn), Hỏi-3 (gộp việc lấp bảng nút vào hàng). Phần «nút theo quyền ghi quyết định»
là mục sửa sau Cổng Phạm vi, giám sát quyết tạm, chủ kho phê ở Cổng Bằng chứng.

## Context

Quyết định 0017 ghi: bài chấm giao diện không đăng nhập theo vai. Bảng Vai × Màn tới cấp nút của hàng 9e chỉ có hai màn, vì
công cụ sinh bảng chỉ đọc thư mục của trang, còn nút thật nằm trong giao diện mô-đun và khung App Shell. Luật «màn nào cần
quyền gì» nằm rải ở trang và thanh bên.

## Decision

- Sổ màn `design/screens.yaml` khai cho mỗi màn của nhân viên hay của khách, kể cả màn chưa dựng: `vao` (thao tác của bảng
  quyền phải có để vào, hoặc `null`), `nut` (thao tác có nút trên màn), `mo_san` (nút hiện ngay khi mở màn), `nut_chung`
  (nút không theo quyền); khối `khung` khai nút của App Shell. Tên phải có trong `ontology/actions.yaml`.
- Công cụ sinh bảng đọc đúng các tệp giao diện mà màn nhập (lần theo tên qua cửa `ui`, thành phần trung gian, tệp tương đối),
  giữ mọi màn, đánh dấu «dự kiến» cho nút khai mà mã chưa có, và đỏ khi mã có nút chưa khai.
- Bài trình duyệt đăng nhập theo vai qua một cửa dùng chung (`tests/e2e-db/dang-nhap-vai.ts`) và đi các cặp sinh từ sổ màn.
- Nút theo quyền ghi mỗi quyết định (cho hiện hay chặn, kèm phạm vi) vào trang chỉ khi bản dựng mang cờ
  `NEXT_PUBLIC_E2E_BUTTON_RECORD=1` (máy dev của bộ bài có cơ sở dữ liệu); bản thật không có đường ghi nào chạy được. Không
  thêm phần tử hay thuộc tính nào vào trang.

## Consequences

- Tới hàng 10, luật vào màn Thành viên có ba chỗ khai (trang, thanh bên, sổ màn) với lưới giữ khớp; hàng 10 cho trang và
  thanh bên đọc thẳng từ sổ màn.
- Bảng nút làm lộ: Quản trị sàn không có nút nào trên Bảng hàng và không có quyền xem căn; khi Bảng hàng lấy quyền xem căn
  làm cửa vào thì Quản trị sàn bị chặn nếu bảng quyền giữ nguyên — việc của hàng 10.
- Nút nối tay trong thành phần của hàng 4, 3b, 3e chưa vào bảng tới khi chúng đi qua nút theo quyền.
- Bản mẫu dưới một vai (ảnh chụp các hàng khác) dùng lại được cửa đăng nhập này; chưa làm.
