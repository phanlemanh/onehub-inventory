---
type: entity
title: CustomField (Trường riêng)
links:
  [
    ontology/entities/CustomField.yaml,
    wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md,
  ]
sources:
  [
    "_acceptance/lop-rieng-cua-san/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
  ]
---

# CustomField (Trường riêng)

## Definition

Cột một sàn có mà chuẩn không có. Năm kiểu: chữ, số, ngày, chọn một, có/không. Giá trị nằm trên lần chào (thuộc tính `customFields`, lưu ở bảng lần chào từ hàng 10).

## Rules

Tối đa 20 trường đang dùng, giữ ở cả cửa và cơ sở dữ liệu; chọn một có 1–30 lựa chọn; mã cấp một lần, không đổi, không dùng lại; kiểu không đổi khi sửa; tên không trùng sau khi gấp chữ với trường riêng, nhãn riêng, tiêu đề chuẩn của Bảng hàng. Ngừng dùng không xoá giá trị cũ.

## Where in the code

`src/modules/company-config/`, bảng trong `db/migrations/010_lop_rieng_cua_san.sql`, ghi qua `/api/v1/company-layer`. Luật thuần ở `src/modules/company-config/rules.ts`.

## History

Thêm ở hàng 7e (lớp riêng của sàn), 13/11/2026; chủ kho duyệt phạm vi và kế hoạch cùng ngày.
