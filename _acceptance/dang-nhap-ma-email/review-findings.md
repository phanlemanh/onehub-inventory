## Trong hợp đồng

- **The 30-day sliding session ends at day 30 anyway because the cookie lifetime is never extended**
  AC: AC-7
  file: `src/modules/identity/http.ts:62`
  severity: medium
  source: bugs
  detail: The cookie lifetime (Max-Age = SESSION_TTL_SEC) is set only once, in verifyCode at sign-in. On the database side, session_read moves expires_at forward on each use (constants.ts and decision 0021 say «phiên 30 ngày trượt theo ngày dùng»). No other path re-issues the cookie: getSession, currentSession and chooseCompany never send set-cookie. So the browser deletes the cookie exactly 30 days after sign-in, even for someone who uses the app every day. The extended expiry in the database is never used, and the person is signed out without warning.
  rationale: AC-7 đòi hạn phiên dời về bây giờ cộng 30 ngày khi dùng lại, nhưng cookie vẫn hết đúng 30 ngày sau khi đăng nhập nên hạn trượt không có tác dụng.

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): mã được lấy từ đối số đưa vào bộ gửi, không từ thân thư đã dựng**
  AC: AC-2
  file: `tests/db/dang-nhap.db.test.ts:59`
  severity: high
  source: measurement
  detail: codeFromMail() đọc `mail.code` của CodeMail mà captureSender giữ lại (sender.ts:53-55). Đó là đối số `{email, code}` đưa VÀO bộ gửi, không phải thư đã dựng. Thân thư thật do codeEmail(code) dựng (sender.ts:18-24) và resendSender gửi đi, nhưng không phép đo nào đọc nó: config.test.ts:36 chỉ kiểm `JSON.parse(init.body).to`, không kiểm `text`/`subject`. Bên e2e cũng vậy: devSender ghi `{email, code}` vào outbox (sender.ts:48) và mailsTo() trong tests/e2e-db/login.spec.ts:57-65 đọc lại đúng trường đó. Vì thế nếu codeEmail bỏ mã khỏi thư, mọi ca vẫn xanh. Trong khi đó evals.yaml E1 hứa 'thân thư chứa đúng một chuỗi 6 chữ số ... sau khi tách', E3 hứa 'RÚT TỪ THÂN THƯ', và tệp e2e ghi chú 'the same code the mail would carry'.
  rationale: AC-2 đòi gõ đúng mã lấy từ chính thư vừa gửi, nhưng phép đo lấy mã từ đối số chứ không từ thân thư, nên không chứng minh được thư mang mã.

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): kiểm việc máy chủ khởi động bằng cách grep mã nguồn instrumentation.ts**
  AC: AC-1
  file: `src/modules/identity/config.test.ts:66`
  severity: high
  source: measurement
  detail: Ca 'the server start checks production configuration' đọc tệp src/instrumentation.ts dưới dạng chữ rồi assert `toContain("assertProductionConfig(process.env)")` và `toContain('process.env.NEXT_RUNTIME !== "nodejs"')`. Ca này không gọi register() với một env production thiếu biến để xem nó có ném lỗi không. Có chữ trong tệp chưa chứng minh được hành vi. Chẳng hạn instrumentation.ts:5 có thêm nhánh `return` sớm khi NEXT_PHASE === 'phase-production-build', và bài grep không thấy nhánh đó cũng không thấy bất kỳ nhánh return nào chen vào. evals.yaml E2 hứa 'một ca kiểm instrumentation.ts gọi đúng hàm ấy khi NODE_ENV=production', nhưng bài kiểm không đặt NODE_ENV nào cả.
  rationale: AC-1 đòi bản thật thiếu cấu hình thì máy chủ không khởi động, nhưng bài kiểm chỉ tìm chữ trong tệp chứ không chạy hành vi này.

