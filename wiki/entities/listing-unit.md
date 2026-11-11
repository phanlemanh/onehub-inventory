---
type: entity
title: ListingUnit (Căn của hàng)
links: [ontology/entities/ListingUnit.yaml]
sources: ["_acceptance/khai-lien-ket-chao-can/design.md"]
---

# ListingUnit (Căn của hàng)

## Definition

Liên kết một lần chào với căn trong danh mục dùng chung mà nó chào, trong một sàn. Đây là cách quan hệ
`Unit offered_as Listing` được lưu. Riêng của ta.

## Rules

Mỗi lần chào có đúng một liên kết căn, cùng sàn với lần chào.

## Where in the code

`src/modules/listings/` — kiểu sinh ở `src/generated/ontology.ts`, dữ liệu mẫu và bộ kiểm ở `sample.ts`.

## History

Khai ngày 11/11/2026 (hàng lộ trình 1j, `_acceptance/khai-lien-ket-chao-can/`); trước đó là kiểu viết tay trong mã.
