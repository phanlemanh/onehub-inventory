# Lùi bản

Trỏ tên miền của một môi trường về một bản đã chạy tốt, do người vận hành nêu đích danh, rồi kiểm lại. Lùi bản chỉ đổi mã đang phục vụ; cơ sở
dữ liệu giữ nguyên, nên mọi migration đã áp vẫn còn — luật migration (mục «Cần có trước» của [dua-ban-len.md](dua-ban-len.md)) bảo
đảm bản trước chạy được trên cơ sở dữ liệu ấy. Mục lục và bảng biến: [README.md](README.md).

## Khi nào dùng

- Bản vừa lên chạy hỏng: trang lỗi, đăng nhập không được, sức khoẻ không trả `"ok":true`.
- Lệnh đưa bản lên báo `lùi bản DỪNG` hay `lùi bản ĐỎ` sau khi đã gắn tên miền: lệnh không tự lùi được, tên miền còn ở
  bản hỏng, và lệnh đã in sẵn danh sách bản để chọn (bước 3).
- Không dùng khi lệnh đưa bản lên đã tự báo `đã lùi về bản trước`: việc ấy đã xong; chỉ cần kiểm như bước 5.

## Cần có trước

- Một máy có `git` và Node 24 (`node --version` in `v24.…`; tải ở nodejs.org, bản 24 LTS).
- `vercel` đúng bản tệp tự động triển khai dùng: gõ `npm install --global vercel@65.9.0`; đạt khi `vercel --version` in
  `65.9.0`. Đỏ thì: `EACCES` — máy cài Node vào thư mục hệ thống; cài Node qua trình quản lý bản (như `nvm`) rồi gõ lại.
- Bản sao của kho này, đã chạy `make setup` một lần. Địa chỉ để sao: trang kho trên GitHub › nút Code › tab HTTPS ›
  bấm biểu tượng chép; rồi gõ `git clone <địa chỉ vừa chép>` và `cd` vào thư mục vừa tạo.
