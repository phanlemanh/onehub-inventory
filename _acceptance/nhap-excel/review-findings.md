## Trong hợp đồng

- **Criteria and tests (AC-7): when one batch fails, the screen neither resends that batch nor says how many rows were written**
  file: `src/modules/imports/ui/import-wizard.tsx:245`
  severity: high
  AC: AC-7
  source: invariants
  detail: AC-7 trong _acceptance/nhap-excel/contract.md:58-62 yêu cầu: «một gói hỏng thì các gói đã ghi giữ nguyên, gói hỏng không ghi dòng nào, màn nói đúng số dòng đã ghi và «Thử lại» gửi đúng gói hỏng». Mã hiện tại không làm vậy. Ở ApplyBatches (import-wizard.tsx:641-666), khi gói b>0 hỏng, màn chỉ đặt banner «failed»/«offline». Chữ của banner (copy.ts:53 «Chưa ghi gì — mất kết nối mạng.», copy.ts:56 «Chưa ghi được — lỗi máy chủ.») nói rằng chưa ghi gì, trong khi các gói 0..b-1 đã ghi xong. Nút «Thử lại» trên banner (dòng 245-247) gọi refresh(table, choices), tức là chạy lại bước xem trước, không gửi lại gói hỏng. Bấm Áp lần nữa thì props.open() mở một lần nhập MỚI. Lần nhập cũ bị bỏ ở trạng thái 'open' mãi, Xong chỉ đếm lần mới, và Hoàn tác lần mới không gỡ các lần chào lần cũ đã tạo. Không có ca kiểm nào cho gói giữa chừng bị hỏng: tests/nhap-excel-man.test.tsx và tests/e2e-db/nhap-excel.spec.ts chỉ thử Thử lại của hoàn tác và của xem trước. Cách sửa: giữ runId và số gói đã ghi; banner nói đúng số dòng đã ghi; Thử lại gửi lại đúng gói batchNo đó trên runId cũ. Thêm một ca màn, trong đó gói thứ hai trả 500 rồi Thử lại thành công.

- **Personal data (Hỏi-12 / pii ListingOwner): the owner-column block matches only exact headers, so common headers get through**
  file: `src/modules/imports/targets.ts:120`
  severity: medium
  AC: AC-2
  source: invariants
  detail: OWNER_HEADERS là một tập các tên đã gấp chữ, so khớp nguyên văn: «chu nha», «ten chu», «sdt», «sdt chu», «so chu», «dien thoai», «so dien thoai», «dt chu», «lien he». Nhiều tiêu đề rất thường gặp vì thế không bị chặn: «SĐT chủ nhà» (gấp ra «sdt chu nha»), «Tên chủ nhà», «Điện thoại chủ nhà», «Số ĐT», «SĐT CN», «Liên hệ chủ nhà», «Phone». Cột như vậy được coi là «cần người», và người nhập có thể chọn «trường riêng mới» cho nó. Khi đó số và tên chủ nhà vào listings.custom_fields. Mọi Đầu chủ và Đầu khách có viewListings toàn sàn đọc được các giá trị ấy, tức là đi vòng qua viewOwnerPhone (chỉ của mình) và luật «ghi ở hồ sơ căn, hàng 11b» của AC-2. Thêm nữa: dù cột đã bị bỏ, toàn bộ ô của nó vẫn đi lên máy chủ trong mỗi lần gọi preview, open và batches. Cách sửa: nhận diện theo từ khoá (chứa «chu»/«chủ» cùng «sdt|dien thoai|so|ten|lien he», hoặc «phone|tel|mobile»), có thể thêm dò mẫu giá trị trông như số điện thoại; thêm các tiêu đề trên vào bảng ca của tests/nhap-excel-ghep-cot.test.ts; bỏ các cột đã bỏ khỏi thân yêu cầu.

