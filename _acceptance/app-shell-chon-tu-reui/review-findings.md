# Review findings: app-shell-chon-tu-reui (round 2)

## Trong hợp đồng

- **E10 sheet frame is a byte-for-byte copy of the closed-sheet inventory frame, so it shows no sheet**
  file: `_acceptance/app-shell-chon-tu-reui/evidence/E10-sheet-360-light.png`
  severity: high
  AC: AC-5
  source: conventions
  detail: E10-sheet-360-light.png and E10-inventory-360-light.png have the same SHA-1 (bdb93a93edcec1a13f10f233fae1c10f70d5a2cd). Opening the image shows only the top bar and the heading 'Bảng hàng'. The phone sheet is not open, so neither the rail nor the second column appears. Commit 177e95a says it re-shot the sheet frame after the animation finished (the new getAnimations poll in tests/e2e/app-shell.spec.ts, around line 203). The committed file does not back that claim. Either the frame was copied by hand, or it was not regenerated after the fix. Round 1 rejected E10 because of this sheet frame, and the evidence still does not show it open, including the icon-only rail change in src/components/templates/nav-menu.tsx line 89. The frame needs a real SHOTS_DIR run of the spec at 360 px.

- **E10 sheet frame is byte-identical to the closed inventory frame: the evidence never shows the sheet open**
  file: `_acceptance/app-shell-chon-tu-reui/evidence/E10-sheet-360-light.png`
  severity: high
  AC: AC-5
  source: bugs
  detail: shasum of E10-sheet-360-light.png and E10-inventory-360-light.png are the same (bdb93a93edcec1a13f10f233fae1c10f70d5a2cd). The image shows only the top bar and the heading 'Bảng hàng', with no sheet, no rail and no second column. The E10 step in evals.yaml (line 81-82) compares this frame with the approved prototype q5-a.jpg, so the 'sheet open' evidence is false. Either the committed PNG came from a run before the animation wait was added in tests/e2e/app-shell.spec.ts:202-205, or the wait (getAnimations on sheet.first()) does not ensure the sheet is visible when page.screenshot runs. Either way the round-1 evidence for the phone sheet is invalid, and the fix 'icon-only rail in the phone sheet' (nav-menu.tsx:89) has no frame proving it. Re-run with SHOTS_DIR set and check that the two files differ. Better still, add a check in shot() or the test that fails when the sheet frame equals the inventory frame, or that the sheet's bounding box is in the viewport before the shot.

- **Hình dạng 3 (assert chuỗi có mặt thay vì quan hệ): lời hứa «khung ngăn mở khác khung đóng» không được đo; bằng chứng đã commit trùng từng byte với khung đóng**
  file: `_acceptance/app-shell-chon-tu-reui/evidence/E10-sheet-360-light.png:0`
  severity: high
  AC: AC-5
  source: measurement
  detail: E10 hứa một quan hệ giữa các khung: ở 360, khung ngăn trượt phải cho thấy ngăn mở, tức là khác khung đóng E10-inventory-360-light. Bước đo chỉ kiểm từng tệp E10-*.png có tồn tại (evals.yaml dòng 81 liệt kê tên tệp spec phải lưu), không có phép so nào giữa hai khung. Hệ quả nhìn thấy ngay trong cây: E10-sheet-360-light.png, commit trong 177e95a là «round 1 evidence and fixes», có md5 9098e6970cf290739b5de652d92f76b8, trùng hệt E10-inventory-360-light.png. Mở ảnh ra chỉ thấy thanh trên và tiêu đề «Bảng hàng», không có ngăn. Bộ khung là hiện vật được giao của vòng này, nhưng nó vẫn không chứng minh được vế «ngăn trượt mở ra có cả biểu tượng màn lẫn mục của cột thứ hai». Spec cũng không có assert tự động nào bắt việc hai khung trùng nhau, nên lần chạy lại vẫn có thể ra khung trùng mà không đỏ.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **luat-cham.json 'den' points at the commit before the round-1 fix, not HEAD**
  Người dùng thấy gì: The grading record may stop one commit early, so the last small fixes to the phone menu might not be reviewed in the next round. Staff using the app see no difference.
  Căn cứ: It has no effect on users and can be fixed by editing one line at any time, so it is enough to note it and move on.
  file: `_acceptance/app-shell-chon-tu-reui/luat-cham.json`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm-tính-một-mình): cổng chờ animation getAnimations().length === 0 trước khi chụp khung ngăn trượt không có đối chứng dương**
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

- **Hình dạng 3: assert 'chuỗi có mặt' (tên không rỗng) trong khi lời hứa là quan hệ tên mục = nhãn màn (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm chưa bắt được trường hợp hai biểu tượng bị tráo tên cho nhau. Người dùng chỉ gặp điều này nếu sau này ai đó vô tình đảo nhãn.
  Căn cứ: Sản phẩm hiện không sai; đây là lưới an toàn hơi lỏng, nếu có lỗi thì người dùng thấy ngay trên màn và sửa rất rẻ.
  file: `tests/e2e/app-shell.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4: assertion âm tính đứng một mình, không có đối chứng dương. Ô «Gõ mã căn» được tìm theo vai button nên bài không bao giờ bắt được nó (r1 · tệp đã đổi)**
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

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 4/5 lỗi rơi vào file không bộ đo nào phủ (_acceptance/app-shell-chon-tu-reui/evidence/E10-sheet-360-light.png, _acceptance/app-shell-chon-tu-reui/luat-cham.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
