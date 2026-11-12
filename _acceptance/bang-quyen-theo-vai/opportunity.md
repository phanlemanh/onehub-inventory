---
schema_version: 1
slug: bang-quyen-theo-vai
feature: Mọi thao tác đọc và ghi đều được quyết định từ một bảng quyền theo vai, phạm vi và trạng thái
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 9a
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 9a của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#eda65bbab423f707ecfec5947798f0f1d04fb0db` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/nguoi-dung-va-vai.md#f785968333a4fabf5463c2073be5628f92a5d42a`

Mọi thao tác đọc và ghi đều được quyết định từ một bảng quyền theo vai, phạm vi và trạng thái

Vì sao: Quyết định 0016: không có bảng chung thì từng hàng tự đặt quyền, như lỗi ai đọc được hàng là sửa được giá ở Quỹ hàng

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Bài kiểm gọi từng thao tác bằng từng vai ở API và cơ sở dữ liệu, khớp đủ 100% ô của bảng; thêm một thao tác ghi không có dòng trong bảng thì bài kiểm đỏ» chưa?
- Kết quả nào là SỐNG: [đề xuất] Bài kiểm gọi từng thao tác bằng từng vai ở API và cơ sở dữ liệu, khớp đủ 100% ô của bảng; thêm một thao tác ghi không có dòng trong bảng thì bài kiểm đỏ
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Bài kiểm gọi từng thao tác bằng từng vai ở API và cơ sở dữ liệu, khớp đủ 100% ô của bảng; thêm một thao tác ghi không có dòng trong bảng thì bài kiểm đỏ» khi hết timebox
- Timebox: …
