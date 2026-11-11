# Review findings: cong-chung-minh-man-mau (round 1)

## Trong hợp đồng

- **A 'đạt' (passed) state in the matrix is accepted when the evidence names a folder, or names a missing test file next to any real path**
  file: `tools/proof_gate/check.py:107`
  severity: medium
  AC: AC-6
  source: bugs
  detail: grounds_exist() accepts the evidence as soon as any token containing '/' exists under the repo root, and it checks this with Path.exists(). A directory counts, and one real token is enough. I ran it against the real repo: grounds_exist('tests/') -> True, grounds_exist('src/app') -> True, and grounds_exist('đạt theo tests/khong-co.ts và wiki/') -> True, even though tests/khong-co.ts does not exist. matrix_complete() (line 251-253) uses this function for 'đạt' rows, so a reference screen can pass 'bai-kiem-khong-co' with no real test file. That breaks AC-6 ('ghi «đạt» mà tệp bài kiểm không có → đỏ') and the template's own rule ('căn cứ là tệp bài kiểm có thật'). The same lax check also lets a 'khác — có lý do' row (AC-4) through on a bare folder such as 'design/'. It also makes 'man-mau-chua-dat' (line 312-313) accept a reference screen that has no real tests. Fix: require is_file(), and for 'đạt' require every path token to resolve, or at least the token that is meant as the test file.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The gate reads the screen register itself instead of reusing the existing reader**
  Người dùng thấy gì: Hai công cụ kiểm có thể hiểu khác nhau về một màn hay một hồ sơ đã đóng, nên có lúc một vòng qua cổng này mà bị bên kia đếm khác. Người dùng cuối không thấy gì.
  Căn cứ: Hậu quả nhẹ và chỉ hiện khi có người đổi quy ước ở một bên; không mất dữ liệu, bên kia vẫn báo đỏ, sửa sau không đắt.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **Image paths in the proof file can point outside the contract folder**
  Người dùng thấy gì: Một vòng có thể qua cổng bằng cách trỏ tới ảnh nằm ngoài hồ sơ, nên người soi ở cổng có thể không thấy đúng ảnh đặt cạnh màn mẫu.
  Căn cứ: Chỉ xảy ra khi người lập vòng cố ý hoặc vô ý trỏ sai đường, người soi vẫn xem được và sửa lại dễ; không mất dữ liệu.
  file: `tools/proof_gate/check.py`
  severity: medium
  Đề xuất: known-limits

- **The state matrix passes with no checks when design/states.md has no readable table**
  Người dùng thấy gì: Nếu bảng trạng thái của kho bị đổi tên hay hỏng, cổng im lặng bỏ qua việc kiểm trạng thái và mọi màn mẫu mới đều qua.
  Căn cứ: Cần có người làm hỏng tệp nguồn trước, hiếm gặp và dễ lộ khi xem kho; sửa rẻ nhưng không có AC bắt buộc.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **If the states list is missing or unreadable, every state matrix passes with no rows**
  Người dùng thấy gì: Khi danh sách trạng thái không đọc được, cổng báo xanh cho mọi màn mẫu mới mà không cảnh báo gì, nên màn thiếu trạng thái có thể được trình.
  Căn cứ: Chỉ xảy ra khi tệp nguồn hỏng, hiếm; người soi ở cổng vẫn là lớp chặn cuối và sửa sau rẻ.
  file: `tools/proof_gate/model.py`
  severity: medium
  Đề xuất: known-limits

- **The proof gate quietly skips contracts with broken front matter or an unknown status**
  Người dùng thấy gì: Hồ sơ gõ sai trạng thái hoặc hỏng phần đầu sẽ bị cổng bỏ qua và vẫn báo xanh, dù công cụ khác trong bộ kiểm chung có thể đỏ.
  Căn cứ: Bộ kiểm chung vẫn bắt được lỗi này nên rủi ro thấp; sửa dễ nhưng ngoài hợp đồng.
  file: `tools/proof_gate/model.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): cong-cu.md là lời cổng cũ dựng lại theo khuôn của lưới mới, không phải phát lại**
  Người dùng thấy gì: Bài thử ca Liên hệ cũ dùng bản viết tay nên chưa chắc chứng minh lưới bắt được đúng lời cổng cũ thật; người dùng có thể tin vào độ phủ hơn mức đã đo.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ giảm độ tin của bài thử; ghi rõ giới hạn là đủ, làm lại cần lấy lại nguồn cũ nên tốn.
  file: `tools/proof_gate/fixtures/lien-he-quy-hang/cong-cu.md`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): số 43/18/25 của ban-kiem.md chỉ đếm trên chính bản chép tay**
  Người dùng thấy gì: Nếu bản chép tay bảng kiểm Liên hệ chép sai hay sót dòng thì không bài thử nào phát hiện, nên con số 25 chỗ lệch có thể không khớp bản gốc.
  Căn cứ: Chỉ làm sai bài thử một lần, không chạm dữ liệu thật; đối chiếu lại bằng tay rẻ khi cần.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng chỉ có điểm-case): đầu tệp hứa mỗi luật có ca xanh và ca đỏ, nhưng 3 mã lỗi không có bài nào**
  Người dùng thấy gì: Ba loại lỗi của cổng chưa có bài thử riêng nên nếu chúng hỏng thì không ai biết ngay, dù người dùng vẫn được bảo vệ bởi các luật khác.
  Căn cứ: Là khoảng trống bài thử ở góc hiếm, không làm sai kết quả hiện tại; thêm bài sau rẻ.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận thiếu trục): ma trận 6 × 3 của AC-1 gộp mọi màn sản phẩm vào một màn Lưới, bỏ trục lối**
  Người dùng thấy gì: Bài thử toàn phần chưa kê hết các lối của màn, nên tổ hợp trạng thái hồ sơ với lối họ mới chỉ được thử rời.
  Căn cứ: Các tổ hợp quan trọng đã được thử riêng, rủi ro thấp; mở rộng ma trận là việc thêm, không gấp.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1/3 (đo chỉ dẫn bằng chuỗi có mặt): bài 'skill trỏ đúng' chỉ grep SKILL.md**
  Người dùng thấy gì: Hướng dẫn cho người dựng màn có thể trỏ tới tệp đã đổi tên mà bài thử vẫn xanh, khiến người dựng màn đi theo chỉ dẫn lỗi thời.
  Căn cứ: AC-10 vốn do người xét, đổi tên tệp sẽ lộ ngay khi dựng màn và sửa chữ rất rẻ; không đáng mở thêm việc.
  file: `tools/proof_gate/proof-gate.test.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
