---
schema_version: 1
slug: don-no-bo-kiem
feature: "Bộ kiểm của kho hết bốn nợ làm hàng khác đỏ oan: cổng mạng bị cấm, cảnh báo dựng trang lệch, việc Release đỏ sau mỗi lần gộp, và hai trang quyết định trùng số"
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T09:38:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 1u
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 1u của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Bộ kiểm của kho hết bốn nợ làm hàng khác đỏ oan: cổng mạng bị cấm, cảnh báo dựng trang lệch, việc Release đỏ sau mỗi lần gộp, và hai trang quyết định trùng số

Vì sao: Bốn nợ ghi ở sổ đợt nen 2026-11-15: bài kiểm trình duyệt chọn trúng cổng 3659 «Bad port» chừng 1 trên 400 lượt; 15 cảnh báo Hydration trên nhánh chính; việc Release đỏ ở ba lần gộp gần nhất; hai trang quyết định cùng số 0034. Chủ kho 2026-11-15 ở Cổng Đáng: «Cho cả gói, build»

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Khoảng chọn cổng của bài kiểm trình duyệt loại các cổng trình duyệt cấm, có bài kiểm quét cả khoảng; bài trình duyệt trên nhánh chính không còn cảnh báo «Hydration failed» và có bài kiểm đỏ khi cảnh báo ấy xuất hiện lại; hai trang quyết định cùng số 0034 được đánh lại số và có phép kiểm chặn trùng số; việc Release: máy soạn bản đề xuất và nêu nguyên nhân, chủ kho đặt tệp (máy không sửa .github/workflows/)» chưa?
- Kết quả nào là SỐNG: [đề xuất] Khoảng chọn cổng của bài kiểm trình duyệt loại các cổng trình duyệt cấm, có bài kiểm quét cả khoảng; bài trình duyệt trên nhánh chính không còn cảnh báo «Hydration failed» và có bài kiểm đỏ khi cảnh báo ấy xuất hiện lại; hai trang quyết định cùng số 0034 được đánh lại số và có phép kiểm chặn trùng số; việc Release: máy soạn bản đề xuất và nêu nguyên nhân, chủ kho đặt tệp (máy không sửa .github/workflows/)
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Khoảng chọn cổng của bài kiểm trình duyệt loại các cổng trình duyệt cấm, có bài kiểm quét cả khoảng; bài trình duyệt trên nhánh chính không còn cảnh báo «Hydration failed» và có bài kiểm đỏ khi cảnh báo ấy xuất hiện lại; hai trang quyết định cùng số 0034 được đánh lại số và có phép kiểm chặn trùng số; việc Release: máy soạn bản đề xuất và nêu nguyên nhân, chủ kho đặt tệp (máy không sửa .github/workflows/)» khi hết timebox
- Timebox: …
