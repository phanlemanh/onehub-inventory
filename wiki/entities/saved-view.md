---
type: entity
title: SavedView (Góc nhìn)
links: [ontology/entities/SavedView.yaml]
sources: ["_acceptance/luu-goc-nhin-cot-hai/contract.md", "https://dd.reso.org/DD2.1/"]
---

# SavedView (Góc nhìn)

## Definition

Một cách xem một màn Lưới mà một người đặt tên và lưu: chữ trong ô tìm, lọc từng cột, sắp xếp, có nhóm hay không, các cột
ẩn. Hiện thành một mục ở cột thứ hai của App Shell và mở lại đúng cách xem ấy. Không phải RESO `SavedSearch` (tiêu chí tìm
của khách để báo căn mới).

## Rules

Chỉ người lưu thấy, mở, đổi tên, lưu thay đổi hay xoá góc nhìn của mình, và chỉ khi bảng quyền cho (bốn thao tác
`listSavedViews`, `saveView`, `editView`, `removeView`, phạm vi «của tôi» cho Đầu chủ, Đầu khách, Trưởng nhóm). Tên cắt
khoảng trắng hai đầu, 1–40 ký tự, không trùng (không phân biệt hoa thường) trong góc nhìn của cùng người trên cùng màn.
Không gồm toàn màn hình, ô đang chọn, nhóm đang mở, vị trí cuộn.

## Where in the code

`src/modules/listings/` (`saved-view.ts` khuôn và luật tên, `saved-views.ts` đọc ghi, `saved-views-http.ts` cửa API),
bảng `saved_view` trong `db/migrations/009_goc_nhin.sql`, cửa `/api/v1/saved-views`.

## History

Thêm ở hàng 2c (lưu góc nhìn ở cột thứ hai), 12/11/2026.
