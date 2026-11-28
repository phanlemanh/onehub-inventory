# Review findings: chuan-hoa-he-design (round 4)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records — PR #136 says something untrue about which files raise the tier**
  Người dùng thấy gì: Phần mô tả của đợt gộp nói thiếu một tệp công cụ kiểm thử đã đổi và hai tệp cấp rồi thu quyền. Người duyệt có thể đánh giá sai mức rủi ro nếu chỉ đọc mô tả.
  Căn cứ: Chỉ là chữ trong mô tả, không đổi hành vi nào người dùng thấy; sửa lại mô tả sau rất rẻ và không mất dữ liệu.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

- **Intent — the PR carries all of row 11 (#130 is still open), with its schema and permission changes**
  Người dùng thấy gì: Nếu đợt này vào kho chính trước đợt nhập Excel, phần nhập Excel cùng thay đổi quyền dữ liệu sẽ vào mà chưa qua cổng duyệt riêng của nó.
  Căn cứ: Hậu quả nặng nếu gộp sai thứ tự vì đụng vùng cách ly giữa các công ty, nhưng người gộp có thể tránh bằng cách chờ gộp đúng thứ tự.
  file: `db/migrations/015_nhap_excel.sql`
  severity: medium
  Đề xuất: new-contract

- **Design — the imports module reaches into other modules' tables, and writes one of them**
  Người dùng thấy gì: Phần nhập Excel ghi thẳng vào dữ liệu của phần khác nên sau này đổi một bên dễ làm hỏng bên kia. Người dùng hiện chưa thấy gì khác.
  Căn cứ: Nợ thiết kế đã được ghi nhận trong quyết định, chưa gây mất hay lộ dữ liệu; trả sau không đắt hơn nhiều.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Records — the Listing wiki page was not updated though Listing's behaviour changed**
  Người dùng thấy gì: Tài liệu về lần chào còn nói xoá chỉ là gỡ khỏi danh sách, trong khi hoàn tác nhập Excel xoá hẳn. Người đọc tài liệu có thể hiểu sai.
  Căn cứ: Chỉ là tài liệu cũ, không ảnh hưởng người dùng cuối; cập nhật lại nhanh và không mất gì. Đối chiếu (dãy N, 28/11, G-2811-105): giám sát chuyển việc cập nhật trang wiki Listing cho dãy R (hàng 3h, hàng đổi hành vi Listing nhiều nhất).
  file: `wiki/entities/listing.md`
  severity: low
  Đề xuất: known-limits

- **Migrations — two migrations share the number 015**
  Người dùng thấy gì: Hai tệp cập nhật cơ sở dữ liệu mang cùng số nên thứ tự chạy dựa vào cách sắp tên. Kết quả cuối vẫn đúng.
  Căn cứ: Kết quả cuối đúng, không tệp đã chốt nào bị sửa; đổi số lúc này còn rủi ro hơn là để nguyên. Đối chiếu (dãy N, 28/11, G-2811-105): đây đã là mục Treo-43 chờ chủ kho phê trên thẻ hàng 11 (hồ sơ nhap-excel); thẻ này chỉ dẫn tới đó.
  file: `db/migrations/015_vai_danh_tinh_tam_quyen_tao.sql`
  severity: low
  Đề xuất: wont-fix

- **Evidence — the checks on the reviewed commit are not green**
  Người dùng thấy gì: Bản đã chấm chưa có kết quả kiểm tự động xanh trọn vẹn trên máy chủ, nên chưa thể coi là đã qua.
  Căn cứ: Chỉ là chưa đủ bằng chứng, không phải lỗi người dùng gặp; chạy lại và đẩy bản mới là xong.
  file: `_acceptance/chuan-hoa-he-design/run-log.jsonl`
  severity: low
  Đề xuất: known-limits

- **Shape 1, measuring the instruction instead of the output: the 'break pinned' step of 'goi cuoi doi cac goi truoc' only checks a copy of the rule written inside the test**
  Người dùng thấy gì: Một bước kiểm thứ tự gói nhập chỉ so với bản sao quy tắc trong bài kiểm, nên nếu quy tắc thật bị xoá thì bài vẫn xanh.
  Căn cứ: Các kiểm khác cùng ca vẫn đo máy chủ thật, nên lỗi khó lọt hoàn toàn; sửa sau rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5, claims to sweep the whole class but has only point cases: 'ma tran thu tu goi (G-2811-96)' has no list of orders written beforehand and no count**
  Người dùng thấy gì: Bài kiểm các thứ tự gửi gói nhập chỉ phủ vài ca, nên thêm hay bớt một thứ tự sẽ không ai biết.
  Căn cứ: Không ảnh hưởng người dùng ngay; chỉ làm lưới an toàn thưa hơn và bổ sung sau không đắt.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3, asserting that a string is present while the promise is a relation: the markValue sweep only greps for the token 'choice:'**
  Người dùng thấy gì: Bài kiểm chỉ xem có chữ lựa chọn trong mã, chưa chắc phần ghi dùng đúng lựa chọn người dùng đã xem trước.
  Căn cứ: Phép so giá trị thật đã có ở bài kiểm cơ sở dữ liệu, nên rủi ro thấp; siết lại sau rẻ.
  file: `tests/nhap-excel-noi-ghi.test.ts`
  severity: low
  Đề xuất: known-limits

- **SP-1 / identity exemption: the 11th privileged function was widened without the owner's word (r3)**
  Người dùng thấy gì: Một quyền đọc đặc biệt giữa các công ty được mở rộng cho người chỉ nhập hàng của mình mà chủ kho chưa duyệt. Người đó có thể thấy dòng của chính mình ở danh sách môi giới, còn màn hình thì vẫn hiện rỗng nên hai nơi nói khác nhau.
  Căn cứ: Đây là việc đổi quyền chưa có chữ ký chủ kho, hậu quả nhẹ về dữ liệu vì chỉ lộ dòng của chính người đó, nhưng phải do chủ kho duyệt ở hồ sơ nhập Excel chứ không sửa lẫn vào đợt màu và phím.
  file: `db/migrations/019_nhap_excel_moi_noi_cua_minh.sql`
  severity: high
  Đề xuất: new-contract

- **Module boundaries: imports reads and writes other modules' tables directly (r3 · tệp đã đổi)**
  Người dùng thấy gì: Phần nhập Excel đọc và ghi thẳng vào dữ liệu của các phần khác, nên có thể bỏ qua quy tắc ghi của chúng, ví dụ không tạo phiên bản mới cho tin rao khi sửa. Người dùng chưa thấy lỗi nào ngay.
  Căn cứ: Hiện chưa gây sai dữ liệu người dùng thấy được, chỉ làm mã khó giữ về sau; sửa tốn công nhiều phần nên nên ghi lại và làm trong hồ sơ riêng.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: known-limits

- **Personal data: owner name and phone cells reach the server even though they never go into the import (r3 · tệp đã đổi)**
  Người dùng thấy gì: Khi nhập file, tên và số điện thoại chủ nhà vẫn được gửi lên máy chủ dù không được lưu. Số thật đi qua mạng mà không cần thiết.
  Căn cứ: Máy chủ không lưu và không ghi nhật ký các ô này nên không mất hay lộ dữ liệu về lâu dài, mức nhẹ và có thể sửa sau ở hồ sơ nhập Excel.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: low
  Đề xuất: known-limits

- **Real personal data in the repo: the owner's e-mail address in the new contracts (r3)**
  Người dùng thấy gì: Địa chỉ thư thật của chủ kho nằm trong các tệp hợp đồng trong kho mã. Người dùng cuối không thấy gì khác đi.
  Căn cứ: Không ảnh hưởng người dùng sản phẩm, chỉ là luật về dữ liệu cá nhân trong kho; là thói quen có sẵn của bộ nghiệm thu nên ghi nhận và sửa đồng loạt sau.
  file: `_acceptance/chuan-hoa-he-design/contract.md`
  severity: low
  Đề xuất: known-limits

- **Migrations 016 and 019 fail for a non-superuser owner because 004 has already taken back CREATE on schema app (r3)**
  Người dùng thấy gì: Lần đưa lên môi trường thử hoặc thật kế tiếp có thể dừng giữa chừng khi cập nhật cơ sở dữ liệu, nên các tính năng mới chưa lên được. Dữ liệu hiện có không mất.
  Căn cứ: Chặn việc phát hành chứ không làm mất dữ liệu, thử lại được sau khi sửa, và việc sửa nhỏ nhưng thuộc các tệp của hàng nhập Excel chứ không phải lát màu và phím. Đối chiếu sự thật (dãy N, 28/11, G-2811-105): đã sửa ở hàng 11, commit ecdc1ae0 (015 và 020 cấp rồi thu lại quyền tạo quanh 016 và 019), nằm trong HEAD của nhánh này; đây là đối chiếu, chủ kho vẫn quyết mục.
  file: `db/migrations/016_nhap_excel_dau_chu.sql`
  severity: high
  Đề xuất: new-contract

- **The cach-ly-dich case passes on a database whose migration stopped partway (r3)**
  Người dùng thấy gì: Một bài kiểm tra cách ly dữ liệu có thể báo xanh dù cơ sở dữ liệu mới dựng dở. Người dùng không thấy gì, nhưng đội có thể tin nhầm là đã an toàn.
  Căn cứ: Chỉ làm bài kiểm tra kém chặt, lỗi thật vẫn được bài khác bắt, sửa rẻ nhưng không gấp.
  file: `tests/db/chu-khong-sieu-cap.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 (kiểm chuỗi có mặt trong khi lời hứa là quan hệ giữa các giá trị): dòng xanh của da-ap-tu-truoc in số «13 tệp cũ» viết cứng, và E2/E4 ghim các số 14/15/13 trong khi cây đang kiểm có 20 migration (r3)**
  Người dùng thấy gì: Bài đo của một hồ sơ cũ in con số sai về số tệp đã áp và báo xanh dù không đo đúng. Người dùng không thấy ảnh hưởng.
  Căn cứ: Chỉ là chữ in sai trong công cụ kiểm của hồ sơ khác, không ảnh hưởng dữ liệu hay màn hình, sửa sau khi hồ sơ ấy được mở lại.
  file: `_acceptance/migration-vai-chu-khong-sieu-cap/rang/kiem.mjs`
  severity: medium
  Đề xuất: known-limits

- **Design (AGENTS.md, Architecture): a module reads other modules' tables (r2 · tệp đã đổi)**
  Người dùng thấy gì: Luật về căn rao và căn chờ nằm ở hai nơi, nên sau này sửa một nơi mà quên nơi kia có thể làm hai màn xử lý khác nhau.
  Căn cứ: Hiện chưa làm người dùng thấy sai gì, chỉ là nợ cấu trúc; sửa càng muộn càng đắt nhưng không mất dữ liệu.
  file: `src/modules/imports/store.ts`
  severity: medium
  Đề xuất: new-contract

- **Records (modules.yaml / AGENTS.md): a new module dependency has no decision page (r2)**
  Người dùng thấy gì: Người sau đọc sổ sẽ không biết vì sao nhập Excel được phụ thuộc vào bốn phần khác của hệ thống.
  Căn cứ: Chỉ thiếu ghi chép, người dùng không bị ảnh hưởng và bổ sung lúc nào cũng được.
  file: `architecture/modules.yaml`
  severity: medium
  Đề xuất: known-limits

- **Records / Human decisions needed: migration 019 changes an owner-approved function, and the owner's word is not recorded (r2)**
  Người dùng thấy gì: Một thay đổi về việc ai được chọn người đứng tin khi nhập Excel chưa có lời duyệt của chủ kho được ghi lại.
  Căn cứ: Là việc xin duyệt ở hồ sơ khác; nếu chủ kho bác thì phải làm lại bằng bản cập nhật mới, không mất dữ liệu.
  file: `db/migrations/019_nhap_excel_moi_noi_cua_minh.sql`
  severity: medium
  Đề xuất: known-limits

- **Tier (governance/autonomy.yaml): the PR states the wrong tier (r2)**
  Người dùng thấy gì: Mô tả thay đổi ghi nhẹ hơn thực tế, nên người gộp có thể tưởng không cần chủ mã duyệt.
  Căn cứ: Chỉ là chữ trong mô tả, sửa một dòng là xong và không ảnh hưởng người dùng cuối.
  file: `PR #136 description (feat/chuan-hoa-he-design)`
  severity: medium
  Đề xuất: known-limits

- **Evidence: required checks not green on HEAD (r2)**
  Người dùng thấy gì: Các kiểm tra tự động của bản này chưa xanh hẳn, nên chưa thể coi là sẵn sàng gộp.
  Căn cứ: Là trạng thái tạm của bản đang chạy, chạy lại hoặc sửa là biết; chưa có dữ liệu người dùng nào bị ảnh hưởng.
  file: `PR #136 / PR #130 checks`
  severity: medium
  Đề xuất: known-limits

- **Criteria and tests: the shared empty-state check was loosened without the owner's approval (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm trạng thái trống giờ chấp nhận cả liên kết thay nút, nên một màn lẽ ra phải có nút có thể lọt qua mà không ai thấy.
  Căn cứ: Chỉ làm kiểm tra lỏng hơn, người dùng thấy tối đa một màn trống thiếu nút; sửa sau không tốn nhiều.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **Authorization (defense in depth, SP-1 layer): UPDATE is granted on the whole import_runs table (r2)**
  Người dùng thấy gì: Ở tầng dữ liệu, người có quyền nhập của mình có thể sửa cả những thông tin của lần nhập mà lẽ ra chỉ hệ thống được đổi, kể cả mở lại lần nhập đã hoàn tác.
  Căn cứ: Hiện không có đường nào ngoài giao diện dùng được lỗ hở này nên chưa ai bị hại; vá cần bản cập nhật dữ liệu mới nhưng không gấp.
  file: `db/migrations/015_nhap_excel.sql`
  severity: low
  Đề xuất: new-contract

- **Closing price and closing date columns are read and counted, then silently dropped when the import writes (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi nhập file Excel, cột giá chốt và ngày chốt được tính là đã nhận nhưng không được lưu ở đâu, và không ai báo cho người nhập biết.
  Căn cứ: Mất dữ liệu thật mà người dùng không hay biết, phải nhập lại từ file gốc mới có lại; nên sửa ở hồ sơ nhập Excel. Đối chiếu sự thật (dãy N, 28/11, G-2811-105): đã sửa ở hàng 11, commit 25311d32 (lần nhập ghi đủ mọi giá trị màn xem trước đã hứa), nằm trong HEAD của nhánh này; đây là đối chiếu, chủ kho vẫn quyết mục.
  file: `src/modules/imports/store.ts`
  severity: high
  Đề xuất: new-contract

- **A row whose unit code points to several units, with the question left unanswered, is dropped without its cells being kept (r2 · tệp đã đổi)**
  Người dùng thấy gì: Dòng có mã căn khớp nhiều căn mà người nhập chưa trả lời thì bị bỏ, dữ liệu của dòng ấy mất, trong khi màn xem trước lại báo là đã giữ.
  Căn cứ: Màn hình hứa nhiều hơn cái được lưu nên người dùng bị mất dữ liệu mà không hay; người dùng chỉ lấy lại được bằng cách nhập lại file. Đối chiếu sự thật (dãy N, 28/11, G-2811-105): đã sửa ở hàng 11, commit e6364f7a (dòng bị bỏ ra vẫn giữ ô và được đếm), nằm trong HEAD của nhánh này; đây là đối chiếu, chủ kho vẫn quyết mục.
  file: `src/modules/imports/table.ts`
  severity: medium
  Đề xuất: new-contract

- **A remembered spelling or unit code that appears only before the last batch is learned in its folded form (r2 · tệp đã đổi)**
  Người dùng thấy gì: Sàn có thể được ghi nhớ cách viết không dấu, viết thường như «so hong» thay vì «Sổ hồng», và danh sách đã học hiện chữ ấy ra.
  Căn cứ: Việc khớp vẫn chạy đúng, chỉ xấu chữ và ít xảy ra; người dùng tự sửa được.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **A failed request for the list agents is hidden: the team lead sees an empty picker and cannot import (r2 · tệp đã đổi)**
  Người dùng thấy gì: Khi mất mạng hoặc máy chủ lỗi, trưởng nhóm thấy danh sách người đứng tin trống, không có thông báo, và không nhập tiếp được.
  Căn cứ: Không mất dữ liệu và tải lại trang là thử lại được, nhưng người dùng sẽ bối rối vì không có lời giải thích.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: low
  Đề xuất: known-limits

- **A CSV file that is not UTF-8 is decoded without complaint and imports replacement characters (r2 · tệp đã đổi)**
  Người dùng thấy gì: File CSV lưu bằng bảng mã cũ sẽ bị nhập với chữ có dấu thành ký tự lỗi mà không có cảnh báo nào.
  Căn cứ: Dữ liệu hỏng được ghi vào kho mà người dùng không biết, phải sửa tay từng ô sau đó; người dùng hay lưu CSV từ Excel nên khá dễ gặp. Đối chiếu sự thật (dãy N, 28/11, G-2811-105): đã sửa ở hàng 11, commit e6364f7a (tệp .csv không phải UTF-8 bị từ chối), nằm trong HEAD của nhánh này; đây là đối chiếu, chủ kho vẫn quyết mục.
  file: `src/modules/imports/read-file.ts`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 4 (khẳng định âm một mình): bài «trả 500 mà không lộ chữ của lỗi» chỉ kiểm nhật ký không chứa «0900» (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm có thể báo xanh dù máy chủ vẫn để lộ nội dung lỗi, nên người dùng có thể thấy chữ nhạy cảm trong thông báo lỗi.
  Căn cứ: Là chỗ hở của bài kiểm, chưa có bằng chứng lỗi thật; sửa bài kiểm rẻ nhưng không gấp.
  file: `tests/nhap-excel-may-chu.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm một mình): bài quét «đường nhập không chạm lớp llm» không có ca cài sẵn để thấy nó bắt được (r2 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm có thể không bắt được trường hợp phần nhập Excel vô tình gọi sang trợ lý AI.
  Căn cứ: Chỉ làm lưới kiểm yếu đi, người dùng không thấy gì; sửa sau rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (ma trận có ô không đo gì): 12 trong 44 ô của AC-2 là ô lưới so với chính nó (r2)**
  Người dùng thấy gì: Báo cáo nói đã so màu ở 44 chỗ nhưng thật ra chỉ 32 chỗ, nên màu nhãn trạng thái được kiểm ít hơn con số in ra.
  Căn cứ: Các chỗ quan trọng vẫn được so thật, chỉ con số in ra bị thổi phồng; sửa con số hay thêm ô là rẻ.
  file: `tests/e2e/chuan-hoa-mau.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 (dữ liệu viết tay theo khuôn bên đọc): lượt đỏ «vẽ lại ổ khoá» của AC-3 là bản ghi giả, không chạy qua bộ đọc trang (r2)**
  Người dùng thấy gì: Nếu ổ khoá vô tình hiện lại ở ô đã khoá, bài kiểm có thể không báo đỏ đúng chỗ, người dùng sẽ thấy ổ khoá thừa.
  Căn cứ: Chỉ là chỗ hở nhỏ của bài kiểm, hậu quả nếu có là hình thức và tự hiện ra khi nhìn; sửa sau rẻ.
  file: `tests/e2e/chuan-hoa-mau.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 (khẳng định âm một mình): «an unread value was saved» đọc một lần và không có lượt đỏ như E8 hứa (r2)**
  Người dùng thấy gì: Bài kiểm có thể không phát hiện việc giá trị gõ chưa hiểu được lưu nhầm khi bấm ra ngoài ô.
  Căn cứ: Là chỗ hở của lưới kiểm, chưa có lỗi thật và bên có cơ sở dữ liệu đã có kiểm đếm lần ghi; bổ sung sau rẻ.
  file: `tests/e2e/chuan-hoa-sua-o.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
