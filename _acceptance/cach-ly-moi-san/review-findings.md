# Review findings: cach-ly-moi-san (round 1)

## Trong hợp đồng

- **Criteria/AC-6: kiểm nội dung luật chỉ dò sự có mặt của chuỗi, luật mở vẫn lọt**
  file: `db/tests/cach-ly.sql:275`
  severity: low
  AC: AC-6
  source: invariants
  detail: Điều kiện chỉ đòi qual/with_check chứa 'current_company_id()' và tên cột sàn. Luật `using (company_id = app.current_company_id() or true)` hay `... or company_id is not null` vẫn qua, trái với lời AC-6 «không luật nào mở cho mọi dòng». Cách sửa: chuẩn hoá biểu thức và so với một tập dạng cho phép (ví dụ `(company_id = app.current_company_id())`, kèm agreements_read là ngoại lệ có tên), hoặc cấm OR trong luật ngoài danh sách ngoại lệ. Thêm một bản phá thử dạng `... or true`.

- **One-door scanner misses typed pg calls such as pool.query<Row>(...)**
  file: `src/modules/identity/one-door.test.ts:19`
  severity: medium
  AC: AC-8
  source: bugs
  detail: The scanner only flags `[Pp]ool.query(` or `.connect(` when the `(` comes straight after the method name, and `new Pool(` or `new Client(` the same way. So the usual typed node-postgres form `await pool.query<Row>("select ...")` does not match, and neither does `new pg.Pool<Cfg>(...)`. I checked this with the same regex in node: `pool.query<Row>("select 1")` returns false, and so does `pool?.query("x")`. Once a real driver arrives (OOS-1), typed queries are the normal way to write it, so a query that skips withCompany and runs as the pool's login role (outside quy_hang_app and outside row level security) would leave AC-8/E8 green. That is a silent false negative in the guard for invariant SP-1. Fix: allow optional type arguments and optional chaining before the call, e.g. `\b\w*[Pp]ool\??\.(query|connect)\s*(<[^>]*>)?\s*\(` and `new\s+(?:pg\.)?(?:Pool|Client)\s*(<[^>]*>)?\s*\(`. Add one control fixture for each form.

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là quan hệ): ca luat-doc-ghi-theo-san chỉ kiểm hai chuỗi con, không kiểm luật có so cột sàn với sàn của phiên**
  file: `db/tests/cach-ly.sql:276`
  severity: medium
  AC: AC-6
  source: measurement
  detail: Dòng 275-283 chỉ đòi `position('current_company_id()' in p.qual) > 0` và `p.qual ~ '\m<cot>\M'` có mặt cùng nhau. Lời hứa của AC-6/SP-1 là luật lọc theo sàn, tức cột sàn bằng current_company_id(). Các luật mở vẫn qua ca này, ví dụ `using (true or company_id = app.current_company_id())`, `using (company_id <> app.current_company_id())` hay `using (company_id is not null or app.current_company_id() is null)`. Ba bản phá thử về luật (luat-them-khong-kiem, luat-doc-mo, bang-moi-luat-mo) đều dùng `true` trần, không chứa tên hàm, nên không có bản phá nào thử kiểu luật trên. Với bảng công ty mới, đây là phép đo duy nhất về luật, vì các ca hành vi 2-11 chỉ chạm companies/agreements. Một luật rò dữ liệu nhưng có mặt đủ hai chuỗi vẫn cho kết quả xanh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Authorization/isolation (SP-1): withCompany đưa client thô cho việc, việc tự thoát được vai và sàn**
  Người dùng thấy gì: Mã nghiệp vụ viết sau này về lý thuyết có thể tự đổi sàn hoặc thoát khỏi lớp cách ly giữa chừng, và hiện chưa có lưới nào bắt việc đó. Hiện chưa có đường truy vấn thật nên chưa ai bị ảnh hưởng.
  Căn cứ: Rủi ro chỉ xuất hiện khi có mã thật kết nối cơ sở dữ liệu, mà việc đó là hàng sau; ghi lại ngay bây giờ rồi xử lý cùng lúc nối dữ liệu thật là rẻ nhất.
  file: `src/modules/identity/with-company.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-6: ca quét danh mục bỏ sót view, view vật chất hoá, hàm security definer và schema khác**
  Người dùng thấy gì: Nếu sau này có người tạo một dạng xem hay hàm đặc quyền trên dữ liệu thoả thuận, sàn này có thể đọc được dữ liệu sàn khác mà bộ kiểm vẫn báo xanh.
  Căn cứ: Hậu quả là lộ dữ liệu giữa các sàn và khó tự phát hiện, nhưng chỉ xảy ra khi có thay đổi lược đồ sau này, nên nên làm thành một việc riêng có phạm vi rõ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Authorization (SP-1): không kiểm quyền TRUNCATE/TRIGGER/REFERENCES của vai API**
  Người dùng thấy gì: Nếu migration sau lỡ cấp quyền rộng cho vai của API, một sàn có thể xoá sạch dữ liệu mọi sàn mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nặng nếu xảy ra vì mất dữ liệu của mọi sàn, nhưng chỉ khi có cấp quyền sai trong tương lai; thêm một ca kiểm là rẻ nên đáng làm thành việc riêng.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Domain/Records: migration đưa lại trần lớp dữ liệu mà quyết định 0014 đã bỏ, và lệch ontology Agreement**
  Người dùng thấy gì: Mô hình dữ liệu thoả thuận trong cơ sở dữ liệu còn lệch với mô tả nghiệp vụ và một quyết định cũ, nên người đọc sau có thể hiểu sai quy tắc.
  Căn cứ: Không mất hay lộ dữ liệu, chỉ gây nhầm lẫn khi đọc tài liệu; ghi rõ lệch này và để chủ kho chọn bên khi đụng tới thoả thuận.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: medium
  Đề xuất: known-limits

- **Criteria/AC-8: bộ quét một cửa hẹp, dễ vòng qua**
  Người dùng thấy gì: Một người viết mã sau này có thể mở kết nối ngoài cửa bằng cách đặt tên khác mà bộ quét không phát hiện, làm mất lớp bảo vệ cách ly ở mã nguồn.
  Căn cứ: Lỗ chỉ có ý nghĩa khi gói kết nối thật được thêm vào; thêm luật cấm import khi đó là rẻ và hợp thời điểm hơn.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: known-limits

- **Design/one door: server.ts lộ câu đổi vai và câu đặt sàn ra ngoài module**
  Người dùng thấy gì: Module khác về lý thuyết có thể tự dựng một cửa thứ hai thay vì dùng cửa chung, làm luật cách ly nằm ở hai nơi.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và dễ gỡ bất cứ lúc nào, nên ghi lại là đủ.
  file: `src/modules/identity/server.ts`
  severity: low
  Đề xuất: known-limits

- **Records: chú thích trong migration chỉ tới bộ kiểm không có trong kho**
  Người dùng thấy gì: Người viết bảng mới sau này có thể đi tìm bộ kiểm ở chỗ không tồn tại trong kho này.
  Căn cứ: Chỉ làm mất chút thời gian của lập trình viên, không ảnh hưởng dữ liệu; ghi chú chỉ đúng chỗ là đủ.
  file: `db/migrations/001_nen_cong_ty.sql`
  severity: low
  Đề xuất: known-limits

- **Conventions (AGENTS.md Language): tên tệp và định danh viết tiếng Việt**
  Người dùng thấy gì: Một số tên tệp và hàm kiểm dùng tiếng Việt trái quy ước đặt tên tiếng Anh của kho, nhưng người dùng cuối không thấy gì.
  Căn cứ: Chỉ là quy ước nội bộ, đổi tên có chi phí duyệt lại các phép đo nên ghi ngoại lệ là hợp lý.
  file: `db/scripts/cach-ly.sh`
  severity: low
  Đề xuất: known-limits

- **Intent: thẻ Cổng 1 xếp AC-8 vào nhóm «Sẽ KHÔNG làm» dù hợp đồng có làm**
  Người dùng thấy gì: Thẻ duyệt hiện việc chặn mã mở kết nối ngoài cửa dưới mục không làm, người duyệt có thể tưởng nó bị cắt.
  Căn cứ: Hợp đồng đã duyệt ghi rõ việc này có làm, nên chỉ cần ghi chú; không mất dữ liệu và sửa thẻ rất rẻ.
  file: `_acceptance/cach-ly-moi-san/card-plain.json`
  severity: low
  Đề xuất: known-limits

- **Evidence: make check đỏ tại máy vì tệp sinh ra của lượt nghiệm thu**
  Người dùng thấy gì: Trên máy này bước kiểm tra mã báo đỏ do một tệp tạm của lượt nghiệm thu, còn trên CI vẫn xanh.
  Căn cứ: Tệp tạm tự mất khi dọn thư mục chạy, không ảnh hưởng sản phẩm hay CI nên chấp nhận.
  file: `.acceptance-runs/cach-ly-moi-san/acceptance-verify.js`
  severity: low
  Đề xuất: wont-fix

- **A failed rollback is swallowed and the client is still returned to the pool as healthy**
  Người dùng thấy gì: Trong tình huống hiếm khi việc huỷ giao dịch cũng lỗi, một kết nối nửa chừng có thể bị dùng lại cho yêu cầu của sàn khác.
  Căn cứ: Hiếm gặp và chỉ có thể xảy ra khi có kết nối thật, nhưng hậu quả có thể là lẫn dữ liệu giữa sàn nên cần ghi rõ để xử lý khi nối dữ liệu thật.
  file: `src/modules/identity/with-company.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình, dòng ghim không phân biệt được): dòng ghim của phá thử luat-them-khong-kiem cũng khớp với dòng HỎNG do chính lệnh tự in**
  Người dùng thấy gì: Bản phá thử có thể báo đỏ vì một lý do không liên quan mà vẫn được tính là đã bắt đúng lỗi, nên độ tin cậy của lưới kiểm kém hơn vẻ ngoài.
  Căn cứ: Không ảnh hưởng người dùng và bộ kiểm vẫn bắt được lỗi thật; ghi nhận là hạn chế đã biết.
  file: `db/scripts/cach-ly.sh`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính không có đối chứng dương): ca a-khong-them-dong-ten-b / a-khong-chuyen-dong-sang-b không có ca sàn A ghi được dòng của chính mình**
  Người dùng thấy gì: Bộ kiểm không chứng minh được sàn vẫn ghi được dữ liệu của chính mình, nên một lỗi chặn mọi lần ghi có thể lọt qua.
  Căn cứ: Hậu quả là chức năng ghi hỏng chứ không lộ dữ liệu, và sẽ lộ ngay khi dùng thật; thêm ca đối chứng là rẻ.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét lớp nhưng số phần tử không được ghim): số bảng quét được in ra nhưng không assert bằng ma trận viết trước**
  Người dùng thấy gì: Nếu bộ quét bỏ sót một bảng công ty, bộ kiểm vẫn xanh mà không ai nhận ra số bảng bị thiếu.
  Căn cứ: Chỉ xảy ra khi bộ quét bản thân có lỗi, hiếm và không mất dữ liệu ngay; ghi nhận là đủ.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): bộ quét một cửa có 5 nhánh mẫu nhưng đối chứng chỉ phủ 2**
  Người dùng thấy gì: Một số kiểu mở kết nối trái phép chưa có ví dụ chứng minh bộ quét bắt được, nên lưới có thể có lỗ chưa ai thử.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và thêm ví dụ kiểm là việc nhỏ khi có mã kết nối thật.
  file: `src/modules/identity/one-door.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): withCompany chỉ chạy trên bể giả gõ theo interface do chính cửa định nghĩa**
  Người dùng thấy gì: Cửa truy vấn chưa từng được chạy thật trên cơ sở dữ liệu thật, nên hành vi thật của nó chưa được xác nhận.
  Căn cứ: Đã được nêu từ đầu và sẽ được làm khi nối dữ liệu thật đầu tiên; chưa có mã thật nào dùng cửa này nên chưa gây hại.
  file: `src/modules/identity/with-company.test.ts`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/19 lỗi rơi vào file không bộ đo nào phủ (_acceptance/cach-ly-moi-san/card-plain.json, .acceptance-runs/cach-ly-moi-san/acceptance-verify.js) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
