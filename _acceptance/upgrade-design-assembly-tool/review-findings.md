# Review findings: upgrade-design-assembly-tool (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Criteria and tests: AC-6 measure exits 0 when it compares nothing**
  Người dùng thấy gì: Sau khi nhánh đã gộp, phép kiểm danh sách tệp đổi vẫn báo đạt dù không so được gì, dù lời ghi nói là không báo xanh. Chỉ ảnh hưởng người chạy lại hồ sơ cũ.
  Căn cứ: Chỉ xảy ra khi chạy lại sau khi gộp, không ảnh hưởng người dùng sản phẩm, và chạy lại hay đọc dòng chữ là thấy ngay.
  file: `_acceptance/upgrade-design-assembly-tool/rang/branch-changes.mjs`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: tool behaviour changes without a test in this repo**
  Người dùng thấy gì: Một số hành vi mới của công cụ kiểm tra thiết kế (hết giờ, báo lỗi) không có bài kiểm riêng ở kho này. Chúng được kiểm ở kho plugin.
  Căn cứ: Công cụ chỉ chạy lúc kiểm tra nội bộ, người dùng cuối không gặp, và kho plugin đã có bài kiểm cho các nhánh này.
  file: `tools/design-assembly/lint.mjs`
  severity: low
  Đề xuất: known-limits

- **Rules: new configuration variables not documented in .env.example**
  Người dùng thấy gì: Hai biến cấu hình mới của công cụ kiểm tra chưa được liệt kê trong tệp mẫu cấu hình, nên người mới khó biết chúng tồn tại.
  Căn cứ: Chỉ ảnh hưởng người vận hành công cụ, các biến đều có giá trị mặc định, và bổ sung sau rất rẻ.
  file: `tools/design-assembly/lint.mjs`
  severity: low
  Đề xuất: known-limits

- **Records: wiki/log.md line does not follow the log format**
  Người dùng thấy gì: Một dòng nhật ký thiếu đường dẫn đến PR, nên khó lần lại thay đổi này từ nhật ký.
  Căn cứ: Chỉ là ghi chép, không ảnh hưởng người dùng, và thêm đường dẫn sau khi có PR chỉ mất một lần sửa.
  file: `wiki/log.md`
  severity: low
  Đề xuất: wont-fix

- **Records: lasting decision with no wiki/decisions page**
  Người dùng thấy gì: Lý do công cụ được đưa vào bằng lệnh nâng cấp và việc không có phép kiểm thường trực chưa có trang quyết định riêng trong wiki. Người sau khó tìm câu trả lời.
  Căn cứ: Không ảnh hưởng người dùng, quyết định đã ghi ở hồ sơ nghiệm thu, và viết thêm trang sau rất rẻ.
  file: `design/tool-stamp.json`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: tool-tree measure ignores file mode and symlinks**
  Người dùng thấy gì: Phép đo không phát hiện nếu ai đó đổi quyền thực thi hay thay tệp bằng liên kết có cùng nội dung. Hiện chưa có tệp nào bị vậy.
  Căn cứ: Hiện kết quả đúng và rủi ro chỉ khi ai đó cố ý đổi; không ảnh hưởng người dùng sản phẩm.
  file: `_acceptance/upgrade-design-assembly-tool/rang/tool-tree.mjs`
  severity: low
  Đề xuất: known-limits

- **Intent: record is not tied to any plan item**
  Người dùng thấy gì: Trang lộ trình hiện một cảnh báo là hồ sơ này chưa thuộc việc nào trong kế hoạch. Chỉ gây nhiễu cho người xem.
  Căn cứ: Chỉ là cảnh báo hiển thị, không ảnh hưởng người dùng, và gắn mã việc sau rất rẻ.
  file: `LO-TRINH.html`
  severity: low
  Đề xuất: known-limits

- **Phép đo cả nhánh (AC-6/E11) vẫn báo đạt khi không có gì để so, trái với lời của chính hồ sơ**
  Người dùng thấy gì: Khi chạy lại sau khi gộp, phép kiểm danh sách tệp vẫn báo đạt mà không so gì, trái với lời hồ sơ. Chỉ gây hiểu nhầm cho người chấm lại.
  Căn cứ: Chỉ xảy ra sau gộp, không chạm người dùng sản phẩm, và dòng chữ in ra đã nói rõ không có gì để so.
  file: `_acceptance/upgrade-design-assembly-tool/rang/branch-changes.mjs`
  severity: medium
  Đề xuất: known-limits

- **Phép đo sổ phát hành bỏ mất lý do khi git lỗi**
  Người dùng thấy gì: Khi phép kiểm sổ phát hành không đọc được kho plugin, thông báo không nói rõ là thiếu kho hay thiếu bản cập nhật. Người chấm phải tự đoán.
  Căn cứ: Phép kiểm vẫn báo đỏ nên không bỏ lọt lỗi, chỉ tốn thêm chút công tìm nguyên nhân.
  file: `_acceptance/upgrade-design-assembly-tool/rang/release-ledger.mjs`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5 (ma trận viết trước không khớp số ca): ma trận hứa mười chín ca phá, bộ đo chỉ có mười bảy**
  Người dùng thấy gì: Bộ kiểm chứng các phép đo hứa 19 ca phá nhưng chỉ có 17 hoặc 18, nên có thể thiếu một vài ca mà không ai biết ca nào.
  Căn cứ: Chỉ là độ phủ của bộ kiểm chứng nội bộ, không ảnh hưởng người dùng, và các phép đo chính vẫn được thử cả hai chiều.
  file: `_acceptance/upgrade-design-assembly-tool/rang/measures-two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp ở chiều xanh): bài branch-changes coi thoát 0 là xanh, mà phép đo cũng thoát 0 khi không có gì để so**
  Người dùng thấy gì: Bài kiểm chứng phép đo danh sách tệp coi mọi kết quả đạt là xanh, kể cả khi không so được gì. Có thể che một lỗi sau khi gộp.
  Căn cứ: Chỉ làm bộ kiểm chứng nội bộ kém chặt ở trường hợp sau gộp, không chạm người dùng sản phẩm.
  file: `_acceptance/upgrade-design-assembly-tool/rang/measures-two-way.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
