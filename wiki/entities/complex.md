---
type: entity
title: Complex (Phân khu)
links: [ontology/entities/Complex.yaml]
sources: ["_acceptance/danh-muc-can-nhu-onehub-invest/contract.md", "https://dd.reso.org/DD2.1/"]
---

# Complex (Phân khu)

## Definition

Phân khu của một dự án, RESO `Building.ComplexName`. Lưu ở `catalog_nodes` với `node_type = complex`.

## Rules

Cha của phân khu luôn là một dự án; phân khu không làm cha của phân khu (luật `complex-under-project`).

## Where in the code

`src/modules/catalog/`, bảng trong `db/migrations/007_danh_muc_nhu_invest.sql`.

## History

Thêm ở hàng 7d (danh mục căn lưu như onehub-invest), 12/11/2026.
