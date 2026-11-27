# Review findings: nhap-excel (round 4)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

47 mục của bốn vòng chấm được soát lại theo cây d9d1c975 ngày 2026-11-28 (G-2711-29, sổ quyết định cùng ngày): mục đã sửa, mục trùng và mục thuộc hồ sơ khác ra khỏi phần người quyết (xem «Đã soát lại» dưới), 29 mục còn mở gom thành 8 nhóm, mỗi nhóm một đề xuất. Bản 47 mục nguyên văn nằm ở git, commit 788b9c44.

- **Module boundaries and the decision page (gồm #1, #2, #8)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Phần nạp tệp và Bảng hàng vẫn đọc ghi thẳng dữ liệu của các phần khác, và lý do mở thêm các phụ thuộc chưa được ghi thành trang quyết định, nên sau này đổi luật một chỗ thì chỗ kia có thể lệch mà không ai báo.
  Căn cứ: Hôm nay không mất hay lộ dữ liệu. Dời chỗ gọi và viết trang quyết định để sau vẫn rẻ, còn sửa ngay thì chạm nhiều phần đang chạy.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Data model text behind the database (gồm #5, #6)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Mô tả nghiệp vụ chưa ghi việc một lần chào thuộc về lần nhập nào, mô tả mối nối với căn chờ khớp lệch vài trường, và bảng quyền chưa kể chỗ dữ liệu này khi xem và sửa lần chào.
  Căn cứ: Quyền thật vẫn do cơ sở dữ liệu giữ đúng. Chỉ phần mô tả còn thiếu, bổ sung sau rất rẻ và không làm hỏng gì trong lúc chờ.
  file: `ontology/entities/Listing.yaml`
  severity: low
  Đề xuất: known-limits

- **Personal data beyond header names (gồm #3, #15, #28)**
  Người dùng thấy gì: Nếu sàn để số điện thoại hay tên chủ nhà trong một cột đặt tên khác thì chúng vẫn được nạp và lưu lại trong lần nhập, không có dấu là dữ liệu cá nhân. Bài kiểm việc chặn cột chủ nhà cũng chưa thử hết các cách viết tên cột.
  Căn cứ: Số chủ nhà có thể lộ trong nội bộ sàn khi tên cột viết lệch. Sửa đúng cần một tính năng kiểm giá trị ô và đánh dấu dữ liệu cá nhân, nên nên làm thành việc riêng.
  file: `src/modules/imports/targets.ts`
  severity: medium
  Đề xuất: new-contract

- **Rules held only by the screen, not the server or database (gồm #4, #10, #19, #21)**
  Người dùng thấy gì: Người có quyền nhập, nếu gọi thẳng máy chủ hay cơ sở dữ liệu mà không qua màn, có thể mở lại lần nhập đã hoàn tác, gắn căn vào tin rao của Đầu chủ khác cùng sàn, đóng lần nhập khi còn thiếu dòng, hoặc ghi giá trị trường riêng khác với bảng đã xem.
  Căn cứ: Chỉ người đã có quyền trong cùng sàn mới làm được, không lộ sang sàn khác và hoàn tác gỡ được. Nhưng siết cho đúng cần đổi cơ sở dữ liệu và cửa máy chủ, nên cần người quyết thành việc riêng.
  file: `db/migrations/015_nhap_excel.sql`
  severity: medium
  Đề xuất: new-contract

- **Numbers and states the screen shows (gồm #12, #20, #32, #33)**
  Người dùng thấy gì: Có lúc màn báo con số lệch với thật: số ô giữ chữ gốc lớn hơn số được lưu, số mục ngừng dùng sau hoàn tác có thể cao hơn thực tế, và cách viết được nhớ có thể hiện bằng chữ thường không dấu. Khi danh sách Đầu chủ tải lỗi, Trưởng nhóm thấy ô chọn trống mà không có lời giải thích.
  Căn cứ: Không mất tin rao nào. Dữ liệu chính vẫn đúng, chỉ phần tóm tắt và cách hiển thị lệch nhẹ, người dùng tải lại hay sửa tay được.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Weak test shapes: one-sided, hand-made or vacuous checks (gồm #16, #22, #23, #24, #25, #34, #35, #36, #42, #43, #44, #45)**
  Người dùng thấy gì: Hôm nay người dùng không bị ảnh hưởng. Nhiều bài kiểm chỉ xem một phía, thử trên dữ liệu dựng tay hoặc có câu tự đúng, nên nếu sau này có lỗi thật (cách ly sàn, nhập hộ đúng người, mất mạng, tệp Excel lạ) thì có thể vẫn xanh.
  Căn cứ: Hành vi sản phẩm chưa bị chỉ ra là sai. Mức «cao» đến từ hai câu tự đúng còn trong tệp, nhưng hai điều chúng định đo (sàn B không thấy phần sàn A học, lần nhập hỏng không học gì) nay đã được đo thật ở bài khác. Phần còn lại là siết lưới kiểm, làm sau vẫn rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Declared sweeps not fully run (gồm #26, #39)**
  Người dùng thấy gì: Phép thử không mất ô mới chạy 4 trong 6 lượt đã hứa, và chưa có phép kiểm nào đếm đủ mọi trạng thái của màn Nạp tệp ở mọi khổ, nên một khổ hay một trường hợp bị sót có thể không ai báo.
  Căn cứ: Màn và dữ liệu hiện vẫn đúng. Thêm lượt và bảng đếm là việc nhỏ, không gấp.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Notes and review process (gồm #11, #13, #14)**
  Người dùng thấy gì: Người dùng không thấy gì. Một ghi chú nói sai số ca kiểm cách ly, một ghi chú nói bước nâng cấp cơ sở dữ liệu chạy hai lần được trong khi lần hai sẽ lỗi, và thay đổi này cần chủ kho duyệt trước khi gộp.
  Căn cứ: Đây là câu chữ trong ghi chú và bước duyệt bắt buộc, không phải lỗi sản phẩm. Vận hành chỉ chạy bước nâng cấp một lần.
  file: `governance/autonomy.yaml`
  severity: low
  Đề xuất: wont-fix

## Đã soát lại — không còn là việc người quyết

Số # là thứ tự trong bản 47 mục của vòng 4.

Đã sửa trên nhánh:

- #17 SP-1 Companies are isolated: listing_pending_units.pending_unit_id may point at a pending unit of another company (r2) — migration 018 thêm khoá ngoại hai cột (căn chờ, sàn), ca cách ly 25 từ chối mối nối chéo sàn kèm đối chứng dương
- #37 Shape 5 (a declared matrix that is only point cases): E9 permission table 4 roles × 2 actions, and E9 status table 5 cases (r1 · tệp đã đổi) — tests/db/nhap-excel.db.test.ts quét đủ 4 vai × 2 việc (toHaveLength(8)) với ca phá gỡ luật thật
- #38 Shape 5 (a declared 9-code matrix with only 5 point cases): E6 'can' (r1 · tệp đã đổi) — tests/db/nhap-excel.db.test.ts có bảng 9 mã (toHaveLength(9)), mỗi dấu và lý do được ghim
- #41 Shape 5 (a declared class with zero asserts): E11 points at a test file that does not exist (r1) — tests/nhap-excel-ontology.test.ts đã có và evals.yaml E11 trỏ đúng tệp ấy

Trùng một mục đang mở (đã gộp vào nhóm của mục ấy):

- #7 Design: module boundary, imports reaches into other modules' tables (r3 · tệp đã đổi) → #1
- #9 Records: new module dependency without a decision page (r3) → #2
- #18 Design / module boundaries: imports and listings read and write other modules' tables directly (r2 · tệp đã đổi) → #1
- #27 Design: a new dependency between modules has no decision page (r1) → #2
- #29 Domain: the ontology does not match the schema for ListingPendingUnit and Listing.importRunId (r1) → #5
- #30 Authorization: insert on the unit-link tables only asks 'createListing is not null', without the listing's owner (r1) → #10
- #31 Tier: high — a code owner must review (r1) → #13
- #40 Shape 5 (a declared 30-cell matrix, 11 cells pinned): E16 'trang thai' (r1) → #26

Thuộc hồ sơ khác, nhánh này không viết dòng nào của tệp (chỉ vào qua lần gộp nhánh chính):

- #46 Shape 6 (hardcoded author path): the plugin measured is the owner's checkout (r1) — `_acceptance/bring-out-claude-design/rang/matrix.mjs`
- #47 Shape 6 (hardcoded author path): the 0.76.0 plugin measured from the owner's checkout (r1) — `_acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs`
