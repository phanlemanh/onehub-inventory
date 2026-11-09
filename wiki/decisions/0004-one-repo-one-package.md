---
type: decision
title: Một kho một gói
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0004 Một kho một gói

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `repo` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: license: Proprietary.

Một kho, một gói, một lần triển khai. Kho cũ tách gói theo tầng (core, api, connect) chứ không phải theo nhịp phát hành: cả ba chạy trong cùng một app Next.js và không kho nào khác dùng packages/connect. Kho riêng tư nên giấy phép Proprietary. Nhánh ngắn, squash merge, Conventional Commits như kho cũ.

Không chọn:

- Giữ npm workspaces như kho cũ: Bộ khung chỉ sinh một gói, phần còn lại làm tay; giữ gói theo tầng là giữ nguyên cái cần refactor
- Nhiều kho: Các phần luôn đổi cùng nhau

## Consequences

Tự động: automated. Các việc làm tay còn lại:

- Không có bước làm tay.
