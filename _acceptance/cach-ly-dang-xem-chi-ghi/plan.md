# Kế hoạch: cach-ly-dang-xem-chi-ghi (hàng 7b)

> Thực thi tuần tự trong phiên chính. Chưa viết mã trước khi PR #36 (hàng 9a) vào nhánh chính.

**Mục tiêu:** bộ kiểm cách ly đỏ khi có dạng xem chạy bằng quyền người tạo mà vai của ứng dụng thêm, sửa hay xoá được;
cặp phá thử cũ của hàng 9 đo lớp cơ sở dữ liệu và cả bộ kiểm cơ sở dữ liệu xanh trong một lệnh.

**Kiến trúc:** thêm một ca SQL vào `db/tests/cach-ly.sql` theo khuôn danh sách cho phép của hàng 7a; ba tệp phá mới;
bộ chạy đăng ký ca; bài kiểm cơ sở dữ liệu chứng kẽ hở thật và giữ nguyên dòng ghim cũ.

**Lệnh kiểm mỗi việc:** `DB_LANE=c DB_PORT=5569 bash -c 'bash db/scripts/cach-ly.sh && npx vitest run -c vitest.db.config.ts tests/db/cach-ly.db.test.ts'`
(lệnh `cach_ly_c` của tệp cấu hình), trên Postgres dãy C.

| # | Việc | Tệp | Phục vụ | Độc lập |
|---|---|---|---|---|
| 0 | Gộp nhánh chính (đã có 9a) về một lần; `make setup`; chạy lệnh kiểm trên cây gộp — phải xanh 29 ca trước khi đổi gì | — | nền | không |
| 1 | Bài «bộ chạy giữ nguyên ca và dòng ghim cũ»: đọc bộ chạy ở d85d815 bằng git show (29 ca, 18 dòng ghim), so với bộ chạy hiện tại + bản phá sửa một chữ (đỏ đúng dòng) — TRƯỚC khi sửa bộ chạy | `tests/db/cach-ly.db.test.ts` | E5 | không |
| 2 | Viết ba tệp phá trước ca mới; chạy bộ kiểm HIỆN TẠI trên từng tệp — phải XANH (chứng ca 18 bỏ sót, ghi kết quả vào sổ) | `db/tests/pha-thu/dang-xem-chi-xoa.sql`, `dang-xem-chi-sua-cot.sql`, `dang-xem-chi-them-schema-khac.sql` | E2 | không |
| 3 | Thêm ca 20 `dang-xem-ghi-khong-vuot-luat` + đối chứng dương trong giao dịch rút lại; đầu tệp ghi 20 ca | `db/tests/cach-ly.sql` | E1 | không |
| 4 | Đăng ký ca SQL, ca lệnh `pha-thu-dang-xem-chi-ghi`, ba tệp, ba dòng ghim; đầu tệp ghi 31 ca | `db/scripts/cach-ly.sh` | E2, E4 | không |
| 5 | Bài kiểm bộ chạy: 29 → 31; thêm chỗ hỏng `dang-xem-chi-xoa` → `select 1;` và dòng `HỎNG pha-thu-dang-xem-chi-ghi: …` | `tests/db/cach-ly.db.test.ts` | E4 | không |
| 6 | Cặp «kẽ hở thật»: bản sao từ `dang-xem-chi-xoa`, A xoá qua dạng xem → B 1 → 0; `alter view … set (security_invoker = true)` → lỗi `permission denied for table agreements`, B còn 1 | `tests/db/cach-ly.db.test.ts` | E3 | không |
| 7 | Việc kèm (chờ duyệt C-5): dựng lại `moi-khong-kiem-quan-tri.sql` từ thân hàm mời của 006 bỏ phép kiểm quyền; viết lại `checkNonAdminCannotInvite` gọi thẳng `app.member_invite` dưới `quy_hang_app` với phiên Đầu chủ, thông điệp ghim mới; thêm dòng `cach_ly_7b_db_c` (cả `tests/db`, không `-t`) | `tests/db/pha-thu/moi-khong-kiem-quan-tri.sql`, `tests/db/moi-nguoi.db.test.ts`, `_acceptance/config.yaml` | E6, E7 | có (khác tệp) |
| 8 | `make check`, một dòng `wiki/log.md`, PR nháp | `wiki/log.md` | E8 | không |

Mỗi phép đo mới có cặp hai chiều trên cùng fixture: ca 20 (đối chứng dương trong ca · ba tệp phá đỏ); bài dòng ghim cũ
(xanh trên bộ chạy thật · đỏ trên bản sao sửa một chữ); cặp kẽ hở thật (dạng xem thường xoá được · dạng xem theo người
đọc không xoá được); cặp hàng 9 (bản lành từ chối · bản phá cho mời).

Rủi ro: nếu hàng 9a đổi chữ ký hay tên hàm mời khi gộp, việc 7 dựng lại tệp phá theo bản trên nhánh chính. Nếu bảng quyền
của 9a cho Đầu chủ mời người (ô `inviteMember × ListAgent` khác «không») thì đổi vai thử sang vai mà bảng cấm, ghi một
dòng sổ `fix`.
