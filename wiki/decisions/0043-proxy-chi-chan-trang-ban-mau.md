---
type: decision
title: Proxy chỉ chặn trang bản mẫu trên bản dựng thật
links:
  [
    wiki/decisions/0041-ban-that-o-dia-chi-rieng.md,
    src/proxy.ts,
    src/proxy.test.ts,
    tools/deploy/thu-ban-dung.sh,
  ]
sources: [_acceptance/moi-truong-thu-va-ban-that/contract.md]
---

# 0043 Proxy chỉ chặn trang bản mẫu trên bản dựng thật

## Status

Accepted, 2026-11-16. Giám sát đợt duyệt yêu cầu chạm tệp K-28 của hàng 22 «Môi trường thử và bản thật», kèm ba điều
kiện: chỉ khớp `/proto`, đọc hướng dẫn proxy của Next 16 trước khi viết, ghi trang này.

## Context

Trang bản mẫu `/proto/*` chỉ dành cho máy dev. Mỗi trang tự gọi `notFound()` khi `NODE_ENV=production`. Phép thử bản
dựng thật của hàng 22 (`tools/deploy/thu-ban-dung.sh`, AC-6) cho thấy bản dựng vẫn trả mã 200: nhóm trang `(app)` có
`loading.tsx`, nên trang bắt đầu gửi đi trước khi `notFound()` chạy. Thân trang là màn «không có», nhưng mã là 200 (404
mềm). Bước kiểm nhanh của `make deploy` đòi mã 404 thật, nên mọi lần đưa bản lên sẽ đỏ.

## Decision

- Thêm `src/proxy.ts`, tệp proxy đầu tiên của kho. Proxy chạy trước mọi trang.
- Matcher chỉ có `/proto` và `/proto/:path*`. Không đường nào khác đi qua proxy; `src/proxy.test.ts` kiểm cả hai chiều
  (khớp `/proto`, không khớp `/inventory`, `/api/v1/health`, `/login`, `/prototype`, `/x/proto`).
- Trên bản dựng thật proxy trả 404 rỗng; trên máy dev nó cho trang chạy như cũ, nên bản mẫu vẫn mở được.
- Trang bản mẫu giữ `notFound()` của mình như lớp thứ hai.

## Consequences

- Muốn thêm một đường vào proxy là một quyết định mới: proxy chạy trước mọi màn, một matcher rộng có thể chặn tệp tĩnh
  hay đổi hướng nhầm.
- Next 16 đổi tên `middleware` thành `proxy`; bản Next đang cài còn gọi hàm kiểm matcher là
  `unstable_doesMiddlewareMatch`. Khi nâng Next, bài kiểm có thể phải đổi tên hàm này.
