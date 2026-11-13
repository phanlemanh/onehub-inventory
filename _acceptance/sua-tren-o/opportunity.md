---
schema_version: 1
slug: sua-tren-o
feature: Đầu chủ sửa giá và trạng thái ngay trên ô, thấy lỗi ngay tại ô đó
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T03:05:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 4
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 4 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/sua-tren-o-va-dan-excel.md#ee36a80ed61c208a8fbe943fe56c79cde5122c40`

Đầu chủ sửa giá và trạng thái ngay trên ô, thấy lỗi ngay tại ô đó

Vì sao: Thay thao tác sửa trên Sheet

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Hoàn tác hỏng thì báo rõ, kể cả khi mất mạng; bài rào «màn tự dựng lại hành vi» đọc đúng tệp .ts (việc phụ K-5 của hàng 1e)» chưa?
- Kết quả nào là SỐNG: [đề xuất] Hoàn tác hỏng thì báo rõ, kể cả khi mất mạng; bài rào «màn tự dựng lại hành vi» đọc đúng tệp .ts (việc phụ K-5 của hàng 1e)
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Hoàn tác hỏng thì báo rõ, kể cả khi mất mạng; bài rào «màn tự dựng lại hành vi» đọc đúng tệp .ts (việc phụ K-5 của hàng 1e)» khi hết timebox
- Timebox: …
