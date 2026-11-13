# Review findings: da-gui-tren-luoi (round 2)

## Trong hợp đồng

Không có finding nào.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Ảnh sent-360-ten-dai.png giống từng byte ảnh sent-360-sang.png, nên bước rê chuột ở E14 không để lại dấu gì**
  Người dùng thấy gì: Một ảnh chứng minh tên dài khi rê chuột thực ra chỉ là ảnh thường, nên người xem hồ sơ không thấy được gợi ý đọc đủ tên. Màn hình thật cho người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ làm bằng chứng kém thuyết phục, người dùng không mất gì và ảnh chụp lại sau rất rẻ.
  file: `_acceptance/da-gui-tren-luoi/evidence/sent-360-ten-dai.png`
  severity: medium
  Đề xuất: known-limits

- **E14-network.txt chỉ là một câu kết luận, không phải nhật ký mạng và console**
  Người dùng thấy gì: Hồ sơ nói màn không có lỗi mạng hay lỗi trình duyệt nhưng không kèm bản ghi để kiểm lại. Người dùng cuối không thấy khác biệt nào.
  Căn cứ: Chỉ ảnh hưởng độ tin cậy của hồ sơ nghiệm thu, không gây mất dữ liệu cho người dùng, và các bài tự động vẫn kiểm lỗi trình duyệt.
  file: `_acceptance/da-gui-tren-luoi/evidence/E14-network.txt`
  severity: low
  Đề xuất: known-limits

- **Kỳ vọng E14 nói 'mười bốn ảnh' nhưng các bước chụp 15 ảnh**
  Người dùng thấy gì: Câu mô tả trong bộ chấm đếm sai một ảnh so với số ảnh thực chụp. Người dùng không gặp gì.
  Căn cứ: Chỉ là lỗi chữ trong tài liệu chấm, không ảnh hưởng người dùng và người chấm tự đếm lại được.
  file: `_acceptance/da-gui-tren-luoi/evals.yaml`
  severity: low
  Đề xuất: wont-fix

- **E14 long-name hover frame is a byte-identical copy of the plain 360 frame**
  Người dùng thấy gì: Ảnh được tính là bằng chứng rê chuột lên tên dài thật ra không cho thấy gì thêm. Người dùng vẫn thấy tên dài bị cắt gọn như bình thường.
  Căn cứ: Hậu quả chỉ nằm ở hồ sơ chứng minh, không mất dữ liệu và chụp lại hay bỏ bước này đều rẻ.
  file: `_acceptance/da-gui-tren-luoi/evidence/sent-360-ten-dai.png`
  severity: medium
  Đề xuất: known-limits

- **E14 network/console evidence is a hand-written claim with no captured log**
  Người dùng thấy gì: Kết luận không có lỗi mạng chỉ là một câu viết tay, không ai kiểm lại được. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm giảm độ kiểm chứng của hồ sơ; không ảnh hưởng người dùng và thu lại nhật ký thật là việc nhỏ.
  file: `_acceptance/da-gui-tren-luoi/evidence/E14-network.txt`
  severity: low
  Đề xuất: known-limits

- **Hình dạng 1 (đo chỉ dẫn thay vì đầu ra): ảnh 'hover tên dài' giống từng byte với ảnh không hover**
  Người dùng thấy gì: Ảnh được cho là chụp lúc rê chuột lên tên dài lại giống hệt ảnh thường, nên không chứng minh được phần đọc đủ tên. Màn thật vẫn dùng bình thường.
  Căn cứ: Chỉ yếu ở phần chứng minh, không gây mất mát hay lỗi cho người dùng và dễ bổ sung sau.
  file: `_acceptance/da-gui-tren-luoi/evidence/sent-360-ten-dai.png`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (kết luận âm tính đứng một mình): E14-network.txt chỉ có một câu 'không có lỗi'**
  Người dùng thấy gì: Hồ sơ chỉ ghi một câu không có lỗi mà không chứng tỏ bộ ghi đã chạy thật. Người dùng không thấy khác biệt nào ở màn.
  Căn cứ: Rủi ro chỉ là bỏ sót lỗi mạng chưa ai thấy, người dùng tải lại được và các bài tự động vẫn bắt lỗi trình duyệt.
  file: `_acceptance/da-gui-tren-luoi/evidence/E14-network.txt`
  severity: low
  Đề xuất: known-limits

- **The ?state= rule is copied into sharing instead of living in one place (r1)**
  Người dùng thấy gì: Quy tắc quyết định khi nào màn hiện trạng thái thử nghiệm đang có hai bản giống nhau, ở Bảng hàng và ở Đã gửi. Người dùng không thấy khác biệt, nhưng sau này sửa một bản mà quên bản kia thì hai màn có thể xử lý khác nhau.
  Căn cứ: Hiện chưa ảnh hưởng người dùng, hợp đồng đã chủ ý hoãn việc gộp và có bài kiểm giữ hai bản không lệch nhau; gộp sau khi 2c vào thì rẻ hơn.
  file: `src/modules/sharing/ui/sent-rows.ts`
  severity: medium
  Đề xuất: known-limits

- **Sample builder and ShareLink rule check are exported only from sharing's UI entry point; index.ts is still empty (r1)**
  Người dùng thấy gì: Phần dựng link mẫu và kiểm luật được lấy ra qua cửa dành cho giao diện thay vì cửa dành cho luật thuần. Người dùng không thấy gì, chỉ làm cấu trúc mã lệch so với mô-đun khác.
  Căn cứ: Không làm mất hay lộ dữ liệu và người dùng không gặp; sửa lúc nào cũng rẻ, chỉ là dọn cấu trúc.
  file: `src/modules/sharing/ui/index.tsx`
  severity: medium
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
