---
schema_version: 1
slug: app-shell-chon-tu-reui
feature: Nhân viên sàn làm việc trong một App Shell chọn từ ReUI Pro, giữ đủ thanh bên theo vai, băng báo và các trạng thái toàn trang đang có
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1o
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1o của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền

Nhân viên sàn làm việc trong một App Shell chọn từ ReUI Pro, giữ đủ thanh bên theo vai, băng báo và các trạng thái toàn trang đang có

Vì sao: Quyết định 0023: App Shell hiện là thanh bên shadcn mở rộng, dựng khi kho còn rỗng. Chủ kho chốt ngày 11/11/2026: dùng app-shell-8, giữ cả hai cột; các phần còn lại quyết trên bản bấm được, không quyết bằng chữ

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thẻ Phạm vi bày hai đến ba App Shell của ReUI kèm ảnh ở bốn khổ, trong đó có app-shell-8; App Shell được chọn có dòng trong sổ khối; mọi màn đang có vẫn qua bộ bài kiểm chung ở bốn khổ, sáng và tối; thanh bên vẫn hiện đủ mục của mọi vai người giữ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thẻ Phạm vi bày hai đến ba App Shell của ReUI kèm ảnh ở bốn khổ, trong đó có app-shell-8; App Shell được chọn có dòng trong sổ khối; mọi màn đang có vẫn qua bộ bài kiểm chung ở bốn khổ, sáng và tối; thanh bên vẫn hiện đủ mục của mọi vai người giữ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thẻ Phạm vi bày hai đến ba App Shell của ReUI kèm ảnh ở bốn khổ, trong đó có app-shell-8; App Shell được chọn có dòng trong sổ khối; mọi màn đang có vẫn qua bộ bài kiểm chung ở bốn khổ, sáng và tối; thanh bên vẫn hiện đủ mục của mọi vai người giữ» khi hết timebox
- Timebox: …
