# Review findings: nhap-excel (round 6)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

65 mục của sáu vòng chấm được soát lại theo cây 42d6d2ba ngày 2026-11-28 (G-2711-29, G-2811-38): mục đã sửa, mục trùng và mục thuộc hồ sơ khác ra khỏi phần người quyết (xem «Đã soát lại» dưới); 41 mục còn mở gom thành 9 nhóm, mỗi nhóm một đề xuất. Bản 65 mục nguyên văn của vòng 6 nằm trong lượt wf_3da4f980-fb2; bản 47 mục của vòng 4 ở commit 788b9c44.

- **Module boundaries and the decision page (gồm #19, #20, #26)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Phần nạp tệp và Bảng hàng vẫn đọc ghi thẳng dữ liệu của các phần khác, và lý do mở thêm các phụ thuộc chưa được ghi thành trang quyết định, nên sau này đổi luật một chỗ thì chỗ kia có thể lệch mà không ai báo.
  Căn cứ: Hôm nay không mất hay lộ dữ liệu. Dời chỗ gọi và viết trang quyết định để sau vẫn rẻ, còn sửa ngay thì chạm nhiều phần đang chạy.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Data model text behind the database (gồm #23)**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Mô tả nghiệp vụ chưa ghi việc một lần chào thuộc về lần nhập nào, và mô tả mối nối với căn chờ khớp lệch vài trường so với cơ sở dữ liệu.
  Căn cứ: Quyền thật vẫn do cơ sở dữ liệu giữ đúng. Chỉ phần mô tả còn thiếu, bổ sung sau rất rẻ và không làm hỏng gì trong lúc chờ.
  file: `ontology/entities/Listing.yaml`
  severity: low
  Đề xuất: known-limits

- **Personal data beyond header names (gồm #21, #33, #46, #11)**
  Người dùng thấy gì: Nếu sàn để số điện thoại hay tên chủ nhà trong một cột đặt tên khác thì chúng vẫn được nạp và lưu lại trong lần nhập, không có dấu là dữ liệu cá nhân, không xoá được khi xoá liên hệ. Bài kiểm việc chặn cột chủ nhà cũng chưa thử hết các cách viết tên cột.
  Căn cứ: Số chủ nhà có thể lộ trong nội bộ sàn khi tên cột viết lệch. Sửa đúng cần một tính năng kiểm giá trị ô, đánh dấu và xoá dữ liệu cá nhân, nên làm thành việc riêng, tên gợi ý «Dữ liệu cá nhân trong tệp nhập». Khuyến nghị của giám sát: nên xong trước khi bản thật có dữ liệu của sàn thật — hôm nay kho chưa lên bản thật.
  file: `src/modules/imports/targets.ts`
  severity: medium
  Đề xuất: new-contract

- **Rules held only by the screen, not the server or database (gồm #22, #37, #39, #3, #4, #6)**
  Người dùng thấy gì: Người có quyền nhập, nếu gọi thẳng máy chủ hay cơ sở dữ liệu mà không qua màn, có thể mở lại lần nhập đã hoàn tác, ghi giá trị trường riêng khác với bảng đã xem, sửa cột bất kỳ của bản ghi lần nhập, hay gửi một yêu cầu rất lớn; cơ sở dữ liệu cũng chưa tự giữ «mỗi lần chào đúng một căn».
  Căn cứ: Điều không xảy ra được: không lọt sang sàn khác, và người không có quyền nhập không làm được gì trong số ấy; hoàn tác vẫn gỡ được. Siết cho đúng cần đổi cơ sở dữ liệu và cửa máy chủ, nên làm thành việc riêng, tên gợi ý «Siết cửa máy chủ của nhập tệp». Cũng vào việc riêng ấy, mỗi điều một dòng: mô-đun nhập tệp còn viết thẳng câu lệnh trên bảng của mô-đun khác (danh mục căn, lớp riêng của sàn, lần chào) thay vì qua cửa của chúng; bản ghi lần nhập cho sửa mọi cột của nó; cách viết học được ở các phần gửi trước phần cuối được nhớ ở dạng chữ thường bỏ dấu; khi danh sách Đầu chủ tải lỗi, Trưởng nhóm thấy ô chọn trống mà không có lời giải thích. Khuyến nghị của giám sát: nên xong trước khi bản thật có dữ liệu của sàn thật — hôm nay kho chưa lên bản thật.
  file: `db/migrations/015_nhap_excel.sql`
  severity: medium
  Đề xuất: new-contract

- **The import screen's address and state codes are Vietnamese, against the owner's English-names decision of 23/11 (VP11 r1)**
  Người dùng thấy gì: Địa chỉ màn Nạp tệp là «/nhap-tep», và 12 mã trạng thái của màn (ST-nhap-tep-…) cũng viết tiếng Việt, trong khi các màn khác đã đổi sang tiếng Anh theo quyết định của anh ngày 23/11. Người dùng vẫn vào và dùng bình thường; chỉ là địa chỉ không đồng nhất.
  Căn cứ: Hàng 11 được duyệt Phạm vi ngày 17/11, trước quyết định 23/11, nên màn đã dựng với tên tiếng Việt. Đổi tên chạm khoảng 15 tệp, sổ màn, bảng Vai × Màn × Nút, các bài kiểm và ảnh bằng chứng của màn, và phải chấm lại phần màn. Khuyến nghị của giám sát: gộp hàng 11 như đang có, đổi địa chỉ ở một hàng riêng ngay sau, tên gợi ý «Địa chỉ màn Nạp tệp bằng tiếng Anh», trước khi bản thật có người dùng.
  file: `src/app/(app)/nhap-tep/page.tsx`
  severity: medium
  Đề xuất: new-contract

- **Numbers and states the screen shows (gồm #30, #38, #50, #51)**
  Người dùng thấy gì: Có lúc màn báo con số lệch với thật: số ô giữ chữ gốc lớn hơn số được lưu, số mục ngừng dùng sau hoàn tác có thể cao hơn thực tế, và cách viết được nhớ có thể hiện bằng chữ thường không dấu. Khi danh sách Đầu chủ tải lỗi, Trưởng nhóm thấy ô chọn trống mà không có lời giải thích.
  Căn cứ: Không mất tin rao nào. Dữ liệu chính vẫn đúng, chỉ phần tóm tắt và cách hiển thị lệch nhẹ, người dùng tải lại hay sửa tay được.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Weak test shapes: one-sided, hand-made or vacuous checks (gồm #34, #40, #41, #42, #43, #52, #53, #54, #60, #61, #62, #63, #14, #16, #17)**
  Người dùng thấy gì: Hôm nay người dùng không bị ảnh hưởng. Nhiều bài kiểm chỉ xem một phía, thử trên dữ liệu dựng tay hoặc có câu tự đúng, nên nếu sau này có lỗi thật (cách ly sàn, nhập hộ đúng người, quyền đọc lần nhập, mất mạng, tệp Excel lạ) thì có thể vẫn xanh.
  Căn cứ: Hành vi sản phẩm chưa bị chỉ ra là sai. Mức «cao» đến từ hai câu tự đúng còn trong tệp, nhưng hai điều chúng định đo (sàn B không thấy phần sàn A học, lần nhập hỏng không học gì) nay đã được đo thật ở bài khác. Phần còn lại là siết lưới kiểm, làm sau vẫn rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Declared sweeps not fully run (gồm #44, #57)**
  Người dùng thấy gì: Phép thử không mất ô mới chạy 4 trong 6 lượt đã hứa, và chưa có phép kiểm nào đếm đủ mọi trạng thái của màn Nạp tệp ở mọi khổ, nên một khổ hay một trường hợp bị sót có thể không ai báo.
  Căn cứ: Màn và dữ liệu hiện vẫn đúng. Thêm lượt và bảng đếm là việc nhỏ, không gấp.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Notes, review process and small choices (gồm #29, #31, #32, #9, #5)**
  Người dùng thấy gì: Người dùng không thấy gì. Một ghi chú nói sai số ca kiểm cách ly, một ghi chú nói bước nâng cấp cơ sở dữ liệu chạy hai lần được trong khi lần hai sẽ lỗi, mô tả yêu cầu gộp chưa kể hết thay đổi mới nhất, mã lần nhập lấy từ số ngẫu nhiên thường, và thay đổi này cần chủ kho duyệt trước khi gộp.
  Căn cứ: Đây là câu chữ, bước duyệt bắt buộc hay một lựa chọn nhỏ không gây lỗi; vận hành chỉ chạy bước nâng cấp một lần, mô tả yêu cầu gộp được viết lại khi đẩy.
  file: `governance/autonomy.yaml`
  severity: low
  Đề xuất: wont-fix

- **Sample Excel files are written by the test tool, not saved by Excel or Google Sheets (VP11 r1)**
  Người dùng thấy gì: Các tệp Excel mẫu dùng để kiểm do công cụ kiểm tự viết ra, không phải tệp lưu từ Excel hay Google Sheets. Một tệp thật của sàn có thể có chỗ khác mà máy đọc sai hay không đọc được, và các bài kiểm hôm nay không báo trước.
  Căn cứ: Chưa thấy tệp thật nào đọc sai; đây là chỗ bài kiểm chưa phủ. Việc cần làm trước khi bản thật có dữ liệu của sàn thật: thử nhập bằng vài tệp lưu thật từ Excel và Google Sheets, tên gợi ý «Thử nhập bằng tệp thật của Excel và Google Sheets». Khuyến nghị của giám sát: nên xong trước khi bản thật có dữ liệu của sàn thật — hôm nay kho chưa lên bản thật.
  file: `tests/fixtures/nhap-excel/tao.mjs`
  severity: low
  Đề xuất: known-limits

- **The check that every write passes the person's choice reads the source text, not what is written (S4-r7)**
  Người dùng thấy gì: Hôm nay người dùng không bị ảnh hưởng. Một bài kiểm chỉ tìm chữ «choice:» trong mã của bước ghi, nên nếu sau này bước ghi truyền nhầm một lựa chọn khác thì bài ấy vẫn xanh.
  Căn cứ: Điều người dùng cần — giá trị đã chọn được ghi đúng ô, đúng dòng — đã được đo thật ở bài cơ sở dữ liệu so «xem trước hứa gì» với «đã ghi gì» từng dòng; bài tìm chữ chỉ là lưới nhanh thêm.
  file: `tests/nhap-excel-noi-ghi.test.ts`
  severity: low
  Đề xuất: known-limits

- **Some answers are not remembered for the next import (matrix of G-2811-71)**
  Người dùng thấy gì: Khi anh trả lời một cách viết lạ ở cột phí, nội thất, người ở, loại căn hay giá, giá trị vẫn được ghi (hay giữ chữ gốc) đúng như màn xem trước hứa, nhưng lần nhập sau gặp lại cách viết ấy máy vẫn hỏi lại. Chỉ trạng thái, lý do ngừng, hướng và các cột lựa chọn của sàn là được nhớ.
  Căn cứ: Không mất dữ liệu; màn không hứa sẽ nhớ. Lớp riêng của sàn (hàng 7e) chỉ giữ cách viết cho các tập giá trị nó có; muốn nhớ thêm phải mở rộng hàng 7e thành một việc riêng, tên gợi ý «Sàn nhớ cách viết cho phí, nội thất, người ở».
  file: `src/modules/company-config/rules.ts`
  severity: low
  Đề xuất: known-limits

- **The word check lets a label through when it is written in lower case or by another name (S4-r8)**
  Người dùng thấy gì: Hôm nay không ảnh hưởng màn Nạp tệp — chữ của màn đã lấy từ danh sách chữ. Nhưng bài kiểm chữ của kho chỉ bắt nhãn viết đúng như trong danh sách, nên một màn viết «căn» thường giữa câu hay «lần nhập» thay «Lần nạp tệp» vẫn qua; vài màn khác đang có dáng ấy (hồ sơ căn, sửa ô, lớp riêng của sàn với «chủ nhà», «lần nhập»).
  Căn cứ: Không mất dữ liệu; chỉ là chữ có thể lệch giữa các màn. Siết bài kiểm và sửa các màn khác là một việc riêng của kho, giám sát đã ghi thành hàng riêng.
  file: `tests/language.test.ts`
  severity: low
  Đề xuất: known-limits

- **The import screen's 'fixed' mark has the same colour as the 'Đã bán' status (VP11 r1)**
  Người dùng thấy gì: Dấu «máy sửa» trên màn Nạp tệp cùng màu với nhãn «Đã bán» ở Bảng hàng, nên thoáng nhìn có thể nhầm là một trạng thái. Chữ trên dấu vẫn phân biệt được.
  Căn cứ: Chỉ là màu, không mất dữ liệu; đổi màu sau rất rẻ.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: low
  Đề xuất: known-limits

## Đã soát lại — không còn là việc người quyết

Số # là thứ tự trong bản 65 mục của vòng 6 (6 mục mới của vòng 6 đứng đầu, rồi 12 mục của vòng 5, rồi 47 mục mang sang).

Đã sửa trên nhánh:

- S4-r11 t5 · the last batch can close an import while earlier batches are still unwritten — máy chủ nay từ chối phần cuối (409 «batches-missing») khi còn phần trước chưa ghi; lần nhập vẫn mở và chưa học gì (01dc882d)
- S4-r10 t5 · A row left out stores the text of columns the person dropped, the owner's name and phone column too — cột đã bỏ không bao giờ được giữ, ở mọi loại dòng (kể cả dòng căn đã có tin, chỗ hở có từ trước); bảng viết trước thêm cột số chủ và cột ghi chú đã bỏ (74378218)
- S4-r10 t7 · the 500 body is only forbidden two substrings — bài ghim đúng lời lỗi «server-error» (74378218)
- S4-r10 t8 · the llm scan's planted relative path matched by the word «llm» — ca gieo đường dẫn tương đối nay không có chữ ấy (74378218)
- VP11 r2 · (9) a row whose unit code names several units, unanswered, is left out with nothing kept — mọi ô có chữ của dòng ấy, kể cả mã căn, nay giữ trong bản ghi lần nhập; màn xem trước và màn Xong nói «M dòng chưa nhập — mã căn trỏ nhiều căn mà chưa chọn»; số «ô giữ chữ gốc» của màn là số của bản ghi (một luật chung, table.ts keptCellsOf); bảng viết trước thêm loại dòng thứ năm (e6364f7a)
- VP11 r2 · (12) a .csv not in UTF-8 is read with replacement characters — tệp ấy nay rơi vào «tệp lỗi» với câu nói rõ cách lưu lại bằng CSV UTF-8 (e6364f7a)
- VP11 r2 · (2) new dependencies of imports without a decision page — wiki/decisions/0055-mo-dun-nhap-tep-dua-vao-bon-mo-dun.md (e6364f7a)
- VP11 r2 · (13) the 500 case does not read the response body — bài nay đọc thân phản hồi (e6364f7a)
- VP11 r2 · (14) the «never reaches the llm layer» scan has no positive control — thêm ba ca cài sẵn (e6364f7a)
- S4-r9 t3 · Design: new dependencies between modules without a decision page — như (2) (e6364f7a)
- S4-r8 t3 · Product language: concept words hard-coded in the import screen — chữ của màn dựng bằng label() từ danh sách chữ (81219c6d)
- S4-r8 t7 · an answer typed for a column kept as written is not stored — bản ghi lần nhập giữ thêm giá trị màn đã hiện (kept.value), bảng viết trước so ở mọi ô giữ chữ gốc (81219c6d)
- S4-r7 t4 · Building text of a row whose unit already exists is dropped on write: not written and not kept — chữ toà nay giữ nguyên trong bản ghi lần nhập (lý do unit-attribute) khi không vào căn chờ mới của dòng; cả khi chữ dài quá 80 ký tự căn chờ giữ được (f072a264)
- S4-r7 t6 · lostCells skips the 'unit' places — bài so nay đo mã căn (lần chào gắn đúng căn danh mục, đúng căn chờ) và chữ toà, trên một dòng căn danh mục và một dòng căn chờ mới, kèm hai ca phá (f072a264)
- S4-r7 t8 · chosen values compared as a set — so theo từng dòng của tệp (f072a264)
- VP11 r1 · A value the person chose for a cell of a new single-choice field is silently not written — giá trị đã chọn nay được ghi lên căn cả khi không bấm «nhớ»; ca DB đỏ trước khi sửa (25311d32)
- VP11 r1 · Close price and close date columns are accepted but their values are dropped with no trace — hai cột giữ nguyên chữ trong bản ghi lần nhập (lý do close-field); mỗi cột đích có một chỗ ở khai sẵn, bài quét tests/nhap-excel-noi-ghi.test.ts (25311d32)
- VP11 r1 · Shape 1: ImportRun columns are read by regex over migration SQL, not from the table in Postgres — thêm ca DB đọc cột của import_runs từ Postgres, kèm ca phá (25311d32)
- #12 A check of the grid frame's record measures the whole branch (r6) — E16 của hồ sơ khung lưới ghim vào đúng đoạn của VP10, dòng sửa-sau-ký ở hồ sơ ấy (bb340e22)
- #10 Evidence: HEAD has no CI run, and the last pushed commit is red (one red test is the SP-1 isolation case) (r5) — câu đọc Bảng hàng tách hai nhánh nối trong (5569a9c2): 5.000 căn đọc trong 57 ms thay vì 777 ms (main 42 ms); vòng 6 chấm lại E9, E14, E15, E19 đạt
- #24 Domain: the action doors do not list listing_pending_units (r4) — ontology/actions.yaml: viewListings khai đọc listing_pending_units, createListing khai thêm listing_pending_units; ma trận vai × cửa đo cả hai (b258de24)
- #28 Authorization: own scope not narrowed on unit-link inserts (r3) — migration 019: vai «của mình» chỉ gắn căn vào lần chào mình giữ; ca cách ly 26 và bản phá nhap-excel-moi-noi-mo (b258de24)
- #35 SP-1 Companies are isolated: listing_pending_units.pending_unit_id may point at a pending unit of another company (r2) — migration 018 thêm khoá ngoại hai cột (căn chờ, sàn); ca cách ly 25 từ chối mối nối chéo sàn kèm đối chứng dương
- #48 Authorization: insert on the unit-link tables only asks 'createListing is not null', without the listing's owner (r1) — như mục #28 — migration 019 (b258de24)
- #55 Shape 5 (a declared matrix that is only point cases): E9 permission table 4 roles × 2 actions, and E9 status table 5 cases (r1) — tests/db/nhap-excel.db.test.ts quét đủ 4 vai × 2 việc (toHaveLength(8)) với ca phá gỡ luật thật
- #56 Shape 5 (a declared 9-code matrix with only 5 point cases): E6 'can' (r1) — tests/db/nhap-excel.db.test.ts có bảng 9 mã (toHaveLength(9)), mỗi dấu và lý do được ghim
- #59 Shape 5 (a declared class with zero asserts): E11 points at a test file that does not exist (r1) — tests/nhap-excel-ontology.test.ts đã có và evals.yaml E11 trỏ đúng tệp ấy

Trùng một mục đang mở (đã gộp vào nhóm của mục ấy):

- S4-r11 t1, t2, t3 · checks red, the PR description out of date, the second number 015 and its grant without a decision page → thủ tục trước khi gộp; cặp tệp 015/020 có ở trang 0055 và dòng sổ d-…-102
- S4-r11 t4 · custom-field values of the last batch outside the table fingerprint → mục «Siết cửa máy chủ của nhập tệp» (ghi giá trị trường riêng khác với bảng đã xem)
- S4-r11 t6 · the import record keeps raw cell text that can hold names and phones, not marked pii → #21 (Ngoài-3)
- S4-r11 t7 · ListingPendingUnit ontology does not match its table → #23
- S4-r10 t1 · Personal data: an owner's name or phone column is caught only by the words of its header → #21
- S4-r10 t2 · the app role can UPDATE every column of import_runs → mục «Siết cửa máy chủ của nhập tệp»
- S4-r10 t3, t4 · the card does not list SP-1 among the rules touched; CI not green on the commit under review → thủ tục trước khi gộp
- S4-r9 t5 · Domain: the ontology does not match the new columns → #23
- S4-r9 t6 · import ids built from Math.random → nhóm «Notes, review process and small choices»
- S4-r9 t1, t2 · CI gate red on the head graded; the PR's «Human decisions needed» section is stale → thủ tục trước khi gộp: ghim lại các hồ sơ cũ, viết lại mô tả PR
- S4-r8 t1 · Design / module boundaries: imports reads and writes tables owned by other modules → #19
- S4-r8 t2 · Records: new module dependencies without a decision page → #20
- S4-r8 t4 · Personal data: owner phone and name are caught only by the column header → #21
- S4-r8 t5 · Domain: ListingPendingUnit ontology does not match the schema → #23
- S4-r8 t8 · the sweep for «every markValue call passes the person's choice» only looks for text → mục «The check that every write passes the person's choice reads the source text»
- S4-r8 t9 · the break for a listed row that got a listing only checks that a fault appears, not which one → nhóm «Weak test shapes»
- S4-r7 t1 · AGENTS.md Architecture: never reach into another module's tables (imports module) → #19
- S4-r7 t2 · AGENTS.md Architecture: listings reads company-config's table without a declared dependency → #26
- S4-r7 t3 · AGENTS.md: a new module dependency needs a decision page → #20
- #1 Design / module boundaries: the imports and listings modules read and write other modules' tables directly → #19
- #2 Design / modules.yaml: the new imports dependencies have no decision page → #20
- #7 Module boundaries: reaching into another module's tables (AGENTS.md 'never reach into another module's tables or internal files') (r5) → #19
- #8 Design change without a decision page (new dependencies between modules) (r5) → #20
- #25 Design: module boundary, imports reaches into other modules' tables (r3) → #19
- #27 Records: new module dependency without a decision page (r3) → #20
- #36 Design / module boundaries: imports and listings read and write other modules' tables directly (r2) → #19
- #45 Design: a new dependency between modules has no decision page (r1) → #20
- #47 Domain: the ontology does not match the schema for ListingPendingUnit and Listing.importRunId (r1) → #23
- #49 Tier: high — a code owner must review (r1) → #31
- #58 Shape 5 (a declared 30-cell matrix, 11 cells pinned): E16 'trang thai' (r1) → #44

Thuộc hồ sơ khác, nhánh này không viết dòng nào của tệp:

- S4-r10 t6 · the «share abort → nothing» case of tests/hoi-dau-chu-bao-sai.test.tsx waits one tick — bài của hồ sơ hoi-dau-chu-bao-sai (bản sửa của dãy N), đã báo giám sát
- S4-r9 t4 · decision 0052 not updated for the 015_vai / 020 pair — trang của PR #135; hàng 11 ghi cặp tệp ấy ở dòng sổ của mình và ở trang 0055
- S4-r9 t7 · the measure of migration-vai-chu-khong-sieu-cap pins only the first grant/revoke pair — phép đo của hồ sơ PR #135
- S4-r8 t6, t10 · the «Khớp» column and the author's kit path in _acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs — công cụ của hồ sơ VP10
- S4-r7 t5, t9, t10 · the «Khớp» column and the author's kit path in _acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs — công cụ của hồ sơ VP10, hàng 11 không viết dòng nào của tệp
- #13 Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): Đã gửi «có bóng» đọc kiểu CSS khai báo, không đọc điểm ảnh (r5) — tests/e2e/khung-luoi-nut.spec.ts — tệp của khung lưới (VP10), nhánh này không viết dòng nào
- #15 Hình dạng 5 (tuyên cả lớp nhưng chỉ đo vài điểm): «28 px on a computer» chỉ đo nút ở đầu ngăn (r5) — tests/e2e/ho-so-can.spec.ts — tệp của khung lưới (VP10), nhánh này không viết dòng nào
- #18 Hình dạng 6 (đo bản chụp cố định thay vì cây đang kiểm): thước đổi bài kiểm 2e ghim hai commit, lệch với lời hứa trong evals (r5) — thước đổi bài kiểm của bo-o-tim-cua-vung — commit của dãy H (ec70d782) được chọn sang
- #64 Shape 6 (hardcoded author path): the plugin measured is the owner's checkout (r1) — _acceptance/bring-out-claude-design/rang/matrix.mjs — chỉ vào qua lần gộp nhánh chính
- #65 Shape 6 (hardcoded author path): the 0.76.0 plugin measured from the owner's checkout (r1) — _acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs — chỉ vào qua lần gộp nhánh chính
