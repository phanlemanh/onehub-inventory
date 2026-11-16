# Review findings: moi-truong-thu-va-ban-that (round 3)

## Trong hợp đồng

- **Auto-rollback after a failed promote can 'roll back' to the failed new deployment itself (url format mismatch)**
  file: `tools/deploy/len-ban.mjs:304`
  severity: medium
  AC: AC-2
  source: bugs
  detail: `others = list.filter((d) => d.url !== newUrl)` compares two different url formats. `newUrl` comes from `vercel deploy` stdout and is `https://<host>` (the regex only keeps `^https?://` lines). `list` comes from `productionDeployments` → `vercel list --json`. In the installed vercel 65.9.0 (dist/commands/list/index.js) the JSON output emits `url: dep.url`, which is the API's bare host with no protocol; only the table output adds `https://`. So the filter never removes the new deployment, which is the newest READY production deployment (`--prod --skip-domain`) and carries `onehub_commit=head`. Result: (a) when `domainCommitBefore === head` (redeploying the same commit after an earlier failed run), `others.find(commit === domainCommitBefore)` picks the new, failed deployment; (b) when no other deployment carries `domainCommitBefore` (for example older builds made without metadata, or ones that dropped out of the list), the `others[0]` fallback is again the new deployment. In both cases `vercel rollback` points the domain at the same failed build and the run prints `đã lùi về bản trước` while the broken build stays live. `namedIn` in kiem-nhanh.mjs already strips the protocol with `bare()`; this comparison needs the same treatment. The tests miss it because the fixtures in tools/deploy/deploy.test.ts (lines 261-263, 691) put full `http://…` urls in the fake list, unlike the real CLI.
  rationale: AC-2 requires that when the post-attach check fails, the auto rollback returns to the previous build; with real URL format it can point to the failed build itself while printing success.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Rollback with BAN=<url|id> is never checked against the production deployment list, and the commit check after the rollback quietly turns off**
  Người dùng thấy gì: Khi người vận hành chỉ đích danh một bản để lùi về, lệnh không kiểm bản ấy có thật và đang chạy được hay không. Nếu gõ sai, lệnh vẫn báo xanh dù tên miền đang chạy bản khác.
  Căn cứ: Hậu quả nặng nếu xảy ra giữa lúc khẩn cấp vì người vận hành tin vào dòng xanh, nhưng đường chỉ định bản không nằm trong các tiêu chí đã ký nên nên làm thành một việc riêng; sửa khá rẻ.
  file: `tools/deploy/lui-ban.mjs`
  severity: medium
  Đề xuất: new-contract

