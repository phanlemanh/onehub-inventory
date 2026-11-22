## Trong hợp đồng

- **The new rotation table's definition of the rotation run excludes the red runs its first two rows describe**
  file: `docs/van-hanh/xoay-khoa.md:141`
  severity: low
  AC: AC-2
  source: bugs
  detail: Line 141 defines the rotation run as the first run that prints `vai-dang-nhap đạt` with the new password. Every later run, up to the first `xong`, is a rerun. Rows 1 and 2 of the table (lines 146-147) then split their middle column into a rotation-run case ('mật khẩu chưa đổi, bản đang chạy yên') and a rerun case. Those rows cover a run that went red at `cau-hinh`, `ban-thu-truoc`, `migration`, `bien` or `vai-dang-nhap`. In STEPS, `bien` runs before `vai-dang-nhap` for both environments, so none of these runs can have printed `vai-dang-nhap đạt`. By the definition, then, no such run is a rotation run, and the 'lượt xoay' half of both rows is empty. The run those halves are written for is the first attempt after `make dat-khoa XOAY=1` that went red before the password changed. It fits neither defined term. An operator who follows the definitions literally cannot place that run, and could read 'Lượt chạy lại: … bản đang chạy đã mất kết nối' as applying to a run that is in fact healthy. The 'Làm gì' advice (fix, rerun, do not roll back) is the same either way, so the impact is limited to a wrong diagnosis of the running deployment. Fix: widen the definition so that runs after XOAY=1 and before the first `vai-dang-nhap đạt` count as the rotation run (or give them their own name). The standing test does not check this: `tests/so-tay-lui-ban.test.ts` only checks that steps and command lines are named.

- **Hình dạng 3 — assert «chuỗi có mặt» thay cho quan hệ «mỗi dòng có hàng riêng» (everyLine)**
  file: `tests/so-tay-lui-ban.test.ts:150`
  severity: high
  AC: AC-2
  source: measurement
  detail: Chú thích ở dòng 139 hứa: «một dòng chỉ được tính khi nó có hàng riêng». Nhưng everyLine nối mọi hàng bảng của mục lại (dòng 140-143) rồi chỉ kiểm `section.includes(l)` (dòng 150) và regex bước `\`${s}[\`\s]` (dòng 148) ở bất kỳ ô nào. Cột «Làm gì» của hàng `đã lùi về bản trước` có nhắc «`lùi bản ĐỎ — tên miền đã về bản`» và «`kiem-nhanh`», nên hai chuỗi đó luôn được tìm thấy dù hàng của chúng còn hay mất. Chạy thử trên bản sao của nội dung thật: (a) xoá hẳn hàng «lùi bản ĐỎ — tên miền đã về bản <id> nhưng kiểm nhanh đỏ», là hàng sổ tự gọi là hay gặp nhất, everyLine vẫn trả []; (b) bỏ «, `kiem-nhanh`» khỏi ô «Dòng» của hàng cach-ly/dung/kiem-nhanh/gan-ten-mien, everyLine vẫn trả []. Ca đỏ ở dòng 347-358 chỉ bắt được vì nó thay mọi chỗ bằng replaceAll, nên không phát hiện lỗ này. Lời hứa là quan hệ (dòng ↔ ô «Dòng» của hàng riêng của nó), còn phép đo chỉ thấy chuỗi có mặt trong bảng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Hình dạng 3 — rotationReason chỉ kiểm lý do có mặt ở đâu đó trong mục, không gắn với hàng «không nối được»**
  Người dùng thấy gì: Nếu ai đó sửa lý do ghi trong một hàng của sổ tay thành lý do sai, bài kiểm vẫn xanh. Người vận hành có thể đọc một lý do lệch với điều lệnh thật in ra.
  Căn cứ: Chỉ xảy ra khi có người sửa sổ tay sai đúng chỗ ấy, lý do đúng vẫn còn ở chỗ khác trong mục, và người đọc review sổ tay vẫn thấy được.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 1 — đọc mã nguồn bằng regex thay vì đo đầu ra của kiemNhanh và health**
  Người dùng thấy gì: Bài kiểm lý do kiểm nhanh dựa vào cách mã được viết, nên mã đổi cách viết mà kết quả không đổi có thể làm bài kiểm báo sai, hoặc mã thêm điều kiện mà bài kiểm vẫn xanh.
  Căn cứ: Chỉ làm bài kiểm kém bền hoặc bỏ sót, không làm người dùng mất dữ liệu hay đọc sai sổ tay ngay; bài kiểm sửa lại được sau mà không tốn nhiều.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits
- **Hình dạng 5 — tuyên phủ «mọi cách thử bản khác» của lui-ban.md nhưng chỉ có danh sách điểm và regex cụm từ**
  Người dùng thấy gì: Một đoạn trong sổ lùi bản bảo người vận hành tự chọn bản khác trên Vercel không có câu trỏ về mục sau xoay mật khẩu, và bài kiểm không bắt được. Người vừa xoay mật khẩu có thể chọn nhầm bản cũ không nối được.
  Căn cứ: Đoạn này nằm ở nhánh phụ khi không biết bản nào tốt, nên ít gặp; người vận hành tự sửa được bằng cách chạy lại hoặc đọc mục, và thêm một câu trỏ rất rẻ.
  file: `tests/so-tay-lui-ban.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
