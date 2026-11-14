# Review findings: bang-hang-theo-dia-ly (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: a high-tier file is changed with no recorded human approval**
  Người dùng thấy gì: Một thay đổi nhỏ ở tệp công cụ kiểm thử cần chữ ký của chủ kho mà chưa được ghi lại. Người dùng cuối không thấy gì khác đi.
  Căn cứ: Chỉ là thủ tục chữ ký, không ảnh hưởng người dùng, và chủ kho ghi nhận được trong một dòng sổ.
  file: `tools/e2e_templates/settle.ts`
  severity: medium
  Đề xuất: known-limits

- **SP-1 / SP-3 / SP-4: invariant signals scanned, none in scope**
  Người dùng thấy gì: Không có lỗi: kiểm tra cho thấy cây địa lý không thêm cách đọc dữ liệu hay đường gửi nào mới.
  Căn cứ: Đây chỉ là ghi chú đã kiểm, không có hậu quả nào với người dùng nên không cần làm gì.
  file: `src/modules/listings/ui/geo-tree.ts`
  severity: low
  Đề xuất: wont-fix

- **Domain: 'project' used in public types as a synonym for Subdivision**
  Người dùng thấy gì: Trong mã, khái niệm Dự án được gọi bằng một tên khác với từ điển nghiệp vụ. Người dùng không thấy khác biệt nào trên màn hình.
  Căn cứ: Chỉ ảnh hưởng người đọc mã về sau, không mất dữ liệu hay hỏng màn hình, và đổi tên lúc nào cũng rẻ.
  file: `src/modules/listings/ui/geo-tree.ts`
  severity: low
  Đề xuất: known-limits

- **Design: a module test imports from src/app**
  Người dùng thấy gì: Một bài kiểm thử đặt chưa đúng chỗ về cấu trúc mã. Người dùng không bị ảnh hưởng.
  Căn cứ: Không đụng tới hành vi sản phẩm, công cụ kiểm ranh giới vẫn xanh, dời chỗ sau này rất rẻ.
  file: `src/modules/listings/ui/geo-tree.test.ts`
  severity: low
  Đề xuất: known-limits

- **After a place is picked, pressing «Tất cả hàng» (or the status entry the grid opened with) does nothing: the grid stays filtered and the address gets the place back**
  Người dùng thấy gì: Sau khi chọn một toà, bấm «Tất cả hàng» ở cột bên không làm gì cả: bảng vẫn lọc theo toà đó. Người dùng phải bấm «Xoá lọc» mới quay về đủ 60 dòng.
  Căn cứ: Người dùng dễ tưởng ứng dụng bị treo nhưng không mất dữ liệu, và có cách thoát bằng «Xoá lọc» hay tải lại trang; nên làm thành việc riêng vì đây là lối đi thường gặp.
  file: `src/modules/listings/ui/inventory-grid.tsx`
  severity: high
  Đề xuất: new-contract

- **Cmd/Ctrl/Shift-click on a place entry is swallowed: no new tab, the grid is filtered in place**
  Người dùng thấy gì: Giữ Cmd hoặc Ctrl khi bấm một nơi sẽ không mở tab mới mà chỉ lọc bảng hiện tại. Đường dẫn vẫn chép và mở được bình thường.
  Căn cứ: Là thói quen của người dùng thành thạo, nhẹ, có cách vòng bằng cách chép đường dẫn, và không mất dữ liệu.
  file: `src/components/templates/app-shell/second-column.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): kiểm 'không count' và 'không geo-tree' trên data-slot mà mã không bao giờ vẽ**
  Người dùng thấy gì: Bài kiểm thử về «không có số đếm trên mục» có thể không bắt được lỗi nếu ai đó thêm số đếm sau này. Hiện người dùng không thấy số đếm nào.
  Căn cứ: Rủi ro chỉ nằm ở tương lai khi sửa mã, màn hình hiện tại đúng, và gia cố bài kiểm thử có thể làm lúc khác.
  file: `tests/dia-ly.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc) cộng hình dạng 4: ca phá 'toà rỗng' đẩy nút vào cây đã dựng thay vì vào danh mục**
  Người dùng thấy gì: Bài kiểm thử cho trường hợp toà không có căn nào chưa chứng minh chắc chắn rằng toà rỗng bị ẩn. Trên màn hình hiện không thấy toà rỗng nào.
  Căn cứ: Chỉ làm kiểm thử yếu hơn dự kiến, không gây lỗi cho người dùng và gia cố sau rất rẻ.
  file: `src/modules/listings/ui/geo-tree.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét lớp nhưng thiếu phần tử): đi theo import bỏ hai màn layout.tsx và inventory/page.tsx**
  Người dùng thấy gì: Bài quét xem cây có thêm cách đọc dữ liệu mới không bỏ sót hai màn. Hiện chưa thấy cách đọc mới nào được thêm.
  Căn cứ: Là khoảng hở trong lưới kiểm tra chứ không phải lỗi thật, người dùng không bị ảnh hưởng, và bổ sung sau rất rẻ.
  file: `tests/dia-ly.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (đếm thay cho quan hệ tập): E7 checkSame chỉ so số chân bảng và tên toà của dòng đang vẽ**
  Người dùng thấy gì: Bài kiểm trình duyệt so số dòng và tên toà thay vì từng dòng cụ thể. Một lỗi hiếm về dòng lẫn lộn có thể không bị bắt.
  Căn cứ: Chỉ làm lưới kiểm thử thưa hơn, chưa có dấu hiệu lỗi thật với người dùng, và gia cố sau không đắt.
  file: `tests/e2e-db/dia-ly.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 cộng 4: E8 'giữ lọc khác' tính từ dữ liệu của bài, không đọc ô Trạng thái; 10 nơi đếm theo chữ 'Tất cả' dùng chung**
  Người dùng thấy gì: Bài kiểm về việc giữ lọc «Đang bán» khi chọn toà chưa đọc trực tiếp ô Trạng thái trên màn hình. Nếu lọc này mất, bài kiểm có thể không báo.
  Căn cứ: Rủi ro nằm ở việc lỗi tương lai lọt qua, không phải lỗi hiện tại, và có thể gia cố kiểm thử mà không đụng đến sản phẩm.
  file: `tests/e2e-db/dia-ly.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5: E10 hứa đối chứng ô lọc chữ của Đã gửi nhưng không có ca nào**
  Người dùng thấy gì: Ô lọc chữ của màn Đã gửi chưa có bài kiểm riêng cho việc bỏ dấu và hoa thường. Chưa thấy dấu hiệu nó hoạt động sai.
  Căn cứ: Chỉ là một khoảng trống kiểm thử, ô lọc này không đổi trong hàng này và thêm một ca kiểm rất rẻ.
  file: `tests/dia-ly.test.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
