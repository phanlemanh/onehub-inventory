# Review findings: nhap-excel (round 3)

## Trong hợp đồng

- **Retrying after the response of an already-written batch was lost never finishes, or reports too few rows**
  file: `src/modules/imports/ui/import-wizard.tsx:676`
  severity: medium
  AC: AC-7
  source: bugs
  detail: The new retry path assumes a failed batch was not written. A dropped connection after the server commits is the main 'offline' case (answer() returns status 0), and there that assumption is wrong. (a) Last batch: writeBatch sets the run to status='done' when it commits. On retry, lockRun finds the run not 'open' and returns problem 'closed' (store.ts:285) before it reaches the batches_done check at store.ts:296. imports-http maps 'closed' to 409, so the wizard shows the batchStopped alert ('lỗi máy chủ… Bấm Thử lại') again on every press. All rows are written, but the person never reaches step 5: no done count, no learned list, no undo button. (b) A batch in the middle: the retry hits batches_done and returns created:0, so at.created leaves that batch out and C.done(created) shows fewer rows than were written. The batch route's comment says 'a batch sent again writes nothing', but the run is closed on the last batch, so that retry cannot succeed. A retry that answers 409 'closed' on the last batch should be treated as finished (or the server should return ok for a batch already in batches_done before the status check). The new test only covers a 500 before the commit, so it does not catch this.
  lý do vào hợp đồng: AC-7 requires that resending a batch does not double write and that the screen states the exact number of rows written; the finding shows the retry never finishes or under-reports.

- **The retry button stays clickable while its retry runs, so two write loops can run at once**
  file: `src/modules/imports/ui/import-wizard.tsx:705`
  severity: low
  AC: AC-7
  source: bugs
  detail: In the failed branch (`if (failed && progress)`) the Thử lại button has no `disabled`. `failed` is only cleared when the whole run succeeds, so the alert and its button stay on screen and active through the retry. The normal apply button is held by `props.disabled` (which includes busy); this one is not. A second click starts a second run() from the same stale `progress` and sends the same batches again. The server's row lock keeps the data correct, but the second loop gets created:0 for batches already done and 409 'closed' on the last one. Its setProgress/setFailed can then put the screen back into the 'lỗi máy chủ' state, or count the rows wrongly, while the first loop completes.
  lý do vào hợp đồng: Two concurrent retry loops can make the screen show a wrong count of written rows or a false failure, which breaks AC-7's exact-count and retry behaviour.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design: module boundary, imports reaches into other modules' tables**
  Người dùng thấy gì: Phần nhập tệp đọc và ghi thẳng vào dữ liệu của các phần khác thay vì đi qua cửa của chúng. Người dùng không thấy lỗi ngay, nhưng sau này sửa luật ở một nơi có thể làm nơi kia lệch.
  Căn cứ: Hiện chưa mất hay sai dữ liệu của người dùng, chỉ là nợ cấu trúc; sửa sau vẫn rẻ hơn nhiều so với đập đi làm lại ngay.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Design: listings reads company-config's table without a declared dependency**
  Người dùng thấy gì: Bảng hàng lấy mã căn chờ khớp bằng cách đọc thẳng dữ liệu của phần cấu hình sàn mà chưa khai báo. Người dùng vẫn thấy đúng mã, nhưng việc khai báo chưa đủ làm sau này dễ vỡ khi phần cấu hình đổi.
  Căn cứ: Màn hình hiện vẫn đúng và không mất dữ liệu; đây là việc dọn cấu trúc có thể làm sau.
  file: `src/modules/listings/inventory-read.ts`
  severity: medium
  Đề xuất: known-limits

- **Records: new module dependency without a decision page**
  Người dùng thấy gì: Việc nhập tệp phụ thuộc thêm vài phần khác nhưng chưa có trang ghi lại lý do quyết định. Người dùng không bị ảnh hưởng, chỉ người bảo trì sau này khó hiểu vì sao.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; thiếu giấy tờ có thể bổ sung bất cứ lúc nào với chi phí rất thấp.
  file: `architecture/modules.yaml`
  severity: low
  Đề xuất: known-limits

