# Review findings: english-query-words (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: high (protected tools/ paths), needs a code owner to merge**
  Người dùng thấy gì: Thay đổi này chạm các cổng kiểm của kho nên phải có chủ mã duyệt mới gộp được, không tự gộp. Người dùng cuối không thấy khác biệt nào.
  Căn cứ: Chỉ là bước duyệt theo quy trình, không ảnh hưởng người dùng, không mất dữ liệu; chủ mã duyệt là xong và không tốn công sửa.
  file: `tools/proof_gate/check.py`
  severity: medium
  Đề xuất: known-limits

- **Records: the screen-register rename rule (old_ids) has no decision page**
  Người dùng thấy gì: Lý do của luật giữ mã màn cũ khi đổi tên màn chỉ nằm trong tài liệu thiết kế, chưa có trang quyết định riêng. Người dùng không bị ảnh hưởng, nhưng người làm sau khó tìm lý do hơn.
  Căn cứ: Thiếu hồ sơ chứ không sai hành vi, người dùng không thấy gì; bổ sung sau rất rẻ và không có rủi ro mất dữ liệu.
  file: `design/screens/_shared.yaml`
  severity: low
  Đề xuất: known-limits

- **Domain: one rule in one place, the prototype's query word is written twice**
  Người dùng thấy gì: Công tắc quyền của bản mẫu hành vi hiện chạy đúng, nhưng tên của nó được viết ở hai chỗ nên sau này đổi một chỗ có thể quên chỗ kia. Hiện người dùng chưa gặp lỗi nào.
  Căn cứ: Hiện chạy đúng nên người dùng không bị ảnh hưởng, chỉ là rủi ro lệch khi sửa sau; sửa rẻ nhưng không gấp.
  file: `src/app/(app)/proto/[slug]/page.tsx`
  severity: low
  Đề xuất: known-limits

- **Đo chỉ dẫn thay vì đầu ra: ca 'ghi: record-panel' chỉ so hằng RECORD_PARAM với QUERY_WORD.record**
  Người dùng thấy gì: Bài kiểm việc mở và đóng ngăn hồ sơ căn chưa thật sự thử địa chỉ được ghi ra, nên nếu sau này có lỗi ở đó thì bài kiểm này có thể không bắt được. Hiện sản phẩm không có lỗi đã biết.
  Căn cứ: Là lỗ hổng phát hiện lỗi trong tương lai, không phải lỗi người dùng đang gặp; không mất dữ liệu và có thể bổ sung bài kiểm sau.
  file: `tests/old-query-words.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Lớp 'từ cũ không lọc' chỉ có ca dương: thiếu assert cho phía âm mà eval tuyên bố**
  Người dùng thấy gì: Chưa có bài kiểm nào xác nhận rằng từ tìm kiếm cũ, khi đứng một mình, không còn tự lọc bảng hàng. Nếu có lỗi thì người dùng có thể thấy lọc cũ vẫn chạy ngoài ý muốn mà không bài kiểm nào báo.
  Căn cứ: Hậu quả nhẹ, chỉ là bộ lọc cũ có thể còn tác dụng, người dùng tải lại hay bỏ liên kết là xong; bổ sung bài kiểm rẻ.
  file: `tests/old-query-words.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm tính đứng một mình, đúng hiển nhiên; fixture viết tay thay cho round-trip ở 'dang-nhap-next'**
  Người dùng thấy gì: Bài kiểm đường đi từ liên kết cũ qua trang đăng nhập rồi về đúng chỗ chưa nối hai bước với nhau, nên một lỗi ở giữa có thể lọt. Chưa có lỗi nào được chứng minh.
  Căn cứ: Chỉ làm bài kiểm yếu đi, người dùng không gặp lỗi hiện tại; phần này còn được ca trình duyệt phủ và sửa sau rẻ.
  file: `tests/old-query-words.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Chỉ assert 'có mặt' trong khi lời hứa là quan hệ: cây địa lý chỉ kiểm có khoá place**
  Người dùng thấy gì: Một bài kiểm chỉ xem liên kết cây địa lý có mang từ nơi mà không so giá trị. Giá trị đúng đã được một bài kiểm khác phủ nên người dùng không bị ảnh hưởng.
  Căn cứ: Đã có bài kiểm khác phủ đúng điều này nên rủi ro thực tế gần bằng không; công sửa không đáng.
  file: `tests/old-query-words.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Chỉ assert 'có mặt' trong khi lời hứa là quan hệ: lien-ket-cu chỉ kiểm next có 'place='**
  Người dùng thấy gì: Bài kiểm mở liên kết cũ có nơi qua trang đăng nhập chỉ xem từ nơi còn đó mà không so giá trị. Nếu bước dịch làm đổi nơi, bài kiểm này có thể không báo.
  Căn cứ: Người dùng chưa gặp lỗi; nếu có thì họ thấy sai nơi và tự chọn lại được, không mất dữ liệu; bổ sung so sánh rẻ.
  file: `tests/e2e-db/bang-hang-that.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Assertion âm tính đứng một mình: 'closed contract passes — proof gate' không ghim exit code của lượt chạy chính**
  Người dùng thấy gì: Một bài kiểm cổng cho hồ sơ đã đóng không kiểm mã thoát nên nếu cổng sập thì bài vẫn xanh. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Ca cùng loại ở công cụ ma trận độ phủ đã ghim mã thoát và đây chỉ là công cụ nội bộ; hậu quả rất nhẹ nên không đáng công sửa.
  file: `tests/screen-old-ids.test.ts`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
