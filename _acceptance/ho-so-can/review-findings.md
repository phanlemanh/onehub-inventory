## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **High-tier change: loosens the hash pin on a signed test file under tools/, owner approval not yet recorded**
  Người dùng thấy gì: Thay đổi này nới một chốt kiểm tra đã ký, nên cần chủ kho xem và đồng ý trước khi gộp. Người dùng cuối không thấy gì khác đi.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉ cần chủ kho ghi nhận phê duyệt một lần ở cổng, sửa sau cũng rẻ.
  file: `tools/proof_gate/proof-gate-0023.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Comments say the panel sits below the region toolbar and leaves it visible, but the code and decision 17 cover the toolbar's right side**
  Người dùng thấy gì: Lời ghi chú trong mã mô tả sai vị trí ngăn hồ sơ so với quyết định mới. Người dùng không thấy khác biệt nào trên màn hình.
  Căn cứ: Không ảnh hưởng người dùng, không mất dữ liệu; chỉ có thể gây hiểu nhầm cho người sửa sau và sửa lúc nào cũng rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: wont-fix

- **On a phone the desktop floating panel renders first, then swaps to the full-screen dialog**
  Người dùng thấy gì: Trên điện thoại, nếu mở thẳng một đường dẫn đã có hồ sơ căn, người dùng có thể thấy ngăn kiểu máy tính loé lên một thoáng rồi mới chuyển sang toàn màn.
  Căn cứ: Chỉ là một thoáng hình ảnh khi mở thẳng đường dẫn, không mất dữ liệu và kết quả cuối vẫn đúng; sửa sau không đắt.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

- **On a phone, the first render shows the desktop floating panel and moves focus into it**
  Người dùng thấy gì: Trên điện thoại, mở thẳng đường dẫn có hồ sơ căn có thể làm bố cục máy tính loé lên một thoáng và con trỏ nhảy vào chỗ sắp biến mất.
  Căn cứ: Ảnh hưởng nhẹ, chỉ ở lần mở thẳng và tự ổn định ngay; không mất dữ liệu, người dùng không cần làm gì thêm.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

- **The floating panel covers the App Shell top bar for one frame when it opens**
  Người dùng thấy gì: Khi mở hồ sơ trên máy tính, ngăn có thể che thanh trên trong một khoảnh khắc rồi mới tụt xuống đúng chỗ.
  Căn cứ: Chỉ là cái giật hình rất ngắn, không mất dữ liệu, trạng thái cuối đúng; sửa sau không đắt.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

- **Shape 3: assert presence where the promise is a relation (price of the open unit at the head of the record)**
  Người dùng thấy gì: Bài kiểm tra trên trang thật mới chỉ xác nhận có hiện giá ở đầu hồ sơ, chưa xác nhận đó đúng là giá của căn đang mở.
  Căn cứ: Không có bằng chứng người dùng thấy sai giá, và quan hệ này đã được kiểm ở bài kiểm tra nhỏ hơn; bổ sung sau rẻ và không gây mất dữ liệu.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
