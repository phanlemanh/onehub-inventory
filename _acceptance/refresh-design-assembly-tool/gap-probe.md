---
slug: refresh-design-assembly-tool
at: 2026-11-15T04:56:26Z
verdict: findings
p0: 2
p1: 2
p2: 1
---

# Phản biện context sạch — refresh-design-assembly-tool

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Căn cứ của dòng sổ về chỗ đặt phép đo trích một dòng của hồ sơ adopt-design-assembly: đó là tiền lệ, không quyết chỗ đặt cho việc này [adopt-design-assembly#F3] | Chủ kho duyệt vì tưởng chỗ đặt đã được quyết; hệ quả không được hỏi: sau khi gộp không gì giữ thư mục công cụ khớp plugin, sửa tay một tệp thì make check vẫn xanh | Thay dòng sổ bằng căn cứ một-lối có lối chết gọi tên được; đưa hệ quả lên thẻ thành một câu cho chủ kho | fixed: dòng sổ thay bằng căn cứ một-lối (đặt trong thư mục công cụ làm vỡ AC-3, nơi khác trong tools là vùng T3); hệ quả «sau gộp không ai giữ khớp plugin» thành câu hỏi thứ hai cho chủ kho ở Cổng Phạm vi, kèm ghi ở design doc |
| P0 | contract | Căn cứ của dòng «chấm thay đổi đã làm, không làm lại» trích «Ngoài-7: mở hợp đồng mới», câu chỉ quyết có một hợp đồng riêng | Chủ kho tưởng cổng trước đã duyệt cả cách chấm sau khi làm, trong khi các con số tiêu chí đọc từ kết quả đã có là máy tự chọn | Thay dòng sổ bằng lời chủ kho tra được, hoặc căn cứ một-lối; tách vế «mã chỉ đổi nếu…» | fixed: dòng sổ thay bằng căn cứ một-lối (chép và sinh lại là tất định); vế «mã chỉ đổi khi lỗi nằm trong hợp đồng» thành dòng riêng; hợp đồng ghi rõ ở Notes rằng các con số đọc từ kết quả đã có |
| P1 | evals | Không phép đo nào cho thấy giá trị ghim của E3 tính từ kho plugin ở feea58d; nếu tính từ bản chép thì E3 tự so với mình | Bản chép lấy từ cây làm việc của plugin có sửa chưa commit, hoặc từ commit khác: E3 vẫn xanh mà thư mục không phải bản feea58d | Ghim theo git của plugin; phép đo tính lại từ tệp ở đây | fixed: E3 nay so mã cây git của thư mục, giá trị ghim là mã chính kho plugin cho thư mục công cụ ở feea58d (kiểm lại bằng một lệnh git rev-parse ghi ở matrix.mjs và design doc); hai bên ra cùng mã 357987f790b1 |
| P1 | evals | E1 lấy chiều đỏ từ dòng tự báo của check.mjs, một tệp vừa bị thay [adopt-design-assembly#F2]; E5 và E6 không có chiều đỏ | Công cụ mới hỏng bước phá thử mà vẫn in 17 và 20; hoặc bên đọc sổ bỏ qua im lặng khi mất mục | Thêm bản phá chạy bằng công cụ mới cho lệnh kiểm và cho sổ thiếu mục | fixed: thêm E10 (bản dựng tạm thêm một linh kiện không ghi sổ làm lệnh kiểm với công cụ mới đỏ và gọi tên linh kiện) và một ca trong E7 (sổ thiếu mục FilterChip làm lệnh kiểm sổ của công cụ mới đỏ). rejected phần so đầu ra chi tiết của cổng chứng minh màn: cổng chỉ đọc bộ tên của sổ, và AC-2 giữ bộ tên không đổi; ghi ở bảng Coverage |
| P2 | evals | Ma trận ghim năm thông điệp lệch cho names once, E7 mới thấy đỏ ba; expected không ghi số ca; E7 chỉ gắn AC-2 | Nhánh «thêm tên» của phép so chưa từng được thấy đỏ; bỏ bớt một ca phá thì E7 vẫn «ba bài đạt» | Thêm hai bản phá; ghi số ca; gắn đủ tiêu chí | fixed: thêm hai ca phá (sổ thêm tên lạ; công cụ mới đưa vào làm công cụ cũ), ma trận đầu evals.yaml ghi bốn bài và chín ca cho chín thông điệp; E8 và E9 gắn chiều đỏ của AC-3 và AC-4 |
