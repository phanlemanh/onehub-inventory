---
loai: chu-de
ma: [N1, N7]
nguon: [raw/2026-11-12-so-boi-canh-quy-hang-2/chi-muc.md]
cap_nhat: 2026-11-12
---
# Quyền theo vai và cách ly giữa các sàn

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`. Đường mở đầu
`nhánh chore/nen-lo-trinh-lop-sheet-va-no:` chưa gộp vào `main`, số dòng có thể đổi.

## Vì sao có

- Cách ly giữa các sàn là bất biến: không ai đổi được, đổi là đổi sản phẩm, có bộ kiểm bắt buộc.
  `qh:docs/architecture/kien-truc-repo-va-stack.md:13-15`
- Rà phân quyền 05/11 thấy ai đọc được hàng toàn sàn đều sửa được giá và trạng thái qua API, kể cả hai vai không có Bảng
  hàng; luật theo dòng khi ấy chỉ cách ly sàn, chưa có trục vai. `qh:_acceptance/bang-quyen-theo-vai/contract.md:18-23`
- Kho này giữ thành SP-1: một lần lộ dữ liệu giữa hai sàn là mất niềm tin của cả hai sàn. `PRODUCT-INVARIANTS.md:7-14`

## Ai dùng và làm việc gì

- Không ai «dùng» trực tiếp: mọi màn và mọi lời gọi API đều đi qua cửa này. Người thấy hệ quả là vai không có Bảng hàng
  (gõ thẳng địa chỉ thì về Hôm nay, mở hàng thì nhận «không có hàng này»). `qh:_acceptance/bang-quyen-theo-vai/contract.md:42-45`
- Đội vận hành cũng là một sàn như mọi sàn: không cửa riêng, chỉ vào khi sàn cấp quyền hỗ trợ có hạn, có nhật ký.
  `qh:docs/architecture/kien-truc-repo-va-stack.md:48`

## Thói quen phải giữ

- Mỗi toà hay phân khu một người phụ trách, cả đội xem: quyền sửa theo khu và người phụ trách, quyền xem rộng.
  `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:139`
- Số chủ nhà là tài sản của đầu chủ, kể cả với đồng nghiệp cùng sàn. `qh:docs/product/ghi-chep/2026-10-28-dau-chu-va-telesales.md:17`

## Quỹ hàng đã chọn gì

- Mọi bảng của sàn có `company_id`, bật và ép luật theo dòng; mỗi bảng mới thêm một ca vào bộ kiểm cách ly.
  `qh:packages/db/migrations/001_nen_cong_ty.sql:1-3`
- Sàn của phiên đặt bằng `set local` trong mỗi giao dịch; không đặt thì luật theo dòng trả rỗng. API truy vấn dưới một vai
  không sở hữu bảng nên luật luôn áp; mọi truy vấn qua một hàm `withCompany`.
  `qh:packages/db/migrations/001_nen_cong_ty.sql:7-21` · `qh:docs/adr/0005-dang-nhap-theo-san.md:28-29`
- Vai chủ riêng chạy migration và sở hữu bảng; vai của API không có quyền vượt luật theo dòng.
  `qh:docs/adr/0009-moi-truong-that.md:18-22`
- Bảng quyền thao tác × vai đặt một chỗ ở lõi (14 ca người × 4 thao tác); API, luật theo dòng và ô Trạng thái cùng đọc bảng
  ấy. `qh:_acceptance/bang-quyen-theo-vai/contract.md:22-23,33-36`

## Lỗi đã gặp

- Hàm tìm theo dấu vết số (chạy với quyền của chủ hàm) không tự kiểm vai, trái mẫu của các hàm cùng loại; bị bắt ba vòng
  liền. `qh:_acceptance/man-lien-he/run-log.jsonl:23,70,123`
- Bộ kiểm cách ly chạy trên bản thật giả định cơ sở dữ liệu sạch nên đỏ liên tục, bản thật đứng 22 giờ; đổi sang chạy trên
  Postgres tạm từ cùng migration. `qh:docs/adr/0009-moi-truong-that.md:101-108`
- Mỗi mô-đun tự kiểm quyền nên ai đọc được hàng thì sửa được giá; kho này ghi lại bài học ấy khi chọn một bảng quyền chung.
  `wiki/decisions/0016-permission-model.md:28,35`

## MVP này giữ gì, bỏ gì

- Giữ N1 (mỗi sàn chỉ đọc, ghi dữ liệu của mình, qua một cửa) và N7 (một bảng quyền theo vai, thao tác, phạm vi, trạng
  thái cho API, cơ sở dữ liệu và màn hình). `docs/plan/pham-vi-mvp-dot-1.md:24,27`
- Khác Quỹ hàng: Quản trị sàn không tự thấy hàng hay số chủ. `wiki/decisions/0016-permission-model.md:36`
- Hàng 7a: bộ kiểm cách ly bắt thêm tám kẽ hở nêu ở hàng 7 trước khi nối dữ liệu thật.
  `nhánh chore/nen-lo-trinh-lop-sheet-va-no:docs/plan/lo-trinh.json:583-587`
- Kiểm nhanh chỉ đọc trên bản thật đã vào kế hoạch chuyển của kho này; hai điều nó soi ở Quỹ hàng (mọi bảng ép luật, vai API
  không vượt luật) hiện nằm trong bộ kiểm cách ly. `qh:docs/adr/0009-moi-truong-that.md:112-115` ·
  `wiki/decisions/0010-delivery-and-cutover.md:33` · `db/tests/cach-ly.sql:271,312`
