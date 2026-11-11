# Thiết kế: cách ly mỗi sàn (hàng 7, N1)

Ngày 11/11/2026 · dãy N của đợt «nen» · hồ sơ `_acceptance/cach-ly-moi-san/` · hạng T3 · chạm luật SP-1.

## Vấn đề

Kho mới chưa có cơ sở dữ liệu. Mọi hàng dữ liệu thật về sau (đăng nhập, mời người, Bảng hàng thật, nhập Excel…) đều
đứng trên một nền: mỗi sàn chỉ đọc và ghi được dữ liệu của mình, và mọi truy vấn đi qua một cửa dưới vai không sở hữu
bảng (SP-1). Hàng này dựng đúng nền đó, cùng bộ kiểm chứng minh nó giữ, trước khi có bảng nghiệp vụ nào.

Ngưỡng của ô cơ hội: bộ kiểm cách ly chạy dưới vai không sở hữu bảng, và mọi bảng công ty đều chặn đọc và ghi chéo sàn.

## Lựa chọn và căn cứ

1. **Lược đồ nền chép nguyên văn từ Quỹ hàng.** `db/migrations/001_nen_cong_ty.sql` là bản sao từng byte của tệp cùng
   tên ở `onehub-quy-hang` (commit `1729b11f`): hàm `app.current_company_id()`, vai `quy_hang_app` không đăng nhập và
   không sở hữu bảng, bảng `companies` và `agreements`, cả hai bật và ép luật theo dòng. Căn cứ: quyết định 0008 — kho
   mới chỉ chép nguyên văn các tệp đã gộp của kho cũ, không tự viết migration. Tên vai giữ nguyên vì lược đồ thật sẽ
   được chuyển sang nguyên trạng.
2. **Cửa `withCompany` ở mô-đun identity, không phụ thuộc trình điều khiển.** Kho chưa có gói `pg`, và
   `package.json`/`package-lock.json` nằm ngoài ranh giới của hàng. Cửa nhận một «bể kết nối» theo kiểu tối thiểu
   (`connect()` trả một client có `query` và `release`) — đúng hình của `pg.Pool`, nên khi hàng nối dữ liệu thật thêm
   `pg` thì truyền thẳng bể của nó vào. Mỗi lời gọi là một giao dịch: `begin` → `set local role quy_hang_app` → đặt
   người và sàn bằng `set_config(..., true)` → việc của người gọi → `commit`; lỗi thì `rollback` và ném lại; luôn trả
   client. Chép từ `packages/api/src/db.ts` của Quỹ hàng (commit `1729b11f`), chỉ đổi kiểu. Mã nằm ở tệp nội bộ
   `src/modules/identity/with-company.ts`; cửa công khai là `server.ts` (mở bằng `import "server-only"`). Hai câu cửa
   chạy — đổi vai và đặt người, sàn — là hằng xuất ra từ tệp cửa; bộ kiểm SQL dùng nguyên văn hai câu đó (câu đặt sàn
   qua `prepare dat_san(text, text) as <câu của cửa>`), và một bài kiểm đơn vị đọc tệp SQL để khẳng định điều đó. Đổi
   câu ở cửa mà quên bộ kiểm thì bài kiểm đơn vị đỏ.
3. **Một cửa ở lớp mã: bộ quét.** Một bài kiểm quét `src/` và báo mọi dòng mở kết nối hay chạy câu thẳng trên bể
   (`pool.query(`, `pool.connect(`, `new Pool(`, `new Client(`, viết hoa hay thường). Tập miễn tường minh có đúng hai
   tệp: tệp cửa, và chính tệp bài kiểm quét (nó chứa các chuỗi ấy để dựng thư mục mẫu). Đối chứng hai chiều trên thư mục
   mẫu: tệp lành không bị tính, tệp hỏng bị gọi đúng tên và dòng, và một tệp ngoài tập miễn mang đúng nội dung tệp bài
   kiểm thì bị báo. Chép ý từ `packages/api/src/one-door.test.ts` của Quỹ hàng.
