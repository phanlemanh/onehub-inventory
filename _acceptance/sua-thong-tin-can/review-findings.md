# Review findings: sua-thong-tin-can (round 1)

## Trong hợp đồng

- **Undoing or failing a paste onto a detail column (Nội thất, Pháp lý, Tài chính, Hiện trạng) clears the old value instead of restoring it**
  AC: AC-11
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx:399`
  severity: high
  source: bugs
  detail: applyPaste only records the pre-paste value in `before` when `field.startsWith("custom.")`. The four detail columns are typed cells keyed by their column (`cellKeyOf` returns `field.key`, e.g. "Listing.furnished"), so their old values are never recorded. Two things follow. (1) Undo builds `changeFor(customs.get(field)!, (was[field] ?? null))`. `was[field]` is undefined, so the undo sends `{field:"details", furnished: null}` (or `legalStatus: null`, etc.). That deletes the value on the server instead of putting the old one back. If the cell held «Có nội thất» before the paste, after «Hoàn tác» it is empty in the database, and the notice still says the paste was undone. (2) When a paste write does not go through (offline, conflict, refused, fault), the revert loop runs `patch(row.id, { [field]: was[field] })` with undefined, so the cell goes blank instead of showing its old value. The tests cover planPaste for detail columns but not applyPaste's undo or revert. Fix: record `row[field]` for every typed field (for example `customs.has(field)`), not only fields that start with `custom.`.
  rationale: AC-11 đòi dán vào bốn cột có «Hoàn tác»; hoàn tác xoá giá trị cũ thay vì khôi phục là sai đúng điều đó.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Evidence: make check is red. A browser test takes a screenshot outside the shared door**
  Người dùng thấy gì: Bộ kiểm tra tự động của dự án đang đỏ vì một bài thử chụp ảnh sai cách. Người dùng không thấy gì khác, nhưng thay đổi chưa thể coi là xong.
  Căn cứ: Người dùng không bị ảnh hưởng và không mất dữ liệu, nhưng cổng kiểm tra đỏ nên chưa thể nhập; sửa nhỏ và rẻ.
  file: `tests/e2e-db/sua-thong-tin-can.spec.ts`
  severity: high
  Đề xuất: new-contract

- **Design / errors handled: a 400 from the server is shown as «Không đủ quyền»**
  Người dùng thấy gì: Khi máy chủ không nhận một giá trị (ví dụ trường riêng vừa bị ngừng), người dùng lại đọc thấy «Không đủ quyền», trong khi họ vẫn có quyền. Họ có thể nhầm là bị tước quyền.
  Căn cứ: Chỉ là thông báo sai lý do, không mất dữ liệu, người dùng tải lại là thấy đúng; sửa tương đối rẻ nhưng cần chốt câu chữ mới.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: medium
  Đề xuất: new-contract

- **Domain: new business rules are not recorded in ontology/**
  Người dùng thấy gì: Hai luật mới (căn đã bán hay ngừng thì khoá, trần 200 ký tự) đang chạy nhưng chưa được ghi vào mô hình nghiệp vụ. Người dùng không thấy khác biệt, chỉ tài liệu chưa khớp.
  Căn cứ: Không ảnh hưởng người dùng hay dữ liệu; chỉ là nợ tài liệu cần chủ kho duyệt riêng nên ghi lại là hợp lý.
  file: `src/modules/listings/edit-rules.ts`
  severity: medium
  Đề xuất: known-limits

- **Domain: one rule in one place. The custom value limit and the date check are copied from company-config**
  Người dùng thấy gì: Một giới hạn chữ và cách kiểm ngày được chép ở hai nơi. Nếu sau này đổi một nơi, người dùng có thể thấy ô nhận giá trị rồi máy chủ từ chối.
  Căn cứ: Hiện hai bản đang khớp nên chưa gây hại; nếu lệch thì người dùng chỉ phải nhập lại, không mất dữ liệu.
  file: `src/modules/listings/custom-rules.ts`
  severity: low
  Đề xuất: known-limits

- **Product language: concept labels are hard-coded and do not match the label table**
  Người dùng thấy gì: Hộp Sửa gọi một phần là «tình trạng sử dụng» trong khi cột lại tên «Hiện trạng», và từ riêng của sàn không vào câu này. Người dùng thấy hai tên cho cùng một thứ.
  Căn cứ: Chỉ gây hơi khó hiểu, không mất dữ liệu; sửa rẻ nhưng không chặn việc sử dụng.
  file: `src/modules/listings/ui/record-copy.ts`
  severity: low
  Đề xuất: new-contract

- **A 409 on a company custom-field cell leaves the unsaved value showing while the notice says the cell went back**
  Người dùng thấy gì: Khi hai người cùng sửa một ô trường riêng, ô vẫn hiện giá trị bị từ chối trong khi thông báo nói đã về giá trị cũ. Người dùng tưởng giá trị đã lưu.
  Căn cứ: Hậu quả khá nặng vì người dùng tin sai dữ liệu, nhưng chỉ xảy ra khi hai người sửa trùng và tải lại là thấy đúng.
  file: `src/modules/listings/ui/use-listing-cell-edit.tsx`
  severity: high
  Đề xuất: new-contract

- **Undo after editing a long imported legal status or financing always fails with a misleading «Không đủ quyền»**
  Người dùng thấy gì: Nếu chữ pháp lý hay tài chính nhập từ tệp dài hơn 200 ký tự, sau khi sửa thì «Hoàn tác» luôn thất bại và báo «Không đủ quyền». Chữ gốc không đưa lại được bằng nút này.
  Căn cứ: Chỉ gặp với dữ liệu nhập dài bất thường và không mất dữ liệu ngoài việc phải gõ lại; ghi lại là đủ.
  file: `src/modules/listings/ui/listing-details-edit.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên ma trận LỚP, chỉ có điểm-case): ma trận «4 vai × PATCH details = 4 mã» của AC-1 không có vai nào, cửa giả bỏ qua hành động**
  Người dùng thấy gì: Bài thử việc từ chối vai Quản trị sàn chỉ kiểm cửa giả, chưa kiểm đúng vai thật. Người dùng không thấy gì khác, nhưng lỗi quyền có thể lọt mà không ai biết.
  Căn cứ: Là điểm yếu của kiểm thử, không phải lỗi người dùng đang gặp; có thể bổ sung sau.
  file: `tests/sua-thong-tin-may-chu.test.ts`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận viết trước thiếu phần tử): ca 'o-rieng-quan-tri-khong-mo' kèm đối chứng dương Đầu chủ không tồn tại**
  Người dùng thấy gì: Chưa có bài thử nào xác nhận Quản trị sàn không mở được ô cột riêng còn Đầu chủ thì mở được. Nếu hỏng, vai chỉ xem có thể sửa nhầm.
  Căn cứ: Là thiếu kiểm thử chứ không phải lỗi đã xảy ra; bổ sung sau rẻ.
  file: `_acceptance/sua-thong-tin-can/evals.yaml`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim không khớp): chiều đỏ của pha-thu-nut-khong-quyen chờ «Quản trị sàn·đang mở», nhưng bài in «CompanyAdmin·đang mở»**
  Người dùng thấy gì: Một dòng báo lỗi của bài thử ghi tên vai khác với tài liệu. Người dùng sản phẩm không bị ảnh hưởng.
  Căn cứ: Không có hậu quả với người dùng, chỉ làm người kiểm khó đối chiếu; chi phí sửa không đáng.
  file: `tests/sua-thong-tin-can.test.tsx`
  severity: medium
  Đề xuất: wont-fix

