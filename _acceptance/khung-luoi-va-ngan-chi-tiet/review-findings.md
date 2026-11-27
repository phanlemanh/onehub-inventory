# Review findings: khung-luoi-va-ngan-chi-tiet (vòng 5)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The new 'no button at the record foot' check has no break test, unlike the other checks added in this round**
  Người dùng thấy gì: Nút ở đáy hồ sơ trên điện thoại vẫn được đo đúng như hợp đồng. Chỉ là chưa có bài thử chứng minh phép đo sẽ báo lỗi nếu nút ấy biến mất, nên một lúc nào đó phép đo có thể lặng lẽ không đo gì mà vẫn báo đạt.
  Căn cứ: Người dùng không thấy gì sai ở bản hiện tại; rủi ro chỉ là sau này một lỗi nút nhỏ lọt qua mà không ai biết, và bổ sung bài thử sau này rẻ, không mất dữ liệu.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: E7 tuyên đo cả ba chỗ (đầu hồ sơ, đầu mục, đáy hồ sơ) nhưng đáy hồ sơ không có ca phá nào, và phép kiểm còn bỏ qua đáy khi đáy không hiện**
  Người dùng thấy gì: Nếu phần đáy hồ sơ trên điện thoại biến mất hoặc nút ở đó bị thu nhỏ, bài kiểm hiện có có thể vẫn báo đạt vì không đo gì ở đó. Người dùng điện thoại có thể gặp nút khó bấm mà không ai được cảnh báo trước.
  Căn cứ: Hiện chưa có hỏng thật nào ở đáy hồ sơ, người dùng chưa chịu hậu quả; nếu xảy ra thì chỉ là nút khó bấm, tải lại không mất dữ liệu, và vá bài kiểm sau này không đắt.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính đứng một mình, không ghim thông điệp): phép thử đỏ «bỏ bóng» của E11 không chứng minh được rằng phép đo bóng ở ô thân bắt được lỗi (r4)**
  Người dùng thấy gì: Người dùng không thấy gì khác đi. Chỉ là bài kiểm tra bóng đổ của cột ghim chưa chắc bắt được lỗi nếu phần thân bảng mất bóng, nên sau này một lỗi như vậy có thể lọt qua mà không báo đỏ.
  Căn cứ: Không ảnh hưởng gì tới người dùng hôm nay và bóng đổ vẫn đang hiện đúng; rủi ro chỉ là một lỗi tương lai khó bị phát hiện sớm, và có thể bổ sung lại bất cứ lúc nào với chi phí thấp.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm tính đứng một mình, không có đối chứng dương): lần kiểm «no shadow shows on the grid» trong vòng tối vẫn ném lỗi dù ngăn đã sửa đúng (r3 · tệp đã đổi)**
  Người dùng thấy gì: Ở giao diện tối, bài kiểm tự động nói bóng của ngăn bị cắt thì không chứng minh được gì, vì bóng ở nền tối vốn đã quá nhạt. Người dùng có thể thấy bóng ngăn bị cắt ở giao diện tối mà bài kiểm không báo.
  Căn cứ: Bóng ở nền tối vốn rất nhẹ nên hậu quả thị giác nhỏ, không mất dữ liệu; chỉ là bài kiểm bớt chắc ở một nhánh.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (mẫu đối chứng làm tay, không rút được từ bên tạo): hai khung đỏ khong-tach của E18 không có lệnh nào sinh lại (r3 · tệp đã đổi)**
  Người dùng thấy gì: Hai ảnh dùng làm mẫu «ngăn không tách khỏi lưới» được làm tay, nên khó chụp lại đúng cùng điều kiện về sau. Người dùng không bị ảnh hưởng, chỉ việc kiểm lại bằng mắt có thể kém chắc.
  Căn cứ: Chỉ liên quan tới bằng chứng nghiệm thu, không tới màn hình người dùng; nếu ảnh cũ lệch thì chụp lại là xong, không mất gì.
  file: `_acceptance/khung-luoi-va-ngan-chi-tiet/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): chiều đỏ 'grid ends' của Q2 đưa số tự đặt vào assertGridFits (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra việc lưới khít màn có thể vẫn xanh nếu sau này lưới dừng sai chỗ, nên một lỗi về chỗ dừng của lưới có thể lọt qua mà không ai biết. Hiện màn vẫn chạy đúng.
  Căn cứ: Nhẹ với người dùng vì màn hiện đúng; chỉ làm giảm khả năng báo sớm khi lưới lệch sau này, và bổ sung bài kiểm tra bất cứ lúc nào cũng được.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ Q3 dùng regex hai nhánh nên nhánh bóng và viền trái chưa từng đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này ngăn chi tiết mất bóng hoặc viền trái, bài kiểm tra có thể không báo, nên nhân viên sàn có thể thấy ngăn nhìn phẳng và khó tách khỏi lưới.
  Căn cứ: Hậu quả chỉ là thẩm mỹ, không mất dữ liệu, người dùng vẫn dùng được; chưa xảy ra nên chấp nhận và ghi lại là đủ.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình, không ghim thông điệp): chiều đỏ Hỏi-7 dùng /keep their words|lines while pinned/ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi ngăn được ghim thành cột, nếu nút lại hiện chữ hoặc rộng quá thì bài kiểm tra có thể không bắt được, làm hàng nút chật và khó bấm trên màn nhỏ.
  Căn cứ: Chỉ ảnh hưởng độ gọn của thanh nút, người dùng vẫn bấm được và tải lại là ổn; dễ bổ sung sau.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay): chiều đỏ 'no button at the record head' của E7 đưa mảng rỗng tự đặt (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu đầu hồ sơ mất hết nút, phép kiểm này chưa được chứng minh là báo đỏ trên trang thật, nên nhân viên có thể gặp hồ sơ không có nút mà không ai hay.
  Căn cứ: Mất hết nút ở đầu hồ sơ sẽ lộ ngay khi dùng và các bài khác cũng đo nút này, nên rủi ro thấp và sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
