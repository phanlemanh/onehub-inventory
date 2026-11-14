## Trong hợp đồng

- **Criteria and tests (check 2) / AC-12: a 1024/1440 case was loosened**
  AC: AC-12
  file: tests/e2e/loi-vao-ho-so.spec.ts:479
  severity: low
  source: invariants
  detail: AC-12 says no case at 1024 or 1440 may change its wording or expectation. In the E7 case ('an unknown code typed in the box'), the locator `getByRole('button', { name: 'Xoá lọc' })` gained `.first()` at every size, not only on the phone. Before, Playwright's strict mode made the wide-screen case fail if a second «Xoá lọc» button appeared in the region. Now a duplicate button at 1024/1440 passes without notice. Fix: apply `.first()` only when `isPhone(page)` and keep the strict locator at 768 px and above.

- **On phones, a screen reader announces the label «Giá chào» instead of the actual price on every listing card**
  AC: AC-9
  file: src/modules/listings/ui/listing-record.tsx:166
  severity: medium
  source: bugs
  detail: In the new row layout, the price span carries `aria-label={priceLabel}`. On a phone this card sits inside the `<a data-slot="phone-card">` that `PhoneList` builds. That link takes its accessible name from its content, and the accessible-name rules let a descendant's aria-label replace that descendant's text. So the link's name loses the price value and gets the column label in its place. I checked with dom-accessibility-api on the same structure and got the name "S1.01Giá chàoToà A", with no "6,17 tỷ". A screen-reader user hears «Giá chào» on every card and never the price, which defeats the intent stated in `RegionPhoneList.card` that the card's own text names the link (WCAG 2.5.3). The stacked layout uses the same aria-label at line 200, but there it is not inside a link, so this is new with row 2b. The E2E test at tests/e2e/the-dien-thoai.spec.ts:197 only checks that the name starts with the unit code, so it does not catch this. Fix: drop the aria-label on the price span in the row layout, or put the label in visually hidden text next to the value (for example «Giá chào 6,17 tỷ»).

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier (check 10) / AGENTS.md Autonomy tiers: change is high tier but the contract records T2 and no human approval for the protected path**
  Người dùng thấy gì: Một tệp của bộ đo dùng chung bị sửa mà hợp đồng ghi mức rủi ro thấp hơn thực tế và chưa có người có thẩm quyền duyệt riêng. Người dùng cuối không thấy gì khác, nhưng chủ kho cần biết để duyệt.
  Căn cứ: Không ảnh hưởng người dùng cuối; chỉ cần chủ kho xác nhận một lần ở cổng, sửa sau rẻ.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

- **Intent (check 1): code for the option the owner did not choose is still there**
  Người dùng thấy gì: Còn sót mã cho một kiểu hiển thị mà chủ kho không chọn; người dùng không thấy và không bị ảnh hưởng.
  Căn cứ: Không đổi gì người dùng thấy, không mất dữ liệu; dọn sau rất rẻ.
  file: `src/modules/listings/ui/listing-record.tsx`
  severity: low
  Đề xuất: known-limits

- **Design (check 9): the card link drops the current address's parameters**
  Người dùng thấy gì: Khi mở một căn ở tab mới hoặc sao chép liên kết từ thẻ, người nhận thấy danh sách không còn bộ lọc, sắp xếp hay góc nhìn đang dùng. Chạm bình thường vẫn đúng.
  Căn cứ: Chỉ gặp ở thao tác phụ, không mất dữ liệu, người dùng tự lọc lại được.
  file: `src/components/candidate/phone-list.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (chuỗi có mặt thay cho quan hệ): khối 'nhom' (E6) không so được dòng nhóm với bảng**
  Người dùng thấy gì: Bài kiểm tra việc nhóm theo Toà trên điện thoại chưa chặt, nên nếu thẻ nằm nhầm nhóm hay số căn lệch thì có thể không bị phát hiện.
  Căn cứ: Người dùng chưa thấy lỗi nào; rủi ro là bỏ sót lỗi về sau, bổ sung bài đo là việc rẻ.
  file: `tests/the-dien-thoai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên ma trận viết trước nhưng chỉ có điểm-case): khối 'loc'/'sap-theo' (E4) và E5 thiếu ca**
  Người dùng thấy gì: Bài kiểm tra lọc, sắp xếp và vào từ chỗ khác trên điện thoại chỉ phủ một phần các tình huống đã hứa, nên một số lỗi có thể lọt.
  Căn cứ: Chưa có lỗi nào được thấy ở người dùng; bổ sung ca là việc rẻ và làm sau được.
  file: `tests/the-dien-thoai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): khối 'trang-thai' (E7) chỉ đếm thẻ bằng 0, không đo chữ của trạng thái**
  Người dùng thấy gì: Nếu vùng ở các trạng thái đang tải, lỗi hay không đủ quyền hiện trắng trên điện thoại thì bài kiểm tra vẫn qua, người dùng sẽ thấy màn trống.
  Căn cứ: Chưa thấy lỗi thật; người dùng tải lại được, và thêm đối chứng là việc rẻ.
  file: `tests/the-dien-thoai.test.tsx`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): ở E14 lệnh kiểm 'không có phone-card' chạy sau unmount nên không thể đỏ**
  Người dùng thấy gì: Phép kiểm tra thẻ không có mặt ở một ca luôn qua, và ca hỏi lại trước khi xoá căn chưa được kiểm.
  Căn cứ: Việc xoá căn trên điện thoại chưa sống ở hàng này nên chưa ảnh hưởng người dùng; bổ sung dễ.
  file: `tests/the-dien-thoai.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 (có mặt thay cho quan hệ): E1 chỉ kiểm nhãn trạng thái trên thẻ khác rỗng**
  Người dùng thấy gì: Bài kiểm tra chưa chắc bắt được trường hợp thẻ mang sai trạng thái hay sai nơi, nên lỗi hiển thị loại này có thể lọt.
  Căn cứ: Chưa thấy sai dữ liệu nào; chỉ là lưới an toàn mỏng, sửa sau rẻ.
  file: `tests/the-dien-thoai.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tên ca tuyên cả lớp nhưng chỉ đo một phần tử): 'doi-kho' (E2) nói lọc, sắp và nhóm qua 768 nhưng chỉ đo lọc**
  Người dùng thấy gì: Chưa được kiểm chắc rằng sắp xếp và nhóm còn nguyên khi xoay hay đổi cỡ màn qua ngưỡng điện thoại, chỉ bộ lọc được kiểm.
  Căn cứ: Chưa thấy lỗi thật; người dùng đặt lại sắp xếp được, bổ sung bài đo rẻ.
  file: `tests/e2e/the-dien-thoai.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): CompanyAdmin ở E9 chỉ đếm phone-card bằng 0**
  Người dùng thấy gì: Bài kiểm tra chưa chắc rằng Quản trị sàn thấy đúng câu không đủ quyền, trang trắng hay lỗi cũng làm bài qua.
  Căn cứ: Không lộ dữ liệu vì không có thẻ nào hiện; chỉ là lưới kiểm mỏng, sửa sau rẻ.
  file: `tests/e2e/the-dien-thoai.spec.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
