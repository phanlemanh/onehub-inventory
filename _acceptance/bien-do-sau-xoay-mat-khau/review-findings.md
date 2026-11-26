# Review findings: bien-do-sau-xoay-mat-khau (round 3)

## Trong hợp đồng

Không còn mục nào: mục duy nhất của lượt 3 (bước 5 của sổ đưa bản lên) chuyển ra ngoài hợp đồng khi chủ kho thu phạm vi AC-5
về mục «Đỏ thì làm gì» ở trần ba lượt (dòng `descope` stage S4-r3 trong sổ quyết định).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Section 5 of the deploy runbook treats 'đã lùi về bản trước' as safe with no rotation exception**
  Người dùng thấy gì: Người vận hành theo dõi bản thật vừa xoay mật khẩu, thấy «đã lùi về bản trước» và đọc ở bước 5 rằng bản thật đã quay về bản cũ, nên tưởng còn thời gian tìm nguyên nhân trong khi bản cũ có thể không nối được cơ sở dữ liệu.
  Căn cứ: Câu nằm ngoài mục «Đỏ thì làm gì» mà phạm vi đã thu về; cùng nhóm với bước 3 và bước 6, nên đáng làm chung trong một việc riêng viết ca lùi bản lúc xoay mật khẩu thành một mục duy nhất.
  file: `docs/van-hanh/dua-ban-len.md`
  severity: medium
  Đề xuất: new-contract

- **The 'đã lùi về bản trước' row passes the health check and says the old version cannot connect, in the same row**
  Người dùng thấy gì: Người vận hành đọc một hàng vừa nói bản cũ đã qua kiểm sức khoẻ, vừa nói bản cũ không nối được cơ sở dữ liệu, nên có thể hoang mang. Lời dặn cuối vẫn đúng: không lùi, sửa nguyên nhân và chạy lại.
  Căn cứ: Chỉ là câu chữ gây khó hiểu, ca này hiếm khi xảy ra và lời dặn hành động vẫn an toàn, nên ghi lại là đủ.
  file: `docs/van-hanh/dua-ban-len.md`
  severity: low
  Đề xuất: known-limits

- **Luật vùng ba xếp «lùi bản DỪNG» vào ca «lệnh tự lùi bản» và nói bản đang chạy đã mất kết nối, dù lúc ấy tên miền vẫn ở bản mới mang mật khẩu mới**
  Người dùng thấy gì: Ở vài ca lùi bản dừng, sổ tay nói bản đang chạy mất kết nối vì mật khẩu cũ, trong khi nguyên nhân thật là chỗ khác. Người vận hành có thể tìm sai hướng, nhưng lời dặn cuối vẫn đúng.
  Căn cứ: Hậu quả nhẹ: chỉ chậm chẩn đoán, không mất dữ liệu, và lời dặn sửa rồi chạy lại vẫn dẫn tới kết quả đúng.
  file: `docs/van-hanh/dua-ban-len.md`
  severity: low
  Đề xuất: known-limits

- **Bước 3 và bước 6 của sổ đưa bản lên vẫn bảo «lùi bản ngay» mà không trừ lượt vừa xoay mật khẩu vai đăng nhập**
  Người dùng thấy gì: Nếu vừa xoay mật khẩu rồi lệnh chạy xanh nhưng kiểm bằng mắt thấy lỗi, sổ tay vẫn bảo lùi bản ngay. Lùi lúc đó sẽ làm app mất kết nối cơ sở dữ liệu, dù trang lùi bản riêng đã có cảnh báo.
  Căn cứ: Ca hẹp, cần xoay mật khẩu và hỏng ở bước kiểm bằng mắt cùng lúc, và trang lùi bản đã chặn; sửa rẻ nhưng nằm ngoài các tiêu chí đã duyệt.
  file: `docs/van-hanh/dua-ban-len.md`
  severity: low
  Đề xuất: known-limits

- **Header comment and wiki log overstate the fix: Vercel failures after vai-dang-nhap still take production off the database (r1)**
  Người dùng thấy gì: Một dòng chú thích và một dòng nhật ký nói quá tay là lỗi Vercel nào lúc xoay mật khẩu cũng không làm bản thật mất kết nối. Thực tế chỉ lỗi ở bước đẩy biến là được bảo vệ, người đọc chú thích có thể yên tâm sai.
  Căn cứ: Chỉ là câu chữ ghi chép, không ảnh hưởng hành vi hay dữ liệu, sổ tay và quyết định đã nói đúng nên người vận hành không bị dẫn sai, sửa lại rất rẻ nhưng hậu quả nhẹ.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