- **Domain rule 'one open listing per unit per company' breaks once a pending unit has been matched to the catalog**
  file: `src/modules/imports/store.ts:117`
  severity: medium
  AC: AC-7
  source: invariants
  detail: Listing.yaml:52 có luật «Within one company a unit has at most one open listing». Sau khi matchPendingUnits (company-config/store.ts:436) gán unit_key cho một căn chờ, các lần chào đang mở trên căn ấy vẫn nằm ở listing_pending_units; không có gì chuyển chúng sang listing_units. Ở lần nhập sau với cùng mã: context() nhận found.source='pending' có unitKey nên coi là căn danh mục, nhưng tập `listed` (dòng 117-118) chỉ chứa unit_key của listing_units và pending_unit_id của listing_pending_units. Vì vậy căn này không bị coi là đã có lần chào mở; dòng được tạo, và create.ts chèn listing_units cho upi ấy. Unique index listing_units_one_open không thấy lần chào bên bảng pending, và trigger listing_one_unit_link chỉ xét cùng một listing_id. Kết quả là hai lần chào mở cho cùng một căn trên Bảng hàng. Mô tả quan hệ «until the catalog has it» (relations.yaml) cũng không đúng với hành vi này. Cách sửa: khi đếm `listed`, ánh xạ pending_unit_id có unit_key sang unit_key; hoặc chặn ở cơ sở dữ liệu (trigger hay index chéo). Thêm ca kiểm: nhập căn chờ, khớp danh mục, nhập lại cùng mã thì ra 0 lần chào mới.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SP-1 Companies are isolated: listing_pending_units.pending_unit_id may point at a pending unit of another company**
  Người dùng thấy gì: Hiện mã vẫn chỉ lấy căn chờ của đúng sàn, nên chưa có sàn nào thấy hay bị gắn nhầm dữ liệu của sàn khác. Nhưng nếu sau này có lỗi ở mã, cơ sở dữ liệu sẽ không chặn việc gắn lần chào với căn chờ của sàn khác.
  Căn cứ: Chưa có đường nào đang mở lỗ nên người dùng chưa bị ảnh hưởng; sửa cần thêm một bước nâng cấp cơ sở dữ liệu riêng nên để dành khi có dịp.
  file: `db/migrations/015_nhap_excel.sql`
  severity: medium
  Đề xuất: known-limits

- **Design / module boundaries: imports and listings read and write other modules' tables directly**
  Người dùng thấy gì: Người dùng không thấy gì khác khi dùng. Chỉ là luật gỡ căn chờ nằm ở hai chỗ, nên sau này sửa một nơi mà quên nơi kia thì hai màn có thể xử lý khác nhau.
  Căn cứ: Hiện chạy đúng và không mất dữ liệu; rủi ro chỉ là bảo trì về sau, sửa tốn công và không gấp.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Authorization and input: the server does not enforce batch order; the last batch closes the import while earlier batches are missing**
  Người dùng thấy gì: Nếu một bên gọi máy chủ không qua màn và gửi gói cuối trước, lần nhập có thể bị đóng khi còn thiếu dòng, các dòng còn lại không ghi được nữa. Màn thật gửi đúng thứ tự nên người dùng bình thường không gặp.
  Căn cứ: Chỉ xảy ra khi bỏ qua màn nhập, không mất dữ liệu có sẵn, và người dùng nhập lại được.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **Team lead's list-agent fetch fails silently; Apply stays disabled with no message**
  Người dùng thấy gì: Khi Trưởng nhóm mở màn nhập mà danh sách Đầu chủ tải lỗi, ô chọn trống và nút Áp không bật, không có lời giải thích hay nút thử lại. Họ phải tải lại trang mới biết đường.
  Căn cứ: Không mất dữ liệu và tải lại trang là xử lý được; chỉ gây khó hiểu trong lúc mạng lỗi, ảnh hưởng nhóm nhỏ.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: medium
  Đề xuất: known-limits

