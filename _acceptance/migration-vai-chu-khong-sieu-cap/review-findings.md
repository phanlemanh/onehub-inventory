# Review findings: migration-vai-chu-khong-sieu-cap (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New migration reuses number 001 and fills the gap at 004 instead of taking the next number**
  Người dùng thấy gì: Hai tệp cập nhật cơ sở dữ liệu mang số cũ thay vì số cuối nên dễ bị người sau bắt chước nhầm. Người dùng cuối không thấy ảnh hưởng gì, cơ sở đã có vẫn được áp bù đúng.
  Căn cứ: Chỉ là lệch nếp đặt số, đã được nêu rõ và chấp nhận có chủ đích; không mất dữ liệu và không ảnh hưởng người dùng, chỉ cần ghi chú để người sau khỏi sao chép.
  file: `db/migrations/001_vai_chu_khong_sieu_cap.sql`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: nói phá thử phủ chiều đỏ của E1–E4, nhưng chỉ có vài ca lẻ**
  Người dùng thấy gì: Bộ tự kiểm nói là đã thử phá mọi chiều nhưng thực tế mới thử vài ca, nên vài thông báo lỗi chưa được chứng minh là bắt được lỗi thật. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm bằng chứng nghiệm thu yếu hơn lời nói, không làm hỏng việc đưa bản lên; bổ sung thêm ca phá sau là rẻ và không gấp.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: hai assert chỉ có chiều âm, không có ca đối chứng trong bài kiểm CI**
  Người dùng thấy gì: Bài kiểm tự động kiểm tra rằng tài khoản danh tính không còn quyền tạo đối tượng thừa, nhưng chưa tự chứng minh được rằng nó sẽ báo đỏ nếu quyền ấy thật sự còn. Nếu định dạng quyền đổi, bài kiểm có thể vẫn xanh dù quyền thừa quay lại. Người dùng cuối không thấy gì trực tiếp.
  Căn cứ: Hậu quả nhẹ và chỉ ảnh hưởng độ tin cậy của bài kiểm về sau, không làm mất hay lộ dữ liệu; phần đối chứng đã được chạy ở công cụ tự kiểm riêng, và bổ sung sau cũng rẻ, không gấp.
  file: `tests/db/chu-khong-sieu-cap.db.test.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
