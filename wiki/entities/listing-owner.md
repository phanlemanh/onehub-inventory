---
type: entity
title: ListingOwner (Chủ của hàng)
links: [ontology/entities/ListingOwner.yaml]
sources: ["_acceptance/khai-lien-ket-chao-can/design.md", "https://dd.reso.org/DD2.1/"]
---

# ListingOwner (Chủ của hàng)

## Definition

Một liên hệ là chủ của một lần chào, theo vai bên bán (`Seller`) hay bên cho thuê (`Landlord`), trong một sàn. Đây là
cách quan hệ `Contact owns Listing` được lưu. Riêng của ta: RESO `ContactListings` là danh sách lần chào môi giới gửi cho
một liên hệ xem, nghĩa khác.

## Rules

Liên kết, liên hệ và lần chào cùng một sàn. Vai chỉ là bên bán hay bên cho thuê; người mua, người thuê không phải chủ.

## Where in the code

`src/modules/contacts/` — kiểu sinh ở `src/generated/ontology.ts`, dữ liệu mẫu và bộ kiểm ở `sample.ts`.

## History

Khai ngày 11/11/2026 (hàng lộ trình 1j, `_acceptance/khai-lien-ket-chao-can/`); trước đó là kiểu viết tay `OwnerLink`.
