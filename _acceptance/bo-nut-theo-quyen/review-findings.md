## Trong hợp đồng

- **Action names in the shared row menus and App Shell entries are plain strings, so the check that an action exists in the permission table does not cover them**
  file: `src/components/candidate/row-actions.tsx:433`
  severity: medium
  AC: AC-3
  source: conventions
  detail: `RecordAction.action`, `RecordActions.main.action`, `NavItem.action` (src/components/templates/nav-items.ts:39) and `ActionPermission` (src/components/candidate/action-permission.tsx:274) all take `action: string`. `SessionRoles` then casts it with `action as ActionName` (src/modules/identity/ui/permitted-action.tsx:1074). The check `thao-tac-ngoai-bang` in tests/bo-nut-kiem.test.ts only reads the `action` attribute of `<PermittedAction>`. If a misspelled or removed action name lands in a «…» menu, a record header or a sidebar entry, `allowedScope` finds no row and returns null, so the button or entry quietly disappears for every role. Neither the type check nor the test turns red. That goes against the one-door design of row 9e: every button decided by a row that exists in ontology/actions.yaml. Shared components may already import from `@/generated/ontology` (nav-items.ts imports `Role` from there), so they can be typed as `ActionSpec["name"]` without a module dependency.
  rationale: AC-3 requires the check to go red when a UI file declares an action name absent from the permission table; menus and sidebar entries escape that check.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The own-record flag defaults to «mine», so a button for an own-scope action shows on other people's records when a caller forgets to pass it**
  Người dùng thấy gì: If a future screen forgets to say whose record it is, a person might see a button for someone else's record. The server still refuses the action, so nothing is changed by mistake.
  Căn cứ: Nothing is broken today and the server blocks the action anyway, so the harm is only a misleading button that appears in a future screen.
  file: `src/modules/identity/ui/permitted-action.tsx`
  severity: low
  Đề xuất: known-limits

- **The prototype reuses the RESO field Listing.subdivisionName to mean «keeper» and «creator», including on contact rows**
  Người dùng thấy gì: The sample page shows a field under a name that means something else in the standard. Only the development sample page and its screenshots are affected, not real users.
  Căn cứ: The page is hidden in production and holds no real data, so users see nothing wrong and the cost is only some confusing sample naming.
  file: `src/app/(app)/proto/bo-nut-theo-quyen/showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **The prototype writes its own list of the four roles instead of using the identity module's ROLES**
  Người dùng thấy gì: The sample page keeps its own copy of the four roles. If roles change, the sample page could show a stale list; real screens are unaffected.
  Căn cứ: Only the development sample page is affected and it is easy to notice and fix when roles change, so there is no user-facing harm.
  file: `src/app/(app)/proto/bo-nut-theo-quyen/showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ có khẳng định âm, không có đối chứng dương): nút chính của RecordActions chỉ được kiểm là vắng mặt**
  Người dùng thấy gì: The tests check that the main button disappears when not allowed, but not that it appears when allowed. A record page that never shows its main button could slip through the tests.
  Căn cứ: Other tests and screenshots already show the buttons, so the risk is small and anyone can notice a missing button at once; adding the check later is cheap.
  file: `src/components/candidate/row-actions.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ có khẳng định âm): «the rest stays» không được đo**
  Người dùng thấy gì: On someone else's record, the tests do not confirm that actions everyone may use still appear. A bug hiding the whole menu there would not be caught.
  Căn cứ: The behaviour is probably right today and a missing menu is visible immediately, so the harm is low and the test can be strengthened cheaply later.
  file: `src/components/candidate/row-actions.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ có khẳng định âm, không ghim thông điệp): vai không có ô xem chỉ được kiểm là không có «…»**
  Người dùng thấy gì: For a role without view rights, the test confirms no menu shows but not that the person sees the «not allowed» message. A blank area would pass the test.
  Căn cứ: The person would only see an empty area instead of a message, which is confusing but harmless and leaks no data; the sample page is the only place affected.
  file: `tests/e2e/bo-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): mục Thành viên của thanh bên được dựng lại bằng regex trên nguồn**
  Người dùng thấy gì: The test for the Members sidebar entry rebuilds the entry itself rather than using the real one. If the real entry is later written differently, the test could stay green while the sidebar misbehaves.
  Căn cứ: The sidebar works today and a wrong entry would be seen at once; the risk is only that a future change goes unflagged by this one test.
  file: `tests/e2e-db/bo-nut-members.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm không ghim vào nguồn): câu lỗi chung là chuỗi viết tay**
  Người dùng thấy gì: If the wording of the general error message changes, the test could no longer tell it apart from the specific «not allowed» message. People would still see the right messages.
  Căn cứ: Users are unaffected and it only matters if someone rewords the message, in which case the test needs a one-line update.
  file: `tests/e2e-db/bo-nut-members.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
