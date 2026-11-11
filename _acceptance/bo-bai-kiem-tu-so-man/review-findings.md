## Trong hợp đồng

- **Hình dạng 4 (thông điệp ghim không như lời hứa): ca phá khung không ghim id màn**
  file: `tools/e2e_templates/recipes.ts:67`
  severity: medium
  AC: AC-4
  source: measurement
  detail: Theo evals.yaml E4, mỗi ca phá phải đòi hàm kiểm ném lỗi khớp thông điệp ghim có cả id màn lẫn tên bài ('<id>: tieu-de', '<id>: cuon-ngang', '<id>: loi-trinh-duyet', '<id>: axe color-contrast'). Nhưng cả bốn mẫu ghim trong FRAME đều bắt đầu bằng dấu hai chấm, không có id màn: `/: tieu-de — /` (dòng 67), `/: cuon-ngang — /` (dòng 90), `/: loi-trinh-duyet — .*pha thu/` (dòng 112) và `/: axe .*color-contrast/` (dòng 146). runBreak (runner.ts, khoảng dòng 103) chỉ đối chiếu với các mẫu này. Vì vậy, nếu hàm kiểm in sai màn (ví dụ `null: tieu-de` hoặc id của màn khác), ca phá vẫn xanh. Lời hứa về quan hệ giữa thông điệp và màn đang kiểm chưa được đo, phép đo chỉ thấy tên bài có mặt trong chuỗi.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **The new state suite re-implements checks that grid.spec.ts and frame.spec.ts still run on the same pages**
  Người dùng thấy gì: Một số kiểm tra trạng thái nay chạy hai lần ở hai nơi. Người dùng không thấy gì khác; chỉ có rủi ro là về sau hai bản kiểm tra lệch nhau.
  Căn cứ: Không ảnh hưởng người dùng cuối, chỉ làm việc bảo trì dễ lệch; gộp lại là việc riêng, rẻ, làm lúc nào cũng được.
  file: `tools/e2e_templates/recipes.ts`
  severity: low
  Đề xuất: known-limits

- **E1 expected text says the ghost screen uses route '/', but the test uses '/ghost'**
  Người dùng thấy gì: Mô tả trong tài liệu nghiệm thu ghi sai đường dẫn của màn thử. Người dùng không bị ảnh hưởng, chỉ người chấm có thể bối rối.
  Căn cứ: Không đụng tới người dùng và không mất dữ liệu; chỉ là một chữ sai trong tài liệu, sửa lúc nào cũng được nhưng không đáng mở việc riêng.
  file: `_acceptance/bo-bai-kiem-tu-so-man/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **The 'mo lai cung trang khong do lai ham cpu' test checks nothing in the normal copy**
  Người dùng thấy gì: Bốn lần chạy xanh ở máy thường trông như đã chứng minh điều gì đó nhưng thực ra không đo gì. Người dùng không bị ảnh hưởng, chỉ báo cáo kiểm thử trông chắc hơn thực tế.
  Căn cứ: Không ảnh hưởng người dùng; phép đo thật vẫn chạy ở bản máy chậm, nên chỉ cần ghi chú để không đọc nhầm số lần xanh.
  file: `tests/e2e/screens/screens.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên phủ một lớp mà chỉ có một điểm): axe 'sáng và tối' chỉ có một ca phá, và ca này đỏ ngay ở lượt sáng**
  Người dùng thấy gì: Nếu chế độ tối vô tình không được áp dụng khi kiểm, bộ bài vẫn xanh và lỗi chữ khó đọc riêng ở giao diện tối có thể lọt qua mà không ai biết.
  Căn cứ: Chỉ lọt khi chế độ tối hỏng đúng cách đó, nên khả năng thấp; lỗi nếu lọt chỉ làm chữ khó đọc ở giao diện tối, không mất dữ liệu, và bổ sung ca phá sau này không đắt.
  file: `tools/e2e_templates/recipes.ts`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
