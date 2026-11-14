# Review findings: cong-bat-khoi-khong-ke (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A component name from any ledger line or open round counts as declared for every file, not only its own file**
  Người dùng thấy gì: Một tệp khối mới tự làm có thể lọt qua cổng nếu tên thành phần của nó trùng tên một khối đã được kê ở nơi khác. Cổng khi đó im lặng dù không ai kê tệp ấy.
  Căn cứ: Chỉ lọt khi trùng tên với khối đã kê, hiếm gặp, và người soi ở cổng của vòng màn vẫn thấy khối đó; không mất dữ liệu và có thể siết lại sau với chi phí nhỏ.
  file: `tools/proof_gate/check.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ở hình sổ hôm nay, việc đọc `parts` chỉ được đo bằng mục KhoiA/KhoiB viết tay**
  Người dùng thấy gì: Bài kiểm chưa chứng minh được rằng cổng đọc đủ các thành phần con trong sổ thật của kho hôm nay. Nếu phần đọc ấy hỏng, bài vẫn xanh.
  Căn cứ: Chỉ là chỗ hở của bài kiểm, chưa phải lỗi chạy thật, người dùng không bị ảnh hưởng ngay; bổ sung bài đo sau rẻ và an toàn.
  file: `tools/proof_gate/proof-gate-1q.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (assert chuỗi có mặt thay cho quan hệ): E3 hứa ĐÚNG tập ba tên nhưng bài chỉ kiểm từng tên có mặt**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận ba tên khối có mặt, không xác nhận không dư tên lạ hay tên lặp. Một lỗi làm dư tên sẽ không bị bắt.
  Căn cứ: Rủi ro nhẹ: lỗi dư tên chỉ làm báo thừa và dễ thấy khi chạy, không mất dữ liệu, sửa bài kiểm sau rất rẻ.
  file: `tools/proof_gate/proof-gate-1q.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình): «không có dòng sổ khối» đo bằng việc thiếu một chuỗi con**
  Người dùng thấy gì: Bài kiểm kiểm tra việc danh sách có trước không trùng sổ khối bằng cách tìm một chuỗi chữ, nên nếu sổ khối viết khác kiểu thì bài vẫn xanh mà không kiểm gì.
  Căn cứ: Sổ khối hiện do máy sinh theo một khuôn cố định nên khả năng viết khác kiểu thấp; hậu quả chỉ là bài kiểm kém chặt, không ảnh hưởng người dùng.
  file: `tools/proof_gate/proof-gate-1q.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình): «không gọi tiến trình con» chỉ là grep vắng chữ 'subprocess'**
  Người dùng thấy gì: Bài kiểm chỉ tìm chữ 'subprocess' nên không bắt được các cách khác gọi tiến trình con. Việc cổng không cần git vẫn được đo thật bằng bài chạy không có git.
  Căn cứ: Hành vi thật đã được đo bằng bài chạy với PATH chỉ có python3, nên phần grep chỉ là lưới phụ; sửa tốn công mà lợi ít.
  file: `tools/proof_gate/proof-gate-1q.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): AC-6 kiểm khuôn chứng minh bằng grep một cụm chữ**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận khuôn hướng dẫn có một câu nhất định, không xác nhận tác tử dựng màn làm theo. Nếu câu bị đổi nghĩa thì bài vẫn xanh.
  Căn cứ: Hợp đồng chỉ đòi kiểm sự có mặt của câu này; việc nối khuôn với hành vi cổng tốn kém còn hậu quả nhỏ, người soi ở cổng vẫn bắt được.
  file: `tools/proof_gate/proof-gate-1q.test.ts`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
