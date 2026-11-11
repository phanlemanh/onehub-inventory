---
schema_version: 1
slug: bo-bai-kiem-tu-so-man
feature: Mỗi màn trong sổ có sẵn bộ bài kiểm trạng thái sinh ra từ sổ, kèm bài phá thử chứng minh bài kiểm đỏ được
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1f
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1f của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã F10

Mỗi màn trong sổ có sẵn bộ bài kiểm trạng thái sinh ra từ sổ, kèm bài phá thử chứng minh bài kiểm đỏ được

Vì sao: Quyết định 0019: 55% số lần làm lại ở Quỹ hàng là bài kiểm và hạ tầng

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thêm một màn vào sổ thì có bộ bài kiểm mà không viết tay; phá từng trạng thái thì bài kiểm tương ứng đỏ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thêm một màn vào sổ thì có bộ bài kiểm mà không viết tay; phá từng trạng thái thì bài kiểm tương ứng đỏ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thêm một màn vào sổ thì có bộ bài kiểm mà không viết tay; phá từng trạng thái thì bài kiểm tương ứng đỏ» khi hết timebox
- Timebox: …
