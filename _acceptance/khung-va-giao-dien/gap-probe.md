---
slug: khung-va-giao-dien
at: 2026-11-10T22:58:30Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | E16 hỏi câu chữ của bốn màn nhưng `inputs` không có tệp chứa câu chữ, và không có bảng nhãn để so | Câu lỗi được truyền từ tệp route; hội đồng chỉ thấy khuôn rỗng, chấm theo đoán; câu thiếu «vì sao» vẫn qua | Mọi câu chữ khung ở một tệp, đưa tệp ấy và `ontology/labels.yaml` vào `inputs`, tách bốn câu có/không | fixed: thiết kế ghim mọi câu chữ khung ở `frame-copy.ts` (d-…-15); E16 nay đọc `frame-copy.ts`, `design/language.md`, `ontology/labels.yaml` và hỏi bốn câu (a)–(d) |
| P1 | evals | Bài khẳng định điều «không có» thiếu đối chứng dương; danh sách màn của axe thiếu trang lỗi, hết phiên, băng mất mạng, tấm phủ | Bộ chọn gõ sai làm E7 xanh vô điều kiện, khung nội bộ lọt ra URL lạ; nút đỏ ở giao diện tối không đạt tương phản mà không bài nào đỏ | E7 chạy cùng bộ kiểm trên /inventory phải báo 'internal frame found'; E14 kê đủ màn, đếm lượt quét, có ca phá màu | fixed: E5, E6, E7, E8, E13 thêm ca đối chứng có thông điệp ghim; E14 quét danh sách viết trước 9 màn × 2 giao diện = 18 lượt, có ca phá màu nút «Thử lại» |
| P1 | contract | AC-4 chỉ đo hàm lọc; AC-8 phần hết phiên chỉ kích bằng cờ bản mẫu, không đo đường nối 401 | AppShell bỏ qua vai mà E4 vẫn xanh; API trả 401 mà người thấy trang lỗi, E8 vẫn xanh | E4 dựng thanh bên thật và đọc DOM; hoặc nối 401, hoặc ghi rõ vào Out of scope | fixed: AC-4 nói «trên thanh bên», E4 dựng thanh bên thật trong SidebarProvider và đọc DOM, ca đối chứng sai vai; 401 chưa có lời gọi API nào để nối — thêm vào Out of scope và sổ (d-…-16) |
| P1 | evals | Ma trận định dạng của E9 không khai tổng số ô, thiếu ca ở mép đổi đơn vị và mép làm tròn | 999.999.999 hiện «1.000 triệu»; người làm bớt ô khó, số đếm tự khớp, E9 vẫn xanh | Khai đúng N ô trong expected, thêm ca biên, ghi luật làm tròn vào thiết kế | fixed: E9 khai đúng 32 ô theo từng kiểu, gồm 999.999.999, 1.000.000.000, 999.999, 1.000.000, 4.856.000.000, 0, số âm, điện thoại thiếu số; thiết kế ghi luật làm tròn nửa lên và chọn đơn vị sau làm tròn |
| P2 | design | Câu chữ khung ngoài labels.yaml không có dòng sổ; câu trích của d-…-5 và d-…-6 không quyết được lựa chọn | Luật ngôn ngữ bị lách mà chủ kho không thấy dòng nào; cách viết giá dưới 1 triệu và màu «Đã bán» ra người dùng như quyết định của máy | Thêm dòng sổ cho câu chữ khung; đổi nguồn d-…-5, d-…-6 hoặc thành câu hỏi | fixed một phần: thêm d-…-15 (câu chữ khung, trích luật «Câu lỗi … Người soát» của design/language.md); d-…-14 thay d-…-6, giá dưới 1 triệu theo tiền tệ của Intl vi-VN đúng chuẩn đã khai. rejected phần bảng màu: bảng là của sản phẩm Quỹ hàng mà chủ kho đã ký (hồ sơ trang-thai-rieng, signed-off bởi Manh Phan, «nhận luật và màu của neo»), luật kho cho mang phần đã có kèm commit nguồn, và đổi một màu là một dòng |
