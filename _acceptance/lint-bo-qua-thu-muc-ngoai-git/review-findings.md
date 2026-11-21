# Review findings: lint-bo-qua-thu-muc-ngoai-git (round 3)

## Trong hợp đồng

- **Hình dạng 4 (âm-tính-một-mình): chế độ make check của kiem-tron không có ca đỏ nào, bộ dò «không dòng nào nêu tệp cấy» chưa từng được chứng là bắt được**
  AC: AC-6
  file: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs:174`
  severity: medium
  source: measurement
  detail: Nhánh mặc định (dòng 174-199) chạy `make check` rồi lọc `output.split("\n").filter((l) => l.includes(tag))` (dòng 180-183). Nhánh chỉ xanh khi danh sách này rỗng và lệnh thành công. Trong two-way.mjs không có ca nào gọi `kiem-tron.mjs` ở chế độ này, xanh hay đỏ cũng không. Ba ca E7 chỉ gọi `--liet-ke`, `--tsc` và `--cay-lanh --tsc`, và E7 chính cũng chỉ chạy chiều xanh. Như vậy chưa lượt nào cho thấy `make check` có nêu đường dẫn chứa tag khi tệp cấy không được bỏ qua, nên lời hứa phụ của AC-7 «không dòng nào nêu các tệp ấy» là một assertion âm tính không có đối chứng dương trên đúng lệnh và đúng phép lọc ấy. Các ca đỏ hiện có đi qua bộ dò khác: `vitest list`, `tsc --listFilesOnly`, ESLint chạy trong tiến trình. Lỗi này vẫn còn từ lượt phản biện trước (review-findings.md, mục «Ngoài hợp đồng»). AC-6 đòi mỗi phép đo chạy trên bản phá phải đỏ; chế độ make check của phép đo này chưa có ca đỏ nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Mục log wiki mới viết bằng tiếng Anh, trong khi quy ước kho yêu cầu nội dung wiki bằng tiếng Việt**
  Người dùng thấy gì: Một dòng nhật ký thay đổi được viết bằng tiếng Anh thay vì tiếng Việt. Không ảnh hưởng gì đến người dùng hay cách sản phẩm chạy.
  Căn cứ: Chỉ là chuyện câu chữ trong nhật ký nội bộ, đã có vài mục cũ cũng lệch như vậy, nên sửa hay không đều không đổi hậu quả.
  file: `wiki/log/2026-11-21-03-lint-prettier-and-vitest-skip-acceptance.md`
  severity: low
  Đề xuất: wont-fix

- **Cleanup-on-stop promise does not hold while a measure is blocked in spawnSync**
  Người dùng thấy gì: Nếu người chạy bị dừng giữa chừng ở một số bước, vài thư mục tạm dùng để đo có thể nằm lại trên máy. Chúng không làm bộ kiểm đỏ và sẽ được dọn ở lượt chạy sau.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu, tự được dọn trong khoảng một giờ ở lượt sau, còn sửa thì phải đổi cách chạy lệnh khá nhiều.
  file: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/kiem-tron.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm-tính-một-mình): chiều đỏ của E4 dùng bộ dò khác chiều xanh, và chỉ ghim tiền tố thông điệp**
  Người dùng thấy gì: Phép đo bằng chứng rằng lỗi được nhận ra hơi lỏng: nó xác nhận có báo lỗi nhưng chưa chỉ rõ tệp nào bị nêu. Việc bỏ qua thư mục vẫn hoạt động đúng.
  Căn cứ: Hậu quả nhẹ vì phép đo vẫn đỏ đúng lúc cần, chỉ thiếu độ chi tiết, và có thể siết lại sau mà không ảnh hưởng người dùng.
  file: `_acceptance/lint-bo-qua-thu-muc-ngoai-git/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
