---
type: log
title: Change log of the wiki and notable code changes
---

# Log

Newest first. One line each: `YYYY-MM-DD — what changed — link`.

- 2026-11-12 — Bảng hàng bản đọc, «đọc như Sheet»: `/inventory` đọc 60 lần chào mẫu trên khuôn Lưới; khuôn Lưới cuộn liền một mạch (bảng cuộn ảo ReUI) thay chia trang, tiêu đề và cột số dòng · Căn · Toà đứng yên, khung xếp theo `data-grid-editing-6` (kẻ dọc giữa cột, dòng dày 32px, ô tìm kèm số dòng), cột chữ rộng theo nội dung; năm nhãn cột mới; Bảng hàng thành màn mẫu của họ Lưới — hàng 2, `_acceptance/bang-hang-ban-doc/`
- 2026-11-12 — Invitation sign-in link built from `APP_URL` (the product's own address), never from the request's host; production refuses to start without it or with a malformed one (https only); the login-code mail carries no link — [0021](decisions/0021-dang-nhap-ma-email.md), row 9d.
- 2026-11-12 — Roadmap: added rows 2a (use the grid by hand like a sheet), 2b (phone cards), 1q, 1r, 9d, 7a from the owner's sheet-habit decision and the items signed as "new contract"; row 10 now waits for 1r, 9d, 7a; opened the worth-gate cell of row 9a — [lo-trinh](../docs/plan/lo-trinh.json).
- 2026-11-12 — App Shell chọn từ ReUI app-shell-8: cột biểu tượng lọc theo mọi vai, cột thứ hai theo màn (Bảng hàng có lối tắt trạng thái), gập và nhớ qua tải lại, tên sàn ở đầu thanh trên đổi sàn cùng lối với menu tài khoản; điện thoại dùng thanh bên thu gọn — hàng 1o, [0023](decisions/0023-chon-truoc-tao-sau.md), `_acceptance/app-shell-chon-tu-reui/`
- 2026-11-11 — Recorded the reuse ladder set by the owner (choose before making; repo, then repo with ReUI Pro, then hand-made; three layers of "keep as is") and added roadmap rows 1n, 1o, 1p, 9c — [0023](decisions/0023-chon-truoc-tao-sau.md).
- 2026-11-12 — Cổng chứng minh màn theo quyết định 0023: sổ khối `design/so-khoi.yaml` (mở rỗng), bậc «trong kho» tra sổ, ứng viên ReUI kèm ảnh, vùng lấy bỏ thêm, mục «Từ Quỹ hàng» và «Họ», lối khuôn bọc cho App Shell; ba hồ sơ đã qua Cổng Phạm vi giữ luật cũ; luật giao diện thay câu «chuyển thể chỉ đổi dữ liệu» bằng luật ba tầng — [0023](decisions/0023-chon-truoc-tao-sau.md), hàng 1n.
- 2026-11-11 — Recorded the reuse ladder set by the owner (choose before making; repo, then repo with ReUI Pro, then hand-made; three layers of "keep as is") and added roadmap rows 1n, 1o, 1p, 9c — [0023](decisions/0023-chon-truoc-tao-sau.md).
- 2026-11-11 — Vá phần đăng nhập: đường trở về sau đăng nhập kiểm bằng danh sách cho phép và bộ đọc địa chỉ của trình duyệt (14 dạng lách, mỗi dạng một ca); đăng xuất lỗi mạng hay máy chủ báo rõ «chưa thoát» và giữ người ở trang; người hết sàn mà còn phiên có nút Đăng xuất thay cho danh sách sàn trống — hàng 1m, `_acceptance/va-dang-nhap/`
- 2026-11-11 — Sổ bối cảnh chưng cất từ Quỹ hàng trong kho tri thức: trang nền Sản phẩm, mục lục theo hàng lộ trình và 12 trang màn, mỗi ý trỏ nguồn Quỹ hàng ở commit `1729b11f` — [docs/tri-thuc/wiki/nen/muc-luc.md](../docs/tri-thuc/wiki/nen/muc-luc.md).
- 2026-11-11 — Mời người, gán vai: màn Thành viên cho Quản trị sàn (mời bằng email kèm một thư mời, đổi vai, sàn luôn còn một quản trị), thực thể `Member` với tập vai và tên theo sàn, bốn hàm hẹp của vai danh tính; khuôn dùng chung hộp thoại có biểu mẫu và trạng thái trang «Không đủ quyền» — hàng 9, [0022](decisions/0022-moi-nguoi-gan-vai.md), `_acceptance/moi-nguoi-gan-vai/`
- 2026-11-11 — Bộ bài kiểm sinh từ sổ màn: `tests/e2e/screens` đọc sổ màn và bản khai vai lúc chạy (qua bộ đọc của hàng 1d), mỗi màn đã dựng có bốn bài khung ở bốn khổ, màn Lưới có vùng và bản mẫu Lưới có bảy trạng thái vùng; mỗi bài có ca phá gọi đúng hàm kiểm ấy; đóng bốn lỗ bài kiểm của 1b (chờ tải treo, đối chứng chờ tải, tìm bỏ sót dòng, đỏ giả khi máy chậm) — hàng 1f, [0019](decisions/0019-measurable-design-system-pilot.md), `_acceptance/bo-bai-kiem-tu-so-man/`

- 2026-11-11 — Cổng chứng minh màn mẫu: máy suy lối của từng màn (họ mới, màn mẫu mới, theo mẫu) từ sổ màn và bản đồ khuôn; `make test` đỏ khi vòng khai màn sản phẩm mà thiếu ảnh cạnh màn mẫu, còn chỗ lệch vô cớ, họ mới dưới hai hướng, hay rơi bậc thang thiếu căn cứ; khai họ Lưới trong `design/patterns/luoi.md` — hàng 1c, [0019](decisions/0019-measurable-design-system-pilot.md), `_acceptance/cong-chung-minh-man-mau/`
- 2026-11-11 — Đăng nhập bằng mã email: mã 6 số qua thư, phiên 30 ngày trượt, chọn và đổi sàn, menu tài khoản, đăng xuất; schema danh tính chỉ chủ đọc, bảng thành viên lọc theo sàn, sáu hàm hẹp của vai riêng; thêm gói `pg` — hàng 8, [0021](decisions/0021-dang-nhap-ma-email.md), `_acceptance/dang-nhap-ma-email/`
- 2026-11-11 — Hành vi nằm trong Lưới và khung: hồ sơ cạnh bảng một khung cho căn và người (địa chỉ riêng, Esc trả tiêu điểm, toàn màn trên điện thoại, đi qua lại theo dòng đang hiện), chờ tải ba nấc, lỗi không còn nút «Thử lại» chết, đầu vùng chỉ tên khi lỗi, nút làm việc theo quyền, cửa lưu chung có hoàn tác hay xác nhận; sáu quyết định tầng hành vi có bài kiểm đỏ được, bài rào đỏ khi màn tự dựng lại — hàng 1e, `_acceptance/hanh-vi-trong-luoi-khung/`
- 2026-11-11 — Ghim lại danh mục ReUI dừng và gọi tên nhóm khi nguồn đổi cách ghi tiêu đề nhóm, thay vì lặng lẽ bỏ cả nhóm; lưới chặn mã, khoá thử đủ 10 dạng × 27 chỗ và nay quét cả số đếm, bắt được câu import có nháy kép trong phần ghim — [tools/reui_catalog](../tools/reui_catalog/README.md), hàng 1k
- 2026-11-11 — Lệnh ghi số đo của vòng dừng và chỉ đường gỡ khi bản số đo cũ không đọc được, không phải JSON hay sai hình dạng, thay vì lặng lẽ bỏ tầng đã khai rồi ghi đè — hàng 1l, `_acceptance/so-do-ghi-khong-mat-tang/`
- 2026-11-11 — Khai hai khái niệm liên kết vào mô hình nghiệp vụ: Chủ của hàng (ListingOwner, có sàn và vai bên bán) và Căn của hàng (ListingUnit); mã dữ liệu mẫu dùng kiểu sinh — [khai-lien-ket-chao-can](../_acceptance/khai-lien-ket-chao-can/design.md)
- 2026-11-11 — Nền cách ly mỗi sàn: lược đồ nền chép từ Quỹ hàng, cửa truy vấn `withCompany`, bộ quét một cửa và bộ kiểm cách ly 19 ca có phá thử — [cach-ly-moi-san](../_acceptance/cach-ly-moi-san/contract.md)
- 2026-11-11 — Thanh bên nhận danh sách vai một người giữ và hiện mục của mọi vai ấy (người kiêm nhiều vai được cộng, theo 0016); kiểu vai của mục lấy từ bản khai vai — hàng 1i, [0016](decisions/0016-permission-model.md), `_acceptance/thanh-ben-nhieu-vai/`
- 2026-11-11 — Lưới dùng chung: ô theo kiểu (canh lề, bề rộng, định dạng suy từ kiểu của trường), mật độ, đầu vùng, tìm, chia trang, bảy trạng thái vùng, ô chỉ đọc — hàng 1b, `_acceptance/luoi-va-o-theo-kieu/`
- 2026-11-11 — Khai bốn vai và sổ màn cho máy đọc; `make check` đỏ khi có trang chưa khai hay hợp đồng của vòng giao diện thiếu khối Vai × Màn, `make coverage-report` in số đo của đợt thử — hàng 1d, [0017](decisions/0017-actor-surface-coverage-pilot.md), `_acceptance/khai-vai-va-man/`
- 2026-11-11 — Danh mục ReUI (678 khối Pro, 27 thành phần gốc, 1.264 ví dụ) ghim theo bản chụp có băm, tra được tại máy không cần mạng; kiểm trong `make check` đỏ khi có mục tra không ra hoặc lọt mã, khoá — [tools/reui_catalog](../tools/reui_catalog/README.md), hàng 1g
- 2026-11-11 — Sàn mẫu MAU trên Vinhomes Ocean Park 1, 2, 3: danh mục căn, 60 lần chào, 50 liên hệ nối sẵn; Liên hệ có thêm số điện thoại — [du-lieu-mau](../_acceptance/du-lieu-mau/design.md)
- 2026-11-11 — Khung ứng dụng đầy đủ: mục đang chọn, lối nhảy, tiêu đề tab, trạng thái lỗi, không tìm thấy, chờ tải, hết phiên, bộ định dạng Intl vi-VN, màu sáu trạng thái, băng trên màn khi mất mạng, giao diện sáng và tối — hàng 1a, `_acceptance/khung-va-giao-dien/`
- 2026-11-11 — Mỗi lượt kiểm ghi độ phủ vào một thư mục riêng, hai lượt chạy cùng lúc trong một checkout không còn làm hỏng nhau (lượt chấm 3 và 4 của hàng 1h) — [vitest.config.ts](../vitest.config.ts).
- 2026-11-10 — Gộp PR thường không còn hỏi người, bốn kiểu gộp trái nếp vẫn hỏi; luật hỏi khi duyệt PR bắt được cờ ở mọi chỗ trong lệnh — user, 2026-11-10
- 2026-11-10 — Kho chuyển sang công khai theo quyết định của chủ kho; bật luật bảo vệ main, quét bí mật và cảnh báo lỗ hổng — user, 2026-11-10
- 2026-11-10 — Dữ liệu mẫu theo Vinhomes Ocean Park, căn và liên hệ nối từ đầu — [0020](decisions/0020-linked-sample-data-ocean-park.md)
- 2026-11-10 — Tối ưu hệ design theo số lần làm lại: thêm các hàng 1e, 1f, 1g, 1h, đổi hàng 1c, đợt nen còn bốn dãy — [0019](decisions/0019-measurable-design-system-pilot.md)
- 2026-11-10 — Thử khối Vai × Màn ở mỗi vòng, thêm các hàng 1d, 9b vào lộ trình và đợt nen — [0017](decisions/0017-actor-surface-coverage-pilot.md)
- 2026-11-10 — Chốt cơ chế thao tác và phân quyền của MVP, thêm các hàng 9a, 18a, 18b, 19a vào lộ trình — [0016](decisions/0016-permission-model.md)
- 2026-11-09 — Prepared the first orchestrated batch: per-checkout test ports, lane databases, commit-message check for kit commits, verify and migration skills — [batch](../docs/plan/dot-nen/README.md).
- 2026-11-09 — Enabled the kit knowledge layer in this repository and recorded the sources of MVP release 1 — [page](../docs/tri-thuc/wiki/dot/mvp-dot-1.md).
- 2026-11-09 — Added the three-way block selection gate to the roadmap, ahead of the Bảng hàng reference screen — [scope](../docs/plan/pham-vi-mvp-dot-1.md).
- 2026-11-09 — Installed ReUI Pro blocks, added foundation rows and light and dark themes to the roadmap — [scope](../docs/plan/pham-vi-mvp-dot-1.md).
- 2026-11-09 — Cut MVP release 1 into 21 roadmap rows and 11 waiting items — [scope](../docs/plan/pham-vi-mvp-dot-1.md).
- 2026-11-09 — Set up the acceptance kit roadmap, empty until scope is cut — [lo-trinh.json](../docs/plan/lo-trinh.json).
- 2026-11-09 — Removed the kit design gate command and declared `make gen` for S3 — [0015](decisions/0015-measurable-design-gate.md).
- 2026-11-09 — Owner confirmed the Quỹ hàng feature freeze: bug fixes only until this repository replaces it — [proposal](../docs/design-standard-proposal.md).
- 2026-11-09 — Made the design gate able to fail: ledger checks, browser tests in the kit suite, shadcn lint, component families, required display keys — [0015](decisions/0015-measurable-design-gate.md).
- 2026-11-09 — Owner and contact phone numbers are stored in plain text for the MVP — [0014](decisions/0014-mvp-product-rules.md).
- 2026-11-09 — Kept three product invariants for the MVP, removed SP-2 and SP-5 — [0014](decisions/0014-mvp-product-rules.md).
- 2026-11-09 — Moved offline mode after the MVP — [proposal](../docs/design-standard-proposal.md).
- 2026-11-09 — Declared the product invariants for the acceptance kit; kit commands now find the plugin without its environment variable — [PRODUCT-INVARIANTS.md](../PRODUCT-INVARIANTS.md).
- 2026-11-09 — Added the web layer, OneHub brand layer, UI lint, Claude Code layer and kit design wiring; narrowed to nine modules — [0013](decisions/0013-selective-scope-and-design-foundation.md).
- 2026-11-09 — Added the product language standard and label dictionary — [0012](decisions/0012-product-language-standard.md).
- 2026-11-09 — Added five domain concepts, the 13-module map, Node 24, and two-door module boundaries — [0005](decisions/0005-vertical-modules.md).
- 2026-11-09 — Repository created with repo-setup (TypeScript on Node.js 22 — npm, ESLint, Prettier, Vitest).
