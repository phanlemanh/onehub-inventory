# Review findings: kiem-vong-doi-thao-tac (round 4)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **A role under `chan` that is not a real role still passes, so a misspelled role does nothing and nobody is told**
  Người dùng thấy gì: If someone misspells a role name in a block list, the check stays green and the report shows a block for a role that does not exist. The real role stays uncovered without anyone being warned.
  Căn cứ: The effect is mild: it only happens when a person mistypes the owner's own data file, nothing is lost, and the report is easy to correct by hand once someone notices.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: medium
  Đề xuất: known-limits

- **Role names under `chan` are never checked, so a `chan` entry that does nothing still passes**
  Người dùng thấy gì: A block entry that does nothing, such as a typo or a role that can already view, still passes and can make a role look blocked when it is not. The report may then mislead the owner.
  Căn cứ: No user data is at risk and the owner can fix a wrong entry by hand, but the report may mislead until then, so it is worth recording as a known limit.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên quét LỚP nhưng chỉ có điểm-case: luật mới «chan ở bất kỳ chỗ nào khác ngoài ô xem có thao tác thì đỏ» chỉ được đo ở 2 vị trí**
  Người dùng thấy gì: The rule that rejects a block list in the wrong place is tested at only two positions. If a later edit breaks it in the other places, the test suite would not notice.
  Căn cứ: This causes no harm to users today and the rule works now; the risk is only a silent regression later, and adding the missing tests is cheap whenever someone touches this check.
  file: `tests/vong-doi-thao-tac.test.ts`
  severity: medium
  Đề xuất: known-limits

- **The lifecycle check reads fewer screen files than the button table it claims to match (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu sau này một màn có thêm tệp nằm trong thư mục nhưng không được trang nhập vào, bộ kiểm có thể bỏ sót một thứ màn đó hiện. Hiện chưa có tệp nào như vậy nên chưa ảnh hưởng gì.
  Căn cứ: Hậu quả nhẹ và chưa xảy ra: không mất hay lộ dữ liệu, chỉ có thể bỏ sót một lỗi khai báo trong tương lai, và sửa sau vẫn rẻ.
  file: `tools/coverage_matrix/lifecycle.py`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5: tuyên quét cả lớp «không khởi động tiến trình nào khác» nhưng chỉ dò ba mẫu chữ (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm khẳng định bộ kiểm không mở tiến trình nào khác, nhưng chỉ dò vài cách mở thông dụng. Một cách mở khác có thể lọt qua mà bài vẫn xanh.
  Căn cứ: Hậu quả nhẹ với người dùng: đây là bộ kiểm nội bộ chạy trong kho, không đụng dữ liệu khách, và cam kết bắt buộc là không gọi git vốn đã được đo.
  file: `tests/vong-doi-thao-tac.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
