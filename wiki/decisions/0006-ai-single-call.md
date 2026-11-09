---
type: decision
title: AI ở mức một lần gọi
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0006 AI ở mức một lần gọi

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `ai` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: ai_tier: call.

Kho cũ có gọi Claude ở đường nhập dữ liệu (đề xuất cách nhập, đọc ô lạ): mỗi đường một lần gọi, đầu ra theo khuôn JSON, mã thực thi kế hoạch (ADR-0011). Mức call khớp đúng cách làm này và thêm khung đánh giá tách khỏi make check.

Không chọn:

- Không có AI: Kho cũ đã có tính năng này, bỏ đi là mất tính năng
- ai_tier: workflow hoặc agent: Kho cũ không có nhiều bước do mô hình quyết định; thêm là mở rộng phạm vi của một đợt refactor

## Consequences

Tự động: partial. Các việc làm tay còn lại:

- Chuyển phần che số chủ nhà trước khi gửi cho mô hình và hai bộ kiểm rò rỉ của đường AI cùng lúc với lời gọi. Đoạn mã này xếp mức rủi ro cao.
