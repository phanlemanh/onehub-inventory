---
type: entity
title: Contact (Liên hệ)
links: [ontology/entities/Contact.yaml]
sources: [onehub-quy-hang/CONTEXT.md, "https://dd.reso.org/DD2.1/Contacts/"]
---

# Contact (Liên hệ)

## Definition

Một người làm việc với sàn: một người, nhiều số, một hay nhiều loại liên hệ, một người giữ. Ứng với tài nguyên `Contacts`
của RESO; DD 2.1 vẫn dùng tên số nhiều.

## Rules

Chủ nhà, người mua, người thuê là loại của liên hệ, không phải bản ghi riêng.

Số điện thoại nằm ở liên hệ (thuộc tính `phones`, dữ liệu cá nhân), không nằm ở căn hay lần chào: đổi số một lần thì
mọi căn của người đó thấy số mới ([0020](../decisions/0020-linked-sample-data-ocean-park.md)). Nhiều số của một người
nối bằng `", "` trong một chuỗi, vì ontology chưa có kiểu danh sách.

## Where in the code

`src/modules/contacts/` — mới có dữ liệu mẫu và kho liên hệ mẫu (`sample.ts`).

## History

Thêm `phones` cùng dữ liệu mẫu Ocean Park, 11/11/2026 (hàng lộ trình 1, `_acceptance/du-lieu-mau/`).

Lấy từ từ vựng của Quỹ hàng khi dựng kho, 09/11/2026. Bỏ luật giữ thông tin chủ nhà trong công ty cho MVP, xem [0014](../decisions/0014-mvp-product-rules.md).
