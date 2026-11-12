# Review findings: bo-kiem-chung-khi-dang-nhap (round 3)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Every `make e2e` run now leaves a full Next build folder behind in node_modules/.cache/onehub-e2e/<pid>, and nothing removes it**
  Người dùng thấy gì: Mỗi lần chạy bộ kiểm trên máy, một thư mục dựng tạm nặng được để lại và không bị xoá, nên đĩa đầy dần sau nhiều lượt. Kết quả kiểm vẫn đúng, người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ ảnh hưởng máy của người làm, không mất dữ liệu và không làm kết quả sai; người làm tự xoá thư mục tạm được, và chỉ gặp khi chạy rất nhiều lượt liên tiếp.
  file: `playwright.config.ts`
  severity: medium
  Đề xuất: known-limits

- **The shared sheet and banner waits throw away the real error and replace it with a fixed message**
  Người dùng thấy gì: Khi chờ ngăn trượt hay băng báo thất bại vì một lý do khác, thông báo lỗi vẫn là câu cố định nên người đọc có thể hiểu sai nguyên nhân. Bài vẫn đỏ đúng, không có chuyện báo xanh giả.
  Căn cứ: Hậu quả nhẹ: chỉ làm khó chẩn đoán lỗi chứ không làm lọt lỗi, không mất dữ liệu và người làm vẫn chạy lại để tìm nguyên nhân thật.
  file: `tools/e2e_templates/settle.ts`
  severity: low
  Đề xuất: known-limits

- **Every browser run of the main config leaves a full Next dev build folder that is never deleted**
  Người dùng thấy gì: Mỗi lần chạy kiểm trình duyệt thường lệ để lại một thư mục dựng tạm không được dọn, làm đĩa đầy dần. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ tốn đĩa trên máy người làm, tự xoá tay được, không sai kết quả kiểm; gộp chung với việc dọn thư mục tạm nói ở mục trên.
  file: `playwright.config.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên quét LỚP nhưng chỉ có điểm-case): E5 hứa mọi bài của màn members ở lượt không phiên đều bị bỏ, nhưng không bài nào đếm việc đó**
  Người dùng thấy gì: Ở lượt chạy không có cơ sở dữ liệu, chưa có phép đếm nào chắc chắn rằng toàn bộ bài của màn Thành viên đều bị bỏ. Nếu sau này có chỗ đo nhầm trên trang đăng nhập rồi báo xanh, có thể không ai biết.
  Căn cứ: Hậu quả hiện chưa xảy ra, chỉ là thiếu lưới bảo vệ cho thay đổi tương lai; thêm phép đếm sau này không đắt và không làm mất gì của người dùng.
  file: `tools/e2e_templates/suite.ts`
  severity: medium
  Đề xuất: new-contract

- **Hình dạng 2 (fixture viết tay theo đúng khuôn bên đọc): chiều đỏ «gỡ thẻ @cho» được tạo bằng chính điều kiện so khớp của untagged()**
  Người dùng thấy gì: Bài kiểm chứng rằng việc gỡ thẻ cho bài mất mạng bị bắt được chỉ chạy trên dữ liệu dựng sẵn, chưa đi qua một vòng chạy thật. Nếu dạng dòng thật khác đi, lỗi gỡ thẻ có thể lọt mà không ai thấy.
  Căn cứ: Chỉ làm phép chứng của một bài phụ kém chặt, không ảnh hưởng người dùng cuối hay dữ liệu; rủi ro thấp và có thể ghi nhận rồi làm sau.
  file: `tools/e2e_templates/e2e-templates.test.ts`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
