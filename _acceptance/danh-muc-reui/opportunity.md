---
schema_version: 1
slug: danh-muc-reui
feature: Agent tra được danh mục ReUI Pro ngay trong kho theo phiên bản đã ghim, không phụ thuộc kết nối ngoài
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1g
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1g của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã F11

Agent tra được danh mục ReUI Pro ngay trong kho theo phiên bản đã ghim, không phụ thuộc kết nối ngoài

Vì sao: Quyết định 0019: thang ưu tiên chỉ đáng tin khi tra được thật

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Một lệnh sinh lại danh mục từ bản ReUI đã ghim; khối có trong danh mục mà tra không ra thì đỏ; danh mục chỉ có tên và mô tả, không có mã nguồn hay licence» chưa?
- Kết quả nào là SỐNG: [đề xuất] Một lệnh sinh lại danh mục từ bản ReUI đã ghim; khối có trong danh mục mà tra không ra thì đỏ; danh mục chỉ có tên và mô tả, không có mã nguồn hay licence
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Một lệnh sinh lại danh mục từ bản ReUI đã ghim; khối có trong danh mục mà tra không ra thì đỏ; danh mục chỉ có tên và mô tả, không có mã nguồn hay licence» khi hết timebox
- Timebox: …
