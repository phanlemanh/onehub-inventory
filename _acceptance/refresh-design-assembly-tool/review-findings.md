# Review findings: refresh-design-assembly-tool (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Phép đo AC-2 có hai thông điệp lệch không ghim trong ma trận và chưa từng được thấy đỏ; số ca phá ghi «chín» nhưng liệt kê ra mười**
  Người dùng thấy gì: Bộ kiểm tra có hai kiểu báo lỗi chưa từng được thử cho thấy nó thật sự báo đỏ, và một con số trong tài liệu ghi sai. Người dùng không thấy gì khác đi; chỉ là độ tin cậy của bộ kiểm tra kém hơn mức nó tự hứa.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu và không ảnh hưởng sản phẩm; chỉ là một chỗ kiểm tra chưa được thử, thêm sau rẻ và không gấp.
  file: `_acceptance/refresh-design-assembly-tool/rang/register-names-once.mjs`
  severity: low
  Đề xuất: known-limits

- **linked-copy.mjs là bản chép nguyên byte từ hồ sơ adopt-design-assembly, mang theo tiền tố thư mục tạm và hàm thừa của hồ sơ kia**
  Người dùng thấy gì: Một tệp trợ giúp của bộ kiểm tra là bản chép của hồ sơ khác, nên thư mục tạm sót lại có thể mang tên hồ sơ kia. Người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ là sự lộn xộn nhỏ trong công cụ kiểm tra, không đổi kết quả và không ai phải gánh hậu quả, nên không đáng tốn công sửa.
  file: `_acceptance/refresh-design-assembly-tool/rang/linked-copy.mjs`
  severity: low
  Đề xuất: wont-fix

- **Sổ linh kiện sinh lại mất ba quan hệ «vẽ bằng» (parts), không phép đo nào của hồ sơ nhìn thấy**
  Người dùng thấy gì: Danh mục linh kiện sau khi sinh lại nói thiếu việc một số linh kiện được dựng từ linh kiện nào, cho hai linh kiện bộ lọc. Hiện chưa bên nào đọc thông tin này nên chưa có gì hỏng, nhưng ai tra danh mục sẽ thấy thiếu.
  Căn cứ: Mất thông tin lặng lẽ nhưng chưa ai dùng, giao diện không đổi, và sinh lại sổ là gỡ được; nên ghi lại như giới hạn đã biết và sửa khi có bên cần đọc.
  file: `design/component-registry.json`
  severity: medium
  Đề xuất: known-limits

- **Phép kiểm screen-actions: bản «đổi thử» dùng cứng khóa `shows`, nên sổ màn đặt lại tên khóa ấy làm cổng đỏ sai**
  Người dùng thấy gì: Nếu sau này kho bật kiểm tra hành động của màn và đặt lại tên một khóa, cổng kiểm tra có thể báo đỏ nhầm trên một sổ lành. Hiện chưa bật nên chưa ai gặp.
  Căn cứ: Lỗi báo to chứ không lặng, chỉ xảy ra khi bật tính năng chưa dùng, và chỗ sửa nằm ở kho plugin; ghi lại để biết là đủ.
  file: `tools/design-assembly/check.mjs`
  severity: low
  Đề xuất: known-limits

- **Ghi chú «debt» hứa in ở mọi lượt chạy nhưng bị bỏ khi có bất kỳ lỗi nào**
  Người dùng thấy gì: Khi cổng kiểm tra đỏ, các dòng nhắc về nợ thiết kế không được in ra dù tài liệu nói luôn in. Người dùng chỉ thấy thiếu lời nhắc trong lúc đang phải sửa lỗi.
  Căn cứ: Hậu quả rất nhẹ, không mất dữ liệu, lời nhắc hiện lại ngay khi lượt chạy xanh; chỗ sửa nằm ở kho plugin.
  file: `tools/design-assembly/check.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert một chiều trong khi lời hứa là QUAN HỆ bằng nhau: «ghi hai lần đúng chín tên» chỉ được đo là «ít nhất chín tên»**
  Người dùng thấy gì: Bộ kiểm tra chỉ chứng minh công cụ cũ ghi trùng ít nhất chín tên chứ không chứng minh đúng chín. Kết quả hiện tại vẫn đúng, nên người dùng không bị ảnh hưởng.
  Căn cứ: Lời hứa đang đúng và chỉ là lưới an toàn hơi lỏng cho lần chấm sau; không có hại cho người dùng và sửa sau rẻ.
  file: `_acceptance/refresh-design-assembly-tool/rang/register-names-once.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 — tuyên «mỗi thông điệp lệch một ca» nhưng ma trận viết trước thiếu phần tử: hai dòng đỏ của names-once không có ca phá, không ghim thông điệp**
  Người dùng thấy gì: Bộ kiểm tra tự nhận mỗi kiểu báo lỗi đều đã được thử, nhưng hai kiểu chưa từng được thử, và con số tổng trong tài liệu lệch. Người dùng không thấy khác biệt.
  Căn cứ: Chỉ làm bộ kiểm tra kém chặt ở hai nhánh hiếm, không ảnh hưởng sản phẩm, thêm ca thử sau rẻ.
  file: `_acceptance/refresh-design-assembly-tool/rang/measures-two-way.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm tính một mình: khi khoảng commit rỗng, only-register-changed xanh mà không còn đối chứng dương**
  Người dùng thấy gì: Sau khi nhánh đã gộp, bộ kiểm tra «chỉ sổ linh kiện bị đổi» sẽ báo xanh dù không còn gì để so, nên không còn chứng minh được điều đó. Hiện trên nhánh đang kiểm nó vẫn đúng.
  Căn cứ: Chỉ xảy ra khi chạy lại sau gộp, nơi ghi chú hồ sơ đã báo trước phép đo sẽ được thay; hậu quả nhẹ và không mất dữ liệu.
  file: `_acceptance/refresh-design-assembly-tool/rang/only-register-changed.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
