---
slug: go-hoi-khi-gop
at: 2026-11-10T13:36:00Z
verdict: findings
p0: 2
p1: 3
p2: 0
---

## Findings

| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |
|---|---|---|---|---|---|
| P0 | design | Bảng kiểu gộp thiếu `--rebase`, và dạng viết tắt `-s` chưa ai quyết | Máy chạy gộp rebase hoặc viết tắt, không hộp xin phép, không merge commit, các tiêu chí vẫn xanh | Kê đủ cờ chọn kiểu gộp, sổ có dòng quyết cho `--rebase` và viết tắt | fixed: thêm `--rebase` vào bảng, AC-2 và luật hỏi; viết tắt lên Hỏi-1 ở Cổng Phạm vi (human-gate1) |
| P0 | contract | Lý do bỏ quét không đúng, chính E2 đã có hai trục | Cổng Phạm vi miễn bằng chứng độ phủ, các ô rebase và viết tắt không xuất hiện | Quét hai trục, mỗi ô có tiêu chí hoặc lý do loại | fixed: Coverage nay có ba trục và thước là bảng cờ của lệnh; dòng bỏ quét được thay trong sổ |
| P1 | evals | Không eval nào định nghĩa "khớp luật"; đường dẫn tệp có thể hardcode | Bộ kiểm chỉ tìm chuỗi nên luật viết sai vẫn xanh | Kê nguyên văn lệnh, bảng đối chứng luật và lệnh, đường dẫn suy từ vị trí bộ kiểm | fixed: E1 đến E3 kê nguyên văn lệnh, E5 có bảng đối chứng 8 cặp và đường dẫn suy từ vị trí |
| P1 | evals | Ma trận chưa khép, số ca không có trong bằng chứng | Luật đòi khoảng trắng sau cờ không khớp cuối lệnh; bộ kiểm không chạy mà vẫn exit 0 | 16 ca cho cờ trái nếp, 6 ca gộp thường, số ca phải đúng | fixed: E1 có 6 lệnh, E2 có 16 lệnh, lệnh đo đòi đúng 47 ca đạt; ca tiêu đề chứa chữ `--squash` ghi ở Notes |
| P1 | evals | Bản gốc của AC-4 chép tay, E5 thiếu ca và thông điệp dùng chung | Nới một dòng cấm rồi chép vào bộ kiểm, số dòng vẫn 16 nên xanh | So với commit ghim, khai đủ bản phá, thông điệp mang tên cờ | fixed: E4 so với `git show` tại 84a2d597, E5 khai đúng 12 bản phá, thông điệp mang tên cờ hoặc lệnh |
