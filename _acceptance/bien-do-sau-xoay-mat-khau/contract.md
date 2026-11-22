---
schema_version: 1
feature: Bước bien chạy trước bước vai-dang-nhap — Vercel lỗi lúc đang xoay mật khẩu vai đăng nhập thì bản thật không bị đụng; sổ tay nói thẳng khi nào bản đang chạy đã mất kết nối
slug: bien-do-sau-xoay-mat-khau
owner: phanlemanh@gmail.com
risk_tier: T3
surfaces: [cli, docs]
status: implemented
approved_by: Manh Phan
approved_at: 2026-11-22
design_doc: docs/superpowers/specs/2026-11-22-bien-do-sau-xoay-mat-khau-design.md
---

# Acceptance Contract: bien-do-sau-xoay-mat-khau

## Context

`make deploy` chạy chín bước cố định. Bước `vai-dang-nhap` đặt mật khẩu vai đăng nhập vào cơ sở dữ liệu, ngay sau
migration. Bước `bien` đẩy sáu biến, trong đó có `DATABASE_URL` mang mật khẩu ấy, sang dự án Vercel, ngay trước bước dựng.
Bản đang giữ tên miền chỉ nhận biến mới qua một lần dựng.

Khi chủ kho vừa xoay mật khẩu vai đăng nhập (`make dat-khoa … XOAY=1`), từ lúc `vai-dang-nhap` chạy:

- bản đang chạy vẫn nối bằng mật khẩu cũ;
- cơ sở dữ liệu đã đổi sang mật khẩu mới;
- nên bản đang chạy không nối được cơ sở dữ liệu.

Khoảng hở này đóng lại khi tên miền gắn sang bản mới. Quyết định 0047 đã chấp nhận nó và `docs/van-hanh/xoay-khoa.md`
(bước 3) đã khai.

