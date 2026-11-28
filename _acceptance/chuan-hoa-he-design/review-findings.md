# Review findings: chuan-hoa-he-design (round 2)

## Trong hợp đồng

Không có phát hiện nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Design (AGENTS.md, Architecture): a module reads other modules' tables**
  Người dùng thấy gì: Luật về căn rao và căn chờ nằm ở hai nơi, nên sau này sửa một nơi mà quên nơi kia có thể làm hai màn xử lý khác nhau.
  Căn cứ: Hiện chưa làm người dùng thấy sai gì, chỉ là nợ cấu trúc; sửa càng muộn càng đắt nhưng không mất dữ liệu.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: new-contract

- **Records (modules.yaml / AGENTS.md): a new module dependency has no decision page**
  Người dùng thấy gì: Người sau đọc sổ sẽ không biết vì sao nhập Excel được phụ thuộc vào bốn phần khác của hệ thống.
  Căn cứ: Chỉ thiếu ghi chép, người dùng không bị ảnh hưởng và bổ sung lúc nào cũng được.
  file: `architecture/modules.yaml`
  severity: medium
  Đề xuất: known-limits

- **Records / Human decisions needed: migration 019 changes an owner-approved function, and the owner's word is not recorded**
  Người dùng thấy gì: Một thay đổi về việc ai được chọn người đứng tin khi nhập Excel chưa có lời duyệt của chủ kho được ghi lại.
  Căn cứ: Là việc xin duyệt ở hồ sơ khác; nếu chủ kho bác thì phải làm lại bằng bản cập nhật mới, không mất dữ liệu.
  file: `db/migrations/019_nhap_excel_moi_noi_cua_minh.sql`
  severity: medium
  Đề xuất: known-limits

- **Tier (governance/autonomy.yaml): the PR states the wrong tier**
  Người dùng thấy gì: Mô tả thay đổi ghi nhẹ hơn thực tế, nên người gộp có thể tưởng không cần chủ mã duyệt.
  Căn cứ: Chỉ là chữ trong mô tả, sửa một dòng là xong và không ảnh hưởng người dùng cuối.
  file: `PR #136 description (feat/chuan-hoa-he-design)`
  severity: medium
  Đề xuất: known-limits

- **Evidence: required checks not green on HEAD**
  Người dùng thấy gì: Các kiểm tra tự động của bản này chưa xanh hẳn, nên chưa thể coi là sẵn sàng gộp.
  Căn cứ: Là trạng thái tạm của bản đang chạy, chạy lại hoặc sửa là biết; chưa có dữ liệu người dùng nào bị ảnh hưởng.
  file: `PR #136 / PR #130 checks`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: the shared empty-state check was loosened without the owner's approval**
  Người dùng thấy gì: Bài kiểm trạng thái trống giờ chấp nhận cả liên kết thay nút, nên một màn lẽ ra phải có nút có thể lọt qua mà không ai thấy.
  Căn cứ: Chỉ làm kiểm tra lỏng hơn, người dùng thấy tối đa một màn trống thiếu nút; sửa sau không tốn nhiều.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **Authorization (defense in depth, SP-1 layer): UPDATE is granted on the whole import_runs table**
  Người dùng thấy gì: Ở tầng dữ liệu, người có quyền nhập của mình có thể sửa cả những thông tin của lần nhập mà lẽ ra chỉ hệ thống được đổi, kể cả mở lại lần nhập đã hoàn tác.
  Căn cứ: Hiện không có đường nào ngoài giao diện dùng được lỗ hở này nên chưa ai bị hại; vá cần bản cập nhật dữ liệu mới nhưng không gấp.
  file: `db/migrations/015_nhap_excel.sql`
  severity: low
  Đề xuất: new-contract

- **Closing price and closing date columns are read and counted, then silently dropped when the import writes**
  Người dùng thấy gì: Khi nhập file Excel, cột giá chốt và ngày chốt được tính là đã nhận nhưng không được lưu ở đâu, và không ai báo cho người nhập biết.
  Căn cứ: Mất dữ liệu thật mà người dùng không hay biết, phải nhập lại từ file gốc mới có lại; nên sửa ở hồ sơ nhập Excel.
  file: `src/modules/imports/store.ts`
  severity: high
  Đề xuất: new-contract

