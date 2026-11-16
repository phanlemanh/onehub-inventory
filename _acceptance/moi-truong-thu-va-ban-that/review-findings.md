## Trong hợp đồng

- **Hình dạng 5 (tuyên quét lớp nhưng không có ma trận viết trước, số ca không được đối chiếu): E6 lấy danh sách ca bằng grep mã nguồn và không bao giờ so số ca với số phải có**
  file: `tools/deploy/thu-ban-dung.sh:118`
  severity: medium
  AC: AC-6
  source: measurement
  detail: Theo evals.yaml, E6 hứa «số ca = số mục sổ bản mẫu + bảng quyền và > 0». Nhưng script dựng các danh sách PROTO_SLUGS, ROLES, STATES, MAUS (dòng 118-144) bằng cách grep/sed theo khuôn chữ ngay trong mã đang bị kiểm, ví dụ `grep -o 'param !== "[a-z-]*"'` trên inventoryEdgeRowsFrom, hay `grep 'const STATE_PARAMS = \['` vốn đòi mảng nằm trên một dòng. Chặn duy nhất là `[ "${#X[@]}" -gt 0 ]`. Dòng cuối `ban-dung-that: $N phép kiểm đạt` (dòng 387) chỉ in ra N và không so N với con số nào viết sẵn. Nếu mã đổi cách viết (mảng xuống dòng, đổi `!==` thành `===`, thêm vai bằng spread), danh sách sẽ âm thầm co lại còn một phần tử mà phép đo vẫn xanh. Không có ma trận đầy đủ viết trước để số assert bằng số phần tử như mẫu P105.
  rationale: AC-6 đòi số ca bằng số mục của sổ bản mẫu và bảng quyền và lớn hơn 0, mà phép đo chỉ kiểm lớn hơn 0 nên vế đối chiếu số lượng không được bảo đảm.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Login role name defined twice in the identity module (rule lives in two places)**
  Người dùng thấy gì: Hiện không có gì sai với người dùng: hệ thống vẫn chặn đúng khi nối nhầm vai. Nếu sau này đổi tên vai ở một nơi mà quên nơi kia thì kiểm lúc khởi động và kiểm lúc truy vấn có thể báo khác nhau.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉ có rủi ro khi có người đổi tên vai, lúc đó lỗi hiện ngay khi khởi động nên tự lộ ra.
  file: `src/modules/identity/config.ts`
  severity: low
  Đề xuất: wont-fix

