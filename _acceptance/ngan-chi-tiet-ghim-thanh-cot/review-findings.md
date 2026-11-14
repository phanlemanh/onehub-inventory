# Review findings: ngan-chi-tiet-ghim-thanh-cot (round 5)

## Trong hợp đồng

(không có)

## Ngoài hợp đồng — người quyết ở Gate 2

Các lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.

- **E12 judgment is based on votes about the old 1024 screenshots, but the report calls it an unresolved conflict and asks for evidence that already exists**
  Người dùng thấy gì: Báo cáo cho người duyệt đang nói có mâu thuẫn chưa giải quyết ở phần so ảnh 1024, trong khi ảnh mới đã có sẵn. Người duyệt có thể bị rối hoặc đòi chụp lại thứ đã có, nhưng tính năng với người dùng không đổi.
  Căn cứ: Chỉ làm người duyệt mất thêm một lượt đọc và chấm lại ảnh, không ảnh hưởng người dùng và không mất dữ liệu; chấm lại trên ảnh mới rất rẻ.
  file: `_acceptance/ngan-chi-tiet-ghim-thanh-cot/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Out-of-contract finding still says the E12 panel proposes PASS, but this round it proposes FAIL**
  Người dùng thấy gì: Ghi chú rà soát vẫn nói hội đồng đề xuất đạt trong khi vòng này là không đạt. Người ký có thể bị dẫn tới quyết định dựa trên thông tin cũ; người dùng cuối không thấy gì.
  Căn cứ: Hậu quả nhẹ và chỉ nằm trong giấy tờ nội bộ, người ký đọc báo cáo chính sẽ thấy trạng thái đúng; sửa dòng chữ rất rẻ.
  file: `_acceptance/ngan-chi-tiet-ghim-thanh-cot/review-findings.md`
  severity: low
  Đề xuất: known-limits

- **Round-5 run log times E11 and E12 before the screenshots they check were created**
  Người dùng thấy gì: Sổ chạy ghi giờ các bước kiểm tra sớm hơn lúc ảnh được chụp, nên về sau khó phát hiện việc chấm chạy trước khi có ảnh. Người dùng cuối không bị ảnh hưởng.
  Căn cứ: Chỉ làm mờ dấu vết kiểm toán nội bộ, không gây mất dữ liệu hay lỗi cho người dùng; sửa cách ghi giờ tốn công hơn nhiều so với hậu quả.
  file: `_acceptance/ngan-chi-tiet-ghim-thanh-cot/run-log.jsonl`
  severity: low
  Đề xuất: wont-fix

- **Design: tài liệu hàm bị lệch chỗ và đã cũ (check 9) (r5)**
  Người dùng thấy gì: Người dùng không thấy gì khác. Chỉ người đọc mã sau này có thể hiểu sai chỗ đứng của hồ sơ nổi vì lời chú thích đã cũ.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; sửa lúc nào cũng rẻ nên ghi lại là đủ.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: phép thử AC-6 trong unit test là hiển nhiên đúng, bộ chặn chỉ có trong test (check 2/9) (r5)**
  Người dùng thấy gì: Một phép kiểm tra nhỏ về việc lưu trạng thái ghim không thể phát hiện lỗi thật. Người dùng không bị ảnh hưởng vì kiểm tra trên trình duyệt thật vẫn bảo vệ việc này.
  Căn cứ: Người dùng không gặp lỗi nào và còn một lớp kiểm tra khác che chắn, nên chỉ cần ghi nhận.
  file: `src/components/candidate/record-pin.ts`
  severity: low
  Đề xuất: known-limits

- **Hội đồng E12 đề xuất PASS dựa trên mô tả sai về ảnh 1024; sổ chạy vẫn ghi PASS (r5 · tệp đã đổi)**
  Người dùng thấy gì: Báo cáo nghiệm thu có thể ghi đạt cho phần ảnh giống mẫu ở cỡ 1024 trong khi ảnh đã lưu cho thấy dáng khác. Người dùng cuối không thấy gì, nhưng người duyệt có thể tin nhầm là đã đạt.
  Căn cứ: Không ảnh hưởng người dùng cuối và không mất dữ liệu; chỉ cần chấm lại phần ảnh ở vòng sau hoặc người duyệt tự xem ảnh, sửa rẻ.
  file: `_acceptance/ngan-chi-tiet-ghim-thanh-cot/evidence-report.md`
  severity: medium
  Đề xuất: known-limits

- **Mốc thời gian 'at' của quyết định 30-32 muộn hơn lúc commit chúng và lệch với id (r5 · tệp đã đổi)**
  Người dùng thấy gì: Vài quyết định trong sổ ghi giờ muộn hơn thực tế, nên ai xếp theo giờ sẽ thấy sai thứ tự. Người dùng không thấy gì.
  Căn cứ: Chỉ làm lệch thứ tự khi đọc lại lịch sử, không ảnh hưởng người dùng; thứ tự thật vẫn suy ra được từ mã định danh.
  file: `_acceptance/ngan-chi-tiet-ghim-thanh-cot/decisions.jsonl`
  severity: medium
  Đề xuất: wont-fix

- **Records: decision 0024 now describes the old floating position (r4)**
  Người dùng thấy gì: Một trang ghi chép nội bộ vẫn mô tả hồ sơ nổi đứng sát thanh trên cùng. Người dùng không thấy khác biệt, chỉ người đọc lại lịch sử quyết định có thể hiểu nhầm.
  Căn cứ: Hậu quả nhẹ, không mất dữ liệu và người dùng không gặp; sửa lại ghi chú sau rất rẻ.
  file: `wiki/decisions/0024-ngan-noi-xem-chi-tiet.md`
  severity: medium
  Đề xuất: known-limits

- **Records: design/behaviors.md contradicts itself and the code (r4)**
  Người dùng thấy gì: Tài liệu mô tả hồ sơ tự mâu thuẫn và thiếu mức rộng tối thiểu của bảng. Người dùng không thấy gì khác, chỉ người làm tiếp có thể hiểu sai.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; chỉnh lại câu chữ sau là việc rẻ.
  file: `design/behaviors.md`
  severity: low
  Đề xuất: known-limits

- **Criteria and tests: the cookie-leak unit test cannot fail (r4)**
  Người dùng thấy gì: Một phép kiểm tra nhỏ về việc lưu trạng thái ghim không thể phát hiện lỗi thật. Người dùng không bị ảnh hưởng vì kiểm tra trên trình duyệt thật vẫn bảo vệ việc này.
  Căn cứ: Có lớp bảo vệ khác che việc này nên nguy cơ lộ dữ liệu thấp; dọn phép kiểm thừa sau là rẻ.
  file: `tests/ghim-ngan.test.ts`
  severity: low
  Đề xuất: known-limits

- **Design: the shared record panel imports the resizable package directly (r4)**
  Người dùng thấy gì: Khung hồ sơ lấy một phần của thư viện chia cột trực tiếp thay vì qua lớp bọc chung. Người dùng không thấy khác biệt nào.
  Căn cứ: Chỉ là thói quen tổ chức nội bộ, không ảnh hưởng người dùng hay dữ liệu; sửa tốn công hơn lợi ích.
  file: `src/components/candidate/record-panel.tsx`
  severity: low
  Đề xuất: wont-fix

- **Intent / records: the wiki log moves another row's entry (r4)**
  Người dùng thấy gì: Nhật ký thay đổi bị dời một dòng của hàng khác xuống thấp hơn. Người dùng không thấy gì, chỉ có thể gây xung đột khi gộp với các hàng khác.
  Căn cứ: Không ảnh hưởng người dùng và không mất dữ liệu; nếu xung đột thì gỡ tay một lần là xong.
  file: `wiki/log.md`
  severity: low
  Đề xuất: known-limits

- **Assertion âm-tính-một-mình (hình dạng 4): 'toolbar covered by record' không có ca đối chứng nào làm nó bật (r4)**
  Người dùng thấy gì: Phép kiểm tra thanh công cụ có bị hồ sơ che hay không có thể lặng lẽ không đo gì nếu nhãn nút đổi. Người dùng hiện không thấy lỗi nào.
  Căn cứ: Hiện không có lỗi người dùng thấy; rủi ro chỉ là bỏ sót lỗi che thanh công cụ trong tương lai, và bổ sung ca đối chứng sau là rẻ.
  file: `tests/e2e/ghim-ngan.spec.ts`
  severity: low
  Đề xuất: known-limits

Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).
