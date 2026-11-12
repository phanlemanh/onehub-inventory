# Review findings: app-shell-chon-tu-reui (round 5)

## Trong hợp đồng

Không có finding nào ở mục này.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Thứ tự trạng thái của tin rao bị định nghĩa lại lần thứ ba, và lệch với danh sách sẵn có**
  Người dùng thấy gì: Ở cột thứ hai, hai trạng thái «Đã đóng» và «Tạm giữ» có thể nằm khác thứ tự so với màn Bảng hàng. Đủ trạng thái và bấm vào vẫn đúng.
  Căn cứ: Chỉ lệch thứ tự hiển thị, không mất hay sai dữ liệu, người dùng vẫn tìm đúng mục; sẽ sửa cùng bộ lọc trạng thái của hàng sau nên sửa riêng bây giờ là tốn thừa.
  file: `src/app/(app)/nav.ts`
  severity: medium
  Đề xuất: known-limits

- **Tên cookie dùng tiếng Việt không dấu, trái luật định danh phải bằng tiếng Anh**
  Người dùng thấy gì: Người dùng không thấy khác gì: cột thứ hai vẫn nhớ đang mở hay gập. Chỉ là tên lưu trong trình duyệt đặt chưa đúng quy ước tiếng Anh của đội.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; đổi về sau chỉ làm một số người phải bấm lại tay nắm cột một lần, nên chi phí thấp.
  file: `src/components/templates/app-shell/column-cookie.ts`
  severity: low
  Đề xuất: known-limits

- **Tên file test e2e dùng tiếng Việt không dấu**
  Người dùng thấy gì: Người dùng không bị ảnh hưởng. Chỉ có một tệp kiểm thử đặt tên chưa theo quy ước tiếng Anh của đội.
  Căn cứ: Không đụng tới sản phẩm đang chạy; đổi tên lúc nào cũng rẻ và không rủi ro.
  file: `tests/e2e-db/app-shell-doi-san.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Company switch fails silently: a failed request is ignored and a network error leaves the control disabled for good**
  Người dùng thấy gì: Nếu mất mạng hoặc phiên hết hạn đúng lúc đổi sàn, nút đổi sàn có thể bị khoá và không báo gì. Người dùng phải tải lại trang mới dùng lại được.
  Căn cứ: Chỉ xảy ra khi đổi sàn lúc mạng lỗi, không mất dữ liệu, và tải lại trang là gỡ được; người nhiều sàn ít gặp nên chấp nhận ghi lại.
  file: `src/app/(app)/company-switch.tsx`
  severity: medium
  Đề xuất: known-limits

- **Sign-out is no longer disabled while a company switch is in flight**
  Người dùng thấy gì: Nếu bấm đăng xuất đúng lúc đang đổi sàn, việc đổi sàn có thể chạy dở rồi trang làm mới sau khi đã thoát. Người dùng chỉ thấy màn đăng nhập hoặc phải thử lại.
  Căn cứ: Cần bấm hai thao tác trong khoảnh khắc rất ngắn; hậu quả nhẹ, không lộ hay mất dữ liệu, và tải lại là xong.
  file: `src/app/(app)/account-menu.tsx`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4): kiểm 'không có ô Gõ mã căn' bằng locator role=button, không thể bắt được một ô nhập**
  Người dùng thấy gì: Nếu một ô gõ mã căn vô tình hiện lên thanh trên, bài kiểm tự động có thể không báo. Người dùng sẽ thấy một ô chưa có chức năng.
  Căn cứ: Là lỗ hổng của bài kiểm chứ không phải lỗi sản phẩm hiện tại; nếu có xảy ra thì người dùng chỉ thấy một ô thừa, không mất dữ liệu.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Assert 'chuỗi/vùng có mặt' trong khi lời hứa là QUAN HỆ (hình 3): cột thứ hai chỉ được kiểm là hiện, không kiểm nó mang tên màn đang mở**
  Người dùng thấy gì: Bài kiểm chỉ xác nhận cột thứ hai có hiện, chưa xác nhận tên cột đúng với màn đang mở. Nếu tên cột sai, người dùng thấy tiêu đề lạc màn.
  Căn cứ: Chỉ là tiêu đề cột có thể sai chữ, không mất dữ liệu và không chặn việc dùng; sửa bài kiểm sau vẫn rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hàm mở ngăn trên điện thoại bị chép nguyên từ bộ kiểm khung chung thay vì dùng chung một chỗ (r4)**
  Người dùng thấy gì: Người dùng không thấy khác gì. Chỉ là cách mở ngăn trượt trên điện thoại trong bài kiểm có hai bản giống nhau, nên sau này sửa một bên mà quên bên kia thì bài kiểm có thể báo sai.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉ làm việc bảo trì bài kiểm về sau dễ lệch, gom lại lúc nào cũng rẻ và không gấp.
  file: `tests/e2e/app-shell.spec.ts`
  severity: low
  Đề xuất: known-limits

- **luat-cham.json 'den' points at the commit before the round-1 fix, not HEAD (r2)**
  Người dùng thấy gì: The grading record may stop one commit early, so the last small fixes to the phone menu might not be reviewed in the next round. Staff using the app see no difference.
  Căn cứ: It has no effect on users and can be fixed by editing one line at any time, so it is enough to note it and move on.
  file: `_acceptance/app-shell-chon-tu-reui/luat-cham.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): cổng chờ animation getAnimations().length === 0 trước khi chụp khung ngăn trượt không có đối chứng dương (r2)**
  Người dùng thấy gì: The automatic check before taking the phone-menu picture could pass even when the menu is not open, so a wrong picture could slip through again. Staff using the app are not affected directly.
  Căn cứ: It only affects the reliability of our own checks, not users, and the real defect (the wrong picture) is handled separately; the check can be hardened later at low cost.
  file: `tests/e2e/app-shell.spec.ts`
  severity: high
  Đề xuất: known-limits

