---
type: decision
title: Đăng nhập bằng mã email, tự viết trong kho này
links:
  [
    _acceptance/dang-nhap-ma-email/contract.md,
    db/migrations/002_dang_nhap_ma_email.sql,
    src/modules/identity/,
  ]
sources: [_acceptance/dang-nhap-ma-email/decisions.jsonl]
---

# 0021 Đăng nhập bằng mã email, tự viết trong kho này

## Status

Accepted, 2026-11-11, chủ kho duyệt Cổng Phạm vi và kế hoạch của hàng 8 (`dang-nhap-ma-email`), nhận cả năm khuyến
nghị Hỏi-1 đến Hỏi-5.

## Context

Hàng 8 của lộ trình (mã N2, N6): nhân viên sàn nhập mã gửi qua email và vào đúng sàn của mình. Hàng 7 đã dựng cách ly
mỗi sàn: mọi bảng của công ty có luật theo dòng dạng lọc theo sàn của phiên, một cửa truy vấn `withCompany`, bộ kiểm
cách ly và bài quét một cửa. Quyết định 0007 ghi better-auth là gói sẽ thêm; 0008 ghi kho mới chỉ chép migration của
Quỹ hàng. Bản đăng nhập của Quỹ hàng chép nguyên văn cho người đọc dòng thành viên của mình ở mọi sàn và cần một kết nối
chủ thứ hai ngoài cửa — hai điều bộ kiểm của hàng 7 báo đỏ.

## Decision

- Tự viết gọn trong mô-đun `identity`: mã 6 số sinh bằng `node:crypto`, băm HMAC-SHA256 với khoá `AUTH_SECRET`; mã
  phiên 32 byte ngẫu nhiên, chỉ lưu SHA-256. Chỉ thêm gói `pg` (và kiểu `@types/pg`), nạp ở tệp cửa `with-company.ts`.
- Migration `002_dang_nhap_ma_email.sql` viết mới trong kho này: schema `identity` chỉ chủ đọc; bảng `company_members`
  lọc đúng theo sàn; sáu hàm hẹp ở schema `app` thuộc vai riêng `quy_hang_identity` (không đăng nhập được, được vượt
  luật theo dòng, chỉ đọc `companies`, `company_members`) — phần ngoại lệ danh tính của SP-1. Vai API chỉ gọi hàm,
  bên trong cửa.
- Số của Quỹ hàng giữ nguyên: mã hết hạn 5 phút, sai 3 lần thì hỏng, 5 lần xin trong 15 phút theo email (email lạ
  cũng đếm), phiên 30 ngày trượt theo ngày dùng. Hằng ở `src/modules/identity/constants.ts`.
- Không tự đăng ký: chỉ email có tài khoản thuộc ít nhất một sàn nhận mã; mọi email nhận cùng một câu trả lời.
- Gửi thư qua API HTTP của Resend bằng `fetch`. Bản thật thiếu `DATABASE_URL`, `AUTH_SECRET`, `RESEND_API_KEY` hay
  `MAIL_FROM` thì không khởi động (`src/instrumentation.ts`); máy dev in mã ra nhật ký máy chủ.
- Đường ghi dưới `/api/v1/auth`. Màn `/login` ba bước (email, mã, chọn sàn) và menu tài khoản trên khung.
- Chưa bắt đăng nhập ở các màn dữ liệu mẫu: hàng nối dữ liệu thật (N5) làm cùng lúc CI có Postgres.

## Consequences

- Chuyển dữ liệu từ Quỹ hàng (R1) phải ánh xạ bảng tài khoản của better-auth sang `identity.users`; phiên và mã không
  cần chuyển.
- Bài kiểm cơ sở dữ liệu (`tests/db/`) và bài trình duyệt có cơ sở dữ liệu (`tests/e2e-db/`) chạy trên Postgres của
  dãy, chưa chạy trên CI: cần job có Postgres ở `.github/workflows/`, việc của chủ kho.
- Bộ kiểm cách ly của hàng 7 chưa soi hàm đặc quyền; vai `quy_hang_identity` và sáu hàm có bài kiểm riêng ở
  `tests/db/dang-nhap.db.test.ts` (ca `vai-ham-danh-tinh-hep`, `ham-hep-khong-lo` và bốn bản phá).
- Hàng 9 thêm vai, lời mời và quyền ghi `company_members` cho vai API bằng migration mới.
