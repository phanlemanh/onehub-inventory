## Trong hợp đồng

- **E15 step 3 screenshot does not show the sign-out failure message in readable form**
  file: `_acceptance/va-dang-nhap/evidence/E15-step3.png`
  severity: medium
  AC: AC-8
  source: bugs
  detail: I looked at the committed frame. E15 expects this frame (414 light, sign-out failed on the no-company screen) to show «Chưa đăng xuất được…» readable, above the content and not covering the button. In the frame the toast is only a faint, cut-off line at the very bottom edge (about y≈895 of 896). The text is mostly transparent and runs past the bottom of the image, so nobody can read it. Commit 1194e61 ('settle toast before frames') added an 800 ms wait in shot() and re-committed this file, but the new frame still catches the toast mid-entrance or off-screen. So this proof of AC-8/E15 for the no-company state does not show what it claims. The code (sign-out.ts → notify('result') → Toaster in the root layout) does surface the message, and the e2e test checks it with toBeVisible. The gap is in the evidence, not the behaviour: an E15 grade passed on this frame would be passing on a picture that does not show the state.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: auth change classified below high (review-change step 10)**
  Người dùng thấy gì: Thay đổi đăng nhập và đăng xuất bị dán nhãn rủi ro thấp hơn thực tế, nên có thể được duyệt nhẹ tay hơn mức nó đáng được. Người dùng cuối không thấy gì khác đi.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; hiện người duyệt ở các mức là cùng một người, còn sửa quy tắc phân mức là việc riêng của chủ kho.
  file: `src/modules/identity/next-path.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): bộ ghi lượt rời trang chưa bao giờ được chứng là bắt được /login**
  Người dùng thấy gì: Bài kiểm có thể không phát hiện được trường hợp đăng xuất hỏng mà người dùng vẫn bị đưa qua trang đăng nhập rồi dội ngược vào ứng dụng. Hôm nay hành vi vẫn đúng, chỉ là lưới an toàn có thể có lỗ.
  Căn cứ: Không ảnh hưởng người dùng hiện tại và không mất dữ liệu; rủi ro chỉ xuất hiện nếu sau này hành vi hỏng mà bài kiểm vẫn xanh, và thêm một khẳng định đối chứng thì rẻ.
  file: `tests/e2e-db/va-dang-nhap.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): `clearsCookie` chỉ được khẳng định là false, không có ca nào chứng nó trả true**
  Người dùng thấy gì: Bài kiểm có thể không nhận ra nếu sau này cách máy chủ xoá phiên đổi định dạng, nên có thể xanh giả. Hiện đăng xuất vẫn hoạt động đúng.
  Căn cứ: Không ảnh hưởng người dùng hôm nay và không mất dữ liệu; một kiểm tra khác đã đỡ gián tiếp ý này nên mức nguy hại thấp.
  file: `tests/e2e-db/va-dang-nhap.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
