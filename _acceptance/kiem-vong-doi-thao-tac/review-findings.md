## Trong hợp đồng

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **New test names and assertion message are in Vietnamese, but the repo requires English for tests**
  Người dùng thấy gì: Hai dong chu trong bai kiem thu viet bang tieng Viet thay vi tieng Anh. Nguoi dung cuoi khong thay gi, chi anh huong tham my nhat quan cua ma nguon.
  Căn cứ: Khong anh huong nguoi dung, khong mat hay lo du lieu, chi la cach dat ten noi bo; neu de nguyen thi bo kiem van chay dung va doi ten bat ky luc nao cung rat re.
  file: `tests/vong-doi-thao-tac.test.ts`
  severity: low
  Đề xuất: wont-fix

- **The evidence report says the cleanup case passed at a commit where it did not exist (r2 · tệp đã đổi)**
  Người dùng thấy gì: The sign-off report says the temp-folder cleanup check passed, but it was written before that check existed. Whoever signs it would be relying on a result that was never actually run.
  Căn cứ: No user data is lost or exposed and the report can be regenerated cheaply by a new grading round, but until then the sign-off rests on an unbacked claim.
  file: `_acceptance/kiem-vong-doi-thao-tac/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **`chan` is accepted on every cell but only checked on `xem`, so a `chan` anywhere else is silently ignored (r1)**
  Người dùng thấy gì: Khi người viết khai danh sách vai bị chặn ở một ô không phải ô xem, bộ kiểm vẫn báo xanh dù không áp dụng gì. Người khai có thể tưởng quy tắc đã được kiểm trong khi thực tế bị bỏ qua.
  Căn cứ: Hậu quả nhẹ: dữ liệu hiện tại không rơi vào trường hợp này, không mất dữ liệu của người dùng, và người khai tự sửa được khi phát hiện.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Decision page 0038 is not linked from wiki/index.md (wiki-lint warns) (r1)**
  Người dùng thấy gì: Trang quyết định về bộ kiểm vòng đời khó tìm vì không có trong mục lục wiki. Người đọc wiki bắt đầu từ mục lục sẽ không thấy nó.
  Căn cứ: Hậu quả rất nhẹ: chỉ là cảnh báo, không ảnh hưởng người dùng, một số trang cũ cũng bị như vậy và thêm một dòng vào mục lục là rẻ.
  file: `wiki/decisions/0038-lifecycle-check.md`
  severity: low
  Đề xuất: known-limits

- **The lifecycle check reads fewer screen files than the button table it claims to match (r1)**
  Người dùng thấy gì: Nếu sau này một màn có thêm tệp nằm trong thư mục nhưng không được trang nhập vào, bộ kiểm có thể bỏ sót một thứ màn đó hiện. Hiện chưa có tệp nào như vậy nên chưa ảnh hưởng gì.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra: không mất hay lộ dữ liệu, chỉ có thể bỏ sót một lỗi khai báo trong tương lai, và sửa sau vẫn rẻ.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **A `chan` key on a cell other than xem is accepted and ignored (r1)**
  Người dùng thấy gì: Người khai đặt danh sách vai bị chặn nhầm ô sẽ thấy bộ kiểm xanh nhưng quy tắc không có hiệu lực. Dễ gây hiểu lầm cho người viết dữ liệu về vai.
  Căn cứ: Hậu quả nhẹ: chỉ ảnh hưởng người khai dữ liệu nội bộ, hiện không có dữ liệu nào bị vậy, và phát hiện ra thì tự sửa được.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả lớp «không khởi động tiến trình nào khác» nhưng chỉ dò ba mẫu chữ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm khẳng định bộ kiểm không mở tiến trình nào khác, nhưng chỉ dò vài cách mở thông dụng. Một cách mở khác có thể lọt qua mà bài vẫn xanh.
  Căn cứ: Hậu quả nhẹ với người dùng: đây là bộ kiểm nội bộ chạy trong kho, không đụng dữ liệu khách, và cam kết bắt buộc là không gọi git vốn đã được đo.
  file: `tests/vong-doi-thao-tac.test.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
