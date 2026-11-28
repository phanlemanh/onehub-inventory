# Review findings: tin-rao-giu-gia-tri-rieng (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **SP-1 sign hit not raised for a person at the Evidence Gate (PR 'Người cần quyết' is incomplete)**
  Người dùng thấy gì: Lệnh đọc lại các lần nhập cũ chạy bằng quyền chủ cơ sở dữ liệu và chủ kho chưa được nêu rõ điều này ở bước duyệt. Người dùng cuối không thấy gì khác.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉ là một dòng cần bổ sung vào lời trình, sửa rất rẻ ở bất kỳ lúc nào.
  file: `db/scripts/doc-lai-tep.ts`
  severity: medium
  Đề xuất: known-limits

- **Module boundary: imports writes tables owned by listings and company-config directly**
  Người dùng thấy gì: Phần nhập tệp ghi thẳng vào dữ liệu của phần khác thay vì đi qua cửa chung. Người dùng vẫn nhập được bình thường.
  Căn cứ: Chỉ là chuyện cấu trúc bên trong, không làm mất hay lộ dữ liệu; đã được ghi nhận và có hàng riêng để siết.
  file: `src/modules/imports/store.ts`
  severity: low
  Đề xuất: known-limits

- **Module boundary: listings reads company-config's table without a declared dependency**
  Người dùng thấy gì: Phần tin rao đọc thẳng dữ liệu căn chờ khớp của phần cấu hình sàn mà chưa khai phụ thuộc. Người dùng không thấy khác biệt.
  Căn cứ: Không có hậu quả với người dùng; chỉ là nợ cấu trúc, sửa sau không đắt và không gấp.
  file: `src/modules/listings/listings-http.ts`
  severity: low
  Đề xuất: known-limits

- **Authorization doors: the new listing_units upi write is missing from updateListing's db doors and the role x door matrix**
  Người dùng thấy gì: Việc đổi liên kết căn của một tin chưa có phép thử riêng theo từng vai, dù hiện vẫn bị chặn đúng với vai không có quyền.
  Căn cứ: Quyền hiện vẫn đúng nên người dùng không bị ảnh hưởng; rủi ro chỉ là về sau ai đó vô tình làm hở mà không có phép thử báo.
  file: `db/migrations/020_tin_rao_gia_tri_rieng.sql`
  severity: low
  Đề xuất: known-limits

- **Tier: high, code-owner merge required**
  Người dùng thấy gì: Thay đổi này thuộc mức cao nên chủ kho phải tự gộp, không tự gộp được.
  Căn cứ: Không phải lỗi và không ảnh hưởng người dùng; chỉ là nhắc quy trình.
  file: `db/migrations/015_nhap_excel.sql`
  severity: low
  Đề xuất: known-limits

- **Wizard crashes when the list-agents request fails: the error body is set as the agent list**
  Người dùng thấy gì: Khi máy chủ lỗi lúc tải danh sách đầu chủ, trưởng nhóm có thể thấy màn nhập tệp sập ở bước cuối; mất mạng thì danh sách trống mà không báo gì.
  Căn cứ: Gặp ở trưởng nhóm khi mạng hoặc máy chủ trục trặc, chưa nhập xong nên không mất dữ liệu, tải lại và thử lại được; thuộc màn nhập tệp nên sửa ở hàng riêng.
  file: `src/modules/imports/ui/import-wizard.tsx`
  severity: medium
  Đề xuất: new-contract

- **A file with very many rows throws RangeError before the row limit is checked; the screen stays busy and shows no message**
  Người dùng thấy gì: Một tệp có rất nhiều dòng ngắn làm màn nhập tệp kẹt ở trạng thái đang bận mà không báo quá nhiều dòng.
  Căn cứ: Hiếm gặp, không mất dữ liệu và người dùng tải lại trang là thoát; nhưng không có lời báo nên dễ khó hiểu, nên sửa ở hàng nhập tệp.
  file: `src/modules/imports/read-file.ts`
  severity: medium
  Đề xuất: new-contract

