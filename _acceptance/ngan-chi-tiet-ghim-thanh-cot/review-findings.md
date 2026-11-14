# Review findings: ngan-chi-tiet-ghim-thanh-cot (round 4)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records: decision 0024 now describes the old floating position**
  Người dùng thấy gì: Một trang ghi chép nội bộ vẫn mô tả hồ sơ nổi đứng sát thanh trên cùng. Người dùng không thấy khác biệt, chỉ người đọc lại lịch sử quyết định có thể hiểu nhầm.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu và người dùng không gặp; sửa lại ghi chú sau rất rẻ.
  file: `wiki/decisions/0024-ngan-noi-xem-chi-tiet.md`
  severity: medium
  Đề xuất: known-limits

- **Records: design/behaviors.md contradicts itself and the code**
  Người dùng thấy gì: Tài liệu mô tả hồ sơ tự mâu thuẫn và thiếu mức rộng tối thiểu của bảng. Người dùng không thấy gì khác, chỉ người làm tiếp có thể hiểu sai.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉnh lại câu chữ sau là việc rẻ.
  file: `design/behaviors.md`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: the cookie-leak unit test cannot fail**
  Người dùng thấy gì: Một phép kiểm tra nhỏ về việc lưu trạng thái ghim không thể phát hiện lỗi thật. Người dùng không bị ảnh hưởng vì kiểm tra trên trình duyệt thật vẫn bảo vệ việc này.
  Căn cứ: Có lớp bảo vệ khác che việc này nên nguy cơ lộ dữ liệu thấp; dọn phép kiểm thừa sau là rẻ.
  file: `tests/ghim-ngan.test.ts`
  severity: low
  Đề xuất: known-limits

- **Design: the shared record panel imports the resizable package directly**
  Người dùng thấy gì: Khung hồ sơ lấy một phần của thư viện chia cột trực tiếp thay vì qua lớp bọc chung. Người dùng không thấy khác biệt nào.
  Căn cứ: Chỉ là thói quen tổ chức nội bộ, không ảnh hưởng người dùng hay dữ liệu; sửa tốn công hơn lợi ích.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: wont-fix

- **Intent / records: the wiki log moves another row's entry**
  Người dùng thấy gì: Nhật ký thay đổi bị dời một dòng của hàng khác xuống thấp hơn. Người dùng không thấy gì, chỉ có thể gây xung đột khi gộp với các hàng khác.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; nếu xung đột thì gỡ tay một lần là xong.
  file: `wiki/log.md`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): 'toolbar covered by record' không có ca đối chứng nào làm nó bật**
  Người dùng thấy gì: Phép kiểm tra thanh công cụ có bị hồ sơ che hay không có thể lặng lẽ không đo gì nếu nhãn nút đổi. Người dùng hiện không thấy lỗi nào.
  Căn cứ: Hiện không có lỗi người dùng thấy; rủi ro chỉ là bỏ sót lỗi che thanh công cụ trong tương lai, và bổ sung ca đối chứng sau là rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
