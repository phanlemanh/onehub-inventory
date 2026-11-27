# Kế hoạch thi công — bring-out-claude-design

Mã sản phẩm của vòng đã có trên nhánh trước hồ sơ (commit `db827dba`, `50aecb28`, `58522b2a`, `0dc7fba3`). Kế hoạch là kế
hoạch đo: phép đo đã viết và chạy hai chiều trước Cổng Phạm vi, không còn mã nào phải viết.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Bản viết ra đúng bằng sổ, cổng giữ nó | `rang/exports.mjs` | AC-2 (bản xuất không cũ) — E2, E3 |
| Gói nói đúng màu hai giao diện, chữ, bo góc, linh kiện | `rang/bundle.mjs`, `rang/colour.mjs` | AC-3 (gói đúng nguồn) — E4, E5 |
| Thứ đã gửi đúng phép và đúng chỗ riêng tư | `rang/leave.mjs` | AC-4 (phép gửi) — E6, E7 |
| Câu đặt mặc định còn chờ chủ kho | `rang/default.mjs` | AC-5 (không quyết thay) — E8, E9 |
| Thứ ra ngoài kho không mang dữ liệu riêng tư | `rang/clean.mjs` | AC-6 (sạch) — E10, E11 |
| Nhánh không đổi gì ngoài phần thiết kế | `rang/change-list.mjs` | AC-7 (danh sách tệp) — E12, E13 |
| Cả kho xanh | `make check` | AC-1 — E1 |

- Task 1 — chạy `node _acceptance/bring-out-claude-design/rang/two-way.mjs`: 39 ca giữ (đã chạy trước cổng). `independent: false`.
- Task 2 — chấm từ bản chép kho bên ngoài theo Hỏi-1 (chủ kho duyệt 2026-11-27). `independent: false`.
