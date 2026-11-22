# Bước bien trước vai-dang-nhap — thiết kế

Hồ sơ: `_acceptance/bien-do-sau-xoay-mat-khau/`. Nguồn: Ngoài-1 của `_acceptance/bien-vercel-tu-choi/` (chủ kho chọn «mở
hợp đồng mới», 22/11).

## Vì sao

Xoay mật khẩu vai đăng nhập có một khoảng hở đã biết (quyết định 0047, sổ xoay khoá bước 3):

- từ lúc bước `vai-dang-nhap` đặt mật khẩu mới vào cơ sở dữ liệu;
- tới lúc tên miền gắn sang bản mới;
- bản đang chạy nối bằng mật khẩu cũ, nên không nối được.

Lần đưa bản ấy đỏ giữa hai mốc thì bản thật hỏng tới lần đưa bản xanh kế.

Bước `bien` đứng sau `vai-dang-nhap`. Vậy mọi lỗi của Vercel ở bước `bien` đều rơi vào khoảng hở: token hết hạn, 403, biến
cấm, từ chối, không xác nhận, danh sách lạ khuôn. Các lỗi ấy không dính gì tới cơ sở dữ liệu. Xoay mật khẩu vai đăng nhập
lại hay đi cùng lượt với xoay `VERCEL_TOKEN` (cùng một nghi thức trong sổ xoay khoá), nên token mới sai là kịch bản thật.

Sổ tay mới thêm ở hàng `bien-vercel-tu-choi` còn nói «tên miền không đổi, khoá mới chưa có hiệu lực» cho các dòng đỏ của
`bien`. Câu ấy sai đúng trong ca này.

## Mục tiêu

- Bước `bien` chạy trước `vai-dang-nhap`. Lỗi Vercel không còn đụng tới mật khẩu, nên bản thật yên khi `bien` đỏ.
- Sổ tay nói thẳng: bước đỏ nằm sau `vai-dang-nhap` lúc vừa xoay mật khẩu thì bản thật đã mất kết nối.
- Mọi chỗ kể thứ tự bước đi theo thứ tự mới, và một ca kiểm giữ sổ tay khớp với lệnh.

## Không làm

- Dời `vai-dang-nhap` xuống sau `dung`. Như thế thu hẹp cả khoảng hở, nhưng cần biết bản dựng có nối cơ sở dữ liệu hay
  không. Thêm nữa, `kiem-nhanh` của bản mới và `cach-ly` cần mật khẩu mới đã đặt.
- Giữ hai mật khẩu song song lúc xoay.
- Đổi `make dat-khoa`.

## Cách làm

### Thứ tự mới — `tools/deploy/len-ban.mjs`

`STEPS` (hằng đã xuất):

- staging: `cau-hinh, migration, bien, vai-dang-nhap, cach-ly, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien`
- production: `cau-hinh, ban-thu-truoc, migration, bien, vai-dang-nhap, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien`

Không đổi hàm bước nào. `bien` chỉ cần `LOGIN_DATABASE_URL`, mà bước `cau-hinh` đã dựng. Nó ghi chuỗi nối chứ không nối.
`migration` vẫn đứng trước, nên migration đỏ thì chưa ghi gì ở đâu. `cach-ly` (bản thử) vẫn sau `vai-dang-nhap` vì nó nối
bằng vai đăng nhập.

Đổi chú thích đầu tệp theo thứ tự mới.

Cái giá của thứ tự mới là một trạng thái lẫn. Nó xuất hiện khi:

- `bien` đỏ sau khi đã ghi được một phần biến (Vercel từ chối hay không xác nhận một biến);
- hoặc `vai-dang-nhap` đỏ (câu đặt mật khẩu là một câu lệnh, lỗi thì mật khẩu không đổi).

Khi ấy Vercel giữ `DATABASE_URL` mang mật khẩu mới, còn cơ sở dữ liệu giữ mật khẩu cũ. Bản đang chạy không bị đụng, vì biến
chỉ vào bản qua một lần dựng. Một lần bấm dựng lại ngay trên Vercel trước khi lệnh chạy xanh thì sẽ hỏng. Thứ tự cũ hỏng
ngay mà không cần ai bấm gì, nên đây là đổi lấy được. Sổ tay dặn không làm việc ấy ở mọi hàng `bien` và hàng
`vai-dang-nhap`. Hỏi-1 nêu cái giá này cho chủ kho.

