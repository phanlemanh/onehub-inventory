---
slug: nhap-excel
at: 2026-11-17T02:10:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Hai dòng sổ ghi máy quyết mà câu trích không quyết: bỏ bước trùng và tin bổ sung (d-20261117T011452Z-13), trần 200 cột (d-20261117T011452Z-6) [upgrade-design-assembly-tool#F1] | Chủ kho ký mà không thấy câu hỏi về việc bỏ một tính năng Quỹ hàng đang có; tệp rộng hơn 200 cột bị chặn theo một trần không căn cứ | Không còn dòng S1 muc-tieu nào có phần lựa chọn nằm ngoài câu trích | fixed: dòng bỏ bước trùng thành Hỏi-11 (thay dòng 13); trần 200 cột gỡ khỏi thiết kế, hợp đồng, bộ chấm (thay dòng 6) |
| P1 | contract | Căn đã có lần chào mở khi Áp thì ra sao chưa nói | Nạp lại tệp tuần trước thì một căn có hai lần chào mở | Áp hai lần cùng tệp thì lần hai 0 lần chào mới; ca phá ghim | fixed: AC-7 thêm vế không tạo lần chào cho căn đã chào và không tính vào N; E9 thêm ca áp hai lần và ca phá |
| P1 | evals | Không ca nào thử Trưởng nhóm chọn đầu chủ hay mã đầu chủ của người khác hoặc sàn khác | Trưởng nhóm nhập hộ mà căn mang tên Trưởng nhóm; đầu chủ ngoài sàn được nhận | Ma trận bốn ca đầu chủ; ca phá ghim | fixed: AC-7 nói rõ đầu chủ hợp lệ; E9 thêm ma trận bốn ca và ca phá 'list agent from another company accepted' |
| P1 | evals | Ba lời hứa màn ↔ máy chủ chỉ đo một phía (đếm dấu, danh sách vừa học, tiêu đề Block trên Bảng hàng); AC-6 thiếu nhãn cross-layer | Màn tự đếm theo luật cũ hay Bảng hàng không đọc nhãn riêng mà bộ chấm vẫn xanh | So số trên màn với thân trả lời; đọc tiêu đề cột thật | fixed: AC-6 gắn cross-layer; thêm E20 (số trên màn bằng số máy chủ, danh sách vừa học bằng trả lời áp) và E21 (tiêu đề cột Toà là Block trên Bảng hàng), mỗi bài một ca phá |
| P1 | evals | E5 thiếu vế của AC-4; E16 ma trận 13 × 4 không viết ra được, axe chỉ bốn bước; tệp thử không nói nguồn ghi | Bộ đọc sai ở Ngừng hẳn hay nội thất mà vẫn xanh; tệp Excel thật hỏng ở ô ngày dạng số | Ma trận đủ phần tử; nguồn tệp thử ghi rõ | fixed: E5 44 ca phủ mọi tập đóng và mọi vế thiếu; E16 bảng trạng thái × khổ 30 ô, axe 60 lần quét; E1 đòi NGUON.md và ô ngày dạng số, chuỗi dùng chung, csv phẩy theo Google Sheet. deferred: máy này không có Excel hay LibreOffice để lưu một tệp bằng ứng dụng thật — tệp thử do thư viện ghi khác thư viện đọc; ghi ở Notes, chủ kho có thể thả một tệp Excel thật vào tests/fixtures/nhap-excel/ |
