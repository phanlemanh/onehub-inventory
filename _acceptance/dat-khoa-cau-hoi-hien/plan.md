# Kế hoạch — dat-khoa-cau-hoi-hien

Vòng không viết mã sản phẩm: sửa và bài kiểm đã ở PR #134 (đầu nhánh `5d2d1e32`). Tệp đo của hồ sơ (`rang/`) viết xong
và đã chạy xanh trước Cổng Phạm vi. Kế hoạch chỉ còn bước chấm.

| Người dùng thấy gì khác | Đụng đâu | Phục vụ tiêu chí |
|---|---|---|
| Không có thay đổi nào cần làm; mã đã nằm trên nhánh | `tools/deploy/` (chỉ đọc) | AC-1–AC-7 |
| Chấm độc lập mọi phép đo trên đúng commit của PR, trên terminal thật | `_acceptance/dat-khoa-cau-hoi-hien/rang/` | E1–E7t |

Task 1 — chấm (S4). Files: không. Verify: lượt chấm độc lập. Phục vụ E1–E7t. independent: false.

Lượt chấm chạy trên bản chép `/Users/manhphan/dev/onehub-inventory-cham-134` khi tới lượt của dãy do giám sát đợt `nen`
cấp; phiên xin khoá `duong-nen` rồi `s4` theo luật đợt, không đi vòng móc `chan-s4`.

Duyệt kế hoạch (Gate 1.5): máy khuyên gộp vào Cổng Phạm vi — chủ kho trả lời ở Hỏi-1 của thẻ Cổng Phạm vi. Trả «tách»
thì máy dừng thêm một lượt chờ duyệt kế hoạch trước khi chấm.
