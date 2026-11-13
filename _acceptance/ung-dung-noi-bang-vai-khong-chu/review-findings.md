# Review findings: ung-dung-noi-bang-vai-khong-chu (round 2)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Decision number 0025 is used twice: the new decision page reuses a number main already took (r1)**
  Người dùng thấy gì: Hai trang quyết định trong sổ tay dự án mang cùng một số, nên khi ai đó nhắc chỉ bằng số thì có thể mở nhầm trang. Người dùng cuối không thấy gì, chỉ người đọc tài liệu có thể bị nhầm.
  Căn cứ: Chỉ gây nhầm khi tra cứu tài liệu, không mất hay lộ dữ liệu, và đổi số trang sau này vẫn làm được bất cứ lúc nào.
  file: `wiki/decisions/0025-ung-dung-noi-bang-vai-dang-nhap.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả LỚP chuỗi nối nhưng chỉ có bốn mẫu một dòng (r1)**
  Người dùng thấy gì: Bài kiểm tự động có thể bỏ sót một cách viết lạ khi ai đó đưa kết nối của vai chủ vào bài kiểm thử. Dữ liệu thật của sàn vẫn được bảo vệ vì cửa vào dữ liệu từ chối vai chủ khi chạy.
  Căn cứ: Chỉ là lưới an toàn phụ cho bài kiểm thử, chưa ảnh hưởng dữ liệu thật vì lớp chặn chính vẫn hoạt động; ghi lại là đủ và mở rộng bài quét sau không tốn kém.
  file: `tests/vai-dang-nhap-nguon.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6: mặc định DB_LANE="c" trỏ vào dãy của tác giả, lệch với helpers đang dựng cơ sở (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu người phát triển chạy riêng một bài kiểm mà không chọn dãy cơ sở dữ liệu, bài có thể đo nhầm cơ sở khác và cho kết quả xanh hoặc đỏ sai. Đường nghiệm thu chính thức không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng người chạy tay một bài lẻ, không chạm dữ liệu người dùng, và người chạy chỉ cần đặt dãy là hết.
  file: `tests/db/cach-ly.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1: 'không tham số nào tắt bước kiểm' đo khai báo (function.length) thay vì hành vi (r1)**
  Người dùng thấy gì: Bài kiểm có thể không phát hiện nếu sau này ai đó thêm một tuỳ chọn cho phép bỏ qua bước kiểm vai nối. Hiện chưa có tuỳ chọn nào như vậy nên người dùng chưa bị ảnh hưởng.
  Căn cứ: Rủi ro chỉ xuất hiện nếu có thay đổi tương lai và bài kiểm hành vi khác vẫn chặn vai chủ; chưa mất hay lộ dữ liệu nào.
  file: `src/modules/identity/with-company.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