- Một tệp biến ngoài kho cho mỗi môi trường, mỗi dòng dạng `TÊN=giá trị` (không dấu cách quanh `=`), quyền chỉ chủ
  đọc (`chmod 600 <tệp>`), nạp bằng `set -a; source <tệp>; set +a` (bước 2). Tệp có bốn biến `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
  `VERCEL_PROJECT_ID` (dự án của môi trường cần lùi) và `APP_URL` (địa chỉ của môi trường ấy); thêm
  `VERCEL_AUTOMATION_BYPASS_SECRET` nếu dự án bật bảo vệ bản mới. Giá trị lấy từ trình giữ mật khẩu, giống giá trị đã đặt
  ở môi trường GitHub cùng tên.
- Không có `VERCEL_TOKEN`: lệnh dùng phiên `vercel login` của máy (dòng đầu `rollback <ENV>: dùng phiên Vercel CLI đã đăng nhập`), bản sao kho phải nối đúng dự án bằng `vercel link`, và bản thật gõ thêm cờ: `make rollback ENV=production BAN=<id> XAC_NHAN_BAN_THAT=co`.

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

### 3. Xem danh sách bản và chọn bản để lùi về

- **Ở đâu:** cùng cửa sổ dòng lệnh.
- **Gõ hay bấm:** `make rollback ENV=production` (bản thử: `make rollback ENV=staging`), không kèm `BAN`. Lệnh không
  lùi gì: nó in dòng `rollback production: DỪNG — chưa nêu bản cần lùi về, không đoán`, rồi mỗi bản production sẵn sàng
  một dòng `bản <id> · <url> · commit <7 ký tự> · tạo <giờ UTC>`, mới nhất trước; bản tên miền đang trỏ tới có thêm
  `· tên miền đang ở đây`.
- **Đạt khi:** thấy dòng mang `tên miền đang ở đây` (thường là bản hỏng ghi ở bước 1) và chọn được bản cần lùi về: bản
  đã chạy tốt gần nhất — thường là bản tên miền trỏ tới ngay trước lần đưa bản lên hỏng. Chép `<id>` của bản ấy (dạng
  `dpl_…`). Không chọn bản chỉ vì nó mới nhất hay cùng commit: một bản dựng hỏng chưa từng gắn tên miền cũng nằm trong
  danh sách.
- **Đỏ thì:** `ĐỎ — không đọc được danh sách bản của Vercel` — xem mục «Đỏ thì làm gì». Không biết bản nào chạy tốt: mở
  vercel.com › dự án › Deployments, so giờ tạo với giờ của lượt đưa bản lên trước (tab Actions trên GitHub), hoặc hỏi
  người giữ kho mã.

### 4. Lùi về bản đã chọn

- **Ở đâu:** cùng cửa sổ dòng lệnh.
- **Gõ hay bấm:** `make rollback ENV=production BAN=<id>` với `<id>` chép ở bước 3.
- **Đạt khi:** dòng cuối là `rollback production: tên miền ở bản <id>, chạy <7 ký tự commit>`, commit khác commit ghi ở
  bước 1. Lệnh chỉ lùi khi `<id>` có trong danh sách và khác bản tên miền đang trỏ tới; sau khi lùi nó đọc lại tên miền
  để chắc tên miền trỏ đúng `<id>`, rồi kiểm sức khoẻ (đúng commit của bản ấy, đúng môi trường, vai nối đạt, lối thử
  của máy dev đóng).
- **Đỏ thì:** xem mục «Đỏ thì làm gì». Bản vừa lùi về cũng hỏng thì làm lại bước 3 và 4 với một bản cũ hơn.

### 5. Kiểm bằng mắt

- **Ở đâu:** trình duyệt.
- **Gõ hay bấm:** mở lại `<APP_URL>/api/v1/health`, rồi mở trang chủ và đăng nhập.
- **Đạt khi:** `"ok":true`, `"vai":"dat"`, `commit` là bản cũ; đăng nhập được.
- **Đỏ thì:** lùi bản bằng trang Vercel (mục «Đỏ thì làm gì», dòng cuối) và báo người giữ kho mã ngay.

### 6. Báo và ghi lại

- **Ở đâu:** GitHub (issue mới) và người giữ kho mã.
- **Gõ hay bấm:** mở một issue: môi trường, commit hỏng, commit đang chạy sau khi lùi, giờ lùi, triệu chứng. Sự cố trên bản
  thật được ghi thành một trang trong `wiki/incidents/` khi sửa xong.
- **Đạt khi:** có issue; lượt đưa bản lên kế tiếp mang bản sửa, đi lại từ đầu theo [dua-ban-len.md](dua-ban-len.md).
- **Đỏ thì:** không đưa lại commit hỏng. Bản thật đang chạy bản cũ hơn bản thử là bình thường cho tới khi có bản sửa.

## Đỏ thì làm gì

`make rollback` không bao giờ tự đoán bản cần lùi về: mọi bản đưa lên đều là một bản production sẵn sàng trên Vercel, dù
đã gắn tên miền hay chưa, nên bản mới nhất, hay bản mang cùng commit, có thể là một bản dựng hỏng chưa từng phục vụ. Mỗi
dòng `DỪNG` dưới đây không đổi gì; làm theo cột bên phải rồi chạy lại.

| Dòng                                                                              | Làm gì                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rollback <ENV>: ĐỎ — thiếu biến <tên>`                                           | Tệp biến thiếu biến ấy, hoặc chưa nạp (bước 2). Bổ sung, nạp lại, chạy lại.                                                                                                                                           |
| `rollback <ENV>: ĐỎ — không đọc được danh sách bản của Vercel`                    | `vercel` chưa cài, hoặc `VERCEL_TOKEN` hết hạn hay sai nhóm. Cài lại hay xoay khoá ([xoay-khoa.md](xoay-khoa.md)); gấp thì dùng dòng cuối.                                                                            |
| `rollback <ENV>: DỪNG — chưa nêu bản cần lùi về, không đoán`                      | Đúng như bước 3: đọc danh sách in ngay dưới, chọn bản đã chạy tốt gần nhất, gõ `make rollback ENV=<ENV> BAN=<id>` (bước 4).                                                                                           |
| `rollback <ENV>: DỪNG — không thấy bản <id> trong danh sách bản production READY` | `BAN` phải là đúng `<id>` (dạng `dpl_…`) của một dòng trong danh sách in ngay dưới, không phải url. Chép lại `<id>` từ danh sách, chạy lại bước 4.                                                                    |
| `rollback <ENV>: DỪNG — tên miền đã ở bản <id>, không lùi`                        | Tên miền đã trỏ vào bản ấy. Đọc lại danh sách in ngay dưới, chọn một bản khác đã chạy tốt, chạy lại bước 4.                                                                                                           |
| `rollback <ENV>: DỪNG — không đọc được bản tên miền đang trỏ tới, không lùi`      | Vercel không trả lời về tên miền: thường là `VERCEL_TOKEN` hay `VERCEL_PROJECT_ID` sai dự án, hoặc `APP_URL` sai địa chỉ. Sửa tệp biến, nạp lại, chạy lại; gấp thì dùng dòng cuối.                                    |
| `rollback <ENV>: ĐỎ — vercel rollback lỗi (mã <n>)`                               | Đọc dòng lỗi của Vercel ngay phía trên. Gấp thì dùng dòng cuối.                                                                                                                                                       |
| `rollback <ENV>: ĐỎ — tên miền chưa về bản <id> (đang ở <id khác>)`               | Vercel nhận lệnh lùi nhưng tên miền chưa đổi. Chờ một phút rồi chạy lại bước 4; vẫn vậy thì dùng dòng cuối và báo người giữ kho mã.                                                                                   |
| `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — <lý do>`                                | Tên miền đã về bản chọn nhưng bản ấy cũng không khoẻ. Đọc lý do như bảng của [dua-ban-len.md](dua-ban-len.md) (dòng `kiem-nhanh`); thường là biến trên Vercel hay cơ sở dữ liệu, không phải mã. Báo người giữ kho mã. |
| Lệnh không chạy được ở máy nào                                                    | Ở vercel.com › dự án của môi trường › Deployments: chọn bản «Ready» đã chạy tốt gần nhất › menu ba chấm › Instant Rollback › xác nhận. Rồi làm bước 5.                                                                |
