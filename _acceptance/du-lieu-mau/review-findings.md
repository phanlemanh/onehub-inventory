# Review findings: du-lieu-mau (round 2)

## Trong hợp đồng

(không có finding)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Personal data (check 5) / AGENTS.md 'No real personal data in the repo' + .claude/rules/personal-data.md**
  Người dùng thấy gì: Một dãy số trông giống số điện thoại di động thật nằm trong bài kiểm và tài liệu của kho. Nếu trùng số của người thật thì số đó lộ ra ở kho công khai.
  Căn cứ: Hậu quả nhẹ vì đây chỉ là chuỗi dùng để thử phá, rất khó trùng người thật, và sửa sau rẻ nên ghi lại rồi xử lý ở lượt dọn dữ liệu cá nhân.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain (check 3): new record types not in ontology / hand-written domain types**
  Người dùng thấy gì: Hai loại bản ghi nối chủ nhà với lần chào và căn với lần chào chưa được khai trong mô hình nghiệp vụ của kho. Người duyệt mô hình sẽ không thấy chúng trong phần chủ kho cần soi.
  Căn cứ: Người dùng chưa thấy gì sai, nhưng khai vào mô hình nghiệp vụ là thay đổi cần chủ kho duyệt riêng nên nên mở việc riêng thay vì nhét vào vòng này.
  file: `src/modules/contacts/sample.ts`
  severity: medium
  Đề xuất: new-contract

- **Domain (check 3): one business rule in one place — sample id scheme duplicated**
  Người dùng thấy gì: Cách đánh mã cho dữ liệu mẫu được viết ở hai nơi, nên sau này sửa một nơi mà quên nơi kia có thể làm hai loại bản ghi trùng mã.
  Căn cứ: Hiện chưa trùng và có bài kiểm giữ tiền tố, dữ liệu mẫu chỉ để dựng màn nên nhẹ; ghi lại để xử lý khi có thêm loại bản ghi mẫu.
  file: `src/modules/contacts/sample.ts`
  severity: low
  Đề xuất: known-limits

