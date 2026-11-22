## Trong hợp đồng

- **The third red zone still leaves out kiem-nhanh-ten-mien, where the automatic rollback moves the domain to a deployment with no database connection**
  AC: AC-5
  file: `docs/van-hanh/dua-ban-len.md:92`
  severity: medium
  source: conventions
  detail: Round 1 added gan-ten-mien to the third zone, the red steps after vai-dang-nhap has passed. But kiem-nhanh-ten-mien also runs after vai-dang-nhap and is still missing. In tools/deploy/len-ban.mjs, when kiem-nhanh-ten-mien is red, promoted=true, so rollBack() runs `vercel rollback before.id`. During a login-password rotation, the earlier deployment still carries the old DATABASE_URL, so its kiemNhanh fails and the run prints `lùi bản ĐỎ — tên miền đã về bản … nhưng kiểm nhanh đỏ`. The domain then points at a deployment that has lost its connection. That is worse than staying on the new deployment, which may not be the broken one. The `kiem-nhanh-ten-mien` rows of the same runbook (`lùi bản DỪNG` / `lùi bản ĐỎ`) tell the operator to pick 'bản đã chạy tốt gần nhất' and run `make rollback` / Instant Rollback. After a rotation, every older deployment has the old password. This contradicts docs/van-hanh/xoay-khoa.md line 122, which says 'đừng lùi bản — bản cũ cũng dùng mật khẩu cũ'. The page wiki/decisions/0048-bien-truoc-vai-dang-nhap.md (line 59) has the same gap: it puts the remaining window at 'từ lúc vai-dang-nhap đạt tới gan-ten-mien' and does not mention the automatic rollback at kiem-nhanh-ten-mien. This is the same class of finding as the in-contract round 1 finding (AC-5: every red step after vai-dang-nhap belongs to the third zone), and the round 1 fix covers only part of it.
  rationale: AC-5 requires the third zone to cover every red step after vai-dang-nhap passes, and kiem-nhanh-ten-mien is such a step, so the omission and the rollback advice that contradicts it make AC-5 fail.

- **The runbook's outage zone and decision 0048 still leave out kiem-nhanh-ten-mien, where the automatic rollback moves the domain to a deployment that still holds the old password**
  AC: AC-5
  file: `docs/van-hanh/dua-ban-len.md:92`
  severity: medium
  source: bugs
  detail: This round's fix lists the third zone (red after vai-dang-nhap passed) as `cach-ly`, `dung`, `kiem-nhanh`, `gan-ten-mien`. Decision 0048 line 59 likewise says the remaining gap runs 'from vai-dang-nhap passing to gan-ten-mien'. Both stop one step short. kiem-nhanh-ten-mien also runs after vai-dang-nhap, and in len-ban.mjs a red there with promoted=true goes into rollBack(). rollBack runs `vercel rollback before.id`, which points the domain back at the deployment that held it before the promote. That deployment was built with the old DATABASE_URL, but the database now has the new password. rollBack then runs kiemNhanh on APP_URL. That check reads /api/v1/health, and liveHealth() goes through the live DB pool (src/modules/identity/runtime.ts:119), so it fails. The command prints 'lùi bản ĐỎ — tên miền đã về bản … nhưng kiểm nhanh đỏ'. The runbook row for 'lùi bản ĐỎ' (and the 'lùi bản DỪNG' row) tells the operator to pick the nearest good deployment and run `make rollback`, or use Vercel Instant Rollback. Every older deployment carries the old password too, so all of those moves leave production disconnected. Worse, if kiem-nhanh-ten-mien was red for a reason unrelated to the database, the new deployment was connected, and the automatic rollback is what takes production off the database. So the gap does not end at gan-ten-mien. Only xoay-khoa.md:122 ('đừng lùi bản — bản cũ cũng dùng mật khẩu cũ') covers this. The three-zone section of dua-ban-len.md, which AC-5 defines as covering every red step after vai-dang-nhap passes, says nothing about it, and the kiem-nhanh-ten-mien rows push the operator the other way. This is the same blind spot as the round-1 finding, one step later. Fix: add kiem-nhanh-ten-mien to the third zone. In the kiem-nhanh-ten-mien rows, say that right after a password rotation the operator should not roll back and should fix and re-run instead (point to xoay-khoa.md). Correct the gap boundary in 0048 line 59.
  rationale: Same gap as the previous finding: AC-5 defines the third zone as every red step after vai-dang-nhap passes and requires decision 0048 to state the remaining gap, and both stop short of kiem-nhanh-ten-mien.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Header comment and wiki log overstate the fix: Vercel failures after vai-dang-nhap still take production off the database (r1)**
  Người dùng thấy gì: Một dòng chú thích và một dòng nhật ký nói quá tay là lỗi Vercel nào lúc xoay mật khẩu cũng không làm bản thật mất kết nối. Thực tế chỉ lỗi ở bước đẩy biến là được bảo vệ, người đọc chú thích có thể yên tâm sai.
  Căn cứ: Chỉ là câu chữ ghi chép, không ảnh hưởng hành vi hay dữ liệu, sổ tay và quyết định đã nói đúng nên người vận hành không bị dẫn sai, sửa lại rất rẻ nhưng hậu quả nhẹ.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
