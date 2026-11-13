# Review findings: hoi-dau-chu-bao-sai (round 2)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The 'Đang hiện' report line and the lowercase helper are each written in two places (r1)**
  Người dùng thấy gì: Hai chỗ trong ứng dụng cùng viết một câu «Đang hiện» và một thông báo lỗi. Hôm nay người dùng thấy chữ giống nhau; nếu sau này sửa một chỗ quên chỗ kia thì hộp và tin chép đi sẽ lệch chữ.
  Căn cứ: Hiện chưa ai thấy sai gì, chỉ có nguy cơ lệch chữ về sau và sửa lúc đó rất rẻ.
  file: `src/modules/listings/messages.ts`
  severity: low
  Đề xuất: known-limits

- **recordLink is still re-exported from copy-link.tsx, but nothing imports it from there (r1)**
  Người dùng thấy gì: Còn một lối đi thừa không ai dùng tới trong mã. Người dùng không thấy và không bị ảnh hưởng gì.
  Căn cứ: Không có hậu quả nào với người dùng, dọn dẹp lúc nào cũng được và không đáng mở việc riêng.
  file: `src/modules/listings/ui/copy-link.tsx`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (tuyên ma trận viết trước nhưng đáp án tính bằng chính hàm đang đo): E5 lấy kết quả mong đợi từ actionVisibility (r1)**
  Người dùng thấy gì: Bài thử việc ai thấy nút hỏi tự tính đáp án từ chính bảng quyền, nên nếu bảng quyền đổi nhầm thì bài thử vẫn xanh. Người dùng có thể thấy hoặc mất nút sai mà không ai báo.
  Căn cứ: Chỉ làm lưới kiểm yếu đi chứ chưa có người dùng nào bị ảnh hưởng, và bảng quyền có nơi kiểm riêng.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ thử «có mặt» trong khi lời hứa là quan hệ): giá trị «Đang hiện» chỉ được thử là không rỗng (r1)**
  Người dùng thấy gì: Bài thử chỉ kiểm dòng «Đang hiện» có chữ, chưa kiểm đúng giá trị của thuộc tính đang chọn. Nếu hiện nhầm giá trị của thuộc tính khác thì bài thử vẫn qua.
  Căn cứ: Là lỗ hổng trong lưới kiểm chứ không phải lỗi người dùng đã gặp, và bổ sung kiểm sau không mất dữ liệu gì.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (chỉ thử «có mặt» trong khi lời hứa là quan hệ): dòng đầu của tin đã chép được so với chính nó (r1)**
  Người dùng thấy gì: Bài thử chưa kiểm dòng đầu của tin hỏi có đúng căn và toà hay không, chỉ kiểm đường dẫn. Chép nhầm căn sẽ không bị bắt.
  Căn cứ: Chưa có lỗi thật, chỉ là phép kiểm chưa đủ chặt; người dùng tự thấy sai khi tin hiện ra nên nhẹ.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (ca đối chứng không chạm phép đo thật): các ca break E4, E5, E6, E7 tự làm hỏng đầu vào của chính assert (r1)**
  Người dùng thấy gì: Mấy ca thử đối chứng không chứng minh được bài thử thật sẽ bắt được lỗi. Nếu sau này nút hiện sai chỗ, các ca này có thể không báo.
  Căn cứ: Ảnh hưởng độ tin cậy của bài thử chứ chưa phải lỗi người dùng gặp, và có thể làm chặt dần.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (ca đối chứng không chạm phép đo thật): break E5b so tên người giữ với chuỗi kiểu giữ, không phải với thanh đáy (r1)**
  Người dùng thấy gì: Một ca thử không đo được việc thanh đáy có còn giữ tên người giữ căn trước khi đổi sang căn khác hay không. Nếu lỗi này xảy ra, người dùng sẽ thấy tên người giữ sai.
  Căn cứ: Là chỗ kiểm yếu; nếu lỗi có thật người dùng tự thấy ngay và tải lại là hết.
  file: `tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (phép thử âm đứng một mình): «không có nút báo sai» chỉ thử bằng cách bỏ hẳn trình cấp quyền (r1)**
  Người dùng thấy gì: Chưa chứng minh được nút báo sai ẩn đi đúng vì thiếu quyền đọc danh mục, chứ không phải vì lý do khác. Có thể có vai bị ẩn hoặc hiện nút sai mà không ai báo.
  Căn cứ: Chỉ là phép kiểm chưa tách đủ điều kiện, hậu quả nhẹ và bổ sung sau không ảnh hưởng người dùng.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): giới hạn 201 và 501 ký tự chỉ thử bằng thuộc tính maxlength (r1)**
  Người dùng thấy gì: Giới hạn số ký tự của hai ô chỉ được kiểm qua chỉ dẫn gửi cho trình duyệt, chưa gõ thử quá giới hạn. Trình duyệt vẫn chặn đúng nên người dùng không gặp vấn đề.
  Căn cứ: Trình duyệt tự thi hành giới hạn này nên rủi ro rất thấp và phép kiểm thêm không đáng công.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
