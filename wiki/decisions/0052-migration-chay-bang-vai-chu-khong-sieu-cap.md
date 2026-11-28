---
type: decision
title: Migration chạy được bằng vai chủ không phải siêu vai
links:
  [
    db/migrations/001_vai_chu_khong_sieu_cap.sql,
    db/migrations/004_thu_quyen_tao_cua_vai_danh_tinh.sql,
    tests/db/chu-khong-sieu-cap.db.test.ts,
    tools/deploy/len-ban.mjs,
  ]
sources: [docs/van-hanh/README.md]
---

# 0052 Migration chạy được bằng vai chủ không phải siêu vai

## Status

Accepted, 2026-11-28. Do lần đầu đưa bản thử lên thì dừng ở migration. Chủ kho giao máy tự sửa hết những gì không do lỗi
của chủ kho.

## Context

Lần đầu `make deploy ENV=staging` chạy được tới cơ sở dữ liệu thật, ngày 28/11/2026. Migration 001 áp xong, rồi 002 dừng
với lỗi `must be able to SET ROLE "quy_hang_identity"`. Giao dịch được huỷ, tên miền không đổi.

Trên Supabase (Postgres 17), vai `postgres` có CREATEROLE, CREATEDB và BYPASSRLS nhưng không có SUPERUSER. Từ Postgres 16,
ai không phải siêu vai muốn đổi chủ một hàm sang vai khác thì phải thoả hai điều:

1. Người chạy phải SET ROLE được sang vai mới. Người tạo vai chỉ được quyền ADMIN trên vai ấy, không được SET.
2. Vai mới phải có quyền CREATE trên schema chứa hàm.

002 và 003 chuyển mười hàm hẹp sang `quy_hang_identity`. Hai migration ấy đã commit, và luật kho không cho sửa
(móc `guard-edits.sh` chặn). Mọi bộ kiểm của kho, kể cả bộ dựng «như Supabase» của 014, đều chạy migration bằng siêu vai
của container, nên chưa bộ nào bắt được lỗi này.

## Decision

Thêm hai migration mới, không sửa migration cũ:

- `001_vai_chu_khong_sieu_cap.sql`: mang số 001 nên chạy sau `001_nen_cong_ty.sql` và trước 002, vì thứ tự áp là thứ tự
  tên. Tệp này tạo vai `quy_hang_identity` như 002 vẫn tạo (002 thấy vai đã có thì bỏ qua). Khi vai chủ không phải siêu
  vai, tệp cấp vai ấy cho vai chủ với SET và INHERIT. Tệp cũng cho vai danh tính tạm quyền CREATE trên `app` và, qua quyền
  mặc định, trên schema `identity` mà 002 sắp tạo.
- `004_thu_quyen_tao_cua_vai_danh_tinh.sql`: số 004 còn trống, đứng sau 003. Tệp thu lại cả hai quyền CREATE và quyền mặc
  định.

Bài kiểm `tests/db/chu-khong-sieu-cap.db.test.ts` chạy trên cụm riêng, với một vai chủ giống `postgres` của Supabase:

- đối chứng: thiếu hai tệp mới thì dừng ở 002 đúng lỗi trên;
- đủ tệp thì áp hết;
- chủ và quyền của mọi bảng, hàm, schema, cùng quyền mặc định, giống hệt lúc siêu vai chạy (chỉ khác tên vai chủ);
- `cach-ly-dich.sh` xanh.

## Consequences

- Máy dãy và CI (siêu vai) vẫn ra trạng thái cuối như cũ. Máy đã áp 002..014 từ trước sẽ áp hai tệp mới liền nhau ở cuối:
  cấp rồi thu, không còn dấu gì. Đã đo trên một cơ sở dữ liệu cũ.
- Trên Supabase, vai `postgres` là thành viên của `quy_hang_identity` (SET, INHERIT). Vai chủ vốn đã sở hữu mọi bảng và
  vượt luật theo dòng, nên không rộng thêm quyền đọc ghi nào. Migration sau này đổi được hàm của vai danh tính như ở máy
  dãy.
- Bản thử đã ghi `001_nen_cong_ty.sql` trong sổ. Lần đưa bản kế áp từ `001_vai_chu_khong_sieu_cap.sql` trở đi. Bản thật
  chưa áp gì.
- Để sau: một bước CI chạy cả chuỗi migration bằng vai chủ không siêu cấp ở mỗi PR. Bài kiểm này đã nằm trong bộ kiểm cơ
  sở dữ liệu nên CI đã chạy nó; còn lại là chọn có đổi ảnh Postgres 16 của CI sang 17 như Supabase hay không.
