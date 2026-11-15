---
schema_version: 1
slug: lien-he-tren-luoi
feature: Đầu chủ và Đầu khách mở màn Liên hệ và thấy liên hệ của sàn trên Lưới, thêm, sửa, gỡ được liên hệ và gộp được hai liên hệ trùng, theo quyền của vai
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-15T02:47:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 13a
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 13a của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ và Đầu khách mở màn Liên hệ và thấy liên hệ của sàn trên Lưới, thêm, sửa, gỡ được liên hệ và gộp được hai liên hệ trùng, theo quyền của vai

Vì sao: Bản rà soát thêm · xem · sửa · xoá theo vai ngày 2026-11-14: sổ màn khai màn Liên hệ là «dự kiến» từ hàng 1d nhưng không hàng lộ trình nào dựng màn ấy; dòng quyền gộp liên hệ có từ hàng 9e mà không hàng nào nhận; liên hệ chỉ được tạo ngầm qua hàng 13 và hàng 18. Bản rà soát đề xuất một hàng T3 «Liên hệ trên Lưới» đứng trước hàng 18b, để hàng 18b chỉ còn xoá dữ liệu cá nhân. Đứng sau hàng 13 vì liên hệ đầu tiên là chủ nhà ghi ở hàng 13. Chủ kho 2026-11-15 ở Cổng Đáng của đợt hàng kế: «Cho cả đợt»

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Màn Liên hệ mở được cho vai có quyền xem liên hệ, vai khác thấy «Không đủ quyền»; danh sách dùng Lưới chung của họ Lưới, lọc ở ô dưới tiêu đề cột (hàng 2e); liên hệ có đủ vòng đời trên màn này: xem, thêm, sửa, gỡ và gộp hai bản ghi của cùng một người thành một, nút đi qua bộ nút theo quyền của hàng 9e và đúng các ô của bảng quyền; gỡ thì liên hệ rời danh sách, còn ghi ai gỡ và lúc nào; xoá dữ liệu cá nhân theo yêu cầu để hàng 18b; đủ bốn khổ màn hình» chưa?
- Kết quả nào là SỐNG: [đề xuất] Màn Liên hệ mở được cho vai có quyền xem liên hệ, vai khác thấy «Không đủ quyền»; danh sách dùng Lưới chung của họ Lưới, lọc ở ô dưới tiêu đề cột (hàng 2e); liên hệ có đủ vòng đời trên màn này: xem, thêm, sửa, gỡ và gộp hai bản ghi của cùng một người thành một, nút đi qua bộ nút theo quyền của hàng 9e và đúng các ô của bảng quyền; gỡ thì liên hệ rời danh sách, còn ghi ai gỡ và lúc nào; xoá dữ liệu cá nhân theo yêu cầu để hàng 18b; đủ bốn khổ màn hình
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Màn Liên hệ mở được cho vai có quyền xem liên hệ, vai khác thấy «Không đủ quyền»; danh sách dùng Lưới chung của họ Lưới, lọc ở ô dưới tiêu đề cột (hàng 2e); liên hệ có đủ vòng đời trên màn này: xem, thêm, sửa, gỡ và gộp hai bản ghi của cùng một người thành một, nút đi qua bộ nút theo quyền của hàng 9e và đúng các ô của bảng quyền; gỡ thì liên hệ rời danh sách, còn ghi ai gỡ và lúc nào; xoá dữ liệu cá nhân theo yêu cầu để hàng 18b; đủ bốn khổ màn hình» khi hết timebox
- Timebox: …
