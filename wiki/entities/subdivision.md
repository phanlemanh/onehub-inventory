---
type: entity
title: Subdivision (Dự án)
links: [ontology/entities/Subdivision.yaml]
sources: ["_acceptance/danh-muc-can-nhu-onehub-invest/contract.md", "https://dd.reso.org/DD2.1/"]
---

# Subdivision (Dự án)

## Definition

Gốc của danh mục dùng chung, RESO `SubdivisionName`. Mọi sàn đọc, không sàn nào sửa; không có `company_id`. Lưu ở `catalog_nodes` với `node_type = project`, như `asset_nodes` của onehub-invest.

## Rules

Dự án không có cha.

## Where in the code

`src/modules/catalog/`, bảng trong `db/migrations/007_danh_muc_nhu_invest.sql`.

## History

Thêm ở hàng 7d (danh mục căn lưu như onehub-invest), 12/11/2026.
