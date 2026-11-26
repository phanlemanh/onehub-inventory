---
nhom: luong-nhieu-buoc
doi_tuong: Màn trong App Shell đưa một người qua vài bước nối nhau tới một lần ghi — nạp tệp, ghép, xem trước, áp.
khuon:
  ten: ImportWizard
  nhap: "@/modules/imports/ui"
nhan_dien:
  - "src/app/(app)/nhap-tep/**/*.tsx"
  - "src/modules/imports/ui/**/*.tsx"
mau_dang_chay:
  tep: src/app/(app)/nhap-tep/page.tsx
khe_bat_buoc: [heading, stepper, body, footer]
cam_ngoai_khuon: [Card]
ngoai_le: []
nhan_viec: Đầu chủ đưa tệp hàng đang dùng vào Bảng hàng, xem trước từng ô và hoàn tác được cả lần nhập
---

Họ màn Luồng nhiều bước (`luong-nhieu-buoc` trong `design/screens/`, hàng 11). Khuôn và nhận diện ở trên do bộ đọc bản đồ
khuôn của kit đọc; bốn mục Triết lý, Màn mẫu, Khổ so, Mặt so do lưới chứng minh màn của kho đọc
(`tools/proof_gate/check.py`, quyết định 0019).

## Triết lý

Một khung, một thanh bước ngang ở trên, thân bước ở giữa, chân bước với «Quay lại» và «Tiếp» ở dưới (khối ReUI
`solution-crm-6`, chủ kho chọn lối A ở Cổng Phạm vi hàng 11 ngày 2026-11-17). Bước sau chỉ mở khi bước trước xong; con
số trên màn là con số máy chủ trả, màn không tự đếm. Dưới 768 px màn nói thẳng là dùng trên máy tính.

## Màn mẫu

Màn: nhap-tep

Màn Nạp tệp (hàng 11) là màn mẫu: tệp chứng minh `_acceptance/nhap-excel/chung-minh-man.md`.

## Khổ so

360, 414, 1024, 1440

## Mặt so

- Khung và thanh bước
- Bảng ghép và lưới xem trước
- Dấu của ô và lý do
- Nút chân bước
- Mất mạng, xung đột, hoàn tác
- Điện thoại
- Chữ và nhãn

## Dùng khi

Việc phải đi qua vài bước theo thứ tự rồi mới ghi một lần, và người cần thấy trước điều sẽ ghi: nạp tệp, nhập lại cập nhật.

## Không dùng

Biểu mẫu một bước (dùng hộp biểu mẫu), sửa trên ô (dùng Lưới), cấu hình nhiều phần không theo thứ tự (dùng Danh sách
khung).

## Ví dụ sai

```tsx
<Card>
  <Tabs>…</Tabs>
</Card>
```

Dựng các bước bằng thẻ tab trong một thẻ: người nhảy bước tuỳ ý, bước sau chạy trên dữ liệu bước trước chưa xong, và mất
thanh bước của họ.
