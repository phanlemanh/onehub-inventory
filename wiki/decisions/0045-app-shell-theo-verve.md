---
type: decision
title: App Shell xếp theo mẫu Verve của ReUI
links:
  [
    wiki/decisions/0023-chon-truoc-tao-sau.md,
    src/components/templates/app-shell.tsx,
    src/components/templates/app-shell/second-column.tsx,
    src/components/templates/app-shell/place-crumb.tsx,
    src/components/templates/page-header.tsx,
    src/app/(app)/account-menu.tsx,
    eslint.config.js,
  ]
sources: [https://verve-crm.reui.io/settings]
---

# 0045 App Shell xếp theo mẫu Verve của ReUI

## Status

Accepted, 2026-11-17. Chủ kho so bản dev của Inventory với trang Settings của mẫu Verve CRM (ReUI), khoanh từng chỗ
trên ảnh, rồi bảo «dựng lại cho tôi xem trước hoàn chỉnh» và «cho nới» luật kiểm mã cho bề rộng menu.

## Context

App Shell của hàng 1o xếp từ khối ReUI app-shell-8. Chủ kho thấy sáu chỗ kém hơn mẫu Verve:

- nút gập cột thứ hai là một nút vuông riêng, chiếm một rãnh, nằm giữa chiều cao cột chứ không giữa màn hình;
- viền cột thứ hai dừng ngay dưới mục cuối;
- ô tìm nhỏ, nằm sát góc phải;
- nút giao diện và nút tài khoản đứng riêng ở góc phải thanh trên; menu tài khoản tự ráp, hẹp bằng nút nên email bị
  bẻ dòng;
- tiêu đề lớn chiếm chỗ và thường trùng tên khung bên dưới;
- nút bật thanh bên ở thanh trên trùng vai với nút gập cột thứ hai.

## Decision

- Viền cột thứ hai chạy hết chiều cao màn hình. Nút gập là một dải nằm trên viền ấy, giữa chiều cao cửa sổ, không
  chiếm chỗ; hai nét bẻ thành mũi tên theo hướng cột sẽ đi khi rê chuột hay khi bấm phím Tab tới.
- Ô tìm đứng giữa thanh trên, rộng 320px trên máy tính.
- Menu tài khoản nằm ở đáy dải biểu tượng: tên và email, sàn đang mở, đổi sàn, hàng ba lựa chọn giao diện (sáng, tối,
  theo thiết bị — mỗi lựa chọn là một mục của menu nên phím mũi tên tới được), đăng xuất. Chưa đăng nhập thì menu có
  hàng giao diện và mục đăng nhập.
- Trên máy tính dải biểu tượng không mở rộng thành cột có chữ; nút bật thanh bên chỉ còn ở điện thoại, để mở tấm menu.
- Đầu trang là một hàng mảnh: tên màn (vẫn là `h1`), «›» và nơi đang mở ở cột thứ hai, nút chính của màn ở cuối hàng.
  Tên của một vùng vẫn nằm ở đầu khung.
- Luật kiểm mã `shadcn/no-restyle` cho phép đặt bề rộng (`w-*`, `min-w-*`) trên `DropdownMenuContent`, để menu rộng
  theo nội dung chứ không theo nút mở.
- Dấu của bản dev Next.js chuyển sang góc phải dưới, vì góc trái dưới nay là nút tài khoản.

## Consequences

- Các bài kiểm trình duyệt dùng «nút bật thanh bên hiện» làm dấu khung còn giữ nay đọc thanh trên.
- Một màn mới dùng `PageHeader` tự có tên nơi đang mở; màn không có mục ở cột thứ hai chỉ hiện tên màn.
- Menu tài khoản và hàng giao diện chưa có dòng trong `design/so-khoi.yaml`: thay đổi này không đi qua một vòng có cổng
  Phạm vi, nên giám sát đợt quyết có ghi sổ hay không.
