# Review findings: bang-quyen-theo-vai (round 2)

## Trong hợp đồng

(không có finding mới ở round này)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

(không có mục mới ở round này; các mục mang sang từ round trước do máy chèn)

- **Criteria and tests: row 9's break pair is left red in its own suite and only hidden by the grader filter (r1)**
  Người dùng thấy gì: Một bài thử phá của chức năng mời người, khi chạy cả bộ kiểm thì báo đỏ, và bị loại khỏi bài nghiệm thu để ra xanh. Người dùng không thấy gì khác, nhưng việc mời người không có kiểm quyền ở tầng dữ liệu không còn bài thử phá riêng.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chủ kho đã duyệt việc loại bài này và lý do đã được ghi lại, nên ghi thành hạn chế đã biết là đủ.
  file: `_acceptance/config.yaml`
  severity: medium
  Đề xuất: known-limits

- **Authorization: the API and the database read an 'own' cell differently (r1)**
  Người dùng thấy gì: Hiện tại quyền quản lý người hoạt động đúng. Nếu sau này có vai chỉ được quản lý phần của mình, phía màn hình và phía dữ liệu có thể hiểu khác nhau, gây cho phép rồi lại từ chối.
  Căn cứ: Hiện chưa có người dùng nào gặp lỗi vì chưa có ô quyền kiểu này; chỉ cần nhớ xử lý khi hàng đầu tiên mở ô như vậy, nên sửa sau không đắt.
  file: `src/modules/identity/members-http.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): ô 'allowed' ở tầng API được đo bằng 'không phải 403' (r1)**
  Người dùng thấy gì: Bài kiểm tra chỉ xác nhận Quản trị sàn không bị chặn, không xác nhận thao tác thật sự thành công. Nếu thao tác của Quản trị sàn bị lỗi vì lý do khác, bài kiểm tra vẫn báo xanh.
  Căn cứ: Đây là điểm yếu của bài kiểm tra chứ chưa phải lỗi người dùng đang gặp; các bài kiểm hàng 9 và bài trình duyệt Thành viên đã kiểm các thao tác này thành công thật nên rủi ro bị che là thấp.
  file: `tests/db/bang-quyen-api.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert có mặt thay vì quan hệ): ô readOwnRoles ở cơ sở dữ liệu chỉ kiểm mảng vai khác rỗng (r1)**
  Người dùng thấy gì: Bài kiểm tra chỉ xem người dùng có nhận được vai nào đó hay không, chưa xác nhận đó đúng là vai của chính họ ở sàn đang dùng. Nếu có lỗi làm lộ vai của sàn khác qua đường này, bài kiểm tra sẽ không bắt được.
  Căn cứ: Hiện chưa có bằng chứng lộ vai thật, và bộ kiểm cách ly giữa các sàn vẫn bảo vệ dữ liệu; thêm so sánh chính xác vào bài kiểm sau này rẻ và không làm mất gì.
  file: `tests/db/bang-quyen.db.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
