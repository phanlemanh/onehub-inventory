---
type: decision
title: Kit nghiệm thu lấy từ kho delivery-loop, thẻ v3.0.0, một bản cho cả máy lẫn CI
links:
  [
    .github/workflows/ci.yml,
    .claude/settings.json,
    tools/kit-root.mjs,
    tests/kit-root.test.ts,
    docs/tri-thuc/TRI-THUC.md,
  ]
sources:
  [_acceptance/nang-kit-3-0/contract.md, docs/superpowers/specs/2026-11-18-nang-kit-3-0-design.md]
---

# 0045 Kit nghiệm thu lấy từ kho delivery-loop, thẻ v3.0.0, một bản cho cả máy lẫn CI

## Status

Accepted, 2026-11-18. Chủ kho duyệt Cổng Phạm vi của hồ sơ `nang-kit-3-0` cùng ba khuyến nghị (Hỏi-1, Hỏi-2, Hỏi-3).

## Context

Kit nghiệm thu dời sang kho công khai `phanlemanh/delivery-loop`. Kho kit cũ đóng băng ở 2.39.0. Thẻ `v3.0.0` (commit
`c16d25db`) đổi tên chợ, ba tên plugin và mười hai tên lệnh, không có bí danh tên cũ, và đặt lõi ở
`plugins/acceptance-gate`. Kho này chạy kit 2.38.1 ở bốn chỗ: việc `gate` của CI, chợ và plugin của phiên Claude Code,
công cụ `kit-root` mà các lệnh kiểm dùng khi `CLAUDE_PLUGIN_ROOT` vắng, và trang gốc tri thức.

Kiểu thất bại phải tránh: máy chạy một bản kit, CI chạy bản khác, không ai thấy.

## Decision

- CI kéo kit theo thẻ `v3.0.0` từ `delivery-loop`, `CLAUDE_PLUGIN_ROOT=<kit>/plugins/acceptance-gate`.
- Phiên bật sáu plugin `…@delivery-loop`; chợ ghim `ref: v3.0.0`, cùng thẻ với `KIT_TAG`. Nâng kit là đổi hai chỗ này
  cùng một commit.
- `kit-root` chỉ đọc bản cài `acceptance-gate@delivery-loop`. Máy chỉ có bản cài kho cũ thì nó in rỗng và lệnh kiểm báo
  lỗi, thay vì lặng lẽ chạy lõi cũ.
- Tiền tố tin commit `tri-thuc: ` của `tools/commit_msg.py` giữ nguyên: kit 3.0 vẫn tự commit trang tri thức bằng nó.

## Consequences

- Máy chưa cài chợ `delivery-loop` không có plugin kit và bốn lệnh kiểm dùng `kit-root` gãy, cho tới khi chủ kho cài
  chợ mới. Chủ kho cài trước khi gộp thay đổi này.
- Chợ đã đăng ký có thể không nhận `ref` mới khi nâng kit; khi đó gỡ rồi thêm lại chợ (gỡ chợ là gỡ plugin của nó).
- Trên hồ sơ cũ của kho, kit 2.38.1 và 3.0.0 cho cùng kết quả (57 hồ sơ OK ở `8925e8ff`).
