# Review findings: thue-phi (round 2)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **9. Design: errors are handled — a valid save at the five-item limit fails with 500**
  Người dùng thấy gì: Khi sàn đã có đủ năm khoản riêng, quản trị bỏ một khoản và thêm khoản mới trong cùng một lần Lưu sẽ báo lỗi chung chung, thử lại vẫn không được.
  Căn cứ: Không mất dữ liệu và có đường vòng: lưu việc bỏ khoản trước rồi thêm khoản mới ở lần lưu sau; chỉ gặp ở sàn đã dùng hết năm khoản.
  file: `src/modules/company-config/fee-store.ts:196`
  severity: medium
  Đề xuất: known-limits

- **Saving drops the custom name of a renamed brokerage item**
  Người dùng thấy gì: Quản trị đổi tên Phí môi giới rồi về sau bật tắt một công tắc và Lưu, tên tự đặt bị lặng lẽ đổi lại tên mặc định mà không báo.
  Căn cứ: Mất tên đã đặt mà không có cảnh báo, người dùng phải tự phát hiện và đặt lại; không mất số liệu tiền, sửa rẻ nhưng cần quyết định riêng vì ngoài tiêu chí hiện có.
  file: `src/modules/company-config/fee-store.ts:215`
  severity: high
  Đề xuất: new-contract

- **Swapping an own item at the five-item limit fails with a server error**
  Người dùng thấy gì: Ở sàn đã đủ năm khoản riêng, bỏ một khoản và thêm một khoản khác cùng lúc không lưu được và chỉ hiện thông báo lỗi chung.
  Căn cứ: Không mất dữ liệu, tách thành hai lần lưu là qua được, và chỉ xảy ra ở sàn dùng đủ năm khoản.
  file: `src/modules/company-config/fee-store.ts:228`
  severity: high
  Đề xuất: known-limits

- **A 400 with no problem list is silently ignored when saving**
  Người dùng thấy gì: Hiếm khi máy chủ từ chối lần lưu mà không nói lý do, khi đó bấm Lưu không thấy gì xảy ra và không có thông báo.
  Căn cứ: Chỉ xảy ra khi yêu cầu bị hỏng bất thường chứ không do người dùng nhập sai; không mất dữ liệu và tải lại rồi thử lại được.
  file: `src/modules/company-config/ui/fee-part.tsx:383`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): «cột Điều kiện phí ẩn sẵn» được đo bằng cách tìm chữ trong mã nguồn hàm**
  Người dùng thấy gì: Kiểm tra tự động chưa chứng minh thật rằng cột Điều kiện phí ẩn lúc đầu và bật được, nên nếu cột này hỏng có thể không ai biết ngay.
  Căn cứ: Chỉ là kiểm tra lỏng, người dùng không gặp lỗi hiện tại; rủi ro là bỏ sót hỏng hóc về sau và có thể bổ sung kiểm tra sau.
  file: `tests/thue-phi-cot.test.ts:47`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình): cột Điều kiện phí vắng mặt trong bon-kho, không có đối chứng dương ở đường luôn chạy**
  Người dùng thấy gì: Lời hứa cột Điều kiện phí ẩn sẵn nhưng bật được chỉ được kiểm đầy đủ khi chạy ca ảnh đặc biệt, lần chạy thường chỉ kiểm vế ẩn.
  Căn cứ: Không ảnh hưởng người dùng hôm nay; chỉ làm giảm độ tin của phép đo thường và bổ sung sau không tốn nhiều.
  file: `tests/e2e-db/thue-phi.spec.ts:224`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assert âm tính đứng một mình): «mã đã bỏ không bị cấp lại» qua cả khi việc thêm thất bại**
  Người dùng thấy gì: Kiểm tra tự động về việc khoản đã bỏ không bị dùng lại mã có thể vẫn xanh dù việc thêm khoản thất bại, nên không bắt được lỗi này nếu xảy ra.
  Căn cứ: Người dùng không gặp gì hôm nay; chỉ là lưới kiểm lỏng và làm chặt thêm là việc rẻ, làm khi tiện.
  file: `src/modules/company-config/fee-store.test.ts:158`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (không ghim thông điệp, không đối chứng): khoản luật bị đổi tên hay bị bỏ chỉ kiểm status 400**
  Người dùng thấy gì: Kiểm tra việc từ chối đổi tên hay bỏ khoản theo luật chỉ xem có báo lỗi hay không, chưa xem có nêu đúng khoản và dữ liệu có giữ nguyên không.
  Căn cứ: Người dùng không bị ảnh hưởng hôm nay; nếu về sau hỏng, lỗi có thể lọt qua kiểm tra nhưng sửa phần kiểm rẻ.
  file: `tests/db/thue-phi.db.test.ts:209`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim không khớp assert): chiều đỏ của E1 ghim một chuỗi mà bài không bao giờ in ra**
  Người dùng thấy gì: Sổ ghi cách kiểm tra mô tả một thông báo lỗi mà bài kiểm thật không in ra, nên người đọc sổ khó đối chiếu một lần đỏ thật.
  Căn cứ: Chỉ là ghi chép lệch, không đụng tới người dùng hay số liệu; sửa rẻ nhưng không cấp bách.
  file: `_acceptance/thue-phi/evals.yaml:32`
  severity: high
  Đề xuất: known-limits

- **Hình dạng 5 (tuyên cả lớp nhưng chỉ đo một điểm): E6-e2e hứa «ở bốn khổ» nhưng ca chỉ chạy ở 1440**
  Người dùng thấy gì: Số Về tay cụ thể chỉ được kiểm ở màn hình lớn; ở ba cỡ màn hình nhỏ chỉ kiểm có cột chứ chưa kiểm giá trị.
  Căn cứ: Giá trị tính cùng một lõi cho mọi cỡ màn hình nên rủi ro thấp, và bổ sung kiểm tra là việc rẻ.
  file: `tests/e2e-db/thue-phi.spec.ts:160`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (thông điệp ghim không khớp assert): chiều đỏ của E2 ghim «Lệ phí trước bạ», nhưng assert sẽ hỏng trước lại so mã**
  Người dùng thấy gì: Nếu thứ tự ba khoản bị đảo, bài kiểm vẫn báo đỏ nhưng thông báo không nêu tên khoản như sổ ghi, nên người đọc khó hiểu ngay.
  Căn cứ: Không ảnh hưởng người dùng; chỉ làm thông báo lỗi khó đọc hơn mong đợi nên chấp nhận được.
  file: `src/modules/company-config/ui/fee-part.test.tsx:121`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): «phần không tự vẽ khung» được đo bằng grep tệp nguồn**
  Người dùng thấy gì: Việc phần Thuế phí dùng đúng khung chung chỉ được kiểm bằng đọc chữ trong mã, chưa kiểm giao diện thật, nên một viền tự thêm bằng cách khác có thể lọt.
  Căn cứ: Hiện chưa có lỗi hiển thị nào được chỉ ra, rủi ro là lệch giao diện nhẹ mà người dùng tải lại vẫn dùng được; làm chặt kiểm tra sau là rẻ.
  file: `src/modules/company-config/ui/fee-part.test.tsx:290`
  severity: medium
  Đề xuất: known-limits

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
