## Trong hợp đồng

- **New app env var COMMIT_SHA (and VERCEL_GIT_COMMIT_SHA) read at runtime but not documented in .env.example**
  file: `src/modules/identity/health.ts:24`
  severity: low
  AC: AC-10
  detail: commitOf() reads env VERCEL_GIT_COMMIT_SHA, then COMMIT_SHA, and returns the value as the `commit` field of GET /api/v1/health. tools/deploy/len-ban.mjs sets COMMIT_SHA (`vercel deploy --env COMMIT_SHA=<head>`) and tools/deploy/thu-ban-dung.sh sets it too. The rule in .env.example says "Document EVERY variable the app reads, with a safe dummy value", and AGENTS.md says "Configuration goes in .env.example". This diff adds about 20 deploy and operations variables to .env.example but neither of these two, which are the only ones the running app itself reads. tests/khong-khoa-bi-mat.test.ts checks only the list of row-22 deploy variables, so the gap is not caught. Fix: add a commented COMMIT_SHA entry (and a note that Vercel sets VERCEL_GIT_COMMIT_SHA) to .env.example, and add the name to the list that test checks.
  source: conventions

- **Hình dạng 4 (âm-tính-một-mình) và 3 (quan hệ đo bằng tổng): «số dòng từng bảng bằng gốc» chỉ được đo bằng việc không thấy chuỗi «lech dong:»**
  file: `tests/db/sao-luu.db.test.ts:137`
  severity: medium
  AC: AC-8
  detail: Lời hứa của AC-8/E8 và đầu tệp là «every table has the source's row count» trên bản khôi phục. Bài kiểm không hề đọc cơ sở nháp đã khôi phục (script xoá nó trước khi test nhìn được). Quan hệ từng bảng chỉ được kiểm qua dòng 137: `lines.some(l => l.startsWith("thieu bang:") || l.startsWith("lech dong:"))` phải là false. Đây là kiểm âm tính. Ca phá (pg_dump -T) chỉ có đối chứng dương cho «thieu bang:», không có ca nào khiến script in «lech dong:». Vì vậy nếu nhánh so số dòng trong khoi-phuc-thu.sh hỏng (đổi khuôn, so sai cột, hay luôn rỗng), test vẫn xanh. Các dòng 143-144 so `m[2]`/`m[3]` với `totals(db.owner)` của cơ sở NGUỒN, nhưng n và m trong dòng nhật ký được tính từ tệp đếm `$tep.dem` do sao-luu.sh ghi từ nguồn (khoi-phuc-thu.sh dòng 99-100), không phải từ bản khôi phục. Nên đó là nguồn so với nguồn, và chỉ ở mức tổng, không phải quan hệ từng bảng giữa nguồn và bản khôi phục.
  source: measurement

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Rollback falls back to the newest production deployment when the domain's health cannot be read, and that deployment may never have been promoted**
  Người dùng thấy gì: If the live site is down or not answering properly when someone rolls back, the tool may pick a build that is already the broken one and point the site at it again. The rollback looks successful but the site stays broken.
  Căn cứ: It hits exactly when a rollback is most needed and can leave the live site down, but nothing is lost and the operator can retry by hand; the fix needs its own design, so it belongs in a separate piece of work.
  file: `tools/deploy/lui-ban.mjs`
  severity: medium
  Đề xuất: new-contract

- **After a failed post-promote check, a failed `vercel list` is reported as 'no previous deployment' and the domain stays on the bad build**
  Người dùng thấy gì: When a release fails its check after going live and the list of earlier builds cannot be read, the tool tells the operator there is nothing to go back to. The site keeps serving the bad build and the message is misleading.
  Căn cứ: It needs two things to fail at once and the operator still sees a red exit and can roll back by hand; no data is lost and the fix is cheap but rare, so noting it is enough.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

- **Health check swallows the database error without logging it**
  Người dùng thấy gì: When the health check fails because of the database, the operator sees only a generic message and the server logs give no reason. Finding the cause takes longer.
  Căn cứ: It only slows diagnosis; nothing is lost or exposed to users, and the response text is deliberately kept generic, so noting it is enough.
  file: `src/modules/identity/health.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): thân sức khoẻ trong deploy.test được viết tay theo khuôn mà kiem-nhanh.mjs chờ, không lấy từ healthOf thật**
  Người dùng thấy gì: If the health answer changes shape, the deploy tests can stay green while a real release stops at the quick check. The mismatch would show up on the first real deploy.
  Căn cứ: The failure is loud and safe, since a real deploy stops before going live and nothing is lost; it costs one failed run to notice, so noting it is enough.
  file: `tools/deploy/deploy.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): ma trận «từng phép kiểm của AC-6 đỏ một mình» thiếu các nhánh đỏ của kiemNhanh**
  Người dùng thấy gì: A few ways the quick check can fail, such as a non-JSON answer, have no test of their own. A bug there could slip through until a real release.
  Căn cứ: The risk is low and a failure would stop a release rather than harm users; adding the cases is cheap but not needed to ship.
  file: `tools/deploy/deploy.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
