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

Ở MVP, thoả thuận chỉ dùng cho nguồn danh mục, xem [0014](../decisions/0014-mvp-product-rules.md). Mọi kết nối là một thoả thuận, không
viết mã riêng cho từng bên.

Bảng thoả thuận nhận đủ tám loại của mô hình (migration 005) và giữ hai chốt chép từ Quỹ hàng, nay có tên trong mô
hình: lớp «nguồn» không bao giờ nằm trong một thoả thuận (`source-class-never-leaves`), và thoả thuận mang dữ liệu nội
bộ chỉ đi chiều vào (`internal-data-inbound-only`). Hai chốt này không phải luật sản phẩm của MVP (0014); bài kiểm
`tests/db/cach-ly.db.test.ts` đỏ khi bảng và mô hình lệch nhau.

## Where in the code

`src/modules/agreements/` (chưa chuyển mã).

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026. Bỏ luật chặn lớp `source` cho MVP cùng ngày.
12/11/2026 (hàng 7a): bảng nhận đủ tám loại; hai chốt của bảng được ghi vào mô hình, chủ kho chọn ở Cổng Phạm vi.
