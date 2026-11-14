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
ngoai_le: []
nhan_viec: Đầu chủ xem, lọc và sửa danh sách hàng thay cho bảng tính
---

Họ màn Lưới (`grid` trong `design/screens.yaml`). Khuôn và nhận diện ở trên do bộ đọc bản đồ khuôn của kit đọc; bốn mục
Triết lý, Màn mẫu, Khổ so, Mặt so do lưới chứng minh màn của kho đọc (`tools/proof_gate/check.py`, quyết định 0019).

## Triết lý

Lưới thay Sheet và Excel cho Đầu chủ: mở ra là thấy mọi dòng, sửa tại chỗ, không phải học thêm gì.

Lọc bằng ô dưới tiêu đề cột như Sheet: từ 768 px hàng ô lọc luôn hiện, không có nút bật tắt, các ô cộng dồn. Vùng không có
chỗ gõ tìm riêng; tìm nằm ở ô ⌘K của thanh trên App Shell (chủ kho chốt 2026-11-13, hàng 2e). Một cách so chữ cho cả hai
chỗ: bỏ dấu tiếng Việt, «đ» như «d».

Điện thoại: dưới 768 px màn có khai thẻ (Bảng hàng) đổi thân vùng thành danh sách thẻ, cùng một bộ lọc, sắp xếp, nhóm và
hồ sơ của vùng. Lọc nằm ở ngăn Lọc mở từ nút «Lọc (n)» của hàng công cụ, «Sắp theo» ở đầu ngăn, lọc đang chạy là chip
(chủ kho chọn ở Cổng Phạm vi hàng 2b, 2026-11-14). Màn họ Lưới chưa khai thẻ vẫn là bảng cuộn ngang ở điện thoại.

## Màn mẫu

Màn: inventory

Bảng hàng (hàng 2, «đọc như Sheet») là màn mẫu: tệp chứng minh `_acceptance/bang-hang-ban-doc/chung-minh-man.md` đạt đủ ma
trận trạng thái (`design/states.md`). Các màn Lưới sau so cạnh nó. Bản mẫu Lưới ở trang thử là mẫu của khuôn, không phải
màn mẫu.

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
