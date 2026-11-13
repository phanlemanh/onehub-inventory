---
schema_version: 1
slug: bo-o-tim-cua-vung
feature: Đầu chủ và Đầu khách lọc mọi bảng họ Lưới chỉ bằng cách gõ vào ô lọc dưới tiêu đề cột như ở Sheet; ô «Gõ để tìm» của vùng không còn trên màn nào của họ Lưới — Bảng hàng, Đã gửi, sau này Liên hệ; tìm thì dùng ô ⌘K ở thanh trên của App Shell (hàng 3f)
owner: phanlemanh@gmail.com
stage: decided              # discovery | decided | archived
decision: build   # build | iterate | park | kill — người ký Cổng 0 điền
decided_by: Manh Phan
decided_at: 2026-11-13T02:05:00Z   # ISO UTC
prototype:
  base_commit:     # điểm cắt nhánh proto khỏi nhánh chính — guard diffBase khi keep
  disposition:     # keep | archive
lo_trinh_ma: 2e
lo_trinh_tep: docs/plan/lo-trinh.json
---

## Vấn đề & ai gặp

Mở từ hàng 2e của «Lộ trình onehub-inventory» (`docs/plan/lo-trinh.json`).
Nguồn: `wiki/nen/muc-luc.md#62c011273645275c4ecd1728afe0a36626484e09` · `wiki/nen/san-pham.md#7e0f870248935f95f71cf9300b1a0f7e5f2d1eb0` · `wiki/dot/mvp-dot-1.md#adb1cba497edd0ad0fd877ee7bf608aeabd4d83e`

Đầu chủ và Đầu khách lọc mọi bảng họ Lưới chỉ bằng cách gõ vào ô lọc dưới tiêu đề cột như ở Sheet; ô «Gõ để tìm» của vùng không còn trên màn nào của họ Lưới — Bảng hàng, Đã gửi, sau này Liên hệ; tìm thì dùng ô ⌘K ở thanh trên của App Shell (hàng 3f)

Vì sao: Chủ kho 2026-11-13: «Tôi thấy một điểm chưa rõ ràng ở ux, bảng hàng đang hoạt động theo ux của sheet, nên khi tìm căn thì nó dùng luôn header của cột để input, tương tự ở từng cột, box search hiện nay chỉ gây confuse cho người dùng là khi nào dùng box search và khi nào gõ trên cột?» Trang so sánh các lối kèm ảnh chụp màn được bày ở một phiên thảo luận riêng; chủ kho chốt cùng ngày: «Đồng ý lối A, một điểm tôi muốn bổ sung là đưa search đúng vào (⌘K) ở thanh trên đây cũng là nơi shell đã có ux?». Lối A là bỏ ô tìm của vùng, chỉ còn lọc ở ô dưới tiêu đề cột. Đứng sau hàng 2a vì bộ lọc từng cột là của 2a, sau hàng 2c để cách xem đã lưu không mang chữ tìm; hàng 3f đứng trên hàng này vì ô ⌘K ở thanh trên là nơi tìm còn lại. Bộ bài kiểm sinh từ sổ màn đang gõ vào ô tìm và nằm trong thư mục công cụ của kho, nên hàng này là T3

## Ngưỡng chết / ngưỡng UAT

- Câu hỏi phép đo trả lời: [đề xuất] đã đạt «Lưới dùng chung không còn vẽ và không còn nhận ô tìm của vùng trên mọi màn họ Lưới, ở máy tính và điện thoại; trạng thái vùng «Tìm không ra» đổi tên thành «Không có dòng nào khớp» và vẫn có lối thoát «Xoá lọc»; ma trận trạng thái, bảng hành vi và khuôn Lưới ghi đúng như vậy; mọi bài kiểm đang gõ vào ô tìm được viết lại sang ô lọc dưới tiêu đề cột mà phép so không yếu đi; cách xem đã lưu của hàng 2c không mang chữ tìm; trên điện thoại vẫn còn hàng ô lọc dưới tiêu đề cột» chưa?
- Kết quả nào là SỐNG: [đề xuất] Lưới dùng chung không còn vẽ và không còn nhận ô tìm của vùng trên mọi màn họ Lưới, ở máy tính và điện thoại; trạng thái vùng «Tìm không ra» đổi tên thành «Không có dòng nào khớp» và vẫn có lối thoát «Xoá lọc»; ma trận trạng thái, bảng hành vi và khuôn Lưới ghi đúng như vậy; mọi bài kiểm đang gõ vào ô tìm được viết lại sang ô lọc dưới tiêu đề cột mà phép so không yếu đi; cách xem đã lưu của hàng 2c không mang chữ tìm; trên điện thoại vẫn còn hàng ô lọc dưới tiêu đề cột
- Kết quả nào là CHẾT: [đề xuất] chưa đạt «Lưới dùng chung không còn vẽ và không còn nhận ô tìm của vùng trên mọi màn họ Lưới, ở máy tính và điện thoại; trạng thái vùng «Tìm không ra» đổi tên thành «Không có dòng nào khớp» và vẫn có lối thoát «Xoá lọc»; ma trận trạng thái, bảng hành vi và khuôn Lưới ghi đúng như vậy; mọi bài kiểm đang gõ vào ô tìm được viết lại sang ô lọc dưới tiêu đề cột mà phép so không yếu đi; cách xem đã lưu của hàng 2c không mang chữ tìm; trên điện thoại vẫn còn hàng ô lọc dưới tiêu đề cột» khi hết timebox
- Timebox: …
