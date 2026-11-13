---
type: entity
title: ImportTemplate (Mẫu nhập)
links:
  [
    ontology/entities/ImportTemplate.yaml,
    wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md,
  ]
sources:
  [
    "_acceptance/lop-rieng-cua-san/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
  ]
---

# ImportTemplate (Mẫu nhập)

## Definition

Dạng tệp Sheet một sàn đã nhập (tên cột theo thứ tự) và cột nào đi vào đâu: trường chuẩn, trường riêng, hay bỏ cột có chủ ý.

## Rules

Chữ ký là tên cột đã gấp theo đúng thứ tự; một mẫu đang dùng cho mỗi chữ ký; đích phải có thật; cột trỏ trường riêng đã ngừng mang dấu để màn nhập (hàng 11) hỏi lại. Tạo mới chỉ qua màn nhập.

## Where in the code

`src/modules/company-config/`, bảng trong `db/migrations/010_lop_rieng_cua_san.sql`, ghi qua `/api/v1/company-layer`.

## History

Thêm ở hàng 7e (lớp riêng của sàn), 13/11/2026; chủ kho duyệt phạm vi và kế hoạch cùng ngày.
