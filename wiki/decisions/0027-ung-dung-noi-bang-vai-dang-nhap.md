---
type: decision
title: Ứng dụng nối cơ sở dữ liệu bằng vai đăng nhập không chủ
links:
  [
    db/migrations/008_vai_dang_nhap_ung_dung.sql,
    src/modules/identity/with-company.ts,
    db/tests/vai-dang-nhap.sql,
    db/tests/vai-dang-nhap-phien.sql,
    db/scripts/cach-ly.sh,
    tests/db/helpers.ts,
    _acceptance/ung-dung-noi-bang-vai-khong-chu/design.md,
  ]
sources:
  [
    "user, 2026-11-13",
    _acceptance/ung-dung-noi-bang-vai-khong-chu/decisions.jsonl,
    _acceptance/cach-ly-truoc-du-lieu-that/decisions.jsonl,
  ]
---

# 0027 Ứng dụng nối cơ sở dữ liệu bằng vai đăng nhập không chủ

## Status

Accepted, 2026-11-13, tại Cổng Phạm vi của hàng 7c. Chủ kho duyệt cả câu Hỏi-1 theo khuyến nghị: cửa từ chối vai nối về
được vai chủ ở mọi môi trường.

## Context

Ứng dụng từng nối bằng chính vai chủ bảng; cửa `withCompany` chỉ đổi sang vai API trong từng giao dịch. Mã chạy trong cửa
mà `reset role` hay `set role <chủ>` là về lại vai chủ và đọc ghi được mọi sàn. Hàng 7a chặn được câu viết thẳng trong mã
(bộ quét một cửa), không chặn được câu dựng động hay thư viện bên thứ ba — mục Ngoài-5 của hàng 7 mới «đóng một phần».

## Decision

- Ứng dụng nối bằng vai `quy_hang_login` (migration 008): đăng nhập được, không quyền đặc biệt, không sở hữu gì; là thành
  viên duy nhất của `quy_hang_app` với quyền đổi sang nhưng không kế thừa, không quản. Postgres xét đổi vai theo vai của
  phiên, nên từ vai này `set role <chủ>`, `set role quy_hang_identity`, `set session authorization` bị từ chối, và
  `reset role` trả về một vai không đọc được bảng nào.
- Cửa kiểm vai nối một lần mỗi pool, trước giao dịch đầu: vai về được vai chủ một bảng hay hàm, siêu người dùng, vượt
  được luật theo dòng (chính nó hay qua vai nó là thành viên), hoặc không đổi được sang vai API thì cửa từ chối, không câu
  nào chạy. Không tham số nào tắt bước kiểm. Áp ở mọi môi trường.
- Bộ kiểm cách ly có ca danh mục (vai sạch), ca phiên chạy trên kết nối đăng nhập thật bằng vai ấy, và bảy bản phá chạy
  trong giao dịch rút lại (vai thuộc cả cụm Postgres, commit một bản phá là rò sang lượt chạy song song).
- Mật khẩu không vào kho: migration không đặt; máy dãy dùng `local-only` (`make db-login`, bộ trợ giúp bài kiểm); bản thật
  do chủ kho đặt.

Không chọn:

- Ép 20 ca SQL cũ chạy hẳn dưới vai đăng nhập: phải viết lại cả bộ sang hai kết nối; `set role` từ phiên vai chủ không
  chứng gì vì phiên ấy là siêu người dùng.
- Chỉ áp bước kiểm ở bản thật: máy dev và bản thật đi hai đường, lỗi cấu hình chỉ lộ khi lên bản thật.
- Vai riêng cho từng sàn: luật theo dòng đã cách ly.

## Consequences

- Máy dev phải nối bằng `quy_hang_login` (`make db-up` in chuỗi nối, `make db-login` đặt mật khẩu); chuỗi nối vai chủ làm
  cửa từ chối, phiên đăng nhập đọc không được.
- Lời cấp vai `with inherit false, set true` cần Postgres 16 trở lên; bản thật dùng bản cũ hơn thì migration 008 lỗi
  ngay khi áp, không lặng lẽ cấp thiếu.
- Khi nối dữ liệu thật (hàng 10): đặt mật khẩu `quy_hang_login` và đổi `DATABASE_URL` trước lần triển khai đầu có cửa này.
  CI có Postgres (hàng 1s) đặt `PSQL_LOGIN`.
