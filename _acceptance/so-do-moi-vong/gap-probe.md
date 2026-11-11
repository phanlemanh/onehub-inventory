---
slug: so-do-moi-vong
at: 2026-11-10T23:20:00Z
verdict: findings
p0: 1
p1: 4
p2: 0
claims_input: ok
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ chọn 11 tầng và dòng chọn màn Liên hệ ghi nguồn mục tiêu, nhưng câu trích chỉ liên quan chứ không quyết; không có bảng nối hàng 1c, 1e, 1f, 1g với tầng | Chủ kho thấy hai lựa chọn là máy quyết nên không xét; sau 10 vòng báo cáo không trả lời được hàng nào bớt làm lại và đổi khung thì phải khai lại tầng các lượt cũ | Viết lại hai dòng thành câu hỏi cho người; thêm bảng nối hàng với tầng | human-gate1: hai dòng mới thay hai dòng cũ, thành Hỏi ở Cổng Phạm vi kèm khuyến nghị; thiết kế thêm bảng nối hàng với tầng. kho_dao giữ false vì không chạm ba việc khó đảo của kit (ship ra người dùng, xoá dữ liệu, cam kết ngoài kho) |
| P1 | contract | Không nói hồ sơ giao diện cũ có được miễn lưới hay không | Lưới đỏ trên kho thật vì một hồ sơ cũ, hoặc người làm tự thêm danh sách miễn không ghi sổ, thành lối lách | Hợp đồng ghi luật miễn; E4 có ca hồ sơ cũ | fixed: kho chưa có hồ sơ giao diện nào đã qua chấm, nên không cần miễn; hợp đồng và thiết kế ghi rõ không có danh sách miễn, E4 khẳng định hồ sơ signed-off thiếu bản số đo luôn đỏ |
| P1 | evals | Sổ chạy mẫu của E1 không có lượt chấm lại cùng lượt, không có PENDING-JUDGMENT, không nói dòng mẫu rút từ bộ ghi thật; mốc Quỹ hàng chỉ ghim một số | Bản cài đếm mọi dòng REJECT nên lượt chấm lại thành làm lại; tên trường thuoc-vat lệch kit nên ra null; mốc Quỹ hàng gõ sai mà E6 vẫn xanh | Thêm hai ca; ghi nguồn tệp:dòng; ghim khoá và số của mốc Quỹ hàng | fixed: AC-1 và E1 thêm lượt REJECT rồi PASS và lượt PENDING-JUDGMENT; dòng mẫu chép nguyên từ sổ chạy thật kèm nguồn; AC-6 và E6 ghim 11 khoá, tổng 199, các tỉ lệ 55, 15, 5, 0 của 0019 |
| P1 | evals | Ba agent độc lập và đo trước 1a chỉ dựa lời tự khai | Agent đọc phương án của agent khác hay nhận thêm ngữ cảnh mà kiem-moc và E9 vẫn xanh | Ghim câu đã gửi và chứng bản kho không chứa phương án | fixed: agent-N.md chép câu đã gửi rút máy từ bản ghi agent; kiem-moc so câu đó với đề bài cố định và đỏ khi ở commit đã có thư mục mốc; E8 thêm hai bản phá có thông điệp ghim |
| P1 | evals | kiem-moc cần commit cũ mà CI lấy mã nông | make check trên CI đỏ cho mọi PR sau khi gộp | Chạy thêm trên bản clone nông | fixed: CI job check dùng checkout độ sâu 1 (đã xác nhận trong .github/workflows/ci.yml); kiem-moc bỏ riêng ba điều kiện cần lịch sử khi kho nông, in thông điệp ghim; E5 và E8 chạy trên bản clone nông |
