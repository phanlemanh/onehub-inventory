---
type: decision
title: Một lệnh đặt khoá, biến Vercel do lệnh đưa bản lên đặt
links:
  [
    wiki/decisions/0041-ban-that-o-dia-chi-rieng.md,
    docs/van-hanh/README.md,
    tools/deploy/dat-khoa.mjs,
    tools/deploy/len-ban.mjs,
  ]
sources: [_acceptance/dat-khoa-mot-lenh/contract.md, _acceptance/dat-khoa-mot-lenh/decisions.jsonl]
---

# 0047 Một lệnh đặt khoá, biến Vercel do lệnh đưa bản lên đặt

## Status

Accepted, 2026-11-22. Chủ kho duyệt Cổng Phạm vi của hồ sơ `dat-khoa-mot-lenh`, gồm Hỏi-2 (phạm vi quyền đứng). Nối tiếp
[0041](0041-ban-that-o-dia-chi-rieng.md), không thay nó.

## Context

Sổ tay của hàng 22 bắt chủ kho làm 14 việc ngoài kho trước lần đưa bản đầu:

- dựng tay hai chuỗi nối cơ sở dữ liệu;
- đặt tay sáu biến ở mỗi dự án Vercel;
- đặt mật khẩu vai đăng nhập giữa lần đưa bản đầu, nên lần ấy dừng ở mỗi môi trường.

Ngày 2026-11-22 chủ kho hỏi cách cấu hình để máy làm hết và chủ kho ít xuất hiện nhất. Máy không được cầm giá trị khoá,
nên việc của chủ kho chỉ thu về được tới mức: tạo khoá ở trang dịch vụ, rồi dán vào một lệnh.

## Decision

- Khoá chỉ nằm ở hai môi trường GitHub. `make dat-khoa` đặt chúng:
  - chủ kho dán mỗi khoá do dịch vụ cấp một lần;
  - lệnh tự sinh `AUTH_SECRET` và `LOGIN_DB_PASSWORD`; chỉ `XOAY=1` mới sinh lại.
- Lệnh đưa bản lên có hai bước mới:
  - `vai-dang-nhap` đặt mật khẩu vai `quy_hang_login` dưới dạng băm SCRAM, ngay sau migration;
  - `bien` đẩy sáu biến sang dự án Vercel trước khi dựng: `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY`, `MAIL_FROM`,
    `APP_URL`, `APP_ENV`.
- `LOGIN_DATABASE_URL` thôi là khoá: lệnh dựng nó từ `MIGRATE_DATABASE_URL` và `LOGIN_DB_PASSWORD`, giữ máy chủ và cổng.
- `AGENTS.md` có mục «Infrastructure standing permission». Máy làm cài đặt và biến không bí mật của hạ tầng Inventory mà
  không hỏi. Máy không bao giờ cầm khoá, duyệt bản thật hay đổi người duyệt bản thật.

## Consequences

- Phần của chủ kho trước lần đưa bản đầu:
  - tạo năm khoá ở dịch vụ;
  - chạy `make dat-khoa`;
  - dán `deploy.yml`;
  - tạo Quản trị sàn đầu;
  - duyệt bản thật.
- Biến trên Vercel bị ghi đè ở mỗi lần đưa bản; sửa tay trên Vercel mất ở lần sau.
- Hai khoá tự sinh không ai xem lại được. Việc tay trên máy chủ kho cần mật khẩu vai đăng nhập. Muốn làm việc ấy, chủ kho
  tự giữ một mật khẩu và đặt nó bằng `gh secret set` (sổ tay, mục «Mật khẩu vai đăng nhập ở máy chủ kho»).
- Xoay mật khẩu vai đăng nhập có một khoảng hở, từ bước `vai-dang-nhap` tới bước gắn tên miền. Trong khoảng ấy, bản đang
  chạy không nối được cơ sở dữ liệu ([xoay-khoa.md](../../docs/van-hanh/xoay-khoa.md), bước 3).
- Lịch tự thử khôi phục mỗi quý trên CI vẫn chưa có: để một hàng sau.
