---
slug: loi-vao-ho-so
at: 2026-11-12T23:26:48Z
verdict: findings
p0: 0
p1: 4
p2: 1
---

# Phản biện context sạch — loi-vao-ho-so

Một tác tử tươi đọc đúng thiết kế, hợp đồng, bộ đo, sổ quyết định, ô cơ hội và bài học từ hàng trước; không đọc mã.

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | design (sổ) | Dòng chạy bước thiết kế trỏ «thay» nhầm dòng «Nhiều căn chỉ đo trên dòng dựng tay», và dòng gốc của nó trích một câu không quyết việc ấy [danh-muc-can-nhu-onehub-invest#F1] | Chủ kho tưởng ca «Nhiều căn» không còn là giới hạn | Mỗi supersedes trỏ đúng dòng cùng ý | fixed: thêm dòng thay đúng mã và khôi phục dòng «Nhiều căn» bằng một dòng mới |
| P1 | design + contract AC-4 | Máy tự quyết lặng lẽ mở lần chào khác khi id trong đường dẫn không còn | Người mở đường dẫn cũ đọc giá khác mà không biết | Câu hỏi cho người; nếu báo thì AC-4 và E4 đo dòng báo | human-gate1: thành Hỏi-4, nháp theo khuyến nghị «có dòng báo»; AC-4 và E4 đã có ca báo và đối chứng dương |
| P1 | design (sổ) | Khuôn địa chỉ mã cộng toà làm hỏng đường dẫn đã gửi khi căn đổi mã hay toà đổi tên | Đường dẫn trong Zalo rơi về «Không có căn này» | Đường dẫn cũ vẫn mở đúng | fixed: id lần chào thắng mã và toà khi còn trong Bảng hàng, địa chỉ được viết lại; AC-4 và E4 đo ca mã, toà cũ |
| P1 | contract + evals | Hợp đồng hứa người không đăng nhập hay khác sàn không xem được, mà không bài nào đo — và hôm nay Bảng hàng chưa bắt đăng nhập | Lời hứa sai đi qua cổng | Đo trang đọc cùng nguồn với Bảng hàng | fixed: bỏ lời hứa sai; Out of scope nói thật trang đi qua cửa của Bảng hàng; AC-2 và E2 đo cùng hàm nạp dòng và căn không có lần chào là «không có» |
| P2 | evals | Ảnh người chấm thiếu báo đã chép, lần chào cũ, «Nhiều căn» trên đường thật | Bố cục vỡ mà không ai thấy | Thêm bước chụp | fixed (một phần): E9 chụp báo đã chép và lần chào cũ; «Nhiều căn» trên đường thật deferred — dữ liệu mẫu không có mã ở hai toà (sổ quyết định) |

## Sau lời chủ kho ở Cổng Phạm vi

Chủ kho chọn bỏ trang riêng. Ba finding về khuôn địa chỉ trang riêng (F3), lời hứa đăng nhập (F4) và ảnh trang riêng (F5)
hết đối tượng hoặc giữ nguyên cách xử: đường dẫn nay là địa chỉ Bảng hàng có id lần chào (bền khi căn đổi mã), lời hứa đăng
nhập vẫn là «đi qua cửa của Bảng hàng», ảnh người chấm chụp các trạng thái trên Bảng hàng. Không chạy lại phản biện (một
lượt theo luật của vòng).