- **Hình dạng 5 (tuyên quét lớp nhưng ma trận thiếu phần tử): bài quét quyền vai API trên bảng identity bỏ thao tác INSERT**
  AC: AC-9
  file: `tests/db/dang-nhap.db.test.ts:118`
  severity: high
  source: measurement
  detail: evals.yaml E15 hứa: dưới vai quy_hang_app, 'select, insert, update, delete trên từng bảng của schema identity ... đều lỗi permission denied'. Nhưng checkApiCannotTouchIdentity chỉ lặp qua 3 câu lệnh: `select ... limit 1`, `delete ... where false`, `update ... where false`. Không có câu INSERT nào. Ma trận viết trước hứa 4 thao tác × 4 bảng = 16 ô, bài thật chỉ đo 12 ô. Số được ghim `toBe(4)` (dòng 504) chỉ đếm số bảng, không đếm số ô. Cấp quyền INSERT trên identity.* cho vai API sẽ không làm đỏ ca nào.
  rationale: AC-9 đòi vai API không đọc, ghi thẳng được bảng nào của schema danh tính, nhưng thao tác ghi mới (INSERT) không được đo.

- **Hình dạng 4 (assertion âm tính một mình): 'sai lần ba thì mã chết' chỉ kiểm phản hồi không-ok**
  AC: AC-3
  file: `tests/db/dang-nhap.db.test.ts:108`
  severity: medium
  source: measurement
  detail: checkThirdWrongKills chỉ có `if (after.ok) throw ...`. Không ghim mã trạng thái 400, không ghim thân `{"error":"code-invalid"}`, không kiểm Set-Cookie. Ba lần sai trong vòng lặp ở dòng 105-106 cũng không assert gì. Vì vậy một lỗi 500 hay 429 ở lần đổi mã đúng vẫn làm ca qua. Ở ma-hong-cung-mot-loi (dòng 292), tình huống 'sai lần ba rồi đúng' gọi hàm này nhưng không đi qua expectInvalid, nên kết quả của nó không nằm trong tập `bodies` được so ở dòng 321. Điều đó trái lời hứa E4: 'mỗi tình huống trả 400 với code-invalid và cùng thân JSON từng byte, không Set-Cookie'.
  rationale: AC-3 đòi mọi trường hợp bị từ chối cùng một mã lỗi và cùng một câu, nhưng ca sai lần ba chỉ kiểm không-ok nên lỗi khác vẫn qua.

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): ca phiên qua cửa hứa đọc agreements nhưng không đọc**
  AC: AC-6
  file: `tests/db/dang-nhap.db.test.ts:419`
  severity: medium
  source: measurement
  detail: evals.yaml E8 hứa: withCompany với ngữ cảnh phiên 'đọc companies và agreements chỉ thấy dòng của A (so tập id), và đọc company_members chỉ thấy thành viên của A'. Ca phien-dua-sang-qua-cua chỉ query `select id from companies` và `select company_id from company_members`. Bảng agreements không được đọc, và seed() trong tests/db/helpers.ts cũng không tạo dòng agreements nào cho sàn khác để làm đối chứng. Như vậy lời hứa nói cả lớp ba bảng công ty, còn bài đo chỉ phủ hai bảng.
  rationale: AC-6 đòi truy vấn qua cửa với phiên chỉ thấy dữ liệu của sàn A, nhưng bài kiểm chỉ phủ hai trong ba bảng của sàn, thiếu bảng thoả thuận.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Membership, account and session were added to the code but not to the ontology**
  Người dùng thấy gì: Khái niệm thành viên sàn, tài khoản và phiên chưa có trong bộ từ điển nghiệp vụ. Người dùng không thấy gì khác, nhưng người sau đọc tài liệu sẽ thiếu mô tả.
  Căn cứ: Không ảnh hưởng người dùng hay dữ liệu, hợp đồng đã chủ động hoãn phần thành viên sang hàng 9 nên ghi lại rồi bổ sung ở đó là rẻ nhất.
  file: `db/migrations/002_dang_nhap_ma_email.sql`
  severity: medium
  Đề xuất: known-limits

- **Asking for a code shows whether an email has an account, which breaks the 'every email gets the same answer' promise**
  Người dùng thấy gì: Người ngoài có thể đoán một email có tài khoản hay không nhờ thời gian chờ lâu hơn, hoặc nhờ lỗi khi dịch vụ gửi thư trục trặc. Họ chỉ biết được email đó có tài khoản, không lấy được dữ liệu.
  Căn cứ: Hậu quả nhẹ, chỉ lộ sự tồn tại của tài khoản và cần cố ý dò mới thấy; không mất dữ liệu, sửa về sau vẫn được.
  file: `src/modules/identity/login.ts`
  severity: medium
  Đề xuất: known-limits

