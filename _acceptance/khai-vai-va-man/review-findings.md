# Review findings: khai-vai-va-man (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Domain: each business rule lives in one place (permissions are only in the 9a table / decision 0016)**
  Người dùng thấy gì: Phần mô tả vai nói trưởng nhóm thấy gì và quản trị sàn không thấy gì. Khi bảng quyền thật được chốt, câu chữ này có thể lệch với quy định và gây hiểu nhầm cho người làm kho.
  Căn cứ: Hậu quả nhẹ: chỉ là câu mô tả, không làm mất dữ liệu hay đổi hành vi, và sửa lại rẻ khi bảng quyền được chốt.
  file: `ontology/roles.yaml`
  severity: low
  Đề xuất: known-limits

- **Domain: own concepts and business terms are recorded in ontology/glossary.md**
  Người dùng thấy gì: Bốn vai mới chưa có mục trong bảng thuật ngữ, nên người đọc tài liệu chưa tra được tên hiển thị và chưa biết đây là khái niệm riêng của mình.
  Căn cứ: Hậu quả nhẹ: không ảnh hưởng người dùng cuối, chủ kho đã chủ động hoãn sang hàng sau, bổ sung lúc đó không tốn thêm.
  file: `ontology/roles.yaml`
  severity: low
  Đề xuất: known-limits

- **Language: identifiers in English**
  Người dùng thấy gì: Số đo in ra dạng máy đọc dùng khoá tiếng Việt, trái quy ước đặt tên tiếng Anh của kho. Người dùng không thấy khác biệt, chỉ người viết code về sau gặp bất tiện.
  Căn cứ: Hậu quả nhẹ: không mất dữ liệu và người dùng không thấy, nhưng đổi tên sau khi có công cụ khác đọc các khoá này sẽ tốn hơn.
  file: `tools/coverage_matrix/check.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ): hai ca của bảng 'block errors' không ghim lỗi vào đúng màn và đúng vai**
  Người dùng thấy gì: Hai ca thử báo lỗi chỉ kiểm có lỗi, chưa kiểm đúng màn và đúng vai. Nếu máy kiểm sau này gắn lỗi nhầm màn, bộ thử vẫn xanh và người làm kho có thể bị chỉ sai chỗ.
  Căn cứ: Hậu quả nhẹ: máy kiểm hiện in đúng màn và vai, chỉ là bộ thử chưa canh được chuyện lệch về sau, và nguy cơ này đã được ghi nhận từ vòng 1.
  file: `tests/coverage-matrix.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
