# Review findings: cach-ly-moi-san (round 2)

## Trong hợp đồng

- **Authorization/isolation (SP-1, AC-6): ca luat-doc-ghi-theo-san cho qua luật FOR ALL hoặc DELETE mở theo cột đối tác, bảng mới ghi chéo sàn mà bộ kiểm vẫn xanh**
  AC: AC-6
  file: `db/tests/cach-ly.sql:296`
  severity: high
  source: invariants
  detail: Phần qual của mọi luật đều được kiểm với chi_cot_san=false, nên chấp nhận cả cột đối tác (`*_company_id`). Ca 'luật thêm và sửa phải có điều kiện kiểm' ở dòng 303 chỉ xét cmd INSERT và UPDATE. Một luật `for all using (company_id = app.current_company_id() or partner_company_id = app.current_company_id())` không có WITH CHECK vì thế qua cả hai bước. Khi đó Postgres dùng chính biểu thức USING làm điều kiện ghi, tức điều kiện ghi nhận cột đối tác, trái với lời AC-6 'luật thêm và sửa có điều kiện kiểm'. Luật DELETE có cột đối tác cũng lọt theo đường này. Đã thử trên Postgres của dãy n, trong một cơ sở nháp đã xoá sau khi thử: thêm bảng bang_doi_tac có luật nói trên rồi chạy cach-ly.sql, kết quả cả 14 ca in ok ('luat-doc-ghi-theo-san — 3 bảng'). Cũng trên cơ sở đó, dưới vai quy_hang_app với sàn A, câu `insert ... (company_id=B, partner_company_id=A)` thành công. Với bảng công ty thêm về sau, ca quét danh mục là lưới duy nhất, vì các ca hành vi 2-11 chỉ chạm companies và agreements. Cách sửa: khi cmd là ALL, INSERT, UPDATE hoặc DELETE, kiểm qual với chi_cot_san=true, vì chỉ luật SELECT mới được nhắc cột đối tác. Coi ALL không có with_check là luật ghi lấy qual làm điều kiện kiểm. Thêm một bản phá thử 'for all … or partner_company_id' vào pha-thu.

- **Criteria/AC-8 (SP-1): bộ quét một cửa đọc từng dòng nên Prettier của chính kho làm nó mù trước chuỗi gọi bị ngắt dòng**
  AC: AC-8
  file: `src/modules/identity/one-door.test.ts:40`
  severity: medium
  source: invariants
  detail: POOL_CALL được thử trên từng dòng, và phải thấy tên bể và `.query(`/`.connect(` trên cùng một dòng. Prettier của kho ngắt các chuỗi gọi dài thành nhiều dòng. Đã chạy thử `npx prettier`: `await appPool.query("select … from agreements …", [1]).then(...).catch(...)` được định dạng thành `await appPool` rồi xuống dòng `.query("select …")`, và không dòng nào khớp POOL_CALL. Như vậy một truy vấn vòng qua withCompany và chạy bằng vai đăng nhập của bể, nằm ngoài quy_hang_app và luật theo dòng, vẫn để make check xanh chỉ vì `make format`. Các lỗ đặt tên khác như `db.query`, bí danh hay tệp .js/.mjs đã có trong vòng 1. Riêng lỗ này do định dạng tự động gây ra, không cần ai cố tình né. Cách sửa: quét trên cả tệp với regex cho phép khoảng trắng và xuống dòng trước `.` (ví dụ `[Pp]ool\s*\??\.\s*(query|connect)`), hoặc chặn import 'pg' ngoài tệp cửa. Thêm một tệp mẫu đã qua Prettier vào phần đối chứng.

