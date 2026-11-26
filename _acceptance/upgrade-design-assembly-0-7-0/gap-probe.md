---
slug: upgrade-design-assembly-0-7-0
at: 2026-11-17T04:30:00Z
verdict: findings
p0: 3
p1: 1
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
| --- | --- | --- | --- | --- | --- |
| P0 | design | Dòng sổ «lỗi trong công cụ thì sửa ở plugin, ra bản mới, lên đời lại» hứa một việc ngoài kho (phát hành bản plugin) mà ghi kho_dao false; lối chết nêu là tiêu chí do chính hồ sơ đặt. Lý do mới so với [upgrade-design-assembly-tool#F3]: lần ấy chưa xét lời hứa phát hành ngoài kho | Lượt chấm thấy lỗi trong công cụ, máy sang kho design-assembly ra bản 0.7.1 mà chủ kho chưa cho phép, hoặc vòng kẹt chờ một bản không ai nhận | Dòng sổ thành dừng và hỏi chủ kho; design doc khớp | fixed: dòng mới thay d-20261117T041622Z-4 — máy không sửa tay, không làm gì ở kho plugin, vòng dừng và trình chủ kho; design doc mục «Luật lựa chọn» và Notes của hợp đồng ghi cùng luật |
| P0 | contract | Các lựa chọn chủ kho cho phép ngày 2026-11-17 chỉ nằm trong văn xuôi Context, không có dòng sổ; dòng hoãn hai hàng 8.3 trích lời chú do chính commit viết | Người ký thấy bốn lựa chọn về sổ và bản đồ như máy tự chọn; một lựa chọn chưa thật sự được cho phép vẫn qua cổng | Mỗi lựa chọn của chủ kho có dòng sổ truy được | human-gate1: Hỏi-2 kê sáu lựa chọn và xin chủ kho xác nhận ở Cổng Phạm vi (lời chủ kho không nằm trong tệp nào của kho); dòng hoãn 8.3 thay bằng căn cứ db/scripts/ci-thu.sh (hàng 1s đòi make check xanh trên bản sao nông) |
| P0 | contract | Lối chết của dòng bỏ quét độ phủ («danh sách 81 tệp đã đóng») chỉ đóng do cách dựng; bảng Coverage kê theo nhóm, không nối từng tệp | Một tệp lạc trong 81 tệp (bài kiểm bị nới, sửa dưới src/) không thuộc nhóm nào, E14 vẫn xanh | Bảng nối từng tệp với một nhóm Coverage, E14 đếm, E22 có ca phá | fixed: FILE_GROUPS ở rang/matrix.mjs nối 81 tệp vào 13 nhóm (17+1+2+11+7+25+7+1+1+1+6+1+1); change-list.mjs đỏ khi một tệp không thuộc đúng một nhóm hay số tệp nhóm lệch; E22 có hai ca phá ghim thông điệp; bảng Coverage và design doc ghi số tệp từng nhóm; dòng sổ bỏ quét độ phủ thay bằng căn cứ này |
| P1 | evals | Dòng «component manifest … up to date» của E1 không đỏ được vì cổng viết lại sổ trước khi kiểm; Coverage hứa «viết lại và kiểm» | Bước kiểm sổ thành không làm gì, ba dòng vẫn in, AC-1 đạt mà không đo quan hệ sổ khớp mã | Phép đo riêng có ca phá, hoặc Coverage bỏ vế «và kiểm» | fixed: Coverage và Notes nói rõ dòng ấy là lời cổng in sau khi tự viết lại sổ, không đỏ vì sổ cũ; việc sổ ra khỏi git đo ở AC-4; mỗi lệnh kiểm của công cụ tự thấy mình đỏ trên bản đổi (dòng 25 lệnh kiểm của AC-1). Không dời E1 sang rang/: make check là cổng của kho và cũng là lệnh đầu của bộ suite |
| P2 | evals | E14 chỉ ghim dòng trước khi gộp; không ca nào cho nhánh đã vào origin/main | Lượt ghim lại sau khi gộp in một dòng không được ghim, chấm đỏ oan hoặc xanh suông | Ghim dòng sau khi gộp và thêm ca | fixed: change-list.mjs nhận --merged; expected của E14 ghim dòng sau khi gộp; E22 thêm ca xanh khi đã gộp và ca đỏ khi đã gộp mà commit có tệp ngoài danh sách |