### Tệp kiểm — `tools/deploy/deploy.test.ts`

- `STEPS` của tệp kiểm import từ `len-ban.mjs` thay cho bản chép. Một ca `E1 · thứ tự khai` ghim hai danh sách của AC-1.
- `expectGreen`: lần ghi biến trước «psql vai», «psql vai» trước lệnh `vercel` đầu tiên, đúng một «psql vai».
- Ma trận bước đỏ giữ ba luật, theo vị trí trong `STEPS`:
  - trước `bien` thì 0 POST;
  - trước `dung` thì 0 lệnh `vercel`;
  - trước `vai-dang-nhap` thì 0 «psql vai».
- Ca mới `E2`: năm lý do `bien` đỏ × hai môi trường, không đặt mật khẩu.
- Ca mới `E3`: `vai-dang-nhap` đỏ sau một lần ghi biến.
- Ca mới `E4`: hàm thuần `thuTuSoTay(md)` rút tên bước theo thứ tự trong dòng «Đạt khi» của bước 2 và bước 5 của sổ đưa bản
  lên, so với `STEPS`.

### Sổ tay

- `docs/van-hanh/dua-ban-len.md`:
  - hai dòng «Đạt khi» theo thứ tự mới;
  - đoạn mở đầu «Đỏ thì làm gì» thêm ca vừa xoay mật khẩu vai đăng nhập, ba vùng:
    - đỏ ở `bien` hay trước: bản đang chạy yên;
    - đỏ ở `vai-dang-nhap`: mật khẩu chưa đổi, bản đang chạy yên, Vercel có thể đã giữ mật khẩu mới;
    - đỏ sau khi `vai-dang-nhap` đạt: bản đang chạy đã mất kết nối, sửa nguyên nhân và chạy lại ngay;
  - mọi hàng `bien` và hàng `vai-dang-nhap`: đừng bấm dựng lại trên Vercel trước khi lệnh chạy xanh;
  - hàng `cach-ly`, `dung`, `kiem-nhanh`: không ngụ ý bản đang chạy yên mà không trừ ca vừa xoay;
  - đoạn «Lần đầu ở một môi trường» theo thứ tự mới.
- `docs/van-hanh/xoay-khoa.md` bước 3: khoảng hở bắt đầu khi `vai-dang-nhap` đạt, sau `bien`, nên lỗi Vercel không mở nó.
- `docs/van-hanh/README.md` việc 10: câu thứ tự bước.

### Ghi chép

- `wiki/decisions/0048-bien-truoc-vai-dang-nhap.md`: thứ tự mới, vì sao, khoảng hở còn lại. Nối tiếp 0047, không thay.
- Dòng `wiki/log/` qua `make log`.
- E6 là lệnh kiểm nhỏ `_acceptance/bien-do-sau-xoay-mat-khau/rang/ghi-chep.mjs` (nhận `--root`, có `--tu-kiem`). Nó
  import `STEPS`, rút tên bước theo thứ tự ở trang 0048, câu README và chú thích mã, rồi so cả danh sách. `--tu-kiem`
  chạy ba bản sao phá và đòi ba thông điệp ghim. Nội dung trang 0048 (vì sao, cái giá, khoảng hở) do E5 đọc.

## Lựa chọn và căn cứ

- Chờ chủ kho: Hỏi-1 (đổi thứ tự hay chỉ sửa sổ tay).
- Máy đã quyết:
  - giữ migration trước `bien`;
  - không dời `vai-dang-nhap` sau `dung`;
  - sổ tay nói thẳng ca vừa xoay.

Căn cứ trong `decisions.jsonl`.

## Rủi ro đã biết

- Bấm dựng lại trên Vercel lúc `vai-dang-nhap` vừa đỏ sẽ chạy bằng mật khẩu chưa có trong cơ sở dữ liệu. Sổ tay dặn không
  làm.
- `dung`, `kiem-nhanh`, `cach-ly` đỏ lúc đang xoay mật khẩu vẫn để bản thật mất kết nối (khoảng hở của 0047, nay hẹp hơn).