- **Catalog case checks a policy's USING clause with the read rule even when the policy governs writes (ALL / UPDATE / DELETE), so a partner column can slip into a write policy**
  AC: AC-6
  file: `db/tests/cach-ly.sql:296`
  severity: medium
  source: bugs
  detail: Case 13 always calls `pg_temp.loc_theo_san(p.qual, b.cot, false)`, whatever `p.cmd` is. With `false`, any column ending in `company_id` is accepted, as the read rule allows. The 'must have a with_check' guard only covers `cmd in ('INSERT','UPDATE')`, not `ALL`. Postgres uses USING as the write check when an ALL policy has no WITH CHECK. USING is also the row filter for UPDATE and DELETE. Three policies therefore pass case 13 even though they let the partner write: `create policy x on t for all using (company_id = app.current_company_id() or counterparty_company_id = app.current_company_id())` (no with_check), an UPDATE policy with that USING plus `with check (company_id = app.current_company_id())` (the partner can take over the row with `set company_id = <own>`), and a DELETE policy with that USING. This contradicts the rule written at line 53: 'writes may only match the table's own company column'. For `agreements`, the dynamic cases 7, 8 and 11 still turn red, but only because of the current fixtures and grants. For a new company table, where only the catalog case runs (see bang-moi-luat-mo), there is no backstop. Fix: pass `chi_cot_san := p.cmd <> 'SELECT'` for qual, and require with_check for `ALL` as well, or check the qual of ALL with the write rule.

- **One-door scanner still misses pool calls with nested type arguments**
  AC: AC-8
  file: `src/modules/identity/one-door.test.ts:21`
  severity: low
  source: bugs
  detail: The new POOL_CALL claims that 'Type arguments (`query<Row>(`) … count too', but `(?:<[^>]*>)?` stops at the first `>`. `pool.query<Array<Row>>('…')`, `pool.query<QueryResult<Row>>(…)` and `new Pool<Foo<Bar>>({})` therefore do not match, and the guard passes even though a query bypasses withCompany. Nested generics are common with `pg` (`QueryResultRow`, `Record<string, …>`). Use `(?:<.*?>+)?`, or simply allow any characters between the method name and `(`, e.g. `(?:<[^(]*>)?`. Add a control line with a nested generic to the 'typed and optional calls' test.

- **Shape 5 (claims a whole class, covers only one point): the 'writes only match the company's own column' rule is checked only on WITH CHECK, so a FOR ALL policy that lets the partner company write passes check 13**
  AC: AC-6
  file: `db/tests/cach-ly.sql:296`
  severity: medium
  source: measurement
  detail: Comment lines 54-55 state the rule for the whole class: 'writes may only match the table's own company column'. Line 296 checks every p.qual with chi_cot_san=false, whatever p.cmd is, so the USING clause of an UPDATE, DELETE or ALL policy may name a partner column. Line 303 asks for with_check only when cmd is INSERT or UPDATE. When an ALL policy has no WITH CHECK, Postgres uses its USING expression as the write check. So `create policy x on t for all using (company_id = app.current_company_id() or partner_company_id = app.current_company_id())` passes line 296 (partner column allowed), skips line 299 (with_check is null) and skips line 303 (cmd is ALL). The partner company could then insert or update rows that belong to another company. Break file luat-them-khong-kiem-doi-tac.sql proves only one point: the explicit `for insert with check (... or counterparty_company_id = ...)` form. No break file covers ALL without WITH CHECK, and none covers a partner column in an UPDATE's USING. On agreements, behaviour case 8 happens to go red, through an unpinned error. A new company table has no behaviour cases and relies only on checks 12-14, as bang-moi-luat-mo shows, so this gap passes the suite with nothing red.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Authorization/isolation (SP-1): cửa withCompany giao client thô, việc bên trong tự thoát được vai không sở hữu bảng**
  Người dùng thấy gì: Mã nghiệp vụ viết sai hoặc cố ý có thể tự thoát khỏi vai hạn chế và nhìn thấy dữ liệu của sàn khác. Hiện chưa có mã nào làm vậy, nhưng nền chưa chặn được.
  Căn cứ: Chỉ xảy ra khi có người viết mã cố tình vòng qua cửa, hiện chưa có mã nghiệp vụ nào, và sửa sau vẫn rẻ khi cửa được dùng thật.
  file: `src/modules/identity/with-company.ts`
  severity: medium
  Đề xuất: known-limits

