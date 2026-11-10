---
type: decision
title: Ba luật sản phẩm cho MVP
links: [PRODUCT-INVARIANTS.md, ontology/entities/Contact.yaml, ontology/entities/Agreement.yaml]
sources: ["user, 2026-11-09"]
---

# 0014 Ba luật sản phẩm cho MVP

## Status

Accepted, 2026-11-09.

## Context

Bản nháp luật sản phẩm có năm luật. Chủ kho chốt bỏ hai luật để MVP không phức tạp: SP-2 (thông tin chủ nhà không rời công ty, chặn bằng trần lớp dữ liệu) và SP-5 (mã hoá toàn bộ thông tin khách hàng).

## Decision

MVP giữ ba luật: SP-1 cách ly dữ liệu từng sàn, SP-3 người luôn bấm gửi, SP-4 phần nội bộ không ra trang khách. Mã SP-2 và SP-5 không dùng cho luật khác, để lịch sử đọc không lẫn. Trần lớp dữ liệu không được chuyển sang kho mới trong MVP. Số điện thoại của chủ nhà và liên hệ lưu dạng rõ ở MVP.

Không chọn:

- Giữ cả năm luật: chủ kho không muốn thêm độ phức tạp ở MVP.

## Consequences

- Ở MVP, thoả thuận chỉ dùng cho nguồn danh mục. Trước khi mở loại kết nối khác, phải xét lại việc chặn thông tin chủ nhà.
- Thông tin khách hàng không có luật mã hoá. Cách ly theo sàn vẫn giữ, nhưng không bảo vệ khi cơ sở dữ liệu hay bản sao lưu bị lộ.
- Việc rà soát pháp lý theo Luật 91/2025 và Nghị định 356/2025 vẫn còn mở.
- Lệnh chuyển dữ liệu một lần giải mã số từ Quỹ hàng bằng khoá của Quỹ hàng. Khoá và dữ liệu đã giải mã không được vào kho.
