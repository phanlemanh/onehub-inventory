---
type: decision
title: Thêm gói cmdk cho ô ⌘K
links:
  [
    src/components/ui/command.tsx,
    src/modules/listings/ui/unit-jump.tsx,
    src/components/templates/app-shell.tsx,
    "src/app/(app)/layout.tsx",
    design/so-khoi.yaml,
    _acceptance/loi-vao-ho-so/contract.md,
  ]
sources:
  [_acceptance/loi-vao-ho-so/decisions.jsonl, "giám sát đợt nền, duyệt chạm tệp R-10, 2026-11-13"]
---

# 0028 Thêm gói cmdk cho ô ⌘K

## Status

Accepted, 2026-11-13, ở hàng 3f (lối vào hồ sơ). Chủ kho duyệt ở Cổng Phạm vi (Hỏi-1, sổ quyết định dòng 34); giám sát
duyệt chạm tệp (R-10).

## Context

Ở Cổng Phạm vi chủ kho chốt ô tìm của sản phẩm nằm ở thanh trên App Shell, nguyên văn: «Đồng ý lối A, một điểm tôi muốn
bổ sung là đưa search đúng vào (⌘K) ở thanh trên đây cũng là nơi shell đã có ux?». Ô ấy thành chỗ tìm duy nhất (ô tìm của
vùng bỏ ở hàng 2e), nên cần gợi ý khi gõ, ghi rõ loại (căn, toà, dự án), đi bằng phím mũi tên và Enter. Kho chưa có thành
phần bảng lệnh; hộp biểu mẫu sẵn có (`FormDialog`) không có danh sách gợi ý đi bằng phím.

## Decision

- Cài thành phần Command của shadcn bằng lệnh `npx shadcn add command`, kéo theo gói `cmdk` (giấy phép MIT, cùng các gói
  phụ của nó, đều MIT). Thành phần nằm ở `src/components/ui/command.tsx`, không sửa tay.
- Ô ⌘K (`UnitJump`) ráp từ Command, đặt vào khe `search` mới của thanh trên App Shell; hiện theo đúng luật hiện mục Bảng
  hàng trên thanh bên. Một dòng sổ khối (`o-tim-thanh-tren`).
- Gợi ý lấy từ chính các dòng Bảng hàng đã đọc (SP-1), chọn hay Enter thì về Bảng hàng qua cách xem ban đầu của hàng 2c.

Lối khác đã cân: hộp biểu mẫu sẵn có cộng một danh sách tự viết — phải tự làm phần đi bằng phím và đọc cho trình đọc
màn hình mà cmdk đã làm; khối ReUI navbar-4, navbar-6, app-shell-12 — đều là cả thanh hay cả khung, kho đã có thanh trên.

## Consequences

- `package-lock.json` đổi: mọi dãy cài lại phụ thuộc (`make setup`) sau khi gộp.
- Bảng lệnh nào sau này (nhảy tới màn, việc nhanh) dùng lại Command này, không thêm gói thứ hai.
