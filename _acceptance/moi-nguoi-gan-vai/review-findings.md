# Review findings: moi-nguoi-gan-vai (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New entity Member is not assigned to any module in architecture/modules.yaml**
  Người dùng thấy gì: Người dùng không thấy gì khác đi. Chỉ là sổ ghi mô-đun nào giữ khái niệm Thành viên còn thiếu, nên công cụ kiểm ranh giới chưa tính đúng được.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu, chỉ là sổ ghi chép chưa khớp; bổ sung sau rất rẻ.
  file: `architecture/modules.yaml`
  severity: medium
  Đề xuất: known-limits

- **The sign-in link in the invitation email is built from the request's Host, not from a configured app URL**
  Người dùng thấy gì: Trong một số cách triển khai, một quản trị sàn có thể làm thư mời mang địa chỉ đăng nhập trỏ sang trang khác, hoặc trỏ tới địa chỉ nội bộ không mở được, nhưng vẫn gửi từ người gửi chính thức của sản phẩm.
  Căn cứ: Hậu quả có thể nặng vì thư giả mạo mang danh người gửi tin cậy, nhưng chỉ quản trị đã đăng nhập mới làm được và người nhận không mất dữ liệu sẵn có; sửa cần cấu hình mới nên nên làm thành việc riêng.
  file: `src/modules/identity/members-http.ts`
  severity: medium
  Đề xuất: new-contract

- **inviteMember queries company_members directly, contrary to the module's own stated access rule**
  Người dùng thấy gì: Người dùng không thấy khác biệt. Việc lấy tên sàn và tên người mời cho thư mời đi qua một lối khác với lối đã ghi trong tài liệu.
  Căn cứ: Dữ liệu vẫn bị khoá theo sàn nên không lộ gì; chỉ là sai lệch với tài liệu thiết kế, sửa sau không vội.
  file: `src/modules/identity/members.ts`
  severity: low
  Đề xuất: known-limits

- **Admin who removes their own CompanyAdmin role is shown a false 'server error' screen with a Retry that can never succeed**
  Người dùng thấy gì: Quản trị tự bỏ vai Quản trị sàn của mình khi còn quản trị khác sẽ thấy màn báo lỗi máy chủ kèm nút Thử lại, bấm mãi không được, thay vì màn Không đủ quyền. Phiên hết hạn cũng bị báo nhầm là lỗi máy chủ.
  Căn cứ: Không mất dữ liệu và việc đổi vai đã lưu đúng; người dùng chỉ bị rối và tự thoát được bằng cách tải lại trang, sửa sau khá rẻ.
  file: `src/app/(app)/members/members-screen.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): phép so 'cùng một câu trả lời' không có đối chứng dương rằng lời mời thành công**
  Người dùng thấy gì: Người dùng không thấy gì. Một bài kiểm có thể vẫn xanh nếu cả hai lời mời cùng hỏng giống nhau, nên bài kiểm bắt lỗi kém hơn mức mong muốn.
  Căn cứ: Không ảnh hưởng người dùng; rủi ro chỉ là bỏ sót lỗi hiếm trong bài kiểm, thêm kiểm chứng sau rất rẻ.
  file: `tests/db/moi-nguoi.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt trong khi lời hứa là quan hệ): 'theo thứ tự sổ vai' so với danh sách gõ tay**
  Người dùng thấy gì: Người dùng không thấy gì. Nếu sau này đổi thứ tự hay chữ của các vai, bài kiểm có thể không báo.
  Căn cứ: Không có hậu quả cho người dùng hiện tại, chỉ là bài kiểm kém linh hoạt khi đổi nhãn; chi phí sửa lớn hơn lợi ích lúc này.
  file: `tests/e2e-db/members.spec.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4 (âm tính không ghim thông điệp): bộ gửi giữ thư hỏng theo yêu cầu bằng một rejects.toThrow() trống**
  Người dùng thấy gì: Người dùng không thấy gì. Bài kiểm giả lập lỗi gửi thư có thể xanh dù lỗi không đúng loại đã định.
  Căn cứ: Không ảnh hưởng người dùng và có đối chứng đếm thư bù lại; sửa không đáng công.
  file: `src/modules/identity/invite-mail.test.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
