---
type: entity
title: Unit (Căn)
links: [ontology/entities/Unit.yaml]
sources: [onehub-quy-hang/CONTEXT.md, "https://dd.reso.org/DD2.1/Property/"]
---

# Unit (Căn)

## Definition

Vật thể trong danh mục dùng chung: khu → toà → trục → căn. Danh mục dùng chung mọi sàn nên căn không có `company_id`.
Trường theo RESO `Property`; RESO không có tài nguyên riêng cho căn.

## Rules

Loại hình chỉ gồm bốn cặp `PropertyType` / `PropertySubType` đã chốt. Khi chuyển mô-đun danh mục cần chốt: toà có ánh xạ
tài nguyên `Building` mới ở DD 2.1 không, và căn cho thuê có dùng `Residential Lease` không.

## Where in the code

`src/modules/catalog/` (chưa chuyển mã).

## History

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026.
