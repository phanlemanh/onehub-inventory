---
loai: chu-de
ma: [B2, B3, G4, G5]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Hồ sơ căn

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Một căn một hồ sơ: cuộc gọi, ảnh, đổi giá, lịch xem đều ở đó, không có trang thứ hai. `qh:docs/product/tham-chieu.md:133`
- Ảnh và thông tin căn trước đây trôi trong Zalo cá nhân, đầu khách phải lục nhóm tìm ảnh. Hồ sơ căn thay chỗ đó.
  `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:49-53`
- «Gõ mã căn là đủ thông tin»: thuộc tính căn tự điền từ danh mục và khoá lại. `qh:docs/product/tham-chieu.md:13` ·
  `qh:design/patterns/ho-so-can.md:55`

## Ai dùng và làm việc gì

- Đầu chủ trên máy tính mở hồ sơ cạnh Bảng hàng, đi lần lượt các căn còn thiếu, thêm ảnh, gắn mã. Đây là việc ngồi lâu,
  không phải liếc qua. `qh:docs/design/danh-gia-ngan-chi-tiet-can.md:126-127`
- Đầu khách trên điện thoại chạm thẻ căn để mở hồ sơ toàn màn, không thấy phần chủ nhà, có nút «Hỏi đầu chủ».
  `qh:design/patterns/ho-so-can.md:48-54`
- Thẻ căn điện thoại: ảnh bìa, mã căn, giá kèm điều kiện phí, Diện tích · Phòng ngủ · Hướng. `qh:docs/product/tham-chieu.md:383`

## Thói quen phải giữ

- Quen Sheet «thấy hết trong một màn», nên hồ sơ mở cạnh bảng và bảng vẫn bấm, lọc, cuộn được.
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:110` · `qh:docs/product/tham-chieu.md:196`
- Ảnh chủ gửi qua Zalo: kéo hay dán vào mục Ảnh. Nhưng bài thử trên Zalo Web đo được 0 sự kiện, còn app Zalo trên máy tính
  chưa thử; chưa xác nhận đường nào thật sự chạy. `qh:docs/product/tham-chieu.md:48` · `qh:docs/adr/0003-bai-thu-zalo.md:64-69`
- Lùi từ hồ sơ về danh sách phải giữ lọc và chỗ đang cuộn. `qh:docs/product/tham-chieu.md:383`

## Quỹ hàng đã chọn gì

- Ruột hồ sơ theo `solution-crm-4`; cạnh bảng là cột kéo chia `app-shell-11`, mặc định 38%, kéo 28–50%, nằm ngoài khung
  bảng (ADR-0024, sửa 05/11). `qh:docs/adr/0024-he-bo-cuc.md:163-168` · `qh:design/patterns/ho-so-can.md:16-19`
- Hai thân từ một mô hình: thân cột từ 768 px, thân điện thoại theo `product-detail-5`. Quyền là lớp phủ bốn cờ, không rẽ
  theo tên vai. `qh:design/patterns/ho-so-can.md:35-38,48-49`
- Ảnh ba ngăn (Gửi được · Tự có từ mã · Nội bộ), kho ảnh riêng tư, link ký 60 giây (ADR-0014).
  `qh:docs/adr/0014-kho-anh.md:8,21-23`
- Sẵn sàng bán một chạm: máy kiểm mã căn, giá, ảnh thật, pháp lý; thiếu thì liệt đúng điều. 06/11 chốt bỏ chặn khi thiếu
  ảnh nhưng chưa dựng; bản đang chạy vẫn chặn. `qh:docs/product/tham-chieu.md:156,371`
- Chế độ cuộc gọi là một chế độ của hồ sơ, dùng bố cục Hồ sơ. `qh:docs/product/tham-chieu.md:133` · `qh:docs/design/vo-va-ia.md:127`

## Lỗi đã gặp

- Ngăn hồ sơ nằm trong khung bảng thì quá thấp; ngăn nổi đè bảng thì che nút Lọc, Nhóm, Cột, ở 1280 chỉ còn khoảng ba cột.
  Đổi sang cột kéo chia. `qh:docs/design/danh-gia-ngan-chi-tiet-can.md:14-19,46-56`
- Ảnh trên 4,5 MB bị nền chạy chặn; sửa, xoá ảnh lỗi mà không báo. `qh:_acceptance/va-anh-ban-that/contract.md:18-21`
- Trưởng nhóm không giữ vai Đầu chủ vẫn thấy nút «Ghi cuộc gọi» ở đáy hồ sơ căn trên điện thoại, nhưng màn cuộc gọi lại
  chặn. `qh:_acceptance/va-nut-ghi-cuoc-goi-truong-nhom/contract.md:18-21`
- Sẵn sàng bán: danh sách «Còn thiếu» của căn trước còn hiện khi chuyển căn. `qh:_acceptance/va-san-sang-ban/contract.md:18-20`

## MVP này giữ gì, bỏ gì

- Giữ B2 hồ sơ cạnh bảng, B3 thẻ căn điện thoại, G4 ảnh, G5 Sẵn sàng bán. `docs/plan/pham-vi-mvp-dot-1.md:37-38,48-49`
- Hồ sơ cạnh bảng có một cách dựng chung (F9); mở có địa chỉ riêng và bản điện thoại là mẫu hành vi phải chốt trước.
  `docs/plan/pham-vi-mvp-dot-1.md:20` · `docs/design-standard-proposal.md:301`
- Bỏ ngoại tuyến (L1), nên ảnh chờ trên máy khi mất mạng không mang sang. MVP có giữ chế độ cuộc gọi trong hồ sơ không:
  chưa xác nhận. `docs/plan/pham-vi-mvp-dot-1.md:62`
- MVP theo luật Sẵn sàng bán bản nào (bản đang chạy chặn khi thiếu ảnh, bản 06/11 không chặn): chưa xác nhận.
