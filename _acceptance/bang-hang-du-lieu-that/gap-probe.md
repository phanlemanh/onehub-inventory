---
slug: bang-hang-du-lieu-that
at: 2026-11-15T03:25:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---
## Findings
| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ bảng căn chào ghi dễ đảo; hai lựa chọn lược đồ (cơ chế một lần chào mở, chỗ giữ luật nấc) chưa có dòng sổ; thiết kế 5.1 và 9 mâu thuẫn về chỗ giữ luật nấc | Chủ kho duyệt hai câu trái nhau; S2 tự chọn; luật nấc ở hai chỗ | Gỡ mâu thuẫn, thêm dòng sổ cho hai lựa chọn | fixed: thiết kế 5.1 chốt ranh giới (nấc ở máy chủ, quyền và dữ liệu ở cơ sở dữ liệu, trigger cho Đang bán), mục 9 sửa theo; dòng sổ mới cho cột open + chỉ mục duy nhất (lối kiểm khi ghi chết vì chạy đua) và cho ranh giới luật; khó đảo xét theo nghĩa của kit (không ship người dùng thật, không xoá dữ liệu, không cam kết ra ngoài kho) — migration chưa chạy ở đâu, đảo được bằng migration mới, nên giữ kho_dao false kèm lý do trong dòng sổ |
| P0 | design | Dòng sổ ⌘K, cây, hồ sơ dẫn câu 0028 chỉ quyết phần ⌘K; cơ chế cache là máy tự quyết | Chủ kho tưởng cả ba và cơ chế có căn cứ | Tách dòng sổ | fixed: ba dòng — ⌘K trích 0028; cây và hồ sơ là một-lối (đọc riêng ở khung chết vì 0036 và lời giao); cách gộp lần đọc dời sang kế hoạch S2, bài đo «một lần đọc mỗi lượt» giữ kết quả |
| P1 | evals | Quyền sửa giá, điều kiện phí, nấc khác chưa đo ở máy chủ; ma trận 24 ô thiếu trục loại thay đổi | PATCH giá của vai bị cấm vẫn 200 | Ma trận đủ trục, ô 403 kèm dòng không đổi | fixed: ma trận 48 ô (4 vai × 3 loại căn × 4 loại thay đổi) ở API và cơ sở dữ liệu, đáp án viết ở S2 theo Hỏi-1, Hỏi-2 trước mã; thêm cặp phá thử bỏ kiểm updateListing; AC-5 nói rõ |
| P1 | evals | Vế hoàn tác của AC-6 chỉ đo ở cơ sở dữ liệu | Trình duyệt gửi lại trạng thái cũ, màn quay về trạng thái trước | Ca e2e hoàn tác chỉ giá + đối chứng | fixed: ca hoan-tac-chi-gia ở E6b kèm đối chứng và chiều đỏ |
| P1 | evals | Lỗi đọc chỉ thử bằng công tắc; 20/40 khung; thiếu sàn trống | Cơ sở dữ liệu tắt thì trang lỗi chung của Next mà eval vẫn xanh | Ca lỗi đọc thật; đủ khung; sàn trống trong lệnh nạp | fixed: ca loi-doc-that (vai nối mất quyền select) ở E2 và chiều đỏ ở E8; E8-ui chụp bốn khổ (40 khung); lệnh nạp thêm [MAU-TRONG]; AC-8 nói rõ lần đọc thật hỏng |
