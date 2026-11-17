---
type: entity
title: ListingPendingUnit (Hàng căn chờ)
links:
  [
    ontology/entities/ListingPendingUnit.yaml,
    ontology/entities/ListingUnit.yaml,
    ontology/entities/PendingUnit.yaml,
  ]
sources: ["_acceptance/nhap-excel/contract.md"]
---

# ListingPendingUnit (Hàng căn chờ)

## Definition

Liên kết một lần chào với căn chờ khớp của sàn, khi danh mục chung chưa có căn ấy. Mỗi lần chào có đúng một liên kết
căn: với căn danh mục (`ListingUnit`) hoặc với căn chờ khớp (liên kết này).

## Rules

- Đúng một liên kết căn mỗi lần chào, cùng sàn; mỗi căn chờ khớp một lần chào mở trong một sàn.
- Danh mục chung không đổi khi lần nhập tạo căn chờ khớp.

## Where in the code

Bảng `listing_pending_units` ở migration 015; tạo qua `createListings` ở `src/modules/listings/create.ts` (hàng 11).

## History

- 2026-11-17 — Thêm ở hàng 11 «Nhập Excel» để căn chưa có trong danh mục lên được Bảng hàng.
