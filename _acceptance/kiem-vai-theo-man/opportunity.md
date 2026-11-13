---
schema_version: 1
slug: kiem-vai-theo-man
feature: Mỗi màn được kiểm bằng từng vai ở bốn khổ màn hình, vai không được vào thấy đúng Không đủ quyền và không lộ dữ liệu
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T02:16:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 9b
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 9b của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/bai-kiem-trinh-duyet.md#99f0ebf84e10558af3f9c7e3ab8ab2f05aaf17f8`

Mỗi màn được kiểm bằng từng vai ở bốn khổ màn hình, vai không được vào thấy đúng Không đủ quyền và không lộ dữ liệu

Vì sao: Quyết định 0017: bài chấm giao diện hiện không đăng nhập theo vai; cần đăng nhập thật và bảng quyền nên đứng sau hàng 9a

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Bộ kiểm trình duyệt đi đủ mọi cặp vai và màn trong sổ; gỡ chặn một cặp không được vào thì bộ kiểm đỏ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Bộ kiểm trình duyệt đi đủ mọi cặp vai và màn trong sổ; gỡ chặn một cặp không được vào thì bộ kiểm đỏ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Bộ kiểm trình duyệt đi đủ mọi cặp vai và màn trong sổ; gỡ chặn một cặp không được vào thì bộ kiểm đỏ» khi hết timebox
- Timebox: …
