---
slug: dang-nhap-ma-email
at: 2026-11-11T05:20:44Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Dòng sổ tách bảng thành viên và hàm hẹp ghi máy tự quyết (một lối) trong khi lối kia còn sống và là chính Hỏi-1; các hàm chạy quyền chủ đọc bảng sàn bị ép luật theo dòng mà thiết kế không nói cách, sổ không ghi chạm SP-1 | Chủ kho duyệt Hỏi-1 không thấy mình duyệt một ngoại lệ của SP-1; người làm cấp quyền vượt luật cho vai chủ, mọi hàm quyền chủ về sau đọc được mọi sàn | Dòng sổ mới chỉ-người gộp vào Hỏi-1 có pham_luat SP-1; thiết kế §3 nêu vai riêng; E15 thêm ca vai hẹp | fixed: dòng sổ mới thay d-8 (pham_luat SP-1, gộp Hỏi-1); thiết kế §3 thêm mục vai quy_hang_identity; AC-9 và E15 thêm ca vai-ham-danh-tinh-hep cùng bản phá pha-thu-vai-ham-doc-them |
| P1 | contract | Ca bị gỡ khỏi mọi sàn giữa lúc xin mã và gõ mã không có tiêu chí, eval; câu của trạng thái quá giới hạn và chưa thuộc sàn không được ghim | Người bị gỡ gõ đúng mã vẫn được phiên sàn rỗng; màn quá giới hạn hiện câu chung mà eval vẫn xanh | Thêm nhánh vào AC-5, ca go-truoc-khi-doi-ma, ghim chữ ở E17, khung ảnh ở E18 | fixed: AC-5 thêm nhánh; E6 thêm ca go-truoc-khi-doi-ma; E17 ghim hai câu; E18 thêm hai khung |
| P1 | evals | E1 chỉ đo có một chuỗi 6 số; mã đổi phiên không bảo đảm là mã trong thư | Thư mang mã khác mã đã băm; bài kiểm dùng mã fixture nên xanh | E3 rút mã từ thân thư, đối chứng một mã khác bị từ chối | fixed: AC-2 và E3 ghi mã lấy từ chính thư, đối chứng mã khác trả code-invalid |
| P1 | design | Câu Hỏi-4 nói không khởi động, thiết kế làm trả lỗi lúc xin mã; E2 không đo đường xin mã trả 500 | Chủ kho tin bản thật sai cấu hình không lên được, thực tế vẫn lên | Dòng sổ mới khớp hành vi; ca route trả 500 | fixed: thiết kế và AC-1 kiểm lúc khởi động (instrumentation) và trả 500 nếu lọt; dòng sổ mới thay d-6; E1 thêm ca ban-that-loi-may-chu, E2 kiểm hàm khởi động |
| P2 | contract | AC-2, AC-7 qua cả máy chủ và màn mà không gắn cross-layer; phần màn của AC-2 không có eval | Màn kẹt ở /login mà AC-2 vẫn tính đạt | Gắn cross-layer; eval màn cho AC-2; layer cho E3, E9 | fixed: AC-2, AC-7 gắn (cross-layer); thêm E19; E3, E9 layer backend-effect |
