---
schema_version: 1
slug: so-do-moi-vong
feature: Mỗi vòng giao diện máy ghi một bản số đo, một lệnh gộp theo tầng, và có mốc đối chứng trước khi dựng nền
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build
decided_by: Manh Phan
decided_at: 2026-11-10T22:42:45Z
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1h
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1h của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` — chưa có trang: trang nền, mã F12

Mỗi vòng giao diện máy ghi một bản số đo, một lệnh gộp theo tầng, và có mốc đối chứng trước khi dựng nền

Vì sao: Quyết định 0019: đợt này là đợt chạy thật cho kit, cần số so được với mốc

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Thiếu bản số đo ở vòng giao diện thì đỏ; báo cáo tách theo tầng thay cho một tỉ lệ chung; ba agent độc lập lập phương án một màn chưa có mẫu và ghi mốc trước khi hàng 1a gộp» chưa?
- Kết quả nào là SỐNG: [đề xuất] Thiếu bản số đo ở vòng giao diện thì đỏ; báo cáo tách theo tầng thay cho một tỉ lệ chung; ba agent độc lập lập phương án một màn chưa có mẫu và ghi mốc trước khi hàng 1a gộp
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Thiếu bản số đo ở vòng giao diện thì đỏ; báo cáo tách theo tầng thay cho một tỉ lệ chung; ba agent độc lập lập phương án một màn chưa có mẫu và ghi mốc trước khi hàng 1a gộp» khi hết timebox
- Timebox: …
