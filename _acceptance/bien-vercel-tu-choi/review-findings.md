# Review findings: bien-vercel-tu-choi (round 1)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hai hàng sổ tay mới nói 'tên miền không đổi, khoá mới chưa có hiệu lực' — sai với mật khẩu vai đăng nhập vừa xoay**
  Người dùng thấy gì: Sau khi xoay mật khẩu cơ sở dữ liệu mà lần đưa bản lên dừng giữa chừng, sổ tay vẫn nói bản đang chạy không bị ảnh hưởng. Thực tế bản đang chạy có thể đã mất kết nối dữ liệu, và người vận hành không biết cần báo gấp.
  Căn cứ: Hậu quả có thể nặng (trang thật lỗi mà người vận hành tưởng yên), nhưng chỉ xảy ra khi đúng lúc vừa xoay mật khẩu và Vercel từ chối ghi; sửa là đổi vài dòng chữ trong sổ tay nên rẻ, nên đáng làm thành một việc riêng.
  file: `docs/van-hanh/dua-ban-len.md`
  severity: medium
  Đề xuất: new-contract

- **Ma trận ô trong kế hoạch đo ghim dòng đỏ của E1-b và E1-c không có mã lỗi, lệch với hợp đồng và với ca kiểm**
  Người dùng thấy gì: Bảng kế hoạch chấm ghi sai hai dòng báo lỗi mẫu (thiếu phần mã lỗi). Người dùng cuối không thấy gì khác, chỉ là người chấm có thể tưởng nhầm hai ca là sai dù lệnh chạy đúng.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉ có thể gây chấm nhầm, người chấm tự đối chiếu lại được và sửa bảng rất rẻ khi có dịp.
  file: `_acceptance/bien-vercel-tu-choi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Eval matrix strings for E1-b and E1-c do not match the red lines the tests pin and the code prints**
  Người dùng thấy gì: Bảng kế hoạch chấm ghi dòng báo lỗi mẫu khác với dòng lệnh thật in ra ở hai ca. Người dùng không bị ảnh hưởng, chỉ có nguy cơ chấm nhầm.
  Căn cứ: Hậu quả chỉ là nhầm lẫn khi chấm, không mất dữ liệu, người chấm đối chiếu lại được; sửa rẻ nhưng không cấp bách.
  file: `_acceptance/bien-vercel-tu-choi/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3: Kiểm «chuỗi có mặt» trong khi lời hứa là QUAN HỆ (mỗi lý do đỏ mà mã in ra đều có hàng trong sổ tay)**
  Người dùng thấy gì: Nếu sau này ai đó đổi lời một dòng báo lỗi hoặc thêm lý do đỏ mới mà quên sửa sổ tay, phép kiểm vẫn báo xanh. Người vận hành có thể gặp dòng đỏ mà sổ tay không có hướng dẫn tương ứng.
  Căn cứ: Chỉ xảy ra khi có thay đổi sau này và hậu quả là thiếu hướng dẫn trong sổ tay, không mất dữ liệu; người vận hành vẫn báo được người giữ kho mã, nên chấp nhận ghi lại như giới hạn đã biết.
  file: `tools/deploy/deploy.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

⚠ Cụm ngoài vùng phủ: 2/4 lỗi rơi vào file không bộ đo nào phủ (_acceptance/bien-vercel-tu-choi/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
