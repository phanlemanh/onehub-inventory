---
loai: chu-de
ma: [L10]
nguon: [raw/2026-11-12-so-boi-canh-quy-hang-2/chi-muc.md]
cap_nhat: 2026-11-12
---
# Thoả thuận kết nối giữa sàn và nguồn

Quy ước nguồn như [trang Sản phẩm](../nen/san-pham.md): `qh:` là Quỹ hàng ở commit `1729b11f`.

## Vì sao có

- Quỹ hàng là SaaS cho ngành: mỗi kết nối với nền tảng khác hay sàn khác là một thoả thuận bật, tắt, chỉ mở tới trần của
  từng lớp dữ liệu. Nếu mỗi kết nối viết riêng thành dây cứng thì đổi quy định thành đổi mã.
  `qh:docs/product/tham-chieu.md:18` · `qh:docs/architecture/kien-truc-repo-va-stack.md:11`
- Trần là bất biến: thông tin chủ nhà không bao giờ rời sàn. `qh:docs/architecture/kien-truc-repo-va-stack.md:23,30`

## Ai dùng và làm việc gì

- Người có thẩm quyền của hai bên bật, tắt thoả thuận, có nhật ký; tắt thì dữ liệu dừng chảy ngay.
  `qh:docs/architecture/kien-truc-repo-va-stack.md:18,21`
- Thoả thuận AI mỗi sàn một cái, chỉ Quản trị sàn tạo hay đổi. `qh:packages/db/migrations/035_xu_ly_bang_ai.sql:1-3`

## Thói quen phải giữ

- Môi giới chia sẻ hàng vì luật chia thưởng, không vì phần mềm tiện. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:63-71`
- Sợ bị cướp khách nên không muốn đồng bộ hai chiều với nền tảng chung. `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:77-81`

## Quỹ hàng đã chọn gì

- Thoả thuận là một đối tượng: hai bên · loại kết nối · chiều · lớp dữ liệu · hiệu lực · ai duyệt · nhật ký.
  `qh:docs/architecture/kien-truc-repo-va-stack.md:21`
- Sáu lớp dữ liệu có trần: Danh mục ra ngoài được; Hàng chia sẻ được ra ngoài qua luật ẩn; Nội bộ ở trong sàn; Nguồn (chủ
  nhà, số, giá đáy, ảnh sổ) không bao giờ ra; Giao dịch mặc định tắt; Hành vi chỉ ra dạng tổng hợp.
  `qh:docs/architecture/kien-truc-repo-va-stack.md:25-32`
- Cơ sở dữ liệu chặn lớp «nguồn» trong mọi thoả thuận, và lớp nội bộ chỉ được đi vào, không đi ra.
  `qh:packages/db/migrations/001_nen_cong_ty.sql:44-57`
- Loại kết nối tăng dần: sáu loại ban đầu; migration 035 thêm loại xử lý bằng AI; migration 040 thêm xác nhận danh mục, chỉ
  chiều ra, chỉ lớp danh mục, không điều khoản riêng. `qh:packages/db/migrations/035_xu_ly_bang_ai.sql:1-4` ·
  `qh:packages/db/migrations/040_xac_nhan_danh_muc.sql:1-3,13-22`
- Bản đầu chỉ cài hai loại: danh mục đi vào và xuất file. `qh:docs/architecture/kien-truc-repo-va-stack.md:50`

## Lỗi đã gặp

- Ý tưởng đầu đồng bộ hai chiều với nền tảng chung và làm giàu bằng danh mục không được tái xuất va luật đã chốt; Quỹ hàng
  đổi sang hướng an toàn (mức hiển thị theo từng căn, danh mục riêng). `qh:docs/product/ghi-chep/2026-10-28-ghi-nho.md:75-81`
- Ràng buộc loại kết nối phải viết lại bằng tên ở 035 và bị viết lại tiếp ở 040; thứ tự áp migration trên bản thật khác cơ sở
  dữ liệu mới, phải ghi luật riêng. `qh:packages/db/migrations/040_xac_nhan_danh_muc.sql:5-8`

## MVP này giữ gì, bỏ gì

- Luật kho này: một kết nối là một `Agreement`, không bao giờ là mã viết cho một bên. `AGENTS.md:22`
- Cắt các loại kết nối khác và xác nhận danh mục (L10). `docs/plan/pham-vi-mvp-dot-1.md:71`
- Cơ sở dữ liệu kho này đã có bảng thoả thuận, chặn lớp «nguồn» và giữ lớp nội bộ chỉ đi vào, ép luật theo dòng; chưa hàng
  nào dựng màn hay loại kết nối cho nó. `db/migrations/001_nen_cong_ty.sql:35-58`
