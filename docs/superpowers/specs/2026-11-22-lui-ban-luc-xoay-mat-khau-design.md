# Lùi bản sau khi xoay mật khẩu vai đăng nhập — thiết kế

Hồ sơ: `_acceptance/lui-ban-luc-xoay-mat-khau/`. Nguồn: Ngoài-1 của `_acceptance/bien-do-sau-xoay-mat-khau/` (chủ kho chọn
«mở hợp đồng mới» ở Cổng Bằng chứng, 22/11), cùng Ngoài-2, Ngoài-3, Ngoài-4 của hồ sơ ấy.

## Vì sao

Điều người vận hành nên làm về lùi bản ngay sau khi xoay mật khẩu vai đăng nhập đang nằm rải ở sáu chỗ:

- sổ đưa bản lên: bước 3, bước 5, bước 6, đoạn mở đầu «Đỏ thì làm gì» và ba hàng `kiem-nhanh-ten-mien`;
- sổ lùi bản: «Khi nào dùng»;
- sổ xoay khoá: bước 3 và «Đỏ thì làm gì».

Ba lượt chấm của hàng trước, lượt nào cũng tìm thêm một câu còn ngụ ý bản thật yên hoặc còn bảo lùi bản. Mỗi chỗ kể lại lý
do theo cách riêng, và vài chỗ kể sai:

- Hàng `đã lùi về bản trước` nói bản cũ «cũng không nối được», trong khi lệnh chỉ in dòng ấy sau khi bản cũ qua kiểm sức
  khoẻ, mà kiểm sức khoẻ nối qua vai đăng nhập (Ngoài-1, Ngoài-2).
- Luật vùng ba xếp `lùi bản DỪNG` vào ca mất kết nối, trong khi lúc ấy tên miền vẫn ở bản mới, mang mật khẩu mới (Ngoài-3).
- Bước 3 và bước 6 bảo lùi bản ngay khi kiểm bằng mắt thấy lỗi (Ngoài-4).

Gốc của cả bốn: sổ tay coi ca này là «khoảng hở vài phút của lượt xoay». Mã nói khác.

## Sự thật đọc từ mã

- Bước `bien` ghi `DATABASE_URL` (mang mật khẩu vai đăng nhập) vào dự án Vercel. Một bản chỉ nhận biến ấy lúc được dựng
  (bước `dung`), và giữ nó mãi.
- Bước `vai-dang-nhap` đặt mật khẩu mới vào cơ sở dữ liệu. Từ đó cơ sở dữ liệu không nhận mật khẩu cũ nữa.
- Vậy mọi bản dựng trước lượt xoay không nối được cơ sở dữ liệu nữa — không riêng mấy phút của lượt ấy, mà mãi. Lùi về một
  bản như thế, bằng đường nào cũng vậy, không bao giờ khôi phục kết nối. Chỉ bản dựng ở bước `dung` của lượt xoay hay một
  lượt sau nó mới nối được.
- Kiểm sức khoẻ (`tools/deploy/kiem-nhanh.mjs`) đòi `vai` là `dat`, và `vai` chỉ đạt khi cửa truy vấn nhận vai đăng nhập
  (`src/modules/identity/health.ts`). Sức khoẻ là thước người vận hành tự đọc được.
- `rollBack` chỉ chạy khi `kiem-nhanh-ten-mien` đỏ (bước duy nhất sau khi gắn tên miền). Nó in một trong tám dòng:
  - `đã lùi về bản trước` — chỉ sau khi tên miền về đúng bản trước và kiểm nhanh bản ấy đạt;
  - ba dòng `lùi bản DỪNG …` — không lùi gì, tên miền vẫn ở bản mới;
  - bốn dòng `lùi bản ĐỎ …` — không đọc được danh sách bản; `vercel rollback` lỗi; tên miền chưa về; tên miền đã về bản cũ
    nhưng kiểm nhanh đỏ.
- Bước đỏ trước khi gắn tên miền in `DỪNG ở <bước> — tên miền không đổi`. Tên miền không đổi thì vẫn ở bản dựng trước lượt
  này.
- `make rollback` (`tools/deploy/lui-ban.mjs`) kiểm nhanh bản đích sau khi lùi; bản đích dựng trước lượt xoay thì in
  `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt: …`. Instant Rollback trên trang Vercel không kiểm gì.

## Mục tiêu

- Một mục duy nhất, `## Lùi bản sau khi xoay mật khẩu vai đăng nhập` trong `docs/van-hanh/xoay-khoa.md`, nói luật theo
  bản dựng, cách chọn bản khi buộc phải lùi, và nghĩa của từng dòng của lệnh lúc vừa xoay.
- Mọi câu khác về lùi bản trong `docs/van-hanh/` trỏ tới mục ấy bằng một vế ngắn, không kể lại lý do.
- Một tệp kiểm thường trực giữ hai điều trên ở cả những lần sửa sổ tay sau.

## Không làm

