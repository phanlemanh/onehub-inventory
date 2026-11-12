# Review findings: bo-kiem-chung-khi-dang-nhap (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Every `make e2e` run now leaves a full Next build folder under node_modules/.cache/onehub-e2e/<pid>, and nothing ever removes it**
  Người dùng thấy gì: Mỗi lần chạy kiểm trình duyệt để lại một thư mục tạm lớn trên máy người làm, nên ổ đĩa đầy dần. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ tốn chỗ ổ đĩa trên máy dev, không mất hay lộ dữ liệu, người làm tự xoá thư mục tạm được bất cứ lúc nào; sửa thì rẻ nhưng không cấp bách.
  file: `playwright.config.ts`
  severity: medium
  Đề xuất: known-limits

- **The wait-copy scanner only catches a hand-written banner wait written on one line, and misses the exact pattern this change replaced**
  Người dùng thấy gì: Nếu sau này ai đó lại viết tay đoạn chờ băng báo theo kiểu nhiều dòng, công cụ canh sẽ không báo, và bài kiểm có thể chập chờn trên máy chậm mà không ai hay.
  Căn cứ: Hiện mã đã sạch nên chưa gây hại gì ngay, nhưng lưới an toàn có lỗ hổng; việc làm chặt bộ quét là một việc riêng vừa phải, không nên nhét vào vòng này.
  file: `tools/e2e_templates/cho-scan.ts`
  severity: medium
  Đề xuất: new-contract

- **The shared waits throw away the real error and rethrow a fixed message**
  Người dùng thấy gì: Khi bài kiểm hỏng vì lý do khác như trang sập, báo cáo vẫn ghi là ngăn không mở hoặc băng không hiện, nên người làm khó tìm đúng nguyên nhân.
  Căn cứ: Chỉ làm chậm việc tìm lỗi của người làm, không ảnh hưởng người dùng sản phẩm hay dữ liệu; chạy lại bài kiểm vẫn thấy lỗi nên chấp nhận được tạm thời.
  file: `tools/e2e_templates/settle.ts`
  severity: low
  Đề xuất: known-limits

- **Each browser run leaves its own build folder in node_modules/.cache, and nothing removes it**
  Người dùng thấy gì: Mỗi lượt kiểm trình duyệt hay liệt kê bài đều để lại thư mục tạm trên máy người làm, nên ổ đĩa đầy dần. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Chỉ tốn ổ đĩa trên máy dev, không mất dữ liệu và xoá tay được; cùng gốc với lỗi tương tự nên ghi một lần là đủ.
  file: `playwright.config.ts`
  severity: low
  Đề xuất: known-limits

- **Hinh dang 5 (tuyen quet LOP nhung chi co diem-case): bo quet 'khong ban chep ham cho' chi bat dang cho bang viet tren mot dong**
  Người dùng thấy gì: Công cụ canh việc chờ viết tay chỉ nhận ra một kiểu viết, nên bản chép tay viết theo kiểu phổ biến hơn vẫn lọt qua và có thể làm bài kiểm chập chờn trở lại.
  Căn cứ: Chưa gây hại ngay vì mã hiện tại đã sạch, nhưng lưới canh có lỗ hổng lớn; sửa cần một việc riêng có ca thử đủ dạng nên đáng làm thành hợp đồng mới.
  file: `tools/e2e_templates/cho-scan.ts`
  severity: high
  Đề xuất: new-contract

- **Hinh dang 2 (fixture viet tay dung khuon ben doc): chieu do cua bai the @cho cat dong khoi danh sach thay vi go the that**
  Người dùng thấy gì: Bài thử chứng minh việc gỡ thẻ chờ chỉ kiểm trên dữ liệu viết tay, nên nếu cách công cụ thật nhận thẻ khác đi thì bài thử vẫn xanh dù đã sai.
  Căn cứ: Chỉ làm giảm độ tin của một bài thử nội bộ, không ảnh hưởng người dùng sản phẩm hay dữ liệu; rủi ro thấp nên ghi lại là đủ.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

(không có)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
