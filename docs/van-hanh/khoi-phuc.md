# Khôi phục dữ liệu

Hai việc: thử khôi phục định kỳ, để biết chắc bản sao lưu dùng được, và khôi phục thật khi dữ liệu mất hay hỏng. Sao lưu
hằng ngày là của Supabase (giữ 7 ngày); lệnh của kho làm thêm một bản sao lưu tại chỗ để thử khôi phục vào một cơ
sở nháp, đếm dòng từng bảng và chạy bộ kiểm cách ly trên bản khôi phục. Mỗi lần thử ghi vào
[nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md). Mục lục và bảng biến: [README.md](README.md).

## Khi nào dùng

- Thử khôi phục: một lần lúc ra mắt, rồi mỗi quý, trên bản thử (mục «Các bước»).
- Khôi phục thật: dữ liệu của bản thật mất hay hỏng (xoá nhầm, migration làm hỏng dữ liệu). Đây là quyết định của chủ kho:
  mọi thứ ghi sau thời điểm sao lưu sẽ mất (mục «Khôi phục thật»).

## Cần có trước

- Một máy có `git`, `make`, `bash` và bản sao của kho này (GitHub › trang kho › Code › HTTPS › chép, rồi `git clone`).
  `make sao-luu`, `make khoi-phuc-thu` và `make cach-ly-dich` chỉ chạy `bash` với `psql`, `pg_dump`, `pg_restore`: **không
  cần Node, không cần `make setup`**.
- `psql`, `pg_dump`, `pg_restore` **cùng bản chính với máy chủ Postgres của Supabase** — không cũ hơn, cũng không mới
  hơn (Supabase › Project Settings › Infrastructure ghi bản; hiện là 17). `pg_dump` mới hơn ghi ra lệnh mà máy chủ cũ
  không hiểu, nên tệp không khôi phục được. macOS: `brew install postgresql@17`; Ubuntu: gói `postgresql-client-17` (đổi
  17 thành bản của máy chủ).
  - **Đạt khi:** `pg_dump --version` in `pg_dump (PostgreSQL) <bản>.`, với `<bản>` đúng số bản chính Supabase ghi.
  - **Đỏ thì:** `command not found` — chưa cài hoặc chưa vào `PATH` (brew in sẵn dòng thêm `PATH`); số khác bản máy chủ
    — cài đúng bản đó. Quên kiểm thì `make sao-luu` và `make khoi-phuc-thu` tự dừng trước khi ghi hay tạo gì, với một
    dòng như `pg_dump bản 18, máy chủ bản 17 — dùng công cụ cùng bản với máy chủ`. Cùng kiểu đó: dòng
    `pg_restore bản …` — sửa như trên; dòng `tệp sao lưu lấy bằng pg_dump …` — tệp do công cụ khác bản làm ra, sao lưu
    lại. Máy chỉ có Docker thì đặt `PSQL_DICH`, `PG_DUMP_CMD`, `PG_RESTORE_CMD` thành lệnh chạy qua Docker với ảnh
    `postgres:<bản của máy chủ>`.
- Một thư mục **ngoài kho** để giữ tệp sao lưu: tệp có dữ liệu thật; lệnh từ chối ghi vào trong kho.
- Tệp biến ngoài kho của bản thử, quyền chỉ chủ đọc, có:
  - `MIGRATE_DATABASE_URL` — chuỗi Session pooler vai chủ của dự án bản thử;
  - `SAO_LUU_LUOC_DO` — `public identity app` (chỉ các lược đồ của ta, không lấy lược đồ riêng của Supabase);
  - `KHOI_PHUC_ADMIN_URL` — cùng chuỗi như `MIGRATE_DATABASE_URL` (lệnh tự thay tên cơ sở dữ liệu bằng một cơ sở nháp);
  - `KHOI_PHUC_LOGIN_URL` — cùng chuỗi như `LOGIN_DATABASE_URL` của bản thử (vai `quy_hang_login`).

## Các bước

### 1. Nạp biến của bản thử

- **Ở đâu:** máy chủ kho, cửa sổ dòng lệnh, trong thư mục bản sao của kho.
- **Gõ hay bấm:** `git pull` rồi `set -a; source <tệp biến của bản thử>; set +a`.
- **Đạt khi:** lệnh không in gì. Không gõ giá trị vào dòng lệnh, không in biến ra để kiểm.
- **Đỏ thì:** `No such file` — đường tới tệp biến sai; tệp chưa có thì tạo theo «Cần có trước».

