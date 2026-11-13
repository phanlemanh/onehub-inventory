# Kế hoạch: ung-dung-noi-bang-vai-khong-chu (hàng 7c)

> Thực thi tuần tự trong phiên chính, trên Postgres dãy C (`make db-up DB_LANE=c DB_PORT=5569`).

**Mục tiêu:** ứng dụng và mọi bài kiểm cơ sở dữ liệu nối bằng vai đăng nhập `quy_hang_login` (không chủ, chỉ là thành
viên không kế thừa của `quy_hang_app`); từ vai ấy mọi lối đổi về vai chủ bị từ chối; cửa từ chối vai nối về được vai chủ;
bộ kiểm cách ly có ca phiên thật và ca phá cấp lại quyền chủ.

**Kiến trúc:** migration 008 tạo vai; hai tệp SQL mới của bộ kiểm cách ly (ca danh mục dưới vai chủ, ca phiên trên kết nối
vai đăng nhập) để không đụng `db/tests/cach-ly.sql` của hàng 2c; bảy tệp phá chạy trong giao dịch rút lại; cửa kiểm vai nối
một lần mỗi pool; bộ trợ giúp bài kiểm thêm chuỗi nối vai đăng nhập.

**Lệnh kiểm mỗi việc:** `vai_dang_nhap_c` (bộ chạy cách ly + `tests/db/cach-ly.db.test.ts` + `tests/db/vai-dang-nhap.db.test.ts`),
`vai_dang_nhap_unit`, và ở việc 7–8 `cach_ly_7b_db_c`, `vai_dang_nhap_e2e_c`.

| # | Việc | Tệp | Phục vụ | Độc lập |
|---|---|---|---|---|
| 1 | Migration 008: tạo `quy_hang_login` (đăng nhập, không kế thừa, không quyền đặc biệt), cấp `quy_hang_app` với đổi-sang, không kế thừa, không quản; áp hai lần trên cơ sở nháp | `db/migrations/008_vai_dang_nhap_ung_dung.sql` | E1 | không |
| 2 | Bảy tệp phá viết TRƯỚC ca danh mục; ca danh mục `vai-dang-nhap-khong-ve-chu` (12 điều, giao dịch rút lại); chạy bộ chạy trên bản lành và từng tệp phá — đỏ đúng dòng ghim | `db/tests/vai-dang-nhap.sql`, `db/tests/pha-thu/{cap-vai-chu,cap-vai-danh-tinh,cap-ke-thua,so-huu-bang,vuot-luat,quyen-thang,quyen-ham-thang}.sql` | E1, E4 | không |
| 3 | Tệp phiên: ca `dang-nhap-khong-ve-vai-chu` và đối chứng `dang-nhap-qua-cua-doc-duoc` (hai sàn, mỗi sàn một thoả thuận, dữ liệu ghi bằng vai chủ trên cơ sở nháp riêng); `psql.sh` thêm lệnh psql cho vai đăng nhập (`PSQL_LOGIN` khi `PSQL` đặt) | `db/tests/vai-dang-nhap-phien.sql`, `db/scripts/psql.sh` | E2, E3 | không |
| 4 | Bộ chạy: đăng ký 4 ca, bước phiên, bước phá trong giao dịch rút lại + chạy lại ca danh mục sau phá; dòng cuối mới | `db/scripts/cach-ly.sh` | E1–E5 | không |
| 5 | Bài kiểm bộ chạy: số ca đọc từ bộ chạy; mốc «không nới» = bộ chạy nhánh chính trước hàng này; chỗ hỏng `cap-vai-chu` → `select 1;`; tệp phiên chạy dưới vai chủ thì đỏ; tệp phiên dùng đúng câu của cửa | `tests/db/cach-ly.db.test.ts` | E2, E3, E5 | không |
| 6 | Cửa kiểm vai nối: bài đơn vị với pool giả trước (đỏ), rồi mã; bài cơ sở dữ liệu ba vai bị từ chối + vai đăng nhập chạy + mã trong cửa đổi vai bị từ chối; vai tạm tạo và xoá trong bài | `src/modules/identity/with-company.ts`, `src/modules/identity/with-company.test.ts`, `tests/db/vai-dang-nhap.db.test.ts` | E6, E6b, E7 | không |
| 7 | Bộ trợ giúp: `appUrl` + đặt mật khẩu `local-only`; mọi pool sản phẩm và `DATABASE_URL` của bài trình duyệt chuyển sang `appUrl`; bài quét nguồn (bốn mẫu đỏ); chạy cả `tests/db` và bài trình duyệt có cơ sở dữ liệu | `tests/db/helpers.ts`, `tests/db/*.db.test.ts`, `tests/db/bang-quyen-world.ts`, `tests/e2e-db/*`, `playwright.db.config.ts`, `tests/vai-dang-nhap-nguon.test.ts` | E8, E8b, E8c | không |
| 8 | `.env.example` chỉ thêm dòng; `mk/db.mk` in hai chuỗi nối + đích `db-login`; bài `.env.example` chỉ thêm | `.env.example`, `mk/db.mk`, `tests/vai-dang-nhap-nguon.test.ts` | E9 | không |
| 9 | Wiki: trang quyết định mới, một dòng `wiki/log.md`, cập nhật trang thực thể nếu có; `make check`; báo G dòng `.env.example` (tệp dùng chung) | `wiki/decisions/0025-*.md`, `wiki/log.md` | E9b | không |
| 10 | Trước lượt chấm: gộp nhánh chính có hàng 2c, giữ cả hai bên ở bộ chạy, tính lại số ca; `npm ci` nếu gói đổi | — | E5 | không |

Mỗi phép đo mới có cặp hai chiều trên cùng chỗ: ca danh mục (bản lành ok · bảy tệp phá đỏ đúng ghim); ca phiên (vai đăng
nhập bị từ chối · cùng tệp chạy dưới vai chủ thì đỏ); cửa (vai đăng nhập chạy · ba vai về được chủ bị từ chối; bài đơn vị:
biến thể bỏ kiểm làm ca từ chối đỏ); cửa đổi vai (vai đăng nhập bị từ chối · client vai chủ thì không); bài quét nguồn
(cây thật sạch · bốn mẫu đỏ đúng tệp, dòng); `.env.example` (đủ dòng cũ · xoá một dòng thì đỏ).

Rủi ro: hàng 2c đổi khuôn bộ chạy → việc 10 ghép lại theo khuôn mới. Bài kiểm nào hôm nay dùng pool sản phẩm để ghi dữ
liệu mẫu bằng vai chủ sẽ đỏ khi đổi chuỗi nối — sửa bài cho ghi qua `owner`, không nới cửa (ghi dòng sổ `fix`).
