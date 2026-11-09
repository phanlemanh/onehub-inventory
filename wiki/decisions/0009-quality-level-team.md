---
type: decision
title: Mức kiểm tra team
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0009 Mức kiểm tra team

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `quality` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: level: team.

Kho sống lâu, nhiều phiên agent chạy song song (2.270 commit từ 02/11, 35 worktree). Kho cũ đã có quét bí mật và hook; mức starter sẽ là bước lùi.

Không chọn:

- starter: Không có pre-commit và quét bí mật trong khi kho cũ đã có

## Consequences

Tự động: partial. Các việc làm tay còn lại:

- Chuyển các rào riêng của sản phẩm: bộ kiểm rò rỉ và luật giao diện quy-hang-ui vào make check; bộ kiểm cách ly thành lệnh make check-db và job CI riêng có Postgres, vì make check chạy không có cơ sở dữ liệu.
- Chuyển hook chặn sửa migration đã commit, skill verify và new-migration, skill giao diện reui và quy-hang-ui. Người sửa các tệp workflow CI vì agent bị chặn ở đó.
