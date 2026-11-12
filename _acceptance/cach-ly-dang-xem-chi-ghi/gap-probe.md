---
slug: cach-ly-dang-xem-chi-ghi
at: 2026-11-12T10:20:00Z
verdict: findings
p0: 0
p1: 3
p2: 1
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P1 | evals | Nhánh đối chứng của AC-3 (dạng xem chạy theo người đọc) chỉ chờ «B còn 1», không chứng vì sao | Vai của ứng dụng không có quyền xoá trên bảng thoả thuận nên lệnh lỗi; B còn 1 vì lỗi chứ không vì luật, cặp xanh mà không chứng gì | Ghim mã lỗi chờ đợi rồi mới khẳng định B còn 1 | fixed: AC-3 và E3 ghim lỗi `permission denied for table agreements` rồi mới đếm B vẫn 1 — đúng nghĩa dạng xem theo người đọc dùng quyền người gọi |
| P1 | contract | AC-6, AC-7 phụ thuộc yêu cầu C-5 chưa duyệt; lệnh `cach_ly_7b_db_c` chưa có trong cấu hình | Giám sát từ chối C-5, hai tiêu chí kẹt ở Cổng Bằng chứng | Có trả lời C-5 trước khi dựng; từ chối thì tách hai tiêu chí, ký lại phạm vi | fixed: Notes của hợp đồng ghi điều kiện huỷ rõ (từ chối → AC-6, AC-7 thành việc riêng, ký lại Cổng Phạm vi; chưa trả lời → không dựng việc 7) |
| P1 | evals | Mốc «không nới» (AC-5, E5) là mảng do người làm chép tay, danh sách ca đọc từ bộ chạy đã sửa | Người làm sửa dòng ghim cũ rồi chép mảng từ bản sửa; bài so bản sửa với chính nó | Đọc mốc thẳng từ git ở commit cố định, in đủ 18 dòng ghim và 29 ca | fixed: AC-5 và E5 đọc bộ chạy ở commit `d85d815` bằng git show, khẳng định đủ 29 tên ca và 18 dòng ghim rồi tìm nguyên văn trong bộ chạy mới |
| P2 | evals | Đối chứng dương của AC-1 không đọc được từ kết quả chạy; lời AC-1 và E1 lệch | Ca in ok mà không thật sự đếm đối chứng bằng 1 | Ghim số đối chứng vào dòng in | fixed: dòng in thống nhất `ok dang-xem-ghi-khong-vuot-luat — <n> dạng xem, đối chứng 1`; ca tự ném HỎNG khi đối chứng khác 1 |
