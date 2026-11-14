---
type: decision
title: Thêm gói khung chia kéo được cho hồ sơ ghim
links:
  [
    src/components/ui/resizable.tsx,
    src/components/candidate/record-panel.tsx,
    design/so-khoi.yaml,
    _acceptance/ngan-chi-tiet-ghim-thanh-cot/contract.md,
  ]
sources:
  [
    _acceptance/ngan-chi-tiet-ghim-thanh-cot/decisions.jsonl,
    _acceptance/ho-so-can/decisions.jsonl,
    "giám sát đợt nền, duyệt chạm tệp D-1311-31, 2026-11-13",
  ]
---

# 0031 Thêm gói khung chia kéo được cho hồ sơ ghim

## Status

Accepted, 2026-11-13, ở hàng 3a (ngăn chi tiết ghim thành cột). Chủ kho duyệt Cổng Phạm vi; trang cổng nêu đích danh gói.
Giám sát duyệt chạm ba tệp ngoài vùng của hàng (D-1311-31) với năm điều kiện.

## Context

Ở Cổng Phạm vi hàng 3 chủ kho để phần ghim cho hàng sau, nguyên văn: «Nút ghim (ngăn thành cột, kéo đổi rộng) … làm ở
hàng sau» (sổ `ho-so-can`, dòng 16). Hồ sơ ghim cần một vạch chia giữa bảng và cột mà người dùng kéo được bằng chuột và
bằng phím, có vai `separator` cho trình đọc màn hình. Kho chưa có cơ chế kéo đổi rộng nào: cột thứ hai của App Shell chỉ
đóng mở và nhớ bằng cookie (`src/components/templates/app-shell/column-cookie.ts`), không kéo. Khối ReUI gần nhất,
app-shell-11, dựng vạch chia bằng thành phần Resizable.

## Decision

- Cài thành phần Resizable của shadcn bằng lệnh `npx shadcn add resizable`, kéo theo gói `react-resizable-panels`
  (bản 4.22.1, giấy phép MIT, của Brian Vaughn; cỡ giải nén khoảng 2,5 MB gồm mã nguồn và bản dựng, phần vào trang nhỏ
  hơn nhiều). Thành phần nằm ở `src/components/ui/resizable.tsx`, không sửa tay.
- Khung hồ sơ chung (`RecordPanel`) dùng nó cho dáng ghim: vạch chia có tay cầm ở mép trái cột. Một dòng sổ khối.
- Không nâng phiên bản gói nào khác.

Lối khác đã cân: vạch chia vẽ tay (bản bấm được ở Cổng Phạm vi dùng tạm) — phải tự làm phần kéo, phím mũi tên, vai và giá
trị cho trình đọc màn hình mà gói đã làm, trái luật «chọn từ ReUI trước»; khối ReUI ai-chat-2 — cột rộng cố định, không
kéo được.

## Consequences

- `package-lock.json` đổi: mọi dãy cài lại phụ thuộc (`make setup`) sau khi gộp.
- Mọi chỗ kéo đổi rộng sau này (cột thứ hai App Shell nếu chủ kho muốn kéo, chia màn) dùng lại Resizable này, không thêm
  cách kéo thứ hai.
