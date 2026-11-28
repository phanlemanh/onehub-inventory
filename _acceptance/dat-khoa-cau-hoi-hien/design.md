# make dat-khoa hiện câu hỏi khoá trên dòng riêng — ghi chú thiết kế

Hồ sơ: `_acceptance/dat-khoa-cau-hoi-hien/`. PR #134, nhánh `fix/dat-khoa-prompt-visible`. Ngày 2026-11-28.

## Vấn đề

Ngày 28/11/2026 chủ kho chạy `make dat-khoa` để dán khoá cho lần đưa bản lên đầu tiên. Lệnh chờ dán nhưng màn trống:
không câu hỏi nào hiện, người không biết đang được hỏi khoá nào. Hàm hỏi `terminalAsk` viết câu hỏi lên dòng nhập rồi
mới để readline hỏi với lời nhắc rỗng. Khi bắt đầu hỏi, readline đưa con trỏ về đầu dòng và xoá từ đó trở xuống
(`ESC[1G ESC[0J`), nên câu hỏi vừa viết bị xoá; terminal vẽ lại dòng nhập (đổi cỡ bảng Terminal) cũng xoá như vậy.

## Cách làm của PR

Trong `tools/deploy/dat-khoa.mjs`, chỉ hàm `terminalAsk` đổi:

- câu hỏi viết kèm một lần xuống dòng, TRƯỚC khi tạo readline — nó nằm trên dòng đã xong, readline chỉ xoá dòng nhập
  bên dưới;
- readline vẫn tắt hiện chữ (`_writeToOutput` rỗng), nên khoá dán vào không lên màn;
- đầu vào không phải terminal (ống dẫn, bài kiểm) vẫn đọc từng dòng như cũ;
- hàm nhận `input`/`output` để bài kiểm `tools/deploy/dat-khoa-ask.test.ts` chạy trên một terminal giả (PassThrough).

## Vòng nghiệm thu chứng gì

Bài kiểm của PR chạy trên terminal giả, không phải terminal thật. Vòng đo thêm trên terminal thật của hệ điều hành:

1. `rang/pty.py` mở một pseudo-terminal 200 cột, chạy `make dat-khoa ENV=staging`, và khi một câu hỏi hiện thì gửi câu
   trả lời kèm Enter như người dán. Mọi byte terminal hiện được ghi lại.
2. `rang/man-hinh.mjs` dựng lại màn lúc lệnh kết thúc từ các byte ấy (dời con trỏ, xoá dòng, xoá màn).
3. `gh` giả đứng đầu PATH: trả lời các lệnh đọc (đã đăng nhập, kho, môi trường, khoá công khai, danh sách khoá rỗng) và
   ghi tên + giá trị mỗi `gh secret set` vào sổ của lượt đo. Phép đo dừng trước khi chạy gì nếu `gh` trên PATH không phải
   bản giả. Giá trị khoá đều là giá trị thử; không khoá thật, không mạng.
4. Năm ca: `tty-that` (AC-1, AC-2), `tty-doi-co` (AC-1: terminal 80 cột đổi xuống 60 cột giữa lúc dán chuỗi pooler — ca
   đòi thấy readline vẽ lại dòng nhập sau lần đổi cỡ, không thì ca không đo gì), `khong-tty` (AC-3, câu hỏi chỉ ra luồng
   lỗi), `ban-cu-mat-cau-hoi` (AC-4 b — mã ở điểm rẽ với main, đúng bản chủ kho gặp lỗi), `gh-gia` (chốt an toàn).
   `--tu-kiem` chạy mười một bản phá: bảy bản sao mã đổi một chỗ (thứ tự cũ, thứ tự cũ khi đổi cỡ, bỏ tắt hiện chữ, nhận
   sai câu trả lời, bỏ mã hoá mật khẩu, sinh khoá sai độ dài, hỏi ra luồng ra) cùng ống dẫn thiếu một dòng, lần chạy không
   đổi cỡ, màn lành đổi chỗ hai câu, và một chuỗi điều khiển lạ. Mật khẩu thử mang @ và # để đường mã hoá có việc làm.
   Mô hình màn từ chối mọi chuỗi điều khiển nó không mô hình, nên một chuỗi nó hiểu sai không thể cho xanh lặng lẽ.
5. `rang/bai-kiem.mjs` chạy chính bài kiểm của PR trên hai bản sao mã: mã của PR (xanh) và thứ tự cũ (đỏ đúng chỗ đòi câu
   hỏi trên dòng riêng) — AC-4 a.
6. `rang/pham-vi.mjs` (AC-5), `rang/bai-deploy.sh` và các lệnh chung (AC-6), `rang/ci.mjs` (AC-7, chỉ đọc).

Đo trước Cổng Phạm vi (28/11, bản chép 5d2d1e32): `kiem 5/5`, `tu-kiem 12/12`, `bai-kiem 2/2`, `pham-vi` xanh, 200 bài
kiểm của `tools/deploy` xanh. Bản trước PR mất 5/5 câu hỏi trên màn; byte ghi lại cho thấy đúng chuỗi `ESC[1G ESC[0J`.
Khi đổi cỡ, readline vẽ lại dòng nhập thêm một lần (cũng `ESC[1G ESC[0J`, không dời con trỏ lên); câu hỏi đã nằm trên
dòng trên nên còn nguyên.

## Chứng cứ người dùng

Ngày 28/11 chủ kho đã dán khoá ba lần bằng chính nhánh này, lệnh hiện câu hỏi. Ghi ở Notes của hợp đồng như chứng cứ
người dùng; nó không thay phép đo máy.

## Không làm

Đặt khoá thật hay chạy với `gh` thật (máy không cầm giá trị khoá); bảng Terminal của ứng dụng Claude; `production` và
`ENV=all` (cùng hàm hỏi); đổi chữ câu hỏi.
