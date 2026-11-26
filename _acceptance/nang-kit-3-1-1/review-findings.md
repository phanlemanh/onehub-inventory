# Review findings: nang-kit-3-1-1 (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 5, quét LỚP mà không có ma trận viết trước: tập executor của kit ở AC-5 do bộ phân tích tự tìm ra, không đối chiếu với danh sách bốn executor đã ghim**
  Người dùng thấy gì: Phép kiểm tra các lệnh phụ trợ của bộ công cụ có thể bỏ sót một lệnh viết theo kiểu lạ mà vẫn báo đạt. Việc nâng phiên bản vẫn đúng, chỉ là lưới an toàn này thưa hơn dự kiến.
  Căn cứ: Hậu quả nhẹ vì chỉ làm lưới kiểm tra thưa đi chứ không làm hỏng chức năng nào cho người dùng, và người dùng không gặp lỗi trực tiếp. Bốn lệnh hiện tại đều có thật nên chưa có gì sai, và thêm danh sách đối chiếu sau này rẻ.
  file: `_acceptance/nang-kit-3-1-1/rang/kit-diff.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4, đối chứng dương suy biến: E6 (a)/(c) chỉ so một lượt chạy với chính nó, không chạy phép đo thật old-vs-new ở phía vật lành**
  Người dùng thấy gì: Một phép so sánh giữa hai phiên bản bộ công cụ được thử bằng cách so kết quả với chính nó nên gần như luôn đạt. Điều này không gây lỗi cho người dùng, nhưng làm bằng chứng 'chạy được' của phép so sánh đó kém thuyết phục.
  Căn cứ: Hậu quả nhẹ vì chỉ ảnh hưởng độ tin cậy của một bằng chứng kiểm thử chứ không ảnh hưởng sản phẩm. Phía phát hiện lỗi vẫn hoạt động nên rủi ro bỏ sót thấp.
  file: `_acceptance/nang-kit-3-1-1/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 6, gốc cố định: settings.measure đọc bản merge-base từ repoRoot() và bỏ qua tham số root**
  Người dùng thấy gì: Phép kiểm tra tệp cấu hình luôn so với kho đang chạy script, dù được chỉ sang thư mục khác. Hiện không ai dùng theo cách đó nên người dùng không gặp ảnh hưởng nào.
  Căn cứ: Chưa gây sai kết quả nào và không ảnh hưởng người dùng cuối, chỉ là tham số mới áp dụng một nửa. Chi phí sửa nhỏ nhưng lợi ích hiện không có, nên ghi nhận rồi bỏ qua.
  file: `_acceptance/nang-kit-3-1-1/rang/settings.mjs`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
