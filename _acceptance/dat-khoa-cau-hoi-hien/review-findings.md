# Review findings: dat-khoa-cau-hoi-hien (round 2)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Secrets: harness writes the whole process environment to disk**
  Người dùng thấy gì: Khi chạy phép đo, các bí mật có sẵn trong máy người chấm (như khoá dịch vụ) có thể bị chép ra tệp thường trên máy. Tệp nằm ngoài phần được đưa lên kho nên không bị lộ ra ngoài, nhưng vẫn là bí mật nằm trần trên đĩa.
  Căn cứ: Hậu quả nhẹ vì tệp chỉ ở máy người chấm và không bao giờ được đưa lên kho, nhưng nó trái nguyên tắc máy không giữ giá trị bí mật; sửa rẻ nên đáng làm thành việc riêng.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs`
  severity: medium
  Đề xuất: new-contract

- **Design: terminalAsk injection only half applied**
  Người dùng thấy gì: Người chạy lệnh bình thường không bị ảnh hưởng, lệnh vẫn hỏi và nhận đủ câu trả lời như trước. Chỉ khi sau này có người dùng hàm hỏi này với một nguồn nhập khác thì nó mới đọc nhầm nguồn.
  Căn cứ: Không ảnh hưởng người dùng hiện nay vì lệnh chạy đúng như trước, không mất hay lộ dữ liệu; chỉ là bẫy tiềm ẩn cho người viết mã sau, ghi lại là đủ.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: echo check weak in the resize case**
  Người dùng thấy gì: Trong ca đổi cỡ màn hình giữa lúc dán, phép đo có thể bỏ sót việc chuỗi kết nối bị hiện lại trên màn. Ca terminal thật không đổi cỡ vẫn kiểm đủ điều này.
  Căn cứ: Rủi ro thấp vì ca còn lại đã phủ đúng điều cần chứng, và lệnh không có lý do hiện lại giá trị dán; có thể ghi giới hạn rồi siết sau.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs`
  severity: low
  Đề xuất: known-limits

- **Intent and scope: UI design artifacts in a CLI-only record**
  Người dùng thấy gì: Hồ sơ của một thay đổi chỉ chạy trên dòng lệnh lại mang hai tệp về giao diện không liên quan, và một đường dẫn tạm của máy người chấm. Người dùng sản phẩm không thấy gì.
  Căn cứ: Chỉ là tệp thừa trong hồ sơ, không ảnh hưởng người dùng hay dữ liệu; sửa không đáng công.
  file: `_acceptance/dat-khoa-cau-hoi-hien/design-floor.json`
  severity: low
  Đề xuất: wont-fix

- **Tier: high, needs a code owner**
  Người dùng thấy gì: Thay đổi này thuộc hạng cao nên phải có chủ mã duyệt gộp, đúng như hợp đồng đã ghi. Không có gì hỏng với người dùng.
  Căn cứ: Đây là điều đã biết và đúng quy trình, không phải lỗi, nên không cần mở việc nào.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: wont-fix

- **terminalAsk ignores the injected input/output when the input is not a terminal**
  Người dùng thấy gì: Lệnh chạy bình thường vẫn đúng. Chỉ khi ai đó sau này truyền một nguồn nhập khác vào, lệnh sẽ bỏ qua nó và đọc đầu vào thật của máy.
  Căn cứ: Không gây mất hay lộ dữ liệu cho người dùng hôm nay, người dùng chạy lại được; chỉ là bẫy cho mã viết sau, ghi nhận là đủ.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Self-test pha-khong-doi-co cannot show that the redraw count check works**
  Người dùng thấy gì: Một ca tự kiểm của phép đo báo đỏ vì cách dựng chứ không chứng minh được việc đếm lần vẽ lại hoạt động. Lệnh dán khoá không bị ảnh hưởng.
  Căn cứ: Chỉ làm bằng chứng của phép đo yếu hơn một chút, không đụng người dùng; ghi giới hạn rồi siết khi có dịp.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
