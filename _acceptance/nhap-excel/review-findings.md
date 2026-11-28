## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

59 mục của năm vòng chấm được soát lại theo cây 5569a9c2 ngày 2026-11-28 (G-2711-29): mục đã sửa, mục trùng và mục thuộc hồ sơ khác ra khỏi phần người quyết (xem «Đã soát lại» dưới); 37 mục còn mở gom thành 9 nhóm, mỗi nhóm một đề xuất. Bản 59 mục nguyên văn của vòng 5 nằm trong lượt wf_39e32558-13d; bản 47 mục của vòng 4 ở commit 788b9c44.

- **Module boundaries and the decision page (gồm #13, #14, #20)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Phần nạp tệp và Bảng hàng vẫn đọc ghi thẳng dữ liệu của các phần khác, và lý do mở thêm các phụ thuộc chưa được ghi thành trang quyết định, nên sau này đổi luật một chỗ thì chỗ kia có thể lệch mà không ai báo.
  Căn cứ: Hôm nay không mất hay lộ dữ liệu. Dời chỗ gọi và viết trang quyết định để sau vẫn rẻ, còn sửa ngay thì chạm nhiều phần đang chạy.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Data model text behind the database (gồm #17)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Mô tả nghiệp vụ chưa ghi việc một lần chào thuộc về lần nhập nào, và mô tả mối nối với căn chờ khớp lệch vài trường so với cơ sở dữ liệu.
  Căn cứ: Quyền thật vẫn do cơ sở dữ liệu giữ đúng. Chỉ phần mô tả còn thiếu, bổ sung sau rất rẻ và không làm hỏng gì trong lúc chờ.
  file: `ontology/entities/Listing.yaml`
  severity: low
  Đề xuất: known-limits

- **Personal data beyond header names (gồm #15, #27, #40, #5)**
  Người dùng thấy gì: Nếu sàn để số điện thoại hay tên chủ nhà trong một cột đặt tên khác thì chúng vẫn được nạp và lưu lại trong lần nhập, không có dấu là dữ liệu cá nhân, không xoá được khi xoá liên hệ. Bài kiểm việc chặn cột chủ nhà cũng chưa thử hết các cách viết tên cột.
  Căn cứ: Số chủ nhà có thể lộ trong nội bộ sàn khi tên cột viết lệch. Sửa đúng cần một tính năng kiểm giá trị ô, đánh dấu và xoá dữ liệu cá nhân, nên nên làm thành việc riêng.
  file: `src/modules/imports/targets.ts`
  severity: medium
  Đề xuất: new-contract

- **Rules held only by the screen, not the server or database (gồm #16, #31, #33)**
  Người dùng thấy gì: Người có quyền nhập, nếu gọi thẳng máy chủ hay cơ sở dữ liệu mà không qua màn, có thể mở lại lần nhập đã hoàn tác, đóng lần nhập khi còn thiếu dòng, hoặc ghi giá trị trường riêng khác với bảng đã xem.
  Căn cứ: Chỉ người đã có quyền trong cùng sàn mới làm được, không lộ sang sàn khác và hoàn tác gỡ được. Siết cho đúng cần đổi cơ sở dữ liệu và cửa máy chủ, nên cần người quyết thành việc riêng.
  file: `db/migrations/015_nhap_excel.sql`
  severity: medium
  Đề xuất: new-contract

- **Numbers and states the screen shows (gồm #24, #32, #44, #45)**
  Người dùng thấy gì: Có lúc màn báo con số lệch với thật: số ô giữ chữ gốc lớn hơn số được lưu, số mục ngừng dùng sau hoàn tác có thể cao hơn thực tế, và cách viết được nhớ có thể hiện bằng chữ thường không dấu. Khi danh sách Đầu chủ tải lỗi, Trưởng nhóm thấy ô chọn trống mà không có lời giải thích.
  Căn cứ: Không mất tin rao nào. Dữ liệu chính vẫn đúng, chỉ phần tóm tắt và cách hiển thị lệch nhẹ, người dùng tải lại hay sửa tay được.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Weak test shapes: one-sided, hand-made or vacuous checks (gồm #28, #34, #35, #36, #37, #46, #47, #48, #54, #55, #56, #57, #8, #10, #11)**
  Người dùng thấy gì: Hôm nay người dùng không bị ảnh hưởng. Nhiều bài kiểm chỉ xem một phía, thử trên dữ liệu dựng tay hoặc có câu tự đúng, nên nếu sau này có lỗi thật (cách ly sàn, nhập hộ đúng người, quyền đọc lần nhập, mất mạng, tệp Excel lạ) thì có thể vẫn xanh.
  Căn cứ: Hành vi sản phẩm chưa bị chỉ ra là sai. Mức «cao» đến từ hai câu tự đúng còn trong tệp, nhưng hai điều chúng định đo (sàn B không thấy phần sàn A học, lần nhập hỏng không học gì) nay đã được đo thật ở bài khác. Phần còn lại là siết lưới kiểm, làm sau vẫn rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Declared sweeps not fully run (gồm #38, #51)**
  Người dùng thấy gì: Phép thử không mất ô mới chạy 4 trong 6 lượt đã hứa, và chưa có phép kiểm nào đếm đủ mọi trạng thái của màn Nạp tệp ở mọi khổ, nên một khổ hay một trường hợp bị sót có thể không ai báo.
  Căn cứ: Màn và dữ liệu hiện vẫn đúng. Thêm lượt và bảng đếm là việc nhỏ, không gấp.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Notes and review process (gồm #23, #25, #26, #3)**
  Người dùng thấy gì: Người dùng không thấy gì. Một ghi chú nói sai số ca kiểm cách ly, một ghi chú nói bước nâng cấp cơ sở dữ liệu chạy hai lần được trong khi lần hai sẽ lỗi, mô tả yêu cầu gộp chưa kể hết thay đổi mới nhất, và thay đổi này cần chủ kho duyệt trước khi gộp.
  Căn cứ: Đây là câu chữ trong ghi chú và bước duyệt bắt buộc, không phải lỗi sản phẩm. Vận hành chỉ chạy bước nâng cấp một lần; mô tả yêu cầu gộp được viết lại khi đẩy.
  file: `governance/autonomy.yaml`
  severity: low
  Đề xuất: wont-fix

- **A check of the grid frame's record measures the whole branch (gồm #6)**
  Người dùng thấy gì: Khi chấm lại tính năng khung lưới trên nhánh này, phép «thư mục thành phần cài sẵn không đổi» báo đỏ oan, vì hàng này cài thêm thành phần bước (stepper) đúng cách. Lỗi nằm ở cách đo của hồ sơ khung lưới, không ở màn.
  Căn cứ: Phép ấy chặn việc gộp hàng này sau khi khung lưới lên nhánh chính; sửa thước của hồ sơ khung lưới là việc của dãy làm khung lưới, nên cần mở việc riêng.
  file: `_acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh`
  severity: medium
  Đề xuất: new-contract

## Đã soát lại — không còn là việc người quyết

Số # là thứ tự trong bản 59 mục của vòng 5 (12 mục mới đứng đầu, 47 mục mang sang theo sau).

Đã sửa trên nhánh:

- #4 Evidence: HEAD has no CI run, and the last pushed commit is red (one red test is the SP-1 isolation case) — câu đọc Bảng hàng tách hai nhánh nối trong (5569a9c2): 5.000 căn đọc trong 57 ms thay vì 777 ms (main 42 ms); CI chạy lại khi đẩy
- #18 Domain: the action doors do not list listing_pending_units (r4 · tệp đã đổi) — ontology/actions.yaml: viewListings khai đọc listing_pending_units, createListing khai thêm listing_pending_units; ma trận vai × cửa đo cả hai (b258de24)
- #22 Authorization: own scope not narrowed on unit-link inserts (r3) — migration 019: vai «của mình» chỉ gắn căn vào lần chào mình giữ; ca cách ly 26 và bản phá nhap-excel-moi-noi-mo (b258de24)
- #29 SP-1 Companies are isolated: listing_pending_units.pending_unit_id may point at a pending unit of another company (r2) — migration 018 thêm khoá ngoại hai cột (căn chờ, sàn); ca cách ly 25 từ chối mối nối chéo sàn kèm đối chứng dương
- #42 Authorization: insert on the unit-link tables only asks 'createListing is not null', without the listing's owner (r1) — như mục #22 — migration 019 (b258de24)
- #49 Shape 5 (a declared matrix that is only point cases): E9 permission table 4 roles × 2 actions, and E9 status table 5 cases (r1) — tests/db/nhap-excel.db.test.ts quét đủ 4 vai × 2 việc (toHaveLength(8)) với ca phá gỡ luật thật
- #50 Shape 5 (a declared 9-code matrix with only 5 point cases): E6 'can' (r1) — tests/db/nhap-excel.db.test.ts có bảng 9 mã (toHaveLength(9)), mỗi dấu và lý do được ghim
- #53 Shape 5 (a declared class with zero asserts): E11 points at a test file that does not exist (r1) — tests/nhap-excel-ontology.test.ts đã có và evals.yaml E11 trỏ đúng tệp ấy

Trùng một mục đang mở (đã gộp vào nhóm của mục ấy):

- #1 Module boundaries: reaching into another module's tables (AGENTS.md 'never reach into another module's tables or internal files') → #13
- #2 Design change without a decision page (new dependencies between modules) → #14
- #19 Design: module boundary, imports reaches into other modules' tables (r3) → #13
- #21 Records: new module dependency without a decision page (r3) → #14
- #30 Design / module boundaries: imports and listings read and write other modules' tables directly (r2) → #13
- #39 Design: a new dependency between modules has no decision page (r1) → #14
- #41 Domain: the ontology does not match the schema for ListingPendingUnit and Listing.importRunId (r1) → #17
- #43 Tier: high — a code owner must review (r1) → #25
- #52 Shape 5 (a declared 30-cell matrix, 11 cells pinned): E16 'trang thai' (r1 · tệp đã đổi) → #38

Thuộc hồ sơ khác, nhánh này không viết dòng nào của tệp:

- #7 Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): Đã gửi «có bóng» đọc kiểu CSS khai báo, không đọc điểm ảnh — tests/e2e/khung-luoi-nut.spec.ts — tệp của khung lưới (VP10), nhánh này không viết dòng nào
- #9 Hình dạng 5 (tuyên cả lớp nhưng chỉ đo vài điểm): «28 px on a computer» chỉ đo nút ở đầu ngăn — tests/e2e/ho-so-can.spec.ts — tệp của khung lưới (VP10), nhánh này không viết dòng nào
- #12 Hình dạng 6 (đo bản chụp cố định thay vì cây đang kiểm): thước đổi bài kiểm 2e ghim hai commit, lệch với lời hứa trong evals — thước đổi bài kiểm của bo-o-tim-cua-vung — commit của dãy H (ec70d782) được chọn sang
- #58 Shape 6 (hardcoded author path): the plugin measured is the owner's checkout (r1) — _acceptance/bring-out-claude-design/rang/matrix.mjs — chỉ vào qua lần gộp nhánh chính
- #59 Shape 6 (hardcoded author path): the 0.76.0 plugin measured from the owner's checkout (r1) — _acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs — chỉ vào qua lần gộp nhánh chính

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 8/12 lỗi rơi vào file không bộ đo nào phủ (db/migrations/019_nhap_excel_moi_noi_cua_minh.sql, tests/db/bang-hang-that.db.test.ts, _acceptance/khung-luoi-va-ngan-chi-tiet/rang/chay.sh, tests/e2e/khung-luoi-nut.spec.ts, tests/db/bang-quyen.db.test.ts, tests/e2e/ho-so-can.spec.ts, tests/db/bang-quyen-api.db.test.ts, _acceptance/config.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
