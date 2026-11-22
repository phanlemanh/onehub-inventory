---
schema_version: 1
feature: Ca lùi bản sau khi xoay mật khẩu vai đăng nhập viết một lần trong sổ xoay khoá; mọi câu lùi bản khác của sổ vận hành trỏ tới đó, và một ca kiểm giữ luật ấy
slug: lui-ban-luc-xoay-mat-khau
owner: phanlemanh@gmail.com
risk_tier: T2
surfaces: [docs]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-22
design_doc: docs/superpowers/specs/2026-11-22-lui-ban-luc-xoay-mat-khau-design.md
---

# Acceptance Contract: lui-ban-luc-xoay-mat-khau

## Context

Điều người vận hành nên làm về lùi bản ngay sau khi xoay mật khẩu vai đăng nhập đang nằm rải ở sổ đưa bản lên (bước 3, 5, 6,
đoạn mở đầu «Đỏ thì làm gì», hàng `gan-ten-mien` và ba hàng `kiem-nhanh-ten-mien`), sổ lùi bản và sổ xoay khoá (bước 3, «Đỏ
thì làm gì»). Ba lượt chấm của hàng `bien-do-sau-xoay-mat-khau`, lượt nào cũng tìm thêm một câu còn ngụ ý bản thật yên hoặc
còn bảo lùi bản; vài câu còn kể sai điều lệnh in (Ngoài-1 đến Ngoài-4 của hồ sơ ấy).

Gốc chung: sổ tay coi ca này là khoảng hở vài phút của lượt xoay. Mã nói khác. Mỗi bản trên Vercel giữ mật khẩu vai đăng
nhập của lúc nó được dựng. Sau khi bước `vai-dang-nhap` đặt mật khẩu mới, mọi bản dựng trước lượt xoay không bao giờ nối lại
được, kể cả khi lùi nhiều ngày sau một lượt xanh.

Chủ kho chọn «mở hợp đồng mới» cho Ngoài-1 ở Cổng Bằng chứng ngày 22/11, với hình: viết ca ấy thành một mục duy nhất trong sổ
xoay khoá, các sổ khác chỉ trỏ tới.