- **Shape 2 (the write is never run, no round trip through the writer): xem-truoc-bang-ghi stands in for the write with the attributeFits predicate**
  Người dùng thấy gì: Màn xem trước của lần nhập có thể hiện một giá trị mà lúc ghi thật lại bị bỏ, và bộ kiểm hiện tại sẽ không phát hiện nếu hai chỗ này lệch nhau về sau. Hôm nay hai chỗ dùng chung một luật nên người dùng chưa gặp lỗi.
  Căn cứ: Chưa có lỗi nào người dùng thấy, chỉ là lưới kiểm chưa bắt được lệch trong tương lai; nếu có lệch thì tệ nhất là một ô nhập bị bỏ và người dùng nhập lại được, còn sửa lưới kiểm thì làm sau cũng không đắt.
  file: `tests/tin-rao-gia-tri-rieng.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims a full sweep of the class but has only point cases, no matrix written before and counted): «ma tran thu tu goi» (G-2811-96)**
  Người dùng thấy gì: Phép thử thứ tự gửi các lô khi nhập tệp chưa liệt kê hết mọi thứ tự có thể xảy ra.
  Căn cứ: Không có lỗi người dùng nào được chỉ ra và thuộc phần nhập tệp; chỉ là độ phủ thử còn thiếu.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 5 (claims a sweep of the class, covers one column): the phone-number sweep reads only import_runs.kept but the claim is «anywhere on the import record»**
  Người dùng thấy gì: Phép thử chỉ kiểm số điện thoại ở một nơi lưu của lần nhập, chưa kiểm các nơi khác của cùng bản ghi.
  Căn cứ: Chưa thấy số điện thoại nào lọt ra thật; rủi ro nhỏ và chỉ nằm ở độ phủ của phép thử, bổ sung sau rẻ.
  file: `tests/db/nhap-excel.db.test.ts`
  severity: low
  Đề xuất: known-limits

- **SP-1 / AGENTS invariant 1: writes to company tables bypass withCompany and row security (owner connection) (r1 · tệp đã đổi)**
  Người dùng thấy gì: Lệnh chạy một lần để đọc lại các lần nhập cũ ghi vào tin của mọi sàn bằng quyền chủ cơ sở dữ liệu, không qua cửa cách ly từng sàn. Hôm nay không có dữ liệu nào lẫn giữa các sàn, nhưng việc giữ cách ly dựa vào mã chứ chưa phải cơ sở dữ liệu.
  Căn cứ: Chỉ là lệnh chạy một lần do người vận hành bấm, không lộ dữ liệu cho người dùng nào; nhưng đây là điều giới hạn cứng nên cần người ký nhìn thấy và nhận.
  file: `db/scripts/doc-lai-tep.ts`
  severity: high
  Đề xuất: known-limits

- **Records: PR 'Người cần quyết' does not list the SP-1 marker hit (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bản mô tả thay đổi chưa nêu việc lệnh đọc lại dùng quyền chủ cơ sở dữ liệu, nên người ký có thể không biết để cân nhắc.
  Căn cứ: Người dùng cuối không thấy gì khác đi; chỉ cần một dòng ghi chú vào mô tả khi ký, sửa rất rẻ và không mất dữ liệu.
  file: `src/modules/imports/reread.ts`
  severity: medium
  Đề xuất: wont-fix

- **Domain: new database door listing_units update (upi) is not declared in ontology/actions.yaml (r1)**
  Người dùng thấy gì: Bảng khai quyền chưa ghi việc đổi liên kết căn của tin, nên bảng quyền theo vai có thể thiếu một dòng. Người dùng không thấy khác biệt trên màn.
  Căn cứ: Chỉ là khai báo thiếu, không làm lộ hay mất dữ liệu và không đổi cách dùng; bổ sung sau rất rẻ.
  file: `ontology/actions.yaml`
  severity: low
  Đề xuất: known-limits

- **Convention: migration numbers reused (015, 020) against /new-migration 'highest number plus one' (r1)**
  Người dùng thấy gì: Hai cặp tệp cập nhật cơ sở dữ liệu dùng chung số thứ tự, thứ tự chạy dựa vào tên. Người dùng không nhận ra gì nếu mọi thứ chạy đúng thứ tự.
  Căn cứ: Không ảnh hưởng người dùng và có tiền lệ trong quyết định cũ; chỉ cần ghi vết ngoại lệ.
  file: `db/migrations/015_vai_danh_tinh_tam_quyen_tao.sql`
  severity: low
  Đề xuất: wont-fix

- **Evidence: CI not green on the reviewed commit (r1)**
  Người dùng thấy gì: Một bước kiểm tra tự động của bản này đang đỏ và vài bước chưa xong, nên chưa thể coi kết quả kiểm thử là đã qua.
  Căn cứ: Đỏ này đã được báo trước và sẽ hết sau vòng chấm; không đụng tới dữ liệu người dùng, và người gộp sẽ thấy trước khi gộp.
  file: `.github/workflows/deploy.yml`
  severity: low
  Đề xuất: known-limits

- **A living area of 0 from a file shows as a kept value in the preview, then is dropped without notice on write (r1 · tệp đã đổi)**
  Người dùng thấy gì: Nếu tệp nhập ghi diện tích là 0, bản xem trước báo sẽ giữ giá trị ấy nhưng khi ghi thì bỏ đi âm thầm, tin không có diện tích riêng.
  Căn cứ: Hiếm gặp, chỉ mất một ô vốn vô nghĩa và người dùng gõ lại được; nhưng lời hứa ở bước xem trước lệch với kết quả.
  file: `src/modules/imports/mark.ts`
  severity: low
  Đề xuất: known-limits

- **Shape 3 (presence of a string where the promise is a relation), with shape 1: the markValue sweep greps the source for the token `choice:` instead of checking that the person's choice is passed (r1)**
  Người dùng thấy gì: Một bài kiểm tra chỉ dò xem chữ có mặt trong mã chứ chưa chứng minh lựa chọn của người dùng được truyền đi, nên có thể bỏ sót một lỗi sau này.
  Căn cứ: Không ảnh hưởng người dùng hôm nay; chỉ làm lưới an toàn lỏng hơn tên bài hứa, bổ sung sau không đắt.
  file: `tests/nhap-excel-noi-ghi.test.ts`
  severity: medium
  Đề xuất: known-limits

- **Shape 3 / shape 4: the «Khớp» column of the rebuilt carried blocks compares the new block with itself and can never show «KHÔNG» (r1)**
  Người dùng thấy gì: Bảng bằng chứng của một việc khác báo «khớp» luôn là «có», nên chủ kho có thể tin vào một phép so sánh chưa từng được làm.
  Căn cứ: Chỉ là tài liệu bằng chứng của việc khác, không chạm người dùng cuối; đáng ghi vết nhưng không đáng mở việc.
  file: `_acceptance/khung-luoi-va-ngan-chi-tiet/rang/dung-lai-mang-sang.mjs`
  severity: medium
  Đề xuất: wont-fix

- **Shape 3: the E1 surface test claims ⌘K and the place tree are built from the listing's own value, but asserts only that they are non-empty (r1 · tệp đã đổi)**
  Người dùng thấy gì: Bài kiểm tra nói rằng ô tìm nhanh và cây địa lý đọc giá trị riêng của sàn, nhưng chỉ kiểm tra là có kết quả, nên nếu chúng đọc nhầm danh mục thì không bị bắt.
  Căn cứ: Hai chỗ này không hiện thuộc tính căn nên rủi ro cho người dùng thấp; chỉ là lưới kiểm tra lỏng.
  file: `tests/tin-rao-gia-tri-rieng.test.ts`
  severity: low
  Đề xuất: known-limits

⚠ Cụm ngoài vùng phủ: 3/10 lỗi rơi vào file không bộ đo nào phủ (db/scripts/doc-lai-tep.ts, tests/db/nhap-excel.db.test.ts) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