- **Authorization/isolation (SP-1): rollback lỗi thì kết nối vẫn được trả về bể như kết nối lành**
  Người dùng thấy gì: Khi một lần huỷ giao dịch cũng lỗi, kết nối nửa chừng có thể quay lại bể và một yêu cầu sau dùng nhầm trạng thái của sàn trước. Trường hợp này hiếm.
  Căn cứ: Hiếm gặp, chỉ khi kết nối đã hỏng, người dùng tự khắc phục được bằng thử lại, và sửa sau không tốn kém.
  file: `src/modules/identity/with-company.ts`
  severity: low
  Đề xuất: known-limits

- **Domain (AGENTS: rule/relation phải có trong ontology) và quyết định 0014: migration mở đường đọc chéo sàn qua thoả thuận hợp tác mà ontology và MVP không có**
  Người dùng thấy gì: Sàn đối tác đọc được cả dòng thoả thuận của sàn kia, gồm tên người duyệt và điều khoản riêng, dù mô hình nghiệp vụ chưa mô tả quyền này.
  Căn cứ: Quyền đọc này chỉ áp cho thoả thuận hợp tác mà MVP chưa dùng, nên chưa có dữ liệu thật bị lộ, và đóng lại sau bằng một bước nâng cấp mới là đủ.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: medium
  Đề xuất: known-limits

- **Tier (governance/autonomy.yaml): cửa và lưới của SP-1 nằm ở đường mức thấp hoặc trung bình**
  Người dùng thấy gì: Về sau một thay đổi chỉ chạm cửa truy vấn hoặc bộ kiểm cách ly có thể được gộp mà không cần chủ kho duyệt, làm yếu luật cách ly giữa các sàn.
  Căn cứ: Đợt này vẫn cần chủ kho duyệt nên chưa mất gì; rủi ro chỉ về sau và chủ kho tự thêm đường vào mức cao là xong.
  file: `src/modules/identity/one-door.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-6: ca quét danh mục bỏ sót view, hàm SECURITY DEFINER và schema khác, trong khi chủ bảng là superuser**
  Người dùng thấy gì: Nếu sau này có người thêm một dạng xem hoặc hàm đặc quyền, nó có thể trả dữ liệu của mọi sàn mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hiện chưa có dạng xem hay hàm nào như vậy nên chưa lộ gì, nhưng nếu xảy ra thì lộ chéo sàn khá nặng nên đáng làm thành việc riêng.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Records: phần expected của AC-6 trong evals.yaml còn mô tả phép dò chuỗi cũ, và thẻ Cổng 1 vẫn để AC-8 ở mục «Sẽ KHÔNG làm»**
  Người dùng thấy gì: Hồ sơ nghiệm thu mô tả sai cách giữ luật cách ly và xếp nhầm một việc đã làm vào mục không làm, người duyệt có thể hiểu sai.
  Căn cứ: Không ảnh hưởng người dùng hay dữ liệu, chỉ gây hiểu lầm cho người duyệt, sửa lại hồ sơ rất rẻ.
  file: `_acceptance/cach-ly-moi-san/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims a whole class, covers only some points): loc_theo_san says five forms fail closed, but only some have a break file, and the function has no direct test matrix**
  Người dùng thấy gì: Một vài dạng luật mở quá rộng chưa có ca thử chứng minh bộ kiểm sẽ báo đỏ, nên chưa chắc chặn được.
  Căn cứ: Không có dữ liệu thật bị lộ và các dạng chính đã được thử, bổ sung ca thử sau rẻ.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **Shape 5 / Shape 4: the break list is hand-written and not matched against the folder, and a case with no files is still counted as passing**
  Người dùng thấy gì: Một bản phá thử thêm sau có thể quên đăng ký mà không ai biết, nên bộ kiểm có thể báo đạt dù thực ra chưa được thử.
  Căn cứ: Hiện cả bảy tệp đều đã đăng ký đúng, rủi ro chỉ về sau và người dùng không bị ảnh hưởng.
  file: `db/scripts/cach-ly.sh`
  severity: low
  Đề xuất: known-limits

