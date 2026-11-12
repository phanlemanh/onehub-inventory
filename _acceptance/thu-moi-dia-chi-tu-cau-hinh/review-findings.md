# Review findings: thu-moi-dia-chi-tu-cau-hinh (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Tier: auth code classified below high**
  Người dùng thấy gì: Thay đổi chạm vào cấu hình đăng nhập và thư mời nhưng hệ thống tự xếp ở bậc trung bình, nên có thể được gộp mà không cần người có thẩm quyền xem lại. Người dùng cuối không thấy khác biệt ngay, rủi ro nằm ở khâu duyệt.
  Căn cứ: Hành vi của sản phẩm vẫn đúng; chỉ là khâu duyệt lỏng hơn mong muốn, và chủ kho có thể tự xem lại thay đổi này hay chỉnh quy tắc xếp bậc bất cứ lúc nào mà không mất dữ liệu.
  file: `src/modules/identity/config.ts`
  severity: high
  Đề xuất: known-limits

- **Intent/criteria: acceptance evals still carry the unresolved Hỏi-1 branch**
  Người dùng thấy gì: Tài liệu nghiệm thu vẫn còn ghi cả hai nhánh cho quy tắc địa chỉ http và https dù chủ kho đã chốt chỉ nhận https. Người dùng không bị ảnh hưởng; chỉ người đọc tài liệu có thể bối rối.
  Căn cứ: Không ảnh hưởng gì tới người dùng và sửa lại chữ lúc nào cũng được, nhưng hợp đồng đã được chủ kho duyệt nên việc sửa thuộc về chủ kho quyết.
  file: `_acceptance/thu-moi-dia-chi-tu-cau-hinh/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Language rule: Vietnamese in a configuration-file comment**
  Người dùng thấy gì: Một dòng chú thích trong tệp cấu hình mẫu viết bằng tiếng Việt trong khi các dòng khác bằng tiếng Anh. Người dùng cuối không thấy gì, chỉ người triển khai thấy lẫn ngôn ngữ.
  Căn cứ: Hậu quả chỉ là lệch nếp viết ở một dòng ghi chú, không mất dữ liệu và không ảnh hưởng người dùng, còn sửa thì phải đổi cả tiêu chí đã được chủ kho duyệt nên không đáng.
  file: `.env.example`
  severity: low
  Đề xuất: wont-fix

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
