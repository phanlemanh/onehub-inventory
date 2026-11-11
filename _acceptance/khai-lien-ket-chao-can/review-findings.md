# Review findings: khai-lien-ket-chao-can (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Domain: one business rule in one place / same-company rule only half enforced**
  Người dùng thấy gì: Kiểm tra dữ liệu mẫu chung hiện chưa tự so sánh sàn của liên kết chủ với liên hệ. Dữ liệu mẫu hiện đúng, nên người dùng chưa gặp gì.
  Căn cứ: Nhẹ: chỉ là khoảng hở trong lưới kiểm tra, dữ liệu hiện tại không sai và không có người dùng thật bị ảnh hưởng; thêm lưới sau này rẻ.
  file: `src/modules/contacts/sample.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain: rule `one-unit-per-listing` is split across two functions**
  Người dùng thấy gì: Luật mỗi lần chào có đúng một căn được kiểm ở hai chỗ khác nhau trong mã. Người dùng không thấy khác biệt nào.
  Căn cứ: Rất nhẹ: chỉ là cách tổ chức mã, cả hai chiều vẫn được kiểm, không mất hay lộ dữ liệu.
  file: `src/modules/listings/sample.ts`
  severity: low
  Đề xuất: wont-fix

- **Domain: rule `owner-role` has no implemented_in**
  Người dùng thấy gì: Mô tả luật vai chủ nhà trong mô hình chưa chỉ ra luật này được thực hiện ở đâu. Người dùng không bị ảnh hưởng.
  Căn cứ: Rất nhẹ: chỉ thiếu một dòng chú dẫn cho người làm tiếp, sửa rất rẻ bất cứ lúc nào.
  file: `ontology/entities/ListingOwner.yaml`
  severity: low
  Đề xuất: known-limits

- **Tier / Records: high-tier ontology change needs owner review**
  Người dùng thấy gì: Thay đổi mô hình nghiệp vụ này cần chủ kho soi khi gộp. Chưa có ảnh hưởng gì tới người dùng.
  Căn cứ: Nhẹ: chỉ là nhắc việc quy trình khi mở PR, không phải lỗi, và làm bù lúc nào cũng được.
  file: `ontology/relations.yaml`
  severity: low
  Đề xuất: known-limits

- **checkOwnerLinks skips the contact-company check whenever the optional listing-company map is not passed**
  Người dùng thấy gì: Một phép so sánh sàn giữa liên kết chủ và liên hệ có thể bị bỏ qua nếu người gọi sau này quên truyền thông tin cần thiết. Hiện dữ liệu vẫn đúng.
  Căn cứ: Nhẹ: các kiểm tra khác đã chặn trường hợp sai, chưa có dữ liệu thật và sửa sau rẻ.
  file: `src/modules/contacts/sample.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): nhánh 'vai sai' của ListingOwner.contactType và dòng kiểu sinh ListingOwnerContactType không có chiều đỏ**
  Người dùng thấy gì: Bộ kiểm chưa có ca thử cố ý sai vai chủ nhà, nên nếu phần báo lỗi vai hỏng thì chưa chắc được phát hiện. Người dùng chưa gặp ảnh hưởng.
  Căn cứ: Vừa phải nhưng chưa có người dùng: chỉ làm lưới kiểm yếu đi, không mất dữ liệu, thêm ca thử sau rẻ.
  file: `tests/link-types.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): nhánh 'mất quan hệ cũ' của AC-2 không có chiều đỏ**
  Người dùng thấy gì: Bộ kiểm chưa có ca thử xoá quan hệ cũ để chứng minh việc mất quan hệ sẽ bị báo. Người dùng không thấy khác biệt.
  Căn cứ: Vừa phải nhưng chưa có người dùng: chỉ làm lưới yếu đi, không mất hay lộ dữ liệu, thêm ca thử sau rẻ.
  file: `tests/link-types.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): kiểm thuật ngữ trong glossary và kiểm 'không phụ thuộc mới' của AC-6 không có chiều đỏ**
  Người dùng thấy gì: Bộ kiểm chưa có ca thử bỏ dòng thuật ngữ hay thêm phụ thuộc mới giữa các phần. Người dùng không bị ảnh hưởng.
  Căn cứ: Nhẹ: chỉ làm lưới kiểm yếu hơn, các kiểm tra khác của kho vẫn bắt phần lớn lỗi, thêm ca thử sau rẻ.
  file: `tests/link-types.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
