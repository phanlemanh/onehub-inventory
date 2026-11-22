---
type: decision
title: Bước bien chạy trước bước vai-dang-nhap
links:
  [
    wiki/decisions/0047-mot-lenh-dat-khoa.md,
    docs/van-hanh/dua-ban-len.md,
    docs/van-hanh/xoay-khoa.md,
    tools/deploy/len-ban.mjs,
  ]
sources:
  [
    _acceptance/bien-do-sau-xoay-mat-khau/contract.md,
    _acceptance/bien-do-sau-xoay-mat-khau/decisions.jsonl,
  ]
---

# 0048 Bước bien chạy trước bước vai-dang-nhap

## Status

Accepted, 2026-11-22. Chủ kho duyệt Cổng Phạm vi của hồ sơ `bien-do-sau-xoay-mat-khau` (Hỏi-1: đổi thứ tự). Nối tiếp
[0047](0047-mot-lenh-dat-khoa.md), không thay nó.

## Context

0047 thêm hai bước vào `make deploy`:

- `vai-dang-nhap`: đặt mật khẩu vai đăng nhập vào cơ sở dữ liệu, ngay sau migration;
- `bien`: đẩy sáu biến, trong đó có `DATABASE_URL` mang mật khẩu ấy, sang dự án Vercel, trước khi dựng.

0047 cũng chấp nhận một khoảng hở khi xoay mật khẩu vai đăng nhập. Từ lúc mật khẩu mới vào cơ sở dữ liệu tới lúc tên miền
gắn sang bản mới, bản đang chạy còn giữ mật khẩu cũ nên không nối được.

Với thứ tự cũ, mọi lỗi của Vercel ở bước `bien` đều rơi vào khoảng hở đó: token hết hạn, 403, biến bị từ chối hay không
được xác nhận, danh sách lạ khuôn. Các lỗi ấy chẳng dính gì tới cơ sở dữ liệu, mà xoay mật khẩu vai đăng nhập lại hay đi
cùng lượt với xoay `VERCEL_TOKEN`. Lượt chấm của hồ sơ `bien-vercel-tu-choi` tìm ra điều này (Ngoài-1).

## Decision

Thứ tự bước của `make deploy`:

- Bản thử: `cau-hinh`, `migration`, `bien`, `vai-dang-nhap`, `cach-ly`, `dung`, `kiem-nhanh`, `gan-ten-mien`,
  `kiem-nhanh-ten-mien`.
- Bản thật: `cau-hinh`, `ban-thu-truoc`, `migration`, `bien`, `vai-dang-nhap`, `dung`, `kiem-nhanh`, `gan-ten-mien`,
  `kiem-nhanh-ten-mien`.

Không hàm bước nào đổi. `migration` vẫn đứng đầu, nên migration đỏ thì chưa ghi gì ở đâu. `cach-ly` vẫn sau
`vai-dang-nhap`, vì nó nối bằng vai đăng nhập.

## Consequences

- Lúc đang xoay mật khẩu vai đăng nhập, `bien` đỏ thì mật khẩu chưa đổi và bản đang chạy giữ kết nối. `vai-dang-nhap` đỏ
  cũng vậy: câu đặt mật khẩu là một câu lệnh, lỗi thì không đổi gì.
- Cái giá: khi `bien` đỏ sau khi đã ghi được một phần biến, hay `vai-dang-nhap` đỏ, Vercel giữ mật khẩu mới trong khi cơ
  sở dữ liệu còn mật khẩu cũ. Bản đang chạy không bị đụng, vì biến chỉ vào bản qua một lần dựng. Nhưng một lần bấm dựng lại
  ngay trên Vercel lúc ấy sẽ không nối được. Sổ tay ([dua-ban-len.md](../../docs/van-hanh/dua-ban-len.md)) dặn không làm.
  Thứ tự cũ thì hỏng ngay mà không cần ai bấm gì.
- Khoảng hở còn lại: từ lúc `vai-dang-nhap` đạt tới `gan-ten-mien`. Lúc đang xoay, `cach-ly`, `dung` hay `kiem-nhanh` đỏ
  vẫn để bản đang chạy mất kết nối tới lần đưa bản xanh kế. Sổ tay gọi đó là sự cố, phải chạy lại ngay.
- Để sau:
  - dời `vai-dang-nhap` xuống sau `dung` để thu hẹp cả khoảng hở (cần biết bản dựng có nối cơ sở dữ liệu không);
  - chặn bằng máy việc dựng lại từ phía Vercel lúc lệnh còn đỏ.
