---
loai: chu-de
ma: [F1, F2, F3, F4, F5]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# App Shell

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu
`nhánh chore/nen-chon-truoc-tao-sau:` chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Mỗi phiên tự dựng khung thì khung lệch nhau, đổi khung làm gãy mọi màn. `qh:docs/adr/0002-vo-va-ia-chon-tu-reui.md:8-11`
- Mỗi nhà trả lời một câu: Hôm nay — giờ làm gì? Bảng hàng — có hàng gì? Cài đặt — luật nào?
  `qh:docs/product/tham-chieu.md:221`
- Kho này từng ghép App Shell tay khi kho còn rỗng, chưa bày ứng viên ReUI.
  `nhánh chore/nen-chon-truoc-tao-sau:wiki/decisions/0023-chon-truoc-tao-sau.md:42-45`

## Ai dùng và làm việc gì

- Mọi vai sau đăng nhập; nhà và nút theo vai đọc một bảng; người nhiều vai thấy hợp các nhà. `qh:docs/product/tham-chieu.md:189,209-219`
- Mở app vào Hôm nay; người chỉ giữ vai quản trị vào Cài đặt sàn. Trang khách và đăng nhập không có App Shell.
  `qh:docs/product/tham-chieu.md:199,207`

## Thói quen phải giữ

- Các tab của Sheet thành góc nhìn lưu ở cột thứ hai, nên chọn App Shell có cột thứ hai theo nhà. `qh:docs/design/vo-va-ia.md:31-32`
- Gõ mã căn là đủ: ô giữa thanh trên, phím `/` và ⌘K. `qh:docs/design/vo-va-ia.md:23`
- Một link mở trên máy nào cũng đúng chỗ, không có địa chỉ riêng cho điện thoại. `qh:docs/product/tham-chieu.md:189` · `qh:docs/adr/0002-vo-va-ia-chon-tu-reui.md:23`

## Quỹ hàng đã chọn gì

- ADR-0002: chọn trên ReUI trước, tự viết sau cùng. Máy tính dùng `app-shell-8`: cột biểu tượng + cột thứ hai theo nhà +
  thanh trên có chọn sàn, ô gõ mã căn, nút tạo, chuông. `qh:docs/adr/0002-vo-va-ia-chon-tu-reui.md:15-20` ·
  `qh:docs/design/vo-va-ia.md:15-29`
- Đã so và loại `app-shell-36`, `-13`, `-14`, `-15`, `-9`, `-6`. `qh:docs/design/vo-va-ia.md:33-35`
- Điện thoại ghép: thanh trên mảnh + thanh tab dưới (Hôm nay · Bảng hàng · Gửi · Tôi), ngăn kéo từ đáy; ghi «chỗ hở» vì ReUI
  không có thanh tab đáy. `qh:docs/design/vo-va-ia.md:45-56`
- ADR-0024: bảy bố cục có tên, sáu vùng; một khuôn trạng thái chung (trống · lỗi · báo). `qh:docs/adr/0024-he-bo-cuc.md:37-54` ·
  `qh:design/patterns/trang-thai.md:15-20`

## Lỗi đã gặp

- Đổi sàn trong App Shell: cột thứ hai còn trạng thái của sàn cũ; bộ chọn sàn nuốt lỗi. `qh:_acceptance/vo-ung-dung/review-findings.md:35-47`
- Ngăn thông báo trên điện thoại trượt từ phải, trái luật kéo từ đáy. `qh:_acceptance/vo-ung-dung/review-findings.md:21-26`
- App Shell coi lỗi 500 khi đọc phiên là chưa đăng nhập, gây sự cố bản thật 06/11. `qh:_acceptance/va-pool-ket-noi/contract.md:20-22`
- Chọn khối theo từng màn nên cùng nhu cầu ra nhiều lời giải (Bảng hàng và Liên hệ lệch 43 chỗ).
  `nhánh chore/nen-chon-truoc-tao-sau:wiki/decisions/0023-chon-truoc-tao-sau.md:36-40`

## MVP này giữ gì, bỏ gì

- Giữ F1–F5: App Shell đầy đủ (mục đang chọn, tiêu đề tab, nút chính, điều hướng theo vai, thanh bên thu gọn trên điện
  thoại), trạng thái toàn trang, bộ định dạng, luật kênh thông báo, sáng và tối. `docs/plan/pham-vi-mvp-dot-1.md:12-16`
- Bỏ thanh tab dưới trên điện thoại và đổi sàn trong ứng dụng (L12). `docs/design-standard-proposal.md:91` ·
  `docs/plan/pham-vi-mvp-dot-1.md:73`
- Chủ kho chốt 11/11: dùng `app-shell-8`, giữ cả hai cột; phần còn lại quyết trên bản bấm được ở hàng 1o.
  `nhánh chore/nen-chon-truoc-tao-sau:wiki/decisions/0023-chon-truoc-tao-sau.md:93-94`
- Kích thước 264/56 px của bộ thiết kế đã khớp `app-shell-8` chưa: chưa xác nhận. `docs/design-standard-proposal.md:134`
