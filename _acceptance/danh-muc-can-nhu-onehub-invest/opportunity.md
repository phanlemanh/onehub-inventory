---
schema_version: 1
slug: danh-muc-can-nhu-onehub-invest
feature: "Danh mục căn dùng chung lưu cùng cách với onehub-invest: có cấp phân khu dưới dự án, tầng lưu theo RESO, toà · trục · căn có khoá riêng, mã căn gốc giữ làm bí danh"
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build       # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T08:25:47Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 7d
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 7d của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Danh mục căn dùng chung lưu cùng cách với onehub-invest: có cấp phân khu dưới dự án, tầng lưu theo RESO, toà · trục · căn có khoá riêng, mã căn gốc giữ làm bí danh

Vì sao: Chủ kho đồng ý đề xuất trong phiên dãy K ngày 2026-11-12 sau khi so hai kho: hai sản phẩm phải đọc chung một danh mục căn. Đi trước «Bảng hàng theo địa lý» (2d) và trước khi nối dữ liệu thật; giữ khoá sàn mà onehub-invest không có. Đổi ontology nên cần chủ kho soi

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Danh mục có cấp phân khu (RESO Building.ComplexName) là con của dự án; tầng lưu dạng chữ theo RESO UnitFloorLocation; toà, trục, căn có khoá riêng có tiền tố; mã căn gốc giữ làm bí danh và bộ đọc tách được nhiều dạng mã; 60 căn mẫu chuyển sang không mất căn nào; bộ kiểm cách ly vẫn xanh với danh mục dùng chung là ngoại lệ đã khai» chưa?
- Kết quả nào là SỐNG: [đề xuất] Danh mục có cấp phân khu (RESO Building.ComplexName) là con của dự án; tầng lưu dạng chữ theo RESO UnitFloorLocation; toà, trục, căn có khoá riêng có tiền tố; mã căn gốc giữ làm bí danh và bộ đọc tách được nhiều dạng mã; 60 căn mẫu chuyển sang không mất căn nào; bộ kiểm cách ly vẫn xanh với danh mục dùng chung là ngoại lệ đã khai
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Danh mục có cấp phân khu (RESO Building.ComplexName) là con của dự án; tầng lưu dạng chữ theo RESO UnitFloorLocation; toà, trục, căn có khoá riêng có tiền tố; mã căn gốc giữ làm bí danh và bộ đọc tách được nhiều dạng mã; 60 căn mẫu chuyển sang không mất căn nào; bộ kiểm cách ly vẫn xanh với danh mục dùng chung là ngoại lệ đã khai» khi hết timebox
- Timebox: …
