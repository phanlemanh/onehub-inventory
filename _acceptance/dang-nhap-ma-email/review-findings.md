# Review findings: dang-nhap-ma-email (round 2)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Open redirect after sign-in: safeNext lets through paths with a tab or newline**
  Người dùng thấy gì: Một đường link lừa đảo có thể đưa người dùng sang một trang lạ ngay sau khi họ đăng nhập thật. Người dùng có thể bị lừa nhập thông tin ở trang giả mạo.
  Căn cứ: Hậu quả nặng vì liên quan tới lừa đảo, người dùng không tự phát hiện hay gỡ được, nhưng sửa rẻ nên nên đăng thành việc riêng sớm.
  file: `src/modules/identity/next-path.ts`
  severity: high
  Đề xuất: new-contract

- **safeNext can be bypassed with a tab or newline, giving an open redirect after sign-in**
  Người dùng thấy gì: Một đường link lừa đảo có thể đưa người dùng sang một trang lạ ngay sau khi họ đăng nhập thật. Người dùng có thể bị lừa nhập thông tin ở trang giả mạo.
  Căn cứ: Hậu quả nặng vì liên quan tới lừa đảo, người dùng không tự phát hiện hay gỡ được, nhưng sửa rẻ nên nên đăng thành việc riêng sớm.
  file: `src/modules/identity/next-path.ts`
  severity: high
  Đề xuất: new-contract

- **Sign-out failure is swallowed: the session stays live and /login sends the user straight back into the app**
  Người dùng thấy gì: Nếu mạng hoặc máy chủ lỗi lúc bấm Đăng xuất, người dùng tưởng đã thoát nhưng vẫn đang đăng nhập và bị đưa ngược vào ứng dụng, không có thông báo. Trên máy dùng chung, người sau có thể vào tài khoản đó.
  Căn cứ: Hậu quả vừa nhưng có tính an toàn trên máy dùng chung; người dùng thử lại được nhưng không biết mình cần thử lại.
  file: `src/app/(app)/account-menu.tsx`
  severity: medium
  Đề xuất: new-contract

- **Signed in but no longer in any company: the login page shows an empty company list with no way out**
  Người dùng thấy gì: Người đã bị gỡ khỏi mọi sàn nhưng vẫn còn phiên sẽ thấy màn chọn sàn trống và không có nút nào để thoát. Họ bị kẹt cho tới khi tự xoá cookie.
  Căn cứ: Hiếm gặp nhưng người dùng bị kẹt hẳn, không tự thoát được bằng thao tác thông thường; sửa khá rẻ.
  file: `src/app/login/page.tsx`
  severity: medium
  Đề xuất: new-contract

- **Company membership added to the schema with no ontology entry**
  Người dùng thấy gì: Việc một người thuộc sàn nào chưa được ghi vào bộ khái niệm nghiệp vụ chung. Người dùng không thấy khác biệt, chỉ là tài liệu mô hình chưa đầy đủ cho tới hàng sau.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; hợp đồng đã hoãn có chủ đích sang hàng 9 nên ghi lại là đủ.
  file: `db/migrations/002_dang_nhap_ma_email.sql`
  severity: medium
  Đề xuất: known-limits

- **Company switch: a network error leaves the menu stuck busy, and a failed response is silently ignored**
  Người dùng thấy gì: Khi đổi sàn gặp lỗi mạng hoặc bị từ chối, menu có thể bị kẹt không bấm được hoặc không báo gì. Người dùng vẫn ở sàn cũ và phải tải lại trang.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu, người dùng tự gỡ bằng cách tải lại trang.
  file: `src/app/(app)/account-menu.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét LỚP «mọi trạng thái của bảng trạng thái» nhưng axe chỉ chạy ở các điểm chọn tay, sót trạng thái no-company và server-error**
  Người dùng thấy gì: Kiểm tra khả năng tiếp cận chưa chạy ở màn chưa thuộc sàn và màn lỗi máy chủ, nên lỗi tiếp cận ở đó có thể lọt qua. Người dùng dùng trình đọc màn hình có thể gặp khó ở hai màn này.
  Căn cứ: Chưa có bằng chứng lỗi thật, chỉ là chưa được đo; hiếm gặp hai màn này và bổ sung bài kiểm sau rẻ.
  file: `tests/e2e-db/login.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Server logs and error messages written in Vietnamese**
  Người dùng thấy gì: Một số dòng nhật ký máy chủ viết bằng tiếng Việt thay vì tiếng Anh. Người dùng không thấy gì, chỉ người vận hành đọc nhật ký mới gặp.
  Căn cứ: Hậu quả rất nhẹ, không ảnh hưởng người dùng và không mất dữ liệu; đổi chữ sau này rẻ.
  file: `src/modules/identity/http.ts`
  severity: low
  Đề xuất: known-limits

- **Code expiry and rate-limit numbers repeated as literals in screen text**
  Người dùng thấy gì: Màn đăng nhập ghi cứng số phút hết hạn mã và thời gian chờ. Nếu sau này đổi số, màn hình có thể nói khác với thư gửi đi.
  Căn cứ: Hiện tại số khớp nhau nên người dùng chưa bị ảnh hưởng; chỉ rủi ro khi đổi số, và sửa lúc đó rẻ.
  file: `src/app/login/copy.ts`
  severity: low
  Đề xuất: known-limits

- **Email subject writes the login-code label by hand in lower case, which slips past the label test**
  Người dùng thấy gì: Tiêu đề thư gửi mã dùng chữ tự gõ thay vì lấy từ bảng nhãn chung. Người nhận vẫn thấy tiêu đề đúng.
  Căn cứ: Người dùng không bị ảnh hưởng; chỉ lệch quy ước nhãn, sửa sau rẻ.
  file: `src/modules/identity/sender.ts`
  severity: low
  Đề xuất: known-limits

- **An invalid email is reported as a server error with a Retry button**
  Người dùng thấy gì: Gõ email sai định dạng thì màn hình báo lỗi máy chủ kèm nút Thử lại thay vì nói email không hợp lệ. Người dùng thử lại vẫn lỗi và có thể bối rối.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu, người dùng tự sửa email là qua được.
  file: `src/app/login/login-form.tsx`
  severity: low
  Đề xuất: known-limits

- **currentSession swallows a configuration error with no log**
  Người dùng thấy gì: Nếu cấu hình máy chủ thiếu sau khi chạy, mọi trang hiện như chưa đăng nhập mà không có dấu vết nào trong nhật ký. Người vận hành khó tìm nguyên nhân.
  Căn cứ: Chỉ xảy ra khi cấu hình hỏng, không mất dữ liệu; thêm một dòng nhật ký sau này rẻ.
  file: `src/modules/identity/runtime.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4: «không có mã trong console» chỉ là khẳng định âm tính đứng một mình, không thể đỏ ở đường đang đo**
  Người dùng thấy gì: Bài kiểm chứng minh mã đăng nhập không bị in ra nhật ký chưa đủ chặt, nên nếu sau này mã bị lộ vào nhật ký thì bài kiểm có thể vẫn xanh. Hiện chưa có dấu hiệu mã đang bị lộ.
  Căn cứ: Chưa có lỗi thật với người dùng, chỉ là lưới an toàn yếu; làm chặt bài kiểm sau rẻ.
  file: `tests/db/dang-nhap.db.test.ts`
  severity: low
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Không có.

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
