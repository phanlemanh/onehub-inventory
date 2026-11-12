---
type: entity
title: CompanyCatalogAlias (Mã riêng)
links: [ontology/entities/CompanyCatalogAlias.yaml]
sources: ["_acceptance/danh-muc-can-nhu-onehub-invest/contract.md", "https://dd.reso.org/DD2.1/"]
---

# CompanyCatalogAlias (Mã riêng)

## Definition

Mã hay tên một sàn tự gọi toà, căn của danh mục dùng chung. Bảng của sàn: có `company_id` và luật theo dòng; danh mục dùng chung không đổi.

## Rules

Trỏ đúng một toà hay một căn có thật; duy nhất theo sàn, loại, giá trị; sàn khác dùng được cùng chữ cho đối tượng khác. Tra mã theo thứ tự: mã riêng của sàn → mã gốc → bộ đọc 8 dạng (luật `code-lookup-order`).

## Where in the code

`src/modules/catalog/`, bảng trong `db/migrations/007_danh_muc_nhu_invest.sql`.

## History

Thêm ở hàng 7d (danh mục căn lưu như onehub-invest), 12/11/2026.
