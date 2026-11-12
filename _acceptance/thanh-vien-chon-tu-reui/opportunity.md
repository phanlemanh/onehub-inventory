---
schema_version: 1
slug: thanh-vien-chon-tu-reui
feature: Quản trị sàn xem danh sách người và mời người trên màn Thành viên chọn từ kho và ReUI Pro, quyền và luật mời giữ nguyên
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 9c
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 9c của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền

Quản trị sàn xem danh sách người và mời người trên màn Thành viên chọn từ kho và ReUI Pro, quyền và luật mời giữ nguyên

Vì sao: Quyết định 0023: màn Thành viên và hộp mời ghép tay, họ của màn để rỗng nên không so với màn danh sách nào; Quỹ hàng đã chọn solution-users-8

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thẻ Phạm vi nêu họ của màn và bày ứng viên: khuôn Lưới của kho, solution-users-8, hộp mời dialog-2; mọi bài kiểm quyền và mời của hàng 9 vẫn xanh, không đổi lời» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thẻ Phạm vi nêu họ của màn và bày ứng viên: khuôn Lưới của kho, solution-users-8, hộp mời dialog-2; mọi bài kiểm quyền và mời của hàng 9 vẫn xanh, không đổi lời
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thẻ Phạm vi nêu họ của màn và bày ứng viên: khuôn Lưới của kho, solution-users-8, hộp mời dialog-2; mọi bài kiểm quyền và mời của hàng 9 vẫn xanh, không đổi lời» khi hết timebox
- Timebox: …
