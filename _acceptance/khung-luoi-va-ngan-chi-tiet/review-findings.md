# Review findings: khung-luoi-va-ngan-chi-tiet (round 1)

Cảnh báo review chưa đủ: hai bộ tìm lỗi đã chết (conventions, bugs), nên phần dưới có thể thiếu lỗi thuộc hai nhóm đó.

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): chiều đỏ 'grid ends' của Q2 đưa số tự đặt vào assertGridFits**
  Người dùng thấy gì: Bài kiểm tra việc lưới khít màn có thể vẫn xanh nếu sau này lưới dừng sai chỗ, nên một lỗi về chỗ dừng của lưới có thể lọt qua mà không ai biết. Hiện màn vẫn chạy đúng.
  Căn cứ: Nhẹ với người dùng vì màn hiện đúng; chỉ làm giảm khả năng báo sớm khi lưới lệch sau này, và bổ sung bài kiểm tra bất cứ lúc nào cũng được.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ Q3 dùng regex hai nhánh nên nhánh bóng và viền trái chưa từng đỏ**
  Người dùng thấy gì: Nếu sau này ngăn chi tiết mất bóng hoặc viền trái, bài kiểm tra có thể không báo, nên nhân viên sàn có thể thấy ngăn nhìn phẳng và khó tách khỏi lưới.
  Căn cứ: Hậu quả chỉ là thẩm mỹ, không mất dữ liệu, người dùng vẫn dùng được; chưa xảy ra nên chấp nhận và ghi lại là đủ.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ Hỏi-7 dùng /keep their words|lines while pinned/**
  Người dùng thấy gì: Khi ngăn được ghim thành cột, nếu nút lại hiện chữ hoặc rộng quá thì bài kiểm tra có thể không bắt được, làm hàng nút chật và khó bấm trên màn nhỏ.
  Căn cứ: Chỉ ảnh hưởng độ gọn của thanh nút, người dùng vẫn bấm được và tải lại là ổn; dễ bổ sung sau.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): phần thanh công cụ của sentFrame mà E21 dựa vào bị bỏ qua im lặng và không có chiều đỏ**
  Người dùng thấy gì: Trên màn Đã gửi, nếu thanh công cụ chạy đè lên ngăn chi tiết thì bài kiểm tra có thể không báo, khiến nút cuối bị che khi mở chi tiết.
  Căn cứ: Màn hiện đúng và lỗi nếu xảy ra chỉ là nút bị che, người dùng đóng ngăn là xong; chi phí bổ sung bài thấp nên ghi lại để làm sau.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): kiểm «Cột» và «Toàn màn hình» bỏ qua im lặng khi thiếu nút và không có chiều đỏ**
  Người dùng thấy gì: Nếu nút «Cột» hoặc «Toàn màn hình» biến mất khỏi thanh công cụ, bài kiểm tra này sẽ không báo, người dùng mất cách đổi cột hoặc vào toàn màn hình.
  Căn cứ: Nút mất sẽ bị phát hiện rất nhanh qua các bài khác và khi dùng thật, mức nhẹ, tải lại không mất dữ liệu; sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 (fixture viết tay): chiều đỏ 'no button at the record head' của E7 đưa mảng rỗng tự đặt**
  Người dùng thấy gì: Nếu đầu hồ sơ mất hết nút, phép kiểm này chưa được chứng minh là báo đỏ trên trang thật, nên nhân viên có thể gặp hồ sơ không có nút mà không ai hay.
  Căn cứ: Mất hết nút ở đầu hồ sơ sẽ lộ ngay khi dùng và các bài khác cũng đo nút này, nên rủi ro thấp và sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