- **The runbook promises a red line that the first production deploy can never print**
  Người dùng thấy gì: Sổ tay vận hành nói lần đưa bản thật đầu tiên sẽ dừng với một dòng báo đỏ cụ thể, nhưng thực tế người vận hành sẽ thấy một dòng chữ khác. Người làm theo có thể bối rối một lúc dù việc dừng vẫn đúng.
  Căn cứ: Chỉ gây nhầm lẫn nhẹ cho người vận hành, hệ thống vẫn dừng đúng chỗ, không mất dữ liệu và sửa lại câu chữ sổ tay rất rẻ.
  file: `docs/van-hanh/README.md`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên một lớp đường dẫn nhưng chỉ đo một điểm): phép thử từ chối đường trong kho chỉ thử đúng gốc của worktree**
  Người dùng thấy gì: Chức năng sao lưu từ chối ghi vào trong kho, nhưng mới được thử ở một vị trí. Các cách viết đường dẫn khác như đường tương đối hay thư mục con chưa được thử riêng nên có thể lọt một lỗi hiếm.
  Căn cứ: Lỗi nếu có chỉ làm tệp sao lưu nằm nhầm trong kho, không mất hay lộ dữ liệu và người vận hành tự thấy và dời được; thêm ca thử sau cũng rẻ.
  file: `tests/db/sao-luu.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **make rollback skips the commit check when the chosen deployment has no commit metadata, but the runbook says the commit is always checked (r5)**
  Người dùng thấy gì: Khi lùi về một bản cũ không có ghi mã commit (bản tạo từ trang Vercel hay trước khi có công cụ), lệnh vẫn báo lùi xong mà không so commit. Sổ tay lại nói là có so, nên người vận hành có thể tin kiểm tra chặt hơn thực tế.
  Căn cứ: Hậu quả nhẹ: tên miền vẫn được xác nhận đang ở đúng bản đã chọn và kiểm sức khoẻ vẫn chạy, chỉ thiếu bước đối chiếu commit; không mất dữ liệu, và sửa lại dòng chữ trong sổ tay là rẻ.
  file: `tools/deploy/lui-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **After a rollback, the commit check is silently skipped when the deployment's commit cannot be found (r5)**
  Người dùng thấy gì: Sau khi tự lùi bản, nếu không tra được commit của bản trước thì phép kiểm chỉ còn xác nhận máy chủ sống, không báo cho người vận hành là commit chưa được so.
  Căn cứ: Hậu quả nhẹ và người vận hành tự phát hiện được: bản đích đã được xác nhận bằng mã bản trên tên miền, không mất dữ liệu; chỉ là kiểm tra yếu hơn mà không báo.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: lời hứa là quan hệ (commit trên tên miền sau khi lùi = commit của bản đích), nhưng phép đo chỉ thấy chuỗi có mặt, không có ca lệch commit (r5)**
  Người dùng thấy gì: Bộ kiểm tự động không có ca nào thử trường hợp tên miền sau khi lùi chạy sai commit, nên nếu sau này ai đó làm hỏng phép so commit thì kiểm tra vẫn xanh.
  Căn cứ: Không ảnh hưởng người dùng hiện tại vì chức năng chạy đúng; rủi ro chỉ là hỏng âm thầm về sau, và thêm ca kiểm là việc nhỏ có thể làm khi mở rộng hợp đồng.
  file: `tools/deploy/deploy.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Runbooks still point operators at a deploy message that no longer exists; the new stop message is not documented (r4)**
  Người dùng thấy gì: Sổ tay vẫn bảo người vận hành tìm một dòng thông báo cũ không còn xuất hiện, và chưa nói rõ phải làm gì khi lệnh báo dừng việc lùi bản. Người vận hành có thể lúng túng đúng lúc tên miền đang ở bản lỗi.
  Căn cứ: Hậu quả nhẹ đến vừa: không mất dữ liệu và chỉ gây chậm trễ khi sự cố, còn sửa một dòng sổ tay thì rẻ và làm lúc nào cũng được.
  file: `docs/van-hanh/lui-ban.md`
  severity: medium
  Đề xuất: known-limits

- **New auto-rollback stop branch has no test (r4)**
  Người dùng thấy gì: Trường hợp lệnh lùi bản tự dừng vì không tìm được bản cũ chưa có bài kiểm. Nếu sau này ai đó đổi lại thành đoán bản để lùi thì sẽ không có gì báo đỏ.
  Căn cứ: Người dùng không gặp ngay lỗi nào và không mất dữ liệu, chỉ thiếu lưới bảo vệ cho lần sửa sau, nên thêm bài kiểm vào lúc nào cũng được.
  file: `tools/deploy/len-ban.mjs`
  severity: medium
  Đề xuất: known-limits

- **Comment still describes the removed "else the newest other one" fallback (r4)**
  Người dùng thấy gì: Một ghi chú trong mã còn mô tả cách đoán bản cũ đã bỏ. Người dùng không thấy gì, chỉ có nguy cơ người sửa sau hiểu nhầm.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉ là ghi chú lỗi thời, sửa tiện tay khi chạm vào tệp là đủ.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: wont-fix

- **Auto-rollback picks a deployment by commit, not by the deployment the domain actually served: on a same-commit redeploy it can go back to an earlier failed, never-promoted build and still print «đã lùi về bản trước» (r4)**
  Người dùng thấy gì: Khi chạy lại cùng một bản (ví dụ lúc xoay khoá) và bước kiểm sau gắn tên miền đỏ, lệnh có thể lùi về một bản đã từng hỏng mà vẫn báo đã lùi về bản trước. Người vận hành tin rằng trang đã về bản tốt trong khi khách vẫn vào bản lỗi.
  Căn cứ: Hậu quả nặng vì báo sai trạng thái đúng lúc sự cố, khách có thể gặp bản lỗi mà không ai biết, nhưng không mất dữ liệu và người vận hành lùi tay được; sửa cần đổi cách ghi lại bản đang chạy nên nên làm thành việc riêng.
  file: `tools/deploy/len-ban.mjs`
  severity: high
  Đề xuất: new-contract

- **Rollback with BAN=<url|id> is never checked against the production deployment list, and the commit check after the rollback quietly turns off (r3)**
  Người dùng thấy gì: Khi người vận hành chỉ đích danh một bản để lùi về, lệnh không kiểm bản ấy có thật và đang chạy được hay không. Nếu gõ sai, lệnh vẫn báo xanh dù tên miền đang chạy bản khác.
  Căn cứ: Hậu quả nặng nếu xảy ra giữa lúc khẩn cấp vì người vận hành tin vào dòng xanh, nhưng đường chỉ định bản không nằm trong các tiêu chí đã ký nên nên làm thành một việc riêng; sửa khá rẻ.
  file: `tools/deploy/lui-ban.mjs`
  severity: medium
  Đề xuất: new-contract

- **rollback with BAN does not check the commit when the list cannot be read or does not hold the named deployment, yet reports success (r3)**
  Người dùng thấy gì: Khi lùi về một bản chỉ định mà danh sách bản của nhà cung cấp không đọc được, lệnh vẫn báo xanh mà không xác nhận tên miền đã chuyển thật. Người vận hành có thể tin nhầm rằng đã lùi xong.
  Căn cứ: Chỉ xảy ra ở đường chỉ định bản, người vận hành tự mở trang kiểm tra lại được nên ghi thành hạn chế đã biết là đủ; trùng gốc với lỗi chỉ định bản ở trên.
  file: `tools/deploy/lui-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert «chuỗi có mặt» khi lời hứa là QUAN HỆ) và hình dạng 4 (không có đối chứng): ở nhánh BAN của make rollback, không có phép đo nào cho thấy commit tên miền được so với commit của bản đã nêu (r3)**
  Người dùng thấy gì: Bài kiểm cho đường lùi về bản chỉ định chưa chứng minh được việc so sánh bản đang chạy với bản đã nêu, nên lỗi ở đó có thể lọt qua mà không ai biết.
  Căn cứ: Không ảnh hưởng trực tiếp người dùng cuối, chỉ làm giảm độ tin cậy của một đường phụ; ghi lại để bổ sung khi đường này được đưa vào tiêu chí.
  file: `tools/deploy/deploy.test.ts`
  severity: low
  Đề xuất: known-limits

