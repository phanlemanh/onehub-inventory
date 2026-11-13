---
type: decision
title: Cấu hình sàn giữ lớp riêng, dựa vào danh tính và danh mục
links:
  [
    architecture/modules.yaml,
    src/modules/company-config/,
    db/migrations/010_lop_rieng_cua_san.sql,
    tools/ontology_codegen.py,
    _acceptance/lop-rieng-cua-san/contract.md,
  ]
sources:
  [
    _acceptance/lop-rieng-cua-san/decisions.jsonl,
    _acceptance/danh-muc-can-nhu-onehub-invest/de-xuat-nhap-la-luc-anh-xa.md,
    "giám sát đợt nền, cấp số 0029 (R-1311-9) và mở việc 1–5 (R-1311-19), 2026-11-13",
  ]
---

# 0029 Cấu hình sàn giữ lớp riêng, dựa vào danh tính và danh mục

## Status

Accepted, 2026-11-13, ở hàng 7e (lớp riêng của sàn). Chủ kho duyệt phạm vi và kế hoạch cùng ngày.

## Context

Chủ kho 12/11: «chuẩn hoá danh mục căn như onehub-invest … nhưng không cứng mà cho người dùng thêm trường riêng, nhãn
riêng» và «Khi Import vào thì đây chính là thời điểm mapping». Lõi giữ chuẩn; phần khác nhau của mỗi sàn phải là dữ liệu
ở một chỗ, có khoá sàn, ghi qua một cửa. Mô-đun `company-config` đã được khai cho việc ấy nhưng chưa sở hữu thực thể nào
và chưa dựa vào mô-đun nào.

## Decision

- `company-config` sở hữu năm thực thể: `CompanyLabel`, `CustomField`, `CompanyValueAlias`, `PendingUnit`,
  `ImportTemplate`; năm bảng của sàn ở migration 010, luật theo dòng ép buộc, vai API không có quyền xoá.
- `company-config` dựa vào `identity` (cửa thao tác dùng chung và `withCompany`, quyết định 0026) và `catalog` (bộ tra mã
  của hàng 7d, để tra bốn nguồn và khớp căn chờ). Không mô-đun nào khác ghi vào năm bảng.
- Căn chờ khớp không ghi vào danh mục chung: khớp chỉ ghi khoá căn vào dòng của sàn. Ba kẽ hở của danh mục để hàng đầu
  tiên ghi vào danh mục (hàng 12, hay 11).
- Bộ sinh mã từ mô hình nghiệp vụ có thêm kiểu `json` (chủ kho cho phép riêng khi duyệt kế hoạch) cho lựa chọn của trường
  riêng và giá trị trường riêng trên lần chào; nơi đọc kiểm hình dạng ở mép.
- Rào ADR-0018 của Quỹ hàng giữ: không đối tượng tự tạo, không công thức, không bộ máy luật hay quy trình.

## Consequences

- Hàng 10 thêm cột `custom_fields` vào bảng lần chào thật và gọi hàm kiểm giá trị của mô-đun này khi ghi.
- Hàng 11 ghi vào lớp riêng qua `/api/v1/company-layer` khi một lần nhập thành công, và tìm mẫu nhập theo dạng tệp.
- Màn Cài đặt sàn đầy đủ (H4) và trạng thái riêng của sàn vẫn để sau.
