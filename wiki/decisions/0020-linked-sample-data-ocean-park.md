---
type: decision
title: Dữ liệu mẫu theo Vinhomes Ocean Park, căn và liên hệ nối từ đầu
links: [wiki/entities/contact.md, ontology/relations.yaml, docs/plan/lo-trinh.json]
sources: ["user, 2026-11-10", "onehub-quy-hang packages/db/seed/README.md"]
---

# 0020 Dữ liệu mẫu theo Vinhomes Ocean Park, căn và liên hệ nối từ đầu

## Status

Accepted, 2026-11-10.

## Context

Bảng hàng và Liên hệ dùng chung dữ liệu từ đầu: chủ nhà của một căn là một liên hệ. Ở Quỹ hàng, hai màn được dựng rời nhau và lệch nhau. Dữ liệu mẫu ở đó dùng một dự án giả, nên không thử được cách viết mã căn và tên toà thật.

## Decision

- Sàn mẫu dựng trên Vinhomes Ocean Park 1, 2 (The Empire) và 3 (The Crown), dùng tên dự án và tên toà công khai.
- Căn, giá và người đều là giả, mang nhãn MAU. Người dùng `[Tên]` và `0900 000 0xx`. Trang khách của bản mẫu cũng hiện nhãn mẫu.
- Căn và liên hệ nối sẵn trong dữ liệu mẫu: một chủ nhiều căn, một căn nhiều chủ, một người vừa là chủ vừa là khách, căn chưa có chủ.
- Số chủ nhà ghi vào liên hệ, không ghi vào căn.
- Hồ sơ cạnh bảng nhận cả căn lẫn người. Màn Liên hệ dù làm sau vẫn được khai trước vào họ Lưới.

## Consequences

- MVP vẫn chỉ làm căn hộ. Ocean Park 2 và 3 phần lớn là thấp tầng, nên mẫu chỉ lấy các toà căn hộ; thấp tầng chờ điều kiện mở của mục H6.
- Mỗi dự án có một dòng cách đọc mã căn, nên hàng gõ mã căn được thử trên cách viết thật.
- Danh sách toà phải đối chiếu nguồn công khai ở Cổng Phạm vi của hàng `1`. Khi viết quyết định này mới kiểm được các toà S1.xx của Ocean Park 1.
- Needs confirmation: chủ nhà gắn với lần rao như mô hình hiện tại, hay gắn với căn trong phạm vi sàn. Danh mục căn dùng chung nên không giữ được liên hệ của từng sàn. Chốt ở Cổng Phạm vi của hàng `1`.
