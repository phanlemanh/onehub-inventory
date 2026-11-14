# Review findings: ngan-chi-tiet-ghim-thanh-cot (round 1)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Criteria and tests: the guard that keeps company data out of the pin cookie is never used by the app**
  Người dùng thấy gì: Hiện tại ghi nhớ trạng thái ghim không mang dữ liệu căn nào ra máy người dùng. Chỉ là một lớp bảo vệ dự phòng chưa được nối vào, nên sau này sửa sai thì có thể không bị bắt sớm.
  Căn cứ: Không có dữ liệu nào bị lộ và không ảnh hưởng người dùng; chỉ là lưới an toàn thừa, sửa sau cũng rẻ nên chấp nhận ghi vết.
  file: `src/components/candidate/record-pin.ts`
  severity: low
  Đề xuất: wont-fix

- **Pinned layout uses stale work-area bounds after the App Shell sidebar is expanded or collapsed**
  Người dùng thấy gì: Ở cửa sổ vừa phải, nếu đang ghim hồ sơ rồi mở rộng thanh bên trái, hồ sơ vẫn ghim và bảng bị ép còn rất hẹp. Người dùng phải bỏ ghim hoặc tải lại trang để màn trở lại bình thường.
  Căn cứ: Gặp được khi đổi thanh bên lúc đang ghim ở cửa sổ vừa, làm bảng hẹp khó dùng nhưng không mất dữ liệu và tải lại là xong; sửa khá rẻ nhưng không chặn việc giao.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm tính một mình (4): ca đối chứng E8 'Esc trên cả trang' không chạy bộ kiểm thật, tự ném thông điệp**
  Người dùng thấy gì: Một bài kiểm tra tự động cho việc bấm Esc ở bảng không đóng hồ sơ ghim chưa chứng minh được là nó bắt đúng lỗi. Người dùng không thấy gì khác đi, nhưng nếu sau này lỗi này xuất hiện thì có thể không bị phát hiện kịp.
  Căn cứ: Không ảnh hưởng người dùng hiện tại, chỉ làm lưới kiểm thử kém tin cậy; sửa test rẻ và làm sau được.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Fixture viết tay đúng khuôn bên đọc (2): ca đối chứng E5 đưa số 200 gõ tay vào assertWidthBounds**
  Người dùng thấy gì: Bài kiểm tra giới hạn độ rộng cột ghim dùng một con số gõ tay nên chưa chắc bắt được lỗi cột hẹp hơn mức cho phép. Người dùng chưa gặp vấn đề, chỉ là độ tin cậy của kiểm tra thấp hơn mong muốn.
  Căn cứ: Không có hậu quả trực tiếp cho người dùng và không mất dữ liệu; chỉ làm kiểm thử kém chắc, sửa sau không đắt.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Fixture viết tay đúng khuôn bên đọc (2): ca đối chứng 'remount' của E2 tự đặt scrollTop=0 thay vì dựng bản gắn lại cây**
  Người dùng thấy gì: Bài kiểm tra việc giữ vị trí cuộn khi đổi giữa nổi và ghim chưa thật sự mô phỏng lỗi mất vị trí cuộn. Nếu sau này vị trí cuộn bị mất thì kiểm tra có thể không báo.
  Căn cứ: Hiện không có lỗi người dùng thấy được; chỉ là lưới kiểm thử yếu, dễ bổ sung sau.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Fixture viết tay đúng khuôn bên đọc (2): ca đối chứng assertNoRecordData ghép chuỗi bằng tay, hàm kiểm chỉ có test dùng**
  Người dùng thấy gì: Bài kiểm tra việc cookie ghim không mang dữ liệu căn tự dựng chuỗi chứ không đi qua đường ghi thật. Hiện cookie vẫn sạch nên người dùng không bị ảnh hưởng.
  Căn cứ: Không lộ dữ liệu và không ảnh hưởng người dùng, chỉ làm kiểm tra kém chặt; chi phí sửa lớn hơn hậu quả nên chấp nhận.
  file: `tests/ghim-ngan.test.ts`
  severity: medium
  Đề xuất: wont-fix

- **Assertion âm tính một mình (4): E1 ở khổ 768 chỉ kiểm 'không có nút ghim', thiếu vế dương khi gập cột hai**
  Người dùng thấy gì: Ở cửa sổ cỡ máy tính bảng, chưa có bài kiểm tra xác nhận nút Ghim hiện ra khi đủ chỗ. Nếu nút không bao giờ hiện thì người dùng sẽ không ghim được, nhưng kiểm tra không báo.
  Căn cứ: Chưa có bằng chứng nút bị mất, chỉ thiếu kiểm tra; nếu có lỗi thì người dùng tự gặp ngay và hậu quả nhẹ, sửa test rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm tính một mình (4): quét axe E8 không có ca đối chứng dương**
  Người dùng thấy gì: Lần quét trợ năng cho hồ sơ ghim chưa được chứng minh là bắt được lỗi thật nên kết quả sạch có thể chưa đáng tin hoàn toàn. Người dùng dùng trình đọc màn hình có thể gặp lỗi mà kiểm tra không phát hiện.
  Căn cứ: Chưa thấy lỗi trợ năng cụ thể, chỉ độ tin cậy của phép quét; có thể kiểm tay thêm và bổ sung test sau với chi phí thấp.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Assertion âm tính một mình (4): sau 'Đóng', E3 kiểm 'vùng dữ liệu đủ rộng' bằng một bất đẳng thức luôn đúng**
  Người dùng thấy gì: Bài kiểm tra bảng có nở lại đủ rộng sau khi đóng hồ sơ chưa thật sự đo bề rộng nên có thể bỏ sót nếu bảng vẫn chừa khoảng trống. Người dùng sẽ thấy bảng hẹp thừa nếu lỗi này có thật.
  Căn cứ: Chưa có bằng chứng lỗi, nếu có thì nhìn thấy ngay và tải lại là hết; sửa test rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Quét lớp chỉ bằng ca lẻ (5): E8 'Esc trong lưới không đóng hồ sơ' thiếu ô đang sửa mà eval liệt kê**
  Người dùng thấy gì: Chưa có bài kiểm tra tự động cho việc bấm Esc khi đang sửa một ô giá thì chỉ huỷ lần sửa mà hồ sơ ghim vẫn giữ. Nếu hành vi này hỏng, người dùng có thể mất hồ sơ đang xem khi huỷ sửa ô.
  Căn cứ: Chưa thấy lỗi thật, chỉ thiếu kiểm tra; nếu xảy ra thì hồ sơ mở lại được ngay, không mất dữ liệu, thêm test rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Assert 'chuỗi có mặt' thay cho quan hệ (3): assertPinPlace không kiểm thứ tự Sau trước Đóng và số nút ghim**
  Người dùng thấy gì: Bài kiểm tra thứ tự các nút ở đầu hồ sơ chưa chặt nên nếu nút Sau và Đóng đổi chỗ hoặc có hai nút Ghim thì có thể không bị báo. Người dùng sẽ chỉ thấy bố cục nút lệch so với thiết kế.
  Căn cứ: Chỉ ảnh hưởng thẩm mỹ nếu có lỗi, không mất dữ liệu, người dùng vẫn dùng được; sửa test rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
