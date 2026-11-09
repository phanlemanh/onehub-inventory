---
type: decision
title: Phạm vi chọn lọc và nền thiết kế
links: [setup-blueprint.yaml, design/decisions.yaml]
sources: [docs/design-standard-proposal.md]
---

# 0013 Phạm vi chọn lọc và nền thiết kế

## Status

Accepted cho chặng 0, 2026-11-09; đề xuất tổng thể còn chờ chủ kho duyệt. Thay phần «chuyển toàn bộ» trong 0008 và 0010.

## Context

Chủ kho chốt: kho này thay Quỹ hàng để ra MVP, chỉ mang phần đã hiệu quả, tính năng lõi đơn giản hơn, kiến trúc chuẩn cho về sau; mọi quyết định đưa về tất định và đo được.

## Decision

Chín mô-đun cho MVP. Lược đồ dữ liệu mới. Chuẩn trước, công thức sau, danh sách đóng, rồi mới tới phán đoán; mỗi quyết định một dòng ở `design/decisions.yaml`. Token theo Tailwind và shadcn, nhận diện chỉ gồm sổ ngoại lệ ở `src/styles/onehub.css`. Mô-đun có thêm cửa `ui`.

Không chọn:

- Chuyển toàn bộ rồi đổi kho: giữ lại đúng cái cần bỏ, và chưa có số dùng thật để biết phần nào đáng giữ.
- Bật `exactOptionalPropertyTypes`: mã shadcn cài sẵn không đạt, và không được sửa tay mã nhà cung cấp.

## Consequences

- Mười luật lint chuyển từ Quỹ hàng, ba luật gắn với bố cục cũ chờ có template; chú thích trong các tệp luật còn là tiếng Việt.
- `make check` in tỉ lệ tất định.
- Bản đồ khuôn `design/patterns/` sẽ có khi có màn đầu tiên.
