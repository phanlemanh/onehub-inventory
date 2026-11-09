---
type: decision
title: Cơ chế thao tác và phân quyền của MVP
links:
  [
    wiki/decisions/0014-mvp-product-rules.md,
    docs/plan/lo-trinh.json,
    src/modules/identity/,
    src/modules/company-config/,
  ]
sources:
  [
    "user, 2026-11-10",
    "onehub-quy-hang docs/plan/ra-soat-crud-phan-quyen.md",
    "onehub-quy-hang docs/adr/0018-cau-hinh-theo-san.md",
    "Nghị định 356/2025/NĐ-CP, Điều 5",
  ]
---

# 0016 Cơ chế thao tác và phân quyền của MVP

## Status

Accepted, 2026-11-10.

## Context

Chủ sàn cần quản trị được người và dữ liệu, và cần tuỳ biến trong giới hạn. Ở Quỹ hàng, mỗi mô-đun tự kiểm quyền theo cách riêng, nên ai đọc được một hàng thì sửa được giá, kể cả vai không làm với Bảng hàng, và phải vá lại bằng một bảng quyền chung. Inventory chưa có khai báo vai và thao tác, nên nếu không chốt, từng hàng lộ trình sẽ tự đặt quyền và lặp lại lỗi đó.

## Decision

Vai cố định, một bảng quyền duy nhất, sàn chỉ chọn trong khuôn đã khai.

- Mỗi quyết định quyền xét bốn yếu tố: vai, thao tác, phạm vi, trạng thái bản ghi. Phạm vi gồm Của tôi, Nhóm, Toàn sàn; MVP dùng Của tôi và Toàn sàn.
- Bảng quyền nằm trong mô hình nghiệp vụ. API, cơ sở dữ liệu và màn hình cùng đọc từ bảng. Mọi ô có bài kiểm; thao tác ghi không có dòng trong bảng thì kiểm tra đỏ.
- Người kiêm nhiều vai được cộng quyền. Quản trị sàn lo người và cấu hình, không tự có quyền xem hàng hay số chủ; chủ sàn muốn thấy hết thì nhận thêm vai Trưởng nhóm.
- Xoá tách theo nghĩa nghiệp vụ: Ngừng bán, Gỡ tạo nhầm, Gộp liên hệ, Bàn giao, Xoá dữ liệu cá nhân theo yêu cầu (xoá tên và số, giữ lịch sử).
- Điểm sàn được chọn đều khai trong sổ, có mặc định, khoảng cho phép, người đổi và nhật ký. Sàn chỉ thu hẹp, không vượt trần quyền của vai.

Không chọn:

- Màn cho sàn tự vẽ ma trận quyền, luật nếu-thì, đối tượng riêng: vượt giới hạn cấu hình theo sàn và không đo được.
- Vai riêng ở MVP: chỉ xét khi nhiều sàn cùng cần, và chỉ ghép từ danh sách quyền có sẵn.

## Consequences

- Hàng `9a` của lộ trình dựng bảng quyền. Các hàng sau chỉ thêm dòng vào bảng, không tự đặt quyền.
- Bảng quyền nháp lấy từ bảng thực tế của Quỹ hàng. Chủ kho còn có thể gạch từng ô ở Cổng Phạm vi của hàng `9a`.
- Điểm chọn của sàn được khai ở MVP nhưng chưa có màn chỉnh; màn chỉnh chờ điều kiện có sàn thứ hai.
- Các hàng `18a` (khoá người, bàn giao), `18b` (sửa liên hệ, gỡ tạo nhầm, xoá dữ liệu cá nhân) và `19a` (trang chỉ đọc «Vai nào làm được gì», nhật ký quản trị) phải xong trước khi chuyển dữ liệu thật của sàn.
- Nghị định 356/2025 Điều 5 cho thời hạn hoàn tất: sửa 10 ngày, xoá 20 ngày. Sửa và xoá theo yêu cầu vì vậy không thể để quá muộn.
- Needs confirmation: yêu cầu về mã hoá, phân quyền và nhật ký đối với dữ liệu trên đám mây chưa được kiểm chứng trên văn bản luật. Một bản tin nói phải mã hoá khi lưu, điều này có thể đụng việc lưu số điện thoại dạng rõ ở quyết định 0014. Cần rà soát pháp lý trước khi có dữ liệu thật.