- **Authorization/isolation (SP-1): withCompany đưa client thô cho việc, việc tự thoát được vai và sàn (r1)**
  Người dùng thấy gì: Mã nghiệp vụ viết sau này về lý thuyết có thể tự đổi sàn hoặc thoát khỏi lớp cách ly giữa chừng, và hiện chưa có lưới nào bắt việc đó. Hiện chưa có đường truy vấn thật nên chưa ai bị ảnh hưởng.
  Căn cứ: Rủi ro chỉ xuất hiện khi có mã thật kết nối cơ sở dữ liệu, mà việc đó là hàng sau; ghi lại ngay bây giờ rồi xử lý cùng lúc nối dữ liệu thật là rẻ nhất.
  file: `src/modules/identity/with-company.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-6: ca quét danh mục bỏ sót view, view vật chất hoá, hàm security definer và schema khác (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này có người tạo một dạng xem hay hàm đặc quyền trên dữ liệu thoả thuận, sàn này có thể đọc được dữ liệu sàn khác mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hậu quả là lộ dữ liệu giữa các sàn và khó tự phát hiện, nhưng chỉ xảy ra khi có thay đổi lược đồ sau này, nên nên làm thành một việc riêng có phạm vi rõ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Authorization (SP-1): không kiểm quyền TRUNCATE/TRIGGER/REFERENCES của vai API (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu migration sau lỡ cấp quyền rộng cho vai của API, một sàn có thể xoá sạch dữ liệu mọi sàn mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nặng nếu xảy ra vì mất dữ liệu của mọi sàn, nhưng chỉ khi có cấp quyền sai trong tương lai; thêm một ca kiểm là rẻ nên đáng làm thành việc riêng.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Domain/Records: migration đưa lại trần lớp dữ liệu mà quyết định 0014 đã bỏ, và lệch ontology Agreement (r1)**
  Người dùng thấy gì: Mô hình dữ liệu thoả thuận trong cơ sở dữ liệu còn lệch với mô tả nghiệp vụ và một quyết định cũ, nên người đọc sau có thể hiểu sai quy tắc.
  Căn cứ: Không mất hay lộ dữ liệu, chỉ gây nhầm lẫn khi đọc tài liệu; ghi rõ lệch này và để chủ kho chọn bên khi đụng tới thoả thuận.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-8: bộ quét một cửa hẹp, dễ vòng qua (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một người viết mã sau này có thể mở kết nối ngoài cửa bằng cách đặt tên khác mà bộ quét không phát hiện, làm mất lớp bảo vệ cách ly ở mã nguồn.
  Căn cứ: Lỗ chỉ có ý nghĩa khi gói kết nối thật được thêm vào; thêm luật cấm import khi đó là rẻ và hợp thời điểm hơn.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: known-limits

- **Design/one door: server.ts lộ câu đổi vai và câu đặt sàn ra ngoài module (r1)**
  Người dùng thấy gì: Module khác về lý thuyết có thể tự dựng một cửa thứ hai thay vì dùng cửa chung, làm luật cách ly nằm ở hai nơi.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và dễ gỡ bất cứ lúc nào, nên ghi lại là đủ.
  file: `src/modules/identity/server.ts`
  severity: low
  Đề xuất: known-limits

- **Records: chú thích trong migration chỉ tới bộ kiểm không có trong kho (r1)**
  Người dùng thấy gì: Người viết bảng mới sau này có thể đi tìm bộ kiểm ở chỗ không tồn tại trong kho này.
  Căn cứ: Chỉ làm mất chút thời gian của lập trình viên, không ảnh hưởng dữ liệu; ghi chú chỉ đúng chỗ là đủ.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: low
  Đề xuất: known-limits

- **Conventions (AGENTS.md Language): tên tệp và định danh viết tiếng Việt (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số tên tệp và hàm kiểm dùng tiếng Việt trái quy ước đặt tên tiếng Anh của kho, nhưng người dùng cuối không thấy gì.
  Căn cứ: Chỉ là quy ước nội bộ, đổi tên có chi phí duyệt lại các phép đo nên ghi ngoại lệ là hợp lý.
  file: `db/scripts/cach-ly.sh`
  severity: low
  Đề xuất: known-limits

- **Intent: thẻ Cổng 1 xếp AC-8 vào nhóm «Sẽ KHÔNG làm» dù hợp đồng có làm (r1)**
  Người dùng thấy gì: Thẻ duyệt hiện việc chặn mã mở kết nối ngoài cửa dưới mục không làm, người duyệt có thể tưởng nó bị cắt.
  Căn cứ: Hợp đồng đã duyệt ghi rõ việc này có làm, nên chỉ cần ghi chú; không mất dữ liệu và sửa thẻ rất rẻ.
  file: `_acceptance/cach-ly-moi-san/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Evidence: make check đỏ tại máy vì tệp sinh ra của lượt nghiệm thu (r1)**
  Người dùng thấy gì: Trên máy này bước kiểm tra mã báo đỏ do một tệp tạm của lượt nghiệm thu, còn trên CI vẫn xanh.
  Căn cứ: Tệp tạm tự mất khi dọn thư mục chạy, không ảnh hưởng sản phẩm hay CI nên chấp nhận.
  file: `.acceptance-runs/cach-ly-moi-san/acceptance-verify.js`
  severity: low
  Đề xuất: wont-fix

