# Review findings: hoi-dau-chu-bao-sai (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC ở lượt này. Lỗi của E9b (chữ nút vượt 17 ký tự, không nằm trong bảng nhãn) được ghi trong evidence-report.md, không thuộc danh sách finding này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 4 (assertion âm tính một mình): «break» của E5b so hai chuỗi tự dựng, không đo trang**
  Người dùng thấy gì: Một phép kiểm kiểu «đổi căn thì thanh đáy phải đổi người giữ» luôn xanh nên không bắt được lỗi nếu thanh đáy giữ nhầm tên người giữ cũ. Người dùng chưa thấy lỗi thật nào, chỉ là lưới an toàn ở chỗ này lỏng.
  Căn cứ: Nhẹ với người dùng vì chưa có hành vi sai nào được chỉ ra; chỉ là lưới bắt lỗi lỏng, ghi lại rồi siết khi sửa nơi này sau.
  file: `tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): ca Quản trị sàn chỉ đo việc thanh đáy vắng mặt**
  Người dùng thấy gì: Phép kiểm cho vai Quản trị sàn có thể xanh dù trang tải lỗi, nên chưa chắc chứng minh được là nút hỏi bị ẩn đúng vì luật quyền. Hành vi thật với người dùng chưa thấy sai.
  Căn cứ: Nhẹ vì không có người dùng nào bị ảnh hưởng đã biết; chỉ là bằng chứng kiểm chưa chặt, thêm một phép kiểm dương là rẻ nếu sau này cần.
  file: `tests/e2e-db/hoi-dau-chu-bao-sai.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (assert «có mặt» khi lời hứa là quan hệ): «Đang hiện» chỉ được kiểm là khác rỗng**
  Người dùng thấy gì: Nếu dòng «Đang hiện» trong hộp báo sai lấy nhầm giá trị của thuộc tính khác thì các phép kiểm hiện tại vẫn không báo. Chưa có bằng chứng người dùng đang thấy giá trị sai.
  Căn cứ: Mức nhẹ đến vừa vì nếu sai thì người dùng sẽ báo nhầm giá trị, nhưng chưa thấy lỗi thật và người dùng tự nhìn ra được ngay trên hồ sơ.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 3 (assert «có mặt» khi lời hứa là quan hệ): giá trị mong đợi của tin đã chép được dựng từ chính đầu ra**
  Người dùng thấy gì: Phần câu hỏi trong tin chép (mã căn, toà) không được đối chiếu với hàng thật, chỉ đường dẫn được kiểm. Nếu tin hỏi nhầm căn, bài kiểm vẫn xanh, nhưng chưa thấy tin sai thật.
  Căn cứ: Vừa vì tin nhầm căn sẽ làm người giữ căn hiểu sai, nhưng người gửi tự đọc tin trước khi bấm gửi nên tự bắt được; chưa thấy lỗi thật.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 (dùng bản viết tay thay đầu ra thật): các ca «break» tự dựng giá trị sai rồi đảo assertion, không làm hỏng mã sản phẩm**
  Người dùng thấy gì: Một số ca kiểm «nếu bỏ luật thì phải đỏ» không thực sự bỏ luật nên không chứng minh được lưới bắt lỗi hoạt động. Người dùng không thấy khác biệt nào hiện nay.
  Căn cứ: Nhẹ với người dùng vì không có hành vi sai nào; chỉ làm giảm độ tin cậy của lưới kiểm, nên ghi rõ giới hạn này.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): ca «role without catalog reading» đo việc thiếu provider, không đo ô readCatalog**
  Người dùng thấy gì: Phép kiểm cho vai không có quyền đọc danh mục không phân biệt được «thiếu quyền đúng ô» với «thiếu cả khung quyền», nên nếu nút báo sai gắn nhầm quyền thì chưa chắc bị bắt. Chưa thấy ai bị hiện nút sai.
  Căn cứ: Nhẹ vì không có người dùng bị lộ nút sai đã biết và nút chỉ soạn tin nội bộ, người tự bấm gửi; siết phép kiểm sau là rẻ.
  file: `tests/hoi-dau-chu-bao-sai.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét cả lớp nhưng chỉ có từng ca lẻ): ma trận openShare tuyên «every device × outcome cell» mà chỉ có 6 trong 12 ô**
  Người dùng thấy gì: Một vài tổ hợp hiếm khi máy chia sẻ bị từ chối mà bộ nhớ tạm cũng hỏng hoặc không có chưa được kiểm tự động. Nếu có lỗi ở đó, người dùng có thể không nhận được thông báo đúng, nhưng chưa thấy lỗi thật.
  Căn cứ: Nhẹ vì tổ hợp này hiếm, người dùng thử lại hoặc tự chép tay được; thêm ca kiểm sau là rẻ nhưng không gấp.
  file: `src/lib/share/share.test.ts`
  severity: low
  Đề xuất: known-limits

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