### 2. Kiểm cách ly trên bản thử

- **Ở đâu:** cùng cửa sổ dòng lệnh.
- **Gõ hay bấm:** `LOGIN_DATABASE_URL="$KHOI_PHUC_LOGIN_URL" make cach-ly-dich`.
- **Đạt khi:** mỗi ca in một dòng `ok <ca>`, dòng cuối `cach-ly-dich: 4 ca đạt`. Bộ kiểm chỉ đọc, không ghi gì.
- **Đỏ thì:** `thiếu biến <tên>` — bổ sung tệp biến. Dòng gọi tên bảng hay vai (`vai anon co quyen tren: …`,
  `bang khong ep luat dong: …`) — làm theo bảng «Đỏ thì làm gì» của [dua-ban-len.md](dua-ban-len.md), dòng `cach-ly`,
  trước khi thử khôi phục.

### 3. Sao lưu ra tệp ngoài kho

- **Ở đâu:** cùng cửa sổ dòng lệnh.
- **Gõ hay bấm:** `make sao-luu TEP=<thư mục ngoài kho>/ban-thu-<YYYY-MM-DD>.dump`.
- **Đạt khi:** dòng cuối `sao-luu: <ngày> · <n> bảng · <m> dòng · <số> byte`; cạnh tệp có tệp `.dump.dem` (số dòng từng
  bảng). Ghi lại `n` và `m`.
- **Đỏ thì:** `không ghi sao lưu vào trong kho` — chọn thư mục ngoài bản sao kho; `không có thư mục …` — tạo thư mục
  trước; `không mở được ảnh chụp` — chuỗi `MIGRATE_DATABASE_URL` phải là Session pooler hay nối thẳng, không phải
  Transaction pooler; `sao-luu: pg_dump bản …, máy chủ bản …` — cài `pg_dump` cùng bản chính với máy chủ (xem «Cần có trước»).

### 4. Thử khôi phục vào cơ sở nháp

- **Ở đâu:** cùng cửa sổ dòng lệnh. Lệnh tạo một cơ sở nháp tên `khoi_phuc_thu_<giờ>` trên cùng máy chủ của bản thử, không
  đụng cơ sở dữ liệu nào khác, và xoá nó khi xong.
- **Gõ hay bấm:** `make khoi-phuc-thu TEP=<cùng tệp của bước 3>`.
- **Đạt khi:** in `co-so-nhap: khoi_phuc_thu_…`, các dòng `ok <ca>` của bộ kiểm cách ly, và dòng cuối
  `khoi-phuc: <ngày> · <n> bảng · <m> dòng · cach-ly đạt`, với `n`, `m` trùng bước 3.
- **Đỏ thì:**
  - `thieu bang: <bảng>` hay `lech dong: <bảng> (goc … · khoi phuc …)` — bản sao lưu không đủ: không ghi là đạt; báo
    người giữ kho mã kèm nguyên dòng.
  - `pg_restore lỗi` — đọc dòng lỗi ngay dưới; `role … does not exist` nghĩa là khôi phục nhầm sang máy chủ khác máy chủ
    sao lưu.
  - `không tạo được cơ sở nháp` — vai trong `KHOI_PHUC_ADMIN_URL` không được tạo cơ sở dữ liệu; dùng vai chủ `postgres`.
  - `không xoá được cơ sở nháp <tên> — xoá tay` — Supabase › SQL Editor: `drop database <tên> with (force);`.
  - Dòng ca cách ly đỏ — như bước 2.

### 5. Ghi nhật ký khôi phục

- **Ở đâu:** kho, tệp [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md), qua một PR (`docs: …`).
- **Gõ hay bấm:** thêm một dòng cuối bảng «Các lần thử»: chép nguyên dòng `khoi-phuc: …` của bước 4, nơi thử («bản thử»),
  bản sao lưu («sao lưu tại chỗ, `make sao-luu`»), người thử, ghi chú.
- **Đạt khi:** PR gộp; bảng có dòng mới nhất ở dưới cùng.
- **Đỏ thì:** lần thử đỏ không ghi như lần đạt: ghi vào cột Ghi chú lý do và việc đã làm, mở issue cho người giữ kho mã.

### 6. Xoá tệp sao lưu tại chỗ

