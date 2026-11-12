# Review findings: bang-hang-dung-tay-nhu-sheet (round 1)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The status order, a listing business rule, lives in a shared grid component and is pulled into the App Shell nav and the listings module from there**
  Người dùng thấy gì: Người dùng thấy các trạng thái đúng thứ tự trên mọi màn hiện nay. Nguy cơ là về sau sửa thứ tự ở một nơi mà quên nơi kia thì hai danh sách lệch nhau.
  Căn cứ: Hiện chưa ai thấy lỗi gì, chỉ là rủi ro bảo trì về sau, và dời chỗ định nghĩa có thể làm sau mà không mất dữ liệu.
  file: `src/components/candidate/grid-view.ts`
  severity: medium
  Đề xuất: known-limits

- **When no row matches, the search box jumps to another spot in the page, so focus is lost mid-typing, and the column filter boxes disappear**
  Người dùng thấy gì: Khi gõ một luật lọc ra không còn dòng nào, ô tìm kiếm và các ô lọc cột biến mất, người dùng mất chỗ đang gõ và không sửa được riêng luật sai, chỉ có thể xoá hết mọi lọc rồi làm lại.
  Căn cứ: Gây khó chịu rõ khi dùng bằng tay, nhưng không mất dữ liệu và người dùng thoát được bằng «Xoá lọc»; sửa tương đối rẻ nên nên đăng thành việc riêng.
  file: `src/components/candidate/data-region.tsx`
  severity: high
  Đề xuất: new-contract

- **Leaving the page while in full screen leaves the App Shell hidden for good**
  Người dùng thấy gì: Nếu người dùng quay lại trang khác bằng phím hay cử chỉ khi đang toàn màn hình, màn kế tiếp hiện không có thanh điều hướng và đầu màn, và Esc cũng không khôi phục được cho đến khi tải lại trang.
  Căn cứ: Không mất dữ liệu và tải lại trang là thoát được, nhưng người dùng có thể tưởng ứng dụng hỏng; chỉ gặp ở một đường đi hẹp.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: new-contract

- **Assertion âm-tính-một-mình (hình 4): kiểm tra đối chứng ở dòng 174 không bao giờ chạy**
  Người dùng thấy gì: Người dùng không thấy gì khác đi; chỉ là một phép kiểm chép vùng ô không thật sự chạy nên một lỗi chép sai có thể lọt qua mà không bị bắt.
  Căn cứ: Không ảnh hưởng người dùng ngay, phép kiểm âm còn lại vẫn chạy, và sửa chỉ là thêm một cặp dấu ngoặc nên ghi lại rồi sửa sau.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Fixture lấy từ chính bên đọc (hình 2): chuỗi kỳ vọng của phép chép (E2 b) đọc từ DOM, không dựng từ dữ liệu**
  Người dùng thấy gì: Nếu giá hay trạng thái hiển thị sai thì phép kiểm chép vẫn báo đạt, vì nó so với chính thứ đang hiển thị.
  Căn cứ: Phần chép khớp với ô hiện là đúng yêu cầu AC-2, rủi ro chỉ là bỏ sót lỗi hiển thị giá, và người dùng tự nhìn ra được.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4): ca phá toàn màn hình nhận cả hai thông điệp, nên phép kiểm menu chưa từng được chứng minh là bắt lỗi**
  Người dùng thấy gì: Chưa chứng minh được rằng phép kiểm menu nằm trên cùng khi toàn màn hình thật sự bắt được lỗi, nên menu bị khuất có thể lọt qua.
  Căn cứ: Người dùng chỉ bị ảnh hưởng nếu menu bị khuất thật, điều ấy được xem lại bằng mắt dễ dàng, và sửa bài kiểm rẻ.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4): Escape xoá vùng chọn nhưng không có đối chứng dương**
  Người dùng thấy gì: Phép kiểm Esc xoá vùng chọn có thể báo đạt dù trước đó chưa bôi được ô nào.
  Căn cứ: Rủi ro nhỏ vì các phép kiểm khác đã bôi vùng ô thật, và người dùng thấy ngay nếu Esc không làm gì.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: wont-fix

- **Chỉ kiểm 'có mặt' trong khi lời hứa là quan hệ (hình 3): điểm dừng Tab chỉ kiểm bằng includes**
  Người dùng thấy gì: Người dùng bàn phím có thể gặp thêm điểm dừng Tab thừa hoặc thứ tự Tab bị đảo mà phép kiểm vẫn báo đạt.
  Căn cứ: Ảnh hưởng người dùng bàn phím nhưng chỉ khi có lỗi thật, và chưa có dấu hiệu lỗi, nên ghi lại để siết phép kiểm sau.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Chỉ kiểm 'có mặt' trong khi lời hứa là quan hệ (hình 3): lối 'Đang bán' cộng lọc '<=5' chỉ kiểm nhỏ hơn**
  Người dùng thấy gì: Lọc giá sai đơn vị mà vẫn bớt vài dòng thì phép kiểm vẫn báo đạt, nên người dùng có thể thấy thiếu hay thừa dòng khi lọc kết hợp.
  Căn cứ: Lỗi nếu có chỉ làm danh sách lọc không chính xác và tự thấy được, người dùng xoá lọc làm lại được.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Chỉ kiểm 'có mặt' trong khi lời hứa là quan hệ (hình 3): đích của PageDown chỉ cần lớn hơn 1**
  Người dùng thấy gì: Nếu PageDown chỉ xuống một dòng như mũi tên xuống thì phép kiểm vẫn báo đạt, người dùng sẽ thấy phím nhảy trang không nhảy xa.
  Căn cứ: Chỉ là tiện lợi khi duyệt bảng dài, không mất dữ liệu, và dùng mũi tên vẫn đi được.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Fixture viết tay đúng khuôn bên kiểm (hình 2): ca phá 'Căn tắt được' tự đưa một danh sách viết tay vào**
  Người dùng thấy gì: Người dùng không thấy gì khác; chỉ là phép kiểm chặn việc tắt cột Căn chưa được thử trên menu thật.
  Căn cứ: Mức độ thấp, không ảnh hưởng người dùng, và các phép kiểm khác đã kiểm menu Cột thật.
  file: `tests/grid-sheet.test.tsx`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
