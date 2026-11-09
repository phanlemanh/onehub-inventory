---
type: decision
title: Bối cảnh của kho
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0003 Bối cảnh của kho

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `context` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: project_name: onehub-inventory, description: SaaS quản lý hàng cho sàn môi giới bất động sản — bản chuẩn hoá của Quỹ hàng (onehub-quy-hang), owner: phanlemanh.

Người dùng muốn dựng kho mới từ đầu như một đợt refactor của onehub-quy-hang. Tên lấy từ thư mục, chủ lấy từ remote của kho cũ. Sản phẩm giữ nguyên, người dùng không đổi: bốn bất biến của kho cũ (cách ly giữa công ty, thông tin chủ nhà không rời công ty, người luôn bấm gửi, phần nội bộ không ra trang khách) là ràng buộc của kho mới.

Không chọn:

- Chỉ tên và một câu: Kho cũ đang chạy thật trên quyhang.onehub.center và có bốn bất biến; bỏ qua thì các lớp sau đề xuất sai

## Consequences

Tự động: automated. Các việc làm tay còn lại:

- Không có bước làm tay.