- **Kept restore drill database leaks when the restore fails, because cleanup runs only after the asserts (r2)**
  Người dùng thấy gì: Nếu một lần thử khôi phục thất bại, một cơ sở dữ liệu nháp có thể còn nằm lại trên máy kiểm thử mà không ai được báo. Chỉ xảy ra trên máy dev khi bài kiểm đã đỏ, không chạm bản chạy thật.
  Căn cứ: Hậu quả nhẹ: chỉ để sót một cơ sở nháp trên máy kiểm thử, không mất hay lộ dữ liệu, người làm xoá tay được, và chỉ xảy ra khi bài kiểm đã đỏ sẵn.
  file: `tests/db/sao-luu.db.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Shape 3 (checks that a string is present when the promise is a relation between values): the 'pinned' vercel version is never compared with the version the automated deploy uses (r2)**
  Người dùng thấy gì: Sổ tay có thể ghi một bản công cụ đưa bản lên khác với bản tệp tự động triển khai dùng mà không ai hay. Người vận hành làm tay khi đó có thể chạy bản khác với bản đã được thử.
  Căn cứ: Hậu quả vừa phải: lệch bản chỉ làm các bước làm tay hơi khác bản tự động, thấy ngay khi chạy và thử lại được, không mất dữ liệu; ghi thành han chế đã biết là đủ.
  file: `tests/van-hanh.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims to cover a class but only tests sample cases): 'every variable the app reads' is two regex forms, and the code's own way of reading a variable by name falls outside them (r2)**
  Người dùng thấy gì: Một biến cấu hình mới được đọc theo cách khác có thể không được ghi vào tệp mẫu cấu hình, và bộ kiểm sẽ không báo. Người dựng môi trường mới có thể thiếu biến và chỉ biết khi máy chủ không khởi động.
  Căn cứ: Hậu quả nhẹ: hiện mọi biến đều đã có trong tệp mẫu, và nếu sót thì máy chủ báo rõ tên biến lúc khởi động nên người vận hành tự sửa được, không lộ dữ liệu.
  file: `tests/khong-khoa-bi-mat.test.ts`
  severity: low
  Đề xuất: known-limits

- **Rollback falls back to the newest production deployment when the domain's health cannot be read, and that deployment may never have been promoted (r1)**
  Người dùng thấy gì: If the live site is down or not answering properly when someone rolls back, the tool may pick a build that is already the broken one and point the site at it again. The rollback looks successful but the site stays broken.
  Căn cứ: It hits exactly when a rollback is most needed and can leave the live site down, but nothing is lost and the operator can retry by hand; the fix needs its own design, so it belongs in a separate piece of work.
  file: `tools/deploy/lui-ban.mjs`
  severity: medium
  Đề xuất: new-contract

- **After a failed post-promote check, a failed `vercel list` is reported as 'no previous deployment' and the domain stays on the bad build (r1)**
  Người dùng thấy gì: When a release fails its check after going live and the list of earlier builds cannot be read, the tool tells the operator there is nothing to go back to. The site keeps serving the bad build and the message is misleading.
  Căn cứ: It needs two things to fail at once and the operator still sees a red exit and can roll back by hand; no data is lost and the fix is cheap but rare, so noting it is enough.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Health check swallows the database error without logging it (r1)**
  Người dùng thấy gì: When the health check fails because of the database, the operator sees only a generic message and the server logs give no reason. Finding the cause takes longer.
  Căn cứ: It only slows diagnosis; nothing is lost or exposed to users, and the response text is deliberately kept generic, so noting it is enough.
  file: `src/modules/identity/health.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): thân sức khoẻ trong deploy.test được viết tay theo khuôn mà kiem-nhanh.mjs chờ, không lấy từ healthOf thật (r1)**
  Người dùng thấy gì: If the health answer changes shape, the deploy tests can stay green while a real release stops at the quick check. The mismatch would show up on the first real deploy.
  Căn cứ: The failure is loud and safe, since a real deploy stops before going live and nothing is lost; it costs one failed run to notice, so noting it is enough.
  file: `tools/deploy/deploy.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): ma trận «từng phép kiểm của AC-6 đỏ một mình» thiếu các nhánh đỏ của kiemNhanh (r1)**
  Người dùng thấy gì: A few ways the quick check can fail, such as a non-JSON answer, have no test of their own. A bug there could slip through until a real release.
  Căn cứ: The risk is low and a failure would stop a release rather than harm users; adding the cases is cheap but not needed to ship.
  file: `tools/deploy/deploy.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
