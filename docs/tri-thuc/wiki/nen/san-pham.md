---
loai: nen
ma: []
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Sản phẩm: vì sao có kho này

Chưng cất từ Quỹ hàng, commit `1729b11f`. Đường `qh:` tính từ gốc kho Quỹ hàng (kho riêng, chỉ trỏ, không chép). Đường
không tiền tố là của kho này.

## Vì sao có

- Hàng thật của thị trường nằm trong Google Sheet và nhóm Zalo của môi giới, không nằm trên nền tảng. Ý tưởng: làm công cụ
  tốt hơn Sheet cho việc hằng ngày, để hàng tự chảy về thay vì bắt nhập thêm. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:13,25-29`
- Việc thật là: khách hỏi thì tìm ra căn khớp và gửi được trong vài phút, trước khi khách hỏi người khác, mà không lộ nguồn
  chủ nhà. `qh:docs/product/tham-chieu.md:12`
- Sàn chạy như dây chuyền (gọi lọc chủ nhà → đầu chủ → bảng hàng chung → đầu khách), không phải một người giữ sổ.
  `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:9-11`

## Ai dùng và làm việc gì

- Trong sàn: Đầu chủ biến lead thành hàng và giữ tươi; Đầu khách tìm căn, gửi khách; Trưởng nhóm chia việc, bàn giao; Quản
  trị sàn cấu hình. Ngoài sàn: khách chỉ xem căn được gửi. `qh:docs/product/tham-chieu.md:26-33`
- Đầu chủ làm trên máy tính, đầu khách dùng điện thoại; trang khách luôn điện thoại trước vì khách mở từ Zalo. Một người
  giữ được nhiều vai. `qh:docs/product/tham-chieu.md:24,35,39-42`

## Thói quen phải giữ

- Người ta bám Sheet vì: tự do thêm cột, tô màu; bảng hàng vốn đến dạng Excel nên chép dán rẻ nhất; một link cho cả đội;
  file là của họ. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:43-49`
- Sheet thua ở: hai bản giữ tay lệch nhau, các bản «cập nhật 14h» trôi trong nhóm Zalo, và trên điện thoại lúc đứng với
  khách thì gần như không dùng được. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:51`
- Chỗ Sheet và Zalo được thay: tab mỗi khu → góc nhìn lưu; cột ngày gọi, tab «gọi lại» → Hôm nay; tô màu, tab «đã bán» →
  trạng thái có tên; gửi ảnh + chữ → link có ghi công; chụp Sheet gửi nhóm → xuất bảng hàng; ghi chú dài trong một ô → hồ
  sơ căn; ảnh rải rác trong tin nhắn với chủ nhà → mục ảnh của căn.
  `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:86,95,124-148`
- Nhóm Zalo vẫn là kênh của người: máy không đăng hộ, không trả lời hộ. `qh:docs/product/tham-chieu.md:167`

## Quỹ hàng đã chọn gì

- Năm chỗ thắng Sheet: gõ mã căn là đủ thông tin; giá luôn kèm điều kiện phí; độ tươi tự tính; gửi khách bằng link sống;
  nguồn chủ nhà giữ kín ngay trong sàn. `qh:docs/product/tham-chieu.md:13`
- Thước «bỏ hẳn Sheet»: bản đầu xong khi một đội bỏ hẳn Google Sheet cho một khu trong hai tuần và không muốn quay lại; số
  đo đầu bảng là số ngày Sheet cũ không được sửa. `qh:docs/product/tham-chieu.md:16,295-299`
- Con số đề xuất, chưa ký: Sheet 14/14 ngày không sửa; ≥ 70% người có việc ≥ 3 ngày ở tuần hai; ≥ 60% căn xác nhận trong
  14 ngày; trung vị khách hỏi → gửi ≤ 5 phút; ≥ 30 link thật, ≥ 50% được mở. Dừng khi dưới 10/14 hay một lần rò nguồn.
  `qh:docs/plan/mvp-mo-dan.md:45,50,54`

## Lỗi đã gặp

- Ý tưởng tự đăng, tự trả lời trên Zalo va luật an toàn đã chốt và bị bỏ. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:77-81`
- Các ghi chép đầu (ba tab và màn Nhập Excel) dùng bốn bộ trạng thái khác nhau; gỡ bằng một vòng đời sáu trạng thái chung.
  `qh:docs/product/ghi-chep/2026-10-29-kien-truc-thong-tin.md:14`
- Chặn lên bán khi thiếu ảnh làm mọi căn chuyển từ Sheet kẹt ngay bước đầu; bỏ «tạo căn tay» rồi phải mở lại, vì thêm một
  dòng là thao tác thường nhất của Sheet. `qh:docs/product/tham-chieu.md:421-423`

## MVP này giữ gì, bỏ gì

- Đích đợt 1: «bỏ Sheet, gửi link» cho một sàn, một khu căn hộ. `docs/plan/pham-vi-mvp-dot-1.md:1-3`
- Giữ: Bảng hàng thay chính Sheet, nhập Excel thay chép dán, Hôm nay thay cột ngày gọi, link trang khách thay ảnh chụp Sheet
  gửi Zalo. Cắt: góc nhìn lưu (L7), ngoại tuyến (L1), Telesales và nhà Liên hệ (L2), nhập có AI (L5).
  `docs/plan/pham-vi-mvp-dot-1.md:36-73`
- Năm việc dùng để đo đợt: nhập một file Excel; tìm căn và sửa giá; ghi kết quả gọi; gửi link; khách mở trên điện thoại.
  `docs/design-standard-proposal.md:178`
