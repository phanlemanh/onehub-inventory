# Lùi bản

Trỏ tên miền của một môi trường về bản đã chạy trước bản hiện tại, rồi kiểm lại. Lùi bản chỉ đổi mã đang phục vụ; cơ sở
dữ liệu giữ nguyên, nên mọi migration đã áp vẫn còn — luật migration (mục «Cần có trước» của [dua-ban-len.md](dua-ban-len.md)) bảo
đảm bản trước chạy được trên cơ sở dữ liệu ấy. Mục lục và bảng biến: [README.md](README.md).

## Khi nào dùng

- Bản vừa lên chạy hỏng: trang lỗi, đăng nhập không được, sức khoẻ không trả `"ok":true`.
- Lệnh đưa bản lên báo `lùi bản ĐỎ` hay `không có bản trước để lùi` sau khi đã gắn tên miền.
- Không dùng khi lệnh đưa bản lên đã tự báo `đã lùi về bản trước`: việc ấy đã xong; chỉ cần kiểm như bước 4.

## Cần có trước

- Một máy có `git` và Node 24 (`node --version` in `v24.…`; tải ở nodejs.org, bản 24 LTS).
- `vercel` đúng bản tệp tự động triển khai dùng: gõ `npm install --global vercel@65.9.0`; đạt khi `vercel --version` in
  `65.9.0`. Đỏ thì: `EACCES` — máy cài Node vào thư mục hệ thống; cài Node qua trình quản lý bản (như `nvm`) rồi gõ lại.
- Bản sao của kho này (`git clone`), đã chạy `make setup` một lần.
- Một tệp biến ngoài kho cho mỗi môi trường, quyền chỉ chủ đọc, có bốn biến `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
  `VERCEL_PROJECT_ID` (dự án của môi trường cần lùi) và `APP_URL` (địa chỉ của môi trường ấy); thêm
  `VERCEL_AUTOMATION_BYPASS_SECRET` nếu dự án bật bảo vệ bản mới. Giá trị lấy từ trình giữ mật khẩu, giống giá trị đã đặt
  ở môi trường GitHub cùng tên.

## Các bước

### 1. Xác nhận bản đang hỏng

- **Ở đâu:** trình duyệt.
- **Gõ hay bấm:** mở `<APP_URL>/api/v1/health` của môi trường (bản thật: `https://inventory.onehub.center/api/v1/health`).
- **Đạt khi:** thấy rõ bản đang hỏng — trang không trả lời, `"ok":false`, hay trang chủ lỗi — và ghi lại 7 ký tự đầu của
  `commit` nếu có.
- **Đỏ thì:** sức khoẻ trả `"ok":true`, `"vai":"dat"` mà người dùng vẫn báo lỗi: lùi bản vẫn được nếu lỗi bắt đầu từ bản
  này; không chắc thì hỏi người giữ kho mã trước khi lùi.

### 2. Nạp biến của môi trường

- **Ở đâu:** máy chủ kho, cửa sổ dòng lệnh, trong thư mục bản sao của kho.
- **Gõ hay bấm:** `git pull` rồi `set -a; source <tệp biến của môi trường>; set +a`.
- **Đạt khi:** lệnh không in gì. Không gõ giá trị nào vào dòng lệnh; không in biến ra màn hình để kiểm.
- **Đỏ thì:** `No such file` — đường tới tệp biến sai; tệp chưa có thì tạo theo «Cần có trước».

### 3. Lùi bản

- **Ở đâu:** cùng cửa sổ dòng lệnh.
- **Gõ hay bấm:** `make rollback ENV=production` (bản thử: `make rollback ENV=staging`).
- **Đạt khi:** dòng cuối là `rollback production: tên miền chạy <7 ký tự commit>`, commit khác commit ghi ở bước 1. Lệnh
  đã tự kiểm tên miền sau khi lùi (sức khoẻ đúng commit, đúng môi trường, vai nối đạt, lối thử của máy dev đóng).
- **Đỏ thì:** xem mục «Đỏ thì làm gì». Chạy lại lệnh lần nữa là lùi thêm một bản nữa — chỉ làm khi bản vừa lùi về cũng
  hỏng.

### 4. Kiểm bằng mắt

- **Ở đâu:** trình duyệt.
- **Gõ hay bấm:** mở lại `<APP_URL>/api/v1/health`, rồi mở trang chủ và đăng nhập.
- **Đạt khi:** `"ok":true`, `"vai":"dat"`, `commit` là bản cũ; đăng nhập được.
- **Đỏ thì:** lùi bản bằng trang Vercel (mục «Đỏ thì làm gì», dòng cuối) và báo người giữ kho mã ngay.

### 5. Báo và ghi lại

- **Ở đâu:** GitHub (issue mới) và người giữ kho mã.
- **Gõ hay bấm:** mở một issue: môi trường, commit hỏng, commit đang chạy sau khi lùi, giờ lùi, triệu chứng. Sự cố trên bản
  thật được ghi thành một trang trong `wiki/incidents/` khi sửa xong.
- **Đạt khi:** có issue; lượt đưa bản lên kế tiếp mang bản sửa, đi lại từ đầu theo [dua-ban-len.md](dua-ban-len.md).
- **Đỏ thì:** không đưa lại commit hỏng. Bản thật đang chạy bản cũ hơn bản thử là bình thường cho tới khi có bản sửa.

## Đỏ thì làm gì

| Dòng                                                           | Làm gì                                                                                                                                                                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rollback <ENV>: ĐỎ — thiếu biến <tên>`                        | Tệp biến thiếu biến ấy, hoặc chưa nạp (bước 2). Bổ sung, nạp lại, chạy lại.                                                                                                                                         |
| `rollback <ENV>: ĐỎ — không đọc được danh sách bản của Vercel` | `vercel` chưa cài, hoặc `VERCEL_TOKEN` hết hạn hay sai nhóm. Cài lại hay xoay khoá ([xoay-khoa.md](xoay-khoa.md)); gấp thì dùng dòng cuối.                                                                          |
| `rollback <ENV>: không có bản trước để lùi`                    | Môi trường mới có một bản. Không có gì để lùi: sửa lỗi rồi đưa bản mới lên.                                                                                                                                         |
| `rollback <ENV>: ĐỎ — vercel rollback lỗi (mã <n>)`            | Đọc dòng lỗi của Vercel ngay phía trên. Gấp thì dùng dòng cuối.                                                                                                                                                     |
| `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — <lý do>`             | Tên miền đã về bản cũ nhưng bản cũ cũng không khoẻ. Đọc lý do như bảng của [dua-ban-len.md](dua-ban-len.md) (dòng `kiem-nhanh`); thường là biến trên Vercel hay cơ sở dữ liệu, không phải mã. Báo người giữ kho mã. |
| Lệnh không chạy được ở máy nào                                 | Ở vercel.com › dự án của môi trường › Deployments: chọn bản «Ready» ngay trước bản hỏng › menu ba chấm › Instant Rollback › xác nhận. Rồi làm bước 4.                                                               |
