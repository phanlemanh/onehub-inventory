# Review findings: khung-luoi-va-ngan-chi-tiet (round 3)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Pinned-edge test silently drops the 'shadow only on the last pinned column' and header-cell checks, and its doc still claims them**
  Người dùng thấy gì: Khi ghim hai cột, nếu cột ghim bên trong cũng đổ bóng hoặc tiêu đề thiếu bóng thì bài kiểm tự động sẽ không báo. Người dùng có thể thấy bóng ở sai chỗ mà không ai phát hiện sớm.
  Căn cứ: Màn hình vẫn đúng điều chủ kho đã duyệt, chỉ là lưới an toàn tự động lỏng hơn trước; lỗi nếu có chỉ là thẩm mỹ, người dùng không mất dữ liệu và việc dặn lại bài kiểm có thể làm sau.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **E2 expectation for dark theme changed by a supervisor ruling (G-2711-28) that is not in the decision ledger and contradicts E18**
  Người dùng thấy gì: Hồ sơ nghiệm thu nói hai điều khác nhau về nền ngăn ở giao diện tối, và phán quyết của giám sát chưa được ghi vào sổ. Người dùng không thấy khác biệt gì, nhưng người đọc hồ sơ sau này sẽ khó biết điều nào là đúng.
  Căn cứ: Không ảnh hưởng gì đến người dùng cuối, chỉ làm hồ sơ khó đọc; bổ sung dòng sổ sau là rẻ và không làm hỏng gì khi chưa làm.
  file: `_acceptance/khung-luoi-va-ngan-chi-tiet/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Orphaned or duplicated JSDoc blocks left behind by the rewrite**
  Người dùng thấy gì: Một vài chú thích trong mã kiểm thử bị dư hoặc đặt nhầm chỗ. Người dùng không bị ảnh hưởng gì.
  Căn cứ: Chỉ là chuyện gọn mã của bài thử, không tác động tới sản phẩm, nên chấp nhận và không mở việc.
  file: `tests/e2e/do-diem-anh.ts`
  severity: low
  Đề xuất: wont-fix

- **In light theme, the record's left-line check passes on the shadow alone, so a missing or invisible line goes unnoticed**
  Người dùng thấy gì: Ở giao diện sáng, nếu viền bên trái của ngăn chi tiết vô tình biến mất hoặc trùng màu nền thì bài kiểm tự động vẫn cho qua vì bóng đã làm mép trông tối. Người dùng khi đó sẽ thấy ngăn kém tách khỏi lưới.
  Căn cứ: Hậu quả chỉ là mép ngăn kém rõ, không mất dữ liệu và dễ thấy khi xem tay; chi phí siết bài đo không lớn nhưng ngoài điều đã ký.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra) + 4: «viền trái thấy được» của Q3 chỉ đỏ được qua borderLeftWidth khai báo; phần đo điểm ảnh ở nền sáng thật ra đo bóng**
  Người dùng thấy gì: Bài kiểm tự động cho «viền trái thấy được» thực ra chỉ chắc chắn bắt được lỗi khi viền bị khai báo bằng 0, còn viền có mà không nhìn thấy thì có thể lọt. Người dùng có thể gặp ngăn không có đường viền rõ ở giao diện sáng.
  Căn cứ: Lỗi nếu xảy ra chỉ là thẩm mỹ, tự khỏi khi sửa kiểu và không mất dữ liệu; giữ như hiện tại và ghi lại hạn chế này là hợp lý.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm tính đứng một mình, không có đối chứng dương): lần kiểm «no shadow shows on the grid» trong vòng tối vẫn ném lỗi dù ngăn đã sửa đúng**
  Người dùng thấy gì: Ở giao diện tối, bài kiểm tự động nói bóng của ngăn bị cắt thì không chứng minh được gì, vì bóng ở nền tối vốn đã quá nhạt. Người dùng có thể thấy bóng ngăn bị cắt ở giao diện tối mà bài kiểm không báo.
  Căn cứ: Bóng ở nền tối vốn rất nhẹ nên hậu quả thị giác nhỏ, không mất dữ liệu; chỉ là bài kiểm bớt chắc ở một nhánh.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét cả lớp nhưng chỉ đo một điểm): JSDoc của assertPinnedEdge vẫn hứa phần tiêu đề và «không cột ghim nào khác», nhưng mã đã bỏ cả hai**
  Người dùng thấy gì: Phần ghi chú của bài kiểm nói nó bảo vệ cả tiêu đề và các cột ghim khác, nhưng thực tế không. Người dùng có thể gặp bóng sai ở những chỗ ấy mà không ai biết là chưa được kiểm.
  Căn cứ: Chỉ làm người đọc hiểu sai phạm vi bảo vệ, không đổi gì cho người dùng; sửa chú thích rẻ nhưng không cần gấp.
  file: `tests/e2e/sheet.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (mẫu đối chứng làm tay, không rút được từ bên tạo): hai khung đỏ khong-tach của E18 không có lệnh nào sinh lại**
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

- **Hình dạng 4 (âm tính một mình): phần thanh công cụ của sentFrame mà E21 dựa vào bị bỏ qua im lặng và không có chiều đỏ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trên màn Đã gửi, nếu thanh công cụ chạy đè lên ngăn chi tiết thì bài kiểm tra có thể không báo, khiến nút cuối bị che khi mở chi tiết.
  Căn cứ: Màn hiện đúng và lỗi nếu xảy ra chỉ là nút bị che, người dùng đóng ngăn là xong; chi phí bổ sung bài thấp nên ghi lại để làm sau.
  file: `tests/e2e/khung-luoi-nut.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): kiểm «Cột» và «Toàn màn hình» bỏ qua im lặng khi thiếu nút và không có chiều đỏ (r1)**
  Người dùng thấy gì: Nếu nút «Cột» hoặc «Toàn màn hình» biến mất khỏi thanh công cụ, bài kiểm tra này sẽ không báo, người dùng mất cách đổi cột hoặc vào toàn màn hình.
  Căn cứ: Nút mất sẽ bị phát hiện rất nhanh qua các bài khác và khi dùng thật, mức nhẹ, tải lại không mất dữ liệu; sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 (fixture viết tay): chiều đỏ 'no button at the record head' của E7 đưa mảng rỗng tự đặt (r1)**
  Người dùng thấy gì: Nếu đầu hồ sơ mất hết nút, phép kiểm này chưa được chứng minh là báo đỏ trên trang thật, nên nhân viên có thể gặp hồ sơ không có nút mà không ai hay.
  Căn cứ: Mất hết nút ở đầu hồ sơ sẽ lộ ngay khi dùng và các bài khác cũng đo nút này, nên rủi ro thấp và sửa không đáng công.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: wont-fix

⚠ Cụm ngoài vùng phủ: 2/8 lỗi rơi vào file không bộ đo nào phủ (_acceptance/khung-luoi-va-ngan-chi-tiet/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
