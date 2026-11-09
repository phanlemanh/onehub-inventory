---
type: decision
title: Quyền của agent
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0011 Quyền của agent

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `governance` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: capabilities: [].

Chỉ Claude Code tại máy, người duyệt. Không bật agent trên GitHub vì người dùng không yêu cầu, không bật MCP của sản phẩm vì không có agent nào cần thao tác vào sản phẩm. Đã xem lại sau khi lớp AI đổi: AI trong sản phẩm chỉ là lời gọi, không cần quyền mới.

Không chọn:

- github-agents: Không được yêu cầu
- mcp (của sản phẩm): Không có nhu cầu

## Consequences

Tự động: partial. Các việc làm tay còn lại:

- Cài Acceptance-Gate Kit bằng acceptance-init và ánh xạ T1/T2/T3 của kit vào governance/autonomy.yaml để chỉ có một thang rủi ro. Người sửa tệp này vì agent bị chặn ở governance/.
- Trong ánh xạ đó, xếp mức cao cho bộ kiểm rò rỉ, che dữ liệu, trần lớp dữ liệu, thoả thuận, migration; bản mẫu để test ở mức agent tự gộp được.
- Bảo vệ nhánh như kho cũ: chỉ bắt buộc check xanh, chưa bắt buộc code owner duyệt vì kho chỉ có một chủ và GitHub không cho tự duyệt. Việc ký duyệt nằm ở Acceptance-Gate Kit.
