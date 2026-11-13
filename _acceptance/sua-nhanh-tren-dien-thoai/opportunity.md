---
schema_version: 1
slug: sua-nhanh-tren-dien-thoai
feature: Đầu chủ đổi giá và đổi trạng thái ngay trong hồ sơ căn trên điện thoại, theo cùng luật với sửa trên ô của Bảng hàng
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-12T22:20:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3d
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3d của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ đổi giá và đổi trạng thái ngay trong hồ sơ căn trên điện thoại, theo cùng luật với sửa trên ô của Bảng hàng

Vì sao: Chủ kho 2026-11-12 ở Cổng Đáng của năm hàng tách ra khi so hồ sơ căn của Quỹ hàng với hàng 3 «Hồ sơ căn»: «Build cả năm hàng». Hàng 4 chỉ sửa trên ô của Bảng hàng, mà trên điện thoại Bảng hàng là danh sách thẻ (hàng 2b), không có ô để sửa; Quỹ hàng cho chạm khối giá và huy hiệu trạng thái trong hồ sơ để mở ngăn sửa từ đáy màn. Luật sửa đã có ở hàng 4, hàng này chỉ thêm lối sửa thứ hai

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Ở 360 và 414 chạm khối giá trong hồ sơ mở ngăn từ đáy màn có ô giá, giá đổi nhiều thì hỏi lại trước khi lưu; chạm huy hiệu trạng thái chỉ hiện các nấc được phép đi tới từ nấc hiện tại, Đã bán đòi giá chốt và ngày bán, Ngừng hẳn đòi lý do; căn Đã bán khoá sửa giá và nói lý do; kiểm tra, câu lỗi và hoàn tác dùng đúng luật của hàng 4, không viết luật thứ hai; nút sửa chỉ hiện cho vai được sửa, qua bộ nút theo quyền của hàng 9e; lưu xong thì hồ sơ và thẻ trên danh sách cùng hiện giá trị mới» chưa?
- Kết quả nào là SỐNG: [đề xuất] Ở 360 và 414 chạm khối giá trong hồ sơ mở ngăn từ đáy màn có ô giá, giá đổi nhiều thì hỏi lại trước khi lưu; chạm huy hiệu trạng thái chỉ hiện các nấc được phép đi tới từ nấc hiện tại, Đã bán đòi giá chốt và ngày bán, Ngừng hẳn đòi lý do; căn Đã bán khoá sửa giá và nói lý do; kiểm tra, câu lỗi và hoàn tác dùng đúng luật của hàng 4, không viết luật thứ hai; nút sửa chỉ hiện cho vai được sửa, qua bộ nút theo quyền của hàng 9e; lưu xong thì hồ sơ và thẻ trên danh sách cùng hiện giá trị mới
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Ở 360 và 414 chạm khối giá trong hồ sơ mở ngăn từ đáy màn có ô giá, giá đổi nhiều thì hỏi lại trước khi lưu; chạm huy hiệu trạng thái chỉ hiện các nấc được phép đi tới từ nấc hiện tại, Đã bán đòi giá chốt và ngày bán, Ngừng hẳn đòi lý do; căn Đã bán khoá sửa giá và nói lý do; kiểm tra, câu lỗi và hoàn tác dùng đúng luật của hàng 4, không viết luật thứ hai; nút sửa chỉ hiện cho vai được sửa, qua bộ nút theo quyền của hàng 9e; lưu xong thì hồ sơ và thẻ trên danh sách cùng hiện giá trị mới» khi hết timebox
- Timebox: …
