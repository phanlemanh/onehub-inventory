# Hình tại điểm quyết định — Cổng Phạm vi

| Điểm | Đếm | Hình |
| --- | --- | --- |
| Hỏi-1: cài `make setup` trước lượt chấm | hai nhánh rẽ | cần hình: `hoi-1-cai-goi` |
| Hỏi-2: xác nhận sáu lựa chọn đã cho phép | dưới ngưỡng: một bước xác nhận | — |
| Lỗi trong công cụ: dừng và trình chủ kho | dưới ngưỡng: một bước | — |
| Hoãn hai hàng 8.3 | dưới ngưỡng: một bước, chủ kho đã quyết | — |
| Phép đo bản sao nông dùng bản sao APFS của `node_modules` | dưới ngưỡng: một bước | — |
| Chấm thay đổi đã làm, không làm lại; phép đo ở `rang/`; không sửa hồ sơ đã ký | dưới ngưỡng: mỗi điểm một bước | — |
| Bỏ quét độ phủ; bỏ đặc tả UX | dưới ngưỡng: một bước | — |

## Đề bài `hoi-1-cai-goi`

- Loại hình: sơ đồ rẽ nhánh (flowchart), trái sang phải.
- Nút đầu: «Nền hôm nay: make check xanh · build và e2e đỏ (Next 16.4.2 trong node_modules, lockfile đòi 16.4.6)».
- Nhánh «Cho phép make setup» → «npm ci từ lockfile trong worktree này (checkout chính không đổi)» → «Lượt chấm chạy đủ
  make check, build, e2e» → «Bằng chứng đủ ba lệnh của bộ suite».
- Nhánh «Không cài» → «Lượt chấm chạy build và e2e đỏ ở cả nền lẫn nhánh» → «Lượt có thể dừng vì hạ tầng; bằng chứng
  thiếu build, e2e».
- Nhãn bằng chữ, không biểu tượng. Liên quan: AC-1, AC-2 (không đổi), bộ suite của lượt chấm.
