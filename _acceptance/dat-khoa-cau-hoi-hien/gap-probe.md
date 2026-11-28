---
slug: dat-khoa-cau-hoi-hien
at: 2026-11-28T09:05:00Z
verdict: findings
p0: 1
p1: 2
p2: 1
claims_input: ok
---

# Phản biện context sạch

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | decisions | Dòng bỏ ui-observed ghi một-lối, mà lối trình giả lập terminal thật còn sống; khung nhìn và thước E1 cùng là đầu ra của mô hình màn tự viết | Mô hình bỏ qua một chuỗi điều khiển readline phát, câu hỏi đã bị xoá vẫn hiện trên màn dựng lại, E1 xanh oan | So với trình giả lập thật, hoặc thành câu hỏi cho người | fixed: mô hình màn thành nghiêm — chuỗi lạ làm phép đo dừng «không chạy được» (bản phá pha-chuoi-la); dòng sổ mới d-9 thay d-6, nêu vì sao trình giả lập thật không có trong kho; byte gốc mỗi lượt giữ ở thư mục lượt đo; Known limits ghi rõ |
| P1 | contract | Đường đổi cỡ (terminal vẽ lại dòng nhập) chỉ biện bằng lý lẽ, không đo; phép đo chạy 200 cột | Dán chuỗi pooler dài trên terminal hẹp rồi đổi cỡ, readline xoá câu hỏi, E1 vẫn xanh | Ca đổi cỡ có bản phá | fixed: ca tty-doi-co (80 cột → 60 cột giữa lúc dán), đòi thấy readline vẽ lại sau lần đổi cỡ; bản phá pha-khong-doi-co và pha-thu-tu-cu-doi-co; AC-1 thêm vế đổi cỡ |
| P1 | evals | Không bản phá nào chứng chiều đỏ của mã hoá mật khẩu và khoá tự sinh | Bỏ mã hoá hay sinh khoá sai độ dài vẫn xanh | Bản phá pha-bo-ma-hoa, pha-sinh-sai | fixed: mật khẩu thử vốn mang @ và # (ghi rõ trong E2); thêm hai bản phá, đỏ «khoá nhận sai: MIGRATE_DATABASE_URL» và «khoá sinh sai: AUTH_SECRET» |
| P2 | evals | Thứ tự câu hỏi và luồng của câu hỏi khi đầu vào là ống dẫn không có chiều đỏ riêng | Câu hỏi lệch thứ tự, hay ra luồng ra, vẫn xanh | Thông điệp riêng và bản phá | fixed: «câu hỏi sai thứ tự» (bản phá pha-sai-thu-tu trên màn lành vừa đọc) và «câu hỏi ra luồng ra» (bản phá pha-hoi-ra-luong-ra) |
