## Trong hợp đồng

- **The new rollback table keys its rows on a check failure reason the real health endpoint never produces after a password rotation**
  file: `docs/van-hanh/xoay-khoa.md:152`
  severity: medium
  AC: AC-2
  source: conventions
  detail: The table in the section «Lùi bản sau khi xoay mật khẩu vai đăng nhập» has a row for `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: …`. Line 151 also says the reason for `lùi bản ĐỎ — tên miền đã về bản <id> nhưng kiểm nhanh đỏ: <lý do>` is usually `vai nối chưa đạt`. The real server can never give that reason. src/modules/identity/health.ts:53 sets `ok: vai === "dat"`. Take a build made before the rotation: its old password fails to connect, so vaiOf returns "không nối được cơ sở dữ liệu" (a connection error, not a LoginRoleError), and health is `ok:false`. tools/deploy/kiem-nhanh.mjs:88 checks `body.ok !== true` before line 96 ever checks `vai`, so the reason is always `sức khoẻ ok khác true (vai: không nối được cơ sở dữ liệu)`. `vai nối chưa đạt` needs `ok:true` together with `vai≠dat`, which only the fake health server in tools/deploy/deploy.test.ts:765/854/977 produces. Result: the line `make rollback` actually prints for the most common case after a rotation (picking a build from before it) matches no row in the table, and the operator cannot find what to do. The same unreachable reason is the trigger of the pointer in docs/van-hanh/lui-ban.md:106 («Lý do `vai nối chưa đạt` ngay sau khi xoay…»). It is also drawn in the figure _acceptance/lui-ban-luc-xoay-mat-khau/figures/hoi-1-lenh-tu-lui.html:66 and copied in figures/index.md:13. The standing test tests/so-tay-lui-ban.test.ts does not catch this. everyLine only checks the fixed head `kiem-nhanh-ten-mien ĐỎ` (it cuts at `${`), so the wrong reason after it passes green.

- **Runbook tells the operator to look for the reason `vai nối chưa đạt`, which the check never prints when the login role cannot connect**
  file: `docs/van-hanh/xoay-khoa.md:152`
  severity: medium
  AC: AC-2
  source: bugs
  detail: The new rotation section names `vai nối chưa đạt` as the reason the operator will see when the domain lands on a deployment built before the rotation. Line 151 says the reason is "thường là `vai nối chưa đạt`", and line 152 gives the `make rollback` line as `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: …`. The pointer added at docs/van-hanh/lui-ban.md:106 keys on the same reason text. The code cannot produce that reason in this case. The health endpoint (src/modules/identity/health.ts:51-53) sets `ok: vai === "dat"`, so any deployment that cannot connect returns `ok:false` together with a non-`dat` `vai`. kiemNhanh (tools/deploy/kiem-nhanh.mjs:88) checks `body.ok !== true` first and returns `sức khoẻ ok khác true (vai: <value>)`. The later branch at line 96 that would print `vai nối chưa đạt: …` is never reached against the real health endpoint. Result: right after a rotation, the operator actually sees `kiem-nhanh-ten-mien ĐỎ — sức khoẻ ok khác true (vai: không nối được cơ sở dữ liệu)`, or the LoginRoleError message. That line matches neither the `make rollback` row of the section nor the trigger sentence in lui-ban.md. They fall back to the generic advice in lui-ban.md ("Bản vừa lùi về cũng hỏng thì làm lại bước 3 và 4 với một bản cũ hơn"), which is exactly the futile retry of older deployments this change was meant to prevent. The test does not catch this. everyLine only reads the fixed heads of say()/stop() up to the first `${`, so reason strings are never compared against the docs. The fix is to name the real reason in the docs (`sức khoẻ ok khác true (vai: …)`), or to make the check report `vai` before `ok`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
