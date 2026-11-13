---
type: decision
title: Bộ nút theo quyền — một chỗ đặt, một cửa, một bảng
links:
  [
    wiki/decisions/0016-permission-model.md,
    wiki/decisions/0023-chon-truoc-tao-sau.md,
    wiki/decisions/0024-ngan-noi-xem-chi-tiet.md,
    design/behaviors.md,
    design/vai-man-nut.md,
    ontology/actions.yaml,
    src/modules/identity/ui/,
    src/components/candidate/row-actions.tsx,
  ]
sources:
  [
    "user, 2026-11-12",
    _acceptance/bo-nut-theo-quyen/decisions.jsonl,
    _acceptance/bo-nut-theo-quyen/design.md,
    "onehub-quy-hang apps/web/src/components/bo-cuc/dau-man.tsx",
    "onehub-quy-hang docs/adr/0024-he-bo-cuc.md",
  ]
---

# 0025 Bộ nút theo quyền — một chỗ đặt, một cửa, một bảng

## Status

Accepted, 2026-11-12, tại Cổng Phạm vi của hàng 9e (`_acceptance/bo-nut-theo-quyen/`). Chủ kho chọn: một nút động từ thường
(H1), nút thêm ở đầu màn (C), một «…» cuối dòng (R1), việc của phạm vi «của tôi» trên dòng người khác thì ẩn (O1), hộp xác
nhận ngắn (X1), ô quyền của liên hệ theo thông lệ CRM.

## Context

Quỹ hàng chỉ thấy lỗi bộ nút khi chạy thử: bốn cách gắn quyền cho nút (so tên vai trong trang, danh mục điều hướng, cờ của
lõi, cờ do API trả), nút hiện rồi máy chủ từ chối, cùng một việc đặt khác chỗ theo màn và theo khổ. Kho này đã có bảng quyền
(hàng 9a) nhưng chưa nút nào đọc nó; thanh bên và màn Thành viên còn so tên vai.

## Decision

- Bảng quyền `ontology/actions.yaml` là nguồn duy nhất cho mọi nút. Hàm thuần `actionVisibility` cạnh `allowedScope` quyết
  hiện hay ẩn; máy chủ và màn đọc cùng một luật.
- Một cửa cho nút: `PermittedAction` ở cửa `ui` của mô-đun danh tính; menu «…» của dòng và hồ sơ (`RowActions`,
  `RecordActions`) nhận luật qua một ngữ cảnh mà `SessionRoles` của mô-đun danh tính đặt cho khung trong — thành phần dùng
  chung không biết mô-đun nào, ngoài khung thì không việc nào được phép.
- Chỗ đặt và thứ tự ghi ở `design/behaviors.md`, mục «Bộ nút theo quyền». Không có nút mờ: không quyền thì không có nút.
- Bộ kiểm `tests/bo-nut-kiem.test.ts` đỏ khi một nút gửi yêu cầu ghi mà không đứng trong `PermittedAction`, khai tên thao tác
  lạ, hay `src/app` viết cứng tên vai. Bảng vai × màn tới cấp nút sinh từ bảng quyền: `design/vai-man-nut.md`.
- Máy chủ trả 403 thì giao diện hiện câu riêng «Không đủ quyền làm việc này», khác câu lỗi chung, và làm mới trang.

## Consequences

- Hàng mở chức năng thật (thêm, xoá căn ở hàng 12; liên hệ ở 18b và màn Liên hệ) chỉ khai tên thao tác và đặt nút qua các
  thành phần này; ô nháp của bảng được quyết lại khi hàng ấy mở cửa.
- Lưới chung có thêm khe thao tác dòng (cột ghim cuối) và nút thêm hiện ở thanh công cụ khi toàn màn hình; trên điện thoại
  «…» là cột ghim cuối của lưới, không phải cuối thẻ, vì lưới của kho trên điện thoại vẫn là bảng (hàng 2b).
- Thanh bên đọc `action` của mục điều hướng; đổi một ô của bảng quyền là đổi thanh bên, không sửa mã.
