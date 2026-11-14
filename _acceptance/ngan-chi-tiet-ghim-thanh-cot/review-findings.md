# Review findings: ngan-chi-tiet-ghim-thanh-cot (round 3)

## Trong hợp đồng

Không có finding nào map được vào AC.

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **Records: decision 0024 not updated after the floating record moved below the region toolbar**
  Người dùng thấy gì: Một trang ghi chép nội bộ vẫn mô tả sai chỗ đứng của hồ sơ nổi. Người dùng không thấy gì khác, chỉ người đọc lại lịch sử quyết định mới bị hiểu nhầm.
  Căn cứ: Chỉ là ghi chép cũ, không ảnh hưởng người dùng, không mất dữ liệu, sửa sau rất rẻ.
  file: `wiki/decisions/0024-ngan-noi-xem-chi-tiet.md`
  severity: medium
  Đề xuất: known-limits

- **Records: behaviour row for the record panel contradicts itself**
  Người dùng thấy gì: Tài liệu mô tả hành vi hồ sơ tự mâu thuẫn và thiếu mức rộng tối thiểu của bảng. Người dùng không thấy khác biệt, chỉ người làm tiếp có thể hiểu sai.
  Căn cứ: Lỗi chỉ ở chữ trong tài liệu, không ảnh hưởng người dùng, sửa lại sau rất rẻ.
  file: `design/behaviors.md`
  severity: low
  Đề xuất: known-limits

- **Intent / human decision: a row 3 behaviour approved earlier was changed on the supervisor's ruling, and its test was rewritten**
  Người dùng thấy gì: Hồ sơ nổi nay đứng dưới thanh công cụ của vùng thay vì sát thanh trên cùng như đã duyệt trước đó. Chủ kho cần xác nhận hoặc đảo lại ở cổng bằng chứng.
  Căn cứ: Thay đổi nhìn thấy được nhưng không mất dữ liệu và dễ đảo lại; chỉ cần chủ kho xác nhận.
  file: `tests/e2e/ho-so-can.spec.ts`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: the AC-6 unit check cannot fail, and its helper lives in production code used only by tests**
  Người dùng thấy gì: Một phép kiểm tra nhỏ về việc lưu trạng thái ghim không thể phát hiện lỗi thật. Người dùng không bị ảnh hưởng vì kiểm tra trên trình duyệt thật vẫn bảo vệ việc này.
  Căn cứ: Chỉ làm bộ kiểm yếu đi một chút, không ảnh hưởng người dùng, có thể củng cố sau với chi phí thấp.
  file: `src/components/candidate/record-pin.ts`
  severity: low
  Đề xuất: known-limits

- **Hồ sơ nổi bị ép còn 320 px khi vùng làm việc hẹp hơn khoảng 890 px, dù không ghim**
  Người dùng thấy gì: Khi mở rộng thanh bên ở cửa sổ khoảng 1024 px, hồ sơ nổi hẹp lại còn 320 px thay vì khoảng hai phần năm cửa sổ như trước. Vẫn đọc và dùng được, chỉ chật hơn.
  Căn cứ: Chỉ làm hồ sơ nổi hẹp hơn ở một cỡ cửa sổ, không mất dữ liệu, người dùng thu gọn thanh bên là hết.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits

- **Số đo vùng làm việc (left/width) không cập nhật khi mở hay thu thanh bên lúc hồ sơ đang mở**
  Người dùng thấy gì: Nếu mở rộng thanh bên khi hồ sơ đang ghim, cột ghim có thể chiếm quá nhiều chỗ và bảng bị chật hơn mức tối thiểu cho đến khi đổi cỡ cửa sổ hoặc tải lại trang.
  Căn cứ: Chỉ làm bố cục tạm chật, không mất dữ liệu, người dùng tự gỡ bằng cách tải lại hoặc bỏ ghim; tình huống không phổ biến.
  file: `src/components/candidate/record-panel.tsx`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): kiểm tra 'toolbar covered by record' của E4 không có đối chứng dương và không có ca phá**
  Người dùng thấy gì: Một phép kiểm tra thanh công cụ có bị hồ sơ che hay không có thể lặng lẽ không đo gì nếu nhãn nút đổi. Người dùng hiện không thấy lỗi nào.
  Căn cứ: Chỉ làm bộ kiểm kém tin cậy, không ảnh hưởng người dùng hôm nay, bổ sung sau khá rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: medium
  Đề xuất: known-limits

- **Hình dạng 4 (assertion âm tính một mình): E6 'pin cookie carries record data' kiểm một bộ kiểm chỉ có trong test, trên một chuỗi viết tay**
  Người dùng thấy gì: Một phép kiểm tra nhỏ về nội dung cookie ghim chỉ chứng minh chính nó chạy đúng. Việc cookie không chứa dữ liệu căn đã được kiểm trên trình duyệt thật.
  Căn cứ: Đã có kiểm tra thật bao phủ, người dùng không chịu rủi ro, công sửa không đáng kể.
  file: `tests/ghim-ngan.test.ts`
  severity: low
  Đề xuất: wont-fix

- **Hình dạng 2 (đầu ra viết tay đúng khuôn bên đọc): ca phá 'record remounted on pin' tự đặt scrollTop=0 thay vì dựng một bản gắn lại cây**
  Người dùng thấy gì: Ca thử cố ý làm hỏng việc giữ vị trí cuộn khi ghim chỉ đặt giá trị bằng tay chứ không mô phỏng lỗi thật. Người dùng không bị ảnh hưởng.
  Căn cứ: Chỉ là độ chặt của bộ kiểm, không ảnh hưởng người dùng, chi phí dựng ca phá thật vượt lợi ích.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: low
  Đề xuất: wont-fix

## Chưa adversarial-verify (refuter chết)

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
