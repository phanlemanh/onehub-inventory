---
type: entity
title: CompanyLabel (Nhãn riêng)
links:
  [
    ontology/entities/CompanyLabel.yaml,
    wiki/decisions/0029-cau-hinh-san-dua-vao-danh-tinh-va-danh-muc.md,
  ]
sources:
  [
    "_acceptance/lop-rieng-cua-san/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
  ]
---

# CompanyLabel (Nhãn riêng)

## Definition

Chữ một sàn dùng thay nhãn chuẩn của một khái niệm («Block» thay «Toà»). Bảng của sàn: có `company_id` và luật theo dòng; trang khách không đọc nhãn riêng (SP-4).

## Rules

Một nhãn đang dùng cho mỗi khái niệm; khái niệm là trường hay thực thể trong `ontology/labels.yaml`; chữ 1–40 ký tự. Ngừng dùng thì về nhãn chuẩn.

## Where in the code

`src/modules/company-config/`, bảng trong `db/migrations/010_lop_rieng_cua_san.sql`, ghi qua `/api/v1/company-layer`. Màn xem lại và sửa: `/tuy-chinh-san` (`src/modules/company-config/ui/`), nút theo bảng quyền như hàng 9e. Bảng hàng đọc nhãn riêng của sàn đang đăng nhập (`myCompanyLayer`, `labelOverrides`); trang gửi khách không đọc (bài `tests/lop-rieng-cot.test.ts`).

## History

Thêm ở hàng 7e (lớp riêng của sàn), 13/11/2026; chủ kho duyệt phạm vi và kế hoạch cùng ngày.
