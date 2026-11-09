---
type: decision
title: Triển khai và chuyển kho
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0010 Triển khai và chuyển kho

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `delivery` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: không có phần tự động.

Đích là Vercel và Supabase vùng Singapore như kho cũ. Bộ khung chỉ có container cho ts-api và fastapi, nên phần này chỉ ghi lại, không được dựng. Chưa có bí mật của bản thật trong kho mới nên pipeline sinh ra không chạm được bản thật. Đã xem lại sau khi lớp AI đổi: thêm ANTHROPIC_API_KEY vào danh sách bí mật lúc chuyển.

Không chọn:

- container: Không áp được cho ts-node, và kho cũ không chạy container

## Consequences

Tự động: manual. Các việc làm tay còn lại:

- Trước lúc chuyển: dựng dự án Vercel mới và một Supabase thử riêng, không dùng chung cơ sở dữ liệu của bản thật. Kho cũ tiếp tục là bản chạy thật.
- Thay deploy.yml và release.yml do bộ khung sinh bằng trình tự của kho cũ: áp migration, kiểm nhanh chỉ đọc, gọi hook Vercel.
- Trong lúc chuyển từng mô-đun: đóng băng phần tương ứng ở kho cũ để hai bên không lệch nhau.
- Lúc chuyển: dừng ghi ở kho cũ, kho mới nhận quyền ghi migration, dùng chung OWNER_PHONE_KEY, BETTER_AUTH_SECRET, JOB_SECRET, ANTHROPIC_API_KEY, đổi đích của lịch pg_cron lead-tick, rồi đổi tên miền quyhang.onehub.center.
- Đường lùi: giữ dự án Vercel cũ sống và không đổi lược đồ trong giai đoạn quan sát sau khi chuyển, để trỏ tên miền lại được ngay.