4. **Bộ kiểm cách ly viết bằng SQL, chạy qua `psql` trong container Postgres của dãy.** Không cần gói `pg` (cùng lý do
   ở 2). Lệnh `bash db/scripts/cach-ly.sh` — mọi đường tệp suy từ vị trí script, tệp SQL đưa vào container qua đầu vào
   chuẩn của `psql`:
   - dựng một cơ sở dữ liệu nháp mới, áp migration hai lần (lần hai phải không áp gì);
   - chạy `db/tests/cach-ly.sql`: mỗi ca dựng hai sàn A, B bằng vai chủ trong một giao dịch, chuyển sang vai
     `quy_hang_app`, đặt sàn bằng đúng câu mà cửa dùng, kiểm đọc và ghi, rồi huỷ giao dịch. Ngoài «chưa đặt sàn» còn hai
     trạng thái thật của cửa: sàn đặt chuỗi rỗng (cửa gọi với sàn null), và kết nối đã dùng (giao dịch trước đặt sàn A
     rồi ghi, giao dịch sau không đặt) — cả hai phải không thấy dòng nào và không lỗi;
   - ca quét danh mục, phạm vi tường minh: mọi bảng thường hay bảng phân vùng ở schema `public` có cột tên `company_id`,
     cộng bảng `companies`. Mỗi bảng phải bật và ép luật theo dòng, có ít nhất một luật đọc, và MỌI luật của bảng phải
     lọc theo sàn: biểu thức `using` và `with check` (khi có) phải gọi `app.current_company_id()` và nhắc cột sàn
     (`company_id`, với bảng `companies` là `id`) — luật `true` hay luật không nhắc sàn là HỎNG gọi tên bảng và luật; luật
     thêm, sửa phải có `with check`. Vai `quy_hang_app` không sở hữu bảng nào trong tập, không là siêu người dùng, không
     vượt luật theo dòng. Bảng công ty thêm về sau ở `public` tự rơi vào ca này; bảng ở schema khác (danh tính của hàng 8)
     nằm ngoài phạm vi và phải tự có ca riêng;
   - phá thử, mỗi bản trên một cơ sở nháp riêng, bản phá là tệp `db/tests/pha-thu/*.sql`: (a) gỡ ép luật theo dòng của
     `agreements`; (b) thay luật thêm của `agreements` bằng `with check (true)`; (c) thay luật đọc của `agreements` bằng
     `using (true)`; (d) tạo bảng mẫu có `company_id`, ép luật theo dòng nhưng luật `true`. Mỗi bản phải làm bộ kiểm đỏ
     với đúng thông điệp ghim (tên ca và tên bảng). Bộ kiểm chưa từng đỏ thì màu xanh của nó không nói gì.
   - Ma trận ca viết trước (19 ca): 14 ca SQL — `doi-chung-vai-chu-thay-du`, `chua-dat-san-khong-thay-gi`,
     `san-rong-khong-thay-gi`, `ket-noi-da-dung-khong-thay-gi`, `a-chi-thay-chinh-minh`,
     `a-thay-thoa-thuan-cua-minh-va-hop-tac`, `a-khong-them-dong-ten-b`, `a-khong-sua-dong-cua-b`,
     `a-khong-chuyen-dong-sang-b`, `vai-api-khong-tao-sua-san`, `vai-api-khong-xoa-thoa-thuan`,
     `moi-bang-cong-ty-ep-luat-theo-dong`, `luat-doc-ghi-theo-san`, `vai-api-khong-so-huu-khong-vuot`; và 5 ca của lệnh —
     `ap-hai-lan`, `pha-thu-bo-ep-luat`, `pha-thu-luat-them-khong-kiem`, `pha-thu-luat-doc-mo`, `pha-thu-bang-moi-luat-mo`.
     Lệnh khẳng định mỗi ca in `ok <ca>` đúng một lần, bản lành không có dòng `HỎNG`, và in dòng tổng
     `cach-ly: 19 ca đạt, vai quy_hang_app` với số bằng độ dài danh sách; lệch thì in tên ca thiếu và thoát khác 0.
   - Container: `onehub-inventory-db-$DB_LANE` (như `mk/db.mk`). `DB_LANE` không đặt thì lệnh dùng container
     `onehub-inventory-db-*` duy nhất đang chạy; không có hay có nhiều thì dừng và nói cần `DB_LANE`. Biến `PSQL` cho
     phép thay hẳn lệnh `psql`. Lệnh chỉ tạo và xoá cơ sở nháp tên `cach_ly_*`.
5. **Áp migration bằng `db/scripts/migrate.sh`.** Áp các tệp chưa chạy theo số, mỗi tệp một giao dịch cùng dòng sổ
   `public.schema_migrations`; chạy lại không áp gì. Cùng luật với `scripts/migrate.mjs` của Quỹ hàng, đổi sang `psql`.

## Luồng của một truy vấn

```
mã nghiệp vụ ──withCompany(bể, {người, sàn}, việc)──▶ begin
                                                       set local role quy_hang_app   (không sở hữu bảng)
                                                       set_config app.user_id / app.company_id (cục bộ giao dịch)
                                                       việc(client)  ── luật theo dòng của Postgres lọc theo sàn
                                                       commit | rollback khi lỗi
```

## Không làm ở hàng này

- Không thêm gói `pg`, không có ca thời chạy của cửa trên Postgres thật — hàng nối dữ liệu thật đầu tiên thêm cả hai.
- Không chạy bộ kiểm cách ly trên CI: việc thêm job có Postgres nằm ở `.github/workflows/`, của người.
- Không có bảng người dùng, thành viên, vai trong sàn (hàng 8, 9).
- Không có API `/api/v1` nào dùng cửa.

## Đặc tả UX

Hàng không chạm giao diện — bỏ đặc tả UX (sổ quyết định).

## Rủi ro

- Một nhánh khác cũng thêm migration số 001 → luật riêng 3 của đợt: trùng số thì đổi số của mình trước khi gộp.
- Phiên bản Postgres: container dãy dùng `postgres:16`; `gen_random_uuid()` có sẵn từ 13.