- Không đổi lệnh (Hỏi-1 của hợp đồng): lệnh vẫn tự lùi tên miền sau `kiem-nhanh-ten-mien` đỏ, kể cả lúc vừa xoay, dù khi
  ấy nó chuyển tên miền từ bản mới còn nối được sang bản cũ không nối được. Khuyến nghị: một hàng riêng hạng T3 — trước
  khi tự lùi, kiểm sức khoẻ bản trước; bản trước không qua thì không lùi.
- Không sửa Ngoài-5 của hàng trước (chú thích `len-ban.mjs`, nhật ký wiki): không phải câu lùi bản.
- Không khuyên «lùi tới» bản mới của lượt xoay bằng `make rollback`: bản ấy vừa đỏ ở kiểm nhanh tên miền vì một lý do khác,
  và chọn nó hay không là việc của người giữ kho mã.
- Không sửa trang quyết định 0048: là bản ghi của hàng trước, không phải sổ tay.

## Cách làm

### Mục mới trong sổ xoay khoá

Đặt sau «Các bước», trước «Đỏ thì làm gì». Ba phần:

1. **Luật.** Mỗi bản giữ mật khẩu vai đăng nhập của lúc nó được dựng. Từ khi một lượt in `vai-dang-nhap đạt` với mật khẩu
   mới, mọi bản dựng trước lượt ấy không nối được cơ sở dữ liệu nữa, mãi. Lùi về chúng — lệnh tự lùi, `make rollback`,
   Instant Rollback — không khôi phục kết nối. Chỉ bản dựng ở bước `dung` của lượt xoay hay lượt sau mới nối được. Thước:
   sức khoẻ `"vai":"dat"`.
2. **Phải lùi thì chọn bản nào.** Tìm giờ của lượt xoay (tab Actions › Deploy, lượt đầu in `vai-dang-nhap đạt` sau
   `make dat-khoa … XOAY=1`; hoặc mục sổ wiki ghi lúc xoay). Danh sách của `make rollback` in `tạo <giờ UTC>` của từng bản:
   chỉ chọn bản tạo sau giờ ấy. Không có bản nào như thế ngoài bản hỏng: đừng lùi, sửa và đưa bản sửa lên.
3. **Bảng dòng của lệnh lúc vừa xoay.** Cột «Dòng», «Bản đang chạy», «Làm gì»:
   - đỏ ở `bien` hay trước (lượt xoay đầu): mật khẩu chưa đổi, bản đang chạy yên;
   - `vai-dang-nhap` đỏ: mật khẩu chưa đổi ở lượt này, Vercel đã giữ mật khẩu mới, đừng dựng lại trên Vercel;
   - lượt chạy lại sau một lượt đã in `vai-dang-nhap đạt`: bản đang chạy đã mất kết nối từ lượt trước, bước đỏ ở đâu
     cũng vậy, trừ khi sức khoẻ còn `vai` đạt;
   - đỏ ở một bước sau `vai-dang-nhap` rồi `DỪNG ở <bước> — tên miền không đổi` (`cach-ly`, `dung`, `kiem-nhanh`,
     `gan-ten-mien`): tên miền vẫn ở bản dựng trước lượt xoay, đã mất kết nối; đừng lùi, sửa và chạy lại ngay;
   - `kiem-nhanh-ten-mien` đỏ rồi `đã lùi về bản trước`: bản trước vừa qua kiểm sức khoẻ, kể cả `vai`, nên nó nối được —
     lúc vừa xoay thì chỉ khi bản trước dựng ở một lượt sau lượt xoay; mở sức khoẻ để chắc;
   - ba dòng `lùi bản DỪNG`: tên miền vẫn ở bản mới của lượt này, mang mật khẩu mới, không mất kết nối vì mật khẩu; đừng
     chọn bản trong danh sách in kèm;
   - `lùi bản ĐỎ — không đọc được danh sách bản`, `— vercel rollback lỗi`, `— tên miền chưa về bản`: không chắc tên miền ở
     đâu; mở sức khoẻ; đừng lùi tay;
   - `lùi bản ĐỎ — tên miền đã về bản <id> nhưng kiểm nhanh đỏ`: tên miền đã về bản dựng trước lượt xoay, mất kết nối —
     dòng hay gặp nhất khi lượt xoay đỏ ở bước cuối; sửa nguyên nhân của dòng `kiem-nhanh-ten-mien ĐỎ` và chạy lại ngay;
   - `rollback <ENV>: kiem-nhanh-ten-mien ĐỎ — vai nối chưa đạt`: bản vừa chọn dựng trước lượt xoay; bản cũ hơn cũng vậy.

### Câu trỏ ở chỗ khác

Một vế, cùng một khuôn: `Vừa xoay mật khẩu vai đăng nhập: đọc mục «Lùi bản sau khi xoay mật khẩu vai đăng nhập» của
[xoay-khoa.md](xoay-khoa.md) trước khi lùi.` Trong chính sổ xoay khoá thì bỏ liên kết.

