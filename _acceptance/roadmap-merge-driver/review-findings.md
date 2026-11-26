# Review findings: roadmap-merge-driver (round 1)

## Trong hợp đồng

- **AC-7 của hợp đồng đã ký không kể wiki/index.md; thước change-set được nới sau cổng để nhận tệp này**
  file: `_acceptance/roadmap-merge-driver/rang/matrix.mjs:96`
  severity: low
  AC: AC-7
  source: conventions
  detail: AC-7 (`contract.md` dòng 110) liệt kê các tệp nhánh được đổi và không có `wiki/index.md`. Nhánh có đổi tệp này (thêm một dòng trỏ trang 0046). Thước `change-set` vẫn xanh vì `ROUND_FILES` trong `matrix.mjs` được thêm `wiki/index.md` ở bước S3, sau khi Cổng Phạm vi đã niêm.

  Việc thêm dòng mục lục là đúng luật của kho: AGENTS.md đòi thêm dòng trỏ khi `wiki/index.md` còn trong git. Việc nới thước cũng có khai ở sổ, dòng d-20261121T075805Z-17 (type `fix`, không có `decided_by`).

  Điểm lệch là chữ của tiêu chí đã ký không còn đúng với diff: từ Gate 1 tới HEAD hợp đồng chỉ đổi `status`, và cả `contract.md`, `evals.yaml` lẫn `card-plain.json` đều không nhắc `wiki/index.md`. Người duyệt ở cổng này cần biết E7 đạt theo danh sách đã nới, không theo danh sách trong hợp đồng.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tác tử sửa .github/workflows/security.yml bằng git apply, đi vòng lệnh cấm Edit — ngoại lệ có ghi lời duyệt của chủ kho**
  Người dùng thấy gì: Máy đã sửa tệp cấu hình quét bảo mật mà quy định thường chỉ cho người sửa. Chủ kho đã đồng ý trước, nhưng người gộp nên tự xác nhận lại.
  Căn cứ: Không ảnh hưởng người dùng cuối và đã có lời duyệt ghi sổ; chỉ cần người gộp xác nhận một lần, không tốn gì để sửa.
  file: `.github/workflows/security.yml`
  severity: low
  Đề xuất: known-limits

- **Dòng kỳ vọng ghim trong evals.yaml của E4, E5, E7 không khớp dòng thước thật sự in**
  Người dùng thấy gì: Phần mô tả kết quả mong đợi của ba phép kiểm ghi hơi khác chữ so với kết quả thật. Người dùng không thấy gì; chỉ người đối chiếu từng chữ mới thấy lệch.
  Căn cứ: Chỉ là lệch câu chữ trong tài liệu nội bộ, không làm sai kết quả nghiệm thu và sửa lại lúc nào cũng được.
  file: `_acceptance/roadmap-merge-driver/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **evals.yaml ghim dòng kỳ vọng mà thước không bao giờ in (E4, E5, E7)**
  Người dùng thấy gì: Ba phép kiểm mô tả kết quả mong đợi khác chữ với kết quả thật. Người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ là sai khác câu chữ trong hồ sơ nội bộ, không gây mất dữ liệu và người đối chiếu tự sửa dễ dàng sau này.
  file: `_acceptance/roadmap-merge-driver/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Thước decision không đo chữ «mới» của AC-5: đếm mọi tệp wiki/log chứa chuỗi "0046"**
  Người dùng thấy gì: Phép kiểm có thể báo đạt nhầm hoặc đỏ nhầm trong tương lai khi nhật ký có thêm tệp chứa cùng số. Hiện tại kết quả vẫn đúng.
  Căn cứ: Kết quả hôm nay đúng và không ảnh hưởng người dùng; rủi ro chỉ là báo sai ở các vòng sau, chậm sửa cũng không mất gì.
  file: `_acceptance/roadmap-merge-driver/rang/decision.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 2 — fixture viết tay đúng khuôn bên đọc: bài đỏ của change-set tự gõ danh sách tệp, không rút từ `git diff`**
  Người dùng thấy gì: Phép kiểm phạm vi thay đổi có thể không thấy một tệp bị dời vào thư mục hồ sơ. Nhánh hiện tại không có trường hợp này.
  Căn cứ: Nhánh hiện tại sạch nên không có hậu quả thực; lỗ chỉ có thể che một thay đổi trái phép ở vòng khác và vá sau vẫn rẻ.
  file: `_acceptance/roadmap-merge-driver/rang/two-way.mjs`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — lời hứa là quan hệ giữa các giá trị, phép đo chỉ có chuỗi: E9 so số bài kiểm với một đường nền không ghi số nào**
  Người dùng thấy gì: Việc số bài kiểm không đổi so với trước chỉ được xác nhận qua việc bộ kiểm chạy xanh, không có con số đối chiếu. Không thấy dấu hiệu bài bị bỏ.
  Căn cứ: Không có dấu hiệu hỏng thật và bộ kiểm vẫn xanh; thiếu chỉ là con số đối chiếu, bổ sung sau không đắt.
  file: `_acceptance/roadmap-merge-driver/evals.yaml`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 3 — assert chuỗi có mặt cho một quan hệ: docs.mjs chỉ tìm chữ `make setup`, không nối nó với thứ thật sự đặt driver**
  Người dùng thấy gì: Nếu sau này lệnh cài đặt đổi cách chạy, trang hướng dẫn có thể sai mà phép kiểm vẫn xanh. Hiện tại hướng dẫn đúng.
  Căn cứ: Hướng dẫn hôm nay đúng nên người dùng không vấp; rủi ro chỉ xuất hiện khi lệnh cài đặt đổi và khi đó vẫn kịp sửa.
  file: `_acceptance/roadmap-merge-driver/rang/docs.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 3 — assert chuỗi có mặt cho một quan hệ: "đúng một tệp MỚI dưới wiki/log/ nhắc trang 0046" đo bằng chuỗi con "0046"**
  Người dùng thấy gì: Phép kiểm đếm nhật ký theo một dãy số trần nên có thể nhầm ở vòng sau. Kết quả hôm nay đúng.
  Căn cứ: Không ảnh hưởng người dùng và kết quả hiện tại đúng; chỉ có thể báo nhầm sau này, dễ phát hiện và sửa.
  file: `_acceptance/roadmap-merge-driver/rang/decision.mjs`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 4 — assertion âm tính không ghim thông điệp: hai nhánh should-NOT-fire của codeql và change-set chưa từng đỏ bằng thông điệp của chính nó**
  Người dùng thấy gì: Hai phép kiểm cấm vẫn hoạt động đúng khi thử tay, nhưng chưa có bài tự động chứng minh chúng báo đúng lý do. Người dùng không bị ảnh hưởng.
  Căn cứ: Đã thử tay và chạy đúng, hậu quả nếu hỏng sau này chỉ là mất một lớp canh nội bộ; thêm bài kiểm sau là việc rẻ.
  file: `_acceptance/roadmap-merge-driver/rang/two-way.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
