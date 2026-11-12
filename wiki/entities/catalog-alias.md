---
type: entity
title: CatalogAlias (Mã gốc)
links: [ontology/entities/CatalogAlias.yaml]
sources: ["_acceptance/danh-muc-can-nhu-onehub-invest/contract.md", "https://dd.reso.org/DD2.1/"]
---

# CatalogAlias (Mã gốc)

## Definition

Mã gốc hay tên của toà, trục, căn mà một nguồn đã viết, dạng `<dự án>/<MÃ VIẾT HOA>`, giữ làm bí danh. Riêng của ta, như `registry_aliases` của onehub-invest.

## Rules

Mã gốc còn hiệu lực là duy nhất theo nguồn, loại, giá trị; mã đã ngừng thêm lại được (luật `one-active-original-code`).

## Where in the code

`src/modules/catalog/`, bảng trong `db/migrations/007_danh_muc_nhu_invest.sql`.

## History

Thêm ở hàng 7d (danh mục căn lưu như onehub-invest), 12/11/2026.
