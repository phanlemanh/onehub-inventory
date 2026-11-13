# Review findings: sua-tren-o (round 4)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Authorization (check 6): moving a status in the cell skips the activateListing permission**
  Người dùng thấy gì: Một Đầu khách hoặc đầu chủ không giữ căn có thể đưa căn lên trạng thái đang bán, dù bảng quyền chỉ cho đầu chủ của căn và Trưởng nhóm. Hiện việc ghi mới chạm dữ liệu mẫu nên chưa ảnh hưởng dữ liệu thật.
  Căn cứ: Chưa gây hại vì chưa ghi dữ liệu thật, nhưng phải sửa trước khi nối đường ghi thật; sửa thuộc một tính năng riêng về quyền theo từng nấc.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: new-contract

- **Domain (check 3): new business rules in code are missing from ontology/**
  Người dùng thấy gì: Các luật chuyển trạng thái, khoá căn đã bán và hỏi lại khi giá lệch lớn chỉ được ghi ở tài liệu, chưa ở danh mục khái niệm gốc. Người dùng không thấy khác biệt nào.
  Căn cứ: Người dùng không bị ảnh hưởng; đây là nợ tài liệu, bổ sung sau rẻ và không mất dữ liệu.
  file: `src/modules/listings/edit-rules.ts`
  severity: medium
  Đề xuất: known-limits

- **Authorization and input (check 6): the role can be set from the address with ?vai= on the Inventory screen**
  Người dùng thấy gì: Ở bản thử hoặc bản dev, ai mở được địa chỉ đều có thể tự chọn vai bằng đường dẫn mà không cần đăng nhập. Bản chính thức vẫn được chặn.
  Căn cứ: Hiện chỉ chạm dữ liệu mẫu nên nhẹ, nhưng thành rủi ro thật khi bản thử có dữ liệu thật; nên dọn trước khi nối đường ghi thật.
  file: `src/app/(app)/inventory/page.tsx`
  severity: low
  Đề xuất: new-contract

- **Product language: words that belong to labels are typed directly in src/**
  Người dùng thấy gì: Một vài câu thông báo dùng chữ cố định như «chủ nhà» nên với căn cho thuê có thể hiện sai từ. Chỉ là lệch từ ngữ, không mất dữ liệu.
  Căn cứ: Nhẹ, chỉ sai chữ trong vài câu; người dùng vẫn hiểu và sửa sau rẻ.
  file: `src/modules/listings/ui/cell-edit-copy.ts`
  severity: low
  Đề xuất: known-limits

- **Design (check 9): a rule refusal is reported to the user as a permission refusal**
  Người dùng thấy gì: Trong vài ca hiếm, như gõ giá dưới một triệu, người dùng bị báo là không đủ quyền trong khi lý do thật là giá không hợp lệ. Giá cũ vẫn được giữ.
  Căn cứ: Lời báo sai lý do gây khó hiểu nhưng không mất dữ liệu và người dùng nhập lại được; sửa vừa phải.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: known-limits

- **Undo puts back price, status and confirmed time together, not just the field that was edited, so the grid stops matching the store**
  Người dùng thấy gì: Nếu sửa giá, rồi đổi trạng thái, rồi bấm Hoàn tác giá, bảng có thể hiện trạng thái cũ trong khi dữ liệu đã ở trạng thái mới. Lần đổi trạng thái kế tiếp sẽ bị từ chối với lời báo sai.
  Căn cứ: Có lệch hiển thị so với dữ liệu nhưng chỉ khi thao tác xen kẽ trong thời gian ngắn, tải lại trang là hết; chưa ghi thật nên chưa mất dữ liệu.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: new-contract

- **Any TypeError thrown inside a write is treated as «offline», with no log**
  Người dùng thấy gì: Một lỗi lập trình bất ngờ có thể bị báo là mất mạng và không được ghi lại, khiến khó phát hiện lỗi thật. Người dùng chỉ thấy lời báo mất mạng.
  Căn cứ: Chỉ ảnh hưởng khi có lỗi lập trình hiếm gặp, người dùng thử lại được; chủ yếu làm khó việc dò lỗi.
  file: `src/lib/write-failure.ts`
  severity: medium
  Đề xuất: known-limits

- **An `invalid` answer from the save door is quietly shown as a permission refusal**
  Người dùng thấy gì: Khi một thay đổi vi phạm luật, ví dụ hoàn tác giá sau khi căn đã bán, người dùng bị báo thiếu quyền thay vì lý do thật, và lý do không được ghi lại.
  Căn cứ: Gây hiểu nhầm nhưng không mất dữ liệu, ca hiếm; người dùng tải lại là thấy đúng trạng thái.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: low
  Đề xuất: known-limits

- **After a conflict the row's version is never refreshed, so every later save of that row conflicts again**
  Người dùng thấy gì: Khi hai người cùng sửa một căn trên đường ghi thật, người bị xung đột sẽ bị kẹt cho tới khi tải lại trang. Hiện chưa xảy ra vì chỉ có dữ liệu mẫu.
  Căn cứ: Chưa xảy ra hôm nay và tải lại trang là gỡ được; hợp đồng đã hoãn phần này sang hàng nối đường ghi thật.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (và 2): bài 'hoan-tac-hong-bao-ro' ở use-change đòi một chuỗi mà chính fixture viết sẵn, không đo quan hệ giữa lời báo và giá ô đang hiện**
  Người dùng thấy gì: Một bài kiểm về lời báo khi hoàn tác hỏng không thể đỏ dù lời báo nêu sai căn hay sai giá, nên có thể bỏ lọt lỗi cho hai ca lỗi mạng và bị từ chối.
  Căn cứ: Không ảnh hưởng người dùng trực tiếp, chỉ làm lưới an toàn yếu hơn; củng cố bài kiểm sau rẻ.
  file: `src/components/candidate/use-change.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2: khuôn lỗi 'navigator.onLine false' được viết tay cho vừa nhánh đọc, không đi qua đường ghi thật**
  Người dùng thấy gì: Một bài kiểm dùng lỗi mất mạng dựng tay không giống lỗi thật của đường ghi, nên đo kém chặt cho nhánh dự phòng.
  Căn cứ: Không ảnh hưởng người dùng; nhánh này chỉ là dự phòng và đã có bài khác đo lỗi thật, chi phí sửa không đáng.
  file: `src/components/candidate/use-change.test.tsx`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 5: 'cot-chi-doc' tuyên duyệt ma trận 8 cột × 3 lối vào, nhưng chỉ đo 8 giá trị gộp bằng HOẶC**
  Người dùng thấy gì: Bài kiểm các cột chỉ-đọc chỉ thử một lối vào cho hai cột sửa được, nên nếu gõ hoặc bấm đúp hỏng trên ô Giá thì bài vẫn xanh.
  Căn cứ: Rủi ro là bỏ sót lỗi sau này, chưa phải lỗi hiện có; bổ sung ca kiểm là việc rẻ.
  file: `tests/e2e/sua-tren-o.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: lời hứa ghim thông điệp trong evals không khớp thông điệp bài thật in ra**
  Người dùng thấy gì: Mô tả trong sổ đo không khớp chữ với thông điệp bài kiểm in ra, nên người chấm có thể không tìm thấy chuỗi đã hứa.
  Căn cứ: Không chạm người dùng cuối, chỉ lệch chữ trong tài liệu nội bộ; sửa không đáng công.
  file: `_acceptance/sua-tren-o/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 4: câu kiểm âm 'cổng lưu 0 lần' đọc một lần ngay sau thao tác, trong khi phía dương của cùng tệp phải chờ lặp**
  Người dùng thấy gì: Một bài kiểm khẳng định không có lần ghi nào chỉ nhìn một lần ngay sau thao tác, nên một lần ghi sai đến trễ vẫn lọt qua.
  Căn cứ: Chỉ làm lưới kiểm yếu hơn ở một ca hiếm; người dùng không bị ảnh hưởng và thêm chờ lặp là việc rẻ.
  file: `tests/e2e/sua-tren-o.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
