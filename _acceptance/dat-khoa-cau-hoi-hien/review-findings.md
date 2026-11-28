# Review findings: dat-khoa-cau-hoi-hien (round 1)

## Trong hợp đồng

- **Intent / Criteria: the scope check is looser than AC-5**
  AC: AC-5
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs:19`
  severity: medium
  source: invariants
  detail: AC-5 in contract.md says that, apart from the record and one wiki/log/ file, the PR may change only tools/deploy/dat-khoa.mjs and the new test. OK_GLOBS in pham-vi.mjs also allows PRODUCT-MAP.md and LO-TRINH.html, and the real diff (b9fcdd11...HEAD) does change both. E5 goes green on a scope the signed contract does not allow, so the check does not measure the criterion as written. Fix: either add the two machine-drawn pages to the AC-5 wording at the gate, or remove them from OK_GLOBS and keep them out of the measured diff.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Criteria: the 'changes stay inside the asking function' check covers lines outside the function**
  Người dùng thấy gì: Phép đo có thể bỏ lọt một thay đổi nằm sát ngay trên hàm hỏi khoá. Bản hiện tại không có thay đổi nào ở đó, nên người dùng không thấy ảnh hưởng.
  Căn cứ: Nhẹ với người dùng vì chỉ là độ chặt của phép đo, bản giao không bị sai; sửa sau cũng rẻ nhưng không cần gấp.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/pham-vi.mjs`
  severity: low
  Đề xuất: known-limits

- **Design: terminalAsk only half-uses the injected input/output**
  Người dùng thấy gì: Khi chạy lệnh đặt khoá bằng ống dẫn, lệnh vẫn đọc đầu vào thật của máy chứ không đọc luồng được truyền vào. Người chủ kho chạy lệnh bình thường không gặp điều này.
  Căn cứ: Nhẹ vì lệnh thật dùng đúng đầu vào mặc định và chạy đúng; chỉ ảnh hưởng người viết bài kiểm sau này, không mất dữ liệu.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Tier: high (tools/**), needs a code owner**
  Người dùng thấy gì: Thay đổi này thuộc hạng cao nên không tự gộp được mà cần chủ kho ký. Đây là quy trình bình thường, không gây lỗi cho người dùng.
  Căn cứ: Không có hậu quả cho người dùng, chỉ là bước ký theo luật kho đã định sẵn.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: wont-fix

- **terminalAsk: the pipe branch ignores the input and output it is given**
  Người dùng thấy gì: Nhánh đọc từ ống dẫn bỏ qua luồng được đưa vào và luôn đọc đầu vào thật. Lệnh chạy thật hôm nay không bị ảnh hưởng.
  Căn cứ: Nhẹ vì lệnh thật chạy đúng với giá trị mặc định; chỉ là điểm yếu cho bài kiểm tương lai, sửa sau không mất gì.
  file: `tools/deploy/dat-khoa.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm tính một mình: ca ban-cu-mat-cau-hoi chỉ đếm câu hỏi bị mất, bỏ qua mọi dấu hiệu bản cũ đã thực sự chạy**
  Người dùng thấy gì: Phép chứng minh rằng bản cũ làm mất câu hỏi có thể xanh cả khi bản cũ không chạy được. Bản sửa của người dùng không bị ảnh hưởng.
  Căn cứ: Nhẹ với người dùng vì chỉ làm bằng chứng đối chứng yếu hơn, không làm lệnh thật sai; sửa sau không tốn nhiều.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 6 — đo thứ khác cây đang kiểm: ci.mjs ghim cứng PR 134 và đọc đầu nhánh trên GitHub, không đối chiếu với HEAD đang chấm**
  Người dùng thấy gì: Bằng chứng CI xanh có thể thuộc về một bản khác với bản đang được chấm nếu nhánh đã đi tiếp. Hiện chưa thấy lệch như vậy.
  Căn cứ: Nhẹ vì chỉ gây nhầm lẫn khi có bản chưa đẩy, người ký xem lại được trên GitHub; sửa sau rẻ.
  file: `_acceptance/dat-khoa-cau-hoi-hien/rang/ci.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
