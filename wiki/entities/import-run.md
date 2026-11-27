---
type: entity
title: ImportRun (Lần nhập)
links:
  [
    ontology/entities/ImportRun.yaml,
    ontology/entities/ImportTemplate.yaml,
    ontology/entities/PendingUnit.yaml,
  ]
sources:
  [
    "_acceptance/nhap-excel/contract.md",
    "_acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md",
    "docs/tri-thuc/wiki/chu-de/nhap-excel.md",
  ]
---

# ImportRun (Lần nhập)

## Definition

Một lần người trong sàn nạp tệp bảng tính (`.xlsx`, `.csv`) vào Bảng hàng: ai nạp, cho đầu chủ nào, dạng tệp, thêm bao
nhiêu căn, sàn học được gì từ lựa chọn của người, ô nào giữ chữ gốc, đã hoàn tác chưa. Không phải bản thân tệp — tệp được
đọc trên trình duyệt và không lên máy chủ.

## Rules

- Năm chỗ ghép: cột, tên cột, giá trị, căn, dạng tệp; mỗi ô đúng một dấu (giữ nguyên · máy sửa · cần người · chặn) và
  một đích; còn ô chặn thì không áp được.
- Áp theo gói 200 dòng; gửi lại một gói không ghi trùng; sàn học một lần sau gói cuối.
- Hoàn tác gỡ các căn của lần nhập chưa ai sửa, ngừng dùng những gì chính lần nhập dạy, và liệt kê căn được giữ.
- Cột thuộc tính căn (diện tích, phòng ngủ, hướng, tầng, loại hình) được nhận nhưng không ghi vào căn hay danh mục
  chung: chữ gốc giữ nguyên văn trong bản ghi lần nhập (`kept`, lý do `unit-attribute`) cho hàng 3h đọc lại (G-2711-4).
- Không AI.

## Where in the code

`src/modules/imports/` (luật dấu, lưu lần nhập, cửa `/api/v1/imports`), bảng `import_runs` ở migration 015. Lần chào tạo
qua cửa server của `src/modules/listings/`; phần học qua `src/modules/company-config/` và `src/modules/catalog/`.

## History

- 2026-11-17 — Thêm ở hàng 11 «Nhập Excel» (`_acceptance/nhap-excel/`), chủ kho duyệt Cổng Phạm vi.
- 2026-11-27 — Thêm hai chỗ ghép Tầng và Loại hình, giữ chữ gốc trong bản ghi lần nhập (G-2711-4, lời chủ kho «Tin rao
  giữ giá trị riêng»); Bảng hàng có nút «Nạp tệp» cho vai được nhập và liên kết trong câu trạng thái trống.
