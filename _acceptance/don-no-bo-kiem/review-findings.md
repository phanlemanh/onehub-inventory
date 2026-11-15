# Review findings: don-no-bo-kiem (round 3)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **onResult passes its page-changing code as a string through a raw page.evaluate, so the 'one door' static check cannot see it**
  Người dùng thấy gì: Phép kiểm tra tự động có một kẽ hở: một chỗ trong bộ bài kiểm vẫn đổi trang mà phép kiểm tra không thấy. Hiện chỗ đó chạy an toàn, người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là kẽ hở trong công cụ kiểm tra nội bộ, hiện chưa gây lỗi gì và người dùng không thấy; sửa sau vẫn rẻ nếu có người thêm bài mới đi qua kẽ này.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **The 'go nut Xoa loc' break never removes a button that is already on the page when the hydrated mark appears**
  Người dùng thấy gì: Một bài phá thử trong bộ kiểm có thể thỉnh thoảng báo đỏ sai vì nút chưa bị gỡ kịp. Chỉ ảnh hưởng người chạy bộ kiểm, không ảnh hưởng người dùng sản phẩm.
  Căn cứ: Hậu quả nhẹ: chỉ làm bộ kiểm đỏ oan lúc nào đó và chạy lại là qua; không mất dữ liệu và không chạm người dùng cuối.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

- **The two page-stripping breaks start on the root mark, which can come before the data region's loading boundary has hydrated**
  Người dùng thấy gì: Hai bài phá thử có thể bắt đầu sửa trang quá sớm và gây lại cảnh báo dựng trang lệch, làm bộ kiểm đỏ oan. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ làm bộ kiểm đỏ oan thỉnh thoảng, chạy lại là hết, không lộ hay mất dữ liệu; nhưng nếu lặp lại thì đúng nợ mà hàng này muốn dọn nên đáng theo dõi.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

- **The pageReady deadline is not enforced when the given element is missing: locator.evaluate waits until the test timeout, and .catch(() => false) hides the cause**
  Người dùng thấy gì: Khi một màn thiếu tiêu đề, bài kiểm sẽ treo đến hết giờ dài thay vì báo lỗi sớm với nguyên nhân rõ. Chỉ làm người chạy bộ kiểm chờ lâu hơn.
  Căn cứ: Chỉ xảy ra ở màn hiếm khi thiếu mọi phần tử chờ và chỉ làm chậm, không sai kết quả; chi phí sửa nhỏ nhưng hậu quả cũng rất nhẹ.
  file: `tests/e2e/sua-trang.ts`
  severity: low
  Đề xuất: wont-fix

- **The new hydration helper copies the React check that the shared test runner already has (r2)**
  Người dùng thấy gì: Quy tắc nhận biết trang đã tải xong nằm ở hai chỗ trong bộ kiểm tự động. Người dùng sản phẩm không bị ảnh hưởng; chỉ khi thư viện giao diện đổi cách làm thì một chỗ có thể được sửa còn chỗ kia bị quên, khiến bài kiểm đỏ oan.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; nếu lệch thì chỉ làm bài kiểm đỏ và dễ thấy ngay, còn việc gom về một chỗ có thể làm sau với chi phí thấp.
  file: `tests/e2e/da-gan.ts`
  severity: low
  Đề xuất: known-limits

- **Thay đổi chạm tools/** nên cả PR rơi vào bậc high: cần chủ mã duyệt, tác tử không được tự gộp (r1)**
  Người dùng thấy gì: Thay đổi này cần chủ kho duyệt trước khi gộp, tác tử không tự gộp được. Người dùng cuối không bị ảnh hưởng gì.
  Căn cứ: Chỉ là bước duyệt thêm theo quy trình, không mất hay lộ dữ liệu của ai, và đã được nêu ở cổng phạm vi nên ghi lại là đủ.
  file: `tools/wiki_lint.py`
  severity: low
  Đề xuất: known-limits

- **Hydration guard is silently missing from the CI database job because the command-line reporter flag replaces the config's reporters (r1)**
  Người dùng thấy gì: Khi chạy kiểm tra tự động trên CI có cơ sở dữ liệu, cảnh báo dựng trang lệch vẫn có thể lọt qua mà không làm lượt chạy đỏ. Người dùng không thấy ngay, nhưng lỗi giao diện kiểu này có thể đến tay họ mà không ai hay.
  Căn cứ: Không mất dữ liệu và chỉ ảnh hưởng độ chắc của lưới kiểm tra trên CI, vẫn còn chạy được ở máy dev; sửa rẻ nhưng nằm ngoài những gì hàng này đã hứa nên nên đăng thành việc riêng.
  file: `db/scripts/ci-db.sh`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): phép gác hydration bắt hai mẫu, nhưng chỉ một mẫu có chiều đỏ (r1)**
  Người dùng thấy gì: Phép gác cảnh báo dựng trang lệch mới được thử đỏ cho một loại cảnh báo, loại thứ hai chưa được thử. Nếu loại này xảy ra, giao diện có thể lệch mà bộ kiểm vẫn xanh.
  Căn cứ: Hậu quả nhẹ vì chỉ là một loại cảnh báo hiếm chưa được chứng minh, không mất dữ liệu, và có thể bổ sung sau khi gặp ca thật.
  file: `tests/e2e/gac-hydration.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): chiều đỏ của «cấu hình thiếu phép gác» đưa chuỗi 'list' gõ tay, không nạp bản sao cấu hình (r1)**
  Người dùng thấy gì: Bài thử kiểm tra việc thiếu phép gác dùng dữ liệu viết tay nên có thể không bắt được nếu cấu hình thật đổi sang dạng khác. Người dùng không bị ảnh hưởng trực tiếp.
  Căn cứ: Rủi ro rất nhỏ, chỉ xảy ra nếu sau này ai đó đổi dạng cấu hình, không ảnh hưởng người dùng và không mất dữ liệu; công sửa không đáng so với hậu quả.
  file: `tests/cong-chay.test.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
