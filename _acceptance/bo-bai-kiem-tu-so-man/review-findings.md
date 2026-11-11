## Trong hợp đồng

- **Real-grid 'vung' test reuses one page, so break init scripts leak into later cases and the cho-tai break goes red for the wrong reason**
  file: `tests/e2e/screens/screens.spec.ts:89`
  severity: high
  AC: AC-6
  source: bugs
  detail: The `vung` test for a real grid screen runs every REGION main case and every break on the same `page` (lines 95-98). Breaks register `page.addInitScript(...)` in `before`, and those scripts run again on every later `page.goto` of that page. In this order, `cho-tai` break 1 adds an observer that deletes `[data-slot="region-skeleton"]` for good. Break 2 ('bo do tre cua dong ho vung') then opens the page again with that observer still active. Its check fails first with 'cho-tai: khung cho khong hien' instead of the pinned /hien chi bao truoc 1 giay/, so `runBreak`'s `toMatch` fails. The same leak keeps the 'Xoá lọc' remover and the tabindex stripper alive for the later `tim-khong-ra` and `chu-dai` cases, and leaves `page.clock.install()` in place after `cho-tai`. Today this never runs because inventory and sent are skipped via `NO_REGION_YET`. Once row 2 gives inventory a region, `classifyGrid` makes the test run and it fails for reasons unrelated to the screen. The calibration describe does not have this problem because it gives each case its own test, and so its own fresh page. Fix: open each recipe or break in a new page or context, or split them into separate tests the way the calibration describe does.

- **With E2E_CPU_THROTTLE set, a second open() on the same page throws 'ham cpu khong co tac dung'**
  file: `tools/e2e_templates/runner.ts:21`
  severity: medium
  AC: AC-9
  source: bugs
  detail: `open()` always calls `throttle(page)`. That measures `before` on about:blank, sets `Emulation.setCPUThrottlingRate` through a new CDP session, and requires `after/before >= 2.5`. CDP CPU throttling stays on the page target across navigations, and the first CDP session is never detached. On the second `open()` of the same page, `before` is therefore already measured under throttling and the ratio is about 1, so it throws the pinned 'ham cpu khong co tac dung'. The `vung` test in tests/e2e/screens/screens.spec.ts calls `runMain`/`runBreak` many times on one page, so the `man_e2e_cham` run (E9) fails as soon as any real grid screen has a region. Fix: throttle once per page (e.g. track it in a WeakSet), or reset the rate to 1 before measuring `before`.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Unit test calls Python and Playwright synchronously with no timeout, despite the contract's 60 s limit**
  Người dùng thấy gì: Nếu bộ đọc sổ hoặc bộ liệt kê bài bị treo, lần kiểm tra tổng sẽ đứng chờ mãi thay vì báo đỏ. Người dùng không gặp lỗi này trong sản phẩm, chỉ người chạy kiểm tra bị kẹt.
  Căn cứ: Chỉ ảnh hưởng người chạy kiểm tra khi có sự cố hiếm, không mất dữ liệu, tắt tiến trình rồi chạy lại là xong.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: medium
  Đề xuất: known-limits

- **E1 eval describes a ghost screen with route '/', but the test uses '/ghost'**
  Người dùng thấy gì: Mô tả của một bài chấm ghi sai địa chỉ trang giả, nên người đọc hoặc bộ chấm có thể thấy lệch giữa mô tả và điều thực sự chạy. Sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là chữ mô tả sai, không ảnh hưởng người dùng, sửa một dòng lúc nào cũng được.
  file: `_acceptance/bo-bai-kiem-tu-so-man/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **The search recipe copies the list of searchable kinds by hand instead of reading it from its source**
  Người dùng thấy gì: Danh sách các loại cột tìm được bị chép tay ở bộ kiểm tra. Nếu sau này thêm loại cột mới, bài kiểm tìm có thể báo đỏ giả mà không chỉ ra đúng nguyên nhân.
  Căn cứ: Hôm nay hai danh sách khớp nhau, hậu quả chỉ là báo đỏ giả cho người phát triển sau này, không đụng tới người dùng cuối.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **Hinh dang 1 (do chi dan thay vi dau ra): bai 'cong thuc khong tu mo trang' grep ma nguon cua check, khong do hanh vi mo trang**
  Người dùng thấy gì: Bài kiểm tra việc công thức không tự mở trang chỉ đọc chữ trong mã, nên một công thức mở trang bằng đường vòng vẫn lọt qua. Người dùng cuối không bị ảnh hưởng, chỉ độ tin cậy của bộ kiểm tra thấp hơn mô tả.
  Căn cứ: Không có lỗi nào đang xảy ra với người dùng, chỉ là lưới an toàn có kẽ hở nhỏ, và bổ sung sau cũng không tốn kém.
  file: `tools/e2e_templates/structure.ts`
  severity: medium
  Đề xuất: known-limits

- **Hinh dang 1 (do chi dan thay vi dau ra): 'dem dung 2 luot quet' dem so vong lap, khong do trang da that su o che do toi**
  Người dùng thấy gì: Lượt quét giao diện tối chưa được chứng minh là thật sự đang ở giao diện tối, nên một lỗi chỉ xuất hiện ở nền tối có thể không bị bắt. Người dùng nền tối có thể gặp chữ khó đọc mà bộ kiểm tra không báo.
  Căn cứ: Hiện chưa có màn nào bị lỗi này và người dùng tự thấy rõ khi gặp, sửa bộ kiểm tra sau này không đắt.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
