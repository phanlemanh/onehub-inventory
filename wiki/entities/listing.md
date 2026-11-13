---
type: entity
title: Listing (Hàng)
links: [ontology/entities/Listing.yaml]
sources: [onehub-quy-hang/CONTEXT.md, "https://dd.reso.org/DD2.1/Property/StandardStatus/"]
---

# Listing (Hàng)

## Definition

Một lần chào bán hay cho thuê của sàn trên một căn. Ứng với tài nguyên `Property` của RESO. Đây là «Hàng», không phải
«Tin» (tin là của Invest).

## Rules

Sáu trạng thái chuẩn là tập con hợp lệ của `StandardStatus` trong DD 2.1. Sàn thêm nhãn riêng neo vào sáu giá trị này,
không thêm giá trị thứ bảy. Đã bán bắt buộc giá chốt và ngày bán; Ngừng hẳn bắt buộc lý do.

## Where in the code

`src/modules/listings/`: luật sửa giá và trạng thái ở `edit-rules.ts`, cổng lưu ở `save-door.ts`, sửa trên ô của Bảng hàng ở `ui/use-listing-cell-edit.tsx`.

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026.

Hàng 9e, 12/11/2026: bảng quyền có dòng nháp `removeListing` — «Xoá căn» là gỡ khỏi danh sách, giữ dấu vết (sửa đổi của [0016](../decisions/0016-permission-model.md)).

Hàng 4, 13/11/2026: sửa Giá chào và Trạng thái trên ô của Bảng hàng. Mười hai lối chuyển trạng thái; Đã bán và Ngừng hẳn là nấc cuối, Đã bán khoá cả giá; Ngừng hẳn hỏi Lý do ngừng (ba lý do, khái niệm riêng). Mọi lần sửa đi qua một cổng lưu bốn kết cục; hôm nay ghi vào dữ liệu mẫu trong bộ nhớ, hàng 10 cắm đường ghi thật.
Hàng 3e, 13/11/2026: hồ sơ căn có nút «Hỏi đầu chủ» (người giữ căn) và «Báo sai thông tin» (thuộc tính danh mục). Ai giữ căn
chưa có trong mô hình: tới hàng 10 dùng dữ liệu mẫu `sampleKeeperOf` (`src/modules/listings/sample.ts`); hai tin soạn ở
`src/modules/listings/messages.ts`.
