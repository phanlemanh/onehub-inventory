---
type: entity
title: CompanyValueAlias (Cách viết riêng)
links:
  [
    ontology/entities/CompanyValueAlias.yaml,
    wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md,
  ]
sources:
  [
    "_acceptance/lop-rieng-cua-san/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
  ]
---

# CompanyValueAlias (Cách viết riêng)

## Definition

Một cặp chữ sàn quen viết và giá trị chuẩn của một trường («ĐN» → Đông Nam). Các cặp của một sàn làm nên từ điển giá trị của sàn.

## Rules

Trường có tập giá trị đóng (trường chuẩn kiểu liệt kê, hay trường riêng chọn một đang dùng); giá trị thuộc tập ấy; một cặp đang dùng cho mỗi trường và chữ đã gấp (bỏ dấu, đ→d, chữ thường, gộp khoảng trắng). Trường riêng ngừng dùng hay lựa chọn bị bỏ thì cặp ấy thôi tra ra.

## Where in the code

`src/modules/company-config/`, bảng trong `db/migrations/010_lop_rieng_cua_san.sql`, ghi qua `/api/v1/company-layer`. Màn xem lại và sửa: `/tuy-chinh-san` (`src/modules/company-config/ui/`), nút theo bảng quyền như hàng 9e.

## History

Thêm ở hàng 7e (lớp riêng của sàn), 13/11/2026; chủ kho duyệt phạm vi và kế hoạch cùng ngày.
