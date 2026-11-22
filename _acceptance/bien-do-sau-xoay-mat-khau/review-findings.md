# Review findings: bien-do-sau-xoay-mat-khau (round 3)

## Trong hợp đồng

- **Section 5 of the deploy runbook treats 'đã lùi về bản trước' as safe with no rotation exception**
  file: `docs/van-hanh/dua-ban-len.md:69`
  severity: medium
  AC: AC-5
  source: conventions
  detail: The new outage rule (line 92 onward) says that after the login password is rotated it also covers the case where the command rolled itself back ('đã lùi về bản trước'), and that the operator must run make deploy again right away. Step 5 ('Theo dõi bản thật') still says, with no exception: 'Thấy `đã lùi về bản trước` là bản thật đã tự quay về bản cũ — vẫn phải tìm nguyên nhân trước khi đưa lại.' This tells the operator the live app is back on a good version and there is time to investigate, which is exactly what the new rule exists to prevent. The contract and eval (3) of this round require that nothing implies the running app is fine without excepting the rotation case. This line is outside the red-step table, so the table check misses it. An operator watching the production run reads it first.
  rationale: AC-5 cấm mọi dòng của bước chạy sau vai-dang-nhap, kể cả dòng lùi bản, nói hay ngụ ý bản đang chạy yên mà không trừ ca vừa xoay mật khẩu; dòng ở bước 5 này làm đúng điều đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

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