- **A row whose unit code points to several units, with the question left unanswered, is dropped without its cells being kept**
  Người dùng thấy gì: Dòng có mã căn khớp nhiều căn mà người nhập chưa trả lời thì bị bỏ, dữ liệu của dòng ấy mất, trong khi màn xem trước lại báo là đã giữ.
  Căn cứ: Màn hình hứa nhiều hơn cái được lưu nên người dùng bị mất dữ liệu mà không hay; người dùng chỉ lấy lại được bằng cách nhập lại file.
  file: `src/modules/imports/table.ts`
  severity: medium
  Đề xuất: new-contract

- **A remembered spelling or unit code that appears only before the last batch is learned in its folded form**
  Người dùng thấy gì: Sàn có thể được ghi nhớ cách viết không dấu, viết thường như «so hong» thay vì «Sổ hồng», và danh sách đã học hiện chữ ấy ra.
  Căn cứ: Việc khớp vẫn chạy đúng, chỉ xấu chữ và ít xảy ra; người dùng tự sửa được.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **A failed request for the list agents is hidden: the team lead sees an empty picker and cannot import**
  Người dùng thấy gì: Khi mất mạng hoặc máy chủ lỗi, trưởng nhóm thấy danh sách người đứng tin trống, không có thông báo, và không nhập tiếp được.
  Căn cứ: Không mất dữ liệu và tải lại trang là thử lại được, nhưng người dùng sẽ bối rối vì không có lời giải thích.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: low
  Đề xuất: known-limits

- **A CSV file that is not UTF-8 is decoded without complaint and imports replacement characters**
  Người dùng thấy gì: File CSV lưu bằng bảng mã cũ sẽ bị nhập với chữ có dấu thành ký tự lỗi mà không có cảnh báo nào.
  Căn cứ: Dữ liệu hỏng được ghi vào kho mà người dùng không biết, phải sửa tay từng ô sau đó; người dùng hay lưu CSV từ Excel nên khá dễ gặp.
  file: `src/modules/imports/read-file.ts`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 (khẳng định âm một mình): bài «trả 500 mà không lộ chữ của lỗi» chỉ kiểm nhật ký không chứa «0900»**
  Người dùng thấy gì: Bài kiểm có thể báo xanh dù máy chủ vẫn để lộ nội dung lỗi, nên người dùng có thể thấy chữ nhạy cảm trong thông báo lỗi.
  Căn cứ: Là chỗ hở của bài kiểm, chưa có bằng chứng lỗi thật; sửa bài kiểm rẻ nhưng không gấp.
  file: `tests/nhap-excel-may-chu.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm một mình): bài quét «đường nhập không chạm lớp llm» không có ca cài sẵn để thấy nó bắt được**
  Người dùng thấy gì: Bài kiểm có thể không bắt được trường hợp phần nhập Excel vô tình gọi sang trợ lý AI.
  Căn cứ: Chỉ làm lưới kiểm yếu đi, người dùng không thấy gì; sửa sau rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận có ô không đo gì): 12 trong 44 ô của AC-2 là ô lưới so với chính nó**
  Người dùng thấy gì: Báo cáo nói đã so màu ở 44 chỗ nhưng thật ra chỉ 32 chỗ, nên màu nhãn trạng thái được kiểm ít hơn con số in ra.
  Căn cứ: Các chỗ quan trọng vẫn được so thật, chỉ con số in ra bị thổi phồng; sửa con số hay thêm ô là rẻ.
  file: `tests/e2e/chuan-hoa-mau.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (dữ liệu viết tay theo khuôn bên đọc): lượt đỏ «vẽ lại ổ khoá» của AC-3 là bản ghi giả, không chạy qua bộ đọc trang**
  Người dùng thấy gì: Nếu ổ khoá vô tình hiện lại ở ô đã khoá, bài kiểm có thể không báo đỏ đúng chỗ, người dùng sẽ thấy ổ khoá thừa.
  Căn cứ: Chỉ là chỗ hở nhỏ của bài kiểm, hậu quả nếu có là hình thức và tự hiện ra khi nhìn; sửa sau rẻ.
  file: `tests/e2e/chuan-hoa-mau.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm một mình): «an unread value was saved» đọc một lần và không có lượt đỏ như E8 hứa**
  Người dùng thấy gì: Bài kiểm có thể không phát hiện việc giá trị gõ chưa hiểu được lưu nhầm khi bấm ra ngoài ô.
  Căn cứ: Là chỗ hở của lưới kiểm, chưa có lỗi thật và bên có cơ sở dữ liệu đã có kiểm đếm lần ghi; bổ sung sau rẻ.
  file: `tests/e2e/chuan-hoa-sua-o.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
