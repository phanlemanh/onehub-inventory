---
nhom: danh-sach-khung
doi_tuong: Màn danh sách ngắn những người hay thứ mà người quản trị xem từng dòng và làm một việc trên chính dòng ấy.
khuon:
  ten: MembersList
  nhap: "@/modules/identity/ui"
nhan_dien:
  - "src/app/(app)/members/**/*.tsx"
  - "src/modules/identity/ui/members-list.tsx"
mau_dang_chay:
  tep: "src/modules/identity/ui/members-list.tsx"
khe_bat_buoc: [title, count, rows, action]
cam_ngoai_khuon: [DataGrid, DataGridTable, Table, DataRegion]
ngoai_le: []
nhan_viec: Quản trị sàn xem ai đang trong sàn với vai gì và đổi vai một người
---

Họ màn Danh sách khung (`list-frame` trong `design/screens.yaml`), chủ kho chọn ở Cổng Phạm vi hàng 9c ngày 2026-11-14
(lối B, khối ReUI `solution-users-8`). Khuôn và nhận diện ở trên do bộ đọc bản đồ khuôn của kit đọc; bốn mục Triết lý,
Màn mẫu, Khổ so, Mặt so do lưới chứng minh màn của kho đọc (`tools/proof_gate/check.py`, quyết định 0019).

## Triết lý

Một khung có tên và số đếm, mỗi bản ghi một dòng: ai hay cái gì ở bên trái, các cột thông tin thẳng hàng giữa mọi dòng,
việc trên bản ghi ở cuối chính dòng ấy. Không ô tìm (tìm ở ô ⌘K của thanh trên), không lọc cột, không bộ máy bảng tính:
danh sách vài chục dòng nhìn là thấy. Các cột co theo bề rộng của chính khung, không theo cửa sổ.

Khuôn hiện ở phần giao diện của mô-đun người dùng (`MembersList`); màn thứ hai của họ, ở mô-đun khác, đưa nó lên
`src/components/candidate/` rồi đổi `khuon.nhap`.

## Màn mẫu

Màn: members

## Khổ so

360, 414, 1024, 1440

## Mặt so

- Khung và bố cục
- Dòng và cột thẳng hàng
- Việc trên dòng
- Hộp mở từ màn
- Trạng thái tải, lỗi, không đủ quyền
- Chữ và nhãn
- Quyền theo vai
- Điện thoại

## Dùng khi

Màn có một danh sách ngắn (vài chục dòng) mà mỗi dòng là một người hay một thứ, người dùng nhìn từng dòng và làm một việc
ngay trên dòng ấy — thành viên của sàn.

## Không dùng

Danh sách hàng trăm dòng cần lọc, tìm và sửa từng ô như bảng tính (Bảng hàng, Đã gửi, Liên hệ): dùng họ Lưới
(`design/patterns/luoi.md`).

## Ví dụ sai

```tsx
<ItemGroup className="gap-0">
  <Item className="px-4 not-first:before:h-px">…</Item>
</ItemGroup>
```

Phủ lớp kiểu lên thành phần gốc để kẻ dòng như khối ReUI: kho cấm sửa dáng thành phần nhà cung cấp; kẻ dòng bằng phần bọc
thường (`divide-y`) và để `Item` giữ khoảng cách của nó.
