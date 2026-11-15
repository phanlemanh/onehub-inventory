# Review findings: don-no-bo-kiem (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The new hydration helper copies the React check that the shared test runner already has**
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

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
