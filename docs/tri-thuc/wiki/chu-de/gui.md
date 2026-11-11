---
loai: chu-de
ma: [K1, K7]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Gửi

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- «Gửi khách bằng link sống» là một trong năm chỗ thắng Sheet; việc thật là gửi được căn trong vài phút.
  `qh:docs/product/tham-chieu.md:12-13`
- Link giải bài ảnh: mỗi lần chia sẻ ghi công người gửi, môi giới thấy khách đã mở bao nhiêu lần.
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:95`

## Ai dùng và làm việc gì

- Đầu khách trên điện thoại: chọn căn → xem trước đúng trang khách thấy → chép link hoặc chia sẻ → theo dõi ở Đã gửi.
  `qh:docs/product/tham-chieu.md:267-268`
- Một Lần gửi gồm một căn hay một bộ (tối đa 30), chỉ căn đã lên bảng. `qh:docs/product/tham-chieu.md:73`

## Thói quen phải giữ

- Hiện nay: gửi ảnh + chữ, chụp màn hình Sheet gửi nhóm, soạn tay mỗi lần. `qh:docs/product/ghi-chep/2026-10-28-desktop-app.md:140-142`
- Người tự chọn người nhận và tự bấm gửi trong Zalo; đăng 20 nhóm vẫn là 20 lần dán, đó là nhịp chống spam tự nhiên.
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:113`
- Khách quen nhận ảnh: luồng điện thoại chia sẻ ảnh căn + tin, link nằm trong tin (đề xuất, chờ chủ kho chốt).
  `qh:docs/adr/0003-bai-thu-zalo.md:3,54-55`
- Bài trong nhóm Zalo hiện là chữ + album hay chữ + link: chưa xác nhận. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:187`

## Quỹ hàng đã chọn gì

- Người luôn bấm gửi: nút Gửi chỉ tạo Lần gửi rồi mở bảng chia sẻ của máy; không gửi hộ, không đăng nhóm. Kho này giữ thành
  SP-3. `qh:design/patterns/gui.md:30-31` · `PRODUCT-INVARIANTS.md`
- Màn Gửi: Luồng nhiều bước trên một lần cuộn (Gửi cho ai · Căn sẽ gửi · Tin soạn sẵn), thanh dính đáy «n căn · Xem trước ·
  Gửi» theo `wishlist-1`; xem trước dựng chính trang khách. `qh:design/patterns/gui.md:15-18`
- Không khối ReUI nào nối chọn nhiều → xem trước → chia sẻ, nên phần này ghép tay. `qh:docs/design/vo-va-ia.md:199`
- Chỉ căn còn hàng gửi được; quá 14 ngày chưa xác nhận thì nhắc gọi trước. `qh:docs/product/tham-chieu.md:170`

## Lỗi đã gặp

- Trên iPhone, chia sẻ «link + tin» sang Zalo chỉ còn link, mất tin (theo lời chủ kho; nhật ký thử không ghi được lượt
  nào từ iPhone). `qh:docs/adr/0003-bai-thu-zalo.md:48-55`
- Zalo Web không dựng thẻ xem trước cho link gửi từ web. `qh:docs/adr/0003-bai-thu-zalo.md:36-37`
- Mạng công ty chặn đường hầm thử; thử Zalo thật cần mạng điện thoại hay bản dựng thật. `qh:docs/adr/0003-bai-thu-zalo.md:84-85`

## MVP này giữ gì, bỏ gì

- Giữ K1 (chọn căn, tạo link, người tự bấm gửi qua bảng chia sẻ) và K7 (xem trước link trên Zalo: tiêu đề, ảnh).
  `docs/plan/pham-vi-mvp-dot-1.md:50,56`
- Bỏ gửi nhóm môi giới và mẫu bài (L3); chỉ còn gửi khách riêng. `docs/plan/pham-vi-mvp-dot-1.md:64`
- Kho này bỏ thanh tab dưới của điện thoại, nên đường vào Gửi trên điện thoại khác Quỹ hàng.
  `docs/design-standard-proposal.md:91`
