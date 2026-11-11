---
slug: khai-lien-ket-chao-can
at: 2026-11-11T04:10:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Tên ContactListing lấy từ RESO ContactListings mang nghĩa khác (lần chào gửi cho người mua xem); sổ ghi máy quyết tên | Hàng gửi lần chào sau cần đúng tên RESO thì tên đã bị chiếm, phải đổi tên và migration | Ghi đúng nghĩa RESO, đưa tên lên câu hỏi, khuyến nghị tên riêng | human-gate1: soạn nháp tên riêng ListingOwner, đưa lên Hỏi-2; dòng sổ tên cũ bị thay |
| P1 | evals | E1 đo chuỗi kiểu sinh, không đo trường trỏ tới khái niệm nào | upi khai chuỗi trơn hay trỏ nhầm vẫn xanh | Đọc YAML thực thể, ma trận trường → đích, chiều đỏ đổi đích | fixed: E1 đọc YAML, bảy trường tham chiếu, chiều đỏ 'tham chiếu sai' |
| P1 | contract | Hai luật dữ liệu (cùng sàn, một lần chào một căn) không có AC; E2 không ghi cardinality | Quan hệ một-một khai sai hay liên kết khác sàn vẫn xanh | Thêm AC cho luật dữ liệu, E2 ghi cardinality từng dòng | fixed: AC-7 và E7 mới; AC-2, E2 ghi cardinality sáu quan hệ |
| P1 | evals | E3 đo chuỗi vắng mặt, thiếu dạng type, mâu thuẫn bí danh | Khai type bằng tay vẫn xanh; dùng bí danh đúng thì đỏ | So kiểu bằng expectTypeOf, thêm chuỗi cấm, đối chứng dương | fixed: E3 so kiểu, sáu chuỗi cấm, đối chứng bí danh |
| P1 | evals | E5 tuyên tệp kiểm cũ không đổi mà không đo | Sửa dữ liệu rồi đổi băm ghim trong tệp cũ vẫn xanh | Tệp kiểm mới tự tính băm và so hằng của chính nó | fixed: E5 tự tính băm trong tệp kiểm mới |
