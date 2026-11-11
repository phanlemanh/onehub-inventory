---
slug: khai-vai-va-man
at: 2026-11-11T02:05:00Z
verdict: findings
p0: 1
p1: 3
p2: 1
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design (sổ d-…-3, d-…-5) | Căn cứ máy ghi sai loại nguồn: d-3 trích câu chỉ chốt con số bốn, không chốt bốn vai nào; d-5 ghi lối TypeScript đã chết trong khi nó chỉ đắt hơn | Cổng Phạm vi lướt qua d-3 vì tưởng máy quyết theo mục tiêu; nếu Người giữ là vai nhân viên thì mọi khối từ vòng 2 thiếu một cột | Câu trích gọi tên đủ bốn vai, hoặc đổi sang câu chỉ người có; d-5 đổi nguồn | fixed: d-…-14 thay d-3, trích docs/plan/pham-vi-mvp-dot-1.md mã N3 gọi tên đủ bốn vai; d-…-15 thay d-5, nguồn mục tiêu theo AGENTS.md (dùng lại bộ đọc có sẵn) |
| P1 | contract + evals | Đường kích khối thứ hai (không chạm giao diện nhưng khai screens) không có AC hay eval | Máy kiểm chỉ kích theo surfaces vẫn xanh; vòng 9a khai screens không khối đi qua im lặng | Ca hồ sơ surfaces [config] screens [inventory] không mục phải đỏ, có khối thì xanh | fixed: AC-5 thêm vế, E5 thêm ca 'declared screens need the block without a UI surface', Coverage thêm ô |
| P1 | evals (E9, E10) | AC-9 hứa quan hệ make check đỏ khi phá, E9 chỉ đo chuỗi có mặt và chỉ phá kiểu AC-2 | Công thức nuốt mã thoát hoặc đích không là phụ thuộc của check mà E9, E10 vẫn xanh | Đọc make -pn: phụ thuộc trực tiếp, công thức không nuốt mã; chạy đích trên hai bản sao phá | fixed: E9 đọc cơ sở dữ liệu make, khẳng định phụ thuộc và công thức, phá cả kiểu AC-2 lẫn AC-6, đối chứng bản sao lành |
| P1 | contract + evals (E5, E7) | Không liệt tập trạng thái của kit; E5 chỉ thử draft, E7 chỉ hai trạng thái đóng; hồ sơ mẫu viết tay | Máy kiểm chỉ kiểm khi draft vẫn qua; vòng đã duyệt như 1b gộp vào mà không khối, được đếm là trước khối | Liệt kê tập trạng thái, ma trận đủ, ca đi qua bộ ghi thật của kit | fixed: tập bảy trạng thái theo khuôn hợp đồng kit chia mở, đóng, lạ là đỏ (d-…-16); E5 quét 4 trạng thái mở, E7 quét 3 trạng thái đóng, có ca trạng thái lạ; ca kho thật đọc hồ sơ khung-va-giao-dien do bộ ghi của kit ký. deferred: bộ ghi của kit làm rơi khoá screens khi duyệt hay ký — chưa có hồ sơ nào mang screens để thử; hàng 2 là hồ sơ đầu, máy kiểm sẽ đỏ trên chính PR ấy nếu khoá rơi |
| P2 | evals (E11) | Câu hỏi hội đồng đòi xét đủ màn hiện có mà inputs không có danh sách trang; câu hỏi và tiêu chí đỗ lệch nhau | Hội đồng chấm theo đoán, kết quả tuỳ hội đồng [khung-va-giao-dien#F1] | Bỏ vế ấy (E2 đã đo bằng máy) | fixed: bỏ vế «đủ màn hiện có» khỏi câu hỏi; thêm docs/plan/pham-vi-mvp-dot-1.md vào inputs cho vế bốn vai |
