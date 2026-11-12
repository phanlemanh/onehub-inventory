---
schema_version: 1
slug: bang-hang-theo-dia-ly
feature: "Đầu chủ đi Bảng hàng theo địa lý: chọn dự án, phân khu, toà ở cột thứ hai của App Shell và lọc các cột địa lý trên bảng"
owner: phanlemanh@gmail.com
stage: discovery              # discovery | decided | archived
decision:         # build | iterate | park | kill — người ký Cổng 0 điền
decided_by:
decided_at:     # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 2d
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 2d của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ đi Bảng hàng theo địa lý: chọn dự án, phân khu, toà ở cột thứ hai của App Shell và lọc các cột địa lý trên bảng

Vì sao: Chủ kho 2026-11-12 nêu lối làm việc theo địa lý trong phiên dãy K: đầu chủ nghĩ theo dự án → phân khu → toà, như mỗi khu một tab ở Sheet. Cần cấp phân khu của hàng 7d

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Cột thứ hai hiện cây dự án → phân khu → toà kèm số căn; chọn một nút thì bảng lọc đúng tập căn và nút sáng lên; lọc cột địa lý trên bảng và cây ở cột thứ hai luôn khớp nhau; thẻ Phạm vi bày ứng viên ReUI cho cây kèm ảnh theo quyết định 0023» chưa?
- Kết quả nào là SỐNG: [đề xuất] Cột thứ hai hiện cây dự án → phân khu → toà kèm số căn; chọn một nút thì bảng lọc đúng tập căn và nút sáng lên; lọc cột địa lý trên bảng và cây ở cột thứ hai luôn khớp nhau; thẻ Phạm vi bày ứng viên ReUI cho cây kèm ảnh theo quyết định 0023
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Cột thứ hai hiện cây dự án → phân khu → toà kèm số căn; chọn một nút thì bảng lọc đúng tập căn và nút sáng lên; lọc cột địa lý trên bảng và cây ở cột thứ hai luôn khớp nhau; thẻ Phạm vi bày ứng viên ReUI cho cây kèm ảnh theo quyết định 0023» khi hết timebox
- Timebox: …
