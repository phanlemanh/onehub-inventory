---
nhom: luoi
doi_tuong: Màn danh sách nhiều dòng mà Đầu chủ xem, lọc và sửa như một bảng tính.
khuon:
  ten: DataRegion
  nhap: "@/components/candidate/data-region"
nhan_dien:
  - "src/app/(app)/inventory/**/*.tsx"
  - "src/app/(app)/sent/**/*.tsx"
  - "src/app/(app)/contacts/**/*.tsx"
mau_dang_chay:
  tep: "src/app/(app)/proto/[slug]/grid-showcase.tsx"
khe_bat_buoc: [title, columns, rows, status]
cam_ngoai_khuon: [DataGrid, DataGridTable, Table]
ngoai_le:
  - tep: "src/app/(app)/inventory/page.tsx"
    ly_do: trang chỉ có đầu màn, vùng Lưới dựng ở hàng 2 (Bảng hàng bản đọc)
  - tep: "src/app/(app)/sent/page.tsx"
    ly_do: trang chỉ có đầu màn, vùng Lưới dựng khi màn Đã gửi tới lượt
nhan_viec: Đầu chủ xem, lọc và sửa danh sách hàng thay cho bảng tính
---

Họ màn Lưới (`grid` trong `design/screens.yaml`). Khuôn và nhận diện ở trên do bộ đọc bản đồ khuôn của kit đọc; bốn mục
Triết lý, Màn mẫu, Khổ so, Mặt so do lưới chứng minh màn của kho đọc (`tools/proof_gate/check.py`, quyết định 0019).

## Triết lý

Lưới thay Sheet và Excel cho Đầu chủ: mở ra là thấy mọi dòng, sửa tại chỗ, không phải học thêm gì.

## Màn mẫu

Màn: chưa có

Màn Lưới thật đầu tiên dựng thành màn mẫu khi tệp chứng minh của nó đạt đủ ma trận trạng thái (`design/states.md`); vòng ấy
đổi dòng trên thành `Màn: <id màn>`. Bản mẫu Lưới ở trang thử là mẫu của khuôn, không phải màn mẫu.

## Khổ so

360, 414, 1024, 1440

## Mặt so

- Khung và bố cục
- Cột chính và góc nhìn
- Thanh công cụ, lọc, tìm, sắp xếp
- Bảng
- Mở chi tiết cạnh bảng
- Trạng thái tải, trống, lỗi
- Ghi và báo đã lưu
- Phím tắt
- Điện thoại
- Tốc độ mở màn
- Chữ và nhãn
- Quyền theo vai

## Dùng khi

Màn có một danh sách nhiều dòng mà người dùng cần xem, lọc, tìm và sửa từng ô — hàng, liên hệ, đã gửi.

## Không dùng

Hồ sơ một bản ghi, trang khách và màn Hôm nay: không phải bảng nhiều dòng, dùng khung trang và thẻ thay.

## Ví dụ sai

```tsx
<DataGrid table={table}>
  <DataGridTable />
</DataGrid>
```

Dựng thẳng lưới ReUI ngoài khuôn: mất trạng thái chờ tải, trống, lỗi, một phần hỏng và không đủ quyền mà `DataRegion` đã
giữ, nên màn lệch họ ngay từ đầu.