- **Hình dạng 4 (âm tính một mình, thông điệp ghim gắn sai ca): pha-thu-bo-vung-hang không làm 'doi-chung-co-vung-hang' đỏ**
  Người dùng thấy gì: Bài đối chứng cho màn không đủ quyền ghim thông điệp sai ca, nên khó xác nhận nó đỏ đúng lúc. Người dùng không thấy khác biệt.
  Căn cứ: Chỉ là độ chính xác của kiểm thử, không ảnh hưởng người dùng; ghi lại là đủ.
  file: `tests/bang-hang-khong-du-quyen-doi-chung.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP, chỉ có điểm-case): 'khong-bang-ma-thu-hai' hứa bắt cả `case 403:` nhưng regex chỉ khớp ba tên biến**
  Người dùng thấy gì: Phép quét chống bảng mã lỗi thứ hai còn khe hở với cách viết khác. Người dùng không thấy gì cho đến khi có người vô tình thêm bảng mã thứ hai.
  Căn cứ: Chưa có lỗi thật, chỉ là lưới an toàn thưa; có thể siết sau.
  file: `tests/mot-luat-ghi.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 2 (fixture viết tay theo khuôn bên đọc): phía màn nhận WriteOutcome viết tay; lớp SaveOutcome→WriteOutcome và «409 thì mục hiện bản mới» không ca nào đo**
  Người dùng thấy gì: Chưa có bài thử đi suốt từ máy chủ báo căn vừa đổi đến màn hiện bản mới nhất. Nếu khúc giữa hỏng, người dùng sẽ thấy bản cũ sau khi đóng hộp.
  Căn cứ: Là thiếu kiểm thử, người dùng tải lại là thấy đúng; có thể bổ sung sau.
  file: `tests/sua-thong-tin-can.test.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): 'thong-bao-dung-cho-khi-khong-ho-so' chỉ assert biến CSS rỗng, tên biến chép tay, không có đối chứng dương**
  Người dùng thấy gì: Bài thử kiểm chỗ hiện thông báo khi không mở hồ sơ có thể vẫn xanh dù cơ chế bị hỏng. Người dùng có thể thấy thông báo đè nút nhưng không ai phát hiện sớm.
  Căn cứ: Chỉ làm kiểm thử kém tin cậy; hậu quả nhẹ và bổ sung sau rẻ.
  file: `tests/e2e/sua-thong-tin-can.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (âm tính một mình): 'quan-tri-khong-nut: ô' đếm cell-editor = 0 mà không có đối chứng dương trên cùng ô, cùng nền DB**
  Người dùng thấy gì: Bài thử xác nhận Quản trị sàn không mở được ô sửa có thể xanh vì lý do khác. Người dùng không thấy khác biệt.
  Căn cứ: Là điểm yếu kiểm thử, không phải lỗi đang xảy ra; ghi lại là đủ.
  file: `tests/e2e-db/sua-thong-tin-can.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (thiếu phần tử đã hứa): 'dan-cot-rieng' hứa cả «sai kiểu» lẫn «không có lựa chọn» nhưng chỉ có một ca**
  Người dùng thấy gì: Chưa có bài thử cho việc dán chữ vào cột số của trường riêng. Nếu hỏng, người dùng có thể không thấy lý do «sai kiểu» trong hộp xem trước.
  Căn cứ: Chỉ là thiếu một ca kiểm thử, hậu quả nhẹ và bổ sung sau rẻ.
  file: `tests/sua-thong-tin-can.test.tsx`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 2/17 lỗi rơi vào file không bộ đo nào phủ (tests/sua-thong-tin-may-chu.test.ts, _acceptance/sua-thong-tin-can/evals.yaml) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
