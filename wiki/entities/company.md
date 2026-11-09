---
type: entity
title: Company (Sàn)
links: [ontology/entities/Company.yaml]
sources: [onehub-quy-hang/CONTEXT.md, onehub-quy-hang/docs/adr/0001-khoi-diem.md]
---

# Company (Sàn)

## Definition

Công ty môi giới dùng sản phẩm, và là đơn vị cách ly dữ liệu. RESO không có khái niệm tương đương: `Office` là danh
sách văn phòng thành viên của MLS, `OUID` là mã định danh để trao đổi dữ liệu.

## Rules

Mọi bảng của công ty có `company_id` và ép luật theo dòng. Một yêu cầu chỉ thấy một công ty.

## Where in the code

`src/modules/identity/` (chưa chuyển mã).

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026.
