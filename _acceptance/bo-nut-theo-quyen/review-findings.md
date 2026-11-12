# Review findings — bo-nut-theo-quyen (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **decisions.jsonl: the new decision line (and the one before it) is not valid JSON because of an extra closing brace**
  Người dùng thấy gì: Người dùng cuối không thấy gì khác: các nút và màn vẫn chạy đúng. Chỉ có hai dòng ghi quyết định của vòng này không đọc được bằng công cụ thống kê, nên số liệu vòng có thể thiếu hai quyết định đó.
  Căn cứ: Hậu quả nhẹ, chỉ ảnh hưởng sổ ghi chép nội bộ chứ không mất dữ liệu của người dùng, và nội dung hai dòng vẫn còn nguyên để đọc bằng mắt.
  file: `_acceptance/bo-nut-theo-quyen/decisions.jsonl`
  severity: medium
  Đề xuất: known-limits

- **decisions.jsonl: the new line 33 is not valid JSON (extra closing brace)**
  Người dùng thấy gì: Người dùng cuối không bị ảnh hưởng: nút và màn vẫn hoạt động như cũ. Chỉ có hai dòng ghi quyết định của vòng này bị công cụ đọc sổ bỏ qua hoặc báo lỗi.
  Căn cứ: Hậu quả nhẹ, chỉ nằm ở sổ ghi chép nội bộ, không mất dữ liệu người dùng và nội dung các dòng vẫn còn đọc được bằng mắt.
  file: `_acceptance/bo-nut-theo-quyen/decisions.jsonl`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc, không round-trip): mục Thành viên được dựng lại bằng regex trên mã nguồn nav.ts thay vì lấy mục NAV thật**
  Người dùng thấy gì: Người dùng không gặp lỗi nào hiện tại: thanh bên vẫn ẩn hiện mục Thành viên theo bảng quyền. Rủi ro là về sau, nếu ai đó đổi cách khai mục này, bài kiểm tra có thể vẫn xanh dù mục đã lọc sai theo vai.
  Căn cứ: Hậu quả chưa xảy ra và chỉ làm bài kiểm tra kém nhạy hơn, người dùng không mất gì; việc phát hiện muộn có thể bù bằng các bài đo khác của AC-7.
  file: `tests/e2e-db/bo-nut-members.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **The own-record flag defaults to «mine», so a button for an own-scope action shows on other people's records when a caller forgets to pass it (r1 · tệp đã đổi)**
  Người dùng thấy gì: If a future screen forgets to say whose record it is, a person might see a button for someone else's record. The server still refuses the action, so nothing is changed by mistake.
  Căn cứ: Nothing is broken today and the server blocks the action anyway, so the harm is only a misleading button that appears in a future screen.
  file: `src/modules/identity/ui/permitted-action.tsx`
  severity: low
  Đề xuất: known-limits

- **The prototype reuses the RESO field Listing.subdivisionName to mean «keeper» and «creator», including on contact rows (r1)**
  Người dùng thấy gì: The sample page shows a field under a name that means something else in the standard. Only the development sample page and its screenshots are affected, not real users.
  Căn cứ: The page is hidden in production and holds no real data, so users see nothing wrong and the cost is only some confusing sample naming.
  file: `src/app/(app)/proto/bo-nut-theo-quyen/showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **The prototype writes its own list of the four roles instead of using the identity module's ROLES (r1)**
  Người dùng thấy gì: The sample page keeps its own copy of the four roles. If roles change, the sample page could show a stale list; real screens are unaffected.
  Căn cứ: Only the development sample page is affected and it is easy to notice and fix when roles change, so there is no user-facing harm.
  file: `src/app/(app)/proto/bo-nut-theo-quyen/showcase.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ có khẳng định âm, không có đối chứng dương): nút chính của RecordActions chỉ được kiểm là vắng mặt (r1 · tệp đã đổi)**
  Người dùng thấy gì: The tests check that the main button disappears when not allowed, but not that it appears when allowed. A record page that never shows its main button could slip through the tests.
  Căn cứ: Other tests and screenshots already show the buttons, so the risk is small and anyone can notice a missing button at once; adding the check later is cheap.
  file: `src/components/candidate/row-actions.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ có khẳng định âm): «the rest stays» không được đo (r1 · tệp đã đổi)**
  Người dùng thấy gì: On someone else's record, the tests do not confirm that actions everyone may use still appear. A bug hiding the whole menu there would not be caught.
  Căn cứ: The behaviour is probably right today and a missing menu is visible immediately, so the harm is low and the test can be strengthened cheaply later.
  file: `src/components/candidate/row-actions.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (chỉ có khẳng định âm, không ghim thông điệp): vai không có ô xem chỉ được kiểm là không có «…» (r1)**
  Người dùng thấy gì: For a role without view rights, the test confirms no menu shows but not that the person sees the «not allowed» message. A blank area would pass the test.
  Căn cứ: The person would only see an empty area instead of a message, which is confusing but harmless and leaks no data; the sample page is the only place affected.
  file: `tests/e2e/bo-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): mục Thành viên của thanh bên được dựng lại bằng regex trên nguồn (r1 · tệp đã đổi)**
  Người dùng thấy gì: The test for the Members sidebar entry rebuilds the entry itself rather than using the real one. If the real entry is later written differently, the test could stay green while the sidebar misbehaves.
  Căn cứ: The sidebar works today and a wrong entry would be seen at once; the risk is only that a future change goes unflagged by this one test.
  file: `tests/e2e-db/bo-nut-members.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm không ghim vào nguồn): câu lỗi chung là chuỗi viết tay (r1 · tệp đã đổi)**
  Người dùng thấy gì: If the wording of the general error message changes, the test could no longer tell it apart from the specific «not allowed» message. People would still see the right messages.
  Căn cứ: Users are unaffected and it only matters if someone rewords the message, in which case the test needs a one-line update.
  file: `tests/e2e-db/bo-nut-members.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