- **allNewFieldCells is outside the table fingerprint, so the last batch can write custom-field values that were not in the opened table**
  Người dùng thấy gì: Một bên gọi máy chủ cố tình sửa gói cuối có thể gắn giá trị trường riêng khác với bảng người đã xem trước lên các căn đã nhập. Màn thật không tự làm vậy.
  Căn cứ: Chỉ xảy ra khi có người cố tình, giá trị sai nằm trong sàn của chính họ và gỡ được bằng hoàn tác; sửa không gấp.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): các ca phá của E4, E6, E8, E9, E14 chỉ đưa giá trị chép tay vào bộ kiểm cục bộ, không chạy qua mã đã bị gỡ chốt**
  Người dùng thấy gì: Một số bài kiểm chứng minh việc bỏ chốt thì phát hiện lỗi, nhưng chỉ thử trên dữ liệu dựng tay. Nếu sau này ai đó gỡ chốt thật, các bài này có thể vẫn xanh nên người dùng có thể gặp lỗi mà không ai báo trước.
  Căn cứ: Không ảnh hưởng người dùng hôm nay, chỉ làm lưới an toàn sau này yếu hơn; sửa tốn nhiều công.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: ca phá «mất mạng» của E16 đưa cho bộ kiểm một màn đã hồi phục, không phải màn nuốt lỗi**
  Người dùng thấy gì: Bài kiểm trạng thái mất mạng không chứng minh được thêm điều gì so với phép thử thường. Nếu màn sau này nuốt lỗi mất mạng thì bài này có thể không báo.
  Căn cứ: Chỉ làm lưới kiểm yếu đi chút, phép thử dương vẫn bắt phần lớn; chi phí sửa không đáng.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (khẳng định âm một mình, không ghim thông điệp): ca lần nhập cũ chưa có dấu vân tay chỉ đòi ok === false**
  Người dùng thấy gì: Bài kiểm về lần nhập cũ chỉ xác nhận bị từ chối, không xác nhận đúng lý do. Nếu chốt này hỏng nhưng có lý do khác từ chối thì bài vẫn xanh và lỗi có thể lọt tới người dùng.
  Căn cứ: Chỉ là lưới kiểm lỏng ở ca hiếm về lần nhập cũ, người dùng không bị ảnh hưởng ngay; sửa rẻ nhưng không gấp.
  file: `tests/nhap-excel-luu.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: lần dò «đường nhập không chạm lớp llm» chỉ đòi danh sách rỗng, không có đối chứng dương cho bộ dò**
  Người dùng thấy gì: Bài kiểm xác nhận việc nhập không dùng AI có thể xanh ngay cả khi bộ dò hỏng. Nếu sau này có chỗ gọi AI lọt vào đường nhập thì có thể không ai biết.
  Căn cứ: Hiện đường nhập thực sự không dùng AI nên người dùng không bị ảnh hưởng; chỉ là lưới kiểm cần chặt hơn và sửa rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng thiếu ma trận toàn phần): E16 hứa «tổng 28 ô hằng 28» nhưng không khẳng định nào ghim bảng khổ × trạng thái**
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

- **Personal data: ImportRun.kept stores raw cell text without a pii marking (r1 · tệp đã đổi)**
  Người dùng thấy gì: Những ô người nhập chọn giữ nguyên chữ có thể chứa số điện thoại chủ nhà ghi dưới một tên cột lạ, và được lưu lại không có hạn, nhân viên cùng sàn có quyền xem lần nhập có thể đọc được về sau.
  Căn cứ: Có thể lộ số chủ nhà trong phạm vi cùng sàn nhưng hiện màn hình chưa hiển thị phần này; sửa được sau mà không mất dữ liệu.
  file: `ontology/entities/ImportRun.yaml`
  severity: low
  Đề xuất: known-limits

- **Domain: the ontology does not match the schema for ListingPendingUnit and Listing.importRunId (r1)**
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

- **Shape 5 (a declared 30-cell matrix, 11 cells pinned): E16 'trang thai' (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số trạng thái của màn Nạp tệp ở một số khổ màn hình chưa được kiểm tra tự động, nên lỗi hiển thị hay lỗi truy cập có thể lọt.
  Căn cứ: Chưa thấy lỗi hiển thị thật; người dùng tải lại được và thêm ca kiểm tra sau là rẻ.
  file: `tests/e2e-db/nhap-excel.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (a declared class with zero asserts): E11 points at a test file that does not exist (r1 · tệp đã đổi)**
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

- **Shape 4 (negative-only, no positive control in the same case): 'B sees none of A's imports' and 'B's team lead sees only B's' (r1)**
  Người dùng thấy gì: Bài kiểm tra cách ly giữa các sàn chỉ xem sàn B không thấy dữ liệu sàn A, chưa xem sàn B có thấy dữ liệu của chính mình, nên một lỗi làm ẩn hết cũng qua được.
  Căn cứ: Không có dữ liệu bị lộ hay mất; chỉ là bằng chứng chưa đầy đủ và bổ sung rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative-only, no proof the screen reached the step with the button): BuyerAgent sees no Áp (r1)**
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

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
