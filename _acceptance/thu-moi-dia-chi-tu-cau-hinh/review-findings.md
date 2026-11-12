# Review findings: thu-moi-dia-chi-tu-cau-hinh (round 2)

## Trong hợp đồng

(không có finding nào map được vào AC)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier (review-change step 10): an auth change is rated below high**
  Người dùng thấy gì: Thay đổi chạm vào đăng nhập nhưng công cụ chấm nó chỉ ở mức vừa, nên có thể được gộp mà không có chủ kho duyệt kỹ như thay đổi mức cao. Người dùng cuối không thấy lỗi nào từ việc này.
  Căn cứ: Hậu quả với người dùng là nhẹ vì chức năng vẫn chạy đúng, không mất hay lộ dữ liệu; chỉ cần chủ kho tự duyệt thay đổi này như mức cao và cân nhắc chỉnh bảng phân hạng sau.
  file: `src/modules/identity/config.ts`
  severity: high
  Đề xuất: known-limits

- **Language rule (AGENTS.md): Vietnamese comment in .env.example**
  Người dùng thấy gì: Một dòng chú thích trong tệp cấu hình mẫu viết bằng tiếng Việt trong khi quy ước kho dùng tiếng Anh. Người dùng cuối không thấy gì khác.
  Căn cứ: Hậu quả chỉ là lệch quy ước ghi chú cho người triển khai, không mất dữ liệu và không ảnh hưởng chạy; sửa sau rẻ nhưng phải đổi cả hợp đồng nên để chủ kho quyết.
  file: `.env.example`
  severity: low
  Đề xuất: known-limits

- **Intent (one concern per PR): the review range carries unrelated roadmap rows**
  Người dùng thấy gì: Phần duyệt chứa thêm tài liệu lộ trình của các hàng khác, làm bản duyệt dài hơn. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hậu quả chỉ là người duyệt phải đọc nhiều hơn, không mất hay lộ dữ liệu; tách lại tốn công hơn lợi ích nên chấp nhận và ghi vết.
  file: `_acceptance/bang-quyen-theo-vai/du-bao.json`
  severity: low
  Đề xuất: wont-fix

- **Evidence record: luat-cham.json points at a commit before HEAD**
  Người dùng thấy gì: Bản ghi kiểm luật sản phẩm chưa bao phủ commit cuối cùng, vốn chỉ đổi tên công ty mẫu trong bài kiểm. Người dùng không thấy khác biệt nào.
  Căn cứ: Hậu quả rất nhẹ vì commit cuối chỉ đổi chữ trong bài kiểm, không đụng dữ liệu hay hành vi; chạy lại rẻ nhưng không đáng mở thêm việc.
  file: `_acceptance/thu-moi-dia-chi-tu-cau-hinh/luat-cham.json`
  severity: low
  Đề xuất: wont-fix

- **Tier: auth code classified below high (r1)**
  Người dùng thấy gì: Thay đổi chạm vào cấu hình đăng nhập và thư mời nhưng hệ thống tự xếp ở bậc trung bình, nên có thể được gộp mà không cần người có thẩm quyền xem lại. Người dùng cuối không thấy khác biệt ngay, rủi ro nằm ở khâu duyệt.
  Căn cứ: Hành vi của sản phẩm vẫn đúng; chỉ là khâu duyệt lỏng hơn mong muốn, và chủ kho có thể tự xem lại thay đổi này hay chỉnh quy tắc xếp bậc bất cứ lúc nào mà không mất dữ liệu.
  file: `src/modules/identity/config.ts`
  severity: high
  Đề xuất: known-limits

- **Intent/criteria: acceptance evals still carry the unresolved Hỏi-1 branch (r1)**
  Người dùng thấy gì: Tài liệu nghiệm thu vẫn còn ghi cả hai nhánh cho quy tắc địa chỉ http và https dù chủ kho đã chốt chỉ nhận https. Người dùng không bị ảnh hưởng; chỉ người đọc tài liệu có thể bối rối.
  Căn cứ: Không ảnh hưởng gì tới người dùng và sửa lại chữ lúc nào cũng được, nhưng hợp đồng đã được chủ kho duyệt nên việc sửa thuộc về chủ kho quyết.
  file: `_acceptance/thu-moi-dia-chi-tu-cau-hinh/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Language rule: Vietnamese in a configuration-file comment (r1)**
  Người dùng thấy gì: Một dòng chú thích trong tệp cấu hình mẫu viết bằng tiếng Việt trong khi các dòng khác bằng tiếng Anh. Người dùng cuối không thấy gì, chỉ người triển khai thấy lẫn ngôn ngữ.
  Căn cứ: Hậu quả chỉ là lệch nếp viết ở một dòng ghi chú, không mất dữ liệu và không ảnh hưởng người dùng, còn sửa thì phải đổi cả tiêu chí đã được chủ kho duyệt nên không đáng.
  file: `.env.example`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

⚠ Cụm ngoài vùng phủ: 2/4 lỗi rơi vào file không bộ đo nào phủ (_acceptance/bang-quyen-theo-vai/du-bao.json, _acceptance/thu-moi-dia-chi-tu-cau-hinh/luat-cham.json) — dừng và quyết: mở rộng hợp đồng hay rút phạm vi.
