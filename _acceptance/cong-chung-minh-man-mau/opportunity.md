---
schema_version: 1
slug: cong-chung-minh-man-mau
feature: Vòng dựng màn phải chứng minh giải được và đồng nhất với màn mẫu trước khi trình, rời khỏi thang Trong kho, ReUI, Vẽ tay thì phải nêu căn cứ
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1c
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1c của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã F8

Vòng dựng màn phải chứng minh giải được và đồng nhất với màn mẫu trước khi trình, rời khỏi thang Trong kho, ReUI, Vẽ tay thì phải nêu căn cứ

Vì sao: Quyết định 0019: thay cổng chọn khối của Quỹ hàng, vốn chấm đồng nhất theo tên thành phần

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Màn thuộc họ đã có mà thiếu ảnh cạnh màn mẫu hoặc còn chỗ lệch vô cớ thì đỏ; họ mới thiếu hai hướng thì đỏ; rơi xuống bậc dưới mà thiếu căn cứ thì đỏ; phát lại ca màn Liên hệ của Quỹ hàng thì bị gắn cờ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Màn thuộc họ đã có mà thiếu ảnh cạnh màn mẫu hoặc còn chỗ lệch vô cớ thì đỏ; họ mới thiếu hai hướng thì đỏ; rơi xuống bậc dưới mà thiếu căn cứ thì đỏ; phát lại ca màn Liên hệ của Quỹ hàng thì bị gắn cờ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Màn thuộc họ đã có mà thiếu ảnh cạnh màn mẫu hoặc còn chỗ lệch vô cớ thì đỏ; họ mới thiếu hai hướng thì đỏ; rơi xuống bậc dưới mà thiếu căn cứ thì đỏ; phát lại ca màn Liên hệ của Quỹ hàng thì bị gắn cờ» khi hết timebox
- Timebox: …
