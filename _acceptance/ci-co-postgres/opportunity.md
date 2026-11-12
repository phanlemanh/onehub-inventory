---
schema_version: 1
slug: ci-co-postgres
feature: CI chạy các bài trình duyệt có đăng nhập trên một Postgres riêng của lượt, để bộ kiểm chung đo được màn cần đăng nhập ngay trên CI
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1s
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1s của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

CI chạy các bài trình duyệt có đăng nhập trên một Postgres riêng của lượt, để bộ kiểm chung đo được màn cần đăng nhập ngay trên CI

Vì sao: Chủ kho duyệt Cổng Phạm vi hàng 1r ngày 2026-11-12: lượt có phiên chạy ở máy dãy và lượt chấm, việc đưa Postgres lên CI thành hàng riêng trước hàng 10. Hàng 2 vừa hỏng một ca chỉ hiện trên CI. Tệp CI do chủ kho sửa

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Trên CI lượt có phiên đo mọi màn cần đăng nhập, in «bỏ qua cần đăng nhập: 0»; một ca phá (bỏ phiên thử) làm ô kiểm đỏ; thời gian CI tăng không quá mức chủ kho chốt ở Cổng Phạm vi» chưa?
- Kết quả nào là SỐNG: [đề xuất] Trên CI lượt có phiên đo mọi màn cần đăng nhập, in «bỏ qua cần đăng nhập: 0»; một ca phá (bỏ phiên thử) làm ô kiểm đỏ; thời gian CI tăng không quá mức chủ kho chốt ở Cổng Phạm vi
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Trên CI lượt có phiên đo mọi màn cần đăng nhập, in «bỏ qua cần đăng nhập: 0»; một ca phá (bỏ phiên thử) làm ô kiểm đỏ; thời gian CI tăng không quá mức chủ kho chốt ở Cổng Phạm vi» khi hết timebox
- Timebox: …