- **nav.ts keeps a second copy of the listing status list, in a different order from the listings module (r1)**
  Người dùng thấy gì: Danh sách trạng thái hàng ở cột thứ hai có thể xếp khác thứ tự so với màn Bảng hàng. Nhân viên thấy hai thứ tự khác nhau, nhưng mọi trạng thái vẫn đủ và bấm vẫn đúng.
  Căn cứ: Hậu quả nhẹ: chỉ lệch thứ tự hiển thị, không mất hay sai dữ liệu; sửa sau rẻ và nên làm cùng hàng Bảng hàng khi có bộ lọc trạng thái thật.
  file: `src/app/(app)/nav.ts`
  severity: medium
  Đề xuất: known-limits

- **Company switch locks up and fails silently when the request errors (r1)**
  Người dùng thấy gì: Nếu mất mạng hoặc phiên hết hạn đúng lúc đổi sàn, nút đổi sàn có thể bị khoá và không báo lỗi gì. Người dùng phải tải lại trang mới đổi được.
  Căn cứ: Hậu quả vừa nhưng không mất dữ liệu và người dùng tự gỡ được bằng cách tải lại trang; tình huống hiếm và lỗi này đã có sẵn từ menu tài khoản cũ.
  file: `src/app/(app)/company-switch.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: assert 'chuỗi có mặt' (tên không rỗng) trong khi lời hứa là quan hệ tên mục = nhãn màn (r1)**
  Người dùng thấy gì: Bài kiểm chưa bắt được trường hợp hai biểu tượng bị tráo tên cho nhau. Người dùng chỉ gặp điều này nếu sau này ai đó vô tình đảo nhãn.
  Căn cứ: Sản phẩm hiện không sai; đây là lưới an toàn hơi lỏng, nếu có lỗi thì người dùng thấy ngay trên màn và sửa rất rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: assertion âm tính đứng một mình, không có đối chứng dương. Ô «Gõ mã căn» được tìm theo vai button nên bài không bao giờ bắt được nó (r1)**
  Người dùng thấy gì: Bài kiểm có thể không phát hiện nếu ô gõ mã căn vô tình xuất hiện trên thanh trên khi chưa có hồ sơ căn. Hiện tại ô này không được làm nên người dùng không bị ảnh hưởng.
  Căn cứ: Hiện chưa có hậu quả cho người dùng vì ô ấy không tồn tại; chỉ là lưới kiểm bỏ sót, sửa sau rẻ khi hàng có hồ sơ căn mở.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3: assert 'chuỗi có mặt' bị thoả sẵn, không đo được tiêu đề nhóm của cột thứ hai (r1)**
  Người dùng thấy gì: Nếu tiêu đề nhóm ở cột thứ hai biến mất, bài kiểm vẫn xanh. Người dùng chỉ mất một dòng chữ phân nhóm, các lối tắt vẫn dùng được.
  Căn cứ: Hậu quả rất nhẹ, chỉ ảnh hưởng nhãn phân nhóm và không mất chức năng hay dữ liệu; sửa sau rẻ.
  file: `tests/app-shell.test.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
