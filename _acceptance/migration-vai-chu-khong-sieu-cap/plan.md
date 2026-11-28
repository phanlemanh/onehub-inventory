# Kế hoạch — migration-vai-chu-khong-sieu-cap

Vòng không viết mã sản phẩm: hai migration và bài kiểm đã ở PR #135 (commit `73231e21`). Tệp đo của hồ sơ (`rang/`) viết
xong trước Cổng Phạm vi. Kế hoạch chỉ còn bước chấm.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Không có thay đổi nào cần làm; mã đã nằm trên nhánh | `db/migrations/`, `tests/db/` (chỉ đọc) | AC-1–AC-8 |
| Chấm độc lập mọi phép đo trên đúng commit của PR, trên Postgres 17 và 16 | `_acceptance/migration-vai-chu-khong-sieu-cap/rang/` | E1–E8e |

Task 1 — chấm (S4). Files: không. Verify: lượt chấm độc lập. Phục vụ E1–E8e. independent: false.

Lượt chấm chạy trên bản chép `/Users/manhphan/dev/onehub-inventory-cham-135` khi tới lượt dãy C của đợt `nen`: giám sát
đợt cho hàng này nhận dãy C và xếp lượt ngay sau dãy H; phiên xin khoá `s4` theo luật đợt, không đi vòng móc `chan-s4`.

Duyệt kế hoạch (Gate 1.5): máy khuyên gộp vào Cổng Phạm vi — chủ kho trả lời ở Hỏi-1 của thẻ Cổng Phạm vi (sổ quyết
định, dòng 7). Trả «tách» thì máy dừng thêm một lượt chờ duyệt kế hoạch trước khi chấm.