- **Authorization: own scope not narrowed on unit-link inserts**
  Người dùng thấy gì: Một Đầu chủ chỉ được làm việc với căn của mình vẫn có thể gắn thông tin căn vào tin rao của đầu chủ khác trong cùng sàn nếu tin đó chưa có. Dữ liệu không ra khỏi sàn nhưng quyền rộng hơn thiết kế.
  Căn cứ: Lỗi chỉ xảy ra giữa các thành viên cùng một sàn, không lộ dữ liệu sang sàn khác; nhưng là quyền rộng hơn dự định nên cần người quyết có siết hay không.
  file: `db/migrations/015_nhap_excel.sql`
  severity: low
  Đề xuất: new-contract

- **Isolation suite: case count in the header is stale**
  Người dùng thấy gì: Dòng ghi chú đầu bộ kiểm tra cách ly nói sai số ca kiểm. Người dùng không thấy gì; chỉ người đọc tài liệu có thể bị nhầm số.
  Căn cứ: Chỉ là con số trong ghi chú, không ảnh hưởng hành vi hay dữ liệu; sửa tay lúc nào cũng được.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: wont-fix

- **Correctness: undo reports a retired count it did not check**
  Người dùng thấy gì: Sau khi hoàn tác, màn có thể báo đã ngừng dùng nhiều mục hơn số thật sự được ngừng, ví dụ mục đã ngừng từ trước. Người dùng có thể tưởng sạch hơn thực tế.
  Căn cứ: Dữ liệu căn vẫn được gỡ đúng, chỉ con số tóm tắt lệch nhẹ; người dùng tự kiểm được ở lớp riêng của sàn.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **Tier: high, needs a code owner**
  Người dùng thấy gì: Thay đổi này thuộc mức cao nên cần chủ mã duyệt chứ không tự gộp được. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Đây là quy trình duyệt, không phải lỗi sản phẩm; chỉ cần người có thẩm quyền duyệt khi gộp.
  file: `governance/autonomy.yaml`
  severity: low
  Đề xuất: wont-fix

- **Migration 018 says it can run twice, but a second run fails**
  Người dùng thấy gì: Tệp cập nhật cơ sở dữ liệu ghi rằng chạy hai lần không sao, nhưng thực tế lần hai sẽ báo lỗi. Người dùng không gặp vì hệ thống chỉ chạy nó một lần.
  Căn cứ: Không bao giờ xảy ra trong vận hành bình thường và không mất dữ liệu; chỉ là câu ghi chú sai.
  file: `db/migrations/018_nhap_excel_can_cho_theo_san.sql`
  severity: low
  Đề xuất: wont-fix

- **Shape 5: the test claims a whole class of owner headers but checks only sample headers, and 5 of the 16 phrases have no case**
  Người dùng thấy gì: Bài kiểm tra việc chặn cột chủ nhà và số điện thoại chưa phủ hết các cách viết; nếu ai vô tình xoá một cách viết, bài kiểm tra vẫn xanh. Có thể có tệp lọt cột số chủ nhà mà không bị chặn.
  Căn cứ: Hiện hành vi vẫn đúng nên chưa ai bị ảnh hưởng, nhưng lưới an toàn cho dữ liệu nhạy cảm hở; thêm ca kiểm tra rẻ nhưng là việc riêng.
  file: `tests/nhap-excel-ghep-cot.test.ts`
  severity: medium
  Đề xuất: new-contract

- **Shape 4: the 'stays open' list checks only that the reason is not owner-column, without pinning the expected mark**
  Người dùng thấy gì: Bài kiểm tra các cột như diện tích và ghi chú chỉ xác nhận chúng không bị coi là cột chủ nhà, chưa khẳng định chúng được để mở. Nếu sau này các cột đó bị chặn nhầm vì lý do khác, bài kiểm tra vẫn không báo.
  Căn cứ: Hành vi hiện tại đúng và người dùng không bị ảnh hưởng; đây chỉ là lưới kiểm tra lỏng, siết sau được.
  file: `tests/nhap-excel-ghep-cot.test.ts`
  severity: low
  Đề xuất: known-limits

