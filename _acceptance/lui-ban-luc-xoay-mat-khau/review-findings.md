# Review findings: lui-ban-luc-xoay-mat-khau (round 3)

## Trong hợp đồng

- **Row «lùi bản ĐỎ — tên miền đã về bản» always says the domain is now on a pre-rotation deployment, but on a rerun the command can roll back to a post-rotation deployment that still connects**
  AC: AC-2
  file: `docs/van-hanh/xoay-khoa.md:159`
  severity: low
  source: bugs
  detail: Row 159 says the command 'đã chuyển tên miền khỏi bản mới còn nối được, về bản dựng trước lượt xoay: mất kết nối, lý do là `sức khoẻ ok khác true (vai: …)`'. In code, rollBack in tools/deploy/len-ban.mjs:392-435 rolls back to `before`, which is whatever deployment held the domain just before `gan-ten-mien` in this run. Row 155 of the same table already allows that `before` can be built at or after the rotation run, once 'một lượt chạy lại đã gắn tên miền'. Here is one way that happens. (1) The rotation run promotes N1, `kiem-nhanh-ten-mien` goes red, and rollBack stops with `lùi bản DỪNG`, so the domain stays on N1, built after the rotation. (2) The rerun promotes N2, `kiem-nhanh-ten-mien` goes red again for a reason unrelated to the password (for example `/proto/x trả 200, cần 404`). (3) The rollback to N1 succeeds, and kiemNhanh(N1) fails for that same reason. The command then prints `lùi bản ĐỎ — tên miền đã về bản N1 nhưng kiểm nhanh đỏ: /proto/x trả 200, cần 404`, while N1 still connects (`vai: dat`). In that case the row is wrong about the deployment and the reason, and it contradicts row 155. The 'Làm gì' advice (treat it as an incident, do not roll back again, fix and redeploy) is still safe, so the harm is a wrong diagnosis, not a wrong action. The standing test encodes the same assumption: LANDS_ON_OLD in tests/so-tay-lui-ban.test.ts and rotationReason require this row to state `sức khoẻ ok khác true` as its reason, so nothing catches it. Fix: make the row conditional, like row 155. If `before` was built before the rotation run, the connection is lost with that reason. Otherwise, read `<lý do>` and check the health endpoint.
  rationale: AC-2 đòi bảng nói bản đang giữ tên miền ra sao và làm gì đúng với mã cho dòng này; hàng nói chắc chắn là bản trước lượt xoay, mất kết nối, trong khi ở lượt chạy lại mã có thể lùi về bản dựng sau lượt xoay vẫn nối được.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 1 (đo mã nguồn thay vì đầu ra): lý do kiểm nhanh in cho bản không nối được được rút bằng regex trên văn bản kiem-nhanh.mjs, không chạy kiemNhanh**
  Người dùng thấy gì: Nếu sau này ai đó đổi thứ tự các bước kiểm của lệnh, sổ tay có thể vẫn ghi lý do cũ trong khi lệnh in lý do khác, và bài kiểm vẫn báo xanh. Người vận hành khi đó đọc sai nguyên nhân mất kết nối, nhưng không có dữ liệu nào bị mất.
  Căn cứ: Hậu quả nhẹ và chỉ xảy ra khi có người sửa lệnh sau này; sổ tay chỉ lệch lý do chứ không làm mất dữ liệu, và dễ sửa lại khi phát hiện, nên ghi lại như hạn chế đã biết là đủ.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — rotationReason chỉ kiểm lý do có mặt ở đâu đó trong mục, không gắn với hàng «không nối được» (r2 · tệp đã đổi)**
  Người dùng thấy gì: Nếu ai đó sửa lý do ghi trong một hàng của sổ tay thành lý do sai, bài kiểm vẫn xanh. Người vận hành có thể đọc một lý do lệch với điều lệnh thật in ra.
  Căn cứ: Chỉ xảy ra khi có người sửa sổ tay sai đúng chỗ ấy, lý do đúng vẫn còn ở chỗ khác trong mục, và người đọc review sổ tay vẫn thấy được.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 — đọc mã nguồn bằng regex thay vì đo đầu ra của kiemNhanh và health (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm lý do kiểm nhanh dựa vào cách mã được viết, nên mã đổi cách viết mà kết quả không đổi có thể làm bài kiểm báo sai, hoặc mã thêm điều kiện mà bài kiểm vẫn xanh.
  Căn cứ: Chỉ làm bài kiểm kém bền hoặc bỏ sót, không làm người dùng mất dữ liệu hay đọc sai sổ tay ngay; bài kiểm sửa lại được sau mà không tốn nhiều.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên phủ «mọi cách thử bản khác» của lui-ban.md nhưng chỉ có danh sách điểm và regex cụm từ (r2 · tệp đã đổi)**
  Người dùng thấy gì: Một đoạn trong sổ lùi bản bảo người vận hành tự chọn bản khác trên Vercel không có câu trỏ về mục sau xoay mật khẩu, và bài kiểm không bắt được. Người vừa xoay mật khẩu có thể chọn nhầm bản cũ không nối được.
  Căn cứ: Đoạn này nằm ở nhánh phụ khi không biết bản nào tốt, nên ít gặp; người vận hành tự sửa được bằng cách chạy lại hoặc đọc mục, và thêm một câu trỏ rất rẻ.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
