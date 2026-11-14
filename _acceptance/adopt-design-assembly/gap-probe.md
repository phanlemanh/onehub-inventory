---
slug: adopt-design-assembly
at: 2026-11-14T13:55:00Z
verdict: findings
p0: 3
p1: 2
p2: 0
---
## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Dòng bỏ coverage-scan lấy lối chết không đúng; tiêu chí sót bước 2 (ba lời đáp, tương phản, số phiên bản sổ màn), bước 5 (thoát ký tự) và sổ token. Cùng dạng [da-gui-tren-luoi#F1] | Dòng lời đáp ghi AAA hay màu khác #0246ff, hoặc thoát ký tự hỏng với tên chứa dấu gạch chéo ngược, mà make check vẫn xanh vì ngưỡng chỉ đếm số dòng | Bảng phủ sáu bước, tiêu chí cho bước 2 và sổ token, cặp hai chiều cho thoát ký tự | fixed: thêm AC-10 (ba lời đáp, tương phản, màu) và AC-11 (sổ token) kèm E12, E13; bảng sáu bước ở mục Coverage; bước 5 ngoài phạm vi có lý do (bài kiểm ở kho design-assembly, quét mã của PR đo độc lập); dòng bỏ quét được thay, và chọn cách phủ nay là Hỏi-1 cho chủ kho (human-gate1) |
| P0 | evals | Lối chết của dòng bỏ đường «không thể đỏ» không đúng; chiều đỏ của E1, E6 chỉ dựa vào dòng tự báo của lệnh kiểm | Bước phá thử của lệnh kiểm hỏng mà nó vẫn in dòng «each seen failing», một linh kiện mới không ghi sổ mà make check vẫn xanh | Cặp hai chiều đo thẳng cho AC-6 trên một bản dựng tạm, thông điệp ghim | fixed: AC-6 và E6 đo thẳng trên bản dựng tạm, lượt thêm ChangedProbe phải đỏ với «ChangedProbe is not in the file»; dòng bỏ đường «không thể đỏ» được thay với lối chết đúng: lượt thấy-đỏ tắt mọi luật đã chặn, nên mục chặn trùng cũng bị tắt |
| P0 | design | Căn cứ mục-tiêu của dòng chỗ đặt phép đo chỉ là tiền lệ của hồ sơ khác, không quyết. Cùng dạng [kiem-vai-theo-man#F1] | Chủ kho duyệt chỗ đặt vì tưởng chuẩn kho đã quyết, không thấy rằng sau khi gộp có phép đo không còn chạy trong make check | Dòng thay với nguồn một-lối và cost_if_wrong nêu rõ phép đo nào hết được giữ | fixed: dòng thay dùng một-lối (đặt ở tools/ là đổi mã T3 ngoài lý do lượt chấm, trái dòng giữ mã trên nhánh), cost_if_wrong và mục Notes của contract nêu đúng AC-4 là thứ không còn ai giữ sau khi gộp |
| P1 | evals | AC-2 lấy mã thoát 0 làm bằng thay vì đọc quyết định nào được giữ; ngưỡng n ≥ 18 không có ma trận | Lệnh kiểm âm thầm bỏ một quyết định, n vẫn ≥ 18, E1, E2, E3 đều xanh | Ma trận chính xác từng id, đọc trạng thái từng dòng từ lệnh kiểm | fixed: ma trận 18 id viết trước ở đầu evals.yaml, AC-1 đòi đúng 18, E2 đọc đầu ra --rate từng dòng và đỏ với «held: 17, missing raw-table» khi thiếu một dòng (E10) |
| P1 | contract | Không có danh sách viết trước mọi người đọc sổ linh kiện; E8 chỉ chạy bộ bài có sẵn | Cổng chứng minh màn đọc trường của hình dạng cũ lúc chạy thật, bài dùng fixture viết tay nên vẫn đạt | Ma trận người đọc, chạy cổng trên sổ thật, cặp đỏ với sổ cũ | fixed: danh sách năm người đọc ở mục Coverage, kê từ việc tìm tên tệp trên toàn kho; E11 chạy cổng chứng minh màn trên kho ở HEAD. rejected phần cặp đỏ với sổ cũ: cổng chỉ đọc tên và tệp của mỗi mục, cả hai hình dạng đều có, nên sổ cũ không phải ca hỏng của nó |
