## Trong hợp đồng

- **Shape 1 (measures the instructions, not the output): the check that the script makes no database greps the script's text instead of looking at the cluster**
  file: `tests/db/cach-ly-dich.db.test.ts:76`
  severity: medium
  AC: AC-7
  source: measurement
  detail: `databasesUnchangedByScript` is meant to prove the script makes no database. From the actual before/after list of databases it only catches two things: a database that disappeared, or a new one starting with `cach_ly_dich` (line 87). That prefix belongs to this test's own `scratchDb`, not to the script. If the script left behind a new database under any other name, part (2) would not see it. The suite's own green case says so: `["a","dich"] -> ["a","dich","khoi_phuc_thu_1"]` passes (line 199). So the only thing that catches a created database is part (3), the regex `/\b(create|drop|alter)\s+database\b/i` run over `readFileSync(SCRIPT)`. That reads the script's source, not its effect. A `createdb` command, a name built in a variable, or a called helper script would all slip past it. The break case at line 221 only adds the literal text `create database x` to the script, so it confirms the grep works, not the behaviour. "Makes no database" is not measured on the database cluster.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Kept restore drill database leaks when the restore fails, because cleanup runs only after the asserts**
  Người dùng thấy gì: Nếu một lần thử khôi phục thất bại, một cơ sở dữ liệu nháp có thể còn nằm lại trên máy kiểm thử mà không ai được báo. Chỉ xảy ra trên máy dev khi bài kiểm đã đỏ, không chạm bản chạy thật.
  Căn cứ: Hậu quả nhẹ: chỉ để sót một cơ sở nháp trên máy kiểm thử, không mất hay lộ dữ liệu, người làm xoá tay được, và chỉ xảy ra khi bài kiểm đã đỏ sẵn.
  file: `tests/db/sao-luu.db.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Shape 3 (checks that a string is present when the promise is a relation between values): the 'pinned' vercel version is never compared with the version the automated deploy uses**
  Người dùng thấy gì: Sổ tay có thể ghi một bản công cụ đưa bản lên khác với bản tệp tự động triển khai dùng mà không ai hay. Người vận hành làm tay khi đó có thể chạy bản khác với bản đã được thử.
  Căn cứ: Hậu quả vừa phải: lệch bản chỉ làm các bước làm tay hơi khác bản tự động, thấy ngay khi chạy và thử lại được, không mất dữ liệu; ghi thành han chế đã biết là đủ.
  file: `tests/van-hanh.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims to cover a class but only tests sample cases): 'every variable the app reads' is two regex forms, and the code's own way of reading a variable by name falls outside them**
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