- **rollback with BAN does not check the commit when the list cannot be read or does not hold the named deployment, yet reports success**
  Người dùng thấy gì: Khi lùi về một bản chỉ định mà danh sách bản của nhà cung cấp không đọc được, lệnh vẫn báo xanh mà không xác nhận tên miền đã chuyển thật. Người vận hành có thể tin nhầm rằng đã lùi xong.
  Căn cứ: Chỉ xảy ra ở đường chỉ định bản, người vận hành tự mở trang kiểm tra lại được nên ghi thành hạn chế đã biết là đủ; trùng gốc với lỗi chỉ định bản ở trên.
  file: `tools/deploy/lui-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert «chuỗi có mặt» khi lời hứa là QUAN HỆ) và hình dạng 4 (không có đối chứng): ở nhánh BAN của make rollback, không có phép đo nào cho thấy commit tên miền được so với commit của bản đã nêu**
  Người dùng thấy gì: Bài kiểm cho đường lùi về bản chỉ định chưa chứng minh được việc so sánh bản đang chạy với bản đã nêu, nên lỗi ở đó có thể lọt qua mà không ai biết.
  Căn cứ: Không ảnh hưởng trực tiếp người dùng cuối, chỉ làm giảm độ tin cậy của một đường phụ; ghi lại để bổ sung khi đường này được đưa vào tiêu chí.
  file: `tools/deploy/deploy.test.ts`
  severity: low
  Đề xuất: known-limits

- **Kept restore drill database leaks when the restore fails, because cleanup runs only after the asserts (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu một lần thử khôi phục thất bại, một cơ sở dữ liệu nháp có thể còn nằm lại trên máy kiểm thử mà không ai được báo. Chỉ xảy ra trên máy dev khi bài kiểm đã đỏ, không chạm bản chạy thật.
  Căn cứ: Hậu quả nhẹ: chỉ để sót một cơ sở nháp trên máy kiểm thử, không mất hay lộ dữ liệu, người làm xoá tay được, và chỉ xảy ra khi bài kiểm đã đỏ sẵn.
  file: `tests/db/sao-luu.db.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Shape 3 (checks that a string is present when the promise is a relation between values): the 'pinned' vercel version is never compared with the version the automated deploy uses (r2 · tệp đã đổi)**
  Người dùng thấy gì: Sổ tay có thể ghi một bản công cụ đưa bản lên khác với bản tệp tự động triển khai dùng mà không ai hay. Người vận hành làm tay khi đó có thể chạy bản khác với bản đã được thử.
  Căn cứ: Hậu quả vừa phải: lệch bản chỉ làm các bước làm tay hơi khác bản tự động, thấy ngay khi chạy và thử lại được, không mất dữ liệu; ghi thành han chế đã biết là đủ.
  file: `tests/van-hanh.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims to cover a class but only tests sample cases): 'every variable the app reads' is two regex forms, and the code's own way of reading a variable by name falls outside them (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một biến cấu hình mới được đọc theo cách khác có thể không được ghi vào tệp mẫu cấu hình, và bộ kiểm sẽ không báo. Người dựng môi trường mới có thể thiếu biến và chỉ biết khi máy chủ không khởi động.
  Căn cứ: Hậu quả nhẹ: hiện mọi biến đều đã có trong tệp mẫu, và nếu sót thì máy chủ báo rõ tên biến lúc khởi động nên người vận hành tự sửa được, không lộ dữ liệu.
  file: `tests/khong-khoa-bi-mat.test.ts`
  severity: low
  Đề xuất: known-limits

- **Rollback falls back to the newest production deployment when the domain's health cannot be read, and that deployment may never have been promoted (r1 · tệp đã đổi)**
  Người dùng thấy gì: If the live site is down or not answering properly when someone rolls back, the tool may pick a build that is already the broken one and point the site at it again. The rollback looks successful but the site stays broken.
  Căn cứ: It hits exactly when a rollback is most needed and can leave the live site down, but nothing is lost and the operator can retry by hand; the fix needs its own design, so it belongs in a separate piece of work.
  file: `tools/deploy/lui-ban.mjs`
  severity: medium
  Đề xuất: new-contract

- **After a failed post-promote check, a failed `vercel list` is reported as 'no previous deployment' and the domain stays on the bad build (r1 · tệp đã đổi)**
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

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): thân sức khoẻ trong deploy.test được viết tay theo khuôn mà kiem-nhanh.mjs chờ, không lấy từ healthOf thật (r1 · tệp đã đổi)**
  Người dùng thấy gì: If the health answer changes shape, the deploy tests can stay green while a real release stops at the quick check. The mismatch would show up on the first real deploy.
  Căn cứ: The failure is loud and safe, since a real deploy stops before going live and nothing is lost; it costs one failed run to notice, so noting it is enough.
  file: `tools/deploy/deploy.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): ma trận «từng phép kiểm của AC-6 đỏ một mình» thiếu các nhánh đỏ của kiemNhanh (r1 · tệp đã đổi)**
  Người dùng thấy gì: A few ways the quick check can fail, such as a non-JSON answer, have no test of their own. A bug there could slip through until a real release.
  Căn cứ: The risk is low and a failure would stop a release rather than harm users; adding the cases is cheap but not needed to ship.
  file: `tools/deploy/deploy.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
