
# Review findings: luu-goc-nhin-cot-hai (round 1)

## Trong hợp đồng

Không có.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Domain: the SavedView description contradicts its own four-things rule (stale after migration 011)**
  Người dùng thấy gì: Một câu mô tả nội bộ vẫn nói góc nhìn giữ cả chữ trong ô tìm, trong khi sản phẩm thật đã bỏ. Người dùng không thấy gì khác; chỉ người đọc tài liệu có thể hiểu nhầm.
  Căn cứ: Chỉ lệch chữ trong tài liệu, không mất dữ liệu và không ảnh hưởng người dùng; sửa lúc nào cũng rẻ nhưng cần chủ kho soi mô hình miền.
  file: `ontology/entities/SavedView.yaml`
  severity: medium
  Đề xuất: known-limits

- **CI and agent privileges: the proof gate gains an exemption that nobody checks**
  Người dùng thấy gì: Cổng kiểm bằng chứng cho phép bỏ qua một bước với các khối cũ chỉ cần khai một dòng, nên có thể lọt một khối chưa có chứng từ thật. Người dùng cuối không bị ảnh hưởng trực tiếp.
  Căn cứ: Rủi ro nằm ở quy trình nội bộ, đã có quyết định của chủ kho và có kiểm thử che; không làm mất dữ liệu hay hỏng màn nào của người dùng.
  file: `tools/proof_gate/check.py`
  severity: medium
  Đề xuất: known-limits

- **Tier: auth and isolation code is classified below high**
  Người dùng thấy gì: Mã kiểm quyền được xếp mức rủi ro thấp hơn đáng lẽ, nhưng lần thay đổi này vẫn tính là mức cao và cần chủ mã duyệt. Người dùng không thấy khác biệt.
  Căn cứ: Đã được bù vì cả thay đổi đã ở mức cao; việc sửa thuộc quyền con người ở phần quản trị, không phải của đợt này.
  file: `src/modules/identity/action-door.ts`
  severity: low
  Đề xuất: known-limits

- **Records: the log does not record migration 011 or the owner's 2026-11-13 ruling**
  Người dùng thấy gì: Nhật ký chung chưa ghi việc góc nhìn bỏ chữ tìm kiếm theo phán quyết của chủ kho. Người dùng không bị ảnh hưởng; người đọc sau này khó tìm lý do.
  Căn cứ: Lý do vẫn có ở trang thực thể và hồ sơ đợt; thêm một dòng sau rất rẻ và không mất gì.
  file: `wiki/log.md`
  severity: low
  Đề xuất: known-limits

- **Input at the boundary: the size of a stored view is not fully bounded**
  Người dùng thấy gì: Một người đăng nhập có thể lưu một góc nhìn rất lớn của riêng mình. Chỉ ảnh hưởng dòng của chính họ, không lộ hay làm hỏng dữ liệu người khác.
  Căn cứ: Hậu quả nhẹ, giới hạn trong phạm vi một người và vẫn cách ly theo sàn; người dùng thường không gặp.
  file: `src/modules/listings/saved-view.ts`
  severity: low
  Đề xuất: known-limits

- **A database error on a saved-view link is shown as 'view deleted or not yours' and the grid silently opens unfiltered**
  Người dùng thấy gì: Khi máy chủ lỗi tạm lúc mở một góc nhìn, người dùng bị báo là góc nhìn đã xoá và thấy mọi căn không lọc. Họ có thể tưởng góc nhìn mất, nhưng tải lại thường mở được.
  Căn cứ: Không mất dữ liệu thật và tự khỏi khi tải lại, nhưng thông báo sai có thể gây hoang mang nên đáng sửa ở một đợt sau.
  file: `src/modules/listings/server.ts`
  severity: medium
  Đề xuất: known-limits

- **Saving changes to a view deleted elsewhere (404) says 'check your network and retry', so retrying never works**
  Người dùng thấy gì: Nếu góc nhìn đã bị xoá ở tab khác, bấm lưu báo kiểm tra mạng và Thử lại mãi không được. Người dùng phải tự tải lại trang để hiểu chuyện gì xảy ra.
  Căn cứ: Ca hiếm, không mất dữ liệu và người dùng tự thoát được bằng cách tải lại; chỉ là câu báo sai nguyên nhân.
  file: `src/modules/listings/ui/save-view-buttons.tsx`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay đúng khuôn bên đọc): ca phá 'reselect kept unsaved changes' của E5 chạy trên ảnh chụp bịa tay, hàm kiểm chưa từng chạy trên sản phẩm**
  Người dùng thấy gì: Một bài kiểm tự động chưa chứng minh được nó bắt được lỗi lưới giữ nguyên trạng thái khi bấm lại mục. Sản phẩm vẫn chạy đúng như đã thấy.
  Căn cứ: Không ảnh hưởng người dùng hiện tại; chỉ làm giảm độ tin của bài kiểm nên có thể bổ sung sau.
  file: `tests/e2e-db/goc-nhin.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm một mình): sau Esc chỉ kiểm 'không có DELETE' mà không có đối chứng dương rằng bộ đếm bắt được DELETE thật**
  Người dùng thấy gì: Bài kiểm có thể xanh dù bộ đếm không thấy được yêu cầu xoá thật. Người dùng không gặp gì; chỉ là lưới an toàn kiểm thử yếu hơn vẻ ngoài.
  Căn cứ: Không có hậu quả trực tiếp với người dùng, và thêm một dòng đối chứng sau này rất rẻ.
  file: `tests/e2e-db/goc-nhin.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm một mình): ma trận API của bốn cửa góc nhìn coi 'không phải 403' là được phép, và chỉ kiểm 'không ghi' trên bảng người, không trên saved_view**
  Người dùng thấy gì: Bài kiểm quyền có thể bỏ sót trường hợp bị từ chối mà vẫn ghi một góc nhìn. Hiện chưa có bằng chứng người dùng bị ảnh hưởng.
  Căn cứ: Là điểm yếu của lưới kiểm chứ không phải lỗi đã xảy ra; nhưng liên quan đến quyền nên nên củng cố khi có dịp.
  file: `tests/db/bang-quyen-api.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên cả lớp nhưng ma trận thiếu phần tử): E12 nói cả thanh công cụ còn nguyên khi không còn dòng khớp, nhưng TOOLS bỏ sót nút Toàn màn hình**
  Người dùng thấy gì: Bài kiểm không canh nút Toàn màn hình khi không còn dòng khớp, nên nếu nút ấy biến mất thì có thể không ai biết. Hiện sản phẩm chưa bị báo lỗi.
  Căn cứ: Nhẹ, người dùng tự thấy và tải lại được; thêm một phần tử vào danh sách kiểm rất rẻ.
  file: `tests/grid-sheet.test.tsx`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
