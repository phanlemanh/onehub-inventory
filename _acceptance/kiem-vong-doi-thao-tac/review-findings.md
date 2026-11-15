# Review findings: kiem-vong-doi-thao-tac (round 1)

## Trong hợp đồng

- **Phép đo mà eval nhắc tới không có trong bài: ca 'don-thu-muc-tam' (gần hình dạng 1 nhất: eval nói có đo nhưng đầu ra không được kiểm)**
  file: `_acceptance/kiem-vong-doi-thao-tac/evals.yaml:49`
  severity: low
  AC: AC-6
  source: measurement
  detail: Không khớp hẳn hình dạng nào trong sáu; xếp gần hình dạng 1 nhất. E6 ghi phải có ca 'don-thu-muc-tam' kiểm rằng "sau afterAll mọi thư mục tạm bài tạo không còn trên đĩa". Trong tests/vong-doi-thao-tac.test.ts không có describe hay it nào tên đó. afterAll (dòng 37-39) chỉ gọi rmSync, và không có assert nào kiểm `existsSync(dir) === false` cho các thư mục trong `copies`. Bằng chứng E6 sẽ chạy xanh cho một điều mà không phép đo nào kiểm.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **`chan` is accepted on every cell but only checked on `xem`, so a `chan` anywhere else is silently ignored**
  Người dùng thấy gì: Khi người viết khai danh sách vai bị chặn ở một ô không phải ô xem, bộ kiểm vẫn báo xanh dù không áp dụng gì. Người khai có thể tưởng quy tắc đã được kiểm trong khi thực tế bị bỏ qua.
  Căn cứ: Hậu quả nhẹ: dữ liệu hiện tại không rơi vào trường hợp này, không mất dữ liệu của người dùng, và người khai tự sửa được khi phát hiện.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Decision page 0038 is not linked from wiki/index.md (wiki-lint warns)**
  Người dùng thấy gì: Trang quyết định về bộ kiểm vòng đời khó tìm vì không có trong mục lục wiki. Người đọc wiki bắt đầu từ mục lục sẽ không thấy nó.
  Căn cứ: Hậu quả rất nhẹ: chỉ là cảnh báo, không ảnh hưởng người dùng, một số trang cũ cũng bị như vậy và thêm một dòng vào mục lục là rẻ.
  file: `wiki/decisions/0038-lifecycle-check.md`
  severity: low
  Đề xuất: known-limits

- **The lifecycle check reads fewer screen files than the button table it claims to match**
  Người dùng thấy gì: Nếu sau này một màn có thêm tệp nằm trong thư mục nhưng không được trang nhập vào, bộ kiểm có thể bỏ sót một thứ màn đó hiện. Hiện chưa có tệp nào như vậy nên chưa ảnh hưởng gì.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra: không mất hay lộ dữ liệu, chỉ có thể bỏ sót một lỗi khai báo trong tương lai, và sửa sau vẫn rẻ.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **A `chan` key on a cell other than xem is accepted and ignored**
  Người dùng thấy gì: Người khai đặt danh sách vai bị chặn nhầm ô sẽ thấy bộ kiểm xanh nhưng quy tắc không có hiệu lực. Dễ gây hiểu lầm cho người viết dữ liệu về vai.
  Căn cứ: Hậu quả nhẹ: chỉ ảnh hưởng người khai dữ liệu nội bộ, hiện không có dữ liệu nào bị vậy, và phát hiện ra thì tự sửa được.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả lớp «không khởi động tiến trình nào khác» nhưng chỉ dò ba mẫu chữ**
  Người dùng thấy gì: Bài kiểm khẳng định bộ kiểm không mở tiến trình nào khác, nhưng chỉ dò vài cách mở thông dụng. Một cách mở khác có thể lọt qua mà bài vẫn xanh.
  Căn cứ: Hậu quả nhẹ với người dùng: đây là bộ kiểm nội bộ chạy trong kho, không đụng dữ liệu khách, và cam kết bắt buộc là không gọi git vốn đã được đo.
  file: `tests/vong-doi-thao-tac.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