- **The sign-in endpoints check neither Content-Type nor Origin, so another site can sign a user into the attacker's account (login CSRF)**
  Người dùng thấy gì: Một trang web xấu có thể khiến trình duyệt của nhân viên bị đăng nhập vào tài khoản của kẻ tấn công mà không hay biết. Nhân viên có thể nhập dữ liệu vào tài khoản đó.
  Căn cứ: Hậu quả có thật nhưng cần kẻ tấn công dựng sẵn và dụ nạn nhân, không làm lộ dữ liệu sẵn có của sàn; nên làm thành việc riêng về bảo mật.
  file: `src/modules/identity/http.ts`
  severity: low
  Đề xuất: new-contract

- **The account menu hard-codes '/login' instead of the shared constant**
  Người dùng thấy gì: Hiện người dùng không thấy khác gì. Chỉ khi sau này đổi địa chỉ trang đăng nhập thì nút Đăng xuất mới dẫn sai chỗ.
  Căn cứ: Không có hậu quả hôm nay, đổi địa chỉ đăng nhập là hiếm và sửa lúc đó chỉ một dòng.
  file: `src/app/(app)/account-menu.tsx`
  severity: low
  Đề xuất: wont-fix

- **The return-to-page check lets a tab or newline through, giving an open redirect to another site**
  Người dùng thấy gì: Một đường link làm sẵn có thể đưa nhân viên sau khi đăng nhập sang một trang web lạ, dễ bị dùng để lừa đảo.
  Căn cứ: Là lỗ hổng lừa đảo có thật nhưng không làm mất dữ liệu; sửa rẻ nhưng nằm ngoài hợp đồng nên để người quyết ở việc bảo mật riêng.
  file: `src/modules/identity/next-path.ts`
  severity: medium
  Đề xuất: new-contract

- **Sign-out failure is swallowed and the person is sent back into the app still signed in**
  Người dùng thấy gì: Nếu mạng chập chờn lúc bấm Đăng xuất, người dùng tưởng đã thoát nhưng vẫn đang đăng nhập, nguy hiểm trên máy dùng chung.
  Căn cứ: Chỉ xảy ra khi có lỗi mạng nhưng người dùng không được báo, và phiên còn sống tới 30 ngày; tự khắc phục được bằng cách bấm lại.
  file: `src/app/(app)/account-menu.tsx`
  severity: medium
  Đề xuất: new-contract

- **Company switch failures are silent, and a network error leaves the menu disabled for good**
  Người dùng thấy gì: Khi đổi sàn gặp lỗi mạng, menu có thể bị khoá và không có thông báo nào. Người dùng phải tải lại trang mới dùng tiếp được.
  Căn cứ: Chỉ gặp khi mạng lỗi, không mất dữ liệu, tải lại trang là hết.
  file: `src/app/(app)/account-menu.tsx`
  severity: medium
  Đề xuất: known-limits

- **Signed-in person with no remaining company gets stuck on an empty company-choice step**
  Người dùng thấy gì: Người đã bị gỡ khỏi mọi sàn mở trang đăng nhập sẽ thấy bước chọn sàn trống, không có nút quay lại hay lời giải thích. Họ phải xoá cookie mới thử lại được.
  Căn cứ: Gặp ở nhóm hiếm (bị gỡ khỏi sàn cuối cùng) nhưng người dùng bị kẹt không tự thoát được ngay, không mất dữ liệu.
  file: `src/app/login/page.tsx`
  severity: medium
  Đề xuất: new-contract

- **Invalid email is shown as a server error with a retry button that can never succeed**
  Người dùng thấy gì: Gõ email sai định dạng sẽ báo lỗi máy chủ và nút thử lại không bao giờ thành công. Người dùng không biết mình gõ sai email.
  Căn cứ: Gây bối rối nhưng người dùng tự sửa được ngay khi nhận ra gõ nhầm, không mất dữ liệu.
  file: `src/app/login/login-form.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
