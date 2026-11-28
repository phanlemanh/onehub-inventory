## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 2 + 4: dữ liệu viết tay cho ca «khong-doc-dong-lenh-echo», đứng một mình vẫn xanh mà không đo gì**
  Người dùng thấy gì: Một phép thử của bộ kiểm tra nghiệm thu có thể báo đạt mà không đo được điều nó hứa. Người dùng cuối không bị ảnh hưởng, chỉ là độ tin cậy của kết luận nghiệm thu thấp hơn một chút.
  Căn cứ: Chỉ ảnh hưởng độ chắc chắn của bộ kiểm tra nội bộ, không làm mất hay lộ dữ liệu của ai, và có thể siết lại sau nếu cần.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: các bản phá «mã khác» và «không chứa mã» ghi thẳng giá trị đúng/sai vào khuôn của bên đọc, bỏ qua hàm git tính ra nó**
  Người dùng thấy gì: Bộ kiểm tra nghiệm thu chưa thử phần so sánh mã trên các cặp bản ghi thực tế, nên một lỗi ở bước này có thể lọt qua. Sản phẩm giao cho người dùng không đổi.
  Căn cứ: Rủi ro chỉ nằm ở lớp kiểm tra phụ trợ, không chạm tới dữ liệu hay thao tác của người dùng, và chấp nhận được rồi ghi lại là hạn chế đã biết.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: «doc-dong-dung-lai» hứa tách đúng lượt chạy và commit, nhưng commit chỉ được kiểm theo định dạng**
  Người dùng thấy gì: Bộ kiểm tra chỉ xem mã phiên bản có đúng dạng hay không, chưa đối chiếu nó có đúng là mã CI ghi. Người dùng không thấy ảnh hưởng gì.
  Căn cứ: Ảnh hưởng rất nhẹ, chỉ làm bộ kiểm tra nội bộ lỏng hơn một chút, không đụng tới dữ liệu và dễ siết lại khi cần.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: «có bài chu-khong-sieu-cap» và «postgres:16» chỉ là kiểm chuỗi có mặt ở bất kỳ đâu trong nhật ký**
  Người dùng thấy gì: Bộ kiểm tra có thể báo đạt khi bài kiểm hay phiên bản cơ sở dữ liệu chỉ được nhắc tên trong nhật ký chứ chưa chạy thật. Người dùng cuối không thấy thay đổi.
  Căn cứ: Chỉ làm kết luận nghiệm thu kém chắc chắn hơn, không gây mất hay lộ dữ liệu, và người ký có thể đọc lại nhật ký CI bằng mắt để bù.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **--tu-kiem crashes with a TypeError instead of a pinned message when the CI run on the branch head is not finished (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu lượt kiểm tự động của PR chưa chạy xong lúc chấm, công cụ chấm báo lỗi khó hiểu thay vì câu «chưa xong». Kết quả vẫn là đỏ nên không có gì lọt qua nhầm.
  Căn cứ: Hậu quả nhẹ: chỉ sai câu báo, không mất dữ liệu, chạy lại sau khi CI xong là hết, và công cụ này chỉ người chấm dùng.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **--tu-kiem crashes with a TypeError when the head run is missing or not finished, instead of reporting the 'chưa xong' verdict (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi lượt kiểm tự động chưa xong, công cụ chấm hiện ra lỗi kỹ thuật thay vì câu báo rõ ràng. Người chấm dễ tưởng công cụ hỏng, nhưng kết quả vẫn đỏ.
  Căn cứ: Hậu quả nhẹ và tự gỡ được: đợi CI xong rồi chạy lại; không ảnh hưởng người dùng sản phẩm hay dữ liệu.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — E7 hứa cả lớp thông điệp đỏ «ca của E7t», nhưng E7t chỉ có 4 bản phá (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một số thông báo đỏ của phép kiểm CI chưa có ca thử riêng, nên nếu chúng hỏng thì chưa chắc ai biết. Sản phẩm và dữ liệu không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ: chỉ là khoảng trống trong bài thử của công cụ chấm, không mất dữ liệu, bổ sung sau với chi phí thấp.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 — bản phá pha-dung-lai-ma-khac đặt thẳng giá trị suy ra `sameCode=false`, không đi qua bên ghi (r2 · tệp đã đổi)**
  Người dùng thấy gì: Ca thử «dùng lại kết quả của mã khác» chỉ thử câu báo, chưa thử đường tính ra từ đầu đến cuối. Một lỗi ở đường ấy có thể không bị phát hiện.
  Căn cứ: Hậu quả nhẹ và khó xảy ra: chỉ làm bài thử của công cụ chấm yếu hơn mong muốn, không chạm tới người dùng hay dữ liệu.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/ci.mjs`
  severity: low
  Đề xuất: known-limits

- **New migration reuses number 001 and fills the gap at 004 instead of taking the next number (r1)**
  Người dùng thấy gì: Hai tệp cập nhật cơ sở dữ liệu mang số cũ thay vì số cuối nên dễ bị người sau bắt chước nhầm. Người dùng cuối không thấy ảnh hưởng gì, cơ sở đã có vẫn được áp bù đúng.
  Căn cứ: Chỉ là lệch nếp đặt số, đã được nêu rõ và chấp nhận có chủ đích; không mất dữ liệu và không ảnh hưởng người dùng, chỉ cần ghi chú để người sau khỏi sao chép.
  file: `db/migrations/001_vai_chu_khong_sieu_cap.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: nói phá thử phủ chiều đỏ của E1–E4, nhưng chỉ có vài ca lẻ (r1)**
  Người dùng thấy gì: Bộ tự kiểm nói là đã thử phá mọi chiều nhưng thực tế mới thử vài ca, nên vài thông báo lỗi chưa được chứng minh là bắt được lỗi thật. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bằng chứng nghiệm thu yếu hơn lời nói, không làm hỏng việc đưa bản lên; bổ sung thêm ca phá sau là rẻ và không gấp.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: hai assert chỉ có chiều âm, không có ca đối chứng trong bài kiểm CI (r1)**
  Người dùng thấy gì: Bài kiểm tự động kiểm tra rằng tài khoản danh tính không còn quyền tạo đối tượng thừa, nhưng chưa tự chứng minh được rằng nó sẽ báo đỏ nếu quyền ấy thật sự còn. Nếu định dạng quyền đổi, bài kiểm có thể vẫn xanh dù quyền thừa quay lại. Người dùng cuối không thấy gì trực tiếp.
  Căn cứ: Hậu quả nhẹ và chỉ ảnh hưởng độ tin cậy của bài kiểm về sau, không làm mất hay lộ dữ liệu; phần đối chứng đã được chạy ở công cụ tự kiểm riêng, và bổ sung sau cũng rẻ, không gấp.
  file: `tests/db/chu-khong-sieu-cap.db.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
