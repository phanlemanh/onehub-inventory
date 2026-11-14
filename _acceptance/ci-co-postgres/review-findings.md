## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **History scan misses a git call split over several lines (Prettier's wrapped form), so a test that reads git history passes silently**
  Người dùng thấy gì: Nếu sau này có người viết một bài kiểm đọc lịch sử git theo kiểu xuống dòng, phép quét sẽ không báo, và lỗi chỉ lộ ra khi chạy trên CI với bản sao nông. Hiện chưa có bài nào như vậy.
  Căn cứ: Hậu quả nhẹ: chưa có bài nào đang vi phạm, lỗi nếu xảy ra chỉ làm một lượt CI đỏ chứ không mất hay lộ dữ liệu, và người viết thấy ngay để sửa; vá phép quét thì rẻ nhưng không gấp.
  file: `tests/ci-ban-sao-nong.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims to scan a class but tests only point cases): the matrix leaves out the common form where git runs from one quoted command string, and the scan misses it**
  Người dùng thấy gì: Phép quét chưa bắt được trường hợp git được chạy từ một chuỗi lệnh duy nhất, nên một bài kiểm đọc lịch sử theo cách đó vẫn có thể lọt qua và chỉ hỏng trên CI.
  Căn cứ: Hậu quả nhẹ với người dùng cuối: chưa có bài nào đang dùng kiểu này, lỗi chỉ làm CI đỏ và dễ thấy, tự sửa được bằng cách chạy lại sau khi chỉnh bài; sửa sau vẫn rẻ.
  file: `tests/ci-ban-sao-nong.test.ts`
  severity: high
  Đề xuất: known-limits

- **Shape 5 / Shape 4 (negative assertion with no positive check): the `rev-parse HEAD` control lets every ancestor of HEAD through, and nothing tests that boundary**
  Người dùng thấy gì: Phép quét cho qua cả các lệnh đọc commit cha của bản hiện tại, vốn không có trong bản sao nông, nên một bài như vậy sẽ lọt qua và chỉ hỏng trên CI.
  Căn cứ: Hậu quả nhẹ: không bài nào hiện đọc commit cha, lỗi nếu có chỉ làm CI đỏ chứ không ảnh hưởng dữ liệu hay người dùng, và dễ thấy để sửa.
  file: `tests/ci-ban-sao-nong.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
