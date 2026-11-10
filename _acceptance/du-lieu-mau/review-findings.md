# Review findings: du-lieu-mau (round 1)

## Trong hợp đồng

- Criteria/tests: AC-8 chưa có chiều đỏ cho lần chào mang mã sàn khác; E8 trỏ một hàm không có
  file: tests/sample-data.test.ts:411
  severity: low
  AC: AC-8
  source: invariants
  detail: AC-8 đòi mọi bản ghi thuộc sàn (lần chào, liên hệ, hai loại liên kết) mang cùng mã sàn mẫu. Bản sao `elsewhere` (dòng 411-414) chỉ đổi companyId của liên hệ, liên kết chủ và liên kết căn, không đổi của lần chào. Vì vậy nhánh `bản ghi khác sàn: lần chào` trong listings/sample.ts (checkListingLinks) chưa có bài kiểm nào làm nó đỏ, mà đây lại là phần kiểm cách ly sàn (SP-1). Ngoài ra _acceptance/du-lieu-mau/evals.yaml:65 (E8) và plan.md:34 gọi `checkSampleLinks`, trong khi mã chỉ có checkListingLinks và checkOwnerLinks. Cách sửa: thêm `nth(elsewhere.listings, k).companyId = other` cùng thông điệp kỳ vọng, và sửa tên hàm trong E8.

- Shape 5 (claims to sweep a class, tests only some cases): AC-8 never turns a listing from another company red
  file: tests/sample-data.test.ts:411
  severity: medium
  AC: AC-8
  source: measurement
  detail: The contract for AC-8 lists four kinds of company records: lần chào, liên hệ and the two kinds of link. It says a copy where any one of them carries another company's id is named. The checker has a message for all four: checkListingLinks emits `bản ghi khác sàn: lần chào ${l.id}` (src/modules/listings/sample.ts), and checkOwnerLinks covers liên hệ and liên kết chủ. The red copy `elsewhere` only changes contacts[3], owners[4] and listingUnits[5]. Its `toEqual` expects only those three messages. No listing ever gets another company's id, so if the listing branch broke or vanished, the test would still pass. The matrix has 3 of 4 elements. On top of that, the one copy is broken in three places at once, against the file header's rule of 'broken in exactly one place'.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Dữ liệu cá nhân: số điện thoại dạng thật trong bài kiểm và tài liệu (.claude/rules/personal-data.md, AGENTS «No real personal data»)**
  Người dùng thấy gì: Trong bài kiểm và tài liệu có một số điện thoại trông như số thật, và kho đang công khai. Nếu số đó thuộc về một người thật thì người đó bị lộ số trong lịch sử kho.
  Căn cứ: Hậu quả có thể là lộ số của một người thật và đã nằm trong lịch sử công khai nên khó rút lại, nhưng khả năng trùng người thật thấp và sửa sau rẻ.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain: bản ghi liên kết (OwnerLink, ListingUnit) có trong mã nhưng chưa có trong ontology**
  Người dùng thấy gì: Hai loại liên kết giữa chủ nhà với lần chào và giữa lần chào với căn chưa được khai trong mô hình nghiệp vụ. Khi làm cơ sở dữ liệu thật, hình dạng và việc cách ly theo sàn của chúng phải được định nghĩa lại từ đầu.
  Căn cứ: Không ảnh hưởng người dùng hôm nay vì chưa có cơ sở dữ liệu, nhưng cần khai trước khi lưu dữ liệu thật và đụng tới mô hình nghiệp vụ nên cần chủ kho soi, hợp làm một việc riêng.
  file: `src/modules/contacts/sample.ts`
  severity: medium
  Đề xuất: new-contract

- **Domain: luật nhãn MAU nằm ở hai chỗ (each business rule lives in one place)**
  Người dùng thấy gì: Quy tắc gắn nhãn MAU được viết lặp ở hai nơi. Nếu sau này sửa một nơi mà quên nơi kia thì nhãn có thể lệch nhau, nhưng bài kiểm hiện đã bắt trường hợp này.
  Căn cứ: Chỉ là chuyện bảo trì, người dùng không thấy gì, đã có bài kiểm canh lệch và sửa sau rẻ.
  file: `src/modules/contacts/sample.ts`
  severity: low
  Đề xuất: known-limits

- **Domain/RESO: `phones` gán cho ba tên RESO đơn trị**
  Người dùng thấy gì: Trường số điện thoại của liên hệ gộp nhiều số nhưng lại mượn tên chuẩn ngành vốn chỉ dành cho từng số có vai riêng. Việc này dễ gây hiểu sai khi đối chiếu với chuẩn hoặc trao đổi dữ liệu sau này.
  Căn cứ: Chỉ gây nhầm khi đối chiếu chuẩn, không làm mất dữ liệu, và sửa chỉ là chỉnh một dòng mô tả khi chủ kho soi.
  file: `ontology/entities/Contact.yaml`
  severity: low
  Đề xuất: known-limits

- **The linking-case check counts links, not distinct partners, so one duplicated link passes two cases**
  Người dùng thấy gì: Nếu sau này một liên kết chủ nhà bị nhân đôi nhầm, bộ kiểm có thể báo đủ ca nối dù thực tế chưa đủ. Dữ liệu mẫu hiện nay không bị ảnh hưởng.
  Căn cứ: Chưa gây sai gì với dữ liệu hiện có, chỉ làm lưới kiểm lỏng hơn khi dữ liệu mẫu bị sửa, và dễ sửa sau.
  file: `src/modules/contacts/sample.ts`
  severity: low
  Đề xuất: known-limits

- **E8 expects a function checkSampleLinks that does not exist in the code**
  Người dùng thấy gì: Tài liệu đánh giá nhắc tên một bước kiểm không tồn tại, nên người đối chiếu có thể không tìm thấy bằng chứng đúng chữ. Sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ là sai chữ trong tài liệu, không ảnh hưởng người dùng hay dữ liệu, sửa một dòng bất cứ lúc nào.
  file: `_acceptance/du-lieu-mau/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Shape 5 (claims to sweep a class, tests only some cases): AC-3 'red: each broken rule is named' is missing rules and half of each pair**
  Người dùng thấy gì: Một số lỗi của lần chào, như thiếu ngày chốt hay lần chào không có căn, chưa có bài kiểm chứng minh bộ kiểm sẽ bắt. Nếu bước kiểm đó bị lỡ xoá thì không ai biết.
  Căn cứ: Dữ liệu mẫu hiện đúng và người dùng chưa thấy ảnh hưởng, rủi ro chỉ xuất hiện khi sửa bộ kiểm sau này, bổ sung bài kiểm khá rẻ.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 4 (negative assertion alone): 'keeps numbers off other records' in AC-7 has no positive control**
  Người dùng thấy gì: Bài kiểm nói không bản ghi nào mang số điện thoại chưa có ca đối chứng cho thấy nó sẽ bắt khi có số lọt vào. Hiện dữ liệu vẫn đúng.
  Căn cứ: Dữ liệu hiện đúng nên người dùng không bị ảnh hưởng, chỉ là lưới kiểm chưa được chứng minh, và thêm ca đối chứng sau rất rẻ.
  file: `tests/sample-data.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
