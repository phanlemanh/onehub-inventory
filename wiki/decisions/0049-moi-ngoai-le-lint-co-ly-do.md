---
type: decision
title: Mọi ngoại lệ lint trong mã màn phải ghi lý do
links:
  [
    tools/eslint-ui/rules/require-disable-reason.mjs,
    tools/eslint-ui/index.mjs,
    eslint.config.js,
    design/decisions.yaml,
  ]
sources:
  [
    _acceptance/sua-ba-luat-lint-giao-dien/contract.md,
    _acceptance/sua-ba-luat-lint-giao-dien/decisions.jsonl,
  ]
---

# 0049 Mọi ngoại lệ lint trong mã màn phải ghi lý do

## Status

Accepted, 2026-11-26. Chủ kho trả lời ở Cổng Phạm vi của hồ sơ `sua-ba-luat-lint-giao-dien` (PR #123): Hỏi-1 = có
(dòng sổ `d-20261126T061152Z-5`, câu trả lời `d-20261126T062806Z-14`), Hỏi-2 = giữ bộ hậu xử lý trong kho (dòng sổ
`d-20261126T061152Z-6`, câu trả lời `d-20261126T062806Z-15`).

## Context

Dòng `lint-exceptions` của `design/decisions.yaml` ghi «reason required» và trỏ luật `onehub-ui/require-disable-reason`.
Ngày 26/11 công cụ thiết kế (design-assembly 0.69.0) chạy lại mẫu thử của nó qua lint của kho và thấy luật để lọt hai
loại ngoại lệ:

- ngoại lệ không lý do cho luật ngoài `onehub-ui` (luật của shadcn, `react-hooks`, `no-restricted-imports`): luật cũ chỉ
  xét luật `onehub-ui/*`;
- ngoại lệ tự tắt lint trên chính dòng của nó (`/* eslint-disable */`, `// eslint-disable-line`): ESLint nuốt báo cáo
  của luật trên dòng ấy. Một chú thích trong bài kiểm nói có công cụ riêng bắt ca này sau ESLint; công cụ ấy chưa từng có
  trong kho.

Vì vậy công cụ chỉ tính quyết định là «khai», không phải «giữ».

## Decision

- Trong mã màn (`src/app/**`, `src/components/**`, `src/modules/*/ui/**`, trừ thư mục của nhà cung cấp), mọi ngoại lệ
  `eslint-disable`, `eslint-disable-line`, `eslint-disable-next-line`, cho bất kỳ luật nào, phải có ` -- <lý do>`.
- Ca tự tắt chính dòng được bắt ngay trong ESLint, bằng bộ hậu xử lý `onehub-ui/reasons` của plugin kho. ESLint vẫn đưa
  báo cáo bị tắt sang bước hậu xử lý kèm nhãn `suppressions`; bộ này gỡ nhãn ấy riêng cho báo cáo của luật lý do. Báo
  cáo của luật khác giữ nguyên nhãn, văn bản đi qua nguyên vẹn, sửa tự động vẫn chạy.
- Không thêm gói ngoài (`@eslint-community/eslint-plugin-eslint-comments`) và không thêm công cụ chạy riêng sau ESLint:
  công cụ thiết kế chỉ tính luật mà dòng sổ nêu tên.

## Consequences

- Người viết màn: mọi chỗ tắt lint phải nói vì sao, kể cả `react-hooks/exhaustive-deps`. Hai ngoại lệ cũ ở
  `src/components/candidate/data-region.tsx` đã được ghi lý do.
- Quyết định `lint-exceptions` (cùng `spacing` và `whole-class-names`) chuyển sang «giữ»: `make check` chạy lại mẫu thử
  của công cụ mỗi lần.
- Một bản ESLint sau đổi cách gắn nhãn `suppressions` thì ca tự tắt chính dòng lọt lại; phép đo E4 và E8 của hồ sơ sẽ
  đỏ.
- Đảo lại: giới hạn luật về `onehub-ui/*` bằng một dòng trong `require-disable-reason.mjs`; dòng `lint-exceptions` khi
  ấy về lại «khai».