- **A failed rollback is swallowed and the client is still returned to the pool as healthy (r1)**
  Người dùng thấy gì: Trong tình huống hiếm khi việc huỷ giao dịch cũng lỗi, một kết nối nửa chừng có thể bị dùng lại cho yêu cầu của sàn khác.
  Căn cứ: Hiếm gặp và chỉ có thể xảy ra khi có kết nối thật, nhưng hậu quả có thể là lẫn dữ liệu giữa sàn nên cần ghi rõ để xử lý khi nối dữ liệu thật.
  file: `src/modules/identity/with-company.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình, dòng ghim không phân biệt được): dòng ghim của phá thử luat-them-khong-kiem cũng khớp với dòng HỎNG do chính lệnh tự in (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bản phá thử có thể báo đỏ vì một lý do không liên quan mà vẫn được tính là đã bắt đúng lỗi, nên độ tin cậy của lưới kiểm kém hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng người dùng và bộ kiểm vẫn bắt được lỗi thật; ghi nhận là hạn chế đã biết.
  file: `db/scripts/cach-ly.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính không có đối chứng dương): ca a-khong-them-dong-ten-b / a-khong-chuyen-dong-sang-b không có ca sàn A ghi được dòng của chính mình (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bộ kiểm không chứng minh được sàn vẫn ghi được dữ liệu của chính mình, nên một lỗi chặn mọi lần ghi có thể lọt qua.
  Căn cứ: Hậu quả là chức năng ghi hỏng chứ không lộ dữ liệu, và sẽ lộ ngay khi dùng thật; thêm ca đối chứng là rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét lớp nhưng số phần tử không được ghim): số bảng quét được in ra nhưng không assert bằng ma trận viết trước (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu bộ quét bỏ sót một bảng công ty, bộ kiểm vẫn xanh mà không ai nhận ra số bảng bị thiếu.
  Căn cứ: Chỉ xảy ra khi bộ quét bản thân có lỗi, hiếm và không mất dữ liệu ngay; ghi nhận là đủ.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): bộ quét một cửa có 5 nhánh mẫu nhưng đối chứng chỉ phủ 2 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số kiểu mở kết nối trái phép chưa có ví dụ chứng minh bộ quét bắt được, nên lưới có thể có lỗ chưa ai thử.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và thêm ví dụ kiểm là việc nhỏ khi có mã kết nối thật.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): withCompany chỉ chạy trên bể giả gõ theo interface do chính cửa định nghĩa (r1)**
  Người dùng thấy gì: Cửa truy vấn chưa từng được chạy thật trên cơ sở dữ liệu thật, nên hành vi thật của nó chưa được xác nhận.
  Căn cứ: Đã được nêu từ đầu và sẽ được làm khi nối dữ liệu thật đầu tiên; chưa có mã thật nào dùng cửa này nên chưa gây hại.
  file: `src/modules/identity/with-company.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
