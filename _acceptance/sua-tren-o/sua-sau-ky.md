# 4 · Sửa sau chữ ký

Chủ kho ký Cổng Bằng chứng của hàng 4 ngày 14/11/2026. Dưới đây là mọi chỗ đổi sau chữ ký, mỗi chỗ có phép của giám sát
và được chủ kho soi ở Cổng Bằng chứng của hàng mang nó.

## Hàng 5 (Dán từ Excel), 15/11/2026

| Chỗ | Người dùng thấy khác gì | Bài kiểm | Phép |
| --- | --- | --- | --- |
| Luật «giá hoàn tác được» thành một hàm của tệp luật hàng 4 (`priceUndoable`, `src/modules/listings/edit-rules.ts`); ô sửa đơn (`src/modules/listings/ui/use-listing-cell-edit.tsx`) và ô dán cùng gọi nó | Có: sửa giá trên ô cho một căn **chưa có giá** nay báo «Đã đổi … Không hoàn tác được.» và không có nút Hoàn tác. Trước đây có nút, nhưng bấm thì luôn hỏng và báo nhầm «không đủ quyền», vì cửa lưu không nhận thay đổi «xoá giá». Căn đã có giá: như cũ, vẫn có Hoàn tác | `src/modules/listings/ui/listing-cell-edit.test.tsx` — «a price set on a listing with none offers no undo» (sau); đối chứng: «shows the new price at once, saves through the door, and undo puts it back» (căn có giá, vẫn hoàn tác). Phá thử: bỏ hàm thì ca thứ nhất đỏ | G-1511-28; trình ở Cổng Bằng chứng hàng 5, mục «Đổi hành vi của hàng 4 đã ký» |
| Hàm gấp chữ của bộ đọc giá tách thành `foldWords` (cùng tệp), bộ đọc chữ trạng thái của hàng 5 gọi chung | Không | Bài đọc giá của hàng 4 (`edit-rules.test.ts`) giữ nguyên, xanh | Hội đồng E2b, hàng 5 vòng 1 |
| Hàm `priceSwing`, `statusNeeds` không đổi; hàng 5 chỉ gọi thêm | Không | — | — |
