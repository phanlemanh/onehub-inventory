---
type: decision
title: TypeScript và bộ khung ts-node
links: [setup-blueprint.yaml]
sources: [setup-blueprint.yaml]
---

# 0007 TypeScript và bộ khung ts-node

## Status

Accepted, 2026-11-09, chủ kho duyệt bản kế hoạch dựng kho.

## Context

Lớp `stack` của lần dựng kho onehub-inventory, bản chuẩn hoá của Quỹ hàng.

## Decision

Chọn: preset: ts-node.

Giữ TypeScript vì toàn bộ mã cũ là TypeScript. ts-node là bộ khung gần nhất có thể ghép archetype modular-monolith và lớp AI; không có bộ khung Next.js nên phần web làm tay.

Không chọn:

- ts-api (Fastify): Thêm một máy chủ thứ hai, trái ADR-0001 là API gắn trong app Next.js
- react-vite: Không giữ được bí mật phía máy chủ, trang khách cần dựng phía máy chủ cho ảnh xem trước trên Zalo

## Consequences

Tự động: partial. Các việc làm tay còn lại:

- Thêm Next.js 16, React 19, Tailwind 4, ReUI, Hono + zod-openapi, better-auth, pg khi chuyển mã; build đổi từ tsc sang next build. Chuyển kèm máy chủ MCP reui và shadcn dùng lúc phát triển, và REUI_LICENSE_KEY.
- Bộ khung dùng Vitest, kho cũ dùng node:test với 417 tệp: đổi dòng import bằng codemod khi chuyển từng mô-đun, giữ nguyên node:assert. Test chạm cơ sở dữ liệu chạy tuần tự trong một cấu hình Vitest riêng.

## Bổ sung 2026-11-11 — đăng nhập không dùng better-auth

Hàng 8 (`dang-nhap-ma-email`) tự viết phần đăng nhập và chỉ thêm gói `pg`; better-auth không còn là gói sẽ thêm. Lý do
và chi tiết: [0021](0021-dang-nhap-ma-email.md). Chữ ở trên giữ nguyên làm sử liệu.
