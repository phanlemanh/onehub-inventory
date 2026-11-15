---
slug: upgrade-design-assembly-tool
at: 2026-11-15T23:26:36Z
verdict: findings
p0: 3
p1: 2
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | contract | Ba dòng sổ về chỗ đặt phép đo, việc không sửa hồ sơ cũ và việc bỏ quét độ phủ có nguồn mục tiêu, nhưng câu trích là tiền lệ của hồ sơ refresh-design-assembly-tool, không quyết việc của vòng này; câu trích về chỗ đặt phép đo còn nói chuyện khác ([refresh-design-assembly-tool#F1]) | Chủ kho tin các lựa chọn ấy đã được người quyết và duyệt mà không soi, trong khi máy tự chọn | Mỗi dòng sổ đứng bằng căn cứ của chính nó, đúng loại nguồn | fixed: ba dòng mới thay ba dòng cũ, đều một-lối có lối chết riêng của vòng này (mã cây ghim của AC-2; làn ghim lại chặn sửa hồ sơ đã ký; danh sách tệp đổi đã đóng) |
| P0 | design, contract | Việc chỉ người quyết không có dòng sổ: sau khi gộp không gì canh cây công cụ, chưa chép bước cổng mới có canh phiên bản; design doc hứa ghi một giới hạn sang plugin mà không ai nhận ([refresh-design-assembly-tool#F1]) | Chủ kho ký vì tin dấu phiên bản giữ được cây công cụ; sửa tay một tệp công cụ sau khi gộp vẫn cho make check xanh | Mỗi việc có một dòng sổ: câu hỏi có khuyến nghị, hoặc ngoài phạm vi có người nhận | human-gate1: hai việc đầu thành Hỏi-1 trên thẻ, máy khuyên nhận tới lần lên đời sau. Việc thứ ba fixed: dòng giới hạn đã ghi ở kho design-assembly, Out of scope và design doc trỏ tới nó |
| P0 | contract | Dòng sổ «chấm sau khi làm» gộp thêm vế «mã chỉ đổi khi lỗi nằm trong hợp đồng» mà không có căn cứ cho vế ấy ([refresh-design-assembly-tool#F2]) | Lượt chấm thấy lỗi trong công cụ, máy sửa tay trên nhánh, AC-2 đỏ hoặc kho chạy một bản không ai phát hành | Vế thứ hai thành dòng riêng, nói rõ lỗi ở công cụ sửa bằng bản plugin mới | fixed: tách thành hai dòng; dòng mới một-lối, lối chết là AC-2 ghim mã cây; design doc ghi cùng luật |
| P1 | contract, evals | AC-4 chỉ đo commit lên đời; không gì đo cả nhánh so với main, trong khi Coverage hứa về mọi tệp lệnh không được ghi | Một commit sau trên nhánh chạm sổ token, dữ liệu lệnh kiểm hay bước cổng mà phép đo vẫn xanh | Một phép đo đọc tệp đổi từ chỗ rời main tới HEAD, có danh sách cho phép và hai ca phá | fixed: thêm AC-6, phép đo branch-changes (E11) và cặp hai chiều (E12): đỏ khi thêm design/tokens.json hay mk/design-assembly.mk; sau khi gộp phép đo nói «merged already» thay vì xanh suông |
| P1 | evals | AC-2 so với một hằng số chép từ nhánh, không đối chiếu với sổ phát hành thật của plugin | Lệnh upgrade chạy từ một bản plugin chưa phát hành, chép thư mục và dấu cùng một mã sai, phép đo vẫn xanh | Đọc sổ phát hành ở một commit ghim của kho plugin trong lượt chấm | fixed: ma trận ghim commit 34a7938 và đường sổ phát hành; phép đo release-ledger (E10) đọc sổ ở commit ấy, đỏ khi không đọc được, khi mã khác, khi không có bản 0.1.0 |
