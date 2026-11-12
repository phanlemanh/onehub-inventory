---
type: entity
title: Building (Toà)
links: [ontology/entities/Building.yaml]
sources: ["_acceptance/danh-muc-can-nhu-onehub-invest/contract.md", "https://dd.reso.org/DD2.1/"]
---

# Building (Toà)

## Definition

Toà trong danh mục dùng chung, RESO `Building`: khoá `BuildingKey` dạng `bld_` + 26 ký tự Crockford, tên `BuildingName`. Đứng dưới phân khu khi biết, không thì thẳng dưới dự án.

## Rules

Khoá cấp một lần, không suy từ nội dung (luật `prefixed-keys`); mã toà người gõ là bí danh, không phải khoá.

## Where in the code

`src/modules/catalog/`, bảng trong `db/migrations/007_danh_muc_nhu_invest.sql`.

## History

Thêm ở hàng 7d (danh mục căn lưu như onehub-invest), 12/11/2026.