- **Ở đâu:** máy chủ kho.
- **Gõ hay bấm:** `rm <tệp của bước 3> <tệp của bước 3>.dem`.
- **Đạt khi:** hai tệp không còn. Kho không giữ bản sao lưu ngoài sao lưu hằng ngày của Supabase.
- **Đỏ thì:** tệp nằm trên ổ dùng chung hay đã đồng bộ lên mây — xoá cả bản ở đó; tệp có dữ liệu thật.

## Khôi phục thật

Dùng sao lưu hằng ngày của Supabase cho dự án bản thật. Supabase khôi phục cả dự án tại chỗ: trang ngừng phục vụ trong lúc
khôi phục, và mọi thứ ghi sau thời điểm sao lưu mất.

1. **Quyết định.** Ở đâu: chủ kho. Gõ hay bấm: chọn thời điểm sao lưu (ngày trước sự cố) và báo các sàn đang dùng. Đạt
   khi: chủ kho đồng ý thời điểm và phần dữ liệu sẽ mất. Đỏ thì: chưa đồng ý thì không làm gì; dữ liệu hỏng của một sàn
   có khi sửa được bằng tay, hỏi người giữ kho mã.
2. **Khôi phục.** Ở đâu: Supabase › dự án bản thật › Database › Backups › Scheduled backups. Gõ hay bấm: Restore ở bản
   của ngày đã chọn, xác nhận. Đạt khi: Supabase báo dự án đã khôi phục xong và chạy lại. Đỏ thì: Supabase báo lỗi — mở
   yêu cầu hỗ trợ với Supabase; không thử lại bằng cách khác trên bản thật.
3. **Đưa lại bản.** Ở đâu: GitHub › Actions › Deploy › Run workflow, thẻ phát hành đang chạy. Gõ hay bấm: chạy, duyệt
   `production`. Đạt khi: `deploy production: xong <commit>` — bước `migration` áp lại migration nào mới hơn bản sao lưu.
   Đỏ thì: bảng «Đỏ thì làm gì» của [dua-ban-len.md](dua-ban-len.md).
4. **Kiểm cách ly bản thật.** Ở đâu: máy chủ kho, cửa sổ dòng lệnh, trong thư mục bản sao của kho. Trước hết dựng tệp
   biến ngoài kho của bản thật (một lần; quyền chỉ chủ đọc: `chmod 600 <tệp>`), mỗi dòng dạng `TÊN=giá trị` lấy từ trình
   giữ mật khẩu: `MIGRATE_DATABASE_URL` (chuỗi Session pooler vai chủ của dự án bản thật, việc 3 của README),
   `LOGIN_DATABASE_URL` (chuỗi vai `quy_hang_login` của bản thật — cùng chuỗi `DATABASE_URL` đặt ở Vercel, việc 4 của
   README), `APP_URL` (`https://inventory.onehub.center`), thêm `VERCEL_AUTOMATION_BYPASS_SECRET` nếu dự án bật bảo vệ.
   Gõ hay bấm: `set -a; source <tệp biến của bản thật>; set +a`, rồi `make cach-ly-dich`, rồi
   `make smoke ENV=production`. Đạt khi: `cach-ly-dich: 4 ca đạt` và
   `smoke production: đạt <commit>`. Đỏ thì: dòng gọi tên bảng hay vai — báo người giữ kho mã ngay, cân nhắc tạm ngừng bản thật.
5. **Ghi lại.** Thêm một dòng vào [nhat-ky-khoi-phuc.md](nhat-ky-khoi-phuc.md) (nơi thử «bản thật», bản sao lưu «sao lưu
   hằng ngày của Supabase, ngày …») và một trang sự cố trong `wiki/incidents/`.

## Đỏ thì làm gì

- Mọi lệnh ở đây không in địa chỉ hay mật khẩu. Dán dòng đỏ cho người giữ kho mã được; không dán tệp biến.
- `thiếu biến <tên>` ở bất kỳ lệnh nào: tệp biến thiếu biến ấy hay chưa nạp (bước 1).
- Thử khôi phục đỏ hai quý liền: coi như chưa có sao lưu dùng được; chủ kho cân nhắc lối khôi phục theo thời điểm của
  Supabase (Project Settings › Add-ons › Point in time recovery; giá ghi ngay trên trang ấy).
- Cơ sở nháp còn sót trên bản thử (`khoi_phuc_thu_…` trong danh sách cơ sở dữ liệu): xoá như dòng cuối của bước 4.
