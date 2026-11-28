---
slug: chuan-hoa-he-design
at: 2026-11-27T21:18:38Z
verdict: findings
p0: 1
p1: 4
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | contract (AC-1) · evals (E1) | Ngưỡng ΔE2000 ≥ 10 đặt trên nền nhãn kiểu «-light» mà chưa ai thử trên bảng màu đã duyệt; luật lệch sắc áp cả cho màu xám | E1 đỏ ở cặp chủ kho bảo giữ hay ở «Đã bán» – «Đang giao dịch»; người làm buộc đổi màu đã duyệt hay hạ ngưỡng sau khi thấy số | Đo sáu màu trên bảng đã duyệt và bản hôm nay, ghi bảng 15 cặp × 2 nền, đặt ngưỡng sao cho bảng đã duyệt qua và hai cặp đang trùng đỏ; xám so độ bão hoà | human-gate1: đã đo trên màn thật (bảng ở design.md); bài đo chữ nhãn, ngưỡng 12, xám đo độ bão hoà ≤ 8; sắc tím trên ảnh 27/11 chỉ 10,4 so với «Đã bán» ở nền sáng nên thành Hỏi-2 (tím ảnh hay tím hồng 20,4) — chủ kho chọn sắc |
| P1 | design · decisions | Đổi `--info` nền sáng là đổi token dùng chung; design không kê chỗ khác đọc nó; sổ không ghi lý do chọn đổi token chung | Mọi chỗ mang nghĩa info trên màn khác đổi sang tím mà chủ kho chưa thấy | Kê mọi chỗ đọc `--info`; có chỗ ngoài nhãn trạng thái thì thành câu hỏi; thêm phép so | fixed: tìm khắp src ngoài bộ kit — chỉ nhãn «Đang giao dịch» dùng info, trang khách không dùng; dòng sổ ghi lý do đổi token; AC-1 và E2 thêm bài quét đỏ khi có chỗ mới dùng info |
| P1 | contract (AC-4, AC-5, AC-8) · evals (E5, E6, E9) | Hỏi-1 còn chờ mà AC-4, AC-5, AC-8 viết như đã chọn đổi; lối khác không nói AC nào rơi | Chủ kho chọn giữ Enter mà hợp đồng đã ký vẫn đòi Enter mở sửa, hay bộ trợ giúp của 3h mở hồ sơ thay vì khung sửa | Ghi «chờ Hỏi-1», viết sẵn nhánh lối khác, đưa hệ quả vào câu hỏi | fixed: AC-4, AC-5 ghi «chờ Hỏi-1»; AC-8 ghi Enter hay F2 theo Hỏi-1; Notes và dòng sổ Hỏi-1 mới (supersedes) nêu AC-4, AC-5, E5, E6 rơi và E9 mở bằng F2 nếu giữ |
| P1 | evals (E3, AC-2) | E3 quét «mỗi trạng thái có căn mẫu» không có ma trận viết trước; ô thiếu bị bỏ qua câm | Lịch sử lần chào tô màu cũ mà dữ liệu mẫu không có lần chào của trạng thái ấy, E3 vẫn xanh | Viết sẵn ma trận, thiếu ô đỏ có tên, đòi đúng số ô | fixed: E3 viết sẵn 44 ô (lưới 6, thẻ 6, đầu ngăn 6, lịch sử 4 theo dữ liệu mẫu, × 2 nền), thiếu ô đỏ có tên, đòi đúng 44 |
| P1 | contract (AC-7) · evals (E8) | «Ghi như Enter» là ghi xuống máy chủ nhưng AC-7 không gắn (cross-layer); E8 chỉ đo giao diện | Hai lần ghi cho một lần sửa, hay lần ghi bị huỷ khi lưới vẽ lại mà ô vẫn hiện giá mới; E8 vẫn xanh | Gắn (cross-layer); đếm số lần ghi trên Postgres; tải lại vẫn thấy giá; ghim 'two writes for one edit' | fixed: AC-7 gắn (cross-layer) và đòi đúng một lần ghi; thêm E18 lớp backend-effect trên bộ có đăng nhập, chiều đỏ ghim 'two writes for one edit' và 'value lost after reload' |
