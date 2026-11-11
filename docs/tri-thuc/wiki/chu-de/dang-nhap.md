---
loai: chu-de
ma: [N2, N6]
nguon: [raw/2026-11-11-so-boi-canh-quy-hang/chi-muc.md]
cap_nhat: 2026-11-11
---
# Đăng nhập

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu
`nhánh chore/nen-chon-truoc-tao-sau:` chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Nhiều sàn trên một nền, nên đăng nhập phải ra đúng «sàn đang làm». `qh:docs/adr/0005-dang-nhap-theo-san.md:9-11,27-29`
- Không tự đăng ký: tài khoản chỉ sinh khi mở sàn hay khi quản trị mời. `qh:docs/adr/0005-dang-nhap-theo-san.md:24-26`

## Ai dùng và làm việc gì

- Mọi vai trong sàn, trên máy tính và điện thoại. Khách mở trang khách không đăng nhập. `qh:docs/product/tham-chieu.md:26-33,207`
- Người thuộc nhiều sàn thì chọn sàn; không thuộc sàn nào thì không thấy gì. `qh:docs/product/tham-chieu.md:332`

## Thói quen phải giữ

- Đầu chủ ngồi máy tính nhưng đọc email trên điện thoại, nên dùng mã gõ được ở máy nào cũng xong, không dùng link.
  `qh:docs/adr/0005-dang-nhap-theo-san.md:15-17`
- Ít phải đăng nhập lại: phiên 30 ngày trượt theo ngày dùng. `qh:docs/adr/0005-dang-nhap-theo-san.md:40-47`
- Máy dùng chung ở văn phòng: đăng xuất phải chắc, lỗi thì báo «Chưa đăng xuất được» kèm «Thử lại».
  `qh:docs/product/tham-chieu.md:405`
- Thói quen đăng nhập bằng Zalo hay số điện thoại: chưa xác nhận. Quỹ hàng chỉ ghi quyết định không đăng nhập Zalo và để
  số điện thoại sau. `qh:docs/architecture/kien-truc-repo-va-stack.md:196` · `qh:docs/adr/0005-dang-nhap-theo-san.md:16-17`

## Quỹ hàng đã chọn gì

- ADR-0005: email + mã 6 số; mã hết hạn sau 5 phút, sai 3 lần thì hỏng, mỗi email xin tối đa 5 lần trong 15 phút; email lạ
  nhận cùng câu trả lời. `qh:docs/adr/0005-dang-nhap-theo-san.md:15-18,24-26`
- Khối `auth-15` chuyển thể: một cột hẹp giữa trang, bỏ nút Google, Apple, GitHub; không có App Shell; lỗi gắn dưới đúng ô.
  `qh:design/patterns/xac-thuc.md:22-24,28-31`
- Thêm 04–05/11 cửa mật khẩu và mật khẩu tạm do quản trị cấp. `qh:docs/adr/0005-dang-nhap-theo-san.md:59-75`

## Lỗi đã gặp

- Giới hạn xin mã chỉ gác một đường; đường quên mật khẩu của thư viện vẫn gửi mã không giới hạn.
  `qh:_acceptance/dang-nhap-theo-san/review-findings.md:46`
- Gia hạn phiên không tới trình duyệt nên phiên vẫn hết sau 7 ngày. `qh:_acceptance/dang-nhap-theo-san/review-findings.md:123`
- Sự cố bản thật 06/11: cơ sở dữ liệu cạn kết nối, đọc phiên lỗi 500 bị coi là chưa đăng nhập nên mọi người bị đá ra.
  `qh:_acceptance/va-pool-ket-noi/contract.md:20-22`
- Chọn sàn thất bại thì im lặng; form nuốt lỗi mạng. `qh:_acceptance/dang-nhap-theo-san/review-findings.md:18,32`

## MVP này giữ gì, bỏ gì

- Giữ N2 mã qua email, N6 menu tài khoản và đăng xuất, giữ nguyên các con số của Quỹ hàng; tự viết gọn trong mô-đun
  `identity`. `docs/plan/pham-vi-mvp-dot-1.md:25,35` · `wiki/decisions/0021-dang-nhap-ma-email.md:30-37`
- Bỏ mật khẩu (L11) và đổi sàn trong ứng dụng (L12); chọn sàn chỉ có lúc đăng nhập. `docs/plan/pham-vi-mvp-dot-1.md:72-73` ·
  `wiki/decisions/0021-dang-nhap-ma-email.md:41`
- Màn đăng nhập chọn lại ở hàng 1p, có `auth-15` trong các ứng viên, luật an toàn giữ nguyên.
  `nhánh chore/nen-chon-truoc-tao-sau:docs/plan/lo-trinh.json:274-285`
