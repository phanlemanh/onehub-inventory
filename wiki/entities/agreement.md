---
type: entity
title: Agreement (Thoả thuận)
links: [ontology/entities/Agreement.yaml]
sources: [onehub-quy-hang/CONTEXT.md, onehub-quy-hang/docs/adr/0001-khoi-diem.md]
---

# Agreement (Thoả thuận)

## Definition

Cho phép một loại kết nối chảy theo một chiều, cho các lớp dữ liệu, trong một thời hạn. Đây không phải lookup
`ListingAgreement` của RESO, vốn nói về loại hợp đồng niêm yết.

## Rules

Không thoả thuận nào được chứa lớp `source`; chặn ở cả luật lõi và cơ sở dữ liệu. Mọi kết nối là một thoả thuận, không
viết mã riêng cho từng bên.

## Where in the code

`src/modules/agreements/` (chưa chuyển mã).

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026.
