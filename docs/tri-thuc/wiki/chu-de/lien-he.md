---
loai: chu-de
ma: [G1, N9]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Liên hệ

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Trước ADR-0021, chủ nhà của căn và lead mang số riêng, không gì nói hai thứ là một người: chủ trùng phải đoán, chủ hai số
  thành hai người. `qh:docs/adr/0021-lien-he.md:10-14`
- Một chủ nhiều căn thì hai đầu chủ cùng gọi, mất uy tín. Luật: một chủ nhiều căn → một đầu chủ; một số chỉ thuộc một người
  trong sàn. `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:32` · `qh:docs/product/tham-chieu.md:69`

## Ai dùng và làm việc gì

- Nhà Liên hệ chỉ cho Đầu chủ (người mình giữ) và Trưởng nhóm (cả sàn). Đầu khách không đọc liên hệ.
  `qh:docs/product/tham-chieu.md:404` · `qh:docs/adr/0021-lien-he.md:62-64`
- Việc chính: tìm theo tên hay số, lọc theo loại, mở hồ sơ người xem Số · Cơ hội · Căn · Dòng thời gian.
  `qh:design/patterns/lien-he.md:18-22`

## Thói quen phải giữ

- Số chủ nhà là tài sản của đầu chủ, kể cả với đồng nghiệp cùng sàn.
  `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:17`
- Gọi mà quên hỏi thì phải kết bạn Zalo hỏi lại chủ nhà. `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:41`
- Trong Sheet, chủ nhà và số được ghi ở đâu (cột riêng, ghi chú hay ngoài Sheet): chưa xác nhận.

## Quỹ hàng đã chọn gì

- ADR-0021: mỗi người làm việc với sàn là một liên hệ theo RESO `Contacts`, nhiều loại trên một người, một đầu chủ giữ;
  nhiều số trên một người, có một số chính. `qh:docs/adr/0021-lien-he.md:18-26`
- Lead là dấu trên người chưa nói chuyện hai chiều; việc với một người là Cơ hội; căn sinh ra khi cơ hội bán lên bảng.
  `qh:docs/adr/0021-lien-he.md:92-100`
- Màn: Danh sách → chi tiết, lưới `solution-crm-3`, hồ sơ người `solution-crm-4`; số che chỉ ba số cuối, «Hiện số» mỗi lần là
  một sự kiện, không lưu trên máy, không vào địa chỉ. `qh:design/patterns/lien-he.md:17-22,31-33`

## Lỗi đã gặp

- Căn tạo từ lead trả tên chủ trống thay vì báo «chưa có chủ nhà». `qh:_acceptance/va-lien-he/contract.md:3,20,35-36`
- Bảng hàng và Liên hệ lệch nhau 43 chỗ mà máy báo 0 lệch. `docs/design-standard-proposal.md:12`
- Chữ «liên hệ» thành tên đối tượng nên nút «Liên hệ đầu chủ» va nghĩa, phải giao một hàng hỏi đổi nhãn. `qh:docs/adr/0021-lien-he.md:50`

## MVP này giữ gì, bỏ gì

- Giữ G1 số chủ nhà trên hồ sơ căn, **lưu dạng rõ ở MVP** (Quỹ hàng mã hoá số ở mức trường, ADR-0013); R1 giải mã khi chuyển
  dữ liệu. `docs/plan/pham-vi-mvp-dot-1.md:45,59` · `qh:docs/adr/0013-ma-hoa-so-chu.md:15-18`
- Giữ N9 sửa liên hệ, gỡ căn tạo nhầm, xoá dữ liệu cá nhân theo yêu cầu. `docs/plan/pham-vi-mvp-dot-1.md:29`
- Cắt nhà Liên hệ, cửa lead, vai Telesales (L2). Sửa liên hệ nằm ở màn nào khi không có nhà Liên hệ: chưa xác nhận.
  `docs/plan/pham-vi-mvp-dot-1.md:63`
