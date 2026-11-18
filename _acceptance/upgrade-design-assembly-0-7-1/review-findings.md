# Review findings: upgrade-design-assembly-0-7-1 (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Criteria and tests: the change to the shared e2e executor has no acceptance criterion**
  Người dùng thấy gì: Các lần chạy lại bộ kiểm tra trình duyệt của khoảng mười hồ sơ khác nay sẽ chạy không có cơ sở dữ liệu, giống môi trường CI. Chủ kho đã đồng ý, nhưng hồ sơ này chưa ghi rõ điều đó.
  Căn cứ: Hậu quả nhẹ: chỉ ảnh hưởng cách chạy kiểm tra nội bộ, không động tới người dùng hay dữ liệu, chủ kho đã duyệt và khớp với CI; chỉ cần ghi lại thành giới hạn đã biết, sửa sau cũng rẻ.
  file: `_acceptance/config.yaml`
  severity: low
  Đề xuất: known-limits

- **Records: số dòng đổi của owner-calls.mjs trong design doc sai (r1)**
  Người dùng thấy gì: Tài liệu thiết kế ghi sai số dòng thay đổi của một công cụ. Người dùng cuối không thấy gì, chỉ người duyệt có thể đọc nhầm quy mô thay đổi.
  Căn cứ: Hậu quả nhẹ, chỉ là con số trong tài liệu nội bộ, không mất dữ liệu và sửa lại rất rẻ bất cứ lúc nào.
  file: `docs/superpowers/specs/2026-11-18-upgrade-design-assembly-0-7-1-design.md`
  severity: low
  Đề xuất: known-limits

- **Records: không có trang quyết định trong wiki, và phép đo AC-8 cấm thêm (r1 · tệp đã đổi)**
  Người dùng thấy gì: Lý do lâu dài của thay đổi chưa có trang riêng trong wiki, nên người đến sau khó tìm hiểu vì sao có hai chặn mới. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Hậu quả nhẹ, chỉ ảnh hưởng việc tra cứu nội bộ, lý do vẫn có ở hồ sơ nghiệm thu và nhật ký, và hồ sơ 0.7.0 trước đó cũng không có trang này.
  file: `_acceptance/upgrade-design-assembly-0-7-1/rang/measures-two-way.mjs`
  severity: low
  Đề xuất: known-limits

- **owner-calls.mjs ghi đè GIT_SSH_COMMAND, làm mất core.sshCommand và GIT_SSH của người dùng khi fetch trên bản sao nông (r1)**
  Người dùng thấy gì: Trên máy hoặc CI dùng khóa ssh riêng để lấy mã, hai chặn mới có thể báo không lấy được dữ liệu từ kho gốc và làm lượt kiểm đỏ. Hiện CI dùng HTTPS nên chưa gặp.
  Căn cứ: Hậu quả nhẹ và hiện ra rõ ràng chứ không âm thầm, không mất dữ liệu; chỉ dính khi đổi cách xác thực, và lỗi nằm ở plugin nên sửa ở đó.
  file: `tools/design-assembly/owner-calls.mjs`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
