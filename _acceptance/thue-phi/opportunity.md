---
schema_version: 1
slug: thue-phi
feature: Quản trị sàn đặt Thuế phí và thấy Bảng hàng tính theo mức đó
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T02:16:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 19
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 19 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/cai-dat-san.md#9094aae581befe2f04c4eadadc7c10df192c1227`

Quản trị sàn đặt Thuế phí và thấy Bảng hàng tính theo mức đó

Vì sao: Phải đặt trước khi nhập tệp của sàn

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: …
- Kết quả nào là SỐNG: …
- Kết quả nào là CHẾT: …
- Timebox: …
