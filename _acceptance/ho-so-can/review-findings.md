# Review findings: ho-so-can (round 1)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **On a phone, the record first appears as the floating panel for one render before switching to full screen**
  Người dùng thấy gì: Khi mở thẳng một đường dẫn hồ sơ trên điện thoại, người dùng có thể thấy ngăn nổi kiểu máy tính trong khoảnh khắc ngắn rồi mới chuyển sang toàn màn hình.
  Căn cứ: Chỉ là một nháy ngắn lúc mở, kết quả cuối đúng và không mất dữ liệu; tải lại là thấy đúng, nên chấp nhận ghi lại như hạn chế đã biết.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits
- **The record panel's doc comment contradicts the placement in decision 0024 and in the code**
  Người dùng thấy gì: Người dùng không thấy gì khác biệt; chỉ có lời ghi chú nội bộ mô tả sai vị trí ngăn hồ sơ so với cách nó thực sự hiện.
  Căn cứ: Không ảnh hưởng gì tới người dùng, không mất dữ liệu; sửa lúc nào cũng rẻ nên không đáng mở thêm việc riêng.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: wont-fix
- **The floating record panel first appears over the App Shell top bar, then jumps down**
  Người dùng thấy gì: Lúc vừa mở hồ sơ, ngăn có thể phủ thanh trên trong một khoảnh khắc rồi nhảy xuống đúng chỗ, nên người dùng thấy giật nhẹ.
  Căn cứ: Chỉ là giật hình thoáng qua, tự hết ngay, không mất dữ liệu và không cản thao tác; hạn chế nhẹ nên ghi lại là đủ.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits
- **Hình dạng 3 — chỉ kiểm chuỗi có mặt, trong khi lời hứa là thẻ căn của đúng căn vừa mở (E7)**
  Người dùng thấy gì: Bài kiểm tra trên điện thoại chỉ chắc là thẻ căn có chữ, chưa chắc là đúng mã, giá, nơi của căn vừa chạm, nên nếu thẻ hiện nhầm căn thì bài vẫn báo xanh.
  Căn cứ: Sản phẩm không sai ở đây, chỉ là lưới an toàn của bài kiểm tra lỏng hơn lời hứa; người dùng không bị ảnh hưởng và bổ sung phép so sau này rẻ.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
