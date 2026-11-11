# Review findings: thanh-ben-nhieu-vai (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5 (tuyên quét LỚP nhưng ma trận không ràng vào lớp): tập vai của ma trận 16 tổ hợp là danh sách gõ tay, không buộc phải bằng đúng kiểu Role sinh từ ontology**
  Người dùng thấy gì: Hiện thanh bên vẫn hiện đúng mục cho mọi tổ hợp của bốn vai. Nếu sau này thêm vai thứ năm, bài kiểm tra sẽ không tự đòi phủ thêm các tổ hợp mới, nên một lỗi ở vai mới có thể lọt qua mà không ai báo.
  Căn cứ: Chưa ảnh hưởng người dùng nào vì hôm nay chỉ có bốn vai và đều được kiểm; rủi ro chỉ xuất hiện khi thêm vai mới, lúc đó có thể bổ sung phép kiểm với chi phí thấp.
  file: `tests/nav-roles.test.tsx`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
