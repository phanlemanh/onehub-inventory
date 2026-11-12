# Review findings: cach-ly-dang-xem-chi-ghi (round 1)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records/Intent: the stated cause of the hole does not match what was measured (SP-1 evidence)**
  Người dùng thấy gì: Hồ sơ nói sai điều kiện gây ra lỗ hổng: lỗ chỉ có khi chủ dạng xem là vai quản trị cao nhất. Người dùng không bị ảnh hưởng, bộ kiểm vẫn bắt đúng mọi trường hợp.
  Căn cứ: Chỉ là chú thích sai trong tài liệu, không làm lộ hay mất dữ liệu của sàn nào, và sửa lại câu chữ sau này rất rẻ.
  file: `_acceptance/cach-ly-dang-xem-chi-ghi/design.md`
  severity: low
  Đề xuất: known-limits

- **Shape 5: the comment claims three grant paths, but break files test only two**
  Người dùng thấy gì: Bộ kiểm nói bắt được quyền cấp qua vai mẹ nhưng chưa có ca phá thử chứng minh điều đó. Nhiều khả năng vẫn đúng, chỉ là chưa có bằng chứng.
  Căn cứ: Hợp đồng đã nêu rõ khoảng trống này từ đầu, cơ chế Postgres nhiều khả năng vẫn bắt đúng, và chưa thấy dữ liệu nào bị lộ; thêm ca phá thử sau cũng không đắt.
  file: `db/tests/cach-ly.sql`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
