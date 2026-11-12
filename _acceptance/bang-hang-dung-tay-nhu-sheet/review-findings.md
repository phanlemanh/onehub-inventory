## Trong hợp đồng

- **From 1024 up, full screen keeps the normal-page grid height; the full-screen height never takes effect**
  AC: AC-11
  file: `src/components/candidate/data-region.tsx:98`
  severity: medium
  source: bugs
  detail: The grid's scroll box gets both `lg:h-(--region-height)` and `group-data-full-screen/region:h-(--region-full-height)` (line 782). In the compiled CSS both rules have the same specificity (0,1,0), because `:is(:where(.group/region)[data-full-screen] .cls)` counts only `.cls`. The `lg:` rule sits inside `@media (min-width: 64rem)`, which comes later in the stylesheet (offset 149335 vs 80760 in .next/dev/.../[root-of-the-server]__0-3okyl8hewtx._.css), so it wins whenever the screen is 1024 or wider. Full screen is only offered at those widths, so in full screen the grid is still `calc(100dvh - 23rem)` instead of `calc(100dvh - 10rem)`. That leaves about 13rem of empty space under the footer, and the `--region-full-height` rule never applies. Before this change the same conflict existed with `lg:h-screen`; this change replaced 100vh with a value 23rem shorter, which makes the full-screen grid visibly short. The e2e test 'full screen shows only the grid, more rows…' does not catch it: switching to dense rows alone gives more visible rows than before. Fix: give the full-screen height a variant that beats the `lg:` one, for example `lg:group-data-full-screen/region:h-(--region-full-height)` or `!`, and add an e2e assertion that in full screen the footer's bottom edge is near innerHeight.
  rationale: AC-11 đòi ở 1440 và 1024, khi toàn màn hình lưới kéo tới đáy màn hình; finding cho thấy lưới vẫn giữ chiều cao thường và chừa khoảng trống dưới chân bảng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Shared grid component hard-codes the Inventory page's surrounding layout height (23rem)**
  Người dùng thấy gì: Trên một màn Lưới khác có đầu trang hay thanh công cụ cao khác Bảng hàng, bảng có thể bị cuộn thừa hoặc chừa khoảng trống. Bảng hàng hiện tại vẫn hiển thị đúng.
  Căn cứ: Hiện chỉ Bảng hàng dùng thật, màn khác mới là trang mẫu; hậu quả chỉ là lệch bố cục, không mất dữ liệu, và chỉnh khi màn Lưới thứ hai ra đời thì rẻ.
  file: `src/components/candidate/data-region.tsx`
  severity: low
  Đề xuất: known-limits

- **The status order, a listing business rule, lives in a shared grid component and is pulled into the App Shell nav and the listings module from there (r1)**
  Người dùng thấy gì: Người dùng thấy các trạng thái đúng thứ tự trên mọi màn hiện nay. Nguy cơ là về sau sửa thứ tự ở một nơi mà quên nơi kia thì hai danh sách lệch nhau.
  Căn cứ: Hiện chưa ai thấy lỗi gì, chỉ là rủi ro bảo trì về sau, và dời chỗ định nghĩa có thể làm sau mà không mất dữ liệu.
  file: `src/components/candidate/grid-view.ts`
  severity: medium
  Đề xuất: known-limits

- **When no row matches, the search box jumps to another spot in the page, so focus is lost mid-typing, and the column filter boxes disappear (r1 · tệp đã đổi)**
  Người dùng thấy gì: Khi gõ một luật lọc ra không còn dòng nào, ô tìm kiếm và các ô lọc cột biến mất, người dùng mất chỗ đang gõ và không sửa được riêng luật sai, chỉ có thể xoá hết mọi lọc rồi làm lại.
  Căn cứ: Gây khó chịu rõ khi dùng bằng tay, nhưng không mất dữ liệu và người dùng thoát được bằng «Xoá lọc»; sửa tương đối rẻ nên nên đăng thành việc riêng.
  file: `src/components/candidate/data-region.tsx`
  severity: high
  Đề xuất: new-contract

