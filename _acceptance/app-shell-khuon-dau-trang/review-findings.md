# Review findings: app-shell-khuon-dau-trang (round 2)

## Trong hợp đồng

- **Hình dạng 4 (assertion âm tính một mình): phép đo 'chữ gợi ý không bị cắt' không thể đỏ và không có bài đối chứng**
  AC: AC-3
  file: `tests/e2e/app-shell.spec.ts:261`
  severity: medium
  source: measurement
  detail: `expect(await hint.evaluate((e) => e.scrollWidth - e.clientWidth)).toBeLessThanOrEqual(0)` đo trên `[data-slot="unit-jump"] button span` (thẻ span chứa chữ gợi ý, unit-jump.tsx). Thẻ span này là phần tử con của nút inline-flex `whitespace-nowrap`, không có `min-w-0`, `truncate` hay `overflow-hidden`. Phần tử con flex có min-width:auto nên không bao giờ hẹp hơn nội dung: nếu chữ dài quá thì nút tràn ra ngoài khung w-80, còn scrollWidth của span vẫn bằng clientWidth. Vì vậy assert này luôn xanh. Các phép đo khác trong cùng tệp đều có bài 'chiều đỏ' (assertCentred, assertOnEdge, assertThinHead), riêng phép đo này không có: không có ca dương chứng minh phép đo bắt được chữ bị cắt, cũng không ghim thông điệp. E3 trong evals.yaml lại nêu 'chữ gợi ý scrollWidth - clientWidth ≤ 0' như một bằng chứng của AC-3.
  rationale: AC-3 đòi câu gợi ý hiện trọn không bị cắt, mà phép đo duy nhất cho vế này luôn xanh nên vế ấy không được chứng minh.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: high-tier change (protected paths) needs code-owner approval, agent may not merge**
  Người dùng thấy gì: Thay đổi chạm hai tệp được bảo vệ nên cần chủ mã duyệt trước khi gộp. Người dùng cuối không thấy khác biệt nào.
  Căn cứ: Chỉ là bước duyệt của người, không ảnh hưởng người dùng, không mất dữ liệu và làm được ngay lúc gộp.
  file: `eslint.config.js`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests / Records: sign-in word lock re-pinned with no post-signature record in the signed row**
  Người dùng thấy gì: Hồ sơ đăng nhập đã ký còn ghi một lời hứa cũ về việc khoá chữ, nay không còn đúng. Người dùng cuối không bị ảnh hưởng, chỉ người đọc hồ sơ có thể bị nhầm.
  Căn cứ: Chỉ lệch sổ sách, người dùng không gặp gì, bổ sung một tệp ghi chú là rẻ và làm sau được.
  file: `tests/dang-nhap-giu-loi.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: error/retry frame checks loosened, phone navigation trigger no longer asserted**
  Người dùng thấy gì: Nếu trang báo lỗi toàn màn lại che mất nút mở menu trên điện thoại thì bài thử sẽ không phát hiện. Hiện chưa thấy lỗi như vậy xảy ra.
  Căn cứ: Chỉ là khoảng hở trong bài thử cho tình huống hiếm, người dùng tải lại được, sửa bài thử rẻ nhưng không cấp bách.
  file: `tests/e2e/frame.spec.ts`
  severity: low
  Đề xuất: known-limits

- **The centred search box is taken out of the layout, so a long company name can run underneath it on the desktop**
  Người dùng thấy gì: Trên máy tính bảng và màn 1024, sàn có tên rất dài có thể chạy chồng lên ô tìm ở thanh trên, khiến tên và nút tìm khó đọc, khó bấm.
  Căn cứ: Chỉ xảy ra với tên sàn dài, chữ vẫn đọc được phần lớn và không mất dữ liệu, nhưng nhìn lộn xộn và cần sửa bố cục nên đáng làm thành việc riêng.
  file: `src/components/templates/app-shell.tsx`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): bài đơn vị kiểm tên lớp Tailwind thay vì hành vi mà tiêu đề hứa**
  Người dùng thấy gì: Một bài thử nhanh chỉ đọc tên kiểu chứ không đo thật, nên có thể bỏ lọt một lỗi hiển thị. Bài thử trên trình duyệt thật vẫn bắt được.
  Căn cứ: Đã có lớp kiểm thật phía sau nên hậu quả nhẹ, không mất dữ liệu, sửa rẻ nhưng ít giá trị.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): bài '⌘B không mở dải' không có đối chứng dương rằng phím tắt tới được bộ xử lý**
  Người dùng thấy gì: Bài thử kiểm phím tắt không mở dải có thể xanh dù phím không tới nơi. Hiện dải vẫn đúng là không mở thành cột chữ trên máy tính.
  Căn cứ: Hành vi người dùng đang đúng và lỗi chỉ có thể xảy ra nếu ai đó đổi mã sau này, nên thêm đối chứng không đáng chi phí.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