Nhánh cắt từ `origin/main` ở `6ce94d9f` (PR #105 đã gộp).

Source input: prompt — Ngoài-1 của `_acceptance/bien-do-sau-xoay-mat-khau/`.

## Criteria

- AC-1: Given `docs/van-hanh/xoay-khoa.md`; When người vận hành vừa xoay mật khẩu vai đăng nhập và cân nhắc lùi bản; Then có
  đúng một mục `## Lùi bản sau khi xoay mật khẩu vai đăng nhập` trong cả `docs/van-hanh/`, ở sổ xoay khoá, và mục ấy nói:
  - luật theo bản dựng: mỗi bản giữ mật khẩu của lúc nó được dựng; từ khi một lượt in `vai-dang-nhap đạt` với mật khẩu mới,
    mọi bản dựng trước lượt ấy không nối được cơ sở dữ liệu nữa, mãi, không riêng mấy phút của lượt ấy;
  - lùi về một bản như thế — lệnh tự lùi, `make rollback`, Instant Rollback — không khôi phục kết nối; chỉ bản dựng ở bước
    `dung` của lượt xoay hay một lượt sau mới nối được;
  - phải lùi thì chọn bản nào: chỉ bản tạo sau lượt xoay (so cột giờ tạo của danh sách `make rollback` với giờ lượt xoay);
    không có thì không lùi, sửa và đưa bản sửa lên;
  - thước người vận hành tự đọc: sức khoẻ `"vai":"dat"` là bản ấy đang nối được.

  Điều mục nói khớp `tools/deploy/len-ban.mjs`, `tools/deploy/lui-ban.mjs`, `tools/deploy/kiem-nhanh.mjs` và
  `src/modules/identity/health.ts`. (judgment)
- AC-2: Given mục ấy; When đọc bảng dòng của lệnh lúc vừa xoay; Then mọi tên bước của hai môi trường, mọi dòng lùi bản mà
  lệnh đưa bản lên có thể in, và dòng `kiem-nhanh-ten-mien ĐỎ` của `make rollback` đều nằm trong ô «Dòng» của một hàng
  bảng. Một ca kiểm rút các dòng ấy từ chính mã, không từ bản chép tay, và đỏ khi ô «Dòng» của bảng thiếu một dòng hay một
  bước — nhắc ở cột khác hay ở đoạn văn không tính. Bảng định nghĩa rõ «trước khi đổi mật khẩu» (mọi lượt tới và gồm lượt
  đầu in `vai-dang-nhap đạt` với mật khẩu mới) và «lượt chạy lại» (mọi lượt sau đó, tới lượt đầu in `xong`). Với mỗi dòng,
  bảng nói bản đang giữ tên miền ra sao và làm gì, đúng với mã:
  - `đã lùi về bản trước`: bản trước vừa qua kiểm sức khoẻ, kể cả `vai`, nên lúc kiểm nó nối được;
  - ba dòng `lùi bản DỪNG`: tên miền vẫn ở bản mới của lượt này, không mất kết nối vì mật khẩu;
  - `lùi bản ĐỎ — tên miền đã về bản … nhưng kiểm nhanh đỏ`: tên miền đã về bản dựng trước lượt xoay, mất kết nối, với lý
    do đúng là lý do máy thật in cho bản không nối được; hàng `make rollback` cũng vậy — một ca kiểm rút lý do ấy từ mã kiểm
    nhanh và đỏ khi hai hàng ấy nêu lý do khác;
  - `lùi bản ĐỎ — không đọc được danh sách bản của Vercel`: dòng phụ, luôn in sau một dòng lùi bản khác; tên miền ở đâu là
    theo dòng đứng trước nó;
  - bước đỏ sau `vai-dang-nhap` mà tên miền không đổi: tên miền vẫn ở bản dựng trước lượt xoay, mất kết nối;
  - đỏ ở `bien` hay trước, hay ở `vai-dang-nhap`: trước khi đổi mật khẩu thì bản đang chạy yên; ở lượt chạy lại thì bản đang
    chạy đã mất kết nối từ lượt trước.
- AC-3: Given mọi tệp `docs/van-hanh/*.md`; When một ca kiểm chia chúng thành đoạn (đoạn văn, mục danh sách, hàng bảng) và
  tìm theo mẫu chữ; Then mọi sổ có đoạn nói về lùi bản (`lùi`, `rollback`, `lui-ban.md`), về việc bản đang chạy yên, hay về
  xoay mật khẩu vai đăng nhập, có một dòng chặn là đoạn đầu tiên ngay dưới tiêu đề: một dòng trích dẫn nêu tên mục trong «»
  (kèm liên kết `xoay-khoa.md` khi sổ không phải sổ xoay khoá) và nói mục ấy thắng mọi câu của sổ về lùi bản và về bản đang
  chạy. Câu trỏ ở từng câu không bắt buộc. Ca kiểm đỏ, ghim tên tệp, khi sổ thiếu dòng chặn hay dòng chặn không đứng đầu,
  kể cả ở một sổ mới.
- AC-4: Given cùng các tệp ấy; When ca kiểm tìm câu kể lại; Then ngoài mục ấy không đoạn nào chứa `mật khẩu cũ`. Ca kiểm đỏ,
  ghim tên tệp và đầu đoạn, khi một đoạn kể lại.
- AC-5: Given các sổ đã sửa; When đọc như người vận hành; Then:
  - dòng chặn đầu mỗi sổ đọc được ngay: khi nào nó áp, và rằng mục thắng mọi câu của sổ về lùi bản và về bản đang chạy;
  - mục, đọc cùng dòng chặn, đủ để người vừa xoay không lùi về bản dựng trước lượt xoay dù một câu khác của sổ bảo lùi;
  - các luật đã ký của hàng trước còn nguyên: các dòng «Đạt khi» kể đúng thứ tự bước; hàng `bien` và `vai-dang-nhap` dặn
    không bấm dựng lại trên Vercel trước khi lệnh chạy xanh;
  - không câu nào bảo in, dán hay gửi giá trị khoá. (judgment)
- AC-6: Given nhánh của vòng; When chạy `make check`; Then thoát 0.

## Câu hỏi cho chủ kho

- **Hỏi-1** — Vòng này chỉ sửa sổ tay, hay sửa luôn lệnh đưa bản lên?
  - Sự thật: lúc vừa xoay mật khẩu, nếu bước `kiem-nhanh-ten-mien` đỏ vì một lý do khác, lệnh tự lùi tên miền từ bản mới
    (còn nối được) về bản trước (dựng trước lượt xoay, không nối được). Lệnh tự làm bản thật mất kết nối.
  - Máy khuyên: giữ vòng này chỉ sổ tay, đúng hình đã chọn, và mở ngay một hàng riêng hạng T3 cho lệnh — trước khi tự lùi,
    kiểm sức khoẻ bản trước; bản trước không qua thì không lùi, tên miền ở lại bản mới.
  - Cái giá: tới khi hàng ấy xong, ca trên vẫn xảy ra; sổ tay mới gọi đúng tên nó (dòng `lùi bản ĐỎ — tên miền đã về bản …
    nhưng kiểm nhanh đỏ`) và dặn chạy lại ngay.
  - Lối khác: nâng vòng này lên T3, sửa lệnh cùng lúc. Thêm một cổng duyệt kế hoạch và một lượt chấm mã; AC-2 khi ấy đổi
    theo hành vi mới của lệnh.

## Coverage

Không quét bằng `morphological-scan` (dòng `descope` trong sổ quyết định): mọi trục là danh sách đọc thẳng từ mã và thư mục.

| Trục | Giá trị | Tiêu chí |
| --- | --- | --- |
| Mục mới | luật theo bản dựng · lùi không cứu · cách chọn bản · thước sức khoẻ | AC-1 |
| Dòng của lệnh | tên bước của hai môi trường · tám dòng lùi bản của `rollBack` · dòng kiểm của `make rollback` · Instant Rollback | AC-2, AC-1 |
| Lượt | lượt xoay đầu · lượt chạy lại sau lượt đã qua `vai-dang-nhap` · lùi nhiều ngày sau một lượt xanh | AC-2, AC-1 |
| Tệp sổ tay | sổ đưa bản lên · sổ lùi bản · sổ xoay khoá · README · tệp mới trong thư mục | AC-3, AC-4 |
| Kiểu câu | sổ có câu về lùi bản, bản đang chạy yên hay xoay mật khẩu (cần dòng chặn) · câu kể lý do «mật khẩu cũ» | AC-3, AC-4 |
| Câu chữ | dòng chặn đọc được ngay · mục thắng câu khác của sổ · luật đã ký giữ nguyên · không lộ khoá | AC-5 |

## Out of scope

- Đổi lệnh: lệnh vẫn tự lùi tên miền sau `kiem-nhanh-ten-mien` đỏ, kể cả lúc vừa xoay, dù khi ấy nó chuyển tên miền từ bản
  mới còn nối được sang bản cũ không nối được (theo Hỏi-1; khuyến nghị là một hàng riêng hạng T3).
- Khuyên «lùi tới» bản mới của lượt xoay bằng `make rollback` để nối lại nhanh.
- Ngoài-5 của hàng trước: chú thích đầu `tools/deploy/len-ban.mjs` và dòng nhật ký wiki nói «lỗi Vercel».
- Sửa trang quyết định 0048 hay các trang wiki khác.

## Notes

- Hạng T2: vòng sửa `docs/van-hanh/**` và thêm `tests/so-tay-lui-ban.test.ts`; không chạm `tools/**`.
- Không có màn nào: không có nghi thức thiết kế giao diện, không có đặc tả UX (dòng `descope` trong sổ).
- Đổi khuôn ở dừng-vá sau lượt chấm 2 (chủ kho chọn «đổi khuôn», 2026-11-22): câu trỏ ở từng câu không đóng được lớp câu
  ngụ ý trong văn xuôi — mỗi lượt sửa mở rộng mẫu chữ thì lượt chấm kế tìm thêm một câu viết khác chữ. Khuôn mới đặt một
  dòng chặn ở đầu mỗi sổ (AC-3); các câu trỏ đã thêm ở lượt trước được giữ, không bắt buộc. Lượt 3 là lượt cuối trước trần.
- Vòng này thay một phần AC-5 của hồ sơ `bien-do-sau-xoay-mat-khau`: ba vùng của đoạn mở đầu «Đỏ thì làm gì» sổ đưa bản lên
  chuyển vào bảng của mục mới; đoạn ấy chỉ còn câu trỏ.
