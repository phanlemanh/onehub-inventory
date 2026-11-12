# Review findings: cach-ly-truoc-du-lieu-that (round 1)

## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A view that grants only write rights to the API role passes every new check, so a write that skips the row rules goes unseen**
  Người dùng thấy gì: Nếu sau này có người tạo nhầm một lối tắt chỉ cho phép ghi hoặc xoá mà bỏ qua luật cách ly, bộ kiểm vẫn báo xanh. Khi đó một sàn có thể xoá thoả thuận của mọi sàn khác mà không ai hay.
  Căn cứ: Hậu quả nặng nếu xảy ra vì mất dữ liệu của nhiều sàn và bộ kiểm không báo, nhưng chỉ xảy ra khi có người cố tình hoặc vô ý thêm lối tắt đó; vá thêm kiểm tra khá rẻ nên nên làm thành việc riêng.
  file: `db/tests/cach-ly.sql`
  severity: medium
  Đề xuất: new-contract

- **Runner test and scratch-database helper fall back to different database lanes**
  Người dùng thấy gì: Nếu chạy bộ kiểm mà quên đặt biến môi trường, các phép kiểm sẽ rải sang hai cơ sở dữ liệu khác nhau, có thể đụng vào dữ liệu thử của phiên khác. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng người phát triển khi chạy tay thiếu cấu hình, không mất dữ liệu thật và tự khắc phục được bằng cách đặt đủ biến rồi chạy lại.
  file: `tests/db/cach-ly.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính đứng một mình, không ghim thông điệp): dòng ghim của tệp phá ghi-bi-chan khớp cả dòng chung bộ chạy tự in**
  Người dùng thấy gì: Phép thử rút quyền ghi sẽ báo đỏ cả khi ca kiểm hỏng vì lý do khác, nên nó chưa chứng minh được đỏ đúng vì mất quyền ghi. Việc cách ly giữa các sàn vẫn được bảo vệ như cũ.
  Căn cứ: Bộ kiểm vẫn đỏ khi quyền ghi bị rút nên không lộ dữ liệu; chỉ có nguy cơ chẩn đoán nhầm nguyên nhân, và người dùng không thấy gì.
  file: `db/scripts/cach-ly.sh`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