- **Leaving the page while in full screen leaves the App Shell hidden for good (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu người dùng quay lại trang khác bằng phím hay cử chỉ khi đang toàn màn hình, màn kế tiếp hiện không có thanh điều hướng và đầu màn, và Esc cũng không khôi phục được cho đến khi tải lại trang.
  Căn cứ: Không mất dữ liệu và tải lại trang là thoát được, nhưng người dùng có thể tưởng ứng dụng hỏng; chỉ gặp ở một đường đi hẹp.
  file: `src/components/candidate/data-region.tsx`
  severity: medium
  Đề xuất: new-contract

- **Assertion âm-tính-một-mình (hình 4): kiểm tra đối chứng ở dòng 174 không bao giờ chạy (r1 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng không thấy gì khác đi; chỉ là một phép kiểm chép vùng ô không thật sự chạy nên một lỗi chép sai có thể lọt qua mà không bị bắt.
  Căn cứ: Không ảnh hưởng người dùng ngay, phép kiểm âm còn lại vẫn chạy, và sửa chỉ là thêm một cặp dấu ngoặc nên ghi lại rồi sửa sau.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Fixture lấy từ chính bên đọc (hình 2): chuỗi kỳ vọng của phép chép (E2 b) đọc từ DOM, không dựng từ dữ liệu (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu giá hay trạng thái hiển thị sai thì phép kiểm chép vẫn báo đạt, vì nó so với chính thứ đang hiển thị.
  Căn cứ: Phần chép khớp với ô hiện là đúng yêu cầu AC-2, rủi ro chỉ là bỏ sót lỗi hiển thị giá, và người dùng tự nhìn ra được.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4): ca phá toàn màn hình nhận cả hai thông điệp, nên phép kiểm menu chưa từng được chứng minh là bắt lỗi (r1 · tệp đã đổi)**
  Người dùng thấy gì: Chưa chứng minh được rằng phép kiểm menu nằm trên cùng khi toàn màn hình thật sự bắt được lỗi, nên menu bị khuất có thể lọt qua.
  Căn cứ: Người dùng chỉ bị ảnh hưởng nếu menu bị khuất thật, điều ấy được xem lại bằng mắt dễ dàng, và sửa bài kiểm rẻ.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình 4): Escape xoá vùng chọn nhưng không có đối chứng dương (r1 · tệp đã đổi)**
  Người dùng thấy gì: Phép kiểm Esc xoá vùng chọn có thể báo đạt dù trước đó chưa bôi được ô nào.
  Căn cứ: Rủi ro nhỏ vì các phép kiểm khác đã bôi vùng ô thật, và người dùng thấy ngay nếu Esc không làm gì.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: wont-fix

- **Chỉ kiểm 'có mặt' trong khi lời hứa là quan hệ (hình 3): điểm dừng Tab chỉ kiểm bằng includes (r1 · tệp đã đổi)**
  Người dùng thấy gì: Người dùng bàn phím có thể gặp thêm điểm dừng Tab thừa hoặc thứ tự Tab bị đảo mà phép kiểm vẫn báo đạt.
  Căn cứ: Ảnh hưởng người dùng bàn phím nhưng chỉ khi có lỗi thật, và chưa có dấu hiệu lỗi, nên ghi lại để siết phép kiểm sau.
  file: `tests/e2e/sheet.spec.ts`
  severity: high
  Đề xuất: known-limits

- **Chỉ kiểm 'có mặt' trong khi lời hứa là quan hệ (hình 3): lối 'Đang bán' cộng lọc '<=5' chỉ kiểm nhỏ hơn (r1 · tệp đã đổi)**
  Người dùng thấy gì: Lọc giá sai đơn vị mà vẫn bớt vài dòng thì phép kiểm vẫn báo đạt, nên người dùng có thể thấy thiếu hay thừa dòng khi lọc kết hợp.
  Căn cứ: Lỗi nếu có chỉ làm danh sách lọc không chính xác và tự thấy được, người dùng xoá lọc làm lại được.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Chỉ kiểm 'có mặt' trong khi lời hứa là quan hệ (hình 3): đích của PageDown chỉ cần lớn hơn 1 (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu PageDown chỉ xuống một dòng như mũi tên xuống thì phép kiểm vẫn báo đạt, người dùng sẽ thấy phím nhảy trang không nhảy xa.
  Căn cứ: Chỉ là tiện lợi khi duyệt bảng dài, không mất dữ liệu, và dùng mũi tên vẫn đi được.
  file: `tests/e2e/sheet.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Fixture viết tay đúng khuôn bên kiểm (hình 2): ca phá 'Căn tắt được' tự đưa một danh sách viết tay vào (r1)**
  Người dùng thấy gì: Người dùng không thấy gì khác; chỉ là phép kiểm chặn việc tắt cột Căn chưa được thử trên menu thật.
  Căn cứ: Mức độ thấp, không ảnh hưởng người dùng, và các phép kiểm khác đã kiểm menu Cột thật.
  file: `tests/grid-sheet.test.tsx`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