- Sổ đưa bản lên: bước 3, 5, 6; đoạn mở đầu «Đỏ thì làm gì» (ba vùng chuyển sang bảng của mục mới, đoạn ấy chỉ còn câu
  trỏ); hàng `gan-ten-mien` và ba hàng `kiem-nhanh-ten-mien` thôi kể lý do, chỉ trỏ.
- Sổ lùi bản: đoạn mở đầu (câu «bảo đảm bản trước chạy được trên cơ sở dữ liệu ấy» sai lúc vừa xoay), «Khi nào dùng», bước
  4 «bản cũ hơn», bước 5 «trang Vercel», hàng `kiem-nhanh-ten-mien ĐỎ` và hàng Instant Rollback.
- Sổ xoay khoá: bước 3 «Đỏ thì» (khoảng hở) giữ hai câu đầu, phần lùi bản chuyển vào mục mới; «Đỏ thì làm gì» dòng hai
  chỉ trỏ.
- README: bảng lệnh (`make rollback`) và việc 13 «lùi bản theo lui-ban.md».

Giữ nguyên các luật đã ký của hàng trước: thứ tự trong các dòng «Đạt khi», hàng `bien` và `vai-dang-nhap` dặn không dựng
lại trên Vercel, đoạn «đừng bấm dựng lại (Redeploy)».

### Thước — `tests/so-tay-lui-ban.test.ts`

Đọc mọi tệp `docs/van-hanh/*.md`, chia thành đoạn: một đoạn văn, một mục danh sách (gồm dòng nối tiếp), một hàng bảng; bỏ
tiêu đề. Bốn luật, mỗi luật một hàm trả danh sách lỗi:

- **Một chỗ.** Đúng một tiêu đề `## Lùi bản sau khi xoay mật khẩu vai đăng nhập` trong cả thư mục, và nó ở `xoay-khoa.md`.
- **Đủ dòng.** Các hàng bảng của mục nêu mọi tên bước của `STEPS` (hai môi trường, khớp nguyên tên trong backtick nên
  `kiem-nhanh` không ăn theo `kiem-nhanh-ten-mien`), mọi dòng lùi bản mà `rollBack` trong `tools/deploy/len-ban.mjs` có
  thể in, và dòng `kiem-nhanh-ten-mien ĐỎ` của `tools/deploy/lui-ban.mjs`. Dòng rút từ chính mã nguồn: chuỗi trong
  `say(…)` và `stop(…)` của `rollBack`, cắt ở chỗ đầu tiên có `${`, `(` hay `,`; ca kiểm ghim đủ chín chuỗi rút được và đòi
  chúng phân biệt. Chỉ hàng bảng được tính, không phần Luật. Mã thêm một dòng lùi bản mới thì thước đỏ tới khi bảng kể nó.
- **Trỏ tới.** Ngoài mục ấy, mọi đoạn khớp mẫu lùi bản (`lùi`, `rollback`, `lui-ban.md`, không phân hoa thường) mang câu
  trỏ: tên mục trong «», kèm liên kết `xoay-khoa.md` khi đoạn ở tệp khác. Riêng `lui-ban.md`: luật này áp cho đoạn mở đầu,
  «Khi nào dùng» (ít nhất một mục), và mọi đoạn khớp mẫu lối thử bản khác (`một bản cũ hơn`, `trang Vercel`, `Instant
Rollback`, `kiem-nhanh-ten-mien ĐỎ`). Thêm: ngoài `xoay-khoa.md`, mọi đoạn nhắc xoay mật khẩu vai đăng nhập (mẫu
  `xoay` và `mật khẩu vai đăng nhập` trong cùng đoạn) mang câu trỏ.
- **Không kể lại.** Ngoài mục ấy, không đoạn nào chứa `mật khẩu cũ` — lý do lùi bản không cứu được chỉ nằm một chỗ.

Văn bản chuẩn về NFC trước khi so. Mỗi lỗi in tệp, luật và đầu đoạn (60 ký tự). Chiều đỏ chạy trên bản sao nội dung thật trong bộ nhớ: bỏ câu trỏ ở bước 6 của
sổ đưa bản lên; thêm câu «mật khẩu cũ» vào sổ lùi bản; bỏ dòng `lùi bản DỪNG — không đọc được mã bản mới` khỏi mục; thêm
một tiêu đề trùng; thêm một dòng lùi bản giả vào bản sao mã `rollBack`; thêm một tệp sổ tay mới có câu lùi bản không trỏ;
bỏ câu trỏ khỏi đoạn mở đầu sổ lùi bản. Mỗi chiều đỏ ghim đúng thông điệp.

Tệp đặt ở `tests/` như các ca kiểm tài liệu khác của kho (`tests/khong-khoa-bi-mat.test.ts`), không ở `tools/`: nó chỉ đọc
mã lệnh, không đổi công cụ.

### Ghi chép

Một dòng nhật ký wiki bằng `make log`. Không trang quyết định mới: đây là cách viết sổ tay, không phải lựa chọn kỹ thuật.
