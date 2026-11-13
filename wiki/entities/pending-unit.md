---
type: entity
title: PendingUnit (Căn chờ khớp)
links:
  [
    ontology/entities/PendingUnit.yaml,
    wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md,
  ]
sources:
  [
    "_acceptance/lop-rieng-cua-san/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
  ]
---

# PendingUnit (Căn chờ khớp)

## Definition

Căn sàn có mà danh mục chung chưa có, giữ nguyên mã sàn gõ; dùng được ngay.

## Rules

Tra mã trong sàn đi bốn nguồn: mã riêng → mã gốc → bộ đọc 8 dạng → căn chờ khớp. Khớp: tra danh mục trên mã của căn chờ, ra đúng một căn thì ghi khoá căn; không ra hay ra nhiều thì vẫn chờ. Danh mục chung không đổi dòng nào; khoá căn luôn trỏ căn có thật.

## Where in the code

`src/modules/company-config/`, bảng trong `db/migrations/010_lop_rieng_cua_san.sql`, ghi qua `/api/v1/company-layer`.

## History

Thêm ở hàng 7e (lớp riêng của sàn), 13/11/2026; chủ kho duyệt phạm vi và kế hoạch cùng ngày.
