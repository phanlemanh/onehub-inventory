# Review findings — bien-do-sau-xoay-mat-khau (round 1)

## Trong hợp đồng

- **The runbook's three red zones leave out gan-ten-mien, and its row says nothing about the outage after a password rotation**
  AC: AC-5
  file: `docs/van-hanh/dua-ban-len.md:92`
  severity: medium
  source: bugs
  detail: The new section frames itself as covering 'every red step before gan-ten-mien' (line 83). Its third zone, the outage case, lists only cach-ly, dung and kiem-nhanh. But in len-ban.mjs a red gan-ten-mien (vercel promote fails, promoted=false) also ends with 'DỪNG ở gan-ten-mien — tên miền không đổi', and it happens after vai-dang-nhap has already changed the database password. During a rotation, the running deployment has already lost its database connection at that point. The gan-ten-mien row (line 123) only says 'Tên miền chưa đổi… chạy lại', with nothing about this case. An operator with gan-ten-mien red right after a rotation will not read it as an incident that needs a rerun right away. This is the same blind spot the E5 grader asks about for cach-ly, dung and kiem-nhanh, but gan-ten-mien was left out. Fix: add gan-ten-mien to the third zone and add the rotation warning to its row.
  rationale: AC-5 bullet thứ ba định nghĩa vùng đỏ là mọi bước đỏ sau khi vai-dang-nhap đạt (bản đang chạy đã mất kết nối, chạy lại ngay), và gan-ten-mien đỏ nằm sau vai-dang-nhap nên vùng thứ ba của sổ tay thiếu nó là lệch AC-5.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Header comment and wiki log overstate the fix: Vercel failures after vai-dang-nhap still take production off the database**
  Người dùng thấy gì: Một dòng chú thích và một dòng nhật ký nói quá tay là lỗi Vercel nào lúc xoay mật khẩu cũng không làm bản thật mất kết nối. Thực tế chỉ lỗi ở bước đẩy biến là được bảo vệ, người đọc chú thích có thể yên tâm sai.
  Căn cứ: Chỉ là câu chữ ghi chép, không ảnh hưởng hành vi hay dữ liệu, sổ tay và quyết định đã nói đúng nên người vận hành không bị dẫn sai, sửa lại rất rẻ nhưng hậu quả nhẹ.
  file: `tools/deploy/len-ban.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
