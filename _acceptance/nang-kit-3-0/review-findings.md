# Review findings: nang-kit-3-0 (round 1)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Criteria and tests: AC-2 and AC-8 loosened after Gate 1 with no new owner approval recorded**
  Người dùng thấy gì: Hai tiêu chí được nới sau khi chủ kho đã duyệt, và tấm thẻ chủ kho xem vẫn ghi con số cũ. Sản phẩm chạy không đổi, chỉ là chủ kho chưa xác nhận bản nới.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; chỉ cần chủ kho xác nhận lại ở cổng bằng chứng, tốn rất ít công.
  file: `_acceptance/nang-kit-3-0/contract.md`
  severity: medium
  Đề xuất: known-limits

- **Records: the record still states the old sweep count (15 lines / 6 files) in places**
  Người dùng thấy gì: Phần ghi chú đầu hồ sơ còn con số quét cũ, người đọc có thể thấy hai con số khác nhau. Việc chạy thật không bị ảnh hưởng.
  Căn cứ: Chỉ gây nhầm lẫn khi đọc tài liệu, không mất dữ liệu, người đọc tự đối chiếu được; sửa rẻ nhưng không cần chặn việc giao.
  file: `_acceptance/nang-kit-3-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **CI and agent privileges: the CI gate fetches the kit from a new repo by a movable tag and does not check the commit**
  Người dùng thấy gì: Nếu thẻ phiên bản của kit bị dời, máy chủ kiểm tra và máy cá nhân có thể âm thầm chạy hai bản khác nhau. Hiện tại chưa xảy ra.
  Căn cứ: Rủi ro chỉ xuất hiện khi chủ kho dời thẻ, chưa mất dữ liệu và bắt được khi so lại; cách làm này vốn có từ trước đợt nâng.
  file: `.github/workflows/ci.yml`
  severity: low
  Đề xuất: known-limits

- **settings measure passes the ref-pin check when both the CI tag and the settings ref are missing**
  Người dùng thấy gì: Phép kiểm tra cấu hình có thể báo xanh nhầm nếu cả thẻ trong CI lẫn phiên bản ghim trong cấu hình cùng bị xoá. Cấu hình thật hiện đúng.
  Căn cứ: Chỉ xảy ra khi hai chỗ cùng hỏng, cấu hình hiện tại đúng nên không ảnh hưởng ai; sửa rẻ nhưng chưa có hậu quả thật.
  file: `_acceptance/nang-kit-3-0/rang/settings.mjs`
  severity: low
  Đề xuất: known-limits

- **The pre-written matrix in evals.yaml and the leftover.mjs header pin 15 lines in 6 files, while the measure and E9 pin 14 in 5**
  Người dùng thấy gì: Ghi chú trong hồ sơ nói 15 dòng ở 6 tệp trong khi phép đo thật dùng 14 dòng ở 5 tệp, người chấm có thể bị nhầm.
  Căn cứ: Chỉ là chú thích lệch số, không ảnh hưởng người dùng hay dữ liệu, tự đối chiếu được và sửa rất rẻ.
  file: `_acceptance/nang-kit-3-0/evals.yaml`
  severity: low
  Đề xuất: known-limits

- **Hinh dang 5 — tuyen quet LOP (moi lenh tai lieu song nhac) nhung chi do 3 tep chon tay; mot lenh da mat trong kit 3.0 lot qua**
  Người dùng thấy gì: Một tài liệu lộ trình vẫn nhắc một lệnh đã bị đổi tên trong kit mới, nên ai làm theo sẽ gõ lệnh không còn tồn tại. Phép kiểm tra báo xanh dù còn sót.
  Căn cứ: Hậu quả vừa phải: người làm theo tài liệu gặp lệnh không chạy nhưng không mất dữ liệu và tự đổi tên được; cần mở rộng phạm vi quét nên nên làm thành việc riêng.
  file: `_acceptance/nang-kit-3-0/rang/doc-commands.mjs`
  severity: high
  Đề xuất: new-contract

- **Hinh dang 2 — fixture so cai viet tay dung khuon ben doc; khoa plugin khong rut tu ben viet (marketplace.json cua kit)**
  Người dùng thấy gì: Dữ liệu thử cho việc tìm bản cài kit được viết tay giống hệt code đọc, nên nếu kit đổi tên chợ thì bài kiểm tra vẫn xanh trong khi máy thật không tìm thấy kit.
  Căn cứ: Hiện tên chợ đúng nên chưa có lỗi, và nếu xảy ra thì chỉ là không tìm thấy kit, sửa lại được; chỉ rủi ro khi kit đổi tên về sau.
  file: `_acceptance/nang-kit-3-0/rang/kit-root-cli.mjs`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
