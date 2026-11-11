## Trong hợp đồng

- **cho-tai: the fake clock is never paused, so the 'not before 1 s' check depends on real time**
  file: tools/e2e_templates/recipes.ts:340
  severity: medium
  AC: AC-9
  source: bugs
  detail: The runner calls page.clock.install() without pauseAt(). After install, Playwright's fake clock keeps moving in real time. The check then waits in real time: it polls every 100 ms with page.evaluate until the page has armed its 1000 ms timer (region-state.tsx:24), and only then calls clock.runFor(500) and reads the skeleton's visibility. Every real millisecond between arming and that read adds to the 500 ms. If the gap passes about 500 ms, the step fires and the main case fails with 'hien chi bao truoc 1 giay' on a page that is correct. The gap is the poll interval plus the round trips of several evaluate calls, so this is most likely in the 4x-throttled 'cham' copy. The same leak means the assertion does not pin the 1 s bound deterministically. Fix: call page.clock.pauseAt(...) right after install, or once the timer is armed, so only runFor moves time.

- **Slowed copy: two pages are not throttled, contrary to E9's 'every page'**
  file: tests/e2e/screens/screens.spec.ts:80
  severity: low
  AC: AC-9
  source: bugs
  detail: Inside the 'cham' block, the 'ngoai khuon' test opens the page with page.goto and waitReady directly, so open() and throttle() never run. The beforeAll probe in gridSuite (browser.newPage) is not throttled either. The slowed copy of 'ngoai khuon' therefore repeats the normal case at full CPU, while evals.yaml E9 and the card say throttling applies to every page the runner opens.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Test names, log lines and error messages are in Vietnamese, but AGENTS.md requires English**
  Người dùng thấy gì: Tên bài kiểm và thông báo lỗi nội bộ viết bằng tiếng Việt trái quy ước tiếng Anh của kho. Người dùng cuối không thấy gì khác.
  Căn cứ: Chỉ ảnh hưởng người viết mã, không ảnh hưởng người dùng; sửa phải đổi cả hợp đồng đã ký nên tốn kém so với lợi ích.
  file: `tests/e2e/screens/screens.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **TEXT_KINDS copies SEARCHABLE_KINDS by hand, so the rule now lives in two places**
  Người dùng thấy gì: Nếu sau này thêm một loại cột tìm được mới, bài kiểm tìm sẽ không đọc cột đó và có thể bỏ sót lỗi. Hiện tại không có lỗi nào xảy ra.
  Căn cứ: Chưa gây hại cho người dùng, chỉ làm bài kiểm yếu đi khi có loại cột mới; sửa rẻ nhưng chưa cấp bách.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **allRows stops after 100 pages without saying so**
  Người dùng thấy gì: Với bảng có hơn 5000 dòng, bài kiểm tìm có thể bỏ sót dòng khớp mà không báo. Bảng thật hiện nay chưa lớn tới mức đó.
  Căn cứ: Hiếm gặp và chỉ làm bài kiểm kém chặt, không làm mất dữ liệu của người dùng; sửa rẻ khi cần.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **E1 in evals.yaml gives the ghost screen a different route than the test**
  Người dùng thấy gì: Một dòng mô tả trong tài liệu nghiệm thu ghi đường dẫn khác với bài thật. Không ảnh hưởng gì tới người dùng.
  Căn cứ: Chỉ là sai lệch chữ trong tài liệu, không gây hại; ghi vết là đủ.
  file: `_acceptance/bo-bai-kiem-tu-so-man/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): luật 'công thức không tự mở trang' grep mã nguồn của hàm check thay vì xem trang có thật sự bị điều hướng không**
  Người dùng thấy gì: Luật cấm công thức tự mở trang chỉ kiểm bề mặt nên có thể không bắt được trường hợp công thức mở trang gián tiếp. Hiện chưa có công thức nào làm vậy.
  Căn cứ: Không ảnh hưởng người dùng, chỉ là lưới an toàn còn lỏng; sửa vừa phải và có thể làm sau.
  file: `tools/e2e_templates/structure.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): bài 'thông điệp ghim gọi tên màn' khớp regex ghim với chuỗi lỗi chép tay, không lấy từ hàm check thật**
  Người dùng thấy gì: Bài kiểm đơn vị về thông điệp lỗi dùng chuỗi chép tay, nên nếu đổi cách báo lỗi thì bài này vẫn xanh. Bài chạy trình duyệt vẫn bắt được.
  Căn cứ: Có lớp kiểm khác che lại nên rủi ro thấp, không ảnh hưởng người dùng; sửa tốn công hơn lợi ích trước mắt.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
