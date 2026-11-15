---
schema_version: 1
slug: them-can
feature: Đầu chủ gõ mã căn để thêm căn, hoặc tạo căn tay khi danh mục chưa có
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 12
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 12 của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e` · `wiki/chu-de/nhap-excel.md#178e754304d853b9c5f0488055f664d10e0f3416`

Đầu chủ gõ mã căn để thêm căn, hoặc tạo căn tay khi danh mục chưa có

Vì sao: Đưa từng căn vào ngoài đường nhập tệp

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Căn thêm ở hàng này có đủ vòng đời, ghi đích danh vế nào ở hàng nào: thêm ở hàng này — gõ mã căn có trong danh mục, hoặc tạo căn tay thành căn chờ khớp của sàn (hàng 7e) khi danh mục chưa có; xem trên Bảng hàng và hồ sơ căn; sửa giá và trạng thái theo hàng 4, sửa thông tin khác ở hàng 3g; gỡ căn tạo nhầm để hàng 18b; đưa lên bán để hàng 15» chưa?
- Kết quả nào là SỐNG: [đề xuất] Căn thêm ở hàng này có đủ vòng đời, ghi đích danh vế nào ở hàng nào: thêm ở hàng này — gõ mã căn có trong danh mục, hoặc tạo căn tay thành căn chờ khớp của sàn (hàng 7e) khi danh mục chưa có; xem trên Bảng hàng và hồ sơ căn; sửa giá và trạng thái theo hàng 4, sửa thông tin khác ở hàng 3g; gỡ căn tạo nhầm để hàng 18b; đưa lên bán để hàng 15
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Căn thêm ở hàng này có đủ vòng đời, ghi đích danh vế nào ở hàng nào: thêm ở hàng này — gõ mã căn có trong danh mục, hoặc tạo căn tay thành căn chờ khớp của sàn (hàng 7e) khi danh mục chưa có; xem trên Bảng hàng và hồ sơ căn; sửa giá và trạng thái theo hàng 4, sửa thông tin khác ở hàng 3g; gỡ căn tạo nhầm để hàng 18b; đưa lên bán để hàng 15» khi hết timebox
- Timebox: …
