---
nhom: danh-sach-khung
doi_tuong: Màn hay phần màn có một nhóm mục ngắn mà người quản trị xem từng dòng và chỉnh ngay trên dòng ấy.
khuon:
  ten: FramedList
  nhap: "@/components/candidate/framed-list"
nhan_dien:
  - "src/modules/identity/ui/members-list.tsx"
mau_dang_chay:
  tep: "src/components/candidate/framed-list.tsx"
khe_bat_buoc: [title, rows]
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

Khuôn là `FramedList` (`src/components/candidate/framed-list.tsx`); màn của họ chỉ điền khe, không thêm lớp kiểu.

## Khe

| Chỗ        | Khe                                                                                   | Bắt buộc | Ví dụ                               |
| ---------- | ------------------------------------------------------------------------------------- | -------- | ----------------------------------- |
| Đầu khung  | `title` — tên khung, cũng là tên đọc của danh sách                                    | có       | «Thành viên»                        |
| Đầu khung  | `count` — dòng đếm dưới tên                                                           | không    | «9 người trong sàn»                 |
| Đầu khung  | `headAction` — một nút ở đầu khung (việc chính của màn vẫn ở đầu màn)                 | không    | «Thêm khoản»                        |
| Dòng       | `main` — phần chính: ai hay cái gì, thường là `ListFace` (chữ cái đầu, tên, dòng nhỏ) | có       | tên và email                        |
| Dòng       | `secondary` — phần phụ: một cột chữ cố định, ẩn khi khung hẹp                         | không    | «Người mời: [Tên] · ngày»           |
| Dòng       | `tags` — nhãn ngắn                                                                    | không    | các vai                             |
| Dòng       | `control` — chỗ chỉnh cuối dòng: nút, công tắc hay ô số                               | không    | «Đổi vai», công tắc, ô phần trăm    |
| Chân khung | `footer.note` và `footer.action` — lời ghi chú bên trái, nút lưu bên phải             | không    | «Áp cho mọi căn từ hôm nay» · «Lưu» |

Cột theo bề rộng của chính khung: phần phụ hiện từ 56rem, dòng giữ một hàng từ 42rem, hẹp hơn thì phần chính lên một dòng
riêng.

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

Màn hay phần màn có một danh sách ngắn (vài chục dòng) mà mỗi dòng là một người hay một thứ, người dùng nhìn từng dòng
và chỉnh ngay trên dòng ấy — thành viên của sàn, các khoản thuế phí của sàn.

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
