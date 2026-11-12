---
schema_version: 1
slug: bang-hang-dung-tay-nhu-sheet
feature: "Đầu chủ dùng Bảng hàng bằng tay như Sheet: đi giữa các ô bằng phím mũi tên, bôi một vùng ô rồi chép sang Zalo hay Excel, bấm tiêu đề để sắp xếp, lọc từng cột, nhóm dòng theo toà, ẩn hiện cột"
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T01:49:02Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 2a
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 2a của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#eda65bbab423f707ecfec5947798f0f1d04fb0db` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ dùng Bảng hàng bằng tay như Sheet: đi giữa các ô bằng phím mũi tên, bôi một vùng ô rồi chép sang Zalo hay Excel, bấm tiêu đề để sắp xếp, lọc từng cột, nhóm dòng theo toà, ẩn hiện cột

Vì sao: Chủ kho 2026-11-11: Bảng hàng phải giữ thói quen Sheet của đầu chủ, mục đích gốc của Quỹ hàng. Lớp hai sau «đọc như Sheet» của hàng 2; sáu lối tắt theo trạng thái ở cột thứ hai của App Shell chờ bộ lọc này

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Phím mũi tên, Tab, Home, End đưa ô chọn đi đúng và bảng cuộn theo; bôi vùng rồi chép ra đúng chữ tách cột; sắp xếp và lọc từng cột cho đúng tập dòng trên 60 căn mẫu; nhóm theo toà giữ số dòng đếm liền; lối tắt trạng thái ở cột thứ hai mở Bảng hàng đã lọc đúng trạng thái; thứ tự trạng thái ở hai nơi là một» chưa?
- Kết quả nào là SỐNG: [đề xuất] Phím mũi tên, Tab, Home, End đưa ô chọn đi đúng và bảng cuộn theo; bôi vùng rồi chép ra đúng chữ tách cột; sắp xếp và lọc từng cột cho đúng tập dòng trên 60 căn mẫu; nhóm theo toà giữ số dòng đếm liền; lối tắt trạng thái ở cột thứ hai mở Bảng hàng đã lọc đúng trạng thái; thứ tự trạng thái ở hai nơi là một
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Phím mũi tên, Tab, Home, End đưa ô chọn đi đúng và bảng cuộn theo; bôi vùng rồi chép ra đúng chữ tách cột; sắp xếp và lọc từng cột cho đúng tập dòng trên 60 căn mẫu; nhóm theo toà giữ số dòng đếm liền; lối tắt trạng thái ở cột thứ hai mở Bảng hàng đã lọc đúng trạng thái; thứ tự trạng thái ở hai nơi là một» khi hết timebox
- Timebox: …