- **Product language: hard-coded labels in src/**
  Người dùng thấy gì: Vài chữ như tầng, trục và một số thông báo lỗi của dữ liệu mẫu được viết cứng, nên nếu đổi cách gọi thì phải sửa tay thay vì đổi ở một chỗ.
  Căn cứ: Những chữ này chưa hiện cho khách và chỉ nằm trong dữ liệu mẫu, nên hậu quả nhẹ; thêm khái niệm nhãn sẽ làm khi các màn thật cần dùng.
  file: `src/modules/catalog/sample.ts`
  severity: low
  Đề xuất: known-limits

- **Intent / data coherence: Ocean Park 1 code example points to a unit that does not exist**
  Người dùng thấy gì: Mã ví dụ của Ocean Park 1 đọc ra đúng toà, tầng, trục nhưng không có căn nào mang mã đó, nên nếu ai gõ thử mã này để tìm căn sẽ không thấy gì.
  Căn cứ: Chỉ ảnh hưởng ví dụ minh hoạ trong dữ liệu mẫu, không mất dữ liệu và không sai với khách; đổi sang mã có thật là việc rẻ làm lúc dựng màn gõ mã.
  file: `src/modules/catalog/sample.ts`
  severity: low
  Đề xuất: known-limits

- **Dữ liệu cá nhân: số điện thoại dạng thật trong bài kiểm và tài liệu (.claude/rules/personal-data.md, AGENTS «No real personal data») (r1 · tệp đã đổi)**
  Người dùng thấy gì: Trong bài kiểm và tài liệu có một số điện thoại trông như số thật, và kho đang công khai. Nếu số đó thuộc về một người thật thì người đó bị lộ số trong lịch sử kho.
  Căn cứ: Hậu quả có thể là lộ số của một người thật và đã nằm trong lịch sử công khai nên khó rút lại, nhưng khả năng trùng người thật thấp và sửa sau rẻ.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain: bản ghi liên kết (OwnerLink, ListingUnit) có trong mã nhưng chưa có trong ontology (r1)**
  Người dùng thấy gì: Hai loại liên kết giữa chủ nhà với lần chào và giữa lần chào với căn chưa được khai trong mô hình nghiệp vụ. Khi làm cơ sở dữ liệu thật, hình dạng và việc cách ly theo sàn của chúng phải được định nghĩa lại từ đầu.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì chưa có cơ sở dữ liệu, nhưng cần khai trước khi lưu dữ liệu thật và đụng tới mô hình nghiệp vụ nên cần chủ kho soi, hợp làm một việc riêng.
  file: `src/modules/contacts/sample.ts`
  severity: medium
  Đề xuất: new-contract

- **Domain: luật nhãn MAU nằm ở hai chỗ (each business rule lives in one place) (r1)**
  Người dùng thấy gì: Quy tắc gắn nhãn MAU được viết lặp ở hai nơi. Nếu sau này sửa một nơi mà quên nơi kia thì nhãn có thể lệch nhau, nhưng bài kiểm hiện đã bắt trường hợp này.
  Căn cứ: Chỉ là chuyện bảo trì, người dùng không thấy gì, đã có bài kiểm canh lệch và sửa sau rẻ.
  file: `src/modules/contacts/sample.ts`
  severity: low
  Đề xuất: known-limits

- **Domain/RESO: `phones` gán cho ba tên RESO đơn trị (r1)**
  Người dùng thấy gì: Trường số điện thoại của liên hệ gộp nhiều số nhưng lại mượn tên chuẩn ngành vốn chỉ dành cho từng số có vai riêng. Việc này dễ gây hiểu sai khi đối chiếu với chuẩn hoặc trao đổi dữ liệu sau này.
  Căn cứ: Chỉ gây nhầm khi đối chiếu chuẩn, không làm mất dữ liệu, và sửa chỉ là chỉnh một dòng mô tả khi chủ kho soi.
  file: `ontology/entities/Contact.yaml`
  severity: low
  Đề xuất: known-limits

- **The linking-case check counts links, not distinct partners, so one duplicated link passes two cases (r1)**
  Người dùng thấy gì: Nếu sau này một liên kết chủ nhà bị nhân đôi nhầm, bộ kiểm có thể báo đủ ca nối dù thực tế chưa đủ. Dữ liệu mẫu hiện nay không bị ảnh hưởng.
  Căn cứ: Chưa gây sai gì với dữ liệu hiện có, chỉ làm lưới kiểm lỏng hơn khi dữ liệu mẫu bị sửa, và dễ sửa sau.
  file: `src/modules/contacts/sample.ts`
  severity: low
  Đề xuất: known-limits

- **E8 expects a function checkSampleLinks that does not exist in the code (r1)**
  Người dùng thấy gì: Tài liệu đánh giá nhắc tên một bước kiểm không tồn tại, nên người đối chiếu có thể không tìm thấy bằng chứng đúng chữ. Sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là sai chữ trong tài liệu, không ảnh hưởng người dùng hay dữ liệu, sửa một dòng bất cứ lúc nào.
  file: `_acceptance/du-lieu-mau/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims to sweep a class, tests only some cases): AC-3 'red: each broken rule is named' is missing rules and half of each pair (r1 · tệp đã đổi)**
  Người dùng thấy gì: Một số lỗi của lần chào, như thiếu ngày chốt hay lần chào không có căn, chưa có bài kiểm chứng minh bộ kiểm sẽ bắt. Nếu bước kiểm đó bị lỡ xoá thì không ai biết.
  Căn cứ: Dữ liệu mẫu hiện đúng và người dùng chưa thấy ảnh hưởng, rủi ro chỉ xuất hiện khi sửa bộ kiểm sau này, bổ sung bài kiểm khá rẻ.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative assertion alone): 'keeps numbers off other records' in AC-7 has no positive control (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm nói không bản ghi nào mang số điện thoại chưa có ca đối chứng cho thấy nó sẽ bắt khi có số lọt vào. Hiện dữ liệu vẫn đúng.
  Căn cứ: Dữ liệu hiện đúng nên người dùng không bị ảnh hưởng, chỉ là lưới kiểm chưa được chứng minh, và thêm ca đối chứng sau rất rẻ.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
