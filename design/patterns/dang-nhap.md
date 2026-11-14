---
nhom: dang-nhap
doi_tuong: Màn ngoài App Shell mà nhân viên sàn thấy trước khi vào sàn — đăng nhập, chọn sàn.
khuon:
  ten: LoginLayout
  nhap: "@/components/templates/login-layout"
nhan_dien:
  - "src/app/login/**/*.tsx"
mau_dang_chay:
  tep: src/app/login/page.tsx
khe_bat_buoc: [heading, lead, footer, children]
cam_ngoai_khuon: [Frame, Card]
ngoai_le: []
nhan_viec: Nhân viên sàn vào được sàn đang làm bằng mã gửi qua email
---

Họ màn Đăng nhập (`dang-nhap` trong `design/screens.yaml`, hàng 1p). Khuôn và nhận diện ở trên do bộ đọc bản đồ khuôn
của kit đọc; bốn mục Triết lý, Màn mẫu, Khổ so, Mặt so do lưới chứng minh màn của kho đọc (`tools/proof_gate/check.py`,
quyết định 0019).

## Triết lý

Màn trước khi vào sàn chỉ có một việc: logo trên, một cột hẹp giữa trang không khung, chân trang một dòng (khối ReUI
`auth-15`, chủ kho chọn ở Cổng Phạm vi hàng 1p ngày 2026-11-14).

## Màn mẫu

Màn: sign-in

Màn đăng nhập (hàng 1p) là màn mẫu: tệp chứng minh `_acceptance/dang-nhap-chon-tu-reui/chung-minh-man.md`.

## Khổ so

360, 414, 1024, 1440

## Mặt so

- Khung và bố cục
- Logo và chân trang
- Ô nhập và nút
- Báo lỗi dưới đúng ô
- Điện thoại
- Chữ và nhãn

## Dùng khi

Màn nhân viên thấy khi chưa vào sàn nào: đăng nhập, chọn sàn, phiên không còn sàn.

## Không dùng

Màn trong App Shell (dùng khung của App Shell) và trang khách (dùng thẻ của trang khách).

## Ví dụ sai

```tsx
<main className="flex min-h-svh items-center justify-center">
  <Frame className="max-w-sm">…</Frame>
</main>
```

Bọc biểu mẫu bằng khung riêng ngoài `LoginLayout`: mất logo, chân trang và cột hẹp của họ, màn lệch họ ngay từ đầu.
