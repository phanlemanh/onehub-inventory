---
schema_version: 1
slug: sua-thong-tin-can
feature: Đầu chủ sửa được thông tin của căn ngoài giá và trạng thái — pháp lý, nội thất, tài chính, tình trạng sử dụng — ngay trong sản phẩm, không phải nhập lại tệp
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 3g
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 3g của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ sửa được thông tin của căn ngoài giá và trạng thái — pháp lý, nội thất, tài chính, tình trạng sử dụng — ngay trong sản phẩm, không phải nhập lại tệp

Vì sao: Bản rà soát thêm · xem · sửa · xoá theo vai ngày 2026-11-14: hàng 4 và hàng 3d chỉ cho sửa giá và trạng thái; pháp lý, nội thất, tài chính, tình trạng sử dụng không hàng nào cho điền ngoài đường nhập tệp, dù hồ sơ căn của hàng 3b đã hiện bốn trường ấy. Đứng trước hàng 15 vì điều kiện Sẵn sàng bán đòi pháp lý và tình trạng sử dụng. Luật sửa, câu lỗi và hoàn tác đã có ở hàng 4; chỗ sửa — trên ô hay trong hồ sơ căn — chốt ở Cổng Phạm vi của hàng. Chủ kho 2026-11-15 ở Cổng Đáng của đợt hàng kế: «Cho cả đợt»

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Vai được sửa căn điền và đổi được pháp lý, nội thất, tài chính, tình trạng sử dụng của lần chào đang mở, ở máy tính và điện thoại; lưu xong thì hồ sơ căn và mức đủ thông tin hiện giá trị mới; kiểm tra, câu lỗi và hoàn tác dùng đúng luật của hàng 4, không viết luật thứ hai; nút sửa chỉ hiện cho vai được sửa, qua bộ nút theo quyền của hàng 9e; căn điền đủ pháp lý và tình trạng sử dụng ở đây thì không còn thiếu hai phần ấy khi sang hàng 15» chưa?
- Kết quả nào là SỐNG: [đề xuất] Vai được sửa căn điền và đổi được pháp lý, nội thất, tài chính, tình trạng sử dụng của lần chào đang mở, ở máy tính và điện thoại; lưu xong thì hồ sơ căn và mức đủ thông tin hiện giá trị mới; kiểm tra, câu lỗi và hoàn tác dùng đúng luật của hàng 4, không viết luật thứ hai; nút sửa chỉ hiện cho vai được sửa, qua bộ nút theo quyền của hàng 9e; căn điền đủ pháp lý và tình trạng sử dụng ở đây thì không còn thiếu hai phần ấy khi sang hàng 15
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Vai được sửa căn điền và đổi được pháp lý, nội thất, tài chính, tình trạng sử dụng của lần chào đang mở, ở máy tính và điện thoại; lưu xong thì hồ sơ căn và mức đủ thông tin hiện giá trị mới; kiểm tra, câu lỗi và hoàn tác dùng đúng luật của hàng 4, không viết luật thứ hai; nút sửa chỉ hiện cho vai được sửa, qua bộ nút theo quyền của hàng 9e; căn điền đủ pháp lý và tình trạng sử dụng ở đây thì không còn thiếu hai phần ấy khi sang hàng 15» khi hết timebox
- Timebox: …
