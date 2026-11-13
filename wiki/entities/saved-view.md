---
type: entity
title: SavedView (Góc nhìn)
links: [ontology/entities/SavedView.yaml]
sources: ["_acceptance/luu-goc-nhin-cot-hai/contract.md", "https://dd.reso.org/DD2.1/"]
---

# SavedView (Góc nhìn)

## Definition

Một cách xem một màn Lưới mà một người đặt tên và lưu: lọc từng cột, sắp xếp, có nhóm hay không, các cột ẩn. Chữ trong ô
tìm không thuộc góc nhìn (chủ kho chốt 2026-11-13: việc tìm chuyển lên ô ⌘K ở thanh trên; migration 011). Hiện thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy. Không phải RESO `SavedSearch` (tiêu chí tìm
của khách để báo căn mới).

## Rules

Chỉ người lưu thấy, mở, đổi tên, lưu thay đổi hay xoá góc nhìn của mình, và chỉ khi bảng quyền cho (bốn thao tác
`listSavedViews`, `saveView`, `editView`, `removeView`, phạm vi «của tôi» cho Đầu chủ, Đầu khách, Trưởng nhóm). Tên cắt
khoảng trắng hai đầu, 1–40 ký tự, không trùng (không phân biệt hoa thường) trong góc nhìn của cùng người trên cùng màn.
Không gồm chữ tìm, toàn màn hình, ô đang chọn, nhóm đang mở, vị trí cuộn.

Địa chỉ của một góc nhìn là `/inventory?goc-nhin=<id>`: tải lại hay mở ở phiên khác ra đúng cách xem; góc nhìn đã xoá hay
của người khác mở Bảng hàng trống lọc kèm câu «… không còn». Đổi cách xem của góc nhìn đang mở thì mục mang dấu «đã đổi»
và nút lưu thành «Lưu thay đổi» và «Lưu thành mới»; không gì tự lưu. Bấm lại mục đang mở là bỏ thay đổi chưa lưu.

## Where in the code

`src/modules/listings/` (`saved-view.ts` khuôn và luật tên, `saved-views.ts` đọc ghi, `saved-views-http.ts` cửa API),
bảng `saved_view` trong `db/migrations/009_goc_nhin.sql` (khuôn bốn thứ ở `011_goc_nhin_bon_thu.sql`), cửa `/api/v1/saved-views`. Giao diện: `src/modules/listings/ui/`
(`save-view-buttons.tsx`, `saved-view-menu.tsx`, `saved-views-section.tsx`, `view-name-dialog.tsx`); lưới dùng chung nhận
cách xem qua `initialView` và `onViewChange` (`src/components/candidate/grid-view.ts`, `data-region.tsx`); cột thứ hai nhận
nhóm từ `src/app/(app)/layout.tsx` và dấu «đã đổi» qua `src/components/templates/app-shell/place-change.tsx`.

## History

Thêm ở hàng 2c (lưu góc nhìn ở cột thứ hai), 12/11/2026; giao diện 13/11/2026.