- **SP-1 Companies are isolated: listing_pending_units.pending_unit_id may point at a pending unit of another company (r2)**
  Người dùng thấy gì: Hiện mã vẫn chỉ lấy căn chờ của đúng sàn, nên chưa có sàn nào thấy hay bị gắn nhầm dữ liệu của sàn khác. Nhưng nếu sau này có lỗi ở mã, cơ sở dữ liệu sẽ không chặn việc gắn lần chào với căn chờ của sàn khác.
  Căn cứ: Chưa có đường nào đang mở lỗ nên người dùng chưa bị ảnh hưởng; sửa cần thêm một bước nâng cấp cơ sở dữ liệu riêng nên để dành khi có dịp.
  file: `db/migrations/015_nhap_excel.sql`
  severity: medium
  Đề xuất: known-limits

- **Design / module boundaries: imports and listings read and write other modules' tables directly (r2 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng không thấy gì khác khi dùng. Chỉ là luật gỡ căn chờ nằm ở hai chỗ, nên sau này sửa một nơi mà quên nơi kia thì hai màn có thể xử lý khác nhau.
  Căn cứ: Hiện chạy đúng và không mất dữ liệu; rủi ro chỉ là bảo trì về sau, sửa tốn công và không gấp.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Authorization and input: the server does not enforce batch order; the last batch closes the import while earlier batches are missing (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu một bên gọi máy chủ không qua màn và gửi gói cuối trước, lần nhập có thể bị đóng khi còn thiếu dòng, các dòng còn lại không ghi được nữa. Màn thật gửi đúng thứ tự nên người dùng bình thường không gặp.
  Căn cứ: Chỉ xảy ra khi bỏ qua màn nhập, không mất dữ liệu có sẵn, và người dùng nhập lại được.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **Team lead's list-agent fetch fails silently; Apply stays disabled with no message (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi Trưởng nhóm mở màn nhập mà danh sách Đầu chủ tải lỗi, ô chọn trống và nút Áp không bật, không có lời giải thích hay nút thử lại. Họ phải tải lại trang mới biết đường.
  Căn cứ: Không mất dữ liệu và tải lại trang là xử lý được; chỉ gây khó hiểu trong lúc mạng lỗi, ảnh hưởng nhóm nhỏ.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: medium
  Đề xuất: known-limits

- **allNewFieldCells is outside the table fingerprint, so the last batch can write custom-field values that were not in the opened table (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một bên gọi máy chủ cố tình sửa gói cuối có thể gắn giá trị trường riêng khác với bảng người đã xem trước lên các căn đã nhập. Màn thật không tự làm vậy.
  Căn cứ: Chỉ xảy ra khi có người cố tình, giá trị sai nằm trong sàn của chính họ và gỡ được bằng hoàn tác; sửa không gấp.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): các ca phá của E4, E6, E8, E9, E14 chỉ đưa giá trị chép tay vào bộ kiểm cục bộ, không chạy qua mã đã bị gỡ chốt (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một số bài kiểm chứng minh việc bỏ chốt thì phát hiện lỗi, nhưng chỉ thử trên dữ liệu dựng tay. Nếu sau này ai đó gỡ chốt thật, các bài này có thể vẫn xanh nên người dùng có thể gặp lỗi mà không ai báo trước.
  Căn cứ: Không ảnh hưởng người dùng hôm nay, chỉ làm lưới an toàn sau này yếu hơn; sửa tốn nhiều công.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: ca phá «mất mạng» của E16 đưa cho bộ kiểm một màn đã hồi phục, không phải màn nuốt lỗi (r2)**
  Người dùng thấy gì: Bài kiểm trạng thái mất mạng không chứng minh được thêm điều gì so với phép thử thường. Nếu màn sau này nuốt lỗi mất mạng thì bài này có thể không báo.
  Căn cứ: Chỉ làm lưới kiểm yếu đi chút, phép thử dương vẫn bắt phần lớn; chi phí sửa không đáng.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (khẳng định âm một mình, không ghim thông điệp): ca lần nhập cũ chưa có dấu vân tay chỉ đòi ok === false (r2)**
  Người dùng thấy gì: Bài kiểm về lần nhập cũ chỉ xác nhận bị từ chối, không xác nhận đúng lý do. Nếu chốt này hỏng nhưng có lý do khác từ chối thì bài vẫn xanh và lỗi có thể lọt tới người dùng.
  Căn cứ: Chỉ là lưới kiểm lỏng ở ca hiếm về lần nhập cũ, người dùng không bị ảnh hưởng ngay; sửa rẻ nhưng không gấp.
  file: `tests/nhap-excel-luu.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: lần dò «đường nhập không chạm lớp llm» chỉ đòi danh sách rỗng, không có đối chứng dương cho bộ dò (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm xác nhận việc nhập không dùng AI có thể xanh ngay cả khi bộ dò hỏng. Nếu sau này có chỗ gọi AI lọt vào đường nhập thì có thể không ai biết.
  Căn cứ: Hiện đường nhập thực sự không dùng AI nên người dùng không bị ảnh hưởng; chỉ là lưới kiểm cần chặt hơn và sửa rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng thiếu ma trận toàn phần): E16 hứa «tổng 28 ô hằng 28» nhưng không khẳng định nào ghim bảng khổ × trạng thái (r2)**
  Người dùng thấy gì: Không có phép kiểm nào đếm đủ số trạng thái màn ở mọi khổ. Nếu một khổ hay một trạng thái bị bỏ sót thì không bài nào báo đỏ và người dùng có thể gặp màn thiếu.
  Căn cứ: Màn hiện vẫn hiển thị đủ; chỉ là lưới kiểm chưa khoá chặt và thêm bảng đếm tương đối rẻ nhưng không gấp.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Design: a new dependency between modules has no decision page (r1)**
  Người dùng thấy gì: Không người dùng nào thấy ảnh hưởng. Chỉ là thiếu một trang ghi lại vì sao hai phần của hệ thống được cho phép dùng nhau.
  Căn cứ: Không ảnh hưởng dữ liệu hay màn hình; thiếu tài liệu, viết bù lúc nào cũng được và rẻ.
  file: `architecture/modules.yaml`
  severity: medium
  Đề xuất: known-limits

- **Personal data: ImportRun.kept stores raw cell text without a pii marking (r1)**
  Người dùng thấy gì: Những ô người nhập chọn giữ nguyên chữ có thể chứa số điện thoại chủ nhà ghi dưới một tên cột lạ, và được lưu lại không có hạn, nhân viên cùng sàn có quyền xem lần nhập có thể đọc được về sau.
  Căn cứ: Có thể lộ số chủ nhà trong phạm vi cùng sàn nhưng hiện màn hình chưa hiển thị phần này; sửa được sau mà không mất dữ liệu.
  file: `ontology/entities/ImportRun.yaml`
  severity: low
  Đề xuất: known-limits

- **Domain: the ontology does not match the schema for ListingPendingUnit and Listing.importRunId (r1 · tệp đã đổi)**
  Người dùng thấy gì: Mô tả nghiệp vụ lệch nhẹ so với cơ sở dữ liệu thật ở vài trường. Người dùng không thấy gì, nhưng người sửa sau có thể hiểu nhầm.
  Căn cứ: Không mất dữ liệu và không ảnh hưởng người dùng; chỉ là tài liệu mô hình chưa khớp, chỉnh lại rẻ.
  file: `ontology/entities/ListingPendingUnit.yaml`
  severity: low
  Đề xuất: known-limits

- **Authorization: insert on the unit-link tables only asks 'createListing is not null', without the listing's owner (r1)**
  Người dùng thấy gì: Ở tầng cơ sở dữ liệu, một Đầu chủ về lý thuyết có thể gắn mã căn vào tin rao của người khác trong cùng sàn. Hiện không có đường nào trên màn hình làm được việc này.
  Căn cứ: Chưa có đường khai thác thật và chỉ trong cùng sàn; hậu quả nhẹ, sửa sau không động đến dữ liệu hiện có.
  file: `db/migrations/015_nhap_excel.sql`
  severity: low
  Đề xuất: known-limits

- **Tier: high — a code owner must review (r1)**
  Người dùng thấy gì: Thay đổi này chạm vùng được bảo vệ nên phải có chủ kho xem và duyệt trước khi gộp. Người dùng cuối không thấy gì.
  Căn cứ: Không phải lỗi sản phẩm mà là bước duyệt bắt buộc, người ký sẽ tự thấy khi mở yêu cầu gộp.
  file: `governance/autonomy.yaml`
  severity: low
  Đề xuất: known-limits

- **The kept-cell count the screen promises includes unit codes the server never stores in kept (r1 · tệp đã đổi)**
  Người dùng thấy gì: Màn xem trước nói sẽ giữ một số ô chữ, nhưng với các dòng căn đã có tin rao hay căn còn chưa trả lời thì mã căn không được lưu lại trong bản ghi lần nhập. Con số người thấy lớn hơn số thật được giữ.
  Căn cứ: Không mất tin rao nào đã tạo, chỉ lệch ở bản ghi phụ để tra cứu; nhập lại tệp là bù được.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **The last batch learns spellings and unit codes using only that batch's rows, so it stores the folded key instead of the original text (r1 · tệp đã đổi)**
  Người dùng thấy gì: Với tệp nhiều dòng, cách viết hay mã căn được nhớ có thể hiện bằng chữ thường không dấu thay vì đúng như trong tệp.
  Căn cứ: Chỉ sai cách hiển thị, giá trị vẫn khớp lần sau và người dùng sửa được; hậu quả nhẹ.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (relation measured by a tautology): E13 'sàn B không câu nào được trả lời sẵn' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra việc sàn B không thấy gì sàn A đã học không thật sự đo được, nên nếu sau này hai sàn lộ dữ liệu cho nhau thì bài kiểm tra vẫn xanh.
  Căn cứ: Hiện chưa có dấu hiệu rò dữ liệu thật; rủi ro nằm ở việc lỗi sau này khó bị phát hiện, và viết lại bài kiểm tra thì rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Shape 4 (negative-only, break never triggered): 'learned items survived failed apply' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra việc lần nhập hỏng thì không ghi nhớ gì chưa thật sự chạy tình huống hỏng, nên chưa chứng minh được điều đó.
  Căn cứ: Hành vi sản phẩm chưa bị chứng minh sai; chỉ là bằng chứng yếu, bổ sung bài kiểm tra sau không mất dữ liệu của ai.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: high
  Đề xuất: known-limits

- **Shape 3 (status code in place of a relation): E9 'who imports for whom' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra việc Trưởng nhóm nhập thay cho Đầu chủ chỉ xem mã trả lời, không xem tin rao có đúng người phụ trách hay không.
  Căn cứ: Chưa có lỗi thật được chỉ ra, chỉ là kiểm tra mỏng; bổ sung sau rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared matrix that is only point cases): E9 permission table 4 roles × 2 actions, and E9 status table 5 cases (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bảng quyền theo vai và bảng trạng thái căn mới được thử một phần, nên một vai hay trạng thái chưa thử có thể sai mà không ai biết.
  Căn cứ: Chưa thấy lỗi thật, chỉ thiếu ca thử; bổ sung sau rẻ và không ảnh hưởng người dùng.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared 9-code matrix with only 5 point cases): E6 'can' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Thứ tự tra mã căn mới được thử trên một phần số ca đã hứa, nên một thứ tự tra sai có thể lọt qua.
  Căn cứ: Chưa có hành vi sai thật được chỉ ra; thêm ca thử sau là rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (sweep of 3 files × 2 runs, only 4 runs): E7 'không mất ô' (r1)**
  Người dùng thấy gì: Phép thử rằng không ô nào bị mất mới chạy 4 trong 6 lượt đã hứa, nên một số trường hợp mất ô có thể chưa bị bắt.
  Căn cứ: Không có ô nào bị chứng minh là mất, chỉ là phép thử chưa đủ; bổ sung rẻ.
  file: `tests/nhap-excel-khong-mat-o.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared 30-cell matrix, 11 cells pinned): E16 'trang thai' (r1)**
  Người dùng thấy gì: Một số trạng thái của màn Nạp tệp ở một số khổ màn hình chưa được kiểm tra tự động, nên lỗi hiển thị hay lỗi truy cập có thể lọt.
  Căn cứ: Chưa thấy lỗi hiển thị thật; người dùng tải lại được và thêm ca kiểm tra sau là rẻ.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared class with zero asserts): E11 points at a test file that does not exist (r1)**
  Người dùng thấy gì: Bài kiểm tra khớp mô hình nghiệp vụ với cơ sở dữ liệu được hứa nhưng chưa tồn tại, nên tiêu chí này xanh mà không đo gì.
  Căn cứ: Không phải lỗi người dùng gặp nhưng làm mất một lớp bảo vệ; viết bài kiểm tra sau là việc nhỏ.
  file: `_acceptance/nhap-excel/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Shape 1 (measures the rule function, not the import path's output): 'a new custom field from a column goes through row 7e's rules' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra chưa chứng minh được đường nhập thật sự đi qua luật tạo trường riêng, nên nếu bước đó bị gỡ thì bài vẫn xanh.
  Căn cứ: Hành vi sai thật đã được ghi ở một mục khác; riêng bài kiểm tra yếu thì bổ sung sau rẻ.
  file: `tests/nhap-excel-ghep-cot.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only, no positive control in the same case): 'B sees none of A's imports' and 'B's team lead sees only B's' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra cách ly giữa các sàn chỉ xem sàn B không thấy dữ liệu sàn A, chưa xem sàn B có thấy dữ liệu của chính mình, nên một lỗi làm ẩn hết cũng qua được.
  Căn cứ: Không có dữ liệu bị lộ hay mất; chỉ là bằng chứng chưa đầy đủ và bổ sung rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only, no proof the screen reached the step with the button): BuyerAgent sees no Áp (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra việc Đầu khách không thấy nút Áp chưa chắc đã đến bước có nút, nên có thể xanh vì lý do khác.
  Căn cứ: Quyền này còn được chặn ở máy chủ, nên hậu quả nhẹ; không đáng mở việc riêng.
  file: `tests/nhap-excel-man.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Shape 2 (fixture made to the reader's check): khoa.xlsx is 12 bytes of magic (r1)**
  Người dùng thấy gì: Tệp thử khoá mật khẩu và tệp hỏng là tệp tự dựng chứ không phải từ Excel thật, nên tệp thật lạ có thể bị đọc sai mà chưa ai biết.
  Căn cứ: Hợp đồng đã ghi nhận thiếu tệp Excel thật; người dùng gặp tệp lạ sẽ thấy báo lỗi và thử lại được.
  file: `tests/fixtures/nhap-excel/tao.mjs`
  severity: low
  Đề xuất: known-limits

- **Shape 6 (hardcoded author path): the plugin measured is the owner's checkout (r1)**
  Người dùng thấy gì: Phép chấm của một việc khác phụ thuộc vào thư mục riêng trên máy của chủ kho, nên chạy ở máy khác có thể cho kết quả khác. Không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Chỉ ảnh hưởng độ tin cậy của phép chấm trên máy khác, không đụng dữ liệu; sửa sau rẻ.
  file: `_acceptance/bring-out-claude-design/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

- **Shape 6 (hardcoded author path): the 0.76.0 plugin measured from the owner's checkout (r1)**
  Người dùng thấy gì: Phép chấm việc nâng cấp công cụ thiết kế đọc bản làm việc đang mở của chủ kho nên kết quả đổi khi bản đó đổi. Không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Chỉ làm kết quả chấm kém ổn định, không mất dữ liệu; có thể chấp nhận hoặc ghim bản sau.
  file: `_acceptance/upgrade-design-assembly-0-76-0/rang/matrix.mjs`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 2/12 lỗi rơi vào file không bộ đo nào phủ (governance/autonomy.yaml, db/migrations/018_nhap_excel_can_cho_theo_san.sql) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
