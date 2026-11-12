# Review findings: ho-so-can (round 4)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 3 — assert "chuỗi có mặt" thay cho quan hệ: thẻ căn trên điện thoại không được đối chiếu với căn vừa mở**
  Người dùng thấy gì: Nếu sau này thẻ căn trên điện thoại hiện nhầm căn khác, bài kiểm tự động có thể không phát hiện. Hôm nay người dùng không thấy lỗi nào.
  Căn cứ: Hiện không có lỗi nào người dùng gặp, chỉ là lưới kiểm thưa; sau này thêm phép so sánh rất rẻ và không mất dữ liệu.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 — đếm ma trận quét mà phép đếm không thể sai: `scanned` luôn bằng `mine.length`**
  Người dùng thấy gì: Nếu bộ kiểm chạy thiếu một khổ màn hình, việc quét trợ năng có thể bỏ sót mà vẫn báo xanh. Người dùng không thấy gì khác đi ở sản phẩm hôm nay.
  Căn cứ: Không ảnh hưởng người dùng trực tiếp, chỉ có nguy cơ bỏ sót lỗi trợ năng nếu cách chạy kiểm thay đổi; người phát triển tự thấy được khi chạy đủ các khổ và sửa sau không tốn kém.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Scroll listener updates panel state on every scroll event, without the frame batching used elsewhere in the repo (r3 · tệp đã đổi)**
  Người dùng thấy gì: Khi cuộn trang lúc hồ sơ căn đang mở, hồ sơ được vẽ lại nhiều lần hơn mức cần, nên trên máy yếu có thể thấy cuộn hơi nặng. Hồ sơ vẫn hiện đúng vị trí và đúng nội dung.
  Căn cứ: Hậu quả nhẹ: không mất hay lộ dữ liệu, chỉ có thể hơi chậm trên máy yếu, người dùng không phải làm gì để khắc phục, và việc sửa sau này rẻ.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

- **Comment on RecordPanel contradicts decision 0024 and the code: it says the panel sits below the region's toolbar (r2 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng không thấy gì khác: hồ sơ vẫn nổi đúng chỗ. Chỉ có người đọc mã sau này có thể hiểu sai cách đặt ngăn.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; sửa một dòng chú thích bất cứ lúc nào, nên ghi nhận và không mở việc riêng.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: wont-fix

- **Leftover wrapper data-region-stage (relative) that nothing uses (r2 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng không thấy khác biệt nào; chỉ có thêm một lớp bọc thừa trong mã của bảng.
  Căn cứ: Không có hậu quả nhìn thấy được và không mất dữ liệu; dọn sau rất rẻ khi chạm lại bảng này.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: wont-fix

- **aria-label on a role-less span: the price label is never announced (r2)**
  Người dùng thấy gì: Người dùng đọc màn hình sẽ nghe giá chỉ là một con số, không có chữ «Giá chào» đi kèm. Người nhìn màn hình không bị ảnh hưởng.
  Căn cứ: Ảnh hưởng nhẹ, chỉ với người dùng trình đọc màn hình, không mất dữ liệu và các thông tin khác trong thẻ vẫn có nhãn; sửa sau không đắt nên ghi thành hạn chế đã biết.
  file: `src/modules/listings/ui/listing-record.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (checks that a string is present when the promise is a relation): the phone card's unit, price and place are only checked as not empty, never against the unit that was opened (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này thẻ căn trên điện thoại hiện nhầm căn khác, bài kiểm tự động hiện tại có thể không bắt được. Hôm nay người dùng không thấy lỗi nào.
  Căn cứ: Hôm nay không có hậu quả với người dùng; rủi ro chỉ là lỗi tương lai lọt qua kiểm thử, và có thể siết bài kiểm bất cứ lúc nào mà không đụng đến sản phẩm.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