Hàng `bien-vercel-tu-choi` (PR #104, gộp 22/11) thêm ba cách bước `bien` đỏ. Lượt chấm của hàng ấy tìm ra hai điều:

- các hàng `bien` của sổ tay nói «tên miền không đổi, khoá mới chưa có hiệu lực», sai ngay sau khi xoay mật khẩu vai đăng
  nhập (Ngoài-1);
- mọi lý do Vercel đỏ ở bước `bien` — token hết hạn, 403, từ chối hay không xác nhận biến — đều rơi vào khoảng hở, dù
  chúng không liên quan gì tới cơ sở dữ liệu.

Chủ kho chọn mở hợp đồng mới cho Ngoài-1 ở Cổng Bằng chứng ngày 22/11.

Nhánh cắt từ `origin/main` ở `51b5c712`.

Source input: prompt — Ngoài-1 của `_acceptance/bien-vercel-tu-choi/`; chủ kho chọn làm việc này trong phiên này.

## Criteria

- AC-1: Given repo ở nhánh này; When đọc thứ tự bước của `make deploy`; Then thứ tự là:
  - `staging`: `cau-hinh, migration, bien, vai-dang-nhap, cach-ly, dung, kiem-nhanh, gan-ten-mien, kiem-nhanh-ten-mien`;
  - `production`: `cau-hinh, ban-thu-truoc, migration, bien, vai-dang-nhap, dung, kiem-nhanh, gan-ten-mien,
    kiem-nhanh-ten-mien`.

  Đường xanh ở cả hai môi trường in chín dòng đạt theo đúng thứ tự ấy. Thứ tự gọi ra ngoài là:
  1. lần áp migration;
  2. lần ghi biến sang Vercel;
  3. lần đặt mật khẩu vai đăng nhập;
  4. lệnh `vercel` đầu tiên.

  (Phụ thuộc Hỏi-1.)
- AC-2: Given máy giả làm bước `bien` đỏ theo từng lý do: biến cấm, Vercel trả 403, Vercel từ chối ghi biến, Vercel không
  xác nhận đủ sáu biến, danh sách biến lạ khuôn; When chạy `make deploy` ở hai môi trường; Then:
  - lệnh dừng ở `bien` với dòng đỏ của lý do ấy;
  - mật khẩu vai đăng nhập không được đặt: `psql` không nhận câu đặt mật khẩu nào, 0 lần;
  - không lệnh `vercel` nào chạy, tên miền không đổi.

  Đây là chỗ hở vòng này đóng.
- AC-3: Given máy giả làm bước `vai-dang-nhap` đỏ (câu đặt mật khẩu lỗi); When chạy `make deploy`; Then lệnh dừng ở
  `vai-dang-nhap`, sau đúng một lần ghi biến sang Vercel và đúng một lần gửi câu đặt mật khẩu, và không lệnh `vercel` nào
  chạy. Ma trận bước đỏ của tệp kiểm giữ cùng độ chặt cũ, đặt lại theo
  thứ tự mới:
  - bước đỏ trước `bien`: không ghi gì lên Vercel;
  - bước đỏ trước `dung`: không chạy lệnh `vercel` nào;
  - bước đỏ trước `vai-dang-nhap`: không đặt mật khẩu nào.
- AC-4: Given sổ tay `docs/van-hanh/dua-ban-len.md`; When đọc dòng «Đạt khi» của bước 2 (bản thử) và bước 5 (bản thật);
  Then các dòng đạt kể đúng thứ tự bước mà lệnh đưa bản lên dùng. Một ca kiểm đọc thứ tự từ chính lệnh, không từ một bản
  chép tay, và đỏ khi sổ tay lệch.
- AC-5: Given sổ tay `docs/van-hanh/dua-ban-len.md` và `docs/van-hanh/xoay-khoa.md`; When người vận hành vừa xoay mật khẩu
  vai đăng nhập và thấy một bước đỏ; Then mục «Đỏ thì làm gì» chia ba vùng:
  - đỏ ở `bien` hay trước đó: bản đang chạy không bị đụng;
  - đỏ ở `vai-dang-nhap`: mật khẩu chưa đổi, bản đang chạy không bị đụng, nhưng Vercel có thể đã giữ mật khẩu mới;
  - đỏ sau khi `vai-dang-nhap` đạt: bản đang chạy đã mất kết nối cơ sở dữ liệu, sửa nguyên nhân và chạy lại ngay.

  Vùng thứ ba viết thành một luật theo vị trí so với `vai-dang-nhap`, không phải danh sách tên bước. Nó phủ cả lúc lệnh tự
  lùi tên miền về bản trước (sau `kiem-nhanh-ten-mien` đỏ): bản ấy cũng giữ mật khẩu cũ.

  Thêm nữa:
  - mọi hàng `bien` và hàng `vai-dang-nhap` dặn không bấm dựng lại trên Vercel trước khi lệnh chạy xanh;
  - không hàng nào của một bước chạy sau `vai-dang-nhap` (`cach-ly`, `dung`, `kiem-nhanh`, `gan-ten-mien`,
    `kiem-nhanh-ten-mien`, kể cả các dòng lùi bản) nói hay ngụ ý bản đang chạy yên mà không trừ ca vừa xoay mật khẩu;
  - các dòng lùi bản dặn: vừa xoay mật khẩu vai đăng nhập thì đừng lùi về bản cũ (`make rollback`, Instant Rollback) — sửa
    nguyên nhân và chạy lại;
  - bước 3 của sổ xoay khoá nói khoảng hở bắt đầu khi `vai-dang-nhap` đạt, sau bước `bien`;
  - trang quyết định 0048 nói thứ tự mới, vì sao, cái giá (trạng thái lẫn trên Vercel) và khoảng hở còn lại.

  Không câu nào bảo in hay dán giá trị khoá.
- AC-6: Given wiki và sổ tay của kho; When đọc thứ tự bước được kể ở ngoài lệnh; Then các chỗ sau bằng đúng thứ tự lệnh
  dùng:
  - có một trang `wiki/decisions/0048-…` (nội dung do AC-5 đòi);
  - câu kể thứ tự ở `docs/van-hanh/README.md` (việc 10);
  - hai dòng chú thích đầu `tools/deploy/len-ban.mjs`.

  Một lệnh kiểm rút thứ tự từ những chỗ ấy và đỏ khi lệch bất kỳ bước nào.
- AC-7: Given nhánh của vòng; When chạy `make check`; Then thoát 0.

## Câu hỏi cho chủ kho

- **Hỏi-1** — Đổi thứ tự lệnh đưa bản lên (bước `bien` trước `vai-dang-nhap`), hay chỉ sửa câu chữ sổ tay?
  - Máy khuyên đổi thứ tự. Lỗi Vercel không còn mở khoảng hở lúc xoay khoá, nhất là khi `VERCEL_TOKEN` được xoay cùng
    lượt. Sổ tay vẫn được sửa theo AC-5.
  - Cái giá: khi `bien` đỏ sau khi đã ghi được một phần biến, hoặc `vai-dang-nhap` đỏ, Vercel giữ mật khẩu mới trong khi
    cơ sở dữ liệu còn mật khẩu cũ. Bản đang chạy vẫn yên, nhưng một lần bấm dựng lại ngay trên Vercel trước khi lệnh chạy
    xanh sẽ làm hỏng bản thật. Sổ tay dặn không làm việc ấy. Thứ tự cũ thì hỏng ngay, không cần ai bấm gì.
  - Chỉ sửa sổ tay thì rẻ hơn: là việc tài liệu, không qua vòng nghiệm thu. Đổi lại, bản thật vẫn mất cơ sở dữ liệu mỗi
    khi bước `bien` đỏ lúc đang xoay. Khi ấy AC-1 đến AC-3 và phần thứ tự của AC-6 bị bỏ.

## Coverage

Không quét bằng `morphological-scan` (dòng `descope` trong sổ quyết định). Không gian là thứ tự chín bước × bước đỏ × hai
môi trường.

| Trục | Giá trị | Tiêu chí |
| --- | --- | --- |
| Thứ tự | đường xanh staging · đường xanh production | AC-1 |
| Bước đỏ trước `vai-dang-nhap` | cau-hinh · ban-thu-truoc · migration · bien (năm lý do) | AC-3 · AC-3 · AC-3 · AC-2 |
| Bước đỏ từ `vai-dang-nhap` | vai-dang-nhap · cach-ly · dung · kiem-nhanh | AC-3 |
| Người vận hành | thứ tự trong sổ tay · ba vùng đỏ lúc xoay · lời dặn không dựng lại trên Vercel · hàng các bước sau · sổ xoay khoá | AC-4 · AC-5 · AC-5 · AC-5 · AC-5 |
| Ghi chép | quyết định 0048 · README · chú thích mã | AC-5, AC-6 · AC-6 · AC-6 |

**Để sau:**
- dời `vai-dang-nhap` xuống sau `dung` để thu hẹp cả khoảng hở (dòng `descope` trong sổ);
- chặn bằng máy việc dựng lại từ phía Vercel khi Vercel đã giữ mật khẩu mới mà cơ sở dữ liệu chưa: vòng này chỉ dặn trong
  sổ tay.

## Out of scope

- Dời `vai-dang-nhap` xuống sau `dung`, hay giữ hai mật khẩu song song lúc xoay.
- Đổi cách xoay khoá (`make dat-khoa`), hay đổi sáu biến của bước `bien`.
- Thử trên dự án Vercel và Supabase thật: lần đưa bản thử đầu sau khi gộp là lần chứng thật.

## Notes

- Hạng T3: vòng sửa `tools/**`.
- Không có màn nào: không có nghi thức thiết kế giao diện, không có đặc tả UX (dòng `descope` trong sổ).
