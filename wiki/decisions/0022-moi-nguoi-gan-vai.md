---
type: decision
title: Mời người vào sàn và gán vai
links:
  [
    _acceptance/moi-nguoi-gan-vai/contract.md,
    db/migrations/003_moi_nguoi_gan_vai.sql,
    src/modules/identity/members.ts,
    src/components/candidate/form-dialog.tsx,
  ]
sources: [_acceptance/moi-nguoi-gan-vai/decisions.jsonl]
---

# 0022 Mời người vào sàn và gán vai

## Status

Accepted, 2026-11-11, chủ kho duyệt Cổng Phạm vi và kế hoạch của hàng 9 (`moi-nguoi-gan-vai`), nhận cả năm khuyến nghị
Hỏi-1 đến Hỏi-5.

## Context

Hàng 9 của lộ trình (mã N3): Quản trị sàn mời người vào sàn và gán vai. Hàng 8 đã có bảng thành viên chỉ đọc và vai
riêng `quy_hang_identity` cho các hàm danh tính (quyết định 0021); hàng 1d đã khai bốn vai, một người giữ nhiều vai.

## Decision

- Thành viên (`Member`, RESO 2.1) có tập vai lấy trong bốn vai, tên theo sàn, người mời và lúc mời — migration 003 viết
  trong kho này (bổ sung của quyết định 0008).
- Mọi lần ghi và lần đọc danh sách kèm email đi qua bốn hàm hẹp thuộc vai danh tính, tự kiểm người gọi là Quản trị sàn
  của sàn trong phiên và chỉ chạm sàn ấy (Hỏi-4: mở rộng ngoại lệ danh tính của SP-1). Vai API vẫn chỉ đọc bảng.
- Mỗi sàn luôn còn ít nhất một Quản trị sàn; hai lần đổi vai cùng sàn xếp hàng qua một khoá theo sàn.
- Bấm «Mời» thì máy gửi đúng một thư mời qua Resend, trong cùng giao dịch: thư hỏng thì không ai được thêm (Hỏi-1,
  SP-3: người bấm gửi). Không gửi lại, không nhắc.
- Tên theo sàn và trả lời đồng nhất cho email đã có ở sàn khác (Hỏi-5).
- Khuôn dùng chung mới: hộp thoại có biểu mẫu (`FormDialog`) và trạng thái trang «Không đủ quyền» (giám sát duyệt N-6).

## Consequences

- Hàng 9a chuyển luật «chỉ Quản trị sàn quản trị người» vào bảng quyền chung.
- Gỡ người, khoá người, huỷ hay gửi lại lời mời chưa có: hàng 18a và việc tách «người hết sàn kẹt».
- Lối vận hành mở sàn và quản trị đầu tiên phải điền vai và tên khi thêm dòng thành viên.
- Bài kiểm cơ sở dữ liệu và bài trình duyệt có cơ sở dữ liệu chạy trên Postgres của dãy, chưa chạy trên CI (như 0021).
